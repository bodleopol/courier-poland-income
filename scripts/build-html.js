import fs from 'fs';
import path from 'path';

const SRC_DIR = 'src';
const DIST_DIR = 'dist';
const TEMPLATES_DIR = path.join(SRC_DIR, 'templates');
const PAGE_TEMPLATE_PATH = path.join(TEMPLATES_DIR, 'page.html');

// Read the page template
const templateHtml = fs.readFileSync(PAGE_TEMPLATE_PATH, 'utf8');

// Ensure dist directory exists
if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

// Function to compile a single file
function compileFile(srcPath, destPath, filename) {
  const content = fs.readFileSync(srcPath, 'utf8');

  // If the file already has a DOCTYPE, it might be a full page or template itself, copy as is.
  if (content.includes('<!DOCTYPE html>')) {
     fs.copyFileSync(srcPath, destPath);
     return;
  }

  // Very naive extraction of a title from h1 or h2 for metadata
  let title = 'Rybezh';
  const h1Match = content.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  const h2Match = content.match(/<h2[^>]*>([^<]+)<\/h2>/i);
  if (h1Match) title = h1Match[1].trim();
  else if (h2Match) title = h2Match[1].trim();

  let finalHtml = templateHtml
    .replace('{{CONTENT}}', content)
    .replace(/\{\{TITLE\}\}/g, title)
    .replace(/\{\{DESCRIPTION\}\}/g, title + ' на Rybezh')
    .replace(/\{\{KEYWORDS\}\}/g, 'робота, польща, вакансії, працевлаштування')
    .replace(/\{\{CTA_LINK\}\}/g, '/apply.html');

  fs.writeFileSync(destPath, finalHtml, 'utf8');
}

// Recursively process files
function processDirectory(currentSrcDir, currentDestDir) {
  if (!fs.existsSync(currentDestDir)) {
    fs.mkdirSync(currentDestDir, { recursive: true });
  }

  const files = fs.readdirSync(currentSrcDir);
  for (const file of files) {
    // Skip templates dir
    if (currentSrcDir === SRC_DIR && file === 'templates') continue;

    const srcPath = path.join(currentSrcDir, file);
    const destPath = path.join(currentDestDir, file);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      processDirectory(srcPath, destPath);
    } else if (file.endsWith('.html')) {
      compileFile(srcPath, destPath, file);
    } else {
      // Just copy other files (CSS, JS, JSON, images)
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('Starting HTML build process...');
processDirectory(SRC_DIR, DIST_DIR);
console.log('Build complete.');
