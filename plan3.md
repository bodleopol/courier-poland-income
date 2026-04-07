Wait, `sanitizeStaticHtmlHead` is ONLY called on static pages in the `staticPages` array!

```javascript
// from build() function
  const staticPages = [
    'about.html',
    'contact.html',
    'privacy.html',
    'terms.html',
    'faq.html',
    'calculator.html',
    'cv-generator.html',
    'red-flag.html',
    '404.html',
    'map.html',
    'for-employers.html',
    'proof.html',
    'rent.html'
  ];
```
For `vacancies`, `blog`, `index`, `post`, `sanitizeStaticHtmlHead` is NEVER called!
That's why! The AdSense code is only present in static pages, and the user wants it on EVERY page ("на кожну сторінку встав").
This explains everything!

I need to call `sanitizeStaticHtmlHead` or directly inject `buildAdSenseScript` on ALL pages, including `index.html`, `vacancies.html`, all `job-*` (vacancy) pages, and all `blog-*`/`post-*` pages.

Also, the user asked to "зроби файл Ads.txt". I'll create an `Ads.txt` file specifically as asked, even though `ads.txt` is already generated, just to be safe. Actually, `src/generate.js` creates `ads.txt` and `ada.txt`. I can add a copy to `Ads.txt` as well. Or I can explain that `ads.txt` is the standard name. I will just add `Ads.txt` generation as well so they are happy.
`await fs.writeFile(path.join(DIST, 'Ads.txt'), txtContent, 'utf8');`

Let's check where to inject AdSense for other pages.
In `src/generate.js`:
- For vacancies (line ~1690):
```javascript
    finalHtml = setRobotsMeta(finalHtml, vacancyRobotsContent);
```
I can add `finalHtml = sanitizeStaticHtmlHead(finalHtml);` here! That will add AdSense to vacancies.

- For Blog pagination pages (line ~1845):
```javascript
    if (blogHtml.includes('</head>')) {
      blogHtml = blogHtml.replace('</head>', `${blogCollectionScript}</head>`);
    }
```
Add `blogHtml = sanitizeStaticHtmlHead(blogHtml);`

- For individual blog posts (line ~1930):
```javascript
    if (postHtml.includes('</head>')) {
      postHtml = postHtml.replace('</head>', `${blogPostingScript}\n</head>`);
    }
```
Add `postHtml = sanitizeStaticHtmlHead(postHtml);`

- For `index.html` (line ~1970):
```javascript
    if (indexHtml.includes('</head>')) {
      indexHtml = indexHtml.replace('</head>', `${homeItemListScript}\n</head>`);
    }
```
Add `indexHtml = sanitizeStaticHtmlHead(indexHtml);`

- For `vacancies.html` (line ~2030):
```javascript
      if (vacanciesHtml.includes('</head>')) {
        vacanciesHtml = vacanciesHtml.replace('</head>', `${itemListScript}${vacanciesDataScript}\n</head>`);
      } else {
        vacanciesHtml = vacanciesDataScript + vacanciesHtml;
      }
```
Add `vacanciesHtml = sanitizeStaticHtmlHead(vacanciesHtml);`

Wait, `sanitizeStaticHtmlHead` does:
```javascript
function sanitizeStaticHtmlHead(html) {
  let out = String(html || '');
  out = out.replace(/\s*<meta\s+name=["']google-site-verification["'][^>]*>\s*/gi, '\n');
  out = out.replace(/\s*<meta\s+name=["']keywords["'][^>]*>\s*/gi, '\n');
  // ... OG stuff
  // Inject AdSense Auto Ads script
  const adsenseScript = buildAdSenseScript();
  if (adsenseScript && /<\/head>/i.test(out) && !out.includes('pagead2.googlesyndication.com')) {
    out = out.replace(/<\/head>/i, `  ${adsenseScript}\n</head>`);
  }
  return out;
}
```
If I just run `sanitizeStaticHtmlHead` it will handle the injection nicely for all pages.
Let's see if there are any side effects of running `sanitizeStaticHtmlHead` on dynamic pages. It removes keywords, normalizes OG image references (from .jpg to .png), adds og:image:width/height. This is actually good for all pages.

So the plan is:
1. Update `src/generate.js` to call `sanitizeStaticHtmlHead` on `finalHtml` (vacancy), `blogHtml` (blog index), `postHtml` (blog post), `indexHtml` (home page), and `vacanciesHtml` (vacancies index).
2. Update `src/generate.js` to also generate `Ads.txt` (capital A) just to satisfy the exact user request, though `ads.txt` is what AdSense actually reads. (Line ~2130).
3. Call `pre_commit_instructions` and follow pre-commit checks.
4. Push and submit.
