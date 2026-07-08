#!/usr/bin/env node
// Applies client-requested static-site enhancements after Webflow sync/normalization.

import { readFile, writeFile } from 'node:fs/promises';
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { ROOT } from './lib/site.mjs';

const specs = JSON.parse(await readFile(join(ROOT, 'data', 'product-specs.json'), 'utf8'));
const chemistryData = JSON.parse(await readFile(join(ROOT, 'data', 'chemical-composition.json'), 'utf8'));
const chemistryMap = JSON.parse(await readFile(join(ROOT, 'data', 'product-chemistry-map.json'), 'utf8'));
const SKIP = new Set(['cdn.prod.website-files.com', 'node_modules', '.git', 'scripts', '.claude', 'data', 'styles']);
const BROCHURE = '/cdn.prod.website-files.com/66e96fb1c0b39dd4cfc6f292/6744a3f1e5ebe25a69a536a1_Devasya%20Broucher.pdf';
const TUV_CERT = '/cdn.prod.website-files.com/66e96fb1c0b39dd4cfc6f292/68bd189d0e5485bb6d95a265_TUV-SUD%20CERTIFICATE.pdf';
const ISO_CERT = '/cdn.prod.website-files.com/66e96fb1c0b39dd4cfc6f292/6732308df50660b6ae22ee23_ISO%20CERTIFICATE%20E264.pdf';
const ENGINEERS_CERT = '/documents/Devasya Engineers.pdf';
const CHEMICAL_COMPOSITION = '/documents/chemical-composition.pdf';
const LOGO = '/cdn.prod.website-files.com/66e96fb1c0b39dd4cfc6f292/66e97083d082610d30371af5_devasya.svg';
const CODEX_CSS = '/styles/devasya-codex.css?v=20260707-engineers-cert';
const CHEMISTRY_COLUMNS = [
  ['grade', 'Grade'],
  ['type', 'Type'],
  ['c', 'C'],
  ['mn', 'Mn'],
  ['si', 'Si'],
  ['s', 'S'],
  ['p', 'P'],
  ['cr', 'Cr'],
  ['ni', 'Ni'],
  ['mo', 'Mo'],
  ['n', 'N'],
  ['cu', 'Cu'],
  ['ti', 'Ti'],
  ['cb', 'Cb'],
];
const chemistryByGrade = new Map(chemistryData.rows.map((row) => [normalizeGrade(row.grade), row]));
const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Rolling Mill', href: '/rolling-mill' },
];
const brightBarLinks = [
  { label: 'Round Bars', href: '/bars/rounds-bar' },
  { label: 'Hexagon Bars', href: '/bars/hexagons-bar' },
  { label: 'Square Bars', href: '/bars/sqaures-bar' },
  { label: 'Flats Bars', href: '/bars/flats-bar' },
  { label: 'Profile Bars', href: '/bars/profiles-bar' },
];
const ssProductLinks = [
  { label: 'EPQ Wire', href: '/ss-products/epq-wire' },
  { label: 'General Purpose Wire', href: '/ss-products/general-purpose-wire' },
  { label: 'Wire For Ropes', href: '/ss-products/wire-for-ropes' },
  { label: 'Fine Wires', href: '/ss-products/fine-wires' },
  { label: 'Free Cutting Wire', href: '/ss-products/free-cutting-wire' },
  { label: 'Wire For Springs', href: '/ss-products/wire-for-springs' },
  { label: 'Lashing Wire', href: '/ss-products/lashing-wire' },
  { label: 'Chain Wire', href: '/ss-products/chain-wire' },
  { label: 'Electrode Quality Wire', href: '/ss-products/electrode-quality-wire' },
  { label: 'Wire For Nails', href: '/ss-products/wire-for-nails' },
  { label: 'Wire For Building Industry', href: '/ss-products/wire-for-building-industry' },
  { label: 'Cold Heading Wire', href: '/ss-products/cold-heating-wire' },
  { label: 'Wire For Conveyor Belt', href: '/ss-products/wire-for-conveyor-belt-weaving' },
];
const legacySpecDetails = {
  '/bars/rounds-bar': [
    'Customer demands: size control; increased tensile and yield strengths; optimum machine ability.',
    'Facilities: high-tech drawing lines, peeling lines, heat treatment facilities, ultrasonic inspection, crack detection, facing and chamfering, and precision sawing.',
    'Heat treatment capability includes spheroidise annealing, annealing to hardness or grain structure, normalizing, stress relieving, quench and tempering.',
    'Legacy grade list: IS2062, Alloy Steel, Carbon steel, En1A, En8, En8D, En24, SAE 1040, SAE 1045, SAE 1050, 35C8, 45C8 and many more.',
  ],
  '/bars/flats-bar': [
    'Customer demands: size control; increased tensile and yield strengths; optimum machine ability.',
    'Facilities: high-tech drawing lines, peeling lines, heat treatment facilities, ultrasonic inspection, crack detection, facing and chamfering, and precision sawing.',
    'Heat treatment capability includes spheroidise annealing, annealing to hardness or grain structure, normalizing, stress relieving, quench and tempering.',
    'Legacy grade list: IS2062, Alloy Steel, Carbon steel, En1A, En8, En8D, En24, SAE 1040, SAE 1045, SAE 1050, 35C8, 45C8 and many more.',
  ],
  '/bars/hexagons-bar': [
    'Customer demands: size control; increased tensile and yield strengths; optimum machine ability.',
    'Facilities: high-tech drawing lines, peeling lines, heat treatment facilities, ultrasonic inspection, crack detection, facing and chamfering, and precision sawing.',
    'Heat treatment capability includes spheroidise annealing, annealing to hardness or grain structure, normalizing, stress relieving, quench and tempering.',
    'Legacy grade list: IS2062, Alloy Steel, Carbon steel, En1A, En8, En8D, En24, SAE 1040, SAE 1045, SAE 1050, 35C8, 45C8 and many more.',
  ],
  '/bars/sqaures-bar': [
    'Customer demands: size control; increased tensile and yield strengths; optimum machine ability.',
    'Facilities: high-tech drawing lines, peeling lines, heat treatment facilities, ultrasonic inspection, crack detection, facing and chamfering, and precision sawing.',
    'Heat treatment capability includes spheroidise annealing, annealing to hardness or grain structure, normalizing, stress relieving, quench and tempering.',
    'Legacy grade list: IS2062, Alloy Steel, Carbon steel, En1A, En8, En8D, En24, SAE 1040, SAE 1045, SAE 1050, 35C8, 45C8 and many more.',
  ],
  '/bars/profiles-bar': [
    'Customer demands: size control; increased tensile and yield strengths; optimum machine ability.',
    'Facilities: high-tech drawing lines, peeling lines, heat treatment facilities, ultrasonic inspection, crack detection, facing and chamfering, and precision sawing.',
    'Heat treatment capability includes spheroidise annealing, annealing to hardness or grain structure, normalizing, stress relieving, quench and tempering.',
    'Legacy grade list: IS2062, Alloy Steel, Carbon steel, En1A, En8, En8D, En24, SAE 1040, SAE 1045, SAE 1050, 35C8, 45C8 and many more.',
  ],
  '/ss-products/epq-wire': [
    'Excellent surface finish.',
    'Suitable for electro polishing.',
    'Available in ASTM, DIN, BS and JIS standards.',
  ],
  '/ss-products/cold-heating-wire': [
    'Excellent corrosion resistance and mechanical strength for bolts, nuts, screws, Philips head screws, and other fasteners.',
    'Marked work-hardening characteristics.',
    'Vicafil coated wire for smooth heading operations and crack-free heads.',
    'Supply condition: cold drawn, annealed and skin pass, or as per customer requirement with very fine tolerance.',
  ],
  '/ss-products/wire-for-nails': [
    'Superior corrosion resistance under conditions of application.',
    'Resistant to tannic acid and other extractives common to wood; will not discolor wood surrounding the nail head.',
    'Strength is adequate for wood applications.',
    'Driving the nail into wood does not split the wood.',
  ],
  '/ss-products/free-cutting-wire': [
    'Free-cutting stainless wire is selected based on fatigue, usage, strength, corrosion resistance, and impact resistance requirements.',
    'Sulphur is added by about 0.15% to 0.35% to improve machinability.',
  ],
  '/ss-products/wire-for-springs': [
    'Made from selected steel and finished to eliminate flaws that reduce fatigue strength, including lateral and longitudinal cracks, pits, and marks.',
    'Mechanical properties are produced as per customer requirements.',
    'Spring wires are produced joint-free in one continuous length.',
  ],
  '/ss-products/lashing-wire': [
    'Lashing wire can use ferritic or austenitic grades.',
    'High ductility with minimum 20% elongation.',
    'Packed with plastic ties to provide consistent package tension.',
  ],
  '/ss-products/wire-for-ropes': [
    'Made from selected stainless steel grades with special chemical compositions.',
    'Manufactured through a unique process developed by the company.',
    'Rope wires are produced joint-free in one continuous length.',
  ],
  '/ss-products/fine-wires': [
    'High die life.',
    'Smooth surface finish.',
    'High ductility.',
    'Suitable for drawing up to 0.06 mm for high-speed machines.',
  ],
  '/ss-products/wire-for-building-industry': [
    'Used in construction work for tying wall, roof, and binding torr-steel structures due to high corrosion resistance and high strength properties.',
    'Applications include roofing hooks, wall tie, and tying wire.',
  ],
  '/ss-products/wire-for-conveyor-belt-weaving': [
    'Supplied in bright annealed condition.',
    'Beautiful lustrous surfaces with high resistance to corrosion.',
    'Available in a full range of sizes from extra-large to extra-fine diameters.',
    'Suitable for chemicals, petrochemicals, synthetic fiber, paper and pulp industries, conveyor belts operating in high-temperature environments, and similar applications.',
  ],
  '/ss-products/electrode-quality-wire': [
    'Manufactures stainless steel wire for welding electrodes and TIG wires.',
    'Wires are supplied for welding consumables in compliance with international quality standards.',
    'Shiny surface, controlled mechanical properties, and resistance to cracking, scaling, and high-temperature corrosion.',
    'Supplied in coil or cut length as per AWS, DIN, BS, JIS, equivalent international standards, or customer requirement.',
    'Good weldability and superior corrosion resistance.',
  ],
};

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

function routeFor(file) {
  const rel = relative(ROOT, file);
  if (rel === 'index.html') return '/';
  return '/' + rel.replace(/\/index\.html$/, '');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function normalizeGrade(value) {
  return String(value).toUpperCase().replace(/\s+/g, '');
}

function chemistryCell(value) {
  return value ? escapeHtml(value) : '<span class="codex-chem-empty">-</span>';
}

function detailsCell(details) {
  if (!details || !details.length) return '<span class="codex-chem-empty">-</span>';
  return `<ul class="codex-spec-detail-list">${details.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

function isCurrent(route, href) {
  return route === href || (href !== '/' && route.startsWith(href + '/'));
}

function navAnchor(route, item, className = 'codex-navbar__link') {
  const current = isCurrent(route, item.href);
  const aria = current ? ' aria-current="page"' : '';
  const classes = `${className}${current ? ' is-current' : ''}`;
  return `<a class="${classes}" href="${item.href}"${aria}>${escapeHtml(item.label)}</a>`;
}

function navDropdown(route, label, items, groupClass, stateId) {
  const current = items.some((item) => isCurrent(route, item.href));
  const links = items.map((item) => navAnchor(route, item, 'codex-navbar__dropdown-link')).join('');
  return `<div class="codex-navbar__group ${groupClass}${current ? ' is-current' : ''}"><input class="codex-navbar__group-state" type="checkbox" id="${stateId}" aria-label="${escapeHtml(label)} navigation"/><label class="codex-navbar__link codex-navbar__dropdown-toggle${current ? ' is-current' : ''}" for="${stateId}"><span>${escapeHtml(label)}</span><span class="codex-navbar__chevron" aria-hidden="true"></span></label><div class="codex-navbar__dropdown">${links}</div></div>`;
}

function generatedNavbar(route) {
  const links = navLinks.map((item) => navAnchor(route, item)).join('');
  return `<header class="codex-navbar" data-codex-navbar><div class="codex-navbar__inner"><a class="codex-navbar__brand" href="/" aria-label="Devasya Industries home"><img src="${LOGO}" alt="Devasya Industries"/></a><input class="codex-navbar__state" type="checkbox" id="codex-primary-nav-state" aria-label="Toggle navigation"/><label class="codex-navbar__menu-button" for="codex-primary-nav-state"><span></span><span></span><span></span></label><nav class="codex-navbar__menu" id="codex-primary-navigation" aria-label="Primary navigation"><div class="codex-navbar__links">${links}${navDropdown(route, 'Bright Bars', brightBarLinks, 'codex-navbar__group--bright-bars', 'codex-nav-bright-bars')}${navDropdown(route, 'SS Products', ssProductLinks, 'codex-navbar__group--ss-products', 'codex-nav-ss-products')}</div><a class="codex-navbar__cta${isCurrent(route, '/contact') ? ' is-current' : ''}" href="/contact"${isCurrent(route, '/contact') ? ' aria-current="page"' : ''}>Contact Us</a></nav></div></header>`;
}

function generatedChemistryHtml(route) {
  const mapping = chemistryMap[route];
  if (!mapping) return '';

  const rows = [];
  for (const grade of mapping.grades || []) {
    const row = chemistryByGrade.get(normalizeGrade(grade));
    if (row) rows.push(row);
  }

  const intro = mapping.intro || 'Chemical composition values are filtered from the provided chemistry source for the grades shown on this page.';
  const header = CHEMISTRY_COLUMNS.map(([, label]) => `<th>${escapeHtml(label)}</th>`).join('');
  const body = rows
    .map((row) => `<tr>${CHEMISTRY_COLUMNS.map(([key]) => `<td>${chemistryCell(row[key])}</td>`).join('')}</tr>`)
    .join('');
  const table = rows.length
    ? `<div class="codex-table-scroll codex-chem-scroll"><table class="codex-spec-table codex-chem-table"><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table></div>`
    : '';

  return `<div class="codex-chemistry-block" data-codex-chemical-composition="true"><h3 class="codex-chem-title">Chemical Composition (%)</h3><p class="codex-spec-copy codex-chem-copy">${escapeHtml(intro)}</p>${table}<p class="codex-spec-note"><a class="codex-spec-download" href="${CHEMICAL_COMPOSITION}" target="_blank" download>Download full chemical composition PDF</a></p></div>`;
}

function ensureCss(html) {
  if (/href="\/styles\/devasya-codex\.css(?:\?[^"]*)?"/.test(html)) {
    return html.replace(/href="\/styles\/devasya-codex\.css(?:\?[^"]*)?"/g, `href="${CODEX_CSS}"`);
  }
  const cssLink = `<link href="${CODEX_CSS}" rel="stylesheet" type="text/css"/>`;
  return html.replace(
    /(<link href="\/cdn\.prod\.website-files\.com\/66e96fb1c0b39dd4cfc6f292\/css\/devasyagroup\.webflow\.shared\.60781fa2a\.css" rel="stylesheet" type="text\/css"\/>)/,
    `$1${cssLink}`,
  );
}

function ensureNavFallback(html) {
  if (html.includes('/scripts/nav-fallback.js')) return html;
  return html.replace('</body>', '<script src="/scripts/nav-fallback.js" type="text/javascript"></script></body>');
}

function ensureCodexNavbarScript(html) {
  return html.replace(/<script src="\/scripts\/codex-navbar(?:-v2)?\.js(?:\?[^"]*)?" type="text\/javascript"><\/script>/g, '');
}

function ensureCodexNavbar(html, route) {
  const navbar = generatedNavbar(route);
  if (html.includes('data-codex-navbar')) {
    return html.replace(/<header class="codex-navbar"[\s\S]*?<\/header>/, navbar);
  }
  return html.replace(/(<body\b[^>]*>)/, `$1${navbar}`);
}

function generatedSpecHtml(spec, route) {
  const details = legacySpecDetails[route] || [];
  const rows = spec.rows
    .map((row) => `<tr><td>${escapeHtml(row.application)}</td><td>${escapeHtml(row.size)}</td><td>${escapeHtml(row.finish)}</td><td>${escapeHtml(row.tensile)}</td><td>${escapeHtml(row.grades)}</td><td>${detailsCell(details)}</td></tr>`)
    .join('');
  const note = spec.note ? `<p class="codex-spec-note">${escapeHtml(spec.note)}</p>` : '';
  const chemistry = generatedChemistryHtml(route);
  return `<section class="codex-spec-section" data-codex-product-specs="true"><div class="codex-spec-inner"><div class="codex-table-scroll"><table class="codex-spec-table"><thead><tr><th>Application</th><th>Size range</th><th>Finish</th><th>Tensile strength</th><th>Suitable grades</th><th>Additional specifications</th></tr></thead><tbody>${rows}</tbody></table></div>${note}${chemistry}</div></section>`;
}

function productSubtitle(route) {
  return route.startsWith('/ss-products/') ? 'SS Product Application' : 'Bright Bar Application';
}

function generatedProductCta(route) {
  const productType = route.startsWith('/ss-products/') ? 'stainless steel wire' : 'bright bar';
  return `<div class="codex-product-cta"><h3 class="codex-product-cta__title">Get a Appointment with Our Expert</h3><p class="codex-product-cta__copy">Connect with our specialists at Devasya Industries to explore tailored solutions for your ${productType} needs. We manufacture products in various grades and sizes to meet precise customer specifications.</p><a href="/contact" target="_blank" class="codex-product-cta__button w-inline-block"><div>Get in Touch</div></a></div>`;
}

function preserveProductMediaContent(content, route) {
  const figures = content.match(/<figure[\s\S]*?<\/figure>/g) || [];
  if (!figures.length) return '';

  const introMatch = content.match(/^\s*((?:<p\b[\s\S]*?<\/p>\s*)+)[\s\S]*?<figure/);
  const intro = route.startsWith('/bars/') && introMatch
    ? introMatch[1]
        .replace(/<p>\s*(?:‍|&zwj;)?\s*<\/p>/g, '')
        .replace(/<p>\s*<\/p>/g, '')
    : '';

  return `${intro}${figures.join('')}`;
}

function cleanupLegacyProductRichText(html, route) {
  return html.replace(
    /(<div\b(?=[^>]*class="[^"]*(?:w-richtext|rich-text-block)[^"]*")[^>]*>)([\s\S]*?)(<\/div>)(?=<section class="codex-spec-section")/g,
    (match, open, content, close) => `${open}${preserveProductMediaContent(content, route)}${close}`,
  );
}

function cleanupProductPage(html, spec, route) {
  let next = html;
  next = next.replace(/<section class="codex-spec-section"[\s\S]*?<\/section>/g, '');
  next = next.replace(/<div class="subtitle">[\s\S]*?<\/div><div class="clip"><h1 class="large-heading left half">[\s\S]*?<\/h1><\/div>/, `<div class="subtitle codex-product-kicker">${productSubtitle(route)}</div><div class="clip"><h1 class="large-heading left half codex-product-heading">${escapeHtml(spec.title)}</h1></div>`);
  next = next.replace(
    /(<div id="[^"]+" class="div-block-11">)[\s\S]*?(<\/div><\/div>)(?=<\/div><div class="div-block-15">)/,
    `$1${generatedProductCta(route)}$2`,
  );
  next = next.replace(/<figure[^>]*><div><img[^>]+src="[^"]*Group%2520117127[^"]*"[^>]*\/?><\/div><\/figure>\s*(?:<p>‍?<\/p>)?/g, '');
  next = next.replace(/<(p|h5)>\s*<a\b(?=[^>]*href="https:\/\/devasyaindustries\.com\/pdf\/ChemicalComposition\.pdf")[^>]*>[\s\S]*?<\/a>\s*<\/\1>\s*(?:<p>‍?<\/p>)?/g, '');
  next = next.replace(/<(p|h5)>\s*<a\b(?=[^>]*href="\/public\/chemidtry\.pdf")[^>]*>[\s\S]*?<\/a>\s*<\/\1>\s*(?:<p>‍?<\/p>)?/g, '');
  next = next.replace(/<(p|h5)>\s*<a\b(?=[^>]*href="https:\/\/devasyaindustries\.com\/specification\/brightbar\/[^"]+")[^>]*>[\s\S]*?<\/a>\s*<\/\1>\s*(?:<p>‍?<\/p>)?/g, '');
  const section = generatedSpecHtml(spec, route);
  const brochureRe = new RegExp(`(<a href="${BROCHURE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*class="button[^"]*"[^>]*>)`);
  if (brochureRe.test(next)) {
    next = next.replace(brochureRe, section + '$1');
  } else {
    next = next.replace('</footer>', section + '</footer>');
  }
  return cleanupLegacyProductRichText(next, route);
}

function normalizeBrochureLinks(html) {
  return html.replace(/<a\b(?=[^>]*href="\/cdn\.prod\.website-files\.com\/66e96fb1c0b39dd4cfc6f292\/6744a3f1e5ebe25a69a536a1_Devasya%20Broucher\.pdf")([^>]*)>/g, (match, attrs) => {
    let next = attrs;
    if (!/\btarget=/.test(next)) next += ' target="_blank"';
    if (!/\bdownload\b/.test(next)) next += ' download';
    return `<a${next}>`;
  });
}

function updateHome(html) {
  let next = html;
  next = next.replace('We excel in Steel Fabrication', 'Specialists in Wire Drawing and Steel Fabrication');
  next = next.replace(
    'Devasya Group is Gujarat’s leading steel supplier, specializing in advanced steel fabrication in stainless steel wires, bright bars round, square, flat and more. Our commitment to quality and innovation sets us apart in the industry, ensuring that we meet the diverse needs of industries across Gujarat and beyond.',
    'Devasya Group is Gujarat’s specialist in stainless steel wire drawing, bright bars, rolling mill products, and steel fabrication. Our wire drawing and fabrication capabilities support industrial customers that need consistent finish, dimensional accuracy, and dependable supply.',
  );
  next = next.replace('href="/rolling-mill">\n         <div class="button-text">\n          View all services', 'href="#services">\n         <div class="button-text">\n          View all services');
  const productTitleIndex = next.indexOf('Our Steel Products');
  if (productTitleIndex !== -1) {
    const sectionIndex = next.lastIndexOf('<div class="section clip"', productTitleIndex);
    if (sectionIndex !== -1 && !next.slice(sectionIndex, sectionIndex + 80).includes('id="services"')) {
      next = next.slice(0, sectionIndex) + next.slice(sectionIndex).replace('<div class="section clip">', '<div class="section clip" id="services">');
    }
  }
  if (!next.includes('data-codex-gallery-marquee="true"')) {
    next = next.replace('<div class="frame-1171275358" data-w-id=', '<div class="frame-1171275358" data-codex-gallery-marquee="true" data-w-id=');
  }
  next = next.replace(
    'Our stainless steel wires are integral to various industrial applications, offering unmatched durability and versatility. Our product applications include:',
    'Explore Devasya’s core capabilities: stainless steel wire drawing, bright bars, rolling mill production, and steel fabrication for industrial applications.',
  );

  const certSection = `<section class="codex-certificates-section" id="certificates"><div class="codex-certificates-inner"><h2 class="codex-certificates-title">Certificates</h2><p class="codex-certificates-copy">Download the available Devasya certification documents directly. New ISO certificates can be added here as soon as the client provides the updated files.</p><div class="codex-certificates-grid"><a class="codex-certificate-card" href="${TUV_CERT}" target="_blank" download><strong>TUV-SUD Certificate</strong><span>Current TUV-SUD certificate PDF available in the local site mirror.</span></a><a class="codex-certificate-card" href="${ISO_CERT}" target="_blank" download><strong>ISO Certificate</strong><span>Current ISO certificate PDF available in the local site mirror.</span></a><a class="codex-certificate-card" href="${ENGINEERS_CERT}" target="_blank" download><strong>Devasya Engineers ISO 9001:2015</strong><span>TÜV SÜD ISO 9001:2015 Quality Management System certificate for Devasya Engineers, valid 2026–2029.</span></a></div></div></section>`;

  const injectedStart = next.indexOf('<section class="codex-certificates-section"');
  if (injectedStart !== -1) {
    // Section was already injected on a previous run; replace it in place so the generator stays idempotent.
    const injectedEnd = next.indexOf('</section>', injectedStart);
    if (injectedEnd !== -1) {
      next = next.slice(0, injectedStart) + certSection + next.slice(injectedEnd + '</section>'.length);
    }
  } else {
    const marker = '<h1 class="large-heading left l">\n       Certificates';
    const markerIndex = next.indexOf(marker);
    if (markerIndex !== -1) {
      const sectionStart = next.lastIndexOf('<div class="section no-verticle-padding clip full reduce"', markerIndex);
      const sectionEnd = next.indexOf('<div class="section clip"', markerIndex);
      if (sectionStart !== -1 && sectionEnd !== -1) {
        next = next.slice(0, sectionStart) + certSection + next.slice(sectionEnd);
      }
    }
  }
  return next;
}

let changed = 0;
for (const file of findHtml()) {
  const route = routeFor(file);
  const before = await readFile(file, 'utf8');
  let after = ensureCss(before);
  after = ensureNavFallback(after);
  after = ensureCodexNavbarScript(after);
  after = ensureCodexNavbar(after, route);
  after = normalizeBrochureLinks(after);
  if (route === '/') after = updateHome(after);
  if (specs[route]) after = cleanupProductPage(after, specs[route], route);
  if (after !== before) {
    await writeFile(file, after);
    changed++;
    console.log(`applied client changes ${relative(ROOT, file)}`);
  }
}

console.log(`Done. ${changed} HTML file(s) changed.`);
