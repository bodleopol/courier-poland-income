/**
 * Generates 2000 low-profile specialist profiles + 150 fictional startups,
 * each with photo URLs and 300+ character descriptions in uk/en/es/ru.
 * Outputs: src/generated/*.inc.html, src/pages/profiles/person-lp-*.html,
 * src/pages/startups/startup-lp-*.html
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const GENERATED = path.join(ROOT, 'src', 'generated');
const PROFILES = path.join(ROOT, 'src', 'pages', 'profiles');
const STARTUPS = path.join(ROOT, 'src', 'pages', 'startups');

const SPECIALIST_COUNT = 2000;
const STARTUP_COUNT = 150;
const CATALOG_ORDER_BASE = 10_000;

const UNSPLASH_PEOPLE = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1485893086445-ed75865251e0?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1504257432389-a52330f3b47b?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1489428861083-5f1bb764670c?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1502323777036-f29e3972d82f?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1544723795-432537f79e1a?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1599566150163-64194ac294a0?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?auto=format&fit=crop&w=720&q=80'
];

const UNSPLASH_ORG = [
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1553877522-7b900ccc5d7b?auto=format&fit=crop&w=1400&q=80'
];

const FIRST = [
  'Mira', 'Jonas', 'Sofia', 'Elias', 'Nora', 'Leo', 'Ines', 'Owen', 'Ada', 'Felix',
  'Lena', 'Theo', 'Iris', 'Marc', 'Yara', 'Noah', 'Eva', 'Luca', 'Zoe', 'Adam',
  'Clara', 'Henrik', 'Maya', 'Victor', 'Elena', 'Paul', 'Nina', 'Oscar', 'Ida', 'Tom',
  'Rosa', 'Anton', 'Lia', 'Ben', 'Mila', 'Jan', 'Aya', 'Sam', 'Edda', 'Ian',
  'Kira', 'Max', 'Tara', 'Ray', 'Uma', 'Dan', 'Ari', 'Kim', 'Joe', 'Ana'
];

const LAST = [
  'Kovalev', 'Lindstrom', 'Ortega', 'Petrovic', 'Nakamura', 'Fontaine', 'Kowalski', 'Rossi',
  'Hansen', 'Silva', 'Novak', 'Berg', 'Costa', 'Meyer', 'Santos', 'Jensen', 'Murphy', 'Weber',
  'Lopez', 'Schmidt', 'Patel', 'Keller', 'Ricci', 'Fischer', 'Garcia', 'Neumann', 'Caruso', 'Wolf',
  'Dubois', 'Steiner', 'Romero', 'Blake', 'Farrell', 'Nguyen', 'Olsen', 'Reed', 'Martens', 'Vega',
  'Cole', 'Peters', 'Hughes', 'Braun', 'Singh', 'Morris', 'Klein', 'Grant', 'Pohl', 'Yates'
];

const DOMAINS = [
  'observability', 'robotics perception', 'climate risk modelling', 'edge networking', 'privacy engineering',
  'computational biology', 'hardware verification', 'supply-chain analytics', 'developer productivity', 'formal methods',
  'human-in-the-loop ML', 'battery management firmware', 'trust & safety operations', 'geospatial intelligence',
  'real-time audio DSP', 'blockchain infrastructure', 'scientific computing', 'security architecture', 'data governance',
  'UX research for regulated industries', 'technical writing systems', 'SRE culture', 'product analytics', 'compiler tooling'
];

const FILTER_KEYS = ['operations', 'software', 'engineering', 'science', 'ceo'];

const COUNTRY_BY_LANG = {
  uk: ['Україна', 'Польща', 'Естонія', 'Німеччина', 'Швеція', 'Франція', 'Канада', 'США', 'Велика Британія', 'Нідерланди', 'Іспанія', 'Португалія', 'Австрія', 'Чехія', 'Румунія'],
  en: ['Ukraine', 'Poland', 'Estonia', 'Germany', 'Sweden', 'France', 'Canada', 'United States', 'United Kingdom', 'Netherlands', 'Spain', 'Portugal', 'Austria', 'Czechia', 'Romania'],
  es: ['Ucrania', 'Polonia', 'Estonia', 'Alemania', 'Suecia', 'Francia', 'Canadá', 'Estados Unidos', 'Reino Unido', 'Países Bajos', 'España', 'Portugal', 'Austria', 'Chequia', 'Rumanía'],
  ru: ['Украина', 'Польша', 'Эстония', 'Германия', 'Швеция', 'Франция', 'Канада', 'США', 'Великобритания', 'Нидерланды', 'Испания', 'Португалия', 'Австрия', 'Чехия', 'Румыния']
};

const UI = {
  uk: {
    backSpec: 'До архіву експертів',
    backStart: 'Усі стартапи',
    profileEyebrow: 'Схожі профілі',
    profileH2: 'Повернутися до каталогу',
    profileP: 'Повний список із пошуком і фільтрами — на головній сторінці каталогу спеціалістів.',
    profileBtn: 'Відкрити каталог спеціалістів',
    startupEyebrow: 'Схожі компанії',
    startupH2: 'Повернутися до каталогу стартапів',
    startupP: 'Усі стартапи з фото та описами доступні в окремому каталозі.',
    startupBtn: 'Відкрити каталог стартапів',
    editorial: 'Матеріал згенеровано як синтетичний редакційний зразок для наповнення довідника; перевіряйте факти за первинними джерелами.',
    founded: 'Засновано',
    openProfile: 'Відкрити профіль',
    learnMore: 'Детальніше',
    photoAlt: 'Ілюстративне фото (Unsplash), тема: портрет спеціаліста',
    orgPhotoAlt: 'Ілюстративне фото (Unsplash), тема: команда та продукт',
    factsCountry: 'Країна / регіон',
    factsFocus: 'Професійний фокус',
    factsContrib: 'Ключовий внесок',
    overviewH: 'Професійний огляд',
    noteH: 'Редакційна примітка',
    startupFactsFounded: 'Засновано',
    startupFactsHq: 'HQ',
    startupFactsModel: 'Модель',
    startupOverviewH: 'Професійний огляд',
    startupMarket: 'Ринок',
    startupContrib: 'Ключовий внесок',
    startupCat: 'Категорія',
    strengths: 'Ключові сильні сторони',
    strength1: 'Чіткий продуктовий фокус у вузькій ніші.',
    strength2: 'Команда з досвідом інженерії та операцій.',
    strength3: 'Поступове масштабування без зайвого шуму в ЗМІ.'
  },
  en: {
    backSpec: 'Back to experts',
    backStart: 'All startups',
    profileEyebrow: 'Related',
    profileH2: 'Return to the directory',
    profileP: 'Browse the full specialist catalogue with search and filters.',
    profileBtn: 'Open specialist catalogue',
    startupEyebrow: 'Related',
    startupH2: 'Return to startup catalogue',
    startupP: 'All startups with photos and long-form blurbs live in the dedicated directory.',
    startupBtn: 'Open startup catalogue',
    editorial: 'Synthetic editorial sample for directory volume; treat claims as illustrative and verify with primary sources.',
    founded: 'Founded',
    openProfile: 'Open profile',
    learnMore: 'Learn more',
    photoAlt: 'Editorial stock portrait (Unsplash)',
    orgPhotoAlt: 'Editorial stock imagery (Unsplash): team and product',
    factsCountry: 'Country / region',
    factsFocus: 'Professional focus',
    factsContrib: 'Signature contribution',
    overviewH: 'Professional overview',
    noteH: 'Editorial note',
    startupFactsFounded: 'Founded',
    startupFactsHq: 'HQ',
    startupFactsModel: 'Model',
    startupOverviewH: 'Professional overview',
    startupMarket: 'Market',
    startupContrib: 'Signature contribution',
    startupCat: 'Category',
    strengths: 'Strengths',
    strength1: 'Tight product focus in a narrow niche.',
    strength2: 'Engineering-heavy team with operational discipline.',
    strength3: 'Quiet scaling without tabloid coverage.'
  },
  es: {
    backSpec: 'Volver a especialistas',
    backStart: 'Todas las startups',
    profileEyebrow: 'Relacionado',
    profileH2: 'Volver al catálogo',
    profileP: 'Lista completa con búsqueda y filtros en la página del catálogo.',
    profileBtn: 'Abrir catálogo de especialistas',
    startupEyebrow: 'Relacionado',
    startupH2: 'Volver al catálogo de startups',
    startupP: 'Todas las startups con fotos y textos largos están en el directorio dedicado.',
    startupBtn: 'Abrir catálogo de startups',
    editorial: 'Muestra editorial sintética para volumen del directorio; trate las afirmaciones como ilustrativas y contraste fuentes primarias.',
    founded: 'Fundada',
    openProfile: 'Abrir perfil',
    learnMore: 'Más información',
    photoAlt: 'Retrato editorial (Unsplash)',
    orgPhotoAlt: 'Imagen editorial (Unsplash): equipo y producto',
    factsCountry: 'País / región',
    factsFocus: 'Enfoque profesional',
    factsContrib: 'Contribución distintiva',
    overviewH: 'Resumen profesional',
    noteH: 'Nota editorial',
    startupFactsFounded: 'Fundación',
    startupFactsHq: 'Sede',
    startupFactsModel: 'Modelo',
    startupOverviewH: 'Resumen profesional',
    startupMarket: 'Mercado',
    startupContrib: 'Contribución distintiva',
    startupCat: 'Categoría',
    strengths: 'Fortalezas',
    strength1: 'Enfoque de producto muy claro en un nicho estrecho.',
    strength2: 'Equipo con fuerte base de ingeniería y operaciones.',
    strength3: 'Escalado silencioso sin titulares ruidosos.'
  },
  ru: {
    backSpec: 'К архиву экспертов',
    backStart: 'Все стартапы',
    profileEyebrow: 'См. также',
    profileH2: 'Вернуться в каталог',
    profileP: 'Полный список с поиском и фильтрами на странице каталога специалистов.',
    profileBtn: 'Открыть каталог специалистов',
    startupEyebrow: 'См. также',
    startupH2: 'Вернуться в каталог стартапов',
    startupP: 'Все стартапы с фотографиями и развёрнутыми текстами собраны в отдельном каталоге.',
    startupBtn: 'Открыть каталог стартапов',
    editorial: 'Синтетический редакционный образец для объёма справочника; проверяйте факты по первичным источникам.',
    founded: 'Основана',
    openProfile: 'Открыть профиль',
    learnMore: 'Подробнее',
    photoAlt: 'Иллюстративный портрет (Unsplash)',
    orgPhotoAlt: 'Иллюстративное фото (Unsplash): команда и продукт',
    factsCountry: 'Страна / регион',
    factsFocus: 'Профессиональный фокус',
    factsContrib: 'Ключевой вклад',
    overviewH: 'Профессиональный обзор',
    noteH: 'Редакционная заметка',
    startupFactsFounded: 'Год основания',
    startupFactsHq: 'Штаб-квартира',
    startupFactsModel: 'Модель',
    startupOverviewH: 'Профессиональный обзор',
    startupMarket: 'Рынок',
    startupContrib: 'Ключевой вклад',
    startupCat: 'Категория',
    strengths: 'Сильные стороны',
    strength1: 'Чёткий продуктовый фокус в узкой нише.',
    strength2: 'Команда с сильной инженерной и операционной базой.',
    strength3: 'Постепенное масштабирование без шумных заголовков в прессе.'
  }
};

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(s) {
  return escapeHtml(s).replace(/\n/g, ' ');
}

function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

function pickIdx(rng, arr) {
  return Math.floor(rng() * arr.length);
}

function padNum(n, w) {
  return String(n).padStart(w, '0');
}

function specialistSlug(i) {
  return `person-lp-${padNum(i, 4)}`;
}

function startupSlug(i) {
  return `startup-lp-${padNum(i, 3)}`;
}

function buildSpecialistBio(lang, name, country, domain, niche, years, rng) {
  const extra = {
    uk: 'Публікації рідкісні; робота відбувається переважно в закритих інженерних колах.',
    en: 'Public mentions are sparse; most impact shows up in tooling and internal playbooks.',
    es: 'Las menciones públicas son escasas; el impacto aparece en herramientas internas.',
    ru: 'Публичные упоминания редки; влияние проявляется во внутренних инструментах и практиках.'
  }[lang];
  const blocks = {
    uk: `${name} — маловідомий широкій аудиторії фахівець, який понад ${years} років працює в темі «${domain}» у контексті ${country}. Профіль зібрано як редакційний орієнтир: людина рідко виступає на великих сценах, зате її підхід до ${niche} помітний колегам і партнерам. Ми описуємо траєкторію без гучних формулювань, бо саме такі експерти часто тримають на собі критичні вузли продукту, стандарти якості та передачу знань між командами. ${extra} Текст нижче дає структурований огляд фокусу, країни та тегів; для будь-яких фактів звіряйте первинні джерела й офіційні сторінки, якщо вони існують.`,
    en: `${name} is a specialist who stays below mainstream headlines yet has spent more than ${years} years working on "${domain}" within ${country}. This card is an editorial briefing: the work surfaces in careful tooling, reviews, and mentoring rather than conference keynotes. Colleagues recognize the influence on ${niche}, especially where reliability, clarity, and pragmatic trade-offs matter. ${extra} The overview below summarizes focus areas and tags; cross-check any factual claims with primary sources and official pages when available.`,
    es: `${name} es una figura poco visible en titulares generales, con más de ${years} años trabajando en «${domain}» desde ${country}. Esta ficha es un contexto editorial: el impacto aparece en herramientas, revisiones técnicas y mentoría, no en autopromoción ruidosa. El enfoque en ${niche} se nota donde importan la fiabilidad y las decisiones sensatas. ${extra} El resumen siguiente organiza foco, país y etiquetas; contrasta cualquier dato con fuentes primarias y sitios oficiales si existen.`,
    ru: `${name} — специалист, редко попадающий в широкие заголовки, с более чем ${years} годами практики в области «${domain}» в контексте ${country}. Это редакционная справка: влияние проявляется в инструментах, ревью и передаче опыта, а не в медийном шуме. Коллеги отмечают вклад в ${niche}, особенно там, где важны надёжность и аккуратные компромиссы. ${extra} Ниже — структурированный обзор фокуса, страны и тегов; сверяйте факты с первичными источниками и официальными страницами, если они доступны.`
  };
  let text = blocks[lang];
  const pad = {
    uk: ` Додатковий абзац для повноти опису: акцент на ${domain}, ${niche}, ${country}; матеріал довідковий і не замінює первинні джерела.`,
    en: ` Additional briefing detail on ${domain}, ${niche}, and ${country}; reference-only, not a substitute for primary sources.`,
    es: ` Párrafo adicional sobre ${domain}, ${niche} y ${country}; texto de referencia, no sustituto de fuentes primarias.`,
    ru: ` Дополнительный абзац про ${domain}, ${niche} и ${country}; справочный текст, не замена первичным источникам.`
  }[lang];
  while (text.length < 300) text += pad;
  return text;
}

function buildStartupBio(lang, brand, city, vertical, wave, rng) {
  const blocks = {
    uk: `${brand} — маловідомий стартап із штабом у ${city}, який працює у вертикалі «${vertical}». Команда будує продукт для вузької аудиторії, тому назва рідко зʼявляється у стрічках новин, хоча інженерний фокус і швидкі ітерації помітні клієнтам. Редакційний огляд нижче пояснює ринок, модель і сильні сторони без маркетингових обіцянок. ${brand} позиціонує себе як ${wave}: менше галасу, більше перевірених сценаріїв впровадження, прозорі метрики та зрозумілий шлях масштабування. Ми наголошуємо, що це довідковий текст; перевіряйте фінансові й юридичні деталі за первинними джерелами.`,
    en: `${brand} is a low-profile startup headquartered in ${city}, focused on "${vertical}". The team ships for a narrow customer set, so the brand rarely hits mainstream news even though engineering velocity is visible to buyers. This editorial overview explains market framing, operating model, and strengths without marketing hype. ${brand} describes itself as ${wave}: fewer headlines, more grounded deployment patterns, transparent metrics, and a clear scaling path. Treat this page as reference prose and verify financial or legal details with primary sources.`,
    es: `${brand} es una startup poco ruidosa con base en ${city}, orientada a «${vertical}». Construye para un segmento estrecho, así que el nombre casi no aparece en medios generales, aunque la velocidad de ingeniería se nota en clientes. Este texto editorial resume mercado, modelo y fortalezas sin promesas vacías. ${brand} se presenta como ${wave}: menos titulares, más patrones de despliegue realistas, métricas transparentes y una ruta de escalado clara. Úsalo como contexto y contrasta datos financieros o legales con fuentes primarias.`,
    ru: `${brand} — низкошумный стартап со штабом в ${city}, сфокусированный на «${vertical}». Продукт ориентирован на узкую аудиторию, поэтому бренд редко попадает в новостные ленты, хотя скорость инженерных итераций заметна заказчикам. Ниже — редакционный обзор рынка, модели и сильных сторон без маркетинговых обещаний. ${brand} позиционирует себя как ${wave}: меньше заголовков, больше проверенных сценариев внедрения, прозрачные метрики и понятный путь масштабирования. Используйте страницу как справочную и сверяйте финансовые и юридические детали с первичными источниками.`
  };
  let text = blocks[lang];
  const pad = {
    uk: ` Додатковий контекст: ${city}, ${vertical}, ${wave}; опис редакційний.`,
    en: ` Additional context: ${city}, ${vertical}, ${wave}; editorial summary.`,
    es: ` Contexto adicional: ${city}, ${vertical}, ${wave}; resumen editorial.`,
    ru: ` Дополнительный контекст: ${city}, ${vertical}, ${wave}; редакционный обзор.`
  }[lang];
  while (text.length < 300) text += pad;
  return text;
}

function tagTriple(lang, filterKey, rng) {
  const pools = {
    uk: {
      operations: ['Операції', 'Логістика', 'Процеси'],
      software: ['Програмування', 'Платформа', 'Інструменти'],
      engineering: ['Інженерія', 'Системи', 'Надійність'],
      science: ['Наука', 'Дослідження', 'Моделі'],
      ceo: ['CEO', 'Стратегія', 'Стартапи']
    },
    en: {
      operations: ['Operations', 'Logistics', 'Processes'],
      software: ['Software', 'Platform', 'Tooling'],
      engineering: ['Engineering', 'Systems', 'Reliability'],
      science: ['Science', 'Research', 'Models'],
      ceo: ['CEO', 'Strategy', 'Startups']
    },
    es: {
      operations: ['Operaciones', 'Logística', 'Procesos'],
      software: ['Software', 'Plataforma', 'Herramientas'],
      engineering: ['Ingeniería', 'Sistemas', 'Fiabilidad'],
      science: ['Ciencia', 'Investigación', 'Modelos'],
      ceo: ['CEO', 'Estrategia', 'Startups']
    },
    ru: {
      operations: ['Операции', 'Логистика', 'Процессы'],
      software: ['Программирование', 'Платформа', 'Инструменты'],
      engineering: ['Инженерия', 'Системы', 'Надёжность'],
      science: ['Наука', 'Исследования', 'Модели'],
      ceo: ['CEO', 'Стратегия', 'Стартапы']
    }
  };
  const t = pools[lang][filterKey] || pools[lang].software;
  const a = [...t].sort(() => rng() - 0.5).slice(0, 3);
  return a;
}

function roleLine(lang, filterKey, domain) {
  const R = {
    uk: {
      operations: `Операційний лідер — ${domain}`,
      software: `Інженер ПЗ — ${domain}`,
      engineering: `Системний інженер — ${domain}`,
      science: `Дослідник — ${domain}`,
      ceo: `Співзасновник / CEO — ${domain}`
    },
    en: {
      operations: `Operations lead — ${domain}`,
      software: `Software engineer — ${domain}`,
      engineering: `Systems engineer — ${domain}`,
      science: `Researcher — ${domain}`,
      ceo: `Co-founder / CEO — ${domain}`
    },
    es: {
      operations: `Líder de operaciones — ${domain}`,
      software: `Ingeniero de software — ${domain}`,
      engineering: `Ingeniero de sistemas — ${domain}`,
      science: `Investigador — ${domain}`,
      ceo: `Cofundador / CEO — ${domain}`
    },
    ru: {
      operations: `Лидер операций — ${domain}`,
      software: `Инженер ПО — ${domain}`,
      engineering: `Системный инженер — ${domain}`,
      science: `Исследователь — ${domain}`,
      ceo: `Сооснователь / CEO — ${domain}`
    }
  };
  return R[lang][filterKey] || R[lang].software;
}

function startupMetaLine(lang, vertical) {
  const v = {
    uk: `Продуктова компанія — ${vertical}`,
    en: `Product company — ${vertical}`,
    es: `Empresa de producto — ${vertical}`,
    ru: `Продуктовая компания — ${vertical}`
  };
  return v[lang];
}

function cityFor(lang, rng) {
  const cities = {
    uk: ['Київ', 'Варшава', 'Таллінн', 'Берлін', 'Стокгольм', 'Ліон', 'Торонто', 'Остін', 'Бристоль', 'Роттердам'],
    en: ['Kyiv', 'Warsaw', 'Tallinn', 'Berlin', 'Stockholm', 'Lyon', 'Toronto', 'Austin', 'Bristol', 'Rotterdam'],
    es: ['Kiev', 'Varsovia', 'Tallin', 'Berlín', 'Estocolmo', 'Lyon', 'Toronto', 'Austin', 'Bristol', 'Róterdam'],
    ru: ['Киев', 'Варшава', 'Таллин', 'Берлин', 'Стокгольм', 'Лион', 'Торонто', 'Остин', 'Бристоль', 'Роттердам']
  };
  return pick(rng, cities[lang]);
}

function startupName(i, rng) {
  const p = ['Lumen', 'North', 'Quiet', 'Signal', 'River', 'Atlas', 'Clear', 'Blue', 'Silver', 'Vertex'];
  const s = ['Arc', 'Layer', 'Grid', 'Stack', 'Pilot', 'Works', 'Forge', 'Bridge', 'Pulse', 'Field'];
  return `${pick(rng, p)}${pick(rng, s)} ${padNum(i, 3)}`;
}

function wipeOldPattern(dir, prefix) {
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir)) {
    if (f.startsWith(prefix) && f.endsWith('.html')) {
      fs.unlinkSync(path.join(dir, f));
    }
  }
}

function writePersonProfile(lang, i, ctx) {
  const slug = specialistSlug(i);
  const file = `${slug}${lang === 'uk' ? '' : `-${lang}`}.html`;
  const hrefSpec =
    lang === 'uk' ? 'specialists.html' : lang === 'en' ? 'specialists-en.html' : lang === 'es' ? 'specialists-es.html' : 'specialists-ru.html';
  const u = UI[lang];
  const title = `${ctx.name} — ${ctx.roleShort} | Rybezh`;
  const desc = ctx.bio.slice(0, 155).replace(/\s+\S*$/, '') + '…';
  const tagsHtml = ctx.tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join('');
  const html = `<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeAttr(desc)}">

<article class="content-wrapper profile-page">
  <a class="back-link" href="${hrefSpec}">${escapeHtml(u.backSpec)}</a>
  <header class="profile-header">
    <img src="${escapeAttr(ctx.photo)}" alt="${escapeAttr(u.photoAlt)}" class="profile-avatar-large" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(ctx.name)}&size=720&background=eef4ff&color=2563eb&bold=true';">
    <div class="profile-info">
      <p class="eyebrow">${escapeHtml(ctx.country)}</p>
      <h1>${escapeHtml(ctx.name)}</h1>
      <h2>${escapeHtml(ctx.roleShort)}</h2>
      <div class="tags">${tagsHtml}</div>
    </div>
  </header>
  <section class="profile-facts">
    <div><strong>${escapeHtml(u.factsCountry)}</strong><span>${escapeHtml(ctx.country)}</span></div>
    <div><strong>${escapeHtml(u.factsFocus)}</strong><span>${escapeHtml(ctx.domain)} · ${escapeHtml(ctx.niche)}</span></div>
    <div><strong>${escapeHtml(u.factsContrib)}</strong><span>${escapeHtml(ctx.contrib)}</span></div>
  </section>
  <section class="profile-content">
    <h3>${escapeHtml(u.overviewH)}</h3>
    <p>${escapeHtml(ctx.bio)}</p>
  </section>
  <section class="editorial-note">
    <h3>${escapeHtml(u.noteH)}</h3>
    <p>${escapeHtml(u.editorial)}</p>
  </section>
  <section class="profile-related">
    <div class="section-intro">
      <p class="eyebrow">${escapeHtml(u.profileEyebrow)}</p>
      <h2>${escapeHtml(u.profileH2)}</h2>
      <p>${escapeHtml(u.profileP)}</p>
    </div>
    <p><a class="btn" href="${hrefSpec}">${escapeHtml(u.profileBtn)}</a></p>
  </section>
</article>
`;
  fs.writeFileSync(path.join(PROFILES, file), html, 'utf8');
}

function writeStartupProfile(lang, i, ctx) {
  const slug = startupSlug(i);
  const file = `${slug}${lang === 'uk' ? '' : `-${lang}`}.html`;
  const hrefSt =
    lang === 'uk' ? 'startups.html' : lang === 'en' ? 'startups-en.html' : lang === 'es' ? 'startups-es.html' : 'startups-ru.html';
  const u = UI[lang];
  const title = `${ctx.brand} — ${ctx.metaLine} | Rybezh`;
  const desc = ctx.bio.slice(0, 155).replace(/\s+\S*$/, '') + '…';
  const tagsHtml = ctx.tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join('');
  const html = `<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeAttr(desc)}">

<article class="content-wrapper startup-page">
  <a class="back-link" href="${hrefSt}">${escapeHtml(u.backStart)}</a>
  <header class="profile-header startup-header">
    <img src="${escapeAttr(ctx.photo)}" alt="${escapeAttr(ctx.brand)}" class="profile-avatar-large startup-logo-large" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(ctx.brand)}&size=720&background=eef4ff&color=2563eb&bold=true';">
    <div class="profile-info">
      <p class="eyebrow">${escapeHtml(u.founded)} ${ctx.year}</p>
      <h1>${escapeHtml(ctx.brand)}</h1>
      <h2>${escapeHtml(ctx.metaLine)}</h2>
      <div class="tags">${tagsHtml}</div>
    </div>
  </header>
  <section class="profile-facts startup-facts">
    <div><strong>${escapeHtml(u.startupFactsFounded)}</strong><span>${ctx.year}</span></div>
    <div><strong>${escapeHtml(u.startupFactsHq)}</strong><span>${escapeHtml(ctx.city)}, ${escapeHtml(ctx.country)}</span></div>
    <div><strong>${escapeHtml(u.startupFactsModel)}</strong><span>${escapeHtml(ctx.model)}</span></div>
  </section>
  <section class="profile-content">
    <h3>${escapeHtml(u.startupOverviewH)}</h3>
    <p>${escapeHtml(ctx.bio)}</p>
  </section>
  <section class="profile-facts startup-facts startup-facts-secondary">
    <div><strong>${escapeHtml(u.startupMarket)}</strong><span>${escapeHtml(ctx.vertical)}</span></div>
    <div><strong>${escapeHtml(u.startupContrib)}</strong><span>${escapeHtml(ctx.contrib)}</span></div>
    <div><strong>${escapeHtml(u.startupCat)}</strong><span>${escapeHtml(ctx.filterKey)}</span></div>
  </section>
  <section class="highlight-list startup-signals">
    <h3>${escapeHtml(u.strengths)}</h3>
    <ul><li>${escapeHtml(u.strength1)}</li><li>${escapeHtml(u.strength2)}</li><li>${escapeHtml(u.strength3)}</li></ul>
  </section>
  <section class="editorial-note">
    <h3>${escapeHtml(u.noteH)}</h3>
    <p>${escapeHtml(u.editorial)}</p>
  </section>
  <section class="profile-related">
    <div class="section-intro">
      <p class="eyebrow">${escapeHtml(u.startupEyebrow)}</p>
      <h2>${escapeHtml(u.startupH2)}</h2>
      <p>${escapeHtml(u.startupP)}</p>
    </div>
    <p><a class="btn" href="${hrefSt}">${escapeHtml(u.startupBtn)}</a></p>
  </section>
</article>
`;
  fs.writeFileSync(path.join(STARTUPS, file), html, 'utf8');
}

function cardPerson(lang, i) {
  const rng = mulberry32(i * 977 + (lang === 'uk' ? 1 : lang === 'en' ? 2 : lang === 'es' ? 3 : 4));
  const first = pick(rng, FIRST);
  const last = pick(rng, LAST);
  const name = `${first} ${last}`;
  const ci = pickIdx(rng, COUNTRY_BY_LANG.uk);
  const country = COUNTRY_BY_LANG[lang][ci];
  const domain = pick(rng, DOMAINS);
  const niche = pick(rng, DOMAINS);
  const years = 4 + Math.floor(rng() * 16);
  const filterKey = pick(rng, FILTER_KEYS);
  const tags = tagTriple(lang, filterKey, rng);
  const roleShort = roleLine(lang, filterKey, domain);
  const bio = buildSpecialistBio(lang, name, country, domain, niche, years, rng);
  const photo = UNSPLASH_PEOPLE[(i * 17 + ci * 3) % UNSPLASH_PEOPLE.length];
  const slug = specialistSlug(i);
  const href = `${slug}${lang === 'uk' ? '' : `-${lang}`}.html`;
  const order = CATALOG_ORDER_BASE + i;
  const search = `${name} ${roleShort} ${country} ${domain} ${tags.join(' ')}`.toLowerCase();
  const catalogCard = `<article class="card profile-card" data-directory-card data-filter-key="${filterKey}" data-country="${escapeAttr(country)}" data-sort-name="${escapeAttr(name)}" data-catalog-order="${order}" data-search="${escapeAttr(search)}">
    <img src="${escapeAttr(photo)}" alt="${escapeAttr(name)}" loading="lazy" decoding="async" sizes="(max-width: 720px) 100vw, (max-width: 1120px) 50vw, 360px" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=720&background=eef4ff&color=2563eb&bold=true';">
    <div class="card-body">
      <p class="eyebrow">${escapeHtml(country)}</p>
      <h3>${escapeHtml(name)}</h3>
      <p class="meta">${escapeHtml(roleShort)}</p>
      <div class="tags">${tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>
      <a class="btn" href="${escapeAttr(href)}">${escapeHtml(UI[lang].openProfile)}</a>
    </div>
  </article>`;
  const contrib =
    lang === 'uk'
      ? `Методичні гайди та внутрішні стандарти якості для ${domain}.`
      : lang === 'en'
        ? `Internal quality standards and pragmatic playbooks for ${domain}.`
        : lang === 'es'
          ? `Guías internas y estándares de calidad para ${domain}.`
          : `Внутренние стандарты качества и практические гайды для ${domain}.`;
  return { name, country, domain, niche, roleShort, bio, photo, tags, filterKey, catalogCard, contrib };
}

function cardStartup(lang, i) {
  const rng = mulberry32(i * 499 + 10000 + (lang === 'uk' ? 1 : lang === 'en' ? 2 : lang === 'es' ? 3 : 4));
  const brand = startupName(i, rng);
  const ci = pickIdx(rng, COUNTRY_BY_LANG.uk);
  const country = COUNTRY_BY_LANG[lang][ci];
  const city = cityFor(lang, rng);
  const vertical = pick(rng, DOMAINS);
  const wave = {
    uk: 'тиха продуктова студія з акцентом на впровадження',
    en: 'a quiet product studio focused on pragmatic rollouts',
    es: 'un estudio de producto discreto centrado en despliegues pragmáticos',
    ru: 'низкошумная продуктовая студия с упором на внедрение'
  }[lang];
  const filterKey = pick(rng, ['software', 'fintech', 'operations', 'design', 'hardware']);
  const tagWord = vertical.split(/[\s/]+/)[0] || 'product';
  const tags =
    lang === 'uk'
      ? ['Стартапи', tagWord, 'Інженерія']
      : lang === 'en'
        ? ['Startups', tagWord, 'Engineering']
        : lang === 'es'
          ? ['Startups', tagWord, 'Ingeniería']
          : ['Стартапы', tagWord, 'Инженерия'];
  const year = 2016 + Math.floor(rng() * 10);
  const bio = buildStartupBio(lang, brand, city, vertical, wave, rng);
  const photo = UNSPLASH_ORG[(i * 13 + ci) % UNSPLASH_ORG.length];
  const slug = startupSlug(i);
  const href = `${slug}${lang === 'uk' ? '' : `-${lang}`}.html`;
  const order = CATALOG_ORDER_BASE + i;
  const metaLine = startupMetaLine(lang, vertical);
  const model =
    lang === 'uk'
      ? 'B2B SaaS та послуги впровадження'
      : lang === 'en'
        ? 'B2B SaaS plus implementation services'
        : lang === 'es'
          ? 'SaaS B2B más servicios de implementación'
          : 'B2B SaaS и услуги внедрения';
  const contrib =
    lang === 'uk'
      ? `Зменшення операційного ризику для клієнтів у сегменті ${vertical}.`
      : lang === 'en'
        ? `Reduces operational risk for buyers in ${vertical}.`
        : lang === 'es'
          ? `Reduce el riesgo operativo para clientes en ${vertical}.`
          : `Снижает операционные риски заказчиков в ${vertical}.`;
  const search = `${brand} ${metaLine} ${country} ${city} ${vertical}`.toLowerCase();
  const foundedLabel = UI[lang].founded;
  const catalogCard = `<article class="card startup-card" data-directory-card data-filter-key="${filterKey}" data-country="${escapeAttr(country)}" data-founded="${year}" data-sort-name="${escapeAttr(brand)}" data-catalog-order="${order}" data-search="${escapeAttr(search)}">
    <img src="${escapeAttr(photo)}" alt="${escapeAttr(brand)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(brand)}&size=720&background=eef4ff&color=2563eb&bold=true';">
    <div class="card-body">
      <p class="eyebrow">${escapeHtml(foundedLabel)} ${year}</p>
      <h3>${escapeHtml(brand)}</h3>
      <p class="meta">${escapeHtml(metaLine)}</p>
      <p>${escapeHtml(bio.slice(0, 220))}…</p>
      <div class="tags">${tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>
      <a class="btn" href="${escapeAttr(href)}">${escapeHtml(UI[lang].learnMore)}</a>
    </div>
  </article>`;
  return { brand, country, city, vertical, bio, photo, tags, filterKey, year, metaLine, model, contrib, catalogCard };
}

function main() {
  fs.mkdirSync(GENERATED, { recursive: true });
  wipeOldPattern(PROFILES, 'person-lp-');
  wipeOldPattern(STARTUPS, 'startup-lp-');

  const langs = ['uk', 'en', 'es', 'ru'];
  const specInc = { uk: [], en: [], es: [], ru: [] };
  const startInc = { uk: [], en: [], es: [], ru: [] };

  for (let i = 1; i <= SPECIALIST_COUNT; i += 1) {
    for (const lang of langs) {
      const ctx = cardPerson(lang, i);
      specInc[lang].push(ctx.catalogCard);
      writePersonProfile(lang, i, ctx);
    }
    if (i % 200 === 0) process.stdout.write(`specialists ${i}/${SPECIALIST_COUNT}\n`);
  }

  for (let i = 1; i <= STARTUP_COUNT; i += 1) {
    for (const lang of langs) {
      const ctx = cardStartup(lang, i);
      startInc[lang].push(ctx.catalogCard);
      writeStartupProfile(lang, i, ctx);
    }
  }

  for (const lang of langs) {
    fs.writeFileSync(path.join(GENERATED, `bulk-specialists-${lang}.inc.html`), specInc[lang].join('\n'), 'utf8');
    fs.writeFileSync(path.join(GENERATED, `bulk-startups-${lang}.inc.html`), startInc[lang].join('\n'), 'utf8');
  }

  console.log(
    `generate-bulk-directory: ${SPECIALIST_COUNT} specialists × 4 langs, ${STARTUP_COUNT} startups × 4 langs -> ${GENERATED}`
  );
}

main();
