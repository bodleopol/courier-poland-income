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


  let finalHtml = template.replace('{{CONTENT}}', () => content)
                          .replace('{{TITLE}}', title)
                          .replace('{{DESCRIPTION}}', description)
                          .replace('{{KEYWORDS}}', keywords)
                          .replace('</head>', `${styleBlock}\n</head>`);

  // Basic canonical URL logic (simplified for this example)
  const filename = path.basename(srcFile);
  const canonicalBase = 'https://rybezh.site/';

  let baseName = filename.replace(/-(en|pl|ru)\.html$/, '.html');
  if (baseName === 'index.html') {
      baseName = '';
  }

  const canonicalMap = {
      'uk': baseName ? canonicalBase + baseName : canonicalBase,
      'en': baseName ? canonicalBase + baseName.replace('.html', '-en.html') : canonicalBase + 'index-en.html',
      'pl': baseName ? canonicalBase + baseName.replace('.html', '-pl.html') : canonicalBase + 'index-pl.html',
      'ru': baseName ? canonicalBase + baseName.replace('.html', '-ru.html') : canonicalBase + 'index-ru.html',
  };

  finalHtml = finalHtml.replace('{{CANONICAL}}', canonicalMap.uk)
                       .replace('{{CANONICAL_PL}}', canonicalMap.pl)
                       .replace('{{CANONICAL_RU}}', canonicalMap.ru)
                       .replace('{{CANONICAL_EN}}', canonicalMap.en);


  // Set lang attribute
  let lang = 'uk';
  if (filename.endsWith('-en.html')) lang = 'en';
  else if (filename.endsWith('-pl.html')) lang = 'pl';
  else if (filename.endsWith('-ru.html')) lang = 'ru';

  finalHtml = finalHtml.replace('<html lang="uk">', `<html lang="${lang}">`);

  fs.writeFileSync(destFile, finalHtml);
}

processDirectory(SRC_DIR, DIST_DIR);
console.log('Build completed successfully.');
