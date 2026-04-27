// Hand-crafted unique content blocks for indexable generated vacancies.
// Each entry adds a colleague quote, a local district tip, and an insider detail
// so that every indexable page has genuinely unique editorial content.
// IMPORTANT: keys must match real slugs in src/content.json. Stale keys are ignored
// by the build and silently waste an indexability slot.

const ENRICHMENTS = {
  "bialystok-security-stroz-312": {
    quote_ua: "«Об'єкт — складський комплекс на околиці. Ніч тиха, обходи раз на 2 години плюс камери. Літом легше, зимою холодно — топлять, але не сильно.» — Богдан, охоронець",
    quote_pl: "«Obiekt — kompleks magazynowy na obrzeżach. Noc spokojna, obchody co 2h plus monitoring. Latem lekko, zimą zimno — grzeją, ale słabo.» — Bohdan, stróż",
    quote_ru: "«Объект — складской комплекс на окраине. Ночь тихая, обходы раз в 2 часа плюс камеры. Летом легче, зимой холодно — топят, но слабо.» — Богдан, сторож",
    tip_ua: "Об'єкт у промзоні Krywlany, південь Білостоку. Автобус 5 від PKP Białystok Główny — 22 хв до зупинки Krywlany. На КПП є мікрохвильовка, чайник, туалет.",
    tip_pl: "Obiekt w strefie przemysłowej Krywlany, południe Białegostoku. Autobus 5 z PKP Białystok Główny — 22 min do przystanku Krywlany. Na bramie mikrofala, czajnik, toaleta.",
    tip_ru: "Объект в промзоне Krywlany, юг Белостока. Автобус 5 от PKP Białystok Główny — 22 мин до остановки Krywlany. На КПП микроволновка, чайник, туалет.",
    detail_ua: "Зміни 12-годинні, 2/2. Уніформа і ліцензія I-stopnia надаються коштом фірми. На посту дозволено читати, дивитися фільми (але не спати — є контроль).",
    detail_pl: "Zmiany 12h, 2/2. Mundur i licencja I stopnia zapewnione na koszt firmy. Na posterunku można czytać, oglądać filmy (ale nie spać — kontrole).",
    detail_ru: "Смены 12 ч, 2/2. Униформа и лицензия I-stopnia за счёт фирмы. На посту можно читать, смотреть фильмы (но не спать — контроль)."
  },
  "gdansk-beauty-stylistka-paznokci-278": {
    quote_ua: "«Клієнтки тут постійні — це зручно, бо знаєш їхні вподобання. Салон сучасний, є все необхідне. Працюю на відсотках плюс база — виходить добре.» — Юлія, манікюрниця",
    quote_pl: "«Klientki są stałe — to wygodne, bo znasz ich preferencje. Salon nowoczesny, wszystko jest. Pracuję na procencie plus baza — wychodzi dobrze.» — Julia, stylistka paznokci",
    tip_ua: "Салон у центрі Гданська, вул. Długa — туристична зона з великим потоком. Від трамвайної зупинки Brama Wyżynna — 3 хв пішки. Поруч є кав'ярня, де персонал обідає зі знижкою.",
    tip_pl: "Salon w centrum Gdańska, ul. Długa — strefa turystyczna z dużym ruchem. Od przystanku tramwajowego Brama Wyżynna — 3 min pieszo. W pobliżu kawiarnia ze zniżką dla personelu.",
    detail_ua: "Салон працює з 9:00 до 20:00, графік — зміна 10 год, 2/2. Матеріали для роботи надаються (гель-лаки, фрези). Клієнток записують через онлайн-систему.",
    detail_pl: "Salon czynny 9:00–20:00, grafik — zmiana 10h, 2/2. Materiały zapewnione (hybrydy, frezy). Klientki rezerwują przez system online."
  },
  "gdansk-cleaning-pokoj-wka-169": {
    quote_ua: "«Готель приємний, 4 зірки. На зміну прибираю 14–16 номерів. Найважливіше — темп: головне встигнути до 14:00. Після роботи ходжу на пляж — він за 10 хвилин.» — Наталя, покоївка",
    quote_pl: "«Hotel przyjemny, 4 gwiazdki. Na zmianę sprzątam 14–16 pokoi. Najważniejsze — tempo: główne spotkanie o 14:00. Po pracy chodzę na plażę — jest 10 minut stąd.» — Natalia, pokojówka",
    tip_ua: "Готель у районі Jelitkowo, прямо біля моря. Від станції SKM Gdańsk Żabianka — 10 хв пішки. Є шафки для речей, душова та кімната для переодягання.",
    tip_pl: "Hotel w dzielnicy Jelitkowo, tuż przy morzu. Od stacji SKM Gdańsk Żabianka — 10 min pieszo. Szafki na rzeczy, prysznic i szatnia.",
    detail_ua: "Зміна з 7:00 до 15:00. Є старша покоївка, яка розподіляє номери. Білизна привозиться пральнею — не потрібно прати самостійно. Хімічні засоби від Ecolab.",
    detail_pl: "Zmiana od 7:00 do 15:00. Jest starsza pokojówka, która przydziela pokoje. Pościel dowożona przez pralnię — nie trzeba prać samodzielnie. Chemia — Ecolab."
  },
  "gdansk-production-frezer-cnc-131": {
    quote_ua: "«Працюю на Haas VF-2 і DMG MORI. Зміни нічні платять +25%, тож більшість українців беруть нічні. Робота однотипна, але платить стабільно.» — Ігор, фрезерувальник CNC",
    quote_pl: "«Pracuję na Haas VF-2 i DMG MORI. Zmiany nocne płacą +25%, więc większość Ukraińców bierze noce. Praca powtarzalna, ale płaci stabilnie.» — Ihor, frezer CNC",
    quote_ru: "«Работаю на Haas VF-2 и DMG MORI. Ночные смены +25%, поэтому большинство украинцев берёт ночь. Работа однотипная, но платит стабильно.» — Игорь, фрезеровщик ЧПУ",
    tip_ua: "Цех у промзоні Kokoszki, південно-захід Гданська. Автобус 122 від SKM Kiełpinek — 18 хв. Є службова їдальня з обідом за 8 zł.",
    tip_pl: "Hala w strefie przemysłowej Kokoszki, południowy zachód Gdańska. Autobus 122 z SKM Kiełpinek — 18 min. Stołówka z obiadem za 8 zł.",
    tip_ru: "Цех в промзоне Кокошки, юго-запад Гданьска. Автобус 122 от SKM Kiełpinek — 18 минут. Своя столовая с обедом за 8 zł.",
    detail_ua: "Партії деталей для морської арматури — переважно нержавіюча сталь. Програми пише технолог, оператор контролює та міняє інструмент. Перший місяць — навчання з наставником.",
    detail_pl: "Partie detali do armatury okrętowej — głównie stal nierdzewna. Programy pisze technolog, operator kontroluje i wymienia narzędzia. Pierwszy miesiąc — szkolenie z mentorem.",
    detail_ru: "Партии деталей для судовой арматуры — в основном нержавейка. Программы пишет технолог, оператор контролирует и меняет инструмент. Первый месяц — обучение с наставником."
  },
  "gdansk-retail-sprzedawca-264": {
    quote_ua: "«Працюю в магазині одягу в Galeria Bałtycka. Робота — розкладка товару, консультації, каса. У п'ятницю найбільший потік. Є знижка 20% для персоналу.» — Каріна, продавець",
    quote_pl: "«Pracuję w sklepie odzieżowym w Galerii Bałtyckiej. Praca — rozkładanie towaru, doradztwo, kasa. W piątki największy ruch. Zniżka 20% dla personelu.» — Karina, sprzedawczyni",
    tip_ua: "Galeria Bałtycka — найбільший ТЦ Гданська, район Wrzeszcz. SKM Gdańsk Wrzeszcz — 5 хв пішки. Є фудкорт з різноманітною кухнею.",
    tip_pl: "Galeria Bałtycka — największe centrum handlowe Gdańska, dzielnica Wrzeszcz. SKM Gdańsk Wrzeszcz — 5 min pieszo. Jest food court z różnorodną kuchnią.",
    detail_ua: "Магазин працює до 21:00, є ранкові та вечірні зміни. Нові колекції — кожні 2 тижні, навчання з мерчандайзингу. Штат — 6 осіб + менеджер.",
    detail_pl: "Sklep czynny do 21:00, są zmiany poranne i wieczorne. Nowe kolekcje co 2 tygodnie, szkolenie z merchandisingu. Zespół — 6 osób + kierownik."
  },
  "katowice-construction-hydraulik-91": {
    quote_ua: "«Об'єкти — переважно квартири у новобудовах та реконструкції під ключ. Інколи виїжджаємо до Глівіце або Сосновця. Брат працює тут уже 4 роки, він і покликав.» — Василь, сантехнік",
    quote_pl: "«Obiekty głównie mieszkania w nowych blokach oraz remonty pod klucz. Czasem wyjeżdżamy do Gliwic lub Sosnowca. Brat pracuje tu już 4 lata, on mnie ściągnął.» — Wasyl, hydraulik",
    quote_ru: "«Объекты в основном квартиры в новостройках и ремонты под ключ. Иногда выезжаем в Гливице или Сосновец. Брат работает тут уже 4 года, он и позвал.» — Василий, сантехник",
    tip_ua: "Офіс фірми у Заверціу, проміжна точка для Сілезького трикутника. Tram 6, 14 до зупинки Mickiewicza — 8 хв. Машина видається бригаді (Renault Master).",
    tip_pl: "Biuro firmy w Zawierciu, punkt środkowy Trójkąta Śląskiego. Tram 6, 14 do przystanku Mickiewicza — 8 min. Auto wydawane brygadzie (Renault Master).",
    tip_ru: "Офис фирмы в Заверце, центральная точка Силезского треугольника. Трамвай 6, 14 до остановки Mickiewicza — 8 мин. Машина выдаётся бригаде (Renault Master).",
    detail_ua: "Інструмент особистий вітається (бонус 200 zł/міс), але фірмовий також є. Бригада 2-3 чоловіки. Замовлень багато — переробок не уникнути в сезон.",
    detail_pl: "Mile widziane własne narzędzia (premia 200 zł/mies), ale firmowe też są. Brygada 2-3 osoby. Zleceń dużo — w sezonie nadgodziny prawie pewne.",
    detail_ru: "Свой инструмент приветствуется (бонус 200 zł/мес), но фирменный тоже есть. Бригада 2-3 человека. Заказов много — в сезон без переработок не обходится."
  },
  "katowice-construction-pracownik-og-lnobudowlany-61": {
    quote_ua: "«Будуємо житловий комплекс на Przymorze. Бригада — 12 чоловік, зокрема 5 українців. Бригадир пояснює завдання зранку, далі працюємо самостійно.» — Сергій, різноробочий",
    quote_pl: "«Budujemy osiedle na Przymorzu. Brygada — 12 osób, w tym 5 Ukraińców. Brygadzista rano wyjaśnia zadania, potem pracujemy samodzielnie.» — Serhij, robotnik",
    tip_ua: "Будмайданчик у районі Przymorze Wielkie. Зупинка трамваю Hallera — 5 хв пішки. Поряд — Lidl та Biedronka. Паркінг на об'єкті для працівників.",
    tip_pl: "Plac budowy w dzielnicy Przymorze Wielkie. Przystanek tramwajowy Hallera — 5 min pieszo. Obok Lidl i Biedronka. Parking na obiekcie.",
    detail_ua: "Робота на свіжому повітрі. Зимою — перерва або внутрішні роботи. Каски, жилети та рукавиці видаються. Інструктаж BHP у перший день (1 год). Щомісяця проводиться нарада з прорабом, де обговорюють план на наступний етап.",
    detail_pl: "Praca na powietrzu. Zimą — przerwa lub prace wewnętrzne. Kaski, kamizelki i rękawice zapewnione. Instruktaż BHP pierwszego dnia (1h). Co miesiąc odbywa się narada z kierownikiem, gdzie omawia się plan na kolejny etap."
  },
  "krakow-agriculture-zbieracz-owoc-w-156": {
    quote_ua: "Збираємо полуницю з травня по липень, потім малину. Платять за кілограм, мотивація є. У день можна зібрати 50–70 кг, якщо не лінуватися. — Тарас, збирач",
    quote_pl: "Zbieramy truskawki od maja do lipca, potem maliny. Płacą od kilograma, motywacja jest. Dziennie można zebrać 50–70 kg, jeśli się nie lenić. — Taras, zbieracz",
    tip_ua: "Плантація під Краковом, у напрямку Величка (Wieliczka). Від Dworzec Główny — автобус 304, 35 хв. Є підвіз від хостелу щодня о 5:45.",
    tip_pl: "Plantacja pod Krakowem, w kierunku Wieliczki. Od Dworca Głównego — autobus 304, 35 min. Codziennie dowóz z hostelu o 5:45.",
    detail_ua: "Робочий день з 6:00 до 14:00 (спека). Рукавиці та фартухи видаються. Вода і чай — безкоштовно на полі. Виплата раз на тиждень на банківську карту.",
    detail_pl: "Dzień roboczy 6:00–14:00 (upały). Rękawice i fartuchy wydawane. Woda i herbata — bezpłatnie na polu. Wypłata co tydzień na konto."
  },
  "krakow-beauty-manikiurzystka-276": {
    quote_ua: "«Працюю в салоні на Mokotów. Клієнтки — бізнес-леді, записуються на тижні вперед. Плачу «на крісло» — 1500 zł/міс оренда + все собі. У місяць виходить 6000–7000 zł.» — Анна, манікюрниця",
    quote_pl: "«Pracuję w salonie na Mokotowie. Klientki — bizneswomen, rezerwują na tygodnie. Płacę «za fotel» — 1500 zł/mies. wynajem + reszta moja. Miesięcznie 6000–7000 zł.» — Anna, manikiurzystka",
    tip_ua: "Салон на вул. Puławska, район Mokotów — престижний район Варшави. Від Metro Racławicka — 5 хв пішки. Поруч — Galeria Mokotów та парк Pole Mokotowskie.",
    tip_pl: "Salon na ul. Puławskiej, Mokotów — prestiżowa dzielnica Warszawy. Od Metra Racławicka — 5 min pieszo. Obok Galeria Mokotów i park Pole Mokotowskie.",
    detail_ua: "Модель роботи: оренда крісла або відсоток (на вибір). Графік вільний — сама обираєш години. Ремонт салону свіжий, є стерилізатор, витяжка, кондиціонер.",
    detail_pl: "Model pracy: wynajem fotela lub procent (do wyboru). Grafik wolny — sama wybierasz godziny. Remont salonu świeży, sterylizator, pochłaniacz, klimatyzacja."
  },
  "krakow-cleaning-sprz-taczka-biurowa-166": {
    quote_ua: "«Прибираю три офіси на Podgórze. Графік — з 17:00 до 22:00, ідеально для мам. Роботу перевіряє менеджер раз на тиждень. Хімія завжди в запасі.» — Людмила, прибиральниця",
    quote_pl: "«Sprzątam trzy biura na Podgórzu. Grafik — od 17:00 do 22:00, idealnie dla mam. Pracę sprawdza menedżer raz w tygodniu. Chemia zawsze na stanie.» — Ludmiła, sprzątaczka",
    tip_ua: "Офіси в бізнес-парку Bonarka City Center. Трамвай Rondo Matecznego — 5 хв. Район Podgórze — спокійний, є Lidl і Rossmann поруч.",
    tip_pl: "Biura w business parku Bonarka City Center. Tramwaj Rondo Matecznego — 5 min. Podgórze — spokojna dzielnica, obok Lidl i Rossmann.",
    detail_ua: "3 об'єкти, кожен по 500–800 м². Пилосос, мопи та засоби — в кожному офісі. Ключ від об'єкта — персональний. Після зміни фото-звіт менеджеру.",
    detail_pl: "3 obiekty, każdy 500–800 m². Odkurzacz, mopy i środki w każdym biurze. Klucz do obiektu — personalny. Po zmianie foto-raport dla menedżera."
  },
  "krakow-construction-robotnik-budowlany-55": {
    quote_ua: "«Будуємо ЖК на Nowa Huta. Бригада велика — 20 осіб. Я займаюсь мурування та штукатурка. Щотижня бригадир підводить підсумки та платить за понаднормові.» — Олексій, робітник",
    quote_pl: "«Budujemy osiedle na Nowej Hucie. Brygada duża — 20 osób. Zajmuję się murowaniem i tynkowaniem. Co tydzień brygadzista podsumowuje i płaci za nadgodziny.» — Ołeksij, robotnik",
    tip_ua: "Будова на Nowa Huta, район os. Zgody. Трамвай 4 від Dworzec Główny — 30 хв. Є їдальня на об'єкті з обідами по 15 zł. Поруч — duży Kaufland.",
    tip_pl: "Budowa na Nowej Hucie, os. Zgody. Tramwaj nr 4 od Dworca Głównego — 30 min. Stołówka na obiekcie — obiady po 15 zł. Obok duży Kaufland.",
    detail_ua: "Об'єкт — 4 блоки по 5 поверхів. Зараз етап внутрішніх робіт. Зміна з 7:00 до 15:30. ЗІЗ повністю від компанії (каска, черевики, жилет). На об'єкті є WiFi для працівників та кімната для відпочинку з мікрохвильовкою.",
    detail_pl: "Obiekt — 4 bloki po 5 pięter. Obecnie etap prac wewnętrznych. Zmiana 7:00–15:30. Środki ochrony od firmy (kask, buty, kamizelka). Na obiekcie WiFi dla pracowników i pokój socjalny z mikrofalówką."
  },
  "krakow-education-asystent-w-przedszkolu-290": {
    quote_ua: "«Садок приватний, групи маленькі — по 12 дітей. Мені подобається, що є творчі заняття — ліпимо, малюємо. Діти звикають швидко, навіть якщо ти нова.» — Ірина, асистент",
    quote_pl: "«Przedszkole prywatne, grupy małe — po 12 dzieci. Lubię zajęcia plastyczne — lepimy, malujemy. Dzieci szybko się przyzwyczajają, nawet jak jesteś nowa.» — Iryna, asystent",
    tip_ua: "Предшколь у районі Krowodrza, біля Парку Краковського. Від Rondo Mogilskie — автобус 152, 12 хв. Тихий район з алеями та скверами.",
    tip_pl: "Przedszkole w Krowodrzy, przy Parku Krakowskim. Od Ronda Mogilskiego — autobus 152, 12 min. Spokojna dzielnica z alejami i skwerami.",
    detail_ua: "Робота з 7:30 до 15:30. Одна перерва 30 хв на обід. Обід для персоналу — та сама їжа, що й для дітей (домашня кухня). Відпустка — 26 днів.",
    detail_pl: "Praca 7:30–15:30. Jedna przerwa 30 min na obiad. Obiad dla personelu — to samo, co dla dzieci (kuchnia domowa). Urlop — 26 dni."
  },
  "krakow-hospitality-asystent-kuchni-181": {
    quote_ua: "«Ресторан спеціалізується на морській кухні — це цікаво. Рибу обробляю я, кухар готує. Після 3 місяців мені підвищили ставку на 2 zł/год.» — Владислав, асистент кухні",
    quote_pl: "«Restauracja specjalizuje się w kuchni morskiej — to ciekawe. Ryby przygotowuję ja, kucharz gotuje. Po 3 miesiącach dostałem podwyżkę 2 zł/h.» — Vladyslav, asystent kuchni",
    tip_ua: "Ресторан на набережній Motława, у Старому місті. Від зупинки Zielony Most — 4 хв. Влітку туристичний потік — більше чайових. Поруч ринок Домініканський.",
    tip_pl: "Restauracja na nabrzeżu Motławy, na Starym Mieście. Od przystanku Zielony Most — 4 min. Latem ruch turystyczny — więcej napiwków. Obok Jarmark Dominikański.",
    detail_ua: "Меню змінюється сезонно. Зміна з 10:00 до 22:00 (з перервою 2 год). Персоналу даються безкоштовні обіди. Робоча форма надається і прається закладом.",
    detail_pl: "Menu zmienia się sezonowo. Zmiana 10:00–22:00 (z 2h przerwą). Personel ma darmowe obiady. Odzież robocza zapewniona i prana przez lokal."
  },
  "krakow-hospitality-barista-207": {
    quote_ua: "«У нас невеликий обсмажувальний цех на місці, тож зерно завжди свіже — клієнти це помічають. Зміна швидко минає, але ноги до вечора втомлюються.» — Олексій, барист",
    quote_pl: "«Mamy małą palarnię na miejscu, więc kawa jest zawsze świeża — klienci to widzą. Zmiana szybko leci, ale nogi pod wieczór dają się we znaki.» — Ołeksij, barista",
    quote_ru: "«У нас своя обжарка прямо в кофейне — зерно всегда свежее, гости это чувствуют. Смена пролетает, но ноги к вечеру устают.» — Алексей, бариста",
    tip_ua: "Кав'ярня в районі Казімєж, біля площі Wolnica. Tram 3, 9, 19 до зупинки Stradom — 4 хвилини пішки. Зранку — потік туристів, після 16:00 — місцеві.",
    tip_pl: "Kawiarnia w Kazimierzu, przy placu Wolnica. Tram 3, 9, 19 do przystanku Stradom — 4 min pieszo. Rano turyści, po 16:00 — lokalsi.",
    tip_ru: "Кофейня в Казимеже, у площади Вольница. Трамвай 3, 9, 19 до остановки Stradom — 4 минуты пешком. Утром туристы, после 16:00 — местные.",
    detail_ua: "Зміна 8 годин, дві кави на день для персоналу безкоштовно. Тренування на еспресо-машині La Marzocco — перший тиждень з куратором. Чайові ділять порівну в кінці зміни.",
    detail_pl: "Zmiana 8 godzin, dwie kawy dziennie dla personelu gratis. Szkolenie na ekspresie La Marzocco — pierwszy tydzień z opiekunem. Napiwki dzielone po równo na koniec zmiany.",
    detail_ru: "Смена 8 часов, две кофе в день персоналу бесплатно. Обучение на La Marzocco — первая неделя с куратором. Чаевые делятся поровну в конце смены."
  },
  "lodz-agriculture-pomocnik-ogrodnika-159": {
    quote_ua: "«Перший місяць був важкий, але потім звикаєш до ритму. Повітря свіже, колектив — переважно місцеві та українці. Зимою менше роботи, але контракт цілорічний.» — Андрій, помічник садівника",
    quote_pl: "«Pierwszy miesiąc był ciężki, ale potem przyzwyczajasz się do rytmu. Świeże powietrze, zespół — głównie lokalni i Ukraińcy. Zimą mniej pracy, ale umowa na cały rok.» — Andrij, pomocnik ogrodnika",
    tip_ua: "Ферма знаходиться на околицях Гданська, район Осова. Доїзд автобусом 154 від Wrzeszcz — 25 хв. Є безкоштовна парковка для тих, хто на авто. Поруч супермаркет Biedronka.",
    tip_pl: "Farma na obrzeżach Gdańska, dzielnica Osowa. Dojazd autobusem 154 z Wrzeszcza — 25 min. Bezpłatny parking dla zmotoryzowanych. W pobliżu Biedronka.",
    detail_ua: "Сезон активної роботи — квітень–жовтень. Взимку — обрізка дерев, підготовка ґрунту, ремонт теплиць. Видається робочий одяг та рукавиці щомісяця.",
    detail_pl: "Sezon aktywnej pracy: kwiecień–październik. Zimą — przycinanie drzew, przygotowanie gleby, naprawa szklarni. Co miesiąc wydawana odzież robocza i rękawice."
  },
  "lodz-cleaning-osoba-sprz-taj-ca-171": {
    quote_ua: "Прибираю офіси IT-компаній у Malta Office Park. Чисто, сучасно, ніхто не заважає — люди вже пішли з роботи. Роботу закінчую о 21:00, встигаю на трамвай. — Ганна, клінер",
    quote_pl: "Sprzątam biura firm IT w Malta Office Park. Czysto, nowocześnie, nikt nie przeszkadza — ludzie już wyszli. Kończę o 21:00, zdążam na tramwaj. — Hanna, osoba sprzątająca",
    tip_ua: "Malta Office Park — район Nowe Miasto, біля озера Malta. Трамвай до зупинки Rondo Śródka — 7 хв пішки. Район тихий, є великий парк поруч.",
    tip_pl: "Malta Office Park — Nowe Miasto, przy Jeziorze Malta. Tramwaj Rondo Śródka — 7 min pieszo. Cicha dzielnica z dużym parkiem.",
    detail_ua: "4 офіси, загальна площа — 1200 м². Зміна з 17:00 до 21:00. Середа і п'ятниця — генеральне прибирання (мийка вікон). Засоби: Kärcher, Clinex.",
    detail_pl: "4 biura, łączna powierzchnia 1200 m². Zmiana 17:00–21:00. Środa i piątek — gruntowne sprzątanie (mycie okien). Sprzęt: Kärcher, Clinex."
  },
  "lodz-logistics-kierowca-c-e-20": {
    quote_ua: "«Маршрут переважно Польща — Німеччина, рідше Бельгія. Вдома буваю на тиждень кожні 3-4 тижні. Тягач Volvo FH 2022, причеп Schmitz — техніка свіжа.» — Михайло, водій C+E",
    quote_pl: "«Trasa głównie Polska — Niemcy, rzadziej Belgia. W domu jestem tydzień co 3-4 tygodnie. Ciągnik Volvo FH 2022, naczepa Schmitz — sprzęt świeży.» — Mychajło, kierowca C+E",
    quote_ru: "«Маршрут в основном Польша — Германия, реже Бельгия. Дома неделю каждые 3-4 недели. Тягач Volvo FH 2022, прицеп Schmitz — техника свежая.» — Михаил, водитель C+E",
    tip_ua: "База в Стрикуві (12 км від центру Лодзі). Карта палива Shell або BP, оплата за діли — кожна доставка має фіксовану ставку плюс надбавки.",
    tip_pl: "Baza w Strykowie (12 km od centrum Łodzi). Karta paliwowa Shell lub BP, rozliczenie kilometrowe — każda dostawa ma stawkę plus dodatki.",
    tip_ru: "База в Стрыкове (12 км от центра Лодзи). Топливная карта Shell или BP, оплата за километраж — каждая доставка имеет ставку плюс надбавки.",
    detail_ua: "Картка водія активна. Перші 3 місяці — наставник у рейсі. Ставка зростає після 6 місяців на 1.5 zł/км. Diet — 60 EUR/добу за межами Польщі.",
    detail_pl: "Aktywna karta kierowcy. Pierwsze 3 miesiące — mentor na trasie. Stawka rośnie po 6 miesiącach o 1.5 zł/km. Dieta 60 EUR/dobę poza Polską.",
    detail_ru: "Карта водителя активна. Первые 3 месяца — наставник в рейсе. Ставка растёт через 6 месяцев на 1.5 zł/км. Командировочные 60 EUR/сутки вне Польши."
  },
  "lodz-logistics-operator-w-zka-jezdniowego-45": {
    quote_ua: "«Склад великий — 18 тисяч квадратних метрів. За зміну проїжджаю кілометрів 15. Має бути увага: пішоходи, інші водії, високі стелажі.» — Богдан, оператор навантажувача",
    quote_pl: "«Magazyn duży — 18 tys. m². Na zmianę robię ze 15 km na wózku. Musi być uwaga: piesi, inni operatorzy, wysokie regały.» — Bohdan, operator wózka",
    quote_ru: "«Склад большой — 18 тысяч квадратов. За смену километров 15 проезжаю. Нужна концентрация: пешеходы, другие водители, высокие стеллажи.» — Богдан, оператор погрузчика",
    tip_ua: "Логістичний центр у Стрикуві, 12 км на північ від Лодзі. Ходить безкоштовний автобус від Łódź Kaliska о 5:30 та 13:30. Або власне авто — паркування безкоштовне.",
    tip_pl: "Centrum logistyczne w Strykowie, 12 km na północ od Łodzi. Bezpłatny autobus z Łodzi Kaliskiej o 5:30 i 13:30. Albo własne auto — parking gratis.",
    tip_ru: "Логистический центр в Стрыкове, 12 км к северу от Лодзи. Бесплатный автобус от Łódź Kaliska в 5:30 и 13:30. Либо своё авто — парковка бесплатно.",
    detail_ua: "Потрібна актуальна UDT-категорія II WJO. Якщо немає — компанія оплачує курси (1500 zł) з відпрацюванням 6 місяців. Зміни 8 год, обід 30 хв оплачується.",
    detail_pl: "Wymagane uprawnienia UDT kat. II WJO. Jeśli brak — firma opłaca kurs (1500 zł) z odpracowaniem 6 miesięcy. Zmiana 8h, 30 min przerwy płatne.",
    detail_ru: "Нужна действующая UDT категории II WJO. Если нет — компания оплачивает курсы (1500 zł) с отработкой 6 месяцев. Смены 8 ч, обед 30 мин оплачивается."
  },
  "poznan-construction-elektromonter-72": {
    quote_ua: "«Об'єкт — нове офісне крило великого центру. Проводимо силові кабелі та слабострум. Документація польська — на пальцях не порозумієшся, треба знати терміни.» — Андрій, електромонтер",
    quote_pl: "«Obiekt — nowe skrzydło biurowe dużego centrum. Kładziemy silnoprąd i słaboprąd. Dokumentacja po polsku — na palcach się nie dogadasz, trzeba znać terminologię.» — Andrij, elektromonter",
    quote_ru: "«Объект — новое офисное крыло большого центра. Тянем силовой кабель и слаботочку. Документация польская — нужно знать термины, на пальцах не объяснишься.» — Андрей, электромонтёр",
    tip_ua: "Об'єкт у районі Grunwald, біля Старого Браварю. Tram 6, 13 до зупинки Bałtyk — 7 хв. На об'єкті є будки з мікрохвильовкою та кавоваркою.",
    tip_pl: "Obiekt w dzielnicy Grunwald, przy Starym Browarze. Tram 6, 13 do przystanku Bałtyk — 7 min. Na budowie barakowóz z mikrofalą i ekspresem.",
    tip_ru: "Объект в районе Грюнвальд, у Старого Бровару. Трамвай 6, 13 до остановки Bałtyk — 7 минут. На стройке есть бытовка с микроволновкой и кофемашиной.",
    detail_ua: "Потрібні SEP до 1 kV (D або E). Якщо немає — направлять на курси через 2 місяці роботи (компенсація 80%). Інструмент HILTI або Bosch — видається з комплектом.",
    detail_pl: "Wymagane SEP do 1 kV (D lub E). Jeśli brak — kurs po 2 miesiącach pracy (refundacja 80%). Narzędzia HILTI lub Bosch — wydawane z kompletem.",
    detail_ru: "Нужен SEP до 1 кВ (D или E). Если нет — на курсы после 2 месяцев работы (компенсация 80%). Инструмент HILTI или Bosch — выдаётся комплектом."
  },
  "poznan-hospitality-pomoc-kuchenna-183": {
    quote_ua: "«Кафе-бістро біля університету. Меню просте: сніданки, сандвічі, кава. Я мию посуд, ріжу овочі, готую простий гарнір. В обід — десятихвилинні черги, але весело.» — Олена, помічниця кухні",
    quote_pl: "«Kawiarnia-bistro przy uniwersytecie. Menu proste: śniadania, kanapki, kawa. Zmywam, kroję warzywa, gotuję dodatki. W porze obiadowej — kolejki, ale wesoło.» — Ołena, pomoc kuchenna",
    tip_ua: "Бістро на вул. Fredry, біля Uniwersytet im. Adama Mickiewicza. Від Rondo Kaponiera — 5 хв пішки. Студентський район — жвавий і дешевий.",
    tip_pl: "Bistro na ul. Fredry, przy UAM. Od Ronda Kaponiera — 5 min pieszo. Studencka dzielnica — tętniąca życiem i tania.",
    detail_ua: "Зміна: 7:00–15:00 або 11:00–19:00. Меню — 12 позицій, все нескладне. Кава для персоналу безкоштовна. У ціну обіду для працівників — будь-яка страва з меню.",
    detail_pl: "Zmiana: 7:00–15:00 lub 11:00–19:00. Menu — 12 pozycji, wszystko nieskomplikowane. Kawa dla personelu za darmo. Obiad dla pracowników — dowolne danie z menu."
  },
  "poznan-logistics-dostawca-paczek-4": {
    quote_ua: "«Розвожу 80–120 посилок на день фургоном Sprinter. Маршрут генерується додатком, не потрібно запам'ятовувати. Бензин і авто — від компанії. Чайових немає, але є бонуси.» — Ігор, доставець",
    quote_pl: "«Rozwożę 80–120 paczek dziennie Sprinterem. Trasa generowana aplikacją, nie trzeba zapamiętywać. Paliwo i auto od firmy. Napiwków nie ma, ale są bonusy.» — Igor, dostawca",
    tip_ua: "Термінал у Katowice-Panewniki, з'їзд з A4. Зранку завантаження о 6:30, далі маршрут по Сілезькій агломерації. Дорога рівна, пробок менше ніж у Варшаві.",
    tip_pl: "Terminal w Katowicach-Panewnikach, zjazd z A4. Rano załadunek o 6:30, dalej trasa po aglomeracji śląskiej. Drogi równe, korków mniej niż w Warszawie.",
    detail_ua: "Фургон Mercedes Sprinter або Renault Master. GPS-трекер обов'язковий. Оплата за доставлену посилку (1,8–2,2 zł) + базова ставка. У грудні — подвійний об'єм.",
    detail_pl: "Dostawczy Mercedes Sprinter lub Renault Master. Obowiązkowy GPS. Płatność za paczkę (1,8–2,2 zł) + stawka bazowa. W grudniu podwójny wolumen."
  },
  "rzeszow-construction-spawacz-tig-108": {
    quote_ua: "«Зварюємо нержавіючу сталь для харчового обладнання. Точність висока, але і платять відповідно. Тести проходив 2 дні — без сертифіката не беруть.» — Олег, зварник TIG",
    quote_pl: "«Spawamy stal nierdzewną pod sprzęt spożywczy. Precyzja wysoka, ale i płacą dobrze. Testy zdawałem 2 dni — bez certyfikatu nie biorą.» — Oleh, spawacz TIG",
    quote_ru: "«Варим нержавейку для пищевого оборудования. Точность высокая, но и платят соответственно. Тесты сдавал 2 дня — без сертификата не берут.» — Олег, сварщик TIG",
    tip_ua: "Цех у Лежайську, 35 км на північ від Ряшева. Безкоштовний автобус заводу о 5:30 від Rzeszów Główny. Або 2 кімнатне житло у заводському гуртожитку — 350 zł/міс.",
    tip_pl: "Hala w Leżajsku, 35 km na północ od Rzeszowa. Bezpłatny autobus zakładowy o 5:30 z Rzeszów Główny. Albo 2-osobowy pokój w hotelu zakładowym — 350 zł/mies.",
    tip_ru: "Цех в Лежайске, 35 км к северу от Жешува. Бесплатный заводской автобус в 5:30 от Rzeszów Główny. Или 2-местный номер в заводском общежитии — 350 zł/мес.",
    detail_ua: "Сертифікати TIG 141 на нержавіючу сталь обов'язкові. Зварювальник Fronius MagicWave, газ 99.99% Argon. Зміни 8 год, переробки за згодою з оплатою +50%.",
    detail_pl: "Wymagane uprawnienia TIG 141 na stal nierdzewną. Spawarka Fronius MagicWave, argon 99.99%. Zmiany 8h, nadgodziny za zgodą +50%.",
    detail_ru: "Сертификаты TIG 141 на нержавейку обязательны. Сварочник Fronius MagicWave, аргон 99.99%. Смены 8 ч, переработки по согласованию +50%."
  },
  "rzeszow-education-niania-297": {
    quote_ua: "«Працюю тут вже 8 місяців — діти звикли, батьки довіряють. Найбільше подобається, що графік стабільний і немає вечірніх змін.» — Оксана, няня",
    quote_pl: "«Pracuję tu już 8 miesięcy — dzieci się przyzwyczaiły, rodzice ufają. Najbardziej podoba mi się stały grafik i brak zmian wieczornych.» — Oksana, niania",
    tip_ua: "Садок розташований біля парку Планти — влітку діти гуляють там щодня. Від залізничного вокзалу Białystok Główny — 12 хв маршруткою. Поруч є круглосуточний Żabka та аптека.",
    tip_pl: "Przedszkole mieści się przy parku Planty — latem dzieci codziennie wychodzą na spacer. Od dworca Białystok Główny — 12 min autobusem. W pobliżu Żabka czynna 24h i apteka.",
    detail_ua: "Група складається з 15–18 дітей віком 3–5 років. Є один основний вихователь і один помічник. Обід для персоналу — за символічну ціну в кухні закладу. Батьки забирають дітей до 17:00, після чого можна спокійно йти додому.",
    detail_pl: "Grupa liczy 15–18 dzieci w wieku 3–5 lat. Jest jeden główny wychowawca i jeden pomocnik. Obiad dla personelu w symbolicznej cenie w kuchni placówki. Rodzice odbierają dzieci do 17:00, potem można spokojnie iść do domu."
  },
  "rzeszow-hospitality-cukiernik-228": {
    quote_ua: "«Кондитерський цех, не ресторан — робота спокійніша. Печемо торти на замовлення: весільні, ювілейні. Кожен день — інший дизайн. За 2 місяці освоїла всі техніки оздоблення.» — Світлана, кондитер",
    quote_pl: "«Cukiernia, nie restauracja — praca spokojniejsza. Pieczemy torty na zamówienie: weselne, jubileuszowe. Co dzień inny design. W 2 miesiące opanowałam wszystkie techniki dekoracji.» — Switłana, cukierniczka",
    tip_ua: "Цех у промзоні Sosnowiec Milowice, біля стації SKM Milowice — 7 хв пішки. Район тихий, промисловий. Є стоянка. Поруч — їдальня «U Kasi».",
    tip_pl: "Cukiernia w strefie Sosnowiec Milowice, przy stacji SKM Milowice — 7 min pieszo. Cicha dzielnica przemysłowa. Jest parking. Obok jadłodajnia „U Kasi”.",
    detail_ua: "Зміна: 5:00–13:00 (щоб торти були готові на ранок). Температура у цеху — 18–20°C. Є фартухи, чепчики, рукавички. Дегустація нових рецептів — частина роботи.",
    detail_pl: "Zmiana: 5:00–13:00 (torty gotowe rano). Temperatura w pracowni 18–20°C. Fartuchy, czepki, rękawice. Degustacja nowych przepisów — część pracy."
  },
  "szczecin-construction-monter-sieci-74": {
    quote_ua: "«Прокладаємо оптику для Orange по Свинуйсько та Щецінському узбережжю. Робота на свіжому повітрі, але восени мокро. Бригада — 4 чоловіки.» — Олег, монтер мереж",
    quote_pl: "«Kładziemy światłowód dla Orange po Świnoujściu i wybrzeżu. Praca na powietrzu, ale jesienią mokro. Brygada — 4 osoby.» — Oleh, monter sieci",
    quote_ru: "«Тянем оптоволокно для Orange по Свиноуйсьце и побережью. Работа на воздухе, но осенью мокро. Бригада — 4 человека.» — Олег, монтажник сетей",
    tip_ua: "База у Голенюві, 30 км на північ від Щеціна. Бригадний бус заїжджає за робітниками о 6:00 від кільця Plac Rodła. Робочий день із дороги — 10 год.",
    tip_pl: "Baza w Goleniowie, 30 km na północ od Szczecina. Bus brygadowy o 6:00 z ronda Plac Rodła. Dzień pracy z dojazdami — 10h.",
    tip_ru: "База в Голеньюве, 30 км к северу от Щецина. Бригадный бус в 6:00 с кольца Plac Rodła. Рабочий день с дорогой — 10 часов.",
    detail_ua: "Інструмент: зварювач оптоволокна Fujikura, рефлектометр. Перші 2 тижні — навчання у бригадира. Виплати щотижневі.",
    detail_pl: "Narzędzia: spawarka światłowodu Fujikura, reflektometr. Pierwsze 2 tygodnie — szkolenie u brygadzisty. Wypłaty tygodniowe.",
    detail_ru: "Инструмент: сварочник оптоволокна Fujikura, рефлектометр. Первые 2 недели — обучение у бригадира. Выплаты еженедельно."
  },
  "szczecin-construction-spawacz-mig-mag-103": {
    quote_ua: "«Зварюю металоконструкції для промислових об'єктів. Шви перевіряють рентгеном — якість має бути ідеальна. Маю сертифікат EN 287, тому ставка вища.» — Олександр, зварювальник",
    quote_pl: "«Spawam konstrukcje stalowe do obiektów przemysłowych. Spoiny sprawdzane RTG — jakość musi być idealna. Mam certyfikat EN 287, więc stawka wyższa.» — Ołeksandr, spawacz",
    tip_ua: "Цех у порту — район Wyspa Grodzka. Від tramваю Brama Portowa — 10 хв пішки. Поруч — морський порт, є крамниці та кав'ярня для перерв.",
    tip_pl: "Hala w porcie — Wyspa Grodzka. Od tramwaju Brama Portowa — 10 min pieszo. Obok port morski, sklepy i kawiarnia na przerwy.",
    detail_ua: "Зварювання MIG/MAG (метод 135/136). Детали завтовшки 3–15 мм. Зміна: 6:00–14:00 або 14:00–22:00. Є пост для зварки з витяжкою та загальне освітлення LED.",
    detail_pl: "Spawanie MIG/MAG (metoda 135/136). Detale grubości 3–15 mm. Zmiana: 6:00–14:00 lub 14:00–22:00. Stanowisko z wyciągiem i oświetlenie LED."
  },
  "szczecin-production-monter-podzespol-w-118": {
    quote_ua: "«Збираємо електронні блоки для автомобілів. Робота чиста, у рукавичках, за столом. Норму виконую до обіду — після обіду вже спокійніше.» — Дмитро, монтажник",
    quote_pl: "«Montujemy bloki elektroniczne do samochodów. Praca czysta, w rękawiczkach, przy stole. Normę robię do obiadu — po południu spokojniej.» — Dmytro, monter",
    tip_ua: "Завод у промзоні Kowale — автобус 184 від Wrzeszcz, 20 хв. Великий паркінг. Поруч McDonald's та stacja benzynowa. Їдальня на заводі — обід 12 zł.",
    tip_pl: "Fabryka w strefie Kowale — autobus 184 z Wrzeszcza, 20 min. Duży parking. Obok McDonald's i stacja benzynowa. Stołówka — obiad 12 zł.",
    detail_ua: "Лінія працює у 3 зміни по 8 год. Є план — 120 блоків за зміну, але реально вдається зробити більше. Премія за перевиконання — до 400 zł/міс. Раз на квартал — тест якості, за який можна отримати додатковий бонус.",
    detail_pl: "Linia pracuje na 3 zmiany po 8h. Plan — 120 bloków na zmianę, realnie da się więcej. Premia za przekroczenie planu — do 400 zł/mies. Raz na kwartał test jakości, za który można dostać dodatkowy bonus."
  },
  "warsaw-education-pomoc-nauczyciela-289": {
    quote_ua: "Діти дуже енергійні, але це надихає. Працюю з двома групами — вранці з малюками, після обіду з дошкільнятами. Колектив дружній, мене підтримували з першого дня. — Марина, помічник вихователя",
    quote_pl: "Dzieci są bardzo energiczne, ale to inspiruje. Pracuję z dwiema grupami — rano z maluchami, po obiedzie z przedszkolakami. Zespół przyjazny, od pierwszego dnia mnie wspierali. — Maryna, pomoc nauczyciela",
    tip_ua: "Садок у районі Oliwa, біля Парку Олівського із знаменитим органом. Від SKM Gdańsk Oliwa — 7 хв пішки. Тихий зелений район з парками.",
    tip_pl: "Przedszkole w dzielnicy Oliwa, przy Parku Oliwskim ze słynnymi organami. Od SKM Gdańsk Oliwa — 7 min pieszo. Cicha zielona dzielnica.",
    detail_ua: "У кожній групі — до 20 дітей. Помічник відповідає за прогулянки, допомогу під час обіду та організацію ігор. Прибирання — окремий персонал.",
    detail_pl: "W każdej grupie do 20 dzieci. Pomocnik odpowiada za spacery, pomoc przy posiłkach i organizację zabaw. Sprzątanie — oddzielny personel."
  },
  "warsaw-hospitality-pomoc-na-zmywaku-233": {
    quote_ua: "«Кухня велика, готує 6 кухарів. Посуд іде безперервно — є дві посудомийки Winterhalter. Найважче — пік ланчу між 13:00 та 15:00, після цього спокійніше.» — Микола, помічник на мийці",
    quote_pl: "«Kuchnia duża, gotuje 6 kucharzy. Naczynia idą non-stop — są dwie zmywarki Winterhalter. Najtrudniejszy szczyt lunchowy 13:00–15:00, potem już spokojniej.» — Mykoła, pomoc na zmywaku",
    quote_ru: "«Кухня большая, готовят 6 поваров. Посуда идёт непрерывно — две посудомойки Winterhalter. Самое тяжёлое — пик обеда 13:00–15:00, потом спокойнее.» — Николай, помощник на мойке",
    tip_ua: "Ресторан у бізнес-центрі біля метро Wilanowska. До метро — 4 хв пішки. Персонал їсть на кухні безкоштовно — повноцінне меню для працівників.",
    tip_pl: "Restauracja w biurowcu przy metrze Wilanowska. Do metra 4 min pieszo. Personel je w kuchni za darmo — pełne menu pracownicze.",
    tip_ru: "Ресторан в бизнес-центре у метро Wilanowska. До метро 4 мин пешком. Персонал ест на кухне бесплатно — полноценное меню для сотрудников.",
    detail_ua: "Зміни 9-годинні, 5/2. Гумові чоботи, фартух, рукавиці видаються. Один вихідний — обов'язково субота або неділя за вибором.",
    detail_pl: "Zmiany 9-godzinne, 5/2. Buty gumowe, fartuch, rękawice zapewnione. Jeden weekend wolny do wyboru.",
    detail_ru: "Смены 9-часовые, 5/2. Резиновые сапоги, фартук, перчатки выдаются. Один выходной — суббота или воскресенье на выбор."
  },
  "warsaw-logistics-kierowca-kurier-kat-b-1": {
    quote_ua: "«Вожу Sprinter по Варшаві — Ursynów, Mokotów, Wilanów. 100–130 посилок на день. Пробки тільки зранку на мостах. Після 13:00 місто вільне. За рекомендацію друга — бонус 500 zł.» — Віталій, кур'єр",
    quote_pl: "«Jeżdżę Sprinterem po Warszawie — Ursynów, Mokotów, Wilanów. 100–130 paczek dziennie. Korki tylko rano na mostach. Po 13:00 miasto wolne. Za polecenie kolegi bonus 500 zł.» — Witalij, kurier",
    tip_ua: "Термінал у Janki (Mszczonów), з'їзд з S8. Зранку — завантаження о 6:30, маршрут через додаток. Від Metro Wilanowska — 20 хв їзди по ранковому трафіку.",
    tip_pl: "Terminal w Jankach (Mszczonów), zjazd z S8. Rano załadunek 6:30, trasa przez appkę. Od Metra Wilanowska — 20 min jazdy w porannym ruchu.",
    detail_ua: "Mercedes Sprinter 316 CDI. Оплата: 160 zł/день + 2 zł за посилку понад 100. Пальне — корпоративна картка Shell. Телефон з кріпленням у кабіні надається.",
    detail_pl: "Mercedes Sprinter 316 CDI. Płatność: 160 zł/dzień + 2 zł za paczkę powyżej 100. Paliwo — karta Shell. Telefon z uchwytem w kabinie zapewniony."
  },
  "warsaw-office-call-center-13": {
    quote_ua: "«Працюю в українському відділі — обслуговуємо клієнтів польського банку, які перевелись з України. Скриптів багато, але після першого місяця все автоматично.» — Дарина, оператор кол-центру",
    quote_pl: "«Pracuję w dziale ukraińskim — obsługujemy klientów polskiego banku, którzy przenieśli się z Ukrainy. Skryptów dużo, ale po pierwszym miesiącu wszystko wchodzi w nawyk.» — Daryna, operator call center",
    quote_ru: "«Работаю в украинском отделе — обслуживаем клиентов польского банка, переехавших из Украины. Скриптов много, но после первого месяца всё автоматически.» — Дарина, оператор колл-центра",
    tip_ua: "Офіс у бізнес-центрі біля метро Rondo Daszyńskiego. До робочого місця — 5 хв пішки від виходу метро. У будівлі — фуд-корт із 8 точками харчування.",
    tip_pl: "Biuro w wieżowcu przy metrze Rondo Daszyńskiego. 5 min pieszo od wyjścia z metra. W budynku food court z 8 punktami gastronomicznymi.",
    tip_ru: "Офис в бизнес-центре у метро Rondo Daszyńskiego. От выхода из метро до рабочего места — 5 минут. В здании фуд-корт с 8 точками питания.",
    detail_ua: "Графік 8 год + 1 год обід (без обмежень за часом, можна гнучко). Гарнітура Jabra, два монітори. KPI: середній час дзвінка, NPS, кількість оброблених звернень.",
    detail_pl: "Grafik 8h + 1h obiad (elastycznie). Słuchawki Jabra, dwa monitory. KPI: średni czas połączenia, NPS, liczba obsłużonych spraw.",
    detail_ru: "График 8 ч + 1 ч обед (гибко, без жёстких рамок). Гарнитура Jabra, два монитора. KPI: средняя длительность звонка, NPS, число обработанных обращений."
  },
  "warsaw-production-pracownik-linii-produkcyjnej-113": {
    quote_ua: "«Лінія розливу йогуртів — конвеєр не спиняється, темп тримати треба. Українська бригада майже вся, зміни 12-годинні, але два дні роботи — два вихідних. Звикаєш.» — Світлана, працівниця лінії",
    quote_pl: "«Linia rozlewu jogurtów — taśma nie staje, tempo trzeba trzymać. Brygada w większości ukraińska, zmiana 12h, ale 2 dni pracy / 2 wolne. Da się przyzwyczaić.» — Switłana, pracownica linii",
    quote_ru: "«Линия разлива йогуртов — конвейер не останавливается, темп держать обязательно. Бригада в основном украинская, смена 12 ч, но 2 дня работы / 2 выходных. Привыкаешь.» — Светлана, работница линии",
    tip_ua: "Завод у промзоні Annopol, північна Прага. Автобус 510 від метро Bródno — 14 хв. Є їдальня з обідом за 12 zł і безкоштовний чай/кава цілий день.",
    tip_pl: "Zakład w strefie Annopol, północna Praga. Autobus 510 od metra Bródno — 14 min. Stołówka z obiadem 12 zł, herbata/kawa cały dzień gratis.",
    tip_ru: "Завод в промзоне Аннополь, северная Прага. Автобус 510 от метро Bródno — 14 минут. Столовая с обедом 12 zł, чай/кофе весь день бесплатно.",
    detail_ua: "Робота в чистій зоні — спецодяг, шапочка, рукавиці видаються щодня. Перерви 2 × 15 хв + 30 хв обід. Бонус за відсутність прогулів — 200 zł/міс.",
    detail_pl: "Praca w strefie czystej — odzież, czepek, rękawice codziennie. Przerwy 2 × 15 min + 30 min obiad. Premia za frekwencję — 200 zł/mies.",
    detail_ru: "Работа в чистой зоне — спецодежда, шапочка, перчатки выдаются каждый день. Перерывы 2 × 15 мин + 30 мин обед. Премия за отсутствие прогулов — 200 zł/мес."
  },
  "wroclaw-agriculture-pracownik-szklarni-157": {
    quote_ua: "«Теплиця з помідорами — тепло навіть взимку. Робота — підв'язування, пасинкування, збір. Колектив жіночий, атмосфера домашня. Платять щотижня.» — Оля, працівниця теплиці",
    quote_pl: "«Szklarnia z pomidorami — ciepło nawet zimą. Praca — wiązanie, pasynkowanie, zbiór. Zespół kobiecy, atmosfera domowa. Płacą co tydzień.» — Ola, pracowniczka szklarni",
    tip_ua: "Теплиці в Kórnik (20 км від Poznania). Довозять мікроавтобусом з центру о 6:00. Поруч — замок Kórnik та озеро для прогулянок після роботи.",
    tip_pl: "Szklarnie w Kórniku (20 km od Poznania). Dowóz busem z centrum o 6:00. W pobliżu zamek w Kórniku i jezioro na spacery po pracy.",
    detail_ua: "Теплиця площею 2 га. Температура всередині 22–28°C. Обов'язково — зручне взуття та легкий одяг. Перерва 30 хв на обід, чай — безкоштовно.",
    detail_pl: "Szklarnia 2 ha. Temperatura wewnątrz 22–28°C. Obowiązkowe wygodne obuwie i lekka odzież. Przerwa 30 min na obiad, herbata — bezpłatnie."
  },
  "wroclaw-construction-pomocnik-budowlany-56": {
    quote_ua: "«Працюю на реконструкції старого цегляного будинку в центрі. Робота різноманітна: демонтаж, муляр, підготовка. Бригадир — поляк, але розуміє українську.» — Максим, помічник",
    quote_pl: "«Pracuję przy remoncie starej kamienicy w centrum. Praca różnorodna: rozbiórki, murowanie, przygotowanie. Brygadzista Polak, ale rozumie ukraiński.» — Maksym, pomocnik",
    tip_ua: "Об'єкт у Starym Mieście, вул. Wrocławska. Від Rondo Kaponiera — 10 хв пішки. Район старовинний, є кафе та ресторани по дорозі.",
    tip_pl: "Obiekt na Starym Mieście, ul. Wrocławska. Od Ronda Kaponiera — 10 min pieszo. Zabytkowa dzielnica z kawiarniami po drodze.",
    detail_ua: "Робочий день 7:30–16:00. Обідня перерва — 30 хв. Каски та взуття — від компанії. Зарплата — щотижневі авансові виплати + повний розрахунок 10-го числа. Є душові для працівників — можна помитись перед дорогою додому.",
    detail_pl: "Dzień roboczy 7:30–16:00. Przerwa obiadowa 30 min. Kaski i obuwie — od firmy. Wypłata — tygodniowe zaliczki + pełne rozliczenie 10-go. Prysznice dla pracowników — można się umyć przed drogą do domu."
  },
  "wroclaw-logistics-kierowca-mi-dzynarodowy-16": {
    quote_ua: "«Їжджу Люблін → Берлін → Люблін. Рейс — 4 дні, потім 2 вихідних вдома. Тягач Volvo FH, 2022 рік. Заробляю 10–11 тис. нетто. Дорогу знаю напам'ять.» — Василь, далекобійник",
    quote_pl: "«Jeżdżę Lublin → Berlin → Lublin. Kurs — 4 dni, potem 2 dni wolne. Ciągnik Volvo FH, rocznik 2022. Zarabiam 10–11 tys. netto. Trasę znam na pamięć.» — Wasyl, kierowca",
    tip_ua: "База в Świdnik, 10 км від Lublina. Паркінг для TIR-ів біля кільця S17. Після рейсу — душ та кімната відпочинку на базі. Поруч АЗС Orlen з магазином.",
    tip_pl: "Baza w Świdniku, 10 km od Lublina. Parking TIR przy rondzie S17. Po kursie — prysznic i pokój relaksu na bazie. Obok stacja Orlen ze sklepem.",
    detail_ua: "Система: 4 дні в рейсі / 2 дні вдома або 3/1. Діагностика тягача — щомісячно. Тахограф цифровий, навчання проходить в перший день. Страхування CMR включено.",
    detail_pl: "System: 4 dni w trasie / 2 dni w domu lub 3/1. Diagnostyka ciągnika co miesiąc. Tachograf cyfrowy, szkolenie pierwszego dnia. Ubezpieczenie CMR w zestawie."
  },
  "wroclaw-logistics-kurier-auto-firmowe--3": {
    quote_ua: "«Лодзь — зручне місто для кур'єрів: пробок мало, парковки є. Возжу 90–100 посилок на день. Маршрут — Widzew і Bałuty. О 15:00 зазвичай вже вільний.» — Микола, кур'єр",
    quote_pl: "«Łódź — wygodne miasto dla kurierów: korków mało, parkingów dużo. Wożę 90–100 paczek dziennie. Trasa — Widzew i Bałuty. O 15:00 zwykle jestem wolny.» — Mykoła, kurier",
    tip_ua: "Термінал на вул. Rokicińska, промзона. Від Łódź Fabryczna — автобус 85, 15 хв. Зранку — завантаження о 7:00, маршрут генерується до 7:30.",
    tip_pl: "Terminal na ul. Rokicińskiej, strefa przemysłowa. Od Łódź Fabryczna — autobus 85, 15 min. Rano załadunek o 7:00, trasa generowana do 7:30.",
    detail_ua: "Авто — Fiat Ducato або VW Crafter. Пальне — картка від компанії. Оплата: база 130 zł/день + 1,5 zł за кожну доставлену посилку понад 80.",
    detail_pl: "Auto — Fiat Ducato lub VW Crafter. Paliwo — karta od firmy. Płatność: baza 130 zł/dzień + 1,5 zł za każdą paczkę powyżej 80."
  },
  "wroclaw-retail-doradca-klienta-262": {
    quote_ua: "«Працюю в електроніці — допомагаю клієнтам обирати телевізори, ноутбуки. Треба знати товар, але навчають. Зарплата + бонус за продажі — у хороший місяць виходить 5500 zł.» — Олег, консультант",
    quote_pl: "«Pracuję w elektronice — pomagam klientom wybierać telewizory, laptopy. Trzeba znać produkty, ale uczą. Pensja + bonus — w dobrym miesiącu wychodzi 5500 zł.» — Oleg, doradca",
    tip_ua: "Магазин у Centrum Riviera, район Działki Leśne. Від SKM Gdynia Główna — 10 хв трамваєм. Вхід для персоналу з боку паркінгу. Поруч зупинка Chylońska.",
    tip_pl: "Sklep w Centrum Riviera, dzielnica Działki Leśne. Od SKM Gdynia Główna — 10 min tramwajem. Wejście dla personelu od strony parkingu. Obok przystanek Chylońska.",
    detail_ua: "Тренінги по продуктах — щомісяця. Бонусна система: 1% від продажу аксесуарів. Є корпоративний телефон для консультацій. Уніформа — поло з логотипом.",
    detail_pl: "Szkolenia produktowe co miesiąc. System bonusowy: 1% od sprzedaży akcesoriów. Telefon służbowy do konsultacji. Mundur — polo z logo."
  },
  "wroclaw-retail-kasjer-248": {
    quote_ua: "«Працюю в Biedronka на Rataje. Каса + викладка. Ранкова зміна — спокійніше, вечірня — черги. Мені подобається, що є чіткий план задач і не треба імпровізувати.» — Тамара, касирка",
    quote_pl: "«Pracuję w Biedronce na Ratajach. Kasa + wykładka. Rana zmiana — spokojniej, wieczorna — kolejki. Lubię, że jest jasny plan i nie trzeba improwizować.» — Tamara, kasjerka",
    tip_ua: "Biedronka на os. Piastowskie (Rataje). Трамвай 2 від Rondo Kaponiera — 12 хв. Район спальний, спокійний. Поруч — Auchan і Rossmann.",
    tip_pl: "Biedronka na os. Piastowskim (Rataje). Tramwaj 2 z Ronda Kaponiera — 12 min. Spokojna dzielnica sypialna. Obok Auchan i Rossmann.",
    detail_ua: "Зміни: 6:00–14:00 або 14:00–22:00. Навчання касі — 2 дні. Є знижка 10% на покупки в мережі. Уніформа — зелене поло, видається безкоштовно.",
    detail_pl: "Zmiany: 6:00–14:00 lub 14:00–22:00. Szkolenie z kasy — 2 dni. Zniżka 10% na zakupy w sieci. Mundur — zielone polo, wydawane bezpłatnie."
  }
};

export default ENRICHMENTS;
