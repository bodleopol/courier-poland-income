import fs from 'fs';
import path from 'path';

const SRC_DIR = 'src';
const DIST_DIR = 'dist';
const TEMPLATE_FILE = path.join(SRC_DIR, 'templates', 'page.html');

if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

function processDirectory(dirPath, destPath) {
  if (!fs.existsSync(destPath)) {
    fs.mkdirSync(destPath, { recursive: true });
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const srcFile = path.join(dirPath, entry.name);
    const destFile = path.join(destPath, entry.name);

    if (entry.isDirectory()) {
      if (entry.name !== 'templates') { // Skip templates dir itself
          processDirectory(srcFile, destFile);
      }
    } else {
        if (srcFile.endsWith('.html') && dirPath === SRC_DIR) {
            compileHTML(srcFile, destFile);
        } else {
            // Copy non-HTML files directly
            fs.copyFileSync(srcFile, destFile);
        }
    }
  }
}

function compileHTML(srcFile, destFile) {
  let content = fs.readFileSync(srcFile, 'utf8');

  // Check if it's already a full HTML document
  if (content.trim().toLowerCase().startsWith('<!doctype html>')) {
    fs.writeFileSync(destFile, content);
    return;
  }

  const template = fs.readFileSync(TEMPLATE_FILE, 'utf8');

  // Extract meta tags if they exist in the fragment, or just use content
  let titleMatch = content.match(/<title>(.*?)<\/title>/i);
  let title = titleMatch ? titleMatch[1] : 'Rybezh';
  content = content.replace(/<title>.*?<\/title>/i, '');

  let descriptionMatch = content.match(/<meta\s+name="description"\s+content="(.*?)">/i);
  let description = descriptionMatch ? descriptionMatch[1] : 'Rybezh: Information Base of Prominent People & Startups';
  content = content.replace(/<meta\s+name="description"\s+content=".*?">/i, '');

  let keywordsMatch = content.match(/<meta\s+name="keywords"\s+content="(.*?)">/i);
  let keywords = keywordsMatch ? keywordsMatch[1] : 'tech, people, startups, rybezh';
  content = content.replace(/<meta\s+name="keywords"\s+content=".*?">/i, '');

  // Extract <style> block to inject into head
  let styleBlock = '';
  let styleMatch = content.match(/<style>([\s\S]*?)<\/style>/i);
  if (styleMatch) {
      styleBlock = styleMatch[0];
      content = content.replace(/<style>[\s\S]*?<\/style>/i, '');
  }

  const filename = path.basename(srcFile);

  let finalHtml = template.replace('{{CONTENT}}', () => content)
                          .replace('{{TITLE}}', title)
                          .replace('{{DESCRIPTION}}', description)
                          .replace('{{KEYWORDS}}', keywords)
                          .replace('</head>', `${styleBlock}\n</head>`);

  // Basic canonical URL logic (simplified for this example)
  const canonicalBase = 'https://rybezh.site/';

  let baseName = filename.replace(/-(en|es|ru)\.html$/, '.html');

  let ukLink = baseName;
  let ruLink = baseName === 'index.html' ? 'index-ru.html' : baseName.replace('.html', '-ru.html');
  let enLink = baseName === 'index.html' ? 'index-en.html' : baseName.replace('.html', '-en.html');
  let esLink = baseName === 'index.html' ? 'index-es.html' : baseName.replace('.html', '-es.html');

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
                       .replace('{{CANONICAL_ES}}', canonicalMap.es) // Still mapping the template var but using ES value
                       .replace('{{CANONICAL_RU}}', canonicalMap.ru)
                       .replace('{{CANONICAL_EN}}', canonicalMap.en);


  // Replace Lang Nav Links
  finalHtml = finalHtml.replace(/<a href="index\.html">UK<\/a>/, `<a href="${ukLink}">UK</a>`)
                       .replace(/<a href="index-ru\.html">RU<\/a>/, `<a href="${ruLink}">RU</a>`)
                       .replace(/<a href="index-en\.html">EN<\/a>/, `<a href="${enLink}">EN</a>`)
                       .replace(/<a href="index-es\.html">ES<\/a>/, `<a href="${esLink}">ES</a>`);



  const t = {
    'uk': {
        TITLE: 'Інформаційна база видатних людей',
        DESC: 'Вчені, директори, інженери, дослідники та технологічні лідери.',
        OFFICE: 'Офіс',
        COMPANY: 'ТОВ "Рыбеж" (Rybezh LLC)',
        ADDR: 'Україна, м. Київ, вул. Хрещатик, 1',
        LEGAL: 'Юридична інформація',
        EDRPOU: 'ЄДРПОУ: 12345678',
        NAV_INDEX: 'Головна / Люди',
        NAV_STARTUPS: 'Стартапи / Компанії'
    },
    'en': {
        TITLE: 'Information Base of Prominent People',
        DESC: 'Scientists, directors, engineers, researchers, and tech leaders.',
        OFFICE: 'Office',
        COMPANY: 'Rybezh LLC',
        ADDR: 'Ukraine, Kyiv, Khreshchatyk st., 1',
        LEGAL: 'Legal Information',
        EDRPOU: 'EDRPOU: 12345678',
        NAV_INDEX: 'Home / People',
        NAV_STARTUPS: 'Startups / Companies'
    },
    'ru': {
        TITLE: 'Информационная база выдающихся людей',
        DESC: 'Ученые, директора, инженеры, исследователи и технологические лидеры.',
        OFFICE: 'Офис',
        COMPANY: 'ООО "Рыбеж" (Rybezh LLC)',
        ADDR: 'Украина, г. Киев, ул. Крещатик, 1',
        LEGAL: 'Юридическая информация',
        EDRPOU: 'ЕГРПОУ: 12345678',
        NAV_INDEX: 'Главная / Люди',
        NAV_STARTUPS: 'Стартапы / Компании'
    },
    'es': {
        TITLE: 'Base de Información de Personas Destacadas',
        DESC: 'Científicos, directores, ingenieros, investigadores y líderes tecnológicos.',
        OFFICE: 'Oficina',
        COMPANY: 'Rybezh LLC',
        ADDR: 'Ucrania, Kiev, calle Khreshchatyk, 1',
        LEGAL: 'Información Legal',
        EDRPOU: 'EDRPOU: 12345678',
        NAV_INDEX: 'Inicio / Personas',
        NAV_STARTUPS: 'Startups / Empresas'
    }
  };

  // Set lang attribute

  let lang = 'uk';
  if (filename.endsWith('-en.html')) lang = 'en';
  else if (filename.endsWith('-es.html')) lang = 'es';
  else if (filename.endsWith('-ru.html')) lang = 'ru';

  let navIndexLink = lang === 'uk' ? 'index.html' : `index-${lang}.html`;
  let navStartupsLink = lang === 'uk' ? 'startups.html' : `startups-${lang}.html`;

  finalHtml = finalHtml.replace('{{HEADER_TITLE}}', t[lang].TITLE)
                       .replace('{{HEADER_DESC}}', t[lang].DESC)
                       .replace('{{FOOTER_OFFICE}}', t[lang].OFFICE)
                       .replace('{{FOOTER_COMPANY}}', t[lang].COMPANY)
                       .replace('{{FOOTER_ADDRESS}}', t[lang].ADDR)
                       .replace('{{FOOTER_LEGAL}}', t[lang].LEGAL)
                       .replace('{{FOOTER_EDRPOU}}', t[lang].EDRPOU)
                       .replace('{{NAV_INDEX}}', navIndexLink)
                       .replace('{{NAV_STARTUPS}}', navStartupsLink)
                       .replace('{{NAV_INDEX_TEXT}}', t[lang].NAV_INDEX)
                       .replace('{{NAV_STARTUPS_TEXT}}', t[lang].NAV_STARTUPS);

  finalHtml = finalHtml.replace('<html lang="uk">', `<html lang="${lang}">`);

  fs.writeFileSync(destFile, finalHtml);
}

processDirectory(SRC_DIR, DIST_DIR);
console.log('Build completed successfully.');
