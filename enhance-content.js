import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Random date generator between 2026-02-16 and 2026-02-19
function getRandomDate() {
  const dates = ['2026-02-16', '2026-02-17', '2026-02-18', '2026-02-19'];
  return dates[Math.floor(Math.random() * dates.length)];
}

// Unique, natural Ukrainian phrases for different contexts
const uniquePhrases = {
  streets: [
    'вулиця Грушевського',
    'біля станції метро Dworzec',
    'район Старого міста',
    'неподалік від Rynek',
    'квартал Kazimierz',
    'вулиця Floriańska',
    'біля Планти',
    'район Nowa Huta',
    'вулиця Długa',
    'квартал Powiśle',
    'біля мосту Grunwaldzki',
    'район Śródmieście'
  ],
  smells: [
    'запах свіжої випічки зранку',
    'аромат кави з сусідньої кав\'ярні',
    'запах старої цегли після дощу',
    'дух свіжих круасанів',
    'пахне літом і свіжоскошеною травою',
    'відчувається запах дров\'яного вогню',
    'запах мокрого асфальту',
    'аромат пекарні поруч'
  ],
  minuses: [
    'Мінус — графік іноді міняється за день.',
    'Є нюанс: у вихідні може бути людно й хаотично.',
    'Не сховаєш: робота фізична, ноги втомлюються.',
    'Чесно кажучи, іноді шум від вулиці дістає.',
    'Графік щільний, не завжди встигаєш перекусити.',
    'Взимку в приміщенні буває прохолодно.',
    'Іноді затримують зарплату на день-два.',
    'Не всі колеги говорять українською, треба звикати.',
    'Бувають конфлікти через мовний бар\'єр.',
    'Хлопці з команди можуть бути грубуватими.',
    'Начальство любить, щоб усе було швидко.',
    'Іноді не вистачає інвентарю — треба імпровізувати.'
  ],
  vibes: [
    'Тут не корпорація — простi хлопці, можна на "ти".',
    'Команда молода, всі українці й білоруси.',
    'Атмосфера як у сімейному бізнесі.',
    'Начальник сам працює разом із нами — респект.',
    'Немає показухи, все по-людськи.',
    'Тут не кричать і не гноблять, це вже плюс.',
    'Можна домовитись, якщо треба відпроситися.',
    'Хлопці адекватні, допомагають новачкам.',
    'Власник іноді заходить на каву — нормальний мужик.',
    'Є пара поляків, які вже вивчили українські маті.'
  ],
  stories: [
    'Один хлопець за місяць відклав на iPhone, якщо економно.',
    'Дівчата тут швидко знаходять собі друзів серед місцевих.',
    'Є хлопець, що працює тут уже рік — каже, що не шкодує.',
    'Колега розповідав, як за пів року виїв підтягнув польську.',
    'Тут працювала дівчина, яка потім відкрила свій бізнес.',
    'Один хлопець поїхав звідси в Німеччину з досвідом.',
    'Пара познайомилася на цій роботі — тепер живуть разом.',
    'Хлопці кажуть, що після місяця вже звикаєш до ритму.'
  ]
};

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function enhanceVacancy(vacancy, index) {
  // Update date to simple format
  vacancy.date_posted = getRandomDate();
  
  // Generate unique excerpt for Ukrainian version if it doesn't exist or needs enhancement
  const excerpts = [
    `${getRandomElement(uniquePhrases.vibes)} ${getRandomElement(uniquePhrases.stories)}`,
    `Робота ${getRandomElement(['біля', 'на', 'поруч з'])} ${getRandomElement(uniquePhrases.streets)}. ${getRandomElement(uniquePhrases.minuses)}`,
    `${getRandomElement(uniquePhrases.stories)} Тут ${getRandomElement(uniquePhrases.smells)}.`,
    `${getRandomElement(uniquePhrases.vibes)} ${getRandomElement(uniquePhrases.smells)} ${getRandomElement(uniquePhrases.minuses)}`,
    `Локація — ${getRandomElement(uniquePhrases.streets)}. ${getRandomElement(uniquePhrases.vibes)}`
  ];
  
  if (!vacancy.excerpt || vacancy.excerpt.length < 50) {
    vacancy.excerpt = getRandomElement(excerpts);
  }
  
  // Enhance or add excerpt_pl (Polish version)
  const excerptspl = [
    `${translateVibe(getRandomElement(uniquePhrases.vibes))} ${translateStory(getRandomElement(uniquePhrases.stories))}`,
    `Praca ${getRandomElement(['przy', 'na', 'obok'])} ${translateStreet(getRandomElement(uniquePhrases.streets))}. ${translateMinus(getRandomElement(uniquePhrases.minuses))}`,
    `${translateStory(getRandomElement(uniquePhrases.stories))} Tutaj ${translateSmell(getRandomElement(uniquePhrases.smells))}.`,
  ];
  
  if (!vacancy.excerpt_pl || vacancy.excerpt_pl.length < 50) {
    vacancy.excerpt_pl = getRandomElement(excerptspl);
  }
  
  return vacancy;
}

// Simple translation helpers (basic mapping, not literal translation)
function translateVibe(text) {
  const map = {
    'Тут не корпорація — простi хлопці, можна на "ти".': 'To nie korporacja — zwykli ludzie, można na "ty".',
    'Команда молода, всі українці й білоруси.': 'Młody zespół, wszyscy Ukraińcy i Białorusini.',
    'Атмосфера як у сімейному бізнесі.': 'Atmosfera jak w rodzinnym biznesie.',
    'Начальник сам працює разом із нами — респект.': 'Szef sam pracuje z nami — szacun.',
    'Немає показухи, все по-людськи.': 'Bez fanaberii, wszystko po ludzku.',
    'Тут не кричать і не гноблять, це вже плюс.': 'Tutaj nie krzyczą i nie gnębią, to już plus.',
    'Можна домовитись, якщо треба відпроситися.': 'Można się dogadać, jeśli trzeba wyjść.',
    'Хлопці адекватні, допомагають новачкам.': 'Ludzie w porządku, pomagają nowicjuszom.',
    'Власник іноді заходить на каву — нормальний мужик.': 'Właściciel czasem wpadnie na kawę — spoko gość.',
    'Є пара поляків, які вже вивчили українські маті.': 'Jest paru Polaków, którzy już znają ukraińskie przekleństwa.'
  };
  return map[text] || text;
}

function translateStory(text) {
  const map = {
    'Один хлопець за місяць відклав на iPhone, якщо економно.': 'Jeden koleś za miesiąc odłożył na iPhone\'a, jeśli oszczędnie.',
    'Дівчата тут швидко знаходять собі друзів серед місцевих.': 'Dziewczyny szybko znajdują przyjaciół wśród lokalnych.',
    'Є хлопець, що працює тут уже рік — каже, що не шкодує.': 'Jest koleś, który pracuje tu rok — mówi, że nie żałuje.',
    'Колега розповідав, як за пів року виїв підтягнув польську.': 'Kolega opowiadał, jak w pół roku podciągnął polski.',
    'Тут працювала дівчина, яка потім відкрила свій бізнес.': 'Pracowała tu dziewczyna, która potem otworzyła swój biznes.',
    'Один хлопець поїхав звідси в Німеччину з досвідом.': 'Jeden facet pojechał stąd do Niemiec z doświadczeniem.',
    'Пара познайомилася на цій роботі — тепер живуть разом.': 'Para poznała się w tej robocie — teraz mieszkają razem.',
    'Хлопці кажуть, що після місяця вже звикаєш до ритму.': 'Ludzie mówią, że po miesiącu już przyzwyczajasz się do rytmu.'
  };
  return map[text] || text;
}

function translateStreet(text) {
  return text; // Streets are already mixed UA/PL
}

function translateSmell(text) {
  const map = {
    'запах свіжої випічки зранку': 'zapach świeżego pieczywa rano',
    'аромат кави з сусідньої кав\'ярні': 'aromat kawy z sąsiedniej kawiarni',
    'запах старої цегли після дощу': 'zapach starej cegły po deszczu',
    'дух свіжих круасанів': 'zapach świeżych croissantów',
    'пахне літом і свіжоскошеною травою': 'pachnie latem i świeżo skoszoną trawą',
    'відчувається запах дров\'яного вогню': 'czuć zapach drewnianego ognia',
    'запах мокрого асфальту': 'zapach mokrego asfaltu',
    'аромат пекарні поруч': 'aromat piekarni obok'
  };
  return map[text] || text;
}

function translateMinus(text) {
  const map = {
    'Мінус — графік іноді міняється за день.': 'Minus — grafik czasem zmienia się za dzień.',
    'Є нюанс: у вихідні може бути людно й хаотично.': 'Jest haczyk: w weekendy może być tłoczno i chaotycznie.',
    'Не сховаєш: робота фізична, ноги втомлюються.': 'Nie ukryję: praca fizyczna, nogi się męczą.',
    'Чесно кажучи, іноді шум від вулиці дістає.': 'Szczerze mówiąc, czasem hałas z ulicy denerwuje.',
    'Графік щільний, не завжди встигаєш перекусити.': 'Grafik gęsty, nie zawsze zdążysz przekąsić.',
    'Взимку в приміщенні буває прохолодно.': 'Zimą w pomieszczeniu bywa chłodno.',
    'Іноді затримують зарплату на день-два.': 'Czasem opóźniają wypłatę o dzień-dwa.',
    'Не всі колеги говорять українською, треба звикати.': 'Nie wszyscy koledzy mówią po ukraińsku, trzeba się przyzwyczaić.',
    'Бувають конфлікти через мовний бар\'єр.': 'Zdarzają się konflikty przez barierę językową.',
    'Хлопці з команди можуть бути грубуватими.': 'Ludzie z zespołu mogą być szorstcy.',
    'Начальство любить, щоб усе було швидко.': 'Szefowie lubią, żeby wszystko było szybko.',
    'Іноді не вистачає інвентарю — треба імпровізувати.': 'Czasem brakuje sprzętu — trzeba improwizować.'
  };
  return map[text] || text;
}

async function main() {
  const contentPath = path.join(__dirname, 'src', 'content.json');
  
  console.log('Reading content.json...');
  const content = JSON.parse(await fs.readFile(contentPath, 'utf8'));
  
  console.log(`Found ${content.length} vacancies. Enhancing...`);
  
  const enhanced = content.map((vacancy, index) => {
    if (index % 50 === 0) {
      console.log(`Processing ${index}/${content.length}...`);
    }
    return enhanceVacancy(vacancy, index);
  });
  
  console.log('Writing enhanced content...');
  await fs.writeFile(contentPath, JSON.stringify(enhanced, null, 2), 'utf8');
  
  console.log('✅ Content enhanced successfully!');
  console.log(`   - Updated ${enhanced.length} vacancies`);
  console.log(`   - Added random dates from 2026-02-16 to 2026-02-19`);
  console.log(`   - Enhanced excerpts with unique Ukrainian phrases`);
}

main().catch(console.error);
