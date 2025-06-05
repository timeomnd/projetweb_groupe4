import csv

commune_csv = "csv/communes-france-2024-limite.csv"  # à adapter si le chemin est différent
output_dict = "villecodeinseemap.txt"

ville_dict = {}

with open(commune_csv, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f, delimiter=';')
    for row in reader:
        nom = row['nom_standard'].strip()
        code_insee = row['code_insee'].strip()
        if nom and code_insee:
            ville_dict[nom] = code_insee

with open(output_dict, 'w', encoding='utf-8') as f:
    for nom, insee in ville_dict.items():
        f.write(f"{nom}={insee}\n")

print(f"✅ Fichier {output_dict} généré avec {len(ville_dict)} lignes.")
