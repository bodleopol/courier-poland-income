import json
import random
from datetime import datetime, timedelta

def random_date(start, end):
    delta = end - start
    int_delta = (delta.days * 24 * 60 * 60) + delta.seconds
    random_second = random.randrange(int_delta)
    return start + timedelta(seconds=random_second)

start_date = datetime.strptime('2026-03-26', '%Y-%m-%d')
end_date = datetime.strptime('2026-03-29', '%Y-%m-%d')

with open('src/content.json', 'r', encoding='utf-8') as f:
    content = json.load(f)

for vacancy in content:
    if 'date' in vacancy:
        del vacancy['date'] # Remove incorrectly added date field
    rd = random_date(start_date, end_date)
    vacancy['date_posted'] = rd.strftime('%Y-%m-%dT%H:%M:%S.000Z')

with open('src/content.json', 'w', encoding='utf-8') as f:
    json.dump(content, f, ensure_ascii=False, indent=2)
