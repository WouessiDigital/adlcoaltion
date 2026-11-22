const path = require('path');

/** @type {import('next').NextConfig} */
// Static export for shared hosting (NameHero cPanel): plain HTML/CSS/JS in ./out.
// Security headers, HTTPS redirect and caching live in public/.htaccess (Apache/LiteSpeed).
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  turbopack: {
    root: path.join(__dirname),
  },
};

module.exports = nextConfig;
