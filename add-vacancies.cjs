const fs = require('fs');

// ─── Load existing data ───
const content = JSON.parse(fs.readFileSync('src/content.json', 'utf8'));
const indexable = JSON.parse(fs.readFileSync('src/indexable-vacancies.json', 'utf8'));

// ─── 1. Kitchen helper — Kraków ───
const kitchenSlug = 'krakow-hospitality-pomicnik-kucharza-298';
const kitchen = {
  slug: kitchenSlug,
  category: 'hospitality',
  city: 'Краків',
  city_pl: 'Kraków',
  title: 'Помічник кухаря в Краків',
  title_pl: 'Pomocnik kucharza w Kraków',
  salary: '24 - 32 PLN/h',
  company: 'Smaczna Kuchnia Sp. z o.o.',
  shift_ua: 'Пн-Сб, 7:00-15:00 або 14:00-22:00',
  shift_pl: 'Pn-Sb, 7:00-15:00 lub 14:00-22:00',
  pattern_ua: '5/1',
  pattern_pl: '5/1',
  start_ua: 'Протягом тижня',
  start_pl: 'W ciągu tygodnia',
  contract_ua: 'Umowa o pracę',
  contract_pl: 'Umowa o pracę',
  offers_ua: [
    'Безкоштовне харчування під час зміни (повноцінний обід від шеф-кухаря).',
    'Медстрахування (ZUS) від першого дня.',
    'Бонуси за роботу у вихідні та святкові дні.',
    'Навчання новим стравам від досвідченого кухаря.'
  ],
  offers_pl: [
    'Darmowe wyżywienie na zmianie (pełny obiad od szefa kuchni).',
    'Ubezpieczenie zdrowotne (ZUS) od pierwszego dnia.',
    'Bonusy za pracę w weekendy i święta.',
    'Nauka nowych dań od doświadczonego kucharza.'
  ],
  tasks_ua: [
    'Підготовка інгредієнтів: чистка, нарізка овочів, зважування порцій, маринування м\u2019яса.',
    'Допомога шеф-кухарю на гарячій лінії під час обідньої та вечірньої подачі.',
    'Приймання товару від постачальників, перевірка термінів придатності, правильне зберігання в холодильних камерах.',
    'Підтримка чистоти робочих поверхонь та інвентарю відповідно до стандартів HACCP.'
  ],
  tasks_pl: [
    'Przygotowanie składników: obieranie, krojenie warzyw, ważenie porcji, marynowanie mięs.',
    'Wsparcie szefa kuchni na linii gorącej podczas lunchu i kolacji.',
    'Przyjmowanie dostawy od dostawców, kontrola dat ważności, prawidłowe magazynowanie w chłodniach.',
    'Utrzymanie czystości blatów i sprzętu zgodnie ze standardami HACCP.'
  ],
  details_ua: [
    'Кухня працює на базі сезонного меню — страви змінюються що 3–4 тижні, тому нудно не буде.',
    'Зміна починається з короткого брифінгу: шеф-кухар розповідає, які страви в пріоритеті, які продукти треба використати першими.',
    'В команді 6 осіб: шеф, су-шеф, два кухарі та два помічники — розподіл ролей чіткий, без хаосу.',
    'Ресторан у центрі Кракова, на вулиці Floriańska — район з великим потоком туристів і місцевих.',
    'Є кімната відпочинку з кавовою машиною та мікрохвильовкою. Перерва 30 хв на зміну.',
    'Координатор від фірми допомагає з PESEL, мельдунком і банківським рахунком протягом першого тижня.'
  ],
  details_pl: [
    'Kuchnia oparta na menu sezonowym — dania zmieniają się co 3–4 tygodnie, więc praca jest różnorodna.',
    'Zmiana zaczyna się od krótkiego briefingu: szef kuchni omawia priorytety dnia i produkty do pilnego zużycia.',
    'Zespół to 6 osób: szef, su-szef, dwóch kucharzy i dwóch pomocników — jasny podział ról.',
    'Restauracja w centrum Krakowa, ul. Floriańska — dzielnica z dużym ruchem turystycznym.',
    'Pokój socjalny z ekspresem do kawy i mikrofalówką. Przerwa 30 min na zmianie.',
    'Koordynator firmowy pomaga z PESEL-em, zameldowaniem i kontem bankowym w pierwszym tygodniu.'
  ],
  requirements_ua: [
    'Досвід: Бажано від 3 місяців на кухні, але навчимо',
    'Мова: Базова польська або англійська',
    'Документи: Паспорт, санітарна книжка (або готовність оформити)'
  ],
  requirements_pl: [
    'Doświadczenie: Mile widziane min. 3 miesiące w kuchni, ale przyuczymy',
    'Język: Podstawowy polski lub angielski',
    'Dokumenty: Paszport, książeczka sanepidowska (lub gotowość do wyrobienia)'
  ],
  experience_ua: 'Бажано від 3 місяців',
  experience_pl: 'Mile widziane min. 3 miesiące',
  language_ua: 'Базова польська або англійська',
  language_pl: 'Podstawowy polski lub angielski',
  housing_ua: 'Допомога з пошуком житла поблизу',
  housing_pl: 'Pomoc w znalezieniu mieszkania w pobliżu',
  transport_ua: 'Пішки 10 хв від Rynek Główny',
  transport_pl: 'Pieszo 10 min od Rynku Głównego',
  documents_ua: 'Документи: Паспорт, санкнижка',
  documents_pl: 'Dokumenty: Paszport, książeczka sanepid.',
  workplace_ua: 'Тип об\u2019єкта: ресторан повного циклу',
  workplace_pl: 'Typ obiektu: restauracja pełnego cyklu',
  team_ua: 'Команда: 6 осіб на зміну',
  team_pl: 'Zespół: 6 osób na zmianie',
  onboarding_ua: 'Перші 3 дні — стажування з су-шефом, який показує все від А до Я.',
  onboarding_pl: 'Pierwsze 3 dni — staż z su-szefem, który pokaże wszystko od A do Z.',
  daily_ua: [
    'Контроль температури в холодильниках (записується в журнал).',
    'Комунікація з шефом щодо замовлень та запасів.',
    'Допомога на будь-якій станції, де потрібна підмога.'
  ],
  daily_pl: [
    'Kontrola temperatury w chłodniach (wpis do dziennika).',
    'Komunikacja z szefem w sprawie zamówień i zapasów.',
    'Wsparcie na dowolnej stacji, gdzie potrzebna pomoc.'
  ],
  excerpt: 'Smaczna Kuchnia Sp. z o.o. шукає: Помічник кухаря в Краків (Пн-Сб, 5/1). Підготовка інгредієнтів, допомога шеф-кухарю на гарячій лінії.',
  excerpt_pl: 'Smaczna Kuchnia Sp. z o.o. poszukuje: Pomocnik kucharza w Kraków (Pn-Sb, 5/1). Przygotowanie składników, wsparcie szefa kuchni na linii gorącej.',
  body: `
        <div class="vacancy-block">
          <p>Невеликий ресторан у центрі Кракова шукає людину, яка готова вчитися і працювати руками. Це не позиція «стій і мий тарілки» — тут реально готують: різають, маринують, подають на лінію, працюють поруч із шеф-кухарем. Якщо ви хоч раз стояли на кухні довше, ніж заварити каву — ви вже на півкроку попереду більшості кандидатів. Досвід від 3 місяців в ідеалі, але якщо є бажання і швидко вчитесь — навчимо з нуля. Графік стабільний, є ранкова і вечірня зміна, вихідний плаваючий. Оплата від 24 до 32 злотих на годину, залежно від досвіду та позиції. Безкоштовне харчування на зміні — це повноцінний обід, а не «суп із пакетика». Команда невелика (6 осіб), атмосфера робоча, але без армійщини: шеф пояснює, а не кричить. Ресторан на вулиці Floriańska — це туристичний центр, гарне місце і стабільний потік гостей. Перші 3 дні стажування з су-шефом, який покаже все: від зберігання продуктів до подачі страв. Координатор фірми допоможе з оформленням PESEL і мельдунком у перший тиждень.</p>
          <div class="job-meta">
            <p><strong>🏢 Компанія:</strong> Smaczna Kuchnia Sp. z o.o.</p>
            <p><strong>📍 Місто:</strong> Краків</p>
          </div>
          <hr>
          <h3>Короткі умови</h3>
          <ul>
            <li>Графік: Пн-Сб, 7:00-15:00 або 14:00-22:00</li>
            <li>Режим: 5/1</li>
            <li>Договір: Umowa o pracę</li>
            <li>Старт: Протягом тижня</li>
          </ul>
          <h3>Що робитимете щодня:</h3>
          <ul><li>Підготовка інгредієнтів: чистка, нарізка овочів, зважування порцій, маринування м'яса.</li><li>Допомога шеф-кухарю на гарячій лінії під час обідньої та вечірньої подачі.</li><li>Приймання товару від постачальників, перевірка термінів придатності, правильне зберігання в холодильних камерах.</li><li>Підтримка чистоти робочих поверхонь та інвентарю відповідно до стандартів HACCP.</li></ul>
          <h3>Критерії</h3>
          <ul><li>Досвід: Бажано від 3 місяців на кухні, але навчимо</li><li>Мова: Базова польська або англійська</li><li>Документи: Паспорт, санітарна книжка (або готовність оформити)</li></ul>
          <div class="salary-box">💰 Зарплата: <strong>24 - 32 PLN/h</strong></div>
        </div>
        <a href="/apply.html" class="btn btn-primary">Відгукнутися на вакансію</a>
      `,
  body_pl: `
        <div class="vacancy-block">
          <p>Niewielka restauracja w centrum Krakowa szuka osoby gotowej się uczyć i pracować ręcznie. To nie pozycja „stój i zmywaj" — tu naprawdę gotujemy: kroimy, marynujemy, podajemy na linię, pracujemy obok szefa kuchni. Jeśli choć raz stałeś w kuchni dłużej, niż do herbaty — jesteś pół kroku przed większością kandydatów. Doświadczenie od 3 miesięcy mile widziane, ale jeśli masz motywację i szybko się uczysz — przyuczymy od zera. Grafik stabilny, zmiana poranna lub wieczorna, dzień wolny ruchomy. Wynagrodzenie od 24 do 32 PLN/h, zależy od doświadczenia i pozycji. Darmowe wyżywienie na zmianie — to pełnoprawny obiad, nie „zupka z proszku". Zespół mały (6 osób), klimat roboczy, ale bez wojskowej atmosfery: szef tłumaczy, a nie krzyczy. Restauracja na ul. Floriańskiej — centrum turystyczne, ładna lokalizacja i stały ruch gości. Pierwsze 3 dni stażu z su-szefem, który pokaże wszystko: od przechowywania produktów po podawanie dań. Koordynator firmowy pomoże z PESEL-em i zameldowaniem w pierwszym tygodniu.</p>
          <div class="job-meta">
            <p><strong>🏢 Firma:</strong> Smaczna Kuchnia Sp. z o.o.</p>
            <p><strong>📍 Miasto:</strong> Kraków</p>
          </div>
          <hr>
          <h3>Krótkie warunki</h3>
          <ul>
            <li>Grafik: Pn-Sb, 7:00-15:00 lub 14:00-22:00</li>
            <li>System: 5/1</li>
            <li>Umowa: Umowa o pracę</li>
            <li>Start: W ciągu tygodnia</li>
          </ul>
          <h3>Twoje obowiązki:</h3>
          <ul><li>Przygotowanie składników: obieranie, krojenie warzyw, ważenie porcji, marynowanie mięs.</li><li>Wsparcie szefa kuchni na linii gorącej podczas lunchu i kolacji.</li><li>Przyjmowanie dostawy od dostawców, kontrola dat ważności, prawidłowe magazynowanie w chłodniach.</li><li>Utrzymanie czystości blatów i sprzętu zgodnie ze standardami HACCP.</li></ul>
          <h3>Oczekiwania wobec kandydata</h3>
          <ul><li>Doświadczenie: Mile widziane min. 3 miesiące w kuchni, ale przyuczymy</li><li>Język: Podstawowy polski lub angielski</li><li>Dokumenty: Paszport, książeczka sanepidowska (lub gotowość do wyrobienia)</li></ul>
          <div class="salary-box">💰 Wynagrodzenie: <strong>24 - 32 PLN/h</strong></div>
        </div>
        <a href="/apply.html" class="btn btn-primary">Aplikuj teraz</a>
      `,
  cta_text: 'Подати заявку',
  cta_text_pl: 'Aplikuj',
  cta_link: '/apply.html',
  country: 'Poland',
  language: 'uk',
  employment_type: 'full-time',
  date_posted: new Date().toISOString(),
  is_generated: true,
  data_source: 'generated',
  sector_ua: 'Сектор: гастрономія (ресторан)',
  sector_pl: 'Sektor: gastronomia (restauracja)',
  equipment_ua: 'Обладнання: професійна кухня, ножі, духові шафи',
  equipment_pl: 'Sprzęt: kuchnia profesjonalna, noże, piece',
  physical_ua: 'Фізичні вимоги: перебування на ногах до 8 год, піднімання до 15 кг',
  physical_pl: 'Wymagania fizyczne: stanie do 8h, dźwiganie do 15 kg',
  shift_structure_ua: 'Структура зміни: брифінг → підготовка → подача → прибирання',
  shift_structure_pl: 'Struktura zmiany: briefing → przygotowanie → serwis → sprzątanie'
};

// ─── 2. WordPress / SEO specialist — Варшава (remote-friendly) ───
const wpSlug = 'warsaw-it-wordpress-seo-specialist-299';
const wordpress = {
  slug: wpSlug,
  category: 'it',
  city: 'Варшава',
  city_pl: 'Warszawa',
  title: 'WordPress-розробник / SEO-спеціаліст у Варшава',
  title_pl: 'Programista WordPress / Specjalista SEO w Warszawa',
  salary: '35 - 55 PLN/h',
  company: 'BrightPixel Digital Sp. z o.o.',
  shift_ua: 'Пн-Пт, гнучкий графік (8 год/день)',
  shift_pl: 'Pn-Pt, elastyczny grafik (8h/dzień)',
  pattern_ua: '5/2',
  pattern_pl: '5/2',
  start_ua: 'Якнайшвидше',
  start_pl: 'Jak najszybciej',
  contract_ua: 'Umowa o pracę або B2B',
  contract_pl: 'Umowa o pracę lub B2B',
  offers_ua: [
    'Можливість працювати віддалено 3 дні на тиждень.',
    'Бюджет на конференції та онлайн-курси (2000 PLN/рік).',
    'Сучасний MacBook або Windows-ноут на вибір.',
    'Медичний пакет LuxMed від першого місяця.'
  ],
  offers_pl: [
    'Możliwość pracy zdalnej 3 dni w tygodniu.',
    'Budżet na konferencje i kursy online (2000 PLN/rok).',
    'Nowoczesny MacBook lub laptop Windows do wyboru.',
    'Pakiet medyczny LuxMed od pierwszego miesiąca.'
  ],
  tasks_ua: [
    'Розробка і підтримка сайтів на WordPress: кастомні теми, Elementor, WooCommerce, ACF, кастомні плагіни, налаштування хостингу та SSL.',
    'SEO-оптимізація «від і до»: аудит сайтів, технічне SEO (Core Web Vitals, schema markup, sitemap), on-page оптимізація текстів і зображень, робота з Google Search Console і Ahrefs.',
    'Налаштування аналітики: Google Analytics 4, GTM, відстеження конверсій, A/B-тестування лендінгів.',
    'Підготовка SEO-стратегій для клієнтських проєктів: від аналізу конкурентів до щомісячних звітів з KPI.'
  ],
  tasks_pl: [
    'Budowa i utrzymanie stron na WordPress: motywy własne, Elementor, WooCommerce, ACF, wtyczki custom, konfiguracja hostingu i SSL.',
    'SEO od A do Z: audyty stron, SEO techniczne (Core Web Vitals, schema markup, sitemap), optymalizacja on-page tekstów i obrazów, praca z Google Search Console i Ahrefs.',
    'Konfiguracja analityki: Google Analytics 4, GTM, śledzenie konwersji, testy A/B stron docelowych.',
    'Opracowanie strategii SEO dla projektów klienckich: od analizy konkurencji po miesięczne raporty z KPI.'
  ],
  details_ua: [
    'Агенція працює з 15 постійними клієнтами — від локальних кав\u2019ярень до e-commerce з 10 000+ SKU. Кожен розробник веде 3–4 проєкти паралельно.',
    'Стек: WordPress (PHP 8+, підхід theme-as-code), Git для версіонування, CI/CD через GitHub Actions, staging на Cloudways або Kinsta.',
    'SEO-інструменти: Ahrefs, Screaming Frog, Google Search Console, Surfer SEO. Контент-план будується в Notion, задачі ведуться в Linear.',
    'Офіс у Варшаві (район Mokotów, Domaniewska) — сучасний коворкінг із кухнею і тихими зонами. Але 3 з 5 днів можна працювати з дому.',
    'Раз на тиждень — внутрішнє демо, де команда показує, що зробила, і отримує фідбек. Без формалізму, все по суті.',
    'Є бюджет на навчання (WordCamp, WP конференції, курси Udemy/Coursera) — 2000 PLN на рік.'
  ],
  details_pl: [
    'Agencja współpracuje z 15 stałymi klientami — od lokalnych kawiarni po e-commerce z 10 000+ SKU. Każdy deweloper prowadzi 3–4 projekty równolegle.',
    'Stack: WordPress (PHP 8+, podejście theme-as-code), Git, CI/CD przez GitHub Actions, staging na Cloudways lub Kinsta.',
    'Narzędzia SEO: Ahrefs, Screaming Frog, Google Search Console, Surfer SEO. Content plan w Notion, taski w Linear.',
    'Biuro w Warszawie (Mokotów, ul. Domaniewska) — nowoczesny coworking z kuchnią i strefami ciszy. Ale 3 z 5 dni można pracować zdalnie.',
    'Raz w tygodniu — wewnętrzne demo, gdzie zespół prezentuje postępy i dostaje feedback. Bez formalizmu.',
    'Budżet szkoleniowy (WordCamp, konferencje WP, kursy Udemy/Coursera) — 2000 PLN rocznie.'
  ],
  requirements_ua: [
    'Досвід: Від 1 року з WordPress (теми, плагіни, WooCommerce)',
    'Мова: Англійська B1+ (документація, клієнтські зідзвоні), польська — буде плюсом',
    'Навички: HTML/CSS/JS, базовий PHP, розуміння SEO, Google Analytics'
  ],
  requirements_pl: [
    'Doświadczenie: Min. 1 rok z WordPress (motywy, wtyczki, WooCommerce)',
    'Język: Angielski B1+ (dokumentacja, spotkania z klientami), polski — mile widziany',
    'Umiejętności: HTML/CSS/JS, podstawowy PHP, zrozumienie SEO, Google Analytics'
  ],
  experience_ua: 'Від 1 року з WordPress та SEO',
  experience_pl: 'Min. 1 rok z WordPress i SEO',
  language_ua: 'Англійська B1+, польська бажано',
  language_pl: 'Angielski B1+, polski mile widziany',
  housing_ua: 'Не надається (допоможемо з пошуком)',
  housing_pl: 'Nie zapewniamy (pomoc w szukaniu)',
  transport_ua: 'Офіс біля станції метро Wilanowska',
  transport_pl: 'Biuro przy stacji metra Wilanowska',
  documents_ua: 'Документи: Паспорт, портфоліо',
  documents_pl: 'Dokumenty: Paszport, portfolio',
  workplace_ua: 'Тип об\u2019єкта: digital-агенція (офіс + remote)',
  workplace_pl: 'Typ obiektu: agencja digital (biuro + remote)',
  team_ua: 'Команда: 12 осіб (4 розробники, 3 дизайнери, 2 SEO, PM, CEO, маркетолог)',
  team_pl: 'Zespół: 12 osób (4 deweloperów, 3 designerów, 2 SEO, PM, CEO, marketer)',
  onboarding_ua: 'Перший тиждень — менторинг від senior-розробника, доступ до всіх репозиторіїв і документації.',
  onboarding_pl: 'Pierwszy tydzień — mentoring od senior developera, dostęp do repozytoriów i dokumentacji.',
  daily_ua: [
    'Стендап о 10:00 (15 хв, онлайн).',
    'Code review колег — мінімум 1 PR на день.',
    'Синхронізація з SEO-командою щодо пріоритетів оптимізації.'
  ],
  daily_pl: [
    'Standup o 10:00 (15 min, online).',
    'Code review kolegów — minimum 1 PR dziennie.',
    'Synchronizacja z zespołem SEO ws. priorytetów optymalizacji.'
  ],
  excerpt: 'BrightPixel Digital шукає: WordPress-розробник / SEO-спеціаліст у Варшава (гнучкий графік, remote 3/5). Розробка сайтів, SEO-аудити, аналітика.',
  excerpt_pl: 'BrightPixel Digital poszukuje: Programista WordPress / Specjalista SEO w Warszawa (elastyczny grafik, remote 3/5). Budowa stron, audyty SEO, analityka.',
  body: `
        <div class="vacancy-block">
          <p>BrightPixel Digital — це невелика варшавська агенція, яка робить сайти на WordPress і SEO для бізнесів різного масштабу: від локальної кав'ярні до інтернет-магазину з каталогом на 10 тисяч позицій. Шукаємо людину, яка однаково комфортно почувається і в коді (PHP, кастомні теми, ACF, WooCommerce), і в SEO-аналітиці (Ahrefs, Search Console, Core Web Vitals). Це не позиція «лише правки вносити» — тут ви будете вести проєкти від аудиту до запуску, будувати SEO-стратегії для клієнтів і щотижня показувати результати команді. Графік гнучкий: стартуємо о 10:00 зі стендапу, далі працюєте у своєму темпі. 3 дні на тиждень можна із дому, решту — в офісі на Мокотові (станція метро Wilanowska). Оплата від 35 до 55 злотих на годину, залежно від досвіду та формату співпраці (UoP або B2B). Є бюджет на навчання, медичний пакет LuxMed, сучасний ноутбук на вибір. Команда — 12 людей, без токсичності і зайвої бюрократії: все вирішується в Linear і Notion, код ревʼюється на GitHub, деплой — через GitHub Actions.</p>
          <div class="job-meta">
            <p><strong>🏢 Компанія:</strong> BrightPixel Digital Sp. z o.o.</p>
            <p><strong>📍 Місто:</strong> Варшава (remote 3/5)</p>
          </div>
          <hr>
          <h3>Короткі умови</h3>
          <ul>
            <li>Графік: Пн-Пт, гнучкий (8 год/день)</li>
            <li>Режим: 5/2, remote 3 дні</li>
            <li>Договір: Umowa o pracę або B2B</li>
            <li>Старт: Якнайшвидше</li>
          </ul>
          <h3>Що робитимете:</h3>
          <ul><li>Розробка і підтримка сайтів на WordPress: кастомні теми, Elementor, WooCommerce, ACF.</li><li>SEO-оптимізація: аудити, технічне SEO, on-page оптимізація, Google Search Console, Ahrefs.</li><li>Аналітика: GA4, GTM, A/B-тестування лендінгів.</li><li>SEO-стратегії для клієнтів: від аналізу конкурентів до щомісячних звітів.</li></ul>
          <h3>Критерії</h3>
          <ul><li>Досвід: Від 1 року з WordPress (теми, плагіни, WooCommerce)</li><li>Мова: Англійська B1+, польська — плюс</li><li>Навички: HTML/CSS/JS, базовий PHP, SEO, Google Analytics</li></ul>
          <div class="salary-box">💰 Зарплата: <strong>35 - 55 PLN/h</strong></div>
        </div>
        <a href="/apply.html" class="btn btn-primary">Відгукнутися на вакансію</a>
      `,
  body_pl: `
        <div class="vacancy-block">
          <p>BrightPixel Digital to niewielka warszawska agencja, która buduje strony na WordPress i robi SEO dla firm różnej wielkości: od lokalnej kawiarni po sklep internetowy z katalogiem na 10 tysięcy pozycji. Szukamy osoby, która czuje się równie dobrze w kodzie (PHP, motywy custom, ACF, WooCommerce), jak i w analityce SEO (Ahrefs, Search Console, Core Web Vitals). To nie pozycja „tylko poprawki" — tu prowadzisz projekty od audytu po launch, budujesz dla klientów strategie SEO i co tydzień pokazujesz wyniki zespołowi. Grafik elastyczny: zaczynamy o 10:00 od standupu, dalej pracujesz we własnym tempie. 3 dni w tygodniu możesz z domu, resztę — w biurze na Mokotowie (stacja metra Wilanowska). Wynagrodzenie od 35 do 55 PLN/h, zależnie od doświadczenia i formy współpracy (UoP lub B2B). Jest budżet szkoleniowy, pakiet medyczny LuxMed, nowoczesny laptop do wyboru. Zespół — 12 osób, bez toksyczności i zbędnej biurokracji: wszystko w Linear i Notion, code review na GitHubie, deploy przez GitHub Actions.</p>
          <div class="job-meta">
            <p><strong>🏢 Firma:</strong> BrightPixel Digital Sp. z o.o.</p>
            <p><strong>📍 Miasto:</strong> Warszawa (remote 3/5)</p>
          </div>
          <hr>
          <h3>Krótkie warunki</h3>
          <ul>
            <li>Grafik: Pn-Pt, elastyczny (8h/dzień)</li>
            <li>System: 5/2, remote 3 dni</li>
            <li>Umowa: Umowa o pracę lub B2B</li>
            <li>Start: Jak najszybciej</li>
          </ul>
          <h3>Twoje obowiązki:</h3>
          <ul><li>Budowa i utrzymanie stron na WordPress: motywy custom, Elementor, WooCommerce, ACF.</li><li>SEO od A do Z: audyty, SEO techniczne, optymalizacja on-page, Search Console, Ahrefs.</li><li>Analityka: GA4, GTM, testy A/B stron docelowych.</li><li>Strategie SEO dla klientów: od analizy konkurencji po miesięczne raporty.</li></ul>
          <h3>Oczekiwania wobec kandydata</h3>
          <ul><li>Doświadczenie: Min. 1 rok z WordPress (motywy, wtyczki, WooCommerce)</li><li>Język: Angielski B1+, polski mile widziany</li><li>Umiejętności: HTML/CSS/JS, podstawowy PHP, SEO, Google Analytics</li></ul>
          <div class="salary-box">💰 Wynagrodzenie: <strong>35 - 55 PLN/h</strong></div>
        </div>
        <a href="/apply.html" class="btn btn-primary">Aplikuj teraz</a>
      `,
  cta_text: 'Подати заявку',
  cta_text_pl: 'Aplikuj',
  cta_link: '/apply.html',
  country: 'Poland',
  language: 'uk',
  employment_type: 'full-time',
  date_posted: new Date().toISOString(),
  is_generated: true,
  data_source: 'generated',
  sector_ua: 'Сектор: IT / digital-маркетинг',
  sector_pl: 'Sektor: IT / marketing cyfrowy',
  equipment_ua: 'Обладнання: MacBook/Windows-ноут, монітор 27"',
  equipment_pl: 'Sprzęt: MacBook/laptop Windows, monitor 27"',
  physical_ua: 'Фізичні вимоги: немає',
  physical_pl: 'Wymagania fizyczne: brak',
  shift_structure_ua: 'Структура дня: стендап → робота → code review → демо (пт)',
  shift_structure_pl: 'Struktura dnia: standup → praca → code review → demo (pt)'
};

// ─── Append to content.json ───
content.push(kitchen);
content.push(wordpress);
fs.writeFileSync('src/content.json', JSON.stringify(content, null, 2), 'utf8');
console.log(`✅ content.json: ${content.length} vacancies (added 2 new)`);

// ─── Add to indexable-vacancies.json ───
indexable.push(kitchenSlug);
indexable.push(wpSlug);
indexable.sort();
fs.writeFileSync('src/indexable-vacancies.json', JSON.stringify(indexable, null, 2), 'utf8');
console.log(`✅ indexable-vacancies.json: ${indexable.length} slugs`);

console.log(`\nNew vacancy slugs:`);
console.log(`  1. ${kitchenSlug}`);
console.log(`  2. ${wpSlug}`);
