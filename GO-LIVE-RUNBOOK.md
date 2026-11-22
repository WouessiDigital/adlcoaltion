# adlcoalition.org: go-live runbook (Docker VPS to NameHero)

Owner: Rod Fouafou (approves each gate). Operator: Claude.
Principle: at every moment, exactly one server accepts membership requests, and there is a tested way back.

## Facts checked on Nov 22, 2026
- DNS is at GoDaddy (ns37/ns38.domaincontrol.com). `adlcoalition.org` and `www` both point to the old VPS 45.43.27.80. TTL is about 600 s.
- The domain has **no MX and no SPF record**, and a DMARC policy of `p=quarantine`. Mail "from" adlcoalition.org is quarantined today unless we authorize the sender.
- NameHero server: PHP 8.3 (LiteSpeed), runs as the account user, account isolation active (other accounts' folders not visible), `REMOTE_ADDR` is the real visitor address, PHP errors are not shown to visitors.

## Gate 0: before the day (prepare, nothing changes for visitors)
1. **Create a dedicated cPanel account** `adlcoalition.org` in WHM (not an add-on domain). Enable two-factor login for it.
2. **Email Routing** (cPanel → Email Routing): set to **Remote Mail Exchanger**, so the server never swallows mail for @adlcoalition.org locally.
3. **Choose the alert inbox** (`notify_to`): a real, monitored mailbox of an ADLC person. The domain has no mailboxes.
4. **Sender authorization** (GoDaddy DNS, done the same day as the switch):
   - SPF: `TXT @ "v=spf1 a mx ip4:<NameHero server IP> ~all"` (exact value from cPanel → Email Deliverability).
   - DKIM: the `default._domainkey` TXT record shown in cPanel → Email Deliverability.
   - Keep the existing DMARC record.
5. **Lower DNS TTL** for `@` and `www` to 300 s, at least 24 h before the switch.
6. **Upload the site** (static build + PHP) to the new account. Create `~/adlc-private/config.php` (0600) with the admin emails and bcrypt hashes. Copy `deploy/adlc-backup.php` to `~/adlc-private/` (0600).
7. **Daily backup cron** (cPanel → Cron Jobs), 03:17 Toronto time:
   `/usr/local/bin/php ~/adlc-private/adlc-backup.php`
   It checks the database, makes a consistent copy (`VACUUM INTO`), verifies it, keeps 30 days and is silent unless something fails (then cPanel emails the account contact). Off-site copy: download the newest file weekly to Wouessi SharePoint (IT and R&D folder) until an automated off-site copy is set up.
8. **Test on the new account** through a temporary hostname: both languages, both calendars, the form, the admin (login, status, delete, CSV, password change), the security scan.

## Gate 1: the switch (about 30 minutes, low-traffic hour)
1. **Freeze the old form.** On the old VPS, stop accepting submissions (maintenance response from the form API), so no request can land there after the export.
2. **Final export** of members from the old SQLite database. Record the count.
3. **Import** into `~/adlc-private/adlc.sqlite` on NameHero (owned by the cPanel user, 0600). Check: same member count, three sample records match.
4. **Change DNS** at GoDaddy: `@` A record and `www` (A or CNAME) to the NameHero server IP. Add the SPF and DKIM records at the same time.
5. **Issue the certificate**: as soon as DNS resolves to NameHero, run cPanel → SSL/TLS Status → Run AutoSSL for `adlcoalition.org` and `www.adlcoalition.org`. Expect a few minutes during which some visitors see a certificate warning (the old site sent HSTS, so browsers will not fall back to HTTP). This is why the switch happens at a quiet hour with a short TTL.

## Gate 2: first checks after the switch (in this order)
1. `https://adlcoalition.org` and `https://www.adlcoalition.org`: valid certificate, 200, both languages.
2. Old links: `/?lang=fr`, `/?lang=en`, `/calendar` redirect correctly.
3. Form: one real test submission arrives in the admin; the alert email reaches the inbox (not spam). Delete the test entry.
4. Admin: login works; member count equals the export count.
5. Security headers and the scan script (`sec.sh`) pass on the production hostname.
6. Production pages do **not** carry `noindex` (only the test hostname does).
7. Search Console: submit the new `/en/` and `/fr/` pages.

## Rollback (any time in the first week)
- Point the DNS records back to 45.43.27.80. The old VPS stays on, with its form frozen, so it serves the site but takes no new members.
- Any members received on NameHero meanwhile are exported from `~/adlc-private/adlc.sqlite` before switching back, so nothing is lost.

## After one week
- Delete the old VPS data securely and cancel the VPS. Before cancelling, move the WouessiDigital GitHub credentials that live on it.
- Remove the test subdomain `adlc-test.wouessi.com` and its private folder from the wouessi.com account.
- Delete the test entries from the admin.

## Updating the site later
- Build with `npm run package` (it also regenerates the script fingerprints in the security policy).
- Upload the zip to a new folder, check it, then swap folders, instead of overwriting files one by one while visitors are on the site.
