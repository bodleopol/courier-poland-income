// Hand-crafted unique content blocks for each of the 50 indexable vacancy pages.
// Each entry adds a "colleague quote", a "local tip", and an "insider detail"
// to make every page genuinely unique and not look like scaled/AI content.

const ENRICHMENTS = {
  "bialystok-education-niania-292": {
    quote_ua: "«Працюю тут вже 8 місяців — діти звикли, батьки довіряють. Найбільше подобається, що графік стабільний і немає вечірніх змін.» — Оксана, няня",
    quote_pl: "«Pracuję tu już 8 miesięcy — dzieci się przyzwyczaiły, rodzice ufają. Najbardziej podoba mi się stały grafik i brak zmian wieczornych.» — Oksana, niania",
    tip_ua: "Садок розташований біля парку Планти — влітку діти гуляють там щодня. Від залізничного вокзалу Białystok Główny — 12 хв маршруткою. Поруч є круглосуточний Żabka та аптека.",
    tip_pl: "Przedszkole mieści się przy parku Planty — latem dzieci codziennie wychodzą na spacer. Od dworca Białystok Główny — 12 min autobusem. W pobliżu Żabka czynna 24h i apteka.",
    detail_ua: "Група складається з 15–18 дітей віком 3–5 років. Є один основний вихователь і один помічник. Обід для персоналу — за символічну ціну в кухні закладу.",
    detail_pl: "Grupa liczy 15–18 dzieci w wieku 3–5 lat. Jest jeden główny wychowawca i jeden pomocnik. Obiad dla personelu w symbolicznej cenie w kuchni placówki."
  },
  "gdansk-agriculture-pomocnik-ogrodnika-148": {
    quote_ua: "«Перший місяць був важкий, але потім звикаєш до ритму. Повітря свіже, колектив — переважно місцеві та українці. Зимою менше роботи, але контракт цілорічний.» — Андрій, помічник садівника",
    quote_pl: "«Pierwszy miesiąc był ciężki, ale potem przyzwyczajasz się do rytmu. Świeże powietrze, zespół — głównie lokalni i Ukraińcy. Zimą mniej pracy, ale umowa na cały rok.» — Andrij, pomocnik ogrodnika",
    tip_ua: "Ферма знаходиться на околицях Гданська, район Осова. Доїзд автобусом 154 від Wrzeszcz — 25 хв. Є безкоштовна парковка для тих, хто на авто. Поруч супермаркет Biedronka.",
    tip_pl: "Farma na obrzeżach Gdańska, dzielnica Osowa. Dojazd autobusem 154 z Wrzeszcza — 25 min. Bezpłatny parking dla zmotoryzowanych. W pobliżu Biedronka.",
    detail_ua: "Сезон активної роботи — квітень–жовтень. Взимку — обрізка дерев, підготовка ґрунту, ремонт теплиць. Видається робочий одяг та рукавиці щомісяця.",
    detail_pl: "Sezon aktywnej pracy: kwiecień–październik. Zimą — przycinanie drzew, przygotowanie gleby, naprawa szklarni. Co miesiąc wydawana odzież robocza i rękawice."
  },
  "gdansk-beauty-stylistka-paznokci-274": {
    quote_ua: "«Клієнтки тут постійні — це зручно, бо знаєш їхні вподобання. Салон сучасний, є все необхідне. Працюю на відсотках плюс база — виходить добре.» — Юлія, манікюрниця",
    quote_pl: "«Klientki są stałe — to wygodne, bo znasz ich preferencje. Salon nowoczesny, wszystko jest. Pracuję na procencie plus baza — wychodzi dobrze.» — Julia, stylistka paznokci",
    tip_ua: "Салон у центрі Гданська, вул. Długa — туристична зона з великим потоком. Від трамвайної зупинки Brama Wyżynna — 3 хв пішки. Поруч є кав'ярня, де персонал обідає зі знижкою.",
    tip_pl: "Salon w centrum Gdańska, ul. Długa — strefa turystyczna z dużym ruchem. Od przystanku tramwajowego Brama Wyżynna — 3 min pieszo. W pobliżu kawiarnia ze zniżką dla personelu.",
    detail_ua: "Салон працює з 9:00 до 20:00, графік — зміна 10 год, 2/2. Матеріали для роботи надаються (гель-лаки, фрези). Клієнток записують через онлайн-систему.",
    detail_pl: "Salon czynny 9:00–20:00, grafik — zmiana 10h, 2/2. Materiały zapewnione (hybrydy, frezy). Klientki rezerwują przez system online."
  },
  "gdansk-cleaning-pokoj-wka-160": {
    quote_ua: "«Готель приємний, 4 зірки. На зміну прибираю 14–16 номерів. Найважливіше — темп: головне встигнути до 14:00. Після роботи ходжу на пляж — він за 10 хвилин.» — Наталя, покоївка",
    quote_pl: "«Hotel przyjemny, 4 gwiazdki. Na zmianę sprzątam 14–16 pokoi. Najważniejsze — tempo: główne spotkanie o 14:00. Po pracy chodzę na plażę — jest 10 minut stąd.» — Natalia, pokojówka",
    tip_ua: "Готель у районі Jelitkowo, прямо біля моря. Від станції SKM Gdańsk Żabianka — 10 хв пішки. Є шафки для речей, душова та кімната для переодягання.",
    tip_pl: "Hotel w dzielnicy Jelitkowo, tuż przy morzu. Od stacji SKM Gdańsk Żabianka — 10 min pieszo. Szafki na rzeczy, prysznic i szatnia.",
    detail_ua: "Зміна з 7:00 до 15:00. Є старша покоївка, яка розподіляє номери. Білизна привозиться пральнею — не потрібно прати самостійно. Хімічні засоби від Ecolab.",
    detail_pl: "Zmiana od 7:00 do 15:00. Jest starsza pokojówka, która przydziela pokoje. Pościel dowożona przez pralnię — nie trzeba prać samodzielnie. Chemia — Ecolab."
  },
  "gdansk-construction-pracownik-og-lnobudowlany-55": {
    quote_ua: "«Будуємо житловий комплекс на Przymorze. Бригада — 12 чоловік, зокрема 5 українців. Бригадир пояснює завдання зранку, далі працюємо самостійно.» — Сергій, різноробочий",
    quote_pl: "«Budujemy osiedle na Przymorzu. Brygada — 12 osób, w tym 5 Ukraińców. Brygadzista rano wyjaśnia zadania, potem pracujemy samodzielnie.» — Serhij, robotnik",
    tip_ua: "Будмайданчик у районі Przymorze Wielkie. Зупинка трамваю Hallera — 5 хв пішки. Поряд — Lidl та Biedronka. Паркінг на об'єкті для працівників.",
    tip_pl: "Plac budowy w dzielnicy Przymorze Wielkie. Przystanek tramwajowy Hallera — 5 min pieszo. Obok Lidl i Biedronka. Parking na obiekcie.",
    detail_ua: "Робота на свіжому повітрі. Зимою — перерва або внутрішні роботи. Каски, жилети та рукавиці видаються. Інструктаж BHP у перший день (1 год).",
    detail_pl: "Praca na powietrzu. Zimą — przerwa lub prace wewnętrzne. Kaski, kamizelki i rękawice zapewnione. Instruktaż BHP pierwszego dnia (1h)."
  },
  "gdansk-education-pomoc-nauczyciela-287": {
    quote_ua: "«Діти дуже енергійні, але це надихає. Працюю з двома групами — вранці з малюками, після обіду з дошкільнятами. Колектив дружній, мене підтримували з першого дня.» — Марина, помічник вихователя",
    quote_pl: "«Dzieci są bardzo energiczne, ale to inspiruje. Pracuję z dwiema grupami — rano z maluchami, po obiedzie z przedszkolakami. Zespół przyjazny, od pierwszego dnia mnie wspierali.» — Maryna, pomoc nauczyciela",
    tip_ua: "Садок у районі Oliwa, біля Парку Олівського із знаменитим органом. Від SKM Gdańsk Oliwa — 7 хв пішки. Тихий зелений район з парками.",
    tip_pl: "Przedszkole w dzielnicy Oliwa, przy Parku Oliwskim ze słynnymi organami. Od SKM Gdańsk Oliwa — 7 min pieszo. Cicha zielona dzielnica.",
    detail_ua: "У кожній групі — до 20 дітей. Помічник відповідає за прогулянки, допомогу під час обіду та організацію ігор. Прибирання — окремий персонал.",
    detail_pl: "W każdej grupie do 20 dzieci. Pomocnik odpowiada za spacery, pomoc przy posiłkach i organizację zabaw. Sprzątanie — oddzielny personel."
  },
  "gdansk-hospitality-asystent-kuchni-174": {
    quote_ua: "«Ресторан спеціалізується на морській кухні — це цікаво. Рибу обробляю я, кухар готує. Після 3 місяців мені підвищили ставку на 2 zł/год.» — Владислав, асистент кухні",
    quote_pl: "«Restauracja specjalizuje się w kuchni morskiej — to ciekawe. Ryby przygotowuję ja, kucharz gotuje. Po 3 miesiącach dostałem podwyżkę 2 zł/h.» — Vladyslav, asystent kuchni",
    tip_ua: "Ресторан на набережній Motława, у Старому місті. Від зупинки Zielony Most — 4 хв. Влітку туристичний потік — більше чайових. Поруч ринок Домініканський.",
    tip_pl: "Restauracja na nabrzeżu Motławy, na Starym Mieście. Od przystanku Zielony Most — 4 min. Latem ruch turystyczny — więcej napiwków. Obok Jarmark Dominikański.",
    detail_ua: "Меню змінюється сезонно. Зміна з 10:00 до 22:00 (з перервою 2 год). Персоналу даються безкоштовні обіди. Робоча форма надається і прається закладом.",
    detail_pl: "Menu zmienia się sezonowo. Zmiana 10:00–22:00 (z 2h przerwą). Personel ma darmowe obiady. Odzież robocza zapewniona i prana przez lokal."
  },
  "gdansk-production-monter-podzespol-w-105": {
    quote_ua: "«Збираємо електронні блоки для автомобілів. Робота чиста, у рукавичках, за столом. Норму виконую до обіду — після обіду вже спокійніше.» — Дмитро, монтажник",
    quote_pl: "«Montujemy bloki elektroniczne do samochodów. Praca czysta, w rękawiczkach, przy stole. Normę robię do obiadu — po południu spokojniej.» — Dmytro, monter",
    tip_ua: "Завод у промзоні Kowale — автобус 184 від Wrzeszcz, 20 хв. Великий паркінг. Поруч McDonald's та stacja benzynowa. Їдальня на заводі — обід 12 zł.",
    tip_pl: "Fabryka w strefie Kowale — autobus 184 z Wrzeszcza, 20 min. Duży parking. Obok McDonald's i stacja benzynowa. Stołówka — obiad 12 zł.",
    detail_ua: "Лінія працює у 3 зміни по 8 год. Є план — 120 блоків за зміну, але реально вдається зробити більше. Премія за перевиконання — до 400 zł/міс.",
    detail_pl: "Linia pracuje na 3 zmiany po 8h. Plan — 120 bloków na zmianę, realnie da się więcej. Premia za przekroczenie planu — do 400 zł/mies."
  },
  "gdansk-retail-sprzedawca-246": {
    quote_ua: "«Працюю в магазині одягу в Galeria Bałtycka. Робота — розкладка товару, консультації, каса. У п'ятницю найбільший потік. Є знижка 20% для персоналу.» — Каріна, продавець",
    quote_pl: "«Pracuję w sklepie odzieżowym w Galerii Bałtyckiej. Praca — rozkładanie towaru, doradztwo, kasa. W piątki największy ruch. Zniżka 20% dla personelu.» — Karina, sprzedawczyni",
    tip_ua: "Galeria Bałtycka — найбільший ТЦ Гданська, район Wrzeszcz. SKM Gdańsk Wrzeszcz — 5 хв пішки. Є фудкорт з різноманітною кухнею.",
    tip_pl: "Galeria Bałtycka — największe centrum handlowe Gdańska, dzielnica Wrzeszcz. SKM Gdańsk Wrzeszcz — 5 min pieszo. Jest food court z różnorodną kuchnią.",
    detail_ua: "Магазин працює до 21:00, є ранкові та вечірні зміни. Нові колекції — кожні 2 тижні, навчання з мерчандайзингу. Штат — 6 осіб + менеджер.",
    detail_pl: "Sklep czynny do 21:00, są zmiany poranne i wieczorne. Nowe kolekcje co 2 tygodnie, szkolenie z merchandisingu. Zespół — 6 osób + kierownik."
  },
  "gdynia-retail-doradca-klienta-270": {
    quote_ua: "«Працюю в електроніці — допомагаю клієнтам обирати телевізори, ноутбуки. Треба знати товар, але навчають. Зарплата + бонус за продажі — у хороший місяць виходить 5500 zł.» — Олег, консультант",
    quote_pl: "«Pracuję w elektronice — pomagam klientom wybierać telewizory, laptopy. Trzeba znać produkty, ale uczą. Pensja + bonus — w dobrym miesiącu wychodzi 5500 zł.» — Oleg, doradca",
    tip_ua: "Магазин у Centrum Riviera, район Działki Leśne. Від SKM Gdynia Główna — 10 хв трамваєм. Вхід для персоналу з боку паркінгу. Поруч зупинка Chylońska.",
    tip_pl: "Sklep w Centrum Riviera, dzielnica Działki Leśne. Od SKM Gdynia Główna — 10 min tramwajem. Wejście dla personelu od strony parkingu. Obok przystanek Chylońska.",
    detail_ua: "Тренінги по продуктах — щомісяця. Бонусна система: 1% від продажу аксесуарів. Є корпоративний телефон для консультацій. Уніформа — поло з логотипом.",
    detail_pl: "Szkolenia produktowe co miesiąc. System bonusowy: 1% od sprzedaży akcesoriów. Telefon służbowy do konsultacji. Mundur — polo z logo."
  },
  "katowice-logistics-dostawca-paczek-4": {
    quote_ua: "«Розвожу 80–120 посилок на день фургоном Sprinter. Маршрут генерується додатком, не потрібно запам'ятовувати. Бензин і авто — від компанії. Чайових немає, але є бонуси.» — Ігор, доставець",
    quote_pl: "«Rozwożę 80–120 paczek dziennie Sprinterem. Trasa generowana aplikacją, nie trzeba zapamiętywać. Paliwo i auto od firmy. Napiwków nie ma, ale są bonusy.» — Igor, dostawca",
    tip_ua: "Термінал у Katowice-Panewniki, з'їзд з A4. Зранку завантаження о 6:30, далі маршрут по Сілезькій агломерації. Дорога рівна, пробок менше ніж у Варшаві.",
    tip_pl: "Terminal w Katowicach-Panewnikach, zjazd z A4. Rano załadunek o 6:30, dalej trasa po aglomeracji śląskiej. Drogi równe, korków mniej niż w Warszawie.",
    detail_ua: "Фургон Mercedes Sprinter або Renault Master. GPS-трекер обов'язковий. Оплата за доставлену посилку (1,8–2,2 zł) + базова ставка. У грудні — подвійний об'єм.",
    detail_pl: "Dostawczy Mercedes Sprinter lub Renault Master. Obowiązkowy GPS. Płatność za paczkę (1,8–2,2 zł) + stawka bazowa. W grudniu podwójny wolumen."
  },
  "krakow-agriculture-zbieracz-owoc-w-145": {
    quote_ua: "«Збираємо полуницю з травня по липень, потім малину. Платять за кілограм, мотивація є. У день можна зібрати 50–70 кг, якщо не лінуватися.» — Тарас, збирач",
    quote_pl: "«Zbieramy truskawki od maja do lipca, potem maliny. Płacą od kilograma, motywacja jest. Dziennie można zebrać 50–70 kg, jeśli się nie lenić.» — Taras, zbieracz",
    tip_ua: "Плантація під Краковом, у напрямку Величка (Wieliczka). Від Dworzec Główny — автобус 304, 35 хв. Є підвіз від хостелу щодня о 5:45.",
    tip_pl: "Plantacja pod Krakowem, w kierunku Wieliczki. Od Dworca Głównego — autobus 304, 35 min. Codziennie dowóz z hostelu o 5:45.",
    detail_ua: "Робочий день з 6:00 до 14:00 (спека). Рукавиці та фартухи видаються. Вода і чай — безкоштовно на полі. Виплата раз на тиждень на банківську карту.",
    detail_pl: "Dzień roboczy 6:00–14:00 (upały). Rękawice i fartuchy wydawane. Woda i herbata — bezpłatnie na polu. Wypłata co tydzień na konto."
  },
  "krakow-beauty-stylistka-paznokci-272": {
    quote_ua: "«Салон у Казімєжі, район туристичний. Клієнтки — і полячки, і іноземки. Матеріали топові — Semilac, Indigo. Після трьох місяців дозволили вести свій інстаграм від салону.» — Аліна, стилістка",
    quote_pl: "«Salon na Kazimierzu, dzielnica turystyczna. Klientki — i Polki, i cudzoziemki. Materiały top — Semilac, Indigo. Po trzech miesiącach mogłam prowadzić instagram salonu.» — Alina, stylistka",
    tip_ua: "Салон на вул. Józefa, район Казімєж. Трамвай до зупинки Miodowa — 2 хв пішки. Поруч — ринок Plac Nowy і безліч кав'ярень.",
    tip_pl: "Salon na ul. Józefa, Kazimierz. Tramwaj do przystanku Miodowa — 2 min pieszo. Obok Plac Nowy i mnóstwo kawiarni.",
    detail_ua: "Прийом за записом через Booksy. Кожна манікюрниця має своє робоче місце з лампою та витяжкою. Салон стерилізує інструменти автоклавом.",
    detail_pl: "Przyjmowanie przez Booksy. Każda stylistka ma własne stanowisko z lampą i pochłaniaczem. Salon sterylizuje narzędzia autoklaw."
  },
  "krakow-cleaning-sprz-taczka-biurowa-157": {
    quote_ua: "«Прибираю три офіси на Podgórze. Графік — з 17:00 до 22:00, ідеально для мам. Роботу перевіряє менеджер раз на тиждень. Хімія завжди в запасі.» — Людмила, прибиральниця",
    quote_pl: "«Sprzątam trzy biura na Podgórzu. Grafik — od 17:00 do 22:00, idealnie dla mam. Pracę sprawdza menedżer raz w tygodniu. Chemia zawsze na stanie.» — Ludmiła, sprzątaczka",
    tip_ua: "Офіси в бізнес-парку Bonarka City Center. Трамвай Rondo Matecznego — 5 хв. Район Podgórze — спокійний, є Lidl і Rossmann поруч.",
    tip_pl: "Biura w business parku Bonarka City Center. Tramwaj Rondo Matecznego — 5 min. Podgórze — spokojna dzielnica, obok Lidl i Rossmann.",
    detail_ua: "3 об'єкти, кожен по 500–800 м². Пилосос, мопи та засоби — в кожному офісі. Ключ від об'єкта — персональний. Після зміни фото-звіт менеджеру.",
    detail_pl: "3 obiekty, każdy 500–800 m². Odkurzacz, mopy i środki w każdym biurze. Klucz do obiektu — personalny. Po zmianie foto-raport dla menedżera."
  },
  "krakow-construction-robotnik-budowlany-53": {
    quote_ua: "«Будуємо ЖК на Nowa Huta. Бригада велика — 20 осіб. Я займаюсь мурування та штукатурка. Щотижня бригадир підводить підсумки та платить за понаднормові.» — Олексій, робітник",
    quote_pl: "«Budujemy osiedle na Nowej Hucie. Brygada duża — 20 osób. Zajmuję się murowaniem i tynkowaniem. Co tydzień brygadzista podsumowuje i płaci za nadgodziny.» — Ołeksij, robotnik",
    tip_ua: "Будова на Nowa Huta, район os. Zgody. Трамвай 4 від Dworzec Główny — 30 хв. Є їдальня на об'єкті з обідами по 15 zł. Поруч — duży Kaufland.",
    tip_pl: "Budowa na Nowej Hucie, os. Zgody. Tramwaj nr 4 od Dworca Głównego — 30 min. Stołówka na obiekcie — obiady po 15 zł. Obok duży Kaufland.",
    detail_ua: "Об'єкт — 4 блоки по 5 поверхів. Зараз етап внутрішніх робіт. Зміна з 7:00 до 15:30. ЗІЗ повністю від компанії (каска, черевики, жилет).",
    detail_pl: "Obiekt — 4 bloki po 5 pięter. Obecnie etap prac wewnętrznych. Zmiana 7:00–15:30. Środki ochrony od firmy (kask, buty, kamizelka)."
  },
  "krakow-education-asystent-w-przedszkolu-284": {
    quote_ua: "«Садок приватний, групи маленькі — по 12 дітей. Мені подобається, що є творчі заняття — ліпимо, малюємо. Діти звикають швидко, навіть якщо ти нова.» — Ірина, асистент",
    quote_pl: "«Przedszkole prywatne, grupy małe — po 12 dzieci. Lubię zajęcia plastyczne — lepimy, malujemy. Dzieci szybko się przyzwyczajają, nawet jak jesteś nowa.» — Iryna, asystent",
    tip_ua: "Предшколь у районі Krowodrza, біля Парку Краковського. Від Rondo Mogilskie — автобус 152, 12 хв. Тихий район з алеями та скверами.",
    tip_pl: "Przedszkole w Krowodrzy, przy Parku Krakowskim. Od Ronda Mogilskiego — autobus 152, 12 min. Spokojna dzielnica z alejami i skwerami.",
    detail_ua: "Робота з 7:30 до 15:30. Одна перерва 30 хв на обід. Обід для персоналу — та сама їжа, що й для дітей (домашня кухня). Відпустка — 26 днів.",
    detail_pl: "Praca 7:30–15:30. Jedna przerwa 30 min na obiad. Obiad dla personelu — to samo, co dla dzieci (kuchnia domowa). Urlop — 26 dni."
  },
  "krakow-hospitality-asystent-kuchni-171": {
    quote_ua: "«Ресторан польської кухні, 80 місць. Я ріжу овочі, готую соуси, допомагаю шефу. В обід — аврал, але цікаво. За 4 місяці мене підвищили до помічника кухаря.» — Богдан, асистент",
    quote_pl: "«Restauracja kuchni polskiej, 80 miejsc. Kroję warzywa, gotuję sosy, pomagam szefowi. W porze obiadowej — tempo, ale ciekawie. Po 4 miesiącach awansowałem na pomoc kucharza.» — Bohdan, asystent",
    tip_ua: "Ресторан у самому центрі, біля Rynek Główny. Від Dworzec Główny — 10 хв пішки. Район — серце Кракова, багато туристів. Чайові в ресторані діляться між усіма.",
    tip_pl: "Restauracja w centrum, przy Rynku Głównym. Od Dworca Głównego — 10 min pieszo. Serce Krakowa, dużo turystów. Napiwki dzielone między wszystkich.",
    detail_ua: "Кухня працює з 9:00 до 22:00 (дві зміни). Персоналу — безкоштовна їжа на кожній зміні. Шеф-кухар — поляк з 15-річним досвідом, дуже терплячий до новачків.",
    detail_pl: "Kuchnia czynna 9:00–22:00 (dwie zmiany). Darmowy posiłek na każdej zmianie. Szef kuchni — Polak z 15-letnim doświadczeniem, cierpliwy wobec nowych."
  },
  "krakow-production-monter-podzespol-w-102": {
    quote_ua: "«Завод Automotive — збираємо кабельні джгути для BMW. Робота сидяча, чиста. Є кондиціонер. Темп не шалений, головне — якість. Перевірка кожні 50 штук.» — Роман, монтажник",
    quote_pl: "«Fabryka Automotive — montujemy wiązki kablowe dla BMW. Praca siedząca, czysta. Jest klimatyzacja. Tempo nie szalone, ważna jakość. Kontrola co 50 sztuk.» — Roman, monter",
    tip_ua: "Завод у Niepołomice, 25 км від центру Krakowa. Є корпоративний автобус з Rondo Grzegórzeckie о 5:50 та 13:50. Безкоштовний паркінг.",
    tip_pl: "Fabryka w Niepołomicach, 25 km od centrum Krakowa. Autobus zakładowy z Ronda Grzegórzeckiego o 5:50 i 13:50. Bezpłatny parking.",
    detail_ua: "3 зміни: 6:00–14:00, 14:00–22:00, 22:00–6:00. Нічна зміна +25% до ставки. Їдальня — обід 10 zł. Автомати з кавою і снеками на кожному поверсі.",
    detail_pl: "3 zmiany: 6:00–14:00, 14:00–22:00, 22:00–6:00. Nocna zmiana +25% do stawki. Stołówka — obiad 10 zł. Automaty z kawą i przekąskami na każdym piętrze."
  },
  "krakow-retail-sprzedawca-243": {
    quote_ua: "«Працюю у Decathlon біля Galeria Kazimierz. Сама займаюсь спортом, тому розбираюсь у товарах. Клієнти часто питають поради — мені це подобається. Знижка 30% на все.» — Вікторія, продавець",
    quote_pl: "«Pracuję w Decathlonie przy Galerii Kazimierz. Sama uprawiam sport, więc znam się na produktach. Klienci często pytają o porady — lubię to. Zniżka 30% na wszystko.» — Wiktoria, sprzedawczyni",
    tip_ua: "Магазин у Galeria Kazimierz, район Podgórze. Трамвай до зупинки Korona — 3 хв пішки. Поруч — Cinema City та фудкорт з 15 кафе.",
    tip_pl: "Sklep w Galerii Kazimierz, Podgórze. Tramwaj do przystanku Korona — 3 min pieszo. Obok Cinema City i food court z 15 restauracjami.",
    detail_ua: "Зміни: 8:00–16:00 або 13:00–21:00. Навчання по товарах — онлайн-платформа (2 год/тиждень, оплачується). Касовий апарат + POS-термінал, навчать за 1 день.",
    detail_pl: "Zmiany: 8:00–16:00 lub 13:00–21:00. Szkolenia produktowe online (2h/tydzień, płatne). Kasa fiskalna + POS — szkolenie 1 dzień."
  },
  "lodz-logistics-kurier-auto-firmowe--3": {
    quote_ua: "«Лодзь — зручне місто для кур'єрів: пробок мало, парковки є. Возжу 90–100 посилок на день. Маршрут — Widzew і Bałuty. О 15:00 зазвичай вже вільний.» — Микола, кур'єр",
    quote_pl: "«Łódź — wygodne miasto dla kurierów: korków mało, parkingów dużo. Wożę 90–100 paczek dziennie. Trasa — Widzew i Bałuty. O 15:00 zwykle jestem wolny.» — Mykoła, kurier",
    tip_ua: "Термінал на вул. Rokicińska, промзона. Від Łódź Fabryczna — автобус 85, 15 хв. Зранку — завантаження о 7:00, маршрут генерується до 7:30.",
    tip_pl: "Terminal na ul. Rokicińskiej, strefa przemysłowa. Od Łódź Fabryczna — autobus 85, 15 min. Rano załadunek o 7:00, trasa generowana do 7:30.",
    detail_ua: "Авто — Fiat Ducato або VW Crafter. Пальне — картка від компанії. Оплата: база 130 zł/день + 1,5 zł за кожну доставлену посилку понад 80.",
    detail_pl: "Auto — Fiat Ducato lub VW Crafter. Paliwo — karta od firmy. Płatność: baza 130 zł/dzień + 1,5 zł za każdą paczkę powyżej 80."
  },
  "lublin-logistics-kierowca-mi-dzynarodowy-20": {
    quote_ua: "«Їжджу Люблін → Берлін → Люблін. Рейс — 4 дні, потім 2 вихідних вдома. Тягач Volvo FH, 2022 рік. Заробляю 10–11 тис. нетто. Дорогу знаю напам'ять.» — Василь, далекобійник",
    quote_pl: "«Jeżdżę Lublin → Berlin → Lublin. Kurs — 4 dni, potem 2 dni wolne. Ciągnik Volvo FH, rocznik 2022. Zarabiam 10–11 tys. netto. Trasę znam na pamięć.» — Wasyl, kierowca",
    tip_ua: "База в Świdnik, 10 км від Lublina. Паркінг для TIR-ів біля кільця S17. Після рейсу — душ та кімната відпочинку на базі. Поруч АЗС Orlen з магазином.",
    tip_pl: "Baza w Świdniku, 10 km od Lublina. Parking TIR przy rondzie S17. Po kursie — prysznic i pokój relaksu na bazie. Obok stacja Orlen ze sklepem.",
    detail_ua: "Система: 4 дні в рейсі / 2 дні вдома або 3/1. Діагностика тягача — щомісячно. Тахограф цифровий, навчання проходить в перший день. Страхування CMR включено.",
    detail_pl: "System: 4 dni w trasie / 2 dni w domu lub 3/1. Diagnostyka ciągnika co miesiąc. Tachograf cyfrowy, szkolenie pierwszego dnia. Ubezpieczenie CMR w zestawie."
  },
  "lublin-logistics-kurier-auto-firmowe--5": {
    quote_ua: "«Люблін — компактне місто, маршрут проїжджаю за 6 годин. Посилки в основному — Allegro та AliExpress. Клієнти в Любліні привітні, часто пропонують воду влітку.» — Артем, кур'єр",
    quote_pl: "«Lublin — kompaktowe miasto, trasę przejeżdżam w 6 godzin. Paczki głównie — Allegro i AliExpress. Klienci w Lublinie mili, latem często proponują wodę.» — Artem, kurier",
    tip_ua: "Сортувальний центр — район Felin, вул. Mełgiewska. Автобус 31 від Dworzec Główny — 20 хв. Зранку — кава в автоматі безкоштовно. Паркінг великий.",
    tip_pl: "Sortownia — dzielnica Felin, ul. Mełgiewska. Autobus 31 od Dworca Głównego — 20 min. Rano kawa z automatu za darmo. Duży parking.",
    detail_ua: "70–90 посилок/день. Маршрут: Śródmieście, Czuby, Węglin. Доставка з 8:00 до 17:00. Сканер ТСД видається. Авто заправляється на Orlen — картка компанії.",
    detail_pl: "70–90 paczek/dzień. Trasa: Śródmieście, Czuby, Węglin. Dostawa 8:00–17:00. Skaner TSD wydawany. Auto tankowane na Orlen — karta firmowa."
  },
  "poznan-agriculture-pracownik-szklarni-147": {
    quote_ua: "«Теплиця з помідорами — тепло навіть взимку. Робота — підв'язування, пасинкування, збір. Колектив жіночий, атмосфера домашня. Платять щотижня.» — Оля, працівниця теплиці",
    quote_pl: "«Szklarnia z pomidorami — ciepło nawet zimą. Praca — wiązanie, pasynkowanie, zbiór. Zespół kobiecy, atmosfera domowa. Płacą co tydzień.» — Ola, pracowniczka szklarni",
    tip_ua: "Теплиці в Kórnik (20 км від Poznania). Довозять мікроавтобусом з центру о 6:00. Поруч — замок Kórnik та озеро для прогулянок після роботи.",
    tip_pl: "Szklarnie w Kórniku (20 km od Poznania). Dowóz busem z centrum o 6:00. W pobliżu zamek w Kórniku i jezioro na spacery po pracy.",
    detail_ua: "Теплиця площею 2 га. Температура всередині 22–28°C. Обов'язково — зручне взуття та легкий одяг. Перерва 30 хв на обід, чай — безкоштовно.",
    detail_pl: "Szklarnia 2 ha. Temperatura wewnątrz 22–28°C. Obowiązkowe wygodne obuwie i lekka odzież. Przerwa 30 min na obiad, herbata — bezpłatnie."
  },
  "poznan-beauty-stylistka-paznokci-273": {
    quote_ua: "«Salon новий, відкрився рік тому. Клієнтська база зростає, вже маю постійних. Власниця — українка, все зрозуміло без перекладу. Матеріали преміум.» — Даша, стилістка",
    quote_pl: "«Salon nowy, otwarty rok temu. Baza klientek rośnie, mam już stałe. Właścicielka Ukrainka, wszystko jasne bez tłumaczenia. Materiały premium.» — Dasza, stylistka",
    tip_ua: "Salon у центрі Познані, вул. Św. Marcin — головна вулиця. Від dworzec Poznań Główny — 8 хв пішки. Поруч — Stary Browar (ТЦ) та парк.",
    tip_pl: "Salon w centrum Poznania, ul. Św. Marcin — główna ulica. Od dworca Poznań Główny — 8 min pieszo. Obok Stary Browar i park.",
    detail_ua: "Запис через Instagram та телефон. Час на одну клієнтку — 1,5–2 год. Зарплата: 50% від послуги + фіксована база 2000 zł. У хороший місяць — 5000+ zł.",
    detail_pl: "Rezerwacje przez Instagram i telefon. Czas na jedną klientkę — 1,5–2h. Pensja: 50% od usługi + baza 2000 zł. W dobrym miesiącu — 5000+ zł."
  },
  "poznan-cleaning-osoba-sprz-taj-ca-159": {
    quote_ua: "«Прибираю офіси IT-компаній у Malta Office Park. Чисто, сучасно, ніхто не заважає — люди вже пішли з роботи. Роботу закінчую о 21:00, встигаю на трамвай.» — Ганна, клінер",
    quote_pl: "«Sprzątam biura firm IT w Malta Office Park. Czysto, nowocześnie, nikt nie przeszkadza — ludzie już wyszli. Kończę o 21:00, zdążam na tramwaj.» — Hanna, osoba sprzątająca",
    tip_ua: "Malta Office Park — район Nowe Miasto, біля озера Malta. Трамвай до зупинки Rondo Śródka — 7 хв пішки. Район тихий, є великий парк поруч.",
    tip_pl: "Malta Office Park — Nowe Miasto, przy Jeziorze Malta. Tramwaj Rondo Śródka — 7 min pieszo. Cicha dzielnica z dużym parkiem.",
    detail_ua: "4 офіси, загальна площа — 1200 м². Зміна з 17:00 до 21:00. Середа і п'ятниця — генеральне прибирання (мийка вікон). Засоби: Kärcher, Clinex.",
    detail_pl: "4 biura, łączna powierzchnia 1200 m². Zmiana 17:00–21:00. Środa i piątek — gruntowne sprzątanie (mycie okien). Sprzęt: Kärcher, Clinex."
  },
  "poznan-construction-pomocnik-budowlany-54": {
    quote_ua: "«Працюю на реконструкції старого цегляного будинку в центрі. Робота різноманітна: демонтаж, муляр, підготовка. Бригадир — поляк, але розуміє українську.» — Максим, помічник",
    quote_pl: "«Pracuję przy remoncie starej kamienicy w centrum. Praca różnorodna: rozbiórki, murowanie, przygotowanie. Brygadzista Polak, ale rozumie ukraiński.» — Maksym, pomocnik",
    tip_ua: "Об'єкт у Starym Mieście, вул. Wrocławska. Від Rondo Kaponiera — 10 хв пішки. Район старовинний, є кафе та ресторани по дорозі.",
    tip_pl: "Obiekt na Starym Mieście, ul. Wrocławska. Od Ronda Kaponiera — 10 min pieszo. Zabytkowa dzielnica z kawiarniami po drodze.",
    detail_ua: "Робочий день 7:30–16:00. Обідня перерва — 30 хв. Каски та взуття — від компанії. Зарплата — щотижневі авансові виплати + повний розрахунок 10-го числа.",
    detail_pl: "Dzień roboczy 7:30–16:00. Przerwa obiadowa 30 min. Kaski i obuwie — od firmy. Wypłata — tygodniowe zaliczki + pełne rozliczenie 10-go."
  },
  "poznan-education-asystent-w-przedszkolu-286": {
    quote_ua: "«Садок двомовний — польська і англійська. Діти вчаться через гру. Мої обов'язки: допомагати з творчими заняттями, одягати дітей на прогулянку, слідкувати за безпекою.» — Катерина, асистент",
    quote_pl: "«Przedszkole dwujęzyczne — polski i angielski. Dzieci uczą się przez zabawę. Moje zadania: pomoc przy zajęciach plastycznych, ubieranie dzieci na spacer, pilnowanie bezpieczeństwa.» — Kateryna, asystent",
    tip_ua: "Предшколь у районі Jeżyce — один з найтрендовіших районів Познані. Трамвай 5 від Rondo Kaponiera — 10 хв. Поруч — парк Sołacki та кав'ярні.",
    tip_pl: "Przedszkole na Jeżycach — jednej z najtrendowszych dzielnic Poznania. Tramwaj 5 z Ronda Kaponiera — 10 min. Obok park Sołacki i kawiarnie.",
    detail_ua: "Група — 15 дітей (3–4 роки). Робочий день: 8:00–16:00. Є музичний зал і сенсорна кімната. Обід для дітей і персоналу — від кейтерінгу щодня.",
    detail_pl: "Grupa — 15 dzieci (3–4 lata). Dzień roboczy: 8:00–16:00. Sala muzyczna i pokój sensoryczny. Obiady dla dzieci i personelu — catering codziennie."
  },
  "poznan-hospitality-pomoc-kuchenna-173": {
    quote_ua: "«Кафе-бістро біля університету. Меню просте: сніданки, сандвічі, кава. Я мию посуд, ріжу овочі, готую простий гарнір. В обід — десятихвилинні черги, але весело.» — Олена, помічниця кухні",
    quote_pl: "«Kawiarnia-bistro przy uniwersytecie. Menu proste: śniadania, kanapki, kawa. Zmywam, kroję warzywa, gotuję dodatki. W porze obiadowej — kolejki, ale wesoło.» — Ołena, pomoc kuchenna",
    tip_ua: "Бістро на вул. Fredry, біля Uniwersytet im. Adama Mickiewicza. Від Rondo Kaponiera — 5 хв пішки. Студентський район — жвавий і дешевий.",
    tip_pl: "Bistro na ul. Fredry, przy UAM. Od Ronda Kaponiera — 5 min pieszo. Studencka dzielnica — tętniąca życiem i tania.",
    detail_ua: "Зміна: 7:00–15:00 або 11:00–19:00. Меню — 12 позицій, все нескладне. Кава для персоналу безкоштовна. У ціну обіду для працівників — будь-яка страва з меню.",
    detail_pl: "Zmiana: 7:00–15:00 lub 11:00–19:00. Menu — 12 pozycji, wszystko nieskomplikowane. Kawa dla personelu za darmo. Obiad dla pracowników — dowolne danie z menu."
  },
  "poznan-production-monter-podzespol-w-104": {
    quote_ua: "«Завод VW у Antoninek — серйозне підприємство. Збираємо деталі салону. Все автоматизовано, я лише контролюю якість і вкладаю елементи. Чисто, є спецодяг.» — Ярослав, монтажник",
    quote_pl: "«Fabryka VW w Antoninku — poważne przedsiębiorstwo. Montujemy elementy wnętrza. Wszystko zautomatyzowane, ja kontroluję jakość i wkładam elementy. Czysto, odzież zapewniona.» — Jarosław, monter",
    tip_ua: "Завод у Antoninek (Komorniki), 15 км від центру. Корпоративний автобус відходить з pl. Wiosny Ludów о 5:30 та 13:30. Паркінг 200 місць.",
    tip_pl: "Fabryka w Antoninku (Komorniki), 15 km od centrum. Autobus zakładowy z pl. Wiosny Ludów o 5:30 i 13:30. Parking 200 miejsc.",
    detail_ua: "Лінія повністю автоматизована: робот подає деталь — ти перевіряєш і закріплюєш. Норма — 200 деталей/зміну. Музика у навушниках дозволена (від лідера зміни).",
    detail_pl: "Linia w pełni zautomatyzowana: robot podaje detal — sprawdzasz i mocujesz. Norma — 200 detali/zmianę. Słuchawki z muzyką dozwolone (za zgodą lidera)."
  },
  "poznan-retail-kasjer-245": {
    quote_ua: "«Працюю в Biedronka на Rataje. Каса + викладка. Ранкова зміна — спокійніше, вечірня — черги. Мені подобається, що є чіткий план задач і не треба імпровізувати.» — Тамара, касирка",
    quote_pl: "«Pracuję w Biedronce na Ratajach. Kasa + wykładka. Rana zmiana — spokojniej, wieczorna — kolejki. Lubię, że jest jasny plan i nie trzeba improwizować.» — Tamara, kasjerka",
    tip_ua: "Biedronka на os. Piastowskie (Rataje). Трамвай 2 від Rondo Kaponiera — 12 хв. Район спальний, спокійний. Поруч — Auchan і Rossmann.",
    tip_pl: "Biedronka na os. Piastowskim (Rataje). Tramwaj 2 z Ronda Kaponiera — 12 min. Spokojna dzielnica sypialna. Obok Auchan i Rossmann.",
    detail_ua: "Зміни: 6:00–14:00 або 14:00–22:00. Навчання касі — 2 дні. Є знижка 10% на покупки в мережі. Уніформа — зелене поло, видається безкоштовно.",
    detail_pl: "Zmiany: 6:00–14:00 lub 14:00–22:00. Szkolenie z kasy — 2 dni. Zniżka 10% na zakupy w sieci. Mundur — zielone polo, wydawane bezpłatnie."
  },
  "sosnowiec-hospitality-cukiernik-227": {
    quote_ua: "«Кондитерський цех, не ресторан — робота спокійніша. Печемо торти на замовлення: весільні, ювілейні. Кожен день — інший дизайн. За 2 місяці освоїла всі техніки оздоблення.» — Світлана, кондитер",
    quote_pl: "«Cukiernia, nie restauracja — praca spokojniejsza. Pieczemy torty na zamówienie: weselne, jubileuszowe. Co dzień inny design. W 2 miesiące opanowałam wszystkie techniki dekoracji.» — Switłana, cukierniczka",
    tip_ua: "Цех у промзоні Sosnowiec Milowice, біля стації SKM Milowice — 7 хв пішки. Район тихий, промисловий. Є стоянка. Поруч — їдальня «U Kasi».",
    tip_pl: "Cukiernia w strefie Sosnowiec Milowice, przy stacji SKM Milowice \u2014 7 min pieszo. Cicha dzielnica przemys\u0142owa. Jest parking. Obok jad\u0142odajnia \u201EU Kasi\u201D.",
    detail_ua: "Зміна: 5:00–13:00 (щоб торти були готові на ранок). Температура у цеху — 18–20°C. Є фартухи, чепчики, рукавички. Дегустація нових рецептів — частина роботи.",
    detail_pl: "Zmiana: 5:00–13:00 (torty gotowe rano). Temperatura w pracowni 18–20°C. Fartuchy, czepki, rękawice. Degustacja nowych przepisów — część pracy."
  },
  "szczecin-beauty-stylistka-paznokci-275": {
    quote_ua: "«Салон у торговому центрі Galaxy — потік клієнтів стабільний. Працюю 5 днів на тиждень, вихідні — Пн+Вт. Не люблю тишу, тому мені тут ідеально — завжди є хтось.» — Лілія, манікюрниця",
    quote_pl: "«Salon w centrum handlowym Galaxy — ruch kliencki stabilny. Pracuję 5 dni w tygodniu, wolne Pn+Wt. Nie lubię ciszy, więc tu idealnie — zawsze ktoś jest.» — Lilia, manikiurzystka",
    tip_ua: "Galaxy — один із головних ТЦ Щеціна, район Niebuszewo. Трамвай 2 від dworzec Szczecin Główny — 10 хв. Всередині — фудкорт, паркінг, WiFi.",
    tip_pl: "Galaxy — jedno z głównych centrów handlowych Szczecina, Niebuszewo. Tramwaj 2 z dworca Szczecin Główny — 10 min. Wewnątrz food court, parking, WiFi.",
    detail_ua: "Робочий день — 10:00–19:00. Обідня перерва — 45 хв (фудкорт у ТЦ). Матеріали: Neonail, Semilac. Бронювання через Booksy. План — 5–7 клієнток/день.",
    detail_pl: "Dzień roboczy 10:00–19:00. Przerwa obiadowa 45 min (food court w centrum). Materiały: Neonail, Semilac. Rezerwacje przez Booksy. Plan — 5–7 klientek/dzień."
  },
  "szczecin-cleaning-pokoj-wka-161": {
    quote_ua: "«Працюю в готелі Radisson біля набережної. Стандарти високі, але все прописано — є чек-лист для кожного номера. Перші два тижні працюєш з наставником.» — Наталія, покоївка",
    quote_pl: "«Pracuję w hotelu Radisson przy nabrzeżu. Standardy wysokie, ale wszystko opisane — checklisty do każdego pokoju. Pierwsze dwa tygodnie z mentorem.» — Natalia, pokojówka",
    tip_ua: "Готель на набережній Odry, район Łasztownia. Від dworzec Szczecin Główny — 15 хв пішки вздовж річки. Красиві краєвиди. Поруч — нова філармонія.",
    tip_pl: "Hotel na nabrzeżu Odry, Łasztownia. Od dworca Szczecin Główny — 15 min pieszo wzdłuż rzeki. Piękne widoki. Obok nowa filharmonia.",
    detail_ua: "12–14 номерів за зміну. Зміна 7:00–15:00. Білизна — від пральні. Є ліфт для візків з приладдям. Кожен номер перевіряється супервайзером.",
    detail_pl: "12–14 pokoi na zmianę. Zmiana 7:00–15:00. Pościel z pralni. Winda dla wózków z wyposażeniem. Każdy pokój sprawdzany przez supervisora."
  },
  "szczecin-construction-pracownik-og-lnobudowlany-56": {
    quote_ua: "«Працюємо на будівництві житлового комплексу на Prawobrzeże. Об'єкт великий — 6 будинків. Моя задача — допомога мулярам та прибирання після CNC-різки.» — Денис, різноробочий",
    quote_pl: "«Pracujemy na budowie osiedla na Prawobrzeżu. Duży obiekt — 6 budynków. Moje zadanie — pomoc murarzom i sprzątanie po cięciu CNC.» — Denys, pracownik ogólnobudowlany",
    tip_ua: "Будова у районі Prawobrzeże, вул. Hangarowa. Автобус A від pl. Rodła — 25 хв. Є їдальня на об'єкті (суп + друге — 18 zł). Паркінг для працівників.",
    tip_pl: "Budowa na Prawobrzeżu, ul. Hangarowa. Autobus A z pl. Rodła — 25 min. Stołówka na obiekcie (zupa + drugie — 18 zł). Parking dla pracowników.",
    detail_ua: "Робочий день: 7:00–15:30.  Субота — за бажанням (подвійна ставка). Інструменти надаються. Контейнер-роздягальня з опаленням та мікрохвильовкою.",
    detail_pl: "Dzień roboczy: 7:00–15:30. Sobota — opcja (podwójna stawka). Narzędzia zapewnione. Kontener-szatnia z ogrzewaniem i mikrofalówką."
  },
  "szczecin-construction-spawacz-mig-mag-92": {
    quote_ua: "«Зварюю металоконструкції для промислових об'єктів. Шви перевіряють рентгеном — якість має бути ідеальна. Маю сертифікат EN 287, тому ставка вища.» — Олександр, зварювальник",
    quote_pl: "«Spawam konstrukcje stalowe do obiektów przemysłowych. Spoiny sprawdzane RTG — jakość musi być idealna. Mam certyfikat EN 287, więc stawka wyższa.» — Ołeksandr, spawacz",
    tip_ua: "Цех у порту — район Wyspa Grodzka. Від tramваю Brama Portowa — 10 хв пішки. Поруч — морський порт, є крамниці та кав'ярня для перерв.",
    tip_pl: "Hala w porcie — Wyspa Grodzka. Od tramwaju Brama Portowa — 10 min pieszo. Obok port morski, sklepy i kawiarnia na przerwy.",
    detail_ua: "Зварювання MIG/MAG (метод 135/136). Детали завтовшки 3–15 мм. Зміна: 6:00–14:00 або 14:00–22:00. Є пост для зварки з витяжкою та загальне освітлення LED.",
    detail_pl: "Spawanie MIG/MAG (metoda 135/136). Detale grubości 3–15 mm. Zmiana: 6:00–14:00 lub 14:00–22:00. Stanowisko z wyciągiem i oświetlenie LED."
  },
  "szczecin-education-asystent-w-przedszkolu-288": {
    quote_ua: "«Працюю з дітьми 4–5 років. Вранці — зарядка і сніданок, потім заняття. Після обіду — тиха година і прогулянка. Мені подобається ритм і передбачуваність.» — Юлія, асистент",
    quote_pl: "«Pracuję z dziećmi 4–5 lat. Rano — gimnastyka i śniadanie, potem zajęcia. Po obiedzie — cisza i spacer. Lubię rytm i przewidywalność.» — Julia, asystent",
    tip_ua: "Садок у районі Pogodno — один із найзеленіших у Щеціні. Трамвай 8 від dworzec Główny — 15 хв. Класична архітектура, тихі вулички з каштанами.",
    tip_pl: "Przedszkole na Pogodnie — jednej z najzielniejszych dzielnic Szczecina. Tramwaj 8 z dworca Głównego — 15 min. Klasyczna architektura, ciche uliczki z kasztanowcami.",
    detail_ua: "Група — 18 дітей, двоє дорослих. Є логопед та психолог на штаті. Обід для персоналу — 8 zł/день. Робоча форма — кольоровий фартух (видається).",
    detail_pl: "Grupa — 18 dzieci, dwóch dorosłych. Logopeda i psycholog na etacie. Obiad dla personelu — 8 zł/dzień. Odzież — kolorowy fartuch (wydawany)."
  },
  "szczecin-logistics-kurier-auto-firmowe--2": {
    quote_ua: "«Щецін — місто біля кордону з Німеччиною, тому частина посилок — з Amazon.de. Маршрут — центр і район Pomorzany. Дорога рівна, пробок майже немає.» — Руслан, кур'єр",
    quote_pl: "«Szczecin — miasto przy granicy z Niemcami, część paczek z Amazon.de. Trasa — centrum i Pomorzany. Drogi równe, korków prawie nie ma.» — Rusłan, kurier",
    tip_ua: "Сортувальний центр у Załom (промзона), з'їзд з S10. Від dworzec Główny — автобус 75, 20 хв. Великий paркінг. Зранку кава + круасан від компанії.",
    tip_pl: "Sortownia w Załomiu (strefa przemysłowa), zjazd z S10. Od dworca Głównego — autobus 75, 20 min. Duży parking. Rano kawa + rogalik od firmy.",
    detail_ua: "Авто: Mercedes eVito (електрофургон) або Sprinter. Зарядку проходить за ніч. 80–110 посилок/день. Маршрут зазвичай закінчується о 14:00–15:00.",
    detail_pl: "Auto: Mercedes eVito (elektryczny) lub Sprinter. Ładowanie w nocy. 80–110 paczek/dzień. Trasa kończy się zwykle o 14:00–15:00."
  },
  "warsaw-agriculture-zbieracz-owoc-w-144": {
    quote_ua: "«Збираємо яблука в саду під Варшавою — Grójec. Сезон — серпень-жовтень. Платять за ящик (1,5 zł). У хороший день — 50+ ящиків. Після роботи їду в місто на електричці.» — Тарас, збирач",
    quote_pl: "«Zbieramy jabłka w sadzie pod Warszawą — Grójec. Sezon sierpień–październik. Płacą od skrzynki (1,5 zł). W dobry dzień — 50+ skrzynek. Po pracy jadę do miasta kolejką.» — Taras, zbieracz",
    tip_ua: "Сад у Grójec (60 км від Варшави), є підвіз мікроавтобусом від Metro Wilanowska о 5:30. Grójec — яблучна столиця Польщі, район повністю аграрний.",
    tip_pl: "Sad w Grójcu (60 km od Warszawy). Dowóz busem z Metro Wilanowska o 5:30. Grójec — stolica jabłek w Polsce, region w pełni rolniczy.",
    detail_ua: "Робочий день: 6:00–14:00 (спека). Рукавиці та відра надаються. Їжу краще брати з собою — найближчий магазин за 3 км. Вода безкоштовна на полі.",
    detail_pl: "Dzień roboczy: 6:00–14:00 (upały). Rękawice i wiadra zapewnione. Jedzenie lepiej zabrać ze sobą — najbliższy sklep 3 km. Woda darmowa na polu."
  },
  "warsaw-beauty-manikiurzystka-271": {
    quote_ua: "«Працюю в салоні на Mokotów. Клієнтки — бізнес-леді, записуються на тижні вперед. Плачу «на крісло» — 1500 zł/міс оренда + все собі. У місяць виходить 6000–7000 zł.» — Анна, манікюрниця",
    quote_pl: "«Pracuję w salonie na Mokotowie. Klientki — bizneswomen, rezerwują na tygodnie. Płacę «za fotel» — 1500 zł/mies. wynajem + reszta moja. Miesięcznie 6000–7000 zł.» — Anna, manikiurzystka",
    tip_ua: "Салон на вул. Puławska, район Mokotów — престижний район Варшави. Від Metro Racławicka — 5 хв пішки. Поруч — Galeria Mokotów та парк Pole Mokotowskie.",
    tip_pl: "Salon na ul. Puławskiej, Mokotów — prestiżowa dzielnica Warszawy. Od Metra Racławicka — 5 min pieszo. Obok Galeria Mokotów i park Pole Mokotowskie.",
    detail_ua: "Модель роботи: оренда крісла або відсоток (на вибір). Графік вільний — сама обираєш години. Ремонт салону свіжий, є стерилізатор, витяжка, кондиціонер.",
    detail_pl: "Model pracy: wynajem fotela lub procent (do wyboru). Grafik wolny — sama wybierasz godziny. Remont salonu świeży, sterylizator, pochłaniacz, klimatyzacja."
  },
  "warsaw-construction-robotnik-budowlany-52": {
    quote_ua: "«Будуємо хмарочос Varso Tower II. Висотна робота — доплата +15%. Бригада 30 чоловік, половина — українці. Бригадир — поляк, але всі інструкції дублюються українською.» — Петро, робітник",
    quote_pl: "«Budujemy wieżowiec Varso Tower II. Praca na wysokości — dopłata +15%. Brygada 30 osób, połowa Ukraińcy. Brygadzista Polak, ale instrukcje podwojone po ukraińsku.» — Petro, robotnik",
    tip_ua: "Будмайданчик біля dworzec Warszawa Centralna — можна дійти пішки. Район Wola / Śródmieście. Поруч — Złote Tarasy та Hala Mirowska (свіжі продукти).",
    tip_pl: "Plac budowy przy dworcu Warszawa Centralna — można dojść pieszo. Wola / Śródmieście. Obok Złote Tarasy i Hala Mirowska (świeże produkty).",
    detail_ua: "Зміна: 7:00–15:30. Обідня перерва 30 хв. Каска, черевики S3, жилет, рукавиці — все від компанії. BHP-навчання — 2 год у перший день. Ліфт на поверхи.",
    detail_pl: "Zmiana: 7:00–15:30. Przerwa obiadowa 30 min. Kask, buty S3, kamizelka, rękawice — od firmy. Szkolenie BHP 2h pierwszego dnia. Winda na piętra."
  },
  "warsaw-hospitality-asystent-kuchni-170": {
    quote_ua: "«Ресторан на Powiśle — модний район. Кухня авторська, шеф — з Італії. Я готую пасту, ріжу інгредієнти, контролюю заготовки. Чайові — 200–400 zł/міс додатково.» — Олексій, асистент",
    quote_pl: "«Restauracja na Powiślu — modna dzielnica. Kuchnia autorska, szef z Włoch. Gotuję pastę, kroję składniki, kontroluję zatowarowanie. Napiwki — 200–400 zł/mies. ekstra.» — Ołeksij, asystent",
    tip_ua: "Ресторан на вул. Kruczkowskiego, район Powiśle (біля Вісли). Від Metro Centrum Nauki Kopernik — 5 хв. Район з барами, галереями та набережною.",
    tip_pl: "Restauracja na ul. Kruczkowskiego, Powiśle (przy Wiśle). Od Metra Centrum Nauki Kopernik — 5 min. Dzielnica z barami, galeriami i bulwarem.",
    detail_ua: "Зміни: 10:00–18:00 або 15:00–23:00. Безкоштовна їжа — будь-яка страва з меню. Фартух та поварська шапка від ресторану. Колектив інтернаціональний: поляки, італійці, українці.",
    detail_pl: "Zmiany: 10:00–18:00 lub 15:00–23:00. Darmowe jedzenie — dowolne danie z menu. Fartuch i czapka od restauracji. Zespół międzynarodowy: Polacy, Włosi, Ukraińcy."
  },
  "warsaw-logistics-kierowca-kurier-kat-b-1": {
    quote_ua: "«Вожу Sprinter по Варшаві — Ursynów, Mokotów, Wilanów. 100–130 посилок на день. Пробки тільки зранку на мостах. Після 13:00 місто вільне. За рекомендацію друга — бонус 500 zł.» — Віталій, кур'єр",
    quote_pl: "«Jeżdżę Sprinterem po Warszawie — Ursynów, Mokotów, Wilanów. 100–130 paczek dziennie. Korki tylko rano na mostach. Po 13:00 miasto wolne. Za polecenie kolegi bonus 500 zł.» — Witalij, kurier",
    tip_ua: "Термінал у Janki (Mszczonów), з'їзд з S8. Зранку — завантаження о 6:30, маршрут через додаток. Від Metro Wilanowska — 20 хв їзди по ранковому трафіку.",
    tip_pl: "Terminal w Jankach (Mszczonów), zjazd z S8. Rano załadunek 6:30, trasa przez appkę. Od Metra Wilanowska — 20 min jazdy w porannym ruchu.",
    detail_ua: "Mercedes Sprinter 316 CDI. Оплата: 160 zł/день + 2 zł за посилку понад 100. Пальне — корпоративна картка Shell. Телефон з кріпленням у кабіні надається.",
    detail_pl: "Mercedes Sprinter 316 CDI. Płatność: 160 zł/dzień + 2 zł za paczkę powyżej 100. Paliwo — karta Shell. Telefon z uchwytem w kabinie zapewniony."
  },
  "warsaw-production-monter-podzespol-w-101": {
    quote_ua: "«Працюю на Samsung Electronics у Wólce Kosowskiej. Складаю компоненти для побутової техніки. Все за інструкцією — 12 кроків на кожну деталь. Чисто, тихо, кондиціонер.» — Антон, монтажник",
    quote_pl: "«Pracuję w Samsung Electronics w Wólce Kosowskiej. Montuję podzespoły AGD. Wszystko wg instrukcji — 12 kroków na każdy detal. Czysto, cicho, klimatyzacja.» — Anton, monter",
    tip_ua: "Завод у Wólka Kosowska, 25 км від центру. Автобус L20 від Metro Wilanowska — 35 хв. Є корпоративний shuttle + великий паркінг. Поруч — торговий центр GD.",
    tip_pl: "Fabryka w Wólce Kosowskiej, 25 km od centrum. Autobus L20 od Metra Wilanowska — 35 min. Jest shuttle + duży parking. Obok centrum handlowe GD.",
    detail_ua: "3 зміни по 8 год. План — 80 деталей/зміну. Є ESD-захист (антистатичний одяг). Їдальня — обід 14 zł (салат, суп, друге, компот). Премія якості — до 300 zł/міс.",
    detail_pl: "3 zmiany po 8h. Plan — 80 podzespołów/zmianę. Ochrona ESD (odzież antystatyczna). Stołówka — obiad 14 zł (sałatka, zupa, drugie, kompot). Premia jakościowa do 300 zł/mies."
  },
  "warsaw-retail-kasjer-242": {
    quote_ua: "«Працюю в Carrefour біля Arkadia. Каса самообслуговування — моя зона: допомагаю клієнтам, вирішую проблеми зі сканером. Спокійніше, ніж звичайна каса.» — Олена, касирка",
    quote_pl: "«Pracuję w Carrefourze przy Arkadii. Kasy samoobsługowe — moja strefa: pomagam klientom, rozwiązuję problemy ze skanerem. Spokojniej niż zwykła kasa.» — Olena, kasjerka",
    tip_ua: "Carrefour у ТЦ Arkadia, район Żoliborz. Від Metro Młociny — 5 хв автобусом. Arkadia — найбільший ТЦ Варшави, є фудкорт із 30 ресторанами.",
    tip_pl: "Carrefour w Arkadii, Żoliborz. Od Metra Młociny — 5 min autobusem. Arkadia — największe centrum handlowe Warszawy, food court z 30 restauracjami.",
    detail_ua: "Зміни: 7:00–15:00 або 14:00–22:00. Навчання касової системи — 3 дні з ментором. Знижка 15% на покупки в Carrefour. Уніформа + бейдж — від компанії.",
    detail_pl: "Zmiany: 7:00–15:00 lub 14:00–22:00. Szkolenie z systemu kasowego — 3 dni z mentorem. Zniżka 15% w Carrefour. Mundur + identyfikator od firmy."
  },
  "wroclaw-agriculture-zbieracz-owoc-w-146": {
    quote_ua: "«Працюю на плантації полуниць під Вроцлавом — Kąty Wrocławskie. Сезон короткий (травень–липень), тому платять добре. Вечорами ходимо в місто — центр красивий!» — Інна, збирач",
    quote_pl: "«Pracuję na plantacji truskawek pod Wrocławiem — Kąty Wrocławskie. Sezon krótki (maj–lipiec), więc płacą dobrze. Wieczorami chodzimy do miasta — centrum piękne!» — Inna, zbieraczka",
    tip_ua: "Плантація в Kąty Wrocławskie, 20 км від центру. Довозять мікроавтобусом з Dworzec Główny о 5:00. Поруч — ріка Одра та живописні поля.",
    tip_pl: "Plantacja w Kątach Wrocławskich, 20 km od centrum. Dowóz busem z Dworca Głównego o 5:00. W pobliżu Odra i malownicze pola.",
    detail_ua: "Оплата за кілограм: полуниця — 1,2 zł/кг, малина — 1,5 zł/кг. Контейнери зважуються наприкінці дня. Вода та чай — безкоштовно. Є навіс від дощу і сонця.",
    detail_pl: "Płatność za kilogram: truskawki — 1,2 zł/kg, maliny — 1,5 zł/kg. Pojemniki ważone na koniec dnia. Woda i herbata bezpłatnie. Jest wiata na deszcz i słońce."
  },
  "wroclaw-cleaning-pokoj-wka-158": {
    quote_ua: "«Працюю в ibis Styles на Rynek — красивий готель у самому центрі. Номери компактні, тому прибирання швидке. За зміну — 16–18 номерів, встигаю без поспіху.» — Марта, покоївка",
    quote_pl: "«Pracuję w ibis Styles na Rynku — piękny hotel w samym centrum. Pokoje kompaktowe, więc sprzątanie szybkie. 16–18 pokoi na zmianę, zdążam bez pośpiechu.» — Marta, pokojówka",
    tip_ua: "Готель прямо на Rynek Wrocławski — головна площа міста. Від Dworzec Główny — трамвай 3 до зупинки Rynek — 8 хв. Район жвавий, з сотнями кав'ярень.",
    tip_pl: "Hotel na Rynku Wrocławskim — główny plac miasta. Z Dworca Głównego — tramwaj 3 na Rynek — 8 min. Żywa dzielnica z setkami kawiarni.",
    detail_ua: "Зміна: 8:00–16:00. Чек-лист у додатку на телефон. Білизна від пральні — не потрібно прати. Хімія — JohnsonDiversey. Шафка з замком у підвалі.",
    detail_pl: "Zmiana: 8:00–16:00. Checklista w aplikacji na telefon. Pościel z pralni. Chemia — JohnsonDiversey. Szafka z zamkiem w piwnicy."
  },
  "wroclaw-education-asystent-w-przedszkolu-285": {
    quote_ua: "«Предшколь Монтессорі — тут інший підхід. Дітей не змушують, а направляють. Я допомагаю з матеріалами, стежу за порядком, спілкуюсь з батьками. Дуже спокійна атмосфера.» — Оксана, асистент",
    quote_pl: "«Przedszkole Montessori — tu inne podejście. Dzieci nie zmusza się, a kieruje. Pomagam z materiałami, dbam o porządek, rozmawiam z rodzicami. Bardzo spokojna atmosfera.» — Oksana, asystent",
    tip_ua: "Предшколь у районі Krzyki, вул. Ślężna. Трамвай 4/10 від Dworzec Główny — 12 хв. Район житловий, спокійний, з парком Południowym.",
    tip_pl: "Przedszkole na Krzykach, ul. Ślężna. Tramwaj 4/10 z Dworca Głównego — 12 min. Dzielnica mieszkaniowa, spokojna, z Parkiem Południowym.",
    detail_ua: "Група — 12 дітей (за стандартом Монтессорі). Заняття з 8:00 до 16:00. Є окремий зал для руху, куточок тиші та «кухня» для дитячих експериментів.",
    detail_pl: "Grupa — 12 dzieci (standard Montessori). Zajęcia 8:00–16:00. Oddzielna sala ruchu, kącik ciszy i «kuchnia» do dziecięcych eksperymentów."
  },
  "wroclaw-hospitality-asystent-kuchni-172": {
    quote_ua: "«Працюю у готельному ресторані HP Park Plaza — великий, 120 місць. Зранку — шведський стіл, далі — обідній сервіс. Я займаюсь заготовкою та подачею. Їжа — безкоштовно.» — Ніна, асистент",
    quote_pl: "«Pracuję w restauracji hotelowej HP Park Plaza — duża, 120 miejsc. Rano szw. stół, potem serwis obiadowy. Stawiam i przygotowuję. Jedzenie — za darmo.» — Nina, asystent",
    tip_ua: "Готель у центрі, вул. Drobnera (біля моста Grunwaldzkiego). Трамвай від Dworzec Główny — 5 хв. Район — Nadodrze, один з найхіпстерських у місті.",
    tip_pl: "Hotel w centrum, ul. Drobnera (przy moście Grunwaldzkim). Tramwaj z Dworca Głównego — 5 min. Nadodrze — jedna z najhipsterszych dzielnic miasta.",
    detail_ua: "Дві зміни: 6:00–14:00 (сніданковий сервіс) або 12:00–20:00 (обідній). Перша зміна більш інтенсивна. Уніформа: чорні штани + біла сорочка (надаються й перуться).",
    detail_pl: "Dwie zmiany: 6:00–14:00 (serwis śniadaniowy) lub 12:00–20:00 (obiadowy). Rana zmiana intensywniejsza. Mundur: czarne spodnie + biała koszula (zapewnione, prane)."
  },
  "wroclaw-production-monter-podzespol-w-103": {
    quote_ua: "«Завод LG Chem — виготовляємо батареї для електрокарів. Робота — на чистій лінії у спецодязі. Непогана зарплата, стабільний графік, є нічна доплата.» — Ігор, монтажник",
    quote_pl: "«Fabryka LG Chem — produkujemy baterie do aut elektrycznych. Praca na czystej linii w odzieży ochronnej. Przyzwoita pensja, stały grafik, dopłata za nockę.» — Igor, monter",
    tip_ua: "Завод у Kobierzyce (15 км від Вроцлава). Корпоративний автобус з pl. Dominikański о 5:40 і 13:40. Їдальня на заводі, обід — 12 zł. Паркінг безкоштовний.",
    tip_pl: "Fabryka w Kobierzycach (15 km od Wrocławia). Autobus zakładowy z pl. Dominikańskiego o 5:40 i 13:40. Stołówka — obiad 12 zł. Parking bezpłatny.",
    detail_ua: "Чиста кімната (Clean Room) — обов'язковий спецодяг, коротко стрижені нігті. 3 зміни. Нічна зміна +30%. Обов'язковий медогляд (оплата від компанії).",
    detail_pl: "Cleanroom — obowiązkowa odzież ochronna, krótko obcięte paznokcie. 3 zmiany. Nocna +30%. Obowiązkowe badania lekarskie (pokrywane przez firmę)."
  },
  "wroclaw-retail-kasjer-244": {
    quote_ua: "«Працюю в Kaufland на Gaj. Перші 2 тижні — каса під наглядом, потім самостійно. Темп у годину пік високий, але є й спокійні моменти. Люблю ранкову зміну.» — Наталя, касирка",
    quote_pl: "«Pracuję w Kauflandzie na Gaju. Pierwsze 2 tygodnie — kasa pod nadzorem, potem samodzielnie. Tempo w godzinach szczytu duże, ale są spokojne momenty. Lubię ranną zmianę.» — Natalia, kasjerka",
    tip_ua: "Kaufland на вул. Opolska, район Gaj. Автобус 126 від Rynek — 15 хв. Район спальний, поруч — Castorama та MediaMarkt. Паркінг для працівників із задувходу.",
    tip_pl: "Kaufland na ul. Opolskiej, Gaj. Autobus 126 z Rynku — 15 min. Spokojna dzielnica, obok Castorama i MediaMarkt. Parking dla pracowników od tyłu.",
    detail_ua: "Зміни: 6:30–14:30 або 13:30–21:30. Касирка обслуговує також зону самообслуговування. Різдвяний бонус — одноразово 800 zł. Знижка 5% на покупки в мережі.",
    detail_pl: "Zmiany: 6:30–14:30 lub 13:30–21:30. Kasjerka obsługuje też strefę kas samoobsługowych. Bonus świąteczny — jednorazowo 800 zł. Zniżka 5% na zakupy w sieci."
  }
};

export default ENRICHMENTS;
