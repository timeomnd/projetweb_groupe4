# -*- coding: utf-8 -*-
import csv

# Chargement du fichier villecodeinseemap.txt
def load_ville_to_insee_map(filepath="villecodeinseemap.txt"):
    mapping = {}
    with open(filepath, "r", encoding="utf-8") as f:
        for line in f:
            if '=' in line:
                nom, code = line.strip().split('=', 1)
                mapping[nom.strip()] = code.strip()
    return mapping

# Écriture dans le fichier SQL
sql_file = open("sql/data.sql", "w", encoding="utf-8")

# Buffers de déduplication
installateurs = {}
panneaux = {}
onduleurs = {}
modele_panneaux = {}
modele_onduleurs = {}
marque_panneaux = {}
marque_onduleurs = {}
localisations = set()

def escape(val):
    return val.replace("'", "''")

def write(query, params):
    for p in params:
        if isinstance(p, str):
            query = query.replace("%s", f"'{escape(p)}'", 1)
        else:
            query = query.replace("%s", str(p), 1)
    sql_file.write(query.strip() + ";\n")

# Lecture du mapping ville → code_insee
ville_map = load_ville_to_insee_map()

# Lecture CSV
with open("csv/data_corrige.csv", newline='', encoding="utf-8") as csvfile:
    reader = csv.DictReader(csvfile, delimiter=',', quotechar='"')
    for row in reader:
        # Installateur
        nom_installateur = row["installateur"].strip()
        if nom_installateur not in installateurs:
            write("INSERT INTO Installateur (nom_installateur) VALUES (%s)", [nom_installateur])
            installateurs[nom_installateur] = True

        # Marque + Modèle panneau
        marque_p = row["panneaux_marque"].strip()
        modele_p = row["panneaux_modele"].strip()
        if marque_p not in marque_panneaux:
            write("INSERT INTO Marque_panneau (nom_marque) VALUES (%s)", [marque_p])
            marque_panneaux[marque_p] = True
        if modele_p not in modele_panneaux:
            write("INSERT INTO Modele_panneau (nom_modele) VALUES (%s)", [modele_p])
            modele_panneaux[modele_p] = True
        if (modele_p, marque_p) not in panneaux:
            write("INSERT INTO Panneau (id_modele_panneau, id_marque_panneau) VALUES ((SELECT id_modele_panneau FROM Modele_panneau WHERE nom_modele = %s), (SELECT id_marque_panneau FROM Marque_panneau WHERE nom_marque = %s))", [modele_p, marque_p])
            panneaux[(modele_p, marque_p)] = True

        # Marque + Modèle onduleur
        marque_o = row["onduleur_marque"].strip()
        modele_o = row["onduleur_modele"].strip()
        if marque_o not in marque_onduleurs:
            write("INSERT INTO Marque_onduleur (nom_marque) VALUES (%s)", [marque_o])
            marque_onduleurs[marque_o] = True
        if modele_o not in modele_onduleurs:
            write("INSERT INTO Modele_onduleur (nom_modele) VALUES (%s)", [modele_o])
            modele_onduleurs[modele_o] = True
        if (modele_o, marque_o) not in onduleurs:
            write("INSERT INTO Onduleur (id_modele_onduleur, id_marque_onduleur) VALUES ((SELECT id_modele_onduleur FROM Modele_onduleur WHERE nom_modele = %s), (SELECT id_marque_onduleur FROM Marque_onduleur WHERE nom_marque = %s))", [modele_o, marque_o])
            onduleurs[(modele_o, marque_o)] = True

        # Localisation
        lat = float(row["lat"])
        lon = float(row["lon"])
        nom_commune = row["locality"].strip()
        code_insee = ville_map.get(nom_commune)
        if not code_insee:
            continue  # commune inconnue → ignorer
        localisation_key = (lat, lon, code_insee)
        if localisation_key not in localisations:
            write("INSERT INTO Localisation (lat, lon, code_insee) VALUES (%s, %s, %s)", [lat, lon, code_insee])
            localisations.add(localisation_key)

        # Installation
        write("""
            INSERT INTO Installation (
                mois_installation, an_installation, nb_panneaux, nb_onduleur,
                pente, pente_optimum, orientation, orientation_optimum,
                surface, production_pvgis, puissance_crete,
                id_localisation, id_panneau, id_onduleur, id_installateur
            ) VALUES (
                %s, %s, %s, %s,
                %s, %s, %s, %s,
                %s, %s, %s,
                (SELECT id_localisation FROM Localisation WHERE lat = %s AND lon = %s AND code_insee = %s),
                (SELECT id_panneau FROM Panneau INNER JOIN Modele_panneau USING(id_modele_panneau) INNER JOIN Marque_panneau USING(id_marque_panneau) WHERE nom_modele = %s AND nom_marque = %s),
                (SELECT id_onduleur FROM Onduleur INNER JOIN Modele_onduleur USING(id_modele_onduleur) INNER JOIN Marque_onduleur USING(id_marque_onduleur) WHERE nom_modele = %s AND nom_marque = %s),
                (SELECT id_installateur FROM Installateur WHERE nom_installateur = %s)
            )
        """, [
            int(row["mois_installation"]), int(row["an_installation"]),
            int(row["nb_panneaux"]), int(row["nb_onduleur"]),
            int(row["pente"] or 0), int(row["pente_optimum"] or 0),
            row["orientation"].strip() or "Inconnu", int(row["orientation_optimum"] or 0),
            float(row["surface"] or 0), float(row["production_pvgis"] or 0),
            int(row["puissance_crete"] or 0),
            lat, lon, code_insee,
            modele_p, marque_p,
            modele_o, marque_o,
            nom_installateur
        ])

sql_file.close()
print("✅ Fichier data.sql généré avec succès.")
