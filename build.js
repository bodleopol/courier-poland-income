import fs from 'fs';
import path from 'path';

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
const translations = {
  uk: {
    skipLink: 'Перейти до вмісту',
    brandTagline: 'Редакційний архів · експерти · компанії',
    footerTagline:
      'Rybezh.site — міжнародна редакційна платформа зі структурованими профілями, прозорими правилами та людською перевіркою матеріалів.',
    contactLabel: 'Редакційний контакт:',
    navAria: 'Головна навігація',
    navHome: 'Головна',
    navSpecialists: 'Спеціалісти',
    navStartups: 'Стартапи',
    navMethodology: 'Методологія',
    navMenu: 'Меню',
    navPrivacy: 'Конфіденційність',
    navCookies: 'Cookies',
    navTerms: 'Умови',
    footerAbout:
      'Rybezh.site — міжнародна багатомовна платформа з кураторськими профілями спеціалістів, фаундерів і компаній: чітка структура, перевірені джерела та редакційна відповідальність.',
    footerNavTitle: 'Навігація',
    footerScopeTitle: 'Що це за архів',
    footerScopeText:
      'Ми документуємо професійний контекст — хто будує продукти, які рішення формують галузі та як компанії позиціонуються на ринку. Це не маркетплейс послуг і не дошка вакансій.',
    footerLanguages: 'Доступні мови: українська, англійська, іспанська, російська.',
    footerRights: 'Всі права захищені.',
    footerPoliciesTitle: 'Редакція і політики',
    footerPoliciesText:
      'Матеріали готуються людьми: є методологія оновлень, політики даних і зрозумілі правила цитування та виправлень.',
    footerTeam: 'Команда: Rybezh.site',
    cookieTitle: 'Ми використовуємо лише базові cookies',
    cookieText: 'Сайт зберігає вибір теми та вашу відповідь на cookies notice у браузері. Деталі описані на окремій сторінці політики cookies.',
    cookieAccept: 'Прийняти',
    cookieDecline: 'Відхилити'
  },
  en: {
    skipLink: 'Skip to content',
    brandTagline: 'Editorial archive · experts · companies',
    footerTagline:
      'Rybezh.site is an international editorial platform—structured profiles, transparent policies, and human review—not a job board or lead funnel.',
    contactLabel: 'Editorial contact:',
    navAria: 'Main navigation',
    navHome: 'Home',
    navSpecialists: 'Specialists',
    navStartups: 'Startups',
    navMethodology: 'Methodology',
    navMenu: 'Menu',
    navPrivacy: 'Privacy',
    navCookies: 'Cookies',
    navTerms: 'Terms',
    footerAbout:
      'Rybezh.site is a multilingual editorial archive of specialists, founders, and companies—curated presentation, sourced context, and accountable updates.',
    footerNavTitle: 'Navigation',
    footerScopeTitle: 'About this archive',
    footerScopeText:
      'We publish professional context: who is building, how organisations position themselves, and what signals matter for research—not vacancies, not automated listings.',
    footerLanguages: 'Available languages: Ukrainian, English, Spanish, Russian.',
    footerRights: 'All rights reserved.',
    footerPoliciesTitle: 'Editorial and policies',
    footerPoliciesText:
      'Editorial workflow, privacy, and methodology pages spell out how profiles are composed, corrected, and maintained.',
    footerTeam: 'Team: Rybezh.site',
    cookieTitle: 'We use only basic cookies',
    cookieText: 'The site stores theme preference and your cookies-notice choice in the browser. See the cookies policy page for details.',
    cookieAccept: 'Accept',
    cookieDecline: 'Decline'
  },
  es: {
    skipLink: 'Ir al contenido',
    brandTagline: 'Archivo editorial · expertos · empresas',
    footerTagline:
      'Rybezh.site es una plataforma editorial internacional con perfiles estructurados y revisión humana: no es un portal de empleo ni un directorio automatizado.',
    contactLabel: 'Contacto editorial:',
    navAria: 'Navegación principal',
    navHome: 'Inicio',
    navSpecialists: 'Especialistas',
    navStartups: 'Startups',
    navMethodology: 'Metodología',
    navMenu: 'Menú',
    navPrivacy: 'Privacidad',
    navCookies: 'Cookies',
    navTerms: 'Términos',
    footerAbout:
      'Rybezh.site es un archivo editorial multilingüe de especialistas, fundadores y empresas tecnológicas: narrativa curada, fuentes explícitas y estándares de calidad.',
    footerNavTitle: 'Navegación',
    footerScopeTitle: 'Qué es este archivo',
    footerScopeText:
      'Publicamos contexto profesional — trayectorias, mandatos y posicionamiento — para lectura pausada y comparación rigurosa. No publicamos vacantes ni listados masivos generados por máquinas.',
    footerLanguages: 'Idiomas disponibles: ucraniano, inglés, español y ruso.',
    footerRights: 'Todos los derechos reservados.',
    footerPoliciesTitle: 'Editorial y políticas',
    footerPoliciesText:
      'La metodología y las políticas describen cómo redactamos, corregimos y conservamos cada ficha.',
    footerTeam: 'Equipo: Rybezh.site',
    cookieTitle: 'Usamos solo cookies básicas',
    cookieText: 'El sitio guarda la preferencia de tema y tu elección del aviso de cookies en el navegador. Consulta la política de cookies para más detalles.',
    cookieAccept: 'Aceptar',
    cookieDecline: 'Rechazar'
  },
  ru: {
    skipLink: 'Перейти к содержимому',
    brandTagline: 'Редакционный архив · эксперты · компании',
    footerTagline:
      'Rybezh.site — международная редакционная платформа со структурированными профилями и человеческой проверкой; это не сайт вакансий и не SEO-каталог.',
    contactLabel: 'Редакционная связь:',
    navAria: 'Главная навигация',
    navHome: 'Главная',
    navSpecialists: 'Специалисты',
    navStartups: 'Стартапы',
    navMethodology: 'Методология',
    navMenu: 'Меню',
    navPrivacy: 'Конфиденциальность',
    navCookies: 'Cookies',
    navTerms: 'Условия',
    footerAbout:
      'Rybezh.site — многоязычный редакционный архив специалистов, фаундеров и технологических компаний: выверенная подача, указание контекста и ответственность за факты.',
    footerNavTitle: 'Навигация',
    footerScopeTitle: 'Что это за архив',
    footerScopeText:
      'Мы фиксируем профессиональный контекст — роли, география, фокус компаний — для вдумчивого чтения и анализа. Здесь нет массовых списков вакансий и шаблонных SEO-страниц.',
    footerLanguages: 'Доступные языки: украинский, английский, испанский, русский.',
    footerRights: 'Все права защищены.',
    footerPoliciesTitle: 'Редакция и политики',
    footerPoliciesText:
      'Методология и политики объясняют, как материалы собираются, проверяются и обновляются.',
    footerTeam: 'Команда: Rybezh.site',
    cookieTitle: 'Мы используем только базовые cookies',
    cookieText: 'Сайт сохраняет выбор темы и ваш ответ на cookies notice в браузере. Подробности - на странице политики cookies.',
    cookieAccept: 'Принять',
    cookieDecline: 'Отклонить'
  }
};

fs.rmSync(DIST_DIR, { recursive: true, force: true });
fs.mkdirSync(DIST_DIR, { recursive: true });

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
      fs.copyFileSync(srcFile, destFile);
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

  let finalHtml = template.replace('{{CONTENT}}', () => content)
                          .replace('{{TITLE}}', title)
                          .replace('{{DESCRIPTION}}', description)
                          .replace('</head>', `${robotsBlock}\n${styleBlock}\n</head>`);

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

  finalHtml = finalHtml.replaceAll('{{CANONICAL}}', canonicalMap[lang])
                       .replaceAll('{{CANONICAL_ES}}', canonicalMap.es)
                       .replaceAll('{{CANONICAL_RU}}', canonicalMap.ru)
                       .replaceAll('{{CANONICAL_EN}}', canonicalMap.en);

  const local = translations[lang];
  const homeUrl = lang === 'uk' ? 'index.html' : `index-${lang}.html`;
  const specialistsUrl = lang === 'uk' ? 'specialists.html' : `specialists-${lang}.html`;
  const startupsUrl = lang === 'uk' ? 'startups.html' : `startups-${lang}.html`;
  const privacyUrl = lang === 'uk' ? 'privacy.html' : `privacy-${lang}.html`;
  const cookiesUrl = lang === 'uk' ? 'cookies.html' : `cookies-${lang}.html`;
  const termsUrl = lang === 'uk' ? 'terms.html' : `terms-${lang}.html`;
  const methodologyUrl = lang === 'uk' ? 'methodology.html' : `methodology-${lang}.html`;
  finalHtml = finalHtml.replaceAll('{{SKIP_LINK}}', local.skipLink)
                       .replaceAll('{{BRAND_TAGLINE}}', local.brandTagline)
                       .replaceAll('{{FOOTER_TAGLINE}}', local.footerTagline)
                       .replaceAll('{{CONTACT_LABEL}}', local.contactLabel)
                       .replaceAll('{{NAV_ARIA}}', local.navAria)
                       .replaceAll('{{NAV_HOME}}', local.navHome)
                       .replaceAll('{{NAV_SPECIALISTS}}', local.navSpecialists)
                       .replaceAll('{{NAV_STARTUPS}}', local.navStartups)
                       .replaceAll('{{NAV_METHODOLOGY}}', local.navMethodology)
                       .replaceAll('{{NAV_MENU}}', local.navMenu)
                       .replaceAll('{{NAV_PRIVACY}}', local.navPrivacy)
                       .replaceAll('{{NAV_COOKIES}}', local.navCookies)
                       .replaceAll('{{NAV_TERMS}}', local.navTerms)
                       .replaceAll('{{HOME_URL}}', homeUrl)
                       .replaceAll('{{SPECIALISTS_URL}}', specialistsUrl)
                       .replaceAll('{{STARTUPS_URL}}', startupsUrl)
                       .replaceAll('{{PRIVACY_URL}}', privacyUrl)
                       .replaceAll('{{COOKIES_URL}}', cookiesUrl)
                       .replaceAll('{{TERMS_URL}}', termsUrl)
                       .replaceAll('{{METHODOLOGY_URL}}', methodologyUrl)
                       .replaceAll('{{FOOTER_ABOUT}}', local.footerAbout)
                       .replaceAll('{{FOOTER_NAV_TITLE}}', local.footerNavTitle)
                       .replaceAll('{{FOOTER_SCOPE_TITLE}}', local.footerScopeTitle)
                       .replaceAll('{{FOOTER_SCOPE_TEXT}}', local.footerScopeText)
                       .replaceAll('{{FOOTER_LANGUAGES}}', local.footerLanguages)
                       .replaceAll('{{FOOTER_RIGHTS}}', local.footerRights)
                       .replaceAll('{{FOOTER_POLICIES_TITLE}}', local.footerPoliciesTitle)
                       .replaceAll('{{FOOTER_POLICIES_TEXT}}', local.footerPoliciesText)
                       .replaceAll('{{FOOTER_TEAM}}', local.footerTeam);

  finalHtml = finalHtml.replaceAll('{{COOKIE_TITLE}}', local.cookieTitle)
                       .replaceAll('{{COOKIE_TEXT}}', local.cookieText)
                       .replaceAll('{{COOKIE_ACCEPT}}', local.cookieAccept)
                       .replaceAll('{{COOKIE_DECLINE}}', local.cookieDecline);

  finalHtml = finalHtml.replace('<html lang="uk">', `<html lang="${lang}">`);

  fs.writeFileSync(destFile, finalHtml);
}

processDirectory(SRC_DIR, DIST_DIR);
processPages(path.join(SRC_DIR, 'pages'), DIST_DIR);
console.log('Build completed successfully.');
