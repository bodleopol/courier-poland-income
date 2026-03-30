import re
import random

# Read map.html
with open('src/map.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Generate 100 new entries
names = ["Олександр", "Марія", "Іван", "Анна", "Петро", "Олена", "Андрій", "Діана", "Максим", "Юлія", "Дмитро", "Тетяна", "Олексій", "Наталія", "Сергій", "Ірина", "Віталій", "Катерина", "Роман", "Світлана", "Володимир", "Оксана", "Микола", "Вікторія", "Тарас", "Галина", "Євген", "Ольга", "Богдан", "Людмила", "Анатолій", "Надія", "Юрій", "Алла", "Ігор", "Віра", "Василь", "Любов", "Михайло", "Дарина", "Олег", "Аліна", "Руслан", "Євгенія", "Вадим", "Софія", "Денис", "Анастасія", "Артем", "Валентина"]
cities = [
    ("Warszawa", 52.2297, 21.0122),
    ("Kraków", 50.0647, 19.9450),
    ("Wrocław", 51.1079, 17.0385),
    ("Poznań", 52.4064, 16.9252),
    ("Gdańsk", 54.3520, 18.6466),
    ("Szczecin", 53.4285, 14.5528),
    ("Bydgoszcz", 53.1235, 18.0084),
    ("Lublin", 51.2465, 22.5684),
    ("Katowice", 50.2649, 19.0238),
    ("Białystok", 53.1325, 23.1688),
    ("Gdynia", 54.5189, 18.5305),
    ("Częstochowa", 50.8118, 19.1203),
    ("Radom", 51.4027, 21.1471),
    ("Sosnowiec", 50.2863, 19.1041),
    ("Toruń", 53.0138, 18.5984),
    ("Kielce", 50.8661, 20.6286),
    ("Rzeszów", 50.0412, 21.9991),
    ("Gliwice", 50.2976, 18.6766),
    ("Zabrze", 50.3249, 18.7857),
    ("Olsztyn", 53.7784, 20.4801),
    ("Bielsko-Biała", 49.8225, 19.0515)
]
intents = ["житло", "робота", "друзі", "інше", "бізнес", "волонтерство", "допомога", "спорт", "творчість", "подорожі"]
descs = [
    "Шукаю сусідів для оренди квартири.",
    "Потрібна допомога з працевлаштуванням.",
    "Хто хоче погуляти на вихідних?",
    "Шукаю однодумців для стартапу.",
    "Допомагаю біженцям. Звертайтеся.",
    "Граємо у футбол щонеділі, приєднуйтесь!",
    "Пишу музику, шукаю музикантів.",
    "Плануємо поїздку в гори. Є вільні місця.",
    "Шукаю роботу в IT.",
    "Пропоную послуги перекладу.",
    "Новий у місті, шукаю компанію для спілкування.",
    "Здаю кімнату для українців.",
    "Шукаю майстра по ремонту авто.",
    "Хто працює на складі Amazon, поділіться досвідом.",
    "Шукаю няню для дитини."
]

new_entries = []
for i in range(100):
    name = random.choice(names)
    city_name, lat, lon = random.choice(cities)
    lat_jitter = lat + random.uniform(-0.05, 0.05)
    lon_jitter = lon + random.uniform(-0.05, 0.05)
    contact = f"@{name.lower()}_{random.randint(10, 99)}_{city_name.lower()[:3]}"
    intent = random.choice(intents)
    desc = random.choice(descs)

    entry = f'      ["{name}","{city_name}",{lat_jitter:.4f},{lon_jitter:.4f},"{contact}","{intent}","{desc}"]'
    new_entries.append(entry)

entries_str = ",\n".join(new_entries)

# Insert the new entries into the realData array
# We need to find the end of the realData array and insert there
# Let's use regex to find the end of the array definition
# Find `// === Україна / Ukraine (7) ===` and the elements after it, and append before `];`
# Alternatively, simpler: just search for `];\n\n    // Функція визначення іконки`

parts = html.split('];\n\n    // Функція визначення іконки')
if len(parts) == 2:
    new_html = parts[0] + ",\n      // Added 100 entries automatically\n" + entries_str + "\n    ];\n\n    // Функція визначення іконки" + parts[1]
    with open('src/map.html', 'w', encoding='utf-8') as f:
        f.write(new_html)
    print("Added successfully to src/map.html")
else:
    print("Could not find the insertion point.")
