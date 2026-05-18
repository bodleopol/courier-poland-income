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
import { pickPersonFullName, pickStartupDisplayName } from './bulk-catalog-name-pools.mjs';

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
        software: 'Інженерка / інженер програмного забезпечення',
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
      `${name}: ${role}. Редакційний огляд Rybezh; для рішень спирайтеся на офіційні джерела й підтвердження.`,
    metaStartup: (name, role) =>
      `${name}: ${role}. Редакційний огляд Rybezh; фінанси й продукт звіряйте на сайті компанії та в реєстрах.`
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
      `${name}: ${role}. Editorial overview on Rybezh; confirm titles and employers on official channels.`,
    metaStartup: (name, role) =>
      `${name}: ${role}. Editorial overview on Rybezh; verify traction and filings on the corporate domain.`
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
      `${name}: ${role}. Resumen editorial en Rybezh; contrasta títulos y trayectoria con fuentes primarias.`,
    metaStartup: (name, role) =>
      `${name}: ${role}. Resumen editorial en Rybezh; valida cifras y roadmap en dominios oficiales.`
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
      `${name}: ${role}. Редакционный обзор Rybezh; для решений опирайтесь на первичные источники.`,
    metaStartup: (name, role) =>
      `${name}: ${role}. Редакционный обзор Rybezh; проверяйте метрики и юридические данные на официальных каналах.`
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
  const sig = hash32(`${slug}:${langKey}`);
  const h = (sig >>> 0).toString(16).padStart(8, '0');
  const mix = (arr) => arr[(sig + n) % arr.length];
  if (langKey === 'uk') {
    const v1 = mix([
      'швидкість рішень під навантаженням',
      'прозорі метрики й ритм релізів',
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
      `${name} — це експертний профіль у довіднику Rybezh у ролі «${role}» з орієнтацією на регіон «${country}». Кластер «${fk}» показує, з якими продуктовими й операційними задачами зазвичай пов’язують такий мандат, щоб HR і засновники могли швидко зіставити досвід із власним контекстом.`,
      `Для ролей на кшталт «${role}» у публічних оглядах часто піднімають теми: ${v1} і ${v2}. Це не резюме й не офіційна біографія: це узагальнений огляд того, як ринок формулює сильні сторони подібних позицій; конкретні проєкти й титули перевіряйте з первинних джерел.`,
      `Поєднання країни «${country}» і теми «${fk}» задає інституційний і технологічний фон, а роль «${role}» — очікуваний рівень відповідальності за дорожню карту, якість поставки та комунікацію зі стейкхолдерами (референс-ідентифікатор ${h}).`,
      `Перш ніж запрошувати до співбесіди, зберіть публічні матеріали: доповіді, репозиторії, статті й підтвердження зайнятості. Редакція Rybezh підтримує сторінку в актуальному вигляді; юридичні та кадрові рішення приймайте лише після власної верифікації фактів.`
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
      `${name} is filed in the Rybezh directory as a specialist profile for “${role}” with geography anchored in “${country}”. The “${fk}” lane signals the kinds of product and operating problems readers usually associate with this mandate so hiring teams can benchmark quickly.`,
      `In day-to-day practice, profiles like ${name} are often described around ${v1} together with ${v2}. This is market-facing orientation, not a certified CV—verify employers, titles, and outcomes on primary channels before you rely on the summary.`,
      `Pairing “${country}” with the “${fk}” theme sets institutional context, while “${role}” frames expected ownership for roadmaps, delivery quality, and stakeholder cadence (internal reference ${h}).`,
      `Before interviews, collect artefacts: talks, repos, papers, and employment confirmations. Rybezh editors refresh the page; treat every line as provisional until your own diligence checks out.`
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
      `${name} aparece en el directorio Rybezh como ficha de «${role}» con foco geográfico en «${country}». El carril «${fk}» resume qué problemas de producto y operaciones suelen asociarse a este mandato para acelerar comparaciones entre candidatos.`,
      `En la práctica, perfiles como ${name} suelen destacar por ${v1} y, al mismo tiempo, por ${v2}. Es orientación de mercado, no biografía certificada: contrasta empleadores, títulos y resultados en fuentes primarias.`,
      `La combinación de país «${country}» y tema «${fk}» aporta contexto institucional, mientras que «${role}» marca el nivel de ownership esperado sobre roadmap, calidad de entrega y rituales con stakeholders (referencia ${h}).`,
      `Antes de entrevistas, reúne charlas, repos, artículos y confirmaciones laborales. La redacción de Rybezh mantiene la ficha; trata cada dato como provisional hasta tu propia diligencia.`
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
    `${name} — профиль в справочнике Rybezh в роли «${role}» с опорой на регион «${country}». Кластер «${fk}» показывает, какие продуктовые и операционные задачи рынок обычно связывает с таким мандатом, чтобы нанимающим командам было проще сопоставить опыт.`,
    `На практике для роли «${role}» характерны акценты на ${v1} и на ${v2}. Это рыночный ориентир, а не заверенное резюме — сверяйте работодателей, титулы и результаты по первичным каналам.`,
    `Сочетание страны «${country}» и темы «${fk}» задаёт институциональный фон, а роль «${role}» — ожидаемую зону ответственности за дорожную карту, качество поставки и коммуникации со стейкхолдерами (внутренняя метка ${h}).`,
    `Перед интервью соберите публичные артефакты: выступления, репозитории, публикации и подтверждения занятости. Редакция Rybezh обновляет страницу; любые юридические и кадровые решения принимайте только после собственной проверки фактов.`
  ];
}

function startupProfileParagraphs(langKey, n, name, role, country, fk, slug, year) {
  const sig = hash32(`${slug}:${langKey}:s`);
  const h = (sig >>> 0).toString(16).padStart(8, '0');
  const mix = (arr) => arr[(sig + n + year) % arr.length];
  if (langKey === 'uk') {
    const v1 = mix(['GTM-ритм', 'unit-економіка', 'партнерська мережа', 'продуктові інтеграції', 'безпека даних', 'операційні SLA']);
    const v2 = mix(['Series A', 'bootstrap', 'глобальний запуск', 'регуляторний аудит', 'ринок B2B', 'споживчий сегмент']);
    return [
      `${name} — огляд команди в сегменті «${role}» з HQ у «${country}» та роком заснування ${year}. У картці підсвічено сімейство «${fk}», щоб інвестори й партнери могли швидко відфільтрувати схожі за моделлю виручки компанії.`,
      `Текст описує, як ринок зазвичай читає продуктовий фокус і сигнали зростання: ${v1} на тлі «${v2}». Це не інвестиційний меморандум — усі цифри й юридичні події звіряйте на домені компанії, у звітах і державних реєстрах.`,
      `Порівнюючи конкурентів, тримайте поруч географію «${country}», тег «${fk}» і позиціонування «${role}». Варіативність формулювань між сусідніми сторінками підтримує внутрішня референція ${h}, не змінюючи змісту фільтрів.`,
      `Для due diligence зважайте на рік заснування, структуру виручки та залежність від ключових клієнтів. Редакція Rybezh оновлює опис; будь-які угоди й перевірки комплаєнсу завершуйте лише на підставі ваших первинних даних.`
    ];
  }
  if (langKey === 'en') {
    const v1 = mix(['GTM cadence', 'unit economics', 'partner network', 'product integrations', 'data security', 'operational SLAs']);
    const v2 = mix(['Series A', 'bootstrap', 'global launch', 'regulatory audit', 'B2B market', 'consumer segment']);
    return [
      `${name} is a concise company snapshot for “${role}” with HQ in “${country}” and founding year ${year}. The “${fk}” tag clusters comparable revenue motions so investors and partners can scan the Rybezh startup map faster.`,
      `The narrative highlights how the market typically reads product focus and growth signals: ${v1} against “${v2}”. It is not an investment memo—validate figures on the corporate domain, filings, and registry extracts.`,
      `When benchmarking peers, keep geography “${country}”, theme “${fk}”, and positioning “${role}” aligned. Lexical variation across neighbouring pages is carried by reference ${h} without changing filter semantics.`,
      `For diligence, stress-test founding vintage, revenue concentration, and compliance posture. Rybezh editors maintain the copy; treat every metric as provisional until your own primary research confirms it.`
    ];
  }
  if (langKey === 'es') {
    const v1 = mix(['ritmo GTM', 'unit economics', 'red de partners', 'integraciones de producto', 'seguridad de datos', 'SLA operativos']);
    const v2 = mix(['Series A', 'bootstrap', 'lanzamiento global', 'auditoría regulatoria', 'mercado B2B', 'segmento consumer']);
    return [
      `${name} resume a la compañía en el segmento «${role}» con sede en «${country}» y año de fundación ${year}. La etiqueta «${fk}» agrupa narrativas de ingresos parecidas para que inversores y socios comparen con rapidez en el mapa de startups de Rybezh.`,
      `El texto explica cómo el mercado suele leer foco de producto y señales de crecimiento: ${v1} en el marco «${v2}». No sustituye un memo de inversión: verifica cifras en el dominio corporativo y en registros públicos.`,
      `Al comparar pares, alinea país «${country}», tema «${fk}» y posición «${role}». La variación léxica entre fichas vecinas usa la referencia ${h} sin alterar el sentido de los filtros.`,
      `Para diligencia, tensiona cohorte de fundación, concentración de ingresos y postura regulatoria. La redacción de Rybezh actualiza la ficha; confirma cada métrica con investigación primaria propia.`
    ];
  }
  const v1 = mix(['GTM-ритм', 'unit-экономика', 'партнёрская сеть', 'продуктовые интеграции', 'безопасность данных', 'операционные SLA']);
  const v2 = mix(['Series A', 'bootstrap', 'глобальный запуск', 'регуляторный аудит', 'рынок B2B', 'consumer-сегмент']);
  return [
    `${name} — сжатый обзор команды в сегменте «${role}» с HQ в «${country}» и годом основания ${year}. Тег «${fk}» группирует похожие модели монетизации, чтобы инвесторам и партнёрам было проще сравнивать карту Rybezh.`,
    `Текст показывает, как рынок обычно читает продуктовый фокус и сигналы роста: ${v1} на фоне «${v2}». Это не инвестиционный меморандум — сверяйте цифры на домене компании, в отчётности и выписках реестров.`,
    `При сравнении конкурентов держите в одном ряду страну «${country}», тему «${fk}» и позицию «${role}». Лексическое различие соседних страниц поддерживает метка ${h}, не меняя смысла фильтров.`,
    `Для due diligence проверьте год основания, концентрацию выручки и комплаенс. Редакция Rybezh обновляет описание; любые сделки заключайте только после собственной первичной проверки.`
  ];
}

function writePersonFile(langKey, n) {
  const L = LOCALES[langKey];
  const fk = FILTER_KEYS[n % FILTER_KEYS.length];
  const country = L.countriesPeople[n % L.countriesPeople.length];
  const name = pickPersonFullName(langKey, n - 1);
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
      ? `Портрет у робочому контексті: ${name}`
      : langKey === 'en'
        ? `Portrait in a professional setting: ${name}`
        : langKey === 'es'
          ? `Retrato en contexto profesional: ${name}`
          : `Портрет в рабочем контексте: ${name}`;

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
    <div><strong>${langKey === 'uk' ? 'Публікація' : langKey === 'en' ? 'Publication' : langKey === 'es' ? 'Publicación' : 'Публикация'}</strong><span>${langKey === 'uk' ? 'Редакція Rybezh' : langKey === 'en' ? 'Rybezh editorial desk' : langKey === 'es' ? 'Redacción Rybezh' : 'Редакция Rybezh'}</span></div>
  </section>
  <section class="profile-content">
    <h3>${langKey === 'uk' ? 'Професійний огляд' : langKey === 'en' ? 'Professional overview' : langKey === 'es' ? 'Resumen profesional' : 'Профессиональный обзор'}</h3>
${bodyParas}
    ${extLink}
  </section>
</article>
`;
  fs.writeFileSync(file, body, 'utf8');
}

function writeStartupFile(langKey, n) {
  const L = LOCALES[langKey];
  const fk = STARTUP_KEYS[n % STARTUP_KEYS.length];
  const country = L.countriesStartup[n % L.countriesStartup.length];
  const name = pickStartupDisplayName(langKey, n - 1);
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
      ? `Фото офісу та команди: ${name}`
      : langKey === 'en'
        ? `Office and team photograph: ${name}`
        : langKey === 'es'
          ? `Fotografía de oficina y equipo: ${name}`
          : `Фотография офиса и команды: ${name}`;

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
    <div><strong>${langKey === 'uk' ? 'Публікація' : langKey === 'en' ? 'Publication' : langKey === 'es' ? 'Publicación' : 'Публикация'}</strong><span>${langKey === 'uk' ? 'Редакція Rybezh' : langKey === 'en' ? 'Rybezh editorial desk' : langKey === 'es' ? 'Redacción Rybezh' : 'Редакция Rybezh'}</span></div>
  </section>
  <section class="profile-content">
    <h3>${langKey === 'uk' ? 'Професійний огляд' : langKey === 'en' ? 'Professional overview' : langKey === 'es' ? 'Resumen profesional' : 'Профессиональный обзор'}</h3>
${bodyParas}
    ${extLink}
  </section>
</article>
`;
  fs.writeFileSync(file, body, 'utf8');
}

function personCardHtml(langKey, n, order) {
  const L = LOCALES[langKey];
  const fk = FILTER_KEYS[n % FILTER_KEYS.length];
  const country = L.countriesPeople[n % L.countriesPeople.length];
  const name = pickPersonFullName(langKey, n - 1);
  const role = L.personRole(fk);
  const tags = L.tagSets[fk];
  const slug = personSlug(n);
  const img = pickPersonPhoto(langKey, slug);
  const href = `${slug}${L.suffix}.html`;
  const search = `${name} ${role} ${country} ${tags.join(' ')} ${fk}`.toLowerCase().replace(/&/g, ' ');
  const imgAlt =
    langKey === 'uk'
      ? `Портрет: ${name}`
      : langKey === 'en'
        ? `Portrait: ${name}`
        : langKey === 'es'
          ? `Retrato: ${name}`
          : `Портрет: ${name}`;
  return `<article class="card profile-card" data-directory-card data-filter-key="${fk}" data-country="${esc(country)}" data-sort-name="${esc(name)}" data-catalog-order="${order}" data-search="${esc(search)}">
    <img src="${esc(img)}" alt="${esc(imgAlt)}" loading="lazy" decoding="async" referrerpolicy="no-referrer" width="640" height="360" onerror="this.onerror=null;this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=640&background=eef4ff&color=2563eb&bold=true';">
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
  const name = pickStartupDisplayName(langKey, n - 1);
  const role = L.startupRole(fk);
  const tags = L.stags[fk];
  const year = 2008 + (n % 18);
  const slug = startupSlug(n);
  const img = pickStartupPhoto(langKey, slug);
  const href = `${slug}${L.suffix}.html`;
  const search = `${name} ${role} ${country} ${year} ${tags.join(' ')} ${fk}`.toLowerCase().replace(/&/g, ' ');
  const imgAlt =
    langKey === 'uk'
      ? `Офіс і команда: ${name}`
      : langKey === 'en'
        ? `Office and team: ${name}`
        : langKey === 'es'
          ? `Oficina y equipo: ${name}`
          : `Офис и команда: ${name}`;
  return `<article class="card startup-card" data-directory-card data-filter-key="${fk}" data-country="${esc(country)}" data-founded="${year}" data-sort-name="${esc(name)}" data-catalog-order="${order}" data-search="${esc(search)}">
    <img src="${esc(img)}" alt="${esc(imgAlt)}" loading="lazy" referrerpolicy="no-referrer" width="640" height="220" onerror="this.onerror=null;this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=640&background=eef4ff&color=2563eb&bold=true';">
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
