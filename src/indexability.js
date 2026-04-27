import ENRICHMENTS from './vacancy-enrichments.js';

export function jobBaseFromSlug(slug) {
  const parts = String(slug || '').split('-');
  if (parts.length < 2) return '';
  let jobParts = parts.slice(1);
  if (jobParts.length > 0 && /^\d+$/.test(jobParts[jobParts.length - 1])) {
    jobParts = jobParts.slice(0, -1);
  }
  return jobParts.join('-');
}

export function isManualVacancy(page) {
  return page.is_generated === false
    || page.data_source === 'manual'
    || page.data_source === 'local-business';
}

/**
 * Decide which vacancy slugs to keep OUT of the index (noindex + excluded from sitemap)
 * so that the site does not emit programmatic-doorway / scaled-content signals.
 *
 * Indexable rules:
 *   1. Manual / local-business vacancies are always indexable (human-curated content).
 *   2. A generated vacancy is indexable ONLY IF:
 *        a. It has an entry in ENRICHMENTS (proves real, unique editorial content), AND
 *        b. It is the first generated vacancy claiming its jobBase across the whole site
 *           (cross-city dedup — kills "same role in 12 cities" doorway signal).
 *   3. Everything else (no enrichment, or duplicate jobBase across cities) -> noindex
 *      and excluded from the sitemap.
 */
export function detectNearDuplicateSlugs(pages) {
  const secondarySlugs = new Set();
  const claimedJobBases = new Set();

  for (const page of pages) {
    const slug = page.slug || '';
    if (!slug) continue;
    if (isManualVacancy(page)) continue;

    if (!ENRICHMENTS[slug]) {
      secondarySlugs.add(slug);
      continue;
    }

    const jobBase = jobBaseFromSlug(slug);
    if (!jobBase) {
      secondarySlugs.add(slug);
      continue;
    }

    if (claimedJobBases.has(jobBase)) {
      secondarySlugs.add(slug);
    } else {
      claimedJobBases.add(jobBase);
    }
  }

  return secondarySlugs;
}
