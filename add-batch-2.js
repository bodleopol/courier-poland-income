const fs = require('fs');
const path = require('path');

const contentPath = path.join(__dirname, 'src', 'content.json');
const indexablePath = path.join(__dirname, 'src', 'indexable-vacancies.json');

const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
const indexable = JSON.parse(fs.readFileSync(indexablePath, 'utf8'));

const newVacancies = [
  {
    "slug": "warsaw-construction-electrician-commercial-402",
    "category": "construction",
    "city": "Варшава",
    "city_pl": "Warszawa",
    "title": "Електромонтажник на комерційні об'єкти (ТЦ, офіси)",
    "title_pl": "Elektromonter na obiektach komercyjnych (galerie, biura)",
    "salary": "30 - 45 PLN/h netto",
    "company": "VoltBuild Sp. z o.o.",
    "shift_ua": "07:00 - 17:00",
    "shift_pl": "07:00 - 17:00",
    "pattern_ua": "5-6 днів на тиждень",
    "pattern_pl": "5-6 dni w tygodniu",
    "start_ua": "Відразу після інструктажу BHP",
    "start_pl": "Zaraz po szkoleniu BHP",
    "contract_ua": "Umowa Zlecenie / B2B",
    "contract_pl": "Umowa Zlecenie / B2B",
    "offers_ua": [
      "Робота в теплому приміщенні (внутрішні роботи), без бруду та дощу.",
      "Надаємо якісний електроінструмент (Hilti, Makita) та спецодяг.",
      "Можливість працювати в парі з досвідченим майстром для швидкої адаптації.",
      "Своєчасна виплата заробітної плати до 10 числа кожного місяця.",
      "Допомога з оформленням документів (Karta Pobytu) для перевірених працівників."
    ],
    "offers_pl": [
      "Praca w ciepłym pomieszczeniu (prace wewnętrzne), bez błota i deszczu.",
      "Zapewniamy wysokiej jakości elektronarzędzia (Hilti, Makita) i odzież roboczą.",
      "Możliwość pracy w parze z doświadczonym majstrem dla szybkiej adaptacji.",
      "Terminowa wypłata wynagrodzenia do 10. dnia każdego miesiąca.",
      "Pomoc w załatwieniu dokumentów (Karta Pobytu) dla sprawdzonych pracowników."
    ],
    "tasks_ua": [
      "Прокладання кабельних трас та лотків у комерційних приміщеннях.",
      "Монтаж розеток, вимикачів, освітлювальних приладів.",
      "Збірка та підключення електричних щитків (для спеціалістів з досвідом).",
      "Читання технічних креслень та схем (базовий рівень)."
    ],
    "tasks_pl": [
      "Układanie tras kablowych i koryt w pomieszczeniach komercyjnych.",
      "Montaż gniazdek, włączników, opraw oświetleniowych.",
      "Montaż i podłączanie rozdzielnic elektrycznych (dla specjalistów z doświadczeniem).",
      "Czytanie rysunków technicznych i schematów (poziom podstawowy)."
    ],
    "details_ua": [
      "Шукаємо людей з розумінням справи, а не просто 'потримати драбину'.",
      "Наявність допусків SEP (до 1 кВ) буде великою перевагою, але можемо допомогти з їх отриманням.",
      "Об'єкти знаходяться в межах Варшави, доїзд громадським транспортом або робочим бусом.",
      "Колектив змішаний (поляки та українці), тому базове розуміння польської мови необхідне для безпеки."
    ],
    "details_pl": [
      "Szukamy osób z pojęciem o pracy, a nie tylko 'do trzymania drabiny'.",
      "Posiadanie uprawnień SEP (do 1 kV) będzie dużym atutem, ale możemy pomóc w ich zdobyciu.",
      "Obiekty znajdują się w granicach Warszawy, dojazd komunikacją miejską lub busem pracowniczym.",
      "Zespół mieszany (Polacy i Ukraińcy), dlatego podstawowa znajomość języka polskiego jest niezbędna dla bezpieczeństwa."
    ]
  },
  {
    "slug": "poznan-logistics-forklift-operator-udt-403",
    "category": "logistics",
    "city": "Познань",
    "city_pl": "Poznań",
    "title": "Водій навантажувача (UDT) на склад автозапчастин",
    "title_pl": "Operator wózka widłowego (UDT) na magazynie części samochodowych",
    "salary": "28 - 35 PLN/h netto",
    "company": "AutoParts Logistics",
    "shift_ua": "3 зміни (06:00-14:00, 14:00-22:00, 22:00-06:00)",
    "shift_pl": "3 zmiany (06:00-14:00, 14:00-22:00, 22:00-06:00)",
    "pattern_ua": "5 днів на тиждень",
    "pattern_pl": "5 dni w tygodniu",
    "start_ua": "Потрібно пройти тест на водіння",
    "start_pl": "Wymagane zdanie testu na jazdę",
    "contract_ua": "Umowa o pracę",
    "contract_pl": "Umowa o pracę",
    "offers_ua": [
      "Офіційне працевлаштування з першого дня (Umowa o pracę), оплачувані відпустки та лікарняні.",
      "Доплата за нічні зміни +20%, премії za bezbłędność (за відсутність помилок).",
      "Сучасні навантажувачі (Toyota, Jungheinrich) в ідеальному технічному стані.",
      "Чистий, теплий склад (не морозильня і не брудне виробництво).",
      "Безкоштовні гарячі напої та субсидовані обіди в їдальні."
    ],
    "offers_pl": [
      "Oficjalne zatrudnienie od pierwszego dnia (Umowa o pracę), płatne urlopy i zwolnienia lekarskie.",
      "Dodatek za zmiany nocne +20%, premie za bezbłędność.",
      "Nowoczesne wózki widłowe (Toyota, Jungheinrich) w idealnym stanie technicznym.",
      "Czysty, ciepły magazyn (nie chłodnia i nie brudna produkcja).",
      "Darmowe gorące napoje i dofinansowane obiady na stołówce."
    ],
    "tasks_ua": [
      "Розвантаження та завантаження вантажівок (TIR).",
      "Переміщення палет з автозапчастинами по складу.",
      "Розміщення товару на високих стелажах (висотного складування).",
      "Робота зі сканером та складською системою WMS."
    ],
    "tasks_pl": [
      "Rozładunek i załadunek samochodów ciężarowych (TIR).",
      "Przemieszczanie palet z częściami samochodowymi po magazynie.",
      "Rozmieszczanie towaru na wysokich regałach (wysokiego składowania).",
      "Praca ze skanerem i systemem magazynowym WMS."
    ],
    "details_ua": [
      "Обов'язкова наявність польських прав UDT (Urząd Dozoru Technicznego).",
      "Досвід роботи на навантажувачах високого складування (boczny/reach truck) буде перевагою.",
      "Перед працевлаштуванням проводиться практичний тест на вміння керувати навантажувачем.",
      "Робота вимагає уважності, оскільки автозапчастини можуть бути крихкими та дорогими."
    ],
    "details_pl": [
      "Obowiązkowe posiadanie polskich uprawnień UDT (Urząd Dozoru Technicznego).",
      "Doświadczenie w pracy na wózkach wysokiego składowania (boczny/reach truck) będzie atutem.",
      "Przed zatrudnieniem przeprowadzany jest praktyczny test umiejętności jazdy wózkiem.",
      "Praca wymaga ostrożności, ponieważ części samochodowe mogą być kruche i drogie."
    ]
  },
  {
    "slug": "lublin-agriculture-tractor-driver-404",
    "category": "agriculture",
    "city": "Люблін (околиці)",
    "city_pl": "Lublin (okolice)",
    "title": "Тракторист-механізатор у сучасне фермерське господарство",
    "title_pl": "Traktorzysta-mechanizator w nowoczesnym gospodarstwie rolnym",
    "salary": "6000 - 8500 PLN/miesiąc",
    "company": "AgroTech Lubelskie",
    "shift_ua": "Залежить від сезону та погоди",
    "shift_pl": "Zależy od sezonu i pogody",
    "pattern_ua": "Гнучкий графік",
    "pattern_pl": "Elastyczny grafik",
    "start_ua": "З початку весняно-польових робіт",
    "start_pl": "Od początku wiosennych prac polowych",
    "contract_ua": "Umowa o pracę",
    "contract_pl": "Umowa o pracę",
    "offers_ua": [
      "Робота на сучасній техніці (John Deere, Fendt) з кондиціонерами та GPS-навігацією.",
      "Стабільна зарплата цілий рік, навіть у зимовий період (ремонт техніки, підготовка до сезону).",
      "Надається безкоштовне комфортне житло (окрема кімната) на території господарства.",
      "Премії за швидке та якісне виконання робіт у гарячий сезон (жнива, посівна).",
      "Дружнє ставлення власника, який сам працює в полі."
    ],
    "offers_pl": [
      "Praca na nowoczesnym sprzęcie (John Deere, Fendt) z klimatyzacją i nawigacją GPS.",
      "Stabilna pensja przez cały rok, nawet w okresie zimowym (naprawa sprzętu, przygotowanie do sezonu).",
      "Zapewnione darmowe, komfortowe zakwaterowanie (osobny pokój) na terenie gospodarstwa.",
      "Premie za szybkie i jakościowe wykonanie prac w gorącym sezonie (żniwa, siew).",
      "Przyjazne nastawienie właściciela, który sam pracuje w polu."
    ],
    "tasks_ua": [
      "Виконання польових робіт: оранка, культивація, посів, обприскування, збір врожаю.",
      "Технічне обслуговування закріпленої техніки (змащування, заміна фільтрів, дрібний ремонт).",
      "Транспортування врожаю з поля до місця зберігання.",
      "Дотримання правил техніки безпеки та дбайливе ставлення до техніки."
    ],
    "tasks_pl": [
      "Wykonywanie prac polowych: orka, kultywacja, siew, opryski, zbiór plonów.",
      "Obsługa techniczna powierzonego sprzętu (smarowanie, wymiana filtrów, drobne naprawy).",
      "Transport plonów z pola do miejsca przechowywania.",
      "Przestrzeganie zasad BHP i dbałość o powierzony sprzęt."
    ],
    "details_ua": [
      "Шукаємо людину, яка любить техніку і землю, а не просто 'відбуває години'.",
      "Досвід роботи на сучасних тракторах обов'язковий (мінімум 2 роки).",
      "Посвідчення тракториста (категорія T) є обов'язковим.",
      "Робота в сезон вимагає готовності до ненормованого робочого дня (залежить від погоди)."
    ],
    "details_pl": [
      "Szukamy osoby, która kocha sprzęt i ziemię, a nie tylko 'odrabia godziny'.",
      "Doświadczenie w pracy na nowoczesnych traktorach jest obowiązkowe (minimum 2 lata).",
      "Prawo jazdy na traktor (kategoria T) jest obowiązkowe.",
      "Praca w sezonie wymaga gotowości do nienormowanego czasu pracy (zależy od pogody)."
    ]
  },
  {
    "slug": "wroclaw-manufacturing-craft-beer-operator-405",
    "category": "manufacturing",
    "city": "Вроцлав",
    "city_pl": "Wrocław",
    "title": "Оператор лінії розливу крафтового пива",
    "title_pl": "Operator linii rozlewniczej piwa rzemieślniczego",
    "salary": "26 - 32 PLN/h netto",
    "company": "Browar Wrocławska Siła",
    "shift_ua": "08:00 - 16:00",
    "shift_pl": "08:00 - 16:00",
    "pattern_ua": "5 днів на тиждень",
    "pattern_pl": "5 dni w tygodniu",
    "start_ua": "Протягом 2 тижнів",
    "start_pl": "W ciągu 2 tygodni",
    "contract_ua": "Umowa o pracę",
    "contract_pl": "Umowa o pracę",
    "offers_ua": [
      "Робота в атмосферній крафтовій броварні, а не на гігантському бездушному заводі.",
      "Тільки денні зміни (без нічних!), вільні вихідні.",
      "Знижки на продукцію броварні та участь у дегустаціях нових сортів.",
      "Навчання роботі з обладнанням з нуля (головне - технічний склад розуму).",
      "Невеликий, згуртований колектив фанатів своєї справи."
    ],
    "offers_pl": [
      "Praca w klimatycznym browarze rzemieślniczym, a nie w gigantycznej, bezdusznej fabryce.",
      "Tylko zmiany dzienne (bez nocek!), wolne weekendy.",
      "Zniżki na produkty browaru i udział w degustacjach nowych gatunków.",
      "Szkolenie z obsługi sprzętu od podstaw (najważniejszy jest zmysł techniczny).",
      "Niewielki, zgrany zespół pasjonatów swojego fachu."
    ],
    "tasks_ua": [
      "Обслуговування напівавтоматичної лінії розливу пива у пляшки та банки.",
      "Контроль якості наливу, закупорювання та наклеювання етикеток.",
      "Миття та дезінфекція обладнання (CIP) після завершення розливу.",
      "Пакування готової продукції в картонні ящики та підготовка до відвантаження."
    ],
    "tasks_pl": [
      "Obsługa półautomatycznej linii rozlewniczej piwa do butelek i puszek.",
      "Kontrola jakości nalewu, kapslowania i naklejania etykiet.",
      "Mycie i dezynfekcja sprzętu (CIP) po zakończeniu rozlewu.",
      "Pakowanie gotowych produktów w kartony i przygotowanie do wysyłki."
    ],
    "details_ua": [
      "Робота вимагає акуратності та дотримання суворих санітарних норм (це харчове виробництво).",
      "Потрібна санітарна книжка (książeczka sanepidowska) - допомагаємо з оформленням.",
      "Фізична витривалість (іноді потрібно піднімати кеги або ящики).",
      "Шукаємо людину на довготривалу співпрацю, яка хоче розвиватися у сфері пивоваріння."
    ],
    "details_pl": [
      "Praca wymaga dokładności i przestrzegania surowych norm sanitarnych (to produkcja spożywcza).",
      "Wymagana książeczka sanepidowska - pomagamy w wyrobieniu.",
      "Wytrzymałość fizyczna (czasami trzeba podnieść kegi lub skrzynki).",
      "Szukamy osoby na dłuższą współpracę, która chce rozwijać się w branży piwowarskiej."
    ]
  },
  {
    "slug": "gdansk-cleaning-yacht-specialist-406",
    "category": "cleaning",
    "city": "Гданськ",
    "city_pl": "Gdańsk",
    "title": "Спеціаліст з клінінгу яхт та катерів (сезонна робота)",
    "title_pl": "Specjalista ds. sprzątania jachtów i łodzi (praca sezonowa)",
    "salary": "35 - 50 PLN/h netto",
    "company": "Marina Clean Services",
    "shift_ua": "09:00 - 18:00",
    "shift_pl": "09:00 - 18:00",
    "pattern_ua": "Залежить від замовлень (часто вихідні)",
    "pattern_pl": "Zależy od zamówień (często weekendy)",
    "start_ua": "Травень - Вересень",
    "start_pl": "Maj - Wrzesień",
    "contract_ua": "Umowa Zlecenie",
    "contract_pl": "Umowa Zlecenie",
    "offers_ua": [
      "Робота на свіжому повітрі в найкрасивіших маринах Труймяста (Гданськ, Сопот, Гдиня).",
      "Висока погодинна ставка, оскільки робота вимагає специфічних навичок та акуратності.",
      "Навчання роботі з професійною хімією для яхт (догляд за тиковим деревом, гелькоутом).",
      "Гнучкий графік, який можна поєднувати з іншою роботою або навчанням.",
      "Чайові від задоволених власників яхт."
    ],
    "offers_pl": [
      "Praca na świeżym powietrzu w najpiękniejszych marinach Trójmiasta (Gdańsk, Sopot, Gdynia).",
      "Wysoka stawka godzinowa, ponieważ praca wymaga specyficznych umiejętności i dokładności.",
      "Szkolenie z pracy z profesjonalną chemią jachtową (pielęgnacja drewna tekowego, żelkotu).",
      "Elastyczny grafik, który można łączyć z inną pracą lub nauką.",
      "Napiwki od zadowolonych właścicieli jachtów."
    ],
    "tasks_ua": [
      "Комплексне прибирання яхт та катерів ззовні (миття палуби, полірування металевих деталей).",
      "Прибирання внутрішніх приміщень (кают, камбуза, гальюна).",
      "Прання та прасування постільної білизни та рушників (за потреби).",
      "Підготовка яхти до виходу в море або до здачі в чартер."
    ],
    "tasks_pl": [
      "Kompleksowe sprzątanie jachtów i łodzi z zewnątrz (mycie pokładu, polerowanie elementów metalowych).",
      "Sprzątanie pomieszczeń wewnętrznych (kajut, kambuza, toalety).",
      "Pranie i prasowanie pościeli oraz ręczników (w razie potrzeby).",
      "Przygotowanie jachtu do wyjścia w morze lub do oddania w czarter."
    ],
    "details_ua": [
      "Робота сезонна (з травня по вересень), ідеально підходить для студентів або як підробіток.",
      "Потрібна увага до деталей: яхти - це дорогі об'єкти, подряпини неприпустимі.",
      "Відсутність морської хвороби (іноді доводиться прибирати на воді при легкому хвилюванні).",
      "Базове знання польської або англійської мови для комунікації з клієнтами."
    ],
    "details_pl": [
      "Praca sezonowa (od maja do września), idealna dla studentów lub jako praca dorywcza.",
      "Wymagana dbałość o szczegóły: jachty to drogie obiekty, zarysowania są niedopuszczalne.",
      "Brak choroby morskiej (czasami trzeba sprzątać na wodzie przy lekkim falowaniu).",
      "Podstawowa znajomość języka polskiego lub angielskiego do komunikacji z klientami."
    ]
  }
];

content.unshift(...newVacancies);
fs.writeFileSync(contentPath, JSON.stringify(content, null, 2));

newVacancies.forEach(v => {
  if (!indexable.includes(v.slug)) {
    indexable.unshift(v.slug);
  }
});
fs.writeFileSync(indexablePath, JSON.stringify(indexable, null, 2));

console.log('Added 5 new unique vacancies.');
