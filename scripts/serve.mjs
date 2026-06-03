#!/usr/bin/env node
// Tiny dependency-free static server for the self-hosted Devasya site.
// Resolves Webflow-style clean URLs:  /about  ->  about/index.html
//
//   node scripts/serve.mjs            # http://localhost:5173
//   PORT=8080 node scripts/serve.mjs
//
// Dev dashboard:  http://localhost:5173/__dev
//   Lists every page with a click-through link and a live asset-integrity status,
//   so you can check all pages in one place.

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, normalize, extname } from 'node:path';
import { findPages, checkPageAssets } from './lib/site.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PORT = process.env.PORT || 5173;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.pdf': 'application/pdf',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.ico': 'image/x-icon',
};

async function resolveFile(urlPath) {
  let p = decodeURIComponent(urlPath.split('?')[0]);
  p = normalize(p).replace(/^(\.\.[/\\])+/, '');
  const abs = join(ROOT, p);

  try {
    const s = await stat(abs);
    if (s.isFile()) return abs;
    if (s.isDirectory()) {
      const idx = join(abs, 'index.html');
      if ((await stat(idx)).isFile()) return idx;
    }
  } catch { /* fall through */ }

  for (const candidate of [join(abs, 'index.html'), abs + '.html']) {
    try {
      if ((await stat(candidate)).isFile()) return candidate;
    } catch { /* next */ }
  }
  return null;
}

// ---- dev dashboard ---------------------------------------------------------
function dashboard() {
  const pages = findPages();
  let okCount = 0;
  const rows = pages
    .map(({ route, file }) => {
      const { total, missing } = checkPageAssets(file);
      const ok = missing.length === 0;
      if (ok) okCount++;
      const status = ok
        ? `<span class="ok">OK</span>`
        : `<span class="bad">${missing.length} missing</span>`;
      const detail = ok
        ? `${total} assets`
        : missing.slice(0, 4).map((m) => m.split('/').pop()).join(', ') + (missing.length > 4 ? ' …' : '');
      return `<tr class="${ok ? '' : 'row-bad'}">
        <td><a href="${route}" target="_blank">${route}</a></td>
        <td>${status}</td>
        <td class="detail">${detail}</td>
      </tr>`;
    })
    .join('\n');

  const allOk = okCount === pages.length;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Dev dashboard — Devasya site</title>
<style>
  :root { color-scheme: light dark; }
  body { font: 15px/1.5 system-ui, sans-serif; margin: 0; padding: 2rem; max-width: 900px; }
  h1 { font-size: 1.4rem; margin: 0 0 .25rem; }
  .summary { padding: .6rem 1rem; border-radius: 8px; font-weight: 600; margin: 1rem 0 1.5rem;
             background: ${allOk ? '#e7f6e7' : '#fdecec'}; color: ${allOk ? '#176117' : '#a11'}; }
  table { border-collapse: collapse; width: 100%; }
  th, td { text-align: left; padding: .5rem .6rem; border-bottom: 1px solid #8883; }
  th { font-size: .8rem; text-transform: uppercase; letter-spacing: .04em; opacity: .6; }
  a { color: #2563eb; text-decoration: none; } a:hover { text-decoration: underline; }
  .ok { color: #176117; font-weight: 600; }
  .bad { color: #c0392b; font-weight: 600; }
  .row-bad { background: #fdecec40; }
  .detail { opacity: .65; font-size: .85rem; }
  footer { margin-top: 1.5rem; opacity: .6; font-size: .85rem; }
  code { background: #8882; padding: .1rem .35rem; border-radius: 4px; }
</style></head><body>
<h1>Devasya site — dev dashboard</h1>
<div class="summary">${allOk
    ? `All ${pages.length} pages OK — every asset resolves locally.`
    : `${pages.length - okCount} of ${pages.length} pages have missing assets.`}</div>
<table>
  <thead><tr><th>Page</th><th>Status</th><th>Assets</th></tr></thead>
  <tbody>${rows}</tbody>
</table>
<footer>Click a page to open it. Re-run <code>npm run check</code> for the terminal report,
or <code>npm run sync</code> to pull the latest from Webflow. This dashboard is dev-only and
is not part of the published site.</footer>
</body></html>`;
}

const server = createServer(async (req, res) => {
  const urlPath = (req.url || '/').split('?')[0];

  if (urlPath === '/__dev' || urlPath === '/__dev/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(dashboard());
    return;
  }

  const file = await resolveFile(urlPath === '/' ? '/index.html' : urlPath);
  if (!file) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>404 Not Found</h1><p><a href="/__dev">dev dashboard</a></p>');
    console.log(`  404  ${urlPath}`);
    return;
  }
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': MIME[extname(file).toLowerCase()] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(500);
    res.end('500');
  }
});

server.listen(PORT, () => {
  console.log(`\nDevasya site running at  http://localhost:${PORT}/`);
  console.log(`Dev dashboard at         http://localhost:${PORT}/__dev`);
  console.log('Press Ctrl+C to stop.\n');
});
