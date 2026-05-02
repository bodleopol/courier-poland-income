## Cursor Cloud specific instructions

### Overview

Rybezh People Archive — a multilingual static site (Ukrainian, English, Spanish, Russian) showcasing notable specialists. No backend, database, or authentication required.

### Node.js

nvm is located at `/home/ubuntu/.nvm`. Source it before running any node/npm commands:

```bash
export NVM_DIR="/home/ubuntu/.nvm" && source "$NVM_DIR/nvm.sh"
```

### Key commands

See `package.json` `scripts` section. Quick reference:

- **Install deps:** `npm install`
- **Build:** `npm run build` (generates data, profiles, and compiles HTML into `dist/`)
- **Dev server:** `npm start` (serves `dist/` on port 5000)
- **Lint (spell check):** `npm run lint:spell` — cspell with multilingual dictionaries. Pre-existing spelling issues exist in generated profile HTML files; these are not regressions.

### Gotchas

- You must run `npm run build` before `npm start`; the server serves the `dist/` directory which is created by the build step.
- The build is a three-step pipeline: `generate_data.js` → `generate_profiles.js` → `build.js`. All three run sequentially via `npm run build`.
- On the default Ukrainian homepage (`index.html`), the language switcher links contain unprocessed `{{CANONICAL}}` template placeholders. This is a pre-existing issue. The actual language pages at `/index-en.html`, `/index-es.html`, `/index-ru.html` work correctly when accessed directly.
- There are no automated tests in this repository.
