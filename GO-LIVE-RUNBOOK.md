# adlcoalition.org: go-live runbook v2 (Docker VPS to NameHero)

Owner: Rod Fouafou (approves each gate). Operator: Claude.
Principles: (1) exactly one server accepts membership requests at any moment; (2) visitors never see a certificate error; (3) every step has a tested way back.

## Facts (re-check all of them immediately before Gate 1)
- DNS at GoDaddy (ns37/ns38.domaincontrol.com). `adlcoalition.org` and `www` point to the old VPS 45.43.27.80; TTL about 600 s.
- Domain email: **no MX, no SPF**, DMARC `p=quarantine`. Nothing sends mail as adlcoalition.org today.
- Old site database: SQLite `/data/members.db`, table `members(id, name, email, message, datecreated)`. It has no status or notes.
- NameHero: PHP 8.3 LiteSpeed, runs as the account user, account isolation active, real visitor IP in `REMOTE_ADDR`, PHP errors hidden.

## Gate 0: prepare (nothing changes for visitors)
1. **Dedicated cPanel account** `adlcoalition.org` in WHM (not an add-on domain), with two-factor login. Contact email: rod@wouessi.com (receives cron failure alerts).
2. **Email Routing**: Remote Mail Exchanger.
3. **Alert inbox** (`notify_to`): a real, monitored ADLC mailbox, chosen by Rod.
4. **Upload the release** built with `npm run package`. The build fails on its own if the public security policy still allows inline scripts, if an inline event handler or `javascript:` link appears, or if `.htaccess` is missing. Never upload the source `public/.htaccess`; only the built `out/` folder.
5. **Private folder** `~/adlc-private/` (0700): `config.php` (0600) with `site_url => 'https://adlcoalition.org'`, admin emails and bcrypt hashes, `notify_to`, `mail_from => 'no-reply@adlcoalition.org'`; `adlc-backup.php` and `adlc-members-sync.php` (0600). The test site keeps its own config with `site_url => 'https://adlc-test.wouessi.com'`.
6. **Certificate BEFORE DNS** (no visitor ever sees a warning):
   - Preferred: copy the old server's current Let's Encrypt certificate and private key for `adlcoalition.org` + `www` and install them in the new account (cPanel → SSL/TLS → Install). AutoSSL replaces it automatically once DNS points to NameHero.
   - Fallback: issue a new certificate with DNS validation (a temporary TXT record at GoDaddy), then install it the same way.
   - Treat the copied private key as a secret: transfer it directly, never by email or chat, and delete the temporary copy afterwards.
7. **Full production test before DNS**, using the real hostname pointed at NameHero only on the test machine (`curl --resolve adlcoalition.org:443:<NameHero IP>` and a hosts-file entry in the browser):
   - valid certificate for `adlcoalition.org` and `www`; `www` redirects to `adlcoalition.org`;
   - both languages and both calendars; old links `/?lang=fr`, `/?lang=en`, `/calendar`;
   - pages are indexable (no `noindex`), `hreflang` and canonical point to adlcoalition.org;
   - the deployed security policy equals `csp-expected.txt` from the build;
   - form submission from `https://adlcoalition.org` accepted, from any other origin refused;
   - admin: login, status, delete (confirmation), CSV, password change signs out other sessions;
   - security scan `sec.sh` passes.
8. **Backups** (cPanel → Cron Jobs, 03:17 Toronto time): `/usr/local/bin/php ~/adlc-private/adlc-backup.php`.
   - Controlled failure test: run it once against a missing database path and confirm the failure email reaches rod@wouessi.com.
   - Confirm `~/adlc-private/backups/last-ok.txt` advances the next morning.
   - Restore test: download the newest backup, open it, check member count and admin accounts.
   - Off-site: a copy of the newest backup goes to Wouessi SharePoint (IT and R&D) every week until an automated daily encrypted off-site copy is in place. Accepted risk until then: up to 7 days of off-site recovery gap (NameHero's own account backups still run daily).
   - Who checks: Claude, in the daily NameHero audit (last-ok date and backup count).
9. **Lower DNS TTL** for `@` and `www` to 300 s at least 24 h before Gate 1.
10. **Privacy sign-off by ADLC**: privacy notice text (already under the form in EN/FR), retention period, who may access member data, and the disclosure that data is hosted by NameHero.

## Gate 1: the switch (about 30 minutes, quiet hour)
1. **Freeze the old form**: the old server stops accepting submissions (maintenance answer from its form API). From now on, no member can land there.
2. **Final export**: copy `/data/members.db` from the old server. Record the member count.
3. **Import** on a working copy: `php adlc-members-sync.php import members.db adlc.sqlite`, then `compare` must show "Only in old: 0". Upload the result to `~/adlc-private/adlc.sqlite` (owner = cPanel user, 0600). Running the import twice adds nothing.
4. **Record the cutover time** (UTC). It is the rollback reference.
5. **DNS at GoDaddy**: `@` A and `www` to the NameHero IP. Same time, email authentication for the alert sender only:
   - SPF: `v=spf1 ip4:<NameHero sending IP> ~all` (authorize only the server that really sends; no `a`/`mx`, since the domain has no mail server);
   - DKIM: `default._domainkey` TXT from cPanel → Email Deliverability;
   - keep the existing DMARC record.
6. The certificate is already installed (Gate 0 step 6), so HTTPS works the moment DNS resolves to NameHero.

## Gate 2: first checks after the switch (in this order), with rollback triggers
1. `https://adlcoalition.org` and `https://www.adlcoalition.org` from two outside networks: valid certificate, 200, both languages. **Trigger:** certificate or 5xx errors not fixed within 15 minutes.
2. Old links redirect correctly.
3. One real test submission: appears in the admin; alert email arrives in the inbox, not spam, with SPF and DKIM "pass". Delete the test entry.
4. Admin login; member count equals the exported count.
5. `sec.sh` and the security policy check pass on the production hostname.
6. Search Console: submit `/en/` and `/fr/`.

## Rollback (first week), with no member lost
1. Freeze the NameHero form (maintenance answer from `api/submit.php`).
2. Download `~/adlc-private/adlc.sqlite` and the old server's `/data/members.db`.
3. `php adlc-members-sync.php rollback adlc.sqlite members.db "<cutover UTC>" rollback-report.csv` copies every member received on NameHero into the old database without duplicates; the CSV lists their status/notes and every admin update or deletion made on NameHero (the old site cannot store these; re-enter or keep them on file).
4. `compare` must show "Only in new: 0".
5. Upload `members.db` back to the old server, re-enable its form, point DNS back to 45.43.27.80.
6. Confirm only the old server accepts submissions.
(Rehearsed on Nov 22, 2026 with sample data: import twice = no duplicates; rollback copied the post-cutover member back and listed the admin change; final compare 0/0.)

## After one week
- **Credentials on the old VPS**: list every token and key there (including the WouessiDigital GitHub credentials), **revoke and replace** them (do not just copy them), then wipe the VPS data and cancel it.
- Remove the test subdomain `adlc-test.wouessi.com` and its private folder.
- Delete test entries from the admin.

## Updating the site later
`npm run package` → upload to a new folder → check it against the tested policy → swap folders. The private folder is outside the release, so data and settings survive every swap.

## Final acceptance checklist (sign before Gate 1)
| Test | Pass condition | Status |
|---|---|---|
| Test-site form | Authorized submission succeeds | Passed (Nov 22) |
| Wrong origin, scheme, port or lookalike host | Refused | Passed |
| Concurrency | 40 simultaneous requests never exceed the limit | Passed |
| Session revocation | Password change signs out other sessions | Passed |
| Delete confirmation | Works with and without JavaScript | Passed |
| Backup during live writes | Consistent backup, no false alarm | Passed (local) |
| Backup cron + failure alert | Alert received | Pending (needs cron approval) |
| Restore | Backup opens with members and admins | Passed (local); repeat on NameHero |
| Production certificate | Installed and valid before DNS | Pending (Gate 0) |
| Production hostname test via --resolve | All Gate 0 step 7 checks | Pending |
| Email | Alert delivered, SPF/DKIM pass | Pending (Gate 1) |
| Import | Old and new counts match, compare 0 | Pending (Gate 1) |
| Rollback rehearsal | No loss, no duplicates | Passed (sample data) |
| Public security policy | No `unsafe-inline` in script-src | Passed (test site) |
| SEO | Production indexable, test site `noindex` | Test site passed; production pending |
| Privacy | Notice, retention, access approved by ADLC | Pending (ADLC) |

## Accepted, documented trade-offs
- **Visible form labels**: the fields keep placeholders only, to match the current design exactly; screen readers get proper labels (`aria-label`), and errors are linked to their fields.
- **Admin two-factor login**: not yet; strong passwords, lockouts and session revocation in place. Decision for Rod: add before launch, or within 30 days of launch.
