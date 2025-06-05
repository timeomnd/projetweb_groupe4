<?php
include "constants.php";

// Connexion à la base de données
function dbConnect(){
    $dsn = 'mysql:dbname=' . DB_NAME . ';host=' . DB_SERVER;   
    try {
        $conn = new PDO($dsn, DB_USER, DB_PASSWORD);
    } catch (PDOException $e) {
        echo 'Connexion échouée : ' . $e->getMessage();
        return false;
    }
    return $conn;
}


?>