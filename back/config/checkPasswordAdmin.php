<?php
header('Content-Type: application/json');
$passwordConfig = require __DIR__ . '/passwordAdmin.php';
$expectedHash = $passwordConfig['admin_password_hash'] ?? null;

$input = json_decode(file_get_contents('php://input'), true);
$mdp = $input['password'] ?? '';

if ($expectedHash && password_verify($mdp, $expectedHash)) {
    echo json_encode(['success' => true]);
    exit;
} else {
    echo json_encode(['success' => false]);
    exit;
}


