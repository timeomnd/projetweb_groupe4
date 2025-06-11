import csv
from ftfy import fix_text
#Ce script lit un fichier CSV, corrige les erreurs d'encodage et écrit le résultat dans un nouveau fichier CSV.

# Fichier d'origine et fichier de sortie
input_file = "csv/data.csv"
output_file = "csv/data_corrige.csv"

with open(input_file, mode='r', encoding='utf-8', newline='') as infile, \
     open(output_file, mode='w', encoding='utf-8', newline='') as outfile:

    reader = csv.reader(infile)
    writer = csv.writer(outfile)

    for row in reader:
        corrected_row = [fix_text(cell) for cell in row]
        writer.writerow(corrected_row)

print(" Fichier corrigé avec succès : data_corrige.csv")
