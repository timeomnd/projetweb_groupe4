# -*- coding: utf-8 -*-

#Ce fichier Pyhon génère dans un fichier data_commune.sql les requêtes SQL pour insérer les données des communes, départements et régions à partir du fichier CSV.

import csv

sqlfile = open("sql/data_commune.sql", "w", encoding="utf-8")

regions_deja_inseres = set()
departements_deja_inseres = set()

with open('csv/communes-france-2024-limite.csv', newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile, delimiter=';')
    for row in reader:
        reg_code = row['reg_code']
        reg_nom = row['reg_nom'].strip().replace("'", "''")
        dep_code = row['dep_code']
        dep_nom = row['dep_nom'].strip().replace("'", "''")
        code_insee = row['code_insee']
        nom_commune = row['nom_standard'].strip().replace("'", "''")
        code_postal = row['code_postal'].strip()
        population = int(row['population']) if row['population'] else 0

        if reg_code not in regions_deja_inseres:
            sqlfile.write(f"INSERT IGNORE INTO Region (id, reg_nom) VALUES ('{reg_code}', '{reg_nom}');\n")
            regions_deja_inseres.add(reg_code)

        if dep_code not in departements_deja_inseres:
            sqlfile.write(
                f"INSERT IGNORE INTO Departement (id, dep_nom, id_Region) VALUES ('{dep_code}', '{dep_nom}', '{reg_code}');\n"
            )
            departements_deja_inseres.add(dep_code)

        sqlfile.write(
            f"INSERT IGNORE INTO Commune (id, nom_standard, code_postal, population, id_Departement) "
            f"VALUES ('{code_insee}', '{nom_commune}', '{code_postal}', {population}, '{dep_code}');\n"
        )

sqlfile.write("\n-- Fin de l'import des communes\n\n")
sqlfile.close()
print("Requêtes pour les communes, département et régions générées dans data.sql")
