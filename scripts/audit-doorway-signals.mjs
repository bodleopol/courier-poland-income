#!/usr/bin/env node
import { readdir, readFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const root = path.resolve('src/pages');

async function walk(dir) {
  const out = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full));
    else if (entry.isFile() && entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

function normalize(html) {
  return html
    .toLowerCase()
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\d+/g, '0')
    .replace(/\s+/g, ' ')
    .trim();
}

const files = await walk(root);
const bulk = files.filter((f) => /bulk-atlas/.test(path.basename(f)));

const hashCount = new Map();
const sizeList = [];
for (const file of bulk) {
  const html = await readFile(file, 'utf8');
  const normalized = normalize(html);
  const hash = createHash('md5').update(normalized).digest('hex');
  hashCount.set(hash, (hashCount.get(hash) ?? 0) + 1);
  sizeList.push((await stat(file)).size);
}
sizeList.sort((a, b) => a - b);
const median = sizeList.length ? sizeList[Math.floor(sizeList.length / 2)] : 0;
const dupGroups = [...hashCount.values()].filter((c) => c > 1);

const report = {
  generatedAt: new Date().toISOString(),
  totals: {
    htmlPages: files.length,
    bulkAtlasPages: bulk.length,
  },
  uniformitySignals: {
    medianBulkHtmlSizeBytes: median,
    minBulkHtmlSizeBytes: sizeList[0] ?? 0,
    maxBulkHtmlSizeBytes: sizeList.at(-1) ?? 0,
    duplicateNormalizedTextGroups: dupGroups.length,
    maxExactNormalizedDuplicates: dupGroups.length ? Math.max(...dupGroups) : 0,
  },
};

console.log(JSON.stringify(report, null, 2));
