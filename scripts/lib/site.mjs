// Shared helpers for the Devasya site tooling (health check + dev dashboard).
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(__dirname, '..', '..');
export const LOCAL_MIRROR = 'cdn.prod.website-files.com';

const SKIP = new Set([LOCAL_MIRROR, 'node_modules', '.git', 'scripts', '.claude']);
const ASSET_EXT_RE = /\.(?:avif|webp|png|jpe?g|gif|svg|ico|css|js|pdf|woff2?|ttf|otf|eot|mp4|webm|json)$/i;

// Discover all pages: root index.html (route "/") and every <route>/index.html.
export function findPages(dir = ROOT, base = '') {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const abs = join(dir, name);
    const st = statSync(abs);
    if (st.isDirectory()) {
      out.push(...findPages(abs, base + '/' + name));
    } else if (name === 'index.html') {
      out.push({ route: base === '' ? '/' : base, file: abs });
    } else if (name.endsWith('.html')) {
      out.push({ route: base + '/' + name.replace(/\.html$/, ''), file: abs });
    }
  }
  return out.sort((a, b) => a.route.localeCompare(b.route));
}

// Extract the mirror-relative path of every Webflow CDN asset referenced in some text.
// Handles raw (https://cdn...) and localized (/cdn...) refs, URLs glued to HTML entities
// like &quot; (og:image meta), and filenames containing parens, e.g. "wire-nails (1).jpg".
export function collectAssetRels(text) {
  const rels = new Set();
  const re = /(?:https:\/\/cdn\.prod\.website-files\.com|\/cdn\.prod\.website-files\.com)\/([^\s"'<>]+)/g;
  for (const m of text.matchAll(re)) {
    let rel = m[1].split('&')[0].split('#')[0].split('?')[0];
    while (rel.endsWith(')') && (rel.split(')').length - 1) > (rel.split('(').length - 1)) {
      rel = rel.slice(0, -1);
    }
    if (rel) rels.add(rel);
  }
  return rels;
}

function cleanLocalAssetPath(value) {
  if (!value || !value.startsWith('/')) return null;
  if (value.startsWith('//')) return null;
  const path = value.split('&')[0].split('#')[0].split('?')[0];
  if (!ASSET_EXT_RE.test(path)) return null;
  return path;
}

export function collectLocalAssetPaths(text) {
  const paths = new Set();

  for (const rel of collectAssetRels(text)) {
    paths.add(`/${LOCAL_MIRROR}/${rel}`);
  }

  const attrRe = /\b(?:href|src)=["'](\/[^"'<>\s]+)["']/g;
  for (const m of text.matchAll(attrRe)) {
    const path = cleanLocalAssetPath(m[1]);
    if (path) paths.add(path);
  }

  const srcsetRe = /\bsrcset=["']([^"']+)["']/g;
  for (const m of text.matchAll(srcsetRe)) {
    for (const part of m[1].split(',')) {
      const path = cleanLocalAssetPath(part.trim().split(/\s+/)[0]);
      if (path) paths.add(path);
    }
  }

  return paths;
}

// Check a single page's local asset references. Returns { total, missing: [rel...] }.
export function checkPageAssets(file) {
  const html = readFileSync(file, 'utf8');
  const missing = [];
  let total = 0;
  for (const path of collectLocalAssetPaths(html)) {
    total++;
    if (!existsSync(join(ROOT, ...path.replace(/^\/+/, '').split('/')))) missing.push(path);
  }
  return { total, missing };
}
