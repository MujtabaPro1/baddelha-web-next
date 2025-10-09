const fs = require('fs');
const path = require('path');
const chalk = require('chalk'); // You'll need to install this: npm install chalk

// Paths
const NEXT_DIR = path.join(__dirname, '../.next');
const BUILD_MANIFEST = path.join(NEXT_DIR, 'build-manifest.json');
const TRACE_FILE = path.join(NEXT_DIR, 'trace');

// Size formatting
function formatSize(size) {
  if (size < 1024) return size + ' B';
  else if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB';
  else return (size / (1024 * 1024)).toFixed(2) + ' MB';
}

// Check if Next.js build exists
if (!fs.existsSync(NEXT_DIR)) {
  console.error(chalk.red('No .next directory found. Run `npm run build` first.'));
  process.exit(1);
}

// Analyze bundle sizes
function analyzeBundleSizes() {
  console.log(chalk.blue.bold('\n📊 Bundle Size Analysis\n'));
  
  try {
    // Read build manifest
    const manifest = JSON.parse(fs.readFileSync(BUILD_MANIFEST, 'utf8'));
    
    // Get all JS files
    const jsFiles = new Set();
    Object.values(manifest).forEach(files => {
      files.forEach(file => {
        if (file.endsWith('.js')) jsFiles.add(file);
      });
    });
    
    // Calculate sizes
    const fileSizes = Array.from(jsFiles).map(file => {
      const filePath = path.join(NEXT_DIR, file);
      let size = 0;
      
      try {
        const stats = fs.statSync(filePath);
        size = stats.size;
      } catch (e) {
        console.warn(chalk.yellow(`Could not read file: ${file}`));
      }
      
      return { file, size };
    });
    
    // Sort by size (largest first)
    fileSizes.sort((a, b) => b.size - a.size);
    
    // Print results
    console.log(chalk.green('Largest JS bundles:'));
    fileSizes.slice(0, 10).forEach((item, i) => {
      console.log(`${i + 1}. ${chalk.cyan(item.file)}: ${chalk.yellow(formatSize(item.size))}`);
    });
    
    // Total size
    const totalSize = fileSizes.reduce((sum, item) => sum + item.size, 0);
    console.log(`\nTotal JS size: ${chalk.yellow(formatSize(totalSize))}`);
    
  } catch (error) {
    console.error(chalk.red('Error analyzing bundle sizes:'), error);
  }
}

// Analyze critical path
function analyzeCriticalPath() {
  console.log(chalk.blue.bold('\n⚡ Critical Path Analysis\n'));
  
  try {
    // Check if trace file exists
    if (!fs.existsSync(TRACE_FILE)) {
      console.log(chalk.yellow('No trace file found. Run build with TRACE_TURBOPACK=1 for detailed tracing.'));
      return;
    }
    
    // This is a simplified analysis - for real projects you'd want to use
    // tools like Lighthouse or WebPageTest for detailed critical path analysis
    console.log(chalk.green('Critical rendering path optimization tips:'));
    console.log('1. Ensure CSS for above-the-fold content is inlined');
    console.log('2. Defer non-critical CSS and JavaScript');
    console.log('3. Preload critical assets (fonts, hero images)');
    console.log('4. Use responsive images with srcset');
    console.log('5. Implement proper caching strategies');
    
  } catch (error) {
    console.error(chalk.red('Error analyzing critical path:'), error);
  }
}

// Analyze image optimization
function analyzeImages() {
  console.log(chalk.blue.bold('\n🖼️ Image Optimization Analysis\n'));
  
  const publicDir = path.join(__dirname, '../public');
  
  try {
    if (!fs.existsSync(publicDir)) {
      console.log(chalk.yellow('No public directory found.'));
      return;
    }
    
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const images = [];
    
    function scanDir(dir) {
      const files = fs.readdirSync(dir);
      
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
          scanDir(filePath);
        } else if (imageExtensions.includes(path.extname(file).toLowerCase())) {
          images.push({
            path: path.relative(publicDir, filePath),
            size: stats.size
          });
        }
      });
    }
    
    scanDir(publicDir);
    
    // Sort by size (largest first)
    images.sort((a, b) => b.size - a.size);
    
    // Print results
    console.log(chalk.green('Largest images:'));
    images.slice(0, 10).forEach((item, i) => {
      console.log(`${i + 1}. ${chalk.cyan(item.path)}: ${chalk.yellow(formatSize(item.size))}`);
    });
    
    // Total size
    const totalSize = images.reduce((sum, item) => sum + item.size, 0);
    console.log(`\nTotal image size: ${chalk.yellow(formatSize(totalSize))}`);
    
    // Optimization tips
    if (images.length > 0) {
      console.log('\nOptimization tips:');
      console.log('- Consider using WebP format for better compression');
      console.log('- Use responsive images with multiple sizes');
      console.log('- Lazy load images below the fold');
      console.log('- Run the optimize-images script to compress large images');
    }
    
  } catch (error) {
    console.error(chalk.red('Error analyzing images:'), error);
  }
}

// Run all analyses
console.log(chalk.bold('🚀 Next.js Bundle Analysis'));
analyzeBundleSizes();
analyzeCriticalPath();
analyzeImages();

console.log(chalk.blue.bold('\n✅ Analysis Complete\n'));
console.log('For more detailed analysis, consider using:');
console.log('- Lighthouse for performance auditing');
console.log('- WebPageTest for network waterfall analysis');
console.log('- next-bundle-analyzer for detailed bundle visualization');
