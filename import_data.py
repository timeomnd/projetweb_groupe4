# -*- coding: utf-8 -*-
import csv
import mysql.connector

def get_or_create_installateur(cursor, nom):
    cursor.execute("SELECT id_installateur FROM Installateur WHERE nom_installateur = %s", (nom,))
    res = cursor.fetchone()
    if res:
        return res[0]
    cursor.execute("INSERT INTO Installateur (nom_installateur) VALUES (%s)", (nom,))
    return cursor.lastrowid

def get_or_create_panneau(cursor, marque, modele):
    cursor.execute("SELECT id_marque_panneau FROM Marque_panneau WHERE nom_marque = %s", (marque,))
    res = cursor.fetchone()
    if res:
        id_marque = res[0]
    else:
        cursor.execute("INSERT INTO Marque_panneau (nom_marque) VALUES (%s)", (marque,))
        id_marque = cursor.lastrowid

    cursor.execute("SELECT id_modele_panneau FROM Modele_panneau WHERE nom_modele = %s", (modele,))
    res = cursor.fetchone()
    if res:
        id_modele = res[0]
    else:
        cursor.execute("INSERT INTO Modele_panneau (nom_modele) VALUES (%s)", (modele,))
        id_modele = cursor.lastrowid

    cursor.execute("INSERT INTO Panneau (id_modele_panneau, id_marque_panneau) VALUES (%s, %s)", (id_modele, id_marque))
    return cursor.lastrowid

def get_or_create_onduleur(cursor, marque, modele):
    cursor.execute("SELECT id_marque_onduleur FROM Marque_onduleur WHERE nom_marque = %s", (marque,))
    res = cursor.fetchone()
    if res:
        id_marque = res[0]
    else:
        cursor.execute("INSERT INTO Marque_onduleur (nom_marque) VALUES (%s)", (marque,))
        id_marque = cursor.lastrowid

    cursor.execute("SELECT id_modele_onduleur FROM Modele_onduleur WHERE nom_modele = %s", (modele,))
    res = cursor.fetchone()
    if res:
        id_modele = res[0]
    else:
        cursor.execute("INSERT INTO Modele_onduleur (nom_modele) VALUES (%s)", (modele,))
        id_modele = cursor.lastrowid

    cursor.execute("INSERT INTO Onduleur (id_modele_onduleur, id_marque_onduleur) VALUES (%s, %s)", (id_modele, id_marque))
    return cursor.lastrowid

def get_or_create_localisation(cursor, lat, lon, code_postal, dep_nom, reg_nom):
    cursor.execute("""
        SELECT c.code_insee
        FROM Commune c
        JOIN Departement d ON c.dep_code = d.dep_code
        JOIN Region r ON d.reg_code = r.reg_code
        WHERE c.code_postal = %s AND d.dep_nom = %s AND r.reg_nom = %s
    """, (code_postal, dep_nom, reg_nom))
    res = cursor.fetchone()
    if not res:
        print(f"[⚠] Commune introuvable → {code_postal}, {dep_nom}, {reg_nom}")
        return None
    code_insee = res[0]
    cursor.execute("INSERT INTO Localisation (lat, lon, code_insee) VALUES (%s, %s, %s)", (lat, lon, code_insee))
    return cursor.lastrowid

def insert_installation(cursor, row, id_localisation, id_panneau, id_onduleur, id_installateur):
    cursor.execute("""
        INSERT INTO Installation (
            mois_installation, an_installation, nb_panneaux, nb_onduleur,
            pente, pente_optimum, orientation, orientation_optimum,
            surface, production_pvgis, puissance_crete,
            id_localisation, id_panneau, id_onduleur, id_installateur
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

# Lecture CSV
with open("csv/data_corrige.csv", newline='', encoding="utf-8") as csvfile:
    reader = csv.DictReader(csvfile, delimiter=',', quotechar='"')
    for row in reader:
        id_installateur = get_or_create_installateur(cursor, row["installateur"].strip())
        id_panneau = get_or_create_panneau(cursor, row["panneaux_marque"].strip(), row["panneaux_modele"].strip())
        id_onduleur = get_or_create_onduleur(cursor, row["onduleur_marque"].strip(), row["onduleur_modele"].strip())
        id_localisation = get_or_create_localisation(
            cursor, float(row["lat"]), float(row["lon"]), row["postal_code"],
            row["administrative_area_level_2"], row["administrative_area_level_1"]
        )
        if id_localisation:
            insert_installation(cursor, row, id_localisation, id_panneau, id_onduleur, id_installateur)

conn.commit()
cursor.close()
conn.close()
print("✅ Données importées avec succès dans toutes les tables.")
