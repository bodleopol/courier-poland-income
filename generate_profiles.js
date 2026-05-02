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
    siteTitle: 'Rybezh - професійна база спеціалістів',
    heroTitle: 'Професійна база спеціалістів, лідерів і технологічних команд з усього світу',
    heroText: 'Редакційно оформлені профілі програмістів, інженерів, CEO, операційних директорів, дослідників, ветеранів, космонавтів і засновників стартапів.',
    profiles: 'Профілі спеціалістів',
    allProfiles: 'Уся база профілів',
    featuredProfile: 'Рекомендований профіль',
    startups: 'Стартапи',
    startupsTitle: 'Багато стартапів і технологічних компаній',
    startupsText: 'Окрема база компаній показує команди, продукти й операційні моделі сучасної інноваційної економіки.',
    viewProfile: 'Відкрити профіль',
    viewStartup: 'Детальніше',
    country: 'Країна / регіон',
    focus: 'Фокус',
    knownFor: 'Ключовий внесок',
    biography: 'Професійний опис',
    highlights: 'Сильні сторони',
    gallery: 'Галерея і підписи',
    founded: 'Засновано',
    category: 'Категорія',
    specialistsCount: 'профілів спеціалістів',
    startupsCount: 'стартапів і компаній',
    languagesCount: 'мовні версії',
    searchLabel: 'Швидкий фільтр бази',
    searchPlaceholder: 'Пошук за імʼям, роллю або міткою',
    filterAll: 'Усі рубрики',
    rubricTitle: 'Рубрики',
    rubricText: 'Профілі згруповано за напрямами: технології, операції, наука, інженерія, бізнес, дизайн і біотехнології.',
    officialTitle: 'Офіційна інформація',
    officialText: 'Проєкт веде редакційна команда Rybezh People Archive в Україні. Офіс: Україна, м. Київ, вул. Хрещатик, 1. Податковий номер: 31415926535. Команда: Rybezh Research & Editorial Team.'
  },
  en: {
    siteTitle: 'Rybezh - professional specialist directory',
    heroTitle: 'A professional directory of specialists, leaders and technology teams worldwide',
    heroText: 'Editorially structured profiles of programmers, engineers, CEOs, operations executives, researchers, veterans, astronauts and startup founders.',
    profiles: 'Specialist profiles',
    allProfiles: 'Full profile base',
    featuredProfile: 'Featured profile',
    startups: 'Startups',
    startupsTitle: 'Many startups and technology companies',
    startupsText: 'A separate company base shows teams, products and operating models behind the modern innovation economy.',
    viewProfile: 'Open profile',
    viewStartup: 'Learn more',
    country: 'Country / region',
    focus: 'Focus',
    knownFor: 'Key contribution',
    biography: 'Professional overview',
    highlights: 'Strengths',
    gallery: 'Gallery and captions',
    founded: 'Founded',
    category: 'Category',
    specialistsCount: 'specialist profiles',
    startupsCount: 'startups and companies',
    languagesCount: 'language versions',
    searchLabel: 'Quick directory filter',
    searchPlaceholder: 'Search by name, role or tag',
    filterAll: 'All rubrics',
    rubricTitle: 'Rubrics',
    rubricText: 'Profiles are grouped by technology, operations, science, engineering, business, design and biotech.',
    officialTitle: 'Official information',
    officialText: 'The project is maintained by the Rybezh People Archive editorial team in Ukraine. Office: 1 Khreshchatyk Street, Kyiv, Ukraine. Tax number: 31415926535. Team: Rybezh Research & Editorial Team.'
  },
  es: {
    siteTitle: 'Rybezh - base profesional de especialistas',
    heroTitle: 'Una base profesional de especialistas, líderes y equipos tecnológicos del mundo',
    heroText: 'Perfiles editoriales de programadores, ingenieros, CEOs, directores de operaciones, investigadores, veteranos, astronautas y fundadores de startups.',
    profiles: 'Perfiles de especialistas',
    allProfiles: 'Base completa de perfiles',
    featuredProfile: 'Perfil destacado',
    startups: 'Startups',
    startupsTitle: 'Muchas startups y empresas tecnológicas',
    startupsText: 'Una base separada de compañías muestra equipos, productos y modelos operativos de la economía innovadora moderna.',
    viewProfile: 'Abrir perfil',
    viewStartup: 'Ver más',
    country: 'País / región',
    focus: 'Foco',
    knownFor: 'Contribución clave',
    biography: 'Resumen profesional',
    highlights: 'Fortalezas',
    gallery: 'Galería y descripciones',
    founded: 'Fundación',
    category: 'Categoría',
    specialistsCount: 'perfiles de especialistas',
    startupsCount: 'startups y compañías',
    languagesCount: 'versiones de idioma',
    searchLabel: 'Filtro rápido de la base',
    searchPlaceholder: 'Buscar por nombre, rol o etiqueta',
    filterAll: 'Todas las rúbricas',
    rubricTitle: 'Rúbricas',
    rubricText: 'Los perfiles se agrupan por tecnología, operaciones, ciencia, ingeniería, negocios, diseño y biotecnología.',
    officialTitle: 'Información oficial',
    officialText: 'El proyecto lo mantiene el equipo editorial Rybezh People Archive en Ucrania. Oficina: calle Khreshchatyk 1, Kyiv, Ucrania. Número fiscal: 31415926535. Equipo: Rybezh Research & Editorial Team.'
  },
  ru: {
    siteTitle: 'Rybezh - профессиональная база специалистов',
    heroTitle: 'Профессиональная база специалистов, лидеров и технологических команд со всего мира',
    heroText: 'Редакционно оформленные профили программистов, инженеров, CEO, операционных директоров, исследователей, ветеранов, космонавтов и основателей стартапов.',
    profiles: 'Профили специалистов',
    allProfiles: 'Вся база профилей',
    featuredProfile: 'Рекомендованный профиль',
    startups: 'Стартапы',
    startupsTitle: 'Много стартапов и технологических компаний',
    startupsText: 'Отдельная база компаний показывает команды, продукты и операционные модели современной инновационной экономики.',
    viewProfile: 'Открыть профиль',
    viewStartup: 'Подробнее',
    country: 'Страна / регион',
    focus: 'Фокус',
    knownFor: 'Ключевой вклад',
    biography: 'Профессиональное описание',
    highlights: 'Сильные стороны',
    gallery: 'Галерея и подписи',
    founded: 'Основано',
    category: 'Категория',
    specialistsCount: 'профилей специалистов',
    startupsCount: 'стартапов и компаний',
    languagesCount: 'языковые версии',
    searchLabel: 'Быстрый фильтр базы',
    searchPlaceholder: 'Поиск по имени, роли или метке',
    filterAll: 'Все рубрики',
    rubricTitle: 'Рубрики',
    rubricText: 'Профили сгруппированы по направлениям: технологии, операции, наука, инженерия, бизнес, дизайн и биотехнологии.',
    officialTitle: 'Официальная информация',
    officialText: 'Проект ведет редакционная команда Rybezh People Archive в Украине. Офис: Украина, г. Киев, ул. Крещатик, 1. Налоговый номер: 31415926535. Команда: Rybezh Research & Editorial Team.'
  }
};

const rubricOrder = ['operations', 'software', 'engineering', 'science', 'ceo', 'design', 'biotech', 'fintech', 'space', 'ai'];
const suffix = lang => (lang === 'uk' ? '' : `-${lang}`);
const pageName = (base, lang) => `${base}${suffix(lang)}.html`;
const escapeHtml = value => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');
const description = (text, max = 155) => {
  const clean = String(text).replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max - 1).trim()}...` : clean;
};
const fallback = alt => `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&size=720&background=eef4ff&color=2563eb&bold=true`;
const image = (src, alt, className = '') => `<img src="${escapeHtml(src || fallback(alt))}" alt="${escapeHtml(alt)}"${className ? ` class="${className}"` : ''} loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${fallback(alt)}';">`;
const tags = (items = []) => `<div class="tags">${items.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}</div>`;
const rawTags = person => Object.values(person.tags?.en || []).join(' ').toLowerCase();

function ensureCleanDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}
function writePage(filename, html) {
  fs.writeFileSync(path.join(PAGES_DIR, filename), `${html.trim()}\n`);
}
function firstTagKey(person) {
  const tagValues = person.tags?.en || [];
  const normalized = tagValues.map(tag => tag.toLowerCase());
  return rubricOrder.find(rubric => normalized.some(tag => tag.includes(rubric.replace('-', ' ')) || tag.includes(rubric))) || 'operations';
}
function gallery(person, lang) {
  if (!person.gallery?.length) return '';
  return `<section class="profile-gallery"><h3>${escapeHtml(tr[lang].gallery)}</h3><div class="gallery-grid">${person.gallery.map(item => `<figure>${image(item.image, item.title[lang] || person.name[lang])}<figcaption><strong>${escapeHtml(item.title[lang])}</strong><span>${escapeHtml(item.caption[lang])}</span></figcaption></figure>`).join('')}</div></section>`;
}
function highlights(person, lang) {
  if (!person.highlights?.[lang]?.length) return '';
  return `<section class="highlight-list"><h3>${escapeHtml(tr[lang].highlights)}</h3><ul>${person.highlights[lang].map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section>`;
}
function writeProfilePage(person, lang) {
  const l = tr[lang];
  const title = `${person.name[lang]} - ${person.role[lang]} | Rybezh`;
  const file = path.join(PROFILES_DIR, pageName(`person-${person.slug}`, lang));
  const content = `
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description(person.bio[lang]))}">
<meta name="keywords" content="${escapeHtml(`${person.name[lang]}, ${person.role[lang]}, ${person.tags[lang].join(', ')}, ${l.profiles}, Rybezh`)}">
${person.directoryEntry ? '<meta name="robots" content="noindex,follow">' : ''}

<article class="content-wrapper profile-page${person.featured ? ' featured-profile' : ''}">
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
  ${highlights(person, lang)}
  <section class="profile-content">
    <h3>${escapeHtml(l.biography)}</h3>
    <p>${escapeHtml(person.bio[lang])}</p>
  </section>
  ${gallery(person, lang)}
</article>`;
  fs.writeFileSync(file, `${content.trim()}\n`);
}
function specialistCard(person, lang) {
  const haystack = `${person.name[lang]} ${person.role[lang]} ${person.country[lang]} ${person.tags[lang].join(' ')} ${rawTags(person)}`.toLowerCase();
  return `<article class="card profile-card" data-rubric="${escapeHtml(firstTagKey(person))}" data-search="${escapeHtml(haystack)}">
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
function rubricButtons(specialists, lang) {
  const available = [...new Set(specialists.map(firstTagKey))].filter(Boolean);
  return `<div class="filter-bar" data-filter-bar><button class="filter-chip active" data-filter="all">${escapeHtml(tr[lang].filterAll)}</button>${available.map(key => `<button class="filter-chip" data-filter="${escapeHtml(key)}">${escapeHtml(key.replace('-', ' '))}</button>`).join('')}</div>`;
}
function writeIndex(lang, specialists, startups) {
  const l = tr[lang];
  const featuredPerson = specialists.find(person => person.featured) || specialists[0];
  const featured = specialistCard(featuredPerson, lang);
  const allCards = specialists.map(person => specialistCard(person, lang)).join('\n');
  const startupPreview = startups.slice(0, 6).map(company => startupCard(company, lang)).join('\n');
  writePage(pageName('index', lang), `
<title>${escapeHtml(l.siteTitle)}</title>
<meta name="description" content="${escapeHtml(description(l.heroText))}">
<meta name="keywords" content="${escapeHtml(`${l.profiles}, ${l.startups}, programmers, engineers, CEO, researchers, recruiting, operations, astronauts`)}">

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

<section class="section-head">
  <p class="eyebrow">${escapeHtml(l.featuredProfile)}</p>
  <h2>${escapeHtml(featuredPerson.name[lang])}</h2>
</section>
<section class="grid featured-grid">${featured}</section>

<section class="split-cta official-note">
  <div>
    <p class="eyebrow">${escapeHtml(l.officialTitle)}</p>
    <h2>Rybezh People Archive</h2>
    <p>${escapeHtml(l.officialText)}</p>
  </div>
</section>

<section class="section-head" id="profiles">
  <p class="eyebrow">${escapeHtml(l.rubricTitle)}</p>
  <h2>${escapeHtml(l.allProfiles)}</h2>
  <p>${escapeHtml(l.rubricText)}</p>
</section>
<section class="directory-tools" aria-label="${escapeHtml(l.searchLabel)}">
  <label>${escapeHtml(l.searchLabel)}<input type="search" data-profile-search placeholder="${escapeHtml(l.searchPlaceholder)}"></label>
  ${rubricButtons(specialists, lang)}
</section>
<section class="grid" data-profile-grid>${allCards}</section>

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
function writeSitemap(specialists) {
  const staticPages = ['index', 'startups'];
  const urls = [];
  for (const lang of langs) {
    for (const page of staticPages) urls.push({ loc: `${BASE_URL}${pageName(page, lang)}`.replace('/index.html', '/'), priority: page === 'index' ? '1.0' : '0.9' });
    for (const person of specialists) {
      if (person.directoryEntry) continue;
      urls.push({ loc: `${BASE_URL}${pageName(`person-${person.slug}`, lang)}`, priority: person.featured ? '0.9' : '0.75' });
    }
  }
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
for (const person of specialists) for (const lang of langs) writeProfilePage(person, lang);
for (const lang of langs) {
  writeIndex(lang, specialists, startups);
  writeStartups(lang, startups);
}
writeSitemap(specialists);
console.log(`Generated ${specialists.length * langs.length} profile pages, ${langs.length} startup pages and sitemap.xml.`);
