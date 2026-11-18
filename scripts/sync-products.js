const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'products');
const destDir = path.join(__dirname, '..', 'public', 'products');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

if (fs.existsSync(srcDir)) {
  const files = fs.readdirSync(srcDir);
  console.log(`Syncing ${files.length} product images from ./products to ./public/products...`);
  
  files.forEach((file, index) => {
    const srcFile = path.join(srcDir, file);
    const destFile = path.join(destDir, file);
    fs.copyFileSync(srcFile, destFile);

    // Also copy as standard indexed name (product-1.jpg, etc.)
    const indexedFile = path.join(destDir, `product-${index + 1}.jpg`);
    fs.copyFileSync(srcFile, indexedFile);
  });

  // Explicit mappings for BAMO perfumes
  const mappings = {
    'WhatsApp Image 2026-11-16 at 7.44.42 PM.jpeg': 'bamo-roselia.jpg',
    'WhatsApp Image 2026-11-16 at 7.44.42 PM (1).jpeg': 'bamo-divine.jpg',
    'WhatsApp Image 2026-11-16 at 7.44.42 PM (2).jpeg': 'bamo-nuit-dor.jpg',
    'WhatsApp Image 2026-11-16 at 7.44.42 PM (3).jpeg': 'bamo-verona.jpg',
  };

  for (const [orig, named] of Object.entries(mappings)) {
    const src = path.join(srcDir, orig);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(destDir, named));
    }
  }

  console.log('Product images synced successfully!');
}
