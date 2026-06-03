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
script re-applies that automatically.

## Contents

- `index.html` + `<route>/index.html` — all 22 pages (home, about, contact, rolling-mill,
  `bars/*`, `ss-products/*`).
- `cdn.prod.website-files.com/` — local mirror of every image, font, css and js the site
  uses. Pages reference these via root-relative paths (`/cdn.prod.website-files.com/...`).
- `scripts/` — tooling (below).

## Tooling

| Command              | What it does                                                        |
| -------------------- | ------------------------------------------------------------------- |
| `npm run serve`      | Serve the site locally + dev dashboard at `/__dev`.                  |
| `npm run check`      | Health check — verify every page + asset resolves locally (offline).|
| `npm run check:live` | Also confirm each page still loads on the live Webflow site.        |
| `npm run sync`       | Re-download all pages + assets from Webflow and re-localize them.    |

### Health check — "are all the pages working?"

[`scripts/health-check.mjs`](scripts/health-check.mjs) reads every page and verifies:

1. **Every route** has a local HTML file.
2. **Every asset** referenced (images, fonts, css, js, PDFs) exists in the local mirror —
   so there are no broken images.
3. With `--live`, **every page** also still loads on Webflow.

It exits non-zero if anything fails, so it can gate a deploy or commit.

### Re-syncing from Webflow

If the site is edited in Webflow, pull the changes down with:

```bash
npm run sync       # downloads pages + new assets, rewrites them to the local mirror
npm run check      # confirm nothing broke
```

`scripts/sync-site.mjs` pulls from the Webflow staging domain
(`https://devasyagroup.webflow.io`), which has the complete site. (The production domain
`www.devasyaindustries.com` currently has most pages unpublished — see Git history / notes.)

## Versioning

Version-controlled with Git. The release version lives in [`package.json`](package.json).
Bump it whenever you publish a meaningful change:

```
npm version patch   # 1.0.0 -> 1.0.1  (small fixes)
npm version minor   # 1.0.0 -> 1.1.0  (new content/pages)
npm version major   # 1.0.0 -> 2.0.0  (redesign / breaking change)
```

Each `npm version` command creates a commit and a Git tag — a labelled, restorable snapshot.
