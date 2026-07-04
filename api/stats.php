<?php
/**
 * Public aggregate ratings.
 *
 * GET /api/stats.php → {"<tool>": {"count": n, "avg": x.xx}, ...}
 *
 * Only tools with >= MIN_RATINGS are included — the site renders the ratings
 * panel and aggregateRating schema exclusively from this output, enforcing the
 * display threshold decided in docs/tools-page-structure.md.
 */

declare(strict_types=1);

const MIN_RATINGS = 25;

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=3600');
header('Access-Control-Allow-Origin: https://lazytools.io');

$dbFile = __DIR__ . '/data/ratings.db';
if (!is_readable($dbFile)) {
    echo '{}';
    exit;
}

try {
    $pdo = new PDO('sqlite:' . $dbFile);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $rows = $pdo->query(
        'SELECT tool, COUNT(*) AS count, ROUND(AVG(stars), 2) AS avg
         FROM ratings GROUP BY tool HAVING COUNT(*) >= ' . MIN_RATINGS
    )->fetchAll(PDO::FETCH_ASSOC);

    $out = [];
    foreach ($rows as $r) {
        $out[$r['tool']] = ['count' => (int)$r['count'], 'avg' => (float)$r['avg']];
    }
    echo json_encode($out === [] ? new stdClass() : $out);
} catch (Throwable $e) {
    error_log('stats.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'server error']);
}
