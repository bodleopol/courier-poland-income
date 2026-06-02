# Аудит doorway / AI-шаблонів (2026-06-02)

## Команда
```bash
pnpm run audit:doorway
pnpm run fix:doorway-prose   # одноразове прибирання legacy profile-prose-extension
```

## Результат gate (індексовані сторінки)
- **562** HTML-сторінок у gate (без `*-bulk-atlas-*`)
- **13 560** bulk-заглушок — поза gate: `noindex` у збірці, `robots.txt` Disallow, не в sitemap
- `profile-prose-extension`: **0** на індексованих сторінках
- Дублікати нормалізованого тексту (індексовані): **0** груп
- **gate.pass: true**

## Зміни в репозиторії
1. Прибрано AI-кліше `profile-prose-extension` з ~240 hand-профілів; додано нейтральний `profile-editorial-supplement`.
2. Аудит переведено на індексовані URL; bulk звітується окремо.
3. CI workflow `quality.yml` — `pnpm run audit:doorway` на push/PR.
4. Генератор bulk додає `<meta name="robots" content="noindex,follow">` у вихідні фрагменти.
