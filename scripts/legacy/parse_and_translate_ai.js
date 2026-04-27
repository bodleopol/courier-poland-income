import fs from 'fs';

const content = fs.readFileSync('src/main.js', 'utf-8');

const startIdx = content.indexOf('const translations = {');
let endIdx = content.indexOf('};\n\n  function setLang(');
if (endIdx === -1) endIdx = content.indexOf('};\n\n  // English Fallback');
if (endIdx === -1) endIdx = content.indexOf('  };\n\n  function toEnglishFallbackText(');

let block = content.substring(startIdx, endIdx);

const lines = block.split('\n');

const manualTranslations = {
  // Navigation & Common
  'Rybezh': 'Rybezh',
  'rybezh.site — робота у Польщі для українців та поляків': 'rybezh.site — jobs in Poland for Ukrainians and Poles',
  'Головна': 'Home',
  'Вакансії': 'Vacancies',
  'Категорії': 'Categories',
  'Про нас': 'About Us',
  'Блог': 'Blog',
  'FAQ': 'FAQ',
  'Оренда': 'Rent',
  'Контакти': 'Contact',
  'Для роботодавців': 'For Employers',
  'Отримати консультацію': 'Get a consultation',
  'Подати заявку': 'Apply now',

  // Tools
  '🛠️ Інструменти': '🛠️ Tools',
  '💰 Калькулятор зарплати': '💰 Salary Calculator',
  '💰 Калькулятор': '💰 Calculator',
  '📄 Генератор CV': '📄 CV Generator',
  '🚩 Перевірка вакансій': '🚩 Vacancy Checker',
  '🗺️ Карта українців': '🗺️ Community Map',
  'Інструменти': 'Tools',
  'Калькулятор': 'Calculator',
  'Генератор CV': 'CV Generator',
  'Перевірка вакансій': 'Vacancy Checker',
  'Мапа українців': 'Community Map',

  // Hero & Search
  'Знайдіть роботу в Польщі': 'Find a job in Poland',
  'Знайди роботу в Польщі': 'Find a job in Poland',
  'Актуальні вакансії в різних сферах по всій Польщі. Легальні умови та підтримка.': 'Current vacancies in various fields across Poland. Legal conditions and support.',
  'Пошук за містом або типом роботи': 'Search by city or job type',
  'Знайти': 'Find',

  // Categories & Vacancies
  'Популярні категорії': 'Popular Categories',
  'Всі категорії': 'All Categories',
  'Свіжі вакансії': 'Recent Vacancies',
  'Всі вакансії': 'All vacancies',
  'Детальніше': 'Details',
  'Категорія': 'Category',
  'Графік': 'Schedule',
  'Зарплата': 'Salary',
  'Тип договору': 'Contract Type',
  'Проживання': 'Accommodation',
  'Локація': 'Location',
  'Опис вакансії': 'Job Description',
  'Вимоги': 'Requirements',
  'Обов\'язки': 'Responsibilities',
  'Умови роботи': 'Working Conditions',
  'Переваги': 'Benefits',
  'Досвід': 'Experience',
  'Мова': 'Language',

  // Tags
  'Без досвіду': 'No experience',
  'З досвідом': 'With experience',
  'Початковий рівень': 'Entry level',
  'Середній рівень': 'Intermediate level',
  'Високий рівень': 'High level',
  'Чоловіки': 'Men',
  'Жінки': 'Women',
  'Пари': 'Couples',
  'Студенти': 'Students',
  'Будь-хто': 'Anyone',
  'Стать': 'Gender',

  // Cities
  'Познань': 'Poznań',
  'Лодзь': 'Łódź',
  'Катовіце': 'Katowice',
  'Щецін': 'Szczecin',
  'Люблін': 'Lublin',
  'Білосток': 'Białystok',
  'Бидгощ': 'Bydgoszcz',
  'Жешув': 'Rzeszów',
  'Торунь': 'Toruń',
  'Ченстохова': 'Częstochowa',
  'Радом': 'Radom',
  'Сосновець': 'Sosnowiec',
  'Кельце': 'Kielce',
  'Гливіце': 'Gliwice',
  'Ольштин': 'Olsztyn',
  'Бєльско-Бяла': 'Bielsko-Biała',
  'Плоцьк': 'Płock',
  'Гдиня': 'Gdynia',
  'Всі міста': 'All Cities',
  'Варшава': 'Warsaw',
  'Краків': 'Krakow',
  'Вроцлав': 'Wroclaw',
  'Гданськ': 'Gdansk',

  // Employers Page
  'Знайдіть надійних працівників з України': 'Find reliable employees from Ukraine',
  'Розмістіть вакансію безкоштовно та отримайте відгуки від мотивованих кандидатів протягом 24 годин': 'Post a vacancy for free and get responses from motivated candidates within 24 hours',
  '🎯 Цільова аудиторія': '🎯 Target Audience',
  'Вашу вакансію побачать тисячі українців, які активно шукають роботу в Польщі': 'Your vacancy will be seen by thousands of Ukrainians actively looking for work in Poland',
  '⚡ Швидкий результат': '⚡ Fast Results',
  'Перші відгуки отримаєте протягом 24 годин після розміщення вакансії': 'You will get the first responses within 24 hours of posting the vacancy',
  '💰 Безкоштовно': '💰 Free',
  'Розміщення вакансій повністю безкоштовне. Без прихованих платежів та комісій': 'Posting vacancies is completely free. No hidden fees or commissions',
  '🤝 Без посередників': '🤝 Direct Contact',
  'Прямий контакт з кандидатами. Ви самі обираєте найкращих працівників': 'Direct contact with candidates. You choose the best employees yourself',
  'Готові знайти працівників?': 'Ready to find employees?',
  'Заповніть форму нижче, і ми зв\'яжемося з вами для обговорення деталей': 'Fill out the form below and we will contact you to discuss details',

  // Forms
  'Назва компанії': 'Company Name',
  'Контактна особа': 'Contact Person',
  'Телефон': 'Phone',
  'Email': 'Email',
  'Текст вакансії (опис, вимоги, умови)': 'Vacancy Text (description, requirements, conditions)',
  'Відправити заявку': 'Submit Application',
  'Компанія': 'Company',
  'Ваше ім\'я': 'Your Name',
  'Місто': 'City',
  'Опис (опціонально)': 'Description (optional)',
  'Додати': 'Add',
  'Надіслати': 'Send',

  // About Page
  'Ми — команда професіоналів, яка допомагає українцям знайти надійну та легальну роботу в Польщі.': 'We are a team of professionals helping Ukrainians find reliable and legal work in Poland.',
  'Наша місія': 'Our Mission',
  'Забезпечити прозорий та безпечний процес працевлаштування для кожного кандидата, захищаючи від шахраїв.': 'To provide a transparent and safe employment process for every candidate, protecting against scammers.',
  'Чому ми?': 'Why us?',
  'Тільки перевірені роботодавці': 'Only verified employers',
  'Безкоштовні послуги для кандидатів': 'Free services for candidates',
  'Підтримка на всіх етапах': 'Support at all stages',
  'Допомога з документами': 'Assistance with documents',
  'Відгуки клієнтів': 'Client Reviews',

  // Blog & FAQ
  'Корисні статті та поради для тих, хто планує працювати в Польщі': 'Useful articles and tips for those planning to work in Poland',
  'Читати': 'Read',
  'Завантажити більше': 'Load more',
  'Популярні статті': 'Popular Articles',
  'Часті запитання': 'Frequently Asked Questions',
  'Не знайшли відповідь?': 'Did not find an answer?',
  'Зв\'яжіться з нами': 'Contact us',

  // Rent
  'Залишити заявку': 'Leave a request',
  'Оберіть транспорт': 'Select transport',
  'FAQ: ПДР та доставка в Польщі': 'FAQ: Traffic rules and delivery in Poland',

  // Social & Meta
  'Копіювати посилання': 'Copy link',
  'Поділитися у Facebook': 'Share on Facebook',
  'Поділитися у Telegram': 'Share on Telegram',
  'Поділитися у Viber': 'Share on Viber',
  'Сторінку не знайдено': 'Page not found',
  'Схоже, сторінка, яку ви шукаєте, не існує або була переміщена.': 'It looks like the page you are looking for does not exist or has been moved.',
  'На головну': 'Go to Home page',

  // Calculator
  'Брутто': 'Gross',
  'Нетто (на руки)': 'Net (in hand)',
  'Ставка за годину': 'Hourly rate',
  'Кількість годин на місяць': 'Hours per month',
  'Umowa o pracę': 'Employment contract (Umowa o pracę)',
  'Umowa zlecenie': 'Mandate contract (Umowa zlecenie)',
  'Вік до 26 років': 'Age under 26',
  'Студент (до 26 років)': 'Student (under 26)',
  'Розрахувати': 'Calculate',
  'Результат': 'Result',
  'Зарплата брутто:': 'Gross salary:',
  'Зарплата нетто:': 'Net salary:',
  'Податки та внески:': 'Taxes and contributions:',
  'Цей калькулятор надає орієнтовні розрахунки. Точна сума може залежати від індивідуальних обставин та змін у законодавстві.': 'This calculator provides approximate calculations. The exact amount may depend on individual circumstances and changes in legislation.',

  // CV Generator
  'Створити CV': 'Create CV',
  'Особисті дані': 'Personal Details',
  'Ім\'я та Прізвище': 'First and Last Name',
  'Дата народження': 'Date of Birth',
  'Громадянство': 'Citizenship',
  'Місто проживання': 'City of Residence',
  'Досвід роботи': 'Work Experience',
  'Освіта': 'Education',
  'Навички': 'Skills',
  'Знання мов': 'Languages',
  'Згенерувати CV (PDF)': 'Generate CV (PDF)',

  // Red Flag
  'Перевірка вакансії на шахрайство': 'Vacancy Fraud Check',
  'Вставте текст вакансії нижче, щоб перевірити її на наявність тривожних сигналів (red flags).': 'Paste the vacancy text below to check it for red flags.',
  'Текст вакансії': 'Vacancy text',
  'Перевірити': 'Check',
  'Результат перевірки': 'Check Result',

  // Map
  'Карта українців у Польщі': 'Map of Ukrainians in Poland',
  'Знайдіть своїх у вашому місті': 'Find your people in your city',
  'Пошук': 'Search',
  'Додати себе на карту': 'Add yourself to the map',

  // Categories
  'Будівництво та Ремонт': 'Construction & Renovation',
  'Виробництво та Заводи': 'Production & Factories',
  'Логістика та Склади': 'Logistics & Warehouses',
  'Сфера послуг': 'Services Sector',
  'Інше': 'Other',

  // Categories mapping translation block
  'Будівництво': 'Construction',
  'Виробництво': 'Production',
  'Логістика': 'Logistics',

  // Misc
  'Rybezh — Пошук роботи у Польщі': 'Work in Poland for Ukrainians | Rybezh - Free Employment',
  'Актуальні вакансії в різних сферах по всій Польщі. Легальне працевлаштування та підтримка.': 'Find your dream job in Poland! Free consultation, document assistance, and hundreds of verified vacancies from direct employers. Start working legally today.',
  'Ми використовуємо файли cookie для покращення вашого досвіду. Залишаючись на сайті, ви погоджуєтесь на їх використання.': 'We use cookies to improve your experience. By staying on the site, you agree to their use.',
  'Прийняти': 'Accept',
  'Шукати': 'Search',
  'Очистити': 'Clear',
  'Так': 'Yes',
  'Ні': 'No',
  'Актуальні вакансії': 'Current Vacancies',
  'Усі вакансії': 'All Vacancies',
  'Більше': 'More',
  'Менше': 'Less'
};

const wordMap = {
  'Пошук роботи': 'Job search',
  'робота': 'job',
  'Польща': 'Poland',
  'Польщі': 'Poland',
  'Безкоштовно': 'Free',
  'Вакансії': 'Vacancies',
  'Відгуки': 'Reviews',
  'Контакти': 'Contacts',
  'Резюме': 'Resume',
  'Шахрай': 'Scammer',
  'Карта': 'Map',
  'Оренда': 'Rent',
  'Роботодавець': 'Employer'
};

// We will fetch Google translate for all remaining missing texts
// To keep things offline/simple we will just use basic mapping, and if not mapped we just set to a safe fallback
function translateUaToEn(uaText) {
  if (manualTranslations[uaText]) return manualTranslations[uaText];

  // Try direct mapping
  for (const [ua, en] of Object.entries(wordMap)) {
    if (uaText === ua) return en;
  }

  // Simple word substitutions
  let res = uaText;
  res = res.replace('Відгуки', 'Reviews').replace('вакансії', 'vacancies');

  return res;
}

const newLines = lines.map(line => {
  // If it's a categoryIcons block, skip
  if (!line.trim().startsWith("'")) return line;

  // match ua: 'text' or ua: "text"
  const match = line.match(/ua:\s*(['"`])(.*?)\1/);
  if (match) {
    let uaText = match[2];

    // We handle escaped quotes
    uaText = uaText.replace(/\\'/g, "'").replace(/\\"/g, '"');

    let enText = translateUaToEn(uaText);
    enText = enText.replace(/"/g, '\\"');

    // Replace the line EN part, we delete any existing `en:` first just in case
    let noEnLine = line.replace(/,\s*en:\s*(['"`]).*?\1/g, '');
    noEnLine = noEnLine.replace(/,\s*en:\s*null/g, '');

    const lastBrace = noEnLine.lastIndexOf('}');
    if (lastBrace !== -1) {
      return noEnLine.substring(0, lastBrace) + `, en: "${enText}" ` + noEnLine.substring(lastBrace);
    }
  }
  return line;
});

const newContent = content.substring(0, startIdx) + newLines.join('\n') + content.substring(endIdx);
fs.writeFileSync('src/main.js', newContent, 'utf-8');
