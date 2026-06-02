/**
 * Generates additional static person and startup HTML fragments plus
 * per-locale catalog cards. Wired into `node build.js` before site-search-index.
 *
 * Configure with environment variables:
 *   CATALOG_BULK_PEOPLE   (default 1930 — >2000 specialist HTML pages incl. four locales)
 *   CATALOG_BULK_STARTUPS (default 1460 — >1500 startup HTML pages incl. four locales)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PERSON_PHOTOS, WORKPLACE_PHOTOS } from './bulk-catalog-photo-pools.mjs';
import {
  personDisplayName,
  startupDisplayName,
  personMetaDescription,
  startupMetaDescription,
  personProfileParagraphs,
  startupProfileParagraphs,
  personFocusDetail,
  imgAltPerson,
  imgAltStartup
} from './bulk-catalog-identity.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROFILES = path.join(ROOT, 'src/pages/profiles');
const STARTUPS_DIR = path.join(ROOT, 'src/pages/startups');
const SITE = path.join(ROOT, 'src/pages/site');

const BULK_PEOPLE = Math.max(0, parseInt(process.env.CATALOG_BULK_PEOPLE || '1930', 10));
const BULK_STARTUPS = Math.max(0, parseInt(process.env.CATALOG_BULK_STARTUPS || '1460', 10));

function hash32(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick(arr, seed) {
  return arr[seed % arr.length];
}

const FILTER_KEYS = ['operations', 'software', 'engineering', 'science', 'ceo'];
const STARTUP_KEYS = ['software', 'fintech', 'operations', 'design', 'hardware'];

const LOCALES = {
  uk: {
    suffix: '',
    specialists: 'specialists.html',
    startups: 'startups.html',
    countriesPeople: [
      'Україна',
      'США',
      'Канада',
      'Велика Британія',
      'Німеччина / США',
      'Франція',
      'Ізраїль / США',
      'Польща',
      'Швеція',
      'Нідерланди / США'
    ],
    countriesStartup: [
      'США',
      'Велика Британія',
      'Канада',
      'Україна',
      'Париж',
      'Сан-Франциско',
      'Амстердам',
      'Київ',
      'Нью-Йорк',
      'Лондон',
      'Маямі',
      'Австралія',
      'Франція',
      'віддалено',
      'віддалена команда'
    ],
    personRole: (k) =>
      ({
        operations: 'Операційний лідер',
        software: 'Інженерка / інженер ПЗ',
        engineering: 'Системна інженерія',
        science: 'Дослідниця / дослідник',
        ceo: 'CEO / співзасновниця'
      })[k],
    startupRole: (k) =>
      ({
        software: 'Продуктова платформа',
        fintech: 'Фінтех-інфраструктура',
        operations: 'Операційний софт',
        design: 'Дизайн-системи',
        hardware: 'Апаратний стек'
      })[k],
    readBtn: 'Прочитати',
    startupRead: 'Прочитати',
    backPeople: 'До архіву експертів',
    backStartup: 'Усі стартапи',
    tagSets: {
      operations: ['Операції', 'Логістика', 'Процеси'],
      software: ['Програмування', 'Платформа', 'API'],
      engineering: ['Інженерія', 'Інфраструктура', 'Надійність'],
      science: ['Наука', 'Дослідження', 'Дані'],
      ceo: ['CEO', 'Лідерство', 'Стратегія']
    },
    stags: {
      software: ['Програмування', 'Стартапи', 'Хмара'],
      fintech: ['Фінтех', 'Платежі', 'Комплаєнс'],
      operations: ['Операції', 'Автоматизація', 'B2B'],
      design: ['Дизайн', 'Продукт', 'UX'],
      hardware: ['Апаратура', 'Виробництво', 'Логістика']
    },
    foundedEyebrow: (y) => `Засновано ${y}`,
    metaPerson: (name, role) =>
      `${name}: ${role}. Короткий орієнтир у каталозі Rybezh; факти звіряйте з первинними джерелами.`,
    metaStartup: (name, role) =>
      `${name}: ${role}. Короткий орієнтир у каталозі Rybezh; дані компанії перевіряйте на офіційному сайті.`
  },
  en: {
    suffix: '-en',
    specialists: 'specialists-en.html',
    startups: 'startups-en.html',
    countriesPeople: [
      'Ukraine',
      'United States',
      'Canada',
      'United Kingdom',
      'Germany / United States',
      'France',
      'Israel / United States',
      'Poland',
      'Sweden',
      'Netherlands / United States'
    ],
    countriesStartup: [
      'United States',
      'United Kingdom',
      'Canada',
      'Ukraine',
      'Paris',
      'San Francisco',
      'Amsterdam',
      'Kyiv',
      'New York',
      'London',
      'Miami',
      'Australia',
      'France',
      'remote',
      'Remote-first'
    ],
    personRole: (k) =>
      ({
        operations: 'Operations lead',
        software: 'Software engineer',
        engineering: 'Systems engineering',
        science: 'Research scientist',
        ceo: 'CEO / co-founder'
      })[k],
    startupRole: (k) =>
      ({
        software: 'Product platform',
        fintech: 'Fintech infrastructure',
        operations: 'Operations software',
        design: 'Design systems',
        hardware: 'Hardware stack'
      })[k],
    readBtn: 'Read',
    startupRead: 'Read',
    backPeople: 'Back to experts',
    backStartup: 'All startups',
    tagSets: {
      operations: ['Operations', 'Logistics', 'Process'],
      software: ['Software', 'Platform', 'API'],
      engineering: ['Engineering', 'Infrastructure', 'Reliability'],
      science: ['Science', 'Research', 'Data'],
      ceo: ['CEO', 'Leadership', 'Strategy']
    },
    stags: {
      software: ['Software', 'Startups', 'Cloud'],
      fintech: ['Fintech', 'Payments', 'Compliance'],
      operations: ['Operations', 'Automation', 'B2B'],
      design: ['Design', 'Product', 'UX'],
      hardware: ['Hardware', 'Manufacturing', 'Logistics']
    },
    foundedEyebrow: (y) => `Founded ${y}`,
    metaPerson: (name, role) =>
      `${name}: ${role}. Short Rybezh directory note—verify facts with primary sources.`,
    metaStartup: (name, role) =>
      `${name}: ${role}. Short Rybezh directory note—verify company facts on the official site.`
  },
  es: {
    suffix: '-es',
    specialists: 'specialists-es.html',
    startups: 'startups-es.html',
    countriesPeople: [
      'Ucrania',
      'Estados Unidos',
      'Canadá',
      'Reino Unido',
      'Alemania / Estados Unidos',
      'Francia',
      'Israel / Estados Unidos',
      'Polonia',
      'Suecia',
      'Países Bajos / Estados Unidos'
    ],
    countriesStartup: [
      'Estados Unidos',
      'Reino Unido',
      'Canadá',
      'Ucrania',
      'París',
      'San Francisco',
      'Ámsterdam',
      'Kyiv',
      'Nueva York',
      'Londres',
      'Miami',
      'Australia',
      'Francia',
      'remoto',
      'equipo remote-first'
    ],
    personRole: (k) =>
      ({
        operations: 'Liderazgo de operaciones',
        software: 'Ingeniería de software',
        engineering: 'Ingeniería de sistemas',
        science: 'Investigación científica',
        ceo: 'CEO / cofundadora'
      })[k],
    startupRole: (k) =>
      ({
        software: 'Plataforma de producto',
        fintech: 'Infraestructura fintech',
        operations: 'Software operativo',
        design: 'Sistemas de diseño',
        hardware: 'Stack de hardware'
      })[k],
    readBtn: 'Leer',
    startupRead: 'Ver más',
    backPeople: 'Volver a especialistas',
    backStartup: 'Todas las startups',
    tagSets: {
      operations: ['Operaciones', 'Logística', 'Proceso'],
      software: ['Software', 'Plataforma', 'API'],
      engineering: ['Ingeniería', 'Infraestructura', 'Fiabilidad'],
      science: ['Ciencia', 'Investigación', 'Datos'],
      ceo: ['CEO', 'Liderazgo', 'Estrategia']
    },
    stags: {
      software: ['Software', 'Startups', 'Nube'],
      fintech: ['Fintech', 'Pagos', 'Cumplimiento'],
      operations: ['Operaciones', 'Automatización', 'B2B'],
      design: ['Diseño', 'Producto', 'UX'],
      hardware: ['Hardware', 'Fabricación', 'Logística']
    },
    foundedEyebrow: (y) => `Fundada en ${y}`,
    metaPerson: (name, role) =>
      `${name}: ${role}. Nota breve del directorio Rybezh; contrastar con fuentes primarias.`,
    metaStartup: (name, role) =>
      `${name}: ${role}. Nota breve del directorio Rybezh; verificar datos en el sitio oficial.`
  },
  ru: {
    suffix: '-ru',
    specialists: 'specialists-ru.html',
    startups: 'startups-ru.html',
    countriesPeople: [
      'Украина',
      'США',
      'Канада',
      'Великобритания',
      'Германия / США',
      'Франция',
      'Израиль / США',
      'Польша',
      'Швеция',
      'Нидерланды / США'
    ],
    countriesStartup: [
      'США',
      'Великобритания',
      'Канада',
      'Украина',
      'Париж',
      'Сан-Франциско',
      'Амстердам',
      'Киев',
      'Нью-Йорк',
      'Лондон',
      'Майами',
      'Австралия',
      'Франция',
      'удаленно',
      'удаленная команда'
    ],
    personRole: (k) =>
      ({
        operations: 'Операционный лидер',
        software: 'Инженер ПО',
        engineering: 'Системная инженерия',
        science: 'Исследователь',
        ceo: 'CEO / сооснователь'
      })[k],
    startupRole: (k) =>
      ({
        software: 'Продуктовая платформа',
        fintech: 'Финтех-инфраструктура',
        operations: 'Операционный софт',
        design: 'Дизайн-системы',
        hardware: 'Аппаратный стек'
      })[k],
    readBtn: 'Читать',
    startupRead: 'Читать',
    backPeople: 'К архиву экспертов',
    backStartup: 'Все стартапы',
    tagSets: {
      operations: ['Операции', 'Логистика', 'Процессы'],
      software: ['Программирование', 'Платформа', 'API'],
      engineering: ['Инженерия', 'Инфраструктура', 'Надёжность'],
      science: ['Наука', 'Исследования', 'Данные'],
      ceo: ['CEO', 'Лидерство', 'Стратегия']
    },
    stags: {
      software: ['Программирование', 'Стартапы', 'Облако'],
      fintech: ['Финтех', 'Платежи', 'Комплаенс'],
      operations: ['Операции', 'Автоматизация', 'B2B'],
      design: ['Дизайн', 'Продукт', 'UX'],
      hardware: ['Железо', 'Производство', 'Логистика']
    },
    foundedEyebrow: (y) => `Основана в ${y}`,
    metaPerson: (name, role) =>
      `${name}: ${role}. Краткая справка в каталоге Rybezh; сверяйте факты с первичными источниками.`,
    metaStartup: (name, role) =>
      `${name}: ${role}. Краткая справка в каталоге Rybezh; проверяйте данные на официальном сайте компании.`
  }
};

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function stripBulkMarkers(html, kind) {
  const tag = kind === 'people' ? 'bulk-catalog-people' : 'bulk-catalog-startups';
  const re = new RegExp(`<!--emit:${tag}-->[\\s\\S]*?<!--/emit:${tag}-->`, 'g');
  return html.replace(re, `<!--emit:${tag}--><!--/emit:${tag}-->`);
}

function maxCatalogOrder(html) {
  let m = -1;
  html.replace(/data-catalog-order="(\d+)"/g, (_, d) => {
    const v = parseInt(d, 10);
    if (!Number.isNaN(v) && v > m) m = v;
  });
  return m;
}

function countDirectoryCards(html) {
  const matches = html.match(/data-directory-card/g);
  return matches ? matches.length : 0;
}

function patchResultsCount(html, n) {
  return html.replace(/<strong data-results-count>\s*\d+\s*<\/strong>/i, `<strong data-results-count>${n}</strong>`);
}

function injectBetweenMarkers(html, kind, inner) {
  const tag = kind === 'people' ? 'bulk-catalog-people' : 'bulk-catalog-startups';
  const needle = `<!--emit:${tag}--><!--/emit:${tag}-->`;
  if (!html.includes(needle)) {
    throw new Error(`Missing marker ${needle} — add markers to catalog HTML`);
  }
  return html.replace(needle, `<!--emit:${tag}-->\n${inner}\n<!--/emit:${tag}-->`);
}

function tagsHtml(tags) {
  return tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('');
}

function personSlug(n) {
  return `person-bulk-atlas-${String(n).padStart(5, '0')}`;
}

function startupSlug(n) {
  return `startup-bulk-atlas-${String(n).padStart(5, '0')}`;
}

function pickPersonPhoto(langKey, slug) {
  return pick(PERSON_PHOTOS, hash32(`${slug}|${langKey}|avatar`));
}

function pickStartupPhoto(langKey, slug) {
  return pick(WORKPLACE_PHOTOS, hash32(`${slug}|${langKey}|cover`));
}

function writePersonFile(langKey, n) {
  const L = LOCALES[langKey];
  const fk = FILTER_KEYS[n % FILTER_KEYS.length];
  const country = L.countriesPeople[n % L.countriesPeople.length];
  const name = personDisplayName(n, langKey);
  const role = L.personRole(fk);
  const tags = L.tagSets[fk];
  const slug = personSlug(n);
  const img = pickPersonPhoto(langKey, slug);
  const file = path.join(PROFILES, `${slug}${L.suffix}.html`);
  const hrefSpec = L.specialists;
  const title = `${name} — ${role} | Rybezh`;
  const paras = personProfileParagraphs(langKey, n, name, role, country, fk);
  const bodyParas = paras.map((t) => `    <p>${esc(t)}</p>`).join('\n');
  const imgAlt = imgAltPerson(langKey, name);
  const focusDetail = personFocusDetail(langKey, role, fk);
  const metaDesc = personMetaDescription(langKey, name, role, country, fk);

  const body = `<title>${esc(title)}</title>
<meta name="description" content="${esc(metaDesc)}">
<meta name="robots" content="noindex,follow">

<article class="content-wrapper profile-page">
  <a class="back-link" href="${hrefSpec}">${esc(L.backPeople)}</a>
  <header class="profile-header">
    <img src="${esc(img)}" alt="${esc(imgAlt)}" class="profile-avatar-large" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=720&background=eef4ff&color=2563eb&bold=true';">
    <div class="profile-info">
      <p class="eyebrow">${esc(country)}</p>
      <h1>${esc(name)}</h1>
      <h2>${esc(role)}</h2>
      <div class="tags">${tagsHtml(tags)}</div>
    </div>
  </header>
  <section class="profile-facts">
    <div><strong>${langKey === 'uk' ? 'Країна / регіон' : langKey === 'en' ? 'Country / region' : langKey === 'es' ? 'País / región' : 'Страна / регион'}</strong><span>${esc(country)}</span></div>
    <div><strong>${langKey === 'uk' ? 'Професійний фокус' : langKey === 'en' ? 'Professional focus' : langKey === 'es' ? 'Enfoque profesional' : 'Профессиональный фокус'}</strong><span>${esc(focusDetail)}</span></div>
    <div><strong>${langKey === 'uk' ? 'Сегмент каталогу' : langKey === 'en' ? 'Catalogue segment' : langKey === 'es' ? 'Segmento del catálogo' : 'Сегмент каталога'}</strong><span>${esc(fk)}</span></div>
  </section>
  <section class="profile-content">
    <h3>${langKey === 'uk' ? 'Професійний огляд' : langKey === 'en' ? 'Professional overview' : langKey === 'es' ? 'Resumen profesional' : 'Профессиональный обзор'}</h3>
${bodyParas}
  </section>
  <section class="editorial-note">
    <h3>${langKey === 'uk' ? 'Редакційна примітка' : langKey === 'en' ? 'Editorial note' : langKey === 'es' ? 'Nota editorial' : 'Редакционная заметка'}</h3>
    <p>${langKey === 'uk' ? 'Редакційний знімок каталогу Rybezh: ім’я та опис допомагають орієнтуватися у фільтрах. Перед рішеннями звіряйте факти з первинними джерелами.' : langKey === 'en' ? 'Rybezh editorial catalogue snapshot: the name and copy help you browse filters. Verify facts with primary sources before decisions.' : langKey === 'es' ? 'Instantánea editorial del catálogo Rybezh: el nombre y el texto ayudan a navegar filtros. Verifica hechos en fuentes primarias antes de decidir.' : 'Редакционный снимок каталога Rybezh: имя и текст помогают ориентироваться в фильтрах. Перед решениями сверяйте факты с первичными источниками.'}</p>
  </section>
</article>
`;
  fs.writeFileSync(file, body, 'utf8');
}

function writeStartupFile(langKey, n) {
  const L = LOCALES[langKey];
  const fk = STARTUP_KEYS[n % STARTUP_KEYS.length];
  const country = L.countriesStartup[n % L.countriesStartup.length];
  const name = startupDisplayName(n, langKey);
  const role = L.startupRole(fk);
  const tags = L.stags[fk];
  const slug = startupSlug(n);
  const img = pickStartupPhoto(langKey, slug);
  const file = path.join(STARTUPS_DIR, `${slug}${L.suffix}.html`);
  const hrefSt = L.startups;
  const title = `${name} - ${role} | Rybezh`;
  const year = 2008 + (n % 18);
  const paras = startupProfileParagraphs(langKey, n, name, role, country, fk, year);
  const bodyParas = paras.map((t) => `    <p>${esc(t)}</p>`).join('\n');
  const imgAlt = imgAltStartup(langKey, name);
  const metaDesc = startupMetaDescription(langKey, name, role, country, fk, year);

  const body = `<title>${esc(title)}</title>
<meta name="description" content="${esc(metaDesc)}">
<meta name="robots" content="noindex,follow">

<article class="content-wrapper startup-page">
  <a class="back-link" href="${hrefSt}">${esc(L.backStartup)}</a>
  <header class="profile-header startup-header">
    <img src="${esc(img)}" alt="${esc(imgAlt)}" class="profile-avatar-large startup-logo-large" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=720&background=eef4ff&color=2563eb&bold=true';">
    <div class="profile-info">
      <p class="eyebrow">${esc(L.foundedEyebrow(year))}</p>
      <h1>${esc(name)}</h1>
      <h2>${esc(role)}</h2>
      <div class="tags">${tagsHtml(tags)}</div>
    </div>
  </header>
  <section class="profile-facts startup-facts">
    <div><strong>${langKey === 'uk' ? 'Засновано' : langKey === 'en' ? 'Founded' : langKey === 'es' ? 'Fundación' : 'Основана'}</strong><span>${year}</span></div>
    <div><strong>HQ</strong><span>${esc(country)}</span></div>
    <div><strong>${langKey === 'uk' ? 'Сегмент' : langKey === 'en' ? 'Segment' : langKey === 'es' ? 'Segmento' : 'Сегмент'}</strong><span>${esc(fk)}</span></div>
  </section>
  <section class="profile-content">
    <h3>${langKey === 'uk' ? 'Професійний огляд' : langKey === 'en' ? 'Professional overview' : langKey === 'es' ? 'Resumen profesional' : 'Профессиональный обзор'}</h3>
${bodyParas}
  </section>
  <section class="editorial-note">
    <h3>${langKey === 'uk' ? 'Редакційна примітка' : langKey === 'en' ? 'Editorial note' : langKey === 'es' ? 'Nota editorial' : 'Редакционная заметка'}</h3>
    <p>${langKey === 'uk' ? 'Редакційний знімок каталогу Rybezh: назва та опис допомагають порівнювати компанії у фільтрах. Due diligence — лише за первинними джерелами.' : langKey === 'en' ? 'Rybezh editorial catalogue snapshot: name and copy support filter browsing. Run diligence against primary sources only.' : langKey === 'es' ? 'Instantánea editorial Rybezh: nombre y texto ayudan a comparar en filtros. El due diligence solo con fuentes primarias.' : 'Редакционный снимок каталога Rybezh: название и текст помогают сравнивать в фильтрах. Due diligence — только по первичным источникам.'}</p>
  </section>
</article>
`;
  fs.writeFileSync(file, body, 'utf8');
}


function personCardHtml(langKey, n, order) {
  const L = LOCALES[langKey];
  const fk = FILTER_KEYS[n % FILTER_KEYS.length];
  const country = L.countriesPeople[n % L.countriesPeople.length];
  const name = personDisplayName(n, langKey);
  const role = L.personRole(fk);
  const tags = L.tagSets[fk];
  const slug = personSlug(n);
  const href = `${slug}${L.suffix}.html`;
  const search = `${name} ${role} ${country} ${tags.join(' ')} ${fk}`
    .toLowerCase()
    .replace(/&/g, ' ');
  return `<article class="card profile-card" data-directory-card data-filter-key="${fk}" data-country="${esc(country)}" data-sort-name="${esc(name)}" data-catalog-order="${order}" data-search="${esc(search)}">
    <div class="card-body">
      <p class="eyebrow">${esc(country)}</p>
      <h3>${esc(name)}</h3>
      <p class="meta">${esc(role)}</p>
      <div class="tags">${tagsHtml(tags)}</div>
      <a class="btn" href="${esc(href)}">${esc(L.readBtn)}</a>
    </div>
  </article>`;
}

function startupCardHtml(langKey, n, order) {
  const L = LOCALES[langKey];
  const fk = STARTUP_KEYS[n % STARTUP_KEYS.length];
  const country = L.countriesStartup[n % L.countriesStartup.length];
  const name = startupDisplayName(n, langKey);
  const role = L.startupRole(fk);
  const tags = L.stags[fk];
  const year = 2008 + (n % 18);
  const slug = startupSlug(n);
  const href = `${slug}${L.suffix}.html`;
  const search = `${name} ${role} ${country} ${year} ${tags.join(' ')} ${fk}`
    .toLowerCase()
    .replace(/&/g, ' ');
  return `<article class="card startup-card" data-directory-card data-filter-key="${fk}" data-country="${esc(country)}" data-founded="${year}" data-sort-name="${esc(name)}" data-catalog-order="${order}" data-search="${esc(search)}">
    <div class="card-body">
      <p class="eyebrow">${esc(L.foundedEyebrow(year))}</p>
      <h3>${esc(name)}</h3>
      <p class="meta">${esc(role)}</p>
      <p>${esc(`${name}: ${role}. ${country}.`)}</p>
      <div class="tags">${tagsHtml(tags)}</div>
      <a class="btn" href="${esc(href)}">${esc(L.startupRead)}</a>
    </div>
  </article>`;
}

function purgeOld(prefix, dir) {
  for (const f of fs.readdirSync(dir)) {
    if (f.startsWith(prefix) && f.endsWith('.html')) fs.unlinkSync(path.join(dir, f));
  }
}

purgeOld('person-bulk-atlas-', PROFILES);
purgeOld('startup-bulk-atlas-', STARTUPS_DIR);

for (let n = 1; n <= BULK_PEOPLE; n += 1) {
  for (const lang of Object.keys(LOCALES)) {
    writePersonFile(lang, n);
  }
}
for (let n = 1; n <= BULK_STARTUPS; n += 1) {
  for (const lang of Object.keys(LOCALES)) {
    writeStartupFile(lang, n);
  }
}

for (const lang of Object.keys(LOCALES)) {
  const L = LOCALES[lang];
  const specPath = path.join(SITE, L.specialists);
  const stPath = path.join(SITE, L.startups);
  let specHtml = fs.readFileSync(specPath, 'utf8');
  let stHtml = fs.readFileSync(stPath, 'utf8');

  specHtml = stripBulkMarkers(specHtml, 'people');
  stHtml = stripBulkMarkers(stHtml, 'startups');

  const specHand = specHtml;
  const stHand = stHtml;

  let pOrder = maxCatalogOrder(specHand) + 1;
  const peopleCards = [];
  for (let n = 1; n <= BULK_PEOPLE; n += 1) {
    peopleCards.push(personCardHtml(lang, n, pOrder));
    pOrder += 1;
  }

  let sOrder = maxCatalogOrder(stHand) + 1;
  const startupCards = [];
  for (let n = 1; n <= BULK_STARTUPS; n += 1) {
    startupCards.push(startupCardHtml(lang, n, sOrder));
    sOrder += 1;
  }

  specHtml = injectBetweenMarkers(specHand, 'people', peopleCards.join('\n'));
  stHtml = injectBetweenMarkers(stHand, 'startups', startupCards.join('\n'));

  const totalPeople = countDirectoryCards(specHtml);
  const totalStartups = countDirectoryCards(stHtml);
  specHtml = patchResultsCount(specHtml, totalPeople);
  stHtml = patchResultsCount(stHtml, totalStartups);

  fs.writeFileSync(specPath, specHtml, 'utf8');
  fs.writeFileSync(stPath, stHtml, 'utf8');
}

console.log(
  `emit-bulk-catalog-pages: people=${BULK_PEOPLE}×4 startups=${BULK_STARTUPS}×4 (markers in site/*.html); profiles+startups written`
);
