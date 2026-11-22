<?php
// ADLC daily database backup. Runs from cPanel Cron (command line only), never from the web.
// Install: copy to ~/adlc-private/adlc-backup.php, then add a daily cron job:
//   /usr/local/bin/php ~/adlc-private/adlc-backup.php
// Silent when everything is fine; prints an error (so cPanel emails the account contact) when not.
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }

$private = __DIR__;                       // ~/adlc-private
$db      = $private . '/adlc.sqlite';
$dir     = $private . '/backups';
$keep    = 30;                            // days of daily copies kept

function fail(string $msg): never { fwrite(STDOUT, "ADLC backup FAILED: $msg\n"); exit(1); }

if (!is_file($db)) fail('database file not found');
if (!is_dir($dir) && !mkdir($dir, 0700, true)) fail('cannot create backups folder');
@chmod($dir, 0700);

try {
    $pdo = new PDO('sqlite:' . $db, null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_TIMEOUT => 30]);
    $pdo->exec('PRAGMA busy_timeout = 30000');

    // 1. Health check of the live database.
    $check = $pdo->query('PRAGMA integrity_check')->fetchColumn();
    if ($check !== 'ok') fail("integrity_check on live database returned: $check");

    // 2. Consistent copy, safe while the site is writing (never a plain file copy).
    $target = sprintf('%s/adlc-%s.sqlite', $dir, gmdate('Y-m-d-His'));
    $pdo->exec('VACUUM INTO ' . $pdo->quote($target));
    @chmod($target, 0600);

    // 3. Prove the copy opens and holds the same data.
    $copy = new PDO('sqlite:' . $target, null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    if ($copy->query('PRAGMA integrity_check')->fetchColumn() !== 'ok') fail('backup copy failed integrity check');
    $live = (int)$pdo->query('SELECT COUNT(*) FROM members')->fetchColumn();
    $copied = (int)$copy->query('SELECT COUNT(*) FROM members')->fetchColumn();
    if ($copied !== $live) fail("member count mismatch (live $live, backup $copied)");
    $copy = null;
} catch (Throwable $e) {
    fail($e->getMessage());
}

// 4. Keep the last $keep days.
foreach (glob($dir . '/adlc-*.sqlite') ?: [] as $f) {
    if (filemtime($f) < time() - $keep * 86400) @unlink($f);
}
file_put_contents($dir . '/last-ok.txt', gmdate('c') . " members=$live\n");
exit(0);
