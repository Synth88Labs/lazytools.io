<?php
/**
 * LazyTools anonymous ratings endpoint.
 *
 * POST /api/rate.php  {"tool": "<slug>", "stars": 1-5}
 *
 * Privacy contract (see /privacy/): stores ONLY the tool slug, the star value
 * and a timestamp. No IP address, no cookies, no user agent, no identifiers.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'POST only']);
    exit;
}

$raw = file_get_contents('php://input');
$body = json_decode($raw === false ? '' : $raw, true);
$tool = is_array($body) && isset($body['tool']) ? (string)$body['tool'] : '';
$stars = is_array($body) && isset($body['stars']) ? (int)$body['stars'] : 0;

// Validate against the build-generated allowlist — rejects unknown slugs.
$allowlistFile = __DIR__ . '/tools-allowlist.json';
$allowlist = is_readable($allowlistFile)
    ? json_decode((string)file_get_contents($allowlistFile), true)
    : null;

if (!is_array($allowlist) || !in_array($tool, $allowlist, true) || $stars < 1 || $stars > 5) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'invalid tool or stars']);
    exit;
}

$config = require __DIR__ . '/config.php'; // gitignored; see config.sample.php

try {
    $pdo = new PDO(
        "mysql:host={$config['db_host']};dbname={$config['db_name']};charset=utf8mb4",
        $config['db_user'],
        $config['db_pass'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    $stmt = $pdo->prepare('INSERT INTO ratings (tool, stars, created_at) VALUES (?, ?, NOW())');
    $stmt->execute([$tool, $stars]);
    echo json_encode(['ok' => true]);
} catch (Throwable $e) {
    // Never leak details; log server-side only.
    error_log('rate.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'server error']);
}
