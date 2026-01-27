// Скрипт для генерації різноманітних вакансій
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
      title_ua: 'Водій-кур\'єр',
      title_pl: 'Kierowca-kurier',
      salary: '5000-7000 PLN',
      description_ua: 'Доставка вантажів по місту та області. Власний автомобіль обов\'язковий.',
      description_pl: 'Dostawa towarów po mieście i okolicach. Własny samochód wymagany.',
      requirements_ua: ['Право категорії B', 'Досвід від 1 року', 'Знання географії міста'],
      requirements_pl: ['Prawo jazdy kat. B', 'Doświadczenie min. 1 rok', 'Znajomość geografii miasta']
    },
    {
      title_ua: 'Складський працівник',
      title_pl: 'Pracownik magazynowy',
      salary: '4500-5500 PLN',
      description_ua: 'Комплектація замовлень, навантаження/розвантаження товарів.',
      description_pl: 'Kompletacja zamówień, załadunek/rozładunek towarów.',
      requirements_ua: ['Досвід на складі', 'Фізична витривалість', 'Відповідальність'],
      requirements_pl: ['Doświadczenie magazynowe', 'Wytrzymałość fizyczna', 'Odpowiedzialność']
    },
    {
      title_ua: 'Оператор навантажувача',
      title_pl: 'Operator wózka widłowego',
      salary: '5500-7000 PLN',
      description_ua: 'Робота на навантажувачі, переміщення вантажів по складу.',
      description_pl: 'Praca na wózku widłowym, przemieszczanie towarów w magazynie.',
      requirements_ua: ['Сертифікат UDT', 'Досвід від 2 років', 'Уважність'],
      requirements_pl: ['Certyfikat UDT', 'Doświadczenie min. 2 lata', 'Uwaga']
    }
  ],
  construction: [
    {
      title_ua: 'Будівельник-муляр',
      title_pl: 'Murarz',
      salary: '6000-9000 PLN',
      description_ua: 'Мурування стін, роботи з цеглою та блоками.',
      description_pl: 'Murowanie ścian, prace z cegłą i blokami.',
      requirements_ua: ['Досвід від 3 років', 'Вміння читати креслення', 'Власний інструмент'],
      requirements_pl: ['Doświadczenie min. 3 lata', 'Umiejętność czytania rysunków', 'Własne narzędzia']
    },
    {
      title_ua: 'Електрик будівельний',
      title_pl: 'Elektryk budowlany',
      salary: '6500-9500 PLN',
      description_ua: 'Монтаж електропроводки, підключення обладнання.',
      description_pl: 'Montaż instalacji elektrycznych, podłączanie urządzeń.',
      requirements_ua: ['Кваліфікація SEP', 'Досвід від 2 років', 'Знання норм'],
      requirements_pl: ['Uprawnienia SEP', 'Doświadczenie min. 2 lata', 'Znajomość norm']
    },
    {
      title_ua: 'Сантехнік',
      title_pl: 'Hydraulik',
      salary: '5500-8000 PLN',
      description_ua: 'Монтаж систем водопостачання та каналізації.',
      description_pl: 'Montaż systemów wodno-kanalizacyjnych.',
      requirements_ua: ['Досвід від 2 років', 'Власний інструмент', 'Комунікабельність'],
      requirements_pl: ['Doświadczenie min. 2 lata', 'Własne narzędzia', 'Komunikatywność']
    }
  ],
  production: [
    {
      title_ua: 'Робітник виробництва',
      title_pl: 'Pracownik produkcji',
      salary: '4200-5500 PLN',
      description_ua: 'Робота на виробничій лінії, упаковка продукції.',
      description_pl: 'Praca na linii produkcyjnej, pakowanie produktów.',
      requirements_ua: ['Без досвіду', 'Змінний графік', 'Відповідальність'],
      requirements_pl: ['Bez doświadczenia', 'Praca zmianowa', 'Odpowiedzialność']
    },
    {
      title_ua: 'Оператор верстата',
      title_pl: 'Operator maszyn',
      salary: '5000-6500 PLN',
      description_ua: 'Управління верстатами ЧПУ, контроль якості.',
      description_pl: 'Obsługa maszyn CNC, kontrola jakości.',
      requirements_ua: ['Досвід з ЧПУ', 'Технічна освіта', 'Уважність'],
      requirements_pl: ['Doświadczenie z CNC', 'Wykształcenie techniczne', 'Uwaga']
    }
  ],
  hospitality: [
    {
      title_ua: 'Кухар',
      title_pl: 'Kucharz',
      salary: '4500-6500 PLN',
      description_ua: 'Приготування страв за меню, дотримання стандартів.',
      description_pl: 'Przygotowywanie potraw zgodnie z menu, przestrzeganie standardów.',
      requirements_ua: ['Досвід від 1 року', 'Знання технології', 'Чистоплотність'],
      requirements_pl: ['Doświadczenie min. 1 rok', 'Znajomość technologii', 'Czystość']
    },
    {
      title_ua: 'Офіціант',
      title_pl: 'Kelner',
      salary: '3800-5000 PLN',
      description_ua: 'Обслуговування гостей, прийом замовлень.',
      description_pl: 'Obsługa gości, przyjmowanie zamówień.',
      requirements_ua: ['Комунікабельність', 'Охайність', 'Англійська базова'],
      requirements_pl: ['Komunikatywność', 'Schludność', 'Angielski podstawowy']
    }
  ],
  cleaning: [
    {
      title_ua: 'Прибиральник офісів',
      title_pl: 'Sprzątacz biur',
      salary: '3500-4500 PLN',
      description_ua: 'Прибирання офісних приміщень, підтримання чистоти.',
      description_pl: 'Sprzątanie pomieszczeń biurowych, utrzymanie czystości.',
      requirements_ua: ['Без досвіду', 'Акуратність', 'Відповідальність'],
      requirements_pl: ['Bez doświadczenia', 'Dokładność', 'Odpowiedzialność']
    },
    {
      title_ua: 'Прибиральник готелів',
      title_pl: 'Pokojówka hotelowa',
      salary: '3800-5000 PLN',
      description_ua: 'Прибирання номерів готелю, зміна білизни.',
      description_pl: 'Sprzątanie pokoi hotelowych, wymiana pościeli.',
      requirements_ua: ['Досвід бажаний', 'Швидкість', 'Чесність'],
      requirements_pl: ['Doświadczenie mile widziane', 'Szybkość', 'Uczciwość']
    }
  ],
  retail: [
    {
      title_ua: 'Продавець-консультант',
      title_pl: 'Sprzedawca-doradca',
      salary: '4000-5500 PLN',
      description_ua: 'Консультування клієнтів, продаж товарів.',
      description_pl: 'Doradztwo klientom, sprzedaż produktów.',
      requirements_ua: ['Комунікабельність', 'Досвід продажів', 'Приємна зовнішність'],
      requirements_pl: ['Komunikatywność', 'Doświadczenie w sprzedaży', 'Miły wygląd']
    },
    {
      title_ua: 'Касир',
      title_pl: 'Kasjer',
      salary: '3600-4500 PLN',
      description_ua: 'Робота на касі, обслуговування клієнтів.',
      description_pl: 'Praca na kasie, obsługa klientów.',
      requirements_ua: ['Уважність', 'Чесність', 'Швидкість'],
      requirements_pl: ['Uwaga', 'Uczciwość', 'Szybkość']
    }
  ],
  healthcare: [
    {
      title_ua: 'Медсестра',
      title_pl: 'Pielęgniarka',
      salary: '6000-8500 PLN',
      description_ua: 'Догляд за пацієнтами, медичні процедури.',
      description_pl: 'Opieka nad pacjentami, procedury medyczne.',
      requirements_ua: ['Медична освіта', 'Ліцензія', 'Досвід від 1 року'],
      requirements_pl: ['Wykształcenie medyczne', 'Licencja', 'Doświadczenie min. 1 rok']
    },
    {
      title_ua: 'Опікун літніх людей',
      title_pl: 'Opiekun osób starszych',
      salary: '4500-6500 PLN',
      description_ua: 'Догляд за літніми людьми, допомога в побуті.',
      description_pl: 'Opieka nad osobami starszymi, pomoc w życiu codziennym.',
      requirements_ua: ['Терпіння', 'Відповідальність', 'Досвід бажаний'],
      requirements_pl: ['Cierpliwość', 'Odpowiedzialność', 'Doświadczenie mile widziane']
    }
  ],
  it: [
    {
      title_ua: 'Програміст PHP',
      title_pl: 'Programista PHP',
      salary: '8000-15000 PLN',
      description_ua: 'Розробка веб-додатків, підтримка проектів.',
      description_pl: 'Tworzenie aplikacji webowych, wsparcie projektów.',
      requirements_ua: ['PHP, MySQL', 'Досвід від 2 років', 'Laravel/Symfony'],
      requirements_pl: ['PHP, MySQL', 'Doświadczenie min. 2 lata', 'Laravel/Symfony']
    },
    {
      title_ua: 'Тестувальник QA',
      title_pl: 'Tester QA',
      salary: '6000-9000 PLN',
      description_ua: 'Тестування програмного забезпечення, звіти про баги.',
      description_pl: 'Testowanie oprogramowania, raportowanie błędów.',
      requirements_ua: ['Англійська', 'Логічне мислення', 'Досвід від 1 року'],
      requirements_pl: ['Angielski', 'Myślenie logiczne', 'Doświadczenie min. 1 rok']
    }
  ],
  agriculture: [
    {
      title_ua: 'Робітник на збір урожаю',
      title_pl: 'Pracownik przy zbiorach',
      salary: '3500-4500 PLN',
      description_ua: 'Збір фруктів та овочів, сезонна робота.',
      description_pl: 'Zbiór owoców i warzyw, praca sezonowa.',
      requirements_ua: ['Фізична витривалість', 'Без досвіду', 'Готовність до сезонної роботи'],
      requirements_pl: ['Wytrzymałość fizyczna', 'Bez doświadczenia', 'Gotowość do pracy sezonowej']
    }
  ],
  education: [
    {
      title_ua: 'Вчитель англійської',
      title_pl: 'Nauczyciel języka angielskiego',
      salary: '5000-7500 PLN',
      description_ua: 'Викладання англійської мови дітям та дорослим.',
      description_pl: 'Nauczanie języka angielskiego dzieci i dorosłych.',
      requirements_ua: ['Вища освіта', 'Англійська C1', 'Досвід викладання'],
      requirements_pl: ['Wykształcenie wyższe', 'Angielski C1', 'Doświadczenie w nauczaniu']
    }
  ],
  beauty: [
    {
      title_ua: 'Перукар',
      title_pl: 'Fryzjer',
      salary: '4500-7000 PLN',
      description_ua: 'Стрижки, укладки, фарбування волосся.',
      description_pl: 'Strzyżenie, układanie, farbowanie włosów.',
      requirements_ua: ['Кваліфікація', 'Досвід від 2 років', 'Креативність'],
      requirements_pl: ['Kwalifikacje', 'Doświadczenie min. 2 lata', 'Kreatywność']
    }
  ],
  security: [
    {
      title_ua: 'Охоронець',
      title_pl: 'Pracownik ochrony',
      salary: '4000-5500 PLN',
      description_ua: 'Охорона об\'єктів, контроль доступу.',
      description_pl: 'Ochrona obiektów, kontrola dostępu.',
      requirements_ua: ['Ліцензія охоронця', 'Відповідальність', 'Чесність'],
      requirements_pl: ['Licencja ochroniarza', 'Odpowiedzialność', 'Uczciwość']
    }
  ]
};

function generateJob(category, template, city, index) {
  const slug = `${city.slug}-${category}-${template.title_pl.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index}`;
  
  return {
    title: `${template.title_ua} — ${city.ua}`,
    title_pl: `${template.title_pl} — ${city.pl}`,
    city: city.ua,
    city_pl: city.pl,
    slug: slug,
    category: category,
    excerpt: `${template.description_ua} Зарплата: ${template.salary}`,
    excerpt_pl: `${template.description_pl} Wynagrodzenie: ${template.salary}`,
    body: `<h3>${template.title_ua} в місті ${city.ua}</h3><p>${template.description_ua}</p><h3>Обов'язки</h3><p>Виконання професійних обов'язків згідно посадової інструкції, дотримання стандартів компанії.</p><h3>Вимоги</h3><ul>${template.requirements_ua.map(r => `<li>${r}</li>`).join('')}</ul><h3>Умови</h3><ul><li><strong>Зарплата:</strong> ${template.salary}</li><li><strong>Контракт:</strong> Umowa o pracę або Umowa zlecenie</li><li><strong>Графік:</strong> 5/2 або змінний</li><li><strong>Бонуси:</strong> за досягнення</li></ul><p>Працевлаштування легальне, підтримка для українців.</p><a href="/apply.html" class="btn btn-primary">Подати заявку</a>`,
    body_pl: `<h3>${template.title_pl} w mieście ${city.pl}</h3><p>${template.description_pl}</p><h3>Obowiązki</h3><p>Wykonywanie obowiązków zawodowych zgodnie z instrukcją, przestrzeganie standardów firmy.</p><h3>Wymagania</h3><ul>${template.requirements_pl.map(r => `<li>${r}</li>`).join('')}</ul><h3>Oferujemy</h3><ul><li><strong>Wynagrodzenie:</strong> ${template.salary}</li><li><strong>Umowa:</strong> Umowa o pracę lub Umowa zlecenie</li><li><strong>Grafik:</strong> 5/2 lub zmianowy</li><li><strong>Premie:</strong> za osiągnięcia</li></ul><p>Legalne zatrudnienie, wsparcie dla Ukraińców.</p><a href="/apply.html" class="btn btn-primary">Aplikuj</a>`,
    cta_text: "Подати заявку",
    cta_text_pl: "Aplikuj",
    cta_link: "/apply.html",
    country: "Poland",
    language: "uk",
    salary: template.salary,
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

console.log(`✅ Згенеровано ${jobs.length} вакансій`);
