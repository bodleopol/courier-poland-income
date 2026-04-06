import json
import random
import uuid

cities = [
    ("Варшава", "Warszawa"),
    ("Краків", "Kraków"),
    ("Вроцлав", "Wrocław"),
    ("Познань", "Poznań"),
    ("Гданськ", "Gdańsk"),
    ("Лодзь", "Łódź"),
    ("Щецин", "Szczecin"),
    ("Катовіце", "Katowice")
]

categories = ["construction", "production", "logistics", "cleaning", "hospitality"]

def generate_vacancy(index):
    city_ua, city_pl = random.choice(cities)
    category = random.choice(categories)

    slug = f"{city_pl.lower()}-{category}-worker-new-{index}-{uuid.uuid4().hex[:6]}"

    if category == "construction":
        title_ua = f"Монтажник металоконструкцій — {city_ua}"
        title_pl = f"Monter konstrukcji stalowych — {city_pl}"
        company = f"BudPol {city_pl}"
        tasks_ua = ["Монтаж металоконструкцій за кресленнями.", "Робота на висоті.", "Підготовка елементів до зварювання."]
        tasks_pl = ["Montaż konstrukcji stalowych według rysunków.", "Praca na wysokości.", "Przygotowanie elementów do spawania."]
        details_ua = ["Досвід від 1 року.", "Вміння читати технічні креслення.", "Дозвіл на роботу на висоті."]
        details_pl = ["Doświadczenie od 1 roku.", "Umiejętność czytania rysunków technicznych.", "Uprawnienia do pracy na wysokości."]
        body_ua = f"Шукаємо досвідченого монтажника металоконструкцій для роботи на великих будівельних об'єктах у {city_ua}. Офіційне працевлаштування, забезпечення спецодягом та всіма необхідними інструментами. Якщо ви маєте досвід та вмієте читати креслення, ця робота для вас. Стабільна оплата та дружній колектив гарантовані."
        body_pl = f"Szukamy doświadczonego montera konstrukcji stalowych do pracy na dużych obiektach budowlanych w {city_pl}. Legalne zatrudnienie, zapewniamy odzież roboczą i wszystkie niezbędne narzędzia. Jeśli masz doświadczenie i potrafisz czytać rysunki, ta praca jest dla ciebie. Gwarantujemy stabilne wynagrodzenie i przyjazny zespół."
    elif category == "production":
        title_ua = f"Оператор виробничої лінії — {city_ua}"
        title_pl = f"Operator linii produkcyjnej — {city_pl}"
        company = f"Fabryka {city_pl} Plus"
        tasks_ua = ["Обслуговування виробничих машин.", "Контроль якості готової продукції.", "Дрібний ремонт та налаштування обладнання."]
        tasks_pl = ["Obsługa maszyn produkcyjnych.", "Kontrola jakości gotowych produktów.", "Drobne naprawy i ustawianie sprzętu."]
        details_ua = ["Досвід роботи на виробництві.", "Готовність до позмінної роботи.", "Уважність до деталей."]
        details_pl = ["Doświadczenie w pracy na produkcji.", "Gotowość do pracy zmianowej.", "Dbałość o szczegóły."]
        body_ua = f"На сучасне виробництво у {city_ua} потрібен оператор машин. Пропонуємо комфортні умови праці в теплому та чистому цеху, стабільний графік та систему преміювання. Робота не вимагає важких фізичних навантажень, але потребує уважності. Навчання проводиться на місці."
        body_pl = f"Nowoczesna fabryka w {city_pl} poszukuje operatora maszyn. Oferujemy komfortowe warunki pracy w ciepłej i czystej hali, stabilny grafik i system premiowy. Praca nie wymaga dużego wysiłku fizycznego, ale wymaga skupienia. Szkolenie odbywa się na miejscu."
    elif category == "logistics":
        title_ua = f"Водій навантажувача (Карщик) — {city_ua}"
        title_pl = f"Operator wózka widłowego — {city_pl}"
        company = f"Logis {city_pl} Hub"
        tasks_ua = ["Завантаження та розвантаження товарів.", "Розміщення палет на висотних стелажах.", "Співпраця з комірниками."]
        tasks_pl = ["Załadunek i rozładunek towarów.", "Rozmieszczanie palet na wysokich regałach.", "Współpraca z magazynierami."]
        details_ua = ["Наявність польських прав UDT.", "Досвід роботи від 6 місяців.", "Відповідальність."]
        details_pl = ["Polskie uprawnienia UDT.", "Doświadczenie od 6 miesięcy.", "Odpowiedzialność."]
        body_ua = f"Логістичний центр у {city_ua} шукає водія навантажувача (карщика) з правами UDT. Робота на сучасному складі класу А. Ми пропонуємо високу погодинну ставку, премії за продуктивність та безкоштовні гарячі напої. Допомагаємо з оформленням документів та пошуком житла."
        body_pl = f"Centrum logistyczne w {city_pl} szuka operatora wózka widłowego z uprawnieniami UDT. Praca w nowoczesnym magazynie klasy A. Oferujemy wysoką stawkę godzinową, premie za wydajność i darmowe gorące napoje. Pomagamy w załatwieniu dokumentów i znalezieniu mieszkania."
    elif category == "cleaning":
        title_ua = f"Спеціаліст з клінінгу (офіси) — {city_ua}"
        title_pl = f"Pracownik sprzątający biura — {city_pl}"
        company = f"Błysk {city_pl}"
        tasks_ua = ["Прибирання офісних приміщень.", "Підтримання чистоти на кухні та в санвузлах.", "Заміна витратних матеріалів."]
        tasks_pl = ["Sprzątanie pomieszczeń biurowych.", "Utrzymanie czystości w kuchni i łazienkach.", "Uzupełnianie artykułów higienicznych."]
        details_ua = ["Охайність та пунктуальність.", "Досвід у клінінгу вітається.", "Базове знання польської мови."]
        details_pl = ["Schludność i punktualność.", "Mile widziane doświadczenie w sprzątaniu.", "Podstawowa znajomość języka polskiego."]
        body_ua = f"Клінінгова компанія шукає працівника для прибирання сучасного бізнес-центру в {city_ua}. Робота в зручний час, стабільний графік з понеділка по п'ятницю. Надаємо якісну гіпоалергенну хімію та зручний робочий одяг. Приємний колектив та лояльне керівництво."
        body_pl = f"Firma sprzątająca szuka pracownika do utrzymania czystości w nowoczesnym centrum biznesowym w {city_pl}. Praca w dogodnych godzinach, stabilny grafik od poniedziałku do piątku. Zapewniamy wysokiej jakości środki hipoalergiczne i wygodną odzież roboczą. Przyjemny zespół i lojalne kierownictwo."
    else: # hospitality
        title_ua = f"Бариста у кав'ярню — {city_ua}"
        title_pl = f"Barista w kawiarni — {city_pl}"
        company = f"Kawa {city_pl} Cafe"
        tasks_ua = ["Приготування кавових напоїв.", "Обслуговування гостей на касі.", "Підтримання чистоти в залі."]
        tasks_pl = ["Przygotowywanie napojów kawowych.", "Obsługa gości przy kasie.", "Utrzymanie czystości na sali."]
        details_ua = ["Знання польської мови на комунікативному рівні.", "Привітність та комунікабельність.", "Досвід роботи баристою від 3 місяців."]
        details_pl = ["Znajomość polskiego na poziomie komunikatywnym.", "Uprzejmość i komunikatywność.", "Doświadczenie jako barista od 3 miesięcy."]
        body_ua = f"Затишна кав'ярня у {city_ua} шукає баристу! Якщо ви любите каву та спілкування з людьми, ця робота для вас. Гнучкий графік роботи, який можна поєднувати з навчанням. Дружня атмосфера, чайові та безкоштовна кава під час зміни."
        body_pl = f"Przytulna kawiarnia w {city_pl} szuka baristy! Jeśli kochasz kawę i kontakt z ludźmi, to praca dla ciebie. Elastyczny grafik, który można łączyć z nauką. Przyjazna atmosfera, napiwki i darmowa kawa w trakcie zmiany."

    return {
        "slug": slug,
        "category": category,
        "city": city_ua,
        "city_pl": city_pl,
        "title": title_ua,
        "title_pl": title_pl,
        "salary": f"{random.randint(25, 40)} - {random.randint(41, 55)} PLN/h",
        "company": company,
        "shift_ua": "Пн-Пт, 08:00-16:00",
        "shift_pl": "Pn-Pt, 08:00-16:00",
        "pattern_ua": "5/2",
        "pattern_pl": "5/2",
        "start_ua": "Від зараз",
        "start_pl": "Od zaraz",
        "contract_ua": "Umowa o pracę",
        "contract_pl": "Umowa o pracę",
        "offers_ua": [
          "Офіційне працевлаштування.",
          "Медичне страхування.",
          "Вчасна виплата зарплати."
        ],
        "offers_pl": [
          "Legalne zatrudnienie.",
          "Ubezpieczenie medyczne.",
          "Terminowa wypłata."
        ],
        "tasks_ua": tasks_ua,
        "tasks_pl": tasks_pl,
        "details_ua": details_ua,
        "details_pl": details_pl,
        "date_posted": "2026-04-06",
        "data_source": "manual",
        "body": f"<div class='vacancy-block'><p>{body_ua}</p><div class='salary-box'>💰 Зарплата: <strong>{random.randint(25, 40)} - {random.randint(41, 55)} PLN/h</strong></div></div><a href='/respond.html?job={slug}' class='btn btn-primary'>Відгукнутися на вакансію</a>",
        "body_pl": f"<div class='vacancy-block'><p>{body_pl}</p><div class='salary-box'>💰 Wynagrodzenie: <strong>{random.randint(25, 40)} - {random.randint(41, 55)} PLN/h</strong></div></div><a href='/respond.html?job={slug}' class='btn btn-primary'>Aplikuj teraz</a>"
    }

with open("src/content.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for i in range(25):
    data.append(generate_vacancy(i))

with open("src/content.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
