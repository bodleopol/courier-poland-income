#!/usr/bin/env node
/*
  Simple doorway/templating audit for generated HTML.
  Usage: node tools/doorway-audit.cjs
*/

const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '..', 'dist');

if (!fs.existsSync(distDir)) {
  console.error(`dist folder not found: ${distDir}`);
  process.exit(1);
}

const postFiles = fs
  .readdirSync(distDir)
  .filter((f) => /^post-.*\.html$/i.test(f))
  .sort();

function pick(re, s) {
  const m = s.match(re);
  return m ? m[1].trim() : '';
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function bump(map, key) {
  if (!key) return;
  map.set(key, (map.get(key) || 0) + 1);
}

const titles = new Map();
const descriptions = new Map();
const h2Counts = new Map();
const shortPosts = [];

for (const file of postFiles) {
  const html = fs.readFileSync(path.join(distDir, file), 'utf8');

  const title = pick(/<title[^>]*>([^<]*)<\/title>/i, html);
  const desc = pick(
    /<meta\s+name=["']description["'][^>]*content=["']([^"']*)["']/i,
    html
  );

  bump(titles, title);
  bump(descriptions, desc);

  // Track repeated H2 headings as a proxy for templated blocks.
  const h2s = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) =>
    stripHtml(m[1]).toLowerCase()
  );
  for (const h2 of h2s) bump(h2Counts, h2);

  const text = stripHtml(html);
  const words = text ? text.split(' ').filter(Boolean).length : 0;
  if (words < 450) shortPosts.push({ file, words, title });
}

function topDups(map, minCount, max = 10) {
  return [...map.entries()]
    .filter(([k, v]) => k && v >= minCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, max);
}

const duplicateTitles = topDups(titles, 2, 20);
const duplicateDescriptions = topDups(descriptions, 2, 20);
const repeatedH2 = topDups(h2Counts, Math.max(2, Math.ceil(postFiles.length * 0.6)), 50);

console.log(
  JSON.stringify(
    {
      posts: postFiles.length,
      duplicates: {
        titles: duplicateTitles,
        descriptions: duplicateDescriptions,
      },
      repeatedHeadingsLikelyTemplates: repeatedH2,
      shortPosts,
    },
    null,
    2
  )
);
