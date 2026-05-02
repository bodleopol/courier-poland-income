import fs from 'fs';
import path from 'path';

const SPECIALISTS_FILE = 'src/specialists.json';
const STARTUPS_FILE = 'src/startups.json';
const PAGES_DIR = 'src/pages';
const PROFILES_DIR = path.join(PAGES_DIR, 'profiles');
const BASE_URL = 'https://rybezh.site/';
const langs = ['uk', 'en', 'es', 'ru'];

const tr = {
  uk: {
    siteTitle: 'Rybezh - глобальна база спеціалістів',
    heroTitle: 'Глобальна інформаційна база людей, які змінюють технології, науку й бізнес',
    heroText: 'Профілі програмістів, інженерів, CEO, операційних директорів, дослідників, космонавтів і засновників стартапів з усього світу.',
    profiles: 'Профілі спеціалістів',
    startups: 'Стартапи',
    startupsTitle: 'Багато стартапів і технологічних компаній',
    startupsText: 'Окрема база компаній показує, які команди, продукти й операційні моделі створюють сучасну інноваційну економіку.',
    viewProfile: 'Відкрити профіль',
    viewStartup: 'Детальніше',
    country: 'Країна / регіон',
    focus: 'Фокус',
    knownFor: 'Відомий/відома за',
    biography: 'Опис життя і внеску',
    founded: 'Засновано',
    category: 'Категорія',
    specialistsCount: 'профілів спеціалістів',
    startupsCount: 'стартапів і компаній',
    languagesCount: 'мовні версії'
  },
  en: {
    siteTitle: 'Rybezh - global specialist directory',
    heroTitle: 'A global knowledge base of people shaping technology, science and business',
    heroText: 'Profiles of programmers, engineers, CEOs, operations executives, researchers, astronauts and startup founders from around the world.',
    profiles: 'Specialist profiles',
    startups: 'Startups',
    startupsTitle: 'Many startups and technology companies',
    startupsText: 'A separate company base shows which teams, products and operating models are building the modern innovation economy.',
    viewProfile: 'Open profile',
    viewStartup: 'Learn more',
    country: 'Country / region',
    focus: 'Focus',
    knownFor: 'Known for',
    biography: 'Life and contribution',
    founded: 'Founded',
    category: 'Category',
    specialistsCount: 'specialist profiles',
    startupsCount: 'startups and companies',
    languagesCount: 'language versions'
  },
  es: {
    siteTitle: 'Rybezh - base global de especialistas',
    heroTitle: 'Una base global de personas que transforman tecnología, ciencia y negocios',
    heroText: 'Perfiles de programadores, ingenieros, CEOs, directores de operaciones, investigadores, astronautas y fundadores de startups de todo el mundo.',
    profiles: 'Perfiles de especialistas',
    startups: 'Startups',
    startupsTitle: 'Muchas startups y empresas tecnológicas',
    startupsText: 'Una base separada de compañías muestra equipos, productos y modelos operativos que construyen la economía innovadora moderna.',
    viewProfile: 'Abrir perfil',
    viewStartup: 'Ver más',
    country: 'País / región',
    focus: 'Foco',
    knownFor: 'Conocido/a por',
    biography: 'Vida y contribución',
    founded: 'Fundación',
    category: 'Categoría',
    specialistsCount: 'perfiles de especialistas',
    startupsCount: 'startups y compañías',
    languagesCount: 'versiones de idioma'
  },
  ru: {
    siteTitle: 'Rybezh - глобальная база специалистов',
    heroTitle: 'Глобальная информационная база людей, меняющих технологии, науку и бизнес',
    heroText: 'Профили программистов, инженеров, CEO, операционных директоров, исследователей, космонавтов и основателей стартапов со всего мира.',
    profiles: 'Профили специалистов',
    startups: 'Стартапы',
    startupsTitle: 'Много стартапов и технологических компаний',
    startupsText: 'Отдельная база компаний показывает команды, продукты и операционные модели современной инновационной экономики.',
    viewProfile: 'Открыть профиль',
    viewStartup: 'Подробнее',
    country: 'Страна / регион',
    focus: 'Фокус',
    knownFor: 'Известен/известна благодаря',
    biography: 'Жизнь и вклад',
    founded: 'Основано',
    category: 'Категория',
    specialistsCount: 'профилей специалистов',
    startupsCount: 'стартапов и компаний',
    languagesCount: 'языковые версии'
  }
};

const suffix = lang => (lang === 'uk' ? '' : `-${lang}`);
const pageName = (base, lang) => `${base}${suffix(lang)}.html`;
const escapeHtml = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const description = (text, max = 155) => {
  const clean = String(text).replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max - 1).trim()}...` : clean;
};

const image = (src, alt, className = '') => `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}"${className ? ` class="${className}"` : ''} loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&size=720&background=eef4ff&color=2563eb';">`;
const tags = (items = []) => `<div class="tags">${items.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}</div>`;

function ensureCleanDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function writePage(filename, html) {
  fs.writeFileSync(path.join(PAGES_DIR, filename), `${html.trim()}\n`);
}

function writeProfilePage(person, lang) {
  const l = tr[lang];
  const title = `${person.name[lang]} - ${person.role[lang]} | Rybezh`;
  const file = path.join(PROFILES_DIR, pageName(`person-${person.slug}`, lang));
  const content = `
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description(person.bio[lang]))}">
<meta name="keywords" content="${escapeHtml(`${person.name[lang]}, ${person.role[lang]}, ${l.profiles}, Rybezh`)}">

<article class="content-wrapper profile-page">
  <a class="back-link" href="${pageName('index', lang)}">${escapeHtml(l.profiles)}</a>
  <header class="profile-header">
    ${image(person.image, person.name[lang], 'profile-avatar-large')}
    <div class="profile-info">
      <p class="eyebrow">${escapeHtml(person.country[lang])}</p>
      <h1>${escapeHtml(person.name[lang])}</h1>
      <h2>${escapeHtml(person.role[lang])}</h2>
      ${tags(person.tags[lang])}
    </div>
  </header>
  <section class="profile-facts">
    <div><strong>${escapeHtml(l.country)}</strong><span>${escapeHtml(person.country[lang])}</span></div>
    <div><strong>${escapeHtml(l.focus)}</strong><span>${escapeHtml(person.focus[lang])}</span></div>
    <div><strong>${escapeHtml(l.knownFor)}</strong><span>${escapeHtml(person.knownFor[lang])}</span></div>
  </section>
  <section class="profile-content">
    <h3>${escapeHtml(l.biography)}</h3>
    <p>${escapeHtml(person.bio[lang])}</p>
  </section>
</article>`;
  fs.writeFileSync(file, `${content.trim()}\n`);
}

function specialistCard(person, lang) {
  return `<article class="card profile-card">
    ${image(person.image, person.name[lang])}
    <div class="card-body">
      <p class="eyebrow">${escapeHtml(person.country[lang])}</p>
      <h3>${escapeHtml(person.name[lang])}</h3>
      <p class="meta">${escapeHtml(person.role[lang])}</p>
      ${tags(person.tags[lang].slice(0, 3))}
      <a class="btn" href="${pageName(`person-${person.slug}`, lang)}">${escapeHtml(tr[lang].viewProfile)}</a>
    </div>
  </article>`;
}

function startupCard(company, lang) {
  return `<article class="card startup-card">
    ${image(company.image, company.name)}
    <div class="card-body">
      <p class="eyebrow">${escapeHtml(tr[lang].founded)} ${escapeHtml(company.founded)}</p>
      <h3>${escapeHtml(company.name)}</h3>
      <p class="meta">${escapeHtml(company.category[lang])}</p>
      <p>${escapeHtml(company.summary[lang])}</p>
      ${tags(company.tags[lang].slice(0, 3))}
    </div>
  </article>`;
}

function writeIndex(lang, specialists, startups) {
  const l = tr[lang];
  const featured = specialists.slice(0, 12).map(person => specialistCard(person, lang)).join('\n');
  const startupPreview = startups.slice(0, 6).map(company => startupCard(company, lang)).join('\n');
  writePage(pageName('index', lang), `
<title>${escapeHtml(l.siteTitle)}</title>
<meta name="description" content="${escapeHtml(description(l.heroText))}">
<meta name="keywords" content="${escapeHtml(`${l.profiles}, ${l.startups}, programmers, engineers, CEO, researchers, astronauts`)}">

<section class="hero">
  <div class="hero-content">
    <p class="eyebrow">Rybezh People Archive</p>
    <h1>${escapeHtml(l.heroTitle)}</h1>
    <p>${escapeHtml(l.heroText)}</p>
    <div class="hero-actions">
      <a class="btn" href="#profiles">${escapeHtml(l.profiles)}</a>
      <a class="btn secondary" href="${pageName('startups', lang)}">${escapeHtml(l.startups)}</a>
    </div>
  </div>
  <div class="hero-panel">
    <div><strong>${specialists.length}</strong><span>${escapeHtml(l.specialistsCount)}</span></div>
    <div><strong>${startups.length}</strong><span>${escapeHtml(l.startupsCount)}</span></div>
    <div><strong>4</strong><span>${escapeHtml(l.languagesCount)}</span></div>
  </div>
</section>

<section class="section-head" id="profiles">
  <p class="eyebrow">${escapeHtml(l.profiles)}</p>
  <h2>${escapeHtml(l.profiles)}</h2>
</section>
<section class="grid">${featured}</section>

<section class="split-cta">
  <div>
    <p class="eyebrow">${escapeHtml(l.startups)}</p>
    <h2>${escapeHtml(l.startupsTitle)}</h2>
    <p>${escapeHtml(l.startupsText)}</p>
  </div>
  <a class="btn" href="${pageName('startups', lang)}">${escapeHtml(l.viewStartup)}</a>
</section>
<section class="grid compact-grid">${startupPreview}</section>`);
}

function writeStartups(lang, startups) {
  const l = tr[lang];
  writePage(pageName('startups', lang), `
<title>${escapeHtml(l.startupsTitle)} | Rybezh</title>
<meta name="description" content="${escapeHtml(description(l.startupsText))}">
<meta name="keywords" content="${escapeHtml(`${l.startups}, startup database, technology companies, Rybezh`)}">

<section class="hero slim">
  <div class="hero-content">
    <p class="eyebrow">${escapeHtml(l.startups)}</p>
    <h1>${escapeHtml(l.startupsTitle)}</h1>
    <p>${escapeHtml(l.startupsText)}</p>
  </div>
</section>
<section class="grid">${startups.map(company => startupCard(company, lang)).join('\n')}</section>`);
}

function writeSitemap(specialists, startups) {
  const staticPages = ['index', 'startups'];
  const urls = [];
  for (const lang of langs) {
    for (const page of staticPages) urls.push({ loc: `${BASE_URL}${pageName(page, lang)}`.replace('/index.html', '/'), priority: page === 'index' ? '1.0' : '0.9' });
    for (const person of specialists) urls.push({ loc: `${BASE_URL}${pageName(`person-${person.slug}`, lang)}`, priority: '0.8' });
  }
  void startups;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ loc, priority }) => `  <url>
    <loc>${loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  fs.writeFileSync(path.join(PAGES_DIR, 'sitemap.xml'), `${xml}\n`);
}

const specialists = JSON.parse(fs.readFileSync(SPECIALISTS_FILE, 'utf8'));
const startups = JSON.parse(fs.readFileSync(STARTUPS_FILE, 'utf8'));

ensureCleanDir(PROFILES_DIR);
for (const person of specialists) {
  for (const lang of langs) writeProfilePage(person, lang);
}
for (const lang of langs) {
  writeIndex(lang, specialists, startups);
  writeStartups(lang, startups);
}
writeSitemap(specialists, startups);

console.log(`Generated ${specialists.length * langs.length} profile pages, ${langs.length} startup pages and sitemap.xml.`);
