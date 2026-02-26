/**
 * IndexNow + Google Ping automation script.
 *
 * Usage:
 *   INDEXNOW_KEY=<key> node scripts/ping-indexnow.js [url1] [url2] ...
 *
 * If no URLs are provided, the script reads the latest vacancies/posts from
 * src/content.json and src/posts.json and pings the first 10 most recent URLs.
 *
 * Environment variables:
 *   INDEXNOW_KEY  — 32-char hex key registered with IndexNow (required for IndexNow)
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, '..', 'src');
const HOST = 'https://rybezh.site';

async function loadUrls(explicitUrls) {
  if (explicitUrls.length > 0) return explicitUrls;

  const urls = [];
  try {
    const content = JSON.parse(await fs.readFile(path.join(SRC, 'content.json'), 'utf8'));
    const vacancies = Array.isArray(content) ? content : (content.pages || content.vacancies || []);
    for (const v of vacancies.slice(0, 5)) {
      if (v.slug) urls.push(`${HOST}/${v.slug}.html`);
    }
  } catch { /* ignore */ }

  try {
    const posts = JSON.parse(await fs.readFile(path.join(SRC, 'posts.json'), 'utf8'));
    const list = Array.isArray(posts) ? posts : (posts.posts || []);
    for (const p of list.slice(0, 5)) {
      if (p.slug) urls.push(`${HOST}/post-${p.slug}.html`);
    }
  } catch { /* ignore */ }

  return urls;
}

async function pingIndexNow(urls, key) {
  if (!key) {
    console.log('⚠️  INDEXNOW_KEY not set — skipping IndexNow ping');
    return;
  }

  const body = JSON.stringify({
    host: 'rybezh.site',
    key,
    keyLocation: `${HOST}/${key}.txt`,
    urlList: urls
  });

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body
    });
    console.log(`✅ IndexNow response: ${res.status} ${res.statusText}`);
  } catch (err) {
    console.error('❌ IndexNow ping failed:', err.message);
  }
}

async function pingGoogle(urls) {
  for (const url of urls) {
    try {
      const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(url)}`;
      const res = await fetch(pingUrl);
      console.log(`✅ Google ping ${url}: ${res.status}`);
    } catch (err) {
      console.error(`❌ Google ping failed for ${url}:`, err.message);
    }
  }
}

async function main() {
  const explicitUrls = process.argv.slice(2).filter(u => u.startsWith('http'));
  const urls = await loadUrls(explicitUrls);

  if (urls.length === 0) {
    console.log('No URLs to ping.');
    return;
  }

  console.log(`📡 Pinging ${urls.length} URL(s)...`);
  urls.forEach(u => console.log(`  → ${u}`));

  const key = (process.env.INDEXNOW_KEY || '').trim();
  await pingIndexNow(urls, key);
  await pingGoogle(urls);

  console.log('\n🎉 Ping complete!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
