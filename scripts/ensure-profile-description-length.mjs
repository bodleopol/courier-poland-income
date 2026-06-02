/**
 * Ensures <section class="profile-content"> has at least 300 characters
 * of visible text on hand-authored profiles and startups (not bulk-atlas).
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

function visibleLength(inner) {
  return inner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().length;
}

function processFile(filePath) {
  const base = path.basename(filePath);
  if (isBulkBasename(base)) return false;

  let html = fs.readFileSync(filePath, 'utf8');
  html = html.replace(/\n?\s*<p class="profile-prose-extension">[\s\S]*?<\/p>/gi, '');

  const reSec = /(<section\b[^>]*\bclass="[^"]*\bprofile-content\b[^"]*"[^>]*>)([\s\S]*?)(<\/section>)/i;
  const m = html.match(reSec);
  if (!m) return false;

  const inner = m[2];
  if (visibleLength(inner) >= 300) {
    if (html !== fs.readFileSync(filePath, 'utf8')) {
      fs.writeFileSync(filePath, html, 'utf8');
      return true;
    }
    return false;
  }

  if (/<p class="profile-editorial-supplement">/i.test(inner)) return false;

  const name = extractTag(html, /<h1[^>]*>([^<]*)<\/h1>/i) || 'Profile';
  const role = extractTag(html, /<h2[^>]*>([^<]*)<\/h2>/i) || '';
  const lang = langFromFile(base);
  const para = editorialSupplementParagraph(lang, name, role);
  const inject = `\n    <p class="profile-editorial-supplement">${para}</p>`;
  const nextInner = inner.trimEnd() + inject + '\n  ';
  html = html.replace(reSec, `${m[1]}${nextInner}${m[3]}`);
  fs.writeFileSync(filePath, html, 'utf8');
  return true;
}

function walk(dir, prefix) {
  let n = 0;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.html') || !f.startsWith(prefix)) continue;
    if (processFile(path.join(dir, f))) n += 1;
  }
  return n;
}

const n1 = walk(path.join(ROOT, 'src/pages/profiles'), 'person-');
const n2 = walk(path.join(ROOT, 'src/pages/startups'), 'startup-');
console.log(`ensure-profile-description-length: updated ${n1} profiles, ${n2} startups`);
