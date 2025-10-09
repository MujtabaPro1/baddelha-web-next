const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Add sharp to your dependencies if not already installed:
// npm install sharp --save-dev

const PUBLIC_DIR = path.join(__dirname, '../public');
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

// Create optimized versions of images
async function optimizeImages() {
  try {
    const files = fs.readdirSync(PUBLIC_DIR);
    
    for (const file of files) {
      const filePath = path.join(PUBLIC_DIR, file);
      const ext = path.extname(file).toLowerCase();
      
      // Skip if not an image or already optimized
      if (!IMAGE_EXTENSIONS.includes(ext) || file.includes('.optimized.')) {
        continue;
      }
      
      const stats = fs.statSync(filePath);
      if (!stats.isFile()) continue;
      
      console.log(`Optimizing: ${file}`);
      
      // Generate WebP version
      const webpOutput = path.join(
        PUBLIC_DIR, 
        `${path.basename(file, ext)}.webp`
      );
      
      await sharp(filePath)
        .webp({ quality: 80 })
        .toFile(webpOutput);
      
      // Generate responsive sizes for original format
      const sizes = [640, 960, 1280];
      
      for (const size of sizes) {
        const resizedOutput = path.join(
          PUBLIC_DIR,
          `${path.basename(file, ext)}-${size}${ext}`
        );
        
        await sharp(filePath)
          .resize(size)
          .toFile(resizedOutput);
      }
    }
    
    console.log('Image optimization complete!');
  } catch (error) {
    console.error('Error optimizing images:', error);
  }
}

optimizeImages();
