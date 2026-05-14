# Images to add in the repo

Place files under `src/assets/images/` so they are copied to `dist/` by the build.

## Founder / brand (Rybezh.site)

- **File:** `src/assets/images/maria-rubezh-founder.webp` (JPEG is also fine; update the `src` in the homepage trust block in `src/pages/index*.html` if you use `.jpg`)
- **Use:** Homepage trust block (hero / founder section on `index*.html`)
- **Alt text (localized in build):** e.g. Ukrainian: «Марія Рубеж, засновниця Rybezh.site»; English: «Maria Rubezh, founder of Rybezh.site»
- **Source:** Use the official portrait provided by the Rybezh team (ensure you have rights to publish it on the site).

Until this file exists, the layout still renders: the `img` `onerror` handler falls back to the generated initials avatar.

## Bohdan Tiutenko profile photos

Existing assets in the repo (`bohdan-tiutenko-avatar.png` for the primary portrait, gallery PNGs/JPEGs) are referenced from the Bohdan Tiutenko profile pages under `src/pages/profiles/`. No additional images required unless you want to replace them with higher-resolution versions.
