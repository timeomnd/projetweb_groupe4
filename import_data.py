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

with open("csv/data.csv", newline='', encoding="utf-8") as csvfile:
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

        # MARQUE PANNEAU
        marque_panneau = row["panneaux_marque"].strip()
        cursor.execute("SELECT id_marque_panneau FROM Marque_panneau WHERE nom_marque = %s", (marque_panneau,))
        res = cursor.fetchone()
        if res:
            id_marque_panneau = res[0]
        else:
            cursor.execute("INSERT INTO Marque_panneau (nom_marque) VALUES (%s)", (marque_panneau,))
            id_marque_panneau = cursor.lastrowid

        # MODELE PANNEAU 
        modele_panneau = row["panneaux_modele"].strip()
        cursor.execute("SELECT id_modele_panneau FROM Modele_panneau WHERE nom_modele = %s", (modele_panneau,))
        res = cursor.fetchone()
        if res:
            id_modele_panneau = res[0]
        else:
            cursor.execute("INSERT INTO Modele_panneau (nom_modele) VALUES (%s)", (modele_panneau,))
            id_modele_panneau = cursor.lastrowid

        # Insérer dans Panneau avec lien modèle et marque
        cursor.execute(
            "INSERT INTO Panneau (id_modele_panneau, id_marque_panneau) VALUES (%s, %s)",
            (id_modele_panneau, id_marque_panneau)
        )
        id_panneau = cursor.lastrowid

        # MARQUE ONDULEUR
        marque_onduleur = row["onduleur_marque"].strip()
        cursor.execute("SELECT id_marque_onduleur FROM Marque_onduleur WHERE nom_marque = %s", (marque_onduleur,))
        res = cursor.fetchone()
        if res:
            id_marque_onduleur = res[0]
        else:
            cursor.execute("INSERT INTO Marque_onduleur (nom_marque) VALUES (%s)", (marque_onduleur,))
            id_marque_onduleur = cursor.lastrowid

        # MODELE ONDULEUR
        modele_onduleur = row["onduleur_modele"].strip()
        cursor.execute("SELECT id_modele_onduleur FROM Modele_onduleur WHERE nom_modele = %s", (modele_onduleur,))
        res = cursor.fetchone()
        if res:
            id_modele_onduleur = res[0]
        else:
            cursor.execute("INSERT INTO Modele_onduleur (nom_modele) VALUES (%s)", (modele_onduleur,))
            id_modele_onduleur = cursor.lastrowid

        # Insérer dans Onduleur avec lien modèle et marque
        cursor.execute(
            "INSERT INTO Onduleur (id_modele_onduleur, id_marque_onduleur) VALUES (%s, %s)",
            (id_modele_onduleur, id_marque_onduleur)
        )
        id_onduleur = cursor.lastrowid

        # INSTALLATION
        mois = int(row["mois_installation"])
        an = int(row["an_installation"])
        nb_panneaux = int(row["nb_panneaux"])
        nb_onduleur = int(row["nb_onduleur"])
        pente = float(row["pente"] or 0)
        pente_optimum = float(row["pente_optimum"] or 0)
        orientation = row["orientation"].strip() or "Inconnu"
        orientation_optimum = float(row["orientation_optimum"] or 0)
        surface = float(row["surface"] or 0)
        production = float(row["production_pvgis"] or 0)
        puissance = int(row["puissance_crete"] or 0)

        cursor.execute("""
            INSERT INTO Installation (
                mois_installation, an_installation, nb_panneaux, nb_onduleur,
                pente, pente_optimum, orientation, orientation_optimum,
                surface, production_pvgis, puissance_crete,
                id_panneau, id_onduleur, id_installateur
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            mois, an, nb_panneaux, nb_onduleur, pente, pente_optimum,
            orientation, orientation_optimum, surface, production, puissance,
            id_panneau, id_onduleur, id_installateur
        ))
        id_installation = cursor.lastrowid

        # LOCALISATION
        lat = float(row["lat"])
        lon = float(row["lon"])
        cursor.execute("INSERT INTO Localisation (lat, lon, id_installation) VALUES (%s, %s, %s)", (lat, lon, id_installation))

conn.commit()
cursor.close()
conn.close()

print("✅ Import de `data.csv` terminé avec succès.")
