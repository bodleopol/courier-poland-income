import fs from 'fs';
import path from 'path';

const SRC_DIR = 'src';
const DIST_DIR = 'dist';
const TEMPLATE_FILE = path.join(SRC_DIR, 'templates', 'page.html');
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
    footerAbout: 'Професійний редакційний каталог спеціалістів, керівників і технологічних компаній з акцентом на якісний контент і прозору навігацію.',
    footerNavTitle: 'Навігація',
    footerScopeTitle: 'Про базу',
    footerScopeText: 'Каталог створений як редакційна довідкова база про людей та організації, що впливають на технології, інженерію, науку, операції та бізнес.',
    footerLanguages: 'Доступні мови: українська, англійська, російська.',
    footerRights: 'Всі права захищені.',
    footerPoliciesTitle: 'Редакція і політики',
    footerPoliciesText: 'Редакційний формат: інформаційний каталог, без doorway-сторінок і прихованого SEO-контенту.',
    footerTeam: 'Команда: Rybezh Research & Editorial Team',
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
    footerAbout: 'A professional editorial catalogue of specialists, executives and technology companies with an emphasis on quality content and transparent navigation.',
    footerNavTitle: 'Navigation',
    footerScopeTitle: 'About the directory',
    footerScopeText: 'The catalogue is an editorial reference base about people and organisations shaping technology, engineering, science, operations and business.',
    footerLanguages: 'Available languages: Ukrainian, English, Spanish, Russian.',
    footerRights: 'All rights reserved.',
    footerPoliciesTitle: 'Editorial and policies',
    footerPoliciesText: 'Editorial format: informational directory without doorway pages or hidden SEO content.',
    footerTeam: 'Team: Rybezh Research & Editorial Team',
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
    footerAbout: 'Un catálogo editorial profesional de especialistas, directivos y compañías tecnológicas con énfasis en contenido de calidad y navegación transparente.',
    footerNavTitle: 'Navegación',
    footerScopeTitle: 'Sobre la base',
    footerScopeText: 'El catálogo es una base editorial de referencia sobre personas y organizaciones que influyen en tecnología, ingeniería, ciencia, operaciones y negocios.',
    footerLanguages: 'Idiomas disponibles: ucraniano, inglés, español y ruso.',
    footerRights: 'Todos los derechos reservados.',
    footerPoliciesTitle: 'Editorial y políticas',
    footerPoliciesText: 'Formato editorial: directorio informativo sin páginas doorway ni contenido SEO oculto.',
    footerTeam: 'Equipo: Rybezh Research & Editorial Team',
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
    footerAbout: 'Профессиональный редакционный каталог специалистов, руководителей и технологических компаний с акцентом на качественный контент и прозрачную навигацию.',
    footerNavTitle: 'Навигация',
    footerScopeTitle: 'О базе',
    footerScopeText: 'Каталог создан как редакционная справочная база о людях и организациях, влияющих на технологии, инженерию, науку, операции и бизнес.',
    footerLanguages: 'Доступные языки: украинский, английский, испанский, русский.',
    footerRights: 'Все права защищены.',
    footerPoliciesTitle: 'Редакция и политики',
    footerPoliciesText: 'Редакционный формат: информационный каталог без doorway-страниц и скрытого SEO-контента.',
    footerTeam: 'Команда: Rybezh Research & Editorial Team',
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
    } else {
        // We only copy non-HTML files here. HTML files in 'pages' are handled separately.
        if (!srcFile.endsWith('.html') && dirPath === SRC_DIR) {
            fs.copyFileSync(srcFile, destFile);
        } else if (dirPath !== SRC_DIR && !srcFile.endsWith('.html')) {
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
