# Gallery Images - README

## Overview

This document describes the gallery image naming convention and provides commands to generate optimized images in multiple formats (webp, retina) for the VelyKapet category cards.

## Directory Structure

```
public/images/
├── gallery/
│   ├── principal/       # Main images (1120x640 px)
│   ├── retina/         # Retina 2x images (2240x1280 px)
│   └── miniatura/      # Thumbnail images (420x240 px)
└── webp/               # WebP format images
```

## Naming Convention

All images follow a consistent naming pattern to enable automatic srcset generation:

### Pattern

```
{baseImage}-{type}-{dimensions}[@2x].{ext}
```

### Examples

For a base image named `imagen01-perroygato`:

- **Principal (1x JPEG)**: `imagen01-perroygato-gallery-1120x640.jpg`
- **Retina (2x JPEG)**: `imagen01-perroygato-gallery-2240x1280@2x.jpg`
- **Thumbnail (JPEG)**: `imagen01-perroygato-thumb-420x240.jpg`
- **WebP Principal**: `imagen01-perroygato-gallery-1120x640.webp`
- **WebP Retina**: `imagen01-perroygato-gallery-2240x1280@2x.webp`

### Base Image Names (Current Categories)

1. `imagen01-alimento` - Food category
2. `imagen02-salud` - Health & Wellness category
3. `imagen03-juguetes` - Toys & Accessories category

## Image Dimensions

| Type | Dimensions | Purpose |
|------|------------|---------|
| Principal | 1120x640 | Main display (1x DPR) |
| Retina | 2240x1280 | Retina display (2x DPR) |
| Thumbnail | 420x240 | Small previews/loading |
| Social OG | 1200x630 | Social media sharing (future) |

## Generating Images with Sharp (Node.js)

### Prerequisites

```bash
npm install sharp
```

Or use Docker (recommended for consistency):

```bash
# Pull node image with sharp dependencies
docker pull node:18-bullseye
```

### Commands

#### Generate WebP + Retina for a Single Image

```bash
# Using Docker (recommended)
docker run --rm -v "${PWD}:/work" -w /work node:18-bullseye bash -lc "
npm install sharp && node -e \"const sharp=require('sharp'); (async ()=>{ 
  const base='./public/images/gallery/principal/imagen01-alimento-gallery-1120x640.jpg'; 
  await sharp(base).webp({quality:80}).toFile('./public/images/webp/imagen01-alimento-gallery-1120x640.webp'); 
  await sharp(base).resize(2240,1280).jpeg({quality:85}).toFile('./public/images/gallery/retina/imagen01-alimento-gallery-2240x1280@2x.jpg'); 
  console.log('✅ Done'); 
})()\""
```

#### Batch Process All Images in Principal Directory

**Linux/macOS:**

```bash
for f in public/images/gallery/principal/*-gallery-1120x640.jpg; do
  base=$(basename "$f" -gallery-1120x640.jpg)
  echo "Processing $base"
  docker run --rm -v "${PWD}:/work" -w /work node:18-bullseye bash -lc "
  npm install sharp && node -e \"const sharp=require('sharp'); (async ()=>{ 
    const inputFile='./public/images/gallery/principal/${base}-gallery-1120x640.jpg';
    await sharp(inputFile).webp({quality:80}).toFile('./public/images/webp/${base}-gallery-1120x640.webp'); 
    await sharp(inputFile).resize(2240,1280).jpeg({quality:85}).toFile('./public/images/gallery/retina/${base}-gallery-2240x1280@2x.jpg'); 
    await sharp(inputFile).resize(2240,1280).webp({quality:80}).toFile('./public/images/webp/${base}-gallery-2240x1280@2x.webp'); 
    console.log('✅ $base done'); 
  })()\""
done
```

**Windows (PowerShell):**

```powershell
Get-ChildItem "public/images/gallery/principal/*-gallery-1120x640.jpg" | ForEach-Object {
  $base = $_.BaseName -replace '-gallery-1120x640$',''
  Write-Host "Processing $base"
  docker run --rm -v "${PWD}:/work" -w /work node:18-bullseye bash -lc "
  npm install sharp && node -e \`"const sharp=require('sharp'); (async ()=>{ 
    const inputFile='./public/images/gallery/principal/${base}-gallery-1120x640.jpg';
    await sharp(inputFile).webp({quality:80}).toFile('./public/images/webp/${base}-gallery-1120x640.webp'); 
    await sharp(inputFile).resize(2240,1280).jpeg({quality:85}).toFile('./public/images/gallery/retina/${base}-gallery-2240x1280@2x.jpg'); 
    await sharp(inputFile).resize(2240,1280).webp({quality:80}).toFile('./public/images/webp/${base}-gallery-2240x1280@2x.webp'); 
    console.log('✅ ${base} done'); 
  })()\`""
}
```

#### Generate Thumbnails

```bash
docker run --rm -v "${PWD}:/work" -w /work node:18-bullseye bash -lc "
npm install sharp && node -e \"const sharp=require('sharp'); (async ()=>{ 
  const fs = require('fs');
  const files = fs.readdirSync('./public/images/gallery/principal');
  for (const file of files) {
    if (file.endsWith('-gallery-1120x640.jpg')) {
      const base = file.replace('-gallery-1120x640.jpg', '');
      await sharp('./public/images/gallery/principal/' + file)
        .resize(420, 240)
        .jpeg({quality:80})
        .toFile('./public/images/gallery/miniatura/' + base + '-thumb-420x240.jpg');
      console.log('✅ Thumbnail:', base);
    }
  }
})()\""
```

## Quality Settings

- **WebP Quality**: 80 (good balance between quality and file size)
- **JPEG Quality**: 85 (high quality for retina displays)
- **Thumbnail Quality**: 80 (sufficient for small previews)

## File Size Guidelines

- Principal JPEG: < 150KB
- Retina JPEG: < 300KB
- WebP Principal: < 100KB
- WebP Retina: < 200KB
- Thumbnails: < 30KB

## Browser Support

### WebP Format
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (iOS 14+, macOS 11+)
- Fallback: JPEG for older browsers

### Picture Element & Srcset
- Modern browsers: ✅ Full support
- Legacy browsers: ✅ Graceful degradation to `<img>` src

## Accessibility

All images must include:

1. **Descriptive alt text** - Describe the image content
2. **Proper aspect ratio** - Maintain consistent ratios to prevent layout shift
3. **Lazy loading** - Use `loading="lazy"` for images below the fold
4. **High contrast** - Ensure text overlays meet WCAG AA standards (4.5:1 ratio)

## Usage Example

```javascript
import CategoryCard from './components/CategoryCard/CategoryCard';

<CategoryCard
  baseImage="imagen01-alimento"
  category="Alimento"
  subtitle="Nutrición premium para tu mascota"
  color="#FF6B6B"
  fit="cover"
  alt="Alimento premium para perros y gatos con ingredientes naturales"
  onClick={() => handleCategoryClick('alimento')}
/>
```

## Troubleshooting

### Images Not Loading

1. Verify file paths match naming convention exactly
2. Check that all required image versions exist (1x, 2x, webp)
3. Ensure image files are in correct directories
4. Check browser console for 404 errors

### Poor Image Quality

1. Increase quality setting (80 → 90)
2. Verify source images are high resolution
3. Check that retina images are exactly 2x dimensions

### Large File Sizes

1. Reduce quality setting (85 → 75)
2. Optimize source images before processing
3. Consider using WebP exclusively for supported browsers

## Adding New Categories

1. Add high-quality source image (min 2240x1280 px) to `principal/` folder
2. Follow naming convention: `{baseImage}-gallery-1120x640.jpg`
3. Run batch processing commands to generate all variants
4. Add entry to `src/data/categories.js`
5. Verify all image variants are generated correctly

## Notes

- **DO NOT** commit original high-resolution images (> 100MB) to the repository
- Use Git LFS for very large source files if needed
- Always test images on retina displays (DPR = 2)
- Verify lazy loading works correctly
- Test keyboard navigation and screen reader compatibility

## Resources

- [Sharp Documentation](https://sharp.pixelplumbing.com/)
- [WebP Best Practices](https://developers.google.com/speed/webp)
- [Responsive Images Guide](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
