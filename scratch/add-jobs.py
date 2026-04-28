import json
import os

with open('src/local-business-vacancies.json', 'r', encoding='utf-8') as f:
    local_jobs = json.load(f)

new_jobs = [
  {
    "id": 26,
    "role": "Монтажник вікон / Monter okien / Монтажник окон",
    "city": "Щецин",
    "salary": "6500-8200 PLN netto",
    "schedule": "Пн-Пт, 07:00-17:00",
    "date": "2026-04-20",
    "ua": "Будівельна компанія шукає монтажника вікон ПВХ та алюмінієвих конструкцій. Досвід роботи вітається, інструмент надається, оплата за кожен об'єкт або фіксована ставка. Місто Щецин. Зарплата 6500-8200 PLN netto. Графік: Пн-Пт, 07:00-17:00. Вакансія актуальна з 20.04.2026.",
    "pl": "Firma budowlana poszukuje montera okien PCV i stolarki aluminiowej. Doświadczenie mile widziane, narzędzia zapewnione, wynagrodzenie od zlecenia lub stała stawka. Miasto Szczecin. Wynagrodzenie 6500-8200 PLN netto. Grafik: Pn-Pt, 07:00-17:00. Oferta aktywna od 20.04.2026.",
    "ru": "Строительная компания ищет монтажника окон ПВХ и алюминиевых конструкций. Опыт работы приветствуется, инструмент предоставляется, оплата за каждый объект или фиксированная ставка. Город Щецин. Зарплата 6500-8200 PLN netto. График: Пн-Пт, 07:00-17:00. Вакансия актуальна с 20.04.2026."
  },
  {
    "id": 27,
    "role": "Сортувальник посилок / Sortowacz paczek / Сортировщик посылок",
    "city": "Вроцлав",
    "salary": "5200-6400 PLN netto",
    "schedule": "3 зміни: 06-14, 14-22, 22-06",
    "date": "2026-04-22",
    "ua": "Великий логістичний центр шукає сортувальника посилок. Робота зі сканером, не вимагає спеціальних навичок. Зміни плаваючі, можна брати додаткові години. Місто Вроцлав. Зарплата 5200-6400 PLN netto. Графік: 3 зміни. Вакансія актуальна з 22.04.2026.",
    "pl": "Duże centrum logistyczne poszukuje sortowacza paczek. Praca ze skanerem, nie wymaga specjalnych umiejętności. Zmiany elastyczne, możliwość nadgodzin. Miasto Wrocław. Wynagrodzenie 5200-6400 PLN netto. Grafik: 3 zmiany. Oferta aktywna od 22.04.2026.",
    "ru": "Крупный логистический центр ищет сортировщика посылок. Работа со сканером, не требует специальных навыков. Смены плавающие, можно брать дополнительные часы. Город Вроцлав. Зарплата 5200-6400 PLN netto. График: 3 смены. Вакансия актуальна с 22.04.2026."
  },
  {
    "id": 28,
    "role": "Касир-продавець / Kasjer-sprzedawca / Кассир-продавец",
    "city": "Краків",
    "salary": "5000-6000 PLN netto",
    "schedule": "2/2 по 12 годин",
    "date": "2026-04-21",
    "ua": "Мережа супермаркетів шукає касира-продавця. Обслуговування клієнтів, викладка товару, контроль термінів придатності. Потрібне базове знання польської. Місто Краків. Зарплата 5000-6000 PLN netto. Графік: 2/2. Вакансія актуальна з 21.04.2026.",
    "pl": "Sieć supermarketów poszukuje kasjera-sprzedawcy. Obsługa klienta, ekspozycja towaru, kontrola dat ważności. Wymagana podstawowa znajomość języka polskiego. Miasto Kraków. Wynagrodzenie 5000-6000 PLN netto. Grafik: 2/2. Oferta aktywna od 21.04.2026.",
    "ru": "Сеть супермаркетов ищет кассира-продавца. Обслуживание клиентов, выкладка товара, контроль сроков годности. Требуется базовое знание польского. Город Краков. Зарплата 5000-6000 PLN netto. График: 2/2. Вакансия актуальна с 21.04.2026."
  }
]

local_jobs.extend(new_jobs)
with open('src/local-business-vacancies.json', 'w', encoding='utf-8') as f:
    json.dump(local_jobs, f, ensure_ascii=False, indent=2)

with open('src/jobs-data.json', 'r', encoding='utf-8') as f:
    jobs_data = json.load(f)

for job in new_jobs:
    jobs_data.append({
        "id": f"job-{job['id']}",
        "city": job['city'].lower(),
        "city_ua": job['city'],
        "city_pl": job['city'] if job['city'] not in ['Вроцлав', 'Краків', 'Щецин'] else {'Вроцлав': 'Wrocław', 'Краків': 'Kraków', 'Щецин': 'Szczecin'}[job['city']],
        "city_ru": job['city'] if job['city'] not in ['Вроцлав', 'Краків', 'Щецин'] else {'Вроцлав': 'Вроцлав', 'Краків': 'Краков', 'Щецин': 'Щецин'}[job['city']],
        "category": "inshi",
        "category_ua": "Інші спеціальності",
        "category_pl": "Inne specjalności",
        "category_ru": "Другие специальности",
        "title_ua": job['role'],
        "title_pl": job['role'],
        "title_ru": job['role'],
        "salary": job['salary'].replace(' PLN netto', ''),
        "salary_currency": "PLN",
        "salary_period": "міс",
        "salary_period_pl": "mies",
        "salary_period_ru": "мес",
        "proof": 80 + job['id'] % 10,
        "excerpt_ua": job['ua'],
        "excerpt_pl": job['pl'],
        "excerpt_ru": job['ru'],
        "schedule_ua": job['schedule'],
        "schedule_pl": job['schedule'].replace('Пн-Пт', 'Pn-Pt'),
        "schedule_ru": job['schedule'].replace('Пн-Пт', 'Пн-Пт'),
        "date": job['date']
    })

with open('src/jobs-data.json', 'w', encoding='utf-8') as f:
    json.dump(jobs_data, f, ensure_ascii=False, indent=2)
print('Jobs added')
