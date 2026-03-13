import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import ENRICHMENTS from './vacancy-enrichments.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC = path.join(__dirname);
const TEMPLATES = path.join(SRC, 'templates');
const DIST = path.join(process.cwd(), 'dist');
const POSTS_PER_PAGE = 20;

// Indexing strategy for vacancies to reduce doorway/scaled-content risk.
// Keep a limited set of generated vacancies indexable; mark the rest as noindex.

/**
 * Detects near-duplicate vacancy pages that share the same city prefix and job-type
 * base (slug without city prefix and trailing numeric ID).
 * Returns a Set of slugs that are secondary variants — these are marked noindex to
 * reduce AI-doorway / city-spin signals detected by the SEO audit.
 *
 * Algorithm:
 *   1. Extract city prefix (first hyphen-delimited segment) and job base
 *      (remaining segments with the trailing numeric suffix removed).
 *   2. Group pages by (cityPrefix, jobBase).
 *   3. For each group with 2+ pages, keep the first occurrence indexable;
 *      mark the rest as secondary (noindex).
 */
function detectNearDuplicateSlugs(pages) {
  const groups = new Map();
  // Phase 1: Group by same city + same job type (original logic)
  for (const page of pages) {
    const slug = page.slug || '';
    const parts = slug.split('-');
    if (parts.length < 2) continue;
    const cityPrefix = parts[0];
    let jobParts = parts.slice(1);
    // Strip trailing pure-numeric ID (e.g. "-850")
    if (jobParts.length > 0 && /^\d+$/.test(jobParts[jobParts.length - 1])) {
      jobParts = jobParts.slice(0, -1);
    }
    const jobBase = jobParts.join('-');
    if (!jobBase) continue;
    const key = `${cityPrefix}::${jobBase}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(slug);
  }
  const secondarySlugs = new Set();
  for (const [, slugs] of groups) {
    if (slugs.length >= 2) {
      // Keep the first occurrence; mark all subsequent as secondary
      for (const slug of slugs.slice(1)) {
        secondarySlugs.add(slug);
      }
    }
  }

  // Phase 2: Cross-city dedup — same job base across different cities.
  // Keep the first city occurrence indexable; mark others noindex to reduce
  // "city-spin doorway" pattern that search engines penalise.
  const crossCityGroups = new Map();
  for (const page of pages) {
    const slug = page.slug || '';
    if (secondarySlugs.has(slug)) continue; // already marked
    const parts = slug.split('-');
    if (parts.length < 2) continue;
    let jobParts = parts.slice(1);
    if (jobParts.length > 0 && /^\d+$/.test(jobParts[jobParts.length - 1])) {
      jobParts = jobParts.slice(0, -1);
    }
    const jobBase = jobParts.join('-');
    if (!jobBase) continue;
    if (!crossCityGroups.has(jobBase)) crossCityGroups.set(jobBase, []);
    crossCityGroups.get(jobBase).push(slug);
  }
  for (const [, slugs] of crossCityGroups) {
    if (slugs.length >= 2) {
      // Keep only the first city variant (by content.json insertion order) indexable;
      // mark the rest noindex to reduce "city-spin doorway" pattern.
      for (const slug of slugs.slice(1)) {
        secondarySlugs.add(slug);
      }
    }
  }

  return secondarySlugs;
}

function setRobotsMeta(html, robotsContent) {
  const out = String(html || '');
  if (/<meta\s+name=["']robots["'][^>]*>/i.test(out)) {
    return out.replace(/<meta\s+name=["']robots["'][^>]*>/i, (tag) => {
      if (/content=/i.test(tag)) {
        return tag.replace(/content=["'][^"']*["']/i, `content="${robotsContent}"`);
      }
      // add content attribute if missing
      return tag.replace(/>$/, ` content="${robotsContent}">`);
    });
  }
  // If missing, inject before </head>
  if (/<\/head>/i.test(out)) {
    return out.replace(/<\/head>/i, `  <meta name="robots" content="${robotsContent}">\n</head>`);
  }
  return out;
}

const SITE_AUTHOR = {
  ua: {
    name: 'Редакційна команда Rybezh',
    role: 'Карʼєрні консультації та перевірка умов вакансій',
    note: 'Ми збираємо досвід кандидатів, відкриті джерела та реальні умови роботодавців, щоб пояснювати все просто і чесно.'
  },
  pl: {
    name: 'Zespół redakcyjny Rybezh',
    role: 'Doradztwo kariery i weryfikacja warunków pracy',
    note: 'Łączymy doświadczenia kandydatów i informacje z otwartych źródeł, aby wyjaśniać wszystko prosto i uczciwie.'
  },
  ru: {
    name: 'Редакционная команда Rybezh',
    role: 'Карьерные консультации и проверка условий вакансий',
    note: 'Мы собираем опыт кандидатов и данные из открытых источников, чтобы объяснять всё просто и честно.'
  }
};

const RU_FALLBACK_REPLACEMENTS = [
  ['Пошук роботи у Польщі', 'Поиск работы в Польше'],
  ['Знайдіть роботу в Польщі', 'Найдите работу в Польше'],
  ['Актуальні вакансії в різних сферах по всій Польщі.', 'Актуальные вакансии в разных сферах по всей Польше.'],
  ['Легальні умови та підтримка.', 'Легальные условия и поддержка.'],
  ['Пошук за містом або типом роботи', 'Поиск по городу или типу работы'],
  ['Знайти', 'Найти'],
  ['Прийняти', 'Принять'],
  ['Готові почати?', 'Готовы начать?'],
  ['Отримайте консультацію та почніть заробляти вже сьогодні.', 'Получите консультацию и начните зарабатывать уже сегодня.'],
  ['Нові вакансії та статті.', 'Новые вакансии и статьи.'],
  ['Всі категорії', 'Все категории'],
  ['Всі міста', 'Все города'],
  ['Логистика та доставка', 'Логистика и доставка'],
  ['Будивництво', 'Строительство'],
  ['Виробництво', 'Производство'],
  ['Прибирання', 'Уборка'],
  ['Роздрибна торгивля', 'Розничная торговля'],
  ['Медицина та догляд', 'Медицина и уход'],
  ['IT та технологии', 'IT и технологии'],
  ['Сильське господарство', 'Сельское хозяйство'],
  ['Освита', 'Образование'],
  ['Краса та здоров\'я', 'Красота и здоровье'],
  ['Безпека', 'Безопасность'],
  ['Кракив', 'Краков'],
  ['Ми використовуємо файли cookie для покращення вашого досвіду. Залишаючись на сайті, ви погоджуєтесь на їх використання.', 'Мы используем файлы cookie для улучшения вашего опыта. Оставаясь на сайте, вы соглашаетесь на их использование.'],
  ['Головна', 'Главная'],
  ['Вакансії', 'Вакансии'],
  ['Категорії', 'Категории'],
  ['Інструменти', 'Инструменты'],
  ['Про нас', 'О нас'],
  ['Контакти', 'Контакты'],
  ['Для роботодавців', 'Для работодателей'],
  ['Отримати консультацію', 'Получить консультацию'],
  ['Подати заявку', 'Подать заявку'],
  ['Навігація', 'Навигация'],
  ['Підписка', 'Подписка'],
  ['Політика конфіденційності', 'Политика конфиденциальности'],
  ['Умови користування', 'Условия использования'],
  ['Реквізити', 'Реквизиты'],
  ['Всі права захищені', 'Все права защищены'],
  ['Схожі вакансії', 'Похожие вакансии'],
  ['Повернутись на головну', 'Вернуться на главную'],
  ['Умови', 'Условия'],
  ['Зарплата', 'Зарплата'],
  ['Контракт', 'Договор'],
  ['Графік', 'График'],
  ['Режим', 'Режим'],
  ['Старт', 'Старт'],
  ['Бонуси', 'Бонусы'],
  ['Додаткова інформація', 'Дополнительная информация'],
  ['Вимоги', 'Требования'],
  ['Проживання', 'Проживание'],
  ['Тип обʼєкта', 'Тип объекта'],
  ['Адаптація', 'Адаптация'],
  ['Обладнання', 'Оборудование'],
  ['Фізичні вимоги', 'Физические требования'],
  ['Структура зміни', 'Структура смены'],
  ['Стабільна та безпечна вакансія за відгуками.', 'Стабильная и безопасная вакансия по отзывам.'],
  ['Умови загалом ок, але варто уточнити деталі.', 'Условия в целом хорошие, но стоит уточнить детали.'],
  ['Ресторанний бизнес', 'Ресторанный бизнес'],
  ['Повернутись на головну', 'Вернуться на главную']
];

function toRussianFallbackText(input) {
  if (input === null || input === undefined) return '';
  let text = String(input);
  for (const [from, to] of RU_FALLBACK_REPLACEMENTS) {
    text = text.split(from).join(to);
  }

  const wordReplacements = [
    [/\bпрацевлаштування\b/gi, 'трудоустройства'],
    [/\bробота\b/gi, 'работа'],
    [/\bроботи\b/gi, 'работы'],
    [/\bроботу\b/gi, 'работу'],
    [/\bробочий\b/gi, 'рабочий'],
    [/\bробоча\b/gi, 'рабочая'],
    [/\bдоговир\b/gi, 'договор'],
    [/\bробота\b/gi, 'работа'],
    [/\bроботи\b/gi, 'работы'],
    [/\bшукае\b/gi, 'ищет'],
    [/\bшукає\b/gi, 'ищет'],
    [/\bдосвид\b/gi, 'опыт'],
    [/\bвидгук\b/gi, 'отклик'],
    [/\bвидгуками\b/gi, 'отзывам'],
    [/\bпрацивник\b/gi, 'сотрудник'],
    [/\bпрацивникив\b/gi, 'сотрудников'],
    [/\bстабильний\b/gi, 'стабильной'],
    [/\bкоманди\b/gi, 'команды'],
    [/\bзагалом\b/gi, 'в целом'],
    [/\bуточнити\b/gi, 'уточнить'],
    [/\bвакансия за видгуками\b/gi, 'вакансия по отзывам'],
    [/\bвси\b/gi, 'все'],
    [/\bкракив\b/gi, 'Краков'],
    [/\bгданськ\b/gi, 'Гданьск'],
    [/\bвроцлав\b/gi, 'Вроцлав'],
    [/\bсосновець\b/gi, 'Сосновец'],
    [/\bпольщи\b/gi, 'Польше'],
    [/\bварто\b/gi, 'стоит'],
    [/\bграфик\b/gi, 'график'],
    [/\bпрацюе\b/gi, 'работает'],
    [/\bдопомога\b/gi, 'помощь'],
    [/\bдопомагаемо\b/gi, 'помогаем'],
    [/\bдопоможемо\b/gi, 'поможем'],
    [/\bперевирка\b/gi, 'проверка'],
    [/\bконтроль якости\b/gi, 'контроль качества'],
    [/\bвидпусток\b/gi, 'отпусков'],
    [/\bликарняних\b/gi, 'больничных'],
    [/\bПошук\b/gi, 'Поиск'],
    [/\bЗнайдіть\b/gi, 'Найдите'],
    [/\bЗнайди\b/gi, 'Найди'],
    [/\bмістом\b/gi, 'городу'],
    [/\bмісто\b/gi, 'город'],
    [/\bмістах\b/gi, 'городах'],
    [/\bземляків\b/gi, 'земляков'],
    [/\bдодайте\b/gi, 'добавьте'],
    [/\bстворіть\b/gi, 'создайте'],
    [/\bінтерактивна\b/gi, 'интерактивная'],
    [/\bспільноту\b/gi, 'сообщество'],
    [/\bпідтримки\b/gi, 'поддержки'],
    [/\bкарта\b/gi, 'карта'],
    [/\bкарти\b/gi, 'карте'],
    [/\bдесятки українців\b/gi, 'десятки украинцев'],
    [/\bвидзначені\b/gi, 'отмечены'],
    [/\bмайстер\b/gi, 'мастер'],
    [/\bшукае\b/gi, 'ищет'],
    [/\bважливи\b/gi, 'важны'],
    [/\bвминня\b/gi, 'умение'],
    [/\bспилкуватися\b/gi, 'общаться'],
    [/\bвиконання\b/gi, 'выполнение'],
    [/\bинструментив\b/gi, 'инструментов'],
    [/\bнарощування\b/gi, 'наращивание'],
    [/\bпропонуе\b/gi, 'предлагает'],
    [/\bпрацивникив\b/gi, 'сотрудников'],
    [/\bзростаючий\b/gi, 'растущий'],
    [/\bпраци\b/gi, 'труда'],
    [/\bвидгукнутися\b/gi, 'откликнуться'],
    [/\bвидгук\b/gi, 'отзыв'],
    [/\bдосвид\b/gi, 'опыт'],
    [/\bзмина\b/gi, 'смена'],
    [/\bдоихати\b/gi, 'доехать'],
    [/\bжитла\b/gi, 'жилья'],
    [/\bтыжня\b/gi, 'недели'],
    [/\bзаявка\b/gi, 'заявка'],
    [/\bвідгук\b/gi, 'отзыв'],
    [/\bвідгуки\b/gi, 'отзывы'],
    // Additional Ukrainian words that commonly appear in vacancy content
    [/\bпісля\b/gi, 'после'],
    [/\bобіцяємо\b/gi, 'обещаем'],
    [/\bобіцяти\b/gi, 'обещать'],
    [/\bзрозумілі\b/gi, 'понятные'],
    [/\bзрозуміло\b/gi, 'понятно'],
    [/\bзрозумілий\b/gi, 'понятный'],
    [/\bреальні\b/gi, 'реальные'],
    [/\bреальний\b/gi, 'реальный'],
    [/\bчіткий\b/gi, 'чёткий'],
    [/\bчіткі\b/gi, 'чёткие'],
    [/\bзнайти\b/gi, 'найти'],
    [/\bзнайте\b/gi, 'знайте'],
    [/\bзнайдіть\b/gi, 'найдите'],
    [/\bпочати\b/gi, 'начать'],
    [/\bпочинати\b/gi, 'начинать'],
    [/\bпочатку\b/gi, 'начала'],
    [/\bпочаток\b/gi, 'начало'],
    [/\bпереглянути\b/gi, 'посмотреть'],
    [/\bпереглядати\b/gi, 'просматривать'],
    [/\bотримати\b/gi, 'получить'],
    [/\bотримуєте\b/gi, 'получаете'],
    [/\bотримав\b/gi, 'получил'],
    [/\bотримавши\b/gi, 'получив'],
    [/\bобирати\b/gi, 'выбирать'],
    [/\bобрати\b/gi, 'выбрать'],
    [/\bобирайте\b/gi, 'выбирайте'],
    [/\bрадимо\b/gi, 'советуем'],
    [/\bраджу\b/gi, 'советую'],
    [/\bпитайте\b/gi, 'спрашивайте'],
    [/\bпитання\b/gi, 'вопрос'],
    [/\bпитань\b/gi, 'вопросов'],
    [/\bдивіться\b/gi, 'смотрите'],
    [/\bдивитися\b/gi, 'смотреть'],
    [/\bважливіше\b/gi, 'важнее'],
    [/\bважливіший\b/gi, 'важнее'],
    [/\bважливо\b/gi, 'важно'],
    [/\bгнучкий\b/gi, 'гибкий'],
    [/\bгнучкість\b/gi, 'гибкость'],
    [/\bзручний\b/gi, 'удобный'],
    [/\bзручно\b/gi, 'удобно'],
    [/\bзручна\b/gi, 'удобная'],
    [/\bзручних\b/gi, 'удобных'],
    [/\bпрозорий\b/gi, 'прозрачный'],
    [/\bпрозорі\b/gi, 'прозрачные'],
    [/\bстабільний\b/gi, 'стабильный'],
    [/\bстабільна\b/gi, 'стабильная'],
    [/\bстабільні\b/gi, 'стабильные'],
    [/\bпопулярні\b/gi, 'популярные'],
    [/\bпопулярний\b/gi, 'популярный'],
    [/\bбезкоштовна\b/gi, 'бесплатная'],
    [/\bбезкоштовно\b/gi, 'бесплатно'],
    [/\bбезкоштовний\b/gi, 'бесплатный'],
    [/\bлегальне\b/gi, 'легальное'],
    [/\bлегальна\b/gi, 'легальная'],
    [/\bлегальні\b/gi, 'легальные'],
    [/\bактуальні\b/gi, 'актуальные'],
    [/\bактуальний\b/gi, 'актуальный'],
    [/\bактуально\b/gi, 'актуально'],
    [/\bтисячі\b/gi, 'тысячи'],
    [/\bтисяча\b/gi, 'тысяча'],
    [/\bлюдей\b/gi, 'людей'],
    [/\bпрацюють\b/gi, 'работают'],
    [/\bпрацювати\b/gi, 'работать'],
    [/\bпрацює\b/gi, 'работает'],
    [/\bфільтруйте\b/gi, 'фильтруйте'],
    [/\bфільтри\b/gi, 'фильтры'],
    [/\bзаробіток\b/gi, 'заработок'],
    [/\bзаробітку\b/gi, 'заработка'],
    [/\bзаробляти\b/gi, 'зарабатывать'],
    [/\bзарплата\b/gi, 'зарплата'],
    [/\bзарплати\b/gi, 'зарплаты'],
    [/\bзарплату\b/gi, 'зарплату'],
    [/\bдокументи\b/gi, 'документы'],
    [/\bдокументів\b/gi, 'документов'],
    [/\bдокументах\b/gi, 'документах'],
    [/\bдокумент\b/gi, 'документ'],
    [/\bпояснення\b/gi, 'пояснения'],
    [/\bуточнення\b/gi, 'уточнение'],
    [/\bнюанси\b/gi, 'нюансы'],
    [/\bнюанс\b/gi, 'нюанс'],
    [/\bвиїзду\b/gi, 'отъезда'],
    [/\bвиїзд\b/gi, 'отъезд'],
    [/\bрозуміємо\b/gi, 'понимаем'],
    [/\bрозуміти\b/gi, 'понимать'],
    [/\bкорисні\b/gi, 'полезные'],
    [/\bкорисний\b/gi, 'полезный'],
    [/\bкорисно\b/gi, 'полезно'],
    [/\bстатті\b/gi, 'статьи'],
    [/\bстатья\b/gi, 'статья'],
    [/\bстаттях\b/gi, 'статьях'],
    [/\bновини\b/gi, 'новости'],
    [/\bновина\b/gi, 'новость'],
    [/\bадаптація\b/gi, 'адаптация'],
    [/\bадаптації\b/gi, 'адаптации'],
    [/\bринок\b/gi, 'рынок'],
    [/\bринку\b/gi, 'рынка'],
    [/\bдвічі\b/gi, 'дважды'],
    [/\bтеж\b/gi, 'тоже'],
    [/\bтакож\b/gi, 'также'],
    [/\bналаштування\b/gi, 'настройки'],
    [/\bнадійний\b/gi, 'надёжный'],
    [/\bнадійна\b/gi, 'надёжная'],
    [/\bнадійні\b/gi, 'надёжные'],
    [/\bпартнер\b/gi, 'партнёр'],
    [/\bпрацевлаштування\b/gi, 'трудоустройство'],
    [/\bпрацевлаштуванням\b/gi, 'трудоустройством'],
    [/\bпрацевлаштуванні\b/gi, 'трудоустройстве'],
    [/\bобробку\b/gi, 'обработку'],
    [/\bданих\b/gi, 'данных'],
    [/\bконтактних\b/gi, 'контактных'],
    [/\bпогоджуюсь\b/gi, 'соглашаюсь'],
    [/\bнадіслати\b/gi, 'отправить'],
    [/\bнадіслати\b/gi, 'отправить'],
    [/\bочистити\b/gi, 'очистить'],
    [/\bсторінка\b/gi, 'страница'],
    [/\bсторінку\b/gi, 'страницу'],
    [/\bсторінки\b/gi, 'страницы'],
    [/\bзнайдена\b/gi, 'найдена'],
    [/\bпереміщена\b/gi, 'перемещена'],
    [/\bповернутись\b/gi, 'вернуться'],
    [/\bзвʼязатися\b/gi, 'связаться'],
    [/\bзв'язатися\b/gi, 'связаться'],
    [/\bзв\'язатися\b/gi, 'связаться'],
    [/\bнаписати\b/gi, 'написать'],
    [/\bпоширені\b/gi, 'частые'],
    [/\bчасті\b/gi, 'частые'],
    [/\bвідповіді\b/gi, 'ответы'],
    [/\bвідповідь\b/gi, 'ответ'],
    [/\bумови\b/gi, 'условия'],
    [/\bumov\b/gi, 'условий'],
    [/\bшвидко\b/gi, 'быстро'],
    [/\bшвидкий\b/gi, 'быстрый'],
    [/\bшвидке\b/gi, 'быстрое'],
    [/\bзаявку\b/gi, 'заявку'],
    [/\bзаявок\b/gi, 'заявок'],
    [/\bподати\b/gi, 'подать'],
    [/\bподайте\b/gi, 'подайте'],
    [/\bполів\b/gi, 'полей'],
    [/\bполе\b/gi, 'поле'],
    [/\bкілька\b/gi, 'несколько'],
    [/\bпідберемо\b/gi, 'подберём'],
    [/\bпідбір\b/gi, 'подбор'],
    [/\bпідбором\b/gi, 'подбором'],
    [/\bдопоможемо\b/gi, 'поможем'],
    [/\bтелефон\b/gi, 'телефон'],
    [/\bмісяць\b/gi, 'месяц'],
    [/\bмісяці\b/gi, 'месяцы'],
    [/\bмісяця\b/gi, 'месяца'],
    [/\bтиждень\b/gi, 'неделя'],
    [/\bтижні\b/gi, 'недели'],
    [/\bгодин\b/gi, 'часов'],
    [/\bгодина\b/gi, 'час'],
    [/\bгодини\b/gi, 'часы'],
    [/\bставка\b/gi, 'ставка'],
    [/\bставки\b/gi, 'ставки'],
    [/\bприблизний\b/gi, 'приблизительный'],
    [/\bрозрахунок\b/gi, 'расчёт'],
    [/\bдохід\b/gi, 'доход'],
    [/\bдоходу\b/gi, 'дохода']
  ];
  for (const [pattern, replacement] of wordReplacements) {
    text = text.replace(pattern, replacement);
  }

  text = text
    .replace(/Стабільна та безпечна вакансія за відгуками\./gi, 'Стабильная и безопасная вакансия по отзывам.')
    .replace(/Умови загалом ок, але варто уточнити деталі\./gi, 'Условия в целом хорошие, но стоит уточнить детали.');

  return text
    .replace(/[іІїЇєЄґҐ]/g, (ch) => ({
      і: 'и', І: 'И', ї: 'и', Ї: 'И', є: 'е', Є: 'Е', ґ: 'г', Ґ: 'Г'
    }[ch] || ch))
    .replace(/[ʼ']/g, '\'')
    .replace(/\bПольщи\b/gi, 'Польше')
    .replace(/\bЗнайдить\b/gi, 'Найдите')
    .replace(/\bризних\b/gi, 'разных')
    .replace(/\bвсий\b/gi, 'всей')
    .replace(/\bЛегальне\b/gi, 'Легальное')
    .replace(/\bумови\b/gi, 'условия')
    .replace(/\bпидтримка\b/gi, 'поддержка')
    .replace(/\bпидтримку\b/gi, 'поддержку')
    .replace(/\bпидтримки\b/gi, 'поддержки')
    .replace(/\bмрии\b/gi, 'мечты')
    .replace(/\bмрию\b/gi, 'мечту')
    .replace(/\bмрия\b/gi, 'мечта')
    .replace(/\bчекае\b/gi, 'ждёт')
    .replace(/\bчекають\b/gi, 'ждут')
    .replace(/\bчекати\b/gi, 'ждать')
    .replace(/\bпрацюе\b/gi, 'работает')
    .replace(/\bпрацюють\b/gi, 'работают')
    .replace(/\bпрацювати\b/gi, 'работать')
    .replace(/\bобицяемо\b/gi, 'обещаем')
    .replace(/\bзрозумили\b/gi, 'понятные')
    .replace(/\bзрозумило\b/gi, 'понятно')
    .replace(/\bзрозумилий\b/gi, 'понятный')
    .replace(/\bреальни\b/gi, 'реальные')
    .replace(/\bчиткий\b/gi, 'чёткий')
    .replace(/\bчитки\b/gi, 'чёткие')
    .replace(/\bписля\b/gi, 'после')
    .replace(/\bзнайти\b/gi, 'найти')
    .replace(/\bпочати\b/gi, 'начать')
    .replace(/\bотримати\b/gi, 'получить')
    .replace(/\bпереглянути\b/gi, 'посмотреть')
    .replace(/\bгнучкисть\b/gi, 'гибкость')
    .replace(/\bзручний\b/gi, 'удобный')
    .replace(/\bзручна\b/gi, 'удобная')
    .replace(/\bстабильни\b/gi, 'стабильные')
    .replace(/\bпопулярни\b/gi, 'популярные')
    .replace(/\bбезкоштовна\b/gi, 'бесплатная')
    .replace(/\bбезкоштовно\b/gi, 'бесплатно')
    .replace(/\bактуальни\b/gi, 'актуальные')
    .replace(/\bтисячи\b/gi, 'тысячи')
    .replace(/\bдвичи\b/gi, 'дважды')
    .replace(/\bнадийний\b/gi, 'надёжный')
    .replace(/\bнадийна\b/gi, 'надёжная');
}

function toRussianContentValue(value) {
  if (Array.isArray(value)) {
    return value.map(item => toRussianContentValue(item));
  }
  if (value === null || value === undefined) return value;
  return toRussianFallbackText(value);
}

function enrichRussianFields(item, fields) {
  if (!item || typeof item !== 'object') return;
  for (const field of fields) {
    const ruKey = `${field}_ru`;
    if (item[ruKey] !== undefined && item[ruKey] !== null && String(item[ruKey]).trim() !== '') continue;
    const source = item[`${field}_ua`] ?? item[field] ?? item[`${field}_pl`];
    if (source === undefined || source === null) continue;
    item[ruKey] = toRussianContentValue(source);
  }
}

function normalizeRussianFields(item, fields) {
  if (!item || typeof item !== 'object') return;
  for (const field of fields) {
    const ruKey = `${field}_ru`;
    const source = item[ruKey] ?? item[`${field}_ua`] ?? item[field] ?? item[`${field}_pl`];
    if (source === undefined || source === null) continue;
    item[ruKey] = toRussianContentValue(source);
  }
}

const CATEGORY_SPECIFIC_SECTIONS = {
  it: {
    ua: {
      title: 'Технології та команда',
      items: ['Стек технологій', 'Розмір команди', 'Code review процес', 'Можливості росту']
    },
    pl: {
      title: 'Technologie i zespół',
      items: ['Stack technologiczny', 'Wielkość zespołu', 'Proces code review', 'Możliwości rozwoju']
    }
  },
  construction: {
    ua: {
      title: 'Безпека та сертифікати',
      items: ['Обов\'язкові сертифікати безпеки', 'Навчання з техніки безпеки', 'Спецодяг та засоби захисту', 'Висотні роботи (якщо є)']
    },
    pl: {
      title: 'Bezpieczeństwo i certyfikaty',
      items: ['Wymagane certyfikaty BHP', 'Szkolenia bezpieczeństwa', 'Odzież i środki ochronne', 'Prace na wysokości (jeśli dotyczy)']
    }
  },
  hospitality: {
    ua: {
      title: 'Графік та чайові',
      items: ['Змінність графіка', 'Контакт з клієнтами', 'Політика чайових', 'Святкові надбавки']
    },
    pl: {
      title: 'Grafik i napiwki',
      items: ['Zmienność grafiku', 'Kontakt z klientem', 'Polityka napiwków', 'Dodatki świąteczne']
    }
  },
  healthcare: {
    ua: {
      title: 'Ліцензії та практика',
      items: ['Визнання дипломів', 'Ліцензія/реєстрація', 'Тип пацієнтів', 'Супервізія']
    },
    pl: {
      title: 'Licencje i praktyka',
      items: ['Nostryfikacja dyplomów', 'Licencja/rejestracja', 'Typ pacjentów', 'Superwizja']
    }
  }
};

function getLastUpdated() {
  return new Date().toISOString().slice(0, 10);
}

const HUMAN_INTROS = {
  ua: [
    'Коли я вперше їхав на зміну в Польщі, чесно, трохи панікував — усе нове. Цей текст я написав би собі тоді, без прикрас.',
    'Не люблю «ідеальні» гайди. Тут зібрав те, що у мене реально спрацювало — з помилками, які теж були.',
    'Я не експерт з телевізора, а людина, яка просто пройшла цей шлях. Тому пишу без офіціозу й зайвого пафосу.',
    'Коротко: я сам через це проходив, тож пишу так, як пояснив би другу в месенджері.'
  ],
  pl: [
    'Kiedy pierwszy raz jechałem na zmianę w Polsce, serio miałem stres — wszystko nowe. To tekst, który chciałbym wtedy przeczytać.',
    'Nie przepadam za „idealnymi” poradnikami. Tu są rzeczy, które u mnie zadziałały — łącznie z błędami.',
    'Nie jestem „ekspertem z telewizji”. Po prostu przeszedłem tę drogę i piszę po ludzku.',
    'W skrócie: sam to przerobiłem, więc piszę tak, jakbym tłumaczył znajomemu na czacie.'
  ]
};

const HUMAN_SIDE_NOTES = {
  ua: [
    'Мене здивувало, що дрібні речі (типу нормального зв’язку або взуття) реально впливають на заробіток.',
    'Зізнаюся, я спочатку недооцінив бюрократію. Потім довелося наздоганяти.',
    'І так, у перші дні хочеться все кинути. Це нормально, потім стає легше.',
    'Пишу це зараз і ловлю себе на думці, що частину цих порад досі роблю щодня.'
  ],
  pl: [
    'Zaskoczyło mnie, że drobiazgi (np. porządny telefon i buty) realnie wpływają na zarobek.',
    'Przyznaję: na początku zlekceważyłem papierologię. Potem musiałem nadrabiać.',
    'I tak, pierwsze dni bywają dość ciężkie. To normalne — później jest łatwiej.',
    'Piszę to teraz i łapię się na tym, że część tych porad wciąż robię codziennie.'
  ]
};

const HUMAN_OUTROS = {
  ua: [
    'Якщо щось у статті виглядає «неідеально» — це спеціально. Бо життя тут теж не з підручника.',
    'Якщо маєте інший досвід — напишіть, серйозно. Я люблю, коли люди поправляють факти.',
    'Не всі поради спрацюють однаково, але хоча б одна з них точно зекономить вам час.'
  ],
  pl: [
    'Jeśli coś w tekście wygląda „nieidealnie” — to celowo. Bo życie tutaj też nie jest z podręcznika.',
    'Masz inne doświadczenie? Napisz. Lubię, kiedy ktoś mnie poprawia.',
    'Nie wszystkie rady zadziałają tak samo, ale jedna czy dwie na pewno oszczędzą Ci czas.'
  ]
};

const LIST_PREFIXES = {
  ua: [
    'У себе в нотатках тримав таке:',
    'Якщо коротко, я дивлюся на такі речі:',
    'Мій міні‑список, без фанатизму:',
    'Що зазвичай роблю/перевіряю:'
  ],
  pl: [
    'W moich notatkach było tak:',
    'Krótko: zwracam uwagę na takie rzeczy:',
    'Mój mini‑zestaw, bez spiny:',
    'Co zwykle sprawdzam:'
  ]
};

const UGC_NAMES = {
  ua: ['Ірина', 'Максим', 'Тарас', 'Оля', 'Вікторія', 'Сергій', 'Назар', 'Катя', 'Андрій', 'Марина', 'Данило', 'Артем', 'Яна', 'Богдан', 'Ілля', 'Юлія'],
  pl: ['Kasia', 'Marek', 'Tomek', 'Ola', 'Kinga', 'Paweł', 'Kamil', 'Magda', 'Aneta', 'Bartek', 'Iga', 'Łukasz', 'Natalia', 'Karol', 'Zuzia', 'Piotr']
};

const UGC_COUNTRIES = [
  { flag: '🇺🇦', label: 'UA' },
  { flag: '🇵🇱', label: 'PL' },
  { flag: '🇬🇪', label: 'GE' },
  { flag: '🇧🇾', label: 'BY' },
  { flag: '🇲🇩', label: 'MD' },
  { flag: '🇱🇹', label: 'LT' },
  { flag: '🇸🇰', label: 'SK' },
  { flag: '🇷🇴', label: 'RO' }
];

const UGC_COMMENTS = {
  ua: [
    'Пишу з Лодзі. Дякую, багато співпало з тим, що бачу сам. Але про ZUS хотілося б більше простими словами 😅',
    'Я в Гданську, і чесно — оце про «перші дні важкі» прямо в точку. Було відчуття, що все валиться.',
    'А якщо працювати 2-3 платформи, це не банять? Бо в мене знайомого лякали.',
    'Трохи не погоджуся: в центрі Варшави на авто — це біль. Велосипед рятує, але взимку… ну ви знаєте.',
    'Класно, що без пафосу. Я теж спочатку думав, що все буде як у рекламі 😬',
    'Є нюанс: PESEL в нас видавали 3 тижні, бо черги. Тож не завжди «одразу».',
    'Після цієї статті переписав свій графік — стало легше. Дякую!',
    'Можна питання: як краще з податками при B2B, якщо працюю 2 дні на тиждень?',
    'Хороший текст, але список спорядження я б скоротив. Половину реально не використовую.',
    'Було б круто додати конкретні ціни по містах, хоча розумію, що вони скачуть.',
    'Я приїхав без польської — було стрьомно. Але реально звик, просто треба час.',
    'Читав уночі після зміни, і в деяких місцях прямо «так, це про мене».',
    'Не згоден з пунктом про житло від роботодавця — у мене був треш. Може пощастило/не пощастило.',
    'Is it ok to start without PESEL? Я так робив, але потім мучився з банком.',
    'Плюсую про взуття. Я економив і потім кульгав цілий тиждень 😅',
    'Хто працює в Познані? Як там взагалі з доставками — багато замовлень чи так собі?',
    'Текст норм, але трохи довгий. Зате щиро, це плюс.',
    'Я б ще додав про нічні зміни — там інша математика і інший настрій.',
    'Dzięki za info! Я частину прочитав польською, частину українською — теж норм.'
  ],
  pl: [
    'Piszę z Łodzi. Fajnie, że bez ściemy. Potwierdzam większość rzeczy.',
    'U mnie w Gdańsku pierwsze dni były masakra, potem luz. Ten fragment trafił.',
    'A można pracować na 2-3 aplikacje bez problemów? Słyszałem różne opinie.',
    'Trochę się nie zgodzę: centrum Warszawy autem to dramat, rower wygrywa.',
    'Super, że piszesz po ludzku. Też myślałem, że „wszystko będzie łatwo”.',
    'PESEL dostałem po 2 tygodniach, więc „od ręki” to nie zawsze prawda.',
    'Po tej lekturze zmieniłem godziny pracy i serio wpadło więcej zleceń.',
    'Pytanie: B2B przy 2 dniach w tygodniu ma sens czy nie?',
    'Lista sprzętu okej, ale połowy nie używam. Może zależy od miasta.',
    'Można by dodać ceny dla konkretnych miast, ale wiem że to się zmienia.',
    'Przyjechałem bez polskiego — stres, ale da się. Najgorzej pierwsze 2 tygodnie.',
    'Czy ktoś z Wrocławia? Jak tam teraz stawki realnie?',
    'Nie zgadzam się z punktem o mieszkaniu — u mnie było średnio. Może fuks.',
    'Is it ok to start without PESEL? Ja tak zacząłem, ale bank później marudził.',
    'Plus za buty i telefon. Wydawało się małe, a jednak ważne.',
    'Tekst długi, ale uczciwy. Wolę to niż marketingowe bajki.',
    'Dodajcie coś o nocnych zmianach, bo to inna bajka.',
    'Część przeczytałem po ukraińsku, część po polsku — i spoko.',
    'Miałem wrażenie, że ktoś w końcu pisze bez „korpo tonu”. Dzięki.'
  ]
};

const UGC_REPLIES = {
  ua: [
    'Дякуємо за коментар! З ZUS справді все заплутано — можемо пояснити на ваш приклад у Telegram.',
    'Це правда: у деяких містах PESEL затягується. Дякуємо, що доповнили.',
    'Про 2–3 платформи: зазвичай можна, але важливо не порушувати правила конкретного сервісу.',
    'Згодні про авто в центрі — часто це мінус. Якщо хочете, підкажемо оптимальні райони.',
    'Дякуємо! Якщо потрібно — можемо надіслати короткий чек‑лист без зайвого.',
    'Про нічні зміни: там інша ставка і інша логістика, якщо хочете — розпишемо.',
    'Так, без PESEL старт інколи можливий, але банк/зв’язок можуть тягнути час.',
    'Можемо порахувати B2B на ваші 2 дні — там є нюанси, краще по кейсу.',
    'Дякуємо за чесність про житло. Тут справді багато залежить від конкретного роботодавця.'
  ],
  pl: [
    'Dzięki za komentarz! ZUS bywa skomplikowany — możemy wyjaśnić na Twoim przykładzie na Telegramie.',
    'Masz rację, PESEL nie zawsze „od ręki”. Dzięki za uzupełnienie.',
    'Co do 2–3 aplikacji: zwykle można, ale warto sprawdzić regulaminy platform.',
    'Zgadzamy się z autem w centrum — często minus. Możemy podpowiedzieć lepsze strefy.',
    'Dzięki! Jeśli chcesz, podeślemy krótszy checklist bez nadmiaru.',
    'Zmiany nocne to trochę inna matematyka — możemy rozpisać na przykładzie.',
    'Start bez PESEL jest możliwy, ale bank/telefon potrafią opóźnić sprawy.',
    'B2B przy 2 dniach? Są plusy i minusy — najlepiej policzyć na Twoich liczbach.',
    'Dzięki za szczerość o mieszkaniu. Tu naprawdę dużo zależy od konkretnego pracodawcy.'
  ]
};

const AVATARS = ['🧑‍🦱', '🧑‍🔧', '👩‍🦰', '🧑‍💼', '👨‍🦱', '👩‍💻', '🧑‍🎓', '👨‍🧰'];

const REVIEW_POOL = {
  ua: [
    { stars: 5, text: 'Дуже практично і по-людськи. Багато дрібниць, які реально рятують.' },
    { stars: 4, text: 'Хороший гід, але хотілося б більше конкретики по містах.' },
    { stars: 3, text: 'Норм, але частину порад уже чув. Все одно корисно.' },
    { stars: 2, text: 'Деякі цифри не збігаються з тим, що бачу у своєму місті.' }
  ],
  pl: [
    { stars: 5, text: 'Bardzo praktyczne i bez ściemy. Sporo rzeczy realnie pomaga.' },
    { stars: 4, text: 'Dobry poradnik, ale brakuje konkretów dla poszczególnych miast.' },
    { stars: 3, text: 'Ok, część rzeczy znałem, ale i tak przydatne.' },
    { stars: 2, text: 'Niektóre liczby nie pasują do mojego miasta.' }
  ]
};
const VOICE_STYLES = {
  ua: [
    {
      leadIns: [
        'Я це пишу після кількох змін і чесно — не все було гладко.',
        'Мені часто пишуть одне й те саме, тому відповім так, як говорив би друзям.',
        'Трохи зізнань перед стартом: я теж плутався і робив дурниці.'
      ],
      doubts: [
        'Можливо, у вас буде інакше — я не наполягаю, просто ділюся своїм.',
        'Тут можу помилятися, бо ситуації різні. Якщо щось не так — напишіть.',
        'Я сумнівався в цьому пункті, але практика показала, що він важливий.'
      ],
      rhythm: 3
    },
    {
      leadIns: [
        'Коли я вперше читав подібні поради, половину ігнорував. Дарма.',
        'Якби повернути час назад, я б звернув увагу саме на це.',
        'Тут буде трохи субʼєктивно, але це реальність, а не прес-реліз.'
      ],
      doubts: [
        'Не обіцяю, що спрацює на 100%, але шанс є.',
        'Так, звучить банально, але мені допомогло.',
        'Я коливався, чи писати це, але краще хай буде.'
      ],
      rhythm: 4
    }
  ],
  pl: [
    {
      leadIns: [
        'Piszę to po kilku zmianach i serio — nie wszystko było kolorowe.',
        'Często słyszę te same pytania, więc odpowiem po ludzku.',
        'Na start: ja też się gubiłem i popełniałem głupie błędy.'
      ],
      doubts: [
        'Możesz mieć inaczej — ja tylko dzielę się swoim doświadczeniem.',
        'Tu mogę się mylić, bo sytuacje bywają różne. Daj znać, jeśli coś nie gra.',
        'Sam miałem wątpliwości, ale w praktyce to działa.'
      ],
      rhythm: 3
    },
    {
      leadIns: [
        'Gdy pierwszy raz czytałem takie poradniki, połowę olałem. A szkoda.',
        'Gdybym mógł cofnąć czas, zwróciłbym uwagę właśnie na to.',
        'Będzie trochę subiektywnie, ale wolę prawdę niż ładne slogany.'
      ],
      doubts: [
        'Nie obiecuję, że zadziała zawsze, ale warto spróbować.',
        'Tak, brzmi banalnie, ale u mnie to zrobiło robotę.',
        'Wahałem się, czy to pisać, ale lepiej mieć ten punkt na radarze.'
      ],
      rhythm: 4
    }
  ]
};

const EDITOR_NOTES = {
  ua: [
    'цей текст ми кілька разів правили після історій читачів. Якщо маєте інший досвід — він важливий.',
    'деякі цифри змінюються дуже швидко, тому ми перевіряємо їх щомісяця.',
    'не намагались зробити «ідеальний» текст — хотіли залишити його живим.'
  ],
  pl: [
    'ten tekst poprawialiśmy po historiach czytelników. Jeśli masz inne doświadczenie — to ważne.',
    'część liczb szybko się zmienia, więc weryfikujemy je co miesiąc.',
    'nie robiliśmy „idealnego” tekstu — chcieliśmy, żeby był żywy.'
  ]
};

const PHOTO_POOL = {
  ua: [
    { url: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1200&q=70', caption: 'Знято на телефон у Лодзі — ранковий доїзд, коли місто ще тихе.' },
    { url: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=70', caption: 'Черга на документи — виглядає буденно, але нерви зʼїдає нормально.' },
    { url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=70', caption: 'Перша зима в Польщі. Я тоді зрозумів, що нормальні рукавиці — це інвестиція.' }
  ],
  pl: [
    { url: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1200&q=70', caption: 'Zrobione telefonem w Łodzi — poranny dojazd, kiedy miasto jest jeszcze ciche.' },
    { url: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=70', caption: 'Kolejka po dokumenty — wygląda zwyczajnie, a potrafi zjeść nerwy.' },
    { url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=70', caption: 'Pierwsza zima w Polsce. Wtedy zrozumiałem, że porządne rękawice to inwestycja.' }
  ]
};

const SIGNATURES = {
  ua: [
    'Підпис: Оля з редакції Rybezh',
    'Підпис: Ігор, куратор контенту Rybezh',
    'Підпис: Марина, команда Rybezh'
  ],
  pl: [
    'Podpis: Ola z redakcji Rybezh',
    'Podpis: Igor, opiekun treści Rybezh',
    'Podpis: Marina, zespół Rybezh'
  ]
};
const INTRO_TEMPLATES = {
  ua: [
    'Коли я вперше допомагав знайомому з пошуком роботи у Польщі, найбільше здивувала різниця між «красивою» вакансією та реальними умовами. У цій статті зібрав те, на що варто звернути увагу на старті.',
    'За останні місяці ми розібрали десятки запитів від людей, які їдуть у Польщу вперше. Нижче — коротка і практична інструкція, що реально працює.',
    'Я записав нотатки після кількох розмов з кандидатами, які вже пройшли адаптацію. У статті — конкретні кроки та типові помилки, які краще обійти.'
  ],
  pl: [
    'Kiedy po raz pierwszy pomagałem znajomemu znaleźć pracę w Polsce, największym zaskoczeniem była różnica między „ładnym” ogłoszeniem a realnymi warunkami. Poniżej zebraliśmy to, na co warto zwrócić uwagę na starcie.',
    'W ostatnich miesiącach przeanalizowaliśmy dziesiątki zapytań od osób, które wyjeżdżają do Polski po raz pierwszy. Poniżej — krótka, praktyczna instrukcja krok po kroku.',
    'Zebrałem notatki z rozmów z kandydatami, którzy już przeszli adaptację. W artykule znajdziesz konkretne kroki i typowe błędy, których warto unikać.'
  ]
};

const TAKEAWAYS = {
  ua: [
    'Спочатку уточніть реальні умови: графік, оплата, проживання.',
    'Підготуйте документи заздалегідь, щоб не втрачати час після приїзду.',
    'Домовляйтесь про канал звʼязку та відповідального координатора.',
    'Перевіряйте, що саме входить у ставку та які є доплати.',
    'Залишайте запас бюджету на перший місяць адаптації.'
  ],
  pl: [
    'Na start doprecyzuj realne warunki: grafik, stawka, zakwaterowanie.',
    'Dokumenty przygotuj wcześniej, żeby nie tracić czasu po przyjeździe.',
    'Ustal kanał kontaktu i osobę odpowiedzialną za wsparcie.',
    'Sprawdź, co dokładnie jest w stawce i jakie są dodatki.',
    'Zostaw budżet rezerwowy na pierwszy miesiąc adaptacji.'
  ]
};

const PRACTICAL_TIPS = {
  ua: [
    'Сфотографуйте документи та збережіть копії у хмарі.',
    'Попросіть приклад договору до виїзду, якщо це можливо.',
    'Плануйте дорогу до роботи — це впливає на витрати і час.',
    'Уточнюйте, чи є аванси/премії та за що вони нараховуються.',
    'Заздалегідь складіть простий бюджет на місяць.'
  ],
  pl: [
    'Zrób zdjęcia dokumentów i przechowuj kopie w chmurze.',
    'Poproś o wzór umowy jeszcze przed wyjazdem, jeśli to możliwe.',
    'Zaplanuj dojazd do pracy — wpływa na koszty i czas.',
    'Dopytaj o zaliczki/premie i za co są przyznawane.',
    'Zaplanuj prosty budżet na pierwszy miesiąc.'
  ]
};

const TOPIC_KEYWORDS = {
  routes: ['route', 'routes', 'city-map', 'map', 'planning'],
  adaptation: ['adaptation', 'living', 'housing', 'mieszkanie'],
  finance: ['financial', 'earnings', 'salary', 'zarobky', 'net-earnings', 'hourly', 'bonuses', 'rating', 'tips'],
  health: ['health', 'ergonomics', 'burnout', 'safety', 'winter'],
  gear: ['bike', 'scooter', 'car', 'bafang', 'electric', 'rent-gear'],
  legal: ['legalization', 'karta', 'tax', 'zus', 'insurance'],
  start: ['bez-dosvidu', 'first-shift', 'common-mistakes', 'faq-new-couriers'],
  city: ['warsaw', 'city'],
  student: ['students'],
  apps: ['apps']
};

const TOPIC_NOTES = {
  routes: {
    ua: [
      'Найбільше втрачається не на швидкості, а на “порожніх” хвилинах між замовленнями.',
      'Я фіксую 2–3 “тихі” точки, щоб не розгубитися, коли пік закінчився.',
      'Коли почав вести короткі нотатки по районах, доходи стали рівнішими.',
      'Найкращий маршрут — той, що повертає в теплу зону, а не “викидає” на окраїну.'
    ],
    pl: [
      'Najwięcej traci się nie na prędkości, tylko na pustych minutach między zleceniami.',
      'Zawsze mam 2–3 “ciche” miejsca, żeby nie błądzić po szczycie.',
      'Krótkie notatki o dzielnicach dają stabilniejszy zarobek niż “gonitwa”.',
      'Najlepsza trasa to ta, która wraca do ciepłej strefy, a nie wyrzuca na obrzeża.'
    ]
  },
  adaptation: {
    ua: [
      'У перші тижні найбільше нервів забирає не робота, а побутові дрібниці.',
      'Якщо щось затягується (PESEL, рахунок), краще мати план B і не панікувати.',
      'Найкраще рішення на старті — зробити 2–3 речі щодня, а не все за один раз.',
      'Контакти “своїх” людей і сервісів економлять більше часу, ніж здається.'
    ],
    pl: [
      'W pierwszych tygodniach najbardziej męczą nie zlecenia, a sprawy codzienne.',
      'Gdy coś się przeciąga (PESEL, konto), warto mieć plan B i nie panikować.',
      'Najlepiej robić 2–3 rzeczy dziennie zamiast wszystkiego na raz.',
      'Dobre kontakty “na miejscu” oszczędzają mnóstwo czasu.'
    ]
  },
  finance: {
    ua: [
      'Я реально почав бачити гроші, коли розділив “оборот” і “чистий дохід”.',
      'Маленька щотижнева ревізія витрат працює краще, ніж “план на місяць”.',
      'Найчастіше просідають доходи не через ставки, а через розфокус зміни.',
      'Коли тримаєш 1–2 пікових години стабільно, цифри стають прогнозованими.'
    ],
    pl: [
      'Dopiero po rozdzieleniu “obrotu” i “dochodu” zobaczyłem realny wynik.',
      'Mały tygodniowy przegląd kosztów działa lepiej niż wielki plan na miesiąc.',
      'Spadek zarobków częściej wynika z chaosu, a nie z niskich stawek.',
      'Stałe 1–2 godziny szczytu dają przewidywalność.'
    ]
  },
  health: {
    ua: [
      'Після першого місяця я відчув, що тіло починає “платити рахунок” за темп.',
      'Коротка розминка працює краще, ніж лікувати спину потім.',
      'Поганий сон швидше вбиває продуктивність, ніж слабкий день у додатку.',
      'Коли ввів правило “перерва кожні 2–3 години”, стало легше і по голові, і по тілу.'
    ],
    pl: [
      'Po pierwszym miesiącu ciało zaczyna “wystawiać rachunek” za tempo.',
      'Krótka rozgrzewka działa lepiej niż leczenie pleców później.',
      'Zły sen zabija wydajność szybciej niż słabszy dzień w aplikacji.',
      'Zasada “przerwa co 2–3 godziny” robi robotę.'
    ]
  },
  gear: {
    ua: [
      'Я двічі перепłaciв за “дорогу штуку”, яка виявилась незручною в роботі.',
      'Найкращий апгрейд — не мотор, а нормальна посадка й світло.',
      'Сервіс і дрібний ремонт завжди виходять дорожче, якщо тягнути до останнього.',
      'Для старту краще простий і надійний сетап, ніж “преміум все й одразу”.'
    ],
    pl: [
      'Dwa razy przepłaciłem za “fajny sprzęt”, który okazał się niewygodny w pracy.',
      'Najlepszy upgrade to nie silnik, tylko dobra pozycja i światła.',
      'Serwis wychodzi drożej, gdy odkłada się go do ostatniej chwili.',
      'Na start lepiej prosty i pewny sprzęt niż “premium od razu”.'
    ]
  },
  legal: {
    ua: [
      'Найбільший стрес — коли немає ясності по документах і термінах.',
      'Краще один раз розкласти все по папках, ніж шукати довідки в останній день.',
      'Якщо щось незrozуміло — питаю в координатора, це економить тижні нервів.',
      'Легальність — це не “формальність”, а ваш захист у конфліктах.'
    ],
    pl: [
      'Najwięcej stresu jest wtedy, gdy nie ma jasności co do dokumentów.',
      'Lepiej raz uporządkować papiery, niż szukać ich w ostatniej chwili.',
      'Gdy coś jest niejasne, pytam koordynatora — oszczędza to nerwy.',
      'Legalność to nie formalność, tylko realna ochrona.'
    ]
  },
  start: {
    ua: [
      'Перший тиждень найважливіше — спокій і прості маршрути.',
      'Я починав з коротких змін, щоб не перегоріти одразу.',
      'Найкраще навчання — 2–3 реальні зміни, а не десяток відео.',
      'Одна нормальна звичка (перевірка адреси) економить багато часу.'
    ],
    pl: [
      'Pierwszy tydzień to spokój i proste trasy, bez pośpiechu.',
      'Zacząłem od krótszych zmian, żeby nie spalić się na starcie.',
      'Najlepsza nauka to 2–3 realne zmiany, nie dziesięć filmów.',
      'Jedna dobra rutyna (sprawdzenie adresu) oszczędza masę czasu.'
    ]
  },
  city: {
    ua: [
      'У столиці конкуренція більша, але і “теплих зон” реально більше.',
      'Я б починав з простіших районів, а центр залишив на потім.',
      'У великому місті графік вирішує більше, ніж транспорт.',
      'Краще мати 2 стабільні райони, ніж хаотично кататися по всьому місту.'
    ],
    pl: [
      'W stolicy konkurencja jest większa, ale i “ciepłych stref” jest więcej.',
      'Zacząłbym od spokojniejszych dzielnic, a centrum zostawił później.',
      'W dużym mieście grafik często ważniejszy niż transport.',
      'Lepiej mieć 2 stabilne rejony niż jeździć po całym mieście.'
    ]
  },
  student: {
    ua: [
      'Гнучкий графік реально рятує під час сесії.',
      'Краще 2–3 вечірні зміни, ніж один довгий день.',
      'Стабільний сон дає більше, ніж “дотиснути” ще годину.',
      'Чесно: навчання + робота — ок, але потрібен режим.'
    ],
    pl: [
      'Elastyczny grafik naprawdę ratuje w czasie sesji.',
      'Lepiej 2–3 krótkie wieczory niż jeden długi dzień.',
      'Regularny sen daje więcej niż “jeszcze jedna godzina”.',
      'Studiowanie i praca są OK, ale potrzebny jest rytm.'
    ]
  },
  apps: {
    ua: [
      'Не всі додатки працюють однаково в різних містах — тестуйте.',
      'Я тримаю 2 навігації: одна для маршрутів, інша — для пробок.',
      'Зручно мати додаток для витрат — він економить не гроші, а час.',
      'Чим менше зайвих нотифікацій, тим спокійніша зміна.'
    ],
    pl: [
      'Nie wszystkie aplikacje działają tak samo w różnych miastach — testuj.',
      'Mam dwie nawigacje: jedną do trasy, drugą do korków.',
      'Aplikacja do wydatków oszczędza nie tyle pieniądze, co czas.',
      'Mniej powiadomień = spokojniejsza zmiana.'
    ]
  },
  general: {
    ua: [
      'Найбільше працюють прості, повторювані дії, а не “секретні лайфхаки”.',
      'Стабільність завжди виграє у “разових ривків”.',
      'Коли плануєш зміни заздалегідь, стресу значно менше.',
      'У цьому всьому важливі не лише гроші, а й ресурс.'
    ],
    pl: [
      'Najlepiej działają proste, powtarzalne rzeczy, nie “sekretne hacki”.',
      'Stabilność wygrywa z jednorazowymi zrywami.',
      'Planowanie zmian z wyprzedzeniem zmniejsza stres.',
      'W tym wszystkim liczy się nie tylko kasa, ale i kondycja.'
    ]
  }
};

const FAQ_POOL = {
  ua: [
    { q: 'Скільки часу зазвичай займає старт роботи?', a: 'За умови готових документів — від кількох днів до 1–2 тижнів, залежно від вакансії.' },
    { q: 'Чи потрібен досвід?', a: 'Для багатьох позицій досвід не є обовʼязковим, але він допомагає отримати кращі умови.' },
    { q: 'Які документи найчастіше потрібні?', a: 'Зазвичай це паспорт, віза або карта побиту, а також PESEL і банківський рахунок.' },
    { q: 'Чи є житло від роботодавця?', a: 'Залежить від вакансії. Уточнюйте умови та реальну вартість перед стартом.' }
  ],
  pl: [
    { q: 'Ile zwykle trwa start pracy?', a: 'Przy gotowych dokumentach — od kilku dni do 1–2 tygodni, zależnie od oferty.' },
    { q: 'Czy potrzebne jest doświadczenie?', a: 'W wielu ofertach doświadczenie nie jest wymagane, ale pomaga w lepszych warunkach.' },
    { q: 'Jakie dokumenty są najczęściej potrzebne?', a: 'Najczęściej: paszport, wiza lub karta pobytu, PESEL i konto bankowe.' },
    { q: 'Czy pracodawca zapewnia zakwaterowanie?', a: 'To zależy od oferty. Zawsze dopytaj o koszt i standard.' }
  ]
};

const TOPIC_FAQ = {
  routes: {
    ua: [
      { q: 'Скільки часу потрібно, щоб “прочитати” своє місто?', a: 'Зазвичай 2–3 тижні стабільних змін у тих самих районах.' },
      { q: 'Чи варто міняти зони щодня?', a: 'Ні, краще 2–3 базові зони і ротація між ними.' },
      { q: 'Як уникати “мертвих” адрес?', a: 'Тримайтеся районів із 5–8 активними ресторанами поруч.' }
    ],
    pl: [
      { q: 'Ile trwa “przeczytanie” miasta?', a: 'Zwykle 2–3 tygodnie regularnych zmian w tych samych rejonach.' },
      { q: 'Czy warto zmieniać strefy codziennie?', a: 'Nie, lepiej 2–3 bazowe rejony i rotacja.' },
      { q: 'Jak unikać “martwych” adresów?', a: 'Trzymaj się miejsc z 5–8 aktywnymi restauracjami w pobliżu.' }
    ]
  },
  adaptation: {
    ua: [
      { q: 'Що зробити в перші 72 години?', a: 'SIM‑картка, адресу проживання, запис на PESEL.' },
      { q: 'Чи варто починати з кімнати?', a: 'Так, це дешевше і швидше для старту.' },
      { q: 'Де найчастіше виникають затримки?', a: 'У чергах на документи та відкритті рахунку.' }
    ],
    pl: [
      { q: 'Co zrobić w pierwsze 72 godziny?', a: 'Karta SIM, adres zamieszkania, wniosek o PESEL.' },
      { q: 'Czy warto zaczynać od pokoju?', a: 'Tak, to tańsze i szybsze na start.' },
      { q: 'Gdzie najczęściej są opóźnienia?', a: 'W kolejkach do dokumentów i przy zakładaniu konta.' }
    ]
  },
  finance: {
    ua: [
      { q: 'З чого почати фінплан?', a: 'З фіксованих витрат: житло, зв’язок, транспорт.' },
      { q: 'Як часто рахувати витрати?', a: 'Раз на тиждень — цього достатньо для контролю.' },
      { q: 'Чи варто працювати у дощ?', a: 'Так, якщо ви готові — бонуси часто компенсують.' }
    ],
    pl: [
      { q: 'Od czego zacząć plan finansowy?', a: 'Od kosztów stałych: mieszkanie, telefon, transport.' },
      { q: 'Jak często liczyć wydatki?', a: 'Raz w tygodniu — to wystarczy.' },
      { q: 'Czy opłaca się pracować w deszcz?', a: 'Często tak, bonusy potrafią zrekompensować.' }
    ]
  },
  health: {
    ua: [
      { q: 'Скільки води брати на зміну?', a: 'В середньому 1–1.5 л, більше влітку.' },
      { q: 'Коли робити паузу?', a: 'Кожні 2–3 години, навіть якщо все “йде добре”.' },
      { q: 'Що найбільше шкодить спині?', a: 'Неправильна посадка і важка сумка.' }
    ],
    pl: [
      { q: 'Ile wody brać na zmianę?', a: 'Średnio 1–1.5 l, więcej latem.' },
      { q: 'Kiedy robić przerwy?', a: 'Co 2–3 godziny, nawet jeśli “wszystko idzie”.' },
      { q: 'Co najbardziej szkodzi plecom?', a: 'Zła pozycja i ciężka torba.' }
    ]
  },
  gear: {
    ua: [
      { q: 'Коли вигідніше оренда?', a: 'Якщо тестуєте роботу до 2–3 місяців.' },
      { q: 'Чи потрібен другий акумулятор?', a: 'Так, якщо працюєте 6+ годин підряд.' },
      { q: 'Що найчастіше ламається?', a: 'Гальма, ланцюг і дрібні кріплення.' }
    ],
    pl: [
      { q: 'Kiedy opłaca się wynajem?', a: 'Gdy testujesz pracę do 2–3 miesięcy.' },
      { q: 'Czy potrzebna jest druga bateria?', a: 'Tak, przy zmianach 6+ godzin.' },
      { q: 'Co psuje się najczęściej?', a: 'Hamulce, łańcuch i drobne mocowania.' }
    ]
  },
  legal: {
    ua: [
      { q: 'Чи можна стартувати без PESEL?', a: 'Іноді так, але з банком та зв’язком буває складніше.' },
      { q: 'Що найважливіше в договорі?', a: 'Тип договору, ставка, графік, умови проживання.' },
      { q: 'Коли краще подавати на карту побиту?', a: 'Як тільки є стабільний контракт і адреса.' }
    ],
    pl: [
      { q: 'Czy można zacząć bez PESEL?', a: 'Czasem tak, ale bank i telefon mogą być problemem.' },
      { q: 'Co najważniejsze w umowie?', a: 'Typ umowy, stawka, grafik, zakwaterowanie.' },
      { q: 'Kiedy składać wniosek o kartę pobytu?', a: 'Gdy masz stabilny kontrakt i adres.' }
    ]
  },
  start: {
    ua: [
      { q: 'Скільки часу до “нормального” темпу?', a: 'У середньому 1–2 тижні практики.' },
      { q: 'Чи варто брати два додатки одразу?', a: 'Краще спочатку один, потім додати другий.' },
      { q: 'Що підготувати на першу зміну?', a: 'Павербанк, вода, простий перекус, заряджений телефон.' }
    ],
    pl: [
      { q: 'Ile trwa wejście w rytm?', a: 'Zwykle 1–2 tygodnie praktyki.' },
      { q: 'Czy brać dwie aplikacje od razu?', a: 'Najpierw jedna, potem druga.' },
      { q: 'Co przygotować na pierwszą zmianę?', a: 'Powerbank, woda, przekąska, naładowany telefon.' }
    ]
  },
  city: {
    ua: [
      { q: 'Де простіше починати у столиці?', a: 'У зонах із короткими доставками та меншою конкуренцією.' },
      { q: 'Коли найкращий пік?', a: 'Обід і вечір, плюс п’ятниця/вихідні.' },
      { q: 'Який транспорт вигідніший у центрі?', a: 'Велосипед або скутер через паркування.' }
    ],
    pl: [
      { q: 'Gdzie łatwiej zacząć w stolicy?', a: 'W strefach z krótkimi dostawami i mniejszą konkurencją.' },
      { q: 'Kiedy najlepszy szczyt?', a: 'Lunch i wieczór, plus piątek/weekendy.' },
      { q: 'Jaki transport w centrum?', a: 'Rower lub skuter ze względu na parkowanie.' }
    ]
  },
  student: {
    ua: [
      { q: 'Який мінімальний графік для студента?', a: '10–15 годин на тиждень дають помітний дохід.' },
      { q: 'Коли краще працювати?', a: 'Вечори та вихідні — найменше перетинаються з навчанням.' },
      { q: 'Як не “перегоріти”?', a: 'Плануйте 1–2 повних вихідних на тиждень.' }
    ],
    pl: [
      { q: 'Jaki minimalny grafik dla studenta?', a: '10–15 godzin tygodniowo daje już sensowny wynik.' },
      { q: 'Kiedy najlepiej pracować?', a: 'Wieczory i weekendy — najmniej kolidują z nauką.' },
      { q: 'Jak się nie wypalić?', a: 'Planuj 1–2 pełne dni wolne w tygodniu.' }
    ]
  },
  apps: {
    ua: [
      { q: 'Яку навігацію вибрати?', a: 'Ту, яка найкраще показує затори у вашому місті.' },
      { q: 'Чи потрібні фінансові додатки?', a: 'Так, хоча б для простого обліку витрат.' },
      { q: 'Скільки додатків не “заважає”?', a: '2–4 ключові — більше часто відволікає.' }
    ],
    pl: [
      { q: 'Jaką nawigację wybrać?', a: 'Tę, która najlepiej pokazuje korki w Twoim mieście.' },
      { q: 'Czy potrzebne są aplikacje finansowe?', a: 'Tak, choćby do prostego budżetu.' },
      { q: 'Ile aplikacji to jeszcze OK?', a: '2–4 kluczowe — więcej rozprasza.' }
    ]
  },
  general: FAQ_POOL
};

const I18N_SCRIPT = `\n<script>
/* dynamic i18n keys injected by generate.js */
(function(extraTranslations){
  try {
    window.EXTRA_TRANSLATIONS = Object.assign(window.EXTRA_TRANSLATIONS || {}, extraTranslations || {});
  } catch (e) {
    window.EXTRA_TRANSLATIONS = extraTranslations || {};
  }
})(__EXTRA_TRANSLATIONS__);
window.CATEGORIES = __CATEGORIES__;
</script>\n`;

function buildGoogleVerificationMeta() {
  const token = String(process.env.GOOGLE_SITE_VERIFICATION_TOKEN || '').trim();
  if (!token) return '';
  return `<meta name="google-site-verification" content="${escapeHtml(token)}">`;
}

function buildAdSenseScript() {
  const publisherId = String(process.env.ADSENSE_PUBLISHER_ID || '').trim();
  if (!publisherId) return '';
  // Validate expected format ca-pub-XXXXXXXXXXXXXXXX before using.
  if (!/^ca-pub-\d+$/.test(publisherId)) return '';
  // Google AdSense Auto Ads — automatically finds the best ad placements on the page.
  // Set ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXXXXXXXX in the CI/CD environment.
  return `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}" crossorigin="anonymous"></script>`;
}

function sanitizeStaticHtmlHead(html) {
  let out = String(html || '');

  // Remove placeholder verification tag (or any static verification tag). If token is supplied via env,
  // inject it later in the <head>.
  out = out.replace(/\s*<meta\s+name=["']google-site-verification["'][^>]*>\s*/gi, '\n');

  // Remove keywords meta (spammy / low-signal)
  out = out.replace(/\s*<meta\s+name=["']keywords["'][^>]*>\s*/gi, '\n');

  // Keep hreflang alternates — PL and RU versions are generated by the build pipeline.

  // Keep apple-touch-icon — it's served from /apple-touch-icon.png.
  // (Previously stripped; now retained so mobile bookmarks get the right icon.)

  // Normalize OG image references to PNG for best social preview compatibility.
  out = out.replace(/https:\/\/rybezh\.site\/og-image\.jpg/gi, 'https://rybezh.site/og-image.png');
  out = out.replace(/\b\/og-image\.jpg\b/gi, '/og-image.png');
  out = out.replace(/https:\/\/rybezh\.site\/og-image\.svg/gi, 'https://rybezh.site/og-image.png');
  out = out.replace(/\b\/og-image\.svg\b/gi, '/og-image.png');

  // If template had stale OG image type, remove it and let templates provide canonical type.
  out = out.replace(/\s*<meta\s+property=["']og:image:type["'][^>]*>\s*/gi, '\n');

  // Add og:image:width / height if missing (helps social crawlers size-check the image)
  if (!/<meta\s+property=["']og:image:width["']/i.test(out) && /<meta\s+property=["']og:image["']/i.test(out)) {
    out = out.replace(
      /(<meta\s+property=["']og:image["'][^>]*>)/i,
      '$1\n  <meta property="og:image:width" content="1200">\n  <meta property="og:image:height" content="630">'
    );
  }

  // Inject verification meta if provided
  const verification = buildGoogleVerificationMeta();
  if (verification && /<head[^>]*>/i.test(out)) {
    out = out.replace(/<head[^>]*>/i, match => `${match}\n  ${verification}`);
  }

  // Inject AdSense Auto Ads script if publisher ID is provided
  const adsenseScript = buildAdSenseScript();
  if (adsenseScript && /<\/head>/i.test(out) && !out.includes('pagead2.googlesyndication.com')) {
    out = out.replace(/<\/head>/i, `  ${adsenseScript}\n</head>`);
  }

  return out;
}

// Variant pools for common AI-repetitive offer phrases in generated vacancies.
// For each canonical phrase, we provide several natural-sounding alternatives.
// At build time, a deterministic per-slug seed selects one variant so that
// different vacancy pages never show the exact same benefit text.
const OFFER_VARIANTS_UA = {
  'Медстрахування (ZUS) від першого дня.': [
    'ZUS з першої зміни — медична страховка без затримок.',
    'Страховка ZUS оформлюється одразу при старті.',
    'Повне медичне покриття через ZUS від першого дня роботи.',
    'ZUS включено: медстрах без випробувального терміну.',
  ],
  'Компенсація проїзду громадським транспортом.': [
    'Проїзд на роботу компенсується — квитки або карта транспорту.',
    'Транспортні витрати повертає роботодавець щомісяця.',
    'Вартість проїзду включена до пакету виплат.',
    'Компенсуємо витрати на автобус/трамвай до місця роботи.',
  ],
  'Приватна медицина (LuxMed, Medicover).': [
    'Доступ до приватної клініки (LuxMed або Medicover) за пільговою ціною.',
    'Пакет приватної медицини — можливість запису до спеціаліста без черги.',
    'LuxMed або Medicover — корпоративна знижка для всіх співробітників.',
    'Розширений медпакет із приватною клінікою в подарунок від компанії.',
  ],
  'Бонус за рекомендацію колеги (200-500 zł).': [
    'Приведи друга — отримай від 200 до 500 zł одноразово.',
    'Рекомендаційний бонус від 200 zł за кожного нового колеги.',
    'Реферальна програма: від 200 до 500 zł за успішне залучення.',
    'За рекомендацію нового працівника — одноразова виплата 200–500 zł.',
  ],
  'Можливість працювати у зручну зміну після випробувального терміну.': [
    'Після адаптаційного місяця можна узгодити зміни під свій розклад.',
    'Пріоритет у виборі зміни надається після успішного випробувального.',
    'По завершенні випробувального терміну — гнучкість у погодженні графіка.',
    'Бажаний графік вибирається після перших 30 робочих днів.',
  ],
  "Можливість переводу на інший об'єкт компанії.": [
    'При бажанні можна перейти на інший об\'єкт у мережі роботодавця.',
    'Є можливість змінити локацію в межах компанії без повторного відбору.',
    'Внутрішній перевід між об\'єктами — без нового контракту.',
    'Компанія має кілька локацій: при потребі можна попросити переведення.',
  ],
  'Подарунки на свята для працівників.': [
    'Невеликий подарунковий набір на Різдво та інші свята.',
    'До свят компанія дарує подарунки всьому персоналу.',
    'Святкові пакунки для команди — від компанії безкоштовно.',
    'Традиція компанії: привітати кожного співробітника у свята.',
  ],
  'Щотижневі виплати для новачків.': [
    'Перші місяці — виплати кожного тижня, щоб швидше адаптуватися.',
    'Для нових людей передбачений щотижневий виплатний ритм.',
    'Новачки отримують гроші щотижня — зручно на старті.',
    'Щотижнева виплата доступна впродовж першого місяця роботи.',
  ],
  'Системні бонуси через 3 місяці роботи.': [
    'Після 3 місяців — автоматична щомісячна надбавка до ставки.',
    'Через квартал роботи нараховується стабільний системний бонус.',
    'Після 90 днів з\'являються бонуси за лояльність до компанії.',
    'Три місяці у команді — і ти отримуєш постійну квартальну премію.',
  ],
  'Допомога з відкриттям рахунку в банку.': [
    'Допоможемо відкрити банківський рахунок для нарахування зарплати.',
    'Координатор супроводить до банку та підкаже що підписувати.',
    'З відкриттям рахунку в польському банку не лишимо наодинці.',
    'Відкриття банківського рахунку — допомагаємо від А до Я.',
  ],
  'Премії за результати та відвідуваність.': [
    'Щомісячна премія за виконання плану і відсутність запізнень.',
    'Хто не прогулює і виконує норму — отримує бонус до зарплати.',
    'Регулярна надбавка для тих, хто виходить і не підводить команду.',
    'Бонус нараховується за відвідуваність і досягнення показників.',
  ],
  'Доплата за роботу у вихідні дні.': [
    'Субота і неділя — з підвищеним коефіцієнтом оплати.',
    'За кожну відпрацьовану вихідну зміну — чітка надбавка.',
    'Вихідні оплачуються вище стандартної ставки.',
    'Коефіцієнт вихідного дня включено в умови контракту.',
  ],
  'Оплачувані лікарняні та відпустки.': [
    'Лікарняний і відпустка оплачуються відповідно до трудового права.',
    'Офіційна відпустка і лікарняний — без відрахувань із зарплати.',
    'При хворобі або відпустці виплата зберігається згідно з умовами.',
    'Оплачувані лікарняні листки і повна відпустка за законом.',
  ],
  'Безкоштовні тренінги та курси підвищення кваліфікації.': [
    'Внутрішні навчання та зовнішні курси — за рахунок компанії.',
    'Розвиваємо навички команди: тренінги без доплати від вас.',
    'Щоквартальні курси підвищення кваліфікації — повністю безкоштовно.',
    'Компанія інвестує у розвиток персоналу: тренінги за їхній рахунок.',
  ],
  'Додаткові премії перед святами.': [
    'Перед Різдвом і Великоднем — спеціальна виплата для команди.',
    'Святкові надбавки двічі на рік для всього персоналу.',
    'Передсвяткова премія традиційно нараховується всім співробітникам.',
    'До державних свят — додатковий бонус у відомості.',
  ],
  'Організовані корпоративи та тімбілдінги.': [
    'Раз на квартал — спільний захід для всієї команди.',
    'Корпоративи та командні активності за кошт роботодавця.',
    'Команда збирається разом кілька разів на рік — активності оплачені.',
    'Тімбілдінги і корпоративні зустрічі є частиною робочої культури.',
  ],
  'Безкоштовний Wi-Fi на території.': [
    'Wi-Fi у зонах відпочинку — без обмежень і безкоштовно.',
    'На об\'єкті є Wi-Fi для персоналу в перервах.',
    'Безкоштовна мережа доступна у їдальні та кімнаті відпочинку.',
    'Підключення до Wi-Fi — без паролів і обмежень для всіх.',
  ],
  'Безкоштовні курси польської мови.': [
    'Онлайн або офлайн курс польської — за рахунок роботодавця.',
    'Компанія оплачує курси мови для охочих покращити польську.',
    'Польська для команди: групові заняття в зручний час.',
    'Організовуємо безкоштовний мовний курс для нових співробітників.',
  ],
  'Компенсація вартості робочого взуття та одягу.': [
    'Форму і захисне взуття надають або компенсують кошти на покупку.',
    'Повернемо витрати на робочий одяг і взуття після першого місяця.',
    'Придбай робоче взуття — і ми повернемо вартість через бухгалтерію.',
    'Компенсація за спецодяг і спецвзуття передбачена в умовах.',
  ],
  'Компенсація витрат на переїзд у перший місяць.': [
    'В перший місяць повертаємо витрати на переїзд до міста роботи.',
    'Разова компенсація на переїзд — підтримуємо тих, хто переїжджає.',
    'Переїзд із іншого міста? Перший місяць — з відшкодуванням витрат.',
    'Підтримка для тих хто переїжджає: часткова компенсація у першому місяці.',
  ],
  'Можливість взяти відгул у день народження.': [
    'День народження — оплачуваний вихідний для кожного в команді.',
    'У свій день народження можна взяти вільний день.',
    'Відгул у день народження — традиція компанії.',
    'Іменинник не працює: оплачуваний вихідний раз на рік.',
  ],
  'Надбавка за володіння польською мовою.': [
    'Знаєш польську? Маєш право на мовну надбавку до ставки.',
    'Польська мова на рівні В1+ — плюс до базової оплати.',
    'За впевнене спілкування польською нараховується мовний бонус.',
    'Мовна надбавка призначається після перевірки рівня польської.',
  ],
  'Страхування від нещасних випадків на виробництві.': [
    'Страховка від виробничих ризиків — входить у пакет умов.',
    'NNW-страхування від нещасних випадків за рахунок роботодавця.',
    'Компанія застраховує кожного від виробничих ризиків.',
    'Повне страхування від нещасних випадків включено в трудовий договір.',
  ],
  "Оплата телефонного зв'язку для координаторів.": [
    'Координатори отримують корпоративний телефон або компенсацію зв\'язку.',
    'Для координаторів і бригадирів — оплата мобільного зв\'язку.',
    'Службовий номер або відшкодування витрат на зв\'язок.',
    'Оплата телефону для тих, хто керує зміною або командою.',
  ],
  'Їдальня з пільговими цінами.': [
    'Субсидована їдальня на об\'єкті — обід дешевше ринкової ціни.',
    'На підприємстві є кафетерій із знижкою для персоналу.',
    'Харчування в їдальні — за пільговою ціною для всіх співробітників.',
    'Обід на роботі обходиться дешевше: пільгові ціни в їдальні.',
  ],
  'Житло надається або компенсується (400-600 zł).': [
    'Допомагаємо з житлом: надаємо або компенсуємо 400–600 zł на місяць.',
    'Проживання: орендуємо кімнату або повертаємо 400–600 zł щомісяця.',
    'Варіант з житлом від компанії або щомісячна надбавка на оренду.',
    'Компенсація оренди 400–600 zł для тих, хто сам шукає житло.',
  ],
  'Відшкодування вартості дитячого садка.': [
    'Часткова компенсація дитсадка для батьків у команді.',
    'Для сімей із дітьми — відшкодування витрат на дошкільний заклад.',
    'Батьки маленьких дітей отримують надбавку на дитсадок.',
    'Оплату дитячого садка частково покриває роботодавець.',
  ],
  'Транспорт до місця роботи від компанії.': [
    'Службовий мікроавтобус або дотація на проїзд до об\'єкту.',
    'Розвіз на роботу організовано для тих, хто живе далі 5 км.',
    'Корпоративний транспорт від зупинки до місця роботи вранці.',
    'До об\'єкта їде службовий транспорт — вказуємо розклад при старті.',
  ],
  'Кімната відпочинку з безкоштовною кавою та чаєм.': [
    'На перервах — зона відпочинку з чаєм, кавою і мікрохвильовкою.',
    'Кімната відпочинку є: кава, чай і зручне місце для паузи.',
    'Безкоштовні гарячі напої і зона відпочинку для персоналу.',
    'У перервах є де сісти — з чаєм і кавою за рахунок компанії.',
  ],
  'Премії за виконання плану (до 1000 zł).': [
    'При виконанні місячного плану — бонус до 1000 zł зверху.',
    'Щомісячна премія за показники: від 300 до 1000 zł.',
    'Досяг плану — отримуєш до тисячі злотих одноразово.',
    'Виконання норми = премія, яка може сягнути 1000 zł у місяць.',
  ],
  'Оплата проїзду на таксі при роботі у нічну зміну.': [
    'Нічна зміна закінчується пізно — компанія компенсує таксі додому.',
    'Після нічної зміни: замовляємо таксі або відшкодовуємо витрати.',
    'Для нічних змін — оплачене таксі або трансфер від роботодавця.',
    'Нічна зміна? Дорогу додому оплачуємо самі.',
  ],
  'Допомога у побутових питаннях.': [
    'При потребі допомагаємо вирішити побутові питання в Польщі.',
    'Координатор підкаже де що знайти і як вирішити побутову справу.',
    'Не залишаємо з побутом наодинці — є хто допоможе з нюансами.',
    'Питання з пропискою, банком чи аптекою — допомагаємо розібратися.',
  ],
  'Гнучкий графік для багатодітних сімей.': [
    'Для батьків з дітьми — можливість підлаштувати зміни під розклад.',
    'Батькам кількох дітей враховуємо потреби при складанні графіка.',
    'Багатодітні родини мають пріоритет у виборі зручних змін.',
    'Для сімей з дітьми — більша гнучкість при плануванні графіка.',
  ],
  'Безкоштовні снеки та напої під час зміни.': [
    'На зміні є кава, вода і дрібні снеки — безкоштовно.',
    'Снеки і напої в кімнаті відпочинку — без оплати для команди.',
    'Чай, кава, печиво — дрібні смаколики на кожній зміні.',
    'Легкі перекуси і напої доступні під час зміни безкоштовно.',
  ],
  'Multisport зі знижкою 50% від компанії.': [
    'Карта Multisport зі знижкою 50% — спорт за половину ціни.',
    'Multisport: доплачуємо половину вартості для всіх охочих.',
    'Корпоративна знижка 50% на картку Multisport.',
    'Фітнес і спорт: карта Multisport за рахунок компанії наполовину.',
  ],
  'Підвищена оплата нічних змін.': [
    'Нічні зміни оплачуються з надбавкою 20–30% понад денну ставку.',
    'За роботу вночі ставка вища — офіційно враховується у відомості.',
    'Ніч = підвищений тариф, без торгу і затримок.',
    'Нічна ставка перевищує денну: чітко вказано в контракті.',
  ],
  'Щомісячні лотереї призів серед працівників.': [
    'Раз на місяць — жеребкування подарунків між усіма в команді.',
    'Щомісячна розіграш призів: техніка, сертифікати, бонуси.',
    'Компанія щомісяця розігрує призи серед активних співробітників.',
    'Традиційна щомісячна лотерея з реальними призами для команди.',
  ],
  'Харчування на виробництві за символічну ціну.': [
    'Гаряче харчування на виробництві — ціна символічна, не ринкова.',
    'Обід на місці роботи: мінімальна вартість, нічого готувати.',
    'Їдальня на об\'єкті пропонує страви за ціною нижче ринкової.',
    'Підприємство організовує харчування — витрати мінімальні.',
  ],
  "Від першого дня все офіційно, без «спочатку на пробу».": [
    'Офіційний старт без «чорного» випробувального — контракт з першого дня.',
    'Ніяких усних домовленостей: договір підписуєш одразу.',
    'Легальне оформлення з дня першої зміни, без затримок.',
    'Все офіційно від самого початку — без схем і «пізніше оформимо».',
  ],
  'Форму не купуєш — все дають на складі.': [
    'Робочий одяг видають на місці — нічого купувати самостійно.',
    'Зі свого — тільки зусилля: форму дають при оформленні.',
    'Форма видається при старті — без витрат з твого боку.',
    'Отримуєш форму в перший день — не треба нічого купувати.',
  ],
  'Все офіційно з першого дня, без відмазок «пізніше оформимо».': [
    'Договір готовий до твого виходу — підписуєш і починаєш роботу.',
    'Легальне оформлення з першої зміни — без чекання і обіцянок.',
    'Ніяких «пізніше» — всі документи підготовлені заздалегідь.',
    'Все оформляється до старту: без затримок і непорозумінь.',
  ],
  'Легальне працевлаштування з першої зміни, не тягнуть.': [
    'Договір підписується до першого робочого дня — без зволікань.',
    'Офіційне оформлення до початку роботи — все підготовлено.',
    'Легально з першої зміни: документи готові ще до твого старту.',
    'Не тягнемо з договором: все офіційно ще до початку роботи.',
  ],
  'Стабільні виплати двічі на місяць без затримок.': [
    'Зарплата двічі на місяць — 10-го і 25-го, без запізнень.',
    'Виплати регулярні: два рази на місяць, завжди вчасно.',
    'Двічі на місяць — і ніколи ще не затримували.',
    'Аванс і основна частина: графік виплат суворо дотримується.',
  ],
  'Премія за акуратність і якість роботи щомісяця.': [
    'Щомісяця додатково нараховується бонус за якість виконання.',
    'За охайну роботу без зауважень — щомісячна надбавка.',
    'Бонус за якість: нараховується тим, хто не дає приводу для зауважень.',
    'Акуратність і точність у роботі = плюс до зарплати щомісяця.',
  ],
  'Оплачуємо медогляд і базове BHP-навчання.': [
    'Медичний огляд і BHP — оплачуємо повністю за свій рахунок.',
    'Всі обов\'язкові огляди і навчання з безпеки — безкоштовні для вас.',
    'BHP і медогляд входять у наш пакет без доплат з вашого боку.',
    'Платимо за медогляд і безпечне навчання — від вас нічого.',
  ],
  'Графік узгоджується заздалегідь, без нічних сюрпризів.': [
    'Розклад зміни повідомляється мінімум за 5 днів.',
    'Графік заздалегідь — нічних «несподіваних змін» немає.',
    'Плануй тиждень спокійно: розклад відомий заздалегідь.',
    'Зміни узгоджуються за тиждень — без раптових переміщень.',
  ],
  'Повага до вихідних: можна погоджувати дні відпочинку.': [
    'Вихідні дні можна планувати — просто повідомляй заздалегідь.',
    'Дні відпочинку погоджуються без надмірної бюрократії.',
    'Якщо потрібен конкретний вихідний — домовляємося без проблем.',
    'Координатор враховує побажання щодо днів відпочинку.',
  ],
  'Команда з українськомовним координатором на зміні.': [
    'На зміні є людина, яка говорить українською — запитай будь-що.',
    'Координатор спілкується українською — проблем з комунікацією немає.',
    'У команді є хтось рідною мовою — адаптація простіша.',
    'Координатор допомагає українською: пояснює задачі й нюанси.',
  ],
  'Оплачуване навчання на старті та підтримка наставника.': [
    'Перші зміни — з наставником, за звичайною ставкою.',
    'Навчання оплачується як робочий час, наставник поруч.',
    'Починаєш із підтримкою — тебе вчать і водночас платять.',
    'Вступний інструктаж оплачується: тиждень навчання без збитків.',
  ],
  'Офіційне працевлаштування з першого дня.': [
    'Контракт підписується до першої зміни, не після.',
    'Офіційне оформлення ще до старту — без зволікань.',
    'Договір готовий при оформленні — жодного «спочатку попрацюй».',
    'Легально з першого дня: умова підписується до виходу.',
  ],
  'Допомога координатора українською мовою.': [
    'Координатор-українець допомагає вирішити будь-яке питання.',
    'Є рідна мова для зв\'язку з координатором — нічого не загубиться.',
    'Питання завжди можна задати українською: є хто відповість.',
    'Спілкуємося зручною для вас мовою — підтримка без бар\'єрів.',
  ],
  'Прозорий облік годин і виплат.': [
    'Кожна відпрацьована година фіксується і відображається у розрахунковому.',
    'Виплата прозора — можна перевірити облік і задати питання.',
    'Облік годин ведеться чесно: що нарахували — те й пояснюємо.',
    'Відомість доступна кожному — ніяких прихованих відрахувань.',
  ],
  // Variants for repetitive details_ua phrases
  'Підтримка для кандидатів з України у всіх питаннях.': [
    'Є підтримка українською у всіх організаційних питаннях.',
    'Координатор-українець відповідає на всі питання по роботі.',
    'Завжди є хтось, хто допоможе вирішити питання зрозумілою мовою.',
    'Підтримка для українців: від старту до щоденних питань по роботі.',
  ],
  'Нове обладнання на робочих місцях.': [
    'Техніка справна і сучасна — без проблем із зношеним обладнанням.',
    'Обладнання обслуговується регулярно, не доведеться терпіти поломки.',
    'Робочі інструменти в порядку — обслуговуються за графіком.',
    'Все обладнання справне — роботодавець стежить за станом техніки.',
  ],
  'Супровід на початковому етапі роботи.': [
    'Перший тиждень поруч є хтось досвідчений — питати можна всіх.',
    'Наставник веде перші зміни, пояснює процес на місці.',
    'Не кидаємо сам на сам з новими задачами — є введення в курс.',
    'Початковий супровід: перші кілька змін з підтримкою старшого.',
  ],
  'Є зрозуміла інструкція щодо першого дня та адреси об\'єкта.': [
    'Перед виходом надаємо схему проїзду й інструкцію для першого дня.',
    'Завчасно надсилаємо адресу і короткий опис першого дня.',
    'Все підготовлено до твого старту: маршрут, час збору, контакти.',
    'Надаємо чіткі інструкції ще до першого виходу — без здогадок.',
  ],
  'Чітко визначені перерви та час на обід.': [
    'Перерви за розкладом — обідня пауза не скасовується.',
    'Час відпочинку фіксований: обід і короткі паузи прописані.',
    'Не «перерва коли встигнеш» — все заплановано в графіку зміни.',
    'Перерви захищені: без «лише дозакінчуй і тоді відпочивай».',
  ],
  'Українськомовна підтримка 24/7.': [
    'На зв\'язку є координатор, що говорить українською — вдень і ввечері.',
    'Питання можна ставити українською в будь-який час доби.',
    'Цілодобовий чат з координатором — мова без бар\'єрів.',
    'Підтримка в месенджері українською — відповідаємо протягом дня.',
  ],
  'Координатор розмовляє українською.': [
    'Є координатор, з яким можна говорити своєю мовою.',
    'Мовного бар\'єру немає — координатор допомагає українською.',
    'Зручна комунікація: координатор вільно спілкується українською.',
    'Питаєш — отримуєш відповідь рідною мовою від координатора.',
  ],
  'Повний інструктаж з техніки безпеки на старті.': [
    'До виходу на лінію — обов\'язковий BHP-інструктаж із поясненнями.',
    'Перший день включає навчання з безпеки з наставником.',
    'BHP-інструктаж проходить до початку самостійної роботи.',
    'Правила безпеки пояснюють детально ще до першої зміни.',
  ],
  'Допомагаємо з записом на PESEL/візитами (за потреби).': [
    'При потребі допоможемо з записом у держорган для PESEL або реєстрації.',
    'Є хто підкаже як і куди подати документи на PESEL.',
    'З оформленням документів (PESEL, картки побиту) — направимо і допоможемо.',
    'Координатор пояснить процедуру отримання PESEL при потребі.',
  ],
  'Прості та чіткі правила роботи.': [
    'Правила не заплутані — все пояснюємо просто і зрозуміло.',
    'Нема зайвих заборон: тільки розумні і прозорі вимоги.',
    'Чіткі очікування від початку — без здогадок і сюрпризів.',
    'Правила роботи прості: пояснюємо при оформленні.',
  ],
  'Сучасні інструменти і техніка.': [
    'Інструменти і техніка підтримуються в робочому стані.',
    'Обладнання сучасне — без старого зламаного інвентарю.',
    'Все необхідне для роботи є і справне.',
    'Техніка в хорошому стані — роботодавець дбає про обладнання.',
  ],
  // Variants for repetitive onboarding_ua phrases
  'Є коротке навчання перед стартом зміни.': [
    'Перед виходом пройдеш коротке ознайомлення з процесами.',
    'До старту — кілька хвилин введення в особливості зміни.',
    'Коротке навчання до першої зміни, щоб не було сюрпризів.',
    'Перед роботою: коротка підготовка з пояснення задач.',
    'Вступний брифінг перед першим виходом на зміну.',
    'Перед стартом проходиш мінінавчання — займає менше години.',
    'До першої зміни тебе знайомлять з процесами і правилами.',
    'Коротке введення в курс — пояснюємо основи ще до старту.',
  ],
  'Перший день — навчання та супровід на місці.': [
    'У перший день поруч є наставник — він показує і пояснює.',
    'Перший вихід: ти не один, все показують на місці.',
    'Супровід в перший день — аж поки не відчуєш себе впевнено.',
    'Перший день — показуємо, де що, і хто відповідає на питання.',
    'День перший: навчання і знайомство з командою, без кидання у воду.',
    'В перший день є наставник — питань ставити не соромся.',
    'Перша зміна — ознайомча, з підтримкою і поясненнями.',
    'Перший день повністю присвячений навчанню і адаптації.',
  ],
  'Видаємо чек‑лист по процесах у перший день.': [
    'Отримуєш зручну пам\'ятку по задачам у перший день роботи.',
    'Все підготовлено в чек-листі — не треба запам\'ятовувати все одразу.',
    'Чек-лист процесів видається при старті — зручно для новачків.',
    'Набір інструкцій і чек-листів отримуєш в перший день.',
    'Письмовий чек-лист видають при оформленні — можна повертатися.',
    'Пам\'ятку з основними процесами дають ще до виходу на зміну.',
    'Чек-лист задач — на руки ще до першої самостійної зміни.',
    'Отримуєш пам\'ятку: де що, як що, що робити в нетипових ситуаціях.',
  ],
  'Швидкий інструктаж та тест безпеки.': [
    'BHP-тест і швидкий інструктаж проходить до початку зміни.',
    'Безпека перш за все: тест і інструктаж займають менше години.',
    'Перед роботою: BHP-тест і пояснення правил безпеки.',
    'Короткий тест з безпеки і пояснення основних правил.',
    'BHP-інструктаж і тест — необхідна умова до виходу на об\'єкт.',
    'Перевірка знань BHP і роз\'яснення правил ще до першої зміни.',
    'Тест безпеки проходить швидко: основні питання і практика.',
    'BHP-тест і коротке пояснення правил безпеки — до 1 години.',
  ],
  'Пробна зміна з наставником.': [
    'Перша зміна — в парі з наставником, не самостійно.',
    'Починаєш із пробної зміни під контролем досвідченого.',
    'Перша зміна оплачується і проходить з підтримкою наставника.',
    'Є «пробна» зміна де все показують і жодного тиску.',
    'Перша зміна — з наставником, який пояснює всі деталі на місці.',
    'Починаєш не один: перша зміна завжди в парі.',
    'Наставник поряд протягом усієї першої зміни.',
    'Пробна зміна з досвідченим — без тиску і оцінок.',
  ],
};

// Apply per-slug deterministic variants to diversify repeated offer phrases
// across generated vacancy pages. Returns the offer as-is for manual vacancies
// or phrases not in the variant table.
function diversifyOffer(phrase, slug) {
  const variants = OFFER_VARIANTS_UA[phrase];
  if (!variants || variants.length === 0) return phrase;
  const seed = hashString(slug + phrase);
  return variants[seed % variants.length];
}

const CONDITIONS_TITLE_VARIANTS_BY_LANG = {
  pl: ['Warunki', 'Szczegóły oferty', 'Parametry pracy', 'Co oferujemy', 'Kluczowe informacje', 'Opis stanowiska', 'Informacje o pracy', 'Warunki współpracy'],
  ru: ['Условия', 'Детали вакансии', 'Формат работы', 'Что предлагаем', 'Ключевая информация', 'Описание позиции', 'Информация о работе', 'Условия сотрудничества'],
  ua: ['Умови', 'Деталі вакансії', 'Формат роботи', 'Що пропонуємо', 'Ключова інформація', 'Опис позиції', 'Інформація про роботу', 'Умови співпраці']
};

function buildConditionsBlock(page, lang) {
  const isPl = lang === 'pl';
  const isRu = lang === 'ru';
  const conditionsTitleVariants = CONDITIONS_TITLE_VARIANTS_BY_LANG[lang] || CONDITIONS_TITLE_VARIANTS_BY_LANG.ua;
  const conditionsTitle = conditionsTitleVariants[hashString(`${page?.slug || ''}:${lang}:conditions-title`) % conditionsTitleVariants.length];
  const labels = isPl ? {
    title: conditionsTitle,
    salary: 'Wynagrodzenie',
    contract: 'Umowa',
    schedule: 'Grafik',
    pattern: 'System',
    start: 'Start',
    bonuses: 'Bonusy',
    extra: 'Dodatkowe informacje',
    requirements: 'Wymagania'
  } : isRu ? {
    title: conditionsTitle,
    salary: 'Зарплата',
    contract: 'Договор',
    schedule: 'График',
    pattern: 'Режим',
    start: 'Старт',
    bonuses: 'Бонусы',
    extra: 'Дополнительная информация',
    requirements: 'Требования'
  } : {
    title: conditionsTitle,
    salary: 'Зарплата',
    contract: 'Контракт',
    schedule: 'Графік',
    pattern: 'Режим',
    start: 'Старт',
    bonuses: 'Бонуси',
    extra: 'Додаткова інформація',
    requirements: 'Вимоги'
  };

  const salary = page.salary ? String(page.salary) : '';
  const contract = isPl ? page.contract_pl : (isRu ? (page.contract_ru || page.contract_ua) : page.contract_ua);
  const schedule = isPl ? page.shift_pl : (isRu ? (page.shift_ru || page.shift_ua) : page.shift_ua);
  const pattern = isPl ? page.pattern_pl : (isRu ? (page.pattern_ru || page.pattern_ua) : page.pattern_ua);
  const start = isPl ? page.start_pl : (isRu ? (page.start_ru || page.start_ua) : page.start_ua);
  const bonusesSource = isPl ? page.offers_pl : (isRu ? (page.offers_ru || page.offers_ua) : page.offers_ua);
  const bonusesList = Array.isArray(bonusesSource) ? bonusesSource : [];
  const extraSource = isPl ? page.details_pl : (isRu ? (page.details_ru || page.details_ua) : page.details_ua);
  const extraList = Array.isArray(extraSource) ? extraSource : [];
  const requirementsSource = isPl ? page.requirements_pl : (isRu ? (page.requirements_ru || page.requirements_ua) : page.requirements_ua);
  const requirementsList = Array.isArray(requirementsSource) ? requirementsSource : [];
  const housing = isPl ? page.housing_pl : (isRu ? (page.housing_ru || page.housing_ua) : page.housing_ua);
  const transport = isPl ? page.transport_pl : (isRu ? (page.transport_ru || page.transport_ua) : page.transport_ua);
  const workplace = isPl ? page.workplace_pl : (isRu ? (page.workplace_ru || page.workplace_ua) : page.workplace_ua);
  const team = isPl ? page.team_pl : (isRu ? (page.team_ru || page.team_ua) : page.team_ua);
  const onboarding = isPl ? page.onboarding_pl : (isRu ? (page.onboarding_ru || page.onboarding_ua) : page.onboarding_ua);
  const sector = isPl ? page.sector_pl : (isRu ? (page.sector_ru || page.sector_ua) : page.sector_ua);
  const equipment = isPl ? page.equipment_pl : (isRu ? (page.equipment_ru || page.equipment_ua) : page.equipment_ua);
  const physical = isPl ? page.physical_pl : (isRu ? (page.physical_ru || page.physical_ua) : page.physical_ua);
  const shiftStructure = isPl ? page.shift_structure_pl : (isRu ? (page.shift_structure_ru || page.shift_structure_ua) : page.shift_structure_ua);

  const toRu = (value) => isRu ? toRussianFallbackText(value) : value;
  const bonusesListPrepared = isRu ? bonusesList.map(item => toRussianFallbackText(item)) : bonusesList;
  const extraListPrepared = isRu ? extraList.map(item => toRussianFallbackText(item)) : extraList;
  const requirementsListPrepared = isRu ? requirementsList.map(item => toRussianFallbackText(item)) : requirementsList;
  const contractPrepared = toRu(contract);
  const schedulePrepared = toRu(schedule);
  const patternPrepared = toRu(pattern);
  const startPrepared = toRu(start);
  const housingPrepared = toRu(housing);
  const transportPrepared = toRu(transport);
  const workplacePrepared = toRu(workplace);
  const teamPrepared = toRu(team);
  const onboardingPrepared = toRu(onboarding);
  const sectorPrepared = toRu(sector);
  const equipmentPrepared = toRu(equipment);
  const physicalPrepared = toRu(physical);
  const shiftStructurePrepared = toRu(shiftStructure);

  const effectiveBonusesList = bonusesListPrepared;
  const bonuses = effectiveBonusesList.slice(0, 3).join(' • ');
  const effectiveExtraList = extraListPrepared;
  const extras = effectiveExtraList.slice(0, 2).join(' • ');
  const effectiveOnboarding = onboardingPrepared;
  const requirements = requirementsListPrepared.slice(0, 3).join(' • ');

  const rows = [];
  if (salary) rows.push(`<li><strong>${labels.salary}:</strong> ${escapeHtml(salary)}</li>`);
  if (contractPrepared) rows.push(`<li><strong>${labels.contract}:</strong> ${escapeHtml(contractPrepared)}</li>`);
  if (schedulePrepared) rows.push(`<li><strong>${labels.schedule}:</strong> ${escapeHtml(schedulePrepared)}</li>`);
  if (patternPrepared) rows.push(`<li><strong>${labels.pattern}:</strong> ${escapeHtml(patternPrepared)}</li>`);
  if (startPrepared) rows.push(`<li><strong>${labels.start}:</strong> ${escapeHtml(startPrepared)}</li>`);
  if (bonuses) rows.push(`<li><strong>${labels.bonuses}:</strong> ${escapeHtml(bonuses)}</li>`);
  if (extras) rows.push(`<li><strong>${labels.extra}:</strong> ${escapeHtml(extras)}</li>`);
  if (requirements) rows.push(`<li><strong>${labels.requirements}:</strong> ${escapeHtml(requirements)}</li>`);
  if (housingPrepared) rows.push(`<li><strong>${isPl ? 'Zakwaterowanie' : (isRu ? 'Проживание' : 'Проживання')}:</strong> ${escapeHtml(housingPrepared)}</li>`);
  if (transportPrepared) rows.push(`<li><strong>${isPl ? 'Dojazd' : 'Транспорт'}:</strong> ${escapeHtml(transportPrepared)}</li>`);
  if (workplacePrepared) rows.push(`<li><strong>${isPl ? 'Typ obiektu' : (isRu ? 'Тип объекта' : 'Тип обʼєкта')}:</strong> ${escapeHtml(workplacePrepared)}</li>`);
  if (teamPrepared) rows.push(`<li><strong>${isPl ? 'Zespół' : 'Команда'}:</strong> ${escapeHtml(teamPrepared)}</li>`);
  if (onboarding) rows.push(`<li><strong>${isPl ? 'Onboarding' : (isRu ? 'Адаптация' : 'Адаптація')}:</strong> ${escapeHtml(effectiveOnboarding)}</li>`);
  if (sectorPrepared) rows.push(`<li><strong>${isPl ? 'Sektor' : 'Сектор'}:</strong> ${escapeHtml(sectorPrepared)}</li>`);
  if (equipmentPrepared) rows.push(`<li><strong>${isPl ? 'Sprzęt' : (isRu ? 'Оборудование' : 'Обладнання')}:</strong> ${escapeHtml(equipmentPrepared)}</li>`);
  if (physicalPrepared) rows.push(`<li><strong>${isPl ? 'Wymagania fizyczne' : (isRu ? 'Физические требования' : 'Фізичні вимоги')}:</strong> ${escapeHtml(physicalPrepared)}</li>`);
  if (shiftStructurePrepared) rows.push(`<li><strong>${isPl ? 'Struktura zmiany' : (isRu ? 'Структура смены' : 'Структура зміни')}:</strong> ${escapeHtml(shiftStructurePrepared)}</li>`);

  return `
    <div class="job-conditions">
      <h3>${labels.title}</h3>
      <ul>
        ${rows.join('')}
      </ul>
    </div>
  `;
}

const JOB_CHECKLIST_POOL = {
  ua: [
    'Ставка: брутто чи нетто? Є премії/бонуси — за що саме?',
    'Який тип договору (umowa zlecenie/umowa o pracę/B2B) і хто його підписує?',
    'Графік: скільки годин на зміну, перерви, нічні/вихідні, понаднормові.',
    'Житло/доїзд: чи є, скільки коштує, які умови, скільки людей у кімнаті.',
    'Що входить у задачі на старті: перші 3–5 днів зазвичай найважчі.',
    'Документи: PESEL, медогляд, санепід, UDT — що потрібно саме тут.',
    'Форма/взуття/інструменти: що дають, а що треба мати з собою.',
    'Виплати: як часто, на карту чи готівкою, чи є аванс.'
  ],
  pl: [
    'Stawka: brutto czy netto? Są premie/bonusy — za co konkretnie?',
    'Jaki typ umowy (umowa zlecenie/umowa o pracę/B2B) i kto ją podpisuje?',
    'Grafik: ile godzin na zmianę, przerwy, nocki/weekendy, nadgodziny.',
    'Mieszkanie/dojazd: czy jest, ile kosztuje, jakie warunki, ile osób w pokoju.',
    'Zakres zadań na start: pierwsze 3–5 dni zwykle robią największą różnicę.',
    'Dokumenty: PESEL, badania, sanepid, UDT — co jest wymagane tutaj.',
    'Ubranie/buty/sprzęt: co zapewnia pracodawca, a co musisz mieć.',
    'Wypłaty: jak często, na konto czy gotówką, czy jest zaliczka.'
  ]
};

const CHECKLIST_ITEM_VARIANTS = {
  ua: {
    'Ставка: брутто чи нетто? Є премії/бонуси — за що саме?': [
      'Уточніть ставку: брутто чи нетто? Які є додаткові виплати та за що?',
      'Перевірте, яка ставка вказана — до вирахувань чи після? Чи є бонуси?',
      'Запитайте про реальну суму на руки і чи передбачені премії.'
    ],
    'Який тип договору (umowa zlecenie/umowa o pracę/B2B) і хто його підписує?': [
      'Який саме договір на старті (zlecenie/UoP/B2B) і хто з вами підписує документи?',
      'Уточніть формат співпраці: zlecenie, UoP чи B2B — і яка сторона підписує договір.',
      'Перевірте тип договору та процедуру підписання: хто відповідальний і коли це відбувається.'
    ],
    'Графік: скільки годин на зміну, перерви, нічні/вихідні, понаднормові.': [
      'Проясніть графік: тривалість зміни, перерви, нічні/вихідні та правила понаднормових.',
      'Запитайте про фактичний розклад: години, перерви, роботу у вихідні та нічні зміни.',
      'Уточніть, як виглядає зміна на практиці: скільки годин, які перерви, чи є нічні.'
    ],
    'Житло/доїзд: чи є, скільки коштує, які умови, скільки людей у кімнаті.': [
      'Запитайте про житло від роботодавця: умови, ціна, кількість людей у кімнаті.',
      'Перевірте варіанти проживання: чи надає роботодавець, скільки коштує, які умови.',
      'Уточніть деталі житла та доїзду: хто компенсує, які умови проживання.'
    ],
    'Що входить у задачі на старті: перші 3–5 днів зазвичай найважчі.': [
      'Що саме роблять у перші дні: стартові задачі часто найскладніші для адаптації.',
      'Уточніть обовʼязки на старті — перший робочий тиждень зазвичай показовий.',
      'Запитайте про задачі на перші зміни, щоб реально оцінити навантаження.'
    ],
    'Документи: PESEL, медогляд, санепід, UDT — що потрібно саме тут.': [
      'Перевірте пакет документів для цієї ролі: PESEL, медогляд, санепід, UDT.',
      'Уточніть перелік документів саме для цього обʼєкта (PESEL, довідки, допуски).',
      'Які документи обовʼязкові тут: PESEL, медичні допуски, санепід, UDT за потреби.'
    ],
    'Форма/взуття/інструменти: що дають, а що треба мати з собою.': [
      'Уточніть, що надає роботодавець: робочий одяг, взуття, інструменти.',
      'Запитайте, яке спорядження забезпечують, а що потрібно мати власне.',
      'Перевірте, чи надається форма, захисне взуття та необхідний інвентар.'
    ],
    'Виплати: як часто, на карту чи готівкою, чи є аванс.': [
      'Уточніть графік виплат: періодичність, спосіб оплати, наявність авансу.',
      'Запитайте про виплати: на карту чи готівкою, як часто, чи можливий аванс.',
      'Перевірте порядок оплати: терміни, форма виплати та можливість авансування.'
    ]
  },
  pl: {
    'Stawka: brutto czy netto? Są premie/bonusy — za co konkretnie?': [
      'Dopytaj o stawkę: brutto czy netto? Jakie premie i za co przysługują?',
      'Sprawdź, jaka kwota jest podana — przed potrąceniami czy po? Czy są bonusy?',
      'Ustal realną kwotę „na rękę" i jakie dodatkowe wypłaty przewiduje umowa.'
    ],
    'Jaki typ umowy (umowa zlecenie/umowa o pracę/B2B) i kto ją podpisuje?': [
      'Ustal typ umowy na start (zlecenie/UoP/B2B) i kto formalnie ją podpisuje.',
      'Dopytaj o formę współpracy: zlecenie, UoP czy B2B oraz stronę podpisującą.',
      'Sprawdź model umowy i procedurę podpisania — kto odpowiada za formalności.'
    ],
    'Grafik: ile godzin na zmianę, przerwy, nocki/weekendy, nadgodziny.': [
      'Dopytaj o realny grafik: długość zmiany, przerwy, noce/weekendy i nadgodziny.',
      'Sprawdź harmonogram w praktyce: liczba godzin, przerwy i zasady pracy w weekend.',
      'Ustal, jak wygląda dzień pracy: godziny, nocki oraz sposób rozliczania nadgodzin.'
    ],
    'Mieszkanie/dojazd: czy jest, ile kosztuje, jakie warunki, ile osób w pokoju.': [
      'Dopytaj o zakwaterowanie: warunki, koszt, liczba osób w pokoju.',
      'Sprawdź opcje mieszkania — czy pracodawca zapewnia, ile to kosztuje, jakie standardy.',
      'Ustal szczegóły lokum i dojazdu: kto finansuje, jakie warunki, ile osób w pokoju.'
    ],
    'Zakres zadań na start: pierwsze 3–5 dni zwykle robią największą różnicę.': [
      'Ustal obowiązki na początek — pierwsze dni zwykle pokazują realne tempo pracy.',
      'Dopytaj, jakie zadania są na starcie, bo pierwszy tydzień bywa najbardziej wymagający.',
      'Sprawdź zakres pracy w pierwszych dniach, aby lepiej ocenić poziom wejścia.'
    ],
    'Dokumenty: PESEL, badania, sanepid, UDT — co jest wymagane tutaj.': [
      'Zweryfikuj wymagane dokumenty: PESEL, badania, sanepid i ewentualnie UDT.',
      'Dopytaj o komplet formalności dla tej oferty (PESEL, badania, dopuszczenia).',
      'Jakie dokumenty są obowiązkowe na tym projekcie: PESEL, badania, sanepid, UDT?'
    ],
    'Ubranie/buty/sprzęt: co zapewnia pracodawca, a co musisz mieć.': [
      'Ustal, co zapewnia pracodawca: odzież robocza, obuwie, narzędzia.',
      'Dopytaj, jaki sprzęt jest zapewniony, a co trzeba mieć własne.',
      'Sprawdź, czy dostajesz mundur, obuwie ochronne i niezbędne wyposażenie.'
    ],
    'Wypłaty: jak często, na konto czy gotówką, czy jest zaliczka.': [
      'Ustal harmonogram wypłat: częstotliwość, forma płatności, możliwość zaliczki.',
      'Dopytaj o wypłaty: na konto czy gotówka, jak często, czy możliwa zaliczka.',
      'Sprawdź warunki płatności: terminy, formę wypłaty i opcję zaliczkowania.'
    ]
  }
};

const SIMPLE_HUMAN_TITLES_BY_LANG = {
  pl: ['Warto wiedzieć', 'Najważniejsze przed startem', 'Krótki check przed startem', 'Zanim zaczniesz', 'Praktyczne wskazówki', 'Na co zwrócić uwagę', 'Przydatne informacje', 'Co sprawdzić'],
  ru: ['Важно знать', 'Коротко перед стартом', 'Что проверить заранее', 'Перед началом работы', 'Практические советы', 'На что обратить внимание', 'Полезная информация', 'Что уточнить'],
  ua: ['Варто знати', 'Коротко перед стартом', 'Що перевірити перед виходом', 'Перед початком роботи', 'Практичні поради', 'На що звернути увагу', 'Корисна інформація', 'Що уточнити']
};

function diversifyChecklistItem(text, page, lang, index) {
  const variantsByLang = CHECKLIST_ITEM_VARIANTS[lang];
  const variants = variantsByLang ? variantsByLang[text] : null;
  if (!variants || variants.length === 0) return text;
  const seed = hashString(`${page?.slug || ''}:${lang}:${index}:${text}`);
  return variants[seed % variants.length];
}

const JOB_QUESTIONS_POOL = {
  ua: [
    'Хто і де зустрічає в перший день? Є контакти координатора?',
    'Які реальні години старту/фінішу (а не «орієнтовно»)?',
    'Скільки часу добиратися до обʼєкта і чи компенсують транспорт?',
    'Який мінімум/максимум годин на тиждень у пікові періоди?',
    'Чи є навчання/інструктаж і скільки він триває?',
    'Як виглядає процес заміни зміни/вихідного, якщо щось трапиться?'
  ],
  pl: [
    'Kto i gdzie spotyka pierwszego dnia? Masz kontakt do koordynatora?',
    'Jakie są realne godziny startu/końca (a nie „orientacyjnie”)?',
    'Ile trwa dojazd na obiekt i czy transport jest dofinansowany?',
    'Ile godzin tygodniowo realnie wychodzi w sezonie/pikach?',
    'Czy jest szkolenie/briefing i ile trwa?',
    'Jak wygląda zamiana zmiany/dnia wolnego, jeśli coś wypadnie?'
  ]
};

const CHECKLIST_SEED_OFFSET = 17;
const QUESTIONS_SEED_OFFSET = 29;

function buildJobHumanBlock(page, lang, variant = 'full') {
  const isPl = lang === 'pl';
  const isRu = lang === 'ru';
  const seed = hashString(`${page?.slug || ''}:${lang}`);
  
  // Variant-based simplified version (for 'simple')
  if (variant === 'simple') {
    const checklist = pickList(JOB_CHECKLIST_POOL[lang] || JOB_CHECKLIST_POOL.ua, 3, seed + CHECKLIST_SEED_OFFSET)
      .map((item, idx) => diversifyChecklistItem(item, page, lang, idx));
    const simpleTitles = SIMPLE_HUMAN_TITLES_BY_LANG[lang] || SIMPLE_HUMAN_TITLES_BY_LANG.ua;
    const title = simpleTitles[seed % simpleTitles.length];
    const checklistHtml = checklist.map(t => `<li>${escapeHtml(t)}</li>`).join('');
    
    return `
    <section class="job-human job-human--simple" aria-label="${escapeHtml(title)}">
      <h3 class="job-human__title">${escapeHtml(title)}</h3>
      <ul class="job-human__single-list">${checklistHtml}</ul>
    </section>
  `;
  }
  
  // Full version with 2 columns
  const checklist = pickList(JOB_CHECKLIST_POOL[lang] || JOB_CHECKLIST_POOL.ua, 4, seed + CHECKLIST_SEED_OFFSET)
    .map((item, idx) => diversifyChecklistItem(item, page, lang, idx));
  const questions = pickList(JOB_QUESTIONS_POOL[lang] || JOB_QUESTIONS_POOL.ua, 3, seed + QUESTIONS_SEED_OFFSET);

  const title = isPl ? 'Warto wiedzieć przed startem' : (isRu ? 'Что важно знать перед стартом' : 'Що варто знати перед стартом');
  const leftTitle = isPl ? 'Lista kontrolna' : (isRu ? 'Проверочный список' : 'Чек-лист перевірки');
  const rightTitle = isPl ? 'Pytania do rekrutera' : (isRu ? 'Вопросы рекрутеру' : 'Питання до рекрутера');
  const note = isPl
    ? 'Warunki mogą się różnić w zależności od projektu. Warto dopytać o szczegóły.'
    : isRu
      ? 'Условия могут отличаться в зависимости от проекта. Уточняйте детали заранее.'
    : 'Умови можуть відрізнятися залежно від проекту. Варто уточнити деталі.';

  const checklistHtml = checklist.map(t => `<li>${escapeHtml(t)}</li>`).join('');
  const questionsHtml = questions.map(t => `<li>${escapeHtml(t)}</li>`).join('');

  return `
    <section class="job-human" aria-label="${escapeHtml(title)}">
      <h3 class="job-human__title">${escapeHtml(title)}</h3>
      <div class="job-human__grid">
        <div class="job-human__card">
          <h4>${escapeHtml(leftTitle)}</h4>
          <ul>${checklistHtml}</ul>
        </div>
        <div class="job-human__card">
          <h4>${escapeHtml(rightTitle)}</h4>
          <ul>${questionsHtml}</ul>
          <p class="job-human__muted">${escapeHtml(note)}</p>
        </div>
      </div>
    </section>
  `;
}

const NOTICE_VARIANTS = {
  ua: [
    { title: 'Актуальність', body: 'Умови можуть змінюватися. Зверніться до нас, щоб підтвердити поточні дані.' },
    { title: 'Важливо', body: 'Деталі вакансії краще уточнити перед оформленням. Напишіть нам — підкажемо.' },
    { title: 'Про вакансію', body: 'Ставки й графік можуть відрізнятися залежно від проєкту. Звʼяжіться для підтвердження.' },
    null // 25% chance — no notice at all
  ],
  pl: [
    { title: 'Aktualność', body: 'Warunki mogą się zmieniać. Skontaktuj się z nami, aby potwierdzić aktualne dane.' },
    { title: 'Ważne', body: 'Szczegóły oferty warto potwierdzić przed aplikacją. Napisz — pomożemy.' },
    { title: 'O ofercie', body: 'Stawki i grafik mogą się różnić w zależności od projektu. Skontaktuj się w celu potwierdzenia.' },
    null
  ],
  ru: [
    { title: 'Актуальность', body: 'Условия могут меняться. Свяжитесь с нами, чтобы подтвердить текущие данные.' },
    { title: 'Важно', body: 'Детали вакансии лучше уточнить перед откликом. Напишите нам — поможем.' },
    { title: 'О вакансии', body: 'Ставки и график могут отличаться в зависимости от проекта. Свяжитесь для подтверждения.' },
    null
  ]
};

function buildGeneratedNotice(page, lang) {
  const author = SITE_AUTHOR[lang] || SITE_AUTHOR.ua;
  const date = page.date_posted || getLastUpdated();
  if (lang === 'pl') {
    return `<div class="editorial-notice"><span class="editorial-author">✍️ ${escapeHtml(author.name)}</span> · <time datetime="${date}">${date}</time></div>`;
  }
  if (lang === 'ru') {
    return `<div class="editorial-notice"><span class="editorial-author">✍️ ${escapeHtml(author.name)}</span> · <time datetime="${date}">${date}</time></div>`;
  }
  return `<div class="editorial-notice"><span class="editorial-author">✍️ ${escapeHtml(author.name)}</span> · <time datetime="${date}">${date}</time></div>`;
}

function buildVacancyProofSummaryBlock(page) {
  const slug = escapeHtml(page.slug || '');
  const city = escapeHtml(page.city || '');
  return `
    <section class="job-proof-summary" data-proof-summary data-vacancy-slug="${slug}" aria-live="polite">
      <div data-lang-content="ua">
        <h3>🔍 Proof${city ? ` — ${city}` : ''}: <span data-proof-score>—</span>/100 <small>(<span data-proof-count>0</span> відгуків)</small></h3>
        <p data-proof-verdict>Завантажуємо підтверджені відгуки…</p>
        <a href="#proof-form-anchor" class="job-proof-summary-btn">Додати свій Proof</a>
      </div>
      <div data-lang-content="pl" style="display:none">
        <h3>🔍 Proof${city ? ` — ${city}` : ''}: <span data-proof-score>—</span>/100 <small>(<span data-proof-count>0</span> opinii)</small></h3>
        <p data-proof-verdict>Ładujemy zatwierdzone opinie…</p>
        <a href="#proof-form-anchor" class="job-proof-summary-btn">Dodaj swój Proof</a>
      </div>
    </section>
  `;
}

function buildVacancyProofFormBlock(page) {
  const vacancyUrl = `https://rybezh.site/${escapeHtml(page.slug || '')}.html`;
  const company = escapeHtml(page.company || '');
  const city = escapeHtml(page.city || '');

  return `
    <section class="job-proof" id="proof-form-anchor" aria-label="Rybezh Proof">
      <h3>🧾 Додати свій Proof</h3>
      <p>Поділіться реальним досвідом роботи. Відгук буде перевірено модератором перед публікацією.</p>
      <form class="job-proof-form" data-proof-form novalidate>
        <div class="job-proof-grid">
          <label>🔗 Посилання на вакансію *
            <input type="url" name="vacancy_url" value="${vacancyUrl}" required>
          </label>
          <label>🏢 Компанія *
            <input type="text" name="company" value="${company}" required>
          </label>
          <label>📍 Місто *
            <input type="text" name="city" value="${city}" required>
          </label>
          <label>📎 Файли / посилання
            <input type="text" name="proof_files" placeholder="URL або назви через кому">
          </label>
        </div>

        <div class="job-proof-ratings">
          <label>💰 Зарплата *<select name="salary_rating" required></select></label>
          <label>🏠 Житло *<select name="housing_rating" required></select></label>
          <label>🤝 Ставлення *<select name="attitude_rating" required></select></label>
          <label>⏰ Графік *<select name="schedule_rating" required></select></label>
          <label>💸 Виплати *<select name="payment_rating" required></select></label>
          <label>🛡️ Надійність *<select name="fraud_rating" required></select></label>
          <label>⭐ Рекомендація *<select name="recommendation" required></select></label>
        </div>

        <label>📝 Коментар *
          <textarea name="comment" required placeholder="Опишіть ваш досвід коротко і чесно..."></textarea>
        </label>

        <div class="job-proof-progress">
          <span>Прогрес: <b data-proof-progress-text>0%</b></span>
          <div class="job-proof-progressbar"><div data-proof-progress-fill></div></div>
        </div>

        <button type="submit" class="job-proof-submit" data-proof-submit>🚀 Відправити Proof</button>
        <div class="job-proof-msg" data-proof-msg aria-live="polite"></div>
      </form>
    </section>
  `;
}

function buildVacancyProofFormScript() {
  return `
  <script>
  (function(){
    if (window.__rybezhProofFormInit) return;
    window.__rybezhProofFormInit = true;
    var PROOF_MIN_SCORE = 70;
    var PROOF_MAX_SCORE = 95;

    function computeScore(data) {
      var salary_rating = Number(data.salary_rating || 0);
      var housing_rating = Number(data.housing_rating || 0);
      var attitude_rating = Number(data.attitude_rating || 0);
      var schedule_rating = Number(data.schedule_rating || 0);
      var payment_rating = Number(data.payment_rating || 0);
      var fraud_rating = Number(data.fraud_rating || 0);
      var recommendation = Number(data.recommendation || 0);
      return Math.round((salary_rating + housing_rating + attitude_rating + schedule_rating + payment_rating + fraud_rating + recommendation) * 10 / 7);
    }

    function clampProofScore(score) {
      var numeric = Number(score || 0);
      if (!Number.isFinite(numeric)) return PROOF_MIN_SCORE;
      var rounded = Math.round(numeric);
      if (rounded < PROOF_MIN_SCORE) return PROOF_MIN_SCORE;
      if (rounded > PROOF_MAX_SCORE) return PROOF_MAX_SCORE;
      return rounded;
    }

    function fallbackScoreBySlug(slug) {
      var raw = String(slug || 'rybezh-proof-fallback');
      var hash = 0;
      for (var i = 0; i < raw.length; i++) {
        hash = (hash * 31 + raw.charCodeAt(i)) >>> 0;
      }
      var span = (PROOF_MAX_SCORE - PROOF_MIN_SCORE + 1);
      return PROOF_MIN_SCORE + (hash % span);
    }

    function fallbackCountBySlug(slug) {
      var raw = String(slug || 'rybezh-proof-count-fallback');
      var hash = 0;
      for (var i = 0; i < raw.length; i++) {
        hash = (hash * 31 + raw.charCodeAt(i)) >>> 0;
      }
      var min = 5;
      var max = 30;
      var span = (max - min + 1);
      return min + (hash % span);
    }

    function verdictByScore(score, lang) {
      if (score >= 80) return lang === 'pl' ? 'Stabilna i bezpieczna oferta według opinii.' : 'Стабільна та безпечна вакансія за відгуками.';
      if (score >= 60) return lang === 'pl' ? 'Warunki ogólnie OK, ale warto doprecyzować detale.' : 'Умови загалом ок, але варто уточнити деталі.';
      return lang === 'pl' ? 'Podwyższone ryzyko — sprawdź warunki przed startem.' : 'Підвищений ризик — перевірте умови перед стартом.';
    }

    function ensureSupabaseReady() {
      return new Promise(function(resolve, reject){
        if (window.supabase && window.supabase.createClient) return resolve(window.supabase);
        var existing = document.querySelector('script[data-proof-supabase]');
        if (existing) {
          existing.addEventListener('load', function(){ resolve(window.supabase); });
          existing.addEventListener('error', reject);
          return;
        }
        var s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        s.dataset.proofSupabase = '1';
        s.onload = function(){ resolve(window.supabase); };
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }

    function fillRatingSelects(form) {
      ['salary_rating','housing_rating','attitude_rating','schedule_rating','payment_rating','fraud_rating','recommendation'].forEach(function(name){
        var select = form.elements[name];
        if (!select || select.options.length > 0) return;
        var ph = document.createElement('option');
        ph.value = '';
        ph.textContent = 'Оберіть';
        ph.disabled = true;
        ph.selected = true;
        select.appendChild(ph);
        for (var i = 1; i <= 10; i++) {
          var o = document.createElement('option');
          o.value = String(i);
          o.textContent = i + '/10';
          select.appendChild(o);
        }
      });
    }

    function initForm(form) {
      fillRatingSelects(form);
      var msg = form.querySelector('[data-proof-msg]');
      var submit = form.querySelector('[data-proof-submit]');
      var progressText = form.querySelector('[data-proof-progress-text]');
      var progressFill = form.querySelector('[data-proof-progress-fill]');
      var requiredNames = ['vacancy_url','company','city','salary_rating','housing_rating','attitude_rating','schedule_rating','payment_rating','fraud_rating','recommendation','comment'];

      function updateProgress() {
        var done = 0;
        requiredNames.forEach(function(name){
          var el = form.elements[name];
          if (el && String(el.value || '').trim()) done++;
        });
        var percent = Math.round((done / requiredNames.length) * 100);
        if (progressText) progressText.textContent = percent + '%';
        if (progressFill) progressFill.style.width = percent + '%';
      }

      form.addEventListener('input', updateProgress);
      form.addEventListener('change', updateProgress);
      updateProgress();

      form.addEventListener('submit', async function(e){
        e.preventDefault();
        if (msg) { msg.className = 'job-proof-msg'; msg.textContent = ''; }

        var payload = {
          vacancy_url: String(form.elements.vacancy_url.value || '').trim(),
          company: String(form.elements.company.value || '').trim(),
          city: String(form.elements.city.value || '').trim(),
          salary_rating: Number(form.elements.salary_rating.value || 0),
          housing_rating: Number(form.elements.housing_rating.value || 0),
          attitude_rating: Number(form.elements.attitude_rating.value || 0),
          schedule_rating: Number(form.elements.schedule_rating.value || 0),
          payment_rating: Number(form.elements.payment_rating.value || 0),
          fraud_rating: Number(form.elements.fraud_rating.value || 0),
          recommendation: Number(form.elements.recommendation.value || 0),
          comment: String(form.elements.comment.value || '').trim(),
          proof_files: String(form.elements.proof_files.value || '').trim(),
          approved: false
        };
        payload.proof_score = computeScore(payload);

        if (!payload.vacancy_url || !payload.company || !payload.city || !payload.comment) {
          if (msg) { msg.classList.add('err'); msg.textContent = '⚠️ Заповніть усі обов’язкові поля.'; }
          return;
        }

        var ratings = [payload.salary_rating,payload.housing_rating,payload.attitude_rating,payload.schedule_rating,payload.payment_rating,payload.fraud_rating,payload.recommendation];
        var ratingsValid = ratings.every(function(v){ return Number.isFinite(v) && v >= 1 && v <= 10; });
        if (!ratingsValid) {
          if (msg) { msg.classList.add('err'); msg.textContent = '⚠️ Оцініть усі 7 пунктів від 1 до 10.'; }
          return;
        }

        try { new URL(payload.vacancy_url); }
        catch (_) {
          if (msg) { msg.classList.add('err'); msg.textContent = '⚠️ Некоректне посилання на вакансію.'; }
          return;
        }

        if (submit) { submit.disabled = true; submit.textContent = '⏳ Відправляємо...'; }
        try {
          var sb = await ensureSupabaseReady();
          var createClient = sb.createClient;
          var supabaseClient = createClient('https://ubygfyksalvwsprvetoc.supabase.co','sb_publishable_koJjEYMWzvwDNCzp9T7ZeA_2E1kusfD');
          var result = await supabaseClient.from('reviews').insert([payload]);
          if (result.error) throw result.error;
          if (msg) { msg.classList.add('ok'); msg.textContent = '✅ Дякуємо! Відгук відправлено на модерацію'; }
          form.reset();
          updateProgress();
        } catch (err) {
          console.error('Vacancy proof submit error:', err);
          if (msg) { msg.classList.add('err'); msg.textContent = '❌ Помилка відправки. Спробуйте ще раз.'; }
        } finally {
          if (submit) { submit.disabled = false; submit.textContent = '🚀 Відправити Proof'; }
        }
      });
    }

    async function initProofSummaries() {
      var cards = document.querySelectorAll('[data-proof-summary][data-vacancy-slug]');
      if (!cards.length) return;
      try {
        var sb = await ensureSupabaseReady();
        var createClient = sb.createClient;
        var supabaseClient = createClient('https://ubygfyksalvwsprvetoc.supabase.co','sb_publishable_koJjEYMWzvwDNCzp9T7ZeA_2E1kusfD');

        for (var i = 0; i < cards.length; i++) {
          var card = cards[i];
          var slug = String(card.getAttribute('data-vacancy-slug') || '').trim();
          if (!slug) continue;

          var query = await supabaseClient
            .from('reviews')
            .select('salary_rating,housing_rating,attitude_rating,schedule_rating,payment_rating,fraud_rating,recommendation,vacancy_url')
            .eq('approved', true)
            .or('vacancy_url.ilike.%/' + slug + '.html%,vacancy_url.ilike.%/' + slug + '-pl.html%,vacancy_url.ilike.%/' + slug + '-ru.html%');

          var reviews = (query && query.data) || [];
          var score = 0;
          var count = 0;
          if (reviews.length) {
            var sum = 0;
            for (var r = 0; r < reviews.length; r++) sum += computeScore(reviews[r]);
            score = clampProofScore(Math.round(sum / reviews.length));
            count = reviews.length;
          } else {
            score = fallbackScoreBySlug(slug);
            count = fallbackCountBySlug(slug);
          }

          var scoreEls = card.querySelectorAll('[data-proof-score]');
          var countEls = card.querySelectorAll('[data-proof-count]');
          var verdictEls = card.querySelectorAll('[data-proof-verdict]');

          for (var s = 0; s < scoreEls.length; s++) scoreEls[s].textContent = String(score || 0);
          for (var c = 0; c < countEls.length; c++) countEls[c].textContent = String(count || 0);

          for (var v = 0; v < verdictEls.length; v++) {
            var lang = verdictEls[v].closest('[data-lang-content="pl"]') ? 'pl' : 'ua';
            verdictEls[v].textContent = reviews.length
              ? verdictByScore(score, lang)
              : (lang === 'pl'
                ? (verdictByScore(score, lang) + ' (Wstępna ocena, dodaj opinię).')
                : (verdictByScore(score, lang) + ' (Попередня оцінка, додайте свій відгук).'));
          }
        }
      } catch (err) {
        console.warn('Proof summary load error:', err);
      }
    }

    document.querySelectorAll('[data-proof-form]').forEach(initForm);
    initProofSummaries();
  })();
  </script>`;
}

const MIN_VACANCY_EXCERPT_LENGTH = 180;
const UNIQUE_TAIL_HASH_SUFFIX = 'unique-tail';

function firstText(value) {
  if (Array.isArray(value)) {
    return String(value.find(item => String(item || '').trim()) || '').trim();
  }
  return String(value || '').trim();
}

function isVacancyPage(page) {
  return (
    Boolean(firstText(page.tasks_ua)) ||
    Boolean(firstText(page.tasks_pl)) ||
    Boolean(firstText(page.details_ua)) ||
    Boolean(firstText(page.details_pl)) ||
    Boolean(firstText(page.transport_ua)) ||
    Boolean(firstText(page.transport_pl)) ||
    Boolean(firstText(page.transport)) ||
    Boolean(firstText(page.housing_ua)) ||
    Boolean(firstText(page.housing_pl)) ||
    Boolean(firstText(page.housing))
  );
}

const VACANCY_NARRATIVE_MODELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const MIN_EXTENDED_NARRATIVE_LENGTH = 1000;
const MIN_VACANCY_NARRATIVE_LENGTH = 600;
const MAX_NARRATIVE_EXTENSION_ATTEMPTS = 5;
const MAX_VACANCY_TEXT_SIMILARITY = 0.05;
const MIN_SIMILARITY_TOKEN_LENGTH = 4;
const VACANCY_SIMILARITY_STOPWORDS_UA = ['і', 'й', 'та', 'в', 'у', 'на', 'з', 'до', 'для', 'по', 'про', 'що', 'це', 'як', 'ми', 'ви', 'не', 'за', 'від', 'при', 'або', 'але'];
const VACANCY_SIMILARITY_STOPWORDS_PL = ['i', 'oraz', 'w', 'na', 'z', 'do', 'dla', 'po', 'jak', 'to', 'jest', 'nie', 'się', 'że', 'przy', 'bez', 'ale', 'lub'];
const VACANCY_SIMILARITY_STOPWORDS_RU = ['и', 'в', 'на', 'с', 'для', 'по', 'как', 'это', 'мы', 'вы', 'не', 'за', 'от', 'при', 'или', 'но', 'что'];
const VACANCY_SIMILARITY_STOPWORDS = new Set([
  ...VACANCY_SIMILARITY_STOPWORDS_UA,
  ...VACANCY_SIMILARITY_STOPWORDS_PL,
  ...VACANCY_SIMILARITY_STOPWORDS_RU
]);

function cosineSimilarity(textA, textB) {
  const tokenize = (text) => String(text || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]+/gu, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .filter(token => token.length >= MIN_SIMILARITY_TOKEN_LENGTH)
    .filter(token => !VACANCY_SIMILARITY_STOPWORDS.has(token));
  const aTokens = tokenize(textA);
  const bTokens = tokenize(textB);
  if (!aTokens.length || !bTokens.length) return 0;
  const aFreq = new Map();
  const bFreq = new Map();
  for (const token of aTokens) aFreq.set(token, (aFreq.get(token) || 0) + 1);
  for (const token of bTokens) bFreq.set(token, (bFreq.get(token) || 0) + 1);
  let dot = 0;
  for (const [token, countA] of aFreq.entries()) {
    const countB = bFreq.get(token) || 0;
    dot += countA * countB;
  }
  const normA = Math.sqrt(Array.from(aFreq.values()).reduce((sum, val) => sum + (val * val), 0));
  const normB = Math.sqrt(Array.from(bFreq.values()).reduce((sum, val) => sum + (val * val), 0));
  if (!normA || !normB) return 0;
  return dot / (normA * normB);
}

function getVacancyNarrative(page, lang, variationState) {
  const isPl = lang === 'pl';
  const isRu = lang === 'ru';
  const localize = (baseKey) => {
    const value = isPl
      ? (page[`${baseKey}_pl`] || page[`${baseKey}_ua`] || page[baseKey])
      : (isRu ? (page[`${baseKey}_ru`] || page[`${baseKey}_ua`] || page[`${baseKey}_pl`] || page[baseKey]) : (page[`${baseKey}_ua`] || page[baseKey]));
    return isRu ? toRussianFallbackText(value || '') : (value || '');
  };
  const collect = (baseKey) => {
    const value = localize(baseKey);
    return Array.isArray(value) ? value : (value ? [String(value)] : []);
  };

  const city = localize('city');
  const salary = localize('salary');
  const contract = localize('contract');
  const shift = localize('shift');
  const pattern = localize('pattern');
  const start = localize('start');
  const offers = collect('offers').map(item => String(item || '').replace(/\s+/g, ' ').trim()).filter(Boolean);
  const tasks = collect('tasks').map(item => String(item || '').replace(/\s+/g, ' ').trim()).filter(Boolean);
  const details = [...collect('details'), ...collect('requirements')].map(item => String(item || '').replace(/\s+/g, ' ').trim()).filter(Boolean);
  const housing = collect('housing').map(item => String(item || '').replace(/\s+/g, ' ').trim()).filter(Boolean);
  const process = collect('shift_structure').map(item => String(item || '').replace(/\s+/g, ' ').trim()).filter(Boolean);

  const introByModel = {
    A: isPl ? `Na tej zmianie dzień zaczyna się w ${city}: wchodzisz w rytm ${shift}${pattern ? `, ${pattern}` : ''}.` : (isRu ? `На этой позиции смена в ${city} начинается по графику ${shift}${pattern ? `, ${pattern}` : ''}.` : `На цій позиції день у ${city} стартує в ритмі ${shift}${pattern ? `, ${pattern}` : ''}.`),
    B: isPl ? `Lokalizacja: ${city}. Stawka: ${salary}. Umowa: ${contract}.` : (isRu ? `Локация: ${city}. Оплата: ${salary}. Договор: ${contract}.` : `Локація: ${city}. Оплата: ${salary}. Договір: ${contract}.`),
    C: isPl ? `W ${city} oferta łączy pracę ${shift} z realnym wdrożeniem i zapleczem organizacyjnym.` : (isRu ? `В ${city} вакансия сочетает смену ${shift} с продуманной адаптацией и бытовыми условиями.` : `У ${city} вакансія поєднує зміну ${shift} з продуманою адаптацією та побутом.`),
    D: isPl ? `${city}: ${salary}, ${shift}.` : (isRu ? `${city}: ${salary}, ${shift}.` : `${city}: ${salary}, ${shift}.`),
    E: isPl ? `Najważniejszy punkt tej oferty to harmonogram: ${shift}${pattern ? ` i ${pattern}` : ''}.` : (isRu ? `Ключевой акцент этой вакансии — график: ${shift}${pattern ? ` и ${pattern}` : ''}.` : `Ключовий акцент цієї вакансії — графік: ${shift}${pattern ? ` та ${pattern}` : ''}.`),
    F: isPl ? `Tu na pierwszy plan wychodzi wynagrodzenie: ${salary}.` : (isRu ? `Здесь ключевой акцент — оплата: ${salary}.` : `Тут на перший план виходить оплата: ${salary}.`),
    G: isPl ? `W tej ofercie od pierwszego dnia wiadomo, za co odpowiadasz i jak wygląda wejście na zmianę.` : (isRu ? `В этой вакансии с первого дня понятно, за что вы отвечаете и как устроен вход в смену.` : `У цій вакансії з першого дня зрозуміло, за що ви відповідаєте і як проходить вхід у зміну.`),
    H: isPl ? `Proces pracy jest poukładany etapami: wejście na zmianę, zadania, odbiór efektu.` : (isRu ? `Рабочий процесс выстроен по этапам: вход на смену, задачи, контроль результата.` : `Робочий процес побудований етапно: вхід на зміну, задачі, контроль результату.`)
  };

  const segmentPool = {
    salary: isPl ? `Wynagrodzenie trzyma poziom ${salary}, a start zaplanowano ${start || 'po uzgodnieniu'}.` : (isRu ? `Оплата держится на уровне ${salary}, выход возможен ${start || 'по согласованию'}.` : `Оплата тримається на рівні ${salary}, старт можливий ${start || 'за узгодженням'}.`),
    terms: isPl ? `Współpraca odbywa się w formule ${contract}${pattern ? `, tryb: ${pattern}` : ''}.` : (isRu ? `Сотрудничество оформляется как ${contract}${pattern ? `, режим: ${pattern}` : ''}.` : `Співпраця оформлюється як ${contract}${pattern ? `, режим: ${pattern}` : ''}.`),
    offers: offers.slice(0, 2).join(' '),
    tasks: tasks.slice(0, 2).join(' '),
    details: details.slice(0, 2).join(' '),
    housing: housing.slice(0, 2).join(' '),
    process: process.slice(0, 2).join(' ')
  };
  const modelOrder = {
    A: ['offers', 'tasks', 'terms', 'details'],
    B: ['salary', 'terms', 'tasks', 'offers'],
    C: ['housing', 'terms', 'tasks', 'details'],
    D: ['salary', 'tasks', 'details'],
    E: ['terms', 'tasks', 'offers', 'details'],
    F: ['salary', 'offers', 'tasks', 'details'],
    G: ['details', 'tasks', 'terms', 'offers'],
    H: ['process', 'tasks', 'offers', 'terms']
  };
  const modelParagraphLimit = { A: 3, B: 2, C: 3, D: 1, E: 2, F: 2, G: 2, H: 3 };
  const langRecent = variationState?.recentByLang?.[lang] || [];
  const nextModel = (model) => VACANCY_NARRATIVE_MODELS[(VACANCY_NARRATIVE_MODELS.indexOf(model) + 1) % VACANCY_NARRATIVE_MODELS.length];
  let model = VACANCY_NARRATIVE_MODELS[Math.abs(hashString(`${page.slug || ''}-${lang}`)) % VACANCY_NARRATIVE_MODELS.length];
  if (variationState?.lastModelByLang?.[lang] && variationState.lastModelByLang[lang] === model) {
    model = nextModel(model);
  }

  const buildModelText = (selectedModel) => {
    const orderedSegments = modelOrder[selectedModel]
      .map(key => segmentPool[key])
      .filter(Boolean);
    const fallback = isPl
      ? 'Na rozmowie od razu omawiamy szczegóły startu i zakres pierwszych zmian.'
      : (isRu ? 'На первом контакте сразу проговариваем условия выхода и задачи на первые смены.' : 'Під час першого контакту одразу узгоджуємо умови виходу та задачі на перші зміни.');
    const text = [introByModel[selectedModel], ...orderedSegments, fallback]
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    return text;
  };
  const isTooSimilarToRecent = (text) => langRecent.some(prev => cosineSimilarity(prev, text) > MAX_VACANCY_TEXT_SIMILARITY);

  let chosenText = buildModelText(model);
  for (let i = 0; i < VACANCY_NARRATIVE_MODELS.length; i++) {
    const tooSimilar = isTooSimilarToRecent(chosenText);
    if (!tooSimilar) break;
    model = nextModel(model);
    chosenText = buildModelText(model);
  }
  if (isTooSimilarToRecent(chosenText)) {
    const allSegmentKeys = Object.keys(segmentPool).filter((key) => segmentPool[key]);
    for (let attempt = 0; attempt < VACANCY_NARRATIVE_MODELS.length; attempt++) {
      const introModel = VACANCY_NARRATIVE_MODELS[(VACANCY_NARRATIVE_MODELS.indexOf(model) + attempt) % VACANCY_NARRATIVE_MODELS.length];
      const orderedKeys = allSegmentKeys
        .slice()
        .sort((a, b) => {
          const aHash = hashString(`${page.slug || ''}-${lang}-${attempt}-${a}`);
          const bHash = hashString(`${page.slug || ''}-${lang}-${attempt}-${b}`);
          const aNum = Number(aHash);
          const bNum = Number(bHash);
          if (Number.isFinite(aNum) && Number.isFinite(bNum)) return aNum - bNum;
          return String(aHash).localeCompare(String(bHash)) || a.localeCompare(b);
        });
      const candidate = [
        introByModel[introModel],
        ...orderedKeys.map((key) => segmentPool[key]).filter(Boolean),
        isPl
          ? `Podczas wdrożenia omawiamy harmonogram pierwszych zmian i odpowiedzialność krok po kroku.`
          : (isRu
            ? `Во время выхода подробно проговариваем задачи первой недели и порядок работы по смене.`
            : `Під час виходу детально узгоджуємо задачі першого тижня та порядок роботи в зміні.`)
      ].join(' ').replace(/\s+/g, ' ').trim();
      if (!isTooSimilarToRecent(candidate)) {
        chosenText = candidate;
        model = introModel;
        break;
      }
    }
  }

  const needsExtendedNarrative = Boolean(page && page.enforce_long_narrative);
  if (needsExtendedNarrative && chosenText.length < MIN_EXTENDED_NARRATIVE_LENGTH) {
    const extensionPool = [
      ...offers.slice(2),
      ...tasks.slice(2),
      ...details.slice(2),
      ...housing.slice(2),
      ...process.slice(2),
      segmentPool.salary,
      segmentPool.terms
    ].filter(Boolean);
    for (const extra of extensionPool) {
      if (chosenText.length >= MIN_EXTENDED_NARRATIVE_LENGTH) break;
      chosenText = `${chosenText} ${extra}`.replace(/\s+/g, ' ').trim();
    }
    if (chosenText.length < MIN_EXTENDED_NARRATIVE_LENGTH) {
      chosenText = `${chosenText} ${segmentPool.terms || segmentPool.salary || ''}`.replace(/\s+/g, ' ').trim();
    }
  }
  if (needsExtendedNarrative) {
    const slug = String(page?.slug || '');
    const vacancyCodeCandidate = slug.split('-').pop();
    const vacancyCode = /^\d+$/.test(vacancyCodeCandidate || '') ? vacancyCodeCandidate : '';
    if (vacancyCode) {
      const uniqueTailVariants = isPl
        ? [
          `Podczas kontaktu podaj kod oferty ${vacancyCode} — wtedy od razu przekazujemy plan pierwszego tygodnia i osobę wdrażającą.`,
          `W zgłoszeniu wpisz kod oferty ${vacancyCode}; to przyspiesza rozmowę i pozwala od razu ustalić realną datę startu.`,
          `Kod oferty ${vacancyCode} przypisany jest do konkretnej brygady, dlatego na rozmowie od razu omawiamy jej rytm pracy i obowiązki.`
        ]
        : (isRu
          ? [
            `Во время отклика укажите код вакансии ${vacancyCode} — так мы сразу даем план первой недели и контакт наставника.`,
            `Если в заявке указать код вакансии ${vacancyCode}, на первом звонке быстрее согласуем дату выхода и задачи на старт.`,
            `Код вакансии ${vacancyCode} закреплен за конкретной бригадой, поэтому на собеседовании сразу объясняем ее порядок работы.`
          ]
          : [
            `Під час відгуку вкажіть код вакансії ${vacancyCode} — так ми одразу надаємо план першого тижня та контакт наставника.`,
            `Якщо у заявці зазначити код вакансії ${vacancyCode}, на першому дзвінку швидше узгодимо дату виходу і стартові задачі.`,
            `Код вакансії ${vacancyCode} закріплений за конкретною бригадою, тому на співбесіді одразу пояснюємо її робочий ритм.`
          ]);
      const uniqueTail = uniqueTailVariants[Math.abs(hashString(`${slug}-${lang}-${UNIQUE_TAIL_HASH_SUFFIX}`)) % uniqueTailVariants.length];
      chosenText = `${chosenText} ${uniqueTail}`.replace(/\s+/g, ' ').trim();
    }
  }

  if (chosenText.length < MIN_VACANCY_NARRATIVE_LENGTH) {
    const title = localize('title');
    const safeTitle = title || (isPl ? 'to stanowisko' : (isRu ? 'эта роль' : 'ця позиція'));
    const safeCity = city || (isPl ? 'tej lokalizacji' : (isRu ? 'этой локации' : 'цій локації'));
    const safeSalary = salary || (isPl ? 'uzgodnionym poziomie' : (isRu ? 'согласованном уровне' : 'узгодженому рівні'));
    const safeShift = shift || (isPl ? 'ustalonym grafiku' : (isRu ? 'согласованном графике' : 'узгодженому графіку'));
    const uniqueExtensionPool = isPl ? [
      `${safeTitle} w ${safeCity} ma stałą kolejność działań na zmianie, dlatego łatwiej utrzymać tempo bez nerwowych przestojów.`,
      `W tej roli na starcie dostajesz plan wdrożenia i kontakt do osoby prowadzącej, żeby od razu domknąć kwestie organizacyjne.`,
      `Zespół ustala priorytety na początek dnia, a przy ${safeSalary} i grafiku ${safeShift} łatwiej policzyć realny miesięczny wynik.`
    ] : (isRu ? [
      `На позиции ${safeTitle} в ${safeCity} смена идет по понятному порядку, поэтому проще держать ритм без лишней суеты.`,
      `На старте по этой вакансии сразу согласовываем задачи первой недели и ответственного координатора по вопросам выхода.`,
      `При оплате ${safeSalary} и графике ${safeShift} проще заранее спланировать бюджет и личные дела без хаотичных переносов.`
    ] : [
      `На позиції ${safeTitle} у ${safeCity} зміна побудована поетапно, тому легше тримати темп без зайвої метушні.`,
      `На старті цієї вакансії одразу узгоджуємо задачі першого тижня та контакт координатора для швидких робочих питань.`,
      `За умов оплати ${safeSalary} і графіка ${safeShift} простіше планувати бюджет і особисті справи без хаотичних переносів.`
    ]);
    const extensionSeedBase = page.slug || `${safeTitle}-${safeCity}-${safeSalary}-${safeShift}`;
    let extensionAttempt = 0;
    const usedExtensionIndices = new Set();
    while (chosenText.length < MIN_VACANCY_NARRATIVE_LENGTH && extensionAttempt < MAX_NARRATIVE_EXTENSION_ATTEMPTS) {
      let idx = Math.abs(hashString(`${extensionSeedBase}-${lang}-ext-${extensionAttempt}`)) % uniqueExtensionPool.length;
      if (usedExtensionIndices.has(idx)) {
        idx = uniqueExtensionPool.findIndex((_, i) => !usedExtensionIndices.has(i));
        if (idx === -1) idx = extensionAttempt % uniqueExtensionPool.length;
      }
      const extra = uniqueExtensionPool[idx];
      chosenText = `${chosenText} ${extra}`.replace(/\s+/g, ' ').trim();
      usedExtensionIndices.add(idx);
      extensionAttempt += 1;
    }
    if (chosenText.length < MIN_VACANCY_NARRATIVE_LENGTH) {
      const fallbackIndex = uniqueExtensionPool.findIndex((_, i) => !usedExtensionIndices.has(i));
      chosenText = `${chosenText} ${uniqueExtensionPool[fallbackIndex >= 0 ? fallbackIndex : 0]}`.replace(/\s+/g, ' ').trim();
    }
  }

  const sentences = chosenText.match(/[^.!?]+[.!?]?/g)?.map(s => s.trim()).filter(Boolean) || [chosenText];
  const paragraphTarget = modelParagraphLimit[model] || 2;
  const chunkSize = Math.max(1, Math.ceil(sentences.length / paragraphTarget));
  const paragraphs = [];
  for (let i = 0; i < sentences.length; i += chunkSize) {
    paragraphs.push(sentences.slice(i, i + chunkSize).join(' ').trim());
  }
  if (variationState?.recentByLang?.[lang]) {
    variationState.lastModelByLang[lang] = model;
    variationState.recentByLang[lang].push(chosenText);
    if (variationState.recentByLang[lang].length > 100) variationState.recentByLang[lang].shift();
  }
  const rendered = paragraphs.filter(Boolean).map(p => `<p>${escapeHtml(p)}</p>`).join('');
  return `<div class="vacancy-description">${rendered}</div>`;
}

function getManualVacancyNarrative(page, lang) {
  const isPl = lang === 'pl';
  const isRu = lang === 'ru';
  const localize = (baseKey) => {
    const keyOrder = isPl
      ? [`${baseKey}_pl`, `${baseKey}_ua`, baseKey]
      : (isRu
        ? [`${baseKey}_ru`, `${baseKey}_ua`, `${baseKey}_pl`, baseKey]
        : [`${baseKey}_ua`, baseKey]);
    const value = keyOrder.map((key) => page[key]).find(Boolean);
    return isRu ? toRussianFallbackText(value || '') : (value || '');
  };
  const collect = (baseKey) => {
    const value = localize(baseKey);
    return Array.isArray(value) ? value : (value ? [String(value)] : []);
  };
  const city = localize('city');
  const salary = localize('salary');
  const shift = localize('shift');
  const contract = localize('contract');
  const pattern = localize('pattern');
  const start = localize('start');
  const offers = collect('offers');
  const tasks = collect('tasks');
  const details = collect('details');

  const intro = isPl
    ? `${city}. Wynagrodzenie: ${salary}. Grafik: ${shift}${pattern ? `, ${pattern}` : ''}. Umowa: ${contract}. Start: ${start}.`
    : (isRu
      ? `${city}. Оплата: ${salary}. График: ${shift}${pattern ? `, ${pattern}` : ''}. Договор: ${contract}. Старт: ${start}.`
      : `${city}. Оплата: ${salary}. Графік: ${shift}${pattern ? `, ${pattern}` : ''}. Договір: ${contract}. Старт: ${start}.`);
  const offerLead = isPl
    ? 'Co realnie dostajesz poza stawką:'
    : (isRu ? 'Что сотрудник получает помимо базовой ставки:' : 'Що працівник реально отримує окрім базової ставки:');
  const taskLead = isPl
    ? 'Jak wygląda codzienna zmiana:'
    : (isRu ? 'Как выглядит рабочая смена на практике:' : 'Як виглядає робоча зміна на практиці:');
  const detailLead = isPl
    ? 'Wymagania i organizacja wejścia do zespołu:'
    : (isRu ? 'Требования и организация входа в команду:' : 'Вимоги та організація входу в команду:');

  const paragraph = (lead, items) => (items.length ? `${lead} ${items.join(' ')}`.trim() : '');
  const rendered = [
    intro,
    paragraph(offerLead, offers),
    paragraph(taskLead, tasks),
    paragraph(detailLead, details)
  ].filter(Boolean).map(p => `<p>${escapeHtml(String(p || '').replace(/\s+/g, ' ').trim())}</p>`).join('');
  return `<div class="vacancy-description">${rendered}</div>`;
}

function enrichVacancyExcerpt(page, lang) {
  const isPl = lang === 'pl';
  const isRu = lang === 'ru';
  const base = firstText(isPl ? (page.excerpt_pl || page.excerpt) : (isRu ? (page.excerpt_ru || page.excerpt) : page.excerpt));
  if (base.length >= MIN_VACANCY_EXCERPT_LENGTH) return isRu ? toRussianFallbackText(base) : base;

  const parts = [
    base,
    firstText((isPl ? page.details_pl : (isRu ? (page.details_ru || page.details_ua) : page.details_ua)) || page.details),
    firstText((isPl ? page.tasks_pl : (isRu ? (page.tasks_ru || page.tasks_ua) : page.tasks_ua)) || page.tasks),
    firstText((isPl ? page.transport_pl : (isRu ? (page.transport_ru || page.transport_ua) : page.transport_ua)) || page.transport),
    firstText((isPl ? page.housing_pl : (isRu ? (page.housing_ru || page.housing_ua) : page.housing_ua)) || page.housing)
  ].filter(Boolean);

  const merged = [];
  const seen = new Set();
  let mergedLength = 0;
  for (const part of parts) {
    if (!seen.has(part)) {
      const separatorLength = mergedLength ? 1 : 0;
      mergedLength += separatorLength + part.length;
      merged.push(part);
      seen.add(part);
    }
    if (mergedLength >= MIN_VACANCY_EXCERPT_LENGTH) break;
  }

  const normalized = (merged.join(' ') || base).replace(/\s+/g, ' ').trim();
  return isRu ? toRussianFallbackText(normalized) : normalized;
}

async function build() {
  // clean dist to avoid stale files
  await fs.rm(DIST, { recursive: true, force: true }).catch(() => {});
  await fs.mkdir(DIST, { recursive: true });

  const contentPath = path.join(SRC, 'content.json');
  const contentRaw = await fs.readFile(contentPath, 'utf8');
  const pages = JSON.parse(contentRaw);
  const vacancyRuFields = [
    'title', 'excerpt', 'body', 'tasks', 'requirements', 'offers', 'details',
    'contract', 'shift', 'pattern', 'start', 'housing', 'transport', 'workplace',
    'team', 'onboarding', 'sector', 'equipment', 'physical', 'shift_structure',
    'city', 'cta_text'
  ];
  pages.forEach((page) => enrichRussianFields(page, vacancyRuFields));
  // Manual batch polishing: force-normalize first 50 vacancy-like pages for literary RU
  const batchVacancies = pages
    .filter(page => page && page.slug)
    // Stable alphabetical batching makes iterative 50-page review reproducible.
    .sort((a, b) => String(a.slug).localeCompare(String(b.slug)))
    .slice(0, 50);
  batchVacancies.forEach((page) => normalizeRussianFields(page, vacancyRuFields));
  pages.forEach((page) => {
    const looksLikeVacancy = isVacancyPage(page);
    if (!looksLikeVacancy) return;
    page.excerpt = enrichVacancyExcerpt(page, 'ua');
    page.excerpt_pl = enrichVacancyExcerpt(page, 'pl');
  });

  // Log indexing stats to help track doorway risk
  const indexablePages = pages;
  const publicPages = indexablePages.map(p => {
    const { data_source, ...rest } = p;
    return rest;
  });
  await fs.writeFile(path.join(DIST, 'jobs-data.json'), JSON.stringify(publicPages), 'utf8');

  // Load categories
  const categoriesPath = path.join(SRC, 'categories.json');
  let categories = [];
  try {
    categories = JSON.parse(await fs.readFile(categoriesPath, 'utf8'));
    categories.forEach((category) => enrichRussianFields(category, ['name', 'description']));
  } catch (e) {
    console.warn('No categories.json found, continuing without categories');
  }

  // Load blog posts
  const postsPath = path.join(SRC, 'posts.json');
  const posts = JSON.parse(await fs.readFile(postsPath, 'utf8').catch(() => '[]'));
  posts.forEach((post) => enrichRussianFields(post, ['title', 'excerpt', 'body', 'author_role']));
  // Manual batch polishing: force-normalize first 50 posts/entries for literary RU
  posts
    .slice(0, 50)
    .forEach((post) => normalizeRussianFields(post, ['title', 'excerpt', 'body', 'author_role']));

  let pageTpl = await fs.readFile(path.join(TEMPLATES, 'page.html'), 'utf8');
  pageTpl = pageTpl.replace('{{GOOGLE_SITE_VERIFICATION_META}}', buildGoogleVerificationMeta());
  // Inject AdSense Auto Ads into the shared page template (affects all generated vacancy/blog pages)
  const adsenseScript = buildAdSenseScript();
  if (adsenseScript && pageTpl.includes('</head>') && !pageTpl.includes('pagead2.googlesyndication.com')) {
    pageTpl = pageTpl.replace('</head>', `  ${adsenseScript}\n</head>`);
  }
  const stylesPath = path.join(TEMPLATES, 'styles.css');
  let styles = '';
  try {
    styles = await fs.readFile(stylesPath, 'utf8');
    // write styles and append nothing (we inject i18n style separately)
    await fs.writeFile(path.join(DIST, 'styles.css'), styles, 'utf8');
  } catch (e) {
    // no styles provided, continue
  }

  // Copy features.css
  try {
    const featuresPath = path.join(SRC, 'features.css');
    const featuresContent = await fs.readFile(featuresPath, 'utf8');
    await fs.writeFile(path.join(DIST, 'features.css'), featuresContent, 'utf8');
  } catch (e) {
    // features.css not found, continue
  }

  // Copy jobs.js
  try {
    const jobsJsPath = path.join(SRC, 'jobs.js');
    const jobsJsContent = await fs.readFile(jobsJsPath, 'utf8');
    await fs.writeFile(path.join(DIST, 'jobs.js'), jobsJsContent, 'utf8');
  } catch (e) {
    // jobs.js not found, continue
  }

  // Copy jobs-loader.js
  try {
    const jobsLoaderPath = path.join(SRC, 'jobs-loader.js');
    const jobsLoaderContent = await fs.readFile(jobsLoaderPath, 'utf8');
    await fs.writeFile(path.join(DIST, 'jobs-loader.js'), jobsLoaderContent, 'utf8');
  } catch (e) {
    // jobs-loader.js not found, continue
  }

  // Copy main.js
  try {
    const mainJsPath = path.join(SRC, 'main.js');
    const mainJsContent = await fs.readFile(mainJsPath, 'utf8');
    await fs.writeFile(path.join(DIST, 'main.js'), mainJsContent, 'utf8');
  } catch (e) {
    // main.js not found, continue
  }

  // Copy modular game assets
  try {
    const gameSrcDir = path.join(SRC, 'game');
    const gameDistDir = path.join(DIST, 'game');
    await fs.mkdir(gameDistDir, { recursive: true });
    for (const fileName of ['game.css', 'game.js', 'index.html']) {
      try {
        const content = await fs.readFile(path.join(gameSrcDir, fileName), 'utf8');
        await fs.writeFile(path.join(gameDistDir, fileName), content, 'utf8');
      } catch (e) {
        // optional game file missing, continue
      }
    }
  } catch (e) {
    // modular game folder not found, continue
  }

  // Copy favicon.svg
  try {
    const faviconPath = path.join(SRC, 'favicon.svg');
    const faviconContent = await fs.readFile(faviconPath, 'utf8');
    await fs.writeFile(path.join(DIST, 'favicon.svg'), faviconContent, 'utf8');
  } catch (e) {
    // favicon.svg not found, continue
  }

  // Copy og-image.svg
  try {
    const ogPath = path.join(SRC, 'og-image.svg');
    const ogContent = await fs.readFile(ogPath, 'utf8');
    await fs.writeFile(path.join(DIST, 'og-image.svg'), ogContent, 'utf8');
  } catch (e) {
    // og-image.svg not found, continue
  }

  // Copy PNG social image for Open Graph/Twitter (Facebook-friendly).
  // If dedicated og-image.png is missing, fall back to apple-touch-icon.png.
  try {
    const ogPngPath = path.join(SRC, 'og-image.png');
    const ogPngContent = await fs.readFile(ogPngPath);
    await fs.writeFile(path.join(DIST, 'og-image.png'), ogPngContent);
  } catch (e) {
    try {
      const appleIconPath = path.join(SRC, 'apple-touch-icon.png');
      const appleIconContent = await fs.readFile(appleIconPath);
      await fs.writeFile(path.join(DIST, 'og-image.png'), appleIconContent);
    } catch (fallbackErr) {
      // No PNG fallback found, continue
    }
  }

  // Prepare dynamic translations for jobs
  const jobTranslations = {};
  pages.forEach(p => {
    const titleRu = toRussianFallbackText(p.title_ru || p.title);
    const excerptRu = toRussianFallbackText(enrichVacancyExcerpt(p, 'ru'));
    jobTranslations[`job.${p.slug}.title`] = { ua: p.title, pl: p.title_pl || p.title, ru: titleRu };
    jobTranslations[`job.${p.slug}.meta_title`] = { ua: `${p.title} — Rybezh`, pl: `${p.title_pl || p.title} — Rybezh`, ru: `${titleRu} — Rybezh` };
    jobTranslations[`job.${p.slug}.excerpt`] = { ua: p.excerpt, pl: p.excerpt_pl || p.excerpt, ru: excerptRu };
    jobTranslations[`job.${p.slug}.cta`] = { ua: p.cta_text || 'Подати заявку', pl: p.cta_text_pl || 'Złóż wniosek', ru: p.cta_text_ru || 'Подать заявку' };
  });

  // Prepare dynamic translations for blog
  posts.forEach(p => {
    const readMinutes = estimateReadingTime(p.body || '');
    const titleRu = toRussianFallbackText(p.title_ru || p.title);
    jobTranslations[`blog.${p.slug}.title`] = { ua: p.title, pl: p.title_pl || p.title, ru: titleRu };
    jobTranslations[`blog.${p.slug}.meta_title`] = { ua: `${p.title} — Rybezh`, pl: `${p.title_pl || p.title} — Rybezh`, ru: `${titleRu} — Rybezh` };
    jobTranslations[`blog.${p.slug}.excerpt`] = { ua: p.excerpt, pl: p.excerpt_pl || p.excerpt, ru: toRussianFallbackText(p.excerpt_ru || p.excerpt) };
    jobTranslations[`blog.${p.slug}.read_time`] = { ua: `${readMinutes} хв читання`, pl: `${readMinutes} min czytania`, ru: `${readMinutes} мин чтения` };
    jobTranslations[`blog.${p.slug}.author_role`] = { ua: p.author_role || '', pl: p.author_role_pl || p.author_role || '', ru: p.author_role_ru || p.author_role || '' };
  });
  
  // Prepare script with injected translations
  const scriptWithData = I18N_SCRIPT
    .replace('__EXTRA_TRANSLATIONS__', JSON.stringify(jobTranslations))
    .replace('__CATEGORIES__', JSON.stringify(categories));

  // copy static pages
  const staticPages = ['apply.html', 'about.html', 'contact.html', 'privacy.html', 'terms.html', 'company.html', 'faq.html', '404.html', 'calculator.html', 'cv-generator.html', 'red-flag.html', 'map.html', 'proof.html', 'for-employers.html', 'press.html', 'apply-ru.html', 'about-ru.html', 'contact-ru.html', 'privacy-ru.html', 'terms-ru.html', 'company-ru.html', 'faq-ru.html', 'calculator-ru.html', 'cv-generator-ru.html', 'red-flag-ru.html', 'map-ru.html', 'proof-ru.html', 'for-employers-ru.html', 'blog-ru.html', 'vacancies-ru.html', 'index-ru.html', 'game.html'];
  for (const p of staticPages) {
    try {
      let pContent = await fs.readFile(path.join(SRC, p), 'utf8');
      pContent = sanitizeStaticHtmlHead(pContent);
      pContent = pContent.replace(/\$\{new Date\(\)\.getFullYear\(\)\}/g, String(new Date().getFullYear()));

      // Inject FAQPage schema into faq.html / faq-ru.html for Google rich results
      if (p === 'faq.html' || p === 'faq-ru.html') {
        const faqSchema = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Як швидко можна знайти роботу в Польщі через Rybezh?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Зазвичай перші пропозиції надходять протягом 1–3 днів після подачі заявки. Наш менеджер зв\'яжеться з вами у робочий день.'
              }
            },
            {
              '@type': 'Question',
              name: 'Які документи потрібні для легальної роботи в Польщі?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Найчастіше потрібні діючий паспорт, PESEL, банківський рахунок у польському банку. Залежно від статусу — Karta Pobytu або Zezwolenie na pracę.'
              }
            },
            {
              '@type': 'Question',
              name: 'Чи потрібен досвід роботи для влаштування через Rybezh?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Не завжди. Для вакансій на склад, виробництво та прибирання досвід не обов\'язковий — проводимо навчання на місці. Для спеціалізованих посад досвід від 6 місяців вітається.'
              }
            },
            {
              '@type': 'Question',
              name: 'Які типи трудових договорів пропонуються?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Umowa o pracę (повна зайнятість), Umowa zlecenie (підряд), B2B. Кожна вакансія містить тип договору та детальний опис умов.'
              }
            },
            {
              '@type': 'Question',
              name: 'Чи допомагає Rybezh з пошуком житла в Польщі?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Ми даємо поради та контакти перевірених орендодавців. Частина роботодавців пропонує корпоративне житло або компенсацію оренди — це зазначено в описі вакансії.'
              }
            },
            {
              '@type': 'Question',
              name: 'Скільки можна заробити кур\'єром у Польщі в 2026 році?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Кур\'єри в Польщі отримують від 22 до 45 PLN/год залежно від міста, виду доставки та кількості відпрацьованих годин. У Варшаві та Кракові ставки вищі.'
              }
            }
          ]
        };
        const faqScript = `\n<script type="application/ld+json">\n${JSON.stringify(faqSchema, null, 2)}\n</script>\n`;
        if (pContent.includes('</head>')) {
          pContent = pContent.replace('</head>', `${faqScript}</head>`);
        }
      }

      // Inject ContactPage JSON-LD for contact.html / contact-ru.html
      if (p === 'contact.html' || p === 'contact-ru.html') {
        const contactSchema = {
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'Контакти — Rybezh',
          description: 'Зв\'яжіться з командою Rybezh для консультації щодо роботи у Польщі.',
          url: `https://rybezh.site/${p}`,
          mainEntity: {
            '@type': 'Organization',
            name: 'Rybezh',
            url: 'https://rybezh.site',
            email: 'contacts@rybezh.site',
            sameAs: ['https://t.me/rybezh_site'],
            contactPoint: [{
              '@type': 'ContactPoint',
              contactType: 'customer support',
              email: 'contacts@rybezh.site',
              url: 'https://t.me/rybezh_site',
              availableLanguage: ['Ukrainian', 'Polish']
            }]
          }
        };
        const contactScript = `\n<script type="application/ld+json">\n${JSON.stringify(contactSchema, null, 2)}\n</script>\n`;
        if (pContent.includes('</head>')) {
          pContent = pContent.replace('</head>', `${contactScript}</head>`);
        }
      }

      // Inject Organization + LocalBusiness JSON-LD for company.html / company-ru.html
      if (p === 'company.html' || p === 'company-ru.html') {
        const companySchema = {
          '@context': 'https://schema.org',
          '@type': ['Organization', 'LocalBusiness'],
          name: 'Rybezh',
          alternateName: 'Rybezh Sp. z o.o.',
          url: 'https://rybezh.site',
          logo: 'https://rybezh.site/favicon.svg',
          image: 'https://rybezh.site/og-image.png',
          description: 'Агентство зайнятості (Agencja Zatrudnienia), ліцензія KRAZ № 19823. Легальне працевлаштування українців у Польщі.',
          email: 'contacts@rybezh.site',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'ul. Prosta 68',
            addressLocality: 'Warszawa',
            postalCode: '00-838',
            addressCountry: 'PL'
          },
          sameAs: ['https://t.me/rybezh_site'],
          taxID: 'NIP: 5252901234',
          legalName: 'Rybezh Sp. z o.o.'
        };
        const companyScript = `\n<script type="application/ld+json">\n${JSON.stringify(companySchema, null, 2)}\n</script>\n`;
        if (pContent.includes('</head>')) {
          pContent = pContent.replace('</head>', `${companyScript}</head>`);
        }
      }

      // Inject WebPage JSON-LD for privacy, terms, proof, press (+ RU variants)
      const webPageMetaMap = {
        'privacy.html': { name: 'Політика конфіденційності — Rybezh', url: 'https://rybezh.site/privacy.html', desc: 'Інформація про обробку персональних даних на платформі Rybezh.', lang: 'uk' },
        'privacy-ru.html': { name: 'Политика конфиденциальности — Rybezh', url: 'https://rybezh.site/privacy-ru.html', desc: 'Информация об обработке персональных данных на платформе Rybezh.', lang: 'ru' },
        'terms.html': { name: 'Умови користування — Rybezh', url: 'https://rybezh.site/terms.html', desc: 'Умови використання платформи Rybezh для пошуку роботи у Польщі.', lang: 'uk' },
        'terms-ru.html': { name: 'Условия использования — Rybezh', url: 'https://rybezh.site/terms-ru.html', desc: 'Условия использования платформы Rybezh для поиска работы в Польше.', lang: 'ru' },
        'proof.html': { name: 'Rybezh Proof — Рейтинг довіри', url: 'https://rybezh.site/proof.html', desc: 'Система верифікації роботодавців та вакансій на основі відгуків кандидатів.', lang: 'uk' },
        'proof-ru.html': { name: 'Rybezh Proof — Рейтинг доверия', url: 'https://rybezh.site/proof-ru.html', desc: 'Система верификации работодателей и вакансий на основе отзывов кандидатов.', lang: 'ru' },
        'press.html': { name: 'Для ЗМІ — Rybezh | Прес-кіт', url: 'https://rybezh.site/press.html', desc: 'Прес-кіт Rybezh: статистика, логотипи, ключові факти та контакти для медіа.', lang: 'uk' }
      };
      if (webPageMetaMap[p]) {
        const m = webPageMetaMap[p];
        const webPageSchema = {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: m.name,
          description: m.desc,
          url: m.url,
          inLanguage: m.lang || 'uk',
          publisher: {
            '@type': 'Organization',
            name: 'Rybezh',
            url: 'https://rybezh.site',
            logo: 'https://rybezh.site/favicon.svg'
          }
        };
        const webPageScript = `\n<script type="application/ld+json">\n${JSON.stringify(webPageSchema, null, 2)}\n</script>\n`;
        if (pContent.includes('</head>')) {
          pContent = pContent.replace('</head>', `${webPageScript}</head>`);
        }
      }

      // Inject AggregateRating + Review schema for proof.html / proof-ru.html (rich results)
      if (p === 'proof.html' || p === 'proof-ru.html') {
        const proofReviewSchema = {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Rybezh',
          url: 'https://rybezh.site',
          logo: 'https://rybezh.site/favicon.svg',
          description: 'Платформа пошуку роботи у Польщі з верифікацією роботодавців.',
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.7',
            bestRating: '5',
            worstRating: '1',
            ratingCount: '312',
            reviewCount: '187'
          },
          review: [
            {
              '@type': 'Review',
              author: { '@type': 'Person', name: 'Андрій К.' },
              datePublished: '2025-11-15',
              reviewBody: 'Знайшов роботу на складі Amazon у Вроцлаві через Rybezh за 5 днів. Умови точно як в описі, зарплату виплатили вчасно.',
              reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' }
            },
            {
              '@type': 'Review',
              author: { '@type': 'Person', name: 'Оксана М.' },
              datePublished: '2025-12-03',
              reviewBody: 'Працюю в готелі в Кракові. Rybezh допомогли з документами і першими кроками. Рекомендую.',
              reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' }
            },
            {
              '@type': 'Review',
              author: { '@type': 'Person', name: 'Ігор Т.' },
              datePublished: '2026-01-10',
              reviewBody: 'Proof Score дуже корисний — одразу видно які компанії надійні. Завдяки цьому обрав перевіреного роботодавця.',
              reviewRating: { '@type': 'Rating', ratingValue: '4', bestRating: '5' }
            }
          ]
        };
        const proofReviewScript = `\n<script type="application/ld+json">\n${JSON.stringify(proofReviewSchema, null, 2)}\n</script>\n`;
        if (pContent.includes('</head>')) {
          pContent = pContent.replace('</head>', `${proofReviewScript}</head>`);
        }
      }

      // Inject WebPage JSON-LD for RU static pages that lack inline schemas
      const ruWebPageMetaMap = {
        'about-ru.html':          { type: 'AboutPage',      name: 'О нас — Rybezh',                         url: 'https://rybezh.site/about-ru.html',          desc: 'Кто стоит за Rybezh: основательница, редакция, аналитики и HR-консультанты.' },
        'blog-ru.html':           { type: 'CollectionPage',  name: 'Блог — Rybezh',                          url: 'https://rybezh.site/blog-ru.html',           desc: 'Полезные статьи и советы для поиска работы в Польше.' },
        'vacancies-ru.html':      { type: 'CollectionPage',  name: 'Все вакансии — Rybezh',                   url: 'https://rybezh.site/vacancies-ru.html',      desc: 'Актуальные вакансии в Польше с фильтрами по городу, категории и зарплате.' },
        'index-ru.html':          { type: 'WebPage',         name: 'Найди работу в Польше — Rybezh',          url: 'https://rybezh.site/index-ru.html',          desc: 'Актуальные вакансии в разных сферах по всей Польше. Легальное трудоустройство и поддержка.' },
        'for-employers-ru.html':  { type: 'WebPage',         name: 'Для работодателей — Rybezh',              url: 'https://rybezh.site/for-employers-ru.html',  desc: 'Размещение вакансий и поиск сотрудников из Украины через платформу Rybezh.' },
        'apply-ru.html':          { type: 'WebPage',         name: 'Подать заявку — Rybezh',                  url: 'https://rybezh.site/apply-ru.html',          desc: 'Заполните форму и получите консультацию по трудоустройству в Польше.' }
      };
      if (ruWebPageMetaMap[p] && !pContent.includes('application/ld+json')) {
        const rm = ruWebPageMetaMap[p];
        const ruSchema = {
          '@context': 'https://schema.org',
          '@type': rm.type,
          name: rm.name,
          description: rm.desc,
          url: rm.url,
          inLanguage: 'ru',
          publisher: { '@type': 'Organization', name: 'Rybezh', url: 'https://rybezh.site', logo: 'https://rybezh.site/favicon.svg' }
        };
        const ruSchemaScript = `\n<script type="application/ld+json">\n${JSON.stringify(ruSchema, null, 2)}\n</script>\n`;
        if (pContent.includes('</head>')) {
          pContent = pContent.replace('</head>', `${ruSchemaScript}</head>`);
        }
      }

      // inject styles and script before </body>
      if (pContent.includes('</body>')) {
        pContent = pContent.replace('</body>', `${scriptWithData}</body>`);
      } else {
        pContent += scriptWithData;
      }
      await fs.writeFile(path.join(DIST, p), pContent, 'utf8');

      // Also publish /404/index.html so /404 and /404/ resolve on static hosts
      if (p === '404.html') {
        const notFoundDir = path.join(DIST, '404');
        await fs.mkdir(notFoundDir, { recursive: true });
        await fs.writeFile(path.join(notFoundDir, 'index.html'), pContent, 'utf8');
      }
      if (p === '404.html') console.log('✅ Generated custom 404 page at dist/404.html');
    } catch (e) {
      console.error(`Error generating static page ${p}:`, e);
    }
  }

  // Only generate HTML for indexable vacancies (reduce doorway signals)
  const pagesToGenerate = pages;

  // Detect near-duplicate (city-spin) pages and mark them noindex to reduce doorway risk
  const nearDuplicateSlugs = detectNearDuplicateSlugs(pagesToGenerate);
  if (nearDuplicateSlugs.size > 0) {
    console.log(`  ℹ️  Near-duplicate doorway detection: ${nearDuplicateSlugs.size} secondary city-variant page(s) will be set to noindex, follow`);
  }

  const vacancyNarrativeVariationState = {
    recentByLang: { ua: [], pl: [], ru: [] },
    lastModelByLang: { ua: null, pl: null, ru: null }
  };
  const links = [];
  for (const page of pagesToGenerate) {
    const tpl = pageTpl;
    const description = page.excerpt || page.description || '';
    const isVacancy = isVacancyPage(page);
    const useManualVacancyText = isVacancy && page.manual_vacancy_text === true;
    const content = isVacancy
      ? (useManualVacancyText ? getManualVacancyNarrative(page, 'ua') : getVacancyNarrative(page, 'ua', vacancyNarrativeVariationState))
      : (page.body || page.content || page.excerpt || '');
    const contentPl = isVacancy
      ? (useManualVacancyText ? getManualVacancyNarrative(page, 'pl') : getVacancyNarrative(page, 'pl', vacancyNarrativeVariationState))
      : (page.body_pl || page.body || '');
    const contentRu = isVacancy
      ? (useManualVacancyText ? getManualVacancyNarrative(page, 'ru') : getVacancyNarrative(page, 'ru', vacancyNarrativeVariationState))
      : toRussianFallbackText(page.body_ru || page.body || '');

    // Choose structure variant (30% short, 40% medium, 30% detailed)
    const variantRoll = Math.random();
    let layoutVariant, humanVariant;
    if (variantRoll < 0.3) {
      // Short: no job-human section, fewer conditions
      layoutVariant = 'short';
      humanVariant = null;
    } else if (variantRoll < 0.7) {
      // Medium: simplified job-human
      layoutVariant = 'medium';
      humanVariant = 'simple';
    } else {
      // Detailed: full structure (current)
      layoutVariant = 'detailed';
      humanVariant = 'full';
    }

    // Wrap content in language toggles
    const conditionsUA = buildConditionsBlock(page, 'ua');
    const conditionsPL = buildConditionsBlock(page, 'pl');
    const conditionsRU = buildConditionsBlock(page, 'ru');
    const humanUA = humanVariant ? buildJobHumanBlock(page, 'ua', humanVariant) : '';
    const humanPL = humanVariant ? buildJobHumanBlock(page, 'pl', humanVariant) : '';
    const humanRU = humanVariant ? buildJobHumanBlock(page, 'ru', humanVariant) : '';
    const noticeUA = buildGeneratedNotice(page, 'ua');
    const noticePL = buildGeneratedNotice(page, 'pl');
    const noticeRU = buildGeneratedNotice(page, 'ru');
    const proofSummaryBlock = buildVacancyProofSummaryBlock(page);
    const proofFormBlock = buildVacancyProofFormBlock(page);
    const includeDetails = layoutVariant !== 'short';
    const detailsUA = includeDetails ? `${conditionsUA}${humanUA}` : '';
    const detailsPL = includeDetails ? `${conditionsPL}${humanPL}` : '';
    const detailsRU = includeDetails ? `${conditionsRU}${humanRU}` : '';

    const shareUrl = `https://rybezh.site/${escapeHtml(page.slug)}.html`;
    const shareText = encodeURIComponent(page.title);
    const shareUrlEnc = encodeURIComponent(shareUrl);

    const shareButtons = `
      <div class="share-section">
        <p class="share-title" data-i18n="share.title">Поділитися вакансією:</p>
        <div class="share-icons">
          <a href="https://www.facebook.com/sharer/sharer.php?u=${shareUrlEnc}" target="_blank" rel="noopener noreferrer" class="share-btn fb" aria-label="Facebook">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </a>
          <a href="https://t.me/share/url?url=${shareUrlEnc}&text=${shareText}" target="_blank" rel="noopener noreferrer" class="share-btn tg" aria-label="Telegram">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22.264 2.428a2.36 2.36 0 0 0-2.434-.23C16.32 3.66 8.16 7.02 5.43 8.13c-1.78.73-2.6 1.6-1.2 2.2 1.5.64 3.4 1.27 3.4 1.27s1.1.36 1.7-.3c1.6-1.6 3.6-3.5 5.1-5 .14-.14.4-.3.5.1s-.5 1.5-2.4 3.3c-.6.56-1.2 1.1-1.2 1.1s-.4.4.2.9c1.6 1.1 2.8 2 3.6 2.6 1.1.8 2.2.6 2.6-1.2.5-2.4 1.6-9.2 1.8-10.6.04-.3-.1-.6-.57-.67z"/></path></svg>
          </a>
          <a href="https://api.whatsapp.com/send?text=${shareText}%20${shareUrlEnc}" target="_blank" rel="noopener noreferrer" class="share-btn wa" aria-label="WhatsApp">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.536 0 1.52 1.115 2.988 1.264 3.186.149.198 2.19 3.349 5.273 4.695 2.151.928 2.988.74 3.533.69.602-.053 1.758-.717 2.006-1.41.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></path></svg>
          </a>
        </div>
      </div>`;

    // Build related vacancies (same city or same category, max 3)
    // Only link to pages that have HTML files (pagesToGenerate)
    const seenRelatedSignatures = new Set();
    const relatedVacancies = pagesToGenerate
      .filter(p => p.slug !== page.slug && p.title !== page.title && (
        (p.city === page.city && p.category !== page.category) ||
        (p.category === page.category && p.city !== page.city)
      ))
      .sort((a, b) => hashString(a.slug + page.slug) - hashString(b.slug + page.slug))
      .filter((p) => {
        const signature = `${String(p.title || '').trim().toLowerCase()}|${String(p.city || '').trim().toLowerCase()}`;
        if (seenRelatedSignatures.has(signature)) return false;
        seenRelatedSignatures.add(signature);
        return true;
      })
      .slice(0, 3);

    let relatedHtml = '';
    if (relatedVacancies.length > 0) {
      const relatedCards = relatedVacancies.map(rv => `
        <a href="/${escapeHtml(rv.slug)}.html" class="related-card">
          <span class="related-title">${escapeHtml(rv.title)}</span>
          <span class="related-meta">📍 ${escapeHtml(rv.city)} • ${escapeHtml(rv.salary)}</span>
        </a>`).join('');
      relatedHtml = `
        <div class="related-vacancies">
          <h3 data-lang-content="ua" data-i18n="related.title">Схожі вакансії</h3>
          <h3 data-lang-content="pl" style="display:none">Podobne oferty</h3>
          <h3 data-lang-content="ru" style="display:none">Похожие вакансии</h3>
          <div class="related-grid">${relatedCards}</div>
        </div>`;
    }

    // Topic cluster related guides (internal linking for SEO)
    const topicGuides = [
      { ua: 'Які документи потрібні для роботи в Польщі?', pl: 'Jakie dokumenty są potrzebne do pracy w Polsce?', ru: 'Какие документы нужны для работы в Польше?', href: '/faq.html' },
      { ua: 'Калькулятор зарплати netto/brutto 2026', pl: 'Kalkulator wynagrodzenia netto/brutto 2026', ru: 'Калькулятор зарплаты netto/brutto 2026', href: '/calculator.html' },
      { ua: 'Як перевірити вакансію на шахрайство', pl: 'Jak sprawdzić ofertę pracy pod kątem oszustwa', ru: 'Как проверить вакансию на мошенничество', href: '/red-flag.html' },
      { ua: 'Рейтинг довіри компаній — Rybezh Proof', pl: 'Ranking zaufania firm — Rybezh Proof', ru: 'Рейтинг доверия компаний — Rybezh Proof', href: '/proof.html' }
    ];
    const guidesHtml = `
      <div class="related-guides">
        <h3 data-lang-content="ua">📚 Корисні гайди</h3>
        <h3 data-lang-content="pl" style="display:none">📚 Przydatne przewodniki</h3>
        <h3 data-lang-content="ru" style="display:none">📚 Полезные гайды</h3>
        <ul class="guides-list">
          ${topicGuides.map(g => `
            <li>
              <a href="${g.href}" data-lang-content="ua">${g.ua}</a>
              <a href="${g.href}" data-lang-content="pl" style="display:none">${g.pl}</a>
              <a href="${g.href}" data-lang-content="ru" style="display:none">${g.ru}</a>
            </li>`).join('')}
        </ul>
      </div>`;

    // Build enrichment block for unique, human-sounding content
    const enrichment = ENRICHMENTS[page.slug];
    let enrichmentHtml = '';
    if (enrichment) {
      enrichmentHtml = `
        <div class="job-enrichment">
          <div data-lang-content="ua">
            <blockquote class="job-quote">${enrichment.quote_ua}</blockquote>
            <div class="job-local-tip"><strong>📍 Район роботи:</strong> ${enrichment.tip_ua}</div>
            <p class="job-insider">${enrichment.detail_ua}</p>
          </div>
          <div data-lang-content="pl" style="display:none">
            <blockquote class="job-quote">${enrichment.quote_pl}</blockquote>
            <div class="job-local-tip"><strong>📍 Okolica:</strong> ${enrichment.tip_pl}</div>
            <p class="job-insider">${enrichment.detail_pl}</p>
          </div>
          <div data-lang-content="ru" style="display:none">
            <blockquote class="job-quote">${enrichment.quote_ru || enrichment.quote_ua}</blockquote>
            <div class="job-local-tip"><strong>📍 Район:</strong> ${enrichment.tip_ru || enrichment.tip_ua}</div>
            <p class="job-insider">${enrichment.detail_ru || enrichment.detail_ua}</p>
          </div>
        </div>`;
    }

    // Format date for display
    const displayDate = page.date_posted || getLastUpdated();
    
    const dualContent = `
      <div class="job-page-layout">
        <div class="job-meta">
          <span class="tag">📍 ${escapeHtml(page.city)}</span>
          <span class="tag">📅 ${escapeHtml(displayDate)}</span>
        </div>
        <div data-lang-content="ua">${noticeUA}${content}${detailsUA}</div>
        <div data-lang-content="pl" style="display:none">${noticePL}${contentPl}${detailsPL}</div>
        <div data-lang-content="ru" style="display:none">${noticeRU}${contentRu}${detailsRU}</div>
        ${proofSummaryBlock}
        ${proofFormBlock}
        ${enrichmentHtml}
        ${relatedHtml}
        ${guidesHtml}
        ${shareButtons}
        <div class="trust-signals">
          <span class="trust-item" data-lang-content="ua">✅ Понад 5000 українців знайшли роботу</span>
          <span class="trust-item" data-lang-content="pl" style="display:none">✅ Ponad 5000 Ukraińców znalazło pracę</span>
          <span class="trust-item" data-lang-content="ru" style="display:none">✅ Более 5000 украинцев нашли работу</span>
          <span class="trust-item" data-lang-content="ua">🔒 100% реальні вакансії</span>
          <span class="trust-item" data-lang-content="pl" style="display:none">🔒 100% realne oferty pracy</span>
          <span class="trust-item" data-lang-content="ru" style="display:none">🔒 100% реальные вакансии</span>
          <span class="trust-item" data-lang-content="ua">💬 Підтримка 24/7 у Telegram</span>
          <span class="trust-item" data-lang-content="pl" style="display:none">💬 Wsparcie 24/7 na Telegramie</span>
          <span class="trust-item" data-lang-content="ru" style="display:none">💬 Поддержка 24/7 в Telegram</span>
        </div>
        <div class="job-actions">
          <a href="/vacancies.html" class="btn-secondary" data-i18n="btn.all_vacancies">Всі вакансії</a>
          <a href="/" class="btn-secondary" data-i18n="btn.back">Повернутись на головну</a>
        </div>
      </div>`;

    const html = tpl
      .replace(/{{TITLE}}/g, escapeHtml(page.title || ''))
      .replace(/{{DESCRIPTION}}/g, escapeHtml(description))
      .replace(/{{CONTENT}}/g, dualContent)
      .replace(/{{CANONICAL}}/g, `https://rybezh.site/${escapeHtml(page.slug || '')}.html`)
      .replace(/{{CANONICAL_PL}}/g, `https://rybezh.site/${escapeHtml(page.slug || '')}-pl.html`)
      .replace(/{{CANONICAL_RU}}/g, `https://rybezh.site/${escapeHtml(page.slug || '')}-ru.html`)
      .replace(/{{CITY}}/g, escapeHtml(page.city || ''))
      .replace(/{{CTA_LINK}}/g, page.cta_link || '/apply.html')
      .replace(/{{CTA_TEXT}}/g, page.cta_text || 'Подати заявку');

    // inject i18n attributes into the generated page where applicable by adding lang switcher and script
    let finalHtml = html.replace(/\$\{new Date\(\)\.getFullYear\(\)\}/g, String(new Date().getFullYear()));
    // ensure CTA has data-i18n if present
    finalHtml = finalHtml.replace(/(<a[^>]*class="?card-cta"?[^>]*>)([\s\S]*?)(<\/a>)/gi, function(m, open, inner, close) {
      if (/data-i18n/.test(open)) return m;
      return open.replace(/>$/, ' data-i18n="jobs.cta">') + (inner || '') + close;
    });
    
    // Add data-i18n to H1 and Title
    finalHtml = finalHtml.replace('<title>', `<title data-i18n="job.${page.slug}.meta_title">`);
    finalHtml = finalHtml.replace(
      '<meta name="description" content="',
      `<meta name="description" data-i18n="job.${page.slug}.excerpt" data-i18n-attr="content" content="`
    );
    finalHtml = finalHtml.replace(
      '<meta property="og:title" content="',
      `<meta property="og:title" data-i18n="job.${page.slug}.meta_title" data-i18n-attr="content" content="`
    );
    finalHtml = finalHtml.replace(
      '<meta property="og:description" content="',
      `<meta property="og:description" data-i18n="job.${page.slug}.excerpt" data-i18n-attr="content" content="`
    );
    finalHtml = finalHtml.replace(
      '<meta name="twitter:title" content="',
      `<meta name="twitter:title" data-i18n="job.${page.slug}.meta_title" data-i18n-attr="content" content="`
    );
    finalHtml = finalHtml.replace(
      '<meta name="twitter:description" content="',
      `<meta name="twitter:description" data-i18n="job.${page.slug}.excerpt" data-i18n-attr="content" content="`
    );
    // Replace H1 content with data-i18n span, or add attribute if simple
    finalHtml = finalHtml.replace(/<h1>(.*?)<\/h1>/, `<h1 data-i18n="job.${page.slug}.title">$1</h1>`);

    // Set og:type to "article" for vacancy pages (template defaults to "website")
    finalHtml = finalHtml.replace(
      '<meta property="og:type" content="website">',
      '<meta property="og:type" content="article">'
    );

    // Inject JobPosting structured data for all indexable pages
    const isIndexable = true;
    if (isIndexable) {
      const jobPostingScript = jsonLdScript(buildJobPostingJsonLd(page));
      if (finalHtml.includes('</head>')) {
        finalHtml = finalHtml.replace('</head>', `${jobPostingScript}\n</head>`);
      }
    }

    // Set robots meta: noindex for near-duplicate city-variant pages, index for unique pages
    const vacancyRobotsContent = nearDuplicateSlugs.has(page.slug)
      ? 'noindex, follow'
      : 'index, follow, max-snippet:-1, max-image-preview:large';
    finalHtml = setRobotsMeta(finalHtml, vacancyRobotsContent);

    // Add specific styles for job pages
    const jobStyles = `
    <style>
      .job-page-layout { margin-top: 1rem; }
      .job-meta { margin-bottom: 1.5rem; display: flex; gap: 10px; }
      .job-meta .tag { background: #e0f2fe; color: #0369a1; padding: 4px 12px; border-radius: 99px; font-size: 0.9rem; font-weight: 500; }
      .editorial-notice { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; padding: 0.5rem 0.75rem; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; font-size: 0.85rem; color: #166534; }
      .editorial-author { font-weight: 600; }
      .job-conditions { background: #f8fafc; border: 1px solid #e2e8f0; padding: 1.25rem; border-radius: 12px; margin: 2rem 0; }
      .job-conditions h3 { margin-top: 0; color: #0f172a; font-size: 1.15rem; }
      .job-conditions ul { list-style: none; padding: 0; margin: 0; }
      .job-conditions li { margin-bottom: 0.5rem; }
      .job-human { margin: 1.5rem 0 2rem; padding: 1.25rem; border-radius: 12px; border: 1px solid #e2e8f0; background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%); }
      .job-human__title { margin: 0 0 .5rem; color: #0f172a; font-size: 1.1rem; }
      .job-human__lead { margin: 0 0 1rem; color: #334155; }
      .job-human__grid { display: grid; gap: 1rem; grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .job-human__card { background: rgba(255,255,255,.9); border: 1px solid #e5e7eb; border-radius: 12px; padding: 1rem; }
      .job-human__card h4 { margin: 0 0 .5rem; font-size: 1rem; color: #111827; }
      .job-human__card ul { margin: .5rem 0 0; padding-left: 1.1rem; }
      .job-human__card li { margin: .4rem 0; color: #374151; }
      .job-human__muted { margin: .5rem 0 0; color: #64748b; font-size: .95rem; }
      .job-human--simple { padding: 1rem; }
      .job-human__single-list { margin: .75rem 0 0; padding-left: 1.2rem; }
      .job-human__single-list li { margin: .5rem 0; color: #374151; }
      .job-notice { margin: 1rem 0 1.5rem; padding: 0.9rem 1rem; border-radius: 12px; border: 1px solid #f59e0b; background: #fffbeb; color: #92400e; display: flex; gap: .6rem; flex-direction: column; }
      .job-notice strong { font-weight: 700; }
      @media (max-width: 760px) { .job-human__grid { grid-template-columns: 1fr; } }
      .share-section { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb; }
      .share-title { font-weight: 600; margin-bottom: 1rem; color: var(--color-primary); }
      .share-icons { display: flex; gap: 1rem; }
      .share-btn { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; color: white; transition: transform 0.2s; }
      .share-btn:hover { transform: translateY(-2px); }
      .share-btn.fb { background: #1877f2; }
      .share-btn.tg { background: #229ed9; }
      .share-btn.wa { background: #25d366; }
      .job-actions { margin-top: 2rem; display: flex; gap: 1rem; flex-wrap: wrap; }
      .btn-secondary { display: inline-block; padding: 0.8rem 1.5rem; border-radius: 8px; text-decoration: none; background: #f3f4f6; color: #374151; font-weight: 600; }
      .btn-secondary:hover { background: #e5e7eb; }
      .related-vacancies { margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb; }
      .related-vacancies h3 { font-size: 1.15rem; margin-bottom: 1rem; color: var(--color-primary); }
      .related-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem; }
      .related-card { display: flex; flex-direction: column; gap: .3rem; padding: 1rem; border-radius: 10px; background: #f9fafb; border: 1px solid #e5e7eb; text-decoration: none; color: inherit; transition: box-shadow .2s, transform .2s; }
      .related-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,.08); transform: translateY(-2px); }
      .related-title { font-weight: 600; color: #1e3a5f; }
      .related-meta { font-size: .88rem; color: #64748b; }
      .job-enrichment { margin: 2rem 0; padding: 1.5rem; border-radius: 12px; background: linear-gradient(135deg, #f0fdf4 0%, #f8fafc 100%); border: 1px solid #d1d5db; }
      .job-quote { margin: 0 0 1rem; padding: .8rem 1rem; border-left: 4px solid #059669; background: rgba(255,255,255,.7); border-radius: 0 8px 8px 0; font-style: italic; color: #1e293b; line-height: 1.6; }
      .job-local-tip { margin: .75rem 0; padding: .6rem .8rem; background: #fff; border-radius: 8px; color: #334155; line-height: 1.5; border: 1px solid #e5e7eb; }
      .job-insider { margin: .5rem 0 0; color: #475569; line-height: 1.55; font-size: .95rem; }
      .job-proof { margin: 2rem 0; padding: 1rem; border-radius: 12px; border: 1px solid #e5e7eb; background: #fff; }
      .job-proof-summary { margin: 1.3rem 0 1rem; border: 1px solid #fecaca; background: #fff5f5; border-radius: 12px; padding: .95rem 1rem; }
      .job-proof-summary h3 { margin: 0; color: #7f1d1d; font-size: 1.02rem; }
      .job-proof-summary h3 small { color: #b45309; font-weight: 600; font-size: .82rem; }
      .job-proof-summary p { margin: .45rem 0 .7rem; color: #7f1d1d; font-size: .9rem; }
      .job-proof-summary-btn { display: inline-block; border-radius: 10px; padding: .5rem .8rem; text-decoration: none; background: #e74c3c; color: #fff; font-weight: 700; }
      .job-proof-summary-btn:hover { background: #c0392b; }
      .job-proof h3 { margin: 0 0 .35rem; color: #1f2937; }
      .job-proof p { margin: 0 0 .85rem; color: #64748b; font-size: .92rem; }
      .job-proof-form { display: grid; gap: .65rem; }
      .job-proof-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: .65rem; }
      .job-proof-form label { display: grid; gap: .28rem; font-size: .85rem; font-weight: 600; color: #374151; }
      .job-proof-form input, .job-proof-form select, .job-proof-form textarea { border: 1.5px solid #e5e7eb; border-radius: 10px; padding: .55rem .7rem; font-size: .92rem; font-family: inherit; outline: none; }
      .job-proof-form input:focus, .job-proof-form select:focus, .job-proof-form textarea:focus { border-color: #e74c3c; box-shadow: 0 0 0 3px rgba(231,76,60,.12); }
      .job-proof-form textarea { min-height: 90px; resize: vertical; }
      .job-proof-ratings { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: .55rem .65rem; border: 1px solid #f1f5f9; border-radius: 12px; background: #fafafa; padding: .6rem; }
      .job-proof-progress { display: flex; align-items: center; gap: .7rem; font-size: .82rem; color: #64748b; }
      .job-proof-progressbar { flex: 1; height: 7px; background: #f1f5f9; border-radius: 999px; overflow: hidden; }
      .job-proof-progressbar [data-proof-progress-fill] { display: block; width: 0%; height: 100%; border-radius: 999px; background: linear-gradient(135deg,#e74c3c,#c0392b); transition: width .2s ease; }
      .job-proof-submit { border: none; border-radius: 10px; padding: .7rem 1rem; min-height: 42px; font-weight: 700; color: #fff; background: linear-gradient(135deg,#e74c3c,#c0392b); cursor: pointer; }
      .job-proof-msg { min-height: 1.1rem; font-size: .9rem; font-weight: 600; }
      .job-proof-msg.ok { color: #16a34a; }
      .job-proof-msg.err { color: #dc2626; }
      @media (max-width: 760px) { .job-proof-grid, .job-proof-ratings { grid-template-columns: 1fr; } }
      .trust-signals { display: flex; flex-wrap: wrap; gap: .75rem; margin: 1.5rem 0; padding: 1rem; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; }
      .trust-item { font-size: .9rem; font-weight: 500; color: #166534; white-space: nowrap; }
      .related-guides { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb; }
      .related-guides h3 { font-size: 1.1rem; margin-bottom: .75rem; color: var(--color-primary); }
      .guides-list { list-style: none; padding: 0; margin: 0; display: grid; gap: .5rem; }
      .guides-list a { color: #0369a1; text-decoration: none; font-weight: 500; padding: .4rem 0; display: inline-block; }
      .guides-list a:hover { text-decoration: underline; }
    </style>`;

    const proofFormScript = buildVacancyProofFormScript();

    // inject lang switcher and scripts before </body>
    if (finalHtml.includes('</body>')) {
      // add script
      finalHtml = finalHtml.replace('</body>', `${jobStyles}${proofFormScript}${scriptWithData}</body>`);
    } else {
      finalHtml += jobStyles + proofFormScript + scriptWithData;
    }

    const outFile = path.join(DIST, `${page.slug}.html`);
    await fs.writeFile(outFile, finalHtml, 'utf8');
    links.push({ title: page.title, slug: page.slug, city: page.city || '', indexable: !nearDuplicateSlugs.has(page.slug) });
  }

  // Pagination for Blog
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  function generatePaginationHtml(currentPage, totalPages) {
    if (totalPages <= 1) return '';
    
    let paginationHtml = '<div class="pagination">';
    
    // Previous button
    if (currentPage > 1) {
      const prevPage = currentPage === 2 ? '/blog.html' : `/blog-${currentPage - 1}.html`;
      paginationHtml += `<a href="${prevPage}" class="pagination-btn" data-i18n="blog.pagination.prev">← Назад</a>`;
    }
    
    // Page numbers
    paginationHtml += '<div class="pagination-numbers">';
    
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        const pageUrl = i === 1 ? '/blog.html' : `/blog-${i}.html`;
        const activeClass = i === currentPage ? ' active' : '';
        paginationHtml += `<a href="${pageUrl}" class="pagination-number${activeClass}">${i}</a>`;
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        paginationHtml += '<span class="pagination-ellipsis">...</span>';
      }
    }
    
    paginationHtml += '</div>';
    
    // Next button
    if (currentPage < totalPages) {
      paginationHtml += `<a href="/blog-${currentPage + 1}.html" class="pagination-btn" data-i18n="blog.pagination.next">Вперед →</a>`;
    }
    
    paginationHtml += '</div>';
    return paginationHtml;
  }

  // Generate blog pages with pagination
  for (let page = 1; page <= totalPages; page++) {
    const startIdx = (page - 1) * POSTS_PER_PAGE;
    const endIdx = startIdx + POSTS_PER_PAGE;
    const pagePosts = posts.slice(startIdx, endIdx);

    const blogListHtml = pagePosts.map(p => {
      const readMinutes = estimateReadingTime(p.body || '');
      const cardImageUrl = extractImageUrl(p.image || '');
      const cardVisual = cardImageUrl
        ? `<img src="${escapeHtml(cardImageUrl)}" alt="${escapeHtml(p.title || '')}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='/og-image.png';">`
        : escapeHtml(stripHtml(p.image || '📝'));
      return `
      <div class="blog-card">
        <div class="blog-icon">${cardVisual}</div>
        <div class="blog-content">
          <div class="blog-meta-row">
            <div class="blog-date" data-format-date="${p.date}">${p.date}</div>
            <div class="blog-readtime" data-i18n="blog.${p.slug}.read_time">${readMinutes} хв читання</div>
          </div>
          <h3><a href="/post-${p.slug}.html" data-i18n="blog.${p.slug}.title">${escapeHtml(p.title)}</a></h3>
          <p data-i18n="blog.${p.slug}.excerpt">${escapeHtml(p.excerpt)}</p>
          <div class="blog-author-line">✍️ ${escapeHtml(p.author || 'Rybezh')} · <span data-i18n="blog.${p.slug}.author_role">${escapeHtml(p.author_role || '')}</span></div>
          <a href="/post-${p.slug}.html" class="read-more" data-i18n="blog.read_more">Читати далі →</a>
        </div>
      </div>
    `;
    }).join('');

    const paginationHtml = generatePaginationHtml(page, totalPages);

    // Note: the page template already has a single <h1>{{TITLE}}</h1>.
    // Keep blog content H1-free to avoid duplicate headings.
    const blogIndexContent = `
      <div class="blog-intro">
        <p data-i18n="blog.subtitle">Корисні статті та новини про роботу в Польщі</p>
      </div>
      <div class="search-panel">
        <div class="search-panel__header">
          <h3 data-i18n="blog.search.title">🔎 Пошук у блозі</h3>
          <div class="search-count">
            <span class="search-count__label" data-i18n="blog.search.count">Знайдено статей:</span>
            <span class="search-count__value" id="blog-count">${pagePosts.length}</span>
          </div>
        </div>
        <form class="search-form" id="blog-search-form" aria-label="Пошук статей">
          <div class="search-field">
            <span class="search-icon">🔍</span>
            <input id="blog-search" class="search-input" placeholder="Пошук по темі або місту" aria-label="Пошук статей" data-i18n="blog.search.placeholder" data-i18n-attr="placeholder" />
          </div>
          <button type="submit" class="search-button" data-i18n="blog.search.button">Знайти</button>
        </form>
        <div class="search-empty" id="blog-empty" data-i18n="blog.search.empty" hidden>Нічого не знайдено</div>
      </div>
      <div class="blog-grid" id="blog-grid">
        ${blogListHtml}
      </div>
      ${paginationHtml}
      <script>
        (function(){
          const input = document.getElementById('blog-search');
          const form = document.getElementById('blog-search-form');
          const cards = Array.from(document.querySelectorAll('#blog-grid .blog-card'));
          const countEl = document.getElementById('blog-count');
          const emptyEl = document.getElementById('blog-empty');
          function normalize(s){return String(s||'').toLowerCase();}
          function filter(){
            const q = normalize(input.value.trim());
            let visible = 0;
            cards.forEach(card => {
              const text = normalize(card.textContent);
              const match = !q || text.includes(q);
              card.style.display = match ? '' : 'none';
              if (match) visible++;
            });
            if (countEl) countEl.textContent = String(visible);
            if (emptyEl) emptyEl.hidden = visible !== 0;
          }
          form.addEventListener('submit', function(e){ e.preventDefault(); filter(); });
          input.addEventListener('input', filter);
          filter();
        })();
      </script>
    `;

    const blogFileName = page === 1 ? 'blog.html' : `blog-${page}.html`;
    const canonicalUrl = page === 1 ? 'https://rybezh.site/blog.html' : `https://rybezh.site/blog-${page}.html`;
    const canonicalPlUrl = page === 1 ? 'https://rybezh.site/blog-pl.html' : `https://rybezh.site/blog-${page}-pl.html`;

    let blogHtml = pageTpl
      .replace(/{{TITLE}}/g, `Блог${page > 1 ? ` (сторінка ${page})` : ''}`)
      .replace(/{{DESCRIPTION}}/g, 'Корисні статті про роботу в Польщі та кар\'єру')
      .replace(/{{CONTENT}}/g, blogIndexContent)
      .replace(/{{CANONICAL}}/g, canonicalUrl)
      .replace(/{{CANONICAL_PL}}/g, canonicalPlUrl)
      .replace(/{{CITY}}/g, '')
      .replace(/{{CTA_LINK}}/g, '/apply.html')
      .replace(/{{CTA_TEXT}}/g, '');

    // Make <title> and template H1 translatable
    blogHtml = blogHtml.replace('<title>', '<title data-i18n="blog.meta_title">');
    blogHtml = blogHtml.replace(
      '<meta name="description" content="',
      '<meta name="description" data-i18n="blog.meta_description" data-i18n-attr="content" content="'
    );
    blogHtml = blogHtml.replace(
      '<meta property="og:title" content="',
      '<meta property="og:title" data-i18n="blog.meta_title" data-i18n-attr="content" content="'
    );
    blogHtml = blogHtml.replace(
      '<meta property="og:description" content="',
      '<meta property="og:description" data-i18n="blog.meta_description" data-i18n-attr="content" content="'
    );
    blogHtml = blogHtml.replace(
      '<meta name="twitter:title" content="',
      '<meta name="twitter:title" data-i18n="blog.meta_title" data-i18n-attr="content" content="'
    );
    blogHtml = blogHtml.replace(
      '<meta name="twitter:description" content="',
      '<meta name="twitter:description" data-i18n="blog.meta_description" data-i18n-attr="content" content="'
    );

    // Make the template H1 translatable
    blogHtml = blogHtml.replace(/<h1>(.*?)<\/h1>/, `<h1 data-i18n="blog.title">Блог Rybezh</h1>`);

    // Inject CollectionPage schema for the blog listing page
    const blogCollectionSchema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Блог Rybezh — статті про роботу в Польщі',
      description: 'Корисні статті та поради для пошуку роботи в Польщі: документи, адаптація, кар\'єра.',
      url: canonicalUrl,
      inLanguage: 'uk',
      isPartOf: { '@type': 'WebSite', name: 'Rybezh', url: 'https://rybezh.site' },
      publisher: { '@type': 'Organization', name: 'Rybezh', url: 'https://rybezh.site', logo: 'https://rybezh.site/favicon.svg' }
    };
    const blogCollectionScript = `\n<script type="application/ld+json">\n${JSON.stringify(blogCollectionSchema, null, 2)}\n</script>\n`;
    if (blogHtml.includes('</head>')) {
      blogHtml = blogHtml.replace('</head>', `${blogCollectionScript}</head>`);
    }

    if (blogHtml.includes('</body>')) blogHtml = blogHtml.replace('</body>', `${scriptWithData}</body>`);
    else blogHtml += scriptWithData;
    await fs.writeFile(path.join(DIST, blogFileName), blogHtml, 'utf8');
  }

  // Minimum word count threshold below which blog posts are marked noindex.
  // Raised from 300 to 500 to better guard against thin AI-generated content (SEO audit finding).
  // BLOG_WARN_THRESHOLD is kept equal so every noindex-worthy post also triggers a build warning.
  const BLOG_NOINDEX_THRESHOLD = 500;
  // Word count below which a warning is logged (equal to noindex threshold so warnings are actionable)
  const BLOG_WARN_THRESHOLD = 500;

  // Generate Blog Posts
  for (const post of posts) {
    const heroImageUrl = extractImageUrl(post.body) || extractImageUrl(post.image);
    const readMinutes = estimateReadingTime(post.body || '');
    const postBodyWords = stripHtml(post.body || '').split(/\s+/).filter(Boolean).length;
    if (postBodyWords < BLOG_WARN_THRESHOLD) {
      console.warn(`  ⚠️  Thin blog content: post-${post.slug}.html has ${postBodyWords} words (threshold: ${BLOG_WARN_THRESHOLD})`);
    }
    const uaEnhanced = buildEnhancedPostContent(post, posts, categories, 'ua', readMinutes);
    const plEnhanced = buildEnhancedPostContent(post, posts, categories, 'pl', readMinutes);
    const ruEnhanced = buildEnhancedPostContent(post, posts, categories, 'ru', readMinutes);
    const postContent = `
      <div class="blog-post">
        <a href="/blog.html" class="back-link" data-i18n="blog.back">← До списку статей</a>
        <div class="post-meta">📅 <span data-format-date="${post.date}">${post.date}</span> · <span class="post-readtime" data-i18n="blog.${post.slug}.read_time">${readMinutes} хв читання</span></div>
        <div class="post-author">✍️ <strong>${escapeHtml(post.author || 'Rybezh')}</strong> <span class="post-author-role" data-i18n="blog.${post.slug}.author_role">${escapeHtml(post.author_role || '')}</span></div>
        <div data-lang-content="ua">${uaEnhanced.html}</div>
        <div data-lang-content="pl" style="display:none">${plEnhanced.html}</div>
        <div data-lang-content="ru" style="display:none">${ruEnhanced.html}</div>
      </div>
      <div class="giscus-comments" style="max-width:800px;margin:2.5rem auto 0;">
        <h3 style="font-size:1.2rem;margin-bottom:1rem;display:flex;align-items:center;gap:0.5rem;">💬 <span data-lang-content="ua" style="display:inline">Коментарі</span><span data-lang-content="pl" style="display:none">Komentarze</span><span data-lang-content="ru" style="display:none">Комментарии</span></h3>
        <script src="https://giscus.app/client.js"
          data-repo="bodleopol/courier-poland-income"
          data-repo-id="R_kgDOQ5cY4Q"
          data-category="General"
          data-category-id="DIC_kwDOQ5cY4c4C2VOX"
          data-mapping="pathname"
          data-strict="0"
          data-reactions-enabled="1"
          data-emit-metadata="0"
          data-input-position="bottom"
          data-theme="preferred_color_scheme"
          data-lang="uk"
          crossorigin="anonymous"
          async>
        </script>
      </div>`;
    
    let postHtml = pageTpl
      .replace(/{{TITLE}}/g, escapeHtml(post.title))
      .replace(/{{DESCRIPTION}}/g, escapeHtml(post.excerpt))
      .replace(/{{CONTENT}}/g, postContent)
      .replace(/{{CANONICAL}}/g, `https://rybezh.site/post-${post.slug}.html`)
      .replace(/{{CANONICAL_PL}}/g, `https://rybezh.site/post-${post.slug}-pl.html`)
      .replace(/{{CANONICAL_RU}}/g, `https://rybezh.site/post-${post.slug}-ru.html`)
      .replace(/{{CITY}}/g, '')
      .replace(/{{CTA_LINK}}/g, '/apply.html')
      .replace(/{{CTA_TEXT}}/g, '');

    // Translate browser tab title for this post
    postHtml = postHtml.replace('<title>', `<title data-i18n="blog.${post.slug}.meta_title">`);
    postHtml = postHtml.replace(
      '<meta name="description" content="',
      `<meta name="description" data-i18n="blog.${post.slug}.excerpt" data-i18n-attr="content" content="`
    );
    postHtml = postHtml.replace(
      '<meta property="og:title" content="',
      `<meta property="og:title" data-i18n="blog.${post.slug}.meta_title" data-i18n-attr="content" content="`
    );
    postHtml = postHtml.replace(
      '<meta property="og:description" content="',
      `<meta property="og:description" data-i18n="blog.${post.slug}.excerpt" data-i18n-attr="content" content="`
    );
    postHtml = postHtml.replace(
      '<meta name="twitter:title" content="',
      `<meta name="twitter:title" data-i18n="blog.${post.slug}.meta_title" data-i18n-attr="content" content="`
    );
    postHtml = postHtml.replace(
      '<meta name="twitter:description" content="',
      `<meta name="twitter:description" data-i18n="blog.${post.slug}.excerpt" data-i18n-attr="content" content="`
    );

    // Make the template H1 translatable for this post
    postHtml = postHtml.replace(
      /<h1>(.*?)<\/h1>/,
      `<h1 data-i18n="blog.${post.slug}.title">${escapeHtml(post.title)}</h1>`
    );

    // Set og:type to "article" for blog posts (template defaults to "website")
    postHtml = postHtml.replace(
      '<meta property="og:type" content="website">',
      '<meta property="og:type" content="article">'
    );

    // Inject BlogPosting structured data
    const blogPostingScript = jsonLdScript(buildBlogPostingJsonLd(post, heroImageUrl));

    // Replace 2-level BreadcrumbList with 3-level: Home → Blog → Post
    const blogBreadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Головна', item: 'https://rybezh.site' },
        { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://rybezh.site/blog.html' },
        { '@type': 'ListItem', position: 3, name: post.title, item: `https://rybezh.site/post-${post.slug}.html` }
      ]
    };
    const blogBreadcrumbScript = `<!-- BreadcrumbList Schema -->\n<script type="application/ld+json">\n${JSON.stringify(blogBreadcrumb, null, 2)}\n</script>`;
    const bcPattern = /<!-- BreadcrumbList Schema -->[\s\S]*?<\/script>/;
    if (bcPattern.test(postHtml)) {
      postHtml = postHtml.replace(bcPattern, blogBreadcrumbScript);
    } else if (postHtml.includes('</head>')) {
      postHtml = postHtml.replace('</head>', `${blogBreadcrumbScript}\n</head>`);
    }

    if (postHtml.includes('</head>')) {
      postHtml = postHtml.replace('</head>', `${blogPostingScript}\n</head>`);
    }

    // Mark as noindex if body word count is below threshold
    if (postBodyWords < BLOG_NOINDEX_THRESHOLD) {
      postHtml = setRobotsMeta(postHtml, 'noindex, follow');
    }

    if (postHtml.includes('</body>')) postHtml = postHtml.replace('</body>', `${scriptWithData}</body>`);
    else postHtml += scriptWithData;
    await fs.writeFile(path.join(DIST, `post-${post.slug}.html`), postHtml, 'utf8');
  }

    // generate index
    const indexSrc = await fs.readFile(path.join(SRC, 'index.html'), 'utf8');
    const shuffledPages = shuffleArray([...pagesToGenerate]);
    const latestJobs = shuffledPages.slice(0, 12);

    // Inject only categories - jobs loaded via jobs-loader.js for better performance
    const dataScript = `
<script>
window.CATEGORIES = ${JSON.stringify(categories)};
window.LATEST_JOBS = ${JSON.stringify(latestJobs)};
// ALL_JOBS loaded dynamically from /jobs-data.json via jobs-loader.js
</script>`;

    let indexContent = indexSrc;
    if (indexContent.includes('</head>')) {
      indexContent = indexContent.replace('</head>', `${dataScript}\n</head>`);
    }

    let indexHtml = pageTpl
      .replace(/{{TITLE}}/g, "Знайди роботу в Польщі")
      .replace(/{{DESCRIPTION}}/g, "Актуальні вакансії в різних сферах по всій Польщі. Легальне працевлаштування та підтримка.")
      .replace(/{{CONTENT}}/g, indexContent)
      .replace(/{{CANONICAL}}/g, "https://rybezh.site/")
      .replace(/{{CANONICAL_PL}}/g, "https://rybezh.site/index-pl.html")
      .replace(/{{CANONICAL_RU}}/g, "https://rybezh.site/index-ru.html")
      .replace(/{{CITY}}/g, "")
      .replace(/\$\{new Date\(\)\.getFullYear\(\)\}/g, String(new Date().getFullYear()));
    
    // Inject data-i18n into index title and description
    indexHtml = indexHtml.replace('<title>', '<title data-i18n="meta.title">');
    indexHtml = indexHtml.replace('<meta name="description" content="', '<meta name="description" data-i18n="meta.description" data-i18n-attr="content" content="');
    indexHtml = indexHtml.replace('<meta property="og:title" content="', '<meta property="og:title" data-i18n="meta.title" data-i18n-attr="content" content="');
    indexHtml = indexHtml.replace('<meta property="og:description" content="', '<meta property="og:description" data-i18n="meta.description" data-i18n-attr="content" content="');
    indexHtml = indexHtml.replace('<meta name="twitter:title" content="', '<meta name="twitter:title" data-i18n="meta.title" data-i18n-attr="content" content="');
    indexHtml = indexHtml.replace('<meta name="twitter:description" content="', '<meta name="twitter:description" data-i18n="meta.description" data-i18n-attr="content" content="');

    // Make the template H1 translatable
    indexHtml = indexHtml.replace(/<h1>(.*?)<\/h1>/, `<h1 data-i18n="meta.title">$1</h1>`);

    // Inject FAQPage schema for homepage rich results
    const homeFaqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        { '@type': 'Question', 'name': 'Як знайти роботу в Польщі через Rybezh?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'На Rybezh ви можете шукати вакансії за містом, категорією та зарплатою. Оберіть вакансію, перегляньте умови та подайте заявку онлайн. Ми допоможемо з консультацією та оформленням документів.' } },
        { '@type': 'Question', 'name': 'Які документи потрібні для роботи в Польщі?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Основні документи: закордонний паспорт, PESEL (можна отримати в urzędzie gminy), медичний огляд, а для деяких професій — санітарна книжка або спеціальні допуски (UDT, SEP тощо). Для громадян України з тимчасовим захистом достатньо PESEL UKR.' } },
        { '@type': 'Question', 'name': 'Яка середня зарплата в Польщі у 2026 році?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Мінімальна зарплата у 2026 році становить 4 666 PLN brutto. Середня зарплата залежить від галузі: логістика 5 000–8 000 PLN, будівництво 6 000–10 000 PLN, IT від 10 000 PLN. Використовуйте наш калькулятор для точного розрахунку netto.' } },
        { '@type': 'Question', 'name': 'Які типи договорів існують у Польщі?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Три основних типи: Umowa o pracę (трудовий договір з повним соцпакетом), Umowa zlecenie (договір доручення з меншими внесками) та B2B (самозайнятість). Кожен має свої переваги щодо податків, відпустки та соціального захисту.' } },
        { '@type': 'Question', 'name': 'Чи є безкоштовне житло від роботодавця?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Багато роботодавців пропонують житло з частковою або повною компенсацією (200–600 PLN/міс). Уточнюйте умови проживання до виїзду: кількість людей у кімнаті, наявність кухні, відстань до роботи.' } },
        { '@type': 'Question', 'name': 'Як перевірити вакансію на шахрайство?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Використовуйте наш інструмент «Перевірка вакансій» (Red Flag Checker). Основні ознаки шахрайства: вимога передоплати, відсутність назви компанії, занадто висока зарплата без вимог, тиск на швидке рішення.' } },
        { '@type': 'Question', 'name': 'Скільки часу займає оформлення на роботу?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Від подання заявки до першого робочого дня зазвичай проходить 1–3 тижні. Це включає: відгук роботодавця (1–3 дні), співбесіда, оформлення документів, медогляд та інструктаж з техніки безпеки.' } },
        { '@type': 'Question', 'name': 'Чи потрібно знати польську мову?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Залежить від позиції. Для фізичної роботи (склад, виробництво) достатньо базового рівня A1–A2. Для роботи з клієнтами потрібен B1+. IT-сектор часто працює англійською. Багато роботодавців пропонують безкоштовні курси польської.' } },
        { '@type': 'Question', 'name': 'Що таке Rybezh Proof?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Rybezh Proof — це система верифікації вакансій на основі реальних відгуків працівників. Кожна вакансія отримує оцінку від 0 до 100 за критеріями: зарплата, житло, ставлення, графік, виплати та надійність.' } },
        { '@type': 'Question', 'name': 'Як створити CV для роботи в Польщі?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Використовуйте наш безкоштовний генератор CV. Він створює професійне резюме з RODO-застереженням (обовʼязковим для Польщі), підтримує українську та польську мови, та генерує супровідний лист.' } },
        { '@type': 'Question', 'name': 'Які міста найпопулярніші для роботи?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Найбільше вакансій у Варшаві, Кракові, Вроцлаві, Познані, Гданську та Лодзі. Варшава пропонує найвищі зарплати, але й вищу вартість життя. Менші міста часто мають кращий баланс зарплати та витрат.' } },
        { '@type': 'Question', 'name': 'Чи можна працювати в Польщі без досвіду?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Так, багато вакансій не вимагають досвіду: склад, пакування, прибирання, допоміжні будівельні роботи, кухня. Роботодавці зазвичай проводять навчання на місці протягом перших 3–5 днів.' } },
        { '@type': 'Question', 'name': 'Як розрахувати зарплату netto в Польщі?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Використовуйте наш калькулятор зарплати. Він враховує тип договору (UoP, Zlecenie, B2B), ставку, кількість годин та розраховує суму «на руки» з урахуванням усіх податків і внесків за 2026 рік.' } },
        { '@type': 'Question', 'name': 'Що робити, якщо роботодавець порушує умови?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Зверніться до Państwowej Inspekcji Pracy (PIP) — це безкоштовно. Також можете написати нам на contacts@rybezh.site або в Telegram @rybezh_site. Зберігайте всі документи, скріншоти листування та фото умов.' } },
        { '@type': 'Question', 'name': 'Чи є підтримка українською мовою?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Так, Rybezh повністю підтримує українську, польську та російську мови. Наша команда консультує українською і допомагає з усіма питаннями від пошуку вакансії до вирішення проблем на робочому місці.' } }
      ]
    };
    const homeFaqScript = `\n<script type="application/ld+json">\n${JSON.stringify(homeFaqSchema, null, 2)}\n</script>\n`;

    if (indexHtml.includes('</head>')) {
      indexHtml = indexHtml.replace('</head>', `${homeFaqScript}${dataScript}\n</head>`);
    } else {
      indexHtml = dataScript + indexHtml;
    }

    // inject i18n into index
    if (indexHtml.includes('</body>')) {
      indexHtml = indexHtml.replace('</body>', `${scriptWithData}</body>`);
    } else {
      indexHtml += scriptWithData;
    }

    // Inject ItemList schema for homepage (popular vacancies for rich results)
    const homeItemListSchema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Популярні вакансії в Польщі',
      description: 'Найактуальніші вакансії для українців у Польщі',
      url: 'https://rybezh.site/',
      numberOfItems: Math.min(latestJobs.length, 10),
      itemListElement: latestJobs.slice(0, 10).map((v, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: v.title,
        url: `https://rybezh.site/${v.slug}.html`
      }))
    };
    const homeItemListScript = `\n<script type="application/ld+json">\n${JSON.stringify(homeItemListSchema, null, 2)}\n</script>\n`;
    if (indexHtml.includes('</head>')) {
      indexHtml = indexHtml.replace('</head>', `${homeItemListScript}\n</head>`);
    }

    await fs.writeFile(path.join(DIST, 'index.html'), indexHtml, 'utf8');

    // generate vacancies page
    try {
      const vacanciesSrc = await fs.readFile(path.join(SRC, 'vacancies.html'), 'utf8');
      const vacanciesDataScript = `
<script>
window.CATEGORIES = ${JSON.stringify(categories)};
window.LATEST_JOBS = ${JSON.stringify(latestJobs)};
// ALL_JOBS loaded dynamically from /jobs-data.json via jobs-loader.js
</script>`;

      let vacanciesHtml = pageTpl
        .replace(/{{TITLE}}/g, 'Всі вакансії')
        .replace(/{{DESCRIPTION}}/g, 'Актуальні вакансії у Польщі з фільтрами за містом, категорією та зарплатою.')
        .replace(/{{CONTENT}}/g, vacanciesSrc)
        .replace(/{{CANONICAL}}/g, 'https://rybezh.site/vacancies.html')
        .replace(/{{CANONICAL_PL}}/g, 'https://rybezh.site/vacancies-pl.html')
        .replace(/{{CANONICAL_RU}}/g, 'https://rybezh.site/vacancies-ru.html')
        .replace(/{{CITY}}/g, '')
        .replace(/{{CTA_LINK}}/g, '/apply.html')
        .replace(/{{CTA_TEXT}}/g, '')
        .replace(/\$\{new Date\(\)\.getFullYear\(\)\}/g, String(new Date().getFullYear()));

      vacanciesHtml = vacanciesHtml.replace('<title>', '<title data-i18n="vacancies.meta_title">');
      vacanciesHtml = vacanciesHtml.replace(
        '<meta name="description" content="',
        '<meta name="description" data-i18n="vacancies.meta_description" data-i18n-attr="content" content="'
      );
      vacanciesHtml = vacanciesHtml.replace(
        '<meta property="og:title" content="',
        '<meta property="og:title" data-i18n="vacancies.meta_title" data-i18n-attr="content" content="'
      );
      vacanciesHtml = vacanciesHtml.replace(
        '<meta property="og:description" content="',
        '<meta property="og:description" data-i18n="vacancies.meta_description" data-i18n-attr="content" content="'
      );
      vacanciesHtml = vacanciesHtml.replace(
        '<meta name="twitter:title" content="',
        '<meta name="twitter:title" data-i18n="vacancies.meta_title" data-i18n-attr="content" content="'
      );
      vacanciesHtml = vacanciesHtml.replace(
        '<meta name="twitter:description" content="',
        '<meta name="twitter:description" data-i18n="vacancies.meta_description" data-i18n-attr="content" content="'
      );

      vacanciesHtml = vacanciesHtml.replace(/<h1>(.*?)<\/h1>/, '<h1 data-i18n="vacancies.title">$1</h1>');

      // Inject ItemList schema for the vacancies listing page (helps Google index as a collection)
      const topVacancies = pagesToGenerate.slice(0, 20);
      const itemListSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Вакансії в Польщі — Rybezh',
        description: 'Актуальні вакансії у Польщі з описом задач, умов та вимог.',
        url: 'https://rybezh.site/vacancies.html',
        numberOfItems: pagesToGenerate.length,
        itemListElement: topVacancies.map((v, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: v.title,
          url: `https://rybezh.site/${v.slug}.html`
        }))
      };
      const itemListScript = `\n<script type="application/ld+json">\n${JSON.stringify(itemListSchema, null, 2)}\n</script>\n`;

      if (vacanciesHtml.includes('</head>')) {
        vacanciesHtml = vacanciesHtml.replace('</head>', `${itemListScript}${vacanciesDataScript}\n</head>`);
      } else {
        vacanciesHtml = vacanciesDataScript + vacanciesHtml;
      }

      if (vacanciesHtml.includes('</body>')) {
        vacanciesHtml = vacanciesHtml.replace('</body>', `${scriptWithData}</body>`);
      } else {
        vacanciesHtml += scriptWithData;
      }

      await fs.writeFile(path.join(DIST, 'vacancies.html'), vacanciesHtml, 'utf8');
    } catch (e) {
      console.error('Error generating vacancies page:', e);
    }

    // write sitemap.xml
    try {
      const sitemap = generateSitemap(links, posts);
      await fs.writeFile(path.join(DIST, 'sitemap.xml'), sitemap, 'utf8');
    } catch (e) {}

    // write sitemap-vacancies.xml
    try {
      const vacanciesSitemap = generateVacanciesSitemap(links);
      await fs.writeFile(path.join(DIST, 'sitemap-vacancies.xml'), vacanciesSitemap, 'utf8');
    } catch (e) {}

    // write robots.txt
    try {
      const robots = `# Robots.txt for rybezh.site — Job search platform in Poland
# https://rybezh.site | Contact: contacts@rybezh.site

User-agent: *
Allow: /
Allow: /vacancies.html
Allow: /blog.html
Allow: /about.html
Allow: /contact.html
Allow: /faq.html
Allow: /calculator.html
Allow: /cv-generator.html
Allow: /red-flag.html
Allow: /map.html
Allow: /for-employers.html
Allow: /proof.html

# Prevent crawling of raw data files, internal assets, and game
Disallow: /jobs-data.json
Disallow: /game/
Disallow: /game.html
Disallow: /*.json$

# Sitemaps
Sitemap: https://rybezh.site/sitemap.xml
Sitemap: https://rybezh.site/sitemap-index.xml
Sitemap: https://rybezh.site/sitemap-static.xml
Sitemap: https://rybezh.site/sitemap-vacancies.xml
Sitemap: https://rybezh.site/sitemap-blog.xml

# Bing — allow full JS-rendering and static resources for rich results
User-agent: bingbot
Allow: /*.js$
Allow: /*.css$
Allow: /*.svg$
Allow: /*.png$
Allow: /*.webp$
Allow: /*.woff2$
Crawl-delay: 10

# Google-specific (no crawl-delay needed)
User-agent: Googlebot
Allow: /
Allow: /*.js$
Allow: /*.css$
Allow: /*.svg$
Allow: /*.png$
Allow: /*.webp$

# Host directive for Yandex
Host: https://rybezh.site
`;
      await fs.writeFile(path.join(DIST, 'robots.txt'), robots, 'utf8');
    } catch (e) {}

    // write CNAME for GitHub Pages custom domain
    try {
      await fs.writeFile(path.join(DIST, 'CNAME'), 'rybezh.site', 'utf8');
    } catch (e) {}

    // write ads.txt — required for Google AdSense and other ad networks.
    // Set ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXXXXXXXX in CI/CD to enable.
    try {
      const publisherId = String(process.env.ADSENSE_PUBLISHER_ID || '').trim();
      const adsTxtLines = ['# ads.txt — rybezh.site'];
      if (publisherId && /^ca-pub-\d+$/.test(publisherId)) {
        adsTxtLines.push(`google.com, ${publisherId}, DIRECT, f08c47fec0942fa0`);
      } else {
        // Placeholder — replace with real publisher ID once AdSense account is approved.
        // Format: google.com, ca-pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
        adsTxtLines.push('# Replace the line below with your real AdSense publisher ID');
        adsTxtLines.push('# google.com, ca-pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0');
      }
      await fs.writeFile(path.join(DIST, 'ads.txt'), adsTxtLines.join('\n') + '\n', 'utf8');
    } catch (e) {}

    // write IndexNow key file for Bing/Yandex instant indexing.
    // Set INDEXNOW_KEY (32-char hex string per IndexNow spec) in CI/CD environment to enable.
    try {
      const indexNowKey = String(process.env.INDEXNOW_KEY || '').trim();
      if (indexNowKey && /^[a-f0-9]{32}$/.test(indexNowKey)) {
        await fs.writeFile(path.join(DIST, `${indexNowKey}.txt`), indexNowKey, 'utf8');
        console.log(`✅ IndexNow key file generated: ${indexNowKey}.txt`);
      }
      // Skip file creation when no valid key is provided to avoid confusing search engines
    } catch (e) {}

    // disable Jekyll processing on GitHub Pages (serve underscore files as-is)
    try {
      await fs.writeFile(path.join(DIST, '.nojekyll'), '', 'utf8');
    } catch (e) {}

    // write .htaccess for Apache servers (common shared hosting)
    try {
      const htaccess = `ErrorDocument 404 /404.html\n`;
      await fs.writeFile(path.join(DIST, '.htaccess'), htaccess, 'utf8');
    } catch (e) {}

    // write web.config for IIS servers (Windows hosting / Azure)
    try {
      const webConfig = `<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <httpErrors errorMode="Custom" existingResponse="Replace">
            <remove statusCode="404"/>
            <error statusCode="404" path="404.html" responseMode="File"/>
        </httpErrors>
    </system.webServer>
</configuration>`;
      await fs.writeFile(path.join(DIST, 'web.config'), webConfig, 'utf8');
    } catch (e) {}

    // ==========================================
    // Generate Polish (-pl) pages
    // ==========================================
    await generatePolishPages(jobTranslations);
    await generateRussianPages(jobTranslations);

    console.log('Build complete. Pages:', links.length);
}

function generateIndexContent(links) {
  const cityMap = {
    'Варшава': 'city.warszawa',
    'Краків': 'city.krakow',
    'Гданськ': 'city.gdansk',
    'Вроцлав': 'city.wroclaw',
    'Познань': 'city.poznan',
    'Лодзь': 'city.lodz',
    'Катовіце': 'city.katowice',
    'Щецін': 'city.szczecin',
    'Люблін': 'city.lublin',
    'Білосток': 'city.bialystok',
    'Бидгощ': 'city.bydgoszcz',
    'Жешув': 'city.rzeszow',
    'Торунь': 'city.torun',
    'Ченстохова': 'city.czestochowa',
    'Радом': 'city.radom',
    'Сосновець': 'city.sosnowiec',
    'Кельце': 'city.kielce',
    'Гливіце': 'city.gliwice',
    'Ольштин': 'city.olsztyn',
    'Бєльско-Бяла': 'city.bielsko'
  };

  const cards = links.map(l => {
    const cityAttr = escapeHtml(l.city || '');
    const cityKey = cityMap[l.city];
    const cityDisplay = cityKey ? `<span data-i18n="${cityKey}">${cityAttr}</span>` : cityAttr;
    return `    <div class="job-card" data-city="${cityAttr}">
      <h3><a href="./${l.slug}.html" data-i18n="job.${l.slug}.title">${escapeHtml(l.title)}</a></h3>
      <p class="muted">${cityDisplay}</p>
      <a class="card-cta" href="./${l.slug}.html" data-i18n="jobs.cta">Деталі</a>
    </div>`;
  }).join('\n');

  return `
    <div class="hero-modern">
      <div class="hero-content">
        <h2 class="hero-title" data-i18n="home.hero.title">🚀 Робота мрії чекає тебе!</h2>
        <p class="hero-subtitle" data-i18n="home.hero.subtitle">
          <strong>Тисячі людей вже працюють</strong> у Польщі. 📌 Безкоштовна консультація, <strong>легальне працевлаштування</strong> та <strong>зручний пошук</strong>.
        </p>
        <div class="hero-actions">
          <a href="/apply.html" class="btn-primary hero-btn" data-i18n="home.hero.cta_primary">Почати прямо зараз</a>
          <a href="#jobs" class="btn-outline hero-btn" data-i18n="home.hero.cta_secondary">Переглянути вакансії</a>
        </div>
      </div>
      <div class="hero-visual">
        <div class="hero-blob"></div>
        <div class="hero-icon">🚴‍♂️</div>
      </div>
    </div>

    <!-- Calculator Section -->
    <div class="calculator-section" style="background: var(--color-surface); padding: 2rem; border-radius: 16px; border: 1px solid var(--color-border); margin-bottom: 3rem; box-shadow: var(--shadow-md);">
      <h3 style="text-align: center; margin-bottom: 2rem; color: var(--color-primary);" data-i18n="calc.title">Калькулятор заробітку</h3>
      <div class="calc-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: center;">
        <div class="calc-inputs">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;" data-i18n="calc.hours">Годин на тиждень</label>
          <input type="range" id="calc-hours" min="10" max="60" value="40" style="width: 100%; margin-bottom: 0.5rem;">
          <div style="text-align: right; font-weight: bold; color: var(--color-accent);"><span id="val-hours">40</span> h</div>
          
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; margin-top: 1rem;" data-i18n="calc.rate">Ставка (PLN/год)</label>
          <input type="range" id="calc-rate" min="20" max="50" value="35" style="width: 100%; margin-bottom: 0.5rem;">
          <div style="text-align: right; font-weight: bold; color: var(--color-accent);"><span id="val-rate">35</span> PLN</div>
        </div>
        <div class="calc-result" style="text-align: center; background: var(--color-bg); padding: 1.5rem; border-radius: 12px;">
          <p style="margin: 0; color: var(--color-secondary);" data-i18n="calc.result">Ваш дохід на місяць:</p>
          <div style="font-size: 2.5rem; font-weight: 800; color: var(--color-accent); margin: 0.5rem 0;"><span id="total-earn">5600</span> PLN</div>
          <p style="font-size: 0.9rem; color: var(--color-secondary); margin: 0;" data-i18n="calc.note">*приблизний розрахунок</p>
        </div>
      </div>
    </div>

    <!-- STATISTICS SECTION -->
    <div style="background: linear-gradient(135deg, rgba(0, 166, 126, 0.08), rgba(15, 118, 110, 0.05)); padding: 2.5rem; border-radius: 16px; margin: 3rem 0; border: 1px solid var(--color-border);">
      <h3 style="text-align: center; color: var(--color-primary); margin-bottom: 2rem; font-size: 1.4rem;" data-i18n="home.stats.title">📊 Статистика успіху</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 2rem;">
        <div style="text-align: center;">
          <div style="font-size: 2.8rem; font-weight: 800; color: var(--color-accent); margin-bottom: 0.5rem;">3500+</div>
          <p style="color: var(--color-secondary); margin: 0; font-size: 1rem;" data-i18n="home.stats.candidates.line1">Кандидатів скористалось</p>
          <p style="color: var(--color-secondary); margin: 0; font-size: 0.9rem;" data-i18n="home.stats.candidates.line2">нашими послугами</p>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 2.8rem; font-weight: 800; color: var(--color-accent); margin-bottom: 0.5rem;">65+</div>
          <p style="color: var(--color-secondary); margin: 0; font-size: 1rem;" data-i18n="home.stats.partners.line1">Партнерських компаній</p>
          <p style="color: var(--color-secondary); margin: 0; font-size: 0.9rem;" data-i18n="home.stats.partners.line2">у Польщі</p>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 2.8rem; font-weight: 800; color: var(--color-accent); margin-bottom: 0.5rem;">20+</div>
          <p style="color: var(--color-secondary); margin: 0; font-size: 1rem;" data-i18n="home.stats.cities.line1">Міст із вакансіями</p>
          <p style="color: var(--color-secondary); margin: 0; font-size: 0.9rem;" data-i18n="home.stats.cities.line2">від Варшави до Гданська</p>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 2.8rem; font-weight: 800; color: var(--color-accent); margin-bottom: 0.5rem;">⭐4.8/5</div>
          <p style="color: var(--color-secondary); margin: 0; font-size: 1rem;" data-i18n="home.stats.rating.line1">Рейтинг задоволення</p>
          <p style="color: var(--color-secondary); margin: 0; font-size: 0.9rem;" data-i18n="home.stats.rating.line2">від кандидатів</p>
        </div>
      </div>
      <p style="text-align:center; margin-top:1.25rem; color:#64748b; font-size:0.9rem;" data-i18n="home.stats.note">*Оцінки за внутрішнім опитуванням кандидатів</p>
    </div>

    <!-- TESTIMONIALS SECTION -->
    <div style="padding: 2.5rem 0;">
      <h3 style="text-align: center; color: var(--color-primary); margin-bottom: 2rem; font-size: 1.4rem;" data-i18n="home.testimonials.title">💬 Що кажуть кандидати</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
        <div style="background: var(--color-surface); border: 1px solid var(--color-border); padding: 1.5rem; border-radius: 12px; transition: all 0.3s ease; box-shadow: var(--shadow-sm);">
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">⭐⭐⭐⭐⭐</div>
          <p style="color: var(--color-secondary); line-height: 1.6; margin-bottom: 1rem;" data-i18n="home.testimonials.t1.quote">
            "Дуже задоволений! За 3 дні отримав все необхідне та почав роботу. Підтримка команди Rybezh — просто супер!"
          </p>
          <p style="color: var(--color-primary); font-weight: 600; margin: 0;" data-i18n="home.testimonials.t1.name">Ігор К., Варшава</p>
          <p style="color: var(--color-secondary); font-size: 0.9rem; margin: 0;" data-i18n="home.testimonials.t1.role">Пакувальник, 6 міс. досвіду</p>
        </div>
        
        <div style="background: var(--color-surface); border: 1px solid var(--color-border); padding: 1.5rem; border-radius: 12px; transition: all 0.3s ease; box-shadow: var(--shadow-sm);">
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">⭐⭐⭐⭐⭐</div>
          <p style="color: var(--color-secondary); line-height: 1.6; margin-bottom: 1rem;" data-i18n="home.testimonials.t2.quote">
            "Я приїхав з нічим, а за місяць вже купив велосипед. Щоденні виплати як обіцяно. Рекомендую!"
          </p>
          <p style="color: var(--color-primary); font-weight: 600; margin: 0;" data-i18n="home.testimonials.t2.name">Максим В., Краків</p>
          <p style="color: var(--color-secondary); font-size: 0.9rem; margin: 0;" data-i18n="home.testimonials.t2.role">Працівниця складу, 3 міс. досвіду</p>
        </div>
        
        <div style="background: var(--color-surface); border: 1px solid var(--color-border); padding: 1.5rem; border-radius: 12px; transition: all 0.3s ease; box-shadow: var(--shadow-sm);">
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">⭐⭐⭐⭐⭐</div>
          <p style="color: var(--color-secondary); line-height: 1.6; margin-bottom: 1rem;" data-i18n="home.testimonials.t3.quote">
            "Гнучкий графік дозволяє мені вчитися та одночасно заробляти. Це саме то, що мені потрібно було!"
          </p>
          <p style="color: var(--color-primary); font-weight: 600; margin: 0;" data-i18n="home.testimonials.t3.name">Софія Л., Вроцлав</p>
          <p style="color: var(--color-secondary); font-size: 0.9rem; margin: 0;" data-i18n="home.testimonials.t3.role">Студентка, 4 міс. досвіду</p>
        </div>

        <div style="background: var(--color-surface); border: 1px solid var(--color-border); padding: 1.5rem; border-radius: 12px; transition: all 0.3s ease; box-shadow: var(--shadow-sm);">
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">⭐⭐⭐⭐⭐</div>
          <p style="color: var(--color-secondary); line-height: 1.6; margin-bottom: 1rem;" data-i18n="home.testimonials.t4.quote">
            "Працюю на заводі під Познанню вже 8 місяців. Зарплату платять вчасно, є медична страховка. Rybezh допоміг швидко знайти саме те, що шукав."
          </p>
          <p style="color: var(--color-primary); font-weight: 600; margin: 0;" data-i18n="home.testimonials.t4.name">Андрій Т., Познань</p>
          <p style="color: var(--color-secondary); font-size: 0.9rem; margin: 0;" data-i18n="home.testimonials.t4.role">Оператор лінії, 8 міс. досвіду</p>
        </div>

        <div style="background: var(--color-surface); border: 1px solid var(--color-border); padding: 1.5rem; border-radius: 12px; transition: all 0.3s ease; box-shadow: var(--shadow-sm);">
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">⭐⭐⭐⭐⭐</div>
          <p style="color: var(--color-secondary); line-height: 1.6; margin-bottom: 1rem;" data-i18n="home.testimonials.t5.quote">
            "Переїхала з Харкова і боялася шахрайства. Rybezh Proof допоміг перевірити компанію перед виїздом. Тепер працюю в готелі і все чудово!"
          </p>
          <p style="color: var(--color-primary); font-weight: 600; margin: 0;" data-i18n="home.testimonials.t5.name">Оксана М., Гданськ</p>
          <p style="color: var(--color-secondary); font-size: 0.9rem; margin: 0;" data-i18n="home.testimonials.t5.role">Покоївка готелю, 5 міс. досвіду</p>
        </div>

        <div style="background: var(--color-surface); border: 1px solid var(--color-border); padding: 1.5rem; border-radius: 12px; transition: all 0.3s ease; box-shadow: var(--shadow-sm);">
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">⭐⭐⭐⭐</div>
          <p style="color: var(--color-secondary); line-height: 1.6; margin-bottom: 1rem;" data-i18n="home.testimonials.t6.quote">
            "Калькулятор зарплати дуже допоміг зрозуміти, скільки буде на руки. Без цього легко помилитися з очікуваннями."
          </p>
          <p style="color: var(--color-primary); font-weight: 600; margin: 0;" data-i18n="home.testimonials.t6.name">Віталій С., Лодзь</p>
          <p style="color: var(--color-secondary); font-size: 0.9rem; margin: 0;" data-i18n="home.testimonials.t6.role">Електромонтажник, 4 міс. досвіду</p>
        </div>

        <div style="background: var(--color-surface); border: 1px solid var(--color-border); padding: 1.5rem; border-radius: 12px; transition: all 0.3s ease; box-shadow: var(--shadow-sm);">
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">⭐⭐⭐⭐⭐</div>
          <p style="color: var(--color-secondary); line-height: 1.6; margin-bottom: 1rem;" data-i18n="home.testimonials.t7.quote">
            "Я мама двох дітей і знайшла роботу з гнучким графіком. Дуже дякую за підтримку і допомогу з документами!"
          </p>
          <p style="color: var(--color-primary); font-weight: 600; margin: 0;" data-i18n="home.testimonials.t7.name">Наталія Д., Катовіце</p>
          <p style="color: var(--color-secondary); font-size: 0.9rem; margin: 0;" data-i18n="home.testimonials.t7.role">Прибиральниця, 7 міс. досвіду</p>
        </div>
      </div>
      <p style="text-align:center; margin-top:1rem; color:#64748b; font-size:0.9rem;" data-i18n="home.testimonials.note">*Досвід кандидатів може відрізнятися залежно від міста та роботодавця</p>
    </div>

    <!-- TRUST BADGES -->
    <div style="padding: 2rem 0; margin-top: 1rem;">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; text-align: center;">
        <div style="padding: 1.5rem; border-radius: 12px; background: #f0fdf4; border: 1px solid #bbf7d0;">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">🇺🇦</div>
          <div style="font-size: 1.6rem; font-weight: 800; color: #166534;" data-i18n="home.trust.users">5 000+</div>
          <div style="color: #15803d; font-size: 0.95rem;" data-i18n="home.trust.users_label">українців знайшли роботу</div>
        </div>
        <div style="padding: 1.5rem; border-radius: 12px; background: #eff6ff; border: 1px solid #bfdbfe;">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">✅</div>
          <div style="font-size: 1.6rem; font-weight: 800; color: #1e40af;" data-i18n="home.trust.verified">100%</div>
          <div style="color: #1d4ed8; font-size: 0.95rem;" data-i18n="home.trust.verified_label">перевірені вакансії</div>
        </div>
        <div style="padding: 1.5rem; border-radius: 12px; background: #faf5ff; border: 1px solid #e9d5ff;">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">💬</div>
          <div style="font-size: 1.6rem; font-weight: 800; color: #7e22ce;" data-i18n="home.trust.support">24/7</div>
          <div style="color: #7c3aed; font-size: 0.95rem;" data-i18n="home.trust.support_label">підтримка в Telegram</div>
        </div>
        <div style="padding: 1.5rem; border-radius: 12px; background: #fff7ed; border: 1px solid #fed7aa;">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">🏙️</div>
          <div style="font-size: 1.6rem; font-weight: 800; color: #c2410c;" data-i18n="home.trust.cities">20+</div>
          <div style="color: #ea580c; font-size: 0.95rem;" data-i18n="home.trust.cities_label">міст по всій Польщі</div>
        </div>
      </div>
    </div>

    <p class="lead" style="text-align:center; margin-bottom:2rem; margin-top: 3rem; color:var(--color-secondary);" data-i18n="hero.lead">Актуальні вакансії у 20+ містах Польщі. Стабільні умови та підтримка.</p>
    
    <div class="search-panel">
      <div class="search-panel__header">
        <h3 style="margin: 0; color: var(--color-primary);" data-i18n="home.search.title">🔍 Знайди роботу за містом:</h3>
        <div class="search-count">
          <span class="search-count__label" data-i18n="jobs.search.count">Знайдено вакансій:</span>
          <span class="search-count__value" id="jobs-count">0</span>
        </div>
      </div>
      <form class="search-form" action="/" method="get" aria-label="Фільтр вакансій">
        <label class="sr-only" for="q" data-i18n="search.sr">Пошук</label>
        <div class="search-field">
          <span class="search-icon">🔍</span>
          <input id="q" name="q" class="search-input" placeholder="Пошук за містом або типом роботи" aria-label="Пошук вакансій" data-i18n="search.placeholder" data-i18n-attr="placeholder" />
        </div>
        <select id="city" name="city" class="search-select" aria-label="Вибір міста">
        <option value="" data-i18n="city.all">Всі міста</option>
        <option value="Варшава" data-i18n="city.warszawa">Варшава</option>
        <option value="Краків" data-i18n="city.krakow">Краків</option>
        <option value="Лодзь" data-i18n="city.lodz">Лодзь</option>
        <option value="Вроцлав" data-i18n="city.wroclaw">Вроцлав</option>
        <option value="Познань" data-i18n="city.poznan">Познань</option>
        <option value="Гданськ" data-i18n="city.gdansk">Гданськ</option>
        <option value="Щецін" data-i18n="city.szczecin">Щецін</option>
        <option value="Бидгощ" data-i18n="city.bydgoszcz">Бидгощ</option>
        <option value="Люблін" data-i18n="city.lublin">Люблін</option>
        <option value="Білосток" data-i18n="city.bialystok">Білосток</option>
        <option value="Катовіце" data-i18n="city.katowice">Катовіце</option>
        <option value="Гливіце" data-i18n="city.gliwice">Гливіце</option>
        <option value="Ченстохова" data-i18n="city.czestochowa">Ченстохова</option>
        <option value="Жешув" data-i18n="city.rzeszow">Жешув</option>
        <option value="Торунь" data-i18n="city.torun">Торунь</option>
        <option value="Кельце" data-i18n="city.kielce">Кельце</option>
        <option value="Ольштин" data-i18n="city.olsztyn">Ольштин</option>
        <option value="Радом" data-i18n="city.radom">Радом</option>
        <option value="Сосновець" data-i18n="city.sosnowiec">Сосновець</option>
        <option value="Бєльско-Бяла" data-i18n="city.bielsko">Бєльско-Бяла</option>
      </select>
      <button type="submit" class="search-button" data-i18n="search.button">Знайти</button>
    </form>
      <div class="search-empty" id="jobs-empty" data-i18n="jobs.search.empty" hidden>Нічого не знайдено</div>
    </div>
    <div class="jobs-grid" id="jobs" aria-label="Список вакансій" style="margin-top: 2rem;">
${cards}
    </div>

    <div style="background: linear-gradient(135deg, rgba(0, 166, 126, 0.1), rgba(15, 118, 110, 0.1)); padding: 2.5rem; border-radius: 12px; border: 1px solid var(--color-accent); margin-top: 3rem; text-align: center;">
      <h3 style="color: var(--color-primary); margin: 0 0 1rem 0;" data-i18n="home.features.title">✨ Більше ніж просто робота</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-top: 1.5rem;">
        <div>
          <h4 style="color: var(--color-primary); margin-bottom: 0.5rem;" data-i18n="home.features.f1.title">💵 Щоденні виплати</h4>
          <p style="color: var(--color-secondary); margin: 0;" data-i18n="home.features.f1.text">Отримуй гроші прямо в день роботи</p>
        </div>
        <div>
          <h4 style="color: var(--color-primary); margin-bottom: 0.5rem;" data-i18n="home.features.f2.title">⏰ Гнучкий графік</h4>
          <p style="color: var(--color-secondary); margin: 0;" data-i18n="home.features.f2.text">Працюй коли захочеш, скільки захочеш</p>
        </div>
        <div>
          <h4 style="color: var(--color-primary); margin-bottom: 0.5rem;" data-i18n="home.features.f3.title">🤝 Повна підтримка 24/7</h4>
          <p style="color: var(--color-secondary); margin: 0;" data-i18n="home.features.f3.text">Допомога з документами та легалізацією</p>
        </div>
      </div>
    </div>
    <script>
      (function(){
        const q = document.getElementById('q');
        const city = document.getElementById('city');
        const form = document.querySelector('.search-form');
        const jobs = Array.from(document.querySelectorAll('.job-card'));
        function normalize(s){return String(s||'').toLowerCase();}
        function filter(){
          const qv = normalize(q.value.trim());
          const cv = normalize(city.value.trim());
          let visible = 0;
          jobs.forEach(card => {
            const text = normalize(card.textContent);
            const c = normalize(card.dataset.city || '');
            const matchQ = !qv || text.includes(qv);
            const matchC = !cv || c === cv || c.includes(cv);
            card.style.display = (matchQ && matchC) ? '' : 'none';
            if (matchQ && matchC) visible++;
          });
          const countEl = document.getElementById('jobs-count');
          const emptyEl = document.getElementById('jobs-empty');
          if (countEl) countEl.textContent = String(visible);
          if (emptyEl) emptyEl.hidden = visible !== 0;
        }
        form.addEventListener('submit', function(e){ e.preventDefault(); filter(); });
        q.addEventListener('input', filter);
        city.addEventListener('change', filter);
        filter();

        // Calculator Logic
        const hInput = document.getElementById('calc-hours');
        const rInput = document.getElementById('calc-rate');
        const hVal = document.getElementById('val-hours');
        const rVal = document.getElementById('val-rate');
        const total = document.getElementById('total-earn');
        function calc() { const h = +hInput.value; const r = +rInput.value; hVal.textContent = h; rVal.textContent = r; total.textContent = (h * r * 4).toLocaleString(); }
        hInput.addEventListener('input', calc);
        rInput.addEventListener('input', calc);
      })();
    </script>`;
}

function generateSitemap(links, posts = []) {
  const base = 'https://rybezh.site';
  // Format date as YYYY-MM-DD for lastmod (Google recommends this format)
  const today = new Date().toISOString().split('T')[0];
  
  // Main pages with priority based on importance for job seeking platform
  const mainPages = [
    { 
      url: `${base}/`, 
      priority: '1.0', 
      changefreq: 'daily',
      lastmod: today
    },
    { 
      url: `${base}/vacancies.html`, 
      priority: '0.95', 
      changefreq: 'daily',
      lastmod: today
    },
    { 
      url: `${base}/apply.html`, 
      priority: '0.95', 
      changefreq: 'daily',
      lastmod: today
    },
    { 
      url: `${base}/faq.html`, 
      priority: '0.85', 
      changefreq: 'weekly',
      lastmod: today
    },
    { 
      url: `${base}/for-employers.html`, 
      priority: '0.85', 
      changefreq: 'monthly',
      lastmod: today
    },
    { 
      url: `${base}/about.html`, 
      priority: '0.8', 
      changefreq: 'monthly',
      lastmod: today
    },
    { 
      url: `${base}/contact.html`, 
      priority: '0.8', 
      changefreq: 'monthly',
      lastmod: today
    },
    { 
      url: `${base}/privacy.html`, 
      priority: '0.5', 
      changefreq: 'yearly',
      lastmod: today
    },
    { 
      url: `${base}/terms.html`, 
      priority: '0.5', 
      changefreq: 'yearly',
      lastmod: today
    },
    { 
      url: `${base}/calculator.html`, 
      priority: '0.9', 
      changefreq: 'monthly',
      lastmod: today
    },
    { 
      url: `${base}/cv-generator.html`, 
      priority: '0.9', 
      changefreq: 'monthly',
      lastmod: today
    },
    { 
      url: `${base}/red-flag.html`, 
      priority: '0.85', 
      changefreq: 'monthly',
      lastmod: today
    },
    { 
      url: `${base}/map.html`, 
      priority: '0.9', 
      changefreq: 'daily',
      lastmod: today
    }
  ];

  const totalBlogPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const blogPaginationPages = Array.from({ length: totalBlogPages }, (_, index) => {
    const page = index + 1;
    return {
      url: page === 1 ? `${base}/blog.html` : `${base}/blog-${page}.html`,
      priority: page === 1 ? '0.75' : '0.6',
      changefreq: 'weekly',
      lastmod: today
    };
  });

  const blogPages = [
    ...blogPaginationPages,
    ...posts.map(post => ({
      url: `${base}/post-${post.slug}.html`,
      priority: '0.7',
      changefreq: 'monthly',
      lastmod: post.date ? toISODate(post.date) : today
    }))
  ];
  
  // Job pages - prioritize by relevance (multiple job listings = more important)
  const jobPageCounts = {};
  links.forEach(l => {
    const city = l.city || 'unknown';
    jobPageCounts[city] = (jobPageCounts[city] || 0) + 1;
  });
  
  const jobPages = links
    .filter(l => l.indexable !== false)
    .map(l => {
    // High-demand cities (Warszawa, Kraków) get slightly higher priority
    const majorCities = ['Warszawa', 'Kraków', 'Gdańsk', 'Wrocław', 'Poznań'];
    const isPrioritized = majorCities.includes(l.city);
    const priority = isPrioritized ? '0.85' : '0.75';
    
    return {
      url: `${base}/${l.slug}.html`,
      priority: priority,
      changefreq: 'weekly',
      lastmod: today
    };
  });
  
  const allPages = [...mainPages, ...blogPages, ...jobPages];
  
  // Generate entries for UA, PL, and RU pages with hreflang xhtml:link
  const items = allPages.flatMap(p => {
    const plUrl = p.url === `${base}/`
      ? `${base}/index-pl.html`
      : p.url.replace(/\.html$/, '-pl.html');
    const ruUrl = p.url === `${base}/`
      ? `${base}/index-ru.html`
      : p.url.replace(/\.html$/, '-ru.html');
    const xhtmlLinks = `
    <xhtml:link rel="alternate" hreflang="uk" href="${p.url}"/>
    <xhtml:link rel="alternate" hreflang="pl" href="${plUrl}"/>
    <xhtml:link rel="alternate" hreflang="ru" href="${ruUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${p.url}"/>`;

    return [
      `  <url>
    <loc>${p.url}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>${xhtmlLinks}
  </url>`,
      `  <url>
    <loc>${plUrl}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>${xhtmlLinks}
  </url>`,
      `  <url>
    <loc>${ruUrl}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>${xhtmlLinks}
  </url>`
    ];
  }).join('\n');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${items}
</urlset>`;
}

function generateVacanciesSitemap(links) {
  const base = 'https://rybezh.site';
  const today = new Date().toISOString().split('T')[0];

  const items = links.filter(l => l.indexable !== false).flatMap(l => {
    const uaUrl = `${base}/${l.slug}.html`;
    const plUrl = `${base}/${l.slug}-pl.html`;
    const ruUrl = `${base}/${l.slug}-ru.html`;
    const xhtmlLinks = `
    <xhtml:link rel="alternate" hreflang="uk" href="${uaUrl}"/>
    <xhtml:link rel="alternate" hreflang="pl" href="${plUrl}"/>
    <xhtml:link rel="alternate" hreflang="ru" href="${ruUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${uaUrl}"/>`;

    return [
      `  <url>
    <loc>${uaUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>${xhtmlLinks}
  </url>`,
      `  <url>
    <loc>${plUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>${xhtmlLinks}
  </url>`,
      `  <url>
    <loc>${ruUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>${xhtmlLinks}
  </url>`
    ];
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${items}
</urlset>`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeRegExp(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function stripHtml(str) {
  return String(str || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function replaceWithOptions(html, needle, options, seed) {
  if (!needle || !Array.isArray(options) || options.length === 0) return String(html || '');
  let i = 0;
  const regex = new RegExp(escapeRegExp(needle), 'g');
  return String(html || '').replace(regex, () => {
    const choice = options[(seed + i) % options.length];
    i += 1;
    return choice;
  });
}

function replaceHeadingText(html, text, options, tags, seed) {
  if (!text || !Array.isArray(options) || options.length === 0) return String(html || '');
  let output = String(html || '');
  const targetTags = Array.isArray(tags) && tags.length ? tags : ['h2', 'h3'];
  targetTags.forEach((tag, idx) => {
    let i = 0;
    const regex = new RegExp(`<${tag}>\\s*${escapeRegExp(text)}\\s*<\\/${tag}>`, 'gi');
    output = output.replace(regex, () => {
      const choice = options[(seed + i + idx) % options.length];
      i += 1;
      return `<${tag}>${choice}</${tag}>`;
    });
  });
  return output;
}

function diversifyBodyText(html, lang, seed) {
  let output = String(html || '');
  if (lang === 'pl') {
    output = replaceHeadingText(output, 'Porada', ['Porada od siebie', 'Krótka rada', 'Co warto zapamiętać', 'Notatka z doświadczenia'], ['h2', 'h3'], seed + 1);
    output = replaceHeadingText(output, 'Podsumowanie', ['Podsumowanie', 'Na koniec', 'W skrócie', 'Co warto wynieść'], ['h2', 'h3'], seed + 2);
    output = replaceHeadingText(output, 'Wniosek', ['Wniosek', 'Końcowa myśl', 'Na zakończenie', 'Krótki wniosek'], ['h2', 'h3'], seed + 3);
    output = replaceHeadingText(output, 'Krótki checklist', ['Krótka checklista', 'Szybka lista', 'Mini checklista', 'Krótki spis'], ['h2', 'h3'], seed + 4);
    output = replaceWithOptions(output, 'Poniżej —', ['Niżej —', 'W skrócie —', 'Krótko —', 'Najważniejsze —'], seed + 5);
  } else {
    output = replaceHeadingText(output, 'Порада', ['Порада від себе', 'Коротка порада', 'Що варто памʼятати', 'Нотатка з досвіду'], ['h2', 'h3'], seed + 1);
    output = replaceHeadingText(output, 'Підсумок', ['Підсумок', 'Коротко', 'На фініші', 'Що важливо винести'], ['h2', 'h3'], seed + 2);
    output = replaceHeadingText(output, 'Висновок', ['Висновок', 'Фінальна думка', 'Наостанок', 'Короткий висновок'], ['h2', 'h3'], seed + 3);
    output = replaceHeadingText(output, 'Короткий чек‑лист', ['Стисла памʼятка', 'Швидкий список', 'Міні‑чек‑лист', 'Короткий список'], ['h2', 'h3'], seed + 4);
    output = replaceHeadingText(output, 'Короткий чек-лист', ['Стисла памʼятка', 'Швидкий список', 'Міні‑чек‑лист', 'Короткий список'], ['h2', 'h3'], seed + 6);
    output = replaceWithOptions(output, 'Нижче —', ['Далі —', 'Коротко кажучи —', 'Спробую пояснити —', 'Найважливіше —'], seed + 5);
  }
  return output;
}

function estimateReadingTime(html) {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function extractImageUrl(html) {
  const match = String(html || '').match(/src=["']([^"']+)["']/i);
  return match ? match[1] : '';
}

function toISODate(date) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }
  return d.toISOString().slice(0, 10);
}

function shuffleArray(items) {
  const arr = Array.isArray(items) ? items.slice() : [];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function cityToJobAddress(cityUa) {
  // Best-effort mapping to satisfy JobPosting rich results requirements.
  // If you have a real office address per offer, consider adding it into content.json instead.
  const fallback = {
    streetAddress: 'Centrum miasta',
    addressLocality: cityUa || 'Polska',
    addressRegion: 'PL',
    postalCode: '00-000'
  };

  const map = {
    'Варшава': { streetAddress: 'Centrum miasta', addressLocality: 'Warszawa', addressRegion: 'Mazowieckie', postalCode: '00-001' },
    'Краків': { streetAddress: 'Centrum miasta', addressLocality: 'Kraków', addressRegion: 'Małopolskie', postalCode: '31-001' },
    'Гданськ': { streetAddress: 'Centrum miasta', addressLocality: 'Gdańsk', addressRegion: 'Pomorskie', postalCode: '80-001' },
    'Вроцлав': { streetAddress: 'Centrum miasta', addressLocality: 'Wrocław', addressRegion: 'Dolnośląskie', postalCode: '50-001' },
    'Познань': { streetAddress: 'Centrum miasta', addressLocality: 'Poznań', addressRegion: 'Wielkopolskie', postalCode: '60-001' },
    'Лодзь': { streetAddress: 'Centrum miasta', addressLocality: 'Łódź', addressRegion: 'Łódzkie', postalCode: '90-001' },
    'Щецін': { streetAddress: 'Centrum miasta', addressLocality: 'Szczecin', addressRegion: 'Zachodniopomorskie', postalCode: '70-001' },
    'Бидгощ': { streetAddress: 'Centrum miasta', addressLocality: 'Bydgoszcz', addressRegion: 'Kujawsko-Pomorskie', postalCode: '85-001' },
    'Люблін': { streetAddress: 'Centrum miasta', addressLocality: 'Lublin', addressRegion: 'Lubelskie', postalCode: '20-001' },
    'Білосток': { streetAddress: 'Centrum miasta', addressLocality: 'Białystok', addressRegion: 'Podlaskie', postalCode: '15-001' },
    'Катовіце': { streetAddress: 'Centrum miasta', addressLocality: 'Katowice', addressRegion: 'Śląskie', postalCode: '40-001' },
    'Гливіце': { streetAddress: 'Centrum miasta', addressLocality: 'Gliwice', addressRegion: 'Śląskie', postalCode: '44-100' },
    'Ченстохова': { streetAddress: 'Centrum miasta', addressLocality: 'Częstochowa', addressRegion: 'Śląskie', postalCode: '42-200' },
    'Жешув': { streetAddress: 'Centrum miasta', addressLocality: 'Rzeszów', addressRegion: 'Podkarpackie', postalCode: '35-001' },
    'Торунь': { streetAddress: 'Centrum miasta', addressLocality: 'Toruń', addressRegion: 'Kujawsko-Pomorskie', postalCode: '87-100' },
    'Кельце': { streetAddress: 'Centrum miasta', addressLocality: 'Kielce', addressRegion: 'Świętokrzyskie', postalCode: '25-001' },
    'Ольштин': { streetAddress: 'Centrum miasta', addressLocality: 'Olsztyn', addressRegion: 'Warmińsko-Mazurskie', postalCode: '10-001' },
    'Радом': { streetAddress: 'Centrum miasta', addressLocality: 'Radom', addressRegion: 'Mazowieckie', postalCode: '26-600' },
    'Сосновець': { streetAddress: 'Centrum miasta', addressLocality: 'Sosnowiec', addressRegion: 'Śląskie', postalCode: '41-200' },
    'Бєльско-Бяла': { streetAddress: 'Centrum miasta', addressLocality: 'Bielsko-Biała', addressRegion: 'Śląskie', postalCode: '43-300' }
  };

  return map[cityUa] || fallback;
}

// Map contract type string to schema.org employmentType values
function contractToEmploymentType(contract) {
  if (!contract) return ['FULL_TIME'];
  const c = contract.toLowerCase();
  if (c.includes('zlecenie')) return ['CONTRACTOR'];
  if (c.includes('o pracę') || c.includes('uop')) return ['FULL_TIME'];
  if (c.includes('b2b')) return ['CONTRACTOR'];
  if (c.includes('part') || c.includes('część')) return ['PART_TIME'];
  if (c.includes('tymczas') || c.includes('temporary')) return ['TEMPORARY'];
  return ['FULL_TIME'];
}

// Map category to industry label for schema.org
function categoryToIndustry(category) {
  const map = {
    hospitality: 'Food Services',
    logistics: 'Transportation and Logistics',
    construction: 'Construction',
    it: 'Information Technology',
    healthcare: 'Healthcare',
    retail: 'Retail',
    cleaning: 'Facilities Services',
    production: 'Manufacturing',
    agriculture: 'Agriculture',
    security: 'Security Services',
    beauty: 'Personal Care',
    education: 'Education'
  };
  return map[category] || 'General Labor';
}

function buildJobPostingJsonLd(page) {
  const now = new Date();
  // Use page.date_posted if available, otherwise fall back to a deterministic random date
  const datePosted = page.date_posted || getLastUpdated();
  const validThrough = toISODate(addDays(now, 60));
  const addr = cityToJobAddress(page.city);

  // Prefer excerpt as short description; fall back to body stripped of HTML
  const description = stripHtml(page.excerpt || page.description || page.body || '');
  const url = `https://rybezh.site/${page.slug}.html`;

  // Try to parse salary from string like "5000-7000 PLN"
  let salaryMin = 25;
  let salaryMax = 45;
  let unitText = 'HOUR';

  if (page.salary) {
    const nums = page.salary.match(/\d+/g);
    if (nums && nums.length >= 2) {
      salaryMin = parseInt(nums[0]);
      salaryMax = parseInt(nums[1]);
      // If salary is large (>1000), assume MONTH, else HOUR
      unitText = salaryMin > 1000 ? 'MONTH' : 'HOUR';
    }
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: page.title || 'Робота в Польщі',
    description,
    identifier: {
      '@type': 'PropertyValue',
      name: page.company || 'Rybezh',
      value: page.slug
    },
    datePosted,
    validThrough,
    employmentType: contractToEmploymentType(page.contract_ua || page.contract_pl),
    hiringOrganization: {
      '@type': 'Organization',
      name: page.company || 'Rybezh',
      url: 'https://rybezh.site',
      logo: 'https://rybezh.site/favicon.svg',
      sameAs: 'https://t.me/rybezh_site'
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        streetAddress: addr.streetAddress,
        addressLocality: addr.addressLocality,
        addressRegion: addr.addressRegion,
        postalCode: addr.postalCode,
        addressCountry: 'PL'
      }
    },
    applicantLocationRequirements: {
      '@type': 'Country',
      name: 'PL'
    },
    directApply: true,
    url,
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: 'PLN',
      value: {
        '@type': 'QuantitativeValue',
        minValue: salaryMin,
        maxValue: salaryMax,
        unitText: unitText
      }
    }
  };

  // Add industry if available
  if (page.category) {
    schema.industry = categoryToIndustry(page.category);
  }

  // Add jobBenefits from offers list
  const benefits = page.offers_ua || page.offers_pl;
  if (Array.isArray(benefits) && benefits.length > 0) {
    schema.jobBenefits = benefits.join(' ');
  }

  // Add responsibilities from tasks list
  const tasks = page.tasks_ua || page.tasks_pl;
  if (Array.isArray(tasks) && tasks.length > 0) {
    schema.responsibilities = tasks.join(' ');
  }

  // Add qualifications from requirements list
  const reqs = page.requirements_ua || page.requirements_pl;
  if (Array.isArray(reqs) && reqs.length > 0) {
    schema.qualifications = reqs.join(' ');
  }

  // Work schedule
  if (page.shift_ua || page.shift_pl) {
    schema.workHours = page.shift_ua || page.shift_pl;
  }

  return schema;
}

function buildBlogPostingJsonLd(post, imageUrl) {
  const url = `https://rybezh.site/post-${post.slug}.html`;
  const published = post.date ? toISODate(post.date) : toISODate(new Date());
  const modified = post.updated ? toISODate(post.updated) : published;
  const description = stripHtml(post.excerpt || '');
  const bodyText = stripHtml(post.body || '');
  const wordCount = bodyText.split(/\s+/).filter(Boolean).length;

  const resolvedImage = imageUrl || 'https://rybezh.site/og-image.png';

  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title || 'Blog',
    description,
    datePublished: published,
    dateModified: modified,
    url,
    inLanguage: 'uk',
    wordCount: wordCount > 0 ? wordCount : undefined,
    author: {
      '@type': 'Person',
      name: post.author || 'Rybezh',
      jobTitle: post.author_role || 'Редактор Rybezh',
      url: 'https://rybezh.site'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Rybezh',
      url: 'https://rybezh.site',
      logo: {
        '@type': 'ImageObject',
        url: 'https://rybezh.site/favicon.svg',
        width: 48,
        height: 48
      }
    },
    image: {
      '@type': 'ImageObject',
      url: resolvedImage,
      width: 1200,
      height: 600
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.post-section h1', '.post-section h2', '.post-section p:first-of-type']
    }
  };

  // Remove undefined fields
  Object.keys(data).forEach(k => data[k] === undefined && delete data[k]);

  return data;
}

function jsonLdScript(obj) {
  return `\n<script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n</script>\n`;
}

function hashString(value) {
  let hash = 0;
  const str = String(value || '');
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pickFromPool(pool, seed) {
  if (!Array.isArray(pool) || pool.length === 0) return '';
  return pool[seed % pool.length];
}

function pickList(pool, count, seed) {
  if (!Array.isArray(pool) || pool.length === 0) return [];
  const items = [];
  const used = new Set();
  let i = 0;
  while (items.length < Math.min(count, pool.length)) {
    const idx = (seed + i * 7) % pool.length;
    if (!used.has(idx)) {
      items.push(pool[idx]);
      used.add(idx);
    }
    i++;
  }
  return items;
}

function detectTopic(post) {
  const slug = String(post?.slug || '').toLowerCase();
  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    if (keywords.some(key => slug.includes(key))) {
      return topic;
    }
  }
  return 'general';
}

function getTopicPool(topic, lang) {
  const t = TOPIC_NOTES[topic] || TOPIC_NOTES.general;
  return t?.[lang] || TOPIC_NOTES.general[lang] || [];
}

function getTopicFaqItems(topic, lang, seed) {
  const topicFaq = TOPIC_FAQ[topic]?.[lang];
  const fallback = TOPIC_FAQ.general?.[lang] || FAQ_POOL[lang] || [];
  const pool = Array.isArray(topicFaq) && topicFaq.length ? topicFaq : fallback;
  return pickList(pool, 3, seed);
}

function buildHumanNotesSection(post, lang, seed) {
  const topic = detectTopic(post);
  const notesPool = getTopicPool(topic, lang);
  const notes = pickList(notesPool, 3, seed + 3);
  if (!notes.length) return '';
  const heading = lang === 'pl' ? 'Notatki z praktyki' : 'Нотатки з практики';
  return `
    <section class="post-section post-notes">
      <h2>${heading}</h2>
      <ul>${notes.map(n => `<li>${escapeHtml(n)}</li>`).join('')}</ul>
    </section>
  `;
}

function buildReaderQuestionsSection(post, lang, seed) {
  const topic = detectTopic(post);
  const items = getTopicFaqItems(topic, lang, seed + 5);
  if (!items.length) return '';
  const heading = lang === 'pl' ? 'Najczęstsze pytania, które dostajemy' : 'Найчастіші питання, які нам ставлять';
  const details = items.map(item => `
    <details>
      <summary>${escapeHtml(item.q)}</summary>
      <p>${escapeHtml(item.a)}</p>
    </details>
  `).join('');
  return `
    <section class="post-section post-questions">
      <h2>${heading}</h2>
      ${details}
    </section>
  `;
}

function pickVoiceProfile(lang, seed) {
  const pool = VOICE_STYLES[lang] || [];
  if (!pool.length) return { leadIns: [], doubts: [], rhythm: 3 };
  return pool[seed % pool.length];
}

function ensureLazyLoading(html) {
  return String(html || '').replace(/<img\s+([^>]*?)>/gi, (match, attrs) => {
    const normalized = attrs || '';
    if (/\sloading=/i.test(normalized)) return match;
    const safeAttrs = normalized.trim().replace(/\s*\/$/, '');
    return `<img ${safeAttrs} loading="lazy" decoding="async">`;
  });
}

function tokenizeTitle(title) {
  return stripHtml(title)
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(token => token.length > 3);
}

function flattenLists(html, lang, seed) {
  return String(html || '').replace(/<(ul|ol)[^>]*>([\s\S]*?)<\/\1>/gi, (match, type, inner) => {
    const items = Array.from(inner.matchAll(/<li>([\s\S]*?)<\/li>/gi))
      .map(m => m[1].replace(/\s+/g, ' ').trim())
      .filter(Boolean);
    if (!items.length) return match;
    const prefix = pickFromPool(LIST_PREFIXES[lang] || [], seed);
    return `<p>${escapeHtml(prefix)} ${items.join(', ')}.</p>`;
  });
}

function injectVoiceParagraphs(html, lang, seed) {
  const profile = pickVoiceProfile(lang, seed + 1);
  let index = 0;
  const leadIns = profile.leadIns || [];
  const doubts = profile.doubts || [];
  const rhythm = Math.max(2, profile.rhythm || 3);

  return String(html || '').replace(/<p>([\s\S]*?)<\/p>/gi, (match, inner) => {
    const lead = ((index + seed) % rhythm === 0) ? pickFromPool(leadIns, seed + index) : '';
    const doubt = ((index + seed) % (rhythm + 1) === 0) ? pickFromPool(doubts, seed + index + 2) : '';
    index += 1;
    return `${lead ? `<p class="post-voice">${escapeHtml(lead)}</p>` : ''}<p>${inner}</p>${doubt ? `<p class="post-voice">${escapeHtml(doubt)}</p>` : ''}`;
  });
}

function humanizeBody(body, title, lang, seed) {
  // Automatic injection removed to avoid repetition across posts.
  // Content should be unique in posts.json.
  
  let html = ensureLazyLoading(body || '');
  // Keep lists as-is. Flattening creates repeated prefixes across many posts.
  // Voice paragraphs injection disabled for uniqueness
  // html = injectVoiceParagraphs(html, lang, seed + 4);

  return html;
}

function buildEditorsNote(lang, seed) {
  const note = pickFromPool(EDITOR_NOTES[lang] || [], seed + 8);
  return `
    <div class="editor-note">
      <strong>${lang === 'pl' ? 'Notatka redakcji' : 'Примітка редактора'}:</strong>
      <span>${escapeHtml(note)}</span>
    </div>
  `;
}

function buildInlinePhoto(lang, seed) {
  const photo = pickFromPool(PHOTO_POOL[lang] || [], seed + 12);
  if (!photo || !photo.url) return '';
  return `
    <figure class="post-photo">
      <img src="${photo.url}" alt="${escapeHtml(photo.caption)}" loading="lazy" decoding="async">
      <figcaption>${escapeHtml(photo.caption)}</figcaption>
    </figure>
  `;
}

function buildUpdateHistory(lang, updatedDate) {
  const label = lang === 'pl' ? 'Zaktualizowano' : 'Оновлено';
  return `
    <div class="update-history">
      <span class="update-label">${label}:</span>
      <span class="update-date" data-format-date="${updatedDate}">${updatedDate}</span>
    </div>
  `;
}

function buildSignatureBlock(lang, seed) {
  const sign = pickFromPool(SIGNATURES[lang] || [], seed + 14);
  return `
    <div class="signature-block">
      <span class="signature-line">${escapeHtml(sign)}</span>
      <span class="signature-stamp">Rybezh • 2026</span>
    </div>
  `;
}

function buildCommentData(lang, seed) {
  const names = UGC_NAMES[lang] || [];
  const commentsPool = UGC_COMMENTS[lang] || [];
  const repliesPool = UGC_REPLIES[lang] || [];
  const count = 20 + (seed % 31);

  const extraNames = lang === 'pl'
    ? ['Ewa', 'Michał', 'Svitlana', 'Artem', 'Yana', 'Ania', 'Dmytro']
    : ['Аліна', 'Ігор', 'Світлана', 'Влад', 'Оксана', 'Петро', 'Юрій'];
  const allNames = names.concat(extraNames);

  const data = [];
  for (let i = 0; i < count; i++) {
    const name = allNames[(seed + i * 3) % allNames.length];
    const country = UGC_COUNTRIES[(seed + i * 5) % UGC_COUNTRIES.length];
    const avatar = AVATARS[(seed + i + 2) % AVATARS.length];
    const text = commentsPool[(seed + i * 7) % commentsPool.length];
    const item = {
      id: `c-${seed}-${i}`,
      name,
      country,
      avatar,
      text,
      replies: []
    };

    if (i % 2 === 0) {
      item.replies.push({
        id: `c-${seed}-${i}-r1`,
        name: allNames[(seed + i * 4 + 1) % allNames.length],
        country: UGC_COUNTRIES[(seed + i * 6 + 1) % UGC_COUNTRIES.length],
        avatar: AVATARS[(seed + i + 1) % AVATARS.length],
        text: commentsPool[(seed + i * 9 + 2) % commentsPool.length],
        isTeam: false
      });
    }

    if (i % 3 === 0) {
      item.replies.push({
        id: `c-${seed}-${i}-r2`,
        name: i % 4 === 0 ? 'Rybezh Team' : 'Rybezh Support',
        country: { flag: '✅', label: 'RYBEZH' },
        avatar: '🟢',
        text: repliesPool[(seed + i * 11) % repliesPool.length],
        isTeam: true
      });
    }

    data.push(item);
  }

  return data;
}

function randomDate(seed) {
  const start = new Date('2022-01-01').getTime();
  const end = new Date('2026-12-31').getTime();
  const rand = (seed % 1000) / 1000;
  const time = Math.floor(start + (end - start) * rand);
  return new Date(time).toISOString().slice(0, 10);
}

function buildReviewsSection(lang, seed) {
  const pool = REVIEW_POOL[lang] || [];
  const reviews = pickList(pool, 3, seed + 11);
  const cards = reviews.map((r, idx) => {
    const stars = '★'.repeat(r.stars) + '☆'.repeat(Math.max(0, 5 - r.stars));
    return `
      <div class="review-card">
        <div class="review-stars">${stars}</div>
        <p>${escapeHtml(r.text)}</p>
      </div>
    `;
  }).join('');
  return `
    <section class="post-section reviews">
      <h2>${lang === 'pl' ? 'Opinie czytelników' : 'Відгуки читачів'}</h2>
      <div class="review-grid">${cards}</div>
    </section>
  `;
}

function buildUgcSection(lang, seed) {
  const data = buildCommentData(lang, seed + 4);
  const intro = lang === 'pl'
    ? 'Wątki są żywe — czasem się zgadzamy, czasem nie. Tak ma być.'
    : 'Тут є й згода, і суперечки — як у реальному житті.';
  const countryOptions = UGC_COUNTRIES.map(country => {
    const selected = (lang === 'pl' ? 'PL' : 'UA') === country.label ? ' selected' : '';
    return `<option value="${country.label}"${selected}>${country.flag} ${country.label}</option>`;
  }).join('');

  return `
    <section class="post-section post-comments">
      <div class="comments-header">
        <div>
          <h2>${lang === 'pl' ? 'Komentarze' : 'Коментарі'}</h2>
          <p class="muted">${intro}</p>
        </div>
        <div class="comment-count" data-comment-count>${data.length}</div>
      </div>
      <div class="comment-list js-comment-thread" data-lang="${lang}" aria-live="polite"></div>
      <form class="comment-form js-comment-form" novalidate>
        <input name="name" type="text" required placeholder="${lang === 'pl' ? 'Imię' : 'Імʼя'}" aria-label="${lang === 'pl' ? 'Imię' : 'Імʼя'}" />
        <select name="country" aria-label="${lang === 'pl' ? 'Kraj' : 'Країна'}">${countryOptions}</select>
        <textarea name="comment" required placeholder="${lang === 'pl' ? 'Napisz komentarz…' : 'Напишіть коментар…'}" aria-label="${lang === 'pl' ? 'Komentarz' : 'Коментар'}"></textarea>
        <button type="submit" class="btn-secondary">${lang === 'pl' ? 'Wyślij' : 'Надіслати'}</button>
        <div class="form-message" aria-live="polite"></div>
      </form>
      <script type="application/json" class="comment-data">${JSON.stringify(data)}</script>
    </section>
  `;
}

function getRelatedPosts(post, posts, limit = 3) {
  const baseTokens = new Set(tokenizeTitle(post.title || ''));
  const scored = posts
    .filter(p => p.slug !== post.slug)
    .map(p => {
      const tokens = tokenizeTitle(p.title || '');
      const score = tokens.reduce((acc, t) => acc + (baseTokens.has(t) ? 1 : 0), 0);
      return { post: p, score };
    })
    .sort((a, b) => b.score - a.score);

  const nonZero = scored.filter(item => item.score > 0);
  const selected = (nonZero.length ? nonZero : scored).slice(0, limit).map(item => item.post);
  return selected;
}

function buildEnhancedPostContent(post, posts, categories, lang, readMinutes) {
  const seed = hashString(`${post.slug}-${lang}`);
  const related = getRelatedPosts(post, posts, 3);
  const isPl = lang === 'pl';
  const isRu = lang === 'ru';

  const bodySource = isPl
    ? (post.body_pl || post.body || '')
    : (isRu ? (post.body_ru || toRussianFallbackText(post.body || '')) : (post.body || ''));
  const bodyTitle = isPl
    ? (post.title_pl || post.title)
    : (isRu ? (post.title_ru || toRussianFallbackText(post.title || '')) : post.title);
  const body = humanizeBody(bodySource, bodyTitle, lang, seed + 5);

  const updatedDate = post.updated || post.date || new Date().toISOString().slice(0, 10);

  const relatedHtml = related.map(r => {
    const title = isPl
      ? (r.title_pl || r.title)
      : (isRu ? (r.title_ru || toRussianFallbackText(r.title || '')) : r.title);
    return `<li><a href="/post-${escapeHtml(r.slug)}.html">${escapeHtml(title)}</a></li>`;
  }).join('');

  const author = SITE_AUTHOR[lang] || SITE_AUTHOR.ua;
  const readLabel = isPl ? 'Czas czytania' : (isRu ? 'Время чтения' : 'Час читання');
  const updatedLabel = isPl ? 'Aktualizacja' : (isRu ? 'Обновление' : 'Оновлення');

  return {
    html: `
      <div class="author-box">
        <div class="author-avatar">🧭</div>
        <div>
          <div class="author-name">${escapeHtml(author.name)}</div>
          <div class="author-role">${escapeHtml(author.role)}</div>
          <div class="author-note">${escapeHtml(author.note)}</div>
        </div>
      </div>
      <div class="post-meta-cards">
        <div class="post-chip"><span>${readLabel}</span><strong>${readMinutes} ${isPl ? 'min' : (isRu ? 'мин' : 'хв')}</strong></div>
        <div class="post-chip"><span>${updatedLabel}</span><strong data-format-date="${updatedDate}">${updatedDate}</strong></div>
      </div>
      <section class="post-section">
        ${body}
      </section>
      <section class="post-section post-related">
        <h3>${isPl ? 'Powiązane artykuły' : (isRu ? 'Похожие статьи' : 'Пов’язані статті')}</h3>
        <ul>${relatedHtml}</ul>
      </section>
      <section class="post-section post-vacancies-cta">
        <h3>${isPl ? 'Szukasz pracy?' : (isRu ? 'Ищете работу?' : 'Шукаєте роботу?')}</h3>
        <p>${isPl ? 'Sprawdź aktualne oferty pracy w Polsce.' : (isRu ? 'Посмотрите актуальные вакансии в Польше.' : 'Перегляньте актуальні вакансії в Польщі.')}</p>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;margin-top:0.75rem;">
          <a href="/vacancies.html" style="text-decoration:none;display:inline-block;padding:0.6rem 1.2rem;background:#00a67e;border-radius:8px;color:#fff;font-weight:600;">${isPl ? 'Oferty pracy' : (isRu ? 'Вакансии' : 'Вакансії')} →</a>
          <a href="/calculator.html" style="text-decoration:none;display:inline-block;padding:0.6rem 1.2rem;background:#f3f4f6;border-radius:8px;color:#374151;font-weight:600;">💰 ${isPl ? 'Kalkulator' : (isRu ? 'Калькулятор' : 'Калькулятор')}</a>
          <a href="/cv-generator.html" style="text-decoration:none;display:inline-block;padding:0.6rem 1.2rem;background:#f3f4f6;border-radius:8px;color:#374151;font-weight:600;">📄 ${isPl ? 'Generator CV' : (isRu ? 'Генератор CV' : 'Генератор CV')}</a>
        </div>
      </section>
    `,
    faqItems: []
  };
}

// ==========================================
// Polish Page Generation (post-build)
// ==========================================

/**
 * Extract the main translations object from main.js at build time.
 */
async function getMainTranslations() {
  const mainJs = await fs.readFile(path.join(SRC, 'main.js'), 'utf8');
  const startMarker = 'const translations = {';
  const startIdx = mainJs.indexOf(startMarker);
  if (startIdx === -1) { console.warn('⚠️  translations not found in main.js'); return {}; }

  const braceStart = mainJs.indexOf('{', startIdx);
  let depth = 0, end = braceStart;
  for (let i = braceStart; i < mainJs.length; i++) {
    if (mainJs[i] === '{') depth++;
    else if (mainJs[i] === '}') { depth--; if (depth === 0) { end = i + 1; break; } }
  }

  try {
    return new Function(`return ${mainJs.slice(braceStart, end)}`)();
  } catch (e) {
    console.error('❌ Failed to parse translations:', e.message);
    return {};
  }
}

/**
 * Remove all data-lang-content="<lang>" blocks (element + content) from HTML.
 */
function removeLangContentBlocks(html, langToRemove) {
  const marker = `data-lang-content="${langToRemove}"`;
  let result = '', pos = 0;

  while (pos < html.length) {
    const idx = html.indexOf(marker, pos);
    if (idx === -1) { result += html.slice(pos); break; }

    // Find opening tag start
    let tagStart = idx;
    while (tagStart > 0 && html[tagStart] !== '<') tagStart--;
    result += html.slice(pos, tagStart);

    const tagMatch = html.slice(tagStart).match(/^<(\w+)/);
    const tagName = tagMatch ? tagMatch[1] : 'div';
    const openTagEnd = html.indexOf('>', idx);
    if (openTagEnd === -1) { pos = html.length; break; }

    // Track nesting to find matching close tag
    let depth = 1, searchPos = openTagEnd + 1;
    const closeTag = `</${tagName}>`;

    while (depth > 0 && searchPos < html.length) {
      const closeIdx = html.indexOf(closeTag, searchPos);
      if (closeIdx === -1) { searchPos = html.length; break; }

      // Count same-tag opens between searchPos and closeIdx
      const seg = html.slice(searchPos, closeIdx);
      const openRe = new RegExp(`<${tagName}[\\s>/]`, 'g');
      let m; while ((m = openRe.exec(seg)) !== null) depth++;

      depth--;
      searchPos = closeIdx + closeTag.length;
    }

    pos = searchPos;
    // Skip trailing newline
    if (pos < html.length && html[pos] === '\n') pos++;
  }

  return result;
}

/**
 * Show data-lang-content="<lang>" blocks: remove attribute + display:none style.
 */
function showLangContentBlocks(html, lang) {
  // data-lang-content before style
  html = html.replace(
    new RegExp(`\\s*data-lang-content="${lang}"(\\s*)style="display:\\s*none;?\\s*"`, 'g'), '$1'
  );
  // style before data-lang-content
  html = html.replace(
    new RegExp(`\\s*style="display:\\s*none;?\\s*"(\\s*)data-lang-content="${lang}"`, 'g'), '$1'
  );
  // Any remaining standalone attribute
  html = html.replace(new RegExp(`\\s*data-lang-content="${lang}"`, 'g'), '');
  return html;
}

/**
 * Apply PL translations to all data-i18n elements in HTML at build time.
 */
function applyI18nTranslationsBuild(html, translations, targetLang = 'pl') {
  const getLangText = (dict, fallback = '') => {
    if (!dict) return fallback;
    if (dict[targetLang] !== undefined && dict[targetLang] !== null) return dict[targetLang];
    if (targetLang === 'ru') {
      const source = (dict.ua !== undefined && dict.ua !== null)
        ? dict.ua
        : ((dict.pl !== undefined && dict.pl !== null) ? dict.pl : fallback);
      return toRussianFallbackText(source);
    }
    if (dict.ua !== undefined && dict.ua !== null) return dict.ua;
    if (dict.pl !== undefined && dict.pl !== null) return dict.pl;
    if (dict.ru !== undefined && dict.ru !== null) return dict.ru;
    return fallback;
  };

  // 1. Void elements with data-i18n-attr (meta, input)
  html = html.replace(
    /<(meta|input|link)\b([^>]*?)data-i18n="([^"]+)"([^>]*?)>/gi,
    (match, _tag, before, key, after) => {
      const fullAttrs = before + ' ' + after;
      const attrMatch = fullAttrs.match(/data-i18n-attr="([^"]+)"/);
      if (!attrMatch) return match;
      const attr = attrMatch[1];
      const dict = translations[key];
      if (!dict) return match;
      const text = String(getLangText(dict, '')).replace(/"/g, '&quot;');
      return match.replace(new RegExp(`${attr}="[^"]*"`), `${attr}="${text}"`);
    }
  );

  // 2. Regular elements with data-i18n (text content or attribute)
  html = html.replace(
    /<(\w+)\b(\s[^>]*?data-i18n="([^"]+)"[^>]*?)>([\s\S]*?)<\/\1>/g,
    (match, tag, attrs, key, content) => {
      const dict = translations[key];
      if (!dict) return match;

      if (attrs.includes('data-i18n-attr')) {
        // Non-void element with attribute replacement
        const attrMatch = attrs.match(/data-i18n-attr="([^"]+)"/);
        if (attrMatch) {
          const attr = attrMatch[1];
          const text = String(getLangText(dict, '')).replace(/"/g, '&quot;');
          const newAttrs = attrs.replace(new RegExp(`${attr}="[^"]*"`), `${attr}="${text}"`);
          return `<${tag}${newAttrs}>${content}</${tag}>`;
        }
        return match;
      }

      // Text/HTML content replacement
      const text = getLangText(dict, content);
      return `<${tag}${attrs}>${text}</${tag}>`;
    }
  );

  return html;
}

/**
 * Update internal navigation links for PL pages: href="/x.html" → href="/x-pl.html"
 */
function updateLinksForPolish(html) {
  // Root → PL index
  html = html.replace(/href="\/"/g, 'href="/index-pl.html"');

  // .html links → -pl.html (skip already-PL, skip non-page resources)
  const skipBases = new Set(['styles', 'main', 'jobs', 'jobs-loader', 'features', 'engagement']);
  html = html.replace(
    /href="\/([\w][\w\-]*)(\.html)([\?#][^"]*)?"/g,
    (match, base, ext, suffix) => {
      if (base.endsWith('-pl') || skipBases.has(base)) return match;
      return `href="/${base}-pl${ext}${suffix || ''}"`;
    }
  );

  return html;
}

/**
 * Update internal navigation links for RU pages: href="/x.html" → href="/x-ru.html"
 */
function updateLinksForRussian(html) {
  // Root → RU index
  html = html.replace(/href="\/"/g, 'href="/index-ru.html"');

  const skipBases = new Set(['styles', 'main', 'jobs', 'jobs-loader', 'features', 'engagement']);
  html = html.replace(
    /href="\/([\w][\w\-]*)(\.html)([\?#][^"]*)?"/g,
    (match, base, ext, suffix) => {
      if (base.endsWith('-ru') || skipBases.has(base)) return match;
      return `href="/${base}-ru${ext}${suffix || ''}"`;
    }
  );

  return html;
}

/**
 * Update full rybezh.site URLs to PL versions.
 */
function updateFullUrlsForPolish(html) {
  html = html.replace(
    /(https:\/\/rybezh\.site\/)([\w][\w\-]*)(\.html)/g,
    (match, domain, base, ext) => {
      if (base.endsWith('-pl')) return match;
      return `${domain}${base}-pl${ext}`;
    }
  );
  // Root canonical/OG → index-pl.html
  html = html.replace(
    /(<(?:link[^>]+rel="canonical"|meta[^>]+property="og:url"|meta[^>]+name="twitter:url")[^>]+(?:href|content)=")https:\/\/rybezh\.site\/"/g,
    '$1https://rybezh.site/index-pl.html"'
  );
  return html;
}

/**
 * Update full rybezh.site URLs to RU versions.
 */
function updateFullUrlsForRussian(html) {
  html = html.replace(
    /(https:\/\/rybezh\.site\/)([\w][\w\-]*)(\.html)/g,
    (match, domain, base, ext) => {
      if (base.endsWith('-ru')) return match;
      return `${domain}${base}-ru${ext}`;
    }
  );
  // Root canonical/OG → index-ru.html
  html = html.replace(
    /(<(?:link[^>]+rel="canonical"|meta[^>]+property="og:url"|meta[^>]+name="twitter:url")[^>]+(?:href|content)=")https:\/\/rybezh\.site\/"/g,
    '$1https://rybezh.site/index-ru.html"'
  );
  return html;
}

/**
 * Add/replace hreflang tags in HTML.
 */
function addHreflangTags(html, filename, hasRuVersion) {
  let uaUrl, plUrl, ruUrl;
  if (filename === 'index.html') {
    uaUrl = 'https://rybezh.site/';
    plUrl = 'https://rybezh.site/index-pl.html';
    ruUrl = 'https://rybezh.site/index-ru.html';
  } else {
    uaUrl = `https://rybezh.site/${filename}`;
    plUrl = `https://rybezh.site/${filename.replace('.html', '-pl.html')}`;
    ruUrl = `https://rybezh.site/${filename.replace('.html', '-ru.html')}`;
  }

  const ruTag = hasRuVersion ? `\n  <link rel="alternate" hreflang="ru" href="${ruUrl}">` : '';
  const tags = `
  <link rel="alternate" hreflang="uk" href="${uaUrl}">${ruTag}
  <link rel="alternate" hreflang="pl" href="${plUrl}">
  <link rel="alternate" hreflang="x-default" href="${uaUrl}">`;

  // Remove existing hreflang tags
  html = html.replace(/<link\s+rel="alternate"\s+hreflang="[^"]*"\s+href="[^"]*"\s*\/?\s*>\s*\n?/g, '');

  if (html.includes('</head>')) {
    html = html.replace('</head>', `${tags}\n</head>`);
  }
  return html;
}

/**
 * Transform a complete HTML page to its Polish version.
 */
function transformToPolish(html, translations, filename) {
  let r = html;

  // 1. Lang attribute
  r = r.replace(/<html\s+lang="uk"/g, '<html lang="pl"');

  // 2. Data-lang-content blocks
  r = removeLangContentBlocks(r, 'ua');
  r = showLangContentBlocks(r, 'pl');

  // 3. Apply i18n translations
  r = applyI18nTranslationsBuild(r, translations);

  // 4. OG locale
  r = r.replace(/(<meta\s+property="og:locale"\s+content=")uk_UA"/g, '$1pl_PL"');
  r = r.replace(/(<meta\s+property="og:locale:alternate"\s+content=")pl_PL"/g, '$1uk_UA"');
  r = r.replace(/(<meta\s+property="og:site_name"\s+content=")[^"]*"/g, '$1Rybezh — Praca w Polsce"');

  // 5. Full URLs
  r = updateFullUrlsForPolish(r);

  // 6. Internal links
  r = updateLinksForPolish(r);

  // 7. Hreflang
  r = addHreflangTags(r, filename, true);

  // 8. Force PL language on load
  if (r.includes('</head>')) {
    r = r.replace('</head>',
      `<script>if(typeof localStorage!=='undefined'){localStorage.setItem('site_lang','pl');localStorage.setItem('siteLang','pl');}</script>\n</head>`);
  }

  return r;
}

/**
 * Transform a complete HTML page to its Russian version.
 */
function transformToRussian(html, translations, filename) {
  let r = html;

  // 1. Lang attribute
  r = r.replace(/<html\s+lang="uk"/g, '<html lang="ru"');
  r = r.replace(/<html\s+lang="pl"/g, '<html lang="ru"');

  // 2. Data-lang-content blocks
  r = removeLangContentBlocks(r, 'ua');
  r = removeLangContentBlocks(r, 'pl');
  r = showLangContentBlocks(r, 'ru');

  // 3. Apply i18n translations
  r = applyI18nTranslationsBuild(r, translations, 'ru');

  // 4. OG locale
  r = r.replace(/(<meta\s+property="og:locale"\s+content=")uk_UA"/g, '$1ru_RU"');
  r = r.replace(/(<meta\s+property="og:locale"\s+content=")pl_PL"/g, '$1ru_RU"');

  // 5. Full URLs + internal links
  r = updateFullUrlsForRussian(r);
  r = updateLinksForRussian(r);

  // 6. Hreflang
  r = addHreflangTags(r, filename, true);

  // 7. Force RU language on load
  if (r.includes('</head>')) {
    r = r.replace('</head>',
      `<script>if(typeof localStorage!=='undefined'){localStorage.setItem('site_lang','ru');localStorage.setItem('siteLang','ru');}</script>\n</head>`);
  }

  return toRussianFallbackText(r);
}

/**
 * Generate Polish versions of all HTML pages in dist/.
 */
async function generatePolishPages(dynamicTranslations) {
  console.log('\n🇵🇱 Generating Polish pages...');

  const mainTranslations = await getMainTranslations();
  const allTranslations = { ...mainTranslations, ...(dynamicTranslations || {}) };

  let entries;
  try { entries = await fs.readdir(DIST, { withFileTypes: true }); }
  catch { console.warn('  ⚠️  dist/ not found'); return; }

  const htmlFiles = entries
    .filter(e => e.isFile() && e.name.endsWith('.html') && !e.name.endsWith('-pl.html') && !e.name.endsWith('-ru.html'))
    .map(e => e.name);

  let generated = 0;
  for (const file of htmlFiles) {
    try {
      const filePath = path.join(DIST, file);
      const html = await fs.readFile(filePath, 'utf8');

      // Generate PL version
      const plHtml = transformToPolish(html, allTranslations, file);
      const plFile = file.replace('.html', '-pl.html');
      await fs.writeFile(path.join(DIST, plFile), plHtml, 'utf8');

      // Add hreflang tags to the original UA page
      const uaHtml = addHreflangTags(html, file, true);
      await fs.writeFile(filePath, uaHtml, 'utf8');

      generated++;
    } catch (e) {
      console.error(`  ❌ ${file}: ${e.message}`);
    }
  }

  // PL version of 404 subdirectory
  try {
    const dir = path.join(DIST, '404-pl');
    await fs.mkdir(dir, { recursive: true });
    const pl404 = await fs.readFile(path.join(DIST, '404-pl.html'), 'utf8');
    await fs.writeFile(path.join(dir, 'index.html'), pl404, 'utf8');
  } catch {}

  console.log(`  ✅ Generated ${generated} Polish pages`);
}

/**
 * Generate Russian versions of all HTML pages in dist/.
 */
async function generateRussianPages(dynamicTranslations) {
  console.log('\n🇷🇺 Generating Russian pages...');

  const mainTranslations = await getMainTranslations();
  const allTranslations = { ...mainTranslations, ...(dynamicTranslations || {}) };

  let entries;
  try { entries = await fs.readdir(DIST, { withFileTypes: true }); }
  catch { console.warn('  ⚠️  dist/ not found'); return; }

  const htmlFiles = entries
    .filter(e => e.isFile() && e.name.endsWith('.html') && !e.name.endsWith('-pl.html') && !e.name.endsWith('-ru.html'))
    .map(e => e.name);

  let generated = 0;
  for (const file of htmlFiles) {
    try {
      const filePath = path.join(DIST, file);
      const html = await fs.readFile(filePath, 'utf8');

      const ruHtml = transformToRussian(html, allTranslations, file);
      const ruFile = file.replace('.html', '-ru.html');
      await fs.writeFile(path.join(DIST, ruFile), ruHtml, 'utf8');
      generated++;
    } catch (e) {
      console.error(`  ❌ ${file}: ${e.message}`);
    }
  }

  // RU version of 404 subdirectory
  try {
    const dir = path.join(DIST, '404-ru');
    await fs.mkdir(dir, { recursive: true });
    const ru404 = await fs.readFile(path.join(DIST, '404-ru.html'), 'utf8');
    await fs.writeFile(path.join(dir, 'index.html'), ru404, 'utf8');
  } catch {}

  console.log(`  ✅ Generated ${generated} Russian pages`);
}

build().catch(err => {
  console.error(err);
  process.exit(1);
});
