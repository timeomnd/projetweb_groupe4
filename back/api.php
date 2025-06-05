<?php
$apiConfig = require __DIR__ . '/config/apikey.php';
$expectedKey = $apiConfig['api_key'] ?? null;

require_once('database/database.php');

// Connexion base de données
$db = dbConnect();
if (!$db) {
    header('HTTP/1.1 503 Service Unavailable'); // la connexion a échoué
    exit;
}

// Fonction pour récupérer la clé API envoyée par le client dans les headers
function getApiKeyFromHeaders() {
    $headers = getallheaders();
    return $headers['X-API-KEY'] ?? $headers['x-api-key'] ?? null;
}

// Réponse JSON
function sendJsonData($data, $code = 200) {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code($code);
    echo json_encode($data);
    exit;
}

// Vérification clé API obligatoire avant traitement
$clientKey = getApiKeyFromHeaders();
if (!$expectedKey || !$clientKey || $clientKey !== $expectedKey) {
    sendJsonData(['error' => 'Clé API invalide ou manquante'], 401);
}

$request = isset($_GET['request']) ? explode('/', trim($_GET['request'], '/')) : [];

$table = $request[0] ?? null;
$id = $request[1] ?? null;

$method = $_SERVER['REQUEST_METHOD'];

// Tables autorisées
$allowedTables = ['Commune', 'Departement', 'Region', 'Installateur', 'Installation', 'Panneau', 'Onduleur', 'Marque_onduleur', 'Marque_panneau', 'Modele_onduleur', 'Modele_panneau', 'Localisation'];

if (!$table || !in_array($table, $allowedTables)) {
    sendJsonData(['error' => 'Table non autorisée ou non spécifiée'], 403);
}

function fetchAll($db, $table) {
    // Si count=true est présent, on renvoie le nombre d'enregistrements (avec filtres possibles)
    if (isset($_GET['count']) && $_GET['count'] === 'true') {
        $where = '';
        $params = [];

        // On ajoute des clauses WHERE pour tous les autres paramètres GET
        foreach ($_GET as $key => $value) {
            if ($key !== 'count' && $key !== 'random' && $key !== 'limit') {
                $where .= ($where ? ' AND ' : 'WHERE ') . "`$key` = ?";
                $params[] = $value;
            }
        }

        $stmt = $db->prepare("SELECT COUNT(*) AS count FROM `$table` $where");
        $stmt->execute($params);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Sinon, requête classique
    $query = "SELECT * FROM `$table`";
    //requête pour randomiser le résultat de la recherche
    if (isset($_GET['random']) && $_GET['random'] === 'true') {
        $query .= " ORDER BY RAND()";
    }
    // requête pour limiter le nombre de résultats
    if (isset($_GET['limit']) && is_numeric($_GET['limit'])) {
        $query .= " LIMIT " . intval($_GET['limit']);
    }

    $stmt = $db->prepare($query);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}



function fetchOne($db, $table, $id) {
    $stmt = $db->prepare("SELECT * FROM `$table` WHERE id = ?");
    $stmt->execute([$id]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function deleteOne($db, $table, $id) {
    $stmt = $db->prepare("DELETE FROM `$table` WHERE id = ?");
    return $stmt->execute([$id]);
}

function insertOne($db, $table, $data) {
    $keys = array_keys($data);
    $fields = '`' . implode('`, `', $keys) . '`';
    $placeholders = rtrim(str_repeat('?,', count($keys)), ',');
    $values = array_values($data);
    $stmt = $db->prepare("INSERT INTO `$table` ($fields) VALUES ($placeholders)");
    return $stmt->execute($values);
}

function updateOne($db, $table, $id, $data) {
    $fields = '';
    $values = [];
    foreach ($data as $key => $value) {
        $fields .= "`$key` = ?, ";
        $values[] = $value;
    }
    $fields = rtrim($fields, ', ');
    $values[] = $id;
    $stmt = $db->prepare("UPDATE `$table` SET $fields WHERE id = ?");
    return $stmt->execute($values);
}

// Traitement de la requête
try {
    switch ($method) {
        case 'GET':

            $result = $id ? fetchOne($db, $table, $id) : fetchAll($db, $table);

            if ($result && (!is_array($result) || count($result) > 0)) {
                sendJsonData($result, 200);
            } else {
                sendJsonData(['error' => $id ? "Aucun enregistrement trouvé dans $table avec id=$id" : "Aucun enregistrement trouvé dans $table"], 404);
            }
            break;

        case 'POST':
            $data = json_decode(file_get_contents("php://input"), true);
            if (!$data || !is_array($data)) {
                sendJsonData(['error' => 'Données JSON invalides'], 400);
            }
            $success = insertOne($db, $table, $data);
            sendJsonData(['created' => $success], $success ? 201 : 400);
            break;

        case 'PATCH':
            if (!$id) sendJsonData(['error' => 'ID requis'], 400);
            $data = json_decode(file_get_contents("php://input"), true);
            if (!$data || !is_array($data)) {
                sendJsonData(['error' => 'Données JSON invalides'], 400);
            }
            $success = updateOne($db, $table, $id, $data);
            sendJsonData(['updated' => $success], $success ? 200 : 400);
            break;

        case 'DELETE':
            if (!$id) sendJsonData(['error' => 'ID requis'], 400);
            $success = deleteOne($db, $table, $id);
            sendJsonData(['deleted' => $success], $success ? 200 : 400);
            break;

        default:
            sendJsonData(['error' => 'Méthode non supportée'], 405);
    }
} catch (PDOException $e) {
    sendJsonData(['error' => 'Erreur SQL : ' . $e->getMessage()], 500);
}