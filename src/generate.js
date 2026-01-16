import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC = path.join(__dirname);
const TEMPLATES = path.join(SRC, 'templates');
const DIST = path.join(process.cwd(), 'dist');

const I18N_SCRIPT = `\n<script>
/* i18n client script injected by generate.js */
(function(extraTranslations){
  const translations = {
    'meta.title': { ua: "Rybezh — Робота кур'\u0115ром у Польщі", pl: 'Rybezh — Praca kurierem w Polsce' },
    'meta.description': { ua: "Актуальні вакансії кур'\u0115рів у містах Польщі. Робота з гнучким графіком, щоденними виплатами.", pl: 'Aktualne oferty pracy kuriera w miastach Polski. Praca na elastyczny grafik, codzienne wypłaty.' },
    'brand.name': { ua: 'Rybezh', pl: 'Rybezh' },
    'brand.tagline': { ua: "rybezh.site — робота кур'\u0115ром у Польщі", pl: 'rybezh.site — praca kurierem w Polsce' },
    
    // Navigation
    'nav.home': { ua: 'Головна', pl: 'Strona główna' },
    'nav.jobs': { ua: 'Вакансії', pl: 'Oferty pracy' },
    'nav.about': { ua: 'Про нас', pl: 'O nas' },
    'nav.contact': { ua: 'Контакти', pl: 'Kontakt' },
    'nav.cta': { ua: 'Отримати консультацію', pl: 'Uzyskaj konsultację' },
    'nav.apply': { ua: 'Подати заявку', pl: 'Złóż wniosek' },

    // Index / Hero
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

    // Index / Bottom CTA
    'cta.heading': { ua: 'Потрібна допомога з оформленням?', pl: 'Potrzebujesz pomocy z dokumentami?' },
    'cta.lead': { ua: 'Залиште заявку — ми допоможемо з документами та підбором роботи.', pl: 'Zostaw zgłoszenie — pomożemy z dokumentami i doborem pracy.' },
    'cta.ready': { ua: 'Готові почати?', pl: 'Gotowy, by zacząć?' },
    'cta.sub': { ua: 'Отримайте консультацію та почніть заробляти вже сьогодні.', pl: 'Uzyskaj konsultację i zacznij zarabiać już dziś.' },
    'cta.button': { ua: 'Подати заявку', pl: 'Złóż wniosek' },

    // Footer
    'footer.rights': { ua: 'Всі права захищені.', pl: 'Wszelkie prawa zastrzeżone.' },
    'footer.privacy': { ua: 'Політика конфіденційності', pl: 'Polityka prywatności' },

    // Apply Page
    'apply.title': { ua: 'Швидка заявка', pl: 'Szybka aplikacja' },
    'apply.intro': { ua: 'Кілька полів — і ми підберемо варіанти роботи та допоможемо з документами.', pl: 'Kilka pól — i dobierzemy oferty pracy oraz pomożemy z dokumentami.' },
    'label.name': { ua: "Ім'я", pl: 'Imię' },
    'label.contact': { ua: 'Телефон або email', pl: 'Telefon lub email' },
    'label.city': { ua: 'Місто', pl: 'Miasto' },
    'label.start': { ua: 'Готовий почати', pl: 'Gotowy do startu' },
    'label.exp': { ua: 'Досвід (коротко)', pl: 'Doświadczenie (krótko)' },
    'label.message': { ua: 'Додаткова інформація', pl: 'Dodatkowe informacje' },
    'label.consent': { ua: 'Я погоджуюсь на обробку моїх контактних даних', pl: 'Wyrażam zgodę na przetwarzanie moich danych kontaktowych' },
    'btn.submit': { ua: 'Надіслати заявку', pl: 'Wyślij zgłoszenie' },
    'btn.clear': { ua: 'Очистити', pl: 'Wyczyść' },
    'aside.help': { ua: 'Потрібна допомога?', pl: 'Potrzebujesz pomocy?' },
    'aside.text': { ua: 'Ми допомагаємо з документами, легалізацією та підбором вакансій. Заявки обробляємо протягом 24 годин.', pl: 'Pomagamy z dokumentami, legalizacją i doborem ofert. Zgłoszenia przetwarzamy w ciągu 24 godzin.' },
    'btn.back': { ua: 'Повернутись на головну', pl: 'Powrót na stronę główną' },
    'aside.contacts': { ua: 'Контакти', pl: 'Kontakt' },

    // About Page
    'about.title': { ua: 'Про нас', pl: 'O nas' },
    'about.text': { ua: "<strong>Rybezh</strong> — це команда професіоналів, яка допомагає українцям та іноземцям знайти стабільну роботу кур'єром у Польщі. Ми співпрацюємо з провідними логістичними компаніями та сервісами доставки їжі.", pl: "<strong>Rybezh</strong> to zespół profesjonalistów pomagający Ukraińcom i obcokrajowcom znaleźć stabilną pracę jako kurier w Polsce. Współpracujemy z wiodącymi firmami logistycznymi i serwisami dostawy jedzenia." },
    'about.mission': { ua: 'Наша місія', pl: 'Nasza misja' },
    'about.mission_text': { ua: 'Ми прагнемо зробити процес працевлаштування за кордоном простим, прозорим та безпечним. Ми надаємо повний супровід: від першої консультації до підписання договору та виходу на першу зміну.', pl: 'Dążymy do tego, aby proces zatrudnienia za granicą był prosty, przejrzysty i bezpieczny. Zapewniamy pełne wsparcie: od pierwszej konsultacji po podpisanie umowy i pierwszą zmianę.' },
    'about.why': { ua: 'Чому обирають нас', pl: 'Dlaczego my' },
    'about.why_text': { ua: 'Ми пропонуємо лише перевірені вакансії, допомагаємо з легалізацією та надаємо підтримку 24/7. З нами ви можете бути впевнені у своєму завтрашньому дні.', pl: 'Oferujemy tylko sprawdzone oferty pracy, pomagamy w legalizacji i zapewniamy wsparcie 24/7. Z nami możesz być pewny swojego jutra.' },

    // Contact Page
    'contact.title': { ua: 'Контакти', pl: 'Kontakt' },
    'contact.text': { ua: "Маєте запитання? Зв'яжіться з нами будь-яким зручним способом.", pl: 'Masz pytania? Skontaktuj się z nami w dowolny wygodny sposób.' },
    'contact.telegram': { ua: 'Написати в Telegram', pl: 'Napisz na Telegram' },

    // Privacy Page
    'privacy.title': { ua: 'Політика конфіденційності', pl: 'Polityka prywatności' },
    'privacy.text': { ua: '<h2>1. Загальні положення</h2><p>Ця Політика конфіденційності визначає порядок отримання, зберігання, обробки, використання і розкриття персональних даних користувача. Ми поважаємо вашу конфіденційність і зобов\'язуємося захищати ваші персональні дані.</p><h2>2. Збір даних</h2><p>Ми можемо збирати наступні дані: ім\'я, прізвище, номер телефону, адреса електронної пошти, місто проживання, інформація про досвід роботи. Ці дані надаються вами добровільно при заповненні форм на сайті.</p><h2>3. Використання даних</h2><p>Зібрані дані використовуються для: зв\'язку з вами, надання консультацій щодо працевлаштування, підбору вакансій, покращення роботи нашого сервісу.</p><h2>4. Захист даних</h2><p>Ми вживаємо всіх необхідних технічних та організаційних заходів для захисту ваших даних від несанкціонованого доступу, втрати або зміни.</p><h2>5. Файли Cookie</h2><p>Наш сайт використовує файли cookie для покращення взаємодії з користувачем. Ви можете налаштувати свій браузер для відмови від cookie, але це може вплинути на функціональність сайту.</p><h2>6. Ваші права</h2><p>Ви маєте право на доступ до своїх даних, їх виправлення або видалення. Для цього зв\'яжіться з нами через контактні дані на сайті.</p>', pl: '<h2>1. Postanowienia ogólne</h2><p>Niniejsza Polityka prywatności określa zasady gromadzenia, przechowywania, przetwarzania, wykorzystywania i ujawniania danych osobowych użytkownika. Szanujemy Twoją prywatność i zobowiązujemy się do ochrony Twoich danych osobowych.</p><h2>2. Gromadzenie danych</h2><p>Możemy gromadzić następujące dane: imię, nazwisko, numer telefonu, adres e-mail, miasto zamieszkania, informacje o doświadczeniu zawodowym. Dane te są podawane dobrowolnie podczas wypełniania formularzy na stronie.</p><h2>3. Wykorzystanie danych</h2><p>Zgromadzone dane są wykorzystywane do: kontaktu z Tobą, udzielania konsultacji w sprawie zatrudnienia, doboru ofert pracy, ulepszania działania naszego serwisu.</p><h2>4. Ochrona danych</h2><p>Podejmujemy wszelkie niezbędne środki techniczne i organizacyjne w celu ochrony Twoich danych przed nieautoryzowanym dostępem, utratą lub zmianą.</p><h2>5. Pliki Cookie</h2><p>Nasza strona używa plików cookie w celu poprawy doświadczeń użytkownika. Możesz skonfigurować swoją przeglądarkę, aby odrzucała pliki cookie, ale może to wpłynąć na funkcjonalność strony.</p><h2>6. Twoje prawa</h2><p>Masz prawo do dostępu do swoich danych, ich poprawiania lub usunięcia. W tym celu skontaktuj się z nami za pośrednictwem danych kontaktowych na stronie.</p>' },

    // Cookie Banner
    'cookie.banner.text': { ua: 'Ми використовуємо файли cookie для покращення вашого досвіду. Залишаючись на сайті, ви погоджуєтесь на їх використання.', pl: 'Używamy plików cookie, aby poprawić Twoje wrażenia. Pozostając na stronie, zgadzasz się na ich użycie.' },
    'cookie.banner.accept': { ua: 'Прийняти', pl: 'Akceptuj' }
  };

  // Merge extra translations (jobs)
  if(extraTranslations) Object.assign(translations, extraTranslations);

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
      el.innerHTML = interpolateText(text);
    });
    // Handle block content toggling
    document.querySelectorAll('[data-lang-content]').forEach(el => {
      if (el.getAttribute('data-lang-content') === lang) {
        el.style.display = '';
      } else {
        el.style.display = 'none';
      }
    });
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
})(__EXTRA_TRANSLATIONS__);
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

  // Prepare dynamic translations for jobs
  const jobTranslations = {};
  pages.forEach(p => {
    jobTranslations[`job.${p.slug}.title`] = { ua: p.title, pl: p.title_pl || p.title };
    jobTranslations[`job.${p.slug}.excerpt`] = { ua: p.excerpt, pl: p.excerpt_pl || p.excerpt };
    jobTranslations[`job.${p.slug}.cta`] = { ua: p.cta_text || 'Подати заявку', pl: p.cta_text_pl || 'Złóż wniosek' };
  });
  
  // Prepare script with injected translations
  const scriptWithData = I18N_SCRIPT.replace('__EXTRA_TRANSLATIONS__', JSON.stringify(jobTranslations));

  // copy static pages
  const staticPages = ['apply.html', 'about.html', 'contact.html', 'privacy.html'];
  for (const p of staticPages) {
    try {
      let pContent = await fs.readFile(path.join(SRC, p), 'utf8');
      pContent = pContent.replace(/\$\{new Date\(\)\.getFullYear\(\)\}/g, String(new Date().getFullYear()));
      // inject styles and script before </body>
      if (pContent.includes('</body>')) {
        pContent = pContent.replace('</body>', `${scriptWithData}</body>`);
      } else {
        pContent += scriptWithData;
      }
      await fs.writeFile(path.join(DIST, p), pContent, 'utf8');
    } catch (e) {}
  }

  const links = [];
  for (const page of pages) {
    const tpl = pageTpl;
    const description = page.excerpt || page.description || '';
    const content = page.body || page.content || page.excerpt || '';
    const contentPl = page.body_pl || page.body || '';

    // Wrap content in language toggles
    const dualContent = `<div data-lang-content="ua">${content}</div><div data-lang-content="pl" style="display:none">${contentPl}</div>`;

    const html = tpl
      .replace(/{{TITLE}}/g, escapeHtml(page.title || ''))
      .replace(/{{DESCRIPTION}}/g, escapeHtml(description))
      .replace(/{{CONTENT}}/g, dualContent)
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
    
    // Add data-i18n to H1 and Title
    finalHtml = finalHtml.replace('<title>', `<title data-i18n="job.${page.slug}.title">`);
    // Replace H1 content with data-i18n span, or add attribute if simple
    finalHtml = finalHtml.replace(/<h1>(.*?)<\/h1>/, `<h1 data-i18n="job.${page.slug}.title">$1</h1>`);

    // inject lang switcher and scripts before </body>
    if (finalHtml.includes('</body>')) {
      // add script
      finalHtml = finalHtml.replace('</body>', `${scriptWithData}</body>`);
    } else {
      finalHtml += scriptWithData;
    }

    const outFile = path.join(DIST, `${page.slug}.html`);
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
    
    // Inject data-i18n into index title and description
    indexHtml = indexHtml.replace('<title>', '<title data-i18n="meta.title">');
    indexHtml = indexHtml.replace('<meta name="description" content="', '<meta name="description" data-i18n="meta.description" data-i18n-attr="content" content="');

    // inject i18n into index
    if (indexHtml.includes('</body>')) {
      indexHtml = indexHtml.replace('</body>', `${scriptWithData}</body>`);
    } else {
      indexHtml += scriptWithData;
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
  const cityMap = {
    'Варшава': 'city.warszawa',
    'Краків': 'city.krakow',
    'Гданськ': 'city.gdansk',
    'Вроцлав': 'city.wroclaw',
    'Познань': 'city.poznan'
  };

  const cards = links.map(l => {
    const cityAttr = escapeHtml(l.city || '');
    const cityKey = cityMap[l.city];
    const cityDisplay = cityKey ? `<span data-i18n="${cityKey}">${cityAttr}</span>` : cityAttr;
    return `    <div class="job-card" data-city="${cityAttr}">
      <h3><a href="./${l.slug}.html" data-i18n="job.${l.slug}.title">${escapeHtml(l.title)}</a></h3>
      <p class="muted">${cityDisplay}</p>
      <a class="card-cta" href="./${l.slug}.html" data-i18n="jobs.cta">Деталі</a>
    </div>`;
  }).join('\n');

  return `
    <p class="lead" style="text-align:center; margin-bottom:2rem; color:var(--color-secondary);" data-i18n="hero.lead">Актуальні вакансії по містах: Варшава, Краків, Гданськ, Вроцлав, Познань. Гнучкий графік, щоденні виплати.</p>
    <form class="search-form" action="/" method="get" aria-label="Фільтр вакансій">
      <label class="sr-only" for="q" data-i18n="search.sr">Пошук</label>
      <input id="q" name="q" placeholder="Пошук за містом або типом роботи" aria-label="Пошук вакансій" data-i18n="search.placeholder" data-i18n-attr="placeholder" />
      <select id="city" name="city" aria-label="Вибір міста">
        <option value="" data-i18n="city.all">Всі міста</option>
        <option value="Варшава" data-i18n="city.warszawa">Варшава</option>
        <option value="Краків" data-i18n="city.krakow">Краків</option>
        <option value="Гданськ" data-i18n="city.gdansk">Гданськ</option>
        <option value="Вроцлав" data-i18n="city.wroclaw">Вроцлав</option>
        <option value="Познань" data-i18n="city.poznan">Познань</option>
      </select>
      <button type="submit" data-i18n="search.button">Знайти</button>
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