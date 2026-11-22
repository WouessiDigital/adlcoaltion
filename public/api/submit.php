<?php
// POST /api/submit.php  — membership form endpoint (JSON in, JSON out).
declare(strict_types=1);
define('ADLC', true);
require __DIR__ . '/../inc/bootstrap.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');

function out(int $code, array $body): never { http_response_code($code); echo json_encode($body); exit; }

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') out(405, ['ok' => false, 'code' => 'METHOD']);
if (stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== 0) out(415, ['ok' => false, 'code' => 'JSON_ONLY']);

// Same-site only: browsers always send Origin on a POST from the form. Require it (or Referer as a
// fallback) and require it to be the configured site, not whatever Host header the request carries.
$from = $_SERVER['HTTP_ORIGIN'] ?? ($_SERVER['HTTP_REFERER'] ?? '');
$fromHost = $from !== '' ? strtolower((string)parse_url($from, PHP_URL_HOST)) : '';
if ($fromHost === '' || !hash_equals(adlc_site_host(), $fromHost)) out(403, ['ok' => false, 'code' => 'ORIGIN']);

$raw = file_get_contents('php://input', false, null, 0, 20001);
if ($raw === false || strlen($raw) > 20000) out(413, ['ok' => false, 'code' => 'TOO_LARGE']);
$in = json_decode($raw, true);
if (!is_array($in)) out(400, ['ok' => false, 'code' => 'BAD_JSON']);

// Every field must be a plain string: lists or objects are rejected, never cast.
foreach (['name', 'email', 'message', 'locale', 'website'] as $k) {
    if (isset($in[$k]) && !is_string($in[$k])) out(422, ['ok' => false, 'code' => 'INVALID', 'fields' => [$k]]);
}
// Honeypot: bots fill the hidden "website" field. Pretend success, store nothing.
if (trim($in['website'] ?? '') !== '') out(200, ['ok' => true]);
$name    = trim($in['name'] ?? '');
$email   = trim($in['email'] ?? '');
$message = trim($in['message'] ?? '');
$locale  = ($in['locale'] ?? '') === 'fr' ? 'fr' : 'en';

$errors = [];
if ($name === '' || mb_strlen($name) > 120 || !preg_match("/^[\p{L}\p{M}]+([ '’.-]+[\p{L}\p{M}]+)*\.?$/u", $name)) $errors[] = 'name';
if (mb_strlen($email) > 254 || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'email';
if ($message === '' || mb_strlen($message) > 3000) $errors[] = 'message';
if ($errors) out(422, ['ok' => false, 'code' => 'INVALID', 'fields' => $errors]);

try {
    if (adlc_rate_limited('submit', 5, 600)) out(429, ['ok' => false, 'code' => 'RATE_LIMITED']);
    adlc_db()->prepare('INSERT INTO members (name, email, message, locale, status, created_at) VALUES (?,?,?,?,?,?)')
        ->execute([$name, $email, $message, $locale, 'new', adlc_now()]);
} catch (Throwable $ex) {
    error_log('ADLC submit error: ' . $ex->getMessage());
    out(500, ['ok' => false, 'code' => 'SERVER']);
}

// Short plain-text alert to the ADLC inbox (only if configured). The member's message is NOT emailed:
// it stays in the admin, which is the authoritative record. No personal fallback address.
$cfg = adlc_config();
$fromAddr = adlc_oneline($cfg['mail_from']);
if (filter_var($cfg['notify_to'], FILTER_VALIDATE_EMAIL) && filter_var($fromAddr, FILTER_VALIDATE_EMAIL)) {
    $body = "A new membership request was received on the ADLC website.\n\n"
        . "Name: " . adlc_oneline($name) . "\n"
        . "Email: " . adlc_oneline($email) . "\n"
        . "Language: " . strtoupper($locale) . "\n\n"
        . "Read and manage it in the admin: " . rtrim($cfg['site_url'], '/') . "/admin/\n";
    $headers = "From: ADLC Website <$fromAddr>\r\n"
        . "Reply-To: " . adlc_oneline($email) . "\r\n"
        . "Content-Type: text/plain; charset=UTF-8\r\n";
    // -f sets the envelope sender to the site's own address so SPF/DMARC can align.
    $sent = mail($cfg['notify_to'], '=?UTF-8?B?' . base64_encode('New ADLC membership request') . '?=', $body, $headers, '-f' . $fromAddr);
    if (!$sent) error_log('ADLC notify: mail() returned false (request saved; see admin)');
}

out(200, ['ok' => true]);
