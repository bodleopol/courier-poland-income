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
    navAria: 'Головна навігація',
    navHome: 'Головна',
    navSpecialists: 'Спеціалісти',
    navStartups: 'Стартапи',
    navMethodology: 'Методологія',
    navMenu: 'Меню',
    navPrivacy: 'Конфіденційність',
    navCookies: 'Cookies',
    navTerms: 'Умови',
    footerAbout: 'Rybezh.site — інформаційна редакційна база спеціалістів, керівників і технологічних компаній: структуровані профілі, прозора навігація та зрозумілі правила публікації.',
    footerNavTitle: 'Навігація',
    footerScopeTitle: 'Про базу',
    footerScopeText: 'Матеріали зібрані як довідкова інформаційна база про людей та організації в технологіях, інженерії, науці, операціях і бізнесі — для швидкого професійного контексту.',
    footerLanguages: 'Доступні мови: українська, англійська, російська.',
    footerRights: 'Всі права захищені.',
    footerPoliciesTitle: 'Редакція і політики',
    footerPoliciesText: 'Редакційний формат: інформаційна база з прозорою структурою сторінок і без прихованого службового тексту.',
    footerTeam: 'Команда: Rybezh.site',
    cookieTitle: 'Ми використовуємо лише базові cookies',
    cookieText: 'Сайт зберігає вибір теми та вашу відповідь на cookies notice у браузері. Деталі описані на окремій сторінці політики cookies.',
    cookieAccept: 'Прийняти',
    cookieDecline: 'Відхилити'
  },
  en: {
    navAria: 'Main navigation',
    navHome: 'Home',
    navSpecialists: 'Specialists',
    navStartups: 'Startups',
    navMethodology: 'Methodology',
    navMenu: 'Menu',
    navPrivacy: 'Privacy',
    navCookies: 'Cookies',
    navTerms: 'Terms',
    footerAbout: 'Rybezh.site is an editorial information base of specialists, executives and technology companies — structured profiles, transparent navigation and clear publishing rules.',
    footerNavTitle: 'Navigation',
    footerScopeTitle: 'About the directory',
    footerScopeText: 'Materials are organised as a reference information base about people and organisations in technology, engineering, science, operations and business — built for fast professional context.',
    footerLanguages: 'Available languages: Ukrainian, English, Spanish, Russian.',
    footerRights: 'All rights reserved.',
    footerPoliciesTitle: 'Editorial and policies',
    footerPoliciesText: 'Editorial format: informational knowledge base with transparent page structure and no hidden boilerplate text.',
    footerTeam: 'Team: Rybezh.site',
    cookieTitle: 'We use only basic cookies',
    cookieText: 'The site stores theme preference and your cookies-notice choice in the browser. See the cookies policy page for details.',
    cookieAccept: 'Accept',
    cookieDecline: 'Decline'
  },
  es: {
    navAria: 'Navegación principal',
    navHome: 'Inicio',
    navSpecialists: 'Especialistas',
    navStartups: 'Startups',
    navMethodology: 'Metodología',
    navMenu: 'Menú',
    navPrivacy: 'Privacidad',
    navCookies: 'Cookies',
    navTerms: 'Términos',
    footerAbout: 'Rybezh.site es una base editorial informativa de especialistas, directivos y compañías tecnológicas: perfiles estructurados, navegación transparente y reglas claras de publicación.',
    footerNavTitle: 'Navegación',
    footerScopeTitle: 'Sobre la base',
    footerScopeText: 'Los materiales están organizados como una base de referencia sobre personas y organizaciones en tecnología, ingeniería, ciencia, operaciones y negocios — pensada para contexto profesional rápido.',
    footerLanguages: 'Idiomas disponibles: ucraniano, inglés, español y ruso.',
    footerRights: 'Todos los derechos reservados.',
    footerPoliciesTitle: 'Editorial y políticas',
    footerPoliciesText: 'Formato editorial: base informativa con estructura de páginas transparente y sin texto oculto de plantilla.',
    footerTeam: 'Equipo: Rybezh.site',
    cookieTitle: 'Usamos solo cookies básicas',
    cookieText: 'El sitio guarda la preferencia de tema y tu elección del aviso de cookies en el navegador. Consulta la política de cookies para más detalles.',
    cookieAccept: 'Aceptar',
    cookieDecline: 'Rechazar'
  },
  ru: {
    navAria: 'Главная навигация',
    navHome: 'Главная',
    navSpecialists: 'Специалисты',
    navStartups: 'Стартапы',
    navMethodology: 'Методология',
    navMenu: 'Меню',
    navPrivacy: 'Конфиденциальность',
    navCookies: 'Cookies',
    navTerms: 'Условия',
    footerAbout: 'Rybezh.site — редакционная информационная база специалистов, руководителей и технологических компаний: структурированные профили, прозрачная навигация и понятные правила публикации.',
    footerNavTitle: 'Навигация',
    footerScopeTitle: 'О базе',
    footerScopeText: 'Материалы собраны как справочная информационная база о людях и организациях в технологиях, инженерии, науке, операциях и бизнесе — для быстрого профессионального контекста.',
    footerLanguages: 'Доступные языки: украинский, английский, испанский, русский.',
    footerRights: 'Все права защищены.',
    footerPoliciesTitle: 'Редакция и политики',
    footerPoliciesText: 'Редакционный формат: информационная база с прозрачной структурой страниц и без скрытого служебного текста.',
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
  finalHtml = finalHtml.replaceAll('{{NAV_ARIA}}', local.navAria)
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
