import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '5000', 10);
const HOST = '0.0.0.0';
const DIST = path.join(__dirname, 'src');
const IS_PROD = process.env.NODE_ENV === 'production';
const CACHE_HTML = IS_PROD ? 'public, max-age=300, must-revalidate' : 'no-cache, no-store, must-revalidate';
const CACHE_ASSET = IS_PROD ? 'public, max-age=31536000, immutable' : 'no-cache, no-store, must-revalidate';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.map': 'application/json; charset=utf-8',
};

function safeJoin(base, target) {
  const resolved = path.resolve(base, '.' + target);
  if (!resolved.startsWith(path.resolve(base))) return null;
  return resolved;
}

async function send404(res) {
  const notFoundPath = path.join(DIST, '404.html');
  try {
    const data = await fs.promises.readFile(notFoundPath);
    res.writeHead(404, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'X-Robots-Tag': 'noindex',
    });
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
}

async function tryServe(filePath, res) {
  try {
    const stat = await fs.promises.stat(filePath);
    if (stat.isDirectory()) return false;
    const ext = path.extname(filePath).toLowerCase();
    const type = MIME[ext] || 'application/octet-stream';
    const isHtml = ext === '.html' || ext === '.htm';
    res.writeHead(200, {
      'Content-Type': type,
      'Cache-Control': isHtml ? CACHE_HTML : CACHE_ASSET,
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    });
    fs.createReadStream(filePath).pipe(res);
    return true;
  } catch {
    return false;
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    let pathname = decodeURIComponent(url.pathname);

    // Root -> index.html
    if (pathname === '/' || pathname === '') pathname = '/index.html';

    let candidate = safeJoin(DIST, pathname);
    if (!candidate) return send404(res);

    // Try exact file
    if (await tryServe(candidate, res)) return;

    // Try with .html appended (extensionless URL)
    if (!path.extname(pathname)) {
      const withHtml = safeJoin(DIST, pathname + '.html');
      if (withHtml && await tryServe(withHtml, res)) return;

      // Try directory index
      const withIndex = safeJoin(DIST, path.join(pathname, 'index.html'));
      if (withIndex && await tryServe(withIndex, res)) return;
    }

    return send404(res);
  } catch (err) {
    console.error('Request error:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Static server running at http://${HOST}:${PORT}`);
  console.log(`Serving: ${DIST}`);
});
