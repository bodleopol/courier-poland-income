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

const AGENCIES = [
  "FastLogistics Sp. z o.o.", "BudPol Construction", "EuroWork Service", "Randstad Polska", 
  "ManpowerGroup", "Grafton Recruitment", "Hays Poland", "Adecco Poland", "EWL Group", 
  "Gremi Personal", "Otto Work Force", "InterKadra", "Work Service", "Personnel Service",
  "TopStaffing", "ProHR Solutions", "JobImpulse", "Exact Systems", "Contrain Group"
];

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

const GLOBAL_OFFERS = {
  ua: [
    "Офіційне працевлаштування (Umowa o pracę / Zlecenie).",
    "Стабільна виплата зарплати кожного 10-го числа.",
    "Можливість отримання авансів після першого тижня.",
    "Безкоштовна робоча форма та взуття.",
    "Допомога координатора у вирішенні побутових питань.",
    "Підтримка в оформленні Карти Побуту (Karta Pobytu).",
    "Медичне страхування (ZUS) з першого дня.",
    "Можливість працювати понаднормово (+50% до ставки).",
    "Обіди за символічну ціну (1-5 злотих).",
    "Безкоштовне проживання або доплата за власне житло (400-600 zł).",
    "Пакет Multisport (спортзал, басейн - 50% оплачує фірма).",
    "Курси польської мови для працівників.",
    "Можливість кар'єрного росту до бригадира.",
    "Приватна медична опіка (LuxMed).",
    "Бонуси за продуктивність та відвідуваність.",
    "Комфортні умови праці (клімат-контроль, кімната відпочинку).",
    "Довіз до роботи службовим транспортом.",
    "Премія за за рекомендованого працівника (200-500 zł).",
    "Допомога у відкритті банківського рахунку та PESEL.",
    "Святкові подарунки та путівки для дітей.",
    "Надбавка за роботу у вихідні (+20%).",
    "Премія за нічні зміни (2-4 zł/год).",
    "Оплата заїзду на роботу в першому місяці.",
    "Можливість переведення на інший об'єкт.",
    "Фірмова їдальня з знижкою для працівників.",
    "Компенсація медогляду та навчань BHP.",
    "Системні бонуси після 3-го місяця роботи.",
    "Доплата за знання польської мови."
  ],
  pl: [
    "Oficjalne zatrudnienie (Umowa o pracę / Zlecenie).",
    "Stabilna wypłata wynagrodzenia do 10-go każdego miesiąca.",
    "Możliwość pobrania zaliczki po pierwszym tygodniu.",
    "Bezpłatna odzież robocza i obuwie.",
    "Wsparcie koordynatora w sprawach codziennych.",
    "Pomoc w uzyskaniu Karty Pobytu.",
    "Ubezpieczenie medyczne (ZUS) od pierwszego dnia.",
    "Możliwość pracy w nadgodzinach (+50% stawki).",
    "Obiady w symbolicznej cenie (1-5 zł).",
    "Bezpłatne zakwaterowanie lub dodatek mieszkaniowy (400-600 zł).",
    "Pakiet Multisport (siłownia, basen - 50% pokrywa firma).",
    "Kursy języka polskiego dla pracowników.",
    "Możliwość awansu na brygadzistę.",
    "Prywatna opieka medyczna (LuxMed).",
    "Premie za produktywność i frekwencję.",
    "Komfortowe warunki pracy (klimatyzacja, chillout room).",
    "Dojazd do pracy transportem firmowym.",
    "Premia za polecenie pracownika (200-500 zł).",
    "Pomoc w założeniu konta bankowego i PESEL.",
    "Paczki świąteczne i wczasy pod gruszą.",
    "Dodatek za pracę w weekendy (+20%).",
    "Premia za zmiany nocne (2-4 zł/h).",
    "Pokrycie kosztów dojazdu w 1. miesiącu.",
    "Możliwość przeniesienia na inny obiekt.",
    "Stołówka firmowa ze zniżką dla pracowników.",
    "Zwrot kosztów badań i szkoleń BHP.",
    "Bonusy systemowe po 3. miesiącu pracy.",
    "Dodatek za znajomość języka polskiego."
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
      
      // 10% chance to skip a job in a specific city to make lists uneven/natural
      if (Math.random() > 0.9) return; 

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
      let tasksUA;
      let tasksPL;
      let offersUA;
      let offersPL;
      let signature;
      let tries = 0;

      do {
        titleUA = getRandom(jobTemplate.titles_ua);
        titlePL = getRandom(jobTemplate.titles_pl);
        salary = generateSalary(jobTemplate.salary.min, jobTemplate.salary.max);

        company = getRandom(AGENCIES);
        shiftsUA = getRandom(SHIFTS.ua);
        shiftsPL = getRandom(SHIFTS.pl);
        patternUA = getRandom(WORK_PATTERNS.ua);
        patternPL = getRandom(WORK_PATTERNS.pl);
        startUA = getRandom(START_DATES.ua);
        startPL = getRandom(START_DATES.pl);
        contractUA = getRandom(CONTRACT_TYPES.ua);
        contractPL = getRandom(CONTRACT_TYPES.pl);

        // Mix descriptions
        tasksUA = getMultipleRandom(jobTemplate.desc_ua, 3).map(t => `<li>${t}</li>`).join('');
        tasksPL = getMultipleRandom(jobTemplate.desc_pl, 3).map(t => `<li>${t}</li>`).join('');

        const offerCount = 4 + Math.floor(Math.random() * 3);
        offersUA = getMultipleRandom(GLOBAL_OFFERS.ua, offerCount).map(o => `<li>${o}</li>`).join('');
        offersPL = getMultipleRandom(GLOBAL_OFFERS.pl, offerCount).map(o => `<li>${o}</li>`).join('');

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
          tasksPL
        ].join('|');
        tries += 1;
      } while (usedSignatures.has(signature) && tries < 8);

      usedSignatures.add(signature);

      const slug = `${city.slug}-${catKey}-${titlePL.toLowerCase().replace(/ł/g, 'l').replace(/ń/g, 'n').replace(/[^a-z0-9]+/g, '-')}-${jobCounter++}`;

      const bodyUA = `
        <div class="vacancy-block">
          <div class="job-meta">
            <p><strong>🏢 Компанія:</strong> ${company}</p>
            <p><strong>🕒 Графік:</strong> ${shiftsUA}</p>
            <p><strong>📆 Режим:</strong> ${patternUA}</p>
            <p><strong>📅 Початок:</strong> ${startUA}</p>
            <p><strong>📝 Тип договору:</strong> ${contractUA}</p>
          </div>
          <hr>
          <h3>Що ми пропонуємо?</h3>
          <ul>${offersUA}</ul>
          <h3>Ваші обов'язки:</h3>
          <ul>${tasksUA}</ul>
          <div class="salary-box">💰 Зарплата: <strong>${salary}</strong></div>
        </div>
        <a href="/apply.html" class="btn btn-primary">Відгукнутися на вакансію</a>
      `;

      const bodyPL = `
        <div class="vacancy-block">
          <div class="job-meta">
            <p><strong>🏢 Firma:</strong> ${company}</p>
            <p><strong>🕒 Grafiki:</strong> ${shiftsPL}</p>
            <p><strong>📆 System:</strong> ${patternPL}</p>
            <p><strong>📅 Start:</strong> ${startPL}</p>
            <p><strong>📝 Umowa:</strong> ${contractPL}</p>
          </div>
          <hr>
          <h3>Co oferujemy?</h3>
          <ul>${offersPL}</ul>
          <h3>Twoje obowiązki:</h3>
          <ul>${tasksPL}</ul>
          <div class="salary-box">💰 Wynagrodzenie: <strong>${salary}</strong></div>
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
        company: company,
        excerpt: `${company} шукає: ${titleUA} у м. ${city.ua} (${shiftsUA}, ${patternUA}). ${getRandom(jobTemplate.desc_ua)}`,
        excerpt_pl: `${company} poszukuje: ${titlePL} w m. ${city.pl} (${shiftsPL}, ${patternPL}). ${getRandom(jobTemplate.desc_pl)}`,
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
