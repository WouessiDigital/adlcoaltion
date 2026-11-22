<?php
// ADLC shared backend code (NameHero / cPanel). Not web-reachable: public/inc/.htaccess denies all.
declare(strict_types=1);
if (!defined('ADLC')) { http_response_code(404); exit; }
header_remove('X-Powered-By');

function adlc_fail(string $why): never {
    error_log('ADLC config error: ' . $why);
    http_response_code(500);
    exit;
}

/**
 * Private folder OUTSIDE the web root: /home/<cpanel-user>/adlc-private.
 * On cPanel, PHP runs as the account user, so the account's home folder is the anchor.
 * No guessing from the code's own location: if the home folder is unknown, fail closed.
 */
function adlc_private_dir(): string {
    $dir = getenv('ADLC_PRIVATE') ?: '';
    if ($dir === '') {
        $home = function_exists('posix_getpwuid') ? (posix_getpwuid(posix_geteuid())['dir'] ?? '') : '';
        if ($home === '' || !is_dir($home)) adlc_fail('cannot determine the account home folder');
        $dir = rtrim($home, '/') . '/adlc-private';
    }
    if (!is_dir($dir)) {
        if (!mkdir($dir, 0700, true)) adlc_fail('cannot create private folder');
        file_put_contents($dir . '/.htaccess', "Require all denied\n");
    }
    if (is_link($dir)) adlc_fail('private folder must not be a symbolic link');
    $real = realpath($dir);
    $docroot = realpath($_SERVER['DOCUMENT_ROOT'] ?? '') ?: '';
    if ($real === false) adlc_fail('private folder missing');
    if ($docroot !== '' && ($real === $docroot || str_starts_with($real . '/', rtrim($docroot, '/') . '/'))) {
        adlc_fail('private folder is inside the public website folder');
    }
    if (function_exists('posix_geteuid') && fileowner($real) !== posix_geteuid()) adlc_fail('private folder has the wrong owner');
    @chmod($real, 0700);
    return $real;
}
define('ADLC_PRIVATE', adlc_private_dir());

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

const ADLC_SCHEMA_VERSION = 2;

function adlc_db(): PDO {
    static $pdo = null;
    if ($pdo) return $pdo;
    $c = adlc_config();
    $pdo = new PDO($c['db_dsn'], $c['db_user'], $c['db_pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::ATTR_TIMEOUT => 5,
    ]);
    $sqlite = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME) === 'sqlite';
    if ($sqlite) {
        // Wait up to 5 s for a lock instead of failing; WAL lets readers and one writer work together.
        $pdo->exec('PRAGMA busy_timeout = 5000');
        $pdo->exec('PRAGMA journal_mode = WAL');
        $pdo->exec('PRAGMA synchronous = NORMAL');
        $current = (int)$pdo->query('PRAGMA user_version')->fetchColumn();
    } else {
        $pdo->exec('CREATE TABLE IF NOT EXISTS adlc_meta (k VARCHAR(40) PRIMARY KEY, v VARCHAR(40))');
        $current = (int)($pdo->query("SELECT v FROM adlc_meta WHERE k = 'schema'")->fetchColumn() ?: 0);
    }
    if ($current < ADLC_SCHEMA_VERSION) adlc_migrate($pdo, $sqlite, $current);
    return $pdo;
}

/** Creates or upgrades tables once (not on every request). */
function adlc_migrate(PDO $pdo, bool $sqlite, int $from): void {
    $id = $sqlite ? 'INTEGER PRIMARY KEY AUTOINCREMENT' : 'INT AUTO_INCREMENT PRIMARY KEY';
    $txt = $sqlite ? 'TEXT' : 'VARCHAR(255)';
    if ($sqlite) $pdo->exec('BEGIN IMMEDIATE'); else $pdo->beginTransaction();
    try {
        $pdo->exec("CREATE TABLE IF NOT EXISTS members (
            id $id, name $txt NOT NULL, email $txt NOT NULL, message TEXT NOT NULL,
            locale VARCHAR(5) NOT NULL DEFAULT 'en', status VARCHAR(20) NOT NULL DEFAULT 'new',
            notes TEXT, created_at VARCHAR(25) NOT NULL)");
        $pdo->exec("CREATE TABLE IF NOT EXISTS rate_limits (ip_hash VARCHAR(64) NOT NULL, bucket VARCHAR(80) NOT NULL, at INT NOT NULL)");
        $pdo->exec("CREATE INDEX IF NOT EXISTS rl_lookup ON rate_limits (bucket, ip_hash, at)");
        $pdo->exec("CREATE TABLE IF NOT EXISTS audit_log (id $id, at VARCHAR(25) NOT NULL, who $txt NOT NULL, action $txt NOT NULL, detail TEXT)");
        $pdo->exec("CREATE TABLE IF NOT EXISTS admins (email VARCHAR(254) PRIMARY KEY, hash VARCHAR(255) NOT NULL, session_version INTEGER NOT NULL DEFAULT 1)");
        // v1 -> v2: session_version lets a password change sign out every other session.
        $cols = $sqlite ? array_column($pdo->query('PRAGMA table_info(admins)')->fetchAll(), 'name') : [];
        if ($sqlite && !in_array('session_version', $cols, true)) {
            $pdo->exec('ALTER TABLE admins ADD COLUMN session_version INTEGER NOT NULL DEFAULT 1');
        }
        if ($sqlite) {
            $pdo->exec('PRAGMA user_version = ' . ADLC_SCHEMA_VERSION);
            $pdo->exec('COMMIT');
        } else {
            $pdo->prepare('REPLACE INTO adlc_meta (k, v) VALUES (?, ?)')->execute(['schema', (string)ADLC_SCHEMA_VERSION]);
            $pdo->commit();
        }
    } catch (Throwable $e) {
        if ($sqlite) { try { $pdo->exec('ROLLBACK'); } catch (Throwable) {} } elseif ($pdo->inTransaction()) $pdo->rollBack();
        throw $e;
    }
    if ($sqlite) {
        $file = substr(adlc_config()['db_dsn'], 7);
        foreach (['', '-wal', '-shm'] as $sfx) if (is_file($file . $sfx)) @chmod($file . $sfx, 0600);
    }
}

function adlc_now(): string { return gmdate('Y-m-d H:i:s'); }

function adlc_ip_hash(): string {
    // REMOTE_ADDR only: forwarded headers can be forged by the client.
    return hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . '|adlc');
}

/**
 * True when the caller is over the limit; otherwise records the attempt.
 * Count + insert run in one write transaction, so parallel requests cannot slip past the limit.
 * $key defaults to the caller's IP; pass another key (e.g. an account) for per-account limits.
 */
function adlc_rate_limited(string $bucket, int $max, int $window, ?string $key = null): bool {
    $db = adlc_db();
    $key ??= adlc_ip_hash();
    $now = time();
    $sqlite = $db->getAttribute(PDO::ATTR_DRIVER_NAME) === 'sqlite';
    if ($sqlite) $db->exec('BEGIN IMMEDIATE'); else $db->beginTransaction();
    try {
        if (random_int(1, 50) === 1) $db->prepare('DELETE FROM rate_limits WHERE at < ?')->execute([$now - 86400]);
        $q = $db->prepare('SELECT COUNT(*) FROM rate_limits WHERE bucket = ? AND ip_hash = ? AND at > ?');
        $q->execute([$bucket, $key, $now - $window]);
        $limited = (int)$q->fetchColumn() >= $max;
        if (!$limited) $db->prepare('INSERT INTO rate_limits (ip_hash, bucket, at) VALUES (?,?,?)')->execute([$key, $bucket, $now]);
        if ($sqlite) $db->exec('COMMIT'); else $db->commit();
        return $limited;
    } catch (Throwable $e) {
        if ($sqlite) { try { $db->exec('ROLLBACK'); } catch (Throwable) {} } elseif ($db->inTransaction()) $db->rollBack();
        throw $e;
    }
}

function adlc_clear_rate(string $bucket, ?string $key = null): void {
    adlc_db()->prepare('DELETE FROM rate_limits WHERE ip_hash = ? AND bucket = ?')->execute([$key ?? adlc_ip_hash(), $bucket]);
}

function adlc_audit(string $who, string $action, string $detail = ''): void {
    adlc_db()->prepare('INSERT INTO audit_log (at, who, action, detail) VALUES (?,?,?,?)')
        ->execute([adlc_now(), $who, $action, mb_substr($detail, 0, 500)]);
}

function e(?string $s): string { return htmlspecialchars((string)$s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }

/** Strip CR/LF so values can never inject mail headers. */
function adlc_oneline(string $s): string { return trim(preg_replace('/[\r\n\t]+/', ' ', $s)); }

/** scheme://host[:port] in canonical form, or '' if the URL is not http(s). */
function adlc_origin_of(string $url): string {
    $p = parse_url($url);
    $scheme = strtolower($p['scheme'] ?? ''); $host = strtolower($p['host'] ?? '');
    if (!in_array($scheme, ['https', 'http'], true) || $host === '') return '';
    $port = $p['port'] ?? null;
    $default = $scheme === 'https' ? 443 : 80;
    return $scheme . '://' . $host . ($port !== null && (int)$port !== $default ? ':' . (int)$port : '');
}

/** Exact origins allowed to post the form: the configured site_url, plus any listed in 'extra_origins'. */
function adlc_allowed_origins(): array {
    $c = adlc_config();
    $list = array_merge([$c['site_url']], (array)($c['extra_origins'] ?? []));
    return array_values(array_filter(array_map('adlc_origin_of', $list)));
}
