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
    console.warn(`WARNING: inline event handler in ${p} (blocked by a hash-only CSP)`);
  }
});
walk(OUT);

const file = join(OUT, '.htaccess');
const src = readFileSync(file, 'utf8');
const marker = "script-src 'self' 'unsafe-inline'";
if (!src.includes(marker)) throw new Error('CSP marker not found in out/.htaccess');
const next = src.replace(marker, `script-src 'self' ${[...hashes].sort().join(' ')}`);
writeFileSync(file, next);
console.log(`CSP: ${hashes.size} inline script hashes from ${pages} pages; 'unsafe-inline' removed from script-src.`);
