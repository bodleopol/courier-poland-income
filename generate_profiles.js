import fs from 'fs';
import path from 'path';

const SPECIALISTS_FILE = 'src/specialists.json';
const STARTUPS_FILE = 'src/startups.json';
const PAGES_DIR = 'src/pages';
const PROFILES_DIR = path.join(PAGES_DIR, 'profiles');
const BASE_URL = 'https://rybezh.site/';
const langs = ['uk', 'en', 'es', 'ru'];
/** Add `src/assets/images/maria-rubezh-founder.webp` (or .jpg) for the founder photo; until then the onerror handler shows initials. */
const FOUNDER_IMAGE = 'assets/images/maria-rubezh-founder.webp';

const tr = {
  uk: {
    siteTitle: 'Rybezh.site — каталог спеціалістів і стартапів',
    siteDescription: 'Редакційний довідник Rybezh.site: інженери, керівники, операції та технологічні компанії — з фото, структурою профілю та чіткими правилами публікації.',
    heroEyebrow: 'Rybezh.site · редакційний каталог',
    heroTitle: 'Каталог людей і компаній, з яким зручно працювати рекрутерам і командам',
    heroText: 'Ми збираємо профілі так, щоб було видно роль, географію, фокус і факти карʼєри — без «води» й без прихованих SEO-блоків. Це довідник для тих, хто швидко звіряє контекст: HR, засновники, інвестори й операційні лідери.',
    heroPrimary: 'Переглянути базу спеціалістів',
    heroSecondary: 'Сторінка стартапів',
    heroPhotoStrip: 'Фрагменти фото з профілів каталогу',
    featuredTitle: 'Рекомендовані профілі',
    featuredText: 'Кілька профілів, які добре показують спектр бази: від інженерії та продукту до операцій і керівних ролей.',
    sectorsTitle: 'Напрями, які ми покриваємо',
    sectorsText: 'Нам важливі ролі, де рішення приймають на основі систем, даних і командної координації — а не лише презентацій.',
    insightsTitle: 'Що змінилося на сайті',
    insightsText: 'Головна відокремлена від повного списку, стартапи винесені окремо, додані політики та сторінка методології — щоб зрозуміло, як ми публікуємо матеріали.',
    latestTitle: 'Останні додані профілі',
    latestText: 'Сучасні фахівці та керівники, переважно активні після 2000 року — з акцентом на технології, інженерію та бізнес-масштаб.',
    specialistsTitle: 'Уся база спеціалістів',
    specialistsText: 'Повний список з пошуком і фільтрами: можна швидко знайти людину за країною, напрямом або тегом.',
    startupsTitle: 'Окрема сторінка стартапів',
    startupsText: 'Компанії зібрані окремо, щоб не змішувати людей і продукти в одній стрічці й легше порівнювати контекст ринку.',
    standardsTitle: 'Редакційні стандарти та якість',
    standardsText: 'Жодних масових «порожніх» сторінок під пошук: у профілі є фото, роль, фокус і зрозумілий текст. Якщо дані застаріли — їх варто оновити через редакцію.',
    standardsPrimary: 'Перейти до методології',
    standardsSecondary: 'Політика конфіденційності',
    specialistsPageTitle: 'Каталог спеціалістів',
    specialistsPageIntro: 'Пошук по програмістах, інженерах, CTO, CEO, COO, дослідниках та операційних лідерах.',
    startupsPageTitle: 'Каталог стартапів',
    startupsPageIntro: 'Окрема сторінка для стартапів, продуктових компаній та технологічних платформ.',
    searchLabel: 'Пошук у каталозі',
    searchPlaceholder: 'Введіть імʼя, роль, країну або тег',
    searchHint: 'Шукайте за імʼям, роллю, країною, нішею або технологічним тегом.',
    filterAll: 'Усі напрями',
    resetFilters: 'Скинути',
    resultsLabel: 'Знайдено результатів',
    emptyState: 'Нічого не знайдено. Спробуйте інший запит або скиньте фільтр.',
    viewProfile: 'Відкрити профіль',
    viewStartup: 'Детальніше',
    viewAllSpecialists: 'Уся база',
    viewAllStartups: 'Усі стартапи',
    country: 'Країна / регіон',
    focus: 'Професійний фокус',
    knownFor: 'Ключовий внесок',
    biography: 'Професійний огляд',
    highlights: 'Ключові сильні сторони',
    gallery: 'Фото та підписи',
    relatedProfiles: 'Схожі профілі',
    editorialNoteTitle: 'Редакційна примітка',
    editorialNoteText: 'Профіль підготовлено як інформаційну редакційну сторінку з фокусом на професійний контекст, а не як SEO-двері чи автоматично згенерований лендінг.',
    founded: 'Засновано',
    profileBack: 'Назад до каталогу',
    methodologyTitle: 'Редакційна методологія',
    methodologyIntro: 'Rybezh.site — редакційна база: сторінки зʼявляються там, де є зміст для читача, а не заради ключових слів.',
    privacyTitle: 'Політика конфіденційності',
    privacyIntro: 'Ця сторінка пояснює, які технічні дані може обробляти статичний сайт та як ми працюємо з редакційними матеріалами.',
    cookiesTitle: 'Політика cookies',
    cookiesIntro: 'Сайт використовує лише базові технічні механізми для теми інтерфейсу та збереження вибору щодо cookies.',
    termsTitle: 'Умови використання',
    termsIntro: 'Каталог призначено для довідкового та редакційного використання. Він не є кадровою агенцією чи офертою.',
    languagesStat: 'Мови сайту',
    techProfilesStat: 'Технічні профілі',
    notFoundTitle: 'Сторінку не знайдено',
    notFoundText: 'Можливо, сторінку було перенесено або запитуваний профіль більше не підтримується.',
    notFoundPrimary: 'На головну',
    notFoundSecondary: 'До каталогу спеціалістів',
    siteByline: 'Rybezh.site',
    founderTrustTitle: 'Засновниця проєкту',
    founderTrustText: 'Каталог веде Марія Рубеж: редакційний фокус, перевірка фактів і єдиний тон матеріалів.',
    founderTrustAlt: 'Марія Рубеж, засновниця Rybezh.site',
    profileCTATitle: 'Звʼязок щодо цього профілю',
    profileCTAText: 'Рекрутери та операційні команди можуть написати на редакційну пошту — вкажіть компанію, роль і короткий контекст запиту.',
    profileCTALinkLabel: 'Написати на jobs.r@protonmail.com',
    trust: [
      'Кожен профіль з фото й структурою: роль, країна, фокус, біографія',
      'Окремі розділи для людей, стартапів і юридичних сторінок',
      'Чотири мови інтерфейсу: українська, англійська, іспанська, російська'
    ],
    sectors: [
      { title: 'Програмування', text: 'Backend, frontend, distributed systems, DevOps та developer tooling.' },
      { title: 'Інженерія', text: 'Hardware, systems engineering, reliability, infrastructure та space tech.' },
      { title: 'Керівники', text: 'CEO, COO, технічні директори, стратегія та масштабування компаній.' },
      { title: 'Штучний інтелект', text: 'Дослідники AI, product builders, safety, data та model platforms.' },
      { title: 'Операції', text: 'Польові процеси, SOPs, логістика, P&L, найм і стабільна якість сервісу.' },
      { title: 'Стартапи', text: 'Окремий каталог для продуктових компаній, інструментів і платформ.' }
    ],
    insightCards: [
      { title: 'Менше шуму в каталозі', text: 'Генератор не підставляє десятки однакових «тонких» профілів — кожна сторінка має сенс для читача.' },
      { title: 'Прозорі правила', text: 'Є сторінки privacy, cookies, terms і методологія — видно, як ми ставимося до даних і контенту.' },
      { title: 'Стартапи окремо', text: 'Компанії не змішані з людьми в одній стрічці: зручніше шукати й порівнювати.' },
      { title: 'Головна як вітрина', text: 'На головній — добірка й пояснення, а не нескінченний список під пошукові запити.' }
    ],
    methodologySections: [
      {
        title: '1. Редакційний фокус',
        body: 'Ми збираємо сторінки про спеціалістів і компанії як довідкову інформаційну базу. Пріоритет мають сучасні фахівці після 2000 року, насамперед програмісти, інженери, керівники та засновники технологічних бізнесів.'
      },
      {
        title: '2. Вимоги до профілю',
        body: 'Кожен профіль має містити імʼя, роль, фото, професійний фокус, ключовий внесок, коротку біографію та тематичні теги. Ми не публікуємо сторінки, що складаються лише з набору ключових слів або машинного шаблону без інформаційної цінності.'
      },
      {
        title: '3. Анти-doorway політика',
        body: 'Ми не використовуємо масові згенеровані doorway-сторінки, прихований текст, маніпулятивну перелінковку чи сторінки, створені тільки для трафіку з пошуку. Якщо сторінка не дає редакційної користі, вона не повинна існувати.'
      },
      {
        title: '4. Джерела та виправлення',
        body: 'Профілі спираються на публічно доступний професійний контекст, біографічні матеріали та подані редакції дані. Якщо профіль неточний або застарілий, його слід оновити або позначити для перегляду.'
      }
    ],
    privacySections: [
      {
        title: '1. Технічні дані',
        body: 'Статичний сайт може тимчасово обробляти стандартні технічні дані запиту, такі як IP-адреса, user agent і час доступу, якщо це потрібно хостингу або CDN для доставки сторінок і базової безпеки.'
      },
      {
        title: '2. Локальне збереження',
        body: 'У браузері зберігається лише мінімальна технічна інформація: вибір теми інтерфейсу та відповідь на cookie notice. Ці значення залишаються локально у вашому браузері й не використовуються для рекламного профілювання.'
      },
      {
        title: '3. Редакційні матеріали',
        body: 'Інформація в профілях публікується як редакційний довідковий контент. Якщо ви представляєте себе або компанію та хочете виправити дані, профіль має бути оновлений вручну через редакційний процес.'
      }
    ],
    cookiesSections: [
      {
        title: '1. Що ми використовуємо',
        body: 'Сайт використовує лише технічний механізм збереження теми інтерфейсу та вибору щодо cookies. Це не поведінкові рекламні cookies і не сторонній трекінг.'
      },
      {
        title: '2. Навіщо це потрібно',
        body: 'Збереження вибору теми робить інтерфейс стабільним між візитами, а збереження відповіді на cookie notice не показує банер повторно без потреби.'
      },
      {
        title: '3. Як відмовитися',
        body: 'Ви можете очистити localStorage у браузері або скористатися кнопкою відхилення в банері. Після цього сайт працюватиме і надалі, але тема та cookie choice не зберігатимуться.'
      }
    ],
    termsSections: [
      {
        title: '1. Характер сервісу',
        body: 'Rybezh.site — інформаційний каталог. Він не гарантує працевлаштування, інвестиції, партнерство чи комерційний результат від перегляду будь-якого профілю або сторінки стартапу.'
      },
      {
        title: '2. Точність даних',
        body: 'Ми намагаємося підтримувати профілі актуальними, але користувач повинен самостійно перевіряти критично важливі факти. Дані можуть змінюватися швидше, ніж оновлюється редакційна сторінка.'
      },
      {
        title: '3. Використання контенту',
        body: 'Матеріали сайту можна цитувати з посиланням на джерело. Не допускається автоматичне копіювання каталогу в повному обсязі для створення дзеркал або вторинних doorway-сайтів.'
      }
    ],
    startupFilters: {
      all: 'Усі категорії'
    },
    directorySort: 'Сортування',
    directorySortDefault: 'Як у каталозі',
    directorySortNewest: 'Спочатку новіші',
    directorySortAZ: 'За іменем A-Z',
    directoryFilterCountry: 'Країна',
    directoryFilterCountryAll: 'Усі країни',
    directoryFilterIndustry: 'Індустрія / напрям',
    directoryFilterIndustryAll: 'Усі напрями',
    directoryFilterYear: 'Рік заснування',
    directoryFilterYearAll: 'Усі роки',
    directoryShareHint: 'Фільтри й пошук зберігаються в адресі сторінки — можна поділитися посиланням.',
    methodologyFounderNote: {
      title: 'Редакція та засновниця',
      body: 'Каталог веде Марія Рубеж (Rybezh.site): ми вирівнюємо тон між мовами, перевіряємо факти там, де це можливо, і не публікуємо сторінки лише заради ключових слів.'
    }
  },
  en: {
    siteTitle: 'Rybezh.site — specialist and startup directory',
    siteDescription: 'Rybezh.site is an editorial directory of engineers, executives, operations leaders and technology companies — with photos, structured profiles and clear publishing rules.',
    heroEyebrow: 'Rybezh.site · editorial directory',
    heroTitle: 'A people-and-companies catalogue recruiters can actually use',
    heroText: 'Profiles are built so role, geography, focus and career facts read clearly — without filler copy or hidden SEO blocks. The site is a reference layer for HR teams, founders, investors and operators who need fast context.',
    heroPrimary: 'Browse specialists',
    heroSecondary: 'Explore startups',
    heroPhotoStrip: 'Sample photos from directory profiles',
    featuredTitle: 'Featured profiles',
    featuredText: 'A short list that shows the range of the archive: from engineering and product to operations and executive roles.',
    sectorsTitle: 'What the catalogue covers',
    sectorsText: 'We prioritise roles where decisions depend on systems, data and team coordination — not slide decks alone.',
    insightsTitle: 'What changed on the site',
    insightsText: 'The homepage is split from the full list, startups have their own section, and policy plus methodology pages explain how we publish.',
    latestTitle: 'Recently added profiles',
    latestText: 'Contemporary specialists and leaders, mostly active after 2000, with emphasis on technology, engineering and business scale.',
    specialistsTitle: 'Full specialist directory',
    specialistsText: 'The complete list with search and filters — find someone by country, sector or tag in a few clicks.',
    startupsTitle: 'Dedicated startups page',
    startupsText: 'Companies live on a separate route so people and products are not mixed in one endless feed.',
    standardsTitle: 'Editorial standards and quality controls',
    standardsText: 'No mass-produced empty pages for search traffic: every profile has a photo, role, focus and readable text. Outdated facts should be corrected through the editorial process.',
    standardsPrimary: 'Read methodology',
    standardsSecondary: 'Privacy policy',
    specialistsPageTitle: 'Specialist directory',
    specialistsPageIntro: 'Search programmers, engineers, CTOs, CEOs, COOs, researchers and operations leaders.',
    startupsPageTitle: 'Startup directory',
    startupsPageIntro: 'A dedicated page for startups, product companies and technology platforms.',
    searchLabel: 'Search the directory',
    searchPlaceholder: 'Type a name, role, country or tag',
    searchHint: 'Search by name, role, country, market segment or technology tag.',
    filterAll: 'All sectors',
    resetFilters: 'Reset',
    resultsLabel: 'Results found',
    emptyState: 'No matching entries found. Try another query or reset the filter.',
    viewProfile: 'Open profile',
    viewStartup: 'Learn more',
    viewAllSpecialists: 'View full directory',
    viewAllStartups: 'View all startups',
    country: 'Country / region',
    focus: 'Professional focus',
    knownFor: 'Known for',
    biography: 'Professional overview',
    highlights: 'Key strengths',
    gallery: 'Gallery',
    relatedProfiles: 'Related profiles',
    editorialNoteTitle: 'Editorial standards',
    editorialNoteText: 'This profile is manually reviewed and periodically updated to keep facts clear, useful and easy to verify.',
    founded: 'Founded',
    profileBack: 'Back to directory',
    methodologyTitle: 'Editorial methodology',
    methodologyIntro: 'Rybezh.site is an editorial knowledge base: pages exist where they help a reader, not only to chase keywords.',
    privacyTitle: 'Privacy policy',
    privacyIntro: 'This page explains which technical data may be processed by a static site and how editorial materials are handled.',
    cookiesTitle: 'Cookies policy',
    cookiesIntro: 'The site uses only basic technical storage for interface theme and the cookies notice choice.',
    termsTitle: 'Terms of use',
    termsIntro: 'The directory is intended for editorial and reference use. It is not a staffing agency or an offer.',
    languagesStat: 'Site languages',
    techProfilesStat: 'Tech profiles',
    notFoundTitle: 'Page not found',
    notFoundText: 'The page may have been moved or the requested profile is no longer maintained.',
    notFoundPrimary: 'Go to homepage',
    notFoundSecondary: 'Open specialist directory',
    siteByline: 'Rybezh.site',
    founderTrustTitle: 'Project founder',
    founderTrustText: 'Maria Rubezh leads the catalogue: editorial focus, fact-checking and a consistent voice across languages.',
    founderTrustAlt: 'Maria Rubezh, founder of Rybezh.site',
    profileCTATitle: 'Contact about this profile',
    profileCTAText: 'Recruiters and operations teams can email the editorial inbox — include company, role and a short context for the request.',
    profileCTALinkLabel: 'Email jobs.r@protonmail.com',
    trust: [
      'Every profile includes a photo plus structure: role, country, focus and biography',
      'Separate sections for people, startups and legal pages',
      'Four interface languages: Ukrainian, English, Spanish and Russian'
    ],
    sectors: [
      { title: 'Software', text: 'Backend, frontend, distributed systems, DevOps and developer tooling.' },
      { title: 'Engineering', text: 'Hardware, systems engineering, reliability, infrastructure and space tech.' },
      { title: 'Executives', text: 'CEO, COO, technical executives, strategy and company scaling.' },
      { title: 'Artificial intelligence', text: 'AI research, product builders, safety, data and model platforms.' },
      { title: 'Operations', text: 'Field execution, SOPs, logistics, P&L, hiring and reliable service quality.' },
      { title: 'Startups', text: 'A dedicated catalogue for product companies, tools and platforms.' }
    ],
    insightCards: [
      { title: 'Less catalogue noise', text: 'The generator does not mint dozens of identical thin profiles — each page should earn its place.' },
      { title: 'Clear rules', text: 'Privacy, cookies, terms and methodology explain how we handle data and content.' },
      { title: 'Startups on their own', text: 'Companies are not blended with people in one stream, which makes scanning easier.' },
      { title: 'Homepage as a showcase', text: 'The landing page introduces the archive instead of dumping an infinite SEO list.' }
    ],
    methodologySections: [
      {
        title: '1. Editorial scope',
        body: 'We publish specialist and company pages as a reference base. Priority goes to modern post-2000 professionals, especially programmers, engineers, executives and founders in technology-heavy sectors.'
      },
      {
        title: '2. Profile requirements',
        body: 'Each profile should include a name, role, photo, professional focus, key contribution, concise biography and thematic tags. Pages made only from keywords or machine-shaped filler copy do not belong here.'
      },
      {
        title: '3. Anti-doorway policy',
        body: 'We do not use mass-generated doorway pages, hidden text, manipulative internal linking or search pages that exist only to collect clicks. If a page has no editorial value, it should not be published.'
      },
      {
        title: '4. Sources and corrections',
        body: 'Profiles rely on public professional context, biographies and submitted editorial materials. If a profile becomes inaccurate or outdated, it should be reviewed, updated or removed.'
      }
    ],
    privacySections: [
      {
        title: '1. Technical data',
        body: 'A static site may temporarily process standard request metadata such as IP address, user agent and access time when this is needed by hosting or CDN infrastructure to deliver pages and provide basic security.'
      },
      {
        title: '2. Local storage',
        body: 'The browser stores only minimal technical preferences: interface theme and the response to the cookies notice. These values stay in your browser and are not used for advertising profiles.'
      },
      {
        title: '3. Editorial materials',
        body: 'Profile information is published as editorial reference content. If you represent yourself or a company and need a correction, the profile should be reviewed through a manual editorial update.'
      }
    ],
    cookiesSections: [
      {
        title: '1. What is used',
        body: 'The site uses only a technical storage mechanism for theme preference and cookies-notice choice. It is not behavioural advertising or third-party tracking.'
      },
      {
        title: '2. Why it is used',
        body: 'Saving theme preference keeps the interface stable between visits, while saving the notice choice prevents the banner from reappearing unnecessarily.'
      },
      {
        title: '3. How to opt out',
        body: 'You can clear localStorage in the browser or decline through the banner. The site will still work, but theme preference and cookies choice will not persist.'
      }
    ],
    termsSections: [
      {
        title: '1. Nature of the service',
        body: 'Rybezh.site is an informational directory. It does not guarantee employment, investment, partnerships or commercial outcomes from any profile or startup page.'
      },
      {
        title: '2. Accuracy of information',
        body: 'We try to keep profiles current, but readers should verify any critical facts independently. Real-world roles and companies can change faster than an editorial page is updated.'
      },
      {
        title: '3. Use of content',
        body: 'Site materials may be quoted with attribution. Automated full-copy mirroring of the catalogue to create clones or secondary doorway sites is not allowed.'
      }
    ],
    startupFilters: {
      all: 'All categories'
    },
    directorySort: 'Sort',
    directorySortDefault: 'Catalog order',
    directorySortNewest: 'Newest first',
    directorySortAZ: 'Name A-Z',
    directoryFilterCountry: 'Country',
    directoryFilterCountryAll: 'All countries',
    directoryFilterIndustry: 'Industry',
    directoryFilterIndustryAll: 'All industries',
    directoryFilterYear: 'Founded year',
    directoryFilterYearAll: 'All years',
    directoryShareHint: 'Filters and search stay in the URL so you can share a link.',
    methodologyFounderNote: {
      title: 'Editorial voice',
      body: 'The catalogue is led by Maria Rubezh (Rybezh.site). We keep tone consistent across languages, verify facts where possible, and avoid publishing pages that exist only for keywords.'
    }
  },
  es: {
    siteTitle: 'Rybezh.site — directorio de especialistas y startups',
    siteDescription: 'Directorio editorial de Rybezh.site: ingenieros, ejecutivos, operaciones y compañías tecnológicas, con fotos, estructura clara y reglas de publicación explícitas.',
    heroEyebrow: 'Rybezh.site · directorio editorial',
    heroTitle: 'Un catálogo de personas y empresas pensado para reclutamiento y equipos',
    heroText: 'Armamos perfiles para que se entienda rol, geografía, foco y hechos de carrera — sin texto de relleno ni bloques SEO ocultos. Sirve como capa de contexto para reclutadores, fundadores, inversionistas y equipos de operaciones.',
    heroPrimary: 'Ver especialistas',
    heroSecondary: 'Explorar startups',
    heroPhotoStrip: 'Muestras de fotos de perfiles del directorio',
    featuredTitle: 'Perfiles destacados',
    featuredText: 'Una lista corta que muestra el espectro del archivo: de ingeniería y producto a operaciones y roles ejecutivos.',
    sectorsTitle: 'Qué cubre el catálogo',
    sectorsText: 'Priorizamos roles donde las decisiones dependen de sistemas, datos y coordinación de equipos — no solo de presentaciones.',
    insightsTitle: 'Qué cambió en el sitio',
    insightsText: 'La portada está separada del listado completo, las startups tienen su propia sección, y las páginas de políticas y metodología explican cómo publicamos.',
    latestTitle: 'Perfiles añadidos recientemente',
    latestText: 'Especialistas y líderes contemporáneos, en su mayoría activos después del 2000, con foco en tecnología, ingeniería y escala de negocio.',
    specialistsTitle: 'Directorio completo de especialistas',
    specialistsText: 'Lista completa con búsqueda y filtros: encuentra por país, sector o etiqueta en pocos clics.',
    startupsTitle: 'Página dedicada a startups',
    startupsText: 'Las compañías viven en otra ruta para no mezclar personas y productos en un solo flujo interminable.',
    standardsTitle: 'Estándares editoriales y control de calidad',
    standardsText: 'Sin páginas vacías masivas para tráfico de búsqueda: cada perfil trae foto, rol, foco y texto legible. Los datos desactualizados se corrigen por vía editorial.',
    standardsPrimary: 'Leer metodología',
    standardsSecondary: 'Política de privacidad',
    specialistsPageTitle: 'Directorio de especialistas',
    specialistsPageIntro: 'Busca programadores, ingenieros, CTO, CEO, COO, investigadores y líderes de operaciones.',
    startupsPageTitle: 'Directorio de startups',
    startupsPageIntro: 'Una página dedicada a startups, compañías de producto y plataformas tecnológicas.',
    searchLabel: 'Buscar en el directorio',
    searchPlaceholder: 'Escribe un nombre, rol, país o etiqueta',
    searchHint: 'Busca por nombre, rol, país, nicho o etiqueta tecnológica.',
    filterAll: 'Todos los sectores',
    resetFilters: 'Restablecer',
    resultsLabel: 'Resultados encontrados',
    emptyState: 'No se encontraron resultados. Prueba otra consulta o restablece el filtro.',
    viewProfile: 'Abrir perfil',
    viewStartup: 'Ver más',
    viewAllSpecialists: 'Ver directorio completo',
    viewAllStartups: 'Ver todas las startups',
    country: 'País / región',
    focus: 'Foco profesional',
    knownFor: 'Reconocido por',
    biography: 'Resumen profesional',
    highlights: 'Fortalezas clave',
    gallery: 'Galería',
    relatedProfiles: 'Perfiles relacionados',
    editorialNoteTitle: 'Nota editorial',
    editorialNoteText: 'Este perfil se revisa manualmente y se actualiza de forma periódica para mantener datos claros y verificables.',
    founded: 'Fundada',
    profileBack: 'Volver al directorio',
    methodologyTitle: 'Metodología editorial',
    methodologyIntro: 'Rybezh.site es una base editorial: las páginas existen cuando aportan al lector, no solo para perseguir keywords.',
    privacyTitle: 'Política de privacidad',
    privacyIntro: 'Esta página explica qué datos técnicos puede procesar un sitio estático y cómo se gestionan los materiales editoriales.',
    cookiesTitle: 'Política de cookies',
    cookiesIntro: 'El sitio utiliza solo almacenamiento técnico básico para el tema de la interfaz y la elección del aviso de cookies.',
    termsTitle: 'Términos de uso',
    termsIntro: 'El directorio está pensado para uso editorial y de referencia. No es una agencia de contratación ni una oferta.',
    languagesStat: 'Idiomas del sitio',
    techProfilesStat: 'Perfiles técnicos',
    notFoundTitle: 'Página no encontrada',
    notFoundText: 'La página puede haber sido movida o el perfil solicitado ya no está disponible.',
    notFoundPrimary: 'Ir a la portada',
    notFoundSecondary: 'Abrir directorio de especialistas',
    siteByline: 'Rybezh.site',
    founderTrustTitle: 'Fundadora del proyecto',
    founderTrustText: 'María Rubezh dirige el catálogo: foco editorial, verificación de hechos y tono coherente entre idiomas.',
    founderTrustAlt: 'María Rubezh, fundadora de Rybezh.site',
    profileCTATitle: 'Contacto sobre este perfil',
    profileCTAText: 'Reclutadores y equipos de operaciones pueden escribir al correo editorial — indica empresa, rol y un contexto breve del pedido.',
    profileCTALinkLabel: 'Escribir a jobs.r@protonmail.com',
    trust: [
      'Cada perfil incluye foto y estructura: rol, país, foco y biografía',
      'Secciones separadas para personas, startups y páginas legales',
      'Cuatro idiomas de interfaz: ucraniano, inglés, español y ruso'
    ],
    sectors: [
      { title: 'Software', text: 'Backend, frontend, sistemas distribuidos, DevOps y herramientas para desarrolladores.' },
      { title: 'Ingeniería', text: 'Hardware, systems engineering, reliability, infrastructure y space tech.' },
      { title: 'Ejecutivos', text: 'CEO, COO, directivos técnicos, estrategia y escalado de compañías.' },
      { title: 'Inteligencia artificial', text: 'Investigación en IA, product builders, safety, data y plataformas de modelos.' },
      { title: 'Operaciones', text: 'Ejecución en campo, SOPs, logística, P&L, contratación y calidad de servicio estable.' },
      { title: 'Startups', text: 'Un catálogo dedicado a compañías de producto, herramientas y plataformas.' }
    ],
    insightCards: [
      { title: 'Menos ruido en el catálogo', text: 'El generador no crea decenas de perfiles thin idénticos: cada página debe justificar su existencia.' },
      { title: 'Reglas claras', text: 'Privacidad, cookies, términos y metodología explican cómo tratamos datos y contenido.' },
      { title: 'Startups aparte', text: 'Las compañías no se mezclan con personas en un solo listado, lo que facilita el escaneo.' },
      { title: 'Portada como escaparate', text: 'La landing presenta el archivo en lugar de volcar una lista SEO interminable.' }
    ],
    methodologySections: [
      {
        title: '1. Alcance editorial',
        body: 'Publicamos páginas sobre especialistas y compañías como una base de referencia. La prioridad va a profesionales contemporáneos posteriores al año 2000, especialmente programadores, ingenieros, ejecutivos y fundadores en sectores tecnológicos.'
      },
      {
        title: '2. Requisitos del perfil',
        body: 'Cada perfil debe incluir nombre, rol, foto, foco profesional, aporte clave, biografía breve y etiquetas temáticas. Las páginas construidas solo con keywords o texto de relleno generado por máquina no pertenecen aquí.'
      },
      {
        title: '3. Política anti-doorway',
        body: 'No usamos doorway pages generadas en masa, texto oculto, enlazado interno manipulativo ni páginas creadas solo para capturar clics desde buscadores. Si una página no aporta valor editorial, no debe publicarse.'
      },
      {
        title: '4. Fuentes y correcciones',
        body: 'Los perfiles se basan en contexto profesional público, biografías y materiales editoriales aportados. Si un perfil se vuelve inexacto o desactualizado, debe revisarse, actualizarse o retirarse.'
      }
    ],
    privacySections: [
      {
        title: '1. Datos técnicos',
        body: 'Un sitio estático puede procesar temporalmente metadatos estándar de la solicitud, como IP, user agent y hora de acceso, cuando esto es necesario para el hosting o la CDN a fin de entregar páginas y dar seguridad básica.'
      },
      {
        title: '2. Almacenamiento local',
        body: 'El navegador guarda solo preferencias técnicas mínimas: el tema de la interfaz y la respuesta al aviso de cookies. Estos valores permanecen en tu navegador y no se usan para perfiles publicitarios.'
      },
      {
        title: '3. Materiales editoriales',
        body: 'La información de los perfiles se publica como contenido editorial de referencia. Si representas a una persona o compañía y necesitas una corrección, el perfil debe revisarse mediante una actualización editorial manual.'
      }
    ],
    cookiesSections: [
      {
        title: '1. Qué se usa',
        body: 'El sitio usa solo un mecanismo técnico de almacenamiento para la preferencia del tema y la elección del aviso de cookies. No es publicidad comportamental ni tracking de terceros.'
      },
      {
        title: '2. Por qué se usa',
        body: 'Guardar la preferencia del tema mantiene estable la interfaz entre visitas, mientras que guardar la respuesta al aviso evita que el banner reaparezca innecesariamente.'
      },
      {
        title: '3. Cómo rechazarlo',
        body: 'Puedes borrar localStorage en el navegador o rechazarlo desde el banner. El sitio seguirá funcionando, pero la preferencia de tema y la elección sobre cookies no persistirán.'
      }
    ],
    termsSections: [
      {
        title: '1. Naturaleza del servicio',
        body: 'Rybezh.site es un directorio informativo. No garantiza empleo, inversión, alianzas ni resultados comerciales derivados de cualquier perfil o página de startup.'
      },
      {
        title: '2. Exactitud de la información',
        body: 'Intentamos mantener los perfiles actualizados, pero los lectores deben verificar de forma independiente cualquier dato crítico. Los roles y compañías reales pueden cambiar más rápido de lo que se actualiza una página editorial.'
      },
      {
        title: '3. Uso del contenido',
        body: 'Los materiales del sitio pueden citarse con atribución. No se permite copiar automáticamente todo el catálogo para crear clones o sitios doorway secundarios.'
      }
    ],
    startupFilters: {
      all: 'Todas las categorías'
    },
    directorySort: 'Ordenar',
    directorySortDefault: 'Orden del catálogo',
    directorySortNewest: 'Más recientes',
    directorySortAZ: 'Nombre A-Z',
    directoryFilterCountry: 'País',
    directoryFilterCountryAll: 'Todos los países',
    directoryFilterIndustry: 'Industria',
    directoryFilterIndustryAll: 'Todas las industrias',
    directoryFilterYear: 'Año de fundación',
    directoryFilterYearAll: 'Todos los años',
    directoryShareHint: 'Los filtros y la búsqueda se guardan en la URL para compartir el enlace.',
    methodologyFounderNote: {
      title: 'Quién revisa los textos',
      body: 'El catálogo lo coordina María Rubezh (Rybezh.site): alineamos el tono entre idiomas, verificamos hechos cuando es posible y no publicamos páginas pensadas solo para palabras clave.'
    }
  },
  ru: {
    siteTitle: 'Rybezh.site — каталог специалистов и стартапов',
    siteDescription: 'Редакционный справочник Rybezh.site: инженеры, руководители, операции и технологические компании — с фото, структурой профиля и понятными правилами публикации.',
    heroEyebrow: 'Rybezh.site · редакционный каталог',
    heroTitle: 'Справочник людей и компаний, с которым удобно работать рекрутерам и командам',
    heroText: 'Профили собраны так, чтобы сразу читались роль, география, фокус и факты карьеры — без «воды» и без скрытых SEO-блоков. Это справочный слой для HR, основателей, инвесторов и операционных лидеров, которым нужен быстрый контекст.',
    heroPrimary: 'Открыть базу специалистов',
    heroSecondary: 'Посмотреть стартапы',
    heroPhotoStrip: 'Фрагменты фото из профилей каталога',
    featuredTitle: 'Рекомендованные профили',
    featuredText: 'Небольшая подборка, которая показывает спектр базы: от инженерии и продукта до операций и руководящих ролей.',
    sectorsTitle: 'Какие направления покрывает каталог',
    sectorsText: 'Нам важны роли, где решения принимают на основе систем, данных и командной координации — а не только презентаций.',
    insightsTitle: 'Что изменилось на сайте',
    insightsText: 'Главная отделена от полного списка, стартапы вынесены отдельно, добавлены страницы политик и методологии — видно, как мы публикуем материалы.',
    latestTitle: 'Недавно добавленные профили',
    latestText: 'Современные специалисты и руководители, в основном активные после 2000 года — с акцентом на технологии, инженерию и масштаб бизнеса.',
    specialistsTitle: 'Полный каталог специалистов',
    specialistsText: 'Полный список с поиском и фильтрами: можно быстро найти человека по стране, направлению или тегу.',
    startupsTitle: 'Отдельная страница стартапов',
    startupsText: 'Компании собраны на отдельном маршруте, чтобы не смешивать людей и продукты в одной ленте и проще сравнивать контекст рынка.',
    standardsTitle: 'Редакционные стандарты и контроль качества',
    standardsText: 'Без массовых «пустых» страниц под поиск: у профиля есть фото, роль, фокус и читаемый текст. Устаревшие данные стоит обновлять через редакцию.',
    standardsPrimary: 'Открыть методологию',
    standardsSecondary: 'Политика конфиденциальности',
    specialistsPageTitle: 'Каталог специалистов',
    specialistsPageIntro: 'Поиск по программистам, инженерам, CTO, CEO, COO, исследователям и операционным лидерам.',
    startupsPageTitle: 'Каталог стартапов',
    startupsPageIntro: 'Отдельная страница для стартапов, продуктовых компаний и технологических платформ.',
    searchLabel: 'Поиск по каталогу',
    searchPlaceholder: 'Введите имя, роль, страну или тег',
    searchHint: 'Ищите по имени, роли, стране, рыночной нише или технологическому тегу.',
    filterAll: 'Все направления',
    resetFilters: 'Сбросить',
    resultsLabel: 'Найдено результатов',
    emptyState: 'Ничего не найдено. Попробуйте другой запрос или сбросьте фильтр.',
    viewProfile: 'Открыть профиль',
    viewStartup: 'Подробнее',
    viewAllSpecialists: 'Вся база',
    viewAllStartups: 'Все стартапы',
    country: 'Страна / регион',
    focus: 'Профессиональный фокус',
    knownFor: 'Ключевой вклад',
    biography: 'Профессиональный обзор',
    highlights: 'Ключевые сильные стороны',
    gallery: 'Галерея',
    relatedProfiles: 'Похожие профили',
    editorialNoteTitle: 'Редакционная заметка',
    editorialNoteText: 'Этот профиль проходит ручную редакторскую проверку и регулярно обновляется, чтобы данные оставались точными и полезными.',
    founded: 'Основано',
    profileBack: 'Назад в каталог',
    methodologyTitle: 'Редакционная методология',
    methodologyIntro: 'Rybezh.site — редакционная база: страницы появляются там, где есть смысл для читателя, а не ради ключевых слов.',
    privacyTitle: 'Политика конфиденциальности',
    privacyIntro: 'На этой странице объясняется, какие технические данные может обрабатывать статический сайт и как мы работаем с редакционными материалами.',
    cookiesTitle: 'Политика cookies',
    cookiesIntro: 'Сайт использует только базовое техническое хранилище для темы интерфейса и выбора по баннеру cookies.',
    termsTitle: 'Условия использования',
    termsIntro: 'Каталог предназначен для справочного и редакционного использования. Это не кадровое агентство и не оферта.',
    languagesStat: 'Языки сайта',
    techProfilesStat: 'Технические профили',
    notFoundTitle: 'Страница не найдена',
    notFoundText: 'Возможно, страница была перенесена или запрошенный профиль больше не поддерживается.',
    notFoundPrimary: 'На главную',
    notFoundSecondary: 'В каталог специалистов',
    siteByline: 'Rybezh.site',
    founderTrustTitle: 'Основательница проекта',
    founderTrustText: 'Каталог ведёт Мария Рубеж: редакционный фокус, проверка фактов и единый тон материалов.',
    founderTrustAlt: 'Мария Рубеж, основательница Rybezh.site',
    profileCTATitle: 'Связь по этому профилю',
    profileCTAText: 'Рекрутеры и операционные команды могут написать на редакционную почту — укажите компанию, роль и краткий контекст запроса.',
    profileCTALinkLabel: 'Написать на jobs.r@protonmail.com',
    trust: [
      'У каждого профиля есть фото и структура: роль, страна, фокус, биография',
      'Отдельные разделы для людей, стартапов и юридических страниц',
      'Четыре языка интерфейса: украинский, английский, испанский, русский'
    ],
    sectors: [
      { title: 'Программирование', text: 'Backend, frontend, distributed systems, DevOps и developer tooling.' },
      { title: 'Инженерия', text: 'Hardware, systems engineering, reliability, infrastructure и space tech.' },
      { title: 'Руководители', text: 'CEO, COO, технические директора, стратегия и масштабирование компаний.' },
      { title: 'Искусственный интеллект', text: 'AI research, product builders, safety, data и model platforms.' },
      { title: 'Операции', text: 'Полевые процессы, SOPs, логистика, P&L, найм и стабильное качество сервиса.' },
      { title: 'Стартапы', text: 'Отдельный каталог для продуктовых компаний, инструментов и платформ.' }
    ],
    insightCards: [
      { title: 'Меньше шума в каталоге', text: 'Генератор не подставляет десятки одинаковых «тонких» профилей — у каждой страницы должен быть смысл для читателя.' },
      { title: 'Прозрачные правила', text: 'Есть страницы privacy, cookies, terms и методология — видно, как мы относимся к данным и контенту.' },
      { title: 'Стартапы отдельно', text: 'Компании не смешаны с людьми в одной ленте — удобнее искать и сравнивать.' },
      { title: 'Главная как витрина', text: 'На главной — подборка и пояснение, а не бесконечный список под поисковые запросы.' }
    ],
    methodologySections: [
      {
        title: '1. Редакционный фокус',
        body: 'Мы публикуем страницы о специалистах и компаниях как справочную базу. Приоритет - современные профессионалы после 2000 года, особенно программисты, инженеры, руководители и основатели технологических бизнесов.'
      },
      {
        title: '2. Требования к профилю',
        body: 'Каждый профиль должен содержать имя, роль, фото, профессиональный фокус, ключевой вклад, краткую биографию и тематические теги. Страницы, состоящие только из ключевых слов или машинного шаблона без пользы, здесь не нужны.'
      },
      {
        title: '3. Anti-doorway политика',
        body: 'Мы не используем массово сгенерированные doorway-страницы, скрытый текст, манипулятивную перелинковку и страницы, существующие только ради поисковых кликов. Если страница не дает редакционной ценности, ее не должно быть.'
      },
      {
        title: '4. Источники и исправления',
        body: 'Профили опираются на публичный профессиональный контекст, биографические материалы и переданные редакции данные. Если профиль устарел или неточен, он должен быть пересмотрен, обновлен или снят с публикации.'
      }
    ],
    privacySections: [
      {
        title: '1. Технические данные',
        body: 'Статический сайт может временно обрабатывать стандартные метаданные запроса, такие как IP-адрес, user agent и время доступа, если это необходимо хостингу или CDN для доставки страниц и базовой безопасности.'
      },
      {
        title: '2. Локальное хранилище',
        body: 'В браузере сохраняются только минимальные технические настройки: тема интерфейса и ответ на баннер cookies. Эти значения остаются в вашем браузере и не используются для рекламного профилирования.'
      },
      {
        title: '3. Редакционные материалы',
        body: 'Информация в профилях публикуется как редакционный справочный контент. Если вы представляете себя или компанию и хотите исправить данные, профиль должен быть обновлен вручную через редакционный процесс.'
      }
    ],
    cookiesSections: [
      {
        title: '1. Что используется',
        body: 'Сайт использует только техническое хранилище для темы интерфейса и выбора по баннеру cookies. Это не поведенческая реклама и не сторонний трекинг.'
      },
      {
        title: '2. Зачем это нужно',
        body: 'Сохранение темы делает интерфейс стабильным между визитами, а сохранение ответа на баннер предотвращает его повторное появление без необходимости.'
      },
      {
        title: '3. Как отказаться',
        body: 'Вы можете очистить localStorage в браузере или выбрать отклонение в баннере. Сайт продолжит работать, но тема и выбор cookies не будут сохраняться.'
      }
    ],
    termsSections: [
      {
        title: '1. Характер сервиса',
        body: 'Rybezh.site — информационный каталог. Он не гарантирует трудоустройство, инвестиции, партнёрство или коммерческий результат от просмотра любого профиля или страницы стартапа.'
      },
      {
        title: '2. Точность информации',
        body: 'Мы стараемся поддерживать профили актуальными, но читатель должен самостоятельно проверять критически важные факты. Реальные роли и компании могут меняться быстрее, чем обновляется редакционная страница.'
      },
      {
        title: '3. Использование контента',
        body: 'Материалы сайта можно цитировать с указанием источника. Не допускается автоматическое полное копирование каталога для создания зеркал или вторичных doorway-сайтов.'
      }
    ],
    startupFilters: {
      all: 'Все категории'
    },
    directorySort: 'Сортировка',
    directorySortDefault: 'Как в каталоге',
    directorySortNewest: 'Сначала новые',
    directorySortAZ: 'По имени A-Z',
    directoryFilterCountry: 'Страна',
    directoryFilterCountryAll: 'Все страны',
    directoryFilterIndustry: 'Индустрия / направление',
    directoryFilterIndustryAll: 'Все направления',
    directoryFilterYear: 'Год основания',
    directoryFilterYearAll: 'Все годы',
    directoryShareHint: 'Фильтры и поиск сохраняются в адресе страницы — ссылку можно передать.',
    methodologyFounderNote: {
      title: 'Редакция и основательница',
      body: 'Каталог ведёт Мария Рубеж (Rybezh.site): выравниваем тон между языками, проверяем факты там, где это возможно, и не публикуем страницы только ради ключевых слов.'
    }
  }
};

const rubricOrder = ['software', 'engineering', 'operations', 'ceo', 'coo', 'ai', 'science', 'design', 'biotech', 'fintech', 'cloud', 'space'];
const rubricLabels = {
  software: { uk: 'Програмування', en: 'Software', es: 'Software', ru: 'Программирование' },
  engineering: { uk: 'Інженерія', en: 'Engineering', es: 'Ingeniería', ru: 'Инженерия' },
  operations: { uk: 'Операції', en: 'Operations', es: 'Operaciones', ru: 'Операции' },
  ceo: { uk: 'CEO', en: 'CEO', es: 'CEO', ru: 'CEO' },
  coo: { uk: 'COO', en: 'COO', es: 'COO', ru: 'COO' },
  ai: { uk: 'ШІ', en: 'AI', es: 'IA', ru: 'ИИ' },
  science: { uk: 'Наука', en: 'Science', es: 'Ciencia', ru: 'Наука' },
  design: { uk: 'Дизайн', en: 'Design', es: 'Diseño', ru: 'Дизайн' },
  biotech: { uk: 'Біотех', en: 'Biotech', es: 'Biotech', ru: 'Биотех' },
  fintech: { uk: 'Фінтех', en: 'Fintech', es: 'Fintech', ru: 'Финтех' },
  cloud: { uk: 'Хмара', en: 'Cloud', es: 'Cloud', ru: 'Облако' },
  space: { uk: 'Космос', en: 'Space', es: 'Espacio', ru: 'Космос' }
};
const startupLabels = {
  ai: { uk: 'ШІ', en: 'AI', es: 'IA', ru: 'ИИ' },
  fintech: { uk: 'Фінтех', en: 'Fintech', es: 'Fintech', ru: 'Финтех' },
  design: { uk: 'Дизайн', en: 'Design', es: 'Diseño', ru: 'Дизайн' },
  software: { uk: 'Софт', en: 'Software', es: 'Software', ru: 'Софт' },
  cloud: { uk: 'Хмара', en: 'Cloud', es: 'Cloud', ru: 'Облако' },
  hardware: { uk: 'Hardware', en: 'Hardware', es: 'Hardware', ru: 'Hardware' },
  operations: { uk: 'Операції', en: 'Operations', es: 'Operaciones', ru: 'Операции' }
};

const suffix = lang => (lang === 'uk' ? '' : `-${lang}`);
const pageName = (base, lang) => `${base}${suffix(lang)}.html`;
const escapeHtml = value => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');
const description = (text, max = 160) => {
  const clean = String(text ?? '').replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max - 1).trim()}...` : clean;
};
const fallback = alt => `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&size=720&background=eef4ff&color=2563eb&bold=true`;
const localProfileFallbacks = new Map([
  ['Emad Mostaque', 'assets/images/person-emad-mostaque-placeholder.svg'],
  ['Емад Мостак', 'assets/images/person-emad-mostaque-placeholder.svg'],
  ['Эмад Мостак', 'assets/images/person-emad-mostaque-placeholder.svg'],
  ['Patrick Brown', 'assets/images/person-patrick-brown-placeholder.svg'],
  ['Патрік Браун', 'assets/images/person-patrick-brown-placeholder.svg'],
  ['Патрик Браун', 'assets/images/person-patrick-brown-placeholder.svg']
]);
const resolveImage = (src, alt) => {
  const fallbackLocal = localProfileFallbacks.get(String(alt || '').trim());
  if (src && !String(src).includes('ui-avatars.com')) return src;
  return fallbackLocal || src || fallback(alt);
};
const image = (src, alt, className = '') => `<img src="${escapeHtml(resolveImage(src, alt))}" alt="${escapeHtml(alt)}"${className ? ` class="${className}"` : ''} loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${fallback(alt)}';">`;
function heroFacepile(specialists, lang) {
  const picks = specialists.filter(person => person.slug !== 'bohdan-tiutenko').slice(0, 5);
  if (!picks.length) return '';
  return `<div class="hero-facepile" aria-hidden="true">${picks.map(person => `<span class="hero-face">${image(person.image, person.name[lang], 'hero-avatar')}</span>`).join('')}</div>`;
}
const tagMarkup = (items = []) => `<div class="tags">${items.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}</div>`;

function clearGeneratedPages() {
  fs.mkdirSync(PAGES_DIR, { recursive: true });
  for (const entry of fs.readdirSync(PAGES_DIR, { withFileTypes: true })) {
    const fullPath = path.join(PAGES_DIR, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'profiles') fs.rmSync(fullPath, { recursive: true, force: true });
      continue;
    }
    if (/\.(html|xml)$/i.test(entry.name)) fs.rmSync(fullPath, { force: true });
  }
  fs.mkdirSync(PROFILES_DIR, { recursive: true });
}

function writePage(filename, html) {
  fs.writeFileSync(path.join(PAGES_DIR, filename), `${html.trim()}\n`);
}

function firstTagKey(entry) {
  const values = (entry.tags?.en || []).map(tag => tag.toLowerCase());
  return rubricOrder.find(key => values.some(tag => tag.includes(key.replace('-', ' ')) || tag.includes(key))) || 'operations';
}

function startupKey(company) {
  const values = (company.tags?.en || []).map(tag => tag.toLowerCase());
  return Object.keys(startupLabels).find(key => values.some(tag => tag.includes(key))) || 'software';
}

function filterButtons(keys, labels, lang, allLabel) {
  const items = [...new Set(keys)].filter(Boolean);
  return `<div class="filter-bar" data-directory-industry-chips><button class="filter-chip active" type="button" data-filter="all">${escapeHtml(allLabel)}</button>${items.map(key => `<button class="filter-chip" type="button" data-filter="${escapeHtml(key)}">${escapeHtml(labels[key]?.[lang] || key)}</button>`).join('')}</div>`;
}

function directorySortSelect(lang) {
  const l = tr[lang];
  return `<label class="directory-select-label">${escapeHtml(l.directorySort)}<select class="directory-select" data-directory-sort>
    <option value="default">${escapeHtml(l.directorySortDefault)}</option>
    <option value="newest">${escapeHtml(l.directorySortNewest)}</option>
    <option value="az">${escapeHtml(l.directorySortAZ)}</option>
  </select></label>`;
}

function directoryCountrySelect(lang, countries) {
  const l = tr[lang];
  const opts = [...new Set(countries.map(c => String(c || '').trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b, lang === 'uk' ? 'uk' : lang));
  return `<label class="directory-select-label">${escapeHtml(l.directoryFilterCountry)}<select class="directory-select" data-directory-country>
    <option value="">${escapeHtml(l.directoryFilterCountryAll)}</option>${opts.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('')}
  </select></label>`;
}

function directoryYearSelect(lang, years) {
  const l = tr[lang];
  const opts = [...new Set(years.map(y => String(y || '').trim()).filter(Boolean))].sort((a, b) => Number(b) - Number(a));
  return `<label class="directory-select-label">${escapeHtml(l.directoryFilterYear)}<select class="directory-select" data-directory-year>
    <option value="">${escapeHtml(l.directoryFilterYearAll)}</option>${opts.map(y => `<option value="${escapeHtml(y)}">${escapeHtml(y)}</option>`).join('')}
  </select></label>`;
}

function cardSearchValue(parts) {
  return parts.join(' ').toLowerCase();
}

function profileCard(person, lang, orderIndex = 0) {
  const rubric = firstTagKey(person);
  const countryLabel = String(person.country[lang] ?? '').trim();
  const haystack = cardSearchValue([person.name[lang], person.role[lang], countryLabel, ...(person.tags[lang] || []), ...(person.tags.en || [])]);
  return `<article class="card profile-card" data-directory-card data-filter-key="${escapeHtml(rubric)}" data-country="${escapeHtml(countryLabel)}" data-sort-name="${escapeHtml(person.name[lang])}" data-catalog-order="${orderIndex}" data-search="${escapeHtml(haystack)}">
    ${image(person.image, person.name[lang])}
    <div class="card-body">
      <p class="eyebrow">${escapeHtml(person.country[lang])}</p>
      <h3>${escapeHtml(person.name[lang])}</h3>
      <p class="meta">${escapeHtml(person.role[lang])}</p>
      ${tagMarkup(person.tags[lang].slice(0, 3))}
      <a class="btn" href="${pageName(`person-${person.slug}`, lang)}">${escapeHtml(tr[lang].viewProfile)}</a>
    </div>
  </article>`;
}

function startupCard(company, lang, orderIndex = 0) {
  const key = startupKey(company);
  const hqCountry = String(company.hqCountry?.[lang] ?? '').trim();
  const haystack = cardSearchValue([company.name, company.category[lang], company.summary[lang], ...(company.tags[lang] || []), ...(company.tags.en || [])]);
  return `<article class="card startup-card" data-directory-card data-filter-key="${escapeHtml(key)}" data-country="${escapeHtml(hqCountry)}" data-founded="${escapeHtml(company.founded)}" data-sort-name="${escapeHtml(company.name)}" data-catalog-order="${orderIndex}" data-search="${escapeHtml(haystack)}">
    ${image(company.image, company.name)}
    <div class="card-body">
      <p class="eyebrow">${escapeHtml(tr[lang].founded)} ${escapeHtml(company.founded)}</p>
      <h3>${escapeHtml(company.name)}</h3>
      <p class="meta">${escapeHtml(company.category[lang])}</p>
      <p>${escapeHtml(company.summary[lang])}</p>
      ${tagMarkup(company.tags[lang].slice(0, 3))}
      <a class="btn" href="${pageName(`startup-${company.slug}`, lang)}">${escapeHtml(tr[lang].viewStartup)}</a>
    </div>
  </article>`;
}

function featureList(items) {
  return `<ul class="trust-list">${items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

function founderTrustBlock(lang) {
  const l = tr[lang];
  return `<aside class="founder-trust" aria-labelledby="founder-trust-heading">
  <div class="founder-trust__media">${image(FOUNDER_IMAGE, l.founderTrustAlt, 'founder-trust__photo')}</div>
  <div class="founder-trust__copy">
    <p class="eyebrow">${escapeHtml(l.siteByline)}</p>
    <h2 id="founder-trust-heading">${escapeHtml(l.founderTrustTitle)}</h2>
    <p>${escapeHtml(l.founderTrustText)}</p>
  </div>
</aside>`;
}

function profileRecruiterCta(person, lang) {
  if (person.slug !== 'bohdan-tiutenko') return '';
  const l = tr[lang];
  return `<section class="profile-recruiter-cta" aria-labelledby="profile-cta-title">
    <h3 id="profile-cta-title">${escapeHtml(l.profileCTATitle)}</h3>
    <p>${escapeHtml(l.profileCTAText)}</p>
    <a class="btn" href="mailto:jobs.r@protonmail.com?subject=${encodeURIComponent(person.name[lang])}">${escapeHtml(l.profileCTALinkLabel)}</a>
  </section>`;
}

function sectionIntro(eyebrow, title, text) {
  return `<div class="section-intro">
    <p class="eyebrow">${escapeHtml(eyebrow)}</p>
    <h2>${escapeHtml(title)}</h2>
    <p>${escapeHtml(text)}</p>
  </div>`;
}

function sectorCards(lang) {
  return `<div class="grid sector-grid">${tr[lang].sectors.map(item => `<article class="info-card">
    <h3>${escapeHtml(item.title)}</h3>
    <p>${escapeHtml(item.text)}</p>
  </article>`).join('')}</div>`;
}

function insightCards(lang) {
  return `<div class="grid insight-grid">${tr[lang].insightCards.map(item => `<article class="info-card insight-card">
    <h3>${escapeHtml(item.title)}</h3>
    <p>${escapeHtml(item.text)}</p>
  </article>`).join('')}</div>`;
}

function compactCards(list, lang, count = 6) {
  return list.slice(0, count).map((entry, idx) => profileCard(entry, lang, idx)).join('\n');
}

function compactStartupCards(list, lang, count = 6) {
  return list.slice(0, count).map((entry, idx) => startupCard(entry, lang, idx)).join('\n');
}

function countCard(value, label) {
  return `<div class="stat-card"><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`;
}

function countByTag(entries, key) {
  return entries.filter(entry => firstTagKey(entry) === key).length;
}

function countByStartupTag(entries, key) {
  return entries.filter(entry => startupKey(entry) === key).length;
}

function relatedProfiles(person, specialists, lang) {
  const sameRubric = firstTagKey(person);
  const related = specialists.filter(entry => entry.slug !== person.slug && firstTagKey(entry) === sameRubric).slice(0, 3);
  if (!related.length) return '';
  return `<section class="profile-related">
    ${sectionIntro(tr[lang].relatedProfiles, tr[lang].relatedProfiles, tr[lang].specialistsText)}
    <div class="grid compact-grid">${related.map(entry => profileCard(entry, lang)).join('\n')}</div>
  </section>`;
}

function gallery(person, lang) {
  if (!person.gallery?.length) return '';
  return `<section class="profile-gallery">
    <h3>${escapeHtml(tr[lang].gallery)}</h3>
    <div class="gallery-grid">${person.gallery.map(item => `<figure>
      ${image(item.image, item.title[lang] || person.name[lang])}
      <figcaption><strong>${escapeHtml(item.title[lang])}</strong><span>${escapeHtml(item.caption[lang])}</span></figcaption>
    </figure>`).join('')}</div>
  </section>`;
}

function highlights(person, lang) {
  if (!person.highlights?.[lang]?.length) return '';
  return `<section class="highlight-list">
    <h3>${escapeHtml(tr[lang].highlights)}</h3>
    <ul>${person.highlights[lang].map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
  </section>`;
}

function startupSignals(company, lang) {
  if (!company.signals?.[lang]?.length) return '';
  return `<section class="highlight-list startup-signals">
    <h3>${escapeHtml(tr[lang].highlights)}</h3>
    <ul>${company.signals[lang].map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
  </section>`;
}

function relatedStartups(company, startups, lang) {
  const sameCategory = startupKey(company);
  const related = startups.filter(entry => entry.slug !== company.slug && startupKey(entry) === sameCategory).slice(0, 4);
  if (!related.length) return '';
  return `<section class="profile-related">
    ${sectionIntro(tr[lang].relatedProfiles, tr[lang].relatedProfiles, tr[lang].startupsText)}
    <div class="grid startup-grid">${related.map(entry => startupCard(entry, lang)).join('\n')}</div>
  </section>`;
}

function writeStartupPage(company, startups, lang) {
  const l = tr[lang];
  const title = `${company.name} - ${company.category[lang]} | Rybezh`;
  const file = path.join(PAGES_DIR, pageName(`startup-${company.slug}`, lang));
  const content = `
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description(company.summary[lang]))}">

<article class="content-wrapper startup-page">
  <a class="back-link" href="${pageName('startups', lang)}">${escapeHtml(l.viewAllStartups)}</a>
  <header class="profile-header startup-header">
    ${image(company.image, company.name, 'profile-avatar-large startup-logo-large')}
    <div class="profile-info">
      <p class="eyebrow">${escapeHtml(l.founded)} ${escapeHtml(company.founded)}</p>
      <h1>${escapeHtml(company.name)}</h1>
      <h2>${escapeHtml(company.category[lang])}</h2>
      ${tagMarkup(company.tags[lang])}
    </div>
  </header>
  <section class="profile-facts startup-facts">
    <div><strong>${escapeHtml(l.founded)}</strong><span>${escapeHtml(company.founded)}</span></div>
    <div><strong>HQ</strong><span>${escapeHtml(company.hq?.[lang] || company.name)}</span></div>
    <div><strong>Model</strong><span>${escapeHtml(company.model?.[lang] || company.category[lang])}</span></div>
  </section>
  <section class="profile-content">
    <h3>${escapeHtml(l.biography)}</h3>
    <p>${escapeHtml(company.summary[lang])}</p>
  </section>
  <section class="profile-facts startup-facts startup-facts-secondary">
    <div><strong>Market</strong><span>${escapeHtml(company.market?.[lang] || company.category[lang])}</span></div>
    <div><strong>${escapeHtml(l.knownFor)}</strong><span>${escapeHtml(company.notableFor?.[lang] || company.summary[lang])}</span></div>
    <div><strong>Category key</strong><span>${escapeHtml(startupKey(company))}</span></div>
  </section>
  ${startupSignals(company, lang)}
  <section class="editorial-note">
    <h3>${escapeHtml(l.editorialNoteTitle)}</h3>
    <p>${escapeHtml(l.editorialNoteText)}</p>
  </section>
  ${relatedStartups(company, startups, lang)}
</article>`;
  fs.writeFileSync(file, `${content.trim()}\n`);
}

function writeProfilePage(person, specialists, lang) {
  const l = tr[lang];
  const title = `${person.name[lang]} - ${person.role[lang]} | Rybezh`;
  const file = path.join(PROFILES_DIR, pageName(`person-${person.slug}`, lang));
  const content = `
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description(person.bio[lang]))}">

<article class="content-wrapper profile-page">
  <a class="back-link" href="${pageName('specialists', lang)}">${escapeHtml(l.profileBack)}</a>
  <header class="profile-header">
    ${image(person.image, person.name[lang], 'profile-avatar-large')}
    <div class="profile-info">
      <p class="eyebrow">${escapeHtml(person.country[lang])}</p>
      <h1>${escapeHtml(person.name[lang])}</h1>
      <h2>${escapeHtml(person.role[lang])}</h2>
      ${tagMarkup(person.tags[lang])}
    </div>
  </header>
  <section class="profile-facts">
    <div><strong>${escapeHtml(l.country)}</strong><span>${escapeHtml(person.country[lang])}</span></div>
    <div><strong>${escapeHtml(l.focus)}</strong><span>${escapeHtml(person.focus[lang])}</span></div>
    <div><strong>${escapeHtml(l.knownFor)}</strong><span>${escapeHtml(person.knownFor[lang])}</span></div>
  </section>
  ${highlights(person, lang)}
  <section class="profile-content">
    <h3>${escapeHtml(l.biography)}</h3>
    <p>${escapeHtml(person.bio[lang])}</p>
  </section>
  ${profileRecruiterCta(person, lang)}
  <section class="editorial-note">
    <h3>${escapeHtml(l.editorialNoteTitle)}</h3>
    <p>${escapeHtml(l.editorialNoteText)}</p>
  </section>
  ${gallery(person, lang)}
  ${relatedProfiles(person, specialists, lang)}
</article>`;
  fs.writeFileSync(file, `${content.trim()}\n`);
}

function policySection(section) {
  return `<section class="policy-section">
    <h2>${escapeHtml(section.title)}</h2>
    <p>${escapeHtml(section.body)}</p>
  </section>`;
}

function writeContentPage(lang, base, title, intro, sections, extraHtml = '') {
  writePage(pageName(base, lang), `
<title>${escapeHtml(title)} | Rybezh</title>
<meta name="description" content="${escapeHtml(description(intro))}">

<article class="content-wrapper policy-page">
  <p class="eyebrow">${escapeHtml(tr[lang].siteByline)}</p>
  <h1>${escapeHtml(title)}</h1>
  <p class="lead">${escapeHtml(intro)}</p>
  ${sections.map(policySection).join('\n')}
  ${extraHtml}
</article>`);
}

function writeIndex(lang, specialists, startups) {
  const l = tr[lang];
  const featured = specialists.slice(0, 6);
  const latest = specialists.slice(6, 12);
  const content = `
<title>${escapeHtml(l.siteTitle)}</title>
<meta name="description" content="${escapeHtml(description(l.siteDescription))}">

<section class="hero">
  <div class="hero-copy">
    <p class="eyebrow">${escapeHtml(l.heroEyebrow)}</p>
    <h1>${escapeHtml(l.heroTitle)}</h1>
    <p>${escapeHtml(l.heroText)}</p>
    <div class="hero-actions">
      <a class="btn" href="${pageName('specialists', lang)}">${escapeHtml(l.heroPrimary)}</a>
      <a class="btn secondary" href="${pageName('startups', lang)}">${escapeHtml(l.heroSecondary)}</a>
    </div>
    ${heroFacepile(specialists, lang)}
    <p class="hero-photo-caption">${escapeHtml(l.heroPhotoStrip)}</p>
    ${featureList(l.trust)}
    ${founderTrustBlock(lang)}
  </div>
  <div class="hero-panel">
    ${countCard(String(specialists.length), l.viewAllSpecialists)}
    ${countCard(String(startups.length), l.viewAllStartups)}
    ${countCard(String(langs.length), l.languagesStat)}
    ${countCard(String(countByTag(specialists, 'software') + countByTag(specialists, 'engineering')), l.techProfilesStat)}
  </div>
</section>

${sectionIntro(l.featuredTitle, l.featuredTitle, l.featuredText)}
<section class="grid featured-grid">${featured.map(person => profileCard(person, lang)).join('\n')}</section>

${sectionIntro(l.sectorsTitle, l.sectorsTitle, l.sectorsText)}
${sectorCards(lang)}

${sectionIntro(l.insightsTitle, l.insightsTitle, l.insightsText)}
${insightCards(lang)}

${sectionIntro(l.latestTitle, l.latestTitle, l.latestText)}
<section class="grid compact-grid">${latest.map(person => profileCard(person, lang)).join('\n')}</section>

<section class="split-panel">
  <div>
    <p class="eyebrow">${escapeHtml(l.specialistsTitle)}</p>
    <h2>${escapeHtml(l.specialistsTitle)}</h2>
    <p>${escapeHtml(l.specialistsText)}</p>
  </div>
  <a class="btn" href="${pageName('specialists', lang)}">${escapeHtml(l.viewAllSpecialists)}</a>
</section>

${sectionIntro(l.startupsTitle, l.startupsTitle, l.startupsText)}
<section class="grid startup-grid">${compactStartupCards(startups, lang, 6)}</section>

<section class="split-panel accent-panel">
  <div>
    <p class="eyebrow">${escapeHtml(l.standardsTitle)}</p>
    <h2>${escapeHtml(l.standardsTitle)}</h2>
    <p>${escapeHtml(l.standardsText)}</p>
  </div>
  <div class="stacked-actions">
    <a class="btn" href="${pageName('methodology', lang)}">${escapeHtml(l.standardsPrimary)}</a>
    <a class="btn secondary" href="${pageName('privacy', lang)}">${escapeHtml(l.standardsSecondary)}</a>
  </div>
</section>`;
  writePage(pageName('index', lang), content);
}

function writeSpecialists(lang, specialists) {
  const l = tr[lang];
  writePage(pageName('specialists', lang), `
<title>${escapeHtml(l.specialistsPageTitle)} | Rybezh</title>
<meta name="description" content="${escapeHtml(description(l.specialistsPageIntro))}">

<section class="hero slim">
  <div class="hero-copy">
    <p class="eyebrow">${escapeHtml(l.siteByline)}</p>
    <h1>${escapeHtml(l.specialistsPageTitle)}</h1>
    <p>${escapeHtml(l.specialistsPageIntro)}</p>
  </div>
</section>

<section class="directory-panel" data-directory-panel aria-label="${escapeHtml(l.searchLabel)}">
  <div class="directory-toolbar">
    <label class="search-label">${escapeHtml(l.searchLabel)}
      <input type="search" data-directory-search placeholder="${escapeHtml(l.searchPlaceholder)}">
    </label>
    <button class="btn secondary directory-reset" type="button" data-directory-reset>${escapeHtml(l.resetFilters)}</button>
  </div>
  <div class="directory-toolbar-secondary">
    ${directorySortSelect(lang)}
    ${directoryCountrySelect(lang, specialists.map(person => person.country[lang]))}
  </div>
  <p class="directory-hint">${escapeHtml(l.searchHint)}</p>
  <p class="directory-share-hint">${escapeHtml(l.directoryShareHint)}</p>
  ${filterButtons(specialists.map(firstTagKey), rubricLabels, lang, l.filterAll)}
  <p class="directory-results"><strong data-results-count>${specialists.length}</strong> ${escapeHtml(l.resultsLabel)}</p>
</section>

<section class="grid" data-directory-grid>${specialists.map((person, idx) => profileCard(person, lang, idx)).join('\n')}</section>
<p class="empty-state" data-empty-state hidden>${escapeHtml(l.emptyState)}</p>

<section class="split-panel">
  <div>
    <p class="eyebrow">${escapeHtml(l.standardsTitle)}</p>
    <h2>${escapeHtml(l.standardsTitle)}</h2>
    <p>${escapeHtml(l.standardsText)}</p>
  </div>
  <a class="btn" href="${pageName('methodology', lang)}">${escapeHtml(l.standardsPrimary)}</a>
</section>`);
}

function writeStartups(lang, startups) {
  const l = tr[lang];
  writePage(pageName('startups', lang), `
<title>${escapeHtml(l.startupsPageTitle)} | Rybezh</title>
<meta name="description" content="${escapeHtml(description(l.startupsPageIntro))}">

<section class="hero slim">
  <div class="hero-copy">
    <p class="eyebrow">${escapeHtml(l.siteByline)}</p>
    <h1>${escapeHtml(l.startupsPageTitle)}</h1>
    <p>${escapeHtml(l.startupsPageIntro)}</p>
  </div>
  <div class="hero-panel">
    ${countCard(String(startups.length), l.viewAllStartups)}
    ${countCard(String(countByStartupTag(startups, 'ai')), 'AI')}
    ${countCard(String(countByStartupTag(startups, 'software')), 'Software')}
    ${countCard(String(countByStartupTag(startups, 'fintech')), 'Fintech')}
  </div>
</section>

<section class="directory-panel" data-directory-panel aria-label="${escapeHtml(l.searchLabel)}">
  <div class="directory-toolbar">
    <label class="search-label">${escapeHtml(l.searchLabel)}
      <input type="search" data-directory-search placeholder="${escapeHtml(l.searchPlaceholder)}">
    </label>
    <button class="btn secondary directory-reset" type="button" data-directory-reset>${escapeHtml(l.resetFilters)}</button>
  </div>
  <div class="directory-toolbar-secondary">
    ${directorySortSelect(lang)}
    ${directoryCountrySelect(lang, startups.map(company => company.hqCountry?.[lang]))}
    ${directoryYearSelect(lang, startups.map(company => company.founded))}
  </div>
  <p class="directory-hint">${escapeHtml(l.searchHint)}</p>
  <p class="directory-share-hint">${escapeHtml(l.directoryShareHint)}</p>
  ${filterButtons(startups.map(startupKey), startupLabels, lang, l.startupFilters.all)}
  <p class="directory-results"><strong data-results-count>${startups.length}</strong> ${escapeHtml(l.resultsLabel)}</p>
</section>

<section class="grid startup-grid" data-directory-grid>${startups.map((company, idx) => startupCard(company, lang, idx)).join('\n')}</section>
<p class="empty-state" data-empty-state hidden>${escapeHtml(l.emptyState)}</p>

<section class="split-panel">
  <div>
    <p class="eyebrow">${escapeHtml(l.methodologyTitle)}</p>
    <h2>${escapeHtml(l.methodologyTitle)}</h2>
    <p>${escapeHtml(l.standardsText)}</p>
  </div>
  <a class="btn" href="${pageName('methodology', lang)}">${escapeHtml(l.standardsPrimary)}</a>
</section>`);
}

function write404(lang) {
  const l = tr[lang];
  writePage(pageName('404', lang), `
<title>404 | Rybezh</title>
<meta name="description" content="${escapeHtml(description(l.notFoundText))}">
<meta name="robots" content="noindex,follow">

<section class="hero slim">
  <div class="hero-copy">
    <p class="eyebrow">404</p>
    <h1>${escapeHtml(l.notFoundTitle)}</h1>
    <p>${escapeHtml(l.notFoundText)}</p>
    <div class="hero-actions">
      <a class="btn" href="${pageName('index', lang)}">${escapeHtml(l.notFoundPrimary)}</a>
      <a class="btn secondary" href="${pageName('specialists', lang)}">${escapeHtml(l.notFoundSecondary)}</a>
    </div>
  </div>
</section>`);
}

function writeSitemap(specialists) {
  const staticPages = ['index', 'specialists', 'startups', 'privacy', 'cookies', 'terms', 'methodology'];
  const urls = [];
  for (const lang of langs) {
    for (const page of staticPages) {
      const loc = `${BASE_URL}${pageName(page, lang)}`.replace('/index.html', '/');
      urls.push({ loc, priority: page === 'index' ? '1.0' : '0.8' });
    }
    for (const person of specialists) {
      urls.push({ loc: `${BASE_URL}${pageName(`person-${person.slug}`, lang)}`, priority: person.featured ? '0.9' : '0.7' });
    }
    for (const startup of startups) {
      urls.push({ loc: `${BASE_URL}${pageName(`startup-${startup.slug}`, lang)}`, priority: '0.65' });
    }
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ loc, priority }) => `  <url>
    <loc>${loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  fs.writeFileSync(path.join(PAGES_DIR, 'sitemap.xml'), `${xml}\n`);
}

const specialists = JSON.parse(fs.readFileSync(SPECIALISTS_FILE, 'utf8'));
const startups = JSON.parse(fs.readFileSync(STARTUPS_FILE, 'utf8'));

clearGeneratedPages();

for (const person of specialists) {
  for (const lang of langs) writeProfilePage(person, specialists, lang);
}

for (const startup of startups) {
  for (const lang of langs) writeStartupPage(startup, startups, lang);
}

for (const lang of langs) {
  writeIndex(lang, specialists, startups);
  writeSpecialists(lang, specialists);
  writeStartups(lang, startups);
  writeContentPage(lang, 'methodology', tr[lang].methodologyTitle, tr[lang].methodologyIntro, tr[lang].methodologySections, policySection(tr[lang].methodologyFounderNote));
  writeContentPage(lang, 'privacy', tr[lang].privacyTitle, tr[lang].privacyIntro, tr[lang].privacySections);
  writeContentPage(lang, 'cookies', tr[lang].cookiesTitle, tr[lang].cookiesIntro, tr[lang].cookiesSections);
  writeContentPage(lang, 'terms', tr[lang].termsTitle, tr[lang].termsIntro, tr[lang].termsSections);
  write404(lang);
}

writeSitemap(specialists);
console.log(`Generated ${specialists.length * langs.length} profile pages and ${langs.length * 7} static pages.`);
