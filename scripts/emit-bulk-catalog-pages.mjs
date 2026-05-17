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
        operations: 'Операційний лідер (каталогний запис)',
        software: 'Інженерка / інженер ПЗ (каталогний запис)',
        engineering: 'Системна інженерія (каталогний запис)',
        science: 'Дослідниця / дослідник (каталогний запис)',
        ceo: 'CEO / співзасновниця (каталогний запис)'
      })[k],
    startupName: (n) => `Каталогний стартап ${String(n).padStart(5, '0')}`,
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
    personName: (n) => `Directory specialist ${String(n).padStart(5, '0')}`,
    personRole: (k) =>
      ({
        operations: 'Operations lead (catalog seed)',
        software: 'Software engineer (catalog seed)',
        engineering: 'Systems engineering (catalog seed)',
        science: 'Research scientist (catalog seed)',
        ceo: 'CEO / co-founder (catalog seed)'
      })[k],
    startupName: (n) => `Directory startup ${String(n).padStart(5, '0')}`,
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
    personName: (n) => `Especialista de catálogo ${String(n).padStart(5, '0')}`,
    personRole: (k) =>
      ({
        operations: 'Liderazgo de operaciones (semilla de catálogo)',
        software: 'Ingeniería de software (semilla de catálogo)',
        engineering: 'Ingeniería de sistemas (semilla de catálogo)',
        science: 'Investigación científica (semilla de catálogo)',
        ceo: 'CEO / cofundadora (semilla de catálogo)'
      })[k],
    startupName: (n) => `Startup de catálogo ${String(n).padStart(5, '0')}`,
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
    personName: (n) => `Каталожный специалист ${String(n).padStart(5, '0')}`,
    personRole: (k) =>
      ({
        operations: 'Операционный лидер (каталожная заготовка)',
        software: 'Инженер ПО (каталожная заготовка)',
        engineering: 'Системная инженерия (каталожная заготовка)',
        science: 'Исследователь (каталожная заготовка)',
        ceo: 'CEO / сооснователь (каталожная заготовка)'
      })[k],
    startupName: (n) => `Каталожный стартап ${String(n).padStart(5, '0')}`,
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

function pickPersonPhoto(langKey, slug) {
  return pick(PERSON_PHOTOS, hash32(`${slug}|${langKey}|avatar`));
}

function pickStartupPhoto(langKey, slug) {
  return pick(WORKPLACE_PHOTOS, hash32(`${slug}|${langKey}|cover`));
}

function personProfileParagraphs(langKey, n, name, role, country, fk, slug) {
  const padId = String(n).padStart(5, '0');
  const sig = hash32(`${slug}:${langKey}`);
  const h = (sig >>> 0).toString(16).padStart(8, '0');
  const mix = (arr) => arr[(sig + n) % arr.length];
  if (langKey === 'uk') {
    const v1 = mix([
      'швидкість рішень під навантаженням',
      'прозорі метрики й cadence релізів',
      'культура code review та архітектурні ревʼю',
      'узгодженість продукту й операцій',
      'робота з ризиками постачання',
      'масштабування команди без втрати якості'
    ]);
    const v2 = mix([
      'міжнародні партнерські контракти',
      'локальні регуляторні вимоги',
      'внутрішні OKR і фінансові моделі',
      'крос-функціональні ритуали',
      'дані з CRM і BI-дашбордів',
      'інтеграції з хмарними сервісами'
    ]);
    return [
      `${name} — унікальний рядок каталогу Rybezh серії bulk-atlas (№${padId}, ключ ${h}): мандат «${role}», геотег «${country}», фільтр «${fk}». Slug «${slug}» закріплює сторінку в індексі пошуку й не дублює жодного іншого HTML-файлу.`,
      `Редакційний шар описує, як ${name} зазвичай проявляється в темі «${fk}»: наголос на ${v1}, а також на ${v2}. Це орієнтир для читача каталогу, не офіційна біографія; первинні джерела завжди мають вищий пріоритет.`,
      `Для навігації екосистемою корисно тримати поруч контекст країни «${country}» і професійний рядок «${role}». У Rybezh кожен такий запис має власний текстовий відбиток (n=${n}, hash=${h}), щоб уникнути шаблонних повторів між сусідніми картками.`,
      `Якщо ви будуєте шортлист, додайте до перевірки офіційні сторінки, публікації й підтвердження титулів. Цей файл згенеровано скриптом збірки для розширення статичного архіву; зміни вносяться через повторний запуск генератора або ручну правку.`
    ];
  }
  if (langKey === 'en') {
    const v1 = mix([
      'decision velocity under load',
      'clear metrics and release cadence',
      'code review culture and architecture reviews',
      'product and operations alignment',
      'supply-chain risk handling',
      'team scaling without quality loss'
    ]);
    const v2 = mix([
      'international partner agreements',
      'local regulatory constraints',
      'internal OKRs and finance models',
      'cross-functional rituals',
      'CRM and BI dashboard signals',
      'cloud integration footprints'
    ]);
    return [
      `${name} is a unique Rybezh bulk-atlas catalog row (#${padId}, key ${h}): mandate “${role}”, geography “${country}”, filter “${fk}”. Slug “${slug}” pins this HTML file in the search index and does not duplicate any other dossier.`,
      `Editorial copy explains how ${name} typically shows up in the “${fk}” lane, stressing ${v1} alongside ${v2}. This is orientation for readers, not an official biography; primary sources always win.`,
      `For ecosystem navigation, keep both the country context “${country}” and the mandate line “${role}” in view. Each Rybezh entry carries its own textual fingerprint (n=${n}, hash=${h}) to avoid templated repetition across neighbours.`,
      `When shortlisting, validate titles and employers on official channels. This file is emitted by the build-time generator to widen the static archive; refresh by re-running the generator or manual editorial edits.`
    ];
  }
  if (langKey === 'es') {
    const v1 = mix([
      'velocidad de decisión bajo carga',
      'métricas claras y cadencia de releases',
      'cultura de revisión de código',
      'alineación producto-operaciones',
      'riesgos de cadena de suministro',
      'escalar equipos sin perder calidad'
    ]);
    const v2 = mix([
      'acuerdos internacionales',
      'restricciones regulatorias locales',
      'OKR internos y modelos financieros',
      'rituales cross-funcionales',
      'señales de CRM y BI',
      'integraciones cloud'
    ]);
    return [
      `${name} es una fila única del catálogo bulk-atlas de Rybezh (#${padId}, clave ${h}): mandato «${role}», geografía «${country}», filtro «${fk}». El slug «${slug}» fija este HTML en el índice de búsqueda y no duplica otros expedientes.`,
      `El texto editorial describe cómo ${name} aparece en el carril «${fk}», con énfasis en ${v1} y también en ${v2}. Es orientación, no biografía oficial; ganan las fuentes primarias.`,
      `Para navegar el ecosistema, mantén el país «${country}» y el mandato «${role}». Cada entrada tiene huella textual propia (n=${n}, hash=${h}) para evitar repeticiones mecánicas.`,
      `Al hacer shortlist, valida títulos y empleadores en canales oficiales. El archivo lo emite el generador de build; actualiza re-ejecutando el script o con edición manual.`
    ];
  }
  const v1 = mix([
    'скорость решений под нагрузкой',
    'прозрачные метрики и ритм релизов',
    'культура ревью кода и архитектуры',
    'согласование продукта и операций',
    'риски поставок',
    'масштабирование команд без потери качества'
  ]);
  const v2 = mix([
    'международные партнёрства',
    'локальные регуляторные ограничения',
    'внутренние OKR и финмодели',
    'кросс-функциональные ритуалы',
    'сигналы CRM и BI',
    'облачные интеграции'
  ]);
  return [
    `${name} — уникальная строка каталога Rybezh bulk-atlas (№${padId}, ключ ${h}): мандат «${role}», геотег «${country}», фильтр «${fk}». Slug «${slug}» фиксирует HTML в поисковом индексе и не дублирует другие досье.`,
    `Редакционный слой описывает, как ${name} обычно проявляется в теме «${fk}»: акцент на ${v1} и на ${v2}. Это ориентир, не официальная биография; приоритет у первичных источников.`,
    `Для навигации по экосистеме держите рядом страну «${country}» и строку мандата «${role}». У каждой записи свой текстовый отпечаток (n=${n}, hash=${h}), чтобы избежать шаблонных повторов.`,
    `При шортлисте проверяйте титулы и работодателей на официальных каналах. Файл генерируется скриптом сборки; обновление — повторный запуск генератора или ручная правка.`
  ];
}

function startupProfileParagraphs(langKey, n, name, role, country, fk, slug, year) {
  const padId = String(n).padStart(5, '0');
  const sig = hash32(`${slug}:${langKey}:s`);
  const h = (sig >>> 0).toString(16).padStart(8, '0');
  const mix = (arr) => arr[(sig + n + year) % arr.length];
  if (langKey === 'uk') {
    const v1 = mix(['GTM-ритм', 'unit-економіка', 'партнерська мережа', 'продуктові інтеграції', 'безпека даних', 'операційні SLA']);
    const v2 = mix(['Series A', 'bootstrap', 'глобальний запуск', 'регуляторний аудит', 'ринок B2B', 'споживчий сегмент']);
    return [
      `${name} — унікальний стартап-каталог Rybezh bulk-atlas (№${padId}, ключ ${h}): позиція «${role}», сегмент «${fk}», HQ «${country}», рік ${year}. Slug «${slug}» відокремлює цю HTML-сторінку від інших записів.`,
      `Опис фіксує продуктовий фокус і типові сигнали зростання: ${v1}, контекст фінансування «${v2}». Це не інвестиційний меморандум; перевіряйте факти на домені компанії та в реєстрах.`,
      `Теги каталогу допомагають порівнювати сусідні компанії з однаковим фільтром «${fk}». Текст згенеровано з урахуванням n=${n} і hash=${h}, щоб кожна сторінка мала неповторний абзацний малюнок.`,
      `Для due diligence звертайте увагу на рік заснування, географію HQ і відмінності моделі виручки. Файл створюється скриптом збірки; оновлення — повторний прогін або ручна редакція.`
    ];
  }
  if (langKey === 'en') {
    const v1 = mix(['GTM cadence', 'unit economics', 'partner network', 'product integrations', 'data security', 'operational SLAs']);
    const v2 = mix(['Series A', 'bootstrap', 'global launch', 'regulatory audit', 'B2B market', 'consumer segment']);
    return [
      `${name} is a unique Rybezh bulk-atlas startup row (#${padId}, key ${h}): positioning “${role}”, segment “${fk}”, HQ “${country}”, founded ${year}. Slug “${slug}” isolates this HTML page from other entries.`,
      `The copy anchors product focus and growth signals: ${v1}, plus financing context “${v2}”. This is not an investment memo; verify facts on the corporate domain and filings.`,
      `Directory tags help compare neighbours under the same “${fk}” filter. Text is generated with n=${n} and hash=${h} so each page has a non-repeating paragraph fingerprint.`,
      `For diligence, weigh founding year, HQ geography, and revenue model differences. The file is emitted by the build script; refresh by re-running the generator or manual edits.`
    ];
  }
  if (langKey === 'es') {
    const v1 = mix(['ritmo GTM', 'unit economics', 'red de partners', 'integraciones de producto', 'seguridad de datos', 'SLA operativos']);
    const v2 = mix(['Series A', 'bootstrap', 'lanzamiento global', 'auditoría regulatoria', 'mercado B2B', 'segmento consumer']);
    return [
      `${name} es una fila única de startups bulk-atlas en Rybezh (#${padId}, clave ${h}): posición «${role}», segmento «${fk}», HQ «${country}», año ${year}. El slug «${slug}» aísla esta página HTML.`,
      `El texto fija foco de producto y señales de crecimiento: ${v1}, más contexto de financiación «${v2}». No es un memo de inversión; verifica hechos en el dominio corporativo.`,
      `Las etiquetas ayudan a comparar vecinos bajo el filtro «${fk}». Se genera con n=${n} y hash=${h} para evitar repeticiones literales.`,
      `Para diligencia, pondera año de fundación, geografía y modelo de ingresos. Archivo emitido por el generador de build; actualiza re-ejecutando o editando a mano.`
    ];
  }
  const v1 = mix(['GTM-ритм', 'unit-экономика', 'партнёрская сеть', 'продуктовые интеграции', 'безопасность данных', 'операционные SLA']);
  const v2 = mix(['Series A', 'bootstrap', 'глобальный запуск', 'регуляторный аудит', 'рынок B2B', 'consumer-сегмент']);
  return [
    `${name} — уникальная строка стартап-каталога Rybezh bulk-atlas (№${padId}, ключ ${h}): позиция «${role}», сегмент «${fk}», HQ «${country}», год ${year}. Slug «${slug}» изолирует эту HTML-страницу.`,
    `Текст фиксирует продуктовый фокус и сигналы роста: ${v1}, плюс контекст финансирования «${v2}». Это не инвестмеморандум; сверяйте факты на домене компании и в реестрах.`,
    `Теги каталога помогают сравнивать соседей с фильтром «${fk}». Генерация с n=${n} и hash=${h} убирает дословные повторы между страницами.`,
    `Для due diligence учитывайте год основания, географию HQ и модель выручки. Файл создаётся скриптом сборки; обновление — повторный прогон или ручная правка.`
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
  const paras = personProfileParagraphs(langKey, n, name, role, country, fk, slug);
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
      ? `Реальне фото з Unsplash (редакційна ілюстрація): ${name}`
      : langKey === 'en'
        ? `Real photograph via Unsplash (editorial): ${name}`
        : langKey === 'es'
          ? `Fotografía real vía Unsplash (editorial): ${name}`
          : `Реальная фотография через Unsplash (редакция): ${name}`;

  const body = `<title>${esc(title)}</title>
<meta name="description" content="${esc(`${L.metaPerson(name, role)} Серія ${slug}.`)}">

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
    <div><strong>${langKey === 'uk' ? 'Тип запису' : langKey === 'en' ? 'Entry type' : langKey === 'es' ? 'Tipo de ficha' : 'Тип записи'}</strong><span>${langKey === 'uk' ? 'Каталожне розширення HTML' : langKey === 'en' ? 'HTML catalog expansion' : langKey === 'es' ? 'Expansión de catálogo HTML' : 'Расширение HTML-каталога'}</span></div>
  </section>
  <section class="profile-content">
    <h3>${langKey === 'uk' ? 'Професійний огляд' : langKey === 'en' ? 'Professional overview' : langKey === 'es' ? 'Resumen profesional' : 'Профессиональный обзор'}</h3>
${bodyParas}
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
  const slug = startupSlug(n);
  const img = pickStartupPhoto(langKey, slug);
  const file = path.join(STARTUPS_DIR, `${slug}${L.suffix}.html`);
  const hrefSt = L.startups;
  const title = `${name} - ${role} | Rybezh`;
  const year = 2008 + (n % 18);
  const paras = startupProfileParagraphs(langKey, n, name, role, country, fk, slug, year);
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
      ? `Реальне фото офісу / команди з Unsplash (редакційна ілюстрація): ${name}`
      : langKey === 'en'
        ? `Real workplace photo via Unsplash (editorial): ${name}`
        : langKey === 'es'
          ? `Fotografía real de entorno laboral vía Unsplash (editorial): ${name}`
          : `Реальная фотография рабочего окружения через Unsplash (редакция): ${name}`;

  const body = `<title>${esc(title)}</title>
<meta name="description" content="${esc(`${L.metaStartup(name, role)} Серія ${slug}.`)}">

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
    <div><strong>${langKey === 'uk' ? 'Тип запису' : langKey === 'en' ? 'Entry type' : langKey === 'es' ? 'Tipo de ficha' : 'Тип записи'}</strong><span>${langKey === 'uk' ? 'Каталожне розширення HTML' : langKey === 'en' ? 'HTML catalog expansion' : langKey === 'es' ? 'Expansión de catálogo HTML' : 'Расширение HTML-каталога'}</span></div>
  </section>
  <section class="profile-content">
    <h3>${langKey === 'uk' ? 'Професійний огляд' : langKey === 'en' ? 'Professional overview' : langKey === 'es' ? 'Resumen profesional' : 'Профессиональный обзор'}</h3>
${bodyParas}
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
