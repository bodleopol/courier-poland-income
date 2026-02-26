const fs = require('fs');
const path = require('path');

const contentPath = path.join(__dirname, '..', 'src', 'content.json');
const indexablePath = path.join(__dirname, '..', 'src', 'indexable-vacancies.json');

const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
const indexable = JSON.parse(fs.readFileSync(indexablePath, 'utf8'));

const newVacancies = [
  {
    "slug": "warsaw-hospitality-kitchen-assistant-412",
    "category": "hospitality",
    "city": "Варшава",
    "city_pl": "Warszawa",
    "title": "Помічник кухаря в корпоративну їдальню (бізнес-центр)",
    "title_pl": "Pomoc kuchenna w stołówce pracowniczej (biurowiec)",
    "salary": "28 - 32 PLN/h netto",
    "company": "LunchBox Corporate Catering",
    "shift_ua": "Пн-Пт, 06:30 - 15:00",
    "shift_pl": "Pn-Pt, 06:30 - 15:00",
    "pattern_ua": "5 днів на тиждень (тільки будні)",
    "pattern_pl": "5 dni w tygodniu (tylko dni robocze)",
    "start_ua": "Відразу після оформлення санітарної книжки",
    "start_pl": "Zaraz po wyrobieniu książeczki sanepidowskiej",
    "contract_ua": "Umowa o pracę",
    "contract_pl": "Umowa o pracę",
    "offers_ua": [
      "Ідеальний графік для тих, хто цінує вільні вечори та вихідні (субота і неділя завжди вихідні).",
      "Безкоштовні сніданки та обіди з меню їдальні.",
      "Офіційне працевлаштування з оплачуваними лікарняними та відпусткою.",
      "Робота в сучасному бізнес-центрі з новим обладнанням (пароконвектомати Rational, професійні овочерізки).",
      "Відсутність стресу 'а-ля карт' ресторанів — готуємо за чітким планом на день."
    ],
    "offers_pl": [
      "Idealny grafik dla osób ceniących wolne wieczory i weekendy (sobota i niedziela zawsze wolne).",
      "Darmowe śniadania i obiady z menu stołówki.",
      "Oficjalne zatrudnienie z płatnymi zwolnieniami lekarskimi i urlopem.",
      "Praca w nowoczesnym biurowcu z nowym sprzętem (piece konwekcyjno-parowe Rational, profesjonalne szatkownice).",
      "Brak stresu restauracji 'a la carte' — gotujemy według jasnego planu na dany dzień."
    ],
    "tasks_ua": [
      "Миття, чищення та нарізка овочів у великих обсягах (за допомогою машин).",
      "Допомога кухарям у приготуванні простих страв (салати, гарніри, супи).",
      "Підтримка чистоти на робочому місці та в холодильних камерах.",
      "Допомога на лінії роздачі під час обідньої перерви (12:00-14:00)."
    ],
    "tasks_pl": [
      "Mycie, obieranie i krojenie warzyw w dużych ilościach (przy użyciu maszyn).",
      "Pomoc kucharzom w przygotowywaniu prostych dań (sałatki, dodatki, zupy).",
      "Utrzymanie czystości na stanowisku pracy i w chłodniach.",
      "Pomoc na linii wydawki podczas przerwy obiadowej (12:00-14:00)."
    ],
    "details_ua": [
      "Досвід роботи на кухні вітається, але не є обов'язковим — всьому навчимо.",
      "Обов'язкова наявність польської санітарної книжки (książeczka sanepidowska).",
      "Робота вимагає фізичної витривалості (робота на ногах).",
      "Знання польської мови на базовому рівні для розуміння команд шеф-кухаря."
    ],
    "details_pl": [
      "Doświadczenie w pracy w kuchni mile widziane, ale nie obowiązkowe — wszystkiego nauczymy.",
      "Obowiązkowe posiadanie polskiej książeczki sanepidowskiej.",
      "Praca wymaga wytrzymałości fizycznej (praca stojąca).",
      "Znajomość języka polskiego na poziomie podstawowym do rozumienia poleceń szefa kuchni."
    ]
  },
  {
    "slug": "wroclaw-security-guard-logistics-park-413",
    "category": "other",
    "city": "Вроцлав (околиці)",
    "city_pl": "Wrocław (okolice)",
    "title": "Охоронець логістичного парку (без ліцензії)",
    "title_pl": "Pracownik ochrony parku logistycznego (bez licencji)",
    "salary": "27 - 30 PLN/h netto",
    "company": "SafeGuard Logistics",
    "shift_ua": "12 або 24 години (за графіком)",
    "shift_pl": "12 lub 24 godziny (według grafiku)",
    "pattern_ua": "Змінний графік (наприклад, доба через дві)",
    "pattern_pl": "Grafik zmianowy (np. 24h pracy / 48h wolnego)",
    "start_ua": "Протягом 3 днів",
    "start_pl": "W ciągu 3 dni",
    "contract_ua": "Umowa Zlecenie",
    "contract_pl": "Umowa Zlecenie",
    "offers_ua": [
      "Спокійна робота на сучасному логістичному об'єкті (не супермаркет і не клуб).",
      "Тепле, обладнане приміщення охорони (кавоварка, мікрохвильовка, монітори).",
      "Надаємо повний комплект фірмового одягу (зимовий та літній варіанти).",
      "Можливість брати додаткові зміни для збільшення заробітку.",
      "Допомога з доїздом (організований транспорт від найближчої залізничної станції)."
    ],
    "offers_pl": [
      "Spokojna praca na nowoczesnym obiekcie logistycznym (nie supermarket i nie klub).",
      "Ciepła, wyposażona stróżówka (ekspres do kawy, mikrofalówka, monitory).",
      "Zapewniamy pełen komplet odzieży firmowej (wersja zimowa i letnia).",
      "Możliwość brania dodatkowych zmian w celu zwiększenia zarobków.",
      "Pomoc w dojazdach (zorganizowany transport od najbliższej stacji kolejowej)."
    ],
    "tasks_ua": [
      "Контроль в'їзду та виїзду вантажних автомобілів (перевірка документів, реєстрація в системі).",
      "Відеоспостереження за територією складського комплексу.",
      "Періодичний обхід території (патрулювання).",
      "Видача перепусток гостям та співробітникам підрядних організацій."
    ],
    "tasks_pl": [
      "Kontrola wjazdu i wyjazdu samochodów ciężarowych (sprawdzanie dokumentów, rejestracja w systemie).",
      "Monitoring wizyjny terenu kompleksu magazynowego.",
      "Okresowy obchód terenu (patrolowanie).",
      "Wydawanie przepustek gościom i pracownikom firm zewnętrznych."
    ],
    "details_ua": [
      "Ліцензія охоронця (wpis na listę kwalifikowanych pracowników ochrony) НЕ потрібна.",
      "Обов'язкове знання польської мови на комунікативному рівні (спілкування з водіями).",
      "Базові навички роботи з комп'ютером (внесення даних у таблицю).",
      "Відповідальність, уважність та відсутність судимостей."
    ],
    "details_pl": [
      "Licencja pracownika ochrony (wpis na listę kwalifikowanych pracowników ochrony) NIE jest wymagana.",
      "Obowiązkowa znajomość języka polskiego na poziomie komunikatywnym (rozmowy z kierowcami).",
      "Podstawowe umiejętności obsługi komputera (wprowadzanie danych do tabeli).",
      "Odpowiedzialność, spostrzegawczość i brak karalności."
    ]
  },
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
  },
  {
    "slug": "katowice-it-helpdesk-support-407",
    "category": "it",
    "city": "Катовіце",
    "city_pl": "Katowice",
    "title": "Спеціаліст IT Helpdesk (1-ша лінія підтримки) зі знанням української",
    "title_pl": "Specjalista IT Helpdesk (1. linia wsparcia) z językiem ukraińskim",
    "salary": "5500 - 7000 PLN/miesiąc brutto",
    "company": "TechSupport Silesia",
    "shift_ua": "08:00 - 16:00 або 10:00 - 18:00",
    "shift_pl": "08:00 - 16:00 lub 10:00 - 18:00",
    "pattern_ua": "5 днів на тиждень (гібридний формат)",
    "pattern_pl": "5 dni w tygodniu (praca hybrydowa)",
    "start_ua": "Після проходження технічної співбесіди",
    "start_pl": "Po przejściu rozmowy technicznej",
    "contract_ua": "Umowa o pracę",
    "contract_pl": "Umowa o pracę",
    "offers_ua": [
      "Гібридний формат роботи (3 дні в офісі, 2 дні вдома) після випробувального терміну.",
      "Приватне медичне страхування (Luxmed) та карта Multisport.",
      "Бюджет на навчання та сертифікацію (ITIL, Microsoft, CompTIA).",
      "Сучасний офіс у центрі Катовіце з ігровою зоною та безкоштовними снеками.",
      "Чіткий шлях кар'єрного зростання до 2-ї лінії підтримки або системного адміністратора."
    ],
    "offers_pl": [
      "Hybrydowy model pracy (3 dni w biurze, 2 dni w domu) po okresie próbnym.",
      "Prywatna opieka medyczna (Luxmed) i karta Multisport.",
      "Budżet na szkolenia i certyfikację (ITIL, Microsoft, CompTIA).",
      "Nowoczesne biuro w centrum Katowic ze strefą gier i darmowymi przekąskami.",
      "Jasna ścieżka kariery do 2. linii wsparcia lub administratora systemów."
    ],
    "tasks_ua": [
      "Прийом та реєстрація звернень користувачів (телефон, email, система тікетів Jira).",
      "Базове вирішення проблем з Windows 10/11, Office 365, Active Directory.",
      "Налаштування робочих місць для нових співробітників (встановлення ПЗ, підключення периферії).",
      "Ескалація складних інцидентів на 2-гу лінію підтримки."
    ],
    "tasks_pl": [
      "Przyjmowanie i rejestracja zgłoszeń użytkowników (telefon, email, system ticketowy Jira).",
      "Podstawowe rozwiązywanie problemów z Windows 10/11, Office 365, Active Directory.",
      "Konfiguracja stanowisk pracy dla nowych pracowników (instalacja oprogramowania, podłączanie peryferiów).",
      "Eskalacja skomplikowanych incydentów do 2. linii wsparcia."
    ],
    "details_ua": [
      "Вільне володіння українською та польською мовами (B2+) для спілкування з користувачами.",
      "Базові знання мережевих технологій (TCP/IP, DNS, DHCP).",
      "Досвід роботи в IT-підтримці буде плюсом, але розглядаємо і випускників технічних спеціальностей.",
      "Стресостійкість та вміння пояснювати складні технічні речі простою мовою."
    ],
    "details_pl": [
      "Biegła znajomość języka ukraińskiego i polskiego (B2+) do komunikacji z użytkownikami.",
      "Podstawowa wiedza z zakresu technologii sieciowych (TCP/IP, DNS, DHCP).",
      "Doświadczenie w wsparciu IT będzie atutem, ale rozważamy również absolwentów kierunków technicznych.",
      "Odporność na stres i umiejętność tłumaczenia skomplikowanych rzeczy technicznych prostym językiem."
    ]
  },
  {
    "slug": "szczecin-maritime-welder-shipyard-408",
    "category": "manufacturing",
    "city": "Щецин",
    "city_pl": "Szczecin",
    "title": "Зварювальник (MIG/MAG 135/136) на суднобудівний завод",
    "title_pl": "Spawacz (MIG/MAG 135/136) w stoczni",
    "salary": "45 - 60 PLN/h netto",
    "company": "Baltic Shipyard Services",
    "shift_ua": "06:00 - 16:00 (можливі надгодини)",
    "shift_pl": "06:00 - 16:00 (możliwe nadgodziny)",
    "pattern_ua": "5-6 днів на тиждень",
    "pattern_pl": "5-6 dni w tygodniu",
    "start_ua": "Після здачі зварювальних зразків (próbki)",
    "start_pl": "Po zdaniu próbek spawalniczych",
    "contract_ua": "Umowa o pracę / B2B",
    "contract_pl": "Umowa o pracę / B2B",
    "offers_ua": [
      "Висока ставка для спеціалістів з підтвердженим досвідом та сертифікатами (DNV, PRS).",
      "Безкоштовне проживання в комфортних квартирах (по 2 людини в кімнаті) недалеко від верфі.",
      "Забезпечуємо якісним спецодягом (вогнетривким) та засобами індивідуального захисту (маски Speedglas).",
      "Можливість працювати багато годин (до 240-260 годин на місяць) для тих, хто хоче заробити.",
      "Допомога з легалізацією (Karta Pobytu) та отриманням нових сертифікатів."
    ],
    "offers_pl": [
      "Wysoka stawka dla specjalistów z potwierdzonym doświadczeniem i certyfikatami (DNV, PRS).",
      "Darmowe zakwaterowanie w komfortowych mieszkaniach (po 2 osoby w pokoju) blisko stoczni.",
      "Zapewniamy wysokiej jakości odzież roboczą (trudnopalną) i środki ochrony indywidualnej (maski Speedglas).",
      "Możliwość pracy w dużym wymiarze godzin (do 240-260 godzin miesięcznie) dla chętnych.",
      "Pomoc w legalizacji pobytu (Karta Pobytu) i zdobyciu nowych certyfikatów."
    ],
    "tasks_ua": [
      "Зварювання металоконструкцій корпусу судна методами 135/136 (порошковий дріт).",
      "Зварювання в різних просторових положеннях (включаючи стельове та вертикальне).",
      "Підготовка кромок до зварювання (зачистка, фаска).",
      "Контроль якості зварних швів (візуальний)."
    ],
    "tasks_pl": [
      "Spawanie konstrukcji stalowych kadłuba statku metodami 135/136 (drut proszkowy).",
      "Spawanie w różnych pozycjach przestrzennych (w tym pułapowej i pionowej).",
      "Przygotowanie krawędzi do spawania (szlifowanie, fazowanie).",
      "Kontrola jakości spoin (wizualna)."
    ],
    "details_ua": [
      "Обов'язковий досвід роботи на суднобудівному заводі або з важкими металоконструкціями (від 3 років).",
      "Вміння читати технічні креслення (ізометрія) є великою перевагою.",
      "Робота фізично важка, часто в замкнутих просторах (відсіках судна).",
      "Перед працевлаштуванням обов'язкове проходження тестів (зварювання зразків під рентген та ультразвук)."
    ],
    "details_pl": [
      "Obowiązkowe doświadczenie w pracy w stoczni lub przy ciężkich konstrukcjach stalowych (od 3 lat).",
      "Umiejętność czytania rysunków technicznych (izometria) jest dużym atutem.",
      "Praca fizycznie ciężka, często w przestrzeniach zamkniętych (sekcjach statku).",
      "Przed zatrudnieniem obowiązkowe zdanie testów (spawanie próbek pod rentgen i ultradźwięki)."
    ]
  },
  {
    "slug": "lodz-textile-seamstress-furniture-409",
    "category": "manufacturing",
    "city": "Лодзь",
    "city_pl": "Łódź",
    "title": "Швачка на виробництво м'яких меблів",
    "title_pl": "Szwalniczka na produkcji mebli tapicerowanych",
    "salary": "4000 - 6500 PLN/miesiąc (акорд)",
    "company": "ComfortSofa Sp. z o.o.",
    "shift_ua": "06:00 - 14:00, 14:00 - 22:00",
    "shift_pl": "06:00 - 14:00, 14:00 - 22:00",
    "pattern_ua": "5 днів на тиждень",
    "pattern_pl": "5 dni w tygodniu",
    "start_ua": "Протягом тижня",
    "start_pl": "W ciągu tygodnia",
    "contract_ua": "Umowa o pracę",
    "contract_pl": "Umowa o pracę",
    "offers_ua": [
      "Офіційне працевлаштування на фабриці з 20-річною історією (не агенція).",
      "Акордна система оплати праці: чим більше і якісніше шиєте, тим вища зарплата (без верхньої межі).",
      "Сучасні промислові швейні машини (Juki, Durkopp Adler), які регулярно обслуговуються механіками.",
      "Світлий, чистий цех з кондиціонуванням та хорошою вентиляцією.",
      "Знижки на продукцію фабрики для працівників."
    ],
    "offers_pl": [
      "Oficjalne zatrudnienie w fabryce z 20-letnią historią (nie przez agencję).",
      "Akordowy system wynagradzania: im więcej i lepiej szyjesz, tym wyższa pensja (bez górnego limitu).",
      "Nowoczesne przemysłowe maszyny do szycia (Juki, Durkopp Adler), regularnie serwisowane przez mechaników.",
      "Jasna, czysta hala z klimatyzacją i dobrą wentylacją.",
      "Zniżki na produkty fabryki dla pracowników."
    ],
    "tasks_ua": [
      "Пошиття чохлів для м'яких меблів (дивани, крісла, пуфи) з різних тканин та екошкіри.",
      "Зшивання деталей за готовими викрійками.",
      "Вшивання блискавок, кантів, декоративних елементів.",
      "Контроль якості швів та відповідності розмірам."
    ],
    "tasks_pl": [
      "Szycie pokrowców na meble tapicerowane (sofy, fotele, pufy) z różnych tkanin i ekoskóry.",
      "Zszywanie elementów według gotowych wykrojów.",
      "Wszywanie zamków, lamówek, elementów dekoracyjnych.",
      "Kontrola jakości szwów i zgodności z wymiarami."
    ],
    "details_ua": [
      "Досвід роботи швачкою на важких тканинах (меблі, авточохли, сумки) обов'язковий (від 1 року).",
      "Вміння працювати швидко та акуратно, дотримуючись технологічного процесу.",
      "Робота вимагає хорошого зору та моторики рук.",
      "Знання польської мови не є обов'язковим (на виробництві працює багато українців)."
    ],
    "details_pl": [
      "Doświadczenie w pracy jako szwaczka na ciężkich materiałach (meble, pokrowce samochodowe, torby) obowiązkowe (od 1 roku).",
      "Umiejętność szybkiej i dokładnej pracy, zgodnie z procesem technologicznym.",
      "Praca wymaga dobrego wzroku i motoryki rąk.",
      "Znajomość języka polskiego nie jest obowiązkowa (na produkcji pracuje wielu Ukraińców)."
    ]
  },
  {
    "slug": "krakow-education-kindergarten-teacher-410",
    "category": "education",
    "city": "Краків",
    "city_pl": "Kraków",
    "title": "Вихователь у двомовний дитячий садок (польсько-український)",
    "title_pl": "Wychowawca w dwujęzycznym przedszkolu (polsko-ukraińskim)",
    "salary": "4500 - 5500 PLN/miesiąc brutto",
    "company": "Happy Kids Academy",
    "shift_ua": "07:30 - 15:30 або 09:30 - 17:30",
    "shift_pl": "07:30 - 15:30 lub 09:30 - 17:30",
    "pattern_ua": "5 днів на тиждень",
    "pattern_pl": "5 dni w tygodniu",
    "start_ua": "З початку нового навчального місяця",
    "start_pl": "Od początku nowego miesiąca szkolnego",
    "contract_ua": "Umowa o pracę",
    "contract_pl": "Umowa o pracę",
    "offers_ua": [
      "Робота в сучасному приватному садочку з невеликими групами (до 15 дітей).",
      "Офіційне працевлаштування, оплачувані відпустки (включаючи літні канікули).",
      "Безкоштовне харчування (сніданки, обіди) разом з дітьми.",
      "Можливість реалізовувати власні творчі ідеї та методики розвитку.",
      "Підтримка методиста та психолога в складних ситуаціях."
    ],
    "offers_pl": [
      "Praca w nowoczesnym prywatnym przedszkolu z małymi grupami (do 15 dzieci).",
      "Oficjalne zatrudnienie, płatne urlopy (w tym wakacje letnie).",
      "Darmowe wyżywienie (śniadania, obiady) razem z dziećmi.",
      "Możliwość realizacji własnych kreatywnych pomysłów i metod rozwoju.",
      "Wsparcie metodyka i psychologa w trudnych sytuacjach."
    ],
    "tasks_ua": [
      "Організація навчально-виховного процесу для дітей 3-6 років (українською та польською мовами).",
      "Проведення розвиваючих занять (малювання, ліплення, музика, базові знання про світ).",
      "Організація прогулянок, ігор та денного сну.",
      "Спілкування з батьками щодо успіхів та поведінки дітей."
    ],
    "tasks_pl": [
      "Organizacja procesu dydaktyczno-wychowawczego dla dzieci w wieku 3-6 lat (w języku ukraińskim i polskim).",
      "Prowadzenie zajęć rozwojowych (rysowanie, lepienie, muzyka, podstawowa wiedza o świecie).",
      "Organizacja spacerów, zabaw i drzemki.",
      "Komunikacja z rodzicami na temat postępów i zachowania dzieci."
    ],
    "details_ua": [
      "Обов'язкова педагогічна освіта (дошкільна або початкова освіта), нострифікація диплома буде плюсом.",
      "Вільне володіння українською мовою та знання польської на рівні B1-B2.",
      "Любов до дітей, терпіння, креативність та відсутність шкідливих звичок.",
      "Наявність довідки про несудимість (zaświadczenie o niekaralności)."
    ],
    "details_pl": [
      "Obowiązkowe wykształczenie pedagogiczne (wychowanie przedszkolne lub wczesnoszkolne), nostryfikacja dyplomu będzie atutem.",
      "Biegła znajomość języka ukraińskiego i znajomość polskiego na poziomie B1-B2.",
      "Miłość do dzieci, cierpliwość, kreatywność i brak nałogów.",
      "Posiadanie zaświadczenia o niekaralności."
    ]
  },
  {
    "slug": "warsaw-beauty-nail-master-premium-411",
    "category": "beauty",
    "city": "Варшава",
    "city_pl": "Warszawa",
    "title": "Майстер манікюру та педикюру в преміум-салон",
    "title_pl": "Stylistka paznokci (manicure i pedicure) w salonie premium",
    "salary": "5000 - 9000 PLN/miesiąc (відсоток)",
    "company": "NailArt Studio Mokotów",
    "shift_ua": "Графік 2/2 або за домовленістю (09:00 - 21:00)",
    "shift_pl": "Grafik 2/2 lub do uzgodnienia (09:00 - 21:00)",
    "pattern_ua": "Змінний графік",
    "pattern_pl": "Grafik zmianowy",
    "start_ua": "Після тестової роботи на моделі",
    "start_pl": "Po pracy testowej na modelce",
    "contract_ua": "Umowa Zlecenie / B2B",
    "contract_pl": "Umowa Zlecenie / B2B",
    "offers_ua": [
      "Робота в стильному салоні в престижному районі Варшави (Мокотув) з великою базою клієнтів.",
      "Високий відсоток від послуг (40-50% залежно від досвіду) + чайові.",
      "Салон надає всі матеріали преміум-класу (Luxio, Kodi, CND) та обладнання (витяжки, фрезери).",
      "Регулярні майстер-класи та підвищення кваліфікації за рахунок салону.",
      "Дружня атмосфера, кава/чай для майстрів та клієнтів."
    ],
    "offers_pl": [
      "Praca w stylowym salonie w prestiżowej dzielnicy Warszawy (Mokotów) z dużą bazą klientów.",
      "Wysoki procent od usług (40-50% w zależności od doświadczenia) + napiwki.",
      "Salon zapewnia wszystkie materiały premium (Luxio, Kodi, CND) i sprzęt (pochłaniacze, frezarki).",
      "Regularne szkolenia i podnoszenie kwalifikacji na koszt salonu.",
      "Przyjazna atmosfera, kawa/herbata dla stylistek i klientów."
    ],
    "tasks_ua": [
      "Виконання комбінованого та апаратного манікюру/педикюру.",
      "Покриття гель-лаком під кутикулу, вирівнювання нігтьової пластини.",
      "Нарощування нігтів (гель, акригель) та виконання дизайнів (френч, стемпінг, розпис).",
      "Дотримання суворих правил стерилізації інструментів (сухожар)."
    ],
    "tasks_pl": [
      "Wykonywanie manicure/pedicure kombinowanego i frezarkowego.",
      "Malowanie hybrydowe pod skórki, nadbudowa płytki paznokcia.",
      "Przedłużanie paznokci (żel, akrylożel) i wykonywanie zdobień (french, stempel, malowanie).",
      "Przestrzeganie surowych zasad sterylizacji narzędzi (autoklaw)."
    ],
    "details_ua": [
      "Досвід роботи майстром манікюру від 2 років, наявність портфоліо робіт (Instagram/фото).",
      "Швидкість роботи: зняття + манікюр + однотонне покриття до 1.5-2 годин.",
      "Комунікабельність, охайність, вміння знайти підхід до вимогливих клієнтів.",
      "Знання польської мови на комунікативному рівні (A2-B1) для спілкування з клієнтами."
    ],
    "details_pl": [
      "Doświadczenie w pracy jako stylistka paznokci od 2 lat, posiadanie portfolio (Instagram/zdjęcia).",
      "Czas pracy: zdjęcie + manicure + kolor jednolity do 1.5-2 godzin.",
      "Komunikatywność, schludność, umiejętność znalezienia podejścia do wymagających klientów.",
      "Znajomość języka polskiego na poziomie komunikatywnym (A2-B1) do rozmów z klientami."
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

console.log('Added 12 new unique vacancies.');
