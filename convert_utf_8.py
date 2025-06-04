# convert_to_utf8.py

import shutil

input_file = "csv/data.csv"                # ton fichier d'origine (avec accents buggés)
output_file = "csv/data_utf8.csv"          # nouveau fichier encodé en UTF-8

# encodage d'origine probable : ISO-8859-1 (ou cp1252 selon Windows)
original_encoding = "cp1252"

with open(input_file, "r", encoding=original_encoding, errors="replace") as source:
    with open(output_file, "w", encoding="utf-8") as target:
        shutil.copyfileobj(source, target)

print(f"✅ Conversion terminée → {output_file} (UTF-8 propre avec accents)")
