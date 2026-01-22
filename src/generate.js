    // write _redirects for Cloudflare Pages / Netlify
    try {
      const redirects = `/* /404.html 404\n`;
      await fs.writeFile(path.join(DIST, '_redirects'), redirects, 'utf8');
      console.log('✅ Created _redirects for Cloudflare Pages');
    } catch (e) {
      console.error('Error creating _redirects:', e);
    }

console.log('Build complete')