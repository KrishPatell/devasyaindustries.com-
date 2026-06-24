#!/usr/bin/env node
// Normalize repeated Webflow-export clutter after sync/manual edits.
//
// This keeps the static HTML export easy to maintain without requiring Webflow:
// - one clean footer source of truth
// - no dead Login links
// - no internal footer/product links pointing at production URLs
// - consistent primary call/WhatsApp number
// - no Webflow generator/comments in exported HTML

import { readFile, writeFile } from 'node:fs/promises';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './lib/site.mjs';

const PRIMARY_PHONE_DISPLAY = '+91 9924788225';
const PRIMARY_PHONE_TEL = '+919924788225';
const PRIMARY_EMAIL = 'Devasyaindustriesabd@gmail.com';
const LINKEDIN_URL = 'https://in.linkedin.com/company/devasya-group-of-industries';
const LOGO = '/cdn.prod.website-files.com/66e96fb1c0b39dd4cfc6f292/66e97083d082610d30371af5_devasya.svg';

const SKIP = new Set(['cdn.prod.website-files.com', 'node_modules', '.git', 'scripts', '.claude']);

function findHtml(dir = ROOT) {
  const files = [];
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const abs = join(dir, name);
    const st = statSync(abs);
    if (st.isDirectory()) files.push(...findHtml(abs));
    else if (name.endsWith('.html')) files.push(abs);
  }
  return files.sort();
}

function footerHtml() {
  return `<footer class="uui-footer01_component" data-codex-shared-footer="true"><div class="uui-page-padding"><div class="uui-container-large"><div class="uui-padding-vertical-xlarge"><div class="w-layout-grid uui-footer01_top-wrapper"><div class="uui-footer01_left-wrapper"><a href="/" class="uui-footer01_logo-link w-nav-brand"><img src="${LOGO}" loading="lazy" alt="Devasya Group" class="uui-logo_logotype-2"/></a><div class="text-block-2">Devasya Group: Gujarat's premier stainless steel manufacturer since 2003. ISO 9001:2015 certified, delivering high-quality wires and bright bars globally. Excellence in every strand, strength in every bar.</div></div><div class="w-layout-grid uui-footer01_menu-wrapper"><div class="uui-footer01_link-list"><div class="uui-footer01_link-list-heading">Product</div><a href="/" class="uui-footer01_link w-inline-block"><div>Home</div></a><a href="/rolling-mill" class="uui-footer01_link w-inline-block"><div>Rolling Mill</div></a><a href="/bars/flats-bar" class="uui-footer01_link w-inline-block"><div>Bright Bar</div></a><a href="/ss-products/epq-wire" class="uui-footer01_link w-inline-block"><div>SS Products</div></a></div><div class="uui-footer01_link-list"><div class="uui-footer01_link-list-heading">Company</div><a href="/about" class="uui-footer01_link w-inline-block"><div>About Us</div></a><a href="/contact" class="uui-footer01_link w-inline-block"><div>Contact Us</div></a><a href="${LINKEDIN_URL}" target="_blank" rel="noopener" class="uui-footer01_link w-inline-block"><div>LinkedIn</div></a></div><div class="uui-footer01_link-list"><div class="uui-footer01_link-list-heading">Contact</div><div class="uui-footer01_link"><div class="text-block-3">Plot No. E-263, Road No. 17, Sanand GIDC, Phase-II, Ahmedabad, Gujarat-382110, India</div></div><a href="tel:${PRIMARY_PHONE_TEL}" class="uui-footer01_link w-inline-block"><div class="text-block-3">${PRIMARY_PHONE_DISPLAY}</div></a><a href="mailto:${PRIMARY_EMAIL}" class="uui-footer01_link w-inline-block"><div class="text-block-3">${PRIMARY_EMAIL}</div></a></div></div></div><div class="uui-footer01_bottom-wrapper"><div class="uui-text-size-small-2 text-color-gray500">© <span data-current-year>2025</span> Devasya Group. All rights reserved.<br/><br/><a href="https://kpatel.xyx" target="_blank" rel="noopener" class="link">Designed By Blitz Studio</a></div></div></div></div></div></footer>`;
}

function normalize(html) {
  let next = html;

  // Remove export branding/noise that should not be maintained by hand.
  next = next
    .replace(/<!-- This site was created in Webflow\. https:\/\/webflow\.com -->/g, '')
    .replace(/<!-- Last Published:[\s\S]*?-->/g, '')
    .replace(/<meta content="Webflow" name="generator"\/?>/g, '');

  // Remove dead visible Login links in the duplicated Webflow nav.
  next = next.replace(/<a\b(?=[^>]*\bhref="#")[^>]*>\s*<div>\s*Log in\s*<\/div>\s*<\/a>/g, '');

  // Internal anchor links should stay local in the static export.
  next = next.replace(/href="https:\/\/www\.devasyaindustries\.com(\/[^"]*)"/g, 'href="$1"');
  next = next.replace(/href="https:\/\/www\.devasyaindustries\.com"/g, 'href="/"');

  // Use the widely-used site phone for call CTAs and WhatsApp.
  next = next.replace(/https:\/\/wa\.me\/\+919979588225/g, `https://wa.me/${PRIMARY_PHONE_TEL}`);
  next = next.replace(/href="tel:\+919979588225"/g, `href="tel:${PRIMARY_PHONE_TEL}"`);
  next = next.replace(/>\s*\+91 9979588225\s*</g, `>${PRIMARY_PHONE_DISPLAY}<`);

  // Fix exported contact-card rows that Webflow left as href="#".
  next = next.replace(/<a href="#" class="link-block-3 w-inline-block"><div class="list-item-text">\+91 9924788225<\/div><\/a>/g, `<a href="tel:${PRIMARY_PHONE_TEL}" class="link-block-3 w-inline-block"><div class="list-item-text">${PRIMARY_PHONE_DISPLAY}</div></a>`);
  next = next.replace(/<a href="#" class="link-block-3 w-inline-block"><div class="list-item-text">\+91 9227288225<\/div><\/a>/g, '<a href="tel:+919227288225" class="link-block-3 w-inline-block"><div class="list-item-text">+91 9227288225</div></a>');
  next = next.replace(/<a href="#" class="link-block-3 w-inline-block"><div class="list-item-text">info@devasyaindustries\.com<\/div><\/a>/g, '<a href="mailto:info@devasyaindustries.com" class="link-block-3 w-inline-block"><div class="list-item-text">info@devasyaindustries.com</div></a>');
  next = next.replace(/<a href="#" class="link-block-3 w-inline-block"><div class="list-item-text">Devasyaindusyriesabd@gmail\.com<\/div><\/a>/g, `<a href="mailto:${PRIMARY_EMAIL}" class="link-block-3 w-inline-block"><div class="list-item-text">${PRIMARY_EMAIL}</div></a>`);
  next = next.replace(/Devasyaindusyriesabd@gmail\.com/g, PRIMARY_EMAIL);

  // Replace every repeated footer with the clean shared footer.
  next = next.replace(/<footer class="uui-footer01_component"[\s\S]*?<\/footer>/g, footerHtml());

  return next;
}

let changed = 0;
for (const file of findHtml()) {
  const before = await readFile(file, 'utf8');
  const after = normalize(before);
  if (after !== before) {
    await writeFile(file, after);
    changed++;
    console.log(`normalized ${file.replace(ROOT + '/', '')}`);
  }
}

console.log(`Done. ${changed} HTML file(s) changed.`);
