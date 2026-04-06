const fs = require('fs');
let content = fs.readFileSync('src/content.json', 'utf8');

const regex = /<<<<<<< HEAD[\s\S]*?>>>>>>> origin\/main/g;

const fixed = `    "body": "<div class='vacancy-block'><p>Потрібні працівники на склад у Гданську (різноробочі-вантажники). Робота фізична, але товар не важкий (до 15 кг). Працюємо тільки вдень, що дуже зручно для тих, хто не хоче працювати по ночах. Бригадир поляк, тому мінімальне розуміння мови вітається. Оплата вчасна, без затримок.</p><div class='salary-box'>💰 Зарплата: <strong>27 - 35 PLN/h</strong></div></div>",
    "body_pl": "<div class='vacancy-block'><p>Poszukujemy pracowników na magazyn w Gdańsku (pracownicy fizyczni-ładowacze). Praca fizyczna, ale towar nie jest bardzo ciężki (do 15 kg). Pracujemy tylko na dziennej zmianie, co jest bardzo wygodne dla osób, które nie chcą pracować w nocy. Brygadzista jest Polakiem, więc mile widziane jest minimalne rozumienie języka. Wypłaty terminowe, bez opóźnień.</p><div class='salary-box'>💰 Wynagrodzenie: <strong>27 - 35 PLN/h</strong></div></div>",
    "body_ru": "<div class='vacancy-block'><p>Требуются работники на склад в Гданьске (разнорабочие-грузчики). Работа физическая, но товар не тяжелый (до 15 кг). Работаем только днем, что очень удобно для тех, кто не хочет работать по ночам. Бригадир поляк, поэтому минимальное понимание языка приветствуется. Оплата вовремя, без задержек.</p><div class='salary-box'>💰 Зарплата: <strong>27 - 35 PLN/h</strong></div></div>"`;

content = content.replace(regex, fixed);
fs.writeFileSync('src/content.json', content);
