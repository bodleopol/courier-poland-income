#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(process.cwd(), 'src');

function readJsonIfExists(relativePath) {
  const fullPath = path.join(process.cwd(), relativePath);
  if (!fs.existsSync(fullPath)) return null;
  return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
}

function getAllHtmlFiles() {
  return fs.readdirSync(SRC_DIR)
    .filter((file) => file.endsWith('.html'))
    .map((file) => path.join(SRC_DIR, file));
}

function extractTitle(html) {
  const match = html.match(/<title>([\s\S]*?)<\/title>/i);
  return match ? match[1].trim() : '';
}

function extractMetaDescription(html) {
  const match = html.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i);
  return match ? match[1].trim() : '';
}

function countWords(text) {
  return (text
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .match(/[\p{L}\p{N}]{2,}/gu) || []).length;
}

function countOccurrences(haystack, needle) {
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escaped, 'gi');
  return (haystack.match(regex) || []).length;
}

function runAudit() {
  const jobsData = readJsonIfExists('src/jobs-data.json') || [];
  const indexable = readJsonIfExists('src/indexable-vacancies.json') || [];
  const htmlFiles = getAllHtmlFiles();

  const duplicateTitles = new Map();
  const shortPages = [];
  let missingDescription = 0;

  const templatePhrases = [
    'Який тип договору',
    'Документи: PESEL',
    'Графік: скільки годин',
    'Що входить у задачі на старті'
  ];

  const phraseStats = Object.fromEntries(templatePhrases.map((p) => [p, 0]));

  htmlFiles.forEach((filePath) => {
    const html = fs.readFileSync(filePath, 'utf8');
    const pageName = path.basename(filePath);

    const title = extractTitle(html);
    if (title) {
      duplicateTitles.set(title, (duplicateTitles.get(title) || 0) + 1);
    }

    const description = extractMetaDescription(html);
    if (!description) missingDescription += 1;

    const words = countWords(html);
    if (words < 220) {
      shortPages.push({ page: pageName, words });
    }

    templatePhrases.forEach((phrase) => {
      if (countOccurrences(html, phrase) > 0) {
        phraseStats[phrase] += 1;
      }
    });
  });

  const duplicatedTitleGroups = [...duplicateTitles.entries()].filter(([, count]) => count > 1);

  console.log('=== Rybezh content quality check ===');
  console.log(`HTML pages in src: ${htmlFiles.length}`);
  console.log(`Jobs in jobs-data.json: ${jobsData.length}`);
  console.log(`Indexable vacancies listed: ${indexable.length}`);
  console.log(`Pages without meta description: ${missingDescription}`);
  console.log(`Pages with < 220 words: ${shortPages.length}`);
  console.log(`Duplicate <title> groups: ${duplicatedTitleGroups.length}`);

  if (duplicatedTitleGroups.length) {
    console.log('\nTop duplicate title groups:');
    duplicatedTitleGroups
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([title, count]) => console.log(`- (${count}) ${title}`));
  }

  if (shortPages.length) {
    console.log('\nShortest pages:');
    shortPages
      .sort((a, b) => a.words - b.words)
      .slice(0, 10)
      .forEach((entry) => console.log(`- ${entry.page}: ${entry.words} words`));
  }

  console.log('\nTemplate phrase presence (number of pages):');
  Object.entries(phraseStats).forEach(([phrase, count]) => {
    console.log(`- ${phrase}: ${count}`);
  });

  const qualityWarnings = [];
  if (missingDescription > 0) qualityWarnings.push('missing meta descriptions');
  if (duplicatedTitleGroups.length > 0) qualityWarnings.push('duplicate page titles');

  if (qualityWarnings.length) {
    console.warn(`\nQuality warnings: ${qualityWarnings.join(', ')}.`);
    console.warn('Use this report as backlog for iterative cleanup (no hard fail).');
    return;
  }

  console.log('\nQuality gate passed.');
}

runAudit();
