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
  content = content.replace(/<header.*?>[\s\S]*?<\/header>/gi, '');
  content = content.replace(/<main.*?>/gi, '');
  content = content.replace(/<\/main>/gi, '');
  content = content.replace(/<footer.*?>[\s\S]*?<\/footer>/gi, '');

  const template = fs.readFileSync(TEMPLATE_FILE, 'utf8');

  // Inject dynamic cards into index pages
  if (path.basename(srcFile).startsWith('index')) {
      let cardsJson = {uk: '', ru: '', en: '', es: ''};
      if (fs.existsSync('src/generated_index_cards.json')) {
          cardsJson = JSON.parse(fs.readFileSync('src/generated_index_cards.json', 'utf8'));
      }
      const filename = path.basename(srcFile);
      let langKey = 'uk';
      if (filename.endsWith('-en.html')) langKey = 'en';
      if (filename.endsWith('-es.html')) langKey = 'es';
      if (filename.endsWith('-ru.html')) langKey = 'ru';

      content = content.replace(/(<\/section>)/, `${cardsJson[langKey]}\n$1`);
  }


  const t = {
    'uk': {
        FOOTER_DESC: 'Міжнародна інформаційна база видатних спеціалістів, керівників та інноваторів.',
        NAV: 'Навігація',
        CORP: 'Корпоративна Інформація',
        OFFICE: 'Офіс: м. Київ, Україна, вул. Хрещатик 1',
        TAX: 'ІПН / Податковий номер: 31415926535',
        TEAM: 'Команда: Rybezh Executive Team',
        RIGHTS: '&copy; 2024 Rybezh. Всі права захищені.',
        HOME: 'Головна',
        STARTUPS: 'Стартапи'
    },
    'en': {
        FOOTER_DESC: 'International information base of prominent specialists, executives and innovators.',
        NAV: 'Navigation',
        CORP: 'Corporate Information',
        OFFICE: 'Office: Kyiv, Ukraine, Khreshchatyk st. 1',
        TAX: 'Tax ID: 31415926535',
        TEAM: 'Team: Rybezh Executive Team',
        RIGHTS: '&copy; 2024 Rybezh. All rights reserved.',
        HOME: 'Home',
        STARTUPS: 'Startups'
    },
    'es': {
        FOOTER_DESC: 'Base de información internacional de destacados especialistas, ejecutivos e innovadores.',
        NAV: 'Navegación',
        CORP: 'Información Corporativa',
        OFFICE: 'Oficina: Kiev, Ucrania, calle Khreshchatyk 1',
        TAX: 'ID Fiscal: 31415926535',
        TEAM: 'Equipo: Rybezh Executive Team',
        RIGHTS: '&copy; 2024 Rybezh. Todos los derechos reservados.',
        HOME: 'Inicio',
        STARTUPS: 'Startups'
    },
    'ru': {
        FOOTER_DESC: 'Международная информационная база выдающихся специалистов, руководителей и инноваторов.',
        NAV: 'Навигация',
        CORP: 'Корпоративная Информация',
        OFFICE: 'Офис: г. Киев, Украина, ул. Крещатик 1',
        TAX: 'ИНН / Налоговый номер: 31415926535',
        TEAM: 'Команда: Rybezh Executive Team',
        RIGHTS: '&copy; 2024 Rybezh. Все права защищены.',
        HOME: 'Главная',
        STARTUPS: 'Стартапы'
    }
  };


  let finalHtml = template.replace('{{CONTENT}}', () => content)
                          .replace('{{TITLE}}', title)
                          .replace('{{DESCRIPTION}}', description)
                          .replace('{{KEYWORDS}}', keywords)
                          .replace('</head>', `${styleBlock}\n</head>`);

  // Basic canonical URL logic (simplified for this example)
  let lang = 'uk';
  const filename = path.basename(srcFile);
  if (filename.endsWith('-en.html')) lang = 'en';
  else if (filename.endsWith('-es.html')) lang = 'es';
  else if (filename.endsWith('-ru.html')) lang = 'ru';

  finalHtml = finalHtml.replace('{{FOOTER_DESC}}', t[lang].FOOTER_DESC)
                       .replace('{{NAV}}', t[lang].NAV)
                       .replace('{{CORP}}', t[lang].CORP)
                       .replace('{{OFFICE}}', t[lang].OFFICE)
                       .replace('{{TAX}}', t[lang].TAX)
                       .replace('{{TEAM}}', t[lang].TEAM)
                       .replace('{{RIGHTS}}', t[lang].RIGHTS)
                       .replace('{{HOME}}', t[lang].HOME)
                       .replace('{{STARTUPS}}', t[lang].STARTUPS);

  let navIndexLink = lang === 'uk' ? 'index.html' : `index-${lang}.html`;
  let navStartupsLink = lang === 'uk' ? 'startups.html' : `startups-${lang}.html`;

  finalHtml = finalHtml.replace('{{NAV_INDEX}}', navIndexLink)
                       .replace('{{NAV_STARTUPS}}', navStartupsLink);


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

  // Set lang attribute


  finalHtml = finalHtml.replace('<html lang="uk">', `<html lang="${lang}">`);

  fs.writeFileSync(destFile, finalHtml);
}

processDirectory(SRC_DIR, DIST_DIR);
processPages(path.join(SRC_DIR, 'pages'), DIST_DIR);

function buildSitemap(distDir) {
  let urls = [];
  const BASE_URL = 'https://rybezh.site/';

  function scanDir(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        scanDir(path.join(dir, entry.name));
      } else if (entry.name.endsWith('.html') && entry.name !== '404.html') {
        const fullPath = path.join(dir, entry.name);
        let relPath = path.relative(distDir, fullPath);
        // Ensure forward slashes for URLs
        relPath = relPath.replace(/\\/g, '/');

        let priority = '0.6';
        let changefreq = 'weekly';

        if (relPath.startsWith('index')) {
          priority = '1.0';
          changefreq = 'daily';
        } else if (relPath.startsWith('startups')) {
          priority = '0.9';
        } else if (relPath.startsWith('person-') || relPath.startsWith('generated_')) {
          priority = '0.8';
        }

        const urlStr = `  <url>\n    <loc>${BASE_URL}${relPath}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
        urls.push(urlStr);
      }
    }
  }

  scanDir(distDir);

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;

  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapContent);
  console.log(`Generated sitemap.xml with ${urls.length} URLs.`);
}

buildSitemap(DIST_DIR);
console.log('Build completed successfully.');
