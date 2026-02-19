#!/bin/bash

# 🚀 Скрипт для публікації змін на production
# Використовується для деплою гілки copilot/enhance-job-descriptions в main

set -e  # Зупинитися при помилці

echo "🚀 Початок публікації змін..."
echo ""

# Перевірка що ми в правильній директорії
if [ ! -f "package.json" ]; then
    echo "❌ Помилка: Запустіть скрипт з кореневої директорії проекту"
    exit 1
fi

# Перевірка стану git
echo "📊 Перевірка стану репозиторію..."
git fetch origin

# Поточна гілка
CURRENT_BRANCH=$(git branch --show-current)
echo "   Поточна гілка: $CURRENT_BRANCH"

# Переключення на copilot/enhance-job-descriptions якщо потрібно
if [ "$CURRENT_BRANCH" != "copilot/enhance-job-descriptions" ]; then
    echo "🔄 Переключення на copilot/enhance-job-descriptions..."
    git checkout copilot/enhance-job-descriptions
fi

# Оновлення гілки
echo "⬇️  Отримання останніх змін..."
git pull origin copilot/enhance-job-descriptions

# Перевірка чи існує main локально
if git show-ref --verify --quiet refs/heads/main; then
    echo "✅ Гілка main існує локально"
    git checkout main
    git pull origin main 2>/dev/null || echo "   (main не існує на origin, буде створена)"
else
    echo "✨ Створення гілки main..."
    git checkout -b main copilot/enhance-job-descriptions
fi

# Злиття змін
echo "🔀 Злиття змін з copilot/enhance-job-descriptions..."
git merge copilot/enhance-job-descriptions --no-edit

# Пуш в main
echo "⬆️  Публікація в main..."
git push origin main

echo ""
echo "✅ Успішно опубліковано!"
echo ""
echo "🎉 Зміни опубліковані в гілку main"
echo "📦 GitHub Actions автоматично задеплоїть сайт на GitHub Pages"
echo "⏱️  Зачекайте 2-3 хвилини для завершення деплою"
echo ""
echo "🔍 Перевірте статус деплою тут:"
echo "   https://github.com/bodleopol/courier-poland-income/actions"
echo ""
echo "🌐 Після деплою сайт буде доступний за адресою:"
echo "   https://bodleopol.github.io/courier-poland-income/"
echo ""
echo "✨ Готово!"
