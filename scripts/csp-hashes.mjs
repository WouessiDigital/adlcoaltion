// Post-build: allow only the exact inline scripts Next.js generated (SHA-256 hashes),
// instead of 'unsafe-inline'. Rewrites the CSP line in out/.htaccess. Run after `next build`.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

const OUT = 'out';
const hashes = new Set();
let pages = 0;
const walk = (d) => readdirSync(d).forEach((f) => {
  const p = join(d, f);
  if (statSync(p).isDirectory()) return walk(p);
  if (!p.endsWith('.html')) return;
  pages++;
  const html = readFileSync(p, 'utf8');
  // Inline <script> elements without a src attribute (any type that a browser executes).
  for (const m of html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attrs = m[1];
    if (/type=["']?(application\/(ld\+)?json|text\/template)/i.test(attrs)) continue; // data, never executed
    hashes.add(`'sha256-${createHash('sha256').update(m[2], 'utf8').digest('base64')}'`);
  }
  if (/\son[a-z]+=["']/i.test(html.replace(/<script[\s\S]*?<\/script>/gi, ''))) {
    throw new Error(`Inline event handler in ${p}: it would be blocked by the hash-only CSP. Build stopped.`);
  }
  if (/(href|src|action)=["']\s*javascript:/i.test(html)) {
    throw new Error(`javascript: URL in ${p}. Build stopped.`);
  }
});
walk(OUT);

const file = join(OUT, '.htaccess');
let src;
try { src = readFileSync(file, 'utf8'); } catch { throw new Error('out/.htaccess is missing. Build stopped.'); }
if (hashes.size === 0) throw new Error('No inline scripts found: unexpected for a Next.js export. Build stopped.');
const marker = "script-src 'self' 'unsafe-inline'";
if (!src.includes(marker)) throw new Error('CSP marker not found in out/.htaccess');
const next = src.replace(marker, `script-src 'self' ${[...hashes].sort().join(' ')}`);
const policy = (next.match(/Content-Security-Policy "([^"]+)"/) || [])[1] || '';
const scriptSrc = (policy.match(/script-src ([^;]+)/) || [])[1] || '';
if (!scriptSrc || /unsafe-inline/.test(scriptSrc)) throw new Error("script-src still allows 'unsafe-inline'. Build stopped.");
writeFileSync(file, next);
// Record the exact tested policy so the deployed header can be compared with it after upload.
writeFileSync(join(OUT, '..', 'csp-expected.txt'), policy + '\n');
console.log(`CSP: ${hashes.size} inline script hashes from ${pages} pages; 'unsafe-inline' removed from script-src.`);
