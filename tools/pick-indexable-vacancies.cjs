/*
  Select indexable vacancies (top-N) from src/content.json.
  Heuristics: completeness + fewer duplicated requirement/document tokens.
  Output: JSON array of slugs.

  Usage:
    node tools/pick-indexable-vacancies.cjs > src/indexable-vacancies.json

  Env:
    INDEXABLE_VACANCIES_LIMIT (default 50)
*/

const fs = require('fs');

const LIMIT = Number.parseInt(process.env.INDEXABLE_VACANCIES_LIMIT || '50', 10);
const jobs = JSON.parse(fs.readFileSync('src/content.json', 'utf8'));

const norm = (s) => String(s || '').toLowerCase().replace(/\s+/g, ' ').trim();

function parseMaxSalary(s) {
  const text = String(s || '');
  const nums = (text.match(/\d+(?:[\.,]\d+)?/g) || [])
    .map((x) => Number(String(x).replace(',', '.')))
    .filter((n) => Number.isFinite(n));
  if (!nums.length) return 0;
  return Math.max(...nums);
}

function dupPenalty(list) {
  if (!Array.isArray(list)) return 0;
  const seen = new Map();
  let pen = 0;
  for (const item of list) {
    const k = norm(item);
    if (!k) continue;
    const c = (seen.get(k) || 0) + 1;
    seen.set(k, c);
    if (c > 1) pen += 4;
  }
  return pen;
}

function docPenalty(doc) {
  const parts = String(doc || '')
    .split(',')
    .map((p) => norm(p))
    .filter(Boolean);

  const seen = new Set();
  let pen = 0;
  for (const p of parts) {
    if (seen.has(p)) pen += 3;
    else seen.add(p);
  }
  return pen;
}

function score(j) {
  let s = 0;

  const max = parseMaxSalary(j.salary);
  s += Math.min(20, Math.log10(1 + max) * 8);

  s += Array.isArray(j.tasks_ua) ? Math.min(8, j.tasks_ua.length * 2) : 0;
  s += Array.isArray(j.details_ua) ? Math.min(6, j.details_ua.length) : 0;
  s += Array.isArray(j.offers_ua) ? Math.min(6, j.offers_ua.length) : 0;

  s += j.housing_ua ? 2 : 0;
  s += j.transport_ua ? 2 : 0;
  s += j.workplace_ua ? 1 : 0;
  s += j.onboarding_ua ? 1 : 0;

  s -= dupPenalty(j.requirements_ua);
  s -= docPenalty(j.documents_ua);

  if (String(j.excerpt || '').length > 90) s += 1;
  if (String(j.company || '').length < 3) s -= 5;

  return s;
}

const scored = jobs
  .map((j) => ({
    slug: String(j.slug),
    city: String(j.city || ''),
    category: String(j.category || ''),
    score: score(j)
  }))
  .sort((a, b) => b.score - a.score);

// Diversity caps to avoid 50 near-identical pages for one city/category
const maxPerCity = 8;
const maxPerCat = 12;

const cityCount = new Map();
const catCount = new Map();
const picked = [];

for (const it of scored) {
  if (picked.length >= (Number.isFinite(LIMIT) ? Math.max(0, LIMIT) : 50)) break;

  const cc = cityCount.get(it.city) || 0;
  const kc = catCount.get(it.category) || 0;
  if (cc >= maxPerCity || kc >= maxPerCat) continue;

  picked.push(it.slug);
  cityCount.set(it.city, cc + 1);
  catCount.set(it.category, kc + 1);
}

process.stdout.write(JSON.stringify(picked, null, 2));
