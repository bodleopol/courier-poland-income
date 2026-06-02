#!/usr/bin/env node
/**
 * Removes legacy AI-style profile-prose-extension blocks from hand-authored pages.
 * Bulk atlas stubs are skipped (they use noindex and robots.txt disallow).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { editorialSupplementParagraph } from './profile-editorial-copy.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function isBulkBasename(name) {
  return /^(person|startup)-bulk-atlas-\d{5}(-(en|es|ru))?\.html$/i.test(name);
}

function langFromFile(f) {
  if (f.endsWith('-en.html')) return 'en';
  if (f.endsWith('-es.html')) return 'es';
  if (f.endsWith('-ru.html')) return 'ru';
  return 'uk';
}

function extractTag(html, re) {
  const m = html.match(re);
  return m ? m[1].replace(/\s+/g, ' ').trim() : '';
}

function visibleLength(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().length;
}

function processFile(filePath) {
  const base = path.basename(filePath);
  if (isBulkBasename(base)) return { stripped: 0, supplemented: false };

  let html = fs.readFileSync(filePath, 'utf8');
  const before = html;
  html = html.replace(/\n?\s*<p class="profile-prose-extension">[\s\S]*?<\/p>/gi, '');

  const reSec = /(<section\b[^>]*\bclass="[^"]*\bprofile-content\b[^"]*"[^>]*>)([\s\S]*?)(<\/section>)/i;
  const m = html.match(reSec);
  if (!m) {
    if (html !== before) fs.writeFileSync(filePath, html, 'utf8');
    return { stripped: before !== html ? 1 : 0, supplemented: false };
  }

  let supplemented = false;
  if (visibleLength(m[2]) < 300) {
    const name = extractTag(html, /<h1[^>]*>([^<]*)<\/h1>/i) || 'Profile';
    const role = extractTag(html, /<h2[^>]*>([^<]*)<\/h2>/i) || '';
    const lang = langFromFile(base);
    const para = editorialSupplementParagraph(lang, name, role);
    const inject = `\n    <p class="profile-editorial-supplement">${para}</p>`;
    const nextInner = m[2].trimEnd() + inject + '\n  ';
    html = html.replace(reSec, `${m[1]}${nextInner}${m[3]}`);
    supplemented = true;
  }

  if (html !== before) fs.writeFileSync(filePath, html, 'utf8');
  return {
    stripped: before !== html ? 1 : 0,
    supplemented,
  };
}

function walk(dir, prefix) {
  let stripped = 0;
  let supplemented = 0;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.html') || !f.startsWith(prefix)) continue;
    const r = processFile(path.join(dir, f));
    if (r.stripped) stripped += 1;
    if (r.supplemented) supplemented += 1;
  }
  return { stripped, supplemented };
}

const p = walk(path.join(ROOT, 'src/pages/profiles'), 'person-');
const s = walk(path.join(ROOT, 'src/pages/startups'), 'startup-');
console.log(
  `strip-ai-prose-extensions: cleaned ${p.stripped + s.stripped} files, added supplement to ${p.supplemented + s.supplemented}`,
);
