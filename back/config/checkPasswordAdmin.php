<?php
header('Content-Type: application/json'); // Indique que la réponse sera du JSON

// On récupère le hash du mot de passe admin depuis le fichier de config
$passwordConfig = require __DIR__ . '/passwordAdmin.php';
$expectedHash = $passwordConfig['admin_password_hash'] ?? null;

// On récupère le mot de passe envoyé en POST (JSON)
$input = json_decode(file_get_contents('php://input'), true);
$mdp = $input['password'] ?? '';

// On vérifie si le mot de passe correspond au hash
if ($expectedHash && password_verify($mdp, $expectedHash)) {
    // Succès : le mot de passe est correct
    echo json_encode(['success' => true]);
    exit;
} else {
    // Échec : mot de passe incorrect
    echo json_encode(['success' => false]);
    exit;
}