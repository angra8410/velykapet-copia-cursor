/**
 * generate-images.js (mapa de posiciones por imagen)
 * Genera variantes (JPG, WebP, AVIF) y permite definir position por imagen para evitar recortes indeseados.
 *
 * Uso:
 *   node scripts/generate-images.js <input-file|input-folder> <output-folder> [prefix]
 *
 * Ejemplos:
 *   node scripts/generate-images.js ./originals ./velykapet-main/public/images gallery
 *   node scripts/generate-images.js ./originals/imagen01-perroygato.jpg ./velykapet-main/public/images gallery-imagen01-perroygato
 *
 * Requisitos:
 *   npm install sharp
 */

const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

const SIZES = [
  { name: 'desktop', w: 1120, h: 640 },       // 1x
  { name: 'desktop@2x', w: 2240, h: 1280 },   // 2x
  { name: 'tablet', w: 420, h: 300 },
  { name: 'tablet@2x', w: 840, h: 600 },
  { name: 'mobile', w: 360, h: 260 },
  { name: 'mobile@2x', w: 720, h: 520 }
];

const JPG_QUALITY = 85;
const WEBP_QUALITY = 80;
const AVIF_QUALITY = 45;

/**
 * Mapa de posiciones por base de nombre de archivo (sin extensión).
 * Ajusta aquí las reglas por imagen:
 * - 'imagen01-perroygato' => 'south'  (prioriza la parte inferior)
 * - 'imagen02-max' => 'attention' (auto)
 * - 'imagen03-perro-negro' => 'attention'
 *
 * Posibles valores: 'attention', 'entropy', 'north', 'south', 'center', 'east', 'west', etc.
 */
const POSITION_MAP = {
  'imagen01-perroygato': 'south',
  'imagen02-max': 'attention',
  'imagen03-perro-negro': 'attention'
};

/**
 * Para imágenes que prefieres NO recortar (show full image), pon en NO_CROP_MAP = true
 * y el script usará fit: 'contain' y rellenará con fondo amarillo.
 */
const NO_CROP_MAP = {
  // 'imagen01-perroygato': true
};

async function processImage(inputPath, outDir, prefix) {
  const inputName = path.basename(inputPath, path.extname(inputPath));
  const base = prefix || inputName;

  // baseName to lookup without prefix parts if prefix used earlier
  const lookupName = path.basename(base);

  await fs.mkdir(outDir, { recursive: true });

  for (const size of SIZES) {
    const filenameBase = `${base}-${size.w}x${size.h}`;
    const jpgOut = path.join(outDir, `${filenameBase}.jpg`);
    const webpOut = path.join(outDir, `${filenameBase}.webp`);
    const avifOut = path.join(outDir, `${filenameBase}.avif`);

    const noCrop = NO_CROP_MAP[lookupName];
    const position = POSITION_MAP[lookupName] || 'attention';
    const resizeOptions = noCrop
      ? { fit: 'contain', background: '#FFD400' } // amarillo como fondo de la card
      : { fit: 'cover', position: position };

    try {
      await sharp(inputPath)
        .resize(size.w, size.h, resizeOptions)
        .jpeg({ quality: JPG_QUALITY })
        .toFile(jpgOut);

      await sharp(inputPath)
        .resize(size.w, size.h, resizeOptions)
        .webp({ quality: WEBP_QUALITY })
        .toFile(webpOut);

      try {
        await sharp(inputPath)
          .resize(size.w, size.h, resizeOptions)
          .avif({ quality: AVIF_QUALITY })
          .toFile(avifOut);
      } catch (err) {
        console.warn(`AVIF no generado para ${filenameBase}: ${err.message}`);
      }

      console.log(`Generado: ${filenameBase} (jpg, webp, avif)`);
    } catch (err) {
      console.error(`Error generando ${filenameBase}: ${err.message}`);
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Uso: node scripts/generate-images.js <input-file|input-folder> <output-folder> [prefix]');
    process.exit(1);
  }

  const [input, outDir, prefixArg] = args;
  try {
    const stat = await fs.stat(input);
    if (stat.isDirectory()) {
      const files = await fs.readdir(input);
      const images = files.filter(f => /\.(jpe?g|png)$/i.test(f));
      for (const img of images) {
        const inputPath = path.join(input, img);
        // default prefix: prefixArg + '-' + filenameWithoutExt (si se pasa prefixArg)
        const nameNoExt = path.basename(img, path.extname(img));
        const imgPrefix = prefixArg ? `${prefixArg}-${nameNoExt}` : nameNoExt;
        await processImage(inputPath, outDir, imgPrefix);
      }
    } else if (stat.isFile()) {
      const basePrefix = prefixArg || path.basename(input, path.extname(input));
      await processImage(input, outDir, basePrefix);
    } else {
      throw new Error('Input no es archivo ni carpeta válida.');
    }
    console.log('Todas las imágenes procesadas.');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();