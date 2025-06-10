<?php



require_once('database/database.php');

// Connexion base de données
$db = dbConnect();
if (!$db) {
    header('HTTP/1.1 503 Service Unavailable'); // la connexion a échoué
    exit;
}

// Réponse JSON
function sendJsonData($data, $code = 200) {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code($code);
    echo json_encode($data);
    exit;
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
function getTableColumns($db, $table) {
    $stmt = $db->prepare("DESCRIBE `$table`");
    $stmt->execute();
    return array_column($stmt->fetchAll(PDO::FETCH_ASSOC), 'Field');
}

function fetchAll($db, $table) {
    // Si on veut juste le nombre d'enregistrements
    if (isset($_GET['count']) && $_GET['count'] === 'true') {
        $stmt = $db->prepare("SELECT COUNT(*) AS count FROM `$table`");
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ?: ['count' => 0];
    }

    // Requête de base
    $query = "SELECT * FROM `$table`";

    // Si random est demandé, on ajoute ORDER BY RAND()
    if (isset($_GET['random']) && $_GET['random'] === 'true') {
        $query .= " ORDER BY RAND()";
    }

    // Si limit est demandé, on l’ajoute quelle que soit la présence de random
    if (isset($_GET['limit']) && is_numeric($_GET['limit'])) {
        $query .= " LIMIT " . intval($_GET['limit']);
    }

    $stmt = $db->prepare($query);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
function fetchInstallationListYears($db) {
    $sql = "SELECT DISTINCT an_installation from Installation ORDER BY an_installation LIMIT 20;";
    $stmt = $db->prepare($sql);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_COLUMN);
}
// nombre d'installations par an , fonction spécifique car ne fonctionne que pour la table Installation qui a an_installation
function fetchAverageInstallationsPerYear($db) {
    $sql = "SELECT ROUND(AVG(nombre)) AS moyenne_installations_par_an
            FROM (
                SELECT an_installation AS annee, COUNT(*) AS nombre
                FROM Installation
                GROUP BY an_installation
            ) AS sous_requete";
    $stmt = $db->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result ?: ['moyenne_installations_par_an' => 0];
}
function fetchForMapForm($db, $departement, $an) {
    $sql = "SELECT l.lat, l.lon, c.nom_standard AS commune, i.puissance_crete, i.an_installation, i.mois_installation, i.nb_panneaux, i.nb_onduleur, i.pente, i.pente_optimum, i.surface, i.production_pvgis, i.orientation, i.orientation_optimum 
            FROM Localisation l
            JOIN Installation i ON l.id = i.id_Localisation
            JOIN Commune c ON l.id_Commune = c.id
            JOIN Departement d ON d.id = c.id_Departement
            WHERE d.dep_nom = :departement AND i.an_installation = :an";

    $stmt = $db->prepare($sql);
    $stmt->bindParam(':departement', $departement);
    $stmt->bindParam(':an', $an);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
function fetchInstallations($db, $filters = [], $page = 1, $limit = 20) {
    $offset = ($page - 1) * $limit;
    $where = [];
    $params = [];

    if (!empty($filters['marque_onduleur'])) {
        $where[] = "mo.nom_marque = :marque_onduleur";
        $params[':marque_onduleur'] = $filters['marque_onduleur'];
    }
    if (!empty($filters['marque_panneau'])) {
        $where[] = "mp.nom_marque = :marque_panneau";
        $params[':marque_panneau'] = $filters['marque_panneau'];
    }
    if (!empty($filters['departement'])) {
        $where[] = "d.dep_nom = :departement";
        $params[':departement'] = $filters['departement'];
    }

    $whereSql = $where ? "WHERE " . implode(" AND ", $where) : "";

    $sql = "SELECT 
                i.id,
                i.an_installation,
                i.mois_installation,
                i.nb_panneaux,
                i.nb_onduleur,
                i.pente,
                i.pente_optimum,
                i.orientation,
                i.orientation_optimum,
                i.surface,
                i.production_pvgis,
                i.puissance_crete,
                l.lat AS latitude,
                l.lon AS longitude,
                c.nom_standard,
                c.id AS commune_id,
                d.dep_nom AS departement,
                d.id AS departement_id,
                mp.nom_marque AS marque_panneau,
                mp.id AS id_marque_panneau,
                mpp.nom_modele AS modele_panneau,
                mo.nom_marque AS marque_onduleur,
                mo.id AS id_marque_onduleur,
                moo.nom_modele AS modele_onduleur
            FROM Installation i
            JOIN Localisation l ON i.id_Localisation = l.id
            JOIN Commune c ON l.id_Commune = c.id
            JOIN Departement d ON c.id_Departement = d.id
            JOIN Panneau p ON i.id_Panneau = p.id
            JOIN Marque_panneau mp ON p.id_Marque_panneau = mp.id
            JOIN Modele_panneau mpp ON p.id_Modele_panneau = mpp.id
            JOIN Onduleur o ON i.id_Onduleur = o.id
            JOIN Marque_onduleur mo ON o.id_Marque_onduleur = mo.id
            JOIN Modele_onduleur moo ON o.id_Modele_onduleur = moo.id
            $whereSql
            ORDER BY i.an_installation DESC, i.mois_installation DESC
            LIMIT :limit OFFSET :offset";

    $stmt = $db->prepare($sql);
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Pagination
    $countSql = "SELECT COUNT(*) FROM Installation i
        JOIN Localisation l ON i.id_Localisation = l.id
        JOIN Commune c ON l.id_Commune = c.id
        JOIN Departement d ON c.id_Departement = d.id
        JOIN Panneau p ON i.id_Panneau = p.id
        JOIN Marque_panneau mp ON p.id_Marque_panneau = mp.id
        JOIN Modele_panneau mpp ON p.id_Modele_panneau = mpp.id
        JOIN Onduleur o ON i.id_Onduleur = o.id
        JOIN Marque_onduleur mo ON o.id_Marque_onduleur = mo.id
        JOIN Modele_onduleur moo ON o.id_Modele_onduleur = moo.id
        $whereSql";
    $stmt2 = $db->prepare($countSql);
    foreach ($params as $key => $value) {
        $stmt2->bindValue($key, $value);
    }
    $stmt2->execute();
    $total = $stmt2->fetchColumn();

    return ['data' => $data, 'total' => (int)$total];
}
function fetchInstallationsPerRegion($db) {
    $sql = "
        SELECT 
        ROUND(AVG(nombre_installations)) AS moyenne_installations_par_region
        FROM (
        SELECT 
        r.reg_nom AS region,
        COUNT(i.id) AS nombre_installations
        FROM Installation i
        JOIN Localisation l ON i.id_Localisation = l.id
        JOIN Commune c ON l.id_Commune = c.id
        JOIN Departement d ON c.id_Departement = d.id
        JOIN Region r ON d.id_Region = r.id
        GROUP BY r.id, r.reg_nom
        ) AS sous_requete;

    ";
    $stmt = $db->prepare($sql);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
function fetchInstallationsPerRegionPerYear($db) {
    $sql = "
        SELECT 
        ROUND(AVG(nombre_installations)) AS moyenne_installations_globale
        FROM (
        SELECT 
            r.reg_nom AS region,
            i.an_installation,
            COUNT(i.id) AS nombre_installations
        FROM Installation i
        JOIN Localisation l ON i.id_Localisation = l.id
        JOIN Commune c ON l.id_Commune = c.id
        JOIN Departement d ON c.id_Departement = d.id
        JOIN Region r ON d.id_Region = r.id
        GROUP BY r.id, r.reg_nom, i.an_installation
        ) AS sous;";
    $stmt = $db->prepare($sql);
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
            if ($table === 'Localisation' && isset($_GET['departement']) && isset($_GET['an'])) {
                // Recherche par département et année
                $departement = $_GET['departement'];
                $an = $_GET['an'];
                $result = fetchForMapForm($db, $departement, $an);
                sendJsonData($result, 200);
                break; // on sort du switch après l'envoi de la réponse
            }
            if( $table === 'Installation' && isset($_GET['years'])) {
                // Récupération des années d'installation
                $result = fetchInstallationListYears($db);
                sendJsonData($result, 200);
                break; // on sort du switch après l'envoi de la réponse
            }
            //si installation et moyenne 
            if ($table === 'Installation' && isset($_GET['perYear']) && $_GET['perYear'] === 'true') {
                $result = fetchAverageInstallationsPerYear($db);
                sendJsonData($result, 200);
                break; // on sort du switch après l'envoi de la réponse
            }
            if ($table === 'Installation' && isset($_GET['perRegion']) && $_GET['perRegion'] === 'true') {
                $result = fetchInstallationsPerRegion($db);
                sendJsonData($result, 200);
                break; // on sort du switch après l'envoi de la réponse
            }
            if ($table === 'Installation' && isset($_GET['perRegionPerYear']) && $_GET['perRegionPerYear'] === 'true') {
                $result = fetchInstallationsPerRegionPerYear($db);
                sendJsonData($result, 200);
                break; // on sort du switch après l'envoi de la réponse
            }
            if ($table === 'Installation') {
                // Pagination
                $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
                $limit = isset($_GET['limit']) ? max(1, intval($_GET['limit'])) : 20;
                $filters = [
                    'marque_onduleur' => $_GET['marque_onduleur'] ?? null,
                    'marque_panneau' => $_GET['marque_panneau'] ?? null,
                    'departement' => $_GET['departement'] ?? null
                ];
                $result = fetchInstallations($db, $filters, $page, $limit);
                sendJsonData($result, 200);
                break;
            }

            // Sinon, on continue avec la logique classique
            $result = $id ? fetchOne($db, $table, $id) : fetchAll($db, $table);

            if (isset($_GET['count']) && $_GET['count'] === 'true') {
                sendJsonData($result, 200);
                break;
            }

            // Vérification du résultat
            if ($result && (!is_array($result) || count($result) > 0)) {
                sendJsonData($result, 200);
            } else {
                sendJsonData(
                    ['error' => $id ? "Aucun enregistrement trouvé dans $table avec id=$id" : "Aucun enregistrement trouvé dans $table"],
                    404
                );
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
