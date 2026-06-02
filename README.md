# Богдан Тютенко — особисте портфоліо

Односторінковий сайт-портфоліо: операційне лідерство (COO), досвід у foodtech і last-mile.

**Сайт:** [rybezh.site](https://rybezh.site)

## Збірка

```bash
pnpm install
pnpm run build
```

Результат у каталозі `dist/`.

## Локальний перегляд

```bash
pnpm run build
pnpm run start
```

Відкрийте `http://localhost:5000`.

## Структура

- `src/pages/site/index.html` — контент головної сторінки
- `src/templates/portfolio.html` — HTML-оболонка
- `src/portfolio.css`, `src/portfolio.js` — стилі та мобільне меню
- `src/assets/images/` — фото та логотип
- `build.js` — збірка в `dist/`
