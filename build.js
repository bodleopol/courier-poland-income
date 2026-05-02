import fs from 'fs';
import path from 'path';

const SRC_DIR = 'src';
const DIST_DIR = 'dist';
const TEMPLATE_FILE = path.join(SRC_DIR, 'templates', 'page.html');
const translations = {
  uk: {
    navAria: 'Головна навігація',
    navHome: 'Головна',
    navStartups: 'Стартапи',
    footerAbout: 'Міжнародна інформаційна база профілів спеціалістів, дослідників, інженерів, керівників і засновників компаній.',
    footerNavTitle: 'Навігація',
    footerScopeTitle: 'Про базу',
    footerScopeText: 'Каталог створений як редакційна довідкова база про людей та організації, що впливають на технології, науку, космос і бізнес.',
    footerLanguages: 'Доступні мови: українська, англійська, іспанська, російська.',
    footerRights: 'Всі права захищені.'
  },
  en: {
    navAria: 'Main navigation',
    navHome: 'Home',
    navStartups: 'Startups',
    footerAbout: 'An international information base of specialists, researchers, engineers, executives and company founders.',
    footerNavTitle: 'Navigation',
    footerScopeTitle: 'About the directory',
    footerScopeText: 'The catalogue is an editorial reference base about people and organisations shaping technology, science, space and business.',
    footerLanguages: 'Available languages: Ukrainian, English, Spanish, Russian.',
    footerRights: 'All rights reserved.'
  },
  es: {
    navAria: 'Navegación principal',
    navHome: 'Inicio',
    navStartups: 'Startups',
    footerAbout: 'Base internacional de perfiles de especialistas, investigadores, ingenieros, directivos y fundadores de empresas.',
    footerNavTitle: 'Navegación',
    footerScopeTitle: 'Sobre la base',
    footerScopeText: 'El catálogo es una base editorial de referencia sobre personas y organizaciones que influyen en tecnología, ciencia, espacio y negocios.',
    footerLanguages: 'Idiomas disponibles: ucraniano, inglés, español, ruso.',
    footerRights: 'Todos los derechos reservados.'
  },
  ru: {
    navAria: 'Главная навигация',
    navHome: 'Главная',
    navStartups: 'Стартапы',
    footerAbout: 'Международная информационная база профилей специалистов, исследователей, инженеров, руководителей и основателей компаний.',
    footerNavTitle: 'Навигация',
    footerScopeTitle: 'О базе',
    footerScopeText: 'Каталог создан как редакционная справочная база о людях и организациях, влияющих на технологии, науку, космос и бизнес.',
    footerLanguages: 'Доступные языки: украинский, английский, испанский, русский.',
    footerRights: 'Все права защищены.'
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

  let keywordsMatch = content.match(/<meta\s+name="keywords"\s+content="(.*?)">/i);
  let keywords = keywordsMatch ? keywordsMatch[1] : '';
  content = content.replace(/<meta\s+name="keywords"\s+content=".*?">/i, '');

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
                          .replace('{{KEYWORDS}}', keywords)
                          .replace('</head>', `${styleBlock}\n</head>`);

  const canonicalBase = 'https://rybezh.site/';

  let baseName = filename.replace(/-(en|es|ru)\.html$/, '.html');
  if (baseName === 'index.html') {
      baseName = '';
  }

  const canonicalMap = {
      'uk': baseName ? canonicalBase + baseName : canonicalBase,
      'en': baseName ? canonicalBase + baseName.replace('.html', '-en.html') : canonicalBase + 'index-en.html',
      'es': baseName ? canonicalBase + baseName.replace('.html', '-es.html') : canonicalBase + 'index-es.html',
      'ru': baseName ? canonicalBase + baseName.replace('.html', '-ru.html') : canonicalBase + 'index-ru.html',
  };

  finalHtml = finalHtml.replace('{{CANONICAL}}', canonicalMap.uk)
                       .replace('{{CANONICAL_ES}}', canonicalMap.es)
                       .replace('{{CANONICAL_RU}}', canonicalMap.ru)
                       .replace('{{CANONICAL_EN}}', canonicalMap.en);

  const local = translations[lang];
  const homeUrl = lang === 'uk' ? 'index.html' : `index-${lang}.html`;
  const startupsUrl = lang === 'uk' ? 'startups.html' : `startups-${lang}.html`;
  finalHtml = finalHtml.replaceAll('{{NAV_ARIA}}', local.navAria)
                       .replaceAll('{{NAV_HOME}}', local.navHome)
                       .replaceAll('{{NAV_STARTUPS}}', local.navStartups)
                       .replaceAll('{{HOME_URL}}', homeUrl)
                       .replaceAll('{{STARTUPS_URL}}', startupsUrl)
                       .replaceAll('{{FOOTER_ABOUT}}', local.footerAbout)
                       .replaceAll('{{FOOTER_NAV_TITLE}}', local.footerNavTitle)
                       .replaceAll('{{FOOTER_SCOPE_TITLE}}', local.footerScopeTitle)
                       .replaceAll('{{FOOTER_SCOPE_TEXT}}', local.footerScopeText)
                       .replaceAll('{{FOOTER_LANGUAGES}}', local.footerLanguages)
                       .replaceAll('{{FOOTER_RIGHTS}}', local.footerRights);

  finalHtml = finalHtml.replace('<html lang="uk">', `<html lang="${lang}">`);

  fs.writeFileSync(destFile, finalHtml);
}

processDirectory(SRC_DIR, DIST_DIR);
processPages(path.join(SRC_DIR, 'pages'), DIST_DIR);
console.log('Build completed successfully.');
