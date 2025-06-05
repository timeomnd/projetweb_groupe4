<?
require_once('database.php');

// Database connection.
$db = dbConnect();
if (!$db) {
    header('HTTP/1.1 503 Service Unavailable');
    exit;
}

$requestMethod = $_SERVER['REQUEST_METHOD'];
$request = substr($_SERVER['PATH_INFO'], 1);
$request = explode('/', $request);
$requestRessource = array_shift($request);


// Check the id associated to the request.
$id = array_shift($request);

if ($id == '')
    $id = NULL;
$data = false;



function sendJsonData($data, $code)
{
    if ($data !== false) {
        header('Content-Type: text/plain; charset=utf-8');
        header('Cache-control: no-store, no-cache, must-revalidate');
        header('Pragma: no-cache');
        header('HTTP/1.1 200 OK');
        echo json_encode($data);
    } else {
        header('HTTP/1.1 400 Bad Request');
    }
}


?>
