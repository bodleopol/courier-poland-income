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

const PAGES = [
  {
    file: 'index.html', out: 'index.html', lang: 'uk', locale: 'uk_UA',
    nav: { about: 'Профіль', work: 'Досвід', approach: 'Підхід', photos: 'Фото', contact: 'Контакт' }
  },
  {
    file: 'index-en.html', out: 'en/index.html', lang: 'en', locale: 'en_US',
    nav: { about: 'Profile', work: 'Experience', approach: 'Approach', photos: 'Photos', contact: 'Contact' }
  },
  {
    file: 'index-es.html', out: 'es/index.html', lang: 'es', locale: 'es_PE',
    nav: { about: 'Perfil', work: 'Experiencia', approach: 'Enfoque', photos: 'Fotos', contact: 'Contacto' }
  },
  {
    file: 'index-ru.html', out: 'ru/index.html', lang: 'ru', locale: 'ru_RU',
    nav: { about: 'Профиль', work: 'Опыт', approach: 'Подход', photos: 'Фото', contact: 'Контакт' }
  }
];

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
  if (page.out === 'index.html') return `${SITE_BASE}/`;
  if (page.out.endsWith('/index.html')) return `${SITE_BASE}/${page.out.replace('/index.html', '/')}`;
  return `${SITE_BASE}/${page.out}`;
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

  // Build hreflang tags
  const hreflangTags = PAGES.map(p => {
    return `<link rel="alternate" hreflang="${p.lang}" href="${canonicalFor(p)}">`;
  }).join('\n  ');

  // Full language switcher
  const langSwitchHtml = `<div class="lang-switcher">
    ${PAGES.map(p => {
      const isCurrent = p.lang === page.lang;
      let targetHref = '';
      if (page.out.includes('/')) {
        targetHref = p.out === 'index.html' ? '../' : `../${p.out.replace('index.html', '')}`;
      } else {
        targetHref = p.out === 'index.html' ? '' : p.out.replace('index.html', '');
      }
      return `<a href="${targetHref || './'}" hreflang="${p.lang}" class="${isCurrent ? 'active' : ''}">${p.lang.toUpperCase()}</a>`;
    }).join(' ')}
  </div>`;

  // Fix assets path for subdirectories
  const assetsPrefix = page.out.includes('/') ? '../' : '';

  let html = template
    .replace(/{{LANG}}/g, page.lang)
    .replace('{{TITLE}}', escapeHtml(title))
    .replace('{{DESCRIPTION}}', escapeHtml(description))
    .replace('{{CANONICAL}}', canonical)
    .replace('{{HREFLANG_TAGS}}', hreflangTags)
    .replace('{{OG_TAGS}}', ogBlock(title, description, canonical, page.locale))
    .replace('{{JSON_LD}}', jsonLdPerson(title, description, canonical))
    .replace('{{YEAR}}', String(year))
    .replace(/{{NAV_ABOUT}}/g, escapeHtml(page.nav.about))
    .replace(/{{NAV_WORK}}/g, escapeHtml(page.nav.work))
    .replace(/{{NAV_APPROACH}}/g, escapeHtml(page.nav.approach))
    .replace(/{{NAV_PHOTOS}}/g, escapeHtml(page.nav.photos))
    .replace(/{{NAV_CONTACT}}/g, escapeHtml(page.nav.contact))
    .replace(/{{LANG_SWITCH}}/g, langSwitchHtml)
    .replace('{{CONTENT}}', () => body);

  // Fix asset paths
  html = html.replace(/(href|src)="assets\//g, `$1="${assetsPrefix}assets/`);
  html = html.replace(/(href|src)="portfolio\./g, `$1="${assetsPrefix}portfolio.`);

  return html;
}

function build() {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  const template = fs.readFileSync(TEMPLATE, 'utf8');
  const year = new Date().getFullYear();

  PAGES.forEach(page => {
    const outPath = path.join(DIST, page.out);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, renderPage(page, template, year), 'utf8');
  });

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

  const sitemapUrls = PAGES.map(p => `  <url>\n    <loc>${canonicalFor(p)}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${p.lang === 'uk' ? '1.0' : '0.8'}</priority>\n  </url>`).join('\n');
  fs.writeFileSync(
    path.join(DIST, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`,
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

  console.log(`build: Bohdan Tiutenko portfolio → dist/ (${PAGES.length} pages + assets)`);
}

build();
