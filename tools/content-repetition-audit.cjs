#!/usr/bin/env node
/*
  Content repetition audit for vacancies and blog posts.
  - Reads src/content.json (vacancies) and src/posts.json (blog)
  - Extracts list items and plain text
  - Reports duplicate titles/excerpts, top repeated list items, and boilerplate ratios

  Usage:
    node tools/content-repetition-audit.cjs
*/

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const contentPath = path.join(root, 'src', 'content.json');
const postsPath = path.join(root, 'src', 'posts.json');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function stripHtml(html) {
  return String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function extractLiText(html) {
  const s = String(html || '');
  const lis = [...s.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map((m) => stripHtml(m[1]));
  return lis.filter(Boolean);
}

function bump(map, key) {
  if (!key) return;
  map.set(key, (map.get(key) || 0) + 1);
}

function topEntries(map, { min = 2, max = 30 } = {}) {
  return [...map.entries()]
    .filter(([k, v]) => k && v >= min)
    .sort((a, b) => b[1] - a[1])
    .slice(0, max);
}

function normalizeKey(s) {
  return stripHtml(String(s || '')).toLowerCase();
}

function buildBoilerplateSet(items, threshold) {
  const counts = new Map();
  for (const it of items) bump(counts, normalizeKey(it));
  const boiler = new Set();
  for (const [k, v] of counts.entries()) {
    if (v >= threshold) boiler.add(k);
  }
  return { boiler, counts };
}

function calcBoilerplateRatio(docItems, boilerSet) {
  const norm = docItems.map(normalizeKey).filter(Boolean);
  if (!norm.length) return 0;
  let hits = 0;
  for (const it of norm) if (boilerSet.has(it)) hits++;
  return hits / norm.length;
}

function auditVacancies(vacancies) {
  const titles = new Map();
  const excerpts = new Map();
  const liAllUA = [];
  const liAllPL = [];

  for (const v of vacancies) {
    bump(titles, normalizeKey(v.title));
    bump(excerpts, normalizeKey(v.excerpt));
    liAllUA.push(...extractLiText(v.body));
    liAllPL.push(...extractLiText(v.body_pl));
  }

  const uaThreshold = Math.max(10, Math.ceil(vacancies.length * 0.15));
  const plThreshold = Math.max(10, Math.ceil(vacancies.length * 0.15));

  const uaBoiler = buildBoilerplateSet(liAllUA, uaThreshold);
  const plBoiler = buildBoilerplateSet(liAllPL, plThreshold);

  const perVacancy = vacancies
    .map((v) => {
      const uaLis = extractLiText(v.body);
      const plLis = extractLiText(v.body_pl);
      return {
        slug: v.slug,
        category: v.category,
        city: v.city_pl || v.city,
        title: v.title_pl || v.title,
        ua_li: uaLis.length,
        pl_li: plLis.length,
        boiler_ua: calcBoilerplateRatio(uaLis, uaBoiler.boiler),
        boiler_pl: calcBoilerplateRatio(plLis, plBoiler.boiler),
      };
    })
    .sort((a, b) => (b.boiler_pl + b.boiler_ua) - (a.boiler_pl + a.boiler_ua));

  const worst = perVacancy.slice(0, 20);

  return {
    count: vacancies.length,
    duplicates: {
      titles: topEntries(titles, { min: 2, max: 20 }),
      excerpts: topEntries(excerpts, { min: 2, max: 20 }),
    },
    repetition: {
      threshold: { uaLiCount: uaThreshold, plLiCount: plThreshold },
      topRepeatedLiUA: topEntries(uaBoiler.counts, { min: uaThreshold, max: 30 }),
      topRepeatedLiPL: topEntries(plBoiler.counts, { min: plThreshold, max: 30 }),
      worstBoilerplatePages: worst,
    },
  };
}

function extractHeadings(html) {
  const s = String(html || '');
  const h2s = [...s.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) => stripHtml(m[1]).toLowerCase());
  const h3s = [...s.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)].map((m) => stripHtml(m[1]).toLowerCase());
  return { h2s: h2s.filter(Boolean), h3s: h3s.filter(Boolean) };
}

function auditPosts(posts) {
  const titles = new Map();
  const excerpts = new Map();
  const h2CountsUA = new Map();
  const h2CountsPL = new Map();
  const liAllUA = [];
  const liAllPL = [];

  for (const p of posts) {
    bump(titles, normalizeKey(p.title));
    bump(excerpts, normalizeKey(p.excerpt));

    const uaHeads = extractHeadings(p.body);
    const plHeads = extractHeadings(p.body_pl);
    for (const h of uaHeads.h2s) bump(h2CountsUA, h);
    for (const h of plHeads.h2s) bump(h2CountsPL, h);

    liAllUA.push(...extractLiText(p.body));
    liAllPL.push(...extractLiText(p.body_pl));
  }

  const thresholdH2 = Math.max(3, Math.ceil(posts.length * 0.5));
  const liThreshold = Math.max(5, Math.ceil(posts.length * 0.25));
  const uaBoiler = buildBoilerplateSet(liAllUA, liThreshold);
  const plBoiler = buildBoilerplateSet(liAllPL, liThreshold);

  return {
    count: posts.length,
    duplicates: {
      titles: topEntries(titles, { min: 2, max: 20 }),
      excerpts: topEntries(excerpts, { min: 2, max: 20 }),
    },
    repetition: {
      repeatedH2_ua: topEntries(h2CountsUA, { min: thresholdH2, max: 40 }),
      repeatedH2_pl: topEntries(h2CountsPL, { min: thresholdH2, max: 40 }),
      topRepeatedLiUA: topEntries(uaBoiler.counts, { min: liThreshold, max: 30 }),
      topRepeatedLiPL: topEntries(plBoiler.counts, { min: liThreshold, max: 30 }),
    },
  };
}

function main() {
  if (!fs.existsSync(contentPath)) {
    console.error(`Missing ${contentPath}. Run: node src/generate-jobs.js`);
    process.exit(1);
  }
  if (!fs.existsSync(postsPath)) {
    console.error(`Missing ${postsPath}`);
    process.exit(1);
  }

  const vacancies = readJson(contentPath);
  const posts = readJson(postsPath);

  const result = {
    vacancies: auditVacancies(vacancies),
    posts: auditPosts(posts),
  };

  console.log(JSON.stringify(result, null, 2));
}

main();
