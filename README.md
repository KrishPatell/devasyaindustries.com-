# Devasya Web

Self-hosted static copy of the [Devasya Industries](https://www.devasyaindustries.com)
website (built in Webflow). All 22 pages and their assets live in this repo — the site no
longer depends on Webflow's servers to render.

## Run it locally

The site uses Webflow-style clean URLs (`/about`, `/bars/flats-bar`), so it needs a tiny
static server (not just double-clicking a file):

```bash
npm run serve      # http://localhost:5173
```

Then open the **dev dashboard** at <http://localhost:5173/__dev> to see every page listed
with a click-through link and a live asset-integrity status — a quick way to check all pages
in one place. (The dashboard is dev-only; it is not part of the published site.)

The "Made in Webflow" badge is hidden site-wide (via the shared stylesheet), and the sync
script re-applies that automatically. Local client fixes are also layered back in by
`npm run normalize`.

## Contents

- `index.html` + `<route>/index.html` — all 22 pages (home, about, contact, rolling-mill,
  `bars/*`, `ss-products/*`).
- `cdn.prod.website-files.com/` — local mirror of every image, font, css and js the site
  uses. Pages reference these via root-relative paths (`/cdn.prod.website-files.com/...`).
- `data/product-specs.json` — source data for generated product specification tables.
- `data/chemical-composition.json` — extracted chemistry rows from the imported PDF.
- `data/product-chemistry-map.json` — per-product grade mapping for chemistry tables,
  including source grades that were not present in the provided PDF.
- `documents/chemical-composition.pdf` — local SS chemical-composition PDF imported from
  the open Vikas PR, renamed from the PR's typo filename.
- `styles/devasya-codex.css` — Codex-maintained CSS layer for the generated responsive
  navbar, spec tables, certificates, and wide-section centering.
- `scripts/` — tooling (below).

## Tooling

| Command              | What it does                                                        |
| -------------------- | ------------------------------------------------------------------- |
| `npm run serve`      | Serve the site locally + dev dashboard at `/__dev`.                  |
| `npm run check`      | Health check — verify every page + asset resolves locally (offline).|
| `npm run check:live` | Also confirm each page still loads on the live Webflow site.        |
| `npm run normalize`  | Re-apply shared footer/nav cleanup and client-change generators.      |
| `npm run sync`       | Re-download all pages + assets from Webflow and re-localize them.    |

### Health check — "are all the pages working?"

[`scripts/health-check.mjs`](scripts/health-check.mjs) reads every page and verifies:

1. **Every route** has a local HTML file.
2. **Every local asset** referenced (images, fonts, css, js, PDFs) exists in the checkout —
   including the Webflow mirror plus local `styles/`, `scripts/`, and `documents/` assets.
3. With `--live`, **every page** also still loads on Webflow.

It exits non-zero if anything fails, so it can gate a deploy or commit.

### Re-syncing from Webflow

If the site is edited in Webflow, pull the changes down with:

```bash
npm run sync       # downloads pages + new assets, rewrites them to the local mirror
npm run normalize  # restores shared cleanup + product specs + client fixes
npm run check      # confirm nothing broke
```

`scripts/sync-site.mjs` pulls from the Webflow staging domain
(`https://devasyagroup.webflow.io`), which has the complete site. (The production domain
`www.devasyaindustries.com` currently has most pages unpublished — see Git history / notes.)

## Client-fix layer

`scripts/apply-client-changes.mjs` is intentionally part of `npm run normalize`. It restores:

- home headline/body copy for wire drawing and steel fabrication;
- the home "View all services" button to `#services`;
- generated product specification tables on all bright-bar and SS-product pages;
- legacy product-page specification bullets inside the generated table's "Additional specifications" column, with existing images preserved above the table;
- on-page chemical-composition tables from `data/chemical-composition.json`;
- full chemical-composition PDF links to `/documents/chemical-composition.pdf`;
- brochure links with `target="_blank"` and `download`;
- the home certificate cards for TUV-SUD and ISO PDFs;
- the generated no-JS responsive navbar, including tablet hamburger and desktop dropdowns.

Known remaining content gaps: a newer ISO certificate file is not in this checkout, and the
provided chemistry PDF does not contain every requested grade row.

## Versioning

Version-controlled with Git. The release version lives in [`package.json`](package.json).
Bump it whenever you publish a meaningful change:

```
npm version patch   # 1.0.0 -> 1.0.1  (small fixes)
npm version minor   # 1.0.0 -> 1.1.0  (new content/pages)
npm version major   # 1.0.0 -> 2.0.0  (redesign / breaking change)
```

Each `npm version` command creates a commit and a Git tag — a labelled, restorable snapshot.
