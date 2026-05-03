# Stage 1 Audit (files and structure)

Date: 2026-05-03

## Project structure snapshot
- Main source directories: `src/pages`, `src/assets/images`, `src/templates`, `scripts`.
- Build/runtime scripts in repo root: `build.js`, `server.js`, `generate_data.js`, `generate_profiles.js`.
- Content scale:
  - `436` HTML pages total.
  - `192` startup pages.
  - `212` profile pages.

## Multilingual file pattern health (file-level)
- Startup/profile entities checked by base slug: `101` entities.
- Entities with full language set (`uk`, `en`, `ru`, `es`): `101/101`.
- Missing language variants at file level: none found.

## Generated / temp / backup candidate scan
Checked patterns: `~`, `.bak`, `.old`, `.orig`, `.tmp`, `.temp`, `backup`, `copy`.

### Found candidates
1. `src/assets/images/IMG_2361~2.jpg`
2. `src/assets/images/1777671624758~3.png`

### Usage verification before any deletion
Both files are actively referenced in live pages (`person-bohdan-tiutenko` in all 4 languages), so **they are NOT safe to delete now**.

## Potentially non-content directory
- `attached_assets/` contains PDF: `Книга__Донбасс_2014-comprimido_1777259219673.pdf`.
- No file-level evidence yet that it is linked from site pages; requires explicit link scan in next step before any cleanup decision.

## Duplicates / mass-generation signals at file level
- Strong templated structure exists by design (4-language variants for each slug).
- No accidental duplicate filename collisions found in `src/pages` naming convention.
- High-volume content generation is likely intentional (startup/profile matrix), but needs Stage 2 content-quality review.

## Safe cleanup decision for Stage 1
- **No files deleted in Stage 1.**
- Rationale: every suspicious filename found in assets is currently referenced by production pages.
