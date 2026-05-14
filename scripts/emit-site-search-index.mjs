/**
 * Builds a client-side search index from catalog HTML fragments.
 * Output: src/site-search-index.js (window.SITE_SEARCH_INDEX by language)
 */
import fs from 'fs';
import path from 'path';

const SITE = path.join('src', 'pages', 'site');
const OUT = path.join('src', 'site-search-index.js');

function decodeEntities(s) {
  return String(s || '')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

function extractBtnHref(inner) {
  const m1 = inner.match(/<a[^>]*class="[^"]*\bbtn\b[^"]*"[^>]*href="([^"]+)"/i);
  if (m1) return m1[1];
  const m2 = inner.match(/<a[^>]*href="([^"]+)"[^>]*class="[^"]*\bbtn\b[^"]*"/i);
  if (m2) return m2[1];
  const m3 = inner.match(/<a[^>]+href="([^"]+\.html)"/i);
  return m3 ? m3[1] : null;
}

function extractCards(html) {
  const out = [];
  const re = /<article\b[^>]*\bdata-directory-card\b[^>]*>([\s\S]*?)<\/article>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const block = m[0];
    const inner = m[1];
    const isStartup = /\bstartup-card\b/.test(block);
    const ds = block.match(/data-search="([^"]*)"/i);
    const country = block.match(/data-country="([^"]*)"/i);
    const href = extractBtnHref(inner);
    const h3 = inner.match(/<h3[^>]*>([^<]*)<\/h3>/i);
    if (!href || !h3) continue;
    const title = decodeEntities(h3[1].trim());
    const searchBlob = decodeEntities((ds && ds[1]) || '').toLowerCase();
    const c = country ? decodeEntities(country[1]) : '';
    out.push({
      u: href,
      t: title,
      k: isStartup ? 'startup' : 'person',
      s: searchBlob,
      c,
    });
  }
  return out;
}

const STATIC = {
  uk: [
    { u: 'index.html', t: 'Головна', s: 'rybezh головна архів каталог експертів стартапів', k: 'page' },
    { u: 'specialists.html', t: 'Каталог спеціалістів', s: 'спеціалісти експерти інженери програмісти ceo cto', k: 'page' },
    { u: 'startups.html', t: 'Каталог стартапів', s: 'стартапи компанії продукт fintech saas', k: 'page' },
    { u: 'methodology.html', t: 'Методологія', s: 'методологія редакція профіль джерела виправлення', k: 'page' },
    { u: 'faq.html', t: 'Питання й відповіді', s: 'faq відповіді допомога cookies політика', k: 'page' },
    { u: 'about.html', t: 'Про видання', s: 'про rybezh контакт редакція мови', k: 'page' },
    { u: 'privacy.html', t: 'Політика конфіденційності', s: 'privacy конфіденційність персональні дані', k: 'page' },
    { u: 'cookies.html', t: 'Політика cookies', s: 'cookies згода браузер', k: 'page' },
    { u: 'terms.html', t: 'Умови використання', s: 'умови terms правила сайту', k: 'page' },
    { u: 'interview-drill.html', t: 'Тренажер співбесіди', s: 'співбесіда інтервю тренажер питання сценарій', k: 'page' },
  ],
  en: [
    { u: 'index-en.html', t: 'Home', s: 'rybezh home archive experts startups directory', k: 'page' },
    { u: 'specialists-en.html', t: 'Specialist catalogue', s: 'specialists engineers developers ceo cto leaders', k: 'page' },
    { u: 'startups-en.html', t: 'Startup catalogue', s: 'startups companies products fintech saas', k: 'page' },
    { u: 'methodology-en.html', t: 'Methodology', s: 'methodology editorial profile sources corrections', k: 'page' },
    { u: 'faq-en.html', t: 'FAQ', s: 'faq questions answers help cookies', k: 'page' },
    { u: 'about-en.html', t: 'About the publication', s: 'about rybezh editorial contact languages', k: 'page' },
    { u: 'privacy-en.html', t: 'Privacy policy', s: 'privacy personal data gdpr', k: 'page' },
    { u: 'cookies-en.html', t: 'Cookie policy', s: 'cookies consent browser', k: 'page' },
    { u: 'terms-en.html', t: 'Terms of use', s: 'terms conditions site rules', k: 'page' },
    { u: 'interview-drill-en.html', t: 'Interview drill', s: 'interview practice drill questions leadership', k: 'page' },
  ],
  es: [
    { u: 'index-es.html', t: 'Inicio', s: 'rybezh inicio archivo directorio expertos startups', k: 'page' },
    { u: 'specialists-es.html', t: 'Catálogo de especialistas', s: 'especialistas ingenieros desarrolladores ceo cto', k: 'page' },
    { u: 'startups-es.html', t: 'Catálogo de startups', s: 'startups empresas producto fintech saas', k: 'page' },
    { u: 'methodology-es.html', t: 'Metodología', s: 'metodología editorial perfil fuentes correcciones', k: 'page' },
    { u: 'faq-es.html', t: 'Preguntas frecuentes', s: 'faq preguntas ayuda cookies', k: 'page' },
    { u: 'about-es.html', t: 'Sobre la publicación', s: 'sobre rybezh redacción contacto idiomas', k: 'page' },
    { u: 'privacy-es.html', t: 'Política de privacidad', s: 'privacidad datos personales', k: 'page' },
    { u: 'cookies-es.html', t: 'Política de cookies', s: 'cookies consentimiento navegador', k: 'page' },
    { u: 'terms-es.html', t: 'Términos de uso', s: 'términos condiciones reglas sitio', k: 'page' },
    { u: 'interview-drill-es.html', t: 'Simulacro de entrevista', s: 'entrevista práctica simulacro preguntas liderazgo', k: 'page' },
  ],
  ru: [
    { u: 'index-ru.html', t: 'Главная', s: 'rybezh главная архив каталог экспертов стартапы', k: 'page' },
    { u: 'specialists-ru.html', t: 'Каталог специалистов', s: 'специалисты эксперты инженеры программисты ceo cto', k: 'page' },
    { u: 'startups-ru.html', t: 'Каталог стартапов', s: 'стартапы компании продукт fintech saas', k: 'page' },
    { u: 'methodology-ru.html', t: 'Методология', s: 'методология редакция профиль источники исправления', k: 'page' },
    { u: 'faq-ru.html', t: 'Вопросы и ответы', s: 'faq ответы помощь cookies политика', k: 'page' },
    { u: 'about-ru.html', t: 'Об издании', s: 'о rybezh редакция контакт языки', k: 'page' },
    { u: 'privacy-ru.html', t: 'Политика конфиденциальности', s: 'privacy персональные данные', k: 'page' },
    { u: 'cookies-ru.html', t: 'Политика cookies', s: 'cookies согласие браузер', k: 'page' },
    { u: 'terms-ru.html', t: 'Условия использования', s: 'условия terms правила сайта', k: 'page' },
    { u: 'interview-drill-ru.html', t: 'Тренажёр собеседования', s: 'собеседование интервью тренажёр вопросы', k: 'page' },
  ],
};

function readCatalogWithBulk(filePath, lang, kind) {
  const html = fs.readFileSync(filePath, 'utf8');
  const incName =
    kind === 'specialists' ? `bulk-specialists-${lang}.inc.html` : `bulk-startups-${lang}.inc.html`;
  const incPath = path.join('src', 'generated', incName);
  let bulk = '';
  if (fs.existsSync(incPath)) {
    bulk = fs.readFileSync(incPath, 'utf8');
  }
  return html + bulk;
}

function load(lang, specialistsFile, startupsFile) {
  const specPath = path.join(SITE, specialistsFile);
  const startPath = path.join(SITE, startupsFile);
  const specHtml = readCatalogWithBulk(specPath, lang, 'specialists');
  const startHtml = readCatalogWithBulk(startPath, lang, 'startups');
  const people = extractCards(specHtml);
  const companies = extractCards(startHtml);
  const pages = (STATIC[lang] || []).map((p) => ({ ...p, c: p.c ?? '' }));
  return [...people, ...companies, ...pages];
}

const index = {
  uk: load('uk', 'specialists.html', 'startups.html'),
  en: load('en', 'specialists-en.html', 'startups-en.html'),
  es: load('es', 'specialists-es.html', 'startups-es.html'),
  ru: load('ru', 'specialists-ru.html', 'startups-ru.html'),
};

const json = JSON.stringify(index);
const body = `/* AUTO-GENERATED by scripts/emit-site-search-index.mjs — run via npm run build */\nwindow.SITE_SEARCH_INDEX=${json};\n`;
fs.writeFileSync(OUT, body, 'utf8');

const n = (lang) => index[lang].length;
console.log(`site-search-index: uk=${n('uk')} en=${n('en')} es=${n('es')} ru=${n('ru')} -> ${OUT}`);
