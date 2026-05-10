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
    skipLink: 'Перейти до основного вмісту',
    brandTagline: 'Профілі та компанії',
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
      'Сторінки про конфіденційність, cookies та умови; як збираємо матеріали — у розділі «Методологія».',
    footerTagline: 'Первинні джерела завжди мають пріоритет перед цим довідником.',
    footerSitemap: 'Карта сайту',
    cookieTitle: 'Ми використовуємо лише базові cookies',
    cookieText:
      'Сайт зберігає в браузері вибір теми та вашу відповідь щодо cookies. Деталі — на сторінці політики cookies.',
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
    skipLink: 'Skip to main content',
    brandTagline: 'People and companies',
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
      'Privacy, cookies, and terms pages are linked above; methodology is explained in its own section.',
    footerTagline: 'Primary sources outweigh this directory when they disagree.',
    footerSitemap: 'Sitemap',
    cookieTitle: 'We use only basic cookies',
    cookieText:
      'The site stores your theme choice and cookie-banner response in the browser. See the cookies policy for details.',
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
    skipLink: 'Ir al contenido principal',
    brandTagline: 'Perfiles y empresas',
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
      'Páginas de privacidad, cookies y términos enlazadas arriba; la metodología está en su propia sección.',
    footerTagline: 'Si hay discrepancia, prevalecen las fuentes primarias.',
    footerSitemap: 'Mapa del sitio',
    cookieTitle: 'Usamos solo cookies básicas',
    cookieText:
      'El sitio guarda en el navegador el tema y tu respuesta al aviso de cookies. Más información en la política de cookies.',
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
    skipLink: 'Перейти к основному содержимому',
    brandTagline: 'Профили и компании',
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
      'Страницы о конфиденциальности, cookies и условиях — в ссылках выше; как собираем материалы — в разделе «Методология».',
    footerTagline: 'При расхождении приоритет у первичных источников.',
    footerSitemap: 'Карта сайта',
    cookieTitle: 'Мы используем только базовые cookies',
    cookieText:
      'Сайт сохраняет в браузере выбор темы и ваш ответ по cookies. Подробности — на странице политики cookies.',
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
      if (srcFile.endsWith('.css') || srcFile.endsWith('.js')) {
        const rawAsset = fs.readFileSync(srcFile, 'utf8');
        fs.writeFileSync(destFile, minifyAssetIfNeeded(srcFile, rawAsset));
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
                       .replaceAll('{{FOOTER_TAGLINE}}', local.footerTagline)
                       .replaceAll('{{FOOTER_SITEMAP}}', local.footerSitemap)
                       .replaceAll('{{SKIP_LINK}}', local.skipLink)
                       .replaceAll('{{BRAND_TAGLINE}}', local.brandTagline)
                       .replaceAll('{{CONTACT_LABEL}}', local.contactLabel);

  finalHtml = finalHtml.replaceAll('{{COOKIE_TITLE}}', local.cookieTitle)
                       .replaceAll('{{COOKIE_TEXT}}', local.cookieText)
                       .replaceAll('{{COOKIE_ACCEPT}}', local.cookieAccept)
                       .replaceAll('{{COOKIE_DECLINE}}', local.cookieDecline);

  finalHtml = finalHtml.replace('<html lang="uk">', `<html lang="${lang}">`);

  finalHtml = finalHtml.replace(/<style>([\s\S]*?)<\/style>/gi, (_, css) => `<style>${minifyCss(css)}</style>`);
  finalHtml = finalHtml.replace(/<script>([\s\S]*?)<\/script>/gi, (_, js) => `<script>${minifyJs(js)}</script>`);
  finalHtml = minifyHtml(finalHtml);

  fs.writeFileSync(destFile, finalHtml);
}

processDirectory(SRC_DIR, DIST_DIR);
processPages(path.join(SRC_DIR, 'pages'), DIST_DIR);
console.log('Build completed successfully.');
