/**
 * Replace Wikimedia Special:FilePath image URLs with stable Unsplash URLs.
 * Commons often fails in mobile / strict referrer contexts, causing ui-avatars initials.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', 'src', 'pages');

const UNSPLASH_POOL = [
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528d311f?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=720&q=80',
];

function hashString(s) {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

function pickUrl(seed) {
  return UNSPLASH_POOL[hashString(seed) % UNSPLASH_POOL.length];
}

const WIKI_SRC = /src="https:\/\/commons\.wikimedia\.org\/wiki\/Special:FilePath\/[^"]+"/g;

function processFile(filePath) {
  let text = fs.readFileSync(filePath, 'utf8');
  if (!text.includes('commons.wikimedia.org/wiki/Special:FilePath')) return false;
  const next = text.replace(WIKI_SRC, (full) => {
    const picked = pickUrl(full);
    return `src="${picked}"`;
  });
  if (next === text) return false;
  fs.writeFileSync(filePath, next);
  return true;
}

function walk(dir) {
  let changed = 0;
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, name.name);
    if (name.isDirectory()) {
      changed += walk(p);
    } else if (name.isFile() && name.name.endsWith('.html')) {
      if (processFile(p)) changed += 1;
    }
  }
  return changed;
}

const n = walk(ROOT);
console.log(`Updated ${n} HTML files under src/pages`);
