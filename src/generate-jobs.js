// Скрипт для генерації різноманітних вакансій (SEO Optimized)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cities = [
  { ua: 'Варшава', pl: 'Warszawa', slug: 'warsaw' },
  { ua: 'Краків', pl: 'Kraków', slug: 'krakow' },
  { ua: 'Вроцлав', pl: 'Wrocław', slug: 'wroclaw' },
  { ua: 'Познань', pl: 'Poznań', slug: 'poznan' },
  { ua: 'Гданськ', pl: 'Gdańsk', slug: 'gdansk' },
  { ua: 'Щецін', pl: 'Szczecin', slug: 'szczecin' },
  { ua: 'Лодзь', pl: 'Łódź', slug: 'lodz' },
  { ua: 'Катовіце', pl: 'Katowice', slug: 'katowice' },
  { ua: 'Люблін', pl: 'Lublin', slug: 'lublin' },
  { ua: 'Білосток', pl: 'Białystok', slug: 'bialystok' }
];

const jobTemplates = {
  logistics: [
    {
      title_ua: ['Водій-кур\'єр', 'Кур\'єр з власним авто', 'Водій категорії B (доставка)'],
      title_pl: ['Kierowca-kurier', 'Kurier z własnym autem', 'Kierowca kat. B (dostawy)'],
      salary: ['5000-7000 PLN', '4800-7200 PLN', '5200-6800 PLN'],
      description_ua: ['Доставка вантажів по місту та області. Власний автомобіль обов\'язковий.', 'Шукаємо водія для розвезення посилок. Робота на власному авто.', 'Потрібен кур\'єр з авто для доставки замовлень по місту.'],
      description_pl: ['Dostawa towarów po mieście i okolicach. Własny samochód wymagany.', 'Szukamy kierowcy do doręczania paczek. Praca własnym autem.', 'Potrzebny kurier z samochodem do dostaw miejskich.'],
      requirements_ua: ['Право категорії B', 'Досвід від 1 року', 'Знання географії міста', 'Відповідальність', 'Пунктуальність'],
      requirements_pl: ['Prawo jazdy kat. B', 'Doświadczenie min. 1 rok', 'Znajomość geografii miasta', 'Odpowiedzialność', 'Punktualność']
    },
    {
      title_ua: ['Складський працівник', 'Комплектувальник на склад', 'Працівник логістичного центру'],
      title_pl: ['Pracownik magazynowy', 'Kompletator zamówień', 'Pracownik centrum logistycznego'],
      salary: ['4500-5500 PLN', '4300-5200 PLN', '4600-5800 PLN'],
      description_ua: ['Комплектація замовлень, навантаження/розвантаження товарів.', 'Робота зі сканером, збір замовлень на складі.', 'Прийом товару, сортування та підготовка до відправки.'],
      description_pl: ['Kompletacja zamówień, załadunek/rozładunek towarów.', 'Praca ze skanerem, zbieranie zamówień na magazynie.', 'Przyjęcie towaru, sortowanie i przygotowanie do wysyłki.'],
      requirements_ua: ['Досвід на складі', 'Фізична витривалість', 'Відповідальність', 'Уважність до деталей', 'Вміння працювати в команді'],
      requirements_pl: ['Doświadczenie magazynowe', 'Wytrzymałość fizyczna', 'Odpowiedzialność', 'Dbałość o szczegóły', 'Umiejętność pracy w zespole']
    },
    {
      title_ua: ['Оператор навантажувача', 'Водій навантажувача (UDT)', 'Карщик'],
      title_pl: ['Operator wózka widłowego', 'Kierowca wózka (UDT)', 'Operator wózka jezdniowego'],
      salary: ['5500-7000 PLN', '5200-6800 PLN', '5800-7500 PLN'],
      description_ua: ['Робота на навантажувачі, переміщення вантажів по складу.', 'Обслуговування високого складу, робота на навантажувачі.', 'Транспортування палет, завантаження фур.'],
      description_pl: ['Praca na wózku widłowym, przemieszczanie towarów w magazynie.', 'Obsługa magazynu wysokiego składowania.', 'Transport palet, załadunek ciężarówek.'],
      requirements_ua: ['Сертифікат UDT', 'Досвід від 2 років', 'Уважність', 'Безпечне водіння', 'Готовність до змін'],
      requirements_pl: ['Certyfikat UDT', 'Doświadczenie min. 2 lata', 'Uwaga', 'Bezpieczna jazda', 'Gotowość do zmian']
    }
  ],
  construction: [
    {
      title_ua: ['Будівельник-муляр', 'Муляр', 'Майстер кладки'],
      title_pl: ['Murarz', 'Murarz budowlany', 'Specjalista murowania'],
      salary: ['6000-9000 PLN', '6500-9500 PLN', '5500-8500 PLN'],
      description_ua: ['Мурування стін, роботи з цеглою та блоками.', 'Зведення стін, перегородок, робота з газоблоком.', 'Будівництво житлових будинків, кладка цегли.'],
      description_pl: ['Murowanie ścian, prace z cegłą i blokami.', 'Wznoszenie ścian, praca z gazobetonem.', 'Budowa domów mieszkalnych, murowanie.'],
      requirements_ua: ['Досвід від 3 років', 'Вміння читати креслення', 'Власний інструмент', 'Фізична сила', 'Відсутність шкідливих звичок'],
      requirements_pl: ['Doświadczenie min. 3 lata', 'Umiejętność czytania rysunków', 'Własne narzędzia', 'Siła fizyczna', 'Brak nałogów']
    },
    {
      title_ua: ['Електрик будівельний', 'Електромонтажник', 'Електрик на будову'],
      title_pl: ['Elektryk budowlany', 'Elektromonter', 'Elektryk na budowę'],
      salary: ['6500-9500 PLN', '6000-9000 PLN', '7000-10000 PLN'],
      description_ua: ['Монтаж електропроводки, підключення обладнання.', 'Прокладання кабелів, монтаж розеток та щитків.', 'Електромонтажні роботи в новобудовах.'],
      description_pl: ['Montaż instalacji elektrycznych, podłączanie urządzeń.', 'Układanie kabli, montaż gniazdek i rozdzielnic.', 'Prace elektromontażowe w nowym budownictwie.'],
      requirements_ua: ['Кваліфікація SEP', 'Досвід від 2 років', 'Знання норм', 'Вміння читати схеми', 'Допуск до 1кВ'],
      requirements_pl: ['Uprawnienia SEP', 'Doświadczenie min. 2 lata', 'Znajomość norm', 'Czytanie schematów', 'Uprawnienia do 1kV']
    },
    {
      title_ua: ['Сантехнік', 'Монтажник санітарних систем', 'Гідравлік'],
      title_pl: ['Hydraulik', 'Monter instalacji sanitarnych', 'Hydraulik budowlany'],
      salary: ['5500-8000 PLN', '5000-7500 PLN', '6000-9000 PLN'],
      description_ua: ['Монтаж систем водопостачання та каналізації.', 'Встановлення сантехніки, прокладання труб.', 'Робота з системами опалення та водопостачання.'],
      description_pl: ['Montaż systemów wodno-kanalizacyjnych.', 'Biały montaż, układanie rur.', 'Praca przy instalacjach grzewczych i wodnych.'],
      requirements_ua: ['Досвід від 2 років', 'Власний інструмент', 'Комунікабельність', 'Читання проектів', 'Акуратність'],
      requirements_pl: ['Doświadczenie min. 2 lata', 'Własne narzędzia', 'Komunikatywność', 'Czytanie projektów', 'Dokładność']
    }
  ],
  production: [
    {
      title_ua: ['Робітник виробництва', 'Працівник на лінію', 'Оператор виробничої лінії'],
      title_pl: ['Pracownik produkcji', 'Pracownik liniowy', 'Operator linii produkcyjnej'],
      salary: ['4200-5500 PLN', '4000-5000 PLN', '4300-5800 PLN'],
      description_ua: ['Робота на виробничій лінії, упаковка продукції.', 'Контроль якості, пакування готових виробів.', 'Прості мануальні роботи на заводі.'],
      description_pl: ['Praca na linii produkcyjnej, pakowanie produktów.', 'Kontrola jakości, pakowanie gotowych wyrobów.', 'Proste prace manualne w fabryce.'],
      requirements_ua: ['Без досвіду', 'Змінний графік', 'Відповідальність', 'Мануальні здібності', 'Хороший зір'],
      requirements_pl: ['Bez doświadczenia', 'Praca zmianowa', 'Odpowiedzialność', 'Zdolności manualne', 'Dobry wzrok']
    },
    {
      title_ua: ['Оператор верстата', 'Оператор ЧПУ', 'Налагоджувальник верстатів'],
      title_pl: ['Operator maszyn', 'Operator CNC', 'Ustawiacz maszyn'],
      salary: ['5000-6500 PLN', '5500-7500 PLN', '4800-6200 PLN'],
      description_ua: ['Управління верстатами ЧПУ, контроль якості.', 'Налаштування та обслуговування виробничих машин.', 'Робота з металообробним обладнанням.'],
      description_pl: ['Obsługa maszyn CNC, kontrola jakości.', 'Ustawianie i obsługa maszyn produkcyjnych.', 'Praca z obrabiarkami do metalu.'],
      requirements_ua: ['Досвід з ЧПУ', 'Технічна освіта', 'Уважність', 'Читання креслень', 'Вміння користуватися вимірювальними приладами'],
      requirements_pl: ['Doświadczenie z CNC', 'Wykształcenie techniczne', 'Uwaga', 'Czytanie rysunków', 'Obsługa przyrządów pomiarowych']
    }
  ],
  hospitality: [
    {
      title_ua: ['Кухар', 'Кухар-універсал', 'Помічник кухаря'],
      title_pl: ['Kucharz', 'Kucharz uniwersalny', 'Pomoc kuchenna'],
      salary: ['4500-6500 PLN', '5000-7000 PLN', '4200-6000 PLN'],
      description_ua: ['Приготування страв за меню, дотримання стандартів.', 'Робота в гарячому/холодному цеху, приготування заготовок.', 'Приготування страв європейської кухні.'],
      description_pl: ['Przygotowywanie potraw zgodnie z menu, przestrzeganie standardów.', 'Praca na kuchni gorącej/zimnej, przygotowywanie półproduktów.', 'Przygotowywanie dań kuchni europejskiej.'],
      requirements_ua: ['Досвід від 1 року', 'Знання технології', 'Чистоплотність', 'Санітарна книжка', 'Швидкість роботи'],
      requirements_pl: ['Doświadczenie min. 1 rok', 'Znajomość technologii', 'Czystość', 'Książeczka sanepidowska', 'Szybkość pracy']
    },
    {
      title_ua: ['Офіціант', 'Офіціант в ресторан', 'Обслуговування гостей'],
      title_pl: ['Kelner', 'Kelner w restauracji', 'Obsługa gości'],
      salary: ['3800-5000 PLN', '3500-4800 PLN', '4000-5500 PLN'],
      description_ua: ['Обслуговування гостей, прийом замовлень.', 'Сервірування столів, консультація по меню.', 'Робота в залі ресторану, подача страв.'],
      description_pl: ['Obsługa gości, przyjmowanie zamówień.', 'Nakrywanie do stołu, doradztwo w menu.', 'Praca na sali restauracyjnej, podawanie dań.'],
      requirements_ua: ['Комунікабельність', 'Охайність', 'Англійська базова', 'Ввічливість', 'Стресостійкість'],
      requirements_pl: ['Komunikatywność', 'Schludność', 'Angielski podstawowy', 'Uprzejmość', 'Odporność na stres']
    }
  ],
  cleaning: [
    {
      title_ua: ['Прибиральник офісів', 'Клінер', 'Прибиральниця'],
      title_pl: ['Sprzątacz biur', 'Personel sprzątający', 'Sprzątaczka'],
      salary: ['3500-4500 PLN', '3600-4600 PLN', '3400-4400 PLN'],
      description_ua: ['Прибирання офісних приміщень, підтримання чистоти.', 'Вологе прибирання, винос сміття, догляд за поверхнями.', 'Комплексне прибирання бізнес-центру.'],
      description_pl: ['Sprzątanie pomieszczeń biurowych, utrzymanie czystości.', 'Mycie podłóg, wynoszenie śmieci, dbanie o powierzchnie.', 'Kompleksowe sprzątanie centrum biznesowego.'],
      requirements_ua: ['Без досвіду', 'Акуратність', 'Відповідальність', 'Пунктуальність', 'Бажання працювати'],
      requirements_pl: ['Bez doświadczenia', 'Dokładność', 'Odpowiedzialność', 'Punktualność', 'Chęć do pracy']
    },
    {
      title_ua: ['Прибиральник готелів', 'Покоївка', 'Прибирання номерів'],
      title_pl: ['Pokojówka hotelowa', 'Pokojowa', 'Sprzątanie pokoi'],
      salary: ['3800-5000 PLN', '4000-5200 PLN', '3700-4800 PLN'],
      description_ua: ['Прибирання номерів готелю, зміна білизни.', 'Підготовка номерів до заселення, комплектація міні-бару.', 'Прибирання готельних кімнат та коридорів.'],
      description_pl: ['Sprzątanie pokoi hotelowych, wymiana pościeli.', 'Przygotowanie pokoi do zameldowania, uzupełnianie barku.', 'Sprzątanie pokoi hotelowych i korytarzy.'],
      requirements_ua: ['Досвід бажаний', 'Швидкість', 'Чесність', 'Охайність', 'Фізична витривалість'],
      requirements_pl: ['Doświadczenie mile widziane', 'Szybkość', 'Uczciwość', 'Schludność', 'Wytrzymałość fizyczna']
    }
  ],
  retail: [
    {
      title_ua: ['Продавець-консультант', 'Консультант в магазин', 'Продавець'],
      title_pl: ['Sprzedawca-doradca', 'Doradca klienta', 'Sprzedawca'],
      salary: ['4000-5500 PLN', '4200-5800 PLN', '3900-5000 PLN'],
      description_ua: ['Консультування клієнтів, продаж товарів.', 'Допомога у виборі товару, викладка на полиці.', 'Робота в торговому залі, обслуговування покупців.'],
      description_pl: ['Doradztwo klientom, sprzedaż produktów.', 'Pomoc w wyborze towaru, wykładanie na półki.', 'Praca na sali sprzedaży, obsługa kupujących.'],
      requirements_ua: ['Комунікабельність', 'Досвід продажів', 'Приємна зовнішність', 'Грамотна мова', 'Активність'],
      requirements_pl: ['Komunikatywność', 'Doświadczenie w sprzedaży', 'Miły wygląd', 'Poprawna mowa', 'Aktywność']
    },
    {
      title_ua: ['Касир', 'Касир-продавець', 'Працівник каси'],
      title_pl: ['Kasjer', 'Kasjer-sprzedawca', 'Pracownik kasy'],
      salary: ['3600-4500 PLN', '3800-4800 PLN', '3500-4400 PLN'],
      description_ua: ['Робота на касі, обслуговування клієнтів.', 'Розрахунок покупців, ведення касової документації.', 'Сканування товарів, прийом оплати.'],
      description_pl: ['Praca na kasie, obsługa klientów.', 'Rozliczanie klientów, prowadzenie dokumentacji kasowej.', 'Skanowanie towarów, przyjmowanie płatności.'],
      requirements_ua: ['Уважність', 'Чесність', 'Швидкість', 'Вміння рахувати', 'Стресостійкість'],
      requirements_pl: ['Uwaga', 'Uczciwość', 'Szybkość', 'Umiejętność liczenia', 'Odporność na stres']
    }
  ],
  healthcare: [
    {
      title_ua: ['Медсестра', 'Медична сестра', 'Медсестра в клініку'],
      title_pl: ['Pielęgniarka', 'Siostra medyczna', 'Pielęgniarka w klinice'],
      salary: ['6000-8500 PLN', '6500-9000 PLN', '5800-8000 PLN'],
      description_ua: ['Догляд за пацієнтами, медичні процедури.', 'Виконання ін\'єкцій, крапельниць, асистування лікарю.', 'Робота в стаціонарі або поліклініці.'],
      description_pl: ['Opieka nad pacjentami, procedury medyczne.', 'Wykonywanie zastrzyków, kroplówek, asystowanie lekarzowi.', 'Praca w szpitalu lub przychodni.'],
      requirements_ua: ['Медична освіта', 'Ліцензія', 'Досвід від 1 року', 'Знання польської мови', 'Емпатія'],
      requirements_pl: ['Wykształcenie medyczne', 'Licencja', 'Doświadczenie min. 1 rok', 'Znajomość języka polskiego', 'Empatia']
    },
    {
      title_ua: ['Опікун літніх людей', 'Доглядальниця', 'Опікун в пансіонат'],
      title_pl: ['Opiekun osób starszych', 'Opiekunka', 'Opiekun w domu opieki'],
      salary: ['4500-6500 PLN', '4200-6000 PLN', '4800-7000 PLN'],
      description_ua: ['Догляд за літніми людьми, допомога в побуті.', 'Гігієнічні процедури, годування, прогулянки.', 'Супровід підопічних, допомога в щоденних справах.'],
      description_pl: ['Opieka nad osobami starszymi, pomoc w życiu codziennym.', 'Zabiegi higieniczne, karmienie, spacery.', 'Towarzyszenie podopiecznym, pomoc w codziennych czynnościach.'],
      requirements_ua: ['Терпіння', 'Відповідальність', 'Досвід бажаний', 'Добре серце', 'Фізична витривалість'],
      requirements_pl: ['Cierpliwość', 'Odpowiedzialność', 'Doświadczenie mile widziane', 'Dobre serce', 'Wytrzymałość fizyczna']
    }
  ],
  it: [
    {
      title_ua: ['Програміст PHP', 'PHP Developer', 'Backend розробник (PHP)'],
      title_pl: ['Programista PHP', 'PHP Developer', 'Backend Developer (PHP)'],
      salary: ['8000-15000 PLN', '9000-16000 PLN', '7500-14000 PLN'],
      description_ua: ['Розробка веб-додатків, підтримка проектів.', 'Створення бекенду, інтеграція API, оптимізація коду.', 'Робота над новими модулями системи.'],
      description_pl: ['Tworzenie aplikacji webowych, wsparcie projektów.', 'Tworzenie backendu, integracja API, optymalizacja kodu.', 'Praca nad nowymi modułami systemu.'],
      requirements_ua: ['PHP, MySQL', 'Досвід від 2 років', 'Laravel/Symfony', 'Git', 'Англійська B2'],
      requirements_pl: ['PHP, MySQL', 'Doświadczenie min. 2 lata', 'Laravel/Symfony', 'Git', 'Angielski B2']
    },
    {
      title_ua: ['Тестувальник QA', 'QA Engineer', 'Manual Tester'],
      title_pl: ['Tester QA', 'QA Engineer', 'Tester Manualny'],
      salary: ['6000-9000 PLN', '5500-8500 PLN', '6500-10000 PLN'],
      description_ua: ['Тестування програмного забезпечення, звіти про баги.', 'Ручне тестування веб-сайтів та додатків.', 'Написання тест-кейсів, пошук помилок.'],
      description_pl: ['Testowanie oprogramowania, raportowanie błędów.', 'Testowanie manualne stron i aplikacji.', 'Pisanie przypadków testowych, szukanie błędów.'],
      requirements_ua: ['Англійська', 'Логічне мислення', 'Досвід від 1 року', 'Уважність до деталей', 'Jira/Trello'],
      requirements_pl: ['Angielski', 'Myślenie logiczne', 'Doświadczenie min. 1 rok', 'Dbałość o szczegóły', 'Jira/Trello']
    }
  ],
  agriculture: [
    {
      title_ua: ['Робітник на збір урожаю', 'Збирач ягід/овочів', 'Сезонний працівник'],
      title_pl: ['Pracownik przy zbiorach', 'Zbieracz owoców', 'Pracownik sezonowy'],
      salary: ['3500-4500 PLN', '3200-4800 PLN', '3600-5000 PLN'],
      description_ua: ['Збір фруктів та овочів, сезонна робота.', 'Робота в полі/теплиці, збір врожаю.', 'Сортування та пакування овочів.'],
      description_pl: ['Zbiór owoców i warzyw, praca sezonowa.', 'Praca w polu/szklarni, zbiór plonów.', 'Sortowanie i pakowanie warzyw.'],
      requirements_ua: ['Фізична витривалість', 'Без досвіду', 'Готовність до сезонної роботи', 'Відсутність алергії', 'Працьовитість'],
      requirements_pl: ['Wytrzymałość fizyczna', 'Bez doświadczenia', 'Gotowość do pracy sezonowej', 'Brak alergii', 'Pracowitość']
    }
  ],
  education: [
    {
      title_ua: ['Вчитель англійської', 'Викладач англійської мови', 'Репетитор англійської'],
      title_pl: ['Nauczyciel języka angielskiego', 'Lektor angielskiego', 'Korepetytor angielskiego'],
      salary: ['5000-7500 PLN', '4500-7000 PLN', '5500-8000 PLN'],
      description_ua: ['Викладання англійської мови дітям та дорослим.', 'Проведення уроків у мовній школі.', 'Підготовка до іспитів, розмовна практика.'],
      description_pl: ['Nauczanie języka angielskiego dzieci i dorosłych.', 'Prowadzenie lekcji w szkole językowej.', 'Przygotowanie do egzaminów, konwersacje.'],
      requirements_ua: ['Вища освіта', 'Англійська C1', 'Досвід викладання', 'Любов до дітей', 'Креативність'],
      requirements_pl: ['Wykształcenie wyższe', 'Angielski C1', 'Doświadczenie w nauczaniu', 'Podejście do dzieci', 'Kreatywność']
    }
  ],
  beauty: [
    {
      title_ua: ['Перукар', 'Перукар-стиліст', 'Майстер зачісок'],
      title_pl: ['Fryzjer', 'Fryzjer-stylista', 'Mistrz fryzjerstwa'],
      salary: ['4500-7000 PLN', '4000-6500 PLN', '5000-8000 PLN'],
      description_ua: ['Стрижки, укладки, фарбування волосся.', 'Чоловічі та жіночі стрижки, догляд за волоссям.', 'Робота в салоні краси, створення образів.'],
      description_pl: ['Strzyżenie, układanie, farbowanie włosów.', 'Strzyżenia damskie i męskie, pielęgnacja włosów.', 'Praca w salonie urody, stylizacja.'],
      requirements_ua: ['Кваліфікація', 'Досвід від 2 років', 'Креативність', 'Портфоліо', 'Комунікабельність'],
      requirements_pl: ['Kwalifikacje', 'Doświadczenie min. 2 lata', 'Kreatywność', 'Portfolio', 'Komunikatywność']
    }
  ],
  security: [
    {
      title_ua: ['Охоронець', 'Працівник охорони', 'Сек'юріті'],
      title_pl: ['Pracownik ochrony', 'Ochroniarz', 'Pracownik dozoru'],
      salary: ['4000-5500 PLN', '3800-5000 PLN', '4200-6000 PLN'],
      description_ua: ['Охорона об\'єктів, контроль доступу.', 'Відеоспостереження, патрулювання території.', 'Забезпечення безпеки в торговому центрі/офісі.'],
      description_pl: ['Ochrona obiektów, kontrola dostępu.', 'Monitoring, patrolowanie terenu.', 'Zapewnienie bezpieczeństwa w centrum handlowym/biurze.'],
      requirements_ua: ['Ліцензія охоронця', 'Відповідальність', 'Чесність', 'Фізична підготовка', 'Уважність'],
      requirements_pl: ['Licencja ochroniarza', 'Odpowiedzialność', 'Uczciwość', 'Sprawność fizyczna', 'Uwaga']
    }
  ]
};

const responsibilityVariations = [
  { ua: 'Виконання професійних обов\'язків згідно посадової інструкції, дотримання стандартів компанії.', pl: 'Wykonywanie obowiązków zawodowych zgodnie z instrukcją, przestrzeganie standardów firmy.' },
  { ua: 'Забезпечення якісного виконання поставлених завдань та дотримання внутрішнього розпорядку.', pl: 'Zapewnienie wysokiej jakości realizacji powierzonych zadań i przestrzeganie regulaminu wewnętrznego.' },
  { ua: 'Робота згідно з встановленими процедурами, дбайливе ставлення до майна компанії.', pl: 'Praca zgodnie z ustalonymi procedurami, dbałość o mienie firmy.' },
  { ua: 'Виконання поточних завдань керівника, дотримання правил техніки безпеки.', pl: 'Wykonywanie bieżących zadań kierownika, przestrzeganie zasad BHP.' }
];

const footerVariations = [
  { ua: 'Працевлаштування легальне, підтримка для українців.', pl: 'Legalne zatrudnienie, wsparcie dla Ukraińców.' },
  { ua: 'Офіційне працевлаштування, допомога з оформленням документів.', pl: 'Oficjalne zatrudnienie, pomoc w załatwianiu formalności.' },
  { ua: 'Гарантуємо стабільну роботу та своєчасну оплату праці.', pl: 'Gwarantujemy stabilną pracę i terminowe wynagrodzenie.' },
  { ua: 'Повний супровід координатора, допомога з житлом (за наявності).', pl: 'Pełne wsparcie koordynatora, pomoc w zakwaterowaniu (jeśli dostępne).' }
];

// Helper to get random item or return item if not array
function getOne(item) {
  if (Array.isArray(item)) {
    return item[Math.floor(Math.random() * item.length)];
  }
  return item;
}

// Helper to shuffle array
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Helper to pick N random items
function pickRandom(arr, n) {
  const shuffled = shuffle([...arr]);
  return shuffled.slice(0, n);
}

function generateJob(category, template, city, index) {
  // Pick random variations
  const titleUa = getOne(template.title_ua);
  const titlePl = getOne(template.title_pl);
  const descUa = getOne(template.description_ua);
  const descPl = getOne(template.description_pl);
  const salary = getOne(template.salary);
  
  // Pick 3-4 random requirements
  const reqCount = Math.floor(Math.random() * 2) + 3; // 3 or 4
  const reqUa = pickRandom(template.requirements_ua, reqCount);
  const reqPl = pickRandom(template.requirements_pl, reqCount);

  const slug = `${city.slug}-${category}-${titlePl.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index}`;
  const resp = getOne(responsibilityVariations);
  const footer = getOne(footerVariations);

  // Randomize section order to avoid "AI template" look
  const sectionsUa = [
    `<h3>Обов'язки</h3><p>${resp.ua}</p>`,
    `<h3>Вимоги</h3><ul>${reqUa.map(r => `<li>${r}</li>`).join('')}</ul>`,
    `<h3>Умови</h3><ul><li><strong>Зарплата:</strong> ${salary}</li><li><strong>Контракт:</strong> Umowa o pracę або Umowa zlecenie</li><li><strong>Графік:</strong> 5/2 або змінний</li><li><strong>Бонуси:</strong> за досягнення</li></ul>`
  ];
  
  const sectionsPl = [
    `<h3>Obowiązki</h3><p>${resp.pl}</p>`,
    `<h3>Wymagania</h3><ul>${reqPl.map(r => `<li>${r}</li>`).join('')}</ul>`,
    `<h3>Oferujemy</h3><ul><li><strong>Wynagrodzenie:</strong> ${salary}</li><li><strong>Umowa:</strong> Umowa o pracę lub Umowa zlecenie</li><li><strong>Grafik:</strong> 5/2 lub zmianowy</li><li><strong>Premie:</strong> za osiągnięcia</li></ul>`
  ];

  // Shuffle sections, but keep "Conditions" last usually looks better, 
  // but for pure SEO uniqueness, full shuffle is stronger. 
  // Let's keep Conditions last for UX, shuffle others.
  const mainSectionsUa = shuffle(sectionsUa.slice(0, 2));
  mainSectionsUa.push(sectionsUa[2]); // Add conditions back at end

  const mainSectionsPl = shuffle(sectionsPl.slice(0, 2));
  mainSectionsPl.push(sectionsPl[2]);
  
  return {
    title: `${titleUa} — ${city.ua}`,
    title_pl: `${titlePl} — ${city.pl}`,
    city: city.ua,
    city_pl: city.pl,
    slug: slug,
    category: category,
    excerpt: `${descUa} Зарплата: ${salary}`,
    excerpt_pl: `${descPl} Wynagrodzenie: ${salary}`,
    body: `<h3>${titleUa} в місті ${city.ua}</h3><p>${descUa}</p>${mainSectionsUa.join('')}<p>${footer.ua}</p><a href="/apply.html" class="btn btn-primary">Подати заявку</a>`,
    body_pl: `<h3>${titlePl} w mieście ${city.pl}</h3><p>${descPl}</p>${mainSectionsPl.join('')}<p>${footer.pl}</p><a href="/apply.html" class="btn btn-primary">Aplikuj</a>`,
    cta_text: "Подати заявку",
    cta_text_pl: "Aplikuj",
    cta_link: "/apply.html",
    country: "Poland",
    language: "uk",
    salary: salary,
    employment_type: "full-time"
  };
}

// Генеруємо вакансії
const jobs = [];
let index = 1;

Object.keys(jobTemplates).forEach(category => {
  jobTemplates[category].forEach(template => {
    cities.forEach(city => {
      jobs.push(generateJob(category, template, city, index++));
    });
  });
});

// Зберігаємо у файл
fs.writeFileSync(
  path.join(__dirname, 'content.json'),
  JSON.stringify(jobs, null, 2),
  'utf-8'
);

console.log(`✅ Опубліковано ${jobs.length} вакансій`);
