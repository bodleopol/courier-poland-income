/**
 * Static build for Bohdan Tiutenko personal portfolio (single page).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');
const TEMPLATE = path.join(SRC, 'templates', 'portfolio.html');
const INDEX_SRC = path.join(SRC, 'pages', 'site', 'index.html');
const CANONICAL = 'https://rybezh.site/';

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s*([{}:;,>])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

function minifyJs(js) {
  return js.replace(/\s+/g, ' ').replace(/\s*([{}();,:=])\s*/g, '$1').trim();
}

function parseFragment(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const title = raw.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || 'Богдан Тютенко';
  const description =
    raw.match(/<meta\s+name="description"\s+content="(.*?)"/i)?.[1]?.trim() ||
    'Богдан Тютенко — операційний директор (COO).';
  const body = raw
    .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
    .replace(/<meta\s+name="description"\s+content=".*?">\s*/i, '')
    .trim();
  return { title, description, body };
}

function copyDir(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  fs.mkdirSync(destDir, { recursive: true });
  for (const name of fs.readdirSync(srcDir)) {
    const from = path.join(srcDir, name);
    const to = path.join(destDir, name);
    if (fs.statSync(from).isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

function build() {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  const { title, description, body } = parseFragment(INDEX_SRC);
  const template = fs.readFileSync(TEMPLATE, 'utf8');
  const year = new Date().getFullYear();

  const html = template
    .replace('{{TITLE}}', escapeHtml(title))
    .replace('{{DESCRIPTION}}', escapeHtml(description))
    .replace('{{CANONICAL}}', CANONICAL)
    .replace('{{YEAR}}', String(year))
    .replace('{{CONTENT}}', body);

  fs.writeFileSync(path.join(DIST, 'index.html'), html, 'utf8');

  fs.writeFileSync(
    path.join(DIST, 'portfolio.css'),
    minifyCss(fs.readFileSync(path.join(SRC, 'portfolio.css'), 'utf8')),
    'utf8',
  );
  fs.writeFileSync(
    path.join(DIST, 'portfolio.js'),
    minifyJs(fs.readFileSync(path.join(SRC, 'portfolio.js'), 'utf8')),
    'utf8',
  );

  copyDir(path.join(SRC, 'assets'), path.join(DIST, 'assets'));

  const robots = `User-agent: *
Allow: /

Sitemap: ${CANONICAL}sitemap.xml
`;
  fs.writeFileSync(path.join(DIST, 'robots.txt'), robots, 'utf8');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${CANONICAL}</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap, 'utf8');

  const notFound = `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Сторінку не знайдено · Богдан Тютенко</title>
  <link rel="stylesheet" href="portfolio.css">
</head>
<body>
  <main class="wrap" style="padding:4rem 1rem;text-align:center">
    <h1>404</h1>
    <p><a href="/">На головну</a></p>
  </main>
</body>
</html>`;
  fs.writeFileSync(path.join(DIST, '404.html'), notFound, 'utf8');

  console.log('build: portfolio → dist/ (index.html + assets)');
}

build();
