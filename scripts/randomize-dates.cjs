#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CONTENT = path.join(ROOT, 'src', 'content.json');
const POSTS = path.join(ROOT, 'src', 'posts.json');

function pad(n) { return String(n).padStart(2, '0'); }


let seed = 12345;
function pseudoRandom() {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}

function randDateInRange(startISO, endISO) {
  const s = new Date(startISO + 'T00:00:00Z').getTime();
  const e = new Date(endISO + 'T00:00:00Z').getTime();
  const t = s + Math.floor(pseudoRandom() * (e - s + 86400000));
  const d = new Date(t);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

function rewriteFile(file, fieldName, startISO, endISO) {
  const raw = fs.readFileSync(file, 'utf8');
  const re = new RegExp(`("${fieldName}"\\s*:\\s*")[^"]*(")`, 'g');
  let count = 0;
  const out = raw.replace(re, (_, p1, p2) => {
    count++;
    return `${p1}${randDateInRange(startISO, endISO)}${p2}`;
  });
  fs.writeFileSync(file, out, 'utf8');
  console.log(`Updated ${count} "${fieldName}" entries in ${path.relative(ROOT, file)} → ${startISO}..${endISO}`);
}

rewriteFile(CONTENT, 'date_posted', '2026-04-20', '2026-04-26');
rewriteFile(POSTS, 'date', '2026-01-01', '2026-04-25');
