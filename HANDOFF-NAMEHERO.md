# Handoff: rebuild adlcoalition.org for NameHero (no Docker)

Goal: same look as the live site, hosted on NameHero shared hosting (cPanel, Apache/LiteSpeed, PHP, MySQL).
Owner: Rod (Wouessi). Branch: `namehero-static`. Live production is still the Docker version (branch `feature/bilingual-en-fr`).

## Architecture
- Front end: Next.js **static export** (`output: 'export'`, `trailingSlash`, `images.unoptimized`) -> plain files in `out/`.
- Languages: `/en/` and `/fr/` (app/[lang]/...). Root `/` = `public/index.html` redirects using cookie `adlc_lang`, then browser language.
- Form: posts JSON to `/api/submit.php` (same fields as before: name, email, message, locale, website honeypot).
- Admin: PHP in `public/admin/` (to build), MySQL via PDO, config file OUTSIDE webroot (`~/adlc-config.php`).

## Done on this branch
- app/[lang]/layout.tsx (root layout per language, metadata, hreflang, OG locale), page + calendar moved under [lang]
- Removed Next server-only code: app/admin, better-auth, SQLite libs, middleware, API routes
- LocaleProvider: language switch opens the same page in the other language; `href()` helper
- Header/HomeCard/Form adapted to /en//fr/ paths and the PHP endpoint

## To do
1. `public/index.html` (root redirect) and `public/404.html` (bilingual)
2. `public/.htaccess`: force HTTPS, security headers (HSTS, nosniff, X-Frame-Options SAMEORIGIN, Referrer-Policy,
   Permissions-Policy, CSP incl. frame-src https://calendar.google.com), deny dotfiles/.sql/.md, cache static assets
3. `public/api/submit.php`: JSON only, size limit, honeypot, rate limit 5 per 10 min per IP (DB table), validation
   (name regex with Unicode letters, email, message <= 3000), prepared INSERT, escaped admin notification
   (Resend API if key in config, else PHP mail()); no personal email fallback
4. `public/admin/`: login (password_hash, session regenerate, httponly+secure+samesite=Strict cookie, 30 min idle,
   lockout after 5 failures per 15 min), dashboard (list, status new/reviewed/approved/declined, notes, delete with
   CSRF, CSV export with formula-injection guard), change password, logout, audit log, one-time setup page
   (only works when no admin exists AND config SETUP_KEY matches). All admin pages noindex + no-store.
5. `deploy/schema.sql` (MySQL: members, admins, rate_limits, audit_log), `deploy/adlc-config.sample.php`,
   `deploy/export-members-from-vps.md` (dump old SQLite members to SQL for phpMyAdmin import)
6. `.github/workflows/namehero.yml`: npm ci, npm run build, zip `out/` as an artifact
7. Test: `npm run build`, serve `out/` with `php -S localhost:8080 -t out`, check EN/FR at 390/768/1440 px vs the
   live site, run form/admin security tests (SQL injection, XSS in name/message, CSRF, brute force, rate limit)
8. Then Rod: create cPanel account for adlcoalition.org + MySQL DB on NameHero (WHM), upload, import members, switch DNS.

Rules: Wouessi Engineering and Deployment Standard; never write passwords into the repo; French copy is final
(lib/i18n/dictionaries.ts, reviewed by 4 passes); keep the old VPS running as fallback for a week after DNS switch.
