# Category Cards R2 Image Setup Guide

## Overview
This document provides instructions for setting up and debugging the R2-hosted images for category cards on the homepage.

## Quick Diagnostic Script

Paste this in your browser's DevTools console to check image loading status:

```javascript
// Diagnóstico rápido para imágenes en category cards
document.querySelectorAll('.category-card img, .category-picture img').forEach(img => {
  console.log({
    alt: img.alt,
    src: img.currentSrc || img.src,
    naturalWidth: img.naturalWidth,
    naturalHeight: img.naturalHeight,
    computedWidth: getComputedStyle(img).width,
    computedHeight: getComputedStyle(img).height,
    display: getComputedStyle(img).display,
    objectFit: getComputedStyle(img).objectFit,
    visible: img.complete && img.naturalWidth > 0,
    error: !img.complete || img.naturalWidth === 0
  });
  
  // Add error handler to track failures
  img.onerror = () => {
    console.warn('❌ IMAGE LOAD ERROR:', img.src);
    img.style.outline = '3px solid red';
  };
});
```

## Expected Image URLs

The category cards expect the following R2 URLs structure:

```javascript
{
  img1x: "https://www.velykapet.com/velyka-gallery/gallery/principal/FOTO_PERRO_GATO_ALIMENTO.jpg",
  img2x: "https://www.velykapet.com/velyka-gallery/gallery/retina/FOTO_PERRO_GATO_ALIMENTO.jpg",
  thumb: "https://www.velykapet.com/velyka-gallery/gallery/miniatura/FOTO_PERRO_GATO_ALIMENTO.jpg",
  og: "https://www.velykapet.com/velyka-gallery/gallery/social-og/FOTO_PERRO_GATO_ALIMENTO.jpg"
}
```

## R2 Bucket Setup

### Required Files in R2 Bucket

Upload the following files to your `velyka-gallery` R2 bucket:

**Principal folder (1120x640):**
- `principal/FOTO_PERRO_GATO_ALIMENTO.jpg`
- `principal/FOTO_PERRO_SALUD_Y_BIENESTAR.jpg`
- `principal/FOTO_PERRO_JUGUETES_Y_ACCESORIOS.jpg`

**Retina folder (2240x1280 @2x):**
- `retina/FOTO_PERRO_GATO_ALIMENTO.jpg`
- `retina/FOTO_PERRO_SALUD_Y_BIENESTAR.jpg`
- `retina/FOTO_PERRO_JUGUETES_Y_ACCESORIOS.jpg`

**Miniatura folder (420x240):**
- `miniatura/FOTO_PERRO_GATO_ALIMENTO.jpg`
- `miniatura/FOTO_PERRO_SALUD_Y_BIENESTAR.jpg`
- `miniatura/FOTO_PERRO_JUGUETES_Y_ACCESORIOS.jpg`

**Social-OG folder (1200x630):**
- `social-og/FOTO_PERRO_GATO_ALIMENTO.jpg`
- `social-og/FOTO_PERRO_SALUD_Y_BIENESTAR.jpg`
- `social-og/FOTO_PERRO_JUGUETES_Y_ACCESORIOS.jpg`

## Generating Images with Sharp

If you need to generate retina (@2x) versions or optimize images:

```bash
# Using Docker with Sharp
docker run --rm -v "${PWD}:/work" -w /work node:18-bullseye bash -c "
npm install sharp && \
node -e \"
const sharp = require('sharp');
(async () => {
  // Generate retina version (2x)
  await sharp('./source/image.jpg')
    .resize(2240, 1280)
    .jpeg({quality: 85})
    .toFile('./retina/image@2x.jpg');
  
  // Generate principal version (1x)  
  await sharp('./source/image.jpg')
    .resize(1120, 640)
    .jpeg({quality: 85})
    .toFile('./principal/image.jpg');
    
  // Generate thumbnail
  await sharp('./source/image.jpg')
    .resize(420, 240)
    .jpeg({quality: 80})
    .toFile('./miniatura/image-thumb.jpg');
    
  console.log('✅ Images generated');
})();
\"
"
```

## Uploading to Cloudflare R2

### Prerequisites
```bash
export AWS_ACCESS_KEY_ID="YOUR_R2_ACCESS_KEY"
export AWS_SECRET_ACCESS_KEY="YOUR_R2_SECRET_KEY"
export R2_ACCOUNT_ID="YOUR_CLOUDFLARE_ACCOUNT_ID"
export R2_BUCKET="velyka-gallery"
export R2_ENDPOINT="https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
```

### Upload Commands

```bash
# Upload principal images
aws --endpoint-url "$R2_ENDPOINT" s3 cp \
  ./principal/FOTO_PERRO_GATO_ALIMENTO.jpg \
  s3://$R2_BUCKET/gallery/principal/FOTO_PERRO_GATO_ALIMENTO.jpg \
  --content-type "image/jpeg" \
  --acl public-read

# Upload retina images
aws --endpoint-url "$R2_ENDPOINT" s3 cp \
  ./retina/FOTO_PERRO_GATO_ALIMENTO.jpg \
  s3://$R2_BUCKET/gallery/retina/FOTO_PERRO_GATO_ALIMENTO.jpg \
  --content-type "image/jpeg" \
  --acl public-read

# Upload thumbnails
aws --endpoint-url "$R2_ENDPOINT" s3 cp \
  ./miniatura/FOTO_PERRO_GATO_ALIMENTO.jpg \
  s3://$R2_BUCKET/gallery/miniatura/FOTO_PERRO_GATO_ALIMENTO.jpg \
  --content-type "image/jpeg" \
  --acl public-read
  
# Batch upload all files in a folder
aws --endpoint-url "$R2_ENDPOINT" s3 sync \
  ./principal/ \
  s3://$R2_BUCKET/gallery/principal/ \
  --content-type "image/jpeg" \
  --acl public-read
```

## R2 Bucket Configuration

### CORS Settings

Add CORS configuration to your R2 bucket:

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

### Public Access

Ensure the bucket allows public reads:
1. Go to Cloudflare Dashboard → R2 → velyka-gallery
2. Settings → Public Access → Enable
3. Set custom domain: `www.velykapet.com/velyka-gallery`

## Testing Locally

### 1. Start Development Server
```bash
npm install
npm run dev
```

### 2. Open Browser
Navigate to `http://localhost:3333/`

### 3. Check DevTools
- **Network Tab**: Filter by "img" → Check for 200 status codes
- **Console Tab**: Look for image load errors
- **Elements Tab**: Inspect `<picture>` and `<img>` elements

### 4. Test Retina Display
In Chrome DevTools:
1. Open DevTools (F12)
2. Click 3-dot menu → More tools → Rendering
3. Scroll to "Emulate device pixel ratio"
4. Select "2" or "3"
5. Reload page
6. Check Network tab - should request @2x images

## Troubleshooting

### Images Not Loading

**Check DNS Resolution:**
```bash
nslookup www.velykapet.com
dig www.velykapet.com
```

**Test R2 URL Directly:**
```bash
curl -I "https://www.velykapet.com/velyka-gallery/gallery/principal/FOTO_PERRO_GATO_ALIMENTO.jpg"
```

Expected response: `HTTP/1.1 200 OK`

**Common Issues:**
- ❌ `ERR_BLOCKED_BY_CLIENT` → Browser extension blocking request (disable ad blockers)
- ❌ `404 Not Found` → File doesn't exist in R2 or path is wrong
- ❌ `403 Forbidden` → Bucket permissions not set to public
- ❌ `CORS Error` → CORS headers not configured on bucket
- ❌ `DNS_PROBE_FINISHED_NXDOMAIN` → Custom domain not configured

### Fallback Behavior

When images fail to load:
- ✅ Console logs error with full URL
- ✅ Image gets red outline (for QA)
- ✅ Fallback emoji 🐾 displays in image container
- ✅ Card remains functional and clickable

## Keyboard Testing

Test accessibility:
1. Press `Tab` to navigate to category cards
2. Each card should show visible focus outline
3. Press `Enter` to activate card
4. Focus should be visible and clear

## Performance Testing

### Lazy Loading
Images use `loading="lazy"` attribute:
- Images below viewport won't load until scrolled into view
- Check Network tab - images load as you scroll

### Srcset Verification
Check which image variant loads:
```javascript
document.querySelectorAll('.category-card img').forEach(img => {
  console.log({
    alt: img.alt,
    currentSrc: img.currentSrc, // Actual URL browser chose
    srcset: img.srcset           // Available options
  });
});
```

## Production Checklist

Before deploying to production:

- [ ] R2 bucket configured with public access
- [ ] CORS headers set correctly
- [ ] Custom domain `www.velykapet.com/velyka-gallery` pointing to R2
- [ ] All image files uploaded (principal, retina, miniatura, social-og)
- [ ] Images load with 200 status in Network tab
- [ ] Retina images load on high-DPI displays
- [ ] Lazy loading works correctly
- [ ] Fallback emoji shows if image fails
- [ ] Keyboard navigation works
- [ ] No console errors
- [ ] Images have correct alt text
- [ ] Performance is acceptable (< 2s load time)

## Support

For issues or questions:
- Check browser console for error messages
- Run diagnostic script above
- Verify R2 bucket configuration
- Check Cloudflare R2 dashboard for bucket status
- Test URLs directly with curl or browser

---

**Last Updated:** 2025-11-08  
**Related PR:** feat/fix-gallery-images  
**Component:** CategoryCard.js, CategoryCard.jsx
