import fs from 'fs';

const contentPath = 'src/content.json';
const indexPath = 'src/indexable-vacancies.json';

const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

const newVacancies = [
  {
    "slug": "poznan-production-operator-cnc-human-701",
    "category": "production",
    "city": "Познань",
    "city_pl": "Poznań",
    "title": "Operator maszyn CNC (frezarki) — Poznań",
    "title_pl": "Operator maszyn CNC (frezarki) — Poznań",
    "salary": "45 - 60 PLN/h brutto",
    "company": "TechStal Precision",
    "shift_ua": "Пн-Пт, 06:00-14:00, 14:00-22:00",
    "shift_pl": "Pn-Pt, 06:00-14:00, 14:00-22:00",
    "pattern_ua": "2 зміни",
    "pattern_pl": "2 zmiany",
    "start_ua": "Від зараз",
    "start_pl": "Od zaraz",
    "contract_ua": "Umowa o pracę",
    "contract_pl": "Umowa o pracę",
    "offers_pl": [
      "Stabilne zatrudnienie bezpośrednio pod firmę, bez agencji pośrednictwa.",
      "Premia produkcyjna do 15% wynagrodzenia zasadniczego za brak braków jakościowych.",
      "Dofinansowanie do posiłków w kantynie pracowniczej (obiad za 10 PLN).",
      "Prywatna opieka medyczna Medicover oraz karta Multisport po okresie próbnym."
    ],
    "tasks_pl": [
      "Obsługa frezarek CNC ze sterowaniem Fanuc i Heidenhain.",
      "Wprowadzanie drobnych korekt w programach obróbczych na podstawie rysunku technicznego.",
      "Kontrola jakości wykonanych detali przy użyciu suwmiarki, mikromierza i średnicówki.",
      "Dbanie o powierzone narzędzia pomiarowe i codzienna konserwacja maszyny."
    ],
    "details_pl": [
      "Hala produkcyjna jest nowoczesna, dobrze oświetlona i wentylowana (brak uciążliwego zapachu chłodziwa).",
      "Praca z detalami jednostkowymi i małoseryjnymi — brak monotonii.",
      "Wymagamy minimum 2 lat doświadczenia na podobnym stanowisku oraz umiejętności czytania rysunku technicznego.",
      "Nie zapewniamy zakwaterowania, oferta dla osób mieszkających w Poznaniu lub okolicach."
    ],
    "seo_title_pl": "Praca Operator CNC Poznań | Frezer | Umowa o Pracę",
    "meta_description_pl": "Szukasz pracy jako Operator CNC w Poznaniu? Zatrudnimy frezera (Fanuc/Heidenhain). Stawka do 60 PLN/h brutto, umowa o pracę bezpośrednio. Aplikuj!"
  },
  {
    "slug": "warsaw-agriculture-pracownik-szklarni-human-702",
    "category": "agriculture",
    "city": "Пясечно (біля Варшави)",
    "city_pl": "Piaseczno (k. Warszawy)",
    "title": "Працівник у сучасну теплицю (збір помідорів) — Пясечно",
    "title_pl": "Pracownik szklarni (zbiór pomidorów) — Piaseczno",
    "salary": "28 - 32 PLN/h brutto",
    "company": "GreenHouse Mazovia",
    "shift_ua": "Пн-Сб, 06:00-16:00",
    "shift_pl": "Pn-Sb, 06:00-16:00",
    "pattern_ua": "1 зміна, 10 годин",
    "pattern_pl": "1 zmiana, 10 godzin",
    "start_ua": "Протягом тижня",
    "start_pl": "W ciągu tygodnia",
    "contract_ua": "Umowa Zlecenie",
    "contract_pl": "Umowa Zlecenie",
    "offers_ua": [
      "Легальне працевлаштування з можливістю виготовлення Карти Побиту після 3 місяців.",
      "Надаємо житло в робочому хостелі (кімнати на 3-4 особи, вираховуємо 350 зл/місяць із зарплати).",
      "Безкоштовний доїзд від хостелу до теплиці фірмовим мікроавтобусом.",
      "Аванси до 400 злотих можливі вже після першого відпрацьованого тижня."
    ],
    "tasks_ua": [
      "Збір стиглих помідорів у спеціальні пластикові ящики (вага ящика до 10 кг).",
      "Обрізка сухого листя та догляд за саджанцями (робота на спеціальних візках).",
      "Сортування продукції за розміром та кольором перед відправкою на склад.",
      "Підтримання чистоти на своєму робочому місці в кінці зміни."
    ],
    "details_ua": [
      "Робота фізична, але в теплиці підтримується комфортна температура (близько 22-24 градусів).",
      "Знання польської мови не вимагається — бригадири розмовляють українською.",
      "Потрібна санітарна книжка (якщо немає — допомагаємо зробити за 2 дні, вартість 150 зл вираховується з першої зарплати).",
      "Беремо чоловіків, жінок та сімейні пари (для пар намагаємось виділяти окремі кімнати, але це залежить від наявності вільних місць)."
    ],
    "seo_title_ua": "Робота в теплиці біля Варшави | Збір помідорів | Житло",
    "meta_description_ua": "Легальна робота в Польщі без знання мови. Збір помідорів у сучасній теплиці (Пясечно). Зарплата до 32 зл/год, надаємо житло та доїзд. Сімейні пари."
  },
  {
    "slug": "gdansk-construction-welder-mig-mag-human-703",
    "category": "construction",
    "city": "Гданськ",
    "city_pl": "Gdańsk",
    "title": "Сварщик MIG/MAG (135/136) на судоверфь — Гданьск",
    "title_pl": "Spawacz MIG/MAG (135/136) na stocznię — Gdańsk",
    "salary": "45 - 55 PLN/h netto",
    "company": "Baltic Shipyard Services",
    "shift_ua": "Пн-Сб, 07:00-17:00",
    "shift_pl": "Pn-Sb, 07:00-17:00",
    "pattern_ua": "10 годин на день",
    "pattern_pl": "10 godzin dziennie",
    "start_ua": "Після проходження тестів",
    "start_pl": "Po zdaniu testów",
    "contract_ua": "Umowa Zlecenie / B2B",
    "contract_pl": "Umowa Zlecenie / B2B",
    "offers_ru": [
      "Высокая почасовая ставка чистыми на руки, зависящая от результатов сварочных проб (próbki).",
      "Компенсация за аренду собственного жилья в размере 600 PLN в месяц.",
      "Выдаем качественную огнеупорную спецодежду, маски с подачей воздуха (Speedglas) и новые краги.",
      "Помощь координатора в оформлении всех необходимых разрешений для работы на территории порта."
    ],
    "tasks_ru": [
      "Сварка корпусных конструкций и трубопроводов методом MIG/MAG (135/136) в пространственных положениях (PF, PC, PE).",
      "Подготовка кромок под сварку, зачистка швов болгаркой (szlifierka).",
      "Работа с техническим чертежом и сварочной документацией (WPS).",
      "Соблюдение строгих норм техники безопасности на судоверфи."
    ],
    "details_ru": [
      "Обязателен опыт работы сварщиком на судоверфи или тяжелом производстве от 3 лет.",
      "Необходимы действующие сертификаты DNV, PRS или TÜV (если просрочены — помогаем обновить после успешной сдачи тестов).",
      "Работа тяжелая, часто на высоте или в замкнутых пространствах (трюмах).",
      "Перед началом работы каждый кандидат сдает практический тест (сварка пластин с ультразвуковым контролем шва)."
    ],
    "seo_title_ru": "Работа сварщиком MIG/MAG в Гданьске | Судоверфь",
    "meta_description_ru": "Требуются опытные сварщики 135/136 на судоверфь в Гданьске. Ставка до 55 зл/час нетто. Компенсация жилья 600 PLN, выдаем маски с подачей воздуха."
  }
];

content.push(...newVacancies);
fs.writeFileSync(contentPath, JSON.stringify(content, null, 2));

newVacancies.forEach(v => {
  if (!index.includes(v.slug)) {
    index.push(v.slug);
  }
});
fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));

console.log('Added 3 new vacancies.');
