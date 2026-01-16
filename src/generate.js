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
  const stylesPath = path.join(TEMPLATES, 'styles.css');
  let styles = '';
  try {
    styles = await fs.readFile(stylesPath, 'utf8');
    await fs.writeFile(path.join(DIST, 'styles.css'), styles, 'utf8');
  } catch (e) {
    // no styles provided, continue
  }

  // copy static pages
  const staticPages = ['apply.html', 'about.html', 'contact.html'];
  for (const p of staticPages) {
    try {
      const pContent = await fs.readFile(path.join(SRC, p), 'utf8');
      await fs.writeFile(path.join(DIST, p), pContent.replace(/\$\{new Date\(\)\.getFullYear\(\)\}/g, String(new Date().getFullYear())), 'utf8');
    } catch (e) {}
  }

  const links = [];
  for (const page of pages) {
    const tpl = pageTpl;
    const description = page.excerpt || page.description || '';
    const content = page.body || page.content || page.excerpt || '';
    const html = tpl
      .replace(/{{TITLE}}/g, escapeHtml(page.title || ''))
      .replace(/{{DESCRIPTION}}/g, escapeHtml(description))
      .replace(/{{CONTENT}}/g, content)
      .replace(/{{CANONICAL}}/g, `https://rybezh.site/${escapeHtml(page.slug || '')}.html`)
      .replace(/{{CITY}}/g, escapeHtml(page.city || ''))
      .replace(/{{CTA_LINK}}/g, page.cta_link || '/apply.html')
      .replace(/{{CTA_TEXT}}/g, page.cta_text || 'Подати заявку');

    const finalHtml = html.replace(/\$\{new Date\(\)\.getFullYear\(\)\}/g, String(new Date().getFullYear()));
    const outFile = path.join(DIST, `${page.slug}.html`);
    await fs.writeFile(outFile, finalHtml, 'utf8');
    links.push({ title: page.title, slug: page.slug, city: page.city || '' });
  }

    // generate index
    const indexContent = generateIndexContent(links);
    const indexHtml = pageTpl
      .replace(/{{TITLE}}/g, "Rybezh — Робота кур'єром у Польщі")
      .replace(/{{DESCRIPTION}}/g, "Актуальні вакансії кур'єрів у містах Польщі. Робота з гнучким графіком, щоденними виплатами та підтримкою.")
      .replace(/{{CONTENT}}/g, indexContent)
      .replace(/{{CANONICAL}}/g, "https://rybezh.site/")
      .replace(/\$\{new Date\(\)\.getFullYear\(\)\}/g, String(new Date().getFullYear()));
    await fs.writeFile(path.join(DIST, 'index.html'), indexHtml, 'utf8');

    // write sitemap.xml
    try {
      const sitemap = generateSitemap(links);
      await fs.writeFile(path.join(DIST, 'sitemap.xml'), sitemap, 'utf8');
    } catch (e) {
      // ignore sitemap errors
    }

    // write robots.txt
    try {
      const robots = `User-agent: *\nAllow: /\nSitemap: https://rybezh.site/sitemap.xml\nHost: rybezh.site\n`;
      await fs.writeFile(path.join(DIST, 'robots.txt'), robots, 'utf8');
    } catch (e) {}

    // write CNAME for GitHub Pages custom domain
    try {
      await fs.writeFile(path.join(DIST, 'CNAME'), 'rybezh.site', 'utf8');
    } catch (e) {}

    console.log('Build complete. Pages:', links.length);
  }
function generateIndexContent(links) {
  const cards = links.map(l => {
    const cityAttr = escapeHtml(l.city || '');
    return `    <div class="job-card" data-city="${cityAttr}">
      <h3><a href="./${l.slug}.html">${escapeHtml(l.title)}</a></h3>
      <p class="muted">${cityAttr}</p>
      <a class="card-cta" href="./${l.slug}.html">Деталі</a>
    </div>`;
  }).join('\n');

  return `
    <p class="lead" style="text-align:center; margin-bottom:2rem; color:var(--color-secondary);">Актуальні вакансії по містах: Варшава, Краків, Гданськ, Вроцлав, Познань. Гнучкий графік, щоденні виплати.</p>
    <form class="search-form" action="/" method="get" aria-label="Фільтр вакансій">
      <label class="sr-only" for="q">Пошук</label>
      <input id="q" name="q" placeholder="Пошук за містом або типом роботи" aria-label="Пошук вакансій" />
      <select id="city" name="city" aria-label="Вибір міста">
        <option value="">Всі міста</option>
        <option>Варшава</option>
        <option>Краків</option>
        <option>Гданськ</option>
        <option>Вроцлав</option>
        <option>Познань</option>
      </select>
      <button type="submit">Знайти</button>
    </form>
    <div class="jobs-grid" aria-label="Список вакансій">
${cards}
    </div>
    <script>
      (function(){
        const q = document.getElementById('q');
        const city = document.getElementById('city');
        const form = document.querySelector('.search-form');
        const jobs = Array.from(document.querySelectorAll('.job-card'));
        function normalize(s){return String(s||'').toLowerCase();}
        function filter(){
          const qv = normalize(q.value.trim());
          const cv = normalize(city.value.trim());
          jobs.forEach(card => {
            const text = normalize(card.textContent);
            const c = normalize(card.dataset.city || '');
            const matchQ = !qv || text.includes(qv);
            const matchC = !cv || c === cv || c.includes(cv);
            card.style.display = (matchQ && matchC) ? '' : 'none';
          });
        }
        form.addEventListener('submit', function(e){ e.preventDefault(); filter(); });
        q.addEventListener('input', filter);
        city.addEventListener('change', filter);
      })();
    </script>`;
}

function generateSitemap(links) {
  const base = 'https://rybezh.site';
  const urls = [
    `${base}/`,
    `${base}/apply.html`, `${base}/about.html`, `${base}/contact.html`,
    ...links.map(l => `${base}/${l.slug}.html`)
  ];
  const now = new Date().toISOString();
  const items = urls.map(u => `  <url>\n    <loc>${u}</loc>\n    <lastmod>${now}</lastmod>\n  </url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>`;
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
