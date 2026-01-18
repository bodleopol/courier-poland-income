/**
 * Rybezh Site - Main JavaScript
 * Features: i18n, Cookie Banner, Dark Theme, Scroll to Top, Animations
 */

(function() {
  'use strict';

  // ============================================
  // 1. TRANSLATIONS (i18n)
  // ============================================
  const translations = {
    'meta.title': { ua: "Rybezh — Робота кур'єром у Польщі", pl: 'Rybezh — Praca kurierem w Polsce' },
    'meta.description': { ua: "Актуальні вакансії кур'єрів у містах Польщі. Робота з гнучким графіком, щоденними виплатами.", pl: 'Aktualne oferty pracy kuriera w miastach Polski. Praca na elastyczny grafik, codzienne wypłaty.' },
    'brand.name': { ua: 'Rybezh', pl: 'Rybezh' },
    'brand.tagline': { ua: "rybezh.site — робота кур'єром у Польщі", pl: 'rybezh.site — praca kurierem w Polsce' },
    'nav.home': { ua: 'Головна', pl: 'Strona główna' },
    'nav.jobs': { ua: 'Вакансії', pl: 'Oferty pracy' },
    'nav.about': { ua: 'Про нас', pl: 'O nas' },
    'nav.blog': { ua: 'Блог', pl: 'Blog' },
    'nav.faq': { ua: 'FAQ', pl: 'FAQ' },
    'nav.contact': { ua: 'Контакти', pl: 'Kontakt' },
    'nav.cta': { ua: 'Отримати консультацію', pl: 'Uzyskaj konsultację' },
    'nav.apply': { ua: 'Подати заявку', pl: 'Złóż wniosek' },
    'hero.title': { ua: "Знайдіть роботу кур'єром у Польщі", pl: 'Znajdź pracę kurierem w Polsce' },
    'hero.lead': { ua: "Актуальні вакансії кур'єрів у 20+ містах Польщі. Гнучкий графік, щоденні виплати.", pl: 'Aktualne oferty pracy kurierskiej w ponad 20 miastach Polski. Elastyczny grafik, codzienne wypłaty.' },
    'home.hero.title': { ua: '🚀 Робота мрії чекає тебе!', pl: '🚀 Praca marzeń czeka na Ciebie!' },
    'home.hero.subtitle': { ua: '<strong>Тисячі кур\'єрів вже заробляють</strong> у Польщі. 📦 Безкоштовна консультація, <strong>щоденні виплати</strong> 💰 та <strong>гнучкий графік</strong> ⏰', pl: '<strong>Tysiące kurierów już zarabia</strong> w Polsce. 📦 Bezpłatna konsultacja, <strong>codzienne wypłaty</strong> 💰 i <strong>elastyczny grafik</strong> ⏰' },
    'home.hero.cta_primary': { ua: 'Почати прямо зараз', pl: 'Zacznij teraz' },
    'home.hero.cta_secondary': { ua: 'Переглянути вакансії', pl: 'Zobacz oferty' },
    'home.stats.title': { ua: '📊 Статистика успіху', pl: '📊 Statystyki sukcesu' },
    'home.stats.couriers.line1': { ua: 'Кур\'єрів скористалось', pl: 'Kurierów skorzystało' },
    'home.stats.couriers.line2': { ua: 'нашими послугами', pl: 'z naszych usług' },
    'home.stats.partners.line1': { ua: 'Партнерських компаній', pl: 'Firm partnerskich' },
    'home.stats.partners.line2': { ua: 'у Польщі', pl: 'w Polsce' },
    'home.stats.cities.line1': { ua: 'Міст із вакансіями', pl: 'Miast z ofertami' },
    'home.stats.cities.line2': { ua: 'від Варшави до Гданська', pl: 'od Warszawy po Gdańsk' },
    'home.stats.rating.line1': { ua: 'Рейтинг задоволення', pl: 'Ocena zadowolenia' },
    'home.stats.rating.line2': { ua: 'від кур\'єрів', pl: 'od kurierów' },
    'home.testimonials.title': { ua: '💬 Що кажуть кур\'єри', pl: '💬 Co mówią kurierzy' },
    'home.testimonials.t1.quote': { ua: '"Дуже задоволений! За 3 дні отримав все необхідне та почав роботу. Підтримка команди Rybezh — просто супер!"', pl: '"Jestem bardzo zadowolony! W 3 dni dostałem wszystko, co potrzebne i zacząłem pracę. Wsparcie Rybezh jest świetne!"' },
    'home.testimonials.t1.name': { ua: 'Ігор К., Варшава', pl: 'Igor K., Warszawa' },
    'home.testimonials.t1.role': { ua: 'Кур\'єр з 6 міс. досвіду', pl: 'Kurier z 6 mies. doświadczenia' },
    'home.testimonials.t2.quote': { ua: '"Я приїхав з нічим, а за місяць вже купив велосипед. Щоденні виплати як обіцяно. Рекомендую!"', pl: '"Przyjechałem bez niczego, a po miesiącu kupiłem rower. Codzienne wypłaty zgodnie z obietnicą. Polecam!"' },
    'home.testimonials.t2.name': { ua: 'Максим В., Краків', pl: 'Maksym W., Kraków' },
    'home.testimonials.t2.role': { ua: 'Кур\'єр з 3 міс. досвіду', pl: 'Kurier z 3 mies. doświadczenia' },
    'home.testimonials.t3.quote': { ua: '"Гнучкий графік дозволяє мені вчитися та одночасно заробляти. Це саме то, що мені потрібно було!"', pl: '"Elastyczny grafik pozwala mi się uczyć i jednocześnie zarabiać. To dokładnie to, czego potrzebowałem!"' },
    'home.testimonials.t3.name': { ua: 'Софія Л., Вроцлав', pl: 'Sofia L., Wrocław' },
    'home.testimonials.t3.role': { ua: 'Студентка, 4 міс. досвіду', pl: 'Studentka, 4 mies. doświadczenia' },
    'home.search.title': { ua: '🔍 Знайди роботу за містом:', pl: '🔍 Znajdź pracę według miasta:' },
    'home.features.title': { ua: '✨ Більше ніж просто робота', pl: '✨ Więcej niż tylko praca' },
    'home.features.f1.title': { ua: '💵 Щоденні виплати', pl: '💵 Codzienne wypłaty' },
    'home.features.f1.text': { ua: 'Отримуй гроші прямо в день роботи', pl: 'Otrzymuj pieniądze tego samego dnia' },
    'home.features.f2.title': { ua: '⏰ Гнучкий графік', pl: '⏰ Elastyczny grafik' },
    'home.features.f2.text': { ua: 'Працюй коли захочеш, скільки захочеш', pl: 'Pracuj kiedy chcesz i ile chcesz' },
    'home.features.f3.title': { ua: '🤝 Повна підтримка 24/7', pl: '🤝 Pełne wsparcie 24/7' },
    'home.features.f3.text': { ua: 'Допомога з документами та легалізацією', pl: 'Pomoc z dokumentami i legalizacją' },
    'search.sr': { ua: 'Пошук', pl: 'Szukaj' },
    'search.placeholder': { ua: 'Пошук за містом або типом роботи', pl: 'Szukaj według miasta lub rodzaju pracy' },
    'search.button': { ua: 'Знайти', pl: 'Znajdź' },
    'city.all': { ua: 'Всі міста', pl: 'Wszystkie miasta' },
    'jobs.cta': { ua: 'Деталі', pl: 'Szczegóły' },
    'cta.heading': { ua: 'Потрібна допомога з оформленням?', pl: 'Potrzebujesz pomocy z dokumentami?' },
    'cta.lead': { ua: 'Залиште заявку — ми допоможемо з документами та підбором роботи.', pl: 'Zostaw zgłoszenie — pomożemy z dokumentami i doborem pracy.' },
    'cta.ready': { ua: 'Готові почати?', pl: 'Gotowy, by zacząć?' },
    'cta.sub': { ua: 'Отримайте консультацію та почніть заробляти вже сьогодні.', pl: 'Uzyskaj konsultację i zacznij zarabiać już dziś.' },
    'cta.button': { ua: 'Подати заявку', pl: 'Złóż wniosek' },
    'footer.rights': { ua: 'Всі права захищені.', pl: 'Wszelkie prawa zastrzeżone.' },
    'footer.privacy': { ua: 'Політика конфіденційності', pl: 'Polityka prywatności' },
    'footer.desc': { ua: "Допомагаємо знайти стабільну роботу кур'єром у Польщі. Гнучкий графік, щоденні виплати, підтримка 24/7.", pl: 'Pomagamy znaleźć stabilną pracę kurierem w Polsce. Elastyczny grafik, codzienne wypłaty, wsparcie 24/7.' },
    'footer.nav': { ua: 'Навігація', pl: 'Nawigacja' },
    'footer.jobs': { ua: 'Вакансії', pl: 'Oferty pracy' },
    'footer.contact': { ua: 'Контакти', pl: 'Kontakt' },
    'footer.newsletter.title': { ua: 'Підписка', pl: 'Subskrypcja' },
    'footer.newsletter.text': { ua: 'Нові вакансії та статті.', pl: 'Nowe oferty i artykuły.' },
    'footer.newsletter.placeholder': { ua: 'Ваш email', pl: 'Twój email' },
    'footer.newsletter.success': { ua: 'Дякуємо!', pl: 'Dziękujemy!' },
    'calc.title': { ua: 'Калькулятор заробітку', pl: 'Kalkulator zarobków' },
    'calc.hours': { ua: 'Годин на тиждень', pl: 'Godzin tygodniowo' },
    'calc.rate': { ua: 'Ставка (PLN/год)', pl: 'Stawka (PLN/h)' },
    'calc.result': { ua: 'Ваш дохід на місяць:', pl: 'Twój dochód miesięczny:' },
    'calc.note': { ua: '*приблизний розрахунок', pl: '*przybliżone obliczenia' },
    'label.telegram': { ua: 'Telegram', pl: 'Telegram' },
    'label.email': { ua: 'Пошта', pl: 'Poczta' },
    'placeholder.name': { ua: 'Петро', pl: 'Piotr' },
    'placeholder.contact': { ua: '+48 123 456 789 або email@mail.com', pl: '+48 123 456 789 lub email@mail.com' },
    'placeholder.city': { ua: 'Варшава, Краків...', pl: 'Warszawa, Kraków...' },
    'placeholder.message': { ua: 'Додайте деталі', pl: 'Dodaj szczegóły' },
    'placeholder.exp': { ua: 'Наприклад: 2 роки на доставці', pl: 'Na przykład: 2 lata w dostawach' },
    'apply.meta_title': { ua: "Подати заявку — Rybezh | Робота кур'єром у Польщі", pl: 'Złóż wniosek — Rybezh | Praca kurierem w Polsce' },
    'apply.meta_description': { ua: "Заповніть форму для безкоштовної консультації щодо роботи кур'єром у Польщі. Швидке працевлаштування, гнучкий графік, щоденні виплати!", pl: 'Wypełnij formularz bezpłatnej konsultacji dotyczącej pracy kuriera w Polsce. Szybkie zatrudnienie, elastyczny grafik, codzienne wypłaty!' },
    'apply.title': { ua: 'Швидка заявка', pl: 'Szybka aplikacja' },
    'apply.intro': { ua: 'Кілька полів — і ми підберемо варіанти роботи та допоможемо з документами.', pl: 'Kilka pól — i dobierzemy oferty pracy oraz pomożemy z dokumentami.' },
    'label.name': { ua: "Ім'я", pl: 'Imię' },
    'label.contact': { ua: 'Телефон або email', pl: 'Telefon lub email' },
    'label.city': { ua: 'Місто', pl: 'Miasto' },
    'label.start': { ua: 'Готовий почати', pl: 'Gotowy do startu' },
    'label.exp': { ua: 'Досвід (коротко)', pl: 'Doświadczenie (krótko)' },
    'label.message': { ua: 'Додаткова інформація', pl: 'Dodatkowe informacje' },
    'label.consent': { ua: 'Я погоджуюсь на обробку моїх контактних даних', pl: 'Wyrażam zgodę na przetwarzanie moich danych kontaktowych' },
    'btn.submit': { ua: 'Надіслати заявку', pl: 'Wyślij zgłoszenie' },
    'btn.clear': { ua: 'Очистити', pl: 'Wyczyść' },
    'aside.help': { ua: 'Потрібна допомога?', pl: 'Potrzebujesz pomocy?' },
    'aside.text': { ua: 'Ми допомагаємо з документами, легалізацією та підбором вакансій. Заявки обробляємо протягом 24 годин.', pl: 'Pomagamy z dokumentami, legalizacją i doborem ofert. Zgłoszenia przetwarzamy w ciągu 24 godzin.' },
    'btn.back': { ua: 'Повернутись на головну', pl: 'Powrót na stronę główną' },
    'aside.contacts': { ua: 'Контакти', pl: 'Kontakt' },
    'about.meta_title': { ua: "Про нас — Rybezh | Робота кур'єром у Польщі", pl: 'O nas — Rybezh | Praca kurierem w Polsce' },
    'about.meta_description': { ua: "Rybezh — ваш надійний партнер у пошуку роботи кур'єром у Польщі. Ми допомагаємо з працевлаштуванням, документами та адаптацією.", pl: 'Rybezh to Twój zaufany partner w znalezieniu pracy kuriera w Polsce. Pomagamy w zatrudnieniu, dokumentach i adaptacji.' },
    'about.title': { ua: 'Про нас', pl: 'O nas' },
    'about.text': { ua: "<strong>Rybezh</strong> — це команда професіоналів, яка допомагає українцям та іноземцям знайти стабільну роботу кур'єром у Польщі. Ми співпрацюємо з провідними логістичними компаніями та сервісами доставки їжі.", pl: "<strong>Rybezh</strong> to zespół profesjonalistów pomagający Ukraińcom i obcokrajowcom znaleźć stabilną pracę jako kurier w Polsce. Współpracujemy z wiodącymi firmami logistycznymi i serwisami dostawy jedzenia." },
    'about.mission': { ua: 'Наша місія', pl: 'Nasza misja' },
    'about.mission_text': { ua: 'Ми прагнемо зробити процес працевлаштування за кордоном простим, прозорим та безпечним. Ми надаємо повний супровід: від першої консультації до підписання договору та виходу на першу зміну.', pl: 'Dążymy do tego, aby proces zatrudnienia za granicą był prosty, przejrzysty i bezpieczny. Zapewniamy pełne wsparcie: od pierwszej konsultacji po podpisanie umowy i pierwszą zmianę.' },
    'about.why': { ua: 'Чому обирають нас', pl: 'Dlaczego my' },
    'about.why_text': { ua: 'Ми пропонуємо лише перевірені вакансії, допомагаємо з легалізацією та надаємо підтримку 24/7. З нами ви можете бути впевнені у своєму завтрашньому дні.', pl: 'Oferujemy tylko sprawdzone oferty pracy, pomagamy w legalizacji i zapewniamy wsparcie 24/7. Z nami możesz być pewny swojego jutra.' },
    'about.advantages': { ua: 'Наші переваги', pl: 'Nasze zalety' },
    'about.how_we_work': { ua: 'Як ми працюємо', pl: 'Jak pracujemy' },
    'about.step1': { ua: '1️⃣ Консультація (Безкоштовно)', pl: '1️⃣ Konsultacja (Bezpłatnie)' },
    'about.step2': { ua: '2️⃣ Підбір вакансії', pl: '2️⃣ Dobór oferty pracy' },
    'about.step3': { ua: '3️⃣ Оформлення документів', pl: '3️⃣ Formalizacja dokumentów' },
    'about.step4': { ua: '4️⃣ Початок роботи', pl: '4️⃣ Rozpoczęcie pracy' },
    'about.contacts': { ua: 'Контакти', pl: 'Kontakt' },
    'about.ready': { ua: 'Готові до змін? 🚀', pl: 'Gotowi na zmiany? 🚀' },
    'contact.meta_title': { ua: "Контакти — Rybezh | Зв'яжіться з нами", pl: 'Kontakt — Rybezh | Skontaktuj się z nami' },
    'contact.meta_description': { ua: "Зв'яжіться з нами для отримання консультації щодо роботи кур'єром у Польщі. Telegram, Email, підтримка 24/7.", pl: 'Skontaktuj się z nami w sprawie konsultacji dotyczącej pracy kuriera w Polsce. Telegram, email, wsparcie 24/7.' },
    'contact.title': { ua: 'Контакти', pl: 'Kontakt' },
    'contact.text': { ua: "Маєте запитання? Зв'яжіться з нами будь-яким зручним способом.", pl: 'Masz pytania? Skontaktuj się z nami w dowolny wygodny sposób.' },
    'contact.telegram': { ua: 'Написати в Telegram', pl: 'Napisz na Telegram' },
    'privacy.meta_title': { ua: 'Політика конфіденційності — Rybezh', pl: 'Polityka prywatności — Rybezh' },
    'privacy.meta_description': { ua: 'Політика конфіденційності Rybezh. Дізнайтеся, як ми обробляємо ваші дані та захищаємо вашу приватність.', pl: 'Polityka prywatności Rybezh. Dowiedz się, jak przetwarzamy Twoje dane i chronimy Twoją prywatność.' },
    'privacy.title': { ua: 'Політика конфіденційності', pl: 'Polityka prywatności' },
    'privacy.text': { ua: "<h2>1. Загальні положення</h2><p>Ця Політика конфіденційності визначає порядок отримання, зберігання, обробки, використання і розкриття персональних даних користувача. Ми поважаємо вашу конфіденційність і зобов'язуємося захищати ваші персональні дані.</p><h2>2. Збір даних</h2><p>Ми можемо збирати наступні дані: ім'я, прізвище, номер телефону, адреса електронної пошти, місто проживання, інформація про досвід роботи. Ці дані надаються вами добровільно при заповненні форм на сайті.</p><h2>3. Використання даних</h2><p>Зібрані дані використовуються для: зв'язку з вами, надання консультацій щодо працевлаштування, підбору вакансій, покращення роботи нашого сервісу.</p><h2>4. Захист даних</h2><p>Ми вживаємо всіх необхідних технічних та організаційних заходів для захисту ваших даних від несанкціонованого доступу, втрати або зміни.</p><h2>5. Файли Cookie</h2><p>Наш сайт використовує файли cookie для покращення взаємодії з користувачем. Ви можете налаштувати свій браузер для відмови від cookie, але це може вплинути на функціональність сайту.</p><h2>6. Ваші права</h2><p>Ви маєте право на доступ до своїх даних, їх виправлення або видалення. Для цього зв'яжіться з нами через контактні дані на сайті.</p>", pl: "<h2>1. Postanowienia ogólne</h2><p>Niniejsza Polityka prywatności określa zasady gromadzenia, przechowywania, przetwarzania, wykorzystywania i ujawniania danych osobowych użytkownika. Szanujemy Twoją prywatność i zobowiązujemy się do ochrony Twoich danych osobowych.</p><h2>2. Gromadzenie danych</h2><p>Możemy gromadzić następujące dane: imię, nazwisko, numer telefonu, adres e-mail, miasto zamieszkania, informacje o doświadczeniu zawodowym. Dane te są podawane dobrowolnie podczas wypełniania formularzy na stronie.</p><h2>3. Wykorzystanie danych</h2><p>Zgromadzone dane są wykorzystywane do: kontaktu z Tobą, udzielania konsultacji w sprawie zatrudnienia, doboru ofert pracy, ulepszania działania naszego serwisu.</p><h2>4. Ochrona danych</h2><p>Podejmujemy wszelkie niezbędne środki techniczne i organizacyjne w celu ochrony Twoich danych przed nieautoryzowanym dostępem, utratą lub zmianą.</p><h2>5. Pliki Cookie</h2><p>Nasza strona używa plików cookie w celu poprawy doświadczeń użytkownika. Możesz skonfigurować swoją przeglądarkę, aby odrzucała pliki cookie, ale może to wpłynąć na funkcjonalność strony.</p><h2>6. Twoje prawa</h2><p>Masz prawo do dostępu do swoich danych, ich poprawiania lub usunięcia. W tym celu skontaktuj się z nami za pośrednictwem danych kontaktowych na stronie.</p>" },
    'faq.meta_title': { ua: "Часті запитання (FAQ) — Rybezh | Робота кур'єром", pl: 'Częste pytania (FAQ) — Rybezh | Praca kurierem' },
    'faq.meta_description': { ua: 'Відповіді на поширені запитання про роботу курʼєром у Польщі. Зарплата, графік, документи, вимоги.', pl: 'Odpowiedzi na najczęstsze pytania o pracę kuriera w Polsce. Wynagrodzenie, grafik, dokumenty, wymagania.' },
    'faq.title': { ua: 'Часті запитання', pl: 'Częste pytania' },
    'faq.text': { ua: "<details><summary>Чи потрібен власний транспорт?</summary><p>Можна працювати на власному авто, велосипеді, скутері або пішки (у деяких містах). Також ми допомагаємо з орендою транспорту.</p></details><details><summary>Коли я отримаю першу виплату?</summary><p>Виплати здійснюються щотижня або щоденно, залежно від обраного партнера та умов.</p></details><details><summary>Чи потрібен досвід роботи?</summary><p>Ні, досвід не обов'язковий. Ми проводимо навчання перед початком роботи.</p></details><details><summary>Які документи потрібні?</summary><p>Паспорт, віза або карта побиту (для іноземців), номер PESEL. Для водіїв — водійське посвідчення.</p></details><details><summary>Скільки можна заробити?</summary><p>Заробіток залежить від кількості годин та доставок. В середньому кур'єри заробляють від 25 до 40 злотих на годину.</p></details>", pl: "<details><summary>Czy potrzebuję własnego pojazdu?</summary><p>Możesz pracować własnym samochodem, rowerem, skuterem lub pieszo (w niektórych miastach). Pomagamy również w wynajmie pojazdów.</p></details><details><summary>Kiedy otrzymam pierwszą wypłatę?</summary><p>Wypłaty są realizowane tygodniowo lub codziennie, w zależności od wybranego partnera i warunków.</p></details><details><summary>Czy wymagane jest doświadczenie?</summary><p>Nie, doświadczenie nie jest wymagane. Zapewniamy szkolenie przed rozpoczęciem pracy.</p></details><details><summary>Jakie dokumenty są potrzebne?</summary><p>Paszport, wiza lub karta pobytu (dla obcokrajowców), numer PESEL. Dla kierowców — prawo jazdy.</p></details><details><summary>Ile mogę zarobić?</summary><p>Zarobki zależą od liczby godzin i dostaw. Średnio kurierzy zarabiają od 25 do 40 złotych na godzinę.</p></details>" },
    'cookie.banner.text': { ua: 'Ми використовуємо файли cookie для покращення вашого досвіду. Залишаючись на сайті, ви погоджуєтесь на їх використання.', pl: 'Używamy plików cookie, aby poprawić Twoje wrażenia. Pozostając na stronie, zgadzasz się na ich użycie.' },
    'cookie.banner.accept': { ua: 'Прийняти', pl: 'Akceptuj' },
    'theme.light': { ua: 'Світла тема', pl: 'Jasny motyw' },
    'theme.dark': { ua: 'Темна тема', pl: 'Ciemny motyw' },
    'scroll.top': { ua: 'Вгору', pl: 'Do góry' },
    // Blog
    'blog.title': { ua: 'Блог Rybezh', pl: 'Blog Rybezh' },
    'blog.meta_title': { ua: 'Блог — Rybezh | Поради для кур\'єрів', pl: 'Blog — Rybezh | Porady dla kurierów' },
    'blog.meta_description': { ua: 'Корисні статті та поради для кур\'єрів у Польщі. Як заробляти більше, документи, адаптація, безпека.', pl: 'Przydatne artykuły i porady dla kurierów w Polsce. Zarobki, dokumenty, adaptacja, bezpieczeństwo.' },
    'blog.subtitle': { ua: 'Корисні статті та новини для кур\'єрів', pl: 'Przydatne artykuły i wiadomości dla kurierów' },
    'blog.read_more': { ua: 'Читати далі →', pl: 'Czytaj więcej →' },
    'blog.back': { ua: '← До списку статей', pl: '← Do listy artykułów' },
    'blog.pagination.prev': { ua: '← Назад', pl: '← Wstecz' },
    'blog.pagination.next': { ua: 'Вперед →', pl: 'Dalej →' },
    // Article template (legacy)
    'article.step1': { ua: 'Крок 1: Перевірте наявність основних документів', pl: 'Krok 1: Sprawdź podstawowe dokumenty' },
    'article.step2': { ua: 'Крок 2: Заповніть анкету на Rybezh', pl: 'Krok 2: Wypełnij formularz Rybezh' },
    'article.step3': { ua: 'Крок 3: Отримайте PESEL', pl: 'Krok 3: Uzyskaj PESEL' },
    'article.step4': { ua: 'Крок 4: Зареєструйтеся на платформі доставки', pl: 'Krok 4: Zarejestruj się na platformie dostaw' },
    'article.step5': { ua: 'Крок 5: Активуйте рахунок', pl: 'Krok 5: Aktywuj konto' },
    'article.step6': { ua: 'Крок 6: Отримайте своє перше замовлення', pl: 'Krok 6: Odbierz swoje pierwsze zamówienie' },
    'article.step7': { ua: 'Крок 7: Отримайте першу виплату', pl: 'Krok 7: Odbierz pierwszą wypłatę' },
    'article.tip.routes': { ua: '📍 Обирайте знайомі маршрути', pl: '📍 Wybieraj znane trasy' },
    'article.tip.quality': { ua: '⭐ Забудьте про продуктивність — сконцентруйтеся на якості', pl: '⭐ Zapomnij o produktywności — skup się na jakości' },
    'article.tip.phone': { ua: '📱 Завжди тримайте телефон зарядженим', pl: '📱 Zawsze trzymaj telefon naładowany' },
    'article.tip.transport': { ua: '🚴 Виберіть зручний транспорт', pl: '🚴 Wybierz wygodny transport' },
    'article.mistake.too_many': { ua: '❌ Прийняття занадто багатьох замовлень одночасно', pl: '❌ Przyjmowanie zbyt wielu zamówień naraz' },
    'article.mistake.communication': { ua: '❌ Не перевіряти комунікацію з клієнтом', pl: '❌ Brak komunikacji z klientem' },
    'article.mistake.safety': { ua: '❌ Ігнорування правил безпеки', pl: '❌ Ignorowanie zasad bezpieczeństwa' },
    'article.cta.title': { ua: 'Готові почати?', pl: 'Gotowy, by zacząć?' },
    'article.related': { ua: '📚 Читайте також:', pl: '📚 Zobacz też:' },
    'article.main.title': { ua: 'Як почати роботу кур\'єром у Польщі за 3 дні', pl: 'Jak rozpocząć pracę kuriera w Polsce w 3 dni' },
    // Job article template
    'job.article.cta_title': { ua: 'Готові почати?', pl: 'Gotowy, by zacząć?' },
    'job.article.why': { ua: '💡 Чому саме ми?', pl: '💡 Dlaczego my?' },
    // 404 Page
    '404.title': { ua: 'Сторінка не знайдена — Rybezh', pl: 'Strona nie znaleziona — Rybezh' },
    '404.meta_description': { ua: "Сторінка не знайдена. Поверніться на головну для пошуку роботи кур'єром у Польщі.", pl: 'Strona nie została znaleziona. Wróć na stronę główną, aby znaleźć pracę kuriera w Polsce.' },
    '404.heading': { ua: 'Сторінка не знайдена', pl: 'Strona nie znaleziona' },
    '404.message': { ua: 'На жаль, сторінка, яку ви шукаєте, не існує або була переміщена. Можливо, кур\'єр забув її доставити! 📦', pl: 'Niestety, strona, której szukasz, nie istnieje lub została przeniesiona. Może kurier zapomniał jej dostarczyć! 📦' },
    '404.home': { ua: 'Повернутись на головну', pl: 'Powrót na stronę główną' },
    '404.jobs': { ua: 'Переглянути вакансії', pl: 'Zobacz oferty pracy' },
    '404.contact': { ua: 'Зв\'язатися з нами', pl: 'Skontaktuj się z nami' },
    '404.popular': { ua: 'Популярні розділи:', pl: 'Popularne sekcje:' },
    '404.link.jobs': { ua: '📋 Актуальні вакансії', pl: '📋 Aktualne oferty pracy' },
    '404.link.blog': { ua: '📰 Корисні статті в блозі', pl: '📰 Przydatne artykuły w blogu' },
    '404.link.apply': { ua: '✍️ Подати заявку на роботу', pl: '✍️ Złóż wniosek o pracę' },
    '404.link.faq': { ua: '❓ Часті запитання (FAQ)', pl: '❓ Często zadawane pytania (FAQ)' },
    'share.title': { ua: 'Поділитися вакансією:', pl: 'Udostępnij ofertę:' },
    'footer.legal': { ua: 'Правова інформація', pl: 'Informacje prawne' },
    // Cities
    'city.warszawa': { ua: 'Варшава', pl: 'Warszawa' },
    'city.krakow': { ua: 'Краків', pl: 'Kraków' },
    'city.gdansk': { ua: 'Гданськ', pl: 'Gdańsk' },
    'city.wroclaw': { ua: 'Вроцлав', pl: 'Wrocław' },
    'city.poznan': { ua: 'Познань', pl: 'Poznań' },
    'city.lodz': { ua: 'Лодзь', pl: 'Łódź' },
    'city.katowice': { ua: 'Катовіце', pl: 'Katowice' },
    'city.szczecin': { ua: 'Щецін', pl: 'Szczecin' },
    'city.lublin': { ua: 'Люблін', pl: 'Lublin' },
    'city.bialystok': { ua: 'Білосток', pl: 'Białystok' },
    'city.bydgoszcz': { ua: 'Бидгощ', pl: 'Bydgoszcz' },
    'city.rzeszow': { ua: 'Жешув', pl: 'Rzeszów' },
    'city.torun': { ua: 'Торунь', pl: 'Toruń' },
    'city.czestochowa': { ua: 'Ченстохова', pl: 'Częstochowa' },
    'city.radom': { ua: 'Радом', pl: 'Radom' },
    'city.sosnowiec': { ua: 'Сосновець', pl: 'Sosnowiec' },
    'city.kielce': { ua: 'Кельце', pl: 'Kielce' },
    'city.gliwice': { ua: 'Гливіце', pl: 'Gliwice' },
    'city.olsztyn': { ua: 'Ольштин', pl: 'Olsztyn' },
    'city.bielsko': { ua: 'Бєльско-Бяла', pl: 'Bielsko-Biała' },
    'city.all': { ua: 'Всі міста', pl: 'Wszystkie miasta' }
  };

  // Get current language
  const STORAGE_KEY = 'site_lang';
  const LEGACY_KEY = 'siteLang';
  function getLang() {
    return localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY) || 'ua';
  }

  // Set language
  function setLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    localStorage.setItem(LEGACY_KEY, lang);
    applyTranslations(lang);
    updateLangButtons(lang);
  }

  // Apply translations to page
  function interpolateText(text) {
    if (typeof text !== 'string') return text;
    return text.replace(/\$\{year\}/g, String(new Date().getFullYear()));
  }

  function applyTranslations(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const dict = translations[key];
      if (!dict) return;
      const text = (dict[lang] !== undefined) ? dict[lang] : (dict.ua || '');
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
    document.documentElement.lang = lang === 'ua' ? 'uk' : 'pl';
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
    
    const lang = getLang();
    applyTranslations(lang);
    updateLangButtons(lang);

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const newLang = btn.getAttribute('data-lang');
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
    
    if (!animatedElements.length) return;

    if (!('IntersectionObserver' in window)) {
      animatedElements.forEach(el => {
        el.classList.remove('animate-ready');
        el.classList.add('animate-in');
      });
      return;
    }

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
  // 11. NEWSLETTER FORM
  // ============================================
  function initNewsletter() {
    // URL Google Apps Script (той самий, що і для форми заявки)
    const GSA_URL = 'https://script.google.com/macros/s/AKfycbyZIupzVZo3q5UDGVSBzEaw1vdKFJcaEyTh5iuMgBECdd7VWE4Hq7cZ1WNL6V6Jy1FdMg/exec';
    const GEO_URL = 'https://ipapi.co/json/';

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
    initNewsletter();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
