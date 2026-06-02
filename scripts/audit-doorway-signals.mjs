#!/usr/bin/env node
import { readdir, readFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const root = path.resolve('src/pages');
const thresholdsPath = path.resolve('scripts/doorway-thresholds.json');

function isBulkAtlasPath(filePath) {
  const base = path
    .basename(filePath)
    .replace(/-(en|es|ru)\.html$/i, '.html')
    .replace(/\.html$/i, '');
  return /^(person|startup)-bulk-atlas-\d{5}$/i.test(base);
}

async function walk(dir) {
  const out = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
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

function evaluateAgainstThresholds(report, thresholds) {
  const u = report.indexable.uniformitySignals;
  const checks = [
    {
      key: 'maxDuplicateGroups',
      value: u.duplicateNormalizedTextGroups,
      pass: u.duplicateNormalizedTextGroups <= thresholds.maxDuplicateGroups,
      message: `indexable duplicateNormalizedTextGroups should be <= ${thresholds.maxDuplicateGroups}`,
    },
    {
      key: 'maxExactNormalizedDuplicates',
      value: u.maxExactNormalizedDuplicates,
      pass: u.maxExactNormalizedDuplicates <= thresholds.maxExactNormalizedDuplicates,
      message: `indexable maxExactNormalizedDuplicates should be <= ${thresholds.maxExactNormalizedDuplicates}`,
    },
    {
      key: 'minMedianIndexableHtmlSizeBytes',
      value: u.medianHtmlSizeBytes,
      pass: u.medianHtmlSizeBytes >= thresholds.minMedianIndexableHtmlSizeBytes,
      message: `indexable medianHtmlSizeBytes should be >= ${thresholds.minMedianIndexableHtmlSizeBytes}`,
    },
    {
      key: 'maxAiProseExtensionPages',
      value: report.indexable.aiProseExtensionPages,
      pass: report.indexable.aiProseExtensionPages <= thresholds.maxAiProseExtensionPages,
      message: `pages with profile-prose-extension should be <= ${thresholds.maxAiProseExtensionPages}`,
    },
  ];

  return {
    pass: checks.every((check) => check.pass),
    checks,
  };
}

async function analyzePages(files) {
  const hashCount = new Map();
  const sizeList = [];
  let aiProseExtensionPages = 0;

  for (const file of files) {
    const html = await readFile(file, 'utf8');
    if (/class="profile-prose-extension"/i.test(html)) aiProseExtensionPages += 1;
    const normalized = normalize(html);
    const hash = createHash('md5').update(normalized).digest('hex');
    hashCount.set(hash, (hashCount.get(hash) ?? 0) + 1);
    sizeList.push((await stat(file)).size);
  }

  sizeList.sort((a, b) => a - b);
  const median = sizeList.length ? sizeList[Math.floor(sizeList.length / 2)] : 0;
  const dupGroups = [...hashCount.values()].filter((c) => c > 1);

  return {
    pageCount: files.length,
    aiProseExtensionPages,
    uniformitySignals: {
      medianHtmlSizeBytes: median,
      minHtmlSizeBytes: sizeList[0] ?? 0,
      maxHtmlSizeBytes: sizeList.at(-1) ?? 0,
      duplicateNormalizedTextGroups: dupGroups.length,
      maxExactNormalizedDuplicates: dupGroups.length ? Math.max(...dupGroups) : 0,
    },
  };
}

const files = await walk(root);
const bulk = files.filter(isBulkAtlasPath);
const indexable = files.filter((f) => !isBulkAtlasPath(f));
const thresholds = JSON.parse(await readFile(thresholdsPath, 'utf8'));

const report = {
  generatedAt: new Date().toISOString(),
  totals: {
    htmlPages: files.length,
    bulkAtlasPages: bulk.length,
    indexablePages: indexable.length,
    bulkShare: files.length ? Number((bulk.length / files.length).toFixed(4)) : 0,
  },
  bulkAtlas: {
    note: 'Excluded from quality gate; noindex at build + robots.txt Disallow',
    ...(await analyzePages(bulk)),
  },
  indexable: await analyzePages(indexable),
  thresholds,
};

const gate = evaluateAgainstThresholds(report, thresholds);
report.gate = gate;

console.log(JSON.stringify(report, null, 2));

if (!gate.pass) {
  console.error('\nDoorway quality gate failed (indexable pages). Recommended fixes:');
  for (const check of gate.checks.filter((item) => !item.pass)) {
    console.error(`- [${check.key}] ${check.message}; current=${check.value}`);
  }
  process.exitCode = 1;
}
