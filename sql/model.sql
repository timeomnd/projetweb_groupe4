#------------------------------------------------------------
#        Script MySQL.
#------------------------------------------------------------

USE ENERGISEN;

#------------------------------------------------------------
# Table: Marque_panneau
#------------------------------------------------------------

CREATE TABLE Marque_panneau(
        id_marque_panneau Int  Auto_increment  NOT NULL ,
        nom_marque        Varchar (100) NOT NULL
	,CONSTRAINT Marque_panneau_PK PRIMARY KEY (id_marque_panneau)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Modèle_panneau
#------------------------------------------------------------

CREATE TABLE Modele_panneau(
        id_modele_panneau Int  Auto_increment  NOT NULL ,
        nom_modele        Varchar (100) NOT NULL
	,CONSTRAINT Modele_panneau_PK PRIMARY KEY (id_modele_panneau)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Panneau
#------------------------------------------------------------

CREATE TABLE Panneau(
        id_panneau        Int  Auto_increment  NOT NULL ,
        id_modele_panneau Int NOT NULL ,
        id_marque_panneau Int NOT NULL
	,CONSTRAINT Panneau_PK PRIMARY KEY (id_panneau)

	,CONSTRAINT Panneau_Modele_panneau_FK FOREIGN KEY (id_modele_panneau) REFERENCES Modele_panneau(id_modele_panneau)
	,CONSTRAINT Panneau_Marque_panneau0_FK FOREIGN KEY (id_marque_panneau) REFERENCES Marque_panneau(id_marque_panneau)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Région
#------------------------------------------------------------

CREATE TABLE Region(
        reg_code Int NOT NULL ,
        reg_nom  Varchar (100) NOT NULL
	,CONSTRAINT Region_PK PRIMARY KEY (reg_code)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Département
#------------------------------------------------------------

CREATE TABLE Departement(
        dep_code Int NOT NULL ,
        dep_nom  Varchar (100) NOT NULL ,
        reg_code Int NOT NULL
	,CONSTRAINT Departement_PK PRIMARY KEY (dep_code)

	,CONSTRAINT Departement_Region_FK FOREIGN KEY (reg_code) REFERENCES Region(reg_code)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Commune
#------------------------------------------------------------

CREATE TABLE Commune(
        code_insee   Int NOT NULL ,
        nom_standard Varchar (100) NOT NULL ,
        code_postal  Varchar (5) NOT NULL ,
        population   Int NOT NULL ,
        dep_code     Int NOT NULL
	,CONSTRAINT Commune_PK PRIMARY KEY (code_insee)

	,CONSTRAINT Commune_Departement_FK FOREIGN KEY (dep_code) REFERENCES Departement(dep_code)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Localisation
#------------------------------------------------------------

CREATE TABLE Localisation(
        id_localisation Int  Auto_increment  NOT NULL ,
        lat             Float NOT NULL ,
        lon             Float NOT NULL ,
        code_insee      Int NOT NULL
	,CONSTRAINT Localisation_PK PRIMARY KEY (id_localisation)

	,CONSTRAINT Localisation_Commune_FK FOREIGN KEY (code_insee) REFERENCES Commune(code_insee)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Marque_onduleur
#------------------------------------------------------------

CREATE TABLE Marque_onduleur(
        id_marque_onduleur Int  Auto_increment  NOT NULL ,
        nom_marque         Varchar (100) NOT NULL
	,CONSTRAINT Marque_onduleur_PK PRIMARY KEY (id_marque_onduleur)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Modèle_onduleur
#------------------------------------------------------------

CREATE TABLE Modele_onduleur(
        id_modele_onduleur Int  Auto_increment  NOT NULL ,
        nom_modele         Varchar (100) NOT NULL
	,CONSTRAINT Modele_onduleur_PK PRIMARY KEY (id_modele_onduleur)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Onduleur
#------------------------------------------------------------

CREATE TABLE Onduleur(
        id_onduleur        Int  Auto_increment  NOT NULL ,
        id_marque_onduleur Int NOT NULL ,
        id_modele_onduleur Int NOT NULL
	,CONSTRAINT Onduleur_PK PRIMARY KEY (id_onduleur)

	,CONSTRAINT Onduleur_Marque_onduleur_FK FOREIGN KEY (id_marque_onduleur) REFERENCES Marque_onduleur(id_marque_onduleur)
	,CONSTRAINT Onduleur_Modele_onduleur0_FK FOREIGN KEY (id_modele_onduleur) REFERENCES Modele_onduleur(id_modele_onduleur)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Installateur
#------------------------------------------------------------

CREATE TABLE Installateur(
        id_installateur  Int  Auto_increment  NOT NULL ,
        nom_installateur Varchar (100) NOT NULL
	,CONSTRAINT Installateur_PK PRIMARY KEY (id_installateur)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Installation
#------------------------------------------------------------

CREATE TABLE Installation(
        id_installation     Int  Auto_increment  NOT NULL ,
        mois_installation   Int NOT NULL ,
        an_installation     Int NOT NULL ,
        nb_panneaux         Int NOT NULL ,
        nb_onduleur         Int NOT NULL ,
        pente               Int NOT NULL ,
        pente_optimum       Int NOT NULL ,
        orientation         Varchar (100) NOT NULL ,
        orientation_optimum Int NOT NULL ,
        surface             Float NOT NULL ,
        production_pvgis    Float NOT NULL ,
        puissance_crete     Int NOT NULL ,
        id_localisation     Int NOT NULL ,
        id_panneau          Int NOT NULL ,
        id_onduleur         Int NOT NULL ,
        id_installateur     Int
	,CONSTRAINT Installation_PK PRIMARY KEY (id_installation)

	,CONSTRAINT Installation_Localisation_FK FOREIGN KEY (id_localisation) REFERENCES Localisation(id_localisation)
	,CONSTRAINT Installation_Panneau0_FK FOREIGN KEY (id_panneau) REFERENCES Panneau(id_panneau)
	,CONSTRAINT Installation_Onduleur1_FK FOREIGN KEY (id_onduleur) REFERENCES Onduleur(id_onduleur)
	,CONSTRAINT Installation_Installateur2_FK FOREIGN KEY (id_installateur) REFERENCES Installateur(id_installateur)
)ENGINE=InnoDB;

