/**
 * Static build: Bohdan Tiutenko one-page portfolio.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC = path.join(__dirname, 'src');
const SITE_DIR = path.join(SRC, 'pages/site');
const TEMPLATE = path.join(SRC, 'templates/portfolio.html');
const DIST = path.join(__dirname, 'dist');
const SITE_BASE = 'https://rybezh.site';

const PAGE = {
  file: 'index.html',
  out: 'index.html',
  lang: 'uk',
  locale: 'uk_UA',
};

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(s) {
  return escapeHtml(s);
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
    'Особисте портфоліо Богдана Тютенка.';
  const body = raw
    .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
    .replace(/<meta\s+name="description"\s+content=".*?">\s*/i, '')
    .trim();
  return { title, description, body };
}

function canonicalFor(page) {
  return page.out === 'index.html' ? `${SITE_BASE}/` : `${SITE_BASE}/${page.out}`;
}

function ogBlock(title, description, canonical, locale) {
  const t = escapeAttr(title);
  const d = escapeAttr(description);
  const u = escapeAttr(canonical);
  return `<meta property="og:type" content="website">
<meta property="og:title" content="${t}">
<meta property="og:description" content="${d}">
<meta property="og:url" content="${u}">
<meta property="og:locale" content="${locale}">
<meta property="og:image" content="${SITE_BASE}/assets/images/bohdan-tiutenko-painting.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${t}">
<meta name="twitter:description" content="${d}">
<meta name="twitter:image" content="${SITE_BASE}/assets/images/bohdan-tiutenko-painting.jpg">`;
}

function jsonLdPerson(title, description, canonical) {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        name: 'Богдан Тютенко',
        alternateName: ['Bohdan Tiutenko'],
        jobTitle: 'Chief Operating Officer (COO)',
        description,
        url: canonical,
        email: 'mailto:jobs.r@protonmail.com',
        image: `${SITE_BASE}/assets/images/bohdan-tiutenko-painting.jpg`,
        knowsAbout: ['Operations', 'Logistics', 'Food technology', 'Last-mile delivery', 'Power BI', 'SQL'],
        knowsLanguage: ['uk', 'es', 'en', 'ru'],
      },
      {
        '@type': 'WebPage',
        name: title,
        description,
        url: canonical,
        inLanguage: 'uk',
      },
    ],
  };
  return `<script type="application/ld+json">${JSON.stringify(graph)}</script>`;
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

function renderPage(page, template, year) {
  const srcPath = path.join(SITE_DIR, page.file);
  if (!fs.existsSync(srcPath)) {
    throw new Error(`Missing page fragment: ${srcPath}`);
  }
  const { title, description, body } = parseFragment(srcPath);
  const canonical = canonicalFor(page);

  const html = template
    .replace('{{TITLE}}', escapeHtml(title))
    .replace('{{DESCRIPTION}}', escapeHtml(description))
    .replace('{{CANONICAL}}', canonical)
    .replace('{{OG_TAGS}}', ogBlock(title, description, canonical, page.locale))
    .replace('{{JSON_LD}}', jsonLdPerson(title, description, canonical))
    .replace('{{YEAR}}', String(year))
    .replace('{{CONTENT}}', body);

  return html;
}

function build() {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  const template = fs.readFileSync(TEMPLATE, 'utf8');
  const year = new Date().getFullYear();

  fs.writeFileSync(path.join(DIST, PAGE.out), renderPage(PAGE, template, year), 'utf8');
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

  fs.writeFileSync(path.join(DIST, 'CNAME'), 'rybezh.site\n', 'utf8');

  fs.writeFileSync(
    path.join(DIST, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${SITE_BASE}/sitemap.xml\n`,
    'utf8',
  );

  fs.writeFileSync(
    path.join(DIST, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${canonicalFor(PAGE)}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`,
    'utf8',
  );

  fs.writeFileSync(
    path.join(DIST, '404.html'),
    `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex">
  <title>Сторінку не знайдено · Богдан Тютенко</title>
  <link rel="stylesheet" href="portfolio.css">
</head>
<body>
  <main class="wrap" style="padding:4rem 1rem;text-align:center">
    <h1>404</h1>
    <p><a href="index.html">На головну</a></p>
  </main>
</body>
</html>`,
    'utf8',
  );

  console.log('build: Bohdan Tiutenko portfolio → dist/ (1 page + assets)');
}

build();
