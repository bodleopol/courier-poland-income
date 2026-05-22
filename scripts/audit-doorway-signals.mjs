#!/usr/bin/env node
import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const root = path.resolve('src/pages');
const thresholdsPath = path.resolve('scripts/doorway-thresholds.json');
const remediationOutPath = path.resolve('notes/doorway-remediation-candidates.json');
const shouldWriteRemediation = process.argv.includes('--write-remediation');

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

function rel(file) {
  return path.relative(process.cwd(), file).replace(/\\/g, '/');
}

function evaluateAgainstThresholds(report, thresholds) {
  const checks = [
    {
      key: 'maxBulkShare',
      value: report.uniformitySignals.bulkShare,
      pass: report.uniformitySignals.bulkShare <= thresholds.maxBulkShare,
      message: `bulkShare should be <= ${thresholds.maxBulkShare}`,
    },
    {
      key: 'maxDuplicateGroups',
      value: report.uniformitySignals.duplicateNormalizedTextGroups,
      pass: report.uniformitySignals.duplicateNormalizedTextGroups <= thresholds.maxDuplicateGroups,
      message: `duplicateNormalizedTextGroups should be <= ${thresholds.maxDuplicateGroups}`,
    },
    {
      key: 'maxExactNormalizedDuplicates',
      value: report.uniformitySignals.maxExactNormalizedDuplicates,
      pass: report.uniformitySignals.maxExactNormalizedDuplicates <= thresholds.maxExactNormalizedDuplicates,
      message: `maxExactNormalizedDuplicates should be <= ${thresholds.maxExactNormalizedDuplicates}`,
    },
    {
      key: 'minMedianBulkHtmlSizeBytes',
      value: report.uniformitySignals.medianBulkHtmlSizeBytes,
      pass: report.uniformitySignals.medianBulkHtmlSizeBytes >= thresholds.minMedianBulkHtmlSizeBytes,
      message: `medianBulkHtmlSizeBytes should be >= ${thresholds.minMedianBulkHtmlSizeBytes}`,
    },
  ];

  return {
    pass: checks.every((check) => check.pass),
    checks,
  };
}

const files = await walk(root);
const bulk = files.filter((f) => /bulk-atlas/.test(path.basename(f)));

const hashCount = new Map();
const hashSamples = new Map();
const sizeList = [];
for (const file of bulk) {
  const html = await readFile(file, 'utf8');
  const normalized = normalize(html);
  const hash = createHash('md5').update(normalized).digest('hex');
  hashCount.set(hash, (hashCount.get(hash) ?? 0) + 1);
  if (!hashSamples.has(hash)) hashSamples.set(hash, []);
  const current = hashSamples.get(hash);
  if (current.length < 5) current.push(rel(file));
  sizeList.push((await stat(file)).size);
}

sizeList.sort((a, b) => a - b);
const median = sizeList.length ? sizeList[Math.floor(sizeList.length / 2)] : 0;
const dupGroups = [...hashCount.entries()].filter(([, count]) => count > 1);
const duplicateClustersTop = dupGroups
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .map(([hash, count]) => ({
    hash,
    count,
    samplePages: hashSamples.get(hash) ?? [],
  }));
const thresholds = JSON.parse(await readFile(thresholdsPath, 'utf8'));

const report = {
  generatedAt: new Date().toISOString(),
  totals: {
    htmlPages: files.length,
    bulkAtlasPages: bulk.length,
  },
  uniformitySignals: {
    bulkShare: files.length ? Number((bulk.length / files.length).toFixed(4)) : 0,
    medianBulkHtmlSizeBytes: median,
    minBulkHtmlSizeBytes: sizeList[0] ?? 0,
    maxBulkHtmlSizeBytes: sizeList.at(-1) ?? 0,
    duplicateNormalizedTextGroups: dupGroups.length,
    maxExactNormalizedDuplicates: dupGroups.length ? Math.max(...dupGroups.map(([, count]) => count)) : 0,
  },
  duplicateClustersTop,
  thresholds,
};

const gate = evaluateAgainstThresholds(report, thresholds);
report.gate = gate;

if (!gate.pass) {
  report.recommendations = [
    'Enrich pages from top duplicate clusters with unique evidence and localized insights.',
    'Apply canonical/noindex strategy per cluster until content quality is improved.',
    'Keep failed pages out of sitemap until quality gate passes.',
  ];
}

console.log(JSON.stringify(report, null, 2));

if (shouldWriteRemediation) {
  const clustersForActions = report.duplicateClustersTop.map((cluster) => {
    const [canonicalPage, ...rest] = cluster.samplePages;
    return {
      hash: cluster.hash,
      count: cluster.count,
      canonicalPage,
      noindexCandidates: rest,
      samplePages: cluster.samplePages,
    };
  });

  await writeFile(
    remediationOutPath,
    JSON.stringify(
      {
        generatedAt: report.generatedAt,
        duplicateClustersTop: clustersForActions,
        recommendations: report.recommendations ?? [],
      },
      null,
      2,
    ),
  );
  console.error(`\nSaved remediation candidates to: ${rel(remediationOutPath)}`);
}

if (!gate.pass) {
  console.error('\nDoorway quality gate failed. Recommended fixes:');
  for (const check of gate.checks.filter((item) => !item.pass)) {
    console.error(`- [${check.key}] ${check.message}; current=${check.value}`);
  }
  process.exitCode = 1;
}
