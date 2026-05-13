import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const SRC_DIR = 'src';
const DIST_DIR = 'dist';
const TEMPLATE_FILE = path.join(SRC_DIR, 'templates', 'page.html');

/** Editorial Unsplash photos — reliable CDN, replaces broken third-party logo APIs in output HTML. */
const UNSPLASH_STARTUP_POOL = [
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=80'
];

function hashStringForIndex(str, modulus) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h % modulus;
}

function pickUnsplashFromPool(seed) {
  return UNSPLASH_STARTUP_POOL[hashStringForIndex(seed, UNSPLASH_STARTUP_POOL.length)];
}

function extractImgAlt(tag) {
  const d = tag.match(/\salt\s*=\s*"([^"]*)"/i);
  if (d) return d[1].trim();
  const s = tag.match(/\salt\s*=\s*'([^']*)'/i);
  return s ? s[1].trim() : '';
}

/**
 * Clearbit logo URLs often return empty or blocked responses without firing img onerror.
 * Swap them for stable Unsplash hero imagery at build time.
 */
function injectBulkCatalogHtml(html, filename) {
  const marker = '<!--RYBEZH_BULK_INJECT-->';
  if (!html.includes(marker)) return html;
  const base = filename.replace(/-(en|es|ru)\.html$/i, '.html');
  let lang = 'uk';
  if (filename.endsWith('-en.html')) lang = 'en';
  else if (filename.endsWith('-es.html')) lang = 'es';
  else if (filename.endsWith('-ru.html')) lang = 'ru';
  let incName = '';
  if (/^specialists\.html$/i.test(base)) incName = `bulk-specialists-${lang}.inc.html`;
  else if (/^startups\.html$/i.test(base)) incName = `bulk-startups-${lang}.inc.html`;
  if (!incName) return html.replaceAll(marker, '');
  const incPath = path.join(SRC_DIR, 'generated', incName);
  if (!fs.existsSync(incPath)) return html.replaceAll(marker, '');
  const bulk = fs.readFileSync(incPath, 'utf8');
  return html.replaceAll(marker, bulk);
}

function replaceClearbitLogoImages(html, basename) {
  return html.replace(/<img\b[^>]*\ssrc="https:\/\/logo\.clearbit\.com\/[^"]+"[^>]*>/gi, (full) => {
    if (/images\.unsplash\.com/i.test(full)) return full;
    let alt = extractImgAlt(full);
    if (!alt) {
      alt = basename
        .replace(/\.html$/i, '')
        .replace(/^startup-/i, '')
        .replace(/-(en|es|ru)$/i, '')
        .replace(/-/g, ' ')
        .trim() || 'Startup';
    }
    const src = pickUnsplashFromPool(alt);
    let next = full.replace(/\ssrc="https:\/\/logo\.clearbit\.com\/[^"]+"/i, ` src="${src}"`);
    if (/\salt="/i.test(next)) {
      next = next.replace(/\salt="[^"]*"/i, ` alt="${alt.replace(/"/g, '&quot;')}"`);
    } else {
      next = next.replace(/<img\b/i, `<img alt="${alt.replace(/"/g, '&quot;')}"`);
    }
    if (!/referrerpolicy/i.test(next)) {
      next = next.replace(/>$/, ' referrerpolicy="no-referrer">');
    }
    return next;
  });
}

function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s*([{}:;,>])\s*/g, '$1')
    .replace(/;}/g, '}')
    .replace(/\s+/g, ' ')
    .trim();
}

function minifyJs(js) {
  return js
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}();,:=+<>\-])\s*/g, '$1')
    .trim();
}

function minifyHtml(html) {
  return html
    .replace(/>\s+</g, '><')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function minifyAssetIfNeeded(filePath, content) {
  if (filePath.endsWith('.css')) return minifyCss(content);
  if (filePath.endsWith('.js')) return minifyJs(content);
  return content;
}


function ensureGeneratedCatalogData() {
  const generatedDir = path.join(SRC_DIR, 'generated');
  if (!fs.existsSync(generatedDir)) {
    fs.mkdirSync(generatedDir, { recursive: true });
  }
  execSync('node scripts/generate-bulk-directory.mjs', { stdio: 'inherit' });
  execSync('node scripts/emit-site-search-index.mjs', { stdio: 'inherit' });
}

ensureGeneratedCatalogData();

const translations = {
  uk: {
    navAria: 'Головна навігація',
    navHome: 'Головна',
    navSpecialists: 'Спеціалісти',
    navStartups: 'Стартапи',
    navMethodology: 'Методологія',
    navFaq: 'Питання й відповіді',
    navInterview: 'Тренажер співбесіди',
    navMenu: 'Меню',
    navPrivacy: 'Конфіденційність',
    navCookies: 'Cookies',
    navTerms: 'Умови',
    skipLink: 'Перейти до основного вмісту',
    brandTagline: 'Редакційний атлас людей і компаній',
    contactLabel: 'Написати:',
    footerAbout:
      'Редакційний довідник Rybezh.site: короткі профілі фахівців, керівників і технологічних компаній, з виходом на первинні джерела.',
    footerNavTitle: 'Навігація',
    footerScopeTitle: 'Про базу',
    footerScopeText:
      'Матеріали для орієнтації в темі; це не стрічка новин і не майданчик вакансій. Факти звіряйте з офіційними сайтами та публікаціями.',
    footerLanguages: 'Мови: українська, англійська, іспанська, російська.',
    footerRights: 'Усі права захищені.',
    footerPoliciesTitle: 'Політики',
    footerPoliciesText:
      'Сторінки про конфіденційність, cookies та умови; як збираємо матеріали — у розділі «Методологія»; типові запитання — у «Питання й відповіді».',
    footerTagline: 'Первинні джерела завжди мають пріоритет перед цим довідником.',
    footerSitemap: 'Карта сайту',
    cookieTitle: 'Ми використовуємо лише базові cookies',
    cookieText:
      'Сайт зберігає в браузері вибір теми та вашу відповідь щодо cookies. Деталі — на сторінці політики cookies.',
    cookieAccept: 'Прийняти',
    cookieDecline: 'Відхилити',
    searchAria: 'Пошук по всьому сайту',
    searchPlaceholder: 'Пошук: імʼя, компанія, сторінка…',
    searchBadgePerson: 'Спеціаліст',
    searchBadgeStartup: 'Стартап',
    searchBadgePage: 'Сторінка',
    searchEmpty: 'Нічого не знайдено',
    searchHint: 'результатів у списку'
  },
  en: {
    navAria: 'Main navigation',
    navHome: 'Home',
    navSpecialists: 'Specialists',
    navStartups: 'Startups',
    navMethodology: 'Methodology',
    navFaq: 'FAQ',
    navInterview: 'Interview drill',
    navMenu: 'Menu',
    navPrivacy: 'Privacy',
    navCookies: 'Cookies',
    navTerms: 'Terms',
    skipLink: 'Skip to main content',
    brandTagline: 'Editorial atlas of people and companies',
    contactLabel: 'Email:',
    footerAbout:
      'Rybezh.site is an editorial directory of specialists, leaders, and tech companies—short entries that point to primary sources.',
    footerNavTitle: 'Navigation',
    footerScopeTitle: 'About this site',
    footerScopeText:
      'Reference-style pages for context; not a news feed or a jobs board. Cross-check facts on official sites and publications.',
    footerLanguages: 'Languages: Ukrainian, English, Spanish, Russian.',
    footerRights: 'All rights reserved.',
    footerPoliciesTitle: 'Policies',
    footerPoliciesText:
      'Privacy, cookies, and terms pages are linked above; methodology is explained in its own section, and common questions in the FAQ.',
    footerTagline: 'Primary sources outweigh this directory when they disagree.',
    footerSitemap: 'Sitemap',
    cookieTitle: 'We use only basic cookies',
    cookieText:
      'The site stores your theme choice and cookie-banner response in the browser. See the cookies policy for details.',
    cookieAccept: 'Accept',
    cookieDecline: 'Decline',
    searchAria: 'Site-wide search',
    searchPlaceholder: 'Search people, companies, pages…',
    searchBadgePerson: 'Specialist',
    searchBadgeStartup: 'Company',
    searchBadgePage: 'Page',
    searchEmpty: 'No matches',
    searchHint: 'results in list'
  },
  es: {
    navAria: 'Navegación principal',
    navHome: 'Inicio',
    navSpecialists: 'Especialistas',
    navStartups: 'Startups',
    navMethodology: 'Metodología',
    navFaq: 'Preguntas frecuentes',
    navInterview: 'Simulacro de entrevista',
    navMenu: 'Menú',
    navPrivacy: 'Privacidad',
    navCookies: 'Cookies',
    navTerms: 'Términos',
    skipLink: 'Ir al contenido principal',
    brandTagline: 'Atlas editorial de personas y empresas',
    contactLabel: 'Correo:',
    footerAbout:
      'Rybezh.site es un directorio editorial sobre especialistas, directivos y empresas tecnológicas, con enlaces a fuentes primarias.',
    footerNavTitle: 'Navegación',
    footerScopeTitle: 'Sobre el sitio',
    footerScopeText:
      'Textos de referencia para orientarte; no es un medio de noticias ni un portal de empleo. Contrasta los datos en fuentes oficiales.',
    footerLanguages: 'Idiomas: ucraniano, inglés, español y ruso.',
    footerRights: 'Todos los derechos reservados.',
    footerPoliciesTitle: 'Políticas',
    footerPoliciesText:
      'Páginas de privacidad, cookies y términos enlazadas arriba; la metodología está en su propia sección y las dudas frecuentes en Preguntas frecuentes.',
    footerTagline: 'Si hay discrepancia, prevalecen las fuentes primarias.',
    footerSitemap: 'Mapa del sitio',
    cookieTitle: 'Usamos solo cookies básicas',
    cookieText:
      'El sitio guarda en el navegador el tema y tu respuesta al aviso de cookies. Más información en la política de cookies.',
    cookieAccept: 'Aceptar',
    cookieDecline: 'Rechazar',
    searchAria: 'Búsqueda en el sitio',
    searchPlaceholder: 'Buscar personas, empresas, páginas…',
    searchBadgePerson: 'Especialista',
    searchBadgeStartup: 'Empresa',
    searchBadgePage: 'Página',
    searchEmpty: 'Sin resultados',
    searchHint: 'resultados en la lista'
  },
  ru: {
    navAria: 'Главная навигация',
    navHome: 'Главная',
    navSpecialists: 'Специалисты',
    navStartups: 'Стартапы',
    navMethodology: 'Методология',
    navFaq: 'Вопросы и ответы',
    navInterview: 'Тренажёр собеседования',
    navMenu: 'Меню',
    navPrivacy: 'Конфиденциальность',
    navCookies: 'Cookies',
    navTerms: 'Условия',
    skipLink: 'Перейти к основному содержимому',
    brandTagline: 'Редакционный атлас людей и компаний',
    contactLabel: 'Почта:',
    footerAbout:
      'Редакционный справочник Rybezh.site: краткие заметки о специалистах, руководителях и технологических компаниях, со ссылками на первоисточники.',
    footerNavTitle: 'Навигация',
    footerScopeTitle: 'О сайте',
    footerScopeText:
      'Материалы для ориентира, это не новостная лента и не площадка вакансий. Факты сверяйте с официальными сайтами и публикациями.',
    footerLanguages: 'Языки: украинский, английский, испанский, русский.',
    footerRights: 'Все права защищены.',
    footerPoliciesTitle: 'Политики',
    footerPoliciesText:
      'Страницы о конфиденциальности, cookies и условиях — в ссылках выше; как собираем материалы — в разделе «Методология»; типичные вопросы — в «Вопросы и ответы».',
    footerTagline: 'При расхождении приоритет у первичных источников.',
    footerSitemap: 'Карта сайта',
    cookieTitle: 'Мы используем только базовые cookies',
    cookieText:
      'Сайт сохраняет в браузере выбор темы и ваш ответ по cookies. Подробности — на странице политики cookies.',
    cookieAccept: 'Принять',
    cookieDecline: 'Отклонить',
    searchAria: 'Поиск по сайту',
    searchPlaceholder: 'Поиск: имя, компания, страница…',
    searchBadgePerson: 'Специалист',
    searchBadgeStartup: 'Компания',
    searchBadgePage: 'Страница',
    searchEmpty: 'Ничего не найдено',
    searchHint: 'результатов в списке'
  }
};

const editorialUi = {
  uk: {
    navDockAria: 'Швидка навігація',
    cmdOpenAria: 'Відкрити палітру пошуку',
    cmdHint: 'Натисніть / або Ctrl+K',
    cmdTitle: 'Пошук по Rybezh',
    cmdClose: 'Закрити',
    cmdRecent: 'Недавні запити',
    cmdSuggested: 'Підказки',
    filterAll: 'Усе',
    filterPeople: 'Люди',
    filterCompanies: 'Компанії',
    filterPages: 'Сторінки',
    breadcrumbAria: 'Навігаційний шлях',
    intelAsideAria: 'Редакційний контекст',
    timelineTitle: 'Лінія ролей',
    timelineNow: 'Поточний опис у картці',
    timelineDesk: 'Знімок файлу',
    expertiseTitle: 'Граф експертизи',
    influenceTitle: 'Зони впливу',
    influenceIntro: 'Теги з профілю зібрані як сигнал тем — не формальна класифікація.',
    sourcesTitle: 'Зовнішні посилання',
    sourcesIntro: 'Поза Rybezh; первинні матеріали звіряйте на оригінальних сторінках.',
    verifyTitle: 'Як перевіряємо',
    verifyBody:
      'Запис збирається з публічних джерел і проходить редакційний прохід. У розбіжностях пріоритет у первинних матеріалах.',
    lastUpdated: 'Остання зміна файлу',
    deskNoteTitle: 'Редакційна нотатка',
    deskNoteBody: 'Короткий орієнтир для читання — не біографія й не оцінка заслуг.',
    orgIntelAsideAria: 'Редакційний контекст компанії',
    orgTimelineTitle: 'Ключові опори',
    orgTimelineProduct: 'Продуктовий фокус у картці',
    orgTimelineDesk: 'Знімок файлу'
  },
  en: {
    navDockAria: 'Quick navigation',
    cmdOpenAria: 'Open search palette',
    cmdHint: 'Press / or Ctrl+K',
    cmdTitle: 'Search Rybezh',
    cmdClose: 'Close',
    cmdRecent: 'Recent queries',
    cmdSuggested: 'Suggestions',
    filterAll: 'All',
    filterPeople: 'People',
    filterCompanies: 'Companies',
    filterPages: 'Pages',
    breadcrumbAria: 'Breadcrumb',
    intelAsideAria: 'Editorial context',
    timelineTitle: 'Role timeline',
    timelineNow: 'Current framing on this card',
    timelineDesk: 'File snapshot',
    expertiseTitle: 'Expertise map',
    influenceTitle: 'Influence areas',
    influenceIntro: 'Tags from the card grouped as a light signal of themes—not a formal taxonomy.',
    sourcesTitle: 'External references',
    sourcesIntro: 'Outside Rybezh; verify primary material at the source.',
    verifyTitle: 'Verification',
    verifyBody:
      'Compiled from public sources and edited for clarity. Primary sources win when facts diverge.',
    lastUpdated: 'Last file update',
    deskNoteTitle: 'Editorial note',
    deskNoteBody: 'A concise briefing for reading—not a biography or an awards list.',
    orgIntelAsideAria: 'Company editorial context',
    orgTimelineTitle: 'Anchors',
    orgTimelineProduct: 'Product focus on this card',
    orgTimelineDesk: 'File snapshot'
  },
  es: {
    navDockAria: 'Navegación rápida',
    cmdOpenAria: 'Abrir paleta de búsqueda',
    cmdHint: 'Pulsa / o Ctrl+K',
    cmdTitle: 'Buscar en Rybezh',
    cmdClose: 'Cerrar',
    cmdRecent: 'Búsquedas recientes',
    cmdSuggested: 'Sugerencias',
    filterAll: 'Todo',
    filterPeople: 'Personas',
    filterCompanies: 'Empresas',
    filterPages: 'Páginas',
    breadcrumbAria: 'Migas de pan',
    intelAsideAria: 'Contexto editorial',
    timelineTitle: 'Línea de roles',
    timelineNow: 'Encuadre actual en la ficha',
    timelineDesk: 'Instantánea del archivo',
    expertiseTitle: 'Mapa de expertise',
    influenceTitle: 'Áreas de influencia',
    influenceIntro: 'Etiquetas agrupadas como señal temática ligera, no taxonomía formal.',
    sourcesTitle: 'Referencias externas',
    sourcesIntro: 'Fuera de Rybezh; contrasta el material primario en origen.',
    verifyTitle: 'Verificación',
    verifyBody:
      'Compilado desde fuentes públicas y editado para claridad. Las fuentes primarias prevalecen si hay discrepancias.',
    lastUpdated: 'Última actualización del archivo',
    deskNoteTitle: 'Nota editorial',
    deskNoteBody: 'Resumen breve para lectura: no es biografía ni palmarés.',
    orgIntelAsideAria: 'Contexto editorial de la empresa',
    orgTimelineTitle: 'Anclas',
    orgTimelineProduct: 'Foco de producto en la ficha',
    orgTimelineDesk: 'Instantánea del archivo'
  },
  ru: {
    navDockAria: 'Быстрая навигация',
    cmdOpenAria: 'Открыть палитру поиска',
    cmdHint: 'Нажмите / или Ctrl+K',
    cmdTitle: 'Поиск по Rybezh',
    cmdClose: 'Закрыть',
    cmdRecent: 'Недавние запросы',
    cmdSuggested: 'Подсказки',
    filterAll: 'Всё',
    filterPeople: 'Люди',
    filterCompanies: 'Компании',
    filterPages: 'Страницы',
    breadcrumbAria: 'Навигационная цепочка',
    intelAsideAria: 'Редакционный контекст',
    timelineTitle: 'Линия ролей',
    timelineNow: 'Текущее описание в карточке',
    timelineDesk: 'Снимок файла',
    expertiseTitle: 'Карта экспертизы',
    influenceTitle: 'Зоны влияния',
    influenceIntro: 'Теги из карточки как лёгкий сигнал тем — не формальная классификация.',
    sourcesTitle: 'Внешние ссылки',
    sourcesIntro: 'Вне Rybezh; первичные материалы сверяйте на оригинальных страницах.',
    verifyTitle: 'Как проверяем',
    verifyBody:
      'Материал собран из публичных источников и проходит редакционную вычитку. При расхождениях приоритет у первичных источников.',
    lastUpdated: 'Последнее изменение файла',
    deskNoteTitle: 'Редакционная заметка',
    deskNoteBody: 'Краткий ориентир для чтения — не биография и не список наград.',
    orgIntelAsideAria: 'Редакционный контекст компании',
    orgTimelineTitle: 'Опорные точки',
    orgTimelineProduct: 'Продуктовый фокус в карточке',
    orgTimelineDesk: 'Снимок файла'
  }
};

function escapeAttr(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;');
}

function extractOgImage(html) {
  const m = html.match(/<img[^>]+src="([^"]+)"/i);
  return m ? m[1].trim() : '';
}

function extractProfileSignals(html) {
  const h1m = html.match(/<h1[^>]*>([^<]*)<\/h1>/i);
  const h2m = html.match(/<h2[^>]*>([^<]*)<\/h2>/i);
  const tags = [];
  const reTag = /<span[^>]*class="[^"]*\btag\b[^"]*"[^>]*>([^<]+)<\/span>/gi;
  let tm;
  while ((tm = reTag.exec(html)) !== null) {
    const v = tm[1].trim();
    if (v && !tags.includes(v)) tags.push(v);
  }
  return {
    h1: h1m ? h1m[1].trim() : '',
    h2: h2m ? h2m[1].trim() : '',
    tags
  };
}

function collectExternalLinks(html) {
  const out = [];
  const re = /<a[^>]+href="(https?:\/\/[^"]+)"/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    if (!/rybezh\.site/i.test(m[1])) out.push(m[1]);
  }
  return [...new Set(out)].slice(0, 10);
}

function personNameFromTitle(title) {
  const t = String(title || '');
  const cut = t.split(/\s*[|]\s*/)[0].split(/\s*[—\-]\s*Rybezh/i)[0].trim();
  return cut || 'Profile';
}

function detectPageKind(relPath, basename) {
  if (/^profiles\/person-/i.test(relPath)) return 'person';
  if (/^startups\/startup-/i.test(relPath)) return 'startup';
  const base = basename.replace(/-(en|es|ru)\.html$/i, '.html');
  if (base === 'methodology.html' || base === 'faq.html' || base === 'interview-drill.html') return 'article';
  if (base === 'specialists.html') return 'specialists';
  if (base === 'startups.html') return 'startups';
  if (base === 'index.html') return 'home';
  return 'page';
}

function ogLocaleForLang(lang) {
  if (lang === 'en') return 'en_US';
  if (lang === 'es') return 'es_ES';
  if (lang === 'ru') return 'ru_RU';
  return 'uk_UA';
}

function formatFileDate(iso) {
  try {
    const d = new Date(iso);
    return d.toISOString().slice(0, 10);
  } catch {
    return '';
  }
}

function buildExpertiseWheelStyle(tags) {
  const palette = ['#6366f1', '#0d9488', '#f97316', '#8b5cf6', '#0ea5e9', '#e11d48'];
  const n = Math.max(tags.length, 1);
  const parts = [];
  let acc = 0;
  for (let i = 0; i < n; i += 1) {
    const c = palette[i % palette.length];
    const start = acc / n;
    const end = (acc + 1) / n;
    parts.push(`${c} ${start * 360}deg ${end * 360}deg`);
    acc += 1;
  }
  return `conic-gradient(${parts.join(', ')})`;
}

function buildIntelAsidePerson(content, local, mtimeIso) {
  const sig = extractProfileSignals(content);
  const links = collectExternalLinks(content);
  const wheel = buildExpertiseWheelStyle(sig.tags.length ? sig.tags : ['—']);
  const dateStr = formatFileDate(mtimeIso);
  const tagsHtml = sig.tags
    .map((t) => `<li><span class="intel-influence__dot" aria-hidden="true"></span>${escapeHtml(t)}</li>`)
    .join('');
  const linksHtml = links
    .map((u) => `<li><a href="${escapeAttr(u)}" rel="noopener noreferrer">${escapeHtml(u.replace(/^https?:\/\//i, ''))}</a></li>`)
    .join('');

  return `<aside class="profile-intel" aria-label="${escapeAttr(local.intelAsideAria)}">
    <div class="intel-card intel-card--verify">
      <p class="intel-card__eyebrow">${escapeHtml(local.verifyTitle)}</p>
      <p class="intel-card__body">${escapeHtml(local.verifyBody)}</p>
    </div>
    <div class="intel-card">
      <p class="intel-card__eyebrow">${escapeHtml(local.lastUpdated)}</p>
      <p class="intel-card__strong">${escapeHtml(dateStr || '—')}</p>
    </div>
    <div class="intel-card">
      <p class="intel-card__eyebrow">${escapeHtml(local.timelineTitle)}</p>
      <ol class="intel-timeline">
        <li><span class="intel-timeline__mark" aria-hidden="true"></span><div><strong>${escapeHtml(local.timelineNow)}</strong><p>${escapeHtml(sig.h2 || sig.h1 || '—')}</p></div></li>
        <li><span class="intel-timeline__mark intel-timeline__mark--muted" aria-hidden="true"></span><div><strong>${escapeHtml(local.timelineDesk)}</strong><p>${escapeHtml(dateStr || '—')}</p></div></li>
      </ol>
    </div>
    <div class="intel-card">
      <p class="intel-card__eyebrow">${escapeHtml(local.expertiseTitle)}</p>
      <div class="intel-expertise" role="img" aria-label="${escapeAttr(local.expertiseTitle)}">
        <div class="intel-expertise__wheel" style="background:${wheel}"></div>
        <ul class="intel-expertise__legend">${tagsHtml || `<li>${escapeHtml('—')}</li>`}</ul>
      </div>
    </div>
    <div class="intel-card">
      <p class="intel-card__eyebrow">${escapeHtml(local.influenceTitle)}</p>
      <p class="intel-card__muted">${escapeHtml(local.influenceIntro)}</p>
      <ul class="intel-influence">${tagsHtml || `<li>${escapeHtml('—')}</li>`}</ul>
    </div>
    <div class="intel-card">
      <p class="intel-card__eyebrow">${escapeHtml(local.sourcesTitle)}</p>
      <p class="intel-card__muted">${escapeHtml(local.sourcesIntro)}</p>
      ${links.length ? `<ul class="intel-sources">${linksHtml}</ul>` : `<p class="intel-card__body">${escapeHtml('—')}</p>`}
    </div>
    <div class="intel-card intel-card--note">
      <p class="intel-card__eyebrow">${escapeHtml(local.deskNoteTitle)}</p>
      <p class="intel-card__body">${escapeHtml(local.deskNoteBody)}</p>
    </div>
  </aside>`;
}

function buildIntelAsideStartup(content, local, mtimeIso) {
  const sig = extractProfileSignals(content);
  const links = collectExternalLinks(content);
  const wheel = buildExpertiseWheelStyle(sig.tags.length ? sig.tags : ['—']);
  const dateStr = formatFileDate(mtimeIso);
  const tagsHtml = sig.tags
    .map((t) => `<li><span class="intel-influence__dot" aria-hidden="true"></span>${escapeHtml(t)}</li>`)
    .join('');
  const linksHtml = links
    .map((u) => `<li><a href="${escapeAttr(u)}" rel="noopener noreferrer">${escapeHtml(u.replace(/^https?:\/\//i, ''))}</a></li>`)
    .join('');

  return `<aside class="profile-intel profile-intel--org" aria-label="${escapeAttr(local.orgIntelAsideAria)}">
    <div class="intel-card intel-card--verify">
      <p class="intel-card__eyebrow">${escapeHtml(local.verifyTitle)}</p>
      <p class="intel-card__body">${escapeHtml(local.verifyBody)}</p>
    </div>
    <div class="intel-card">
      <p class="intel-card__eyebrow">${escapeHtml(local.lastUpdated)}</p>
      <p class="intel-card__strong">${escapeHtml(dateStr || '—')}</p>
    </div>
    <div class="intel-card">
      <p class="intel-card__eyebrow">${escapeHtml(local.orgTimelineTitle)}</p>
      <ol class="intel-timeline">
        <li><span class="intel-timeline__mark" aria-hidden="true"></span><div><strong>${escapeHtml(local.orgTimelineProduct)}</strong><p>${escapeHtml(sig.h2 || sig.h1 || '—')}</p></div></li>
        <li><span class="intel-timeline__mark intel-timeline__mark--muted" aria-hidden="true"></span><div><strong>${escapeHtml(local.orgTimelineDesk)}</strong><p>${escapeHtml(dateStr || '—')}</p></div></li>
      </ol>
    </div>
    <div class="intel-card">
      <p class="intel-card__eyebrow">${escapeHtml(local.expertiseTitle)}</p>
      <div class="intel-expertise" role="img" aria-label="${escapeAttr(local.expertiseTitle)}">
        <div class="intel-expertise__wheel" style="background:${wheel}"></div>
        <ul class="intel-expertise__legend">${tagsHtml || `<li>${escapeHtml('—')}</li>`}</ul>
      </div>
    </div>
    <div class="intel-card">
      <p class="intel-card__eyebrow">${escapeHtml(local.influenceTitle)}</p>
      <p class="intel-card__muted">${escapeHtml(local.influenceIntro)}</p>
      <ul class="intel-influence">${tagsHtml || `<li>${escapeHtml('—')}</li>`}</ul>
    </div>
    <div class="intel-card">
      <p class="intel-card__eyebrow">${escapeHtml(local.sourcesTitle)}</p>
      <p class="intel-card__muted">${escapeHtml(local.sourcesIntro)}</p>
      ${links.length ? `<ul class="intel-sources">${linksHtml}</ul>` : `<p class="intel-card__body">${escapeHtml('—')}</p>`}
    </div>
    <div class="intel-card intel-card--note">
      <p class="intel-card__eyebrow">${escapeHtml(local.deskNoteTitle)}</p>
      <p class="intel-card__body">${escapeHtml(local.deskNoteBody)}</p>
    </div>
  </aside>`;
}

function buildBreadcrumbHtml(kind, local, urls, entityTitle) {
  if (kind === 'home') {
    return `<nav class="breadcrumb" aria-label="${escapeAttr(local.breadcrumbAria)}"><span class="breadcrumb__item breadcrumb__item--current" aria-current="page">${escapeHtml(local.navHome)}</span></nav>`;
  }

  const items = [];
  items.push({ label: local.navHome, href: urls.homeUrl });
  if (kind === 'person') {
    items.push({ label: local.navSpecialists, href: urls.specialistsUrl });
    items.push({ label: entityTitle, href: null });
  } else if (kind === 'startup') {
    items.push({ label: local.navStartups, href: urls.startupsUrl });
    items.push({ label: entityTitle, href: null });
  } else if (kind === 'specialists') {
    items.push({ label: local.navSpecialists, href: null });
  } else if (kind === 'startups') {
    items.push({ label: local.navStartups, href: null });
  } else if (kind === 'article') {
    items.push({ label: entityTitle, href: null });
  } else {
    items.push({ label: entityTitle, href: null });
  }

  const inner = items
    .map((it, idx) => {
      const isLast = idx === items.length - 1;
      if (isLast || !it.href) {
        return `<span class="breadcrumb__item${isLast ? ' breadcrumb__item--current' : ''}" ${isLast ? 'aria-current="page"' : ''}>${escapeHtml(it.label)}</span>`;
      }
      return `<a class="breadcrumb__item" href="${escapeAttr(it.href)}">${escapeHtml(it.label)}</a>`;
    })
    .join('<span class="breadcrumb__sep" aria-hidden="true">/</span>');

  return `<nav class="breadcrumb" aria-label="${escapeAttr(local.breadcrumbAria)}">${inner}</nav>`;
}

function buildJsonLdGraph({
  kind,
  title,
  description,
  canonical,
  lang,
  sig,
  sameAs,
  entityTitle,
  breadcrumbPairs
}) {
  const canonicalBase = 'https://rybezh.site/';
  const orgId = `${canonicalBase}#rybezh-org`;
  const siteId = `${canonicalBase}#rybezh-site`;
  const graph = [];

  graph.push({
    '@type': 'Organization',
    '@id': orgId,
    name: 'Rybezh.site',
    url: canonicalBase,
    description: 'Editorial intelligence on people, operators, startups, and technology ecosystems.',
    logo: `${canonicalBase}assets/images/rybezh-logo.svg`,
    email: 'jobs.r@protonmail.com'
  });

  graph.push({
    '@type': 'WebSite',
    '@id': siteId,
    name: 'Rybezh.site',
    url: canonicalBase,
    description: 'Reference and editorial pages about specialists and companies, with multilingual coverage.',
    inLanguage: ['uk', 'en', 'es', 'ru'],
    publisher: { '@id': orgId }
  });

  const webPage = {
    '@type': 'WebPage',
    '@id': `${canonical}#webpage`,
    url: canonical,
    name: title,
    description,
    isPartOf: { '@id': siteId },
    inLanguage: lang
  };
  graph.push(webPage);

  if (breadcrumbPairs.length) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbPairs.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: p.name,
        item: p.item
      }))
    });
  }

  if (kind === 'person') {
    graph.push({
      '@type': 'Person',
      '@id': `${canonical}#person`,
      name: entityTitle || sig.h1,
      jobTitle: sig.h2 || undefined,
      description,
      url: canonical,
      knowsAbout: sig.tags.length ? sig.tags : undefined,
      sameAs: sameAs.length ? sameAs : undefined,
      mainEntityOfPage: { '@id': `${canonical}#webpage` }
    });
  } else if (kind === 'startup') {
    graph.push({
      '@type': 'Organization',
      '@id': `${canonical}#company`,
      name: entityTitle || sig.h1,
      description,
      url: canonical,
      knowsAbout: sig.tags.length ? sig.tags : undefined,
      sameAs: sameAs.length ? sameAs : undefined,
      mainEntityOfPage: { '@id': `${canonical}#webpage` }
    });
  } else if (kind === 'article') {
    graph.push({
      '@type': 'Article',
      '@id': `${canonical}#article`,
      headline: title,
      description,
      url: canonical,
      inLanguage: lang,
      isPartOf: { '@id': siteId },
      author: { '@id': orgId },
      publisher: { '@id': orgId }
    });
  }

  const payload = { '@context': 'https://schema.org', '@graph': graph };
  return `<script type="application/ld+json">${JSON.stringify(payload)}</script>`;
}

function breadcrumbPairsForJson(kind, local, urls, canonical, entityTitle) {
  const full = (href) => {
    if (!href) return canonical;
    if (href === 'index.html') return 'https://rybezh.site/';
    return `https://rybezh.site/${href}`;
  };
  if (kind === 'home') {
    return [{ name: local.navHome, item: full(urls.homeUrl) }];
  }
  const pairs = [{ name: local.navHome, item: full(urls.homeUrl) }];
  if (kind === 'person') {
    pairs.push({ name: local.navSpecialists, item: full(urls.specialistsUrl) });
    pairs.push({ name: entityTitle, item: canonical });
  } else if (kind === 'startup') {
    pairs.push({ name: local.navStartups, item: full(urls.startupsUrl) });
    pairs.push({ name: entityTitle, item: canonical });
  } else if (kind === 'specialists') {
    pairs.push({ name: local.navSpecialists, item: canonical });
  } else if (kind === 'startups') {
    pairs.push({ name: local.navStartups, item: canonical });
  } else if (kind === 'article') {
    pairs.push({ name: entityTitle, item: canonical });
  } else {
    pairs.push({ name: entityTitle, item: canonical });
  }
  return pairs;
}

function buildHeadInject({
  title,
  description,
  canonical,
  lang,
  ogImage,
  jsonLdHtml
}) {
  const canonicalBase = 'https://rybezh.site';
  let absImg = ogImage || `${canonicalBase}/assets/images/rybezh-logo.svg`;
  if (absImg && !/^https?:\/\//i.test(absImg)) {
    absImg = `${canonicalBase}/${String(absImg).replace(/^\//, '')}`;
  }
  const safeT = escapeAttr(title);
  const safeD = escapeAttr(description);
  const safeUrl = escapeAttr(canonical);
  const safeImg = escapeAttr(absImg);
  const loc = ogLocaleForLang(lang);
  return `<meta property="og:type" content="website">
<meta property="og:title" content="${safeT}">
<meta property="og:description" content="${safeD}">
<meta property="og:url" content="${safeUrl}">
<meta property="og:image" content="${safeImg}">
<meta property="og:locale" content="${loc}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${safeT}">
<meta name="twitter:description" content="${safeD}">
<meta name="twitter:image" content="${safeImg}">
${jsonLdHtml}`;
}

fs.rmSync(DIST_DIR, { recursive: true, force: true });
fs.mkdirSync(DIST_DIR, { recursive: true });

try {
  execSync('node scripts/emit-interview-tables.mjs', { stdio: 'inherit', cwd: path.resolve() });
} catch (e) {
  console.error('emit-interview-tables failed:', e.message);
  process.exit(1);
}

try {
  execSync('node scripts/generate-bulk-directory.mjs', { stdio: 'inherit', cwd: path.resolve() });
} catch (e) {
  console.error('generate-bulk-directory failed:', e.message);
  process.exit(1);
}

try {
  execSync('node scripts/emit-site-search-index.mjs', { stdio: 'inherit', cwd: path.resolve() });
} catch (e) {
  console.error('emit-site-search-index failed:', e.message);
  process.exit(1);
}

function processDirectory(dirPath, destPath) {
  if (!fs.existsSync(destPath)) {
    fs.mkdirSync(destPath, { recursive: true });
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const srcFile = path.join(dirPath, entry.name);
    let destFile = path.join(destPath, entry.name);

    if (entry.isDirectory()) {
      if (entry.name !== 'templates' && entry.name !== 'pages') { // Skip templates and pages as pages are flattened
          processDirectory(srcFile, destFile);
      }
    } else if (!srcFile.endsWith('.html')) {
      // We only copy non-HTML files here. HTML files in 'pages' are handled separately.
      if (srcFile.endsWith('.css') || srcFile.endsWith('.js')) {
        const rawAsset = fs.readFileSync(srcFile, 'utf8');
        const skipMinifyJs =
          srcFile.endsWith('interview-drill.js') ||
          srcFile.endsWith('interview-bank-data.js') ||
          srcFile.endsWith('site-search-index.js') ||
          srcFile.endsWith('site-search.js');
        fs.writeFileSync(destFile, skipMinifyJs ? rawAsset : minifyAssetIfNeeded(srcFile, rawAsset));
      } else {
        fs.copyFileSync(srcFile, destFile);
      }
    }
  }
}

function processPages(srcPath, destPath) {
     if (!fs.existsSync(srcPath)) return;
     const entries = fs.readdirSync(srcPath, { withFileTypes: true });
     for (const entry of entries) {
         const fullSrc = path.join(srcPath, entry.name);
         if (entry.isDirectory()) {
             processPages(fullSrc, destPath); // Flatten all pages to dist root
         } else if (fullSrc.endsWith('.html') || fullSrc.endsWith('.xml')) {
             if (fullSrc.endsWith('.html')) {
                compileHTML(fullSrc, path.join(destPath, entry.name));
             } else {
                fs.copyFileSync(fullSrc, path.join(destPath, entry.name));
             }
         }
     }
}

function compileHTML(srcFile, destFile) {
  let content = fs.readFileSync(srcFile, 'utf8');
  content = injectBulkCatalogHtml(content, path.basename(srcFile));

  // Extract meta tags if they exist in the fragment
  let titleMatch = content.match(/<title>(.*?)<\/title>/i);
  let title = titleMatch ? titleMatch[1] : 'Rybezh';

  // Only remove title if it exists, otherwise keep defaults
  if (titleMatch) {
      content = content.replace(/<title>.*?<\/title>/i, '');
  }

  let descriptionMatch = content.match(/<meta\s+name="description"\s+content="(.*?)">/i);
  let description = descriptionMatch ? descriptionMatch[1] : '';
  content = content.replace(/<meta\s+name="description"\s+content=".*?">/i, '');

  let robotsMatch = content.match(/<meta\s+name="robots"\s+content="(.*?)">/i);
  let robotsBlock = robotsMatch ? robotsMatch[0] : '';
  content = content.replace(/<meta\s+name="robots"\s+content=".*?">/i, '');

  // Extract <style> block to inject into head
  let styleBlock = '';
  let styleMatch = content.match(/<style>([\s\S]*?)<\/style>/i);
  if (styleMatch) {
      styleBlock = styleMatch[0];
      content = content.replace(/<style>[\s\S]*?<\/style>/i, '');
  }

  // Strip doctype and html body wrappers if they mistakenly exist in fragments
  content = content.replace(/<!doctype html>/gi, '');
  content = content.replace(/<html.*?>/gi, '');
  content = content.replace(/<\/html>/gi, '');
  content = content.replace(/<head.*?>[\s\S]*?<\/head>/gi, '');
  content = content.replace(/<body.*?>/gi, '');
  content = content.replace(/<\/body>/gi, '');
  content = content.replace(/<main.*?>/gi, '');
  content = content.replace(/<\/main>/gi, '');

  content = replaceClearbitLogoImages(content, path.basename(srcFile));

  const template = fs.readFileSync(TEMPLATE_FILE, 'utf8');

  const filename = path.basename(srcFile);
  let lang = 'uk';
  if (filename.endsWith('-en.html')) lang = 'en';
  else if (filename.endsWith('-es.html')) lang = 'es';
  else if (filename.endsWith('-ru.html')) lang = 'ru';

  const canonicalBase = 'https://rybezh.site/';

  let baseName = filename.replace(/-(en|es|ru)\.html$/, '.html');
  if (baseName === 'index.html') {
      baseName = '';
  }

  const canonicalMap = {
      uk: baseName ? canonicalBase + baseName : canonicalBase,
      en: baseName ? canonicalBase + baseName.replace('.html', '-en.html') : canonicalBase + 'index-en.html',
      es: baseName ? canonicalBase + baseName.replace('.html', '-es.html') : canonicalBase + 'index-es.html',
      ru: baseName ? canonicalBase + baseName.replace('.html', '-ru.html') : canonicalBase + 'index-ru.html',
  };
  const canonicalNow = canonicalMap[lang];

  const localMerged = { ...translations[lang], ...editorialUi[lang] };
  const homeUrl = lang === 'uk' ? 'index.html' : `index-${lang}.html`;
  const specialistsUrl = lang === 'uk' ? 'specialists.html' : `specialists-${lang}.html`;
  const startupsUrl = lang === 'uk' ? 'startups.html' : `startups-${lang}.html`;
  const privacyUrl = lang === 'uk' ? 'privacy.html' : `privacy-${lang}.html`;
  const cookiesUrl = lang === 'uk' ? 'cookies.html' : `cookies-${lang}.html`;
  const termsUrl = lang === 'uk' ? 'terms.html' : `terms-${lang}.html`;
  const methodologyUrl = lang === 'uk' ? 'methodology.html' : `methodology-${lang}.html`;
  const faqUrl = lang === 'uk' ? 'faq.html' : `faq-${lang}.html`;
  const interviewUrl = lang === 'uk' ? 'interview-drill.html' : `interview-drill-${lang}.html`;

  const relPath = path.relative(path.join(SRC_DIR, 'pages'), srcFile).replace(/\\/g, '/');
  const pageKind = detectPageKind(relPath, filename);
  const stat = fs.statSync(srcFile);
  const mtimeIso = stat.mtime.toISOString();

  let mainBody = content;
  if (pageKind === 'person') {
    mainBody = `<div class="profile-layout"><div class="profile-layout__main">${content}</div>${buildIntelAsidePerson(content, localMerged, mtimeIso)}</div>`;
  } else if (pageKind === 'startup') {
    mainBody = `<div class="profile-layout"><div class="profile-layout__main">${content}</div>${buildIntelAsideStartup(content, localMerged, mtimeIso)}</div>`;
  }

  const sig = extractProfileSignals(content);
  const sameAs = collectExternalLinks(content);
  let entityTitle = sig.h1 || personNameFromTitle(title);
  if (pageKind === 'home') entityTitle = localMerged.navHome;
  else if (pageKind === 'specialists') entityTitle = localMerged.navSpecialists;
  else if (pageKind === 'startups') entityTitle = localMerged.navStartups;
  else if (pageKind === 'article' || pageKind === 'page') entityTitle = personNameFromTitle(title);

  const urlPack = { homeUrl, specialistsUrl, startupsUrl, methodologyUrl, faqUrl, interviewUrl };
  const breadcrumbNav = buildBreadcrumbHtml(pageKind, localMerged, urlPack, entityTitle);

  const schemaKind =
    pageKind === 'person' ? 'person' : pageKind === 'startup' ? 'startup' : pageKind === 'article' ? 'article' : 'none';

  const bcPairs = breadcrumbPairsForJson(pageKind, localMerged, urlPack, canonicalNow, entityTitle);
  const jsonLdHtml = buildJsonLdGraph({
    kind: schemaKind,
    title,
    description,
    canonical: canonicalNow,
    lang,
    sig,
    sameAs,
    entityTitle,
    breadcrumbPairs: bcPairs
  });

  const headInject = buildHeadInject({
    title,
    description,
    canonical: canonicalNow,
    lang,
    ogImage: extractOgImage(content),
    jsonLdHtml
  });

  const slug = filename.replace(/\.html$/i, '').replace(/-(en|es|ru)$/i, '');
  const bodyClass = `site-body page-${pageKind} doc-${slug}`;

  const wrappedMain = `${breadcrumbNav}<div class="page-shell">${mainBody}</div>`;

  let finalHtml = template.replace('{{CONTENT}}', () => wrappedMain)
                          .replace('{{TITLE}}', escapeHtml(title))
                          .replace('{{DESCRIPTION}}', escapeHtml(description))
                          .replace('{{HEAD_INJECT}}', headInject)
                          .replace('{{BODY_CLASS}}', bodyClass)
                          .replace('</head>', `${robotsBlock}\n${styleBlock}\n</head>`);

  finalHtml = finalHtml.replaceAll('{{CANONICAL}}', canonicalMap[lang])
                       .replaceAll('{{CANONICAL_ES}}', canonicalMap.es)
                       .replaceAll('{{CANONICAL_RU}}', canonicalMap.ru)
                       .replaceAll('{{CANONICAL_EN}}', canonicalMap.en);

  finalHtml = finalHtml.replaceAll('{{NAV_ARIA}}', localMerged.navAria)
                       .replaceAll('{{NAV_HOME}}', localMerged.navHome)
                       .replaceAll('{{NAV_SPECIALISTS}}', localMerged.navSpecialists)
                       .replaceAll('{{NAV_STARTUPS}}', localMerged.navStartups)
                       .replaceAll('{{NAV_METHODOLOGY}}', localMerged.navMethodology)
                       .replaceAll('{{NAV_FAQ}}', localMerged.navFaq)
                       .replaceAll('{{NAV_INTERVIEW}}', localMerged.navInterview)
                       .replaceAll('{{NAV_MENU}}', localMerged.navMenu)
                       .replaceAll('{{NAV_PRIVACY}}', localMerged.navPrivacy)
                       .replaceAll('{{NAV_COOKIES}}', localMerged.navCookies)
                       .replaceAll('{{NAV_TERMS}}', localMerged.navTerms)
                       .replaceAll('{{HOME_URL}}', homeUrl)
                       .replaceAll('{{SPECIALISTS_URL}}', specialistsUrl)
                       .replaceAll('{{STARTUPS_URL}}', startupsUrl)
                       .replaceAll('{{PRIVACY_URL}}', privacyUrl)
                       .replaceAll('{{COOKIES_URL}}', cookiesUrl)
                       .replaceAll('{{TERMS_URL}}', termsUrl)
                       .replaceAll('{{METHODOLOGY_URL}}', methodologyUrl)
                       .replaceAll('{{FAQ_URL}}', faqUrl)
                       .replaceAll('{{INTERVIEW_URL}}', interviewUrl)
                       .replaceAll('{{SEARCH_ARIA}}', localMerged.searchAria)
                       .replaceAll('{{SEARCH_PLACEHOLDER}}', localMerged.searchPlaceholder)
                       .replaceAll('{{SEARCH_BADGE_PERSON}}', localMerged.searchBadgePerson)
                       .replaceAll('{{SEARCH_BADGE_STARTUP}}', localMerged.searchBadgeStartup)
                       .replaceAll('{{SEARCH_BADGE_PAGE}}', localMerged.searchBadgePage)
                       .replaceAll('{{SEARCH_EMPTY}}', localMerged.searchEmpty)
                       .replaceAll('{{SEARCH_HINT}}', localMerged.searchHint)
                       .replaceAll('{{FOOTER_ABOUT}}', localMerged.footerAbout)
                       .replaceAll('{{FOOTER_NAV_TITLE}}', localMerged.footerNavTitle)
                       .replaceAll('{{FOOTER_SCOPE_TITLE}}', localMerged.footerScopeTitle)
                       .replaceAll('{{FOOTER_SCOPE_TEXT}}', localMerged.footerScopeText)
                       .replaceAll('{{FOOTER_LANGUAGES}}', localMerged.footerLanguages)
                       .replaceAll('{{FOOTER_RIGHTS}}', localMerged.footerRights)
                       .replaceAll('{{FOOTER_POLICIES_TITLE}}', localMerged.footerPoliciesTitle)
                       .replaceAll('{{FOOTER_POLICIES_TEXT}}', localMerged.footerPoliciesText)
                       .replaceAll('{{FOOTER_TAGLINE}}', localMerged.footerTagline)
                       .replaceAll('{{FOOTER_SITEMAP}}', localMerged.footerSitemap)
                       .replaceAll('{{SKIP_LINK}}', localMerged.skipLink)
                       .replaceAll('{{BRAND_TAGLINE}}', localMerged.brandTagline)
                       .replaceAll('{{CONTACT_LABEL}}', localMerged.contactLabel)
                       .replaceAll('{{NAV_DOCK_ARIA}}', localMerged.navDockAria)
                       .replaceAll('{{CMD_OPEN_ARIA}}', localMerged.cmdOpenAria)
                       .replaceAll('{{CMD_HINT}}', localMerged.cmdHint)
                       .replaceAll('{{CMD_TITLE}}', localMerged.cmdTitle)
                       .replaceAll('{{CMD_RECENT}}', localMerged.cmdRecent)
                       .replaceAll('{{CMD_SUGGESTED}}', localMerged.cmdSuggested)
                       .replaceAll('{{FILTER_ALL}}', localMerged.filterAll)
                       .replaceAll('{{FILTER_PEOPLE}}', localMerged.filterPeople)
                       .replaceAll('{{FILTER_COMPANIES}}', localMerged.filterCompanies)
                       .replaceAll('{{FILTER_PAGES}}', localMerged.filterPages)
                       .replaceAll('{{CMD_CLOSE}}', localMerged.cmdClose);

  finalHtml = finalHtml.replaceAll('{{COOKIE_TITLE}}', localMerged.cookieTitle)
                       .replaceAll('{{COOKIE_TEXT}}', localMerged.cookieText)
                       .replaceAll('{{COOKIE_ACCEPT}}', localMerged.cookieAccept)
                       .replaceAll('{{COOKIE_DECLINE}}', localMerged.cookieDecline);

  finalHtml = finalHtml.replace('<html lang="uk">', `<html lang="${lang}">`);

  finalHtml = finalHtml.replace(/<style>([\s\S]*?)<\/style>/gi, (_, css) => `<style>${minifyCss(css)}</style>`);
  finalHtml = finalHtml.replace(/<script>([\s\S]*?)<\/script>/gi, (_, js) => `<script>${minifyJs(js)}</script>`);
  finalHtml = minifyHtml(finalHtml);

  fs.writeFileSync(destFile, finalHtml);
}

processDirectory(SRC_DIR, DIST_DIR);
processPages(path.join(SRC_DIR, 'pages'), DIST_DIR);

// Temporary build inputs can be very large and should not be bundled into serverless output.
const GENERATED_TMP_DIR = path.join(SRC_DIR, 'generated');
if (fs.existsSync(GENERATED_TMP_DIR)) {
  fs.rmSync(GENERATED_TMP_DIR, { recursive: true, force: true });
  console.log(`Removed temporary directory: ${GENERATED_TMP_DIR}`);
}

console.log('Build completed successfully.');
