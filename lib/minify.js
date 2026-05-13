export function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s*([{}:;,>])\s*/g, '$1')
    .replace(/;}/g, '}')
    .replace(/\s+/g, ' ')
    .trim();
}

export function minifyJs(js) {
  return js
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}();,:=+<>\-])\s*/g, '$1')
    .trim();
}

export function minifyHtml(html) {
  return html
    .replace(/>\s+</g, '><')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function minifyAssetIfNeeded(filePath, content) {
  if (filePath.endsWith('.css')) return minifyCss(content);
  if (filePath.endsWith('.js')) return minifyJs(content);
  return content;
}
