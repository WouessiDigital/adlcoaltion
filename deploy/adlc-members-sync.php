<?php
// ADLC member transfer between the old Docker site's database and the NameHero database.
// Command line only. Works on copies of the two SQLite files; never on a database that is accepting submissions.
//
//   php adlc-members-sync.php import   <old members.db> <new adlc.sqlite>
//       Switch day: copies every old member into the new database (status "new"). Safe to run twice.
//   php adlc-members-sync.php rollback <new adlc.sqlite> <old members.db> <cutover UTC "YYYY-MM-DD HH:MM:SS"> <report.csv>
//       Rollback: copies members received on NameHero since the cutover back into the old database,
//       and writes a CSV of their status/notes (the old site has no such columns) plus admin deletions.
//   php adlc-members-sync.php compare  <old members.db> <new adlc.sqlite>
//       Prints counts and the members present on one side only.
//
// Duplicates are detected by (lower-cased email, name, message, timestamp to the second), so re-running never doubles a record.
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }

function db(string $f, bool $mustExist = true): PDO {
    if ($mustExist && !is_file($f)) { fwrite(STDERR, "Not found: $f\n"); exit(2); }
    $p = new PDO('sqlite:' . $f, null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
    $p->exec('PRAGMA busy_timeout = 10000');
    return $p;
}
function key_of(string $email, string $name, string $msg, string $ts): string {
    return hash('sha256', strtolower(trim($email)) . "\x1f" . trim($name) . "\x1f" . trim($msg) . "\x1f" . substr(trim($ts), 0, 19));
}
function old_rows(PDO $o): array {
    return $o->query('SELECT id, name, email, message, COALESCE(datecreated, \'\') AS ts FROM members ORDER BY id')->fetchAll();
}
function new_rows(PDO $n, string $since = ''): array {
    $q = $n->prepare('SELECT id, name, email, message, locale, status, notes, created_at AS ts FROM members WHERE created_at >= ? ORDER BY id');
    $q->execute([$since]);
    return $q->fetchAll();
}

[$cmd] = array_slice($argv, 1, 1) + [''];
switch ($cmd) {
    case 'import': {
        [, , $oldF, $newF] = $argv + [null, null, '', ''];
        $o = db($oldF); $n = db($newF);
        $have = [];
        foreach (new_rows($n) as $r) $have[key_of($r['email'], $r['name'], $r['message'], $r['ts'])] = true;
        $ins = $n->prepare('INSERT INTO members (name, email, message, locale, status, notes, created_at) VALUES (?,?,?,?,?,?,?)');
        $n->exec('BEGIN IMMEDIATE');
        $added = 0; $skipped = 0;
        foreach (old_rows($o) as $r) {
            $k = key_of($r['email'], $r['name'], $r['message'], $r['ts']);
            if (isset($have[$k])) { $skipped++; continue; }
            $ins->execute([$r['name'], $r['email'], $r['message'], 'en', 'new', 'Imported from the previous website (old id ' . $r['id'] . ')', substr($r['ts'], 0, 19) ?: gmdate('Y-m-d H:i:s')]);
            $have[$k] = true; $added++;
        }
        $n->exec('COMMIT');
        $total = (int)$n->query('SELECT COUNT(*) FROM members')->fetchColumn();
        echo "Imported $added, already present $skipped. Old database: " . count(old_rows($o)) . " members. New database now: $total members.\n";
        break;
    }
    case 'rollback': {
        [, , $newF, $oldF, $since, $csv] = $argv + [null, null, '', '', '', ''];
        if (!preg_match('/^\d{4}-\d\d-\d\d \d\d:\d\d:\d\d$/', $since) || $csv === '') { fwrite(STDERR, "Usage: rollback <new> <old> \"YYYY-MM-DD HH:MM:SS\" <report.csv>\n"); exit(2); }
        $n = db($newF); $o = db($oldF);
        $have = [];
        foreach (old_rows($o) as $r) $have[key_of($r['email'], $r['name'], $r['message'], $r['ts'])] = true;
        $ins = $o->prepare('INSERT INTO members (name, email, message, datecreated) VALUES (?,?,?,?)');
        $fh = fopen($csv, 'w'); fwrite($fh, "\xEF\xBB\xBF");
        fputcsv($fh, ['Source', 'Name', 'Email', 'Language', 'Status', 'Notes', 'Received (UTC)', 'Action']);
        $o->exec('BEGIN IMMEDIATE');
        $added = 0;
        foreach (new_rows($n, $since) as $r) {
            $k = key_of($r['email'], $r['name'], $r['message'], $r['ts']);
            $act = isset($have[$k]) ? 'already in old database' : 'copied to old database';
            if (!isset($have[$k])) { $ins->execute([$r['name'], $r['email'], $r['message'], $r['ts']]); $have[$k] = true; $added++; }
            fputcsv($fh, ['NameHero', $r['name'], $r['email'], $r['locale'], $r['status'], $r['notes'], $r['ts'], $act]);
        }
        $o->exec('COMMIT');
        // Admin work done on NameHero that the old site cannot store: status changes and deletions of imported members.
        foreach ($n->query("SELECT at, who, action, detail FROM audit_log WHERE at >= " . $n->quote($since) . " AND action IN ('update','delete') ORDER BY at") as $a) {
            fputcsv($fh, ['NameHero admin log', '', '', '', '', $a['detail'], $a['at'], $a['action'] . ' by ' . $a['who']]);
        }
        fclose($fh);
        echo "Copied $added new member(s) back to the old database. Status/notes and admin actions are in $csv for re-entry.\n";
        break;
    }
    case 'compare': {
        [, , $oldF, $newF] = $argv + [null, null, '', ''];
        $o = db($oldF); $n = db($newF);
        $ok = []; foreach (old_rows($o) as $r) $ok[key_of($r['email'], $r['name'], $r['message'], $r['ts'])] = $r['email'];
        $nk = []; foreach (new_rows($n) as $r) $nk[key_of($r['email'], $r['name'], $r['message'], $r['ts'])] = $r['email'];
        echo 'Old: ' . count($ok) . '  New: ' . count($nk) . "\n";
        echo 'Only in old: ' . count(array_diff_key($ok, $nk)) . '  ' . implode(', ', array_slice(array_values(array_diff_key($ok, $nk)), 0, 10)) . "\n";
        echo 'Only in new: ' . count(array_diff_key($nk, $ok)) . '  ' . implode(', ', array_slice(array_values(array_diff_key($nk, $ok)), 0, 10)) . "\n";
        break;
    }
    default:
        fwrite(STDERR, "Commands: import | rollback | compare (see the top of this file)\n"); exit(2);
}
