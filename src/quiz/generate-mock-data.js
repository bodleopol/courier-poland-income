import fs from 'fs';
import path from 'path';

// Define the realistic sample questions in 4 languages
const realisticQuestions = [
  {
    industry_ua: 'Будівництво', industry_en: 'Construction', industry_pl: 'Budownictwo', industry_ru: 'Строительство',
    question_ua: 'Який мінімальний клас бетону зазвичай використовується для стрічкового фундаменту одноповерхового будинку?', question_en: 'What is the minimum concrete class typically used for a strip foundation of a single-story house?', question_pl: 'Jaka jest minimalna klasa betonu zwykle używana na ławę fundamentową domu jednorodzinnego?', question_ru: 'Какой минимальный класс бетона обычно используется для ленточного фундамента одноэтажного дома?',
    option_a_ua: 'C8/10 (M100)', option_a_en: 'C8/10 (M100)', option_a_pl: 'C8/10 (M100)', option_a_ru: 'C8/10 (M100)',
    option_b_ua: 'C16/20 (M200)', option_b_en: 'C16/20 (M200)', option_b_pl: 'C16/20 (M200)', option_b_ru: 'C16/20 (M200)',
    option_c_ua: 'C25/30 (M350)', option_c_en: 'C25/30 (M350)', option_c_pl: 'C25/30 (M350)', option_c_ru: 'C25/30 (M350)',
    option_d_ua: 'C30/37 (M400)', option_d_en: 'C30/37 (M400)', option_d_pl: 'C30/37 (M400)', option_d_ru: 'C30/37 (M400)',
    correct_option: 'B'
  },
  {
    industry_ua: 'Будівництво', industry_en: 'Construction', industry_pl: 'Budownictwo', industry_ru: 'Строительство',
    question_ua: 'Який інструмент використовується для перевірки вертикальності стін?', question_en: 'Which tool is used to check the verticality of walls?', question_pl: 'Jakiego narzędzia używa się do sprawdzania pionowości ścian?', question_ru: 'Какой инструмент используется для проверки вертикальности стен?',
    option_a_ua: 'Рулетка', option_a_en: 'Tape measure', option_a_pl: 'Taśma miernicza', option_a_ru: 'Рулетка',
    option_b_ua: 'Схил (висок) або рівень', option_b_en: 'Plumb bob or level', option_b_pl: 'Pion lub poziomica', option_b_ru: 'Отвес или уровень',
    option_c_ua: 'Кутник', option_c_en: 'Square', option_c_pl: 'Kątownik', option_c_ru: 'Угольник',
    option_d_ua: 'Мікрометр', option_d_en: 'Micrometer', option_d_pl: 'Mikrometr', option_d_ru: 'Микрометр',
    correct_option: 'B'
  },
  {
    industry_ua: 'Логістика і Транспорт', industry_en: 'Logistics and Transport', industry_pl: 'Logistyka i Transport', industry_ru: 'Логистика и Транспорт',
    question_ua: 'Яка максимальна дозволена маса автопоїзда (тягач + напівчепіп) в країнах ЄС (без спеціальних дозволів)?', question_en: 'What is the maximum allowed weight of an articulated vehicle (tractor + semi-trailer) in EU countries (without special permits)?', question_pl: 'Jaka jest maksymalna dopuszczalna masa zespołu pojazdów (ciągnik + naczepa) w krajach UE (bez specjalnych zezwoleń)?', question_ru: 'Какова максимальная разрешенная масса автопоезда (тягач + полуприцеп) в странах ЕС (без специальных разрешений)?',
    option_a_ua: '32 тонни', option_a_en: '32 tons', option_a_pl: '32 tony', option_a_ru: '32 тонны',
    option_b_ua: '40 тонн', option_b_en: '40 tons', option_b_pl: '40 ton', option_b_ru: '40 тонн',
    option_c_ua: '44 тонни', option_c_en: '44 tons', option_c_pl: '44 tony', option_c_ru: '44 тонны',
    option_d_ua: '50 тонн', option_d_en: '50 tons', option_d_pl: '50 ton', option_d_ru: '50 тонн',
    correct_option: 'B'
  },
  {
    industry_ua: 'Логістика і Транспорт', industry_en: 'Logistics and Transport', industry_pl: 'Logistyka i Transport', industry_ru: 'Логистика и Транспорт',
    question_ua: 'Що означає абревіатура CMR у міжнародних перевезеннях?', question_en: 'What does the abbreviation CMR stand for in international transport?', question_pl: 'Co oznacza skrót CMR w transporcie międzynarodowym?', question_ru: 'Что означает аббревиатура CMR в международных перевозках?',
    option_a_ua: 'Міжнародна товарно-транспортна накладна', option_a_en: 'International consignment note', option_a_pl: 'Międzynarodowy list przewozowy', option_a_ru: 'Международная товарно-транспортная накладная',
    option_b_ua: 'Митна декларація', option_b_en: 'Customs declaration', option_b_pl: 'Deklaracja celna', option_b_ru: 'Таможенная декларация',
    option_c_ua: 'Сертифікат походження товару', option_c_en: 'Certificate of origin', option_c_pl: 'Świadectwo pochodzenia towaru', option_c_ru: 'Сертификат происхождения товара',
    option_d_ua: 'Страховий поліс', option_d_en: 'Insurance policy', option_d_pl: 'Polisa ubezpieczeniowa', option_d_ru: 'Страховой полис',
    correct_option: 'A'
  },
  {
    industry_ua: 'Медицина і Догляд', industry_en: 'Medicine and Care', industry_pl: 'Medycyna i Opieka', industry_ru: 'Медицина и Уход',
    question_ua: 'Яка нормальна частота дихання у здорової дорослої людини в стані спокою?', question_en: 'What is the normal respiratory rate for a healthy adult at rest?', question_pl: 'Jaka jest prawidłowa częstość oddechów u zdrowego dorosłego człowieka w spoczynku?', question_ru: 'Какова нормальная частота дыхания у здорового взрослого человека в состоянии покоя?',
    option_a_ua: '8-10 вдихів/хв', option_a_en: '8-10 breaths/min', option_a_pl: '8-10 oddechów/min', option_a_ru: '8-10 вдохов/мин',
    option_b_ua: '12-20 вдихів/хв', option_b_en: '12-20 breaths/min', option_b_pl: '12-20 oddechów/min', option_b_ru: '12-20 вдохов/мин',
    option_c_ua: '22-30 вдихів/хв', option_c_en: '22-30 breaths/min', option_c_pl: '22-30 oddechów/min', option_c_ru: '22-30 вдохов/мин',
    option_d_ua: '35-40 вдихів/хв', option_d_en: '35-40 breaths/min', option_d_pl: '35-40 oddechów/min', option_d_ru: '35-40 вдохов/мин',
    correct_option: 'B'
  },
  {
    industry_ua: 'IT і Програмування', industry_en: 'IT and Programming', industry_pl: 'IT i Programowanie', industry_ru: 'IT и Программирование',
    question_ua: 'Що таке "замикання" (closure) в JavaScript?', question_en: 'What is a "closure" in JavaScript?', question_pl: 'Czym jest "domknięcie" (closure) w JavaScript?', question_ru: 'Что такое "замыкание" (closure) в JavaScript?',
    option_a_ua: 'Блок коду всередині циклу', option_a_en: 'A block of code inside a loop', option_a_pl: 'Blok kodu wewnątrz pętli', option_a_ru: 'Блок кода внутри цикла',
    option_b_ua: 'Функція, яка має доступ до змінних зі своєї лексичної області видимості, навіть після того, як зовнішня функція завершила виконання', option_b_en: 'A function that has access to variables from its lexical scope even after the outer function has finished executing', option_b_pl: 'Funkcja, która ma dostęp do zmiennych ze swojego zakresu leksykalnego nawet po zakończeniu wykonywania funkcji zewnętrznej', option_b_ru: 'Функция, которая имеет доступ к переменным из своей лексической области видимости даже после завершения выполнения внешней функции',
    option_c_ua: 'Метод закриття з\'єднання з базою даних', option_c_en: 'A method for closing a database connection', option_c_pl: 'Metoda zamykania połączenia z bazą danych', option_c_ru: 'Метод закрытия соединения с базой данных',
    option_d_ua: 'Процес мініфікації коду', option_d_en: 'The process of code minification', option_d_pl: 'Proces minifikacji kodu', option_d_ru: 'Процесс минификации кода',
    correct_option: 'B'
  },
  {
    industry_ua: 'Сільське господарство', industry_en: 'Agriculture', industry_pl: 'Rolnictwo', industry_ru: 'Сельское хозяйство',
    question_ua: 'Який макроелемент є критично важливим для розвитку кореневої системи рослин?', question_en: 'Which macronutrient is critically important for the development of the plant root system?', question_pl: 'Który makroelement jest krytycznie ważny dla rozwoju systemu korzeniowego roślin?', question_ru: 'Какой макроэлемент критически важен для развития корневой системы растений?',
    option_a_ua: 'Азот (N)', option_a_en: 'Nitrogen (N)', option_a_pl: 'Azot (N)', option_a_ru: 'Азот (N)',
    option_b_ua: 'Калій (K)', option_b_en: 'Potassium (K)', option_b_pl: 'Potas (K)', option_b_ru: 'Калий (K)',
    option_c_ua: 'Фосфор (P)', option_c_en: 'Phosphorus (P)', option_c_pl: 'Fosfor (P)', option_c_ru: 'Фосфор (P)',
    option_d_ua: 'Кальцій (Ca)', option_d_en: 'Calcium (Ca)', option_d_pl: 'Wapń (Ca)', option_d_ru: 'Кальций (Ca)',
    correct_option: 'C'
  },
  {
    industry_ua: 'Сфера обслуговування (HoReCa)', industry_en: 'Service Sector (HoReCa)', industry_pl: 'Sektor Usług (HoReCa)', industry_ru: 'Сфера обслуживания (HoReCa)',
    question_ua: 'Яка оптимальна температура подачі класичного еспресо?', question_en: 'What is the optimal serving temperature for a classic espresso?', question_pl: 'Jaka jest optymalna temperatura serwowania klasycznego espresso?', question_ru: 'Какова оптимальная температура подачи классического эспрессо?',
    option_a_ua: '70-75°C', option_a_en: '70-75°C', option_a_pl: '70-75°C', option_a_ru: '70-75°C',
    option_b_ua: '88-92°C', option_b_en: '88-92°C', option_b_pl: '88-92°C', option_b_ru: '88-92°C',
    option_c_ua: '95-100°C', option_c_en: '95-100°C', option_c_pl: '95-100°C', option_c_ru: '95-100°C',
    option_d_ua: '60-65°C', option_d_en: '60-65°C', option_d_pl: '60-65°C', option_d_ru: '60-65°C',
    correct_option: 'B'
  }
];

// Industries and templates for programmatic generation
const industries = [
  { ua: 'Будівництво', en: 'Construction', pl: 'Budownictwo', ru: 'Строительство' },
  { ua: 'Логістика і Транспорт', en: 'Logistics and Transport', pl: 'Logistyka i Transport', ru: 'Логистика и Транспорт' },
  { ua: 'Медицина і Догляд', en: 'Medicine and Care', pl: 'Medycyna i Opieka', ru: 'Медицина и Уход' },
  { ua: 'IT і Програмування', en: 'IT and Programming', pl: 'IT i Programowanie', ru: 'IT и Программирование' },
  { ua: 'Сільське господарство', en: 'Agriculture', pl: 'Rolnictwo', ru: 'Сельское хозяйство' },
  { ua: 'Сфера обслуговування (HoReCa)', en: 'Service Sector (HoReCa)', pl: 'Sektor Usług (HoReCa)', ru: 'Сфера обслуживания (HoReCa)' },
  { ua: 'Виробництво і Промисловість', en: 'Manufacturing and Industry', pl: 'Produkcja i Przemysł', ru: 'Производство и Промышленность' },
  { ua: 'Торгівля', en: 'Trade', pl: 'Handel', ru: 'Торговля' },
  { ua: 'Освіта', en: 'Education', pl: 'Edukacja', ru: 'Образование' },
  { ua: 'Фінанси і Банківська справа', en: 'Finance and Banking', pl: 'Finanse i Bankowość', ru: 'Финансы и Банковское дело' },
  { ua: 'Маркетинг і Реклама', en: 'Marketing and Advertising', pl: 'Marketing i Reklama', ru: 'Маркетинг и Реклама' },
  { ua: 'Дизайн', en: 'Design', pl: 'Design', ru: 'Дизайн' },
  { ua: 'Енергетика', en: 'Energy', pl: 'Energetyka', ru: 'Энергетика' },
  { ua: 'Туризм', en: 'Tourism', pl: 'Turystyka', ru: 'Туризм' }
];

const templates = [
  {
    ua: { text: "Який основний принцип роботи системи {PARAM1} у галузі?", options: ["Використання {PARAM2}", "Застосування {PARAM3}", "Інтеграція {PARAM4}", "Оптимізація {PARAM5}"] },
    en: { text: "What is the main operating principle of the {PARAM1} system in the industry?", options: ["Use of {PARAM2}", "Application of {PARAM3}", "Integration of {PARAM4}", "Optimization of {PARAM5}"] },
    pl: { text: "Jaka jest główna zasada działania systemu {PARAM1} w branży?", options: ["Wykorzystanie {PARAM2}", "Zastosowanie {PARAM3}", "Integracja {PARAM4}", "Optymalizacja {PARAM5}"] },
    ru: { text: "Каков основной принцип работы системы {PARAM1} в отрасли?", options: ["Использование {PARAM2}", "Применение {PARAM3}", "Интеграция {PARAM4}", "Оптимизация {PARAM5}"] }
  },
  {
    ua: { text: "Що означає термін '{PARAM1}' в професійній термінології?", options: ["Процес {PARAM2}", "Стандарт {PARAM3}", "Метод {PARAM4}", "Інструмент {PARAM5}"] },
    en: { text: "What does the term '{PARAM1}' mean in professional terminology?", options: ["Process of {PARAM2}", "Standard of {PARAM3}", "Method of {PARAM4}", "Tool for {PARAM5}"] },
    pl: { text: "Co oznacza termin '{PARAM1}' w profesjonalnej terminologii?", options: ["Proces {PARAM2}", "Standard {PARAM3}", "Metoda {PARAM4}", "Narzędzie {PARAM5}"] },
    ru: { text: "Что означает термин '{PARAM1}' в профессиональной терминологии?", options: ["Процесс {PARAM2}", "Стандарт {PARAM3}", "Метод {PARAM4}", "Инструмент {PARAM5}"] }
  },
  {
    ua: { text: "Який інструмент є найефективнішим для {PARAM1}?", options: ["Модуль {PARAM2}", "Система {PARAM3}", "Апарат {PARAM4}", "Комплекс {PARAM5}"] },
    en: { text: "Which tool is the most effective for {PARAM1}?", options: ["Module of {PARAM2}", "System of {PARAM3}", "Apparatus for {PARAM4}", "Complex of {PARAM5}"] },
    pl: { text: "Jakie narzędzie jest najbardziej efektywne dla {PARAM1}?", options: ["Moduł {PARAM2}", "System {PARAM3}", "Aparat {PARAM4}", "Kompleks {PARAM5}"] },
    ru: { text: "Какой инструмент наиболее эффективен для {PARAM1}?", options: ["Модуль {PARAM2}", "Система {PARAM3}", "Аппарат {PARAM4}", "Комплекс {PARAM5}"] }
  },
  {
    ua: { text: "Яка головна мета етапу '{PARAM1}' у стандартному циклі?", options: ["Підвищення {PARAM2}", "Зниження {PARAM3}", "Контроль {PARAM4}", "Аналіз {PARAM5}"] },
    en: { text: "What is the main goal of the '{PARAM1}' stage in a standard cycle?", options: ["Increasing {PARAM2}", "Reducing {PARAM3}", "Controlling {PARAM4}", "Analyzing {PARAM5}"] },
    pl: { text: "Jaki jest główny cel etapu '{PARAM1}' w standardowym cyklu?", options: ["Zwiększenie {PARAM2}", "Zmniejszenie {PARAM3}", "Kontrola {PARAM4}", "Analiza {PARAM5}"] },
    ru: { text: "Какова главная цель этапа '{PARAM1}' в стандартном цикле?", options: ["Повышение {PARAM2}", "Снижение {PARAM3}", "Контроль {PARAM4}", "Анализ {PARAM5}"] }
  },
  {
    ua: { text: "Відповідно до нормативів, як часто потрібно перевіряти {PARAM1}?", options: ["Щодня при {PARAM2}", "Щотижня для {PARAM3}", "Щомісяця під час {PARAM4}", "Щорічно згідно з {PARAM5}"] },
    en: { text: "According to regulations, how often should {PARAM1} be checked?", options: ["Daily during {PARAM2}", "Weekly for {PARAM3}", "Monthly while {PARAM4}", "Annually according to {PARAM5}"] },
    pl: { text: "Zgodnie z przepisami, jak często należy sprawdzać {PARAM1}?", options: ["Codziennie przy {PARAM2}", "Co tydzień dla {PARAM3}", "Co miesiąc podczas {PARAM4}", "Corocznie zgodnie z {PARAM5}"] },
    ru: { text: "Согласно нормативам, как часто нужно проверять {PARAM1}?", options: ["Ежедневно при {PARAM2}", "Еженедельно для {PARAM3}", "Ежемесячно во время {PARAM4}", "Ежегодно согласно {PARAM5}"] }
  }
];

const wordPools = {
  ua: {
    words1: ["безпеки", "контролю", "аналітики", "моніторингу", "логістики", "виробництва", "обліку", "маркетингу"],
    words2: ["даних", "ресурсів", "процесів", "персоналу", "матеріалів", "клієнтів", "обладнання", "якості"],
    words3: ["ефективності", "швидкості", "точності", "надійності", "стабільності", "гнучкості", "безпеки"]
  },
  en: {
    words1: ["security", "control", "analytics", "monitoring", "logistics", "production", "accounting", "marketing"],
    words2: ["data", "resources", "processes", "personnel", "materials", "clients", "equipment", "quality"],
    words3: ["efficiency", "speed", "accuracy", "reliability", "stability", "flexibility", "safety"]
  },
  pl: {
    words1: ["bezpieczeństwa", "kontroli", "analityki", "monitorowania", "logistyki", "produkcji", "rachunkowości", "marketingu"],
    words2: ["danych", "zasobów", "procesów", "personelu", "materiałów", "klientów", "sprzętu", "jakości"],
    words3: ["efektywności", "szybkości", "dokładności", "niezawodności", "stabilności", "elastyczności", "bezpieczeństwa"]
  },
  ru: {
    words1: ["безопасности", "контроля", "аналитики", "мониторинга", "логистики", "производства", "учета", "маркетинга"],
    words2: ["данных", "ресурсов", "процессов", "персонала", "материалов", "клиентов", "оборудования", "качества"],
    words3: ["эффективности", "скорости", "точности", "надежности", "стабильности", "гибкости", "безопасности"]
  }
};

function getRandomIndex(max) {
  return Math.floor(Math.random() * max);
}

function generateRandomParamSet() {
  const i1 = getRandomIndex(wordPools.ua.words1.length);
  const i2 = getRandomIndex(wordPools.ua.words2.length);
  const i3 = getRandomIndex(wordPools.ua.words3.length);

  return {
    ua: `${wordPools.ua.words1[i1]} ${wordPools.ua.words2[i2]} та ${wordPools.ua.words3[i3]}`,
    en: `${wordPools.en.words1[i1]} of ${wordPools.en.words2[i2]} and ${wordPools.en.words3[i3]}`,
    pl: `${wordPools.pl.words1[i1]} ${wordPools.pl.words2[i2]} i ${wordPools.pl.words3[i3]}`,
    ru: `${wordPools.ru.words1[i1]} ${wordPools.ru.words2[i2]} и ${wordPools.ru.words3[i3]}`
  };
}

const allQuestions = [...realisticQuestions];
const totalQuestionsNeeded = 7000;
const optionsArray = ['A', 'B', 'C', 'D'];

let parameterCount = 0;

for (let i = allQuestions.length; i < totalQuestionsNeeded; i++) {
  const industry = industries[i % industries.length];
  const template = templates[i % templates.length];

  const p1 = generateRandomParamSet();
  const p2 = generateRandomParamSet();
  const p3 = generateRandomParamSet();
  const p4 = generateRandomParamSet();
  const p5 = generateRandomParamSet();
  parameterCount += 5;

  const q = {
    industry_ua: industry.ua, industry_en: industry.en, industry_pl: industry.pl, industry_ru: industry.ru,
    correct_option: optionsArray[Math.floor(Math.random() * 4)]
  };

  const langs = ['ua', 'en', 'pl', 'ru'];
  langs.forEach(lang => {
    q[`question_${lang}`] = template[lang].text.replace('{PARAM1}', p1[lang]);

    let opts = [
      template[lang].options[0].replace('{PARAM2}', p2[lang]),
      template[lang].options[1].replace('{PARAM3}', p3[lang]),
      template[lang].options[2].replace('{PARAM4}', p4[lang]),
      template[lang].options[3].replace('{PARAM5}', p5[lang])
    ];

    // For simplicity of programmatic generation in all 4 languages,
    // map the correctly generated options to A,B,C,D.
    q[`option_a_${lang}`] = opts[0];
    q[`option_b_${lang}`] = opts[1];
    q[`option_c_${lang}`] = opts[2];
    q[`option_d_${lang}`] = opts[3];
  });

  // Note: To make correct_option randomized, we should shuffle options,
  // but we need to shuffle them synchronously for all languages.
  // Instead, let's keep A, B, C, D static for generated ones, or just randomly swap them.
  // We'll swap the correct option's text with option A (or whichever is currently index 0),
  // then rename them properly.

  const correctIdx = optionsArray.indexOf(q.correct_option);
  if (correctIdx !== 0) {
    langs.forEach(lang => {
      const aKey = `option_a_${lang}`;
      const cKey = `option_${q.correct_option.toLowerCase()}_${lang}`;
      const temp = q[aKey];
      q[aKey] = q[cKey];
      q[cKey] = temp;
    });
  }

  allQuestions.push(q);
}

const outputPath = path.join(process.cwd(), 'src', 'quiz-data.json');
fs.writeFileSync(outputPath, JSON.stringify(allQuestions, null, 2), 'utf8');

console.log(`✅ Generated ${allQuestions.length} test questions.`);
console.log(`✅ Generated ${parameterCount} parameters within the questions.`);
console.log(`✅ Output saved to ${outputPath}`);
