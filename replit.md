# Rybezh — Job Search in Poland

Static website helping Ukrainian/Russian/Polish/English speakers find jobs in Poland. Includes vacancy listings, salary calculator, CV generator, blog, employer pages, and the Rybezh Proof verification system.

## Tech Stack

- **Language:** Node.js 20 (ES modules)
- **Build:** Custom static site generator (`src/generate.js`) that renders HTML pages from `src/content.json`, `src/templates/`, and source HTML files into a `dist/` folder.
- **Sitemap:** `src/generate-sitemap.js` builds `dist/sitemap.xml` for ~2,200+ URLs across UA/RU/PL/EN.
- **Original deployment target:** Cloudflare Workers (`src/worker.js`, `wrangler.toml`). Not used inside Replit.

## Replit Setup

- **Dev/preview server:** `server.js` — a tiny zero-dep Node static file server that serves `dist/` on `0.0.0.0:5000`. It supports clean URLs (`/about` → `/about.html`), serves a custom `404.html`, and disables caching in dev so the iframe preview always shows fresh content.
- **Workflow:** `Start application` runs `npm start` and waits for port 5000 (webview output).
- **Build before serving:** Run `npm run build` to (re)generate the `dist/` folder. The workflow does not auto-build — re-run the build whenever pages, templates, or content change.

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
