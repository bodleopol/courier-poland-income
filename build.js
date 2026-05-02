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

  let finalHtml = template.replace('{{CONTENT}}', () => content)
                          .replace('{{TITLE}}', title)
                          .replace('{{DESCRIPTION}}', description)
                          .replace('{{KEYWORDS}}', keywords)
                          .replace('</head>', `${styleBlock}\n</head>`);

  // Basic canonical URL logic (simplified for this example)
  const filename = path.basename(srcFile);
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
  let lang = 'uk';
  if (filename.endsWith('-en.html')) lang = 'en';
  else if (filename.endsWith('-es.html')) lang = 'es';
  else if (filename.endsWith('-ru.html')) lang = 'ru';

  finalHtml = finalHtml.replace('<html lang="uk">', `<html lang="${lang}">`);

  fs.writeFileSync(destFile, finalHtml);
}

processDirectory(SRC_DIR, DIST_DIR);
processPages(path.join(SRC_DIR, 'pages'), DIST_DIR);
console.log('Build completed successfully.');
