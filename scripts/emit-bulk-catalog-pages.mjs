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
    personName: (n) => `Каталогний фахівець ${String(n).padStart(5, '0')}`,
    personRole: (k) =>
      ({
        operations: 'Операційний лідер',
        software: 'Інженерка / інженер ПЗ',
        engineering: 'Системна інженерія',
        science: 'Дослідниця / дослідник',
        ceo: 'CEO / співзасновниця'
      })[k],
    startupName: (n) => `Каталогний стартап ${String(n).padStart(5, '0')}`,
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
    personName: (n) => `Directory specialist ${String(n).padStart(5, '0')}`,
    personRole: (k) =>
      ({
        operations: 'Operations lead',
        software: 'Software engineer',
        engineering: 'Systems engineering',
        science: 'Research scientist',
        ceo: 'CEO / co-founder'
      })[k],
    startupName: (n) => `Directory startup ${String(n).padStart(5, '0')}`,
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
    personName: (n) => `Especialista de catálogo ${String(n).padStart(5, '0')}`,
    personRole: (k) =>
      ({
        operations: 'Liderazgo de operaciones',
        software: 'Ingeniería de software',
        engineering: 'Ingeniería de sistemas',
        science: 'Investigación científica',
        ceo: 'CEO / cofundadora'
      })[k],
    startupName: (n) => `Startup de catálogo ${String(n).padStart(5, '0')}`,
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
    personName: (n) => `Каталожный специалист ${String(n).padStart(5, '0')}`,
    personRole: (k) =>
      ({
        operations: 'Операционный лидер',
        software: 'Инженер ПО',
        engineering: 'Системная инженерия',
        science: 'Исследователь',
        ceo: 'CEO / сооснователь'
      })[k],
    startupName: (n) => `Каталожный стартап ${String(n).padStart(5, '0')}`,
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

function personProfileParagraphs(langKey, n, name, role, country, fk) {
  if (langKey === 'uk') {
    return [
      `${name} — орієнтаційна картка в каталозі Rybezh. Вказана роль «${role}» і регіон «${country}» слугують лише для фільтрів і навігації; це не підтверджена біографія й не заміна CV.`,
      `У списку картку згруповано за темою «${fk}». Порівнюючи записи між собою, перевіряйте титули, роботодавців і проєкти на офіційних сторінках, у пресі та реєстрах.`,
      `Якщо потрібні факти для рішень — звертайтеся до первинних джерел. Текст тут мінімальний навмисно, щоб не створювати враження «готової біографії» там, де її немає.`
    ];
  }
  if (langKey === 'en') {
    return [
      `${name} is an orientation card in the Rybezh directory. The role “${role}” and region “${country}” are navigation labels only—not a verified biography or CV.`,
      `The card is grouped under the “${fk}” theme for browsing. When comparing entries, confirm titles, employers, and projects on official sites, press, and filings.`,
      `For decisions that require facts, rely on primary sources. The copy here stays short on purpose so the page cannot read like a fabricated profile.`
    ];
  }
  if (langKey === 'es') {
    return [
      `${name} es una ficha de orientación en el directorio Rybezh. El rol «${role}» y la región «${country}» sirven solo para filtros y navegación; no es una biografía verificada ni un CV.`,
      `La ficha se agrupa bajo el tema «${fk}». Al comparar entradas, confirma cargos, empleadores y proyectos en fuentes oficiales, prensa y registros.`,
      `Si necesitas hechos para decidir, usa fuentes primarias. El texto se mantiene breve a propósito para no simular una biografía donde no la hay.`
    ];
  }
  return [
    `${name} — ориентировочная карточка в каталоге Rybezh. Роль «${role}» и регион «${country}» нужны только для фильтров и навигации; это не подтверждённая биография и не замена резюме.`,
    `Карточка сгруппирована по теме «${fk}». Сравнивая записи, проверяйте должности, работодателей и проекты на официальных сайтах, в СМИ и реестрах.`,
    `Для решений, где важны факты, опирайтесь на первичные источники. Текст намеренно короткий, чтобы страница не выглядела как вымышленный профиль.`
  ];
}

function startupProfileParagraphs(langKey, n, name, role, country, fk, year) {
  if (langKey === 'uk') {
    return [
      `${name} — орієнтаційна картка компанії в каталозі Rybezh. Поля «${role}», сегмент «${fk}», HQ «${country}», рік ${year} — для фільтрів; це не інвестиційний меморандум і не підтверджений профіль компанії.`,
      `Порівнюючи з іншими картками в тій самій темі, перевіряйте домен, реєстраційні дані, пресрелізи та звітність на первинних джерелах.`,
      `Текст навмисно короткий: він має допомогти орієнтуватися в каталозі, а не імітувати глибокий аналітичний матеріал без фактів.`
    ];
  }
  if (langKey === 'en') {
    return [
      `${name} is an orientation card for a company in the Rybezh directory. The fields “${role}”, segment “${fk}”, HQ “${country}”, and founding year ${year} are navigation labels—not an investment memo or a verified company profile.`,
      `When comparing cards in the same theme, check the corporate domain, registry filings, press releases, and primary reporting.`,
      `The copy stays short on purpose: it should help you browse the catalogue, not mimic deep analysis without underlying facts.`
    ];
  }
  if (langKey === 'es') {
    return [
      `${name} es una ficha de orientación de empresa en el directorio Rybezh. Los campos «${role}», segmento «${fk}», HQ «${country}» y el año ${year} son etiquetas de navegación: no es un memo de inversión ni un perfil verificado.`,
      `Al comparar fichas del mismo tema, revisa el dominio corporativo, registros oficiales, comunicados de prensa e información primaria.`,
      `El texto es breve a propósito: ayuda a explorar el catálogo sin simular análisis profundo sin hechos.`
    ];
  }
  return [
    `${name} — ориентировочная карточка компании в каталоге Rybezh. Поля «${role}», сегмент «${fk}», HQ «${country}», год ${year} — для навигации; это не инвестмеморандум и не проверенный профиль компании.`,
    `Сравнивая карточки в одной теме, проверяйте корпоративный домен, реестры, пресс-релизы и первичную отчётность.`,
    `Текст намеренно короткий: он помогает листать каталог, а не подменяет аналитику без фактов.`
  ];
}

function writePersonFile(langKey, n) {
  const L = LOCALES[langKey];
  const fk = FILTER_KEYS[n % FILTER_KEYS.length];
  const country = L.countriesPeople[n % L.countriesPeople.length];
  const name = L.personName(n);
  const role = L.personRole(fk);
  const tags = L.tagSets[fk];
  const slug = personSlug(n);
  const img = pickPersonPhoto(langKey, slug);
  const file = path.join(PROFILES, `${slug}${L.suffix}.html`);
  const hrefSpec = L.specialists;
  const title = `${name} — ${role} | Rybezh`;
  const paras = personProfileParagraphs(langKey, n, name, role, country, fk);
  const extLink =
    langKey === 'uk'
      ? `<p><a href="https://www.wikipedia.org/wiki/Open_source" rel="noopener noreferrer">Open source — Wikipedia</a> як зовнішнє джерело загального контексту індустрії.</p>`
      : langKey === 'en'
        ? `<p><a href="https://en.wikipedia.org/wiki/Open_source" rel="noopener noreferrer">Open source — Wikipedia</a> as general industry context.</p>`
        : langKey === 'es'
          ? `<p><a href="https://es.wikipedia.org/wiki/C%C3%B3digo_abierto" rel="noopener noreferrer">Código abierto — Wikipedia</a> como contexto general del sector.</p>`
          : `<p><a href="https://ru.wikipedia.org/wiki/%D0%9E%D1%82%D0%BA%D1%80%D1%8B%D1%82%D0%BE%D0%B5_%D0%BF%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%BD%D0%BE%D0%B5_%D0%BE%D0%B1%D0%B5%D1%81%D0%BF%D0%B5%D1%87%D0%B5%D0%BD%D0%B8%D0%B5" rel="noopener noreferrer">Открытое ПО — Википедия</a> как внешний ориентир по отрасли.</p>`;
  const bodyParas = paras.map((t) => `    <p>${esc(t)}</p>`).join('\n');
  const imgAlt =
    langKey === 'uk'
      ? `Стокове фото (Unsplash), ілюстрація без прив’язки до реальної особи: ${name}`
      : langKey === 'en'
        ? `Stock photo (Unsplash), not tied to a real person: ${name}`
        : langKey === 'es'
          ? `Foto de stock (Unsplash), sin vínculo con una persona real: ${name}`
          : `Стоковое фото (Unsplash), не привязано к реальному человеку: ${name}`;

  const body = `<title>${esc(title)}</title>
<meta name="description" content="${esc(L.metaPerson(name, role))}">

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
    <div><strong>${langKey === 'uk' ? 'Професійний фокус' : langKey === 'en' ? 'Professional focus' : langKey === 'es' ? 'Enfoque profesional' : 'Профессиональный фокус'}</strong><span>${esc(role)}</span></div>
    <div><strong>${langKey === 'uk' ? 'Тип запису' : langKey === 'en' ? 'Entry type' : langKey === 'es' ? 'Tipo de ficha' : 'Тип записи'}</strong><span>${langKey === 'uk' ? 'Орієнтаційний запис (не верифіковано)' : langKey === 'en' ? 'Orientation entry (unverified)' : langKey === 'es' ? 'Ficha de orientación (no verificada)' : 'Ориентировочная запись (не проверена)'}</span></div>
  </section>
  <section class="profile-content">
    <h3>${langKey === 'uk' ? 'Професійний огляд' : langKey === 'en' ? 'Professional overview' : langKey === 'es' ? 'Resumen profesional' : 'Профессиональный обзор'}</h3>
${bodyParas}
    ${extLink}
  </section>
  <section class="editorial-note">
    <h3>${langKey === 'uk' ? 'Редакційна примітка' : langKey === 'en' ? 'Editorial note' : langKey === 'es' ? 'Nota editorial' : 'Редакционная заметка'}</h3>
    <p>${langKey === 'uk' ? 'Ця картка створюється автоматично під час збірки сайту, щоб наповнити фільтри каталогу. Текст — орієнтир для навігації, а не офіційна біографія чи підтверджений профіль.' : langKey === 'en' ? 'This card is generated automatically during the site build to keep catalogue filters populated. Treat the text as navigation context, not an official biography or verified profile.' : langKey === 'es' ? 'Esta ficha se genera automáticamente en el build para mantener filtros del catálogo. El texto es contexto de navegación, no biografía oficial ni perfil verificado.' : 'Карточка создаётся автоматически при сборке сайта, чтобы работали фильтры каталога. Текст — ориентир для навигации, а не официальная биография или проверенный профиль.'}</p>
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
  const slug = startupSlug(n);
  const img = pickStartupPhoto(langKey, slug);
  const file = path.join(STARTUPS_DIR, `${slug}${L.suffix}.html`);
  const hrefSt = L.startups;
  const title = `${name} - ${role} | Rybezh`;
  const year = 2008 + (n % 18);
  const paras = startupProfileParagraphs(langKey, n, name, role, country, fk, year);
  const extLink =
    langKey === 'uk'
      ? `<p><a href="https://uk.wikipedia.org/wiki/%D0%A1%D1%82%D0%B0%D1%80%D1%82%D0%B0%D0%BF" rel="noopener noreferrer">Стартап — Вікіпедія</a> як загальний орієнтир.</p>`
      : langKey === 'en'
        ? `<p><a href="https://en.wikipedia.org/wiki/Startup_company" rel="noopener noreferrer">Startup company — Wikipedia</a> for general context.</p>`
        : langKey === 'es'
          ? `<p><a href="https://es.wikipedia.org/wiki/Empresa_emergente" rel="noopener noreferrer">Empresa emergente — Wikipedia</a> como contexto general.</p>`
          : `<p><a href="https://ru.wikipedia.org/wiki/%D0%A1%D1%82%D0%B0%D1%80%D1%82%D0%B0%D0%BF" rel="noopener noreferrer">Стартап — Википедия</a> как общий ориентир.</p>`;
  const bodyParas = paras.map((t) => `    <p>${esc(t)}</p>`).join('\n');
  const imgAlt =
    langKey === 'uk'
      ? `Стокове фото офісу / команди (Unsplash), ілюстрація без прив’язки до реальної компанії: ${name}`
      : langKey === 'en'
        ? `Stock workplace photo (Unsplash), not tied to a real company: ${name}`
        : langKey === 'es'
          ? `Foto de stock de entorno laboral (Unsplash), sin vínculo con una empresa real: ${name}`
          : `Стоковое фото офиса / команды (Unsplash), не привязано к реальной компании: ${name}`;

  const body = `<title>${esc(title)}</title>
<meta name="description" content="${esc(L.metaStartup(name, role))}">

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
    <div><strong>${langKey === 'uk' ? 'Тип запису' : langKey === 'en' ? 'Entry type' : langKey === 'es' ? 'Tipo de ficha' : 'Тип записи'}</strong><span>${langKey === 'uk' ? 'Орієнтаційний запис (не верифіковано)' : langKey === 'en' ? 'Orientation entry (unverified)' : langKey === 'es' ? 'Ficha de orientación (no verificada)' : 'Ориентировочная запись (не проверена)'}</span></div>
  </section>
  <section class="profile-content">
    <h3>${langKey === 'uk' ? 'Професійний огляд' : langKey === 'en' ? 'Professional overview' : langKey === 'es' ? 'Resumen profesional' : 'Профессиональный обзор'}</h3>
${bodyParas}
    ${extLink}
  </section>
  <section class="editorial-note">
    <h3>${langKey === 'uk' ? 'Редакційна примітка' : langKey === 'en' ? 'Editorial note' : langKey === 'es' ? 'Nota editorial' : 'Редакционная заметка'}</h3>
    <p>${langKey === 'uk' ? 'Ця картка створюється автоматично під час збірки сайту для наповнення каталогу компаній. Вона не замінює due diligence і не є підтвердженим описом бізнесу.' : langKey === 'en' ? 'This card is generated automatically during the site build to keep the company catalogue populated. It is not a substitute for diligence or a verified business write-up.' : langKey === 'es' ? 'Esta ficha se genera automáticamente en el build para mantener el catálogo de empresas. No sustituye el due diligence ni es una descripción verificada.' : 'Карточка создаётся автоматически при сборке, чтобы каталог компаний оставался заполненным. Это не замена due diligence и не проверенное описание бизнеса.'}</p>
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
  const name = L.startupName(n);
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
