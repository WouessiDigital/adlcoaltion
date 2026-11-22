<?php
// Copy to /home/<cpanel-user>/adlc-private/config.php (OUTSIDE public_html). Never commit the real file.
return [
    // Default: SQLite file in adlc-private (no database to create). For MySQL instead:
    // 'db_dsn' => 'mysql:host=localhost;dbname=CPUSER_adlc;charset=utf8mb4', 'db_user' => '...', 'db_pass' => '...',
    'notify_to' => 'membership@adlcoalition.org',   // ADLC inbox for new-member alerts
    'mail_from' => 'no-reply@adlcoalition.org',
    // One file per environment. Production: https://adlcoalition.org (www redirects to it).
    // Test: https://adlc-test.wouessi.com. Form posts are accepted only from this exact origin.
    'site_url'  => 'https://adlcoalition.org',
    // 'extra_origins' => [],   // only if another exact origin must post the form
    // First admin login. Hash made with: php -r 'echo password_hash("THE-PASSWORD", PASSWORD_DEFAULT);'
    'admins'    => [
        'admin@example.org' => '$2y$10$REPLACE_WITH_HASH',
    ],
];
