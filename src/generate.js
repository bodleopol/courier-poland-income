import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC = path.join(__dirname);
const TEMPLATES = path.join(SRC, 'templates');
const DIST = path.join(process.cwd(), 'dist');
const POSTS_PER_PAGE = 20;

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
  }
};

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

function getViewCount(slug, seed) {
  const base = 15 + ((seed % 200) + (hashString(slug) % 300));
  const weekMultiplier = 1 + (Math.abs(Math.sin(seed * 0.1)) * 2);
  return Math.floor(base * weekMultiplier);
}

function getLastUpdated(slug) {
  const today = new Date('2026-02-06');
  const daysBehind = (hashString(slug) % 14) + 1;
  const updated = new Date(today);
  updated.setDate(updated.getDate() - daysBehind);
  return updated.toISOString().slice(0, 10);
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

function sanitizeStaticHtmlHead(html) {
  let out = String(html || '');

  // Remove placeholder verification tag (or any static verification tag). If token is supplied via env,
  // inject it later in the <head>.
  out = out.replace(/\s*<meta\s+name=["']google-site-verification["'][^>]*>\s*/gi, '\n');

  // Remove keywords meta (spammy / low-signal)
  out = out.replace(/\s*<meta\s+name=["']keywords["'][^>]*>\s*/gi, '\n');

  // Remove hreflang alternates. The site uses client-side toggles without separate locale URLs.
  out = out.replace(/\s*<link\s+rel=["']alternate["'][^>]*hreflang=["'][^"']+["'][^>]*>\s*/gi, '\n');

  // Remove apple-touch-icon link if we don't ship a PNG icon.
  out = out.replace(/\s*<link\s+rel=["']apple-touch-icon["'][^>]*>\s*/gi, '\n');

  // Ensure OG image reference doesn't 404.
  out = out.replace(/https:\/\/rybezh\.site\/og-image\.jpg/gi, 'https://rybezh.site/og-image.svg');
  out = out.replace(/\b\/og-image\.jpg\b/gi, '/og-image.svg');

  // If template had JPEG type declared, remove it (SVG is served as image/svg+xml).
  out = out.replace(/\s*<meta\s+property=["']og:image:type["'][^>]*>\s*/gi, '\n');

  // Inject verification meta if provided
  const verification = buildGoogleVerificationMeta();
  if (verification && /<head[^>]*>/i.test(out)) {
    out = out.replace(/<head[^>]*>/i, match => `${match}\n  ${verification}`);
  }

  return out;
}

function buildConditionsBlock(page, lang) {
  const isPl = lang === 'pl';
  const isGenerated = Boolean(page?.is_generated);
  const labels = isPl ? {
    title: 'Warunki',
    salary: 'Wynagrodzenie',
    contract: 'Umowa',
    schedule: 'Grafik',
    pattern: 'System',
    start: 'Start',
    bonuses: 'Bonusy',
    extra: 'Dodatkowe informacje',
    requirements: 'Wymagania'
  } : {
    title: 'Умови',
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
  const contract = isPl ? page.contract_pl : page.contract_ua;
  const schedule = isPl ? page.shift_pl : page.shift_ua;
  const pattern = isPl ? page.pattern_pl : page.pattern_ua;
  const start = isPl ? page.start_pl : page.start_ua;
  const bonusesList = Array.isArray(isPl ? page.offers_pl : page.offers_ua) ? (isPl ? page.offers_pl : page.offers_ua) : [];
  const extraList = Array.isArray(isPl ? page.details_pl : page.details_ua) ? (isPl ? page.details_pl : page.details_ua) : [];
  const requirementsList = Array.isArray(isPl ? page.requirements_pl : page.requirements_ua) ? (isPl ? page.requirements_pl : page.requirements_ua) : [];
  const housing = isPl ? page.housing_pl : page.housing_ua;
  const transport = isPl ? page.transport_pl : page.transport_ua;
  const workplace = isPl ? page.workplace_pl : page.workplace_ua;
  const team = isPl ? page.team_pl : page.team_ua;
  const onboarding = isPl ? page.onboarding_pl : page.onboarding_ua;
  const sector = isPl ? page.sector_pl : page.sector_ua;
  const equipment = isPl ? page.equipment_pl : page.equipment_ua;
  const physical = isPl ? page.physical_pl : page.physical_ua;
  const shiftStructure = isPl ? page.shift_structure_pl : page.shift_structure_ua;

  const bonuses = bonusesList.slice(0, 3).join(' • ');
  const extras = extraList.slice(0, 2).join(' • ');
  const requirements = requirementsList.slice(0, 3).join(' • ');

  const rows = [];
  if (salary) rows.push(`<li><strong>${labels.salary}:</strong> ${escapeHtml(salary)}</li>`);
  if (contract) rows.push(`<li><strong>${labels.contract}:</strong> ${escapeHtml(contract)}</li>`);
  if (schedule) rows.push(`<li><strong>${labels.schedule}:</strong> ${escapeHtml(schedule)}</li>`);
  if (pattern) rows.push(`<li><strong>${labels.pattern}:</strong> ${escapeHtml(pattern)}</li>`);
  if (start) rows.push(`<li><strong>${labels.start}:</strong> ${escapeHtml(start)}</li>`);
  if (bonuses) rows.push(`<li><strong>${labels.bonuses}:</strong> ${escapeHtml(bonuses)}</li>`);
  if (extras) rows.push(`<li><strong>${labels.extra}:</strong> ${escapeHtml(extras)}</li>`);
  if (requirements) rows.push(`<li><strong>${labels.requirements}:</strong> ${escapeHtml(requirements)}</li>`);
  if (housing) rows.push(`<li><strong>${isPl ? 'Zakwaterowanie' : 'Проживання'}:</strong> ${escapeHtml(housing)}</li>`);
  if (transport) rows.push(`<li><strong>${isPl ? 'Dojazd' : 'Транспорт'}:</strong> ${escapeHtml(transport)}</li>`);
  if (workplace) rows.push(`<li><strong>${isPl ? 'Typ obiektu' : 'Тип обʼєкта'}:</strong> ${escapeHtml(workplace)}</li>`);
  if (team) rows.push(`<li><strong>${isPl ? 'Zespół' : 'Команда'}:</strong> ${escapeHtml(team)}</li>`);
  if (onboarding) rows.push(`<li><strong>${isPl ? 'Onboarding' : 'Адаптація'}:</strong> ${escapeHtml(onboarding)}</li>`);
  if (sector) rows.push(`<li><strong>${isPl ? 'Sektor' : 'Сектор'}:</strong> ${escapeHtml(sector)}</li>`);
  if (equipment) rows.push(`<li><strong>${isPl ? 'Sprzęt' : 'Обладнання'}:</strong> ${escapeHtml(equipment)}</li>`);
  if (physical) rows.push(`<li><strong>${isPl ? 'Wymagania fizyczne' : 'Фізичні вимоги'}:</strong> ${escapeHtml(physical)}</li>`);
  if (shiftStructure) rows.push(`<li><strong>${isPl ? 'Struktura zmiany' : 'Структура зміни'}:</strong> ${escapeHtml(shiftStructure)}</li>`);

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

function buildJobHumanBlock(page, lang, variant = 'full') {
  const isPl = lang === 'pl';
  const seed = hashString(`${page?.slug || ''}:${lang}`);
  
  // Variant-based simplified version (for 'simple')
  if (variant === 'simple') {
    const checklist = pickList(JOB_CHECKLIST_POOL[lang] || JOB_CHECKLIST_POOL.ua, 3, seed + 17);
    const title = isPl ? 'Warto wiedzieć' : 'Варто знати';
    const checklistHtml = checklist.map(t => `<li>${escapeHtml(t)}</li>`).join('');
    
    return `
    <section class="job-human job-human--simple" aria-label="${escapeHtml(title)}">
      <h3 class="job-human__title">${escapeHtml(title)}</h3>
      <ul class="job-human__single-list">${checklistHtml}</ul>
    </section>
  `;
  }
  
  // Full version with 2 columns
  const checklist = pickList(JOB_CHECKLIST_POOL[lang] || JOB_CHECKLIST_POOL.ua, 4, seed + 17);
  const questions = pickList(JOB_QUESTIONS_POOL[lang] || JOB_QUESTIONS_POOL.ua, 3, seed + 29);

  const title = isPl ? 'Warto wiedzieć przed startem' : 'Що варто знати перед стартом';
  const leftTitle = isPl ? 'Lista kontrolna' : 'Чек-лист перевірки';
  const rightTitle = isPl ? 'Pytania do rekrutera' : 'Питання до рекрутера';
  const note = isPl
    ? 'Warunki mogą się różnić w zależności od projektu. Warto dopytać o szczegóły.'
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
  ]
};

function buildGeneratedNotice(page, lang) {
  if (!page?.is_generated) return '';
  const isPl = lang === 'pl';
  const variants = isPl ? NOTICE_VARIANTS.pl : NOTICE_VARIANTS.ua;
  const seed = hashString(`${page?.slug || ''}:notice`);
  const variant = variants[seed % variants.length];
  if (!variant) return ''; // some pages get no notice at all
  return `
    <div class="job-notice" role="note" aria-label="${escapeHtml(variant.title)}">
      <strong>${escapeHtml(variant.title)}</strong>
      <span>${escapeHtml(variant.body)}</span>
    </div>
  `;
}

async function build() {
  // clean dist to avoid stale files
  await fs.rm(DIST, { recursive: true, force: true }).catch(() => {});
  await fs.mkdir(DIST, { recursive: true });

  const contentPath = path.join(SRC, 'content.json');
  const contentRaw = await fs.readFile(contentPath, 'utf8');
  const pages = JSON.parse(contentRaw);

  // Write jobs data for client-side loading
  await fs.writeFile(path.join(DIST, 'jobs-data.json'), JSON.stringify(pages), 'utf8');

  // Load categories
  const categoriesPath = path.join(SRC, 'categories.json');
  let categories = [];
  try {
    categories = JSON.parse(await fs.readFile(categoriesPath, 'utf8'));
  } catch (e) {
    console.warn('No categories.json found, continuing without categories');
  }

  // Load blog posts
  const postsPath = path.join(SRC, 'posts.json');
  const posts = JSON.parse(await fs.readFile(postsPath, 'utf8').catch(() => '[]'));

  let pageTpl = await fs.readFile(path.join(TEMPLATES, 'page.html'), 'utf8');
  pageTpl = pageTpl.replace('{{GOOGLE_SITE_VERIFICATION_META}}', buildGoogleVerificationMeta());
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

  // Prepare dynamic translations for jobs
  const jobTranslations = {};
  pages.forEach(p => {
    jobTranslations[`job.${p.slug}.title`] = { ua: p.title, pl: p.title_pl || p.title };
    jobTranslations[`job.${p.slug}.meta_title`] = { ua: `${p.title} — Rybezh`, pl: `${p.title_pl || p.title} — Rybezh` };
    jobTranslations[`job.${p.slug}.excerpt`] = { ua: p.excerpt, pl: p.excerpt_pl || p.excerpt };
    jobTranslations[`job.${p.slug}.cta`] = { ua: p.cta_text || 'Подати заявку', pl: p.cta_text_pl || 'Złóż wniosek' };
  });

  // Prepare dynamic translations for blog
  posts.forEach(p => {
    const readMinutes = estimateReadingTime(p.body || '');
    jobTranslations[`blog.${p.slug}.title`] = { ua: p.title, pl: p.title_pl || p.title };
    jobTranslations[`blog.${p.slug}.meta_title`] = { ua: `${p.title} — Rybezh`, pl: `${p.title_pl || p.title} — Rybezh` };
    jobTranslations[`blog.${p.slug}.excerpt`] = { ua: p.excerpt, pl: p.excerpt_pl || p.excerpt };
    jobTranslations[`blog.${p.slug}.read_time`] = { ua: `${readMinutes} хв читання`, pl: `${readMinutes} min czytania` };
  });
  
  // Prepare script with injected translations
  const scriptWithData = I18N_SCRIPT
    .replace('__EXTRA_TRANSLATIONS__', JSON.stringify(jobTranslations))
    .replace('__CATEGORIES__', JSON.stringify(categories));

  // copy static pages
  const staticPages = ['apply.html', 'about.html', 'contact.html', 'privacy.html', 'terms.html', 'company.html', 'faq.html', '404.html'];
  for (const p of staticPages) {
    try {
      let pContent = await fs.readFile(path.join(SRC, p), 'utf8');
      pContent = sanitizeStaticHtmlHead(pContent);
      pContent = pContent.replace(/\$\{new Date\(\)\.getFullYear\(\)\}/g, String(new Date().getFullYear()));
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

  const links = [];
  for (const page of pages) {
    const tpl = pageTpl;
    const description = page.excerpt || page.description || '';
    const content = page.body || page.content || page.excerpt || '';
    const contentPl = page.body_pl || page.body || '';

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
    const humanUA = humanVariant ? buildJobHumanBlock(page, 'ua', humanVariant) : '';
    const humanPL = humanVariant ? buildJobHumanBlock(page, 'pl', humanVariant) : '';
    const noticeUA = buildGeneratedNotice(page, 'ua');
    const noticePL = buildGeneratedNotice(page, 'pl');

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
    const relatedVacancies = pages
      .filter(p => p.slug !== page.slug && p.is_generated && (
        (p.city === page.city && p.category !== page.category) ||
        (p.category === page.category && p.city !== page.city)
      ))
      .sort((a, b) => hashString(a.slug + page.slug) - hashString(b.slug + page.slug))
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
          <div class="related-grid">${relatedCards}</div>
        </div>`;
    }

    const dualContent = `
      <div class="job-page-layout">
        <div class="job-meta">
          <span class="tag">📍 ${escapeHtml(page.city)}</span>
          <span class="tag">📅 ${new Date().getFullYear()}</span>
        </div>
        <div data-lang-content="ua">${noticeUA}${content}${conditionsUA}${humanUA}</div>
        <div data-lang-content="pl" style="display:none">${noticePL}${contentPl}${conditionsPL}${humanPL}</div>
        ${relatedHtml}
        ${shareButtons}
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

    // Inject JobPosting structured data (only for verified, non-generated jobs)
    if (!page?.is_generated) {
      const jobPostingScript = jsonLdScript(buildJobPostingJsonLd(page));
      if (finalHtml.includes('</head>')) {
        finalHtml = finalHtml.replace('</head>', `${jobPostingScript}\n</head>`);
      }
    }

    // Generated vacancies should be indexed for organic traffic
    // Remove duplicate robots meta if template already has one
    if (page?.is_generated) {
      // Replace conservative "index, follow" with more specific directives
      finalHtml = finalHtml.replace(
        '<meta name="robots" content="index, follow">',
        '<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">'
      );
    }

    // Add specific styles for job pages
    const jobStyles = `
    <style>
      .job-page-layout { margin-top: 1rem; }
      .job-meta { margin-bottom: 1.5rem; display: flex; gap: 10px; }
      .job-meta .tag { background: #e0f2fe; color: #0369a1; padding: 4px 12px; border-radius: 99px; font-size: 0.9rem; font-weight: 500; }
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
    </style>`;

    // inject lang switcher and scripts before </body>
    if (finalHtml.includes('</body>')) {
      // add script
      finalHtml = finalHtml.replace('</body>', `${jobStyles}${scriptWithData}</body>`);
    } else {
      finalHtml += jobStyles + scriptWithData;
    }

    const outFile = path.join(DIST, `${page.slug}.html`);
    await fs.writeFile(outFile, finalHtml, 'utf8');
    links.push({ title: page.title, slug: page.slug, city: page.city || '', indexable: !page?.is_generated });
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
      return `
      <div class="blog-card">
        <div class="blog-icon">${p.image || '📝'}</div>
        <div class="blog-content">
          <div class="blog-meta-row">
            <div class="blog-date" data-format-date="${p.date}">${p.date}</div>
            <div class="blog-readtime" data-i18n="blog.${p.slug}.read_time">${readMinutes} хв читання</div>
          </div>
          <h3><a href="/post-${p.slug}.html" data-i18n="blog.${p.slug}.title">${escapeHtml(p.title)}</a></h3>
          <p data-i18n="blog.${p.slug}.excerpt">${escapeHtml(p.excerpt)}</p>
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

    let blogHtml = pageTpl
      .replace(/{{TITLE}}/g, `Блог${page > 1 ? ` (сторінка ${page})` : ''}`)
      .replace(/{{DESCRIPTION}}/g, 'Корисні статті про роботу в Польщі та кар\'єру')
      .replace(/{{CONTENT}}/g, blogIndexContent)
      .replace(/{{CANONICAL}}/g, canonicalUrl)
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
  
    if (blogHtml.includes('</body>')) blogHtml = blogHtml.replace('</body>', `${scriptWithData}</body>`);
    else blogHtml += scriptWithData;
    await fs.writeFile(path.join(DIST, blogFileName), blogHtml, 'utf8');
  }

  // Generate Blog Posts
  for (const post of posts) {
    const heroImageUrl = extractImageUrl(post.body) || extractImageUrl(post.image);
    const readMinutes = estimateReadingTime(post.body || '');
    const uaEnhanced = buildEnhancedPostContent(post, posts, categories, 'ua', readMinutes);
    const plEnhanced = buildEnhancedPostContent(post, posts, categories, 'pl', readMinutes);
    const postContent = `
      <div class="blog-post">
        <a href="/blog.html" class="back-link" data-i18n="blog.back">← До списку статей</a>
        <div class="post-meta">📅 <span data-format-date="${post.date}">${post.date}</span> · <span class="post-readtime" data-i18n="blog.${post.slug}.read_time">${readMinutes} хв читання</span></div>
        <div data-lang-content="ua">${uaEnhanced.html}</div>
        <div data-lang-content="pl" style="display:none">${plEnhanced.html}</div>
      </div>`;
    
    let postHtml = pageTpl
      .replace(/{{TITLE}}/g, escapeHtml(post.title))
      .replace(/{{DESCRIPTION}}/g, escapeHtml(post.excerpt))
      .replace(/{{CONTENT}}/g, postContent)
      .replace(/{{CANONICAL}}/g, `https://rybezh.site/post-${post.slug}.html`)
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

    // Inject BlogPosting structured data
    const blogPostingScript = jsonLdScript(buildBlogPostingJsonLd(post, heroImageUrl));
    if (postHtml.includes('</head>')) {
      postHtml = postHtml.replace('</head>', `${blogPostingScript}\n</head>`);
    }

    if (postHtml.includes('</body>')) postHtml = postHtml.replace('</body>', `${scriptWithData}</body>`);
    else postHtml += scriptWithData;
    await fs.writeFile(path.join(DIST, `post-${post.slug}.html`), postHtml, 'utf8');
  }

    // generate index
    const indexSrc = await fs.readFile(path.join(SRC, 'index.html'), 'utf8');
    const shuffledPages = shuffleArray([...pages]);
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

    if (indexHtml.includes('</head>')) {
      indexHtml = indexHtml.replace('</head>', `${dataScript}\n</head>`);
    } else {
      indexHtml = dataScript + indexHtml;
    }

    // inject i18n into index
    if (indexHtml.includes('</body>')) {
      indexHtml = indexHtml.replace('</body>', `${scriptWithData}</body>`);
    } else {
      indexHtml += scriptWithData;
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

      if (vacanciesHtml.includes('</head>')) {
        vacanciesHtml = vacanciesHtml.replace('</head>', `${vacanciesDataScript}\n</head>`);
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
      const robots = `# Robots.txt for rybezh.site - Job search platform in Poland
# All search engines are allowed to access all pages

User-agent: *
Allow: /

# Sitemaps
Sitemap: https://rybezh.site/sitemap.xml
Sitemap: https://rybezh.site/sitemap-index.xml
Sitemap: https://rybezh.site/sitemap-static.xml
Sitemap: https://rybezh.site/sitemap-vacancies.xml
Sitemap: https://rybezh.site/sitemap-blog.xml
`;
      await fs.writeFile(path.join(DIST, 'robots.txt'), robots, 'utf8');
    } catch (e) {}

    // write CNAME for GitHub Pages custom domain
    try {
      await fs.writeFile(path.join(DIST, 'CNAME'), 'rybezh.site', 'utf8');
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
          <p style="color: var(--color-secondary); margin: 0; font-size: 1rem;" data-i18n="home.stats.couriers.line1">Кандидатів скористалось</p>
          <p style="color: var(--color-secondary); margin: 0; font-size: 0.9rem;" data-i18n="home.stats.couriers.line2">нашими послугами</p>
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
      </div>
      <p style="text-align:center; margin-top:1rem; color:#64748b; font-size:0.9rem;" data-i18n="home.testimonials.note">*Досвід кандидатів може відрізнятися залежно від міста та роботодавця</p>
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
  
  const items = allPages.map(p => `  <url>
    <loc>${p.url}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>`;
}

function generateVacanciesSitemap(links) {
  const base = 'https://rybezh.site';
  const today = new Date().toISOString().split('T')[0];

  const items = links.map(l => `  <url>
    <loc>${base}/${l.slug}.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
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
  const match = String(html || '').match(/src="([^"]+)"/i);
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

function buildJobPostingJsonLd(page) {
  const now = new Date();
  const datePosted = toISODate(now);
  const validThrough = toISODate(addDays(now, 30));
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

  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: page.title || "Робота в Польщі",
    description,
    identifier: {
      '@type': 'PropertyValue',
      name: 'Rybezh',
      value: page.slug
    },
    datePosted,
    validThrough,
    employmentType: ['FULL_TIME', 'PART_TIME', 'TEMPORARY'],
    hiringOrganization: {
      '@type': 'Organization',
      name: 'Rybezh',
      url: 'https://rybezh.site',
      logo: 'https://rybezh.site/favicon.svg'
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
}

function buildBlogPostingJsonLd(post, imageUrl) {
  const url = `https://rybezh.site/post-${post.slug}.html`;
  const published = post.date ? toISODate(post.date) : toISODate(new Date());
  const modified = post.updated ? toISODate(post.updated) : published;
  const description = stripHtml(post.excerpt || '');

  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title || 'Blog',
    description,
    datePublished: published,
    dateModified: modified,
    author: {
      '@type': 'Organization',
      name: 'Rybezh'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Rybezh',
      logo: {
        '@type': 'ImageObject',
        url: 'https://rybezh.site/favicon.svg'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    }
  };

  if (imageUrl) {
    data.image = [imageUrl];
  }

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

  const bodySource = lang === 'pl' ? (post.body_pl || post.body || '') : (post.body || '');
  const body = humanizeBody(bodySource, lang === 'pl' ? (post.title_pl || post.title) : post.title, lang, seed + 5);

  const updatedDate = post.updated || post.date || new Date().toISOString().slice(0, 10);

  const relatedHtml = related.map(r => {
    const title = lang === 'pl' ? (r.title_pl || r.title) : r.title;
    return `<li><a href="/post-${escapeHtml(r.slug)}.html">${escapeHtml(title)}</a></li>`;
  }).join('');

  const author = SITE_AUTHOR[lang] || SITE_AUTHOR.ua;
  const readLabel = lang === 'pl' ? 'Czas czytania' : 'Час читання';
  const updatedLabel = lang === 'pl' ? 'Aktualizacja' : 'Оновлення';

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
        <div class="post-chip"><span>${readLabel}</span><strong>${readMinutes} ${lang === 'pl' ? 'min' : 'хв'}</strong></div>
        <div class="post-chip"><span>${updatedLabel}</span><strong data-format-date="${updatedDate}">${updatedDate}</strong></div>
      </div>
      <section class="post-section">
        ${body}
      </section>
      <section class="post-section post-related">
        <h3>${lang === 'pl' ? 'Powiązane artykuły' : 'Пов’язані статті'}</h3>
        <ul>${relatedHtml}</ul>
      </section>
    `,
    faqItems: []
  };
}

build().catch(err => {
  console.error(err);
  process.exit(1);
});
