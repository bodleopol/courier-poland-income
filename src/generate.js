import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC = path.join(__dirname);
const TEMPLATES = path.join(SRC, 'templates');
const DIST = path.join(process.cwd(), 'dist');

async function build() {
  // clean dist to avoid stale files
  await fs.rm(DIST, { recursive: true, force: true }).catch(() => {});
  await fs.mkdir(DIST, { recursive: true });

  const contentPath = path.join(SRC, 'content.json');
  const contentRaw = await fs.readFile(contentPath, 'utf8');
  const pages = JSON.parse(contentRaw);

  const pageTpl = await fs.readFile(path.join(TEMPLATES, 'page.html'), 'utf8');
  const articleTpl = await fs.readFile(path.join(TEMPLATES, 'article.html'), 'utf8');
  const stylesPath = path.join(TEMPLATES, 'styles.css');
  let styles = '';
  try {
    styles = await fs.readFile(stylesPath, 'utf8');
    await fs.writeFile(path.join(DIST, 'styles.css'), styles, 'utf8');
  } catch (e) {
    // no styles provided, continue
  }

  const links = [];
  for (const page of pages) {
    const tpl = page.body ? articleTpl : pageTpl;
    const description = page.excerpt || page.description || '';
    const content = page.body || page.content || page.excerpt || '';
    const html = tpl
      .replace(/{{TITLE}}/g, escapeHtml(page.title || ''))
      .replace(/{{DESCRIPTION}}/g, escapeHtml(description))
      .replace(/{{CONTENT}}/g, content)
      .replace(/{{SLUG}}/g, escapeHtml(page.slug || ''))
      .replace(/{{CITY}}/g, escapeHtml(page.city || ''))
      .replace(/{{CTA_LINK}}/g, page.cta_link || '/apply.html')
      .replace(/{{CTA_TEXT}}/g, page.cta_text || 'Подати заявку');

    const finalHtml = html.replace(/\$\{new Date\(\)\.getFullYear\(\)\}/g, String(new Date().getFullYear()));
    const outFile = path.join(DIST, `${page.slug}.html`);
    await fs.writeFile(outFile, finalHtml, 'utf8');
    links.push({ title: page.title, slug: page.slug });
  }

  // generate index
  const indexHtml = generateIndex(links);
  await fs.writeFile(path.join(DIST, 'index.html'), indexHtml, 'utf8');

  console.log('Build complete. Pages:', links.length);
}

function generateIndex(links) {
  const items = links.map(l => `  <li><a href="./${l.slug}.html">${escapeHtml(l.title)}</a></li>`).join('\n');
  return `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Робота кур'єром у Польщі</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <header class="site-header"><h1>Робота кур'єром у Польщі</h1></header>
  <main>
    <ul>
${items}
    </ul>
  </main>
  <footer class="site-footer">&copy; ${new Date().getFullYear()}</footer>
</body>
</html>`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

build().catch(err => {
  console.error(err);
  process.exit(1);
});
