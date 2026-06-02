/**
 * Static build: Bohdan Tiutenko portfolio (UK / EN / ES / RU).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');
const TEMPLATE = path.join(SRC, 'templates', 'portfolio.html');
const SITE_DIR = path.join(SRC, 'pages', 'site');
const SITE_BASE = 'https://rybezh.site';

const PAGES = [
  { lang: 'uk', file: 'index.html', out: 'index.html', hreflang: 'uk', locale: 'uk_UA' },
  { lang: 'en', file: 'index-en.html', out: 'index-en.html', hreflang: 'en', locale: 'en_US' },
  { lang: 'es', file: 'index-es.html', out: 'index-es.html', hreflang: 'es', locale: 'es_ES' },
  { lang: 'ru', file: 'index-ru.html', out: 'index-ru.html', hreflang: 'ru', locale: 'ru_RU' },
];

const UI = {
  uk: {
    htmlLang: 'uk',
    skipLink: 'До змісту',
    brandAria: 'Богдан Тютенко — на початок',
    navAria: 'Розділи',
    navAbout: 'Про мене',
    navExp: 'Досвід',
    navGallery: 'Фото',
    navContact: 'Контакт',
    menuAria: 'Меню',
    langAria: 'Мова сайту',
    langUk: 'Українська',
    langEn: 'English',
    langEs: 'Español',
    langRu: 'Русский',
    footer: 'Богдан Тютенко · COO / операційне лідерство',
    notFoundTitle: 'Сторінку не знайдено · Богдан Тютенко',
    notFoundHome: 'На головну',
  },
  en: {
    htmlLang: 'en',
    skipLink: 'Skip to content',
    brandAria: 'Bohdan Tiutenko — back to top',
    navAria: 'Sections',
    navAbout: 'About',
    navExp: 'Experience',
    navGallery: 'Photos',
    navContact: 'Contact',
    menuAria: 'Menu',
    langAria: 'Site language',
    langUk: 'Українська',
    langEn: 'English',
    langEs: 'Español',
    langRu: 'Русский',
    footer: 'Bohdan Tiutenko · COO / operations leadership',
    notFoundTitle: 'Page not found · Bohdan Tiutenko',
    notFoundHome: 'Back to home',
  },
  es: {
    htmlLang: 'es',
    skipLink: 'Ir al contenido',
    brandAria: 'Bohdan Tiutenko — inicio',
    navAria: 'Secciones',
    navAbout: 'Sobre mí',
    navExp: 'Experiencia',
    navGallery: 'Fotos',
    navContact: 'Contacto',
    menuAria: 'Menú',
    langAria: 'Idioma del sitio',
    langUk: 'Українська',
    langEn: 'English',
    langEs: 'Español',
    langRu: 'Русский',
    footer: 'Bohdan Tiutenko · COO / liderazgo operativo',
    notFoundTitle: 'Página no encontrada · Bohdan Tiutenko',
    notFoundHome: 'Volver al inicio',
  },
  ru: {
    htmlLang: 'ru',
    skipLink: 'К содержимому',
    brandAria: 'Богдан Тютенко — в начало',
    navAria: 'Разделы',
    navAbout: 'Обо мне',
    navExp: 'Опыт',
    navGallery: 'Фото',
    navContact: 'Контакт',
    menuAria: 'Меню',
    langAria: 'Язык сайта',
    langUk: 'Українська',
    langEn: 'English',
    langEs: 'Español',
    langRu: 'Русский',
    footer: 'Богдан Тютенко · COO / операционное лидерство',
    notFoundTitle: 'Страница не найдена · Богдан Тютенко',
    notFoundHome: 'На главную',
  },
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
  const title = raw.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || 'Bohdan Tiutenko';
  const description =
    raw.match(/<meta\s+name="description"\s+content="(.*?)"/i)?.[1]?.trim() ||
    'Bohdan Tiutenko — Chief Operating Officer (COO).';
  const body = raw
    .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
    .replace(/<meta\s+name="description"\s+content=".*?">\s*/i, '')
    .trim();
  return { title, description, body };
}

function canonicalFor(page) {
  return page.out === 'index.html' ? `${SITE_BASE}/` : `${SITE_BASE}/${page.out}`;
}

function hreflangBlock() {
  const lines = PAGES.map((p) => {
    const href = canonicalFor(p);
    return `  <link rel="alternate" hreflang="${p.hreflang}" href="${href}">`;
  });
  lines.push(`  <link rel="alternate" hreflang="x-default" href="${SITE_BASE}/">`);
  return lines.join('\n');
}

function langSwitchHtml(activeLang) {
  const items = [
    { lang: 'uk', href: 'index.html', labelKey: 'langUk' },
    { lang: 'en', href: 'index-en.html', labelKey: 'langEn' },
    { lang: 'es', href: 'index-es.html', labelKey: 'langEs' },
    { lang: 'ru', href: 'index-ru.html', labelKey: 'langRu' },
  ];
  const ui = UI[activeLang];
  const links = items
    .map(({ lang, href, labelKey }) => {
      const label = ui[labelKey];
      if (lang === activeLang) {
        return `<span class="lang-switch__current" aria-current="true">${escapeHtml(label)}</span>`;
      }
      return `<a href="${href}" hreflang="${lang}" lang="${lang}">${escapeHtml(label)}</a>`;
    })
    .join('\n        ');
  return `<div class="lang-switch" role="navigation" aria-label="${escapeAttr(ui.langAria)}">\n        ${links}\n      </div>`;
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

function jsonLdPerson(lang, title, description, canonical) {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        name: 'Bohdan Tiutenko',
        alternateName: ['Богдан Тютенко'],
        jobTitle: 'Chief Operating Officer (COO)',
        description,
        url: canonical,
        email: 'mailto:jobs.r@protonmail.com',
        image: `${SITE_BASE}/assets/images/bohdan-tiutenko-painting.jpg`,
        knowsAbout: ['Operations', 'Logistics', 'Food technology', 'Last-mile delivery'],
        knowsLanguage: ['uk', 'en', 'es', 'ru'],
      },
      {
        '@type': 'WebPage',
        name: title,
        description,
        url: canonical,
        inLanguage: lang,
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
  const ui = UI[page.lang];
  const { title, description, body } = parseFragment(srcPath);
  const canonical = canonicalFor(page);

  let html = template
    .replaceAll('{{HTML_LANG}}', ui.htmlLang)
    .replace('{{TITLE}}', escapeHtml(title))
    .replace('{{DESCRIPTION}}', escapeHtml(description))
    .replace('{{CANONICAL}}', canonical)
    .replace('{{HREFLANG}}', hreflangBlock())
    .replace('{{OG_TAGS}}', ogBlock(title, description, canonical, page.locale))
    .replace('{{JSON_LD}}', jsonLdPerson(page.lang, title, description, canonical))
    .replace('{{SKIP_LINK}}', escapeHtml(ui.skipLink))
    .replace('{{BRAND_ARIA}}', escapeAttr(ui.brandAria))
    .replace('{{NAV_ARIA}}', escapeAttr(ui.navAria))
    .replace('{{NAV_ABOUT}}', escapeHtml(ui.navAbout))
    .replace('{{NAV_EXP}}', escapeHtml(ui.navExp))
    .replace('{{NAV_GALLERY}}', escapeHtml(ui.navGallery))
    .replace('{{NAV_CONTACT}}', escapeHtml(ui.navContact))
    .replace('{{MENU_ARIA}}', escapeAttr(ui.menuAria))
    .replace('{{LANG_SWITCH}}', langSwitchHtml(page.lang))
    .replace('{{YEAR}}', String(year))
    .replace('{{FOOTER_LINE}}', escapeHtml(ui.footer))
    .replace('{{CONTENT}}', body);

  return { html, canonical, ui };
}

function build() {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  const template = fs.readFileSync(TEMPLATE, 'utf8');
  const year = new Date().getFullYear();
  const hreflang = hreflangBlock();

  for (const page of PAGES) {
    const { html } = renderPage(page, template, year);
    fs.writeFileSync(path.join(DIST, page.out), html, 'utf8');
  }

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

  const sitemapUrls = PAGES.map((p) => {
    const loc = canonicalFor(p);
    return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${p.out === 'index.html' ? '1.0' : '0.9'}</priority>\n  </url>`;
  }).join('\n');
  fs.writeFileSync(
    path.join(DIST, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`,
    'utf8',
  );

  const notFoundUk = UI.uk;
  fs.writeFileSync(
    path.join(DIST, '404.html'),
    `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex">
  <title>${escapeHtml(notFoundUk.notFoundTitle)}</title>
  <link rel="stylesheet" href="portfolio.css">
</head>
<body>
  <main class="wrap" style="padding:4rem 1rem;text-align:center">
    <h1>404</h1>
    <p><a href="index.html">${escapeHtml(notFoundUk.notFoundHome)}</a></p>
  </main>
</body>
</html>`,
    'utf8',
  );

  console.log(`build: portfolio → dist/ (${PAGES.length} pages + assets)`);
}

build();
