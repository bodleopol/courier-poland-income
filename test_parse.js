import fs from 'fs';

const content = fs.readFileSync('src/main.js', 'utf-8');
const startIdx = content.indexOf('const translations = {');
let endIdx = content.indexOf('};\n\n  const categoryIcons');
let block = content.substring(startIdx, endIdx);

console.log(block.split('\n').filter(l => l.includes('ua:')).length, 'lines with ua');
console.log(block.split('\n').filter(l => l.includes('en:')).length, 'lines with en');
