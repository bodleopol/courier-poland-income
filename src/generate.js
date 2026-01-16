import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC = path.join(__dirname);
const TEMPLATES = path.join(SRC, 'templates');
const DIST = path.join(process.cwd(), 'dist');

// Simple i18n styles (glassmorphism) and client script will be injected into generated pages
const I18N_STYLE = `\n<style>
/* Language switcher - glassmorphism */
.lang-switcher {
  position: fixed;
  right: 18px;
  bottom: 18px;
  display: inline-flex;
  gap: 6px;
  backdrop-filter: blur(8px) saturate(120%);
  -webkit-backdrop-filter: blur(8px) saturate(120%);
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 999px;
  padding: 6px;
  z-index: 9999;
  box-shadow: 0 6px 18px rgba(8,15,25,0.25);
  align-items: center;
  user-select: none;
  font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  font-size: 13px;
  color: var(--color-text, #fff);
  transition: transform .12s ease, background .12s ease;
}
.lang-switcher:active { transform: translateY(1px); }

.lang-switcher button.lang-btn {
  appearance: none;
  border: none;
  background: transparent;
  color: inherit;
  padding: 8px 10px;
  border-radius: 999px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: background .12s ease, color .12s ease;
  font-weight: 600;
  letter-spacing: .2px;
}

.lang-switcher button.lang-btn:focus {
  outline: 2px solid rgba(255,255,255,0.12);
  outline-offset: 2px;
}

.lang-switcher button.lang-btn.active {
  background: linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.06));
  color: var(--color-accent, #ffdd57);
  box-shadow: 0 4px 12px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.02);
}

@media (max-width: 520px) {
  .lang-switcher { right: 12px; bottom: 12px; padding: 5px; font-size: 12px; }
}
</style>\n`;

const I18N_SCRIPT = `\n<script>
/* i18n client script injected by generate.js */
(function(){
  const translations = {
    'meta.title': { ua: "Rybezh — Робота кур'\u0115ром у Польщі", pl: 'Rybezh — Praca kurierem w Polsce' },
    'meta.description': { ua: "Актуальні вакансії кур'\u0115рів у містах Польщі. Робота з гнучким графіком, щоденними виплатами.", pl: 'Aktualne oferty pracy kuriera w miastach Polski. Praca na elastyczny grafik, codzienne wypłaty.' },
    'brand.name': { ua: 'Rybezh', pl: 'Rybezh' },
    'brand.tagline': { ua: "rybezh.site — робота кур'\u0115ром у Польщі", pl: 'rybezh.site — praca kurierem w Polsce' },
    'nav.home': { ua: 'Головна', pl: 'Strona główna' },
    'nav.apply': { ua: 'Подати заявку', pl: 'Złóż wniosek' },

    'hero.title': { ua: "Знайдіть роботу кур'\u0115ром у Польщі", pl: 'Znajdź pracę kurierem w Polsce' },
    'hero.lead': { ua: "Актуальні вакансії по містах: Варшава, Краків, Гданськ, Вроцлав, Познань. Гнучкий графік, щоденні виплати.", pl: 'Aktualne oferty pracy w miastach: Warszawa, Kraków, Gdańsk, Wrocław, Poznań. Elastyczny grafik, codzienne wypłaty.' },

    'search.sr': { ua: 'Пошук', pl: 'Szukaj' },
    'search.placeholder': { ua: 'Пошук за містом або типом роботи', pl: 'Szukaj według miasta lub rodzaju pracy' },
    'search.button': { ua: 'Знайти', pl: 'Znajdź' },

    'city.all': { ua: 'Всі міста', pl: 'Wszystkie miasta' },
    'city.warszawa': { ua: 'Варшава', pl: 'Warszawa' },
    'city.krakow': { ua: 'Краків', pl: 'Kraków' },
    'city.gdansk': { ua: 'Гданськ', pl: 'Gdańsk' },
    'city.wroclaw': { ua: 'Вроцлав', pl: 'Wrocław' },
    'city.poznan': { ua: 'Познань', pl: 'Poznań' },

    'jobs.cta': { ua: 'Деталі', pl: 'Szczegóły' },

    'cta.heading': { ua: 'Потрібна допомога з оформленням?', pl: 'Potrzebujesz pomocy z dokumentami?' },
    'cta.lead': { ua: 'Залиште заявку — ми допоможемо з документами та підбором роботи.', pl: 'Zostaw zgłoszenie — pomożemy z dokumentami i doborem pracy.' },
    'cta.button': { ua: 'Подати заявку', pl: 'Złóż wniosek' },

    'footer.copy': { ua: 'Всі права захищені.', pl: 'Wszelkie prawa zastrzeżone.' }
  };

  const DEFAULT_LANG = 'ua';
  const STORAGE_KEY = 'site_lang';

  function interpolateText(t) {
    if (typeof t !== 'string') return t;
    return t.replace(/\$\{year\}/g, String(new Date().getFullYear()));
  }

  function applyTranslations(lang) {
    if (!lang) lang = DEFAULT_LANG;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (!key) return;
      const dict = translations[key];
      if (!dict) return;
      const text = (dict[lang] !== undefined) ? dict[lang] : (dict[DEFAULT_LANG] || '');
      const attr = el.getAttribute('data-i18n-attr');
      if (attr) {
        try { el.setAttribute(attr, interpolateText(text)); } catch (e) { el.textContent = interpolateText(text); }
        return;
      }
      if (el.tagName === 'INPUT' && el.type === 'text') { el.placeholder = interpolateText(text); return; }
      if (el.tagName === 'OPTION') { el.textContent = interpolateText(text); return; }
      if (el.tagName === 'TITLE' || (el.parentElement && el.parentElement.tagName === 'HEAD')) { document.title = interpolateText(text); el.textContent = interpolateText(text); return; }
      el.textContent = interpolateText(text);
    });
    if (translations['meta.title']) {
      const t = translations['meta.title'][lang] || translations['meta.title'][DEFAULT_LANG];
      if (t) document.title = interpolateText(t);
    }
    document.querySelectorAll('.lang-btn').forEach(btn => {
      if (btn.getAttribute('data-lang') === lang) btn.classList.add('active'); else btn.classList.remove('active');
    });
    const htmlLang = (lang === 'pl') ? 'pl' : 'uk';
    document.documentElement.lang = htmlLang;
  }

  function setLanguage(lang) { if (!lang) return; localStorage.setItem(STORAGE_KEY, lang); applyTranslations(lang); }

  document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    applyTranslations(saved);
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => { const lang = btn.getAttribute('data-lang'); setLanguage(lang); });
    });
  });
})();
</script>\n`;

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
    // write styles and append nothing (we inject i18n style separately)
    await fs.writeFile(path.join(DIST, 'styles.css'), styles, 'utf8');
  } catch (e) {
    // no styles provided, continue
  }

  // copy static pages
  const staticPages = ['apply.html', 'about.html', 'contact.html'];
  for (const p of staticPages) {
    try {
      let pContent = await fs.readFile(path.join(SRC, p), 'utf8');
      pContent = pContent.replace(/\$\{new Date\(\)\.getFullYear\(\)\}/g, String(new Date().getFullYear()));
      // inject styles and script before </body>
      if (pContent.includes('</body>')) {
        pContent = pContent.replace('</body>', `${I18N_STYLE}${I18N_SCRIPT}</body>`);
      } else {
        pContent += I18N_STYLE + I18N_SCRIPT;
      }
      await fs.writeFile(path.join(DIST, p), pContent, 'utf8');
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

    // inject i18n attributes into the generated page where applicable by adding lang switcher and script
    let finalHtml = html.replace(/\$\{new Date\(\)\.getFullYear\(\)}/g, String(new Date().getFullYear()));
    // ensure CTA has data-i18n if present
    finalHtml = finalHtml.replace(/(<a[^>]*class="?card-cta"?[^>]*>)([\s\S]*?)(<\/a>)/gi, function(m, open, inner, close) {
      if (/data-i18n/.test(open)) return m;
      return open.replace(/>$/, ' data-i18n="jobs.cta">') + (inner || '') + close;
    });

    // inject lang switcher and scripts before </body>
    if (finalHtml.includes('</body>')) {
      // add switcher markup + style+script
      const switcher = `\n<div id="lang-switcher" class="lang-switcher" aria-hidden="false" aria-label="Language switcher">\n  <button class="lang-btn" data-lang="ua" id="lang-ua">UA</button>\n  <button class="lang-btn" data-lang="pl" id="lang-pl">PL</button>\n</div>\n`;
      finalHtml = finalHtml.replace('</body>', `${switcher}${I18N_STYLE}${I18N_SCRIPT}</body>`);
    } else {
      finalHtml += `\n<div id="lang-switcher" class="lang-switcher" aria-hidden="false" aria-label="Language switcher">\n  <button class="lang-btn" data-lang="ua" id="lang-ua">UA</button>\n  <button class="lang-btn" data-lang="pl" id="lang-pl">PL</button>\n</div>` + I18N_STYLE + I18N_SCRIPT;
    }

    const outFile = path.join(DIST, \
`${page.slug}.html`);
    await fs.writeFile(outFile, finalHtml, 'utf8');
    links.push({ title: page.title, slug: page.slug, city: page.city || '' });
  }

    // generate index
    const indexContent = generateIndexContent(links);
    let indexHtml = pageTpl
      .replace(/{{TITLE}}/g, "Rybezh — Робота кур'єром у Польщі")
      .replace(/{{DESCRIPTION}}/g, "Актуальні вакансії кур'єрів у містах Польщі. Робота з гнучким графіком, щоденними виплатами та підтримкою.")
      .replace(/{{CONTENT}}/g, indexContent)
      .replace(/{{CANONICAL}}/g, "https://rybezh.site/")
      .replace(/\$\{new Date\(\)\.getFullYear\(\)\}/g, String(new Date().getFullYear()));
    
    // inject i18n into index
    if (indexHtml.includes('</body>')) {
      const switcher = `\n<div id="lang-switcher" class="lang-switcher" aria-hidden="false" aria-label="Language switcher">\n  <button class="lang-btn" data-lang="ua" id="lang-ua">UA</button>\n  <button class="lang-btn" data-lang="pl" id="lang-pl">PL</button>\n</div>\n`;
      indexHtml = indexHtml.replace('</body>', `${switcher}${I18N_STYLE}${I18N_SCRIPT}</body>`);
    } else {
      indexHtml += I18N_STYLE + I18N_SCRIPT;
    }

    await fs.writeFile(path.join(DIST, 'index.html'), indexHtml, 'utf8');

    // write sitemap.xml
    try {
      const sitemap = generateSitemap(links);
      await fs.writeFile(path.join(DIST, 'sitemap.xml'), sitemap, 'utf8');
    } catch (e) {}

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