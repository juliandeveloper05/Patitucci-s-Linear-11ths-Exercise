/**
 * PWA Icon Generator Script
 * Generates all required PWA icons from a source logo
 * 
 * Usage:
 * 1. Place your logo.svg or logo.png in the project root
 * 2. Run: npm run pwa:generate-icons
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  outputDir: path.join(__dirname, '..', 'public', 'icons'),
  backgroundColor: '#0D1B2A', // Bass Academy primary color
  accentColor: '#C9A554',     // Academic gold
  padding: 0.1, // 10% padding
};

// Icon sizes for PWA
const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

/**
 * Ensure output directory exists
 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
}

/**
 * Create a Bass Academy icon SVG
 */
function createIconSVG(size) {
  const padding = Math.round(size * 0.15);
  const innerSize = size - (padding * 2);
  const centerX = size / 2;
  const centerY = size / 2;
  
  // Bass guitar neck representation
  const neckWidth = innerSize * 0.12;
  const neckHeight = innerSize * 0.5;
  const neckX = centerX - (neckWidth / 2);
  const neckY = centerY - (neckHeight / 2) - (innerSize * 0.1);
  
  // Bass body (simplified)
  const bodyWidth = innerSize * 0.4;
  const bodyHeight = innerSize * 0.35;
  const bodyX = centerX - (bodyWidth / 2);
  const bodyY = neckY + neckHeight - (bodyHeight * 0.2);
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${size}" height="${size}" fill="${CONFIG.backgroundColor}"/>
  
  <!-- Decorative circle -->
  <circle cx="${centerX}" cy="${centerY}" r="${innerSize * 0.42}" 
          fill="none" stroke="${CONFIG.accentColor}" stroke-width="${size * 0.015}" opacity="0.3"/>
  
  <!-- Bass Guitar Body (stylized) -->
  <ellipse cx="${centerX}" cy="${bodyY + bodyHeight/2}" 
           rx="${bodyWidth/2}" ry="${bodyHeight/2}" 
           fill="${CONFIG.accentColor}"/>
  
  <!-- Bass Neck -->
  <rect x="${neckX}" y="${neckY}" 
        width="${neckWidth}" height="${neckHeight}" 
        rx="${neckWidth * 0.2}" ry="${neckWidth * 0.2}"
        fill="${CONFIG.accentColor}"/>
  
  <!-- Headstock -->
  <rect x="${neckX - neckWidth * 0.3}" y="${neckY - neckHeight * 0.15}" 
        width="${neckWidth * 1.6}" height="${neckHeight * 0.18}" 
        rx="${neckWidth * 0.15}" ry="${neckWidth * 0.15}"
        fill="${CONFIG.accentColor}"/>
  
  <!-- Tuning pegs -->
  <circle cx="${neckX}" cy="${neckY - neckHeight * 0.08}" r="${size * 0.015}" fill="#E0C285"/>
  <circle cx="${neckX + neckWidth}" cy="${neckY - neckHeight * 0.08}" r="${size * 0.015}" fill="#E0C285"/>
  
  <!-- Strings (simplified) -->
  <line x1="${centerX - neckWidth * 0.25}" y1="${neckY + neckHeight * 0.1}" 
        x2="${centerX - neckWidth * 0.25}" y2="${bodyY + bodyHeight * 0.6}" 
        stroke="#1B263B" stroke-width="${size * 0.004}"/>
  <line x1="${centerX + neckWidth * 0.25}" y1="${neckY + neckHeight * 0.1}" 
        x2="${centerX + neckWidth * 0.25}" y2="${bodyY + bodyHeight * 0.6}" 
        stroke="#1B263B" stroke-width="${size * 0.004}"/>
  
  <!-- Sound hole -->
  <circle cx="${centerX}" cy="${bodyY + bodyHeight * 0.45}" 
          r="${bodyWidth * 0.12}" fill="${CONFIG.backgroundColor}"/>
  
  <!-- Bridge -->
  <rect x="${centerX - bodyWidth * 0.2}" y="${bodyY + bodyHeight * 0.65}" 
        width="${bodyWidth * 0.4}" height="${bodyHeight * 0.08}" 
        rx="${size * 0.01}" fill="#1B263B"/>
</svg>`;
}

/**
 * Generate a single icon
 */
async function generateIcon(size, outputPath) {
  try {
    const svgContent = createIconSVG(size);
    
    await sharp(Buffer.from(svgContent))
      .resize(size, size)
      .png()
      .toFile(outputPath);
    
    return true;
  } catch (error) {
    console.error(`❌ Error generating ${outputPath}:`, error.message);
    return false;
  }
}

/**
 * Generate all PWA icons
 */
async function generateAllIcons() {
  console.log('🎸 Bass Academy - PWA Icon Generator\n');
  console.log(`📂 Output: ${CONFIG.outputDir}\n`);
  
  // Ensure output directory exists
  ensureDir(CONFIG.outputDir);
  
  // Generate standard icons
  console.log('⚙️  Generating PWA icons...');
  let successCount = 0;
  
  for (const size of ICON_SIZES) {
    const name = `icon-${size}x${size}.png`;
    const outputPath = path.join(CONFIG.outputDir, name);
    const success = await generateIcon(size, outputPath);
    
    if (success) {
      successCount++;
      console.log(`  ✅ ${name} (${size}x${size})`);
    }
  }
  
  // Generate maskable icon (with more padding)
  console.log('\n⚙️  Generating maskable icon...');
  const maskablePath = path.join(CONFIG.outputDir, 'icon-maskable.png');
  const maskableSuccess = await generateIcon(512, maskablePath);
  
  if (maskableSuccess) {
    successCount++;
    console.log(`  ✅ icon-maskable.png (512x512)`);
  }
  
  // Summary
  console.log(`\n✨ Generated ${successCount}/${ICON_SIZES.length + 1} icons successfully!`);
  console.log('\n📝 Next steps:');
  console.log('  1. Review icons in public/icons/');
  console.log('  2. Run: npm run dev');
  console.log('  3. Test PWA in Chrome DevTools > Application\n');
}

// Main execution
(async () => {
  try {
    await generateAllIcons();
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
})();
