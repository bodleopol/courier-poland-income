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

// Realistic Polish company names - each job will get a UNIQUE company name generated below
// These are base templates for generating unique company names
const COMPANY_PREFIXES = {
  logistics: ["Marek Transport", "Janusz Logistyka", "Tomek Przewóz", "Piotr Spedycja", "Andrzej Dostawy"],
  production: ["Fabryka Produkt", "Zakład Tech", "Wytwórnia Premium", "Hala Montaż", "Manufaktura Nova"],
  construction: ["Budowlanka Kraków", "Remonty Marek", "BudTeam Andrzej", "Konstrukcje Tomasz", "Instalacje Janusz"],
  hospitality: ["Gastro Kraków", "Restauracja Smaki", "Café Centralny", "Hotel Comfort", "Bistro Pod Lipą"],
  agriculture: ["Gospodarstwo Rolne Kowalski", "Sad Nowak", "Hurtownia BestFruit", "Plantacja Zielony Raj", "Ferma Agro"],
  cleaning: ["Sprzątanie Pro", "CleanMaster Serwis", "Czysty Dom s.c.", "Porządek Firma", "Myjnia Perfect"],
  retail: ["Sklep Centrum", "Market Osiedle", "Butik Moda", "Galeria Styl", "Hurtownia Towar"],
  beauty: ["Salon Piękność", "Studio Uroda", "Fryzjer Stylowy", "Kosmetyka Bella", "Paznokcie Art"],
  education: ["Przedszkole Słoneczko", "Żłobek Misie", "Szkoła Podstawowa", "Centrum Edukacja", "Akademia Dzieci"]
};

const COMPANY_SUFFIXES = ["Sp. z o.o.", "s.c.", "Sp. j.", ""];
let companyCounter = 0;

function generateUniqueCompany(catKey) {
  companyCounter++;
  const prefixes = COMPANY_PREFIXES[catKey] || COMPANY_PREFIXES.logistics;
  const prefix = prefixes[companyCounter % prefixes.length];
  const suffix = COMPANY_SUFFIXES[Math.floor(companyCounter / prefixes.length) % COMPANY_SUFFIXES.length];
  const num = Math.floor(companyCounter / (prefixes.length * COMPANY_SUFFIXES.length));
  
  if (num > 0) {
    return suffix ? `${prefix} ${num} ${suffix}` : `${prefix} ${num}`;
  }
  return suffix ? `${prefix} ${suffix}` : prefix;
}

const SHIFTS = {
  ua: ["Ранок / Вечір", "Тільки нічні", "Позмінно (3 зміни)", "2 дні / 2 дні", "Пн-Пт, 8:00-16:00"],
  pl: ["Rano / Wieczór", "Tylko nocne", "Zmianowa (3 zmiany)", "2 dni / 2 dni", "Pn-Pt, 8:00-16:00"]
};

const START_DATES = {
  ua: ["Терміново", "З наступного тижня", "З 1-го числа", "Протягом місяця", "За домовленістю"],
  pl: ["Od zaraz", "Od przyszłego tygodnia", "Od 1-go", "W ciągu miesiąca", "Do uzgodnienia"]
};

const CONTRACT_TYPES = {
  ua: ["Umowa o pracę", "Umowa Zlecenie", "B2B", "Umowa tymczasowa"],
  pl: ["Umowa o pracę", "Umowa Zlecenie", "B2B", "Umowa tymczasowa"]
};

const WORK_PATTERNS = {
  ua: [
    "5/2 (Пн–Пт)",
    "6/1",
    "4/2",
    "2/2",
    "3/1",
    "7/7",
    "Вихідні плаваючі",
    "Вихідні через тиждень"
  ],
  pl: [
    "5/2 (Pn–Pt)",
    "6/1",
    "4/2",
    "2/2",
    "3/1",
    "7/7",
    "Wolne dni ruchome",
    "Wolne co drugi tydzień"
  ]
};

// Function to generate profession-specific bonuses (NOT from a global pool)
function generateProfessionBonuses(catKey, jobTitleUA, count = 4) {
  const bonuses = {
    ua: [],
    pl: []
  };
  
  // Base bonuses that apply to most jobs
  const baseUA = [
    "Офіційне працевлаштування з першого дня",
    "Стабільні виплати двічі на місяць"
  ];
  const basePL = [
    "Oficjalne zatrudnienie od pierwszego dnia",
    "Stabilne wypłaty dwa razy w miesiącu"
  ];
  
  // Category-specific bonuses
  if (catKey === 'logistics') {
    bonuses.ua.push(
      "Сучасні фургони Mercedes/Renault з GPS",
      "Бензин і паркінг оплачує компанія",
      "Премія за кількість доставлених посилок",
      "Телефон і планшет від компанії для роботи"
    );
    bonuses.pl.push(
      "Nowoczesne busy Mercedes/Renault z GPS",
      "Paliwo i parking pokrywa firma",
      "Premia za liczbę dostarczonych paczek",
      "Telefon służbowy i tablet od firmy"
    );
  } else if (catKey === 'production') {
    bonuses.ua.push(
      "Робоча форма та захисні окуляри видаються безкоштовно",
      "Обід у їдальні заводу за 10-12 zł",
      "Премія за виконання плану (до 500 zł/міс)",
      "Можливість роботи на різних лініях після навчання"
    );
    bonuses.pl.push(
      "Odzież robocza i okulary ochronne bezpłatnie",
      "Obiad w stołówce zakładu za 10-12 zł",
      "Premia za realizację planu (do 500 zł/mies)",
      "Możliwość pracy na różnych liniach po szkoleniu"
    );
  } else if (catKey === 'construction') {
    bonuses.ua.push(
      "Каска, жилет, рукавиці видаються на об'єкті",
      "Доплата +25% за роботу на висоті",
      "Власний інструмент не потрібен — все є",
      "Оплата проїзду до будмайданчика"
    );
    bonuses.pl.push(
      "Kask, kamizelka, rękawice wydawane na budowie",
      "Dodatek +25% za pracę na wysokości",
      "Własne narzędzia nie wymagane — wszystko jest",
      "Zwrot kosztów dojazdu na plac budowy"
    );
  } else if (catKey === 'hospitality') {
    bonuses.ua.push(
      "Безкоштовне харчування під час зміни",
      "Чайові залишаються у вас повністю",
      "Знижка 30% на меню для персоналу",
      "Графік без нічних змін (закриття о 23:00)"
    );
    bonuses.pl.push(
      "Darmowe posiłki podczas zmiany",
      "Napiwki w całości dla Ciebie",
      "Zniżka 30% na menu dla personelu",
      "Grafik bez nocnych zmian (zamknięcie o 23:00)"
    );
  } else if (catKey === 'agriculture') {
    bonuses.ua.push(
      "Оплата від кілограму зібраного врожаю",
      "Безкоштовна вода та чай на полі",
      "Рукавиці та фартухи видаються щотижня",
      "Підвіз від центру міста до плантації"
    );
    bonuses.pl.push(
      "Płatność od kilograma zebranych plonów",
      "Darmowa woda i herbata na polu",
      "Rękawice i fartuchy wydawane co tydzień",
      "Dowóz z centrum miasta na plantację"
    );
  } else if (catKey === 'cleaning') {
    bonuses.ua.push(
      "Хімія та інвентар від компанії",
      "Душова та роздягальня для персоналу",
      "Премія за високу якість прибирання",
      "Графік без виїздів у вихідні (або +50% доплата)"
    );
    bonuses.pl.push(
      "Chemia i sprzęt sprzątający od firmy",
      "Prysznic i szatnia dla personelu",
      "Premia za wysoką jakość sprzątania",
      "Grafik bez wyjazdów w weekendy (lub +50% dodatku)"
    );
  } else if (catKey === 'retail') {
    bonuses.ua.push(
      "Знижка для персоналу 20-30% на товари",
      "Бонус за продажі додаткових товарів",
      "Навчання за рахунок компанії",
      "Можливість роботи тільки у вихідні (вища ставка)"
    );
    bonuses.pl.push(
      "Zniżka dla personelu 20-30% na produkty",
      "Bonus za sprzedaż dodatkowych produktów",
      "Szkolenia na koszt firmy",
      "Możliwość pracy tylko w weekendy (wyższa stawka)"
    );
  } else if (catKey === 'beauty') {
    bonuses.ua.push(
      "Матеріали для роботи надаються (гель-лаки, фрези)",
      "Відсоток від виручки + базова ставка",
      "Гнучкий графік (можна обирати зміни)",
      "Знижка 50% на послуги салону для себе"
    );
    bonuses.pl.push(
      "Materiały zapewnione (hybrydy, frezy)",
      "Procent od przychodu + stawka bazowa",
      "Elastyczny grafik (możesz wybierać zmiany)",
      "Zniżka 50% na usługi salonu dla siebie"
    );
  } else if (catKey === 'education') {
    bonuses.ua.push(
      "Обід для персоналу безкоштовно",
      "Робота без вечірніх змін (до 17:00)",
      "Навчання за рахунок закладу",
      "Тепла атмосфера — діти та батьки довіряють"
    );
    bonuses.pl.push(
      "Darmowy obiad dla personelu",
      "Praca bez zmian wieczornych (do 17:00)",
      "Szkolenia na koszt placówki",
      "Ciepła atmosfera — dzieci i rodzice ufają"
    );
  }
  
  // Add base bonuses
  bonuses.ua = [...baseUA, ...bonuses.ua];
  bonuses.pl = [...basePL, ...bonuses.pl];
  
  // Return requested count (shuffle to add variety)
  const selectedUA = shuffle([...bonuses.ua]).slice(0, count);
  const selectedPL = shuffle([...bonuses.pl]).slice(0, count);
  
  return { ua: selectedUA, pl: selectedPL };
}


// Function to generate human-like support notes (NOT from a template pool)
function generateSupportNote(catKey, cityName, companyName) {
  const templates = {
    ua: [
      `Якщо їдете вперше до ${cityName} — підкажемо, куди звернутися з питань житла та документів. Координатор на зв'язку щодня.`,
      `Перший день на об'єкті буде з наставником — покаже все і пояснить. Є чат у месенджері, де можна питати що завгодно.`,
      `Документи для старту: паспорт, номер PESEL (якщо є), банківська карта. Решту допоможемо оформити вже в ${cityName}.`,
      `Зустріч можлива на вокзалі або біля метро — домовимося про зручний час. Координатор розмовляє українською.`,
      `У перші дні покажемо, де ближча аптека, магазини та зупинки транспорту. Не залишимо наодинці з питаннями.`
    ],
    pl: [
      `Jeśli pierwszy raz jedziesz do ${cityName} — podpowiemy, gdzie załatwić mieszkanie i dokumenty. Koordynator dostępny codziennie.`,
      `Pierwszego dnia będzie opiekun — wszystko pokaże i wytłumaczy. Jest czat, gdzie można pytać o wszystko.`,
      `Dokumenty na start: paszport, numer PESEL (jeśli masz), karta bankowa. Resztę pomożemy załatwić już w ${cityName}.`,
      `Możemy się spotkać na dworcu lub przy metrze — umówimy się na wygodną godzinę. Koordynator mówi po ukraińsku.`,
      `W pierwszych dniach pokażemy, gdzie najbliższa apteka, sklepy i przystanki. Nie zostawimy Cię sam na sam z pytaniami.`
    ]
  };
  
  const uaNote = templates.ua[Math.floor(Math.random() * templates.ua.length)];
  const plNote = templates.pl[Math.floor(Math.random() * templates.pl.length)];
  
  return { ua: uaNote, pl: plNote };
}

const WORKPLACE_DETAILS = {
  ua: [
    "Нове обладнання на робочих місцях.",
    "Робота є цілий рік, без сезонності.",
    "Зрозумілі вимоги та показники ефективності.",
    "Можна працювати понаднормово за бажанням.",
    "Виплата зарплати вчасно, без затримок.",
    "Зв'язок через месенджери (Viber/Telegram).",
    "Сучасні інструменти і техніка.",
    "Стабільні замовлення весь рік.",
    "Прозора система оцінки роботи.",
    "Додаткові зміни доступні за запитом.",
    "Розрахунок за всі відпрацьовані години.",
    "Онлайн-підтримка для працівників.",
    "Обладнання у хорошому стані.",
    "Постійний потік замовлень.",
    "Простi та чіткі правила роботи.",
    "Чітко визначені перерви та час на обід.",
    "Є зрозумілий план задач на кожну зміну.",
    "Працюємо за стандартами якості — все пояснюють на старті.",
    "Дружня атмосфера в команді, без «хаосу» на зміні.",
    "Розподіл задач без «перекосів» між працівниками.",
    "Внутрішні інструкції доступні у друкованому/онлайн форматі.",
    "На місці є старший зміни, який допомагає з питаннями.",
    "Можна уточнювати задачі в процесі — завжди є контакт.",
    "Стабільне навантаження протягом зміни.",
    "Комфортна зона відпочинку під час перерв.",
    "Є можливість підробітків у пікові періоди.",
    "Завдання розписані по кроках — зручно новачкам.",
    "Дотримання норм безпеки та порядку на робочому місці.",
    "Є місце для зберігання особистих речей.",
    "Реальні години — без «зрізань» у табелях.",
    "Зручні маршрути всередині об’єкта (логіка руху пояснюється).",
    "Стабільні зміни, без різких переносів у останній момент.",
    "Об’єкт працює за графіком — без постійних форс-мажорів.",
    "Є короткі щотижневі підсумки та зворотний зв’язок.",
    "Можна обговорити зміну обов’язків після адаптації.",
    "Підтримка менеджера на місці у робочий час.",
    "Планування змін наперед (часто на 2–4 тижні).",
    "Чіткі правила щодо перерв, телефону та форми.",
    "Підказки та маркування зон допомагають швидко зорієнтуватися.",
    "Процеси стандартизовані — менше стресу для новачків."
  ],
  pl: [
    "Nowy sprzęt w miejscu pracy.",
    "Praca przez cały rok, bez sezonowości.",
    "Przejrzyste wymagania i KPI.",
    "Nadgodziny dostępne na życzenie.",
    "Wypłaty terminowe, bez opóźnień.",
    "Komunikacja przez komunikatory.",
    "Nowoczesne narzędzia i technologia.",
    "Stałe zlecenia cały rok.",
    "Transparentny system oceny pracy.",
    "Dodatkowe zmiany na życzenie.",
    "Rozliczenie wszystkich przepracowanych godzin.",
    "Wsparcie online dla pracowników.",
    "Sprzęt w dobrym stanie technicznym.",
    "Ciągły napływ zamówień.",
    "Proste i jasne zasady współpracy.",
    "Jasno określone przerwy i czas na posiłek.",
    "Plan zadań na każdą zmianę.",
    "Standardy jakości wyjaśnione na starcie.",
    "Przyjazna atmosfera w zespole.",
    "Równy podział obowiązków na zmianie.",
    "Instrukcje dostępne w wersji papierowej/online.",
    "Na miejscu jest lider zmiany do wsparcia.",
    "Można dopytać o zadania w trakcie pracy.",
    "Stabilne tempo pracy w ciągu zmiany.",
    "Strefa odpoczynku w czasie przerw.",
    "Możliwość dodatkowych godzin w okresach szczytu.",
    "Zadania opisane krok po kroku — dobre dla nowych.",
    "Nacisk na bezpieczeństwo i porządek na stanowisku.",
    "Miejsce na rzeczy osobiste.",
    "Rzeczywiste rozliczenie godzin.",
    "Czytelne trasy i oznaczenia na obiekcie.",
    "Stabilny grafik bez nagłych zmian w ostatniej chwili.",
    "Procesy bez ciągłych „awarii organizacyjnych”.",
    "Krótkie podsumowania i feedback (często co tydzień).",
    "Możliwość rozmowy o zakresie obowiązków po adaptacji.",
    "Wsparcie menedżera na miejscu w godzinach pracy.",
    "Planowanie zmian z wyprzedzeniem (2–4 tyg.).",
    "Jasne zasady dot. przerw, telefonu i odzieży.",
    "Oznaczenia stref pomagają szybko się odnaleźć.",
    "Standaryzacja procesów — mniej stresu dla nowych."
  ]
};

const LANGUAGE_LEVELS = {
  ua: ["Польська не обов'язкова", "Польська A1-A2", "Польська B1", "Польська B2+", "Українська/російська достатньо"],
  pl: ["Polski niewymagany", "Polski A1-A2", "Polski B1", "Polski B2+", "Ukraiński/rosyjski wystarczy"]
};

const EXPERIENCE_LEVELS = {
  ua: ["Без досвіду", "Мінімальний досвід 1-3 міс.", "Досвід від 6 міс.", "Досвід від 1 року"],
  pl: ["Bez doświadczenia", "Min. doświadczenie 1-3 mies.", "Doświadczenie 6+ mies.", "Doświadczenie 1+ rok"]
};

const DOCUMENTS_NEEDED = {
  ua: ["Паспорт", "PESEL", "Karta Pobytu", "Віза", "Водійські права (для водіїв)", "UDT (для карщиків)"],
  pl: ["Paszport", "PESEL", "Karta Pobytu", "Wiza", "Prawo jazdy (dla kierowców)", "UDT (dla wózków)" ]
};

const HOUSING_OPTIONS = {
  ua: [
    "Житло надається (кімнати 2-4 особи)",
    "Доплата за власне житло (400-600 zł)",
    "Житло поруч з роботою (10-20 хв)",
    "Без житла від роботодавця (допомога в пошуку)",
    "Житло за собівартістю (350-450 zł)"
  ],
  pl: [
    "Zakwaterowanie zapewnione (2-4 osoby)",
    "Dodatek mieszkaniowy (400-600 zł)",
    "Mieszkanie blisko pracy (10-20 min)",
    "Bez zakwaterowania (pomoc w znalezieniu)",
    "Zakwaterowanie po kosztach (350-450 zł)"
  ]
};

const TRANSPORT_OPTIONS = {
  ua: [
    "Підвіз до роботи службовим транспортом",
    "Компенсація проїзду міським транспортом",
    "Паркінг для авто/велосипеда",
    "Проїзний квиток зі знижкою",
    "Локація біля зупинки/метро"
  ],
  pl: [
    "Dojazd do pracy transportem firmowym",
    "Zwrot kosztów komunikacji miejskiej",
    "Parking dla auta/roweru",
    "Karta miejska ze zniżką",
    "Lokalizacja blisko przystanku/metro"
  ]
};

const WORKPLACE_TYPES_BY_CAT = {
  logistics: {
    ua: ["Тип об’єкта: логістичний центр", "Тип об’єкта: склад e-commerce", "Тип об’єкта: термінал доставки", "Тип об’єкта: розподільчий хаб"],
    pl: ["Typ obiektu: centrum logistyczne", "Typ obiektu: magazyn e-commerce", "Typ obiektu: terminal dostaw", "Typ obiektu: hub dystrybucyjny"]
  },
  production: {
    ua: ["Тип об’єкта: виробничий цех", "Тип об’єкта: заводська лінія", "Тип об’єкта: пакувальний зал", "Тип об’єкта: монтажний цех"],
    pl: ["Typ obiektu: hala produkcyjna", "Typ obiektu: linia fabryczna", "Typ obiektu: hala pakowania", "Typ obiektu: sala montażowa"]
  },
  construction: {
    ua: ["Тип об’єкта: будівельний майданчик", "Тип об’єкта: житловий комплекс", "Тип об’єкта: комерційний об’єкт", "Тип об’єкта: реконструкція будівлі"],
    pl: ["Typ obiektu: plac budowy", "Typ obiektu: osiedle mieszkaniowe", "Typ obiektu: obiekt komercyjny", "Typ obiektu: remont budynku"]
  },
  hospitality: {
    ua: ["Тип об’єкта: готель 3–4★", "Тип об’єкта: ресторан/кафе", "Тип об’єкта: резорт/пансіонат", "Тип об’єкта: кейтерінг-центр"],
    pl: ["Typ obiektu: hotel 3–4★", "Typ obiektu: restauracja/kawiarnia", "Typ obiektu: resort/pensjonat", "Typ obiektu: centrum cateringowe"]
  },
  agriculture: {
    ua: ["Тип об’єкта: ферма/господарство", "Тип об’єкта: теплиця", "Тип об’єкта: пакувальний цех (овочі/фрукти)", "Тип об’єкта: сад/плантація"],
    pl: ["Typ obiektu: farma/gospodarstwo", "Typ obiektu: szklarnia", "Typ obiektu: pakowalnia (owoce/warzywa)", "Typ obiektu: sad/plantacja"]
  },
  cleaning: {
    ua: ["Тип об’єкта: офісний центр", "Тип об’єкта: торговий центр", "Тип об’єкта: медичний заклад", "Тип об’єкта: житловий комплекс"],
    pl: ["Typ obiektu: biurowiec", "Typ obiektu: centrum handlowe", "Typ obiektu: placówka medyczna", "Typ obiektu: osiedle mieszkaniowe"]
  },
  retail: {
    ua: ["Тип об’єкта: торговий зал", "Тип об’єкта: супермаркет", "Тип об’єкта: склад магазину", "Тип об’єкта: аутлет"],
    pl: ["Typ obiektu: sala sprzedaży", "Typ obiektu: supermarket", "Typ obiektu: magazyn sklepowy", "Typ obiektu: outlet"]
  }
};
function getWorkplaceTypes(catKey) {
  return WORKPLACE_TYPES_BY_CAT[catKey] || WORKPLACE_TYPES_BY_CAT.logistics;
}

const TEAM_SIZES = {
  ua: [
    "Команда: 6–10 осіб у зміні",
    "Команда: 12–18 осіб у зміні",
    "Команда: 20+ осіб на зміні",
    "Команда: компактна команда до 6 осіб",
    "Команда: окремий бригадир на кожну зміну"
  ],
  pl: [
    "Zespół: 6–10 osób na zmianie",
    "Zespół: 12–18 osób na zmianie",
    "Zespół: 20+ osób na zmianie",
    "Zespół: mały zespół do 6 osób",
    "Zespół: brygadzista na każdej zmianie"
  ]
};

const ONBOARDING_NOTES = {
  ua: [
    "Перший день — навчання та супровід на місці.",
    "Видаємо чек‑лист по процесах у перший день.",
    "Є коротке навчання перед стартом зміни.",
    "Пробна зміна з наставником.",
    "Швидкий інструктаж та тест безпеки."
  ],
  pl: [
    "Pierwszy dzień — szkolenie i opieka na miejscu.",
    "Lista kontrolna procesów w pierwszym dniu.",
    "Krótkie szkolenie przed startem zmiany.",
    "Zmiana próbna z mentorem.",
    "Szybki instruktaż i test BHP."
  ]
};

const DAILY_TASKS = {
  ua: [
    "Короткий щоденний брифінг перед зміною.",
    "Ротація станцій/зон під час зміни.",
    "Ведення простих чек‑листів якості.",
    "Фіксація виконання через сканер/таблет.",
    "Контроль чистоти робочої зони.",
    "Дотримання стандартів безпеки на об’єкті.",
    "Робота з легким ручним інструментом.",
    "Комунікація з бригадиром/майстром."
  ],
  pl: [
    "Krótki briefing przed zmianą.",
    "Rotacja stanowisk/stref w trakcie zmiany.",
    "Proste checklisty jakości.",
    "Rejestracja wykonania przez skaner/tablet.",
    "Kontrola porządku na stanowisku.",
    "Przestrzeganie zasad bezpieczeństwa.",
    "Praca z lekkimi narzędziami ręcznymi.",
    "Kontakt z brygadzistą/majstrem."
  ]
};

const INDUSTRY_SECTORS_BY_CAT = {
  production: {
    ua: ["Сектор: FMCG (повсякденні товари)", "Сектор: automotive (автодеталі)", "Сектор: fashion (одяг/взуття)", "Сектор: food (харчове виробництво)", "Сектор: electronics (електроніка)", "Сектор: pharma (фарма/косметика)"],
    pl: ["Sektor: FMCG (towary codzienne)", "Sektor: automotive (części)", "Sektor: fashion (odzież/obuwie)", "Sektor: food (produkcja spożywcza)", "Sektor: electronics (elektronika)", "Sektor: pharma (farmacja/kosmetyki)"]
  },
  construction: {
    ua: ["Сектор: житлове будівництво", "Сектор: комерційне будівництво", "Сектор: дорожнє будівництво", "Сектор: ремонт та реконструкція"],
    pl: ["Sektor: budownictwo mieszkaniowe", "Sektor: budownictwo komercyjne", "Sektor: budownictwo drogowe", "Sektor: remonty i rekonstrukcje"]
  },
  agriculture: {
    ua: ["Сектор: овочівництво", "Сектор: садівництво", "Сектор: тваринництво", "Сектор: переробка с/г продукції"],
    pl: ["Sektor: warzywnictwo", "Sektor: sadownictwo", "Sektor: hodowla", "Sektor: przetwórstwo rolne"]
  },
  cleaning: {
    ua: ["Сектор: комерційний клінінг", "Сектор: промисловий клінінг", "Сектор: готельний сервіс", "Сектор: медичний клінінг"],
    pl: ["Sektor: sprzątanie komercyjne", "Sektor: sprzątanie przemysłowe", "Sektor: serwis hotelowy", "Sektor: sprzątanie medyczne"]
  }
};
function getIndustrySectors(catKey) {
  return INDUSTRY_SECTORS_BY_CAT[catKey] || INDUSTRY_SECTORS_BY_CAT.production;
}

const EQUIPMENT_LIST_BY_CAT = {
  production: {
    ua: ["Обладнання: сканери Zebra/Honeywell", "Обладнання: пакувальні машини", "Обладнання: конвеєрні лінії", "Обладнання: промислові тележки"],
    pl: ["Sprzęt: skanery Zebra/Honeywell", "Sprzęt: maszyny pakujące", "Sprzęt: linie taśmowe", "Sprzęt: wózki przemysłowe"]
  },
  construction: {
    ua: ["Обладнання: будівельні інструменти", "Обладнання: бетонозмішувач", "Обладнання: буд. ліси та помости", "Обладнання: електроінструменти"],
    pl: ["Sprzęt: narzędzia budowlane", "Sprzęt: betoniarka", "Sprzęt: rusztowania", "Sprzęt: elektronarzędzia"]
  },
  agriculture: {
    ua: ["Обладнання: с/г техніка", "Обладнання: ручний садовий інструмент", "Обладнання: системи зрошення", "Обладнання: сортувальні лінії"],
    pl: ["Sprzęt: maszyny rolnicze", "Sprzęt: ręczne narzędzia ogrodnicze", "Sprzęt: systemy nawadniające", "Sprzęt: linie sortujące"]
  },
  cleaning: {
    ua: ["Обладнання: промислові пилососи", "Обладнання: мийні машини", "Обладнання: полірувальники підлоги", "Обладнання: хімічні засоби (надаються)"],
    pl: ["Sprzęt: odkurzacze przemysłowe", "Sprzęt: maszyny czyszczące", "Sprzęt: polerki do podłóg", "Sprzęt: środki chemiczne (zapewnione)"]
  },
  logistics: {
    ua: ["Обладнання: електричні рокли", "Обладнання: сканери штрих-кодів", "Обладнання: навантажувачі", "Обладнання: сортувальні системи"],
    pl: ["Sprzęt: wózki elektryczne", "Sprzęt: skanery kodów kreskowych", "Sprzęt: wózki widłowe", "Sprzęt: systemy sortujące"]
  }
};
function getEquipmentList(catKey) {
  return EQUIPMENT_LIST_BY_CAT[catKey] || EQUIPMENT_LIST_BY_CAT.production;
}

const PHYSICAL_REQUIREMENTS_BY_CAT = {
  production: {
    ua: ["Фізичні вимоги: піднімання до 15 кг", "Фізичні вимоги: робота стоячи 6–8 год", "Фізичні вимоги: робота у швидкому темпі", "Фізичні вимоги: багато ходьби протягом зміни"],
    pl: ["Wymagania fizyczne: dźwiganie do 15 kg", "Wymagania fizyczne: praca stojąca 6–8 h", "Wymagania fizyczne: praca w szybkim tempie", "Wymagania fizyczne: dużo chodzenia w trakcie zmiany"]
  },
  construction: {
    ua: ["Фізичні вимоги: піднімання до 25 кг", "Фізичні вимоги: робота на висоті", "Фізичні вимоги: робота на відкритому повітрі", "Фізичні вимоги: фізична витривалість"],
    pl: ["Wymagania fizyczne: dźwiganie do 25 kg", "Wymagania fizyczne: praca na wysokości", "Wymagania fizyczne: praca na zewnątrz", "Wymagania fizyczne: wytrzymałość fizyczna"]
  },
  agriculture: {
    ua: ["Фізичні вимоги: робота на відкритому повітрі", "Фізичні вимоги: нахил/присідання", "Фізичні вимоги: піднімання до 15 кг", "Фізичні вимоги: робота у різних погодних умовах"],
    pl: ["Wymagania fizyczne: praca na zewnątrz", "Wymagania fizyczne: pochylanie/przysiady", "Wymagania fizyczne: dźwiganie do 15 kg", "Wymagania fizyczne: praca w różnych warunkach pogodowych"]
  },
  cleaning: {
    ua: ["Фізичні вимоги: піднімання до 10 кг", "Фізичні вимоги: робота стоячи 4–6 год", "Фізичні вимоги: багато ходьби протягом зміни", "Фізичні вимоги: робота ротаційна"],
    pl: ["Wymagania fizyczne: dźwiganie do 10 kg", "Wymagania fizyczne: praca stojąca 4–6 h", "Wymagania fizyczne: dużo chodzenia w trakcie zmiany", "Wymagania fizyczne: praca rotacyjna"]
  },
  logistics: {
    ua: ["Фізичні вимоги: піднімання до 20 кг", "Фізичні вимоги: робота стоячи 6–8 год", "Фізичні вимоги: багато ходьби протягом зміни", "Фізичні вимоги: робота у швидкому темпі"],
    pl: ["Wymagania fizyczne: dźwiganie do 20 kg", "Wymagania fizyczne: praca stojąca 6–8 h", "Wymagania fizyczne: dużo chodzenia w trakcie zmiany", "Wymagania fizyczne: praca w szybkim tempie"]
  }
};
function getPhysicalRequirements(catKey) {
  return PHYSICAL_REQUIREMENTS_BY_CAT[catKey] || PHYSICAL_REQUIREMENTS_BY_CAT.production;
}

const SHIFT_STRUCTURE = {
  ua: [
    "Структура зміни: ранкова зона",
    "Структура зміни: вечірня зона",
    "Структура зміни: нічна зона",
    "Структура зміни: ротація зон кожні 2-3 год",
    "Структура зміни: одна основна зона"
  ],
  pl: [
    "Struktura zmiany: strefa poranna",
    "Struktura zmiany: strefa wieczorna",
    "Struktura zmiany: strefa nocna",
    "Struktura zmiany: rotacja stref co 2-3 h",
    "Struktura zmiany: jedna główna strefa"
  ]
};

const LANGUAGE_REQUIREMENTS = {
  ua: [
    "Польська мова: базовий рівень A1/A2.",
    "Польська мова не обов'язкова — інструктаж українською.",
    "Потрібна комунікативна польська (A2/B1).",
    "Можна без польської, але з бажанням навчатися.",
    "Мінімальна англійська для інструкцій (A1)."
  ],
  pl: [
    "Język polski: poziom podstawowy A1/A2.",
    "Polski nieobowiązkowy — instruktaż po ukraińsku.",
    "Wymagana komunikatywna polszczyzna (A2/B1).",
    "Można bez polskiego, ale z chęcią nauki.",
    "Minimalny angielski do instrukcji (A1)."
  ]
};

const EXPERIENCE_REQUIREMENTS = {
  ua: [
    "Досвід не обов'язковий — навчання на місці.",
    "Бажано 3+ місяців на схожій посаді.",
    "Досвід у виробництві/складі буде перевагою.",
    "Потрібна уважність і відповідальність.",
    "Готовність працювати фізично (12–20 тис. кроків/день)."
  ],
  pl: [
    "Doświadczenie nieobowiązkowe — szkolenie na miejscu.",
    "Mile widziane 3+ miesiące na podobnym stanowisku.",
    "Doświadczenie w produkcji/magazynie będzie atutem.",
    "Wymagana dokładność i odpowiedzialność.",
    "Gotowość do pracy fizycznej (12–20 tys. kroków/dzień)."
  ]
};

const DOCUMENT_REQUIREMENTS = {
  ua: [
    "Потрібен PESEL або готовність оформити.",
    "Допомагаємо з оформленням документів на старті.",
    "Потрібен дозвіл на роботу або карта побиту.",
    "Можливий старт без PESEL (допомога на місці).",
    "Вимога: медичний огляд (компенсуємо)."
  ],
  pl: [
    "Wymagany PESEL lub gotowość do wyrobienia.",
    "Pomagamy w dokumentach na start.",
    "Wymagane pozwolenie na pracę lub karta pobytu.",
    "Możliwy start bez PESEL (pomoc na miejscu).",
    "Wymagane badania lekarskie (zwrot kosztów)."
  ]
};

const HOUSING_REQUIREMENTS = {
  ua: [
    "Житло надається (оплата 450–650 zł/міс.).",
    "Житло не надається — допоможемо з пошуком.",
    "Можлива доплата за власне житло.",
    "Кімната 2–3 людини, інтернет включено.",
    "Заселення за 1–2 дні до старту."
  ],
  pl: [
    "Zakwaterowanie zapewnione (450–650 zł/mies.).",
    "Zakwaterowania brak — pomagamy znaleźć.",
    "Możliwy dodatek mieszkaniowy.",
    "Pokój 2–3 osobowy, internet w cenie.",
    "Zakwaterowanie 1–2 dni przed startem."
  ]
};


// City-specific context for unique per-page content
const CITY_CONTEXT = {
  warsaw:    { ua: "Варшава — найбільший ринок праці в Польщі, столиця з розвиненою інфраструктурою та високим попитом на робочу силу.", pl: "Warszawa — największy rynek pracy w Polsce, stolica z rozwiniętą infrastrukturą i dużym zapotrzebowaniem na pracowników." },
  krakow:    { ua: "Краків — друге за величиною місто Польщі, відоме великою кількістю сервісних центрів та туристичною інфраструктурою.", pl: "Kraków — drugie co do wielkości miasto Polski, znane z licznych centrów usługowych i infrastruktury turystycznej." },
  wroclaw:   { ua: "Вроцлав — динамічне місто з великою кількістю логістичних центрів та виробництв.", pl: "Wrocław — dynamiczne miasto z dużą liczbą centrów logistycznych i zakładów produkcyjnych." },
  poznan:    { ua: "Познань — потужний промисловий центр на заході Польщі з розвиненою логістикою.", pl: "Poznań — silne centrum przemysłowe w zachodniej Polsce z rozwiniętą logistyką." },
  gdansk:    { ua: "Гданськ — портове місто з розвиненою судноплавною і логістичною галуззю.", pl: "Gdańsk — miasto portowe z rozwiniętą branżą morską i logistyczną." },
  szczecin:  { ua: "Щецін — портовий хаб біля кордону з Німеччиною, зручна логістика та доступ до EU.", pl: "Szczecin — hub portowy blisko granicy z Niemcami, wygodna logistyka i dostęp do UE." },
  lodz:      { ua: "Лодзь — колишня текстильна столиця Польщі, тепер великий логістичний та виробничий центр.", pl: "Łódź — była stolica tekstylna Polski, obecnie duże centrum logistyczne i produkcyjne." },
  katowice:  { ua: "Катовіце — серце Сілезького регіону з великою кількістю виробничих підприємств.", pl: "Katowice — serce regionu śląskiego z licznymi zakładami produkcyjnymi." },
  lublin:    { ua: "Люблін — найбільше місто на сході Польщі з розвиненим агро- та харчовим сектором.", pl: "Lublin — największe miasto wschodniej Polski z rozwiniętym sektorem rolno-spożywczym." },
  bialystok: { ua: "Білосток — місто на північному сході, близькість до кордону, зростаючий ринок праці.", pl: "Białystok — miasto na północnym wschodzie, bliskość granicy, rosnący rynek pracy." },
  rzeszow:   { ua: "Ряшів — столиця Підкарпаття, динамічно розвивається, зростає попит на працівників.", pl: "Rzeszów — stolica Podkarpacia, dynamicznie się rozwija, rosnące zapotrzebowanie na pracowników." },
  torun:     { ua: "Торунь — історичне місто з розвиненою харчовою промисловістю та виробництвом.", pl: "Toruń — zabytkowe miasto z rozwiniętym przemysłem spożywczym i produkcją." },
  plock:     { ua: "Плоцьк — промислове місто на р. Вісла, відоме нафтопереробкою та хімічною промисловістю.", pl: "Płock — miasto przemysłowe nad Wisłą, znane z rafinerii i przemysłu chemicznego." },
  sosnowiec: { ua: "Сосновець — частина Сілезької агломерації, великий промисловий і логістичний потенціал.", pl: "Sosnowiec — część aglomeracji śląskiej, duży potencjał przemysłowy i logistyczny." },
  gdynia:    { ua: "Гдиня — портове місто Тріміста, центр морської логістики та контейнерних перевезень.", pl: "Gdynia — miasto portowe Trójmiasta, centrum logistyki morskiej i kontenerowej." }
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
        titles_ua: ["Водій категорії C+E", "Далекобійник", "Водій міжнародник"],
        titles_pl: ["Kierowca C+E", "Kierowca międzynarodowy", "Kierowca ciągnika siodłowego"],
        salary: { min: 8000, max: 12000 },
        desc_ua: [
          "Міжнародні перевезення (Європа).",
          "Дотримання режиму праці та відпочинку (тахограф).",
          "Робота в системі 3/1 або 4/1.",
          "Сучасний автопарк (Mercedes, Volvo)."
        ],
        desc_pl: [
          "Transport międzynarodowy (Europa).",
          "Przestrzeganie czasu pracy (tachograf).",
          "System pracy 3/1 lub 4/1.",
          "Nowoczesna flota (Mercedes, Volvo)."
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
    name_ua: "Будівництво та Ремонт",
    name_pl: "Budownictwo i Remonty",
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
      },
      {
        titles_ua: ["Сантехнік", "Гідравлік", "Монтер санітарних систем"],
        titles_pl: ["Hydraulik", "Monter instalacji sanitarnych", "Instalator wod-kan"],
        salary: { min: 6000, max: 8500 },
        desc_ua: [
          "Монтаж систем водопостачання та каналізації.",
          "Встановлення котлів та радіаторів.",
          "Підключення сантехніки (ванни, душові).",
          "Робота з трубами PEX, PP, мідь."
        ],
        desc_pl: [
          "Montaż instalacji wodno-kanalizacyjnych.",
          "Instalacja kotłów i grzejników.",
          "Biały montaż (wanny, prysznice).",
          "Praca z rurami PEX, PP, miedź."
        ]
      },
      {
        titles_ua: ["Зварювальник MIG/MAG", "Зварювальник TIG", "Слюсар-зварювальник"],
        titles_pl: ["Spawacz MIG/MAG", "Spawacz TIG", "Ślusarz-spawacz"],
        salary: { min: 7000, max: 11000 },
        desc_ua: [
          "Зварювання металоконструкцій методом 135/136.",
          "Читання технічних креслень.",
          "Підготовка деталей до зварювання (шліфування).",
          "Контроль якості швів."
        ],
        desc_pl: [
          "Spawanie konstrukcji stalowych metodą 135/136.",
          "Czytanie rysunku technicznego.",
          "Szlifowanie i przygotowanie detali.",
          "Kontrola jakości spoin."
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
        titles_ua: ["Оператор ЧПУ (CNC)", "Фрезерувальник", "Токар CNC"],
        titles_pl: ["Operator CNC", "Frezer CNC", "Tokarz CNC"],
        salary: { min: 6500, max: 9500 },
        desc_ua: [
          "Налагодження та обслуговування верстатів ЧПУ.",
          "Коригування програм (Fanuc, Siemens, Heidenhain).",
          "Вимірювання готових деталей мікрометром.",
          "Заміна інструментів."
        ],
        desc_pl: [
          "Ustawianie i obsługa maszyn CNC.",
          "Korekta programów (Fanuc, Siemens, Heidenhain).",
          "Pomiary detali mikrometrem.",
          "Wymiana narzędzi."
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
  agriculture: {
    name_ua: "Сезонні роботи (Сільське господарство)",
    name_pl: "Prace Sezonowe (Rolnictwo)",
    jobs: [
       {
        titles_ua: ["Збирач ягід", "Працівник теплиць", "Помічник садівника"],
        titles_pl: ["Zbieracz owoców", "Pracownik szklarni", "Pomocnik ogrodnika"],
        salary: { min: 4000, max: 6000 },
        desc_ua: [
          "Збір полуниці/лохини/яблук (залежно від сезону).",
          "Догляд за рослинами в теплицях.",
          "Сортування та пакування овочів.",
          "Робота на свіжому повітрі."
        ],
        desc_pl: [
          "Zbiór truskawek/borówek/jabłek (zależnie od sezonu).",
          "Pielęgnacja roślin w szklarniach.",
          "Sortowanie i pakowanie warzyw.",
          "Praca na świeżym powietrzu."
        ]
       }
    ]
  },
  cleaning: {
     name_ua: "Клінінг та Сервіс",
     name_pl: "Sprzątanie i Serwis",
     jobs: [
      {
        titles_ua: ["Прибиральниця офісів", "Покоївка в готель", "Клінер"],
        titles_pl: ["Sprzątaczka biurowa", "Pokojówka", "Osoba sprzątająca"],
        salary: { min: 3600, max: 4800 },
        desc_ua: [
          "Прибирання офісних приміщень (вечірні зміни).",
          "Підготовка номерів у готелі (зміна білизни).",
          "Миття вікон та підлоги.",
          "Робота з професійною хімією."
        ],
        desc_pl: [
          "Sprzątanie biur (zmiany wieczorne).",
          "Sprzątanie pokoi hotelowych (wymiana pościeli).",
          "Mycie okien i podłóg.",
          "Praca z profesjonalną chemią."
        ]
      }
     ]
  },
  hospitality: {
     name_ua: "HoReCa (Готелі та Ресторани)",
     name_pl: "HoReCa (Hotele i Restauracje)",
     jobs: [
       {
         titles_ua: ["Помічник кухаря", "Асистент кухні", "Кухонний працівник"],
         titles_pl: ["Pomoc kuchenna", "Asystent kuchni", "Pracownik kuchni"],
         salary: {min: 4200, max: 5600},
         desc_ua: [
           "Підготовка продуктів до приготування (нарізка, очищення).",
           "Дотримання чистоти на кухні та миття інвентарю.",
           "Допомога кухарю під час сервісу.",
           "Розкладка інгредієнтів за станціями."
         ],
         desc_pl: [
           "Przygotowanie produktów (krojenie, obieranie).",
           "Utrzymanie czystości kuchni i mycie sprzętu.",
           "Wsparcie kucharza podczas serwisu.",
           "Rozkładanie składników na stanowiskach."
         ]
       },
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
       },
       {
        titles_ua: ["Кондитер", "Помічник кондитера", "Працівник кондитерського цеху"],
        titles_pl: ["Cukiernik", "Pomoc cukiernika", "Pracownik cukierni"],
        salary: {min: 4500, max: 6200},
        desc_ua: [
          "Приготування тіст і кремів згідно рецептур.",
          "Оформлення тортів та десертів.",
          "Контроль якості та температурних режимів.",
          "Підготовка продукції до вітрини."
        ],
        desc_pl: [
          "Przygotowanie ciast i kremów według receptur.",
          "Dekorowanie tortów i deserów.",
          "Kontrola jakości i temperatur.",
          "Przygotowanie produktów do witryny."
        ]
       },
       {
        titles_ua: ["Мийник посуду", "Помічник на змив", "Посудомийник"],
        titles_pl: ["Zmywak", "Pomoc na zmywaku", "Pracownik zmywalni"],
        salary: {min: 3800, max: 5000},
        desc_ua: [
          "Миття посуду та кухонного інвентарю.",
          "Підтримка чистоти у зоні змиву.",
          "Сортування посуду та скла.",
          "Допомога кухні при піковому навантаженні."
        ],
        desc_pl: [
          "Mycie naczyń i sprzętu kuchennego.",
          "Utrzymanie porządku w zmywalni.",
          "Segregacja naczyń i szkła.",
          "Pomoc kuchni w godzinach szczytu."
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
  },
  education: {
     name_ua: "Освіта та Виховання",
     name_pl: "Edukacja",
     jobs: [
       {
         titles_ua: ["Помічник вихователя", "Няня в садок", "Асистент вчителя"],
         titles_pl: ["Pomoc nauczyciela", "Niania", "Asystent w przedszkolu"],
         salary: {min: 3800, max: 4800},
         desc_ua: [
           "Допомога вихователю в проведенні занять.",
           "Догляд за дітьми під час обіду та прогулянок.",
           "Підтримання чистоти в ігровій зоні.",
           "Організація ігор для дітей."
         ],
         desc_pl: [
           "Pomoc w prowadzeniu zajęć.",
           "Opieka nad dziećmi podczas posiłków.",
           "Utrzymanie porządku w sali.",
           "Organizacja zabaw."
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
  const useHourly = Math.random() < 0.35;
  if (useHourly) {
    const hMin = Math.max(18, Math.round(sMin / 168));
    const hMax = Math.max(hMin + 2, Math.round(sMax / 168));
    return `${hMin} - ${hMax} PLN/h`;
  }
  return `${sMin} - ${sMax} PLN`;
}

const JOBS_DB = [];
let jobCounter = 1;
const usedSignatures = new Set();

// Generating loop
// We iterate cities, then categories, NOT just categories then cities for everybody.
// To add variety, we randomly SKIP some jobs in some cities so they are not identical.

Object.keys(ROLES).forEach(catKey => {
  const category = ROLES[catKey];
  
  category.jobs.forEach(jobTemplate => {
    
    // For each template, we pick mostly all cities, but randomize slightly
    CITIES.forEach(city => {
      
      // 70% chance to skip a job in a specific city to reduce total count and add variety
      if (Math.random() > 0.3) return; 

      let titleUA;
      let titlePL;
      let salary;
      let company;
      let shiftsUA;
      let shiftsPL;
      let startUA;
      let startPL;
      let contractUA;
      let contractPL;
      let patternUA;
      let patternPL;
      let taskItemsUA;
      let taskItemsPL;
      let offerItemsUA;
      let offerItemsPL;
      let detailItemsUA;
      let detailItemsPL;
      let requirementItemsUA;
      let requirementItemsPL;
      let languageUA;
      let languagePL;
      let experienceUA;
      let experiencePL;
      let housingUA;
      let housingPL;
      let transportUA;
      let transportPL;
      let documentsUA;
      let documentsPL;
      let workplaceUA;
      let workplacePL;
      let teamUA;
      let teamPL;
      let onboardingUA;
      let onboardingPL;
      let dailyUA;
      let dailyPL;
      let sectorUA;
      let sectorPL;
      let equipmentUA;
      let equipmentPL;
      let physicalUA;
      let physicalPL;
      let shiftStructUA;
      let shiftStructPL;
      
      // Categories that should have sector/equipment fields
      const categoriesWithSector = ['production', 'construction', 'agriculture', 'cleaning', 'logistics'];
      let tasksUA;
      let tasksPL;
      let offersUA;
      let offersPL;
      let signature;
      let tries = 0;

      const headingsUA = {
        offers: ["Що ми пропонуємо?", "Умови та бонуси", "Переваги роботи", "Що входить у пакет?"],
        info: ["Додаткова інформація", "Як проходить робота", "Важливі деталі", "Організація процесу"],
        req: ["Вимоги", "Кого шукаємо", "Очікування до кандидата", "Критерії"],
        housing: ["Проживання та транспорт", "Житло й доїзд", "Де жити і як доїхати", "Логістика"],
        format: ["Формат роботи", "Робоче середовище", "Команда і адаптація", "Як усе влаштовано"],
        daily: ["Щоденні процеси", "Як проходить зміна", "Рутина на об’єкті", "Організація дня"],
        duties: ["Ваші обов'язки:", "Що потрібно робити:", "Зона відповідальності:", "Основні задачі:"]
      };

      const headingsPL = {
        offers: ["Co oferujemy?", "Warunki i bonusy", "Korzyści z pracy", "Pakiet dla pracownika"],
        info: ["Dodatkowe informacje", "Jak wygląda praca", "Ważne szczegóły", "Organizacja procesu"],
        req: ["Wymagania", "Kogo szukamy", "Oczekiwania wobec kandydata", "Kryteria"],
        housing: ["Zakwaterowanie i dojazd", "Mieszkanie i dojazd", "Gdzie mieszkasz i jak dojeżdżasz", "Logistyka"],
        format: ["Format pracy", "Środowisko pracy", "Zespół i wdrożenie", "Jak to działa"],
        daily: ["Codzienne procesy", "Jak wygląda zmiana", "Rutyna na obiekcie", "Organizacja dnia"],
        duties: ["Twoje obowiązki:", "Co będziesz robić:", "Zakres zadań:", "Główne zadania:"]
      };

      do {
        titleUA = getRandom(jobTemplate.titles_ua);
        titlePL = getRandom(jobTemplate.titles_pl);
        salary = generateSalary(jobTemplate.salary.min, jobTemplate.salary.max);

        company = generateUniqueCompany(catKey);
        
        // SYNC UA/PL: Use same index for shifts, patterns, start, contracts
        const shiftIndex = Math.floor(Math.random() * Math.min(SHIFTS.ua.length, SHIFTS.pl.length));
        shiftsUA = SHIFTS.ua[shiftIndex];
        shiftsPL = SHIFTS.pl[shiftIndex];
        
        const patternIndex = Math.floor(Math.random() * Math.min(WORK_PATTERNS.ua.length, WORK_PATTERNS.pl.length));
        patternUA = WORK_PATTERNS.ua[patternIndex];
        patternPL = WORK_PATTERNS.pl[patternIndex];
        
        const startIndex = Math.floor(Math.random() * Math.min(START_DATES.ua.length, START_DATES.pl.length));
        startUA = START_DATES.ua[startIndex];
        startPL = START_DATES.pl[startIndex];
        
        const contractIndex = Math.floor(Math.random() * Math.min(CONTRACT_TYPES.ua.length, CONTRACT_TYPES.pl.length));
        contractUA = CONTRACT_TYPES.ua[contractIndex];
        contractPL = CONTRACT_TYPES.pl[contractIndex];

        // Mix descriptions
        taskItemsUA = getMultipleRandom(jobTemplate.desc_ua, 3);
        taskItemsPL = getMultipleRandom(jobTemplate.desc_pl, 3);
        tasksUA = taskItemsUA.map(t => `<li>${t}</li>`).join('');
        tasksPL = taskItemsPL.map(t => `<li>${t}</li>`).join('');

        const offerCount = 4 + Math.floor(Math.random() * 2);
        const bonuses = generateProfessionBonuses(catKey, titleUA, offerCount);
        offerItemsUA = bonuses.ua;
        offerItemsPL = bonuses.pl;
        offersUA = offerItemsUA.map(o => `<li>${o}</li>`).join('');
        offersPL = offerItemsPL.map(o => `<li>${o}</li>`).join('');

        const supportNote = generateSupportNote(catKey, city.ua, company);
        detailItemsUA = [
          supportNote.ua,
          ...getMultipleRandom(WORKPLACE_DETAILS.ua, 2 + Math.floor(Math.random() * 2))
        ];
        detailItemsPL = [
          supportNote.pl,
          ...getMultipleRandom(WORKPLACE_DETAILS.pl, 2 + Math.floor(Math.random() * 2))
        ];

        // SYNC UA/PL: Use same index for language, experience, housing, transport
        const langIndex = Math.floor(Math.random() * Math.min(LANGUAGE_LEVELS.ua.length, LANGUAGE_LEVELS.pl.length));
        languageUA = LANGUAGE_LEVELS.ua[langIndex];
        languagePL = LANGUAGE_LEVELS.pl[langIndex];
        
        const expIndex = Math.floor(Math.random() * Math.min(EXPERIENCE_LEVELS.ua.length, EXPERIENCE_LEVELS.pl.length));
        experienceUA = EXPERIENCE_LEVELS.ua[expIndex];
        experiencePL = EXPERIENCE_LEVELS.pl[expIndex];
        
        const housingIndex = Math.floor(Math.random() * Math.min(HOUSING_OPTIONS.ua.length, HOUSING_OPTIONS.pl.length));
        housingUA = HOUSING_OPTIONS.ua[housingIndex];
        housingPL = HOUSING_OPTIONS.pl[housingIndex];
        
        const transportIndex = Math.floor(Math.random() * Math.min(TRANSPORT_OPTIONS.ua.length, TRANSPORT_OPTIONS.pl.length));
        transportUA = TRANSPORT_OPTIONS.ua[transportIndex];
        transportPL = TRANSPORT_OPTIONS.pl[transportIndex];
        // SYNC UA/PL: Use same index for documents, workplace, team, onboarding
        const docIndices = [];
        for (let i = 0; i < 2; i++) {
          const idx = Math.floor(Math.random() * Math.min(DOCUMENTS_NEEDED.ua.length, DOCUMENTS_NEEDED.pl.length));
          docIndices.push(idx);
        }
        const uniqueDocIndices = [...new Set(docIndices)];
        documentsUA = `Документи: ${uniqueDocIndices.map(i => DOCUMENTS_NEEDED.ua[i]).join(', ')}`;
        documentsPL = `Dokumenty: ${uniqueDocIndices.map(i => DOCUMENTS_NEEDED.pl[i]).join(', ')}`;
        
        const workplaceIndex = Math.floor(Math.random() * Math.min(getWorkplaceTypes(catKey).ua.length, getWorkplaceTypes(catKey).pl.length));
        workplaceUA = getWorkplaceTypes(catKey).ua[workplaceIndex];
        workplacePL = getWorkplaceTypes(catKey).pl[workplaceIndex];
        
        const teamIndex = Math.floor(Math.random() * Math.min(TEAM_SIZES.ua.length, TEAM_SIZES.pl.length));
        teamUA = TEAM_SIZES.ua[teamIndex];
        teamPL = TEAM_SIZES.pl[teamIndex];
        
        const onboardingIndex = Math.floor(Math.random() * Math.min(ONBOARDING_NOTES.ua.length, ONBOARDING_NOTES.pl.length));
        onboardingUA = ONBOARDING_NOTES.ua[onboardingIndex];
        onboardingPL = ONBOARDING_NOTES.pl[onboardingIndex];
        dailyUA = getMultipleRandom(DAILY_TASKS.ua, 2 + Math.floor(Math.random() * 2));
        dailyPL = getMultipleRandom(DAILY_TASKS.pl, 2 + Math.floor(Math.random() * 2));
        
        // Only add sector/equipment for specific categories (production, construction, agriculture, cleaning)
        // NOT for logistics, hospitality, retail, beauty, education
        // SYNC UA/PL: Use same index
        if (categoriesWithSector.includes(catKey)) {
          const sectorIndex = Math.floor(Math.random() * Math.min(getIndustrySectors(catKey).ua.length, getIndustrySectors(catKey).pl.length));
          sectorUA = getIndustrySectors(catKey).ua[sectorIndex];
          sectorPL = getIndustrySectors(catKey).pl[sectorIndex];
          
          const equipIndex = Math.floor(Math.random() * Math.min(getEquipmentList(catKey).ua.length, getEquipmentList(catKey).pl.length));
          equipmentUA = getEquipmentList(catKey).ua[equipIndex];
          equipmentPL = getEquipmentList(catKey).pl[equipIndex];
          
          const physicalIndex = Math.floor(Math.random() * Math.min(getPhysicalRequirements(catKey).ua.length, getPhysicalRequirements(catKey).pl.length));
          physicalUA = getPhysicalRequirements(catKey).ua[physicalIndex];
          physicalPL = getPhysicalRequirements(catKey).pl[physicalIndex];
          
          const shiftStructIndex = Math.floor(Math.random() * Math.min(SHIFT_STRUCTURE.ua.length, SHIFT_STRUCTURE.pl.length));
          shiftStructUA = SHIFT_STRUCTURE.ua[shiftStructIndex];
          shiftStructPL = SHIFT_STRUCTURE.pl[shiftStructIndex];
        }

        requirementItemsUA = [
          `Досвід: ${experienceUA}`,
          `Мова: ${languageUA}`,
          documentsUA
        ];
        requirementItemsPL = [
          `Doświadczenie: ${experiencePL}`,
          `Język: ${languagePL}`,
          documentsPL
        ];

        signature = [
          city.slug,
          catKey,
          titlePL,
          salary,
          company,
          shiftsPL,
          patternPL,
          contractPL,
          offersPL,
          tasksPL,
          detailItemsPL.join(' | '),
          requirementItemsPL.join(' | '),
          housingPL,
          transportPL,
          workplacePL,
          teamPL,
          onboardingPL,
          dailyPL.join(' | ')
        ].join('|');
        
        // Add sector/equipment only for specific categories to signature
        if (categoriesWithSector.includes(catKey)) {
          signature += `|${sectorPL}|${equipmentPL}|${physicalPL}|${shiftStructPL}`;
        }
        
        tries += 1;
      } while (usedSignatures.has(signature) && tries < 8);

      usedSignatures.add(signature);

      const slug = `${city.slug}-${catKey}-${titlePL.toLowerCase().replace(/ł/g, 'l').replace(/ń/g, 'n').replace(/[^a-z0-9]+/g, '-')}-${jobCounter++}`;

      const hUA = {
        offers: getRandom(headingsUA.offers),
        info: getRandom(headingsUA.info),
        req: getRandom(headingsUA.req),
        housing: getRandom(headingsUA.housing),
        format: getRandom(headingsUA.format),
        daily: getRandom(headingsUA.daily),
        duties: getRandom(headingsUA.duties)
      };
      const hPL = {
        offers: getRandom(headingsPL.offers),
        info: getRandom(headingsPL.info),
        req: getRandom(headingsPL.req),
        housing: getRandom(headingsPL.housing),
        format: getRandom(headingsPL.format),
        daily: getRandom(headingsPL.daily),
        duties: getRandom(headingsPL.duties)
      };

      const introUA = getRandom([
        `Коротко про позицію: робота у м. ${city.ua}, старт — ${startUA}.`,
        `Вакансія від ${company} у м. ${city.ua}. Вихід можливий: ${startUA}.`,
        `Робота у ${city.ua}: графік ${shiftsUA}, режим ${patternUA}.`,
        `Шукаємо кандидата у м. ${city.ua}. Початок: ${startUA}, договір: ${contractUA}.`
      ]);
      const introPL = getRandom([
        `Krótko o stanowisku: praca w ${city.pl}, start: ${startPL}.`,
        `Oferta od ${company} w ${city.pl}. Możliwy start: ${startPL}.`,
        `Praca w ${city.pl}: grafik ${shiftsPL}, system ${patternPL}.`,
        `Szukamy osoby w ${city.pl}. Start: ${startPL}, umowa: ${contractPL}.`
      ]);

      const humanNoteUA = getRandom([
        `Реально по навантаженню: темп стабільний, але в пікові години роботи більше — команда попереджає про це завчасно.`,
        `Це позиція для тих, хто хоче зрозумілі процеси без «сюрпризів»: на старті є наставник і чіткий план зміни.`,
        `Якщо ви тільки починаєте, тут простіше адаптуватися: задачі пояснюють покроково і дають час увійти в ритм.`
      ]);
      const humanNotePL = getRandom([
        `Uczciwie o tempie: bywa intensywniej w godzinach szczytu, ale zespół uprzedza o tym wcześniej.`,
        `To oferta dla osób, które wolą jasne zasady bez niespodzianek — na starcie jest opiekun i plan zmiany.`,
        `Dla osób początkujących to bezpieczny start: zadania są tłumaczone krok po kroku i jest czas na wdrożenie.`
      ]);

      const summaryUA = `
        <ul>
          <li>Графік: ${shiftsUA}</li>
          <li>Режим: ${patternUA}</li>
          <li>Договір: ${contractUA}</li>
          <li>Старт: ${startUA}</li>
        </ul>
      `;

      const summaryPL = `
        <ul>
          <li>Grafik: ${shiftsPL}</li>
          <li>System: ${patternPL}</li>
          <li>Umowa: ${contractPL}</li>
          <li>Start: ${startPL}</li>
        </ul>
      `;

      const formatItemsUA = [
        workplaceUA,
        teamUA,
        onboardingUA,
        ...(categoriesWithSector.includes(catKey) ? [sectorUA, equipmentUA, physicalUA, shiftStructUA] : [])
      ].filter(Boolean);
      const formatItemsPL = [
        workplacePL,
        teamPL,
        onboardingPL,
        ...(categoriesWithSector.includes(catKey) ? [sectorPL, equipmentPL, physicalPL, shiftStructPL] : [])
      ].filter(Boolean);

      const practicalItemsUA = [
        `Житло: ${housingUA}`,
        `Транспорт: ${transportUA}`,
        ...detailItemsUA
      ];
      const practicalItemsPL = [
        `Mieszkanie: ${housingPL}`,
        `Dojazd: ${transportPL}`,
        ...detailItemsPL
      ];

      const bodyUA = `
        <div class="vacancy-block">
          <p>${introUA}</p>
          <p>${humanNoteUA}</p>
          ${CITY_CONTEXT[city.slug] ? '<p class="city-context">' + CITY_CONTEXT[city.slug].ua + '</p>' : ''}
          <div class="job-meta">
            <p><strong>🏢 Компанія:</strong> ${company}</p>
            <p><strong>📍 Місто:</strong> ${city.ua}</p>
          </div>
          <hr>
          <h3>Короткі умови</h3>
          ${summaryUA}
          <h3>${hUA.duties}</h3>
          <ul>${tasksUA}</ul>
          <h3>${hUA.req}</h3>
          <ul>${requirementItemsUA.map(r => `<li>${r}</li>`).join('')}</ul>
          <h3>${hUA.offers}</h3>
          <ul>${offersUA}</ul>
          <h3>${hUA.housing}</h3>
          <ul>${practicalItemsUA.map(i => `<li>${i}</li>`).join('')}</ul>
          <h3>${hUA.format}</h3>
          <ul>${formatItemsUA.map(i => `<li>${i}</li>`).join('')}</ul>
          <h3>${hUA.daily}</h3>
          <ul>${dailyUA.map(i => `<li>${i}</li>`).join('')}</ul>
          <div class="salary-box">💰 Зарплата: <strong>${salary}</strong></div>
        </div>
        <a href="/apply.html" class="btn btn-primary">Відгукнутися на вакансію</a>
      `;

      const bodyPL = `
        <div class="vacancy-block">
          <p>${introPL}</p>
          <p>${humanNotePL}</p>
          ${CITY_CONTEXT[city.slug] ? '<p class="city-context">' + CITY_CONTEXT[city.slug].pl + '</p>' : ''}
          <div class="job-meta">
            <p><strong>🏢 Firma:</strong> ${company}</p>
            <p><strong>📍 Miasto:</strong> ${city.pl}</p>
          </div>
          <hr>
          <h3>Krótkie warunki</h3>
          ${summaryPL}
          <h3>${hPL.duties}</h3>
          <ul>${tasksPL}</ul>
          <h3>${hPL.req}</h3>
          <ul>${requirementItemsPL.map(r => `<li>${r}</li>`).join('')}</ul>
          <h3>${hPL.offers}</h3>
          <ul>${offersPL}</ul>
          <h3>${hPL.housing}</h3>
          <ul>${practicalItemsPL.map(i => `<li>${i}</li>`).join('')}</ul>
          <h3>${hPL.format}</h3>
          <ul>${formatItemsPL.map(i => `<li>${i}</li>`).join('')}</ul>
          <h3>${hPL.daily}</h3>
          <ul>${dailyPL.map(i => `<li>${i}</li>`).join('')}</ul>
          <div class="salary-box">💰 Wynagrodzenie: <strong>${salary}</strong></div>
        </div>
        <a href="/apply.html" class="btn btn-primary">Aplikuj teraz</a>
      `;

      // Always add city to title for uniqueness and local SEO
      const cityPrepositions = ['у', 'в', '—'];
      const prepSeed = slug.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
      const cityPrep = cityPrepositions[prepSeed % cityPrepositions.length];
      const finalTitleUA = `${titleUA} ${cityPrep} ${city.ua}`;
      const finalTitlePL = `${titlePL} w ${city.pl}`;

      const jobData = {
        slug: slug,
        category: catKey,
        city: city.ua,
        city_pl: city.pl,
        title: finalTitleUA,
        title_pl: finalTitlePL,
        salary: salary,
        company: company,
        shift_ua: shiftsUA,
        shift_pl: shiftsPL,
        pattern_ua: patternUA,
        pattern_pl: patternPL,
        start_ua: startUA,
        start_pl: startPL,
        contract_ua: contractUA,
        contract_pl: contractPL,
        offers_ua: offerItemsUA,
        offers_pl: offerItemsPL,
        tasks_ua: taskItemsUA,
        tasks_pl: taskItemsPL,
        details_ua: detailItemsUA,
        details_pl: detailItemsPL,
        requirements_ua: requirementItemsUA,
        requirements_pl: requirementItemsPL,
        experience_ua: experienceUA,
        experience_pl: experiencePL,
        language_ua: languageUA,
        language_pl: languagePL,
        housing_ua: housingUA,
        housing_pl: housingPL,
        transport_ua: transportUA,
        transport_pl: transportPL,
        documents_ua: documentsUA,
        documents_pl: documentsPL,
        workplace_ua: workplaceUA,
        workplace_pl: workplacePL,
        team_ua: teamUA,
        team_pl: teamPL,
        onboarding_ua: onboardingUA,
        onboarding_pl: onboardingPL,
        daily_ua: dailyUA,
        daily_pl: dailyPL,
        excerpt: getRandom([
          `${company} шукає: ${finalTitleUA}. Графік: ${shiftsUA}, режим: ${patternUA}. ${getRandom(jobTemplate.desc_ua)}`,
          `${finalTitleUA} у ${company}: старт ${startUA}, договір ${contractUA}. ${getRandom(jobTemplate.desc_ua)}`,
          `${company} відкриває набір на ${finalTitleUA}. Формат: ${shiftsUA}, ${patternUA}. ${getRandom(jobTemplate.desc_ua)}`
        ]),
        excerpt_pl: getRandom([
          `${company} poszukuje: ${finalTitlePL}. Grafik: ${shiftsPL}, system: ${patternPL}. ${getRandom(jobTemplate.desc_pl)}`,
          `${finalTitlePL} w ${company}: start ${startPL}, umowa ${contractPL}. ${getRandom(jobTemplate.desc_pl)}`,
          `${company} prowadzi rekrutację na ${finalTitlePL}. Tryb pracy: ${shiftsPL}, ${patternPL}. ${getRandom(jobTemplate.desc_pl)}`
        ]),
        body: bodyUA,
        body_pl: bodyPL,
        cta_text: "Подати заявку",
        cta_text_pl: "Aplikuj",
        cta_link: "/apply.html",
        country: "Poland",
        language: "uk",
        employment_type: "full-time",
        date_posted: new Date().toISOString(),
        is_generated: true,
        data_source: "generated"
      };
      
      // Add sector/equipment only for specific categories
      if (categoriesWithSector.includes(catKey)) {
        jobData.sector_ua = sectorUA;
        jobData.sector_pl = sectorPL;
        jobData.equipment_ua = equipmentUA;
        jobData.equipment_pl = equipmentPL;
        jobData.physical_ua = physicalUA;
        jobData.physical_pl = physicalPL;
        jobData.shift_structure_ua = shiftStructUA;
        jobData.shift_structure_pl = shiftStructPL;
      }
      
      JOBS_DB.push(jobData);

    });
  });
});

fs.writeFileSync(path.join(__dirname, 'content.json'), JSON.stringify(JOBS_DB, null, 2));
console.log(`🎉 Generated ${JOBS_DB.length} unique vacancies across ${CITIES.length} cities.`);

// Auto-select 50 indexable slugs distributed across categories and cities
const TARGET_INDEXABLE = 50;
const allCats = [...new Set(JOBS_DB.map(p => p.category))];
const perCat = Math.max(3, Math.floor(TARGET_INDEXABLE / allCats.length));
const selectedSlugs = [];
const usedSlugsSet = new Set();

for (const cat of allCats) {
  const pool = JOBS_DB.filter(p => p.category === cat);
  const citySet = new Set();
  for (const p of pool) {
    if (selectedSlugs.length >= TARGET_INDEXABLE) break;
    if (!citySet.has(p.city) && selectedSlugs.filter(s => JOBS_DB.find(j => j.slug === s)?.category === cat).length < perCat) {
      selectedSlugs.push(p.slug);
      citySet.add(p.city);
      usedSlugsSet.add(p.slug);
    }
  }
}
while (selectedSlugs.length < TARGET_INDEXABLE) {
  const remaining = JOBS_DB.filter(p => !usedSlugsSet.has(p.slug));
  if (!remaining.length) break;
  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  selectedSlugs.push(pick.slug);
  usedSlugsSet.add(pick.slug);
}

fs.writeFileSync(path.join(__dirname, 'indexable-vacancies.json'), JSON.stringify(selectedSlugs.sort(), null, 2));
console.log(`📌 Selected ${selectedSlugs.length} indexable vacancies across ${allCats.length} categories.`);
