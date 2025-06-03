# -*- coding: utf-8 -*-


import csv
import mysql.connector

# Connexion à la base
conn = mysql.connector.connect(
    host='localhost',
    user='projetwebCIR2',
    password='isen44',
    database='ENERGISEN'
)
cursor = conn.cursor()





# Garde en mémoire les régions et départements déjà insérés
regions_deja_inseres = set()
departements_deja_inseres = set()


with open('csv/communes-france-2024-limite.csv', newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile, delimiter=';')

    for row in reader:
        reg_code = row['reg_code']
        reg_nom = row['reg_nom']
        dep_code = row['dep_code']
        dep_nom = row['dep_nom']
        code_insee = row['code_insee']
        nom_commune = row['nom_standard']
        code_postal = row['code_postal']
        population = int(row['population']) if row['population'] else 0

        # 1. Insertion région
        if reg_code not in regions_deja_inseres:
            cursor.execute("""
                INSERT IGNORE INTO Region (reg_code, reg_nom)
                VALUES (%s, %s)
            """, (reg_code, reg_nom))
            regions_deja_inseres.add(reg_code)

        # 2. Insertion département
        if dep_code not in departements_deja_inseres:
            cursor.execute("""
                INSERT IGNORE INTO Departement (dep_code, dep_nom, reg_code)
                VALUES (%s, %s, %s)
            """, (dep_code, dep_nom, reg_code))
            departements_deja_inseres.add(dep_code)

        # 3. Insertion commune
        cursor.execute("""
            INSERT IGNORE INTO Commune (code_insee, nom_standard, code_postal, population, dep_code)
            VALUES (%s, %s, %s, %s, %s)
        """, (code_insee, nom_commune, code_postal, population, dep_code))

conn.commit()
cursor.close()
conn.close()
print("Import des communes terminé ✅")


