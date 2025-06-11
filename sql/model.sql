#------------------------------------------------------------
#        Script MySQL généré avec JMerise à partir du MCD/MDP.
#------------------------------------------------------------


USE ENERGISEN;

#------------------------------------------------------------           
# Table: Marque_panneau
#------------------------------------------------------------

CREATE TABLE Marque_panneau(
        id         Int  Auto_increment  NOT NULL ,
        nom_marque Varchar (100) NOT NULL
	,CONSTRAINT Marque_panneau_PK PRIMARY KEY (id)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Modèle_panneau
#------------------------------------------------------------

CREATE TABLE Modele_panneau(
        id         Int  Auto_increment  NOT NULL ,
        nom_modele Varchar (100) NOT NULL
	,CONSTRAINT Modele_panneau_PK PRIMARY KEY (id)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Panneau
#------------------------------------------------------------

CREATE TABLE Panneau(
        id                Int  Auto_increment  NOT NULL ,
        id_Modele_panneau Int NOT NULL ,
        id_Marque_panneau Int NOT NULL
	,CONSTRAINT Panneau_PK PRIMARY KEY (id)

	,CONSTRAINT Panneau_Modele_panneau_FK FOREIGN KEY (id_Modele_panneau) REFERENCES Modele_panneau(id)
	,CONSTRAINT Panneau_Marque_panneau0_FK FOREIGN KEY (id_Marque_panneau) REFERENCES Marque_panneau(id)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Région
#------------------------------------------------------------

CREATE TABLE Region(
        id      Int NOT NULL ,
        reg_nom Varchar (100) NOT NULL
	,CONSTRAINT Region_PK PRIMARY KEY (id)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Département
#------------------------------------------------------------

CREATE TABLE Departement(
        id        Int NOT NULL ,
        dep_nom   Varchar (100) NOT NULL ,
        id_Region Int NOT NULL
	,CONSTRAINT Departement_PK PRIMARY KEY (id)

	,CONSTRAINT Departement_Region_FK FOREIGN KEY (id_Region) REFERENCES Region(id)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Commune
#------------------------------------------------------------

CREATE TABLE Commune(
        id             Varchar (100) NOT NULL ,
        nom_standard   Varchar (100) NOT NULL ,
        code_postal    Varchar (10) NOT NULL ,
        population     Int NOT NULL ,
        id_Departement Int NOT NULL
	,CONSTRAINT Commune_PK PRIMARY KEY (id)

	,CONSTRAINT Commune_Departement_FK FOREIGN KEY (id_Departement) REFERENCES Departement(id)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Localisation
#------------------------------------------------------------

CREATE TABLE Localisation(
        id         Int  Auto_increment  NOT NULL ,
        lat        Float NOT NULL ,
        lon        Float NOT NULL ,
        id_Commune Varchar (100) NOT NULL
	,CONSTRAINT Localisation_PK PRIMARY KEY (id)

	,CONSTRAINT Localisation_Commune_FK FOREIGN KEY (id_Commune) REFERENCES Commune(id)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Marque_onduleur
#------------------------------------------------------------

CREATE TABLE Marque_onduleur(
        id         Int  Auto_increment  NOT NULL ,
        nom_marque Varchar (100) NOT NULL
	,CONSTRAINT Marque_onduleur_PK PRIMARY KEY (id)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Modèle_onduleur
#------------------------------------------------------------

CREATE TABLE Modele_onduleur(
        id         Int  Auto_increment  NOT NULL ,
        nom_modele Varchar (100) NOT NULL
	,CONSTRAINT Modele_onduleur_PK PRIMARY KEY (id)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Onduleur
#------------------------------------------------------------

CREATE TABLE Onduleur(
        id                 Int  Auto_increment  NOT NULL ,
        id_Marque_onduleur Int NOT NULL ,
        id_Modele_onduleur Int NOT NULL
	,CONSTRAINT Onduleur_PK PRIMARY KEY (id)

	,CONSTRAINT Onduleur_Marque_onduleur_FK FOREIGN KEY (id_Marque_onduleur) REFERENCES Marque_onduleur(id)
	,CONSTRAINT Onduleur_Modele_onduleur0_FK FOREIGN KEY (id_Modele_onduleur) REFERENCES Modele_onduleur(id)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Installateur
#------------------------------------------------------------

CREATE TABLE Installateur(
        id               Int  Auto_increment  NOT NULL ,
        nom_installateur Varchar (100) NOT NULL
	,CONSTRAINT Installateur_PK PRIMARY KEY (id)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Installation
#------------------------------------------------------------

CREATE TABLE Installation(
        id                  Int  Auto_increment  NOT NULL ,
        mois_installation   Int NOT NULL ,
        an_installation     Int NOT NULL ,
        nb_panneaux         Int NOT NULL ,
        nb_onduleur         Int NOT NULL ,
        pente               Int NOT NULL ,
        pente_optimum       Int NOT NULL ,
        orientation         Varchar (100) NOT NULL ,
        orientation_optimum Int NOT NULL ,
        surface             Float NOT NULL ,
        production_pvgis    Int NOT NULL ,
        puissance_crete     Int NOT NULL ,
        id_Localisation     Int NOT NULL ,
        id_Panneau          Int NOT NULL ,
        id_Onduleur         Int NOT NULL ,
        id_Installateur     Int
	,CONSTRAINT Installation_PK PRIMARY KEY (id)

	,CONSTRAINT Installation_Localisation_FK FOREIGN KEY (id_Localisation) REFERENCES Localisation(id)
	,CONSTRAINT Installation_Panneau0_FK FOREIGN KEY (id_Panneau) REFERENCES Panneau(id)
	,CONSTRAINT Installation_Onduleur1_FK FOREIGN KEY (id_Onduleur) REFERENCES Onduleur(id)
	,CONSTRAINT Installation_Installateur2_FK FOREIGN KEY (id_Installateur) REFERENCES Installateur(id)
)ENGINE=InnoDB;

