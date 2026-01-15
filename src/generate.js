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

  // copy apply.html if present
  try {
    const applySrc = path.join(SRC, 'apply.html');
    const applyContent = await fs.readFile(applySrc, 'utf8');
    await fs.writeFile(path.join(DIST, 'apply.html'), applyContent.replace(/\$\{new Date\(\)\.getFullYear\(\)\}/g, String(new Date().getFullYear())), 'utf8');
  } catch (e) {
    // no apply page, skip
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
    links.push({ title: page.title, slug: page.slug, city: page.city || '' });
  }

    // generate index
    const indexHtml = generateIndex(links);
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
function generateIndex(links) {
  const cards = links.map(l => {
    const cityAttr = escapeHtml(l.city || '');
    return `    <article class="job-card" data-city="${cityAttr}">
      <h3><a href="./${l.slug}.html">${escapeHtml(l.title)}</a></h3>
      <p class="muted">${cityAttr}</p>
      <a class="card-cta" href="./${l.slug}.html">Деталі</a>
    </article>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Rybezh — Робота кур'єром у Польщі</title>
  <meta name="description" content="Актуальні вакансії кур'єрів у містах Польщі. Робота з гнучким графіком, щоденними виплатами та підтримкою.">
  <link rel="stylesheet" href="/styles.css">
  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-MJKSZ4KN');</script>
  <!-- End Google Tag Manager -->

  <!-- Google Analytics (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-J3XSXPYW9K"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-J3XSXPYW9K');
  </script>
</head>
<body>
  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MJKSZ4KN" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->
  <header>
    <div class="container header-flex">
      <a class="logo-section" href="/" aria-label="Rybezh home">
        <svg class="logo" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="false"><defs><linearGradient id="gi" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#0f766e"/><stop offset="100%" stop-color="#14b8a6"/></linearGradient></defs><rect x="6" y="6" width="108" height="108" rx="18" fill="url(#gi)" opacity="0.12"/></svg>
        <div style="display:flex;flex-direction:column;line-height:1;">
          <span style="font-weight:800;color:var(--color-accent);font-size:1rem;">Rybezh</span>
          <small style="color:var(--color-text-light);font-size:0.78rem;margin-top:2px;">rybezh.site — робота кур'єром у Польщі</small>
        </div>
      </a>
      <nav>
        <a href="/">Головна</a>
        <a href="/apply.html">Подати заявку</a>
      </nav>
    </div>
  </header>

  <main class="container">
    <section class="hero">
      <h1>Знайдіть роботу кур'єром у Польщі</h1>
      <p class="lead">Актуальні вакансії по містах: Варшава, Краків, Гданськ, Вроцлав, Познань. Гнучкий графік, щоденні виплати.</p>
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
        <button class="btn btn-primary" type="submit">Знайти</button>
      </form>
    </section>

    <section class="jobs-grid" aria-label="Список вакансій">
${cards}
    </section>

    <section class="cta-section">
      <h2>Потрібна допомога з оформленням?</h2>
      <p class="muted">Залиште заявку — ми допоможемо з документами та підбором роботи.</p>
      <a class="btn btn-primary" href="/apply.html">Подати заявку</a>
    </section>
  </main>

  <footer>
    <div class="container">
      <p>&copy; ${new Date().getFullYear()} Rybezh. Всі права захищені. &nbsp; <a href="https://t.me/rybezh_site" target="_blank" rel="noopener noreferrer">@rybezh_site</a></p>
    </div>
  </footer>
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
  </script>
</body>
</html>`;
}

function generateSitemap(links) {
  const base = 'https://rybezh.site';
  const urls = [
    `${base}/`,
    `${base}/apply.html`,
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
