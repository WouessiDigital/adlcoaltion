<?php
// ADLC admin: login, member list, status/notes, delete, CSV export, change password, logout.
declare(strict_types=1);
define('ADLC', true);
require __DIR__ . '/../inc/bootstrap.php';

header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');
// One admin policy, identical to public/admin/.htaccess: no inline script at all.
header("Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; form-action 'self'; frame-ancestors 'none'; base-uri 'none'; object-src 'none'");
header('X-Frame-Options: DENY');

// HTTPS is read from the server itself only (forwarded headers can be forged).
$https = (($_SERVER['HTTPS'] ?? '') !== '' && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['SERVER_PORT'] ?? '') === '443');
session_name($https ? '__Host-adlc_admin' : 'adlc_admin');
session_set_cookie_params(['lifetime' => 0, 'path' => '/', 'secure' => $https, 'httponly' => true, 'samesite' => 'Strict']);
ini_set('session.use_strict_mode', '1');
ini_set('session.use_only_cookies', '1');
// Sessions live in the private folder, never in the server's shared temp folders.
$sessDir = ADLC_PRIVATE . '/sessions';
if (!is_dir($sessDir)) mkdir($sessDir, 0700, true);
session_save_path($sessDir);
ini_set('session.gc_maxlifetime', '1800');
ini_set('session.gc_probability', '1');
ini_set('session.gc_divisor', '50');
session_start();

$db = adlc_db();
// First run: seed admins from the private config file.
if ((int)$db->query('SELECT COUNT(*) FROM admins')->fetchColumn() === 0) {
    foreach (adlc_config()['admins'] as $em => $hash) {
        $db->prepare('INSERT INTO admins (email, hash) VALUES (?,?)')->execute([strtolower($em), $hash]);
    }
}

const IDLE = 1800; // 30 minutes
$me = $_SESSION['admin'] ?? null;
if ($me) {
    // Still an admin, same session version (a password change bumps it), and not idle too long.
    $q = $db->prepare('SELECT session_version FROM admins WHERE email = ?'); $q->execute([$me]);
    $sv = $q->fetchColumn();
    if ($sv === false || (int)$sv !== (int)($_SESSION['sv'] ?? -1) || (time() - ($_SESSION['seen'] ?? 0)) > IDLE) {
        $_SESSION = []; session_regenerate_id(true); $me = null;
    }
}
if ($me) $_SESSION['seen'] = time();
if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
$csrf = $_SESSION['csrf'];
$action = $_POST['action'] ?? $_GET['action'] ?? '';
$flash = '';

function check_csrf(): void {
    if (!hash_equals($_SESSION['csrf'] ?? '', (string)($_POST['csrf'] ?? ''))) { http_response_code(403); exit('Invalid request. Reload the page and try again.'); }
}

// ---- Login ----
if (!$me) {
    $err = '';
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'login') {
        check_csrf();
        $em = strtolower(trim((string)($_POST['email'] ?? '')));
        $acct = hash('sha256', 'acct|' . $em);
        // Two limits: 5 tries per 15 min from one address, and 10 per 15 min against one account
        // from anywhere (slows attacks spread over many addresses).
        // Both counters are always updated (no short-circuit), then combined.
        $ipLimited = adlc_rate_limited('login', 5, 900);
        $acctLimited = adlc_rate_limited('login_acct', 10, 900, $acct);
        if ($ipLimited || $acctLimited) {
            adlc_audit($em ?: '(blank)', 'login_blocked');
            $err = 'Too many attempts. Wait 15 minutes and try again.';
        } else {
            $q = $db->prepare('SELECT hash, session_version FROM admins WHERE email = ?'); $q->execute([$em]);
            $row = $q->fetch() ?: null;
            $hash = $row['hash'] ?? false;
            // Verify against a dummy hash when the user is unknown, so timing reveals nothing.
            $ok = password_verify((string)($_POST['password'] ?? ''), $hash ?: '$2y$10$eJ9jg4L1Li.VAGEtmJaW5.l9etQGcB2bPWOmAs0fvAwZgU2u1FYee');
            if ($ok && $hash) {
                session_regenerate_id(true);
                $_SESSION['admin'] = $em; $_SESSION['sv'] = (int)$row['session_version'];
                $_SESSION['seen'] = time(); $_SESSION['csrf'] = bin2hex(random_bytes(32));
                adlc_clear_rate('login'); adlc_clear_rate('login_acct', $acct); adlc_audit($em, 'login');
                header('Location: ./'); exit;
            }
            adlc_audit($em ?: '(blank)', 'login_failed');
            $err = 'Wrong email or password.';
        }
    }
    page_head('ADLC Admin: sign in'); ?>
    <main class="card narrow">
      <img src="/LOGO.png" alt="ADLC" class="logo">
      <h1>Admin sign in</h1>
      <?php if ($err): ?><p class="err"><?= e($err) ?></p><?php endif; ?>
      <form method="post" autocomplete="on">
        <input type="hidden" name="csrf" value="<?= e($csrf) ?>"><input type="hidden" name="action" value="login">
        <label>Email<input type="email" name="email" required autofocus></label>
        <label>Password<input type="password" name="password" required></label>
        <button>Sign in</button>
      </form>
    </main>
    <?php page_foot(); exit;
}

// ---- Signed-in actions ----
$statuses = ['new' => 'New', 'reviewed' => 'Reviewed', 'approved' => 'Approved', 'declined' => 'Declined'];

if ($action === 'logout' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    check_csrf(); adlc_audit($me, 'logout'); $_SESSION = []; session_destroy(); header('Location: ./'); exit;
}
if ($action === 'update' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    check_csrf();
    $id = (int)($_POST['id'] ?? 0); $st = (string)($_POST['status'] ?? '');
    if (isset($statuses[$st])) {
        $db->prepare('UPDATE members SET status = ?, notes = ? WHERE id = ?')->execute([$st, mb_substr((string)($_POST['notes'] ?? ''), 0, 2000), $id]);
        adlc_audit($me, 'update', "member $id -> $st"); $flash = 'Saved.';
    }
}
if ($action === 'delete' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    check_csrf();
    $id = (int)($_POST['id'] ?? 0);
    if (($_POST['confirmed'] ?? '') !== '1') {
        // Server-side confirmation: works even when JavaScript is off.
        $q = $db->prepare('SELECT name, email FROM members WHERE id = ?'); $q->execute([$id]); $m = $q->fetch();
        if (!$m) { header('Location: ./'); exit; }
        page_head('Confirm deletion'); ?>
        <main class="card narrow">
          <h1>Delete this request permanently?</h1>
          <p><strong><?= e($m['name']) ?></strong><br><?= e($m['email']) ?></p>
          <p>This cannot be undone.</p>
          <form method="post" class="row" style="justify-content:center">
            <input type="hidden" name="csrf" value="<?= e($csrf) ?>"><input type="hidden" name="id" value="<?= $id ?>">
            <input type="hidden" name="confirmed" value="1">
            <button name="action" value="delete" class="danger">Yes, delete</button>
            <a href="./" class="cancel">Cancel</a>
          </form>
        </main>
        <?php page_foot(); exit;
    }
    $db->prepare('DELETE FROM members WHERE id = ?')->execute([$id]);
    adlc_audit($me, 'delete', "member $id"); $flash = 'Deleted.';
}
if ($action === 'password' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    check_csrf();
    $q = $db->prepare('SELECT hash FROM admins WHERE email = ?'); $q->execute([$me]);
    $new = (string)($_POST['new'] ?? '');
    // Limited per admin account (so colleagues on the same network are not affected), with a looser per-address cap.
    $pwAcct = adlc_rate_limited('pw_change_acct', 5, 900, hash('sha256', 'pw|' . $me));
    $pwIp = adlc_rate_limited('pw_change', 20, 900);
    if ($pwAcct || $pwIp) $flash = 'Too many attempts. Wait 15 minutes and try again.';
    elseif (!password_verify((string)($_POST['current'] ?? ''), (string)$q->fetchColumn())) { $flash = 'Current password is wrong.'; adlc_audit($me, 'password_change_failed'); }
    elseif (strlen($new) < 12) $flash = 'New password must be at least 12 characters.';
    else {
        // Bumping session_version signs out every other session of this admin.
        $db->prepare('UPDATE admins SET hash = ?, session_version = session_version + 1 WHERE email = ?')->execute([password_hash($new, PASSWORD_DEFAULT), $me]);
        $q = $db->prepare('SELECT session_version FROM admins WHERE email = ?'); $q->execute([$me]);
        $_SESSION['sv'] = (int)$q->fetchColumn();
        session_regenerate_id(true); adlc_audit($me, 'password_changed'); $flash = 'Password changed. Other sessions were signed out.';
    }
}
if ($action === 'csv' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    check_csrf(); adlc_audit($me, 'csv_export');
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="adlc-members-' . gmdate('Y-m-d') . '.csv"');
    $f = fopen('php://output', 'w'); fwrite($f, "\xEF\xBB\xBF");
    fputcsv($f, ['ID', 'Name', 'Email', 'Message', 'Language', 'Status', 'Notes', 'Received (UTC)']);
    foreach ($db->query('SELECT * FROM members ORDER BY id DESC') as $r) {
        // Guard against spreadsheet formula injection.
        $row = array_map('csv_safe',
            [$r['id'], $r['name'], $r['email'], $r['message'], $r['locale'], $r['status'], $r['notes'], $r['created_at']]);
        fputcsv($f, $row);
    }
    exit;
}

$filter = $_GET['status'] ?? '';
if ($filter !== '' && isset($statuses[$filter])) {
    $q = $db->prepare('SELECT * FROM members WHERE status = ? ORDER BY id DESC'); $q->execute([$filter]);
} else { $filter = ''; $q = $db->query('SELECT * FROM members ORDER BY id DESC'); }
$rows = $q->fetchAll();
$counts = []; foreach ($db->query('SELECT status, COUNT(*) c FROM members GROUP BY status') as $c) $counts[$c['status']] = (int)$c['c'];

page_head('ADLC Admin'); ?>
<header class="bar">
  <img src="/logo-icon.png" alt="" class="mini"> <strong>ADLC Admin</strong>
  <span class="who"><?= e($me) ?></span>
  <form method="post" class="inline"><input type="hidden" name="csrf" value="<?= e($csrf) ?>"><button name="action" value="csv" class="ghost">Export CSV</button><button name="action" value="logout" class="ghost">Sign out</button></form>
</header>
<main>
  <?php if ($flash): ?><p class="flash"><?= e($flash) ?></p><?php endif; ?>
  <nav class="tabs">
    <a href="./" class="<?= $filter === '' ? 'on' : '' ?>">All (<?= array_sum($counts) ?>)</a>
    <?php foreach ($statuses as $k => $label): ?><a href="?status=<?= $k ?>" class="<?= $filter === $k ? 'on' : '' ?>"><?= $label ?> (<?= $counts[$k] ?? 0 ?>)</a><?php endforeach; ?>
  </nav>
  <?php if (!$rows): ?><p class="card">No membership requests yet.</p><?php endif; ?>
  <?php foreach ($rows as $r): ?>
  <article class="card member">
    <div class="top"><h2><?= e($r['name']) ?></h2><span class="pill <?= e($r['status']) ?>"><?= e($statuses[$r['status']] ?? $r['status']) ?></span></div>
    <p class="meta"><a href="mailto:<?= e($r['email']) ?>"><?= e($r['email']) ?></a> · <?= strtoupper(e($r['locale'])) ?> · <?= e($r['created_at']) ?> UTC</p>
    <p class="msg"><?= nl2br(e($r['message'])) ?></p>
    <form method="post" class="row">
      <input type="hidden" name="csrf" value="<?= e($csrf) ?>"><input type="hidden" name="id" value="<?= (int)$r['id'] ?>">
      <select name="status"><?php foreach ($statuses as $k => $label): ?><option value="<?= $k ?>" <?= $r['status'] === $k ? 'selected' : '' ?>><?= $label ?></option><?php endforeach; ?></select>
      <input name="notes" placeholder="Internal notes" value="<?= e($r['notes']) ?>">
      <button name="action" value="update">Save</button>
      <input type="hidden" name="confirmed" value="0">
      <button name="action" value="delete" class="danger" data-confirm="Delete this request permanently?">Delete</button>
    </form>
  </article>
  <?php endforeach; ?>
  <details class="card"><summary>Change my password</summary>
    <form method="post"><input type="hidden" name="csrf" value="<?= e($csrf) ?>"><input type="hidden" name="action" value="password">
      <label>Current password<input type="password" name="current" required></label>
      <label>New password (12+ characters)<input type="password" name="new" minlength="12" required></label>
      <button>Change password</button></form>
  </details>
</main>
<?php page_foot();

function page_head(string $title): void { ?><!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow">
<title><?= e($title) ?></title><link rel="icon" href="/favicon.ico">
<style>
:root{--o:#FF7300;--y:#facc15;--ink:#1f2937}*{box-sizing:border-box}body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#f6f6f4;color:var(--ink)}
main{max-width:980px;margin:24px auto;padding:0 16px}.card{background:#fff;border-radius:14px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,.08);margin-bottom:14px}
.narrow{max-width:400px;margin:10vh auto;text-align:center}.logo{max-width:180px;margin-bottom:8px}label{display:block;text-align:left;margin:12px 0;font-size:14px}
input,select{width:100%;padding:10px;border:1px solid #d1d5db;border-radius:8px;font-size:15px;margin-top:4px}button{background:var(--o);color:#fff;border:0;border-radius:999px;padding:10px 18px;font-weight:600;cursor:pointer}
button:hover{background:var(--y);color:var(--ink)}.ghost{background:transparent;color:#fff;border:1px solid #fff}.danger{background:#b91c1c}
.bar{background:var(--ink);color:#fff;display:flex;align-items:center;gap:10px;padding:10px 16px;flex-wrap:wrap}.mini{height:28px}.who{margin-left:auto;opacity:.8;font-size:14px}.inline{display:flex;gap:6px}
.tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}.tabs a{padding:6px 12px;border-radius:999px;background:#fff;color:var(--ink);text-decoration:none;font-size:14px}.tabs a.on{background:var(--o);color:#fff}
.top{display:flex;justify-content:space-between;align-items:center;gap:8px}h2{margin:0;font-size:18px}.meta{color:#6b7280;font-size:13px}.msg{white-space:normal;line-height:1.5}
.row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.row select{width:auto}.row input{flex:1;min-width:160px;margin:0}
.pill{font-size:12px;padding:3px 10px;border-radius:999px;background:#e5e7eb}.pill.new{background:#fef3c7}.pill.approved{background:#dcfce7}.pill.declined{background:#fee2e2}
.cancel{padding:10px 18px;color:var(--ink)}.err{color:#b91c1c}.flash{background:#ecfdf5;border:1px solid #10b981;padding:10px;border-radius:8px}
</style></head><body>
<?php }
function page_foot(): void { echo '<script src="/admin/admin.js"></script></body></html>'; }

/** Spreadsheet-safe cell: neutralise formulas even after leading spaces or control characters. */
function csv_safe($v): string {
    $v = (string)$v;
    return preg_match('/^[\x00-\x20]*[=+\-@|%]/', $v) ? "'" . $v : $v;
}
