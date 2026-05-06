/**
 * Rebuild src/pages/sitemap.xml from HTML files under src/pages (matches flat dist output).
 * Run: node scripts/rebuild-sitemap.mjs
 */
import fs from 'fs';
import path from 'path';

const PAGES_DIR = 'src/pages';
const BASE = 'https://rybezh.site/';

function walkHtml(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walkHtml(p));
    else if (ent.name.endsWith('.html')) out.push(p);
  }
  return out;
}

function priorityFor(basename) {
  if (/^index(-[a-z]{2})?\.html$/i.test(basename)) return '1.0';
  if (/^(specialists|startups|about|privacy|cookies|terms|methodology)(-[a-z]{2})?\.html$/i.test(basename)) return '0.8';
  if (/^404(-[a-z]{2})?\.html$/i.test(basename)) return '0.3';
  if (/^person-bohdan-tiutenko(-[a-z]{2})?\.html$/i.test(basename)) return '0.9';
  if (/^person-/.test(basename)) return '0.7';
  if (/^startup-/.test(basename)) return '0.65';
  return '0.7';
}

const files = walkHtml(PAGES_DIR).sort((a, b) => path.basename(a).localeCompare(path.basename(b)));
const urls = [...new Set(files.map(f => path.basename(f)))].sort();

const body = urls
  .map(name => {
    const pr = priorityFor(name);
    return `  <url>
    <loc>${BASE}${name}</loc>
    <changefreq>weekly</changefreq>
    <priority>${pr}</priority>
  </url>`;
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

fs.writeFileSync(path.join(PAGES_DIR, 'sitemap.xml'), xml);
console.log(`Wrote ${urls.length} URLs to src/pages/sitemap.xml`);
