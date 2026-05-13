import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export async function processImages(srcDir, destDir) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  const promises = entries.map(async (entry) => {
    const srcFile = path.join(srcDir, entry.name);
    if (entry.isDirectory()) {
      return processImages(srcFile, path.join(destDir, entry.name));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        const destFileWebp = path.join(destDir, entry.name.replace(new RegExp(`${ext}$`, 'i'), '.webp'));
        const destFileOriginal = path.join(destDir, entry.name);
        try {
          await sharp(srcFile)
            .webp({ quality: 80 })
            .toFile(destFileWebp);
          // Keep original files so favicons, CSS, and metadata still work
          fs.copyFileSync(srcFile, destFileOriginal);
        } catch (error) {
          console.error(`Error converting ${srcFile} to WebP:`, error);
          fs.copyFileSync(srcFile, destFileOriginal);
        }
      } else {
         const destFile = path.join(destDir, entry.name);
         fs.copyFileSync(srcFile, destFile);
      }
    }
  });

  await Promise.all(promises);
}

export function updateImageReferencesInHtml(html) {
  // Only update internal/local images mapped in src attributes.
  return html.replace(/(src=")(?!http|\/\/)([^"]+)\.(jpg|jpeg|png)(")/gi, '$1$2.webp$4');
}
