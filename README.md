# Богдан Тютенко — особисте портфоліо

Мінімальний односторінковий сайт-портфоліо Богдана Тютенка: операційне лідерство (COO), foodtech, last-mile, процеси та метрики.

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

- `src/pages/site/index.html` — єдина сторінка портфоліо Богдана Тютенка
- `src/templates/portfolio.html` — HTML-оболонка з логотипом, навігацією та SEO-метаданими
- `src/portfolio.css`, `src/portfolio.js` — стилі та мобільне меню
- `src/assets/images/` — фото Богдана та логотип
- `build.js` — збірка односторінкового сайту в `dist/`
