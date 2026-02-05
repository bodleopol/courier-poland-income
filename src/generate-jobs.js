// Advanced Job Generator 2.0 (High Variety & SEO Optimized)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- 1. Configuration ---
const CITIES = [
  { ua: 'Варшава', pl: 'Warszawa', slug: 'warsaw' },
  { ua: 'Краків', pl: 'Kraków', slug: 'krakow' },
  { ua: 'Вроцлав', pl: 'Wrocław', slug: 'wroclaw' },
  { ua: 'Познань', pl: 'Poznań', slug: 'poznan' },
  { ua: 'Гданськ', pl: 'Gdańsk', slug: 'gdansk' },
  { ua: 'Щецін', pl: 'Szczecin', slug: 'szczecin' },
  { ua: 'Лодзь', pl: 'Łódź', slug: 'lodz' },
  { ua: 'Катовіце', pl: 'Katowice', slug: 'katowice' },
  { ua: 'Люблін', pl: 'Lublin', slug: 'lublin' },
  { ua: 'Білосток', pl: 'Białystok', slug: 'bialystok' },
  { ua: 'Ряшів', pl: 'Rzeszów', slug: 'rzeszow' },
  { ua: 'Торунь', pl: 'Toruń', slug: 'torun' },
  { ua: 'Плоцьк', pl: 'Płock', slug: 'plock' },
  { ua: 'Сосновець', pl: 'Sosnowiec', slug: 'sosnowiec' },
  { ua: 'Гдиня', pl: 'Gdynia', slug: 'gdynia' }
];

// --- 2. Data Pools (The Magimix) ---

const GLOBAL_OFFERS = {
  ua: [
    "Офіційне працевлаштування (Umowa o pracę / Zlecenie).",
    "Стабільна виплата зарплати кожного 10-го числа.",
    "Можливість отримання авансів після першого тижня.",
    "Безкоштовна робоча форма та взуття.",
    "Допомога координатора у вирішенні побутових питань.",
    "Підтримка в оформленні Карти Побуту (Karta Pobytu).",
    "Медичне страхування (ZUS) з першого дня.",
    "Можливість працювати понаднормово (+50% до ставки)."
  ],
  pl: [
    "Oficjalne zatrudnienie (Umowa o pracę / Zlecenie).",
    "Stabilna wypłata wynagrodzenia do 10-go każdego miesiąca.",
    "Możliwość pobrania zaliczki po pierwszym tygodniu.",
    "Bezpłatna odzież robocza i obuwie.",
    "Wsparcie koordynatora w sprawach codziennych.",
    "Pomoc w uzyskaniu Karty Pobytu.",
    "Ubezpieczenie medyczne (ZUS) od pierwszego dnia.",
    "Możliwość pracy w nadgodzinach (+50% stawki)."
  ]
};

const ROLES = {
  logistics: {
    name_ua: "Логістика та Склад",
    name_pl: "Logistyka i Magazyn",
    jobs: [
      {
        titles_ua: ["Водій-кур'єр B", "Кур'єр (авто компанії)", "Доставець посилок"],
        titles_pl: ["Kierowca-kurier kat. B", "Kurier (auto firmowe)", "Dostawca paczek"],
        salary: { min: 4800, max: 7500 },
        desc_ua: [
          "Доставка посилок клієнтам (e-commerce).",
          "Робота зі сканером та додатком на смартфоні.",
          "Завантаження посилок на терміналі вранці.",
          "Дотримання графіку доставки."
        ],
        desc_pl: [
          "Dostarczanie paczek do klientów (e-commerce).",
          "Praca ze skanerem i aplikacją mobilną.",
          "Załadunek paczek na terminalu rano.",
          "Przestrzeganie harmonogramu dostaw."
        ]
      },
      {
        titles_ua: ["Працівник складу", "Пакувальник одягу", "Сортувальник"],
        titles_pl: ["Pracownik magazynu", "Pakowacz odzieży", "Sortownik"],
        salary: { min: 4200, max: 5800 },
        desc_ua: [
          "Комплектація замовлень зі сканером.",
          "Пакування одягу та взуття в коробки.",
          "Перевірка товару на брак (контроль якості).",
          "Робота на лінії сортування посилок."
        ],
        desc_pl: [
          "Kompletacja zamówień ze skanerem.",
          "Pakowanie odzieży i obuwia do kartonów.",
          "Kontrola jakości towaru.",
          "Praca na linii sortowniczej."
        ]
      },
      {
        titles_ua: ["Водій навантажувача (UDT)", "Карщик", "Оператор вилочного навантажувача"],
        titles_pl: ["Operator wózka widłowego", "Kierowca wózka UDT", "Operator wózka jezdniowego"],
        salary: { min: 5500, max: 7200 },
        desc_ua: [
          "Перевезення палет по складу (високий склад).",
          "Завантаження та розвантаження вантажівок.",
          "Розміщення товару на стелажах.",
          "Дотримання правил безпеки (BHP)."
        ],
        desc_pl: [
          "Transport palet na magazynie (wysoki skład).",
          "Załadunek i rozładunek ciężarówek.",
          "Rozmieszczanie towaru na regałach.",
          "Przestrzeganie zasad BHP."
        ]
      }
    ]
  },
  construction: {
    name_ua: "Будівництво",
    name_pl: "Budownictwo",
    jobs: [
      {
        titles_ua: ["Різноробочий на будову", "Помічник будівельника", "Працівник загальнобудівельний"],
        titles_pl: ["Robotnik budowlany", "Pomocnik budowlany", "Pracownik ogólnobudowlany"],
        salary: { min: 4500, max: 6000 },
        desc_ua: [
          "Допомога майстрам на будівельному майданчику.",
          "Замішування бетону та розчинів.",
          "Прибирання території та перенесення матеріалів.",
          "Демонтажні роботи."
        ],
        desc_pl: [
          "Pomoc fachowcom na budowie.",
          "Mieszanie betonu i zapraw.",
          "Sprzątanie terenu i noszenie materiałów.",
          "Prace rozbiórkowe."
        ]
      },
       {
        titles_ua: ["Електрик", "Електромонтажник", "Монтер мереж"],
        titles_pl: ["Elektryk", "Elektromonter", "Monter sieci"],
        salary: { min: 6000, max: 9000 },
        desc_ua: [
          "Прокладання кабельних трас.",
          "Монтаж розеток, вимикачів та щитків.",
          "Підключення освітлення в нових будинках.",
          "Читати технічні схеми."
        ],
        desc_pl: [
          "Układanie tras kablowych.",
          "Montaż gniazdek, włączników i rozdzielnic.",
          "Podłączanie oświetlenia w nowych budynkach.",
          "Czytanie schematów technicznych."
        ]
      }
    ]
  },
  production: {
    name_ua: "Виробництво",
    name_pl: "Produkcja",
    jobs: [
      {
        titles_ua: ["Оператор машин", "Працівник виробничої лінії", "Монтажник деталей"],
        titles_pl: ["Operator maszyn", "Pracownik linii produkcyjnej", "Monter podzespołów"],
        salary: { min: 4300, max: 5500 },
        desc_ua: [
          "Обслуговування виробничих машин (автоматика).",
          "Контроль якості готової продукції.",
          "Монтаж дрібних деталей (аутомотів)",
          "Пакування готових виробів у коробки."
        ],
        desc_pl: [
          "Obsługa maszyn produkcyjnych (automatyka).",
          "Kontrola jakości gotowych produktów.",
          "Montaż drobnych elementów (automotive).",
          "Pakowanie gotowych wyrobów do kartonów."
        ]
      },
       {
        titles_ua: ["Пакувальник (харчова пром.)", "Працівник на шоколадну фабрику", "Оператор пакування"],
        titles_pl: ["Operator pakowania", "Pracownik fabryki czekolady", "Pakowacz"],
        salary: { min: 3800, max: 4800 },
        desc_ua: [
          "Пакування кондитерських виробів на лінії.",
          "Складання картонних коробок.",
          "Наклеювання етикеток та маркування.",
          "Робота в чистому та теплому приміщенні."
        ],
        desc_pl: [
          "Pakowanie wyrobów cukierniczych na linii.",
          "Składanie kartonów.",
          "Naklejanie etykiet i oznaczanie.",
          "Praca w czystym i ciepłym pomieszczeniu."
        ]
      }
    ]
  },
  hospitality: {
     name_ua: "HoReCa (Готелі та Ресторани)",
     name_pl: "HoReCa (Hotele i Restauracje)",
     jobs: [
       {
         titles_ua: ["Кухар", "Помічник на кухню", "Піцайоло"],
         titles_pl: ["Kucharz", "Pomoc kuchenna", "Pizzerman"],
         salary: {min: 5000, max: 7000},
         desc_ua: [
           "Приготування страв згідно з технологічними картами.",
           "Підтримання чистоти на робочому місці (HACCP).",
           "Заготовка продуктів на зміну.",
           "Оформлення страв перед подачею."
         ],
         desc_pl: [
           "Przygotowywanie dań zgodnie z recepturami.",
           "Utrzymanie czystości w miejscu pracy (HACCP).",
           "Przygotowywanie półproduktów na zmianę.",
           "Dekorowanie dań przed podaniem."
         ]
       },
       {
        titles_ua: ["Бармен", "Бариста", "Офіціант"],
        titles_pl: ["Barman", "Barista", "Kelner"],
        salary: {min: 4000, max: 5500},
        desc_ua: [
          "Приготування кави та напоїв.",
          "Обслуговування гостей за баром/столиками.",
          "Розрахунок клієнтів (каса).",
          "Створення приємної атмосфери."
        ],
        desc_pl: [
          "Przygotowywanie kawy i napojów.",
          "Obsługa gości przy barze/stolikach.",
          "Rozliczanie klientów (kasa).",
          "Tworzenie miłej atmosfery."
        ]
       }
     ]
  },
  retail: {
    name_ua: "Торгівля",
    name_pl: "Sprzedaż",
    jobs: [
      {
        titles_ua: ["Продавець", "Касир", "Працівник торгового залу"],
        titles_pl: ["Sprzedawca", "Kasjer", "Pracownik hali sprzedaży"],
        salary: {min: 3800, max: 5000},
        desc_ua: [
          "Викладка товару на полиці (ротація).",
          "Обслуговування покупців на касі.",
          "Перевірка термінів придатності.",
          "Підтримання порядку в магазині."
        ],
        desc_pl: [
          "Wykładanie towaru na półki (rotacja).",
          "Obsługa klientów na kasie.",
          "Sprawdzanie terminów ważności.",
          "Utrzymanie porządku w sklepie."
        ]
      },
      {
        titles_ua: ["Стиліст-консультант", "Продавець одягу", "Консультант магазину"],
        titles_pl: ["Sprzedawca", "Stylista-sprzedawca", "Doradca klienta"],
        salary: {min: 4200, max: 5500},
        desc_ua: [
          "Допомога клієнтам у виборі одягу.",
          "Робота в примірочній зоні.",
          "Прийом та розпакування нового товару.",
          "Виконання плану продажів."
        ],
        desc_pl: [
          "Pomoc klientom w doborze odzieży.",
          "Praca w strefie przymierzalni.",
          "Przyjęcie i rozpakowanie nowego towaru.",
          "Realizacja planów sprzedażowych."
        ]
      }
    ]
  },
  beauty: {
    name_ua: "Індустрія краси",
    name_pl: "Beauty",
    jobs: [
      {
        titles_ua: ["Манікюрниця", "Майстер манікюру", "Stylistka paznokci"],
        titles_pl: ["Stylistka paznokci", "Manikiurzystka", "Technik paznokci"],
        salary: {min: 4000, max: 7000},
        desc_ua: [
          "Виконання класичного та апаратного манікюру.",
          "Гель-лак, нарощування, дизайн.",
          "Стерилізація інструментів.",
          "Спілкування з клієнтами."
        ],
        desc_pl: [
          "Wykonywanie manicure klasycznego i frezarkowego.",
          "Hybryda, przedłużanie, zdobienia.",
          "Sterylizacja narzędzi.",
          "Kontakt z klientami."
        ]
      }
    ]
  }

};

// --- 3. Generator Logic ---

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function getMultipleRandom(arr, num) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
}

function generateSalary(min, max) {
  // Add some randomness like 4500, 4800, 5000 to make it look real
  const step = 100;
  const sMin = Math.floor((min + Math.random() * 500) / step) * step;
  const sMax = Math.floor((max + Math.random() * 1000) / step) * step;
  return `${sMin} - ${sMax} PLN`;
}

const JOBS_DB = [];
let jobCounter = 1;

// Generating loop
// We iterate cities, then categories, NOT just categories then cities for everybody.
// To add variety, we randomly SKIP some jobs in some cities so they are not identical.

Object.keys(ROLES).forEach(catKey => {
  const category = ROLES[catKey];
  
  category.jobs.forEach(jobTemplate => {
    
    // For each template, we pick mostly all cities, but randomize slightly
    CITIES.forEach(city => {
      
      // 10% chance to skip a job in a specific city to make lists uneven/natural
      if (Math.random() > 0.9) return; 

      const titleUA = getRandom(jobTemplate.titles_ua);
      const titlePL = getRandom(jobTemplate.titles_pl);
      const salary = generateSalary(jobTemplate.salary.min, jobTemplate.salary.max);

      // Mix descriptions
      const tasksUA = getMultipleRandom(jobTemplate.desc_ua, 3).map(t => `<li>${t}</li>`).join('');
      const tasksPL = getMultipleRandom(jobTemplate.desc_pl, 3).map(t => `<li>${t}</li>`).join('');

      const offersUA = getMultipleRandom(GLOBAL_OFFERS.ua, 4).map(o => `<li>${o}</li>`).join('');
      const offersPL = getMultipleRandom(GLOBAL_OFFERS.pl, 4).map(o => `<li>${o}</li>`).join('');

      const slug = `${city.slug}-${catKey}-${titlePL.toLowerCase().replace(/ł/g, 'l').replace(/ń/g, 'n').replace(/[^a-z0-9]+/g, '-')}-${jobCounter++}`;

      const bodyUA = `
        <div class="vacancy-block">
          <h3>Що ми пропонуємо?</h3>
          <ul>${offersUA}</ul>
          <h3>Ваші обов'язки:</h3>
          <ul>${tasksUA}</ul>
          <div class="salary-box">💰 Зарплата: <strong>${salary}</strong> (нетто/брутто залежить від договору)</div>
        </div>
        <a href="/apply.html" class="btn btn-primary">Відгукнутися на вакансію</a>
      `;

      const bodyPL = `
        <div class="vacancy-block">
          <h3>Co oferujemy?</h3>
          <ul>${offersPL}</ul>
          <h3>Twoje obowiązki:</h3>
          <ul>${tasksPL}</ul>
          <div class="salary-box">💰 Wynagrodzenie: <strong>${salary}</strong> (netto/brutto zal. od umowy)</div>
        </div>
        <a href="/apply.html" class="btn btn-primary">Aplikuj teraz</a>
      `;

      JOBS_DB.push({
        slug: slug,
        category: catKey,
        city: city.ua,
        city_pl: city.pl,
        title: titleUA,
        title_pl: titlePL,
        salary: salary,
        excerpt: `${titleUA} у м. ${city.ua}. ${getRandom(jobTemplate.desc_ua)}`,
        excerpt_pl: `${titlePL} w m. ${city.pl}. ${getRandom(jobTemplate.desc_pl)}`,
        body: bodyUA,
        body_pl: bodyPL,
        cta_text: "Подати заявку",
        cta_text_pl: "Aplikuj",
        cta_link: "/apply.html",
        country: "Poland",
        language: "uk",
        employment_type: "full-time",
        date_posted: new Date().toISOString()
      });

    });
  });
});

fs.writeFileSync(path.join(__dirname, 'content.json'), JSON.stringify(JOBS_DB, null, 2));
console.log(`🎉 Generated ${JOBS_DB.length} unique vacancies across ${CITIES.length} cities.`);
