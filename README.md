# ⚡️ ENERGISEN

Bienvenue sur **Energisen**, un projet de base de données et web Fullstack permettant de centraliser les données photovoltaïques d’installations réparties sur tout le territoire français.

## 🌍 Contexte du projet

Ce projet vise à :

- Concevoir un **modèle relationnel robuste** en MySQL (MariaDB)
- Insérer des données dans une base de donnéesà partir de fichiers CSV réels à l'aide de scripts Python.
- Créer une **interface web en PHP,JS,HTML et CSS** pour interagir avec les données de la base :
  affichage, recherche, statistique, visualisation, suppression, modification etc.

- Utiliser des pratiques professionnelles de structuration, modélisation et import de données.

---

## 🧱 Architecture de la base de données

La base `ENERGISEN` contient les tables suivantes :

- `Region`, `Departement`, `Commune`, `Localisation`
- `Installation`, `Installateur`
- `Panneau`, `Marque_panneau`, `Modele_panneau`
- `Onduleur`, `Marque_onduleur`, `Modele_onduleur`

> Chaque installation est liée à une **localisation géographique précise**, et dispose d’un matériel propre (panneau, onduleur) et d’un installateur référencé.

---

## 🗃️ Données sources

Deux fichiers CSV principaux sont utilisés :

- `communes-france-2024-limite.csv` : données INSEE sur toutes les communes françaises (code INSEE, région, département, population, etc.)
- `data_corrige.csv` (corrigé) : données techniques des installations photovoltaïques (coordonnées GPS, matériel, puissance, installateur…)

---



## 🛠️ Mise en place

Le site web est hébérgé à l'adresse IP 10.10.51.124.
La base de données utilisée est déja créée avec un jeu de test provenant des fichiers CSV, mais si vous souhaitez la recréez, voici comment faire :

Créer une base de données SQL, puis exécutez les commandes suivantes afin d'exécuter le fichier de création des tables de la BDD : model.sql et le fichier d'insertion des données : data_commune.sql pour les communes, et pour le reste des data, ce sera avec le fichier Python import_data.py

    -Sur MariaDB : CREATE DATABASE ENERGISEN; 
    -mysql -u root -p < model.sql 
    
Si vous souhaitez générér les fichiers SQL d'insertion des données : 

IMPORTANT : Vous aurez besoin de Python 3 ainsi que de l'extension sql connector pour Python

    -Rendez-vous sur le fichier import_data_commune.py et exécutez le.
    -Un fichier data_commune.sql est généré, exécutez le avec cette commande : 
        -mysql -u root -p ENERGISEN < data_commune.sql
        Cette opération est assez longue, attendez bien la fin avant de continuer

    -Rendez vous sur le fichier import_data.py, exécutez le 
    IMPORTANT : Celui-ci ne crée pas de fichier SQL, il s'occupe directement d'insérer les données dans la BDD, cela peut prendre 1 à 2min car il y a énormément de données.


Maintenant la base de données est complète, vous pouvez vous rendre sur le site web via l'adresse 10.10.51.124 dans votre navigateur. 

La partie admin du site demande un mot de passe sécurisé (hashé). Le mot de passe est "mdpadmin"

