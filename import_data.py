# -*- coding: utf-8 -*-
import csv
import mysql.connector

conn = mysql.connector.connect(
    host='localhost',
    user='projetwebCIR2',
    password='isen44',
    database='ENERGISEN'
)
cursor = conn.cursor()

with open("csv/data_utf8.csv", newline='', encoding="utf-8") as csvfile:

    reader = csv.DictReader(csvfile, delimiter=',', quotechar='"')

    for row in reader:
        # INSTALLATEUR
        nom_installateur = row["installateur"].strip()
        cursor.execute("SELECT id_installateur FROM Installateur WHERE nom_installateur = %s", (nom_installateur,))
        res = cursor.fetchone()
        if res:
            id_installateur = res[0]
        else:
            cursor.execute("INSERT INTO Installateur (nom_installateur) VALUES (%s)", (nom_installateur,))
            id_installateur = cursor.lastrowid

        # PANNEAU
        marque_panneau = row["panneaux_marque"].strip()
        modele_panneau = row["panneaux_modele"].strip()
        cursor.execute("SELECT id_marque_panneau FROM Marque_panneau WHERE nom_marque = %s", (marque_panneau,))
        res = cursor.fetchone()
        if res:
            id_marque_panneau = res[0]
        else:
            cursor.execute("INSERT INTO Marque_panneau (nom_marque) VALUES (%s)", (marque_panneau,))
            id_marque_panneau = cursor.lastrowid

        cursor.execute("SELECT id_modele_panneau FROM Modele_panneau WHERE nom_modele = %s", (modele_panneau,))
        res = cursor.fetchone()
        if res:
            id_modele_panneau = res[0]
        else:
            cursor.execute("INSERT INTO Modele_panneau (nom_modele) VALUES (%s)", (modele_panneau,))
            id_modele_panneau = cursor.lastrowid

        cursor.execute("INSERT INTO Panneau (id_modele_panneau, id_marque_panneau) VALUES (%s, %s)", (id_modele_panneau, id_marque_panneau))
        id_panneau = cursor.lastrowid

        # ONDULEUR
        marque_onduleur = row["onduleur_marque"].strip()
        modele_onduleur = row["onduleur_modele"].strip()
        cursor.execute("SELECT id_marque_onduleur FROM Marque_onduleur WHERE nom_marque = %s", (marque_onduleur,))
        res = cursor.fetchone()
        if res:
            id_marque_onduleur = res[0]
        else:
            cursor.execute("INSERT INTO Marque_onduleur (nom_marque) VALUES (%s)", (marque_onduleur,))
            id_marque_onduleur = cursor.lastrowid

        cursor.execute("SELECT id_modele_onduleur FROM Modele_onduleur WHERE nom_modele = %s", (modele_onduleur,))
        res = cursor.fetchone()
        if res:
            id_modele_onduleur = res[0]
        else:
            cursor.execute("INSERT INTO Modele_onduleur (nom_modele) VALUES (%s)", (modele_onduleur,))
            id_modele_onduleur = cursor.lastrowid

        cursor.execute("INSERT INTO Onduleur (id_modele_onduleur, id_marque_onduleur) VALUES (%s, %s)", (id_modele_onduleur, id_marque_onduleur))
        id_onduleur = cursor.lastrowid

        # LOCALISATION
        lat = float(row["lat"])
        lon = float(row["lon"])
        commune_nom = row["administrative_area_level_1"]
        departement_nom = row["administrative_area_level_2"]
        code_postal = row["postal_code"]

        cursor.execute("""
            SELECT c.code_insee
            FROM Commune c
            JOIN Departement d ON c.dep_code = d.dep_code
            WHERE c.nom_standard = %s AND c.code_postal = %s AND d.dep_nom = %s
            LIMIT 1
        """, (commune_nom, code_postal, departement_nom))
        res = cursor.fetchone()

        if not res:
            print(f"[⚠] Commune introuvable → {code_postal}, {departement_nom}, {commune_nom}")
            continue
        code_insee = res[0]

        cursor.execute("""
            INSERT INTO Localisation (lat, lon, code_insee)
            VALUES (%s, %s, %s)
        """, (lat, lon, code_insee))
        id_localisation = cursor.lastrowid

        # INSTALLATION
        mois = int(row["mois_installation"])
        an = int(row["an_installation"])
        nb_panneaux = int(row["nb_panneaux"])
        nb_onduleur = int(row["nb_onduleur"])
        pente = int(row["pente"] or 0)
        pente_optimum = int(row["pente_optimum"] or 0)
        orientation = row["orientation"].strip() or "Inconnu"
        orientation_optimum = int(row["orientation_optimum"] or 0)
        surface = float(row["surface"] or 0)
        production = float(row["production_pvgis"] or 0)
        puissance = int(row["puissance_crete"] or 0)

        cursor.execute("""
            INSERT INTO Installation (
                mois_installation, an_installation, nb_panneaux, nb_onduleur,
                pente, pente_optimum, orientation, orientation_optimum,
                surface, production_pvgis, puissance_crete,
                id_localisation, id_panneau, id_onduleur, id_installateur
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            mois, an, nb_panneaux, nb_onduleur, pente, pente_optimum,
            orientation, orientation_optimum, surface, production, puissance,
            id_localisation, id_panneau, id_onduleur, id_installateur
        ))

conn.commit()
cursor.close()
conn.close()
print("✅ Données importées avec succès dans toutes les tables.")
