# 🌐 Інформація про домен

## Основний домен

**Сайт доступний за адресою: https://rybezh.site**

## Конфігурація

### CNAME файл ✅

CNAME файл автоматично створюється під час збірки:

```javascript
// src/generate.js
await fs.writeFile(path.join(DIST, 'CNAME'), 'rybezh.site', 'utf8');
```

Після збірки файл `dist/CNAME` містить:
```
rybezh.site
```

### GitHub Pages налаштування

Для роботи custom domain потрібно:

1. **CNAME файл** в `dist/` директорії ✅ (вже є)
2. **DNS записи** налаштовані на стороні домену:
   ```
   A запис: rybezh.site → 185.199.108.153
   A запис: rybezh.site → 185.199.109.153
   A запис: rybezh.site → 185.199.110.153
   A запис: rybezh.site → 185.199.111.153
   CNAME запис: www.rybezh.site → bodleopol.github.io
   ```

3. **GitHub Pages Settings**:
   - Repository → Settings → Pages
   - Custom domain: `rybezh.site`
   - Enforce HTTPS: ✅ Enabled

### Структура URL

Всі URL в сайті використовують домен `rybezh.site`:

- Головна: https://rybezh.site
- Вакансії: https://rybezh.site/vacancies.html
- Окрема вакансія: https://rybezh.site/gdansk-cleaning-osoba-sprz-taj-ca-49.html
- Про нас: https://rybezh.site/about.html
- Карта: https://rybezh.site/map.html

### Canonical URLs

Всі HTML шаблони використовують `rybezh.site` в canonical URLs:

```html
<link rel="canonical" href="https://rybezh.site/{{SLUG}}.html">
<meta property="og:url" content="https://rybezh.site/{{SLUG}}.html">
```

### Sitemaps

Sitemap файли також використовують правильний домен:

```xml
https://rybezh.site/sitemap.xml
https://rybezh.site/sitemap-static.xml
https://rybezh.site/sitemap-vacancies.xml
https://rybezh.site/sitemap-blog.xml
```

## Міграція з GitHub Pages

GitHub Pages default URL (`bodleopol.github.io/courier-poland-income/`) автоматично редіректить на `rybezh.site` після налаштування custom domain.

## SSL/HTTPS

GitHub Pages автоматично надає безкоштовний SSL сертифікат від Let's Encrypt для custom domain.

## Перевірка конфігурації

### 1. Перевірити CNAME файл

```bash
npm run build
cat dist/CNAME
# Має вивести: rybezh.site
```

### 2. Перевірити DNS записи

```bash
dig rybezh.site +short
# Має показати IP адреси GitHub Pages
```

### 3. Перевірити сайт

```bash
curl -I https://rybezh.site
# Має повернути 200 OK
```

## Документація

Всі документи оновлені з правильним доменом:

- ✅ `DEPLOYMENT_STATUS.md`
- ✅ `DEPLOYMENT_TROUBLESHOOTING.md`
- ✅ `WHY_NOT_PUBLISHED.md`
- ✅ `src/generate.js` (CNAME generation)
- ✅ `src/templates/*.html` (canonical URLs)

## Корисні посилання

- **Сайт**: https://rybezh.site
- **GitHub Pages docs**: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
- **DNS check**: https://www.whatsmydns.net/#A/rybezh.site

## Підтримка

Telegram: https://t.me/rybezh_site
