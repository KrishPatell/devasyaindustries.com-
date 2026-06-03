#!/usr/bin/env node
// One-time / re-runnable sync of the full Devasya site from Webflow into this repo.
//
// What it does:
//   1. Downloads every page (the 22 routes linked from the home nav) from the Webflow
//      staging domain into  <route>/index.html  (home stays as ./index.html).
//   2. Scans every page (+ the shared CSS) for Webflow CDN assets and downloads any that
//      are missing into the local  cdn.prod.website-files.com/  mirror.
//   3. Rewrites all pages and the CSS so Webflow CDN URLs point at the local mirror
//      (root-relative), making the site self-hosted / independent of Webflow's servers.
//
// Re-run any time to pull fresh content from Webflow.  No dependencies (Node 18+ fetch).
//
//   node scripts/sync-site.mjs

import { writeFile, readFile, mkdir, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const STAGING = 'https://devasyagroup.webflow.io';
const CDN = 'https://cdn.prod.website-files.com/';
const CDN_DIR = 'cdn.prod.website-files.com';

// Routes linked from the home page nav. "/" is kept as the existing root index.html.
const ROUTES = [
  '/about',
  '/contact',
  '/rolling-mill',
  '/bars/flats-bar',
  '/bars/hexagons-bar',
  '/bars/profiles-bar',
  '/bars/rounds-bar',
  '/bars/sqaures-bar',
  '/ss-products/chain-wire',
  '/ss-products/cold-heating-wire',
  '/ss-products/electrode-quality-wire',
  '/ss-products/epq-wire',
  '/ss-products/fine-wires',
  '/ss-products/free-cutting-wire',
  '/ss-products/general-purpose-wire',
  '/ss-products/lashing-wire',
  '/ss-products/wire-for-building-industry',
  '/ss-products/wire-for-conveyor-belt-weaving',
  '/ss-products/wire-for-nails',
  '/ss-products/wire-for-ropes',
  '/ss-products/wire-for-springs',
];

const exists = (p) => access(p, constants.F_OK).then(() => true, () => false);

async function fetchText(url) {
  const r = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'devasya-sync/1.0' } });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.text();
}

// ---- 1. download pages -----------------------------------------------------
console.log(`Syncing ${ROUTES.length} pages from ${STAGING} ...\n`);
const pageFiles = []; // local html paths to post-process (incl. existing home)
pageFiles.push(join(ROOT, 'index.html'));

for (const route of ROUTES) {
  const dest = join(ROOT, ...route.split('/').filter(Boolean), 'index.html');
  try {
    const html = await fetchText(STAGING + route);
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, html);
    pageFiles.push(dest);
    console.log(`  page  OK   ${route}`);
  } catch (e) {
    console.log(`  page  FAIL ${route}  (${e.message})`);
  }
}

// ---- 2. collect + download assets -----------------------------------------
// Extract the mirror-relative path of every Webflow CDN asset referenced in some text.
// Handles both raw (https://cdn...) and already-localized (/cdn...) refs, URLs glued to
// HTML entities like &quot; (og:image meta), and filenames containing parens e.g. "(1)".
function collectAssetRels(text) {
  const rels = new Set();
  const re = /(?:https:\/\/cdn\.prod\.website-files\.com|\/cdn\.prod\.website-files\.com)\/([^\s"'<>]+)/g;
  for (const m of text.matchAll(re)) {
    let rel = m[1];
    rel = rel.split('&')[0]; // cut at first HTML entity (&quot;, &amp;, ...)
    // strip an unbalanced trailing ")" left over from css url(...) wrappers
    while (rel.endsWith(')') && (rel.split(')').length - 1) > (rel.split('(').length - 1)) {
      rel = rel.slice(0, -1);
    }
    if (rel) rels.add(rel);
  }
  return rels;
}

const assetRels = new Set();
for (const f of pageFiles) {
  const txt = await readFile(f, 'utf8').catch(() => '');
  for (const rel of collectAssetRels(txt)) assetRels.add(rel);
}
// also scan the shared CSS (it references background images/fonts)
const cssRel = 'cdn.prod.website-files.com/66e96fb1c0b39dd4cfc6f292/css/devasyagroup.webflow.shared.60781fa2a.css';
const cssPath = join(ROOT, cssRel);
if (await exists(cssPath)) {
  const css = await readFile(cssPath, 'utf8');
  for (const rel of collectAssetRels(css)) assetRels.add(rel);
}
const assetUrls = new Set([...assetRels].map((rel) => CDN + rel));

console.log(`\nFound ${assetUrls.size} unique CDN assets. Downloading any missing ...\n`);
let downloaded = 0;
let already = 0;
for (const url of assetUrls) {
  const rel = url.slice(CDN.length);
  const dest = join(ROOT, CDN_DIR, ...rel.split('/'));
  if (await exists(dest)) { already++; continue; }
  try {
    const r = await fetch(url, { redirect: 'follow' });
    if (!r.ok) throw new Error(`${r.status}`);
    const buf = Buffer.from(await r.arrayBuffer());
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, buf);
    downloaded++;
    console.log(`  asset DL   ${rel}`);
  } catch (e) {
    console.log(`  asset FAIL ${rel}  (${e.message})`);
  }
}
console.log(`\n  ${already} already present, ${downloaded} newly downloaded.`);

// ---- 3. rewrite CDN urls -> local root-relative ---------------------------
console.log(`\nRewriting CDN urls to local mirror ...`);
let rewritten = 0;
for (const f of pageFiles) {
  if (!(await exists(f))) continue;
  const before = await readFile(f, 'utf8');
  const after = before
    .replaceAll(CDN, '/' + CDN_DIR + '/')
    // drop the now-useless preconnect hint to the CDN we no longer use
    .replace(/<link[^>]*href="https:\/\/cdn\.prod\.website-files\.com"[^>]*\/?>/g, '');
  if (after !== before) { await writeFile(f, after); rewritten++; }
}
// rewrite inside the CSS too (url(https://cdn.prod...) -> url(/cdn.prod.../...))
// and make sure the "Made in Webflow" badge stays hidden.
if (await exists(cssPath)) {
  const before = await readFile(cssPath, 'utf8');
  let after = before.replaceAll(CDN, '/' + CDN_DIR + '/');
  const marker = '/* devasya: hide Webflow badge */';
  if (!after.includes(marker)) {
    after += `\n${marker}\n.w-webflow-badge{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;}\n`;
  }
  if (after !== before) { await writeFile(cssPath, after); console.log('  rewrote shared CSS'); }
}
console.log(`  rewrote ${rewritten} html file(s).`);

console.log(`\nDone. Run "npm run serve" then open http://localhost:5173/`);
