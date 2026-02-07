// Integration script for engagement improvements
// This patches the existing build with new features

import fs from 'fs/promises';
import path from 'path';

async function integrateImprovements() {
  const SRC = path.resolve('./src');
  const DIST = path.resolve('./dist');
  
  console.log('📦 Integrating engagement improvements...');
  
  // 1. Copy new assets
  const assets = [
    { src: 'jobs-loader.js', dest: 'jobs-loader.js' },
    { src: 'engagement.css', dest: 'engagement.css' }
  ];
  
  for (const asset of assets) {
    try {
      const content = await fs.readFile(path.join(SRC, asset.src), 'utf8');
      await fs.writeFile(path.join(DIST, asset.dest), content, 'utf8');
      console.log(`✅ Copied ${asset.src}`);
    } catch (err) {
      console.warn(`⚠️  Could not copy ${asset.src}:`, err.message);
    }
  }
  
  // 2. Create jobs-data.json for lazy loading
  try {
    const contentPath = path.join(SRC, 'content.json');
    const content = await fs.readFile(contentPath, 'utf8');
    await fs.writeFile(path.join(DIST, 'jobs-data.json'), content, 'utf8');
    console.log('✅ Created jobs-data.json for lazy loading');
  } catch (err) {
    console.warn('⚠️  Could not create jobs-data.json:', err.message);
  }
  
  // 3. Modify index.html and vacancies.html to use lazy loading
  try {
    const pagesToModify = ['index.html', 'vacancies.html'];
    for (const page of pagesToModify) {
      const pagePath = path.join(DIST, page);
      let pageHtml = await fs.readFile(pagePath, 'utf8');
      
      // Add jobs-loader.js script before closing body tag
      if (!pageHtml.includes('<script src="/jobs-loader.js"></script>')) {
        pageHtml = pageHtml.replace(
          '</body>',
          '<script src="/jobs-loader.js"></script>\n</body>'
        );
        await fs.writeFile(pagePath, pageHtml, 'utf8');
        console.log(`✅ Modified ${page} for lazy loading`);
      }
    }
  } catch (err) {
    console.warn('⚠️  Could not modify pages:', err.message);
  }
  
  // 4. Add engagement.css to all vacancy pages
  try {
    const files = await fs.readdir(DIST);
    const vacancyFiles = files.filter(f => 
      f.endsWith('.html') && 
      !['index.html', 'vacancies.html', 'apply.html', 'contact.html', 'about.html', 'privacy.html', 'terms.html', 'faq.html', '404.html'].includes(f) &&
      !f.startsWith('post-')
    );
    
    let modified = 0;
    for (const file of vacancyFiles) {
      const filePath = path.join(DIST, file);
      let html = await fs.readFile(filePath, 'utf8');
      
      if (!html.includes('engagement.css')) {
        html = html.replace(
          '</head>',
          '<link rel="stylesheet" href="/engagement.css">\n</head>'
        );
        await fs.writeFile(filePath, html, 'utf8');
        modified++;
      }
    }
    console.log(`✅ Added engagement.css to ${modified} vacancy pages`);
  } catch (err) {
    console.warn('⚠️  Could not add engagement.css:', err.message);
  }
  
  console.log('✨ Integration complete!');
}

integrateImprovements().catch(console.error);
