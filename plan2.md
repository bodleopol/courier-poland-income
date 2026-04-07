1. **Analyze the current setup**:
   - `buildAdSenseScript` in `src/generate.js` already adds the AdSense meta tag and `<script>`.
   - `ads.txt` and `ada.txt` are already correctly generated in `src/generate.js` according to the screenshots.

Wait! The problem says: "Код AdSense на кожну сторінку встав, мата теги також і зроби файл Ads.txt".
The user is just asking me to insert the AdSense code on every page, meta tags too, and create `Ads.txt` file. They are probably unaware that `ads.txt` and `ada.txt` are already partially there or that `generate.js` already includes `buildAdSenseScript()`.

Let's look at what's currently in `src/generate.js` around `Ads.txt`:
It generates `ads.txt`. Note: Linux is case sensitive, but the file generated is `ads.txt`. The user said "сделай файл Ads.txt", it might just be capitalization, or they want it capitalized as `Ads.txt`? Usually `ads.txt` is lowercase. I'll make sure it's lowercased but I'll also add a file named `Ads.txt` just in case, or symlink it, or just keep it `ads.txt`. Google AdSense expects `ads.txt` (lowercase).

Let's check `src/generate.js` to see if there is any issue. Maybe `Ads.txt` isn't capitalized but it should be? No, `ads.txt` must be lowercase.

Let's re-read the screenshots. The images show instructions from Google AdSense.
Screenshot 1: Your AdSense code: `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8323455138689324" crossorigin="anonymous"></script>`
Screenshot 2: Meta tag `<meta name="google-adsense-account" content="ca-pub-8323455138689324">`
Screenshot 3: `ads.txt`: `google.com, pub-8323455138689324, DIRECT, f08c47fec0942fa0`

Is it possible that these files are not copied or generated properly, or the user just thinks they aren't there?
Let's see if there is any other place AdSense needs to be. For example, maybe the `src/templates/*.html` files need it directly?
Wait, if I look closely at the `ads.txt` that is generated in `generate.js`:
```js
    try {
      const publisherId = 'ca-pub-8323455138689324';
      const pubOnly = publisherId.replace('ca-', '');
      const adsTxtLines = ['# ads.txt — rybezh.site'];
      adsTxtLines.push(`google.com, ${pubOnly}, DIRECT, f08c47fec0942fa0`);

      const txtContent = adsTxtLines.join('\n') + '\n';
      await fs.writeFile(path.join(DIST, 'ads.txt'), txtContent, 'utf8');
      await fs.writeFile(path.join(DIST, 'ada.txt'), txtContent, 'utf8');
    } catch (e) {}
```
This is fine.

Let's check if the meta tag and script tag are actually inserted on ALL pages.
`sanitizeStaticHtmlHead(html)` does this:
```javascript
  // Inject AdSense Auto Ads script if publisher ID is provided
  const adsenseScript = buildAdSenseScript();
  if (adsenseScript && /<\/head>/i.test(out) && !out.includes('pagead2.googlesyndication.com')) {
    out = out.replace(/<\/head>/i, `  ${adsenseScript}\n</head>`);
  }
```

Is `sanitizeStaticHtmlHead` called on EVERY page?
Let's search where `sanitizeStaticHtmlHead` is called in `src/generate.js`.
