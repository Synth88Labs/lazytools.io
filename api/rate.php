<?php
/**
 * LazyTools anonymous ratings endpoint.
 *
 * POST /api/rate.php  {"tool": "<slug>", "stars": 1-5}
 *
 * Privacy contract (see /privacy/): stores ONLY the tool slug, the star value
 * and a timestamp. No IP address, no cookies, no user agent, no identifiers.
 *
 * Storage: SQLite file in api/data/ (blocked from the web by .htaccess) —
 * zero-configuration on shared hosting, auto-creates on first rating.
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

try {
    $dataDir = __DIR__ . '/data';
    if (!is_dir($dataDir)) {
        mkdir($dataDir, 0755, true);
    }
    $pdo = new PDO('sqlite:' . $dataDir . '/ratings.db');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec('CREATE TABLE IF NOT EXISTS ratings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tool TEXT NOT NULL,
        stars INTEGER NOT NULL,
        created_at TEXT NOT NULL
    )');
    $pdo->exec('CREATE INDEX IF NOT EXISTS idx_tool ON ratings(tool)');
    $stmt = $pdo->prepare("INSERT INTO ratings (tool, stars, created_at) VALUES (?, ?, datetime('now'))");
    $stmt->execute([$tool, $stars]);
    echo json_encode(['ok' => true]);
} catch (Throwable $e) {
    // Never leak details; log server-side only.
    error_log('rate.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'server error']);
}
