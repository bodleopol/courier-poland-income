/**
 * Generates additional static person and startup HTML fragments plus
 * per-locale catalog cards. Wired into `node build.js` before site-search-index.
 *
 * Configure with environment variables:
 *   CATALOG_BULK_PEOPLE   (default 55)
 *   CATALOG_BULK_STARTUPS (default 48)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROFILES = path.join(ROOT, 'src/pages/profiles');
const STARTUPS_DIR = path.join(ROOT, 'src/pages/startups');
const SITE = path.join(ROOT, 'src/pages/site');

const BULK_PEOPLE = Math.max(0, parseInt(process.env.CATALOG_BULK_PEOPLE || '55', 10));
const BULK_STARTUPS = Math.max(0, parseInt(process.env.CATALOG_BULK_STARTUPS || '48', 10));

const UNSPLASH_PEOPLE = [
  'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=720&q=80'
];

const UNSPLASH_ORG = [
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80'
];

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
    personName: (n) => `Каталогний фахівець ${n}`,
    personRole: (k) =>
      ({
        operations: 'Операційний лідер (каталогний запис)',
        software: 'Інженерка / інженер ПЗ (каталогний запис)',
        engineering: 'Системна інженерія (каталогний запис)',
        science: 'Дослідниця / дослідник (каталогний запис)',
        ceo: 'CEO / співзасновниця (каталогний запис)'
      })[k],
    startupName: (n) => `Каталогний стартап ${n}`,
    startupRole: (k) =>
      ({
        software: 'Продуктова платформа (каталогний запис)',
        fintech: 'Фінтех-інфраструктура (каталогний запис)',
        operations: 'Операційний софт (каталогний запис)',
        design: 'Дизайн-системи (каталогний запис)',
        hardware: 'Апаратний стек (каталогний запис)'
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
      `${name}: ${role}. Редакційний каталогний запис Rybezh — орієнтир для пошуку й фільтрів; первинні джерела мають пріоритет.`,
    metaStartup: (name, role) =>
      `${name}: ${role}. Редакційний каталогний запис Rybezh для порівняння секторів; перевіряйте факти на сайті компанії.`
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
    personName: (n) => `Directory specialist ${n}`,
    personRole: (k) =>
      ({
        operations: 'Operations lead (catalog seed)',
        software: 'Software engineer (catalog seed)',
        engineering: 'Systems engineering (catalog seed)',
        science: 'Research scientist (catalog seed)',
        ceo: 'CEO / co-founder (catalog seed)'
      })[k],
    startupName: (n) => `Directory startup ${n}`,
    startupRole: (k) =>
      ({
        software: 'Product platform (catalog seed)',
        fintech: 'Fintech infrastructure (catalog seed)',
        operations: 'Operations software (catalog seed)',
        design: 'Design systems (catalog seed)',
        hardware: 'Hardware stack (catalog seed)'
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
      `${name}: ${role}. Editorial catalog seed on Rybezh for search and filters; prefer primary sources.`,
    metaStartup: (name, role) =>
      `${name}: ${role}. Editorial catalog seed for sector comparisons; verify facts on the company site.`
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
    personName: (n) => `Especialista de catálogo ${n}`,
    personRole: (k) =>
      ({
        operations: 'Liderazgo de operaciones (semilla de catálogo)',
        software: 'Ingeniería de software (semilla de catálogo)',
        engineering: 'Ingeniería de sistemas (semilla de catálogo)',
        science: 'Investigación científica (semilla de catálogo)',
        ceo: 'CEO / cofundadora (semilla de catálogo)'
      })[k],
    startupName: (n) => `Startup de catálogo ${n}`,
    startupRole: (k) =>
      ({
        software: 'Plataforma de producto (semilla de catálogo)',
        fintech: 'Infraestructura fintech (semilla de catálogo)',
        operations: 'Software operativo (semilla de catálogo)',
        design: 'Sistemas de diseño (semilla de catálogo)',
        hardware: 'Stack de hardware (semilla de catálogo)'
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
      `${name}: ${role}. Ficha editorial semilla en Rybezh para búsqueda y filtros; priorizar fuentes primarias.`,
    metaStartup: (name, role) =>
      `${name}: ${role}. Ficha editorial semilla para comparar sectores; verificar datos en el sitio oficial.`
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
    personName: (n) => `Каталожный специалист ${n}`,
    personRole: (k) =>
      ({
        operations: 'Операционный лидер (каталожная заготовка)',
        software: 'Инженер ПО (каталожная заготовка)',
        engineering: 'Системная инженерия (каталожная заготовка)',
        science: 'Исследователь (каталожная заготовка)',
        ceo: 'CEO / сооснователь (каталожная заготовка)'
      })[k],
    startupName: (n) => `Каталожный стартап ${n}`,
    startupRole: (k) =>
      ({
        software: 'Продуктовая платформа (каталожная заготовка)',
        fintech: 'Финтех-инфраструктура (каталожная заготовка)',
        operations: 'Операционный софт (каталожная заготовка)',
        design: 'Дизайн-системы (каталожная заготовка)',
        hardware: 'Аппаратный стек (каталожная заготовка)'
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
      `${name}: ${role}. Редакционная каталожная заготовка Rybezh для поиска и фильтров; приоритет у первичных источников.`,
    metaStartup: (name, role) =>
      `${name}: ${role}. Редакционная заготовка для сравнения секторов; проверяйте факты на сайте компании.`
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

function writePersonFile(langKey, n) {
  const L = LOCALES[langKey];
  const fk = FILTER_KEYS[n % FILTER_KEYS.length];
  const country = L.countriesPeople[n % L.countriesPeople.length];
  const name = L.personName(n);
  const role = L.personRole(fk);
  const tags = L.tagSets[fk];
  const img = pick(UNSPLASH_PEOPLE, hash32(`${langKey}-${n}-p`));
  const slug = personSlug(n);
  const file = path.join(PROFILES, `${slug}${L.suffix}.html`);
  const hrefSpec = L.specialists;
  const title = `${name} — ${role} | Rybezh`;
  const extLink =
    langKey === 'uk'
      ? `<p><a href="https://www.wikipedia.org/wiki/Open_source" rel="noopener noreferrer">Open source — Wikipedia</a> як зовнішнє джерело загального контексту індустрії.</p>`
      : langKey === 'en'
        ? `<p><a href="https://en.wikipedia.org/wiki/Open_source" rel="noopener noreferrer">Open source — Wikipedia</a> as general industry context.</p>`
        : langKey === 'es'
          ? `<p><a href="https://es.wikipedia.org/wiki/C%C3%B3digo_abierto" rel="noopener noreferrer">Código abierto — Wikipedia</a> como contexto general del sector.</p>`
          : `<p><a href="https://ru.wikipedia.org/wiki/%D0%9E%D1%82%D0%BA%D1%80%D1%8B%D1%82%D0%BE%D0%B5_%D0%BF%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%BD%D0%BE%D0%B5_%D0%BE%D0%B1%D0%B5%D1%81%D0%BF%D0%B5%D1%87%D0%B5%D0%BD%D0%B8%D0%B5" rel="noopener noreferrer">Открытое ПО — Википедия</a> как внешний ориентир по отрасли.</p>`;
  const p1 =
    langKey === 'uk'
      ? `${name} — каталожний запис екосистеми Rybezh: стабільний slug, сектор «${role}» і географія «${country}». Текст підтримує пошук і фільтри; для рішень звіряйте первинні джерела.`
      : langKey === 'en'
        ? `${name} is a Rybezh catalog seed entry with a stable slug, sector “${role}”, and geography “${country}”. Copy supports search filters; verify primary sources before commitments.`
        : langKey === 'es'
          ? `${name} es una ficha semilla del catálogo Rybezh con slug estable, sector «${role}» y geografía «${country}». El texto apoya búsqueda y filtros; contrasta fuentes primarias antes de decidir.`
          : `${name} — каталожная заготовка Rybezh со стабильным slug, сектором «${role}» и географией «${country}». Текст для поиска и фильтров; решения принимайте по первичным источникам.`;
  const p2 =
    langKey === 'uk'
      ? `Rybezh.site фіксує типові патерни операторів у софті, науці й операціях; ця сторінка узгоджує повнотекстовий профіль із каталогом і глобальним пошуком. Перевіряйте титули, роботодавців і дати в офіційних профілях, коли потрібна юридична або кар'єрна впевненість.`
      : langKey === 'en'
        ? `Rybezh.site captures recurring operator patterns across software, science, and operations; this page keeps directory filters and site search aligned with full dossiers. Cross-check titles, employers, and dates on official channels when you need certainty.`
        : langKey === 'es'
          ? `Rybezh.site documenta patrones recurrentes de operadores en software, ciencia y operaciones; esta página alinea filtros del directorio y la búsqueda global con los dossiers completos. Cruza títulos, empleadores y fechas en canales oficiales cuando necesites certeza.`
          : `Rybezh.site фиксирует повторяющиеся паттерны операторов в софте, науке и операциях; эта страница согласует фильтры каталога и глобальный поиск с полными досье. Сверяйте титулы, работодателей и даты на официальных каналах, когда нужна уверенность.`;

  const body = `<title>${esc(title)}</title>
<meta name="description" content="${esc(L.metaPerson(name, role))}">

<article class="content-wrapper profile-page">
  <a class="back-link" href="${hrefSpec}">${esc(L.backPeople)}</a>
  <header class="profile-header">
    <img src="${esc(img)}" alt="${esc(name)}" class="profile-avatar-large" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=720&background=eef4ff&color=2563eb&bold=true';">
    <div class="profile-info">
      <p class="eyebrow">${esc(country)}</p>
      <h1>${esc(name)}</h1>
      <h2>${esc(role)}</h2>
      <div class="tags">${tagsHtml(tags)}</div>
    </div>
  </header>
  <section class="profile-facts">
    <div><strong>${langKey === 'uk' ? 'Країна / регіон' : langKey === 'en' ? 'Country / region' : langKey === 'es' ? 'País / región' : 'Страна / регион'}</strong><span>${esc(country)}</span></div>
    <div><strong>${langKey === 'uk' ? 'Професійний фокус' : langKey === 'en' ? 'Professional focus' : langKey === 'es' ? 'Enfoque profesional' : 'Профессиональный фокус'}</strong><span>${esc(role)}</span></div>
    <div><strong>${langKey === 'uk' ? 'Тип запису' : langKey === 'en' ? 'Entry type' : langKey === 'es' ? 'Tipo de ficha' : 'Тип записи'}</strong><span>${langKey === 'uk' ? 'Каталожне розширення HTML' : langKey === 'en' ? 'HTML catalog expansion' : langKey === 'es' ? 'Expansión de catálogo HTML' : 'Расширение HTML-каталога'}</span></div>
  </section>
  <section class="profile-content">
    <h3>${langKey === 'uk' ? 'Професійний огляд' : langKey === 'en' ? 'Professional overview' : langKey === 'es' ? 'Resumen profesional' : 'Профессиональный обзор'}</h3>
    <p>${esc(p1)}</p>
    <p>${esc(p2)}</p>
    ${extLink}
  </section>
  <section class="editorial-note">
    <h3>${langKey === 'uk' ? 'Редакційна примітка' : langKey === 'en' ? 'Editorial note' : langKey === 'es' ? 'Nota editorial' : 'Редакционная заметка'}</h3>
    <p>${langKey === 'uk' ? 'Каталожні записи з префіксом bulk-atlas генеруються скриптом збірки для масштабування HTML-архіву; зміст — орієнтир, не офіційна біографія.' : langKey === 'en' ? 'Entries prefixed bulk-atlas are emitted by the build script to scale the HTML archive; treat them as orientation, not official biography.' : langKey === 'es' ? 'Las fichas bulk-atlas las emite el script de build para escalar el archivo HTML; son orientación, no biografía oficial.' : 'Записи bulk-atlas создаются скриптом сборки для масштаба HTML-архива; это ориентир, не официальная биография.'}</p>
  </section>
</article>
`;
  fs.writeFileSync(file, body, 'utf8');
}

function writeStartupFile(langKey, n) {
  const L = LOCALES[langKey];
  const fk = STARTUP_KEYS[n % STARTUP_KEYS.length];
  const country = L.countriesStartup[n % L.countriesStartup.length];
  const name = L.startupName(n);
  const role = L.startupRole(fk);
  const tags = L.stags[fk];
  const img = pick(UNSPLASH_ORG, hash32(`${langKey}-${n}-s`));
  const slug = startupSlug(n);
  const file = path.join(STARTUPS_DIR, `${slug}${L.suffix}.html`);
  const hrefSt = L.startups;
  const title = `${name} - ${role} | Rybezh`;
  const year = 2008 + (n % 18);
  const p1 =
    langKey === 'uk'
      ? `${name} зосереджується на «${role}» у сегменті ${fk}; HQ позначено як ${country}. Це HTML-досьє каталогу Rybezh для фільтрів, не інвестиційний меморандум.`
      : langKey === 'en'
        ? `${name} focuses on “${role}” in the ${fk} segment with HQ marked as ${country}. This Rybezh catalog HTML dossier supports filters, not investment decisions.`
        : langKey === 'es'
          ? `${name} se centra en «${role}» en el segmento ${fk}; HQ en ${country}. Es un dossier HTML de catálogo Rybezh para filtros, no un memo de inversión.`
          : `${name} в фокусе «${role}» в сегменте ${fk}; HQ: ${country}. Это HTML-досье каталога Rybezh для фильтров, не инвестиционный меморандум.`;
  const p2 =
    langKey === 'uk'
      ? `Використовуйте рік заснування й теги в каталозі стартапів, щоб порівнювати сусідні компанії; юридичні та фінансові факти звіряйте на домені компанії.`
      : langKey === 'en'
        ? `Use founding year and tags in the startup directory to compare adjacent companies; validate legal and financial facts on the company domain.`
        : langKey === 'es'
          ? `Usa el año de fundación y las etiquetas del directorio para comparar compañías vecinas; valida datos legales y financieros en el dominio oficial.`
          : `Используйте год основания и теги в каталоге, чтобы сравнивать соседние компании; юридические и финансовые факты сверяйте на домене компании.`;
  const extLink =
    langKey === 'uk'
      ? `<p><a href="https://uk.wikipedia.org/wiki/%D0%A1%D1%82%D0%B0%D1%80%D1%82%D0%B0%D0%BF" rel="noopener noreferrer">Стартап — Вікіпедія</a> як загальний орієнтир.</p>`
      : langKey === 'en'
        ? `<p><a href="https://en.wikipedia.org/wiki/Startup_company" rel="noopener noreferrer">Startup company — Wikipedia</a> for general context.</p>`
        : langKey === 'es'
          ? `<p><a href="https://es.wikipedia.org/wiki/Empresa_emergente" rel="noopener noreferrer">Empresa emergente — Wikipedia</a> como contexto general.</p>`
          : `<p><a href="https://ru.wikipedia.org/wiki/%D0%A1%D1%82%D0%B0%D1%80%D1%82%D0%B0%D0%BF" rel="noopener noreferrer">Стартап — Википедия</a> как общий ориентир.</p>`;

  const body = `<title>${esc(title)}</title>
<meta name="description" content="${esc(L.metaStartup(name, role))}">

<article class="content-wrapper startup-page">
  <a class="back-link" href="${hrefSt}">${esc(L.backStartup)}</a>
  <header class="profile-header startup-header">
    <img src="${esc(img)}" alt="${esc(name)}" class="profile-avatar-large startup-logo-large" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=720&background=eef4ff&color=2563eb&bold=true';">
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
    <div><strong>${langKey === 'uk' ? 'Тип запису' : langKey === 'en' ? 'Entry type' : langKey === 'es' ? 'Tipo de ficha' : 'Тип записи'}</strong><span>${langKey === 'uk' ? 'Каталожне розширення HTML' : langKey === 'en' ? 'HTML catalog expansion' : langKey === 'es' ? 'Expansión de catálogo HTML' : 'Расширение HTML-каталога'}</span></div>
  </section>
  <section class="profile-content">
    <h3>${langKey === 'uk' ? 'Професійний огляд' : langKey === 'en' ? 'Professional overview' : langKey === 'es' ? 'Resumen profesional' : 'Профессиональный обзор'}</h3>
    <p>${esc(p1)}</p>
    <p>${esc(p2)}</p>
    ${extLink}
  </section>
  <section class="editorial-note">
    <h3>${langKey === 'uk' ? 'Редакційна примітка' : langKey === 'en' ? 'Editorial note' : langKey === 'es' ? 'Nota editorial' : 'Редакционная заметка'}</h3>
    <p>${langKey === 'uk' ? 'Каталожні стартапи bulk-atlas створюються скриптом збірки для розширення статичного архіву сторінок.' : langKey === 'en' ? 'bulk-atlas catalog startups are emitted by the build script to widen the static page archive.' : langKey === 'es' ? 'Las startups bulk-atlas las genera el script de build para ampliar el archivo estático.' : 'Стартапы bulk-atlas генерируются скриптом сборки для расширения статического архива.'}</p>
  </section>
</article>
`;
  fs.writeFileSync(file, body, 'utf8');
}

function personCardHtml(langKey, n, order) {
  const L = LOCALES[langKey];
  const fk = FILTER_KEYS[n % FILTER_KEYS.length];
  const country = L.countriesPeople[n % L.countriesPeople.length];
  const name = L.personName(n);
  const role = L.personRole(fk);
  const tags = L.tagSets[fk];
  const slug = personSlug(n);
  const href = `${slug}${L.suffix}.html`;
  const search = `${name} ${role} ${country} ${tags.join(' ')} ${fk} bulk-atlas`
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
  const name = L.startupName(n);
  const role = L.startupRole(fk);
  const tags = L.stags[fk];
  const year = 2008 + (n % 18);
  const slug = startupSlug(n);
  const href = `${slug}${L.suffix}.html`;
  const search = `${name} ${role} ${country} ${year} ${tags.join(' ')} ${fk} bulk-atlas`
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
