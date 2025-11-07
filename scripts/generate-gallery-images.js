// Generate WebP and retina versions of gallery images
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const principalDir = './public/images/gallery/principal';
const retinaDir = './public/images/gallery/retina';
const webpDir = './public/images/webp';

async function processImage(filename) {
    const baseName = filename.replace('-gallery-1120x640.jpg', '');
    const inputPath = path.join(principalDir, filename);
    
    console.log(`Processing: ${baseName}`);
    
    try {
        // Generate WebP 1x (1120x640)
        await sharp(inputPath)
            .webp({ quality: 80 })
            .toFile(path.join(webpDir, `${baseName}-gallery-1120x640.webp`));
        console.log(`  ✅ WebP 1x created`);
        
        // Generate WebP 2x (2240x1280)
        await sharp(inputPath)
            .resize(2240, 1280)
            .webp({ quality: 80 })
            .toFile(path.join(webpDir, `${baseName}-gallery-2240x1280@2x.webp`));
        console.log(`  ✅ WebP 2x created`);
        
        // Generate JPEG 2x (2240x1280) - overwrite existing
        await sharp(inputPath)
            .resize(2240, 1280)
            .jpeg({ quality: 85 })
            .toFile(path.join(retinaDir, `${baseName}-gallery-2240x1280@2x.jpg`));
        console.log(`  ✅ JPEG 2x created`);
        
        console.log(`✅ Completed: ${baseName}`);
    } catch (error) {
        console.error(`❌ Error processing ${baseName}:`, error.message);
    }
}

async function main() {
    console.log('🚀 Starting image processing...\n');
    
    // Read all files in principal directory
    const files = fs.readdirSync(principalDir);
    const imageFiles = files.filter(f => f.endsWith('-gallery-1120x640.jpg'));
    
    console.log(`Found ${imageFiles.length} images to process\n`);
    
    // Process each image
    for (const file of imageFiles) {
        await processImage(file);
        console.log('');
    }
    
    console.log('✅ All images processed successfully!');
}

main().catch(console.error);
