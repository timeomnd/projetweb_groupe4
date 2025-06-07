# -*- coding: utf-8 -*-
import csv
import mysql.connector

#Pour le ficher data.csv, nous faisons les requêtes SQL directement avec le script Python car il est plus simple de gérér les id autoincrementés avec cursor.lastrowid
#Le faire en requêtes SQL serait plus complexe et moins lisible
# Le traitement direct avec Python est plus adapté ici, car il évite les ambigüités liées aux sous-requêtes SQL multiples et permet un meilleur contrôle de l'intégrité des données. 

# Chargement du fichier villecodeinseemap.txt
def load_ville_to_insee_map(filepath = "C:/Users/allie/OneDrive - yncréa/Documents/GitHub/projetweb_groupe4/py/villecodeinseemap.txt"):
    mapping = {}
    with open(filepath, "r", encoding="utf-8") as f:
        for line in f:
            if '=' in line:
                nom, code = line.strip().split('=', 1)
                mapping[nom.strip()] = code.strip()
    return mapping

def get_or_create_installateur(cursor, nom):
    cursor.execute("SELECT id FROM Installateur WHERE nom_installateur = %s", (nom,))
    res = cursor.fetchone()
    if res:
        return res[0]
    cursor.execute("INSERT INTO Installateur (nom_installateur) VALUES (%s)", (nom,))
    return cursor.lastrowid

def get_or_create_panneau(cursor, marque, modele):
    cursor.execute("SELECT id FROM Marque_panneau WHERE nom_marque = %s", (marque,))
    res = cursor.fetchone()
    if res:
        id_marque = res[0]
    else:
        cursor.execute("INSERT INTO Marque_panneau (nom_marque) VALUES (%s)", (marque,))
        id_marque = cursor.lastrowid

    cursor.execute("SELECT id FROM Modele_panneau WHERE nom_modele = %s", (modele,))
    res = cursor.fetchone()
    if res:
        id_modele = res[0]
    else:
        cursor.execute("INSERT INTO Modele_panneau (nom_modele) VALUES (%s)", (modele,))
        id_modele = cursor.lastrowid

    cursor.execute("INSERT INTO Panneau (id_Modele_panneau, id_Marque_panneau) VALUES (%s, %s)", (id_modele, id_marque))
    return cursor.lastrowid

def get_or_create_onduleur(cursor, marque, modele):
    cursor.execute("SELECT id FROM Marque_onduleur WHERE nom_marque = %s", (marque,))
    res = cursor.fetchone()
    if res:
        id_marque = res[0]
    else:
        cursor.execute("INSERT INTO Marque_onduleur (nom_marque) VALUES (%s)", (marque,))
        id_marque = cursor.lastrowid

    cursor.execute("SELECT id FROM Modele_onduleur WHERE nom_modele = %s", (modele,))
    res = cursor.fetchone()
    if res:
        id_modele = res[0]
    else:
        cursor.execute("INSERT INTO Modele_onduleur (nom_modele) VALUES (%s)", (modele,))
        id_modele = cursor.lastrowid

    cursor.execute("INSERT INTO Onduleur (id_Modele_onduleur, id_Marque_onduleur) VALUES (%s, %s)", (id_modele, id_marque))
    return cursor.lastrowid

def get_or_create_localisation(cursor, lat, lon, nom_commune, ville_map):
    code_insee = ville_map.get(nom_commune.strip())
    if not code_insee:
        print(f"[⚠] Commune introuvable : '{nom_commune}'")
        return None
    else:
        print(f"[✔] Commune trouvée : '{nom_commune}' avec code INSEE {code_insee}")

    cursor.execute("INSERT INTO Localisation (lat, lon, id_Commune) VALUES (%s, %s, %s)", (lat, lon, code_insee))
    return cursor.lastrowid

def insert_installation(cursor, row, id_localisation, id_panneau, id_onduleur, id_installateur):
    cursor.execute("""
        INSERT INTO Installation (
            mois_installation, an_installation, nb_panneaux, nb_onduleur,
            pente, pente_optimum, orientation, orientation_optimum,
            surface, production_pvgis, puissance_crete,
            id_Localisation, id_Panneau, id_Onduleur, id_Installateur
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        int(row["mois_installation"]), int(row["an_installation"]),
        int(row["nb_panneaux"]), int(row["nb_onduleur"]),
        int(row["pente"] or 0), int(row["pente_optimum"] or 0),
        row["orientation"].strip() or "Inconnu", int(row["orientation_optimum"] or 0),
        float(row["surface"] or 0), float(row["production_pvgis"] or 0),
        int(row["puissance_crete"] or 0),
        id_localisation, id_panneau, id_onduleur, id_installateur
    ))

# Connexion
conn = mysql.connector.connect(
    host='localhost',
    user='projetwebCIR2',
    password='isen44',
    database='ENERGISEN'
)
cursor = conn.cursor(buffered=True)

# Chargement de la map ville → code_insee
ville_map = load_ville_to_insee_map()

# Lecture CSV
with open("C:/Users/allie/OneDrive - yncréa/Documents/GitHub/projetweb_groupe4/csv/data_corrige.csv", newline='', encoding="utf-8") as csvfile:
    reader = csv.DictReader(csvfile, delimiter=',', quotechar='"')
    for row in reader:
        id_installateur = get_or_create_installateur(cursor, row["installateur"].strip())
        id_panneau = get_or_create_panneau(cursor, row["panneaux_marque"].strip(), row["panneaux_modele"].strip())
        id_onduleur = get_or_create_onduleur(cursor, row["onduleur_marque"].strip(), row["onduleur_modele"].strip())
        nom_commune = row["locality"].strip()
        id_localisation = get_or_create_localisation(
            cursor, float(row["lat"]), float(row["lon"]), nom_commune, ville_map
        )
        if id_localisation:
            insert_installation(cursor, row, id_localisation, id_panneau, id_onduleur, id_installateur)

conn.commit()
cursor.close()
conn.close()
print("✅ Données importées avec succès dans toutes les tables.")