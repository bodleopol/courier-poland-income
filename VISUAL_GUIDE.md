# 📸 ВІЗУАЛЬНИЙ ГАЙД: Як опублікувати зміни

## 🎯 ЩО РОБИТИ: Змінити Default Branch

**БЕЗ PR! БЕЗ MERGE! ПРОСТО ПЕРЕКЛЮЧИТИ!**

---

## Крок 1: Відкрити Settings

### URL:
```
https://github.com/bodleopol/courier-poland-income/settings/branches
```

### Або через UI:
1. Відкрити: https://github.com/bodleopol/courier-poland-income
2. Натиснути таб **"Settings"** (праворуч вгорі)
3. В лівому меню натиснути **"Branches"**

---

## Крок 2: Знайти "Default branch"

### Побачите секцію:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Default branch
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

 main    [⇄]

 The default branch is considered the 
 "base" branch in your repository...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**ОСЬ ЦЯ КНОПКА:** `[⇄]` (дві стрілочки)

---

## Крок 3: Натиснути кнопку ⇄

**ЦЯ КНОПКА ВИГЛЯДАЄ ЯК:** ⇄ або ⇋

Після натискання з'явиться dropdown меню:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Switch default branch to another branch

 ○ main
 ○ copilot/fix-job-generation-system  ← ВИБРАТИ ЦЮ!
 ○ copilot/make-website-bilingual-ua-pl
 ○ copilot/remove-ai-generation-markers
 
 [Update]  [Cancel]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Крок 4: Вибрати нову гілку

**НАТИСНУТИ НА:**
```
○ copilot/fix-job-generation-system
```

Радіо-кнопка стане заповненою:
```
● copilot/fix-job-generation-system  ✓
```

---

## Крок 5: Натиснути "Update"

**НАТИСНУТИ ЗЕЛЕНУ КНОПКУ:**
```
[Update]
```

---

## Крок 6: Підтвердити зміну

З'явиться попередження:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ⚠️ Are you sure?

 This will change the base branch to
 copilot/fix-job-generation-system

 [I understand, update the default branch]

 [Cancel]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**НАТИСНУТИ:**
```
[I understand, update the default branch]
```

---

## ✅ ГОТОВО!

Побачите повідомлення:

```
✓ Default branch has been updated
```

---

## Що відбувається далі?

### Автоматично (без вашої участі):

**Хвилина 0:**
```
✓ Default branch змінено на copilot/fix-job-generation-system
```

**Хвилина 1:**
```
🔄 GitHub Actions виявив зміну
🔄 Workflow "Deploy to GitHub Pages" запускається
```

**Хвилина 2-4:**
```
⚙️ npm install
⚙️ npm run build
  ├─ Генерація 101 вакансії
  ├─ Створення CNAME (rybezh.site)
  ├─ Генерація sitemaps
  └─ Збірка HTML сторінок
```

**Хвилина 5:**
```
📤 Upload artifact to GitHub Pages
🚀 Deploy to GitHub Pages
```

**Хвилина 6:**
```
✅ САЙТ ОНОВЛЕНО!
✅ rybezh.site показує нову версію
```

---

## Перевірка

### Через 1 хвилину перевірити Actions:

```
https://github.com/bodleopol/courier-poland-income/actions
```

**Має бути:**
- 🟡 Новий workflow "Deploy to GitHub Pages" - In progress
- Або ✅ Completed

### Через 5-6 хвилин відкрити сайт:

```
https://rybezh.site
```

**Має бути:**
- ✅ 101 вакансія (не 293!)
- ✅ Унікальні назви компаній (не "FastLogistics")
- ✅ Profession-specific бонуси

---

## Якщо щось не так

### Якщо не з'являється dropdown:

Можливо потрібно:
1. Оновити сторінку (F5)
2. Перевірити що ви власник репо
3. Спробувати інший браузер

### Якщо кнопка ⇄ не активна:

Можливо у репо тільки одна гілка. Перевірити:
```
https://github.com/bodleopol/courier-poland-income/branches
```

Має бути мінімум 2 гілки.

---

## 🎯 КОРОТКО

1. https://github.com/bodleopol/courier-poland-income/settings/branches
2. Натиснути кнопку ⇄ біля "main"
3. Вибрати `copilot/fix-job-generation-system`
4. Натиснути "Update"
5. Підтвердити "I understand..."
6. Дочекатись 5 хвилин
7. Відкрити https://rybezh.site
8. ✅ ГОТОВО!

---

## 📱 Що побачите на сайті

### Старі дані (main - зараз):
- ❌ 293 вакансії
- ❌ Повторювані назви компаній
- ❌ "FastLogistics Sp. z o.o." (фейк)
- ❌ Рандомні бонуси з пулу

### Нові дані (після зміни):
- ✅ 101 вакансія
- ✅ Унікальні компанії
- ✅ "Myjnia Perfect 2 s.c." (реалістично)
- ✅ Profession-specific бонуси
- ✅ Doorway-ризик 3-4/10

---

## 🚀 ПОЧИНАЙТЕ ЗАРАЗ!

**ПРЯМИЙ ЛІНК:**
```
https://github.com/bodleopol/courier-poland-income/settings/branches
```

**6 КЛІКІВ → 5 ХВИЛИН → ГОТОВО!** 🎉
