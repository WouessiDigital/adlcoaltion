<?php
// ADLC shared backend code (NameHero / cPanel). Not web-reachable: public/inc/.htaccess denies all.
declare(strict_types=1);
if (!defined('ADLC')) { http_response_code(404); exit; }

// Private folder OUTSIDE the web root: /home/<cpanel-user>/adlc-private
// (this file lives in <docroot>/inc/, and the docroot sits directly in the cPanel home folder).
define('ADLC_PRIVATE', getenv('ADLC_PRIVATE') ?: dirname(__DIR__, 2) . '/adlc-private');

function adlc_config(): array {
    static $cfg = null;
    if ($cfg !== null) return $cfg;
    $file = ADLC_PRIVATE . '/config.php';
    $cfg = is_file($file) ? (require $file) : [];
    return $cfg += [
        'db_dsn'       => 'sqlite:' . ADLC_PRIVATE . '/adlc.sqlite',
        'db_user'      => null,
        'db_pass'      => null,
        'notify_to'    => '',            // ADLC inbox for new-member alerts (empty = no email)
        'mail_from'    => 'no-reply@adlcoalition.org',
        'admins'       => [],            // ['email' => password_hash(...)]
        'site_url'     => 'https://adlcoalition.org',
    ];
}

function adlc_db(): PDO {
    static $pdo = null;
    if ($pdo) return $pdo;
    $c = adlc_config();
    if (str_starts_with($c['db_dsn'], 'sqlite:') && !is_dir(ADLC_PRIVATE)) {
        mkdir(ADLC_PRIVATE, 0700, true);
    }
    $pdo = new PDO($c['db_dsn'], $c['db_user'], $c['db_pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    $sqlite = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME) === 'sqlite';
    $id = $sqlite ? 'INTEGER PRIMARY KEY AUTOINCREMENT' : 'INT AUTO_INCREMENT PRIMARY KEY';
    $txt = $sqlite ? 'TEXT' : 'VARCHAR(255)';
    $pdo->exec("CREATE TABLE IF NOT EXISTS members (
        id $id, name $txt NOT NULL, email $txt NOT NULL, message TEXT NOT NULL,
        locale VARCHAR(5) NOT NULL DEFAULT 'en', status VARCHAR(20) NOT NULL DEFAULT 'new',
        notes TEXT, created_at VARCHAR(25) NOT NULL)");
    $pdo->exec("CREATE TABLE IF NOT EXISTS rate_limits (ip_hash VARCHAR(64) NOT NULL, bucket VARCHAR(20) NOT NULL, at INT NOT NULL)");
    $pdo->exec("CREATE TABLE IF NOT EXISTS audit_log (id $id, at VARCHAR(25) NOT NULL, who $txt NOT NULL, action $txt NOT NULL, detail TEXT)");
    if ($sqlite) @chmod(substr($c['db_dsn'], 7), 0600);
    return $pdo;
}

function adlc_now(): string { return gmdate('Y-m-d H:i:s'); }

function adlc_ip_hash(): string {
    // REMOTE_ADDR only: forwarded headers can be forged by the client.
    return hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . '|adlc');
}

/** True when the caller is over the limit. Records the attempt. */
function adlc_rate_limited(string $bucket, int $max, int $window): bool {
    $db = adlc_db();
    $now = time();
    $db->prepare('DELETE FROM rate_limits WHERE at < ?')->execute([$now - 86400]);
    $q = $db->prepare('SELECT COUNT(*) FROM rate_limits WHERE ip_hash = ? AND bucket = ? AND at > ?');
    $q->execute([adlc_ip_hash(), $bucket, $now - $window]);
    if ((int)$q->fetchColumn() >= $max) return true;
    $db->prepare('INSERT INTO rate_limits (ip_hash, bucket, at) VALUES (?,?,?)')->execute([adlc_ip_hash(), $bucket, $now]);
    return false;
}

function adlc_clear_rate(string $bucket): void {
    adlc_db()->prepare('DELETE FROM rate_limits WHERE ip_hash = ? AND bucket = ?')->execute([adlc_ip_hash(), $bucket]);
}

function adlc_audit(string $who, string $action, string $detail = ''): void {
    adlc_db()->prepare('INSERT INTO audit_log (at, who, action, detail) VALUES (?,?,?,?)')
        ->execute([adlc_now(), $who, $action, mb_substr($detail, 0, 500)]);
}

function e(?string $s): string { return htmlspecialchars((string)$s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }

/** Strip CR/LF so values can never inject mail headers. */
function adlc_oneline(string $s): string { return trim(preg_replace('/[\r\n\t]+/', ' ', $s)); }
