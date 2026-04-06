/**
 * Rybezh Site - Main JavaScript
 * Features: i18n, Cookie Banner, Dark Theme, Scroll to Top, Animations
 */

(function() {
  'use strict';

  const GSA_URL = 'https://script.google.com/macros/s/AKfycbyZIupzVZo3q5UDGVSBzEaw1vdKFJcaEyTh5iuMgBECdd7VWE4Hq7cZ1WNL6V6Jy1FdMg/exec';
  const GEO_URL = 'https://ipapi.co/json/';

  // ============================================
  // 1. TRANSLATIONS (i18n)
  // ============================================
  const translations = {
    'meta.title': { ua: 'Rybezh — Пошук роботи у Польщі', pl: 'Rybezh — Praca w Polsce', ru: 'Rybezh — Поиск работы в Польше' , en: 'Work in Poland for Ukrainians | Rybezh - Free Employment'},
    'meta.description': { ua: 'Актуальні вакансії в різних сферах по всій Польщі. Легальне працевлаштування та підтримка.', pl: 'Aktualne oferty pracy w różnych branżach w całej Polsce. Legalne zatrudnienie i wsparcie.', ru: 'Актуальные вакансии в разных сферах по всей Польше. Легальное трудоустройство и поддержка.' , en: 'Find your dream job in Poland! Free consultation, document assistance, and hundreds of verified vacancies from direct employers. Start working legally today.'},
    'brand.name': { ua: 'Rybezh', pl: 'Rybezh' , ru: "Rybezh" },
    'brand.tagline': { ua: 'rybezh.site — робота у Польщі для українців та поляків', pl: 'rybezh.site — praca w Polsce dla Ukraińców i Polaków', ru: 'rybezh.site — работа в Польше для украинцев и поляков' },
    'nav.home': { ua: 'Головна', pl: 'Strona główna', ru: 'Главная' , en: 'Home'},
    'nav.jobs': { ua: 'Вакансії', pl: 'Oferty pracy', ru: 'Вакансии' },
    'nav.categories': { ua: 'Категорії', pl: 'Kategorie', ru: 'Категории' },
    'nav.about': { ua: 'Про нас', pl: 'O nas', ru: 'О нас' , en: 'About Us'},
    'nav.blog': { ua: 'Блог', pl: 'Blog', ru: 'Блог' , en: 'Blog'},
    'nav.faq': { ua: 'FAQ', pl: 'FAQ', ru: 'FAQ' , en: 'FAQ'},
    'nav.rent': { ua: 'Оренда', pl: 'Wynajem', ru: 'Аренда', en: 'Rent'},
    'nav.contact': { ua: 'Контакти', pl: 'Kontakt', ru: 'Контакты' , en: 'Contact'},
    'nav.cta': { ua: 'Отримати консультацію', pl: 'Uzyskaj konsultację', ru: 'Получить консультацию' },
    'nav.apply': { ua: 'Подати заявку', pl: 'Złóż wniosek', ru: 'Подать заявку' },
    'nav.tools': { ua: '🛠️ Інструменти', pl: '🛠️ Narzędzia', ru: '🛠️ Инструменты' },
    'nav.tool.calc': { ua: '💰 Калькулятор зарплати', pl: '💰 Kalkulator wynagrodzenia', ru: '💰 Калькулятор зарплаты' },
    'nav.tool.calc.short': { ua: '💰 Калькулятор', pl: '💰 Kalkulator', ru: '💰 Калькулятор' },
    'nav.tool.cv': { ua: '📄 Генератор CV', pl: '📄 Generator CV', ru: '📄 Генератор CV' },
    'nav.tool.cv.short': { ua: '📄 Генератор CV', pl: '📄 Generator CV', ru: '📄 Генератор CV' },
    'nav.tool.redflag': { ua: '🚩 Перевірка вакансій', pl: '🚩 Sprawdzanie ofert', ru: '🚩 Проверка вакансий' },
    'nav.tool.map': { ua: '🗺️ Карта українців', pl: '🗺️ Mapa Ukraińców', ru: '🗺️ Карта русскоязычных' },
    'footer.tools': { ua: 'Інструменти', pl: 'Narzędzia', ru: 'Инструменты' },
    'footer.tool.calc': { ua: 'Калькулятор', pl: 'Kalkulator', ru: 'Калькулятор' },
    'footer.tool.cv': { ua: 'Генератор CV', pl: 'Generator CV', ru: 'Генератор CV' },
    'footer.tool.redflag': { ua: 'Перевірка вакансій', pl: 'Sprawdzanie ofert', ru: 'Проверка вакансий' },
    'footer.tool.map': { ua: 'Мапа українців', pl: 'Mapa Ukraińców', ru: 'Карта русскоязычных' },
    'hero.title': { ua: 'Знайдіть роботу в Польщі', pl: 'Znajdź pracę w Polsce', ru: 'Найдите работу в Польше' },
    'hero.lead': { ua: 'Актуальні вакансії в різних сферах по всій Польщі. Легальні умови та підтримка.', pl: 'Aktualne oferty w różnych branżach w całej Polsce. Legalne warunki i wsparcie.', ru: 'Актуальные вакансии в разных сферах по всей Польше. Легальные условия и поддержка.' },
    'human.home.title': { ua: 'По‑людськи про пошук роботи', pl: 'Prosto i uczciwie o pracy', ru: 'Просто о поиске работы' },
    'human.home.lead': { ua: 'Ми не обіцяємо «золоті гори». Наша задача — дати вам зрозумілі умови, реальні кроки і підтримку, якщо щось незрозуміло.', pl: 'Nie obiecujemy „złotych gór”. Chcemy dać jasne warunki, konkretne kroki i wsparcie, gdy coś jest niejasne.', ru: 'Мы не обещаем «золотые горы». Наша задача — дать вам понятные условия, реальные шаги и поддержку, если что-то непонятно.' },
    'human.home.i1.title': { ua: 'Що ви знайдете тут', pl: 'Co tu znajdziesz', ru: 'Что вы найдёте здесь' },
    'human.home.i1.li1': { ua: 'вакансії з описом задач простими словами', pl: 'oferty opisane prostym, zrozumiałym językiem', ru: 'вакансии с описанием задач простыми словами' },
    'human.home.i1.li2': { ua: 'пояснення по документах і старту роботи', pl: 'wyjaśnienia dotyczące dokumentów i rozpoczęcia pracy', ru: 'пояснения по документам и старту работы' },
    'human.home.i1.li3': { ua: 'контакт, щоб уточнити нюанси до виїзду', pl: 'kontakt, żeby wyjaśnić szczegóły przed wyjazdem', ru: 'контакт, чтобы уточнить нюансы до отъезда' },
    'human.home.i2.title': { ua: 'Як ми радимо обирати', pl: 'Jak radzimy wybierać', ru: 'Как мы советуем выбирать' },
    'human.home.i2.li1': { ua: 'дивіться на графік, тип договору і логістику', pl: 'zwróć uwagę na rozkład pracy, rodzaj umowy i transport', ru: 'смотрите на график, тип договора и логистику' },
    'human.home.i2.li2': { ua: 'питайте про житло/доїзд і перший день на об’єкті', pl: 'zapytaj o mieszkanie, dojazd i pierwszy dzień w pracy', ru: 'спрашивайте про жильё/дорогу и первый день на объекте'},
    'human.home.i2.li3': { ua: 'якщо щось «занадто гарно» — перевіряйте двічі', pl: 'jeśli coś jest „zbyt pięknie” — sprawdź dokładnie', ru: 'если что-то «слишком хорошо» — проверяйте дважды'},
    'human.vacancies.title': { ua: 'Як читати вакансії на Rybezh', pl: 'Jak czytać oferty na Rybezh', ru: 'Как читать вакансии на Rybezh' , en: 'Tips for Job Seekers'},
    'human.vacancies.lead': { ua: 'Ми стараємось писати без «води»: що робити, який графік, які документи і що з житлом/доїздом. Якщо бачите незрозумілий пункт — краще уточнити до старту.', pl: 'Staramy się pisać bez „lania wody”: co robić, jaki grafik, dokumenty i jak z mieszkaniem/dojazdem. Jeśli coś jest niejasne — lepiej dopytać przed rozpoczęciem.', ru: 'Мы стараемся писать без «воды»: что делать, какой график, какие документы и что с жильем/проездом. Если видите непонятный пункт — лучше уточнить перед стартом.' },
    'human.vacancies.li1': { ua: 'Фільтруйте за містом і категорією — так швидше знайдете адекватні варіанти.', pl: 'Filtruj po mieście i kategorii — szybciej znajdziesz odpowiednie oferty.', ru: 'Фильтруйте по городу и категории — так быстрее найдете адекватные варианты.' , en: 'Do not be afraid of lack of experience — many employers offer training.'},
    'human.vacancies.li2': { ua: 'Дивіться на режим роботи та перерви — вони часто важливіші за «гучні бонуси».', pl: 'Zwróć uwagę na tryb pracy i przerwy — często są ważniejsze niż „głośne bonusy”.', ru: 'Смотрите на режим работы и перерывы — они часто важнее «громких бонусов».' , en: 'Check the working hours and breaks — they often matter more than "loud bonuses".'},
    'human.vacancies.li3': { ua: 'Під кожну вакансію можна подати заявку — ми допоможемо уточнити деталі.', pl: 'Do każdej oferty możesz złożyć zgłoszenie — pomożemy wyjaśnić szczegóły.', ru: 'Под каждую вакансию можно подать заявку — мы поможем уточнить детали.' , en: 'You can apply for any vacancy — we will help clarify the details.'},
    'home.hero.title': { ua: '🚀 Робота мрії чекає тебе!', pl: '🚀 Praca marzeń czeka na Ciebie!', ru: '🚀 Работа мечты ждёт тебя!', en: '🚀 Your dream job awaits!'},
    'home.hero.subtitle': { ua: '<strong>Тисячі людей вже працюють</strong> у Польщі. 📌 Безкоштовна консультація, <strong>легальне працевлаштування</strong> та <strong>зручний пошук</strong>.', pl: '<strong>Tysiące osób już pracują</strong> w Polsce. 📌 Bezpłatna konsultacja, <strong>legalne zatrudnienie</strong> i <strong>wygodne wyszukiwanie</strong>.', ru: '<strong>Тысячи людей уже работают</strong> в Польше. 📌 Бесплатная консультация, <strong>легальное трудоустройство</strong> и <strong>удобный поиск</strong>.' , en: '<strong>Thousands are already working</strong> in Poland. 📌 Free consultation, <strong>legal employment</strong>, and an <strong>easy search process</strong>.'},
    'home.hero.cta_primary': { ua: 'Почати прямо зараз', pl: 'Zacznij teraz', ru: 'Начать прямо сейчас', en: 'Start Right Now'},
    'home.hero.cta_secondary': { ua: 'Переглянути вакансії', pl: 'Zobacz oferty', ru: 'Посмотреть вакансии', en: 'View Jobs'},
    'home.categories.title': { ua: 'Категорії вакансій', pl: 'Kategorie ofert pracy', ru: 'Категории вакансий', en: 'Job Categories'},
    'home.cities.title': { ua: 'Популярні міста', pl: 'Popularne miasta', ru: 'Популярные города', en: 'Popular Cities'},
    'home.latest.title': { ua: 'Нові вакансії', pl: 'Nowe oferty', ru: 'Новые вакансии', en: 'Latest Job Openings'},
    'home.latest.cta': { ua: 'Переглянути всі вакансії', pl: 'Zobacz wszystkie oferty', ru: 'Посмотреть все вакансии', en: 'View All Jobs'},
    'home.stats.title': { ua: '📊 Статистика успіху', pl: '📊 Statystyki sukcesu' , en: '📊 Success Statistics', ru: "📊 Статистика успіху" },
    'home.stats.candidates.line1': { ua: 'Кандидатів скористалось', pl: 'Kandydatów skorzystało' , en: 'Candidates used', ru: "Воспользовались платформой" },
    'home.stats.candidates.line2': { ua: 'нашою платформою', pl: 'z naszej platformy' , en: 'our platform', ru: "кандидатов" },
    'home.stats.partners.line1': { ua: 'Партнерських компаній', pl: 'Firm partnerskich' , en: 'Partner companies', ru: "Партнерских компаний" },
    'home.stats.partners.line2': { ua: 'у Польщі', pl: 'w Polsce' , en: 'in Poland', ru: "в Польше" },
    'home.stats.cities.line1': { ua: 'Міст із вакансіями', pl: 'Miast z ofertami' , en: 'Cities with jobs', ru: "Городов с вакансиями" },
    'home.stats.cities.line2': { ua: 'від Варшави до Гданська', pl: 'od Warszawy po Gdańsk' , en: 'from Warsaw to Gdansk', ru: "от Варшавы до Гданьска" },
    'home.stats.rating.line1': { ua: 'Рейтинг задоволення', pl: 'Ocena zadowolenia' , en: 'Satisfaction rating', ru: "Рейтинг удовлетворенности" },
    'home.stats.rating.line2': { ua: 'від кандидатів', pl: 'od kandydatów' , en: 'from candidates', ru: "от кандидатов" },
    'home.stats.note': { ua: '*Оцінки за внутрішнім опитуванням кандидатів', pl: '*Oceny z wewnętrznej ankiety kandydatów' , en: '*Ratings based on internal candidate surveys', ru: "*Оцінки за внутрішнім опитуванням кандидатів" },
    'home.testimonials.title': { ua: '💬 Що кажуть кандидати', pl: '💬 Co mówią kandydaci' , en: '💬 What Candidates Say', ru: "💬 Что говорят кандидаты" },
    'home.testimonials.t1.quote': { ua: '"Після консультації отримав чіткий план кроків і зрозумів, на що звертати увагу."', pl: '"Po konsultacji dostałem jasny plan kroków i wiedziałem, na co zwracać uwagę."' , en: '"After the consultation, I received a clear step-by-step plan and knew exactly what to look out for."', ru: "\"После консультации получил четкий план шагов и понял, на что обращать внимание.\"" },
    'home.testimonials.t1.name': { ua: 'Ігор К., Варшава', pl: 'Igor K., Warszawa' , en: 'Igor K., Warsaw', ru: "Игорь К., Варшава" },
    'home.testimonials.t1.role': { ua: 'Пакувальник, 6 міс. досвіду', pl: 'Pakowacz, 6 mies. doświadczenia' , en: 'Packer, 6 mos. experience', ru: "Упаковщик, 6 мес. опыта" },
    'home.testimonials.t2.quote': { ua: '"Умови виявилися близькими до опису, але деякі деталі довелося уточнити."', pl: '"Warunki były zbliżone do opisu, ale część szczegółów musiałem doprecyzować."' , en: '"The conditions were close to the description, but I had to clarify some details first."', ru: "\"Условия оказались близкими к описанию, но некоторые детали пришлось уточнить.\"" },
    'home.testimonials.t2.name': { ua: 'Максим В., Краків', pl: 'Maksym W., Kraków' , en: 'Maksym W., Krakow', ru: "Максим В., Краков" },
    'home.testimonials.t2.role': { ua: 'Працівник складу, 3 міс. досвіду', pl: 'Pracownik magazynu, 3 mies. doświadczenia' , en: 'Warehouse Worker, 3 mos. experience', ru: "Работник склада, 3 мес. опыта" },
    'home.testimonials.t3.quote': { ua: '"Графік підійшов, але спочатку було складно з логістикою — потім адаптувався."', pl: '"Grafik pasował, ale na początku logistyka była trudna — potem się dostosowałem."' , en: '"The schedule was a good fit, though logistics were tough at first — I adapted later."', ru: "\"График подошел, но сначала было сложно с логистикой — потом адаптировался.\"" },
    'home.testimonials.t3.name': { ua: 'Софія Л., Вроцлав', pl: 'Sofia L., Wrocław' , en: 'Sofia L., Wroclaw', ru: "София Л., Вроцлав" },
    'home.testimonials.t3.role': { ua: 'Студентка, 4 міс. досвіду', pl: 'Studentka, 4 mies. doświadczenia' , en: 'Student, 4 mos. experience', ru: "Студентка, 4 мес. опыта" },
    'home.testimonials.note': { ua: '*Досвід кандидатів може відрізнятися залежно від міста та роботодавця', pl: '*Doświadczenia kandydatów mogą się różnić w zależności od miasta i pracodawcy' , en: '*Candidate experiences may vary by city and employer', ru: "*Досвід кандидатів може відрізнятися залежно від міста та роботодавця" },
    'home.search.title': { ua: '🔍 Знайди роботу за містом:', pl: '🔍 Znajdź pracę według miasta:', ru: '🔍 Найди работу по городу:', en: '🔍 Find Jobs by City:'},
    'home.features.title': { ua: '✨ Більше ніж просто робота', pl: '✨ Więcej niż tylko praca', ru: '✨ Больше чем просто работа', en: '✨ More than just a job'},
    'home.features.f1.title': { ua: '💵 Прозорі умови', pl: '💵 Przejrzyste warunki', ru: '💵 Прозрачные условия', en: '💵 Transparent Conditions'},
    'home.features.f1.text': { ua: 'Чіткі вимоги, стабільні виплати', pl: 'Jasne wymagania, stabilne wypłaty', ru: 'Чёткие требования, стабильные выплаты', en: 'Clear requirements, stable payouts'},
    'home.features.f2.title': { ua: '⏰ Гнучкість', pl: '⏰ Elastyczność', ru: '⏰ Гибкость', en: '⏰ Flexibility'},
    'home.features.f2.text': { ua: 'Різні графіки та формати зайнятості', pl: 'Różne grafiki i formy zatrudnienia', ru: 'Разные графики и форматы занятости', en: 'Various schedules and employment formats'},
    'home.features.f3.title': { ua: '🤝 Підтримка', pl: '🤝 Wsparcie', ru: '🤝 Поддержка', en: '🤝 Dedicated Support'},
    'home.features.f3.text': { ua: 'Консультації з документів і працевлаштування', pl: 'Konsultacje dot. dokumentów i zatrudnienia', ru: 'Консультации по документам и трудоустройству', en: 'Consultations on paperwork and hiring'},
    'home.features.f4.title': { ua: '🔍 Зручний пошук', pl: '🔍 Wygodne wyszukiwanie', ru: '🔍 Удобный поиск', en: '🔍 Convenient Search'},
    'home.features.f4.text': { ua: 'Фільтри за містом, категорією, зарплатою', pl: 'Filtry według miasta, kategorii i wynagrodzenia', ru: 'Фильтры по городу, категории, зарплате', en: 'Filter by city, category, and salary'},
    'search.sr': { ua: 'Пошук', pl: 'Szukaj' , en: 'Search', ru: "Пошук" },
    'search.placeholder': { ua: 'Пошук за містом або типом роботи', pl: 'Szukaj według miasta lub rodzaju pracy', ru: 'Поиск по городу или типу работы' , en: 'Search by city or job type'},
    'search.button': { ua: 'Знайти', pl: 'Znajdź', ru: 'Найти' , en: 'Find'},
    'city.all': { ua: 'Всі міста', pl: 'Wszystkie miasta', ru: 'Все города' , en: 'All Cities'},
    'jobs.cta': { ua: 'Деталі', pl: 'Szczegóły', ru: 'Подробнее', en: 'Details'},
    'cta.heading': { ua: 'Потрібна допомога з оформленням?', pl: 'Potrzebujesz pomocy z dokumentami?', ru: 'Нужна помощь с оформлением?', en: 'Need help with paperwork?'},
    'cta.lead': { ua: 'Залиште заявку — ми допоможемо з документами та підбором роботи.', pl: 'Zostaw zgłoszenie — pomożemy z dokumentami i doborem pracy.', ru: 'Оставьте заявку — мы поможем с документами и подбором работы.', en: 'Leave a request — we\'ll assist you with the documents and help find the right job.'},
    'cta.ready': { ua: 'Готові почати?', pl: 'Gotowy, by zacząć?', ru: 'Готовы начать?' , en: 'Ready to start?'},
    'cta.sub': { ua: 'Отримайте консультацію та почніть заробляти вже сьогодні.', pl: 'Uzyskaj konsultację i zacznij zarabiać już dziś.', ru: 'Получите консультацию и начните зарабатывать уже сегодня.' , en: 'Get a consultation and start earning today.'},
    'cta.button': { ua: 'Подати заявку', pl: 'Złóż wniosek', ru: 'Подать заявку' , en: 'Apply'},
    'footer.rights': { ua: 'Всі права захищені.', pl: 'Wszelkie prawa zastrzeżone.', ru: 'Все права защищены.' , en: 'All rights reserved.'},
    'footer.privacy': { ua: 'Політика конфіденційності', pl: 'Polityka prywatności', ru: 'Политика конфиденциальности' , en: 'Privacy Policy'},
    'footer.terms': { ua: 'Умови користування', pl: 'Regulamin', ru: 'Условия использования' , en: 'Terms of Use'},
    'footer.company': { ua: 'Реквізити', pl: 'Dane firmy', ru: 'Реквизиты' , en: 'Company Details'},
    'footer.desc': { ua: 'Допомагаємо знайти роботу в Польщі та підібрати вакансію під ваш досвід. Підтримка 24/7.', pl: 'Pomagamy znaleźć pracę w Polsce i dobrać ofertę do doświadczenia. Wsparcie 24/7.', ru: 'Помогаем найти работу в Польше и подобрать вакансию под ваш опыт. Поддержка 24/7.', en: 'We help you find a job in Poland that matches your experience. 24/7 support.'},
    'footer.nav': { ua: 'Навігація', pl: 'Nawigacja', ru: 'Навигация' , en: 'Navigation'},
    'footer.rent': { ua: 'Оренда транспорту', pl: 'Wynajem pojazdów', ru: 'Аренда транспорта', en: 'Vehicle Rental'},
    'footer.jobs': { ua: 'Вакансії', pl: 'Oferty pracy', ru: 'Вакансии', en: 'Jobs'},
    'footer.contact': { ua: 'Контакти', pl: 'Kontakt', ru: 'Контакты' , en: 'Contact'},
    'footer.newsletter.title': { ua: 'Підписка', pl: 'Subskrypcja', ru: 'Подписка' , en: 'Subscribe'},
    'footer.newsletter.text': { ua: 'Нові вакансії та статті.', pl: 'Nowe oferty i artykuły.', ru: 'Новые вакансии и статьи.' , en: 'New jobs and articles.'},
    'footer.newsletter.placeholder': { ua: 'Ваш email', pl: 'Twój email', ru: 'Ваш email' , en: 'Your email'},
    'footer.newsletter.success': { ua: 'Дякуємо!', pl: 'Dziękujemy!', ru: 'Спасибо!' , en: 'Thank you!'},
    'calc.title': { ua: 'Калькулятор заробітку', pl: 'Kalkulator zarobków', ru: 'Калькулятор заработка', en: 'Salary Calculator'},
    'calc.hours': { ua: 'Годин на тиждень', pl: 'Godzin tygodniowo', ru: 'Часов в неделю', en: 'Hours per week'},
    'calc.rate': { ua: 'Ставка (PLN/год)', pl: 'Stawka (PLN/h)', ru: 'Ставка (PLN/час)', en: 'Rate (PLN/h)'},
    'calc.result': { ua: 'Ваш дохід на місяць:', pl: 'Twój dochód miesięczny:', ru: 'Ваш доход в месяц:', en: 'Your monthly income:'},
    'calc.note': { ua: '*приблизний розрахунок', pl: '*przybliżone obliczenia', ru: '*приблизительный расчёт', en: '*approximate calculation'},
    'label.telegram': { ua: 'Telegram', pl: 'Telegram', ru: 'Telegram', en: 'Telegram'},
    'label.email': { ua: 'Пошта', pl: 'Poczta', ru: 'Почта', en: 'Email'},
    'placeholder.name': { ua: 'Петро', pl: 'Piotr' , en: 'Peter', ru: "Петро" },
    'placeholder.contact': { ua: '+48 123 456 789 або contacts@rybezh.site', pl: '+48 123 456 789 lub contacts@rybezh.site' , en: '+48 123 456 789 or contacts@rybezh.site', ru: "+48 123 456 789 або contacts@rybezh.site" },
    'placeholder.city': { ua: 'Варшава, Краків...', pl: 'Warszawa, Kraków...' , en: 'Warsaw, Krakow...', ru: "Варшава, Краків..." },
    'placeholder.message': { ua: 'Додайте деталі', pl: 'Dodaj szczegóły' , en: 'Add details', ru: "Додайте деталі" },
    'placeholder.exp': { ua: 'Наприклад: 2 роки у сфері складу', pl: 'Na przykład: 2 lata w logistyce' , en: 'For example: 2 years in logistics', ru: "Наприклад: 2 роки у сфері складу" },
    'apply.meta_title': { ua: 'Подати заявку — Rybezh | Робота у Польщі', pl: 'Złóż wniosek — Rybezh | Praca w Polsce', ru: 'Подать заявку — Rybezh | Работа в Польше', en: 'Apply — Rybezh | Work in Poland'},
    'apply.meta_description': { ua: 'Заповніть форму для безкоштовної консультації щодо працевлаштування у Польщі. Підбір вакансій та підтримка.', pl: 'Wypełnij formularz bezpłatnej konsultacji dotyczącej pracy w Polsce. Dobór ofert i wsparcie.', ru: 'Заполните форму для бесплатной консультации по трудоустройству в Польше. Подбор вакансий и поддержка.', en: 'Fill out the form for a free consultation on employment in Poland. Job matching and support.'},
    'apply.title': { ua: 'Швидка заявка', pl: 'Szybka aplikacja', ru: 'Быстрая заявка', en: 'Quick Application'},
    'apply.intro': { ua: 'Кілька полів — і ми підберемо варіанти роботи та допоможемо з документами.', pl: 'Kilka pól — i dobierzemy oferty pracy oraz pomożemy z dokumentami.', ru: 'Несколько полей — и мы подберём варианты работы и поможем с документами.', en: 'A few fields — and we will match job options and help with documents.'},
    'label.name': { ua: "Ім'я", pl: 'Imię', ru: 'Имя', en: 'Name'},
    'label.contact': { ua: 'Телефон або email', pl: 'Telefon lub email', ru: 'Телефон или email', en: 'Phone or email'},
    'label.city': { ua: 'Місто', pl: 'Miasto', ru: 'Город', en: 'City'},
    'label.start': { ua: 'Готовий почати', pl: 'Gotowy do startu', ru: 'Готов начать', en: 'Ready to start'},
    'label.exp': { ua: 'Досвід (коротко)', pl: 'Doświadczenie (krótko)', ru: 'Опыт (кратко)', en: 'Experience (briefly)'},
    'label.message': { ua: 'Додаткова інформація', pl: 'Dodatkowe informacje', ru: 'Дополнительная информация'},
    'label.consent': { ua: 'Я погоджуюсь на обробку моїх контактних даних', pl: 'Wyrażam zgodę na przetwarzanie moich danych kontaktowych', ru: 'Я соглашаюсь на обработку моих контактных данных'},
    'btn.submit': { ua: 'Надіслати заявку', pl: 'Wyślij zgłoszenie', ru: 'Отправить заявку'},
    'btn.clear': { ua: 'Очистити', pl: 'Wyczyść', ru: 'Очистить'},
    'aside.help': { ua: 'Потрібна допомога?', pl: 'Potrzebujesz pomocy?', ru: 'Нужна помощь?'},
    'aside.text': { ua: 'Ми допомагаємо з документами, легалізацією та підбором вакансій. Заявки обробляємо протягом 24 годин.', pl: 'Pomagamy z dokumentami, legalizacją i doborem ofert. Zgłoszenia przetwarzamy w ciągu 24 godzin.' , ru: "Ми допомагаємо з документами, легалізацією та підбором вакансій. Заявки обробляємо протягом 24 годин." },
    'btn.back': { ua: 'Повернутись на головну', pl: 'Powrót na stronę główną', ru: 'Вернуться на главную' },
    'btn.all_vacancies': { ua: 'Всі вакансії', pl: 'Wszystkie oferty', ru: 'Все вакансии' },
    'aside.contacts': { ua: 'Контакти', pl: 'Kontakt', ru: 'Контакты'},
    'about.meta_title': { ua: 'Про нас — Rybezh | Пошук роботи у Польщі', pl: 'O nas — Rybezh | Praca w Polsce', ru: 'О нас — Rybezh | Поиск работы в Польше', en: 'About Us — Rybezh | Work in Poland'},
    'about.meta_description': { ua: 'Rybezh — ваш надійний партнер у пошуку роботи у Польщі. Допомагаємо з працевлаштуванням, документами та адаптацією.', pl: 'Rybezh to Twój zaufany partner w znalezieniu pracy w Polsce. Pomagamy w zatrudnieniu, dokumentach i adaptacji.', ru: 'Rybezh — ваш надёжный партнёр в поиске работы в Польше. Помогаем с трудоустройством, документами и адаптацией.', en: 'Learn more about Rybezh, our values, and how we help Ukrainians find reliable and legal jobs in Poland. Our story and mission.'},
    'about.title': { ua: 'Про нас', pl: 'O nas', ru: 'О нас', en: 'About Us'},
    'about.text': { ua: '<strong>Rybezh</strong> — це команда професіоналів, яка допомагає українцям та іноземцям знайти стабільну роботу у Польщі. Ми співпрацюємо з роботодавцями в різних сферах.', pl: '<strong>Rybezh</strong> to zespół profesjonalistów pomagający Ukraińcom i obcokrajowcom znaleźć stabilną pracę w Polsce. Współpracujemy z pracodawcami w różnych branżach.' , ru: "<strong>Rybezh</strong> — це команда професіоналів, яка допомагає українцям та іноземцям знайти стабільну роботу у Польщі. Ми співпрацюємо з роботодавцями в різних сферах." },
    'about.mission': { ua: 'Наша місія', pl: 'Nasza misja', ru: 'Наша миссия'},
    'about.mission_text': { ua: 'Ми прагнемо зробити процес працевлаштування за кордоном простим, прозорим та безпечним. Ми надаємо повний супровід: від першої консультації до підписання договору та виходу на першу зміну.', pl: 'Dążymy do tego, aby proces zatrudnienia za granicą był prosty, przejrzysty i bezpieczny. Zapewniamy pełne wsparcie: od pierwszej konsultacji po podpisanie umowy i pierwszą zmianę.' , en: 'To provide safe, legal, and comfortable employment for Ukrainians in Poland by connecting reliable employers with motivated candidates.', ru: "Мы стремимся сделать процесс трудоустройства за границей простым, прозрачным и безопасным. Мы предоставляем полное сопровождение: от первой консультации до подписания договора и выхода на первую смену." },
    'about.why': { ua: 'Чому обирають нас', pl: 'Dlaczego my', ru: 'Почему выбирают нас'},
    'about.why_text': { ua: 'Ми пропонуємо лише перевірені вакансії, допомагаємо з легалізацією та надаємо підтримку 24/7. З нами ви можете бути впевнені у своєму завтрашньому дні.', pl: 'Oferujemy tylko sprawdzone oferty pracy, pomagamy w legalizacji i zapewniamy wsparcie 24/7. Z nami możesz być pewny swojego jutra.' , ru: "Ми пропонуємо лише перевірені вакансії, допомагаємо з легалізацією та надаємо підтримку 24/7. З нами ви можете бути впевнені у своєму завтрашньому дні." },
    'about.advantages': { ua: 'Наші переваги', pl: 'Nasze zalety', ru: 'Наши преимущества'},
    'about.how_we_work': { ua: 'Як ми працюємо', pl: 'Jak pracujemy', ru: 'Как мы работаем'},
    'about.step1': { ua: '1️⃣ Консультація (Безкоштовно)', pl: '1️⃣ Konsultacja (Bezpłatnie)' , en: '1️⃣ Application & Consultation', ru: "1️⃣ Консультація (Безкоштовно)" },
    'about.step2': { ua: '2️⃣ Підбір вакансії', pl: '2️⃣ Dobór oferty pracy' , en: '2️⃣ Job Matching', ru: "2️⃣ Підбір вакансії" },
    'about.step3': { ua: '3️⃣ Оформлення документів', pl: '3️⃣ Formalizacja dokumentów' , en: '3️⃣ Paperwork', ru: "3️⃣ Оформлення документів" },
    'about.step4': { ua: '4️⃣ Початок роботи', pl: '4️⃣ Rozpoczęcie pracy' , en: '4️⃣ Moving & Adaptation', ru: "4️⃣ Початок роботи" },
    'about.contacts': { ua: 'Контакти', pl: 'Kontakt', ru: 'Контакты'},
    'about.ready': { ua: 'Готові до змін? 🚀', pl: 'Gotowi na zmiany? 🚀', ru: 'Готовы к переменам? 🚀'},
    'contact.meta_title': { ua: "Контакти — Rybezh | Зв'яжіться з нами", pl: 'Kontakt — Rybezh | Skontaktuj się z nami', ru: 'Контакты — Rybezh | Свяжитесь с нами', en: 'Contact Us — Rybezh'},
    'contact.meta_description': { ua: 'Зв’яжіться з нами для консультації щодо роботи у Польщі. Telegram, Email, підтримка.', pl: 'Skontaktuj się z nami w sprawie konsultacji dotyczącej pracy w Polsce. Telegram, email, wsparcie.', ru: 'Свяжитесь с нами для консультации по работе в Польше. Telegram, Email, поддержка.', en: 'Contact Rybezh. We are ready to answer your questions and help with employment in Poland.'},
    'contact.title': { ua: 'Контакти', pl: 'Kontakt', ru: 'Контакты', en: 'Contact Us'},
    'contact.text': { ua: "Маєте запитання? Зв'яжіться з нами будь-яким зручним способом.", pl: 'Masz pytania? Skontaktuj się z nami w dowolny wygodny sposób.' , ru: "Есть вопросы? Свяжитесь с нами любым удобным способом." },
    'contact.telegram': { ua: 'Написати в Telegram', pl: 'Napisz na Telegram', ru: 'Написать в Telegram'},
    'privacy.meta_title': { ua: 'Політика конфіденційності — Rybezh', pl: 'Polityka prywatności — Rybezh' , en: 'Privacy Policy — Rybezh', ru: "Политика конфиденциальности — Rybezh" },
    'privacy.meta_description': { ua: 'Політика конфіденційності Rybezh. Дізнайтеся, як ми обробляємо ваші дані та захищаємо вашу приватність.', pl: 'Polityka prywatności Rybezh. Dowiedz się, jak przetwarzamy Twoje dane i chronimy Twoją prywatność.' , en: 'Privacy policy and personal data processing rules at Rybezh.', ru: "Політика конфіденційності Rybezh. Дізнайтеся, як ми обробляємо ваші дані та захищаємо вашу приватність." },
    'company.meta_title': { ua: 'Реквізити — Rybezh', pl: 'Dane firmy — Rybezh' , en: 'Company Information — Rybezh', ru: "Реквізити — Rybezh" },
    'company.meta_description': { ua: 'Реквізити власника сайту, юридична інформація та контактні дані.', pl: 'Dane właściciela serwisu, informacje prawne i kontakt.' , en: 'Legal details and information about the company Rybezh.', ru: "Реквізити власника сайту, юридична інформація та контактні дані." },
    'company.title': { ua: 'Реквізити', pl: 'Dane firmy' , en: 'Company Information', ru: "Реквізити" },
    'privacy.title': { ua: 'Політика конфіденційності', pl: 'Polityka prywatności' , en: 'Privacy Policy', ru: "Политика конфиденциальности" },
    'privacy.text': { ua: "<h2>1. Загальні положення</h2><p>Ця Політика конфіденційності визначає порядок отримання, зберігання, обробки, використання і розкриття персональних даних користувача. Ми поважаємо вашу конфіденційність і зобов’язуємося захищати ваші персональні дані.</p><h2>2. Збір даних</h2><p>Ми можемо збирати наступні дані: ім'я, прізвище, номер телефону, адреса електронної пошти, місто проживання, інформація про досвід роботи. Ці дані надаються вами добровільно при заповненні форм на сайті.</p><h2>3. Використання даних</h2><p>Зібрані дані використовуються для: зв'язку з вами, надання консультацій щодо працевлаштування, підбору вакансій, покращення роботи нашого сервісу.</p><h2>4. Захист даних</h2><p>Ми вживаємо всіх необхідних технічних та організаційних заходів для захисту ваших даних від несанкціонованого доступу, втрати або зміни.</p><h2>5. Файли Cookie</h2><p>Наш сайт використовує файли cookie для покращення взаємодії з користувачем. Ви можете налаштувати свій браузер для відмови від cookie, але це може вплинути на функціональність сайту.</p><h2>6. Ваші права</h2><p>Ви маєте право на доступ до своїх даних, їх виправлення або видалення. Для цього зв’яжіться з нами через контактні дані на сайті.</p>", pl: "<h2>1. Postanowienia ogólne</h2><p>Niniejsza Polityka prywatności określa zasady gromadzenia, przechowywania, przetwarzania, wykorzystywania i ujawniania danych osobowych użytkownika. Szanujemy Twoją prywatność i zobowiązujemy się do ochrony Twoich danych osobowych.</p><h2>2. Gromadzenie danych</h2><p>Możemy gromadzić następujące dane: imię, nazwisko, numer telefonu, adres e-mail, miasto zamieszkania, informacje o doświadczeniu zawodowym. Dane te są podawane dobrowolnie podczas wypełniania formularzy na stronie.</p><h2>3. Wykorzystanie danych</h2><p>Zgromadzone dane są wykorzystywane do: kontaktu z Tobą, udzielania konsultacji w sprawie zatrudnienia, doboru ofert pracy, ulepszania działania naszego serwisu.</p><h2>4. Ochrona danych</h2><p>Podejmujemy wszelkie niezbędne środki techniczne i organizacyjne w celu ochrony Twoich danych przed nieautoryzowanym dostępem, utratą lub zmianą.</p><h2>5. Pliki Cookie</h2><p>Nasza strona używa plików cookie w celu poprawy doświadczeń użytkownika. Możesz skonfigurować swoją przeglądarkę, aby odrzucała pliki cookie, ale może to wpłynąć na funkcjonalność strony.</p><h2>6. Twoje prawa</h2><p>Masz prawo do dostępu do swoich danych, ich poprawiania lub usunięcia. W tym celu skontaktuj się z nami za pośrednictwem danych kontaktowych na stronie.</p>" , ru: "<h2>1. Общие положения</h2><p>Эта Политика конфиденциальности определяет порядок получения, хранения, обработки, использования и раскрытия персональных данных пользователя. Мы уважаем вашу конфиденциальность и обязуемся защищать ваши персональные данные.</p><h2>2. Сбор данных</h2><p>Мы можем собирать следующие данные: имя, фамилия, номер телефона, адрес электронной почты, город проживания, информация об опыте работы. Эти данные предоставляются вами добровольно при заполнении форм на сайте.</p><h2>3. Использование данных</h2><p>Собранные данные используются для: связи с вами, предоставления консультаций по трудоустройству, подбора вакансий, улучшения работы нашего сервиса.</p><h2>4. Защита данных</h2><p>Мы принимаем все необходимые технические и организационные меры для защиты ваших данных от несанкционированного доступа, потери или изменения.</p><h2>5. Файлы Cookie</h2><p>Наш сайт использует файлы cookie для улучшения взаимодействия с пользователем. Вы можете настроить свой браузер для отказа от cookie, но это может повлиять на функциональность сайта.</p><h2>6. Ваши права</h2><p>Вы имеете право на доступ к своим данным, их исправление или удаление. Для этого свяжитесь с нами через контактные данные на сайте.</p>" },
    'faq.meta_title': { ua: 'Часті запитання (FAQ) — Rybezh | Робота у Польщі', pl: 'Częste pytania (FAQ) — Rybezh | Praca w Polsce', ru: 'Частые вопросы (FAQ) — Rybezh | Работа в Польше', en: 'FAQ — Rybezh | Frequent Questions'},
    'faq.meta_description': { ua: 'Відповіді на поширені запитання про роботу у Польщі. Документи, графік, умови, підтримка.', pl: 'Odpowiedzi na najczęstsze pytania o pracę w Polsce. Dokumenty, grafik, warunki, wsparcie.', ru: 'Ответы на частые вопросы о работе в Польше. Документы, график, условия, поддержка.', en: 'Answers to frequently asked questions about working in Poland, documents, and housing.'},
    'faq.title': { ua: 'Часті запитання', pl: 'Częste pytania', ru: 'Частые вопросы', en: 'Frequently Asked Questions'},
    'faq.text': { ua: "<details><summary>Як швидко можна знайти роботу?</summary><p>Зазвичай перші пропозиції надходять протягом 1–3 днів після подачі заявки.</p></details><details><summary>Які документи потрібні?</summary><p>Найчастіше потрібні паспорт, віза або карта побиту, PESEL і банківський рахунок.</p></details><details><summary>Чи потрібен досвід?</summary><p>Не завжди. Для багатьох вакансій досвід не обов’язковий.</p></details><details><summary>Який графік?</summary><p>Є повна зайнятість, зміни та часткова зайнятість.</p></details>", pl: "<details><summary>Jak szybko można znaleźć pracę?</summary><p>Zwykle pierwsze oferty pojawiają się w ciągu 1–3 dni po zgłoszeniu.</p></details><details><summary>Jakie dokumenty są potrzebne?</summary><p>Najczęściej potrzebne są paszport, wiza lub karta pobytu, PESEL i konto bankowe.</p></details><details><summary>Czy wymagane jest doświadczenie?</summary><p>Nie zawsze. Wiele ofert nie wymaga doświadczenia.</p></details><details><summary>Jaki jest grafik?</summary><p>Dostępne są pełne etaty, zmiany i praca dorywcza.</p></details>" , ru: "<details><summary>Як швидко можна знайти роботу?</summary><p>Зазвичай перші пропозиції надходять протягом 1–3 днів після подачі заявки.</p></details><details><summary>Які документи потрібні?</summary><p>Найчастіше потрібні паспорт, віза або карта побиту, PESEL і банківський рахунок.</p></details><details><summary>Чи потрібен досвід?</summary><p>Не завжди. Для багатьох вакансій досвід не обов’язковий.</p></details><details><summary>Який графік?</summary><p>Є повна зайнятість, зміни та часткова зайнятість.</p></details>" },
    'cookie.banner.text': { ua: 'Ми використовуємо файли cookie для покращення вашого досвіду. Залишаючись на сайті, ви погоджуєтесь на їх використання.', pl: 'Używamy plików cookie, aby poprawić Twoje wrażenia. Pozostając na stronie, zgadzasz się na ich użycie.', ru: 'Мы используем файлы cookie для улучшения вашего опыта. Оставаясь на сайте, вы соглашаетесь на их использование.' },
    'cookie.banner.accept': { ua: 'Прийняти', pl: 'Akceptuj', ru: 'Принять' },
    'theme.light': { ua: 'Світла тема', pl: 'Jasny motyw', ru: 'Светлая тема', en: 'Light Theme'},
    'theme.dark': { ua: 'Темна тема', pl: 'Ciemny motyw', ru: 'Тёмная тема', en: 'Dark Theme'},
    'scroll.top': { ua: 'Вгору', pl: 'Do góry', ru: 'Наверх'},
    // Blog
    'blog.title': { ua: 'Блог Rybezh', pl: 'Blog Rybezh', ru: 'Блог Rybezh', en: 'Our Blog'},
    'blog.meta_title': { ua: 'Блог — Rybezh | Робота у Польщі', pl: 'Blog — Rybezh | Praca w Polsce', ru: 'Блог — Rybezh | Работа в Польше', en: 'Blog — Rybezh | Articles about Work in Poland'},
    'blog.meta_description': { ua: 'Корисні статті та поради про роботу у Польщі: документи, ринок праці, адаптація.', pl: 'Przydatne artykuły i porady o pracy w Polsce: dokumenty, rynek pracy, adaptacja.', ru: 'Полезные статьи и советы о работе в Польше: документы, рынок труда, адаптация.', en: 'Useful articles, tips, and news about living and working in Poland for Ukrainians.'},
    'blog.subtitle': { ua: 'Корисні статті та новини про роботу', pl: 'Przydatne artykuły i wiadomości o pracy', ru: 'Полезные статьи и новости о работе', en: 'Useful articles and news about working in Poland.'},
    'blog.search.title': { ua: '🔎 Пошук у блозі', pl: '🔎 Szukaj w blogu', ru: '🔎 Поиск в блоге'},
    'blog.search.placeholder': { ua: 'Пошук по темі або місту', pl: 'Szukaj po temacie lub mieście', ru: 'Поиск по теме или городу'},
    'blog.search.button': { ua: 'Знайти', pl: 'Szukaj', ru: 'Найти'},
    'blog.search.count': { ua: 'Знайдено статей:', pl: 'Znaleziono artykułów:', ru: 'Найдено статей:'},
    'blog.search.empty': { ua: 'Нічого не знайдено', pl: 'Brak wyników', ru: 'Ничего не найдено'},
    'blog.read_more': { ua: 'Читати далі →', pl: 'Czytaj więcej →', ru: 'Читать далее →', en: 'Read more'},
    'blog.back': { ua: '← До списку статей', pl: '← Do listy artykułów', ru: '← К списку статей'},
    'blog.pagination.prev': { ua: '← Назад', pl: '← Wstecz', ru: '← Назад'},
    'blog.pagination.next': { ua: 'Вперед →', pl: 'Dalej →', ru: 'Вперёд →'},
    'jobs.search.count': { ua: 'Знайдено вакансій:', pl: 'Znaleziono ofert:', ru: 'Найдено вакансий:'},
    'jobs.search.empty': { ua: 'Нічого не знайдено', pl: 'Brak wyników', ru: 'Ничего не найдено'},
    'vacancies.title': { ua: 'Всі вакансії', pl: 'Wszystkie oferty', ru: 'Все вакансии' },
    'vacancies.found': { ua: 'вакансій знайдено', pl: 'ofert znaleziono', ru: 'вакансий найдено' },
    'vacancies.meta_title': { ua: 'Всі вакансії — Rybezh', pl: 'Wszystkie oferty — Rybezh', ru: 'Все вакансии — Rybezh' },
    'vacancies.meta_description': { ua: 'Перегляньте всі актуальні вакансії в Польщі. Фільтри за містом, категорією та зарплатою.', pl: 'Zobacz wszystkie aktualne oferty pracy w Polsce. Filtry według miasta, kategorii i wynagrodzenia.', ru: 'Посмотрите все актуальные вакансии в Польше. Фильтры по городу, категории и зарплате.' },
    'filters.all_categories': { ua: 'Всі категорії', pl: 'Wszystkie kategorie', ru: 'Все категории' },
    'filters.salary_placeholder': { ua: 'Мін. зарплата (PLN)', pl: 'Min. wynagrodzenie (PLN)', ru: 'Мин. зарплата (PLN)' },
    'filters.proof75': { ua: 'Тільки з Proof ≥ 75', pl: 'Tylko z Proof ≥ 75', ru: 'Только с Proof ≥ 75' },
    'filters.reset': { ua: 'Скинути', pl: 'Resetuj', ru: 'Сбросить' },
    // Article template (legacy)
    'article.step1': { ua: 'Крок 1: Перевірте базові документи', pl: 'Krok 1: Sprawdź podstawowe dokumenty' , ru: "Крок 1: Перевірте базові документи" },
    'article.step2': { ua: 'Крок 2: Заповніть анкету на Rybezh', pl: 'Krok 2: Wypełnij formularz Rybezh' , ru: "Крок 2: Заповніть анкету на Rybezh" },
    'article.step3': { ua: 'Крок 3: Отримайте PESEL (за потреби)', pl: 'Krok 3: Uzyskaj PESEL (jeśli potrzebne)' , ru: "Крок 3: Отримайте PESEL (за потреби)" },
    'article.step4': { ua: 'Крок 4: Оберіть вакансії та надішліть заявки', pl: 'Krok 4: Wybierz oferty i wyślij zgłoszenia' , ru: "Крок 4: Оберіть вакансії та надішліть заявки" },
    'article.step5': { ua: 'Крок 5: Підготуйтеся до співбесіди', pl: 'Krok 5: Przygotuj się do rozmowy' , ru: "Крок 5: Підготуйтеся до співбесіди" },
    'article.step6': { ua: 'Крок 6: Пройдіть перший робочий день', pl: 'Krok 6: Przejdź pierwszy dzień pracy' , ru: "Крок 6: Пройдіть перший робочий день" },
    'article.step7': { ua: 'Крок 7: Уточніть графік виплат', pl: 'Krok 7: Ustal harmonogram wypłat' , ru: "Крок 7: Уточніть графік виплат" },
    'article.tip.routes': { ua: '📍 Обирайте вакансії з зручною логістикою', pl: '📍 Wybieraj oferty z wygodną logistyką' , ru: "📍 Обирайте вакансії з зручною логістикою" },
    'article.tip.quality': { ua: '⭐ Сфокусуйтеся на якості, а не швидкості', pl: '⭐ Skup się na jakości, nie na szybkości' , ru: "⭐ Сфокусируйтесь на качестве, а не на скорости" },
    'article.tip.phone': { ua: '📱 Тримайте зв’язок з роботодавцем', pl: '📱 Utrzymuj kontakt z pracodawcą' , ru: "📱 Тримайте зв’язок з роботодавцем" },
    'article.tip.transport': { ua: '🧭 Плануйте дорогу та графік', pl: '🧭 Planuj dojazd i grafik' , ru: "🧭 Планируйте дорогу и график" },
    'article.mistake.too_many': { ua: '❌ Подавати заявки без перевірки умов', pl: '❌ Wysyłać zgłoszenia bez sprawdzenia warunków' , ru: "❌ Подавати заявки без перевірки умов" },
    'article.mistake.communication': { ua: '❌ Ігнорувати базову польську', pl: '❌ Ignorować podstawowy polski' , ru: "❌ Ігнорувати базову польську" },
    'article.mistake.safety': { ua: '❌ Не читати договір до підпису', pl: '❌ Nie czytać umowy przed podpisaniem' , ru: "❌ Не читати договір до підпису" },
    'article.cta.title': { ua: 'Готові почати?', pl: 'Gotowy, by zacząć?' , ru: "Готові почати?" },
    'article.related': { ua: '📚 Читайте також:', pl: '📚 Zobacz też:' , ru: "📚 Читайте також:" },
    'article.main.title': { ua: 'Як почати роботу в Польщі за 3 дні', pl: 'Jak rozpocząć pracę w Polsce w 3 dni' , ru: "Як почати роботу в Польщі за 3 дні" },
    // Job article template
    'job.article.cta_title': { ua: 'Готові почати?', pl: 'Gotowy, by zacząć?' , ru: "Готові почати?" },
    'job.article.why': { ua: '💡 Чому саме ми?', pl: '💡 Dlaczego my?' , ru: "💡 Чому саме ми?" },
    // 404 Page
    '404.title': { ua: 'Сторінка не знайдена — Rybezh', pl: 'Strona nie znaleziona — Rybezh', ru: 'Страница не найдена — Rybezh'},
    '404.meta_description': { ua: 'Сторінка не знайдена. Поверніться на головну для пошуку роботи у Польщі.', pl: 'Strona nie została znaleziona. Wróć na stronę główną, aby znaleźć pracę w Polsce.', ru: 'Страница не найдена. Вернитесь на главную для поиска работы в Польше.'},
    '404.heading': { ua: 'Сторінка не знайдена', pl: 'Strona nie znaleziona', ru: 'Страница не найдена'},
    '404.message': { ua: 'На жаль, сторінка, яку ви шукаєте, не існує або була переміщена.', pl: 'Niestety, strona, której szukasz, nie istnieje lub została przeniesiona.', ru: 'К сожалению, страница, которую вы ищете, не существует или была перемещена.'},
    '404.home': { ua: 'Повернутись на головну', pl: 'Powrót na stronę główną', ru: 'Вернуться на главную'},
    '404.jobs': { ua: 'Переглянути вакансії', pl: 'Zobacz oferty pracy', ru: 'Посмотреть вакансии'},
    '404.contact': { ua: 'Зв\'язатися з нами', pl: 'Skontaktuj się z nami', ru: 'Связаться с нами'},
    '404.popular': { ua: 'Популярні розділи:', pl: 'Popularne sekcje:', ru: 'Популярные разделы:'},
    '404.link.jobs': { ua: '📋 Актуальні вакансії', pl: '📋 Aktualne oferty pracy', ru: '📋 Актуальные вакансии'},
    '404.link.blog': { ua: '📰 Корисні статті в блозі', pl: '📰 Przydatne artykuły w blogu', ru: '📰 Полезные статьи в блоге'},
    '404.link.apply': { ua: '✍️ Подати заявку на роботу', pl: '✍️ Złóż wniosek o pracę', ru: '✍️ Подать заявку на работу'},
    '404.link.faq': { ua: '❓ Часті запитання (FAQ)', pl: '❓ Często zadawane pytania (FAQ)', ru: '❓ Частые вопросы (FAQ)'},
    'share.title': { ua: 'Поділитися вакансією:', pl: 'Udostępnij ofertę:', ru: 'Поделиться вакансией:'},
    'footer.legal': { ua: 'Правова інформація', pl: 'Informacje prawne' , ru: "Правовая информация" },
    // Cities
    'city.warszawa': { ua: 'Варшава', pl: 'Warszawa', ru: 'Варшава' },
    'city.krakow': { ua: 'Краків', pl: 'Kraków', ru: 'Краков' },
    'city.gdansk': { ua: 'Гданськ', pl: 'Gdańsk', ru: 'Гданьск' },
    'city.wroclaw': { ua: 'Вроцлав', pl: 'Wrocław', ru: 'Вроцлав' },
    'rent.title': { ua: 'Оренда транспорту для роботи', pl: 'Wynajem transportu do pracy', ru: 'Аренда транспорта для работы', en: 'Transport rental for work'},
    'rent.subtitle': { ua: 'Реальний, економний транспорт для курʼєрів та таксі. Без прихованих платежів, повністю обслужений і готовий до роботи.', pl: 'Realny, ekonomiczny transport dla kurierów i taksówek. Bez ukrytych opłat, w pełni serwisowany i gotowy do pracy.', ru: 'Реальный, экономный транспорт для курьеров и такси. Без скрытых платежей, полностью обслужен и готов к работе.', en: 'Real, economical transport for couriers and taxis. No hidden fees, fully serviced and ready to work.'},
    'rent.fleet': { ua: 'Наш автопарк', pl: 'Nasza flota', ru: 'Наш автопарк', en: 'Our Fleet'},
    'rent.fleet.desc': { ua: 'Обирайте транспорт, який найкраще підходить для ваших потреб.', pl: 'Wybierz transport, który najlepiej odpowiada Twoim potrzebom.', ru: 'Выбирайте транспорт, который лучше всего подходит для ваших нужд.', en: 'Choose the transport that best suits your needs.'},
    'rent.bike': { ua: 'Гірський велосипед (Kross/Romet)', pl: 'Rower górski (Kross/Romet)', ru: 'Горный велосипед (Kross/Romet)', en: 'Mountain bike (Kross/Romet)'},
    'rent.bike.desc': { ua: 'Недорогий та витривалий гірський велосипед. Надійні гальма, посилена рама та хороша амортизація. Ідеально для старту в доставці (від 150 zł/тиждень). Економія на транспорті.', pl: 'Niedrogi i wytrzymały rower górski. Niezawodne hamulce, wzmocniona rama i dobra amortyzacja. Idealne na start w dostawach (od 150 zł/tydzień). Oszczędność na transporcie.', ru: 'Недорогой и выносливый горный велосипед. Надежные тормоза, усиленная рама и хорошая амортизация. Идеально для старта в доставке (от 150 zł/неделя). Экономия на транспорте.', en: 'Affordable and durable mountain bike. Reliable brakes, reinforced frame, and good suspension. Ideal for starting in delivery (from 150 zł/week). Savings on transport.'},
    'rent.ebike': { ua: 'Електровелосипед (E-bike)', pl: 'Rower elektryczny (E-bike)', ru: 'Электровелосипед (E-bike)', en: 'Electric bike (E-bike)'},
    'rent.ebike.desc': { ua: 'Швидкий та зручний електровелосипед із запасом ходу до 80 км. Ідеально для Glovo, Wolt, Uber Eats. Не потребує водійських прав. Дозволяє працювати довше і менше втомлюватись.', pl: 'Szybki i wygodny rower elektryczny o zasięgu do 80 km. Idealny do Glovo, Wolt, Uber Eats. Nie wymaga prawa jazdy. Pozwala pracować dłużej i mniej się męczyć.', ru: 'Быстрый и удобный электровелосипед с запасом хода до 80 км. Идеально для Glovo, Wolt, Uber Eats. Не требует водительских прав. Позволяет работать дольше и меньше уставать.', en: 'Fast and comfortable electric bike with a range of up to 80 km. Ideal for Glovo, Wolt, Uber Eats. No driver\'s license required. Allows you to work longer and get less tired.'},
    'rent.scooter': { ua: 'Скутер 50cc (Lifan/Barton)', pl: 'Skuter 50cc (Lifan/Barton)', ru: 'Скутер 50cc (Lifan/Barton)', en: 'Scooter 50cc (Lifan/Barton)'},
    'rent.scooter.desc': { ua: 'Недорогий скутер 50 куб.см з реальною витратою всього 2 л/100 км. Ідеальний маневрений варіант для роботи в Glovo/Wolt. Можна їздити з правами категорії B. Низькі витрати на обслуговування.', pl: 'Niedrogi skuter 50 cm3 o realnym spalaniu zaledwie 2 l/100 km. Idealna zwrotna opcja do pracy w Glovo/Wolt. Można jeździć z kategorią B. Niskie koszty utrzymania.', ru: 'Недорогой скутер 50 куб.см с реальным расходом всего 2 л/100 км. Идеальный маневренный вариант для работы в Glovo/Wolt. Можно ездить с категорией B. Низкие затраты на обслуживание.', en: 'Affordable 50cc scooter with real consumption of only 2 l/100 km. Ideal maneuverable option for working in Glovo/Wolt. Can be driven with category B. Low maintenance costs.'},
    'rent.moto': { ua: 'Мотоцикл 125cc (Yamaha/Bajaj)', pl: 'Motocykl 125cc (Yamaha/Bajaj)', ru: 'Мотоцикл 125cc (Yamaha/Bajaj)', en: 'Motorcycle 125cc (Yamaha/Bajaj)'},
    'rent.moto.desc': { ua: 'Надійна техніка 125 куб.см для швидкої доставки. Дуже економний варіант: реальна витрата 2.5 л/100 км. Потрібні права B (від 3 років) або A. Ідеально для заторів.', pl: 'Niezawodny sprzęt 125 cm3 do szybkich dostaw. Bardzo ekonomiczna opcja: realne spalanie 2.5 l/100 km. Wymagane prawo jazdy kat. B (min. 3 lata) lub A. Idealny na korki.', ru: 'Надежная техника 125 куб.см для быстрой доставки. Очень экономный вариант: реальный расход 2.5 л/100 км. Нужны права B (от 3 лет) или A. Идеально для пробок.', en: 'Reliable 125cc equipment for fast delivery. Very economical option: real consumption 2.5 l/100 km. B (from 3 years) or A license required. Ideal for traffic jams.'},
    'rent.car': { ua: 'Kia Soluto 2026 на газу (LPG)', pl: 'Kia Soluto 2026 na gaz (LPG)', ru: 'Kia Soluto 2026 на газу (LPG)', en: 'Kia Soluto 2026 on gas (LPG)'},
    'rent.car.desc': { ua: 'Сучасне економне авто 2026 року з ГБО. Реальна витрата газу 7-8 л/100 км (дуже дешево у місті). Повністю підготовлене для роботи в таксі (Bolt, Uber) та доставці.', pl: 'Nowoczesne, ekonomiczne auto z 2026 roku z instalacją LPG. Realne spalanie gazu 7-8 l/100 km (bardzo tanio w mieście). W pełni przygotowane do pracy jako taksówka (Bolt, Uber) i w dostawach.', ru: 'Современное экономное авто 2026 года с ГБО. Реальный расход газа 7-8 л/100 км (очень дешево в городе). Полностью подготовлено для работы в такси (Bolt, Uber) и доставке.', en: 'Modern, economical 2026 car with LPG. Real gas consumption 7-8 l/100 km (very cheap in the city). Fully prepared for taxi work (Bolt, Uber) and delivery.'},
    'rent.legal.title': { ua: 'Юридична інформація', pl: 'Informacje prawne', ru: 'Юридическая информация', en: 'Legal Information'},
    'rent.legal.desc': { ua: 'Всі транспортні засоби здаються в оренду на підставі офіційного договору. Транспорт застрахований, регулярно проходить технічне обслуговування. Орендар несе відповідальність за дотримання ПДР та своєчасну оплату оренди. Детальні умови обговорюються при підписанні договору.', pl: 'Wszystkie pojazdy wynajmowane są na podstawie oficjalnej umowy. Transport jest ubezpieczony i regularnie serwisowany. Najemca ponosi odpowiedzialność za przestrzeganie przepisów ruchu drogowego i terminowe płacenie czynszu. Szczegółowe warunki omawiane są przy podpisywaniu umowy.', ru: 'Все транспортные средства сдаются в аренду на основании официального договора. Транспорт застрахован, регулярно проходит техническое обслуживание. Арендатор несет ответственность за соблюдение ПДД и своевременную оплату аренды. Детальные условия обсуждаются при подписании договора.', en: 'All vehicles are rented on the basis of an official contract. Transport is insured and regularly maintained. The tenant is responsible for complying with traffic rules and paying rent on time. Detailed conditions are discussed when signing the contract.'},
    'rent.contact.title': { ua: 'Залишити заявку', pl: 'Zostaw wniosek', ru: 'Оставить заявку', en: 'Leave a request'},
    'rent.form.name': { ua: 'Ваше ім\'я', pl: 'Twoje imię', ru: 'Ваше имя', en: 'Your name'},
    'rent.form.phone': { ua: 'Телефон', pl: 'Telefon', ru: 'Телефон', en: 'Phone'},
    'rent.form.vehicle': { ua: 'Оберіть транспорт', pl: 'Wybierz transport', ru: 'Выберите транспорт', en: 'Select transport'},
    'rent.form.submit': { ua: 'Відправити заявку', pl: 'Wyślij wniosek', ru: 'Отправить заявку', en: 'Submit request'},
    'rent.faq.title': { ua: 'FAQ: ПДР та доставка в Польщі', pl: 'FAQ: Przepisy drogowe i dostawy w Polsce', ru: 'FAQ: ПДД и доставка в Польше', en: 'FAQ: Traffic rules and delivery in Poland'},
    'rent.faq.q1': { ua: 'Чи потрібні водійські права для скутера (до 50 куб.см)?', pl: 'Czy potrzebne jest prawo jazdy na skuter (do 50 cm3)?', ru: 'Нужны ли водительские права для скутера (до 50 куб.см)?', en: "Do I need a driver's license for a scooter (up to 50cc)?"},
    'rent.faq.a1': { ua: 'У Польщі для керування скутером або мопедом до 50 куб.см необхідні права категорії AM (або будь-якої вищої, наприклад, B). Особи, які досягли 18-річного віку до 19 січня 2013 року, можуть керувати ними на підставі посвідчення особи.', pl: 'W Polsce do prowadzenia skutera lub motoroweru do 50 cm3 wymagane jest prawo jazdy kat. AM (lub wyższej, np. B). Osoby, które ukończyły 18 lat przed 19 stycznia 2013 r., mogą nimi kierować na podstawie dowodu osobistego.', ru: 'В Польше для управления скутером или мопедом до 50 куб.см требуются права категории AM (или любой более высокой, например, B). Лица, достигшие 18-летнего возраста до 19 января 2013 года, могут управлять ими на основании удостоверения личности.', en: 'In Poland, to drive a scooter or moped up to 50cc, you need an AM category license (or any higher, e.g., B). Persons who turned 18 before January 19, 2013, can drive them based on their ID card.'},
    'rent.faq.q2': { ua: 'Які правила для мотоциклів 125 куб.см?', pl: 'Jakie są zasady dla motocykli 125 cm3?', ru: 'Какие правила для мотоциклов 125 куб.см?', en: 'What are the rules for 125cc motorcycles?'},
    'rent.faq.a2': { ua: "Маючи права категорії B щонайменше 3 роки, ви можете керувати мотоциклом з об'ємом двигуна до 125 куб.см без необхідності отримувати категорію A.", pl: 'Posiadając prawo jazdy kat. B od co najmniej 3 lat, można kierować motocyklem o pojemności silnika do 125 cm3 bez konieczności wyrabiania kat. A.', ru: 'Имея права категории B не менее 3 лет, вы можете управлять мотоциклом с объемом двигателя до 125 куб.см без необходимости получать категорию A.', en: 'Having a category B license for at least 3 years, you can drive a motorcycle with an engine capacity of up to 125cc without having to obtain an A category.'},
    'rent.faq.q3': { ua: 'Які швидкісні обмеження для електросамокатів?', pl: 'Jakie są ograniczenia prędkości dla hulajnóg elektrycznych?', ru: 'Какие ограничения скорости для электросамокатов?', en: 'What are the speed limits for electric scooters?'},
    'rent.faq.a3': { ua: 'Максимальна дозволена швидкість для електросамокатів на велосипедних доріжках та дорогах становить 20 км/год. На тротуарах необхідно рухатися зі швидкістю пішохода.', pl: 'Maksymalna dopuszczalna prędkość dla hulajnóg elektrycznych na ścieżkach rowerowych i jezdniach wynosi 20 km/h. Na chodnikach należy poruszać się z prędkością pieszego.', ru: 'Максимальная разрешенная скорость для электросамокатов на велосипедных дорожках и дорогах составляет 20 км/ч. На тротуарах необходимо двигаться со скоростью пешехода.', en: 'The maximum allowed speed for electric scooters on bicycle paths and roads is 20 km/h. On sidewalks, you must move at pedestrian speed.'},
    'rent.faq.q4': { ua: 'Чи можна їздити велосипедом по тротуару?', pl: 'Czy można jeździć rowerem po chodniku?', ru: 'Можно ли ездить на велосипеде по тротуару?', en: 'Can I ride a bicycle on the sidewalk?'},
    'rent.faq.a4': { ua: 'Їзда на велосипеді по тротуару заборонена, за винятком випадків, коли: ви супроводжуєте дитину до 10 років на велосипеді; ширина тротуару більше 2 метрів, а обмеження швидкості на дорозі більше 50 км/год; або за поганих погодних умов.', pl: 'Jazda rowerem po chodniku jest zabroniona, z wyjątkiem sytuacji, gdy: opiekujesz się dzieckiem do lat 10 na rowerze; chodnik ma ponad 2 metry szerokości, a ograniczenie na drodze przekracza 50 km/h; lub w czasie złych warunków pogodowych.', ru: 'Езда на велосипеде по тротуару запрещена, за исключением случаев, когда: вы сопровождаете ребенка до 10 лет на велосипеде; ширина тротуара более 2 метров, а ограничение скорости на дороге более 50 км/ч; или при плохих погодных условиях.', en: 'Riding a bicycle on the sidewalk is prohibited, except when: you accompany a child under 10 on a bicycle; the sidewalk is over 2 meters wide and the road speed limit exceeds 50 km/h; or during bad weather conditions.'},
    'city.poznan': { ua: 'Познань', pl: 'Poznań', ru: 'Познань' },
    'city.lodz': { ua: 'Лодзь', pl: 'Łódź', ru: 'Лодзь' },
    'city.katowice': { ua: 'Катовіце', pl: 'Katowice', ru: 'Катовице' },
    'city.szczecin': { ua: 'Щецін', pl: 'Szczecin', ru: 'Щецин' },
    'city.lublin': { ua: 'Люблін', pl: 'Lublin', ru: 'Люблин' },
    'city.bialystok': { ua: 'Білосток', pl: 'Białystok', ru: 'Белосток' },
    'city.bydgoszcz': { ua: 'Бидгощ', pl: 'Bydgoszcz', ru: 'Быдгощ' },
    'city.rzeszow': { ua: 'Жешув', pl: 'Rzeszów', ru: 'Жешув' },
    'city.torun': { ua: 'Торунь', pl: 'Toruń', ru: 'Торунь' },
    'city.czestochowa': { ua: 'Ченстохова', pl: 'Częstochowa', ru: 'Ченстохова' },
    'city.radom': { ua: 'Радом', pl: 'Radom', ru: 'Радом' },
    'city.sosnowiec': { ua: 'Сосновець', pl: 'Sosnowiec', ru: 'Сосновец' },
    'city.kielce': { ua: 'Кельце', pl: 'Kielce', ru: 'Кельце' },
    'city.gliwice': { ua: 'Гливіце', pl: 'Gliwice', ru: 'Гливице' },
    'city.olsztyn': { ua: 'Ольштин', pl: 'Olsztyn', ru: 'Ольштын' },
    'city.bielsko': { ua: 'Бєльско-Бяла', pl: 'Bielsko-Biała', ru: 'Бельско-Бяла' },
    'city.plock': { ua: 'Плоцьк', pl: 'Płock', ru: 'Плоцк' },
    'city.gdynia': { ua: 'Гдиня', pl: 'Gdynia', ru: 'Гдыня' },
    'city.all': { ua: 'Всі міста', pl: 'Wszystkie miasta', ru: 'Все города' , en: 'All Cities'},

    // For Employers page
    'nav.employers': { ua: 'Для роботодавців', pl: 'Dla pracodawców' , en: 'For Employers', ru: "Для работодателей" },
    'emp.meta_title': { ua: 'Для роботодавців — Rybezh | Опублікуйте вакансію', pl: 'Dla pracodawców — Rybezh | Opublikuj ofertę' , en: 'For Employers — Rybezh | Recruitment in Poland', ru: "Для роботодавців — Rybezh | Опублікуйте вакансію" },
    'emp.meta_description': { ua: 'Розмістіть вакансію безкоштовно і знайдіть надійних українських працівників у Польщі. Без посередників, швидко та зручно.', pl: 'Opublikuj ofertę za darmo i znajdź rzetelnych ukraińskich pracowników w Polsce. Bez pośredników, szybko i wygodnie.' , en: 'Looking for employees? Rybezh offers fast and high-quality staff recruitment for your business in Poland.', ru: "Розмістіть вакансію безкоштовно і знайдіть надійних українських працівників у Польщі. Без посередників, швидко та зручно." },
    'emp.title': { ua: 'Знайдіть надійних працівників з України', pl: 'Znajdź rzetelnych pracowników z Ukrainy' , en: 'For Employers', ru: "Знайдіть надійних працівників з України" },
    'emp.subtitle': { ua: 'Розмістіть вакансію безкоштовно та отримайте відгуки від мотивованих кандидатів протягом 24 годин', pl: 'Opublikuj ofertę za darmo i otrzymaj zgłoszenia od zmotywowanych kandydatów w ciągu 24 godzin' , en: 'Fast and reliable staff recruitment for your business.', ru: "Розмістіть вакансію безкоштовно та отримайте відгуки від мотивованих кандидатів протягом 24 годин" },
    'emp.b1.title': { ua: '🎯 Цільова аудиторія', pl: '🎯 Grupa docelowa' , ru: "🎯 Целевая аудитория" },
    'emp.b1.text': { ua: 'Вашу вакансію побачать тисячі українців, які активно шукають роботу в Польщі', pl: 'Twoją ofertę zobaczą tysiące Ukraińców aktywnie szukających pracy w Polsce' , ru: "Вашу вакансію побачать тисячі українців, які активно шукають роботу в Польщі" },
    'emp.b2.title': { ua: '⚡ Швидкий результат', pl: '⚡ Szybki rezultat' , ru: "⚡ Швидкий результат" },
    'emp.b2.text': { ua: 'Перші відгуки отримаєте протягом 24 годин після розміщення вакансії', pl: 'Pierwsze zgłoszenia otrzymasz w ciągu 24 godzin od publikacji oferty' , ru: "Перші відгуки отримаєте протягом 24 годин після розміщення вакансії" },
    'emp.b3.title': { ua: '💰 Безкоштовно', pl: '💰 Bezpłatnie' , ru: "💰 Безкоштовно" },
    'emp.b3.text': { ua: 'Розміщення вакансій повністю безкоштовне. Без прихованих платежів та комісій', pl: 'Publikacja ofert jest całkowicie bezpłatna. Bez ukrytych opłat i prowizji' , ru: "Розміщення вакансій повністю безкоштовне. Без прихованих платежів та комісій" },
    'emp.b4.title': { ua: '🤝 Без посередників', pl: '🤝 Bez pośredników' , ru: "🤝 Без посредников" },
    'emp.b4.text': { ua: 'Прямий зв’язок з кандидатами без агенцій та посередницьких комісій', pl: 'Bezpośredni kontakt z kandydatami bez agencji i prowizji pośredników' , ru: "Прямий зв’язок з кандидатами без агенцій та посередницьких комісій" },
    'emp.proof.title': { ua: '🔍 Ми перевіряємо всіх через Proof', pl: '🔍 Weryfikujemy wszystkich przez Proof' , ru: "🔍 Мы проверяем всех через Proof" },
    'emp.proof.text': { ua: 'Кожна вакансія та компанія отримує Rybezh Proof на основі реальних відгуків кандидатів. Це допомагає роботодавцям формувати довіру, а кандидатам — швидше приймати рішення.', pl: 'Każda oferta i firma otrzymuje Rybezh Proof na podstawie realnych opinii kandydatów. To buduje zaufanie do pracodawcy i pomaga kandydatom szybciej podejmować decyzję.' , ru: "Кожна вакансія та компанія отримує Rybezh Proof на основі реальних відгуків кандидатів. Це допомагає роботодавцям формувати довіру, а кандидатам — швидше приймати рішення." },
    'emp.stat1': { ua: 'Активних кандидатів', pl: 'Aktywnych kandydatów' , ru: "Активних кандидатів" },
    'emp.stat2': { ua: 'Вакансій розміщено', pl: 'Opublikowanych ofert' , ru: "Вакансій розміщено" },
    'emp.stat3': { ua: 'Міст покриття', pl: 'Miast w zasięgu' , ru: "Міст покриття" },
    'emp.stat4': { ua: 'Час відповіді', pl: 'Czas odpowiedzi' , ru: "Час відповіді" },
    'emp.form.title': { ua: '📝 Розмістити вакансію', pl: '📝 Opublikuj ofertę' , en: 'Leave a request for staff', ru: "📝 Розмістити вакансію" },
    'emp.form.sub': { ua: 'Заповніть форму нижче — ми опублікуємо вашу вакансію протягом 24 годин', pl: 'Wypełnij formularz — opublikujemy ofertę w ciągu 24 godzin' , ru: "Заповніть форму нижче — ми опублікуємо вашу вакансію протягом 24 годин" },
    'emp.form.company': { ua: 'Назва компанії *', pl: 'Nazwa firmy *' , en: 'Company Name', ru: "Назва компанії *" },
    'emp.form.company_ph': { ua: 'ТОВ "Назва"', pl: 'Sp. z o.o. "Nazwa"' , ru: "ТОВ \"Назва\"" },
    'emp.form.email': { ua: 'Email *', pl: 'Email *' , ru: "Email *" },
    'emp.form.email_ph': { ua: 'kontakt@firma.pl', pl: 'kontakt@firma.pl' , ru: "kontakt@firma.pl" },
    'emp.form.phone': { ua: 'Телефон / Telegram', pl: 'Telefon / Telegram' , en: 'Phone', ru: "Телефон / Telegram" },
    'emp.form.phone_ph': { ua: '+48 ...', pl: '+48 ...' , ru: "+48 ..." },
    'emp.form.city': { ua: 'Місто *', pl: 'Miasto *' , ru: "Місто *" },
    'emp.form.city_ph': { ua: '— Оберіть місто —', pl: '— Wybierz miasto —' , ru: "— Оберіть місто —" },
    'emp.form.other_city': { ua: 'Інше місто', pl: 'Inne miasto' , ru: "Другой город" },
    'emp.form.contract': { ua: 'Тип договору *', pl: 'Typ umowy *' , ru: "Тип договору *" },
    'emp.form.contract_ph': { ua: '— Оберіть тип —', pl: '— Wybierz typ —' , ru: "— Оберіть тип —" },
    'emp.form.umowa_zlecenie': { ua: 'Umowa zlecenie', pl: 'Umowa zlecenie' , ru: "Umowa zlecenie" },
    'emp.form.umowa_o_prace': { ua: 'Umowa o pracę', pl: 'Umowa o pracę' , ru: "Umowa o pracę" },
    'emp.form.b2b': { ua: 'B2B (faktura)', pl: 'B2B (faktura)' , ru: "B2B (faktura)" },
    'emp.form.other_type': { ua: 'Інший тип', pl: 'Inny typ' , ru: "Інший тип" },
    'emp.form.workers': { ua: 'Кількість працівників', pl: 'Liczba pracowników' , ru: "Кількість працівників" },
    'emp.form.salary': { ua: 'Зарплата (PLN нетто/міс)', pl: 'Wynagrodzenie (PLN netto/mies.)' , ru: "Зарплата (PLN нетто/міс)" },
    'emp.form.salary_from': { ua: 'від', pl: 'od' , ru: "від" },
    'emp.form.salary_to': { ua: 'до', pl: 'do' , ru: "до" },
    'emp.form.housing': { ua: 'Житло для працівників', pl: 'Zakwaterowanie dla pracowników' , ru: "Житло для працівників" },
    'emp.form.housing_yes': { ua: 'Так, надаємо', pl: 'Tak, zapewniamy' , ru: "Так, надаємо" },
    'emp.form.housing_no': { ua: 'Ні', pl: 'Nie' , ru: "Нет" },
    'emp.form.housing_help': { ua: 'Допомагаємо знайти', pl: 'Pomagamy znaleźć' , ru: "Допомагаємо знайти" },
    'emp.form.desc': { ua: 'Опис вакансії *', pl: 'Opis oferty *' , ru: "Опис вакансії *" },
    'emp.form.desc_ph': { ua: 'Опишіть обов’язки, графік роботи, вимоги до кандидатів...', pl: 'Opisz obowiązki, grafik pracy, wymagania wobec kandydatów...' , ru: "Опишіть обов’язки, графік роботи, вимоги до кандидатів..." },
    'emp.form.submit': { ua: '🚀 Опублікувати вакансію', pl: '🚀 Opublikuj ofertę' , en: 'Send Request', ru: "🚀 Опубликовать вакансию" },
    'emp.cta.title': { ua: 'Маєте питання?', pl: 'Masz pytania?' , ru: "Маєте питання?" },
    'emp.cta.text': { ua: 'Зв\'яжіться з нами напряму — допоможемо розмістити вакансію та знайти найкращих кандидатів', pl: 'Skontaktuj się z nami — pomożemy opublikować ofertę i znaleźć najlepszych kandydatów' , ru: "Зв\'яжіться з нами напряму — допоможемо розмістити вакансію та знайти найкращих кандидатів" },
    'emp.cta.telegram': { ua: '💬 Написати в Telegram', pl: '💬 Napisz na Telegram' , ru: "💬 Написати в Telegram" },

    // Homepage: calculator mini-widget
    'home.calc.lead': { ua: 'Дізнайтеся реальний дохід «на руки» з урахуванням податків та витрат', pl: 'Poznaj realny dochód „na rękę" z uwzględnieniem podatków i kosztów' , ru: "Дізнайтеся реальний дохід «на руки» з урахуванням податків та витрат" },
    'home.calc.contract': { ua: 'Тип договору', pl: 'Typ umowy' , ru: "Тип договора" },
    'home.calc.gross': { ua: 'Brutto (до податків)', pl: 'Brutto (przed podatkami)' , ru: "Brutto (до податків)" },
    'home.calc.tax': { ua: 'Податки та внески', pl: 'Podatki i składki' , ru: "Податки та внески" },
    'home.calc.net': { ua: 'Netto (на руки)', pl: 'Netto (na rękę)' , ru: "Netto (на руки)" },
    'home.calc.note': { ua: '*приблизний розрахунок за 2025 рік', pl: '*przybliżone obliczenie za 2025 rok' , ru: "*приблизний розрахунок за 2025 рік" },
    'home.calc.full': { ua: 'Розширений калькулятор з витратами →', pl: 'Rozszerzony kalkulator z kosztami →' , ru: "Розширений калькулятор з витратами →" },
    'home.calc.city_count': { ua: 'вакансій', pl: 'ofert' , ru: "вакансій" },

    // Homepage: tools showcase
    'home.tools.title': { ua: 'Безкоштовні інструменти', pl: 'Darmowe narzędzia' , ru: "Бесплатные инструменты" },
    'home.tools.lead': { ua: 'Все, що потрібно для старту роботи в Польщі — в одному місці', pl: 'Wszystko, czego potrzebujesz do startu pracy w Polsce — w jednym miejscu' , ru: "Все, что нужно для старта работы в Польше — в одном месте" },
    'home.tools.calc.title': { ua: 'Калькулятор зарплати', pl: 'Kalkulator wynagrodzenia' , ru: "Калькулятор зарплаты" },
    'home.tools.calc.text': { ua: 'Розрахуйте реальний дохід з урахуванням податків UoP, Zlecenie, B2B та щоденних витрат', pl: 'Oblicz realny dochód z uwzględnieniem podatków UoP, Zlecenie, B2B i codziennych kosztów' , ru: "Рассчитайте реальный доход с учетом налогов UoP, Zlecenie, B2B и ежедневных затрат" },
    'home.tools.calc.cta': { ua: 'Розрахувати →', pl: 'Oblicz →' , ru: "Рассчитать →" },
    'home.tools.cv.title': { ua: 'Генератор CV', pl: 'Generator CV' , ru: "Генератор CV" },
    'home.tools.cv.text': { ua: 'Створіть професійне резюме за 4 кроки з RODO-застереженням та супровідним листом', pl: 'Stwórz profesjonalne CV w 4 krokach z klauzulą RODO i listem motywacyjnym' , ru: "Создайте профессиональное резюме в 4 шага с RODO-согласием и сопроводительным письмом" },
    'home.tools.cv.cta': { ua: 'Створити CV →', pl: 'Stwórz CV →' , ru: "Создать CV →" },
    'home.tools.redflag.title': { ua: 'Перевірка вакансій', pl: 'Sprawdzanie ofert', ru: 'Проверка вакансий' },
    'home.tools.redflag.text': { ua: '10 ознак шахрайства — перевірте будь-яке оголошення за 2 хвилини перед відгуком', pl: '10 oznak oszustwa — sprawdź dowolne ogłoszenie w 2 minuty przed zgłoszeniem' , ru: "10 признаков мошенничества — проверьте любое объявление за 2 минуты перед откликом" },
    'home.tools.redflag.cta': { ua: 'Перевірити →', pl: 'Sprawdź →' , ru: "Проверить →" },
    'home.tools.map.title': { ua: 'Карта українців', pl: 'Mapa Ukraińców', ru: 'Карта русскоязычных' },
    'home.tools.map.text': { ua: 'Знайдіть земляків поруч — інтерактивна карта з контактами по всій Польщі', pl: 'Znajdź rodaków w pobliżu — interaktywna mapa z kontaktami w całej Polsce' , ru: "Найдите земляков рядом — интерактивная карта с контактами по всей Польше" },
    'home.tools.map.cta': { ua: 'Відкрити карту →', pl: 'Otwórz mapę →' , ru: "Открыть карту →" },
    'home.tools.game.title': { ua: 'Гра «Шлях Ветерана»', pl: 'Gra «Droga Weterana»', ru: 'Игра «Путь Ветерана»' },
    'home.tools.game.text': { ua: 'Безкоштовна браузерна гра про пошук роботи у Польщі після повернення з фронту', pl: 'Darmowa gra przeglądarkowa o poszukiwaniu pracy w Polsce po powrocie z frontu', ru: 'Бесплатная браузерная игра о поиске работы в Польше после возвращения с фронта' },
    'home.tools.game.cta': { ua: 'Грати зараз →', pl: 'Graj teraz →', ru: 'Играть сейчас →' },

    // Homepage: map preview
    'home.map.kicker': { ua: '🗺️ Новинка', pl: '🗺️ Nowość' , ru: "🗺️ Новинка" },
    'home.map.title': { ua: 'Карта українців у Польщі', pl: 'Mapa Ukraińców w Polsce', ru: 'Карта русскоязычных в Польше' },
    'home.map.desc': { ua: 'Знайдіть земляків поруч, додайте себе на карту та створіть спільноту підтримки. Вже зараз на карті відзначені десятки українців у різних містах Польщі.', pl: 'Znajdź rodaków w okolicy, dodaj się na mapę i stwórz społeczność wsparcia. Już teraz na mapie zaznaczono dziesiątki Ukraińców w różnych miastach Polski.' , ru: "Найдите земляков рядом, добавьте себя на карту и создайте сообщество поддержки. Уже сейчас на карте отмечены десятки украинцев в разных городах Польши." },
    'home.map.f1': { ua: '📍 Інтерактивна карта з кластеризацією', pl: '📍 Interaktywna mapa z klasteryzacją' , ru: "📍 Интерактивная карта с кластеризацией" },
    'home.map.f2': { ua: '👤 Додайте себе через Google Форму', pl: '👤 Dodaj się przez formularz Google' , ru: "👤 Добавьте себя через Google Форму" },
    'home.map.f3': { ua: '🔗 Контакти, Telegram, спільноти', pl: '🔗 Kontakty, Telegram, społeczności' , ru: "🔗 Контакты, Telegram, сообщества" },
    'home.map.f4': { ua: '🆓 Повністю безкоштовно', pl: '🆓 Całkowicie bezpłatnie' , ru: "🆓 Полностью бесплатно" },
    'home.map.cta.title': { ua: 'Відкрити мапу українців у Польщі', pl: 'Otwórz mapę Ukraińców w Polsce', ru: 'Открыть карту русскоязычных в Польше' },
    'home.map.cta.sub': { ua: 'Знайди земляків поруч · Додай себе на карту!', pl: 'Znajdź rodaków obok · Dodaj się na mapę!' , ru: "Найди земляков рядом · Добавь себя на карту!" },

    // Tool pages meta
    'calc.meta_title': { ua: 'Калькулятор зарплати в Польщі — Rybezh', pl: 'Kalkulator wynagrodzenia w Polsce — Rybezh' , ru: "Калькулятор зарплаты в Польше — Rybezh" },
    'calc.meta_description': { ua: 'Розрахуйте зарплату нетто в Польщі: UoP, Zlecenie, B2B. Податки, ZUS, витрати на житло та транспорт.', pl: 'Oblicz wynagrodzenie netto w Polsce: UoP, Zlecenie, B2B. Podatki, ZUS, koszty mieszkania i transportu.' , ru: "Рассчитайте зарплату нетто в Польше: UoP, Zlecenie, B2B. Налоги, ZUS, затраты на жилье и транспорт." },
    'cv.meta_title': { ua: 'Генератор CV для роботи в Польщі — Rybezh', pl: 'Generator CV do pracy w Polsce — Rybezh' , en: 'CV Generator — Rybezh', ru: "Генератор CV для работы в Польше — Rybezh" },
    'cv.meta_description': { ua: 'Створіть професійне резюме за 4 кроки з RODO-застереженням та супровідним листом.', pl: 'Stwórz profesjonalne CV w 4 krokach z klauzulą RODO i listem motywacyjnym.' , en: 'Create a professional CV for employers in Poland for free online.', ru: "Создайте профессиональное резюме за 4 шага с RODO-согласием и сопроводительным письмом." },
    'redflag.meta_title': { ua: 'Перевірка вакансій на шахрайство — Rybezh', pl: 'Sprawdzanie ofert pod kątem oszustwa — Rybezh' , ru: "Проверка вакансий на мошенничество — Rybezh" },
    'redflag.meta_description': { ua: 'Перевірте будь-яку вакансію за 2 хвилини. 10 червоних прапорців шахрайських оголошень.', pl: 'Sprawdź dowolną ofertę w 2 minuty. 10 czerwonych flag oszukańczych ogłoszeń.' , ru: "Проверьте любую вакансию за 2 минуты. 10 красных флагов мошеннических объявлений." },
    'map.meta_title': { ua: 'Карта українців у Польщі — Rybezh', pl: 'Mapa Ukraińców w Polsce — Rybezh', ru: 'Карта русскоязычных в Польше — Rybezh' , en: 'Map of Vacancies — Rybezh | Work in Poland'},
    'map.meta_description': { ua: 'Інтерактивна карта українців у Польщі. Знайдіть земляків поруч, додайте себе на карту.', pl: 'Interaktywna mapa Ukraińców w Polsce. Znajdź rodaków w pobliżu, dodaj się na mapę.', ru: 'Интерактивная карта русскоязычных в Польше. Найдите земляков рядом, добавьте себя на карту.' , en: 'Interactive map of vacancies in Poland. Find a job near you.'},

    // Terms page
    'terms.meta_title': { ua: 'Умови користування — Rybezh', pl: 'Regulamin — Rybezh' , en: 'Terms of Use — Rybezh', ru: "Условия использования — Rybezh" },
    'terms.meta_description': { ua: 'Умови користування сайтом Rybezh: правила, відповідальність, обробка запитів.', pl: 'Regulamin korzystania z serwisu Rybezh: zasady, odpowiedzialność, obsługa zgłoszeń.' , en: 'Terms of use for the Rybezh website and services.', ru: "Условия использования сайта Rybezh: правила, ответственность, обработка запросов." },
    'terms.title': { ua: 'Умови користування', pl: 'Regulamin' , en: 'Terms of Use', ru: "Условия использования" },

    // Red-flag analysis results
    'rf.result.safe': { ua: 'Виглядає нормально', pl: 'Wygląda normalnie' , ru: "Выглядит нормально" },
    'rf.result.safe.desc': { ua: 'Жодного червоного прапорця не знайдено. Але все одно перевірте компанію в <a href="https://ekrs.ms.gov.pl" target="_blank">KRS</a> та вимагайте договір перед виїздом.', pl: 'Nie znaleziono żadnych czerwonych flag. Mimo to sprawdź firmę w <a href="https://ekrs.ms.gov.pl" target="_blank">KRS</a> i wymagaj umowy przed wyjazdem.' , ru: "Ни одного красного флага не найдено. Но все равно проверьте компанию в <a href=\"https://ekrs.ms.gov.pl\" target=\"_blank\">KRS</a> и требуйте договор перед выездом." },
    'rf.result.warn': { ua: 'Є підозрілі ознаки', pl: 'Są podejrzane oznaki' , ru: "Есть подозрительные признаки" },
    'rf.result.warn.desc': { ua: 'червоних прапорців. Будьте обережні! Перевірте компанію в KRS та зверніться до PIP (801 002 006) для консультації.', pl: 'czerwonych flag. Bądź ostrożny! Sprawdź firmę w KRS i skontaktuj się z PIP (801 002 006) w celu konsultacji.' , ru: "красных флагов. Будьте осторожны! Проверьте компанию в KRS и обратитесь в PIP (801 002 006) для консультации." },
    'rf.result.danger': { ua: 'НЕБЕЗПЕЧНО!', pl: 'NIEBEZPIECZNE!' , ru: "ОПАСНО!" },
    'rf.result.danger.suffix': { ua: 'прапорців', pl: 'flag' , ru: "флагов" },
    'rf.result.danger.desc': { ua: 'червоних прапорців! Ця вакансія має всі ознаки шахрайства. <strong>НЕ відправляйте гроші та документи.</strong> Зверніться до Policja (997) або PIP (801 002 006).', pl: 'czerwonych flag! Ta oferta ma wszelkie oznaki oszustwa. <strong>NIE wysyłaj pieniędzy ani dokumentów.</strong> Zgłoś się na Policję (997) lub PIP (801 002 006).' , ru: "красных флагов! Эта вакансия имеет все признаки мошенничества. <strong>НЕ отправляйте деньги и документы.</strong> Обратитесь в Policja (997) или PIP (801 002 006)." },
    'rf.share.text': { ua: '🚩 Перевірив вакансію на Rybezh Red Flag Checker', pl: '🚩 Sprawdziłem ofertę w Rybezh Red Flag Checker' , ru: "🚩 Проверил вакансию на Rybezh Red Flag Checker" },
    'rf.share.suffix': { ua: 'червоних прапорців!', pl: 'czerwonych flag!' , ru: "красных флагов!" },
    'rf.share.check': { ua: 'Перевір свою', pl: 'Sprawdź swoją' , ru: "Проверь свою" },
    'rf.share.tg': { ua: 'Попередити в Telegram', pl: 'Ostrzeż na Telegramie' , ru: "Предупредить в Telegram" },
    'rf.share.fb': { ua: 'Facebook', pl: 'Facebook' , ru: "Facebook" },

    // CV generator dynamic labels
    'cv.exp.position': { ua: 'Посада', pl: 'Stanowisko' , ru: "Должность" },
    'cv.exp.company': { ua: 'Компанія', pl: 'Firma' , ru: "Компания" },
    'cv.exp.period': { ua: 'Період', pl: 'Okres' , ru: "Период" },
    'cv.exp.duties': { ua: 'Обов’язки', pl: 'Obowiązki' , ru: "Обов’язки" },
    'cv.skill.add': { ua: '+ Додати', pl: '+ Dodaj' , ru: "+ Додати" },

    // Article template
    'article.sidebar': { ua: 'Перевірена платформа для знаходження роботи у Польщі.', pl: 'Sprawdzona platforma do szukania pracy w Polsce.' , ru: "Проверенная платформа для поиска работы в Польше." }
  };

  // Get current language
  const STORAGE_KEY = 'site_lang';
  const LEGACY_KEY = 'siteLang';
  function getLang() {
    return localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY) || 'ua';
  }

  function isPolishPath(pathname) {
    // Supports both static *.html URLs and clean URLs (/about-pl)
    return /(^|\/)index-pl(?:\.html)?$/.test(pathname)
      || /(^|\/)[^/]+-pl\.html$/.test(pathname)
      || /(^|\/)[^/]+-pl$/.test(pathname)
      || /(^|\/)404-pl(\/index\.html|\/?)$/.test(pathname);
  }
  function isRussianPath(pathname) {
    return /(^|\/)index-ru(?:\.html)?$/.test(pathname)
      || /(^|\/)[^/]+-ru\.html$/.test(pathname)
      || /(^|\/)[^/]+-ru$/.test(pathname)
      || /(^|\/)404-ru(\/index\.html|\/?)$/.test(pathname);
  }

  function toUaPath(pathname) {
    if (pathname === '/index-pl.html' || pathname === '/index-pl') return '/';
    if (pathname === '/index-ru.html' || pathname === '/index-ru') return '/';
    if (/\/404-pl(\/index\.html|\/?)$/.test(pathname)) return '/404/';
    if (/\/404-ru(\/index\.html|\/?)$/.test(pathname)) return '/404/';

    if (pathname.endsWith('-pl.html')) {
      return pathname.replace(/-pl\.html$/, '.html');
    }
    if (pathname.endsWith('-ru.html')) {
      return pathname.replace(/-ru\.html$/, '.html');
    }

    if (pathname.endsWith('-pl')) {
      return pathname.replace(/-pl$/, '');
    }
    if (pathname.endsWith('-ru')) {
      return pathname.replace(/-ru$/, '');
    }

    return pathname;
  }

  function toPlPath(pathname) {
    pathname = toUaPath(pathname);
    if (pathname === '/' || pathname === '/index.html' || pathname === '/index') return '/index-pl.html';
    if (/\/404(\/index\.html|\/?)$/.test(pathname)) return '/404-pl/';

    if (pathname.endsWith('.html')) {
      return pathname.replace(/\.html$/, '-pl.html');
    }

    // Clean URL support: /about -> /about-pl
    if (!pathname.endsWith('/')) {
      return `${pathname}-pl`;
    }

    // Fallback for trailing slash paths
    return `${pathname.replace(/\/$/, '')}-pl`;
  }
  function toRuPath(pathname) {
    pathname = toUaPath(pathname);
    if (pathname === '/' || pathname === '/index.html' || pathname === '/index') return '/index-ru.html';
    if (/\/404(\/index\.html|\/?)$/.test(pathname)) return '/404-ru/';

    if (pathname.endsWith('.html')) {
      return pathname.replace(/\.html$/, '-ru.html');
    }

    if (!pathname.endsWith('/')) {
      return `${pathname}-ru`;
    }

    return `${pathname.replace(/\/$/, '')}-ru`;
  }

  // Set language — navigates between UA / PL page variants
  function setLang(lang) {
    const currentPath = window.location.pathname;
    const isPlPage = isPolishPath(currentPath);
    const isRuPage = isRussianPath(currentPath);
    const suffix = `${window.location.search || ''}${window.location.hash || ''}`;
    localStorage.setItem(STORAGE_KEY, lang);
    localStorage.setItem(LEGACY_KEY, lang);

    // Navigate to UA page from PL/RU page
    if (lang === 'ua' && (isPlPage || isRuPage)) {
      const uaPath = toUaPath(currentPath);
      window.location.href = `${uaPath}${suffix}`;
      return;
    }

    // Navigate to PL page from UA/RU page
    if (lang === 'pl' && !isPlPage) {
      const plPath = toPlPath(currentPath);
      window.location.href = `${plPath}${suffix}`;
      return;
    }

    // Navigate to RU page from UA/PL page
    if (lang === 'ru' && !isRuPage) {
      const ruPath = toRuPath(currentPath);
      window.location.href = `${ruPath}${suffix}`;
      return;
    }

    // Same language variant — just apply translations
    applyTranslations(lang);
    updateLangButtons(lang);
    window.dispatchEvent(new Event('languageChanged'));
  }

  // Apply translations to page
  function interpolateText(text) {
    if (typeof text !== 'string') return text;
    return text.replace(/\$\{year\}/g, String(new Date().getFullYear()));
  }

  function toRussianFallbackText(input) {
    if (input === null || input === undefined) return '';
    let text = String(input);
    const replacements = [
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
      ['Схожі вакансії', 'Похожие вакансии']
    ];
    for (const [from, to] of replacements) {
      text = text.split(from).join(to);
    }
    text = text
      .replace(/Стабільна та безпечна вакансія за відгуками\./gi, 'Стабильная и безопасная вакансия по отзывам.')
      .replace(/Умови загалом ок, але варто уточнити деталі\./gi, 'Условия в целом хорошие, но стоит уточнить детали.');
    return text
      .replace(/[іІїЇєЄґҐ]/g, (ch) => ({
        і: 'и', І: 'И', ї: 'и', Ї: 'И', є: 'е', Є: 'Е', ґ: 'г', Ґ: 'Г'
      }[ch] || ch))
      .replace(/[ʼ’]/g, '\'')
      .replace(/\bПольщи\b/gi, 'Польше')
      .replace(/\bЗнайдить\b/gi, 'Найдите')
      .replace(/\bризних\b/gi, 'разных')
      .replace(/\bвсий\b/gi, 'всей')
      .replace(/\bЛегальне\b/gi, 'Легальные')
      .replace(/\bумови\b/gi, 'условия')
      .replace(/\bпидтримка\b/gi, 'поддержка')
      .replace(/\bшукае\b/gi, 'ищет')
      .replace(/\bдоговир\b/gi, 'договор')
      .replace(/\bдосвид\b/gi, 'опыт')
      .replace(/\bпрацивник\b/gi, 'сотрудник')
      .replace(/\bкоманди\b/gi, 'команды')
      .replace(/\bзагалом\b/gi, 'в целом')
      .replace(/\bуточнити\b/gi, 'уточнить')
      .replace(/\bгданськ\b/gi, 'Гданьск')
      .replace(/\bкракив\b/gi, 'Краков')
      .replace(/\bвроцлав\b/gi, 'Вроцлав')
      .replace(/\bсосновець\b/gi, 'Сосновец');
  }

  function getTranslationText(dict, lang) {
    if (!dict) return '';
    if (dict[lang] !== undefined) return dict[lang];
    if (lang === 'ru') return toRussianFallbackText(dict.ua || dict.pl || '');
    return dict.ua || '';
  }

  function applyTranslations(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const dict = translations[key];
      if (!dict) return;
      const text = getTranslationText(dict, lang);
      const attr = el.getAttribute('data-i18n-attr');
      if (attr) {
        try { el.setAttribute(attr, interpolateText(text)); } catch (e) { el.textContent = interpolateText(text); }
        return;
      }
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = interpolateText(text);
      } else if (el.tagName === 'TITLE' || (el.parentElement && el.parentElement.tagName === 'HEAD')) {
        document.title = interpolateText(text);
        el.textContent = interpolateText(text);
      } else {
        el.innerHTML = interpolateText(text);
      }
    });

    document.querySelectorAll('[data-lang-content]').forEach(el => {
      const target = el.getAttribute('data-lang-content');
      if (target === lang) {
        el.style.display = '';
      } else {
        el.style.display = 'none';
      }
    });

    // Update HTML lang attribute
    document.documentElement.lang = lang === 'ua' ? 'uk' : (lang === 'ru' ? 'ru' : 'pl');
  }

  // Update language button states
  function updateLangButtons(lang) {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const btnLang = btn.getAttribute('data-lang');
      btn.classList.toggle('active', btnLang === lang);
    });
  }

  // Initialize language switcher
  function initI18n() {
    // Merge extra translations injected by generate.js
    const extraTranslations = window.EXTRA_TRANSLATIONS || {};
    if (extraTranslations && typeof extraTranslations === 'object') {
      Object.assign(translations, extraTranslations);
    }
    
    // Auto-detect language from page URL
    const isPlPage = isPolishPath(window.location.pathname);
    const isRuPage = isRussianPath(window.location.pathname);
    const lang = isPlPage ? 'pl' : (isRuPage ? 'ru' : getLang());

    if (isPlPage) {
      localStorage.setItem(STORAGE_KEY, 'pl');
      localStorage.setItem(LEGACY_KEY, 'pl');
    }
    if (isRuPage) {
      localStorage.setItem(STORAGE_KEY, 'ru');
      localStorage.setItem(LEGACY_KEY, 'ru');
    }

    applyTranslations(lang);
    updateLangButtons(lang);

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const newLang = btn.getAttribute('data-lang');
        if (!newLang) return;
        setLang(newLang);
      });
    });
  }

  // ============================================
  // 2. COOKIE BANNER
  // ============================================
  function initCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept-btn');
    
    if (!banner) return;

    // Check if already accepted
    if (localStorage.getItem('cookiesAccepted') === 'true' || localStorage.getItem('cookie_accepted') === 'true') {
      banner.hidden = true;
      return;
    }

    // Show banner
    banner.hidden = false;

    // Accept cookies
    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        localStorage.setItem('cookie_accepted', 'true');
        banner.hidden = true;
        banner.style.animation = 'slideDown 0.3s ease-out';
      });
    }
  }

  // ============================================
  // 3. DARK THEME
  // ============================================
  function initTheme() {
    // Create theme toggle button if not exists
    let themeBtn = document.getElementById('theme-toggle');
    if (!themeBtn) {
      themeBtn = document.createElement('button');
      themeBtn.id = 'theme-toggle';
      themeBtn.className = 'theme-toggle';
      themeBtn.setAttribute('aria-label', 'Toggle theme');
      themeBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
      
      // Insert after language buttons
      const headerLang = document.querySelector('.header-lang');
      if (headerLang) {
        headerLang.parentNode.insertBefore(themeBtn, headerLang.nextSibling);
      }
    }

    // Get saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    // Toggle theme
    themeBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    
    if (theme === 'dark') {
      btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    } else {
      btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
    }
  }

  // ============================================
  // 4. SCROLL TO TOP BUTTON
  // ============================================
  function initScrollToTop() {
    // Create button
    const scrollBtn = document.createElement('button');
    scrollBtn.id = 'scroll-top';
    scrollBtn.className = 'scroll-top-btn';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    scrollBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>';
    document.body.appendChild(scrollBtn);

    // Show/hide on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }
    });

    // Scroll to top on click
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================
  // 5. SCROLL ANIMATIONS
  // ============================================
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.job-card, .apply-card, .card, .blog-card');
    
    if (!('IntersectionObserver' in window)) {
      animatedElements.forEach(el => {
        el.classList.remove('animate-ready');
        el.classList.add('animate-in');
      });
      // Also handle fade-in elements
      document.querySelectorAll('.fade-in').forEach(el => el.classList.add('is-visible'));
      return;
    }

    if (animatedElements.length) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

      animatedElements.forEach(el => {
        el.classList.add('animate-ready');
        observer.observe(el);
      });
    }

    // Fade-in observer for homepage sections
    const fadeEls = document.querySelectorAll('.fade-in');
    if (fadeEls.length) {
      const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            fadeObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
      fadeEls.forEach(el => fadeObserver.observe(el));
    }
  }

  // ============================================
  // 6. SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ============================================
  // 7. MOBILE MENU IMPROVEMENTS
  // ============================================
  function initMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileToggle = document.querySelector('.mobile-toggle');
    
    if (!mobileMenu || !mobileToggle) return;

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (mobileMenu.classList.contains('is-open') && 
          !mobileMenu.contains(e.target) && 
          !mobileToggle.contains(e.target)) {
        mobileMenu.classList.remove('is-open');
      }
    });

    // Close menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
      });
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        mobileMenu.classList.remove('is-open');
      }
    });
  }

  // ============================================
  // 8. FORM ENHANCEMENTS
  // ============================================
  function initFormEnhancements() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      // Real-time validation
      form.querySelectorAll('input[required], textarea[required]').forEach(input => {
        input.addEventListener('blur', () => {
          validateField(input);
        });
        
        input.addEventListener('input', () => {
          if (input.classList.contains('error')) {
            validateField(input);
          }
        });
      });
    });
  }

  function validateField(field) {
    const isValid = field.checkValidity();
    field.classList.toggle('error', !isValid);
    field.classList.toggle('valid', isValid && field.value.trim() !== '');
    return isValid;
  }

  // ============================================
  // 9. LOADING STATE
  // ============================================
  function initPageLoad() {
    document.body.classList.add('loaded');
  }

  // ============================================
  // 10. TELEGRAM LINK TRACKING
  // ============================================
  function initTelegramTracking() {
    document.querySelectorAll('a[href*="t.me"]').forEach(link => {
      link.addEventListener('click', () => {
        if (typeof gtag === 'function') {
          gtag('event', 'click', {
            'event_category': 'outbound',
            'event_label': 'telegram',
            'transport_type': 'beacon'
          });
        }
      });
    });
  }

  // ============================================
  // 13. EARNINGS CALCULATOR (Extended)
  // ============================================
  function initCalculator() {
    const hInput = document.getElementById('calc-hours');
    const rInput = document.getElementById('calc-rate');
    const hVal = document.getElementById('val-hours');
    const rVal = document.getElementById('val-rate');
    const totalEarn = document.getElementById('total-earn');
    const totalTax = document.getElementById('total-tax');
    const totalNet = document.getElementById('total-net');

    if (!hInput || !rInput || !hVal || !rVal || !totalEarn) return;

    const fmt = (n) => Math.round(n).toLocaleString('pl-PL');

    const calc = () => {
      const h = Number(hInput.value || 0);
      const r = Number(rInput.value || 0);
      hVal.textContent = String(h);
      rVal.textContent = String(r);
      const gross = h * r * (52 / 12); // avg weeks per month

      // Get contract type
      const contractEl = document.querySelector('input[name="contract"]:checked');
      const contract = contractEl ? contractEl.value : 'zlecenie';

      let tax = 0;
      if (contract === 'zlecenie') {
        // ~13.5% tax for zlecenie (simplified)
        tax = gross * 0.135;
      } else if (contract === 'uop') {
        // ~23% for UoP (ZUS + tax)
        tax = gross * 0.23;
      } else if (contract === 'b2b') {
        // ~19% flat + ZUS ~1400
        tax = gross * 0.19;
        if (gross > 2000) tax = Math.max(tax, 1400);
      }

      const net = gross - tax;

      totalEarn.textContent = fmt(gross);
      if (totalTax) totalTax.textContent = fmt(tax);
      if (totalNet) totalNet.textContent = fmt(net);
    };

    hInput.addEventListener('input', calc);
    rInput.addEventListener('input', calc);

    // Contract type radio listeners
    document.querySelectorAll('input[name="contract"]').forEach(radio => {
      radio.addEventListener('change', calc);
    });

    calc();
  }

  // ============================================
  // 11. DATE FORMATTING
  // ============================================
  function initDateFormatting() {
    const lang = getLang();
    const locale = lang === 'pl' ? 'pl-PL' : (lang === 'ru' ? 'ru-RU' : 'uk-UA');
    
    document.querySelectorAll('[data-format-date]').forEach(el => {
      const dateStr = el.getAttribute('data-format-date');
      if (!dateStr) return;
      
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return;
        
        const formatted = date.toLocaleDateString(locale, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        
        el.textContent = formatted;
      } catch (e) {
        console.warn('Date formatting failed:', e);
      }
    });
  }

  function initImageFallbacks() {
    const fallbackSrc = '/og-image.svg';
    const IMAGE_LOAD_TIMEOUT_MS = 1200;
    document.querySelectorAll('img').forEach((img) => {
      if (img.dataset.fallbackInit === '1') return;
      img.dataset.fallbackInit = '1';
      const applyFallback = function() {
        if (this.getAttribute('src') === fallbackSrc) return;
        this.onerror = null;
        this.src = fallbackSrc;
      };
      let delayedCheckId = null;
      const clearDelayedCheck = () => {
        if (delayedCheckId) {
          clearTimeout(delayedCheckId);
          delayedCheckId = null;
        }
      };
      img.addEventListener('error', function() {
        clearDelayedCheck();
        applyFallback.call(this);
      });
      img.addEventListener('load', clearDelayedCheck);
      if (img.complete && !img.naturalWidth) {
        applyFallback.call(img);
      } else {
        delayedCheckId = setTimeout(() => {
          if (img.complete && !img.naturalWidth) {
            applyFallback.call(img);
          }
          delayedCheckId = null;
        }, IMAGE_LOAD_TIMEOUT_MS);
      }
    });
  }

  // ============================================
  // 12. NEWSLETTER FORM
  // ============================================
  function initNewsletter() {
    document.querySelectorAll('.footer-newsletter-form').forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        const input = form.querySelector('input');
        const email = input.value.trim();
        if (!email) return;

        const originalContent = btn.innerHTML;
        
        btn.disabled = true;
        btn.innerHTML = '<div class="spinner" style="width:16px;height:16px;border-width:2px"></div>';
        
        try {
          let city = '';
          try {
            const geoRes = await fetch(GEO_URL, { cache: 'no-store' });
            if (geoRes.ok) {
              const geo = await geoRes.json();
              city = geo && geo.city ? String(geo.city) : '';
            }
          } catch (geoErr) {
            console.warn('Geo lookup failed', geoErr);
          }

          const formData = new FormData();
          formData.append('contact', email);
          formData.append('start', new Date().toISOString());
          formData.append('city', city);
          formData.append('message', 'suscription');
          formData.append('type', 'newsletter');
          formData.append('ts', new Date().toISOString());

          await fetch(GSA_URL, { method: 'POST', mode: 'no-cors', body: formData });

          btn.innerHTML = '✓';
          input.value = '';
          input.placeholder = translations['footer.newsletter.success'][getLang()] || 'Thanks!';
        } catch (err) {
          console.error(err);
          btn.innerHTML = '✕';
        } finally {
          setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = originalContent;
            input.placeholder = translations['footer.newsletter.placeholder'][getLang()] || 'Email';
          }, 3000);
        }
      });
    });
  }

  // ============================================
  // 12. CONTACT FORM
  // ============================================
  function initContactForm() {
    const forms = document.querySelectorAll('.js-contact-form');
    if (!forms.length) return;

    forms.forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nameInput = form.querySelector('[name="name"]');
        const contactInput = form.querySelector('[name="contact"]');
        const messageInput = form.querySelector('[name="message"]');
        const status = form.querySelector('.form-message');
        const button = form.querySelector('button[type="submit"]');

        const name = nameInput ? nameInput.value.trim() : '';
        const contact = contactInput ? contactInput.value.trim() : '';
        const message = messageInput ? messageInput.value.trim() : '';
        const currentLang = getLang();

        if (!name || !contact) {
          if (status) status.textContent = currentLang === 'pl' ? 'Uzupełnij imię i kontakt.' : (currentLang === 'ru' ? 'Заполните имя и контакт.' : 'Заповніть імʼя та контакт.');
          return;
        }

        if (button) button.disabled = true;
        if (status) status.textContent = currentLang === 'pl' ? 'Wysyłanie...' : (currentLang === 'ru' ? 'Отправляем...' : 'Надсилаємо...');

        try {
          let city = '';
          try {
            const geoRes = await fetch(GEO_URL, { cache: 'no-store' });
            if (geoRes.ok) {
              const geo = await geoRes.json();
              city = geo && geo.city ? String(geo.city) : '';
            }
          } catch (geoErr) {
            console.warn('Geo lookup failed', geoErr);
          }

          const formData = new FormData();
          formData.append('name', name);
          formData.append('contact', contact);
          formData.append('message', message || '-');
          formData.append('type', 'contact');
          formData.append('city', city);
          formData.append('page', window.location.href);
          formData.append('lang', currentLang);
          formData.append('ts', new Date().toISOString());

          await fetch(GSA_URL, { method: 'POST', mode: 'no-cors', body: formData });

          if (status) status.textContent = currentLang === 'pl' ? 'Dziękujemy! Skontaktujemy się wkrótce.' : (currentLang === 'ru' ? 'Спасибо! Мы свяжемся с вами в ближайшее время.' : 'Дякуємо! Ми відповімо найближчим часом.');
          if (nameInput) nameInput.value = '';
          if (contactInput) contactInput.value = '';
          if (messageInput) messageInput.value = '';
        } catch (err) {
          console.error(err);
          if (status) status.textContent = currentLang === 'pl' ? 'Błąd wysyłki. Spróbuj ponownie.' : (currentLang === 'ru' ? 'Ошибка отправки. Попробуйте ещё раз.' : 'Помилка відправки. Спробуйте ще раз.');
        } finally {
          if (button) button.disabled = false;
        }
      });
    });
  }

  // ============================================
  // 13. COMMENT THREADS (BLOG POSTS)
  // ============================================
  function initCommentThreads() {
    const threads = Array.from(document.querySelectorAll('.js-comment-thread'));
    if (!threads.length) return;

    const shuffle = (arr) => {
      const copy = arr.slice();
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };

    const formatDate = (date, lang) => {
      const locale = lang === 'pl' ? 'pl-PL' : (lang === 'ru' ? 'ru-RU' : 'uk-UA');
      return date.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const randomRecentDate = () => {
      const now = new Date();
      const daysBack = 3 + Math.floor(Math.random() * 45);
      const minutesBack = Math.floor(Math.random() * 2400);
      const d = new Date(now.getTime() - (daysBack * 24 * 60 + minutesBack) * 60 * 1000);
      return d;
    };

    const renderComment = (item, lang, isChild = false) => {
      const wrap = document.createElement('div');
      wrap.className = `comment ${isChild ? 'comment--child' : ''}`.trim();

      const header = document.createElement('div');
      header.className = 'comment-header';

      const avatar = document.createElement('div');
      avatar.className = 'comment-avatar';
      avatar.textContent = item.avatar || '🙂';

      const metaWrap = document.createElement('div');

      const author = document.createElement('div');
      author.className = 'comment-author';
      author.textContent = item.name || (lang === 'pl' ? 'Anonim' : (lang === 'ru' ? 'Аноним' : 'Анонім'));

      if (item.isTeam) {
        const badge = document.createElement('span');
        badge.className = 'comment-badge';
        badge.textContent = lang === 'pl' ? 'Odpowiedź Rybezh' : (lang === 'ru' ? 'Ответ Rybezh' : 'Відповідь Rybezh');
        author.appendChild(badge);
      }

      const meta = document.createElement('div');
      meta.className = 'comment-meta';
      const date = item.date ? new Date(item.date) : randomRecentDate();
      meta.textContent = `${item.country?.flag || ''} ${item.country?.label || ''} · ${formatDate(date, lang)}`.trim();

      metaWrap.appendChild(author);
      metaWrap.appendChild(meta);

      header.appendChild(avatar);
      header.appendChild(metaWrap);

      const body = document.createElement('p');
      body.textContent = item.text || '';

      const actions = document.createElement('div');
      actions.className = 'comment-actions';
      const replyBtn = document.createElement('button');
      replyBtn.className = 'comment-reply-btn';
      replyBtn.type = 'button';
      replyBtn.textContent = lang === 'pl' ? 'Odpowiedz' : (lang === 'ru' ? 'Ответить' : 'Відповісти');
      actions.appendChild(replyBtn);

      wrap.appendChild(header);
      wrap.appendChild(body);
      wrap.appendChild(actions);

      if (Array.isArray(item.replies) && item.replies.length) {
        const children = document.createElement('div');
        children.className = 'comment-children';
        item.replies.forEach(reply => {
          children.appendChild(renderComment(reply, lang, true));
        });
        wrap.appendChild(children);
      }

      return wrap;
    };

    const getPostSlug = () => {
      const match = window.location.pathname.match(/post-([^./]+)\.html/i);
      return match ? match[1] : 'general';
    };

    const loadStored = (key) => {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    };

    const saveStored = (key, items) => {
      try {
        localStorage.setItem(key, JSON.stringify(items));
      } catch (e) {
        console.warn('Failed to store comments', e);
      }
    };

    const userAvatars = ['🙂', '😊', '🧑‍💼', '👩‍💻', '🧑‍🔧', '👨‍🎓'];
    const flagMap = {
      UA: '🇺🇦',
      PL: '🇵🇱',
      GE: '🇬🇪',
      BY: '🇧🇾',
      MD: '🇲🇩',
      LT: '🇱🇹',
      SK: '🇸🇰',
      RO: '🇷🇴'
    };

    threads.forEach(thread => {
      const parent = thread.closest('.post-comments') || thread.parentElement;
      const dataEl = parent ? parent.querySelector('.comment-data') : null;
      if (!dataEl) return;
      let data = [];
      try {
        data = JSON.parse(dataEl.textContent || '[]');
      } catch (e) {
        data = [];
      }

      const lang = thread.getAttribute('data-lang') || getLang();
      const storageKey = `rybezh-comments:${getPostSlug()}:${lang}`;
      const stored = loadStored(storageKey);
      const shuffled = shuffle(data);
      const combined = [...stored, ...shuffled];

      thread.innerHTML = '';
      combined.forEach(item => thread.appendChild(renderComment(item, lang)));

      const countEl = parent ? parent.querySelector('[data-comment-count]') : null;
      if (countEl) countEl.textContent = String(data.length + stored.length);

      const form = parent ? parent.querySelector('.js-comment-form') : null;
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const nameInput = form.querySelector('input[name="name"]');
          const countrySelect = form.querySelector('select[name="country"]');
          const messageInput = form.querySelector('textarea[name="comment"]');
          const status = form.querySelector('.form-message');

          const name = nameInput ? nameInput.value.trim() : '';
          const text = messageInput ? messageInput.value.trim() : '';
          const countryLabel = countrySelect ? countrySelect.value : (lang === 'pl' ? 'PL' : (lang === 'ru' ? 'RU' : 'UA'));
          const country = { flag: flagMap[countryLabel] || '🌍', label: countryLabel };

          if (!name || !text) {
            if (status) status.textContent = lang === 'pl' ? 'Podaj imię i komentarz.' : (lang === 'ru' ? 'Укажите имя и комментарий.' : 'Вкажіть імʼя та коментар.');
            return;
          }

          const newComment = {
            id: `u-${Date.now()}`,
            name,
            country,
            avatar: userAvatars[Math.floor(Math.random() * userAvatars.length)],
            text,
            date: new Date().toISOString()
          };

          const nextStored = [newComment, ...stored];
          saveStored(storageKey, nextStored);
          stored.unshift(newComment);
          thread.insertBefore(renderComment(newComment, lang), thread.firstChild);
          if (countEl) countEl.textContent = String(data.length + stored.length);
          if (status) status.textContent = lang === 'pl' ? 'Komentarz dodany.' : (lang === 'ru' ? 'Комментарий добавлен.' : 'Коментар додано.');

          if (nameInput) nameInput.value = '';
          if (messageInput) messageInput.value = '';
        });
      }
    });
  }

  // ============================================
  // 14. LIVE ACTIVITY (BLOG POSTS)
  // ============================================
  function initLiveActivity() {
    const activity = document.querySelector('.js-live-activity');
    const toastStack = document.querySelector('.js-live-toasts');
    if (!activity || !toastStack) return;

    const labels = {
      ua: {
        statusPool: [
          'Користувач з Польщі читає цю сторінку',
          'Хтось з Кракова переглядає статтю',
          'Читач з Лодзі щойно відкрив пост',
          'Хтось з Вроцлава зберіг вакансію'
        ],
        toastPool: [
          'Хтось завантажив шаблон CV 2 хв тому',
          'Новий коментар від Марини • 3 хв тому',
          'Користувач з Гданська зберіг статтю',
          'Запит на консультацію • щойно'
        ]
      },
      pl: {
        statusPool: [
          'Użytkownik z Polski czyta tę stronę',
          'Ktoś z Krakowa właśnie otworzył artykuł',
          'Czytelnik z Łodzi przegląda post',
          'Ktoś z Wrocławia zapisał ofertę'
        ],
        toastPool: [
          'Ktoś pobrał szablon CV 2 min temu',
          'Nowy komentarz od Mariny • 3 min temu',
          'Użytkownik z Gdańska zapisał artykuł',
          'Zapytanie o konsultację • przed chwilą'
        ]
      }
    };

    const setLabels = () => {
      const lang = getLang();
      const labelEl = activity.querySelector('.live-label');
      const suffixEl = activity.querySelector('.live-suffix');
      const label = activity.getAttribute(`data-label-${lang}`) || activity.getAttribute('data-label-ua') || '';
      const suffix = activity.getAttribute(`data-suffix-${lang}`) || activity.getAttribute('data-suffix-ua') || '';
      if (labelEl) labelEl.textContent = label;
      if (suffixEl) suffixEl.textContent = suffix;
    };

    const countEl = activity.querySelector('[data-live-count]');
    const statusEl = activity.querySelector('[data-live-status]');

    const updateCount = () => {
      const base = 14 + Math.floor(Math.random() * 38);
      if (countEl) countEl.textContent = String(base);
    };

    const updateStatus = () => {
      const lang = getLang();
      const pool = (labels[lang] || labels.ua).statusPool;
      if (statusEl) statusEl.textContent = pool[Math.floor(Math.random() * pool.length)];
    };

    const pushToast = () => {
      const lang = getLang();
      const pool = (labels[lang] || labels.ua).toastPool;
      const toast = document.createElement('div');
      toast.className = 'live-toast';
      toast.textContent = pool[Math.floor(Math.random() * pool.length)];
      toastStack.appendChild(toast);
      setTimeout(() => toast.classList.add('visible'), 50);
      setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 600);
      }, 5200);
    };

    setLabels();
    updateCount();
    updateStatus();
    pushToast();

    const statusTimer = setInterval(updateStatus, 9000 + Math.random() * 7000);
    const countTimer = setInterval(updateCount, 12000 + Math.random() * 9000);
    const toastTimer = setInterval(pushToast, 14000 + Math.random() * 10000);

    window.addEventListener('languageChanged', () => {
      setLabels();
      updateStatus();
    });

    window.addEventListener('beforeunload', () => {
      clearInterval(statusTimer);
      clearInterval(countTimer);
      clearInterval(toastTimer);
    });
  }

  // ============================================
  // INITIALIZE ALL
  // ============================================
  function init() {
    if (!window.USE_INLINE_I18N) {
      initI18n();
    }
    initCookieBanner();
    initTheme();
    initScrollToTop();
    initScrollAnimations();
    initSmoothScroll();
    initMobileMenu();
    initFormEnhancements();
    initPageLoad();
    initTelegramTracking();
    initDateFormatting();
    initImageFallbacks();
    initNewsletter();
    initContactForm();
    initCalculator();
    initCommentThreads();
    // Disabled: synthetic "live activity" widget can look deceptive to users/search engines.
    // initLiveActivity();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
