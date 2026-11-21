const path = require('path');

// Security headers sent with every page. Script rules stay permissive enough for Next.js;
// these block clickjacking, MIME sniffing, plugin content and leaking full URLs to other sites.
const securityHeaders = [
  // includeSubDomains left off until every adlcoalition.org subdomain is confirmed on HTTPS.
  { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  // Restricts frames, images, fonts, network calls, plugins and forms. Scripts/styles are left to
  // Next.js defaults (a nonce-based script policy is the next step, tested in Report-Only first).
  {
    key: 'Content-Security-Policy',
    value: [
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "frame-src 'self' https://calendar.google.com",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self'",
      'upgrade-insecure-requests',
    ].join('; '),
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  turbopack: {
    root: path.join(__dirname),
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      // Admin pages and API answers must never be cached by browsers or proxies.
      { source: '/admin/:path*', headers: [{ key: 'Cache-Control', value: 'no-store' }, { key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
    ];
  },
};

module.exports = nextConfig;
