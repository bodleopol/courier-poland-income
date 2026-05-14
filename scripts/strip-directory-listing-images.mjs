/**
 * Removes top cover <img> from directory listing cards in static HTML fragments.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILES = [
  'src/pages/site/index.html',
  'src/pages/site/index-en.html',
  'src/pages/site/index-es.html',
  'src/pages/site/index-ru.html',
  'src/pages/site/specialists.html',
  'src/pages/site/specialists-en.html',
  'src/pages/site/specialists-es.html',
  'src/pages/site/specialists-ru.html',
  'src/pages/site/startups.html',
  'src/pages/site/startups-en.html',
  'src/pages/site/startups-es.html',
  'src/pages/site/startups-ru.html'
];

const RE = /(<article class="card (?:profile-card|startup-card)[^>]*>)\s*<img\b[^>]*>/gi;

for (const rel of FILES) {
  const fp = path.join(ROOT, rel);
  if (!fs.existsSync(fp)) continue;
  let s = fs.readFileSync(fp, 'utf8');
  const n = (s.match(RE) || []).length;
  s = s.replace(RE, '$1');
  fs.writeFileSync(fp, s, 'utf8');
  if (n) process.stdout.write(`${rel}: stripped ${n} cover images\n`);
}
