const fs = require('fs');
const path = require('path');

const contentPath = path.join(__dirname, '..', 'src', 'content.json');
const indexablePath = path.join(__dirname, '..', 'src', 'indexable-vacancies.json');

const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
const indexable = JSON.parse(fs.readFileSync(indexablePath, 'utf8'));

const newVacancies = [
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

console.log('Added 5 more unique vacancies.');
