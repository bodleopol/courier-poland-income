with open("src/generate.js", "r") as f:
    lines = f.read()

import re
fixed_lines = re.sub(r'<<<<<<< HEAD\n=======\n\n>>>>>>> origin/main\n      // If it\'s a content-only static page like rent.html, wrap it in the template\n      if \(\!pContent.includes\(\'<html\'\)\) \{\n        let title = \'Rybezh\';\n        let desc = \'Rybezh\';\n<<<<<<< HEAD\n        if \(p === \'rent.html\' \|\| p === \'rent-ru.html\'\) \{\n          title = p.includes\(\'-ru\'\) \? \'Аренда автомобилей для такси и курьеров — Rybezh\' : \'Оренда авто для таксі та кур\\\'єрів — Rybezh\';\n          desc = p.includes\(\'-ru\'\) \? \'Арендуйте надежные и экономичные автомобили для работы в Bolt, Uber, FreeNow, Glovo, Wolt.\' : \'Орендуйте надійні та економні авто для роботи в Bolt, Uber, FreeNow, Glovo, Wolt.\';\n=======\n        if \(p === \'rent.html\'\) \{\n          title = \'Оренда транспорту\';\n          desc = \'Надійний транспорт для роботи та особистих потреб. Велосипеди, скутери, мотоцикли та авто на вигідних умовах.\';\n>>>>>>> origin/main', '''      // If it\\'s a content-only static page like rent.html, wrap it in the template
      if (!pContent.includes('<html')) {
        let title = 'Rybezh';
        let desc = 'Rybezh';
        if (p === 'rent.html' || p === 'rent-ru.html') {
          title = p.includes('-ru') ? 'Аренда автомобилей для такси и курьеров — Rybezh' : 'Оренда авто для таксі та кур\\'єрів — Rybezh';
          desc = p.includes('-ru') ? 'Арендуйте надежные и экономичные автомобили для работы в Bolt, Uber, FreeNow, Glovo, Wolt.' : 'Орендуйте надійні та економні авто для роботи в Bolt, Uber, FreeNow, Glovo, Wolt.';''', lines, flags=re.DOTALL)

with open("src/generate.js", "w") as f:
    f.write(fixed_lines)
