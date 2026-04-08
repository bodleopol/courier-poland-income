const html = require('fs').readFileSync('dist/index.html', 'utf8');
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
while ((match = scriptRegex.exec(html)) !== null) {
  const code = match[1].trim();
  if (code.includes('window.CATEGORIES')) {
    try {
      new Function(code);
      console.log('Successfully parsed script block with window.CATEGORIES');
    } catch (e) {
      console.log('Error parsing CATEGORIES script block');
      console.log(e);
      require('fs').writeFileSync('problem_script.js', code);
    }
  }
}
