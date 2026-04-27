# Rybezh — Job Search in Poland

Static website helping Ukrainian/Russian/Polish/English speakers find jobs in Poland. Includes vacancy listings, salary calculator, CV generator, blog, employer pages, and the Rybezh Proof verification system.

## Tech Stack

- **Language:** Node.js 20 (ES modules)
- **Build:** Custom static site generator (`src/generate.js`) that renders HTML pages from `src/content.json`, `src/templates/`, and source HTML files into a `dist/` folder.
- **Sitemap:** `src/generate-sitemap.js` builds `dist/sitemap.xml` for ~2,200+ URLs across UA/RU/PL/EN.
- **Original deployment target:** Cloudflare Workers (`src/worker.js`, `wrangler.toml`). Not used inside Replit.

## Replit Setup

- **Dev/preview server:** `server.js` — a tiny zero-dep Node static file server that serves `dist/` on `0.0.0.0:5000`. It supports clean URLs (`/about` → `/about.html`), serves a custom `404.html`, and disables caching in dev so the iframe preview always shows fresh content.
- **Workflow:** `Start application` runs `npm run build && npm start` and waits for port 5000 (webview output). The build step regenerates `dist/` on every restart so the preview always reflects the latest source.
- **Manual rebuild:** You can also run `npm run build` standalone to regenerate `dist/` without restarting the server.

## Useful Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies (cspell only). |
| `npm run build` | Generate all HTML pages + sitemap into `dist/`. |
| `npm start` | Start the static preview server on port 5000. |
| `npm run sitemap` | Regenerate just the sitemap. |
| `npm run lint:spell` | Run cspell across the project. |

## Deployment

Configured for Replit **Static** deployment:
- Build command: `npm run build`
- Public directory: `dist`

The original Cloudflare Worker config (`wrangler.toml`, `src/worker.js`) is left in place but is not used by Replit.

## Project Layout

- `src/` — Source HTML pages (multi-language: base, `-ru`, `-ua`), templates, JSON content, generator scripts, assets, and Cloudflare worker.
- `scripts/` — One-off maintenance/data scripts (deduping, batch additions, IndexNow ping, etc.).
- `dist/` — Generated site output (created by `npm run build`, not committed).
- `server.js` — Replit static preview server.

## Indexability & Anti-Doorway Rules

To avoid Google "doorway page" penalties, generated vacancies are deduplicated *before* being written to disk:

- **`src/indexability.js`** — single source of truth shared by `generate.js` and `generate-sitemap.js`.
- A *manual* vacancy (`is_generated: false`) is always indexable.
- A *generated* vacancy is indexable **only if** (a) it has an entry in `src/vacancy-enrichments.js`, **and** (b) it is the first slug to claim its `jobBase` (city + role + employment type) site-wide.
- Non-indexable generated vacancies are **completely skipped** during build — no HTML file, no sitemap entry, no `jobs-data.json` record. They cannot be served at all.

## Vacancy Enrichments

`src/vacancy-enrichments.js` adds unique trilingual (UA/PL/RU) editorial content (quote, local tip, district detail) to a curated subset of generated vacancies. **Each entry directly enables one indexable vacancy page** — keep entries:

- Keyed by exact slug from `src/content.json`.
- Sorted alphabetically (helps merge diffs).
- Hand-written, varied across cities, districts, and roles. Avoid templated/AI-style prose.

## Class Naming

Avoid "AI-generated" giveaway class names. The CSS uses neutral semantic names like `.vacancy-section-title`, `.vacancy-extra`, `.vacancy-extra__quote`, `.vacancy-extra__tip`, `.vacancy-extra__detail` — not `.job-human__*`, `.job-enrichment`, `.job-quote`, etc.
