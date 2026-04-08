import fs from 'fs';
import path from 'path';

// Define the realistic sample questions in 4 languages
const realisticQuestions = [
  {
    industry_ua: 'Будівництво',
    industry_pl: 'Budownictwo',
    industry_ru: 'Строительство',
    industry_en: 'Construction',
    question_ua: 'Який мінімальний клас бетону зазвичай використовується для стрічкового фундаменту одноповерхового будинку?',
    question_pl: 'Jaka minimalna klasa betonu jest zwykle używana na fundamenty ławowe parterowego domu?',
    question_ru: 'Какой минимальный класс бетона обычно используется для ленточного фундамента одноэтажного дома?',
    question_en: 'What is the minimum concrete class usually used for a strip foundation of a single-story house?',
    option_a_ua: 'C8/10 (M100)', option_a_pl: 'C8/10 (M100)', option_a_ru: 'C8/10 (M100)', option_a_en: 'C8/10 (M100)',
    option_b_ua: 'C16/20 (M200)', option_b_pl: 'C16/20 (M200)', option_b_ru: 'C16/20 (M200)', option_b_en: 'C16/20 (M200)',
    option_c_ua: 'C25/30 (M350)', option_c_pl: 'C25/30 (M350)', option_c_ru: 'C25/30 (M350)', option_c_en: 'C25/30 (M350)',
    option_d_ua: 'C30/37 (M400)', option_d_pl: 'C30/37 (M400)', option_d_ru: 'C30/37 (M400)', option_d_en: 'C30/37 (M400)',
    correct_option: 'B'
  },
  {
    industry_ua: 'Будівництво', industry_pl: 'Budownictwo', industry_ru: 'Строительство', industry_en: 'Construction',
    question_ua: 'Який інструмент використовується для перевірки вертикальності стін?',
    question_pl: 'Jakie narzędzie służy do sprawdzania pionowości ścian?',
    question_ru: 'Какой инструмент используется для проверки вертикальности стен?',
    question_en: 'What tool is used to check the verticality of walls?',
    option_a_ua: 'Рулетка', option_a_pl: 'Miarka', option_a_ru: 'Рулетка', option_a_en: 'Tape measure',
    option_b_ua: 'Схил (висок) або рівень', option_b_pl: 'Pion lub poziomica', option_b_ru: 'Отвес или уровень', option_b_en: 'Plumb bob or level',
    option_c_ua: 'Кутник', option_c_pl: 'Kątownik', option_c_ru: 'Угольник', option_c_en: 'Square',
    option_d_ua: 'Мікрометр', option_d_pl: 'Mikrometr', option_d_ru: 'Микрометр', option_d_en: 'Micrometer',
    correct_option: 'B'
  },
  {
    industry_ua: 'Логістика і Транспорт', industry_pl: 'Logistyka i Transport', industry_ru: 'Логистика и Транспорт', industry_en: 'Logistics and Transport',
    question_ua: 'Яка максимальна дозволена маса автопоїзда (тягач + напівчепіп) в країнах ЄС (без спеціальних дозволів)?',
    question_pl: 'Jaka jest maksymalna dopuszczalna masa zestawu pojazdów (ciągnik + naczepa) w krajach UE (bez specjalnych zezwoleń)?',
    question_ru: 'Какова максимальная разрешенная масса автопоезда (тягач + полуприцеп) в странах ЕС (без специальных разрешений)?',
    question_en: 'What is the maximum permitted weight of an articulated vehicle (tractor + semi-trailer) in EU countries (without special permits)?',
    option_a_ua: '32 тонни', option_a_pl: '32 tony', option_a_ru: '32 тонны', option_a_en: '32 tonnes',
    option_b_ua: '40 тонн', option_b_pl: '40 ton', option_b_ru: '40 тонн', option_b_en: '40 tonnes',
    option_c_ua: '44 тонни', option_c_pl: '44 tony', option_c_ru: '44 тонны', option_c_en: '44 tonnes',
    option_d_ua: '50 тонн', option_d_pl: '50 ton', option_d_ru: '50 тонн', option_d_en: '50 tonnes',
    correct_option: 'B'
  },
  {
    industry_ua: 'Логістика і Транспорт', industry_pl: 'Logistyka i Transport', industry_ru: 'Логистика и Транспорт', industry_en: 'Logistics and Transport',
    question_ua: 'Що означає абревіатура CMR у міжнародних перевезеннях?',
    question_pl: 'Co oznacza skrót CMR w transporcie międzynarodowym?',
    question_ru: 'Что означает аббревиатура CMR в международных перевозках?',
    question_en: 'What does the abbreviation CMR stand for in international transport?',
    option_a_ua: 'Міжнародна товарно-транспортна накладна', option_a_pl: 'Międzynarodowy list przewozowy', option_a_ru: 'Международная товарно-транспортная накладная', option_a_en: 'International consignment note',
    option_b_ua: 'Митна декларація', option_b_pl: 'Deklaracja celna', option_b_ru: 'Таможенная декларация', option_b_en: 'Customs declaration',
    option_c_ua: 'Сертифікат походження товару', option_c_pl: 'Świadectwo pochodzenia towaru', option_c_ru: 'Сертификат происхождения товара', option_c_en: 'Certificate of origin',
    option_d_ua: 'Страховий поліс', option_d_pl: 'Polisa ubezpieczeniowa', option_d_ru: 'Страховой полис', option_d_en: 'Insurance policy',
    correct_option: 'A'
  },
  {
    industry_ua: 'Медицина і Догляд', industry_pl: 'Medycyna i Opieka', industry_ru: 'Медицина и Уход', industry_en: 'Medicine and Care',
    question_ua: 'Яка нормальна частота дихання у здорової дорослої людини в стані спокою?',
    question_pl: 'Jaka jest normalna częstość oddechów u zdrowego dorosłego człowieka w spoczynku?',
    question_ru: 'Какова нормальная частота дыхания у здорового взрослого человека в состоянии покоя?',
    question_en: 'What is the normal respiratory rate for a healthy adult at rest?',
    option_a_ua: '8-10 вдихів/хв', option_a_pl: '8-10 oddechów/min', option_a_ru: '8-10 вдохов/мин', option_a_en: '8-10 breaths/min',
    option_b_ua: '12-20 вдихів/хв', option_b_pl: '12-20 oddechów/min', option_b_ru: '12-20 вдохов/мин', option_b_en: '12-20 breaths/min',
    option_c_ua: '22-30 вдихів/хв', option_c_pl: '22-30 oddechów/min', option_c_ru: '22-30 вдохов/мин', option_c_en: '22-30 breaths/min',
    option_d_ua: '35-40 вдихів/хв', option_d_pl: '35-40 oddechów/min', option_d_ru: '35-40 вдохов/мин', option_d_en: '35-40 breaths/min',
    correct_option: 'B'
  },
  {
    industry_ua: 'IT і Програмування', industry_pl: 'IT i Programowanie', industry_ru: 'IT и Программирование', industry_en: 'IT and Programming',
    question_ua: 'Що таке "замикання" (closure) в JavaScript?',
    question_pl: 'Czym jest "domknięcie" (closure) w JavaScript?',
    question_ru: 'Что такое "замыкание" (closure) в JavaScript?',
    question_en: 'What is a "closure" in JavaScript?',
    option_a_ua: 'Блок коду всередині циклу', option_a_pl: 'Blok kodu wewnątrz pętli', option_a_ru: 'Блок кода внутри цикла', option_a_en: 'A block of code inside a loop',
    option_b_ua: 'Функція, яка має доступ до змінних зі своєї лексичної області видимості, навіть після того, як зовнішня функція завершила виконання', option_b_pl: 'Funkcja, która ma dostęp do zmiennych ze swojego zakresu leksykalnego, nawet po zakończeniu wykonywania funkcji zewnętrznej', option_b_ru: 'Функция, имеющая доступ к переменным из своей лексической области видимости, даже после того как внешняя функция завершила выполнение', option_b_en: 'A function having access to the parent scope, even after the parent function has closed',
    option_c_ua: 'Метод закриття з\'єднання з базою даних', option_c_pl: 'Metoda zamykania połączenia z bazą danych', option_c_ru: 'Метод закрытия соединения с базой данных', option_c_en: 'A method for closing a database connection',
    option_d_ua: 'Процес мініфікації коду', option_d_pl: 'Proces minifikacji kodu', option_d_ru: 'Процесс минификации кода', option_d_en: 'The process of code minification',
    correct_option: 'B'
  },
  {
    industry_ua: 'Сільське господарство', industry_pl: 'Rolnictwo', industry_ru: 'Сельское хозяйство', industry_en: 'Agriculture',
    question_ua: 'Який макроелемент є критично важливим для розвитку кореневої системи рослин?',
    question_pl: 'Który makroelement ma krytyczne znaczenie dla rozwoju systemu korzeniowego roślin?',
    question_ru: 'Какой макроэлемент критически важен для развития корневой системы растений?',
    question_en: 'Which macronutrient is critical for the development of the plant root system?',
    option_a_ua: 'Азот (N)', option_a_pl: 'Azot (N)', option_a_ru: 'Азот (N)', option_a_en: 'Nitrogen (N)',
    option_b_ua: 'Калій (K)', option_b_pl: 'Potas (K)', option_b_ru: 'Калий (K)', option_b_en: 'Potassium (K)',
    option_c_ua: 'Фосфор (P)', option_c_pl: 'Fosfor (P)', option_c_ru: 'Фосфор (P)', option_c_en: 'Phosphorus (P)',
    option_d_ua: 'Кальцій (Ca)', option_d_pl: 'Wapń (Ca)', option_d_ru: 'Кальций (Ca)', option_d_en: 'Calcium (Ca)',
    correct_option: 'C'
  },
  {
    industry_ua: 'Сфера обслуговування (HoReCa)', industry_pl: 'Gastronomia (HoReCa)', industry_ru: 'Сфера обслуживания (HoReCa)', industry_en: 'Hospitality (HoReCa)',
    question_ua: 'Яка оптимальна температура подачі класичного еспресо?',
    question_pl: 'Jaka jest optymalna temperatura serwowania klasycznego espresso?',
    question_ru: 'Какова оптимальная температура подачи классического эспрессо?',
    question_en: 'What is the optimal serving temperature for a classic espresso?',
    option_a_ua: '70-75°C', option_a_pl: '70-75°C', option_a_ru: '70-75°C', option_a_en: '70-75°C',
    option_b_ua: '88-92°C', option_b_pl: '88-92°C', option_b_ru: '88-92°C', option_b_en: '88-92°C',
    option_c_ua: '95-100°C', option_c_pl: '95-100°C', option_c_ru: '95-100°C', option_c_en: '95-100°C',
    option_d_ua: '60-65°C', option_d_pl: '60-65°C', option_d_ru: '60-65°C', option_d_en: '60-65°C',
    correct_option: 'B'
  },
  {
    industry_ua: 'Фінанси та Банківська справа', industry_pl: 'Finanse i Bankowość', industry_ru: 'Финансы и Банковское дело', industry_en: 'Finance and Banking',
    question_ua: 'Що таке диверсифікація портфеля?',
    question_pl: 'Czym jest dywersyfikacja portfela?',
    question_ru: 'Что такое диверсификация портфеля?',
    question_en: 'What is portfolio diversification?',
    option_a_ua: 'Вкладення всіх коштів в одну компанію', option_a_pl: 'Inwestowanie wszystkich środków w jedną firmę', option_a_ru: 'Вложение всех средств в одну компанию', option_a_en: 'Investing all funds in one company',
    option_b_ua: 'Розподіл інвестицій між різними активами', option_b_pl: 'Rozkład inwestycji między różne aktywa', option_b_ru: 'Распределение инвестиций между различными активами', option_b_en: 'Spreading investments across various assets',
    option_c_ua: 'Відмова від інвестування', option_c_pl: 'Rezygnacja z inwestowania', option_c_ru: 'Отказ от инвестирования', option_c_en: 'Refusing to invest',
    option_d_ua: 'Зберігання грошей готівкою', option_d_pl: 'Przechowywanie pieniędzy w gotówce', option_d_ru: 'Хранение денег наличными', option_d_en: 'Keeping money in cash',
    correct_option: 'B'
  },
  {
    industry_ua: 'Дизайн та Мистецтво', industry_pl: 'Projektowanie i Sztuka', industry_ru: 'Дизайн и Искусство', industry_en: 'Design and Art',
    question_ua: 'Який колір отримують при змішуванні синього та жовтого?',
    question_pl: 'Jaki kolor powstaje po zmieszaniu niebieskiego i żółtego?',
    question_ru: 'Какой цвет получается при смешивании синего и желтого?',
    question_en: 'What color is produced by mixing blue and yellow?',
    option_a_ua: 'Зелений', option_a_pl: 'Zielony', option_a_ru: 'Зеленый', option_a_en: 'Green',
    option_b_ua: 'Фіолетовий', option_b_pl: 'Fioletowy', option_b_ru: 'Фиолетовый', option_b_en: 'Purple',
    option_c_ua: 'Помаранчевий', option_c_pl: 'Pomarańczowy', option_c_ru: 'Оранжевый', option_c_en: 'Orange',
    option_d_ua: 'Коричневий', option_d_pl: 'Brązowy', option_d_ru: 'Коричневый', option_d_en: 'Brown',
    correct_option: 'A'
  },
  {
    industry_ua: 'Енергетика', industry_pl: 'Energetyka', industry_ru: 'Энергетика', industry_en: 'Energy',
    question_ua: 'Що з наведеного є відновлюваним джерелом енергії?',
    question_pl: 'Które z poniższych jest odnawialnym źródłem energii?',
    question_ru: 'Что из перечисленного является возобновляемым источником энергии?',
    question_en: 'Which of the following is a renewable energy source?',
    option_a_ua: 'Вугілля', option_a_pl: 'Węgiel', option_a_ru: 'Уголь', option_a_en: 'Coal',
    option_b_ua: 'Природний газ', option_b_pl: 'Gaz ziemny', option_b_ru: 'Природный газ', option_b_en: 'Natural gas',
    option_c_ua: 'Сонячна енергія', option_c_pl: 'Energia słoneczna', option_c_ru: 'Солнечная энергия', option_c_en: 'Solar energy',
    option_d_ua: 'Нафта', option_d_pl: 'Ropa naftowa', option_d_ru: 'Нефть', option_d_en: 'Oil',
    correct_option: 'C'
  },
  {
    industry_ua: 'Маркетинг та PR', industry_pl: 'Marketing i PR', industry_ru: 'Маркетинг и PR', industry_en: 'Marketing and PR',
    question_ua: 'Що означає абревіатура SEO?',
    question_pl: 'Co oznacza skrót SEO?',
    question_ru: 'Что означает аббревиатура SEO?',
    question_en: 'What does the acronym SEO stand for?',
    option_a_ua: 'Search Engine Optimization', option_a_pl: 'Search Engine Optimization', option_a_ru: 'Search Engine Optimization', option_a_en: 'Search Engine Optimization',
    option_b_ua: 'Social Engagement Operation', option_b_pl: 'Social Engagement Operation', option_b_ru: 'Social Engagement Operation', option_b_en: 'Social Engagement Operation',
    option_c_ua: 'Sales Evaluation Objective', option_c_pl: 'Sales Evaluation Objective', option_c_ru: 'Sales Evaluation Objective', option_c_en: 'Sales Evaluation Objective',
    option_d_ua: 'System Error Output', option_d_pl: 'System Error Output', option_d_ru: 'System Error Output', option_d_en: 'System Error Output',
    correct_option: 'A'
  }
];

// Industries in 4 languages
const industriesList = [
  { ua: 'Будівництво', pl: 'Budownictwo', ru: 'Строительство', en: 'Construction' },
  { ua: 'Логістика і Транспорт', pl: 'Logistyka i Transport', ru: 'Логистика и Транспорт', en: 'Logistics and Transport' },
  { ua: 'Медицина і Догляд', pl: 'Medycyna i Opieka', ru: 'Медицина и Уход', en: 'Medicine and Care' },
  { ua: 'IT і Програмування', pl: 'IT i Programowanie', ru: 'IT и Программирование', en: 'IT and Programming' },
  { ua: 'Сільське господарство', pl: 'Rolnictwo', ru: 'Сельское хозяйство', en: 'Agriculture' },
  { ua: 'Сфера обслуговування (HoReCa)', pl: 'Gastronomia (HoReCa)', ru: 'Сфера обслуживания (HoReCa)', en: 'Hospitality (HoReCa)' },
  { ua: 'Виробництво і Промисловість', pl: 'Produkcja i Przemysł', ru: 'Производство и Промышленность', en: 'Manufacturing and Industry' },
  { ua: 'Торгівля', pl: 'Handel', ru: 'Торговля', en: 'Trade' },
  { ua: 'Освіта', pl: 'Edukacja', ru: 'Образование', en: 'Education' },
  { ua: 'Фінанси та Банківська справа', pl: 'Finanse i Bankowość', ru: 'Финансы и Банковское дело', en: 'Finance and Banking' },
  { ua: 'Дизайн та Мистецтво', pl: 'Projektowanie i Sztuka', ru: 'Дизайн и Искусство', en: 'Design and Art' },
  { ua: 'Енергетика', pl: 'Energetyka', ru: 'Энергетика', en: 'Energy' },
  { ua: 'Маркетинг та PR', pl: 'Marketing i PR', ru: 'Маркетинг и PR', en: 'Marketing and PR' }
];

const questionTemplates = [
  {
    ua: { text: "Який основний принцип роботи системи {PARAM1} у галузі?", options: ["Використання {PARAM2}", "Застосування {PARAM3}", "Інтеграція {PARAM4}", "Оптимізація {PARAM5}"] },
    pl: { text: "Jaka jest główna zasada działania systemu {PARAM1} w branży?", options: ["Wykorzystanie {PARAM2}", "Zastosowanie {PARAM3}", "Integracja {PARAM4}", "Optymalizacja {PARAM5}"] },
    ru: { text: "Каков основной принцип работы системы {PARAM1} в отрасли?", options: ["Использование {PARAM2}", "Применение {PARAM3}", "Интеграция {PARAM4}", "Оптимизация {PARAM5}"] },
    en: { text: "What is the main operating principle of the {PARAM1} system in the industry?", options: ["Utilization of {PARAM2}", "Application of {PARAM3}", "Integration of {PARAM4}", "Optimization of {PARAM5}"] }
  },
  {
    ua: { text: "Що означає термін '{PARAM1}' в професійній термінології?", options: ["Процес {PARAM2}", "Стандарт {PARAM3}", "Метод {PARAM4}", "Інструмент {PARAM5}"] },
    pl: { text: "Co oznacza termin '{PARAM1}' w terminologii zawodowej?", options: ["Proces {PARAM2}", "Standard {PARAM3}", "Metoda {PARAM4}", "Narzędzie {PARAM5}"] },
    ru: { text: "Что означает термин '{PARAM1}' в профессиональной терминологии?", options: ["Процесс {PARAM2}", "Стандарт {PARAM3}", "Метод {PARAM4}", "Инструмент {PARAM5}"] },
    en: { text: "What does the term '{PARAM1}' mean in professional terminology?", options: ["Process of {PARAM2}", "Standard of {PARAM3}", "Method of {PARAM4}", "Tool for {PARAM5}"] }
  },
  {
    ua: { text: "Який інструмент є найефективнішим для {PARAM1}?", options: ["Модуль {PARAM2}", "Система {PARAM3}", "Апарат {PARAM4}", "Комплекс {PARAM5}"] },
    pl: { text: "Jakie narzędzie jest najskuteczniejsze dla {PARAM1}?", options: ["Moduł {PARAM2}", "System {PARAM3}", "Aparat {PARAM4}", "Kompleks {PARAM5}"] },
    ru: { text: "Какой инструмент наиболее эффективен для {PARAM1}?", options: ["Модуль {PARAM2}", "Система {PARAM3}", "Аппарат {PARAM4}", "Комплекс {PARAM5}"] },
    en: { text: "Which tool is the most effective for {PARAM1}?", options: ["Module of {PARAM2}", "System for {PARAM3}", "Apparatus for {PARAM4}", "Complex of {PARAM5}"] }
  },
  {
    ua: { text: "Яка головна мета етапу '{PARAM1}' у стандартному циклі?", options: ["Підвищення {PARAM2}", "Зниження {PARAM3}", "Контроль {PARAM4}", "Аналіз {PARAM5}"] },
    pl: { text: "Jaki jest główny cel etapu '{PARAM1}' w standardowym cyklu?", options: ["Zwiększenie {PARAM2}", "Zmniejszenie {PARAM3}", "Kontrola {PARAM4}", "Analiza {PARAM5}"] },
    ru: { text: "Какова главная цель этапа '{PARAM1}' в стандартном цикле?", options: ["Повышение {PARAM2}", "Снижение {PARAM3}", "Контроль {PARAM4}", "Анализ {PARAM5}"] },
    en: { text: "What is the main goal of the '{PARAM1}' stage in the standard cycle?", options: ["Increasing {PARAM2}", "Decreasing {PARAM3}", "Control over {PARAM4}", "Analysis of {PARAM5}"] }
  },
  {
    ua: { text: "Відповідно до нормативів, як часто потрібно перевіряти {PARAM1}?", options: ["Щодня при {PARAM2}", "Щотижня для {PARAM3}", "Щомісяця під час {PARAM4}", "Щорічно згідно з {PARAM5}"] },
    pl: { text: "Zgodnie z przepisami, jak często należy sprawdzać {PARAM1}?", options: ["Codziennie przy {PARAM2}", "Co tydzień dla {PARAM3}", "Co miesiąc podczas {PARAM4}", "Co roku zgodnie z {PARAM5}"] },
    ru: { text: "В соответствии с нормативами, как часто нужно проверять {PARAM1}?", options: ["Ежедневно при {PARAM2}", "Еженедельно для {PARAM3}", "Ежемесячно во время {PARAM4}", "Ежегодно согласно {PARAM5}"] },
    en: { text: "According to regulations, how often should {PARAM1} be checked?", options: ["Daily upon {PARAM2}", "Weekly for {PARAM3}", "Monthly during {PARAM4}", "Annually according to {PARAM5}"] }
  }
];

// Word pools to generate parameters in 4 languages
const words1 = [
  { ua: "безпеки", pl: "bezpieczeństwa", ru: "безопасности", en: "security" },
  { ua: "контролю", pl: "kontroli", ru: "контроля", en: "control" },
  { ua: "аналітики", pl: "analityki", ru: "аналитики", en: "analytics" },
  { ua: "моніторингу", pl: "monitoringu", ru: "мониторинга", en: "monitoring" },
  { ua: "логістики", pl: "logistyki", ru: "логистики", en: "logistics" },
  { ua: "виробництва", pl: "produkcji", ru: "производства", en: "production" },
  { ua: "обліку", pl: "rachunkowości", ru: "учета", en: "accounting" },
  { ua: "маркетингу", pl: "marketingu", ru: "маркетинга", en: "marketing" }
];

const words2 = [
  { ua: "даних", pl: "danych", ru: "данных", en: "data" },
  { ua: "ресурсів", pl: "zasobów", ru: "ресурсов", en: "resources" },
  { ua: "процесів", pl: "procesów", ru: "процессов", en: "processes" },
  { ua: "персоналу", pl: "personelu", ru: "персонала", en: "personnel" },
  { ua: "матеріалів", pl: "materiałów", ru: "материалов", en: "materials" },
  { ua: "клієнтів", pl: "klientów", ru: "клиентов", en: "clients" },
  { ua: "обладнання", pl: "sprzętu", ru: "оборудования", en: "equipment" },
  { ua: "якості", pl: "jakości", ru: "качества", en: "quality" }
];

const words3 = [
  { ua: "ефективності", pl: "efektywności", ru: "эффективности", en: "efficiency" },
  { ua: "швидкості", pl: "szybkości", ru: "скорости", en: "speed" },
  { ua: "точності", pl: "dokładności", ru: "точности", en: "accuracy" },
  { ua: "надійності", pl: "niezawodności", ru: "надежности", en: "reliability" },
  { ua: "стабільності", pl: "stabilności", ru: "стабильности", en: "stability" },
  { ua: "гнучкості", pl: "elastyczności", ru: "гибкости", en: "flexibility" },
  { ua: "безпеки", pl: "bezpieczeństwa", ru: "безопасности", en: "safety" }
];

function generateRandomParamIndices() {
  const i1 = Math.floor(Math.random() * words1.length);
  const i2 = Math.floor(Math.random() * words2.length);
  const i3 = Math.floor(Math.random() * words3.length);
  return { i1, i2, i3 };
}

function getParam(lang, indices) {
  const w1 = words1[indices.i1][lang];
  const w2 = words2[indices.i2][lang];
  const w3 = words3[indices.i3][lang];

  if (lang === 'en') {
    return `${w1} ${w2} and ${w3}`;
  } else if (lang === 'pl') {
    return `${w1} ${w2} i ${w3}`;
  } else if (lang === 'ru') {
    return `${w1} ${w2} и ${w3}`;
  }
  return `${w1} ${w2} та ${w3}`;
}

const allQuestions = [...realisticQuestions];
const totalQuestionsNeeded = 12000;
const optionsArray = ['A', 'B', 'C', 'D'];

let parameterCount = 0;

for (let i = allQuestions.length; i < totalQuestionsNeeded; i++) {
  const industryObj = industriesList[i % industriesList.length];
  const templateObj = questionTemplates[i % questionTemplates.length];

  const indices1 = generateRandomParamIndices();
  const indices2 = generateRandomParamIndices();
  const indices3 = generateRandomParamIndices();
  const indices4 = generateRandomParamIndices();
  const indices5 = generateRandomParamIndices();
  parameterCount += 5;

  const correctOptionIndex = Math.floor(Math.random() * 4);
  const correctOptionLetter = optionsArray[correctOptionIndex];

  const q = {
    industry_ua: industryObj.ua, industry_pl: industryObj.pl, industry_ru: industryObj.ru, industry_en: industryObj.en,
    correct_option: correctOptionLetter
  };

  const langs = ['ua', 'pl', 'ru', 'en'];
  for (const lang of langs) {
    const p1 = getParam(lang, indices1);
    const p2 = getParam(lang, indices2);
    const p3 = getParam(lang, indices3);
    const p4 = getParam(lang, indices4);
    const p5 = getParam(lang, indices5);

    const questionText = templateObj[lang].text.replace('{PARAM1}', p1);
    let opts = [
      templateObj[lang].options[0].replace('{PARAM2}', p2),
      templateObj[lang].options[1].replace('{PARAM3}', p3),
      templateObj[lang].options[2].replace('{PARAM4}', p4),
      templateObj[lang].options[3].replace('{PARAM5}', p5)
    ];

    q[`question_${lang}`] = questionText;
    q[`option_a_${lang}`] = opts[0];
    q[`option_b_${lang}`] = opts[1];
    q[`option_c_${lang}`] = opts[2];
    q[`option_d_${lang}`] = opts[3];
  }

  allQuestions.push(q);
}

const outputPath = path.join(process.cwd(), 'src', 'quiz-data.json');
fs.writeFileSync(outputPath, JSON.stringify(allQuestions, null, 2), 'utf8');

console.log(`✅ Generated ${allQuestions.length} test questions.`);
console.log(`✅ Generated ${parameterCount} parameters within the questions.`);
console.log(`✅ Output saved to ${outputPath}`);
