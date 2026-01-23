// Original version content from commit 9d5e4cdfcc230dcdee9a2a7d3cd12ba3bdfa85a8

// Existing code...

// write _redirects for Cloudflare Pages / Netlify
try {
  const redirects = `/* /404.html 404
`;
  await fs.writeFile(path.join(DIST, '_redirects'), redirects, 'utf8');
  console.log('✅ Created _redirects for Cloudflare Pages');
} catch (e) {
  console.error('Error creating _redirects:', e);
}

console.log('Build complete. Pages:', links.length);