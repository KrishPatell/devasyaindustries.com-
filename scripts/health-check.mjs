#!/usr/bin/env node
// Health check for the self-hosted Devasya Industries static site.
//
// Verifies:
//   1. Every page route has a local HTML file.
//   2. Every asset referenced by any page exists in the local mirror — no broken images.
//   3. (optional, --live) every page also loads on the live Webflow site.
//
// Exits with code 1 if anything fails, so it can gate a deploy / commit.
//
// Usage:
//   node scripts/health-check.mjs            # local integrity (no network) — the default
//   node scripts/health-check.mjs --live     # also hit the live staging site
//   node scripts/health-check.mjs --live --base https://www.devasyaindustries.com
//
// No dependencies — uses Node 18+ built-in fetch.

import { findPages, checkPageAssets } from './lib/site.mjs';

const args = process.argv.slice(2);
const LIVE = args.includes('--live');
const baseIdx = args.indexOf('--base');
const BASE_URL = (baseIdx !== -1 && args[baseIdx + 1]) || 'https://devasyagroup.webflow.io';
const CONCURRENCY = 8;
const TIMEOUT_MS = 15000;

const GREEN = (s) => `\x1b[32m${s}\x1b[0m`;
const RED = (s) => `\x1b[31m${s}\x1b[0m`;
const DIM = (s) => `\x1b[2m${s}\x1b[0m`;

const pages = findPages();
const failures = [];

console.log('\nDevasya site health check');
console.log(DIM(`pages found: ${pages.length}`));
console.log(DIM(`mode:        ${LIVE ? 'local + live' : 'local only (no network)'}`));

// ---- 1 + 2. local asset integrity per page --------------------------------
console.log(`\n1. Page files & their assets`);
let totalAssets = 0;
let brokenAssets = 0;
for (const { route, file } of pages) {
  const { total, missing } = checkPageAssets(file);
  totalAssets += total;
  brokenAssets += missing.length;
  if (missing.length === 0) {
    console.log('   ' + GREEN('OK  ') + ` ${route}`);
  } else {
    console.log('   ' + RED('BAD ') + ` ${route}  ${DIM('(' + missing.length + ' missing asset(s))')}`);
    for (const rel of missing.slice(0, 6)) {
      failures.push(`${route}: missing asset /cdn.prod.website-files.com/${rel}`);
      console.log('        ' + RED('/cdn.prod.website-files.com/' + rel));
    }
    if (missing.length > 6) console.log(DIM(`        ...and ${missing.length - 6} more`));
  }
}
console.log(
  '   ' +
    (brokenAssets === 0
      ? GREEN(`${pages.length} pages, all ${totalAssets} local asset references resolve`)
      : RED(`${brokenAssets} broken asset reference(s) across the site`)),
);

// ---- 3. live check (optional) ---------------------------------------------
if (LIVE) {
  console.log(`\n2. Live pages on ${BASE_URL}`);
  async function checkUrl(url) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(url, { redirect: 'follow', signal: ctrl.signal, headers: { 'User-Agent': 'devasya-health-check/1.0' } });
      return { ok: res.status < 400, status: res.status };
    } catch (err) {
      return { ok: false, status: err.name === 'AbortError' ? 'timeout' : err.code || 'error' };
    } finally {
      clearTimeout(t);
    }
  }
  let i = 0;
  const routes = pages.map((p) => p.route);
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, routes.length) }, async () => {
      while (i < routes.length) {
        const route = routes[i++];
        const url = BASE_URL.replace(/\/$/, '') + (route === '/' ? '' : route);
        const r = await checkUrl(url);
        if (!r.ok) failures.push(`live ${r.status}: ${route}`);
        console.log('   ' + (r.ok ? GREEN('OK ') : RED('FAIL')) + ` ${String(r.status).padEnd(7)} ${route}`);
      }
    }),
  );
}

// ---- summary ---------------------------------------------------------------
console.log('\n' + '─'.repeat(50));
if (failures.length === 0) {
  console.log(GREEN(`PASS — ${pages.length} pages, everything checks out.`));
  process.exit(0);
} else {
  console.log(RED(`FAIL — ${failures.length} problem(s):`));
  for (const f of failures) console.log('  - ' + f);
  process.exit(1);
}
