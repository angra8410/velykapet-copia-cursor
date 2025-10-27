/**
 * generate-single.js (face-api + coco-ssd fallback + better animal handling)
 *
 * - If animal bbox covers most of the image, use 'contain' (no crop).
 * - If animal bbox is moderate, use larger padding for animals (ANIMAL_PADDING).
 * - Humans: use face-api detection + PADDING (default 1.6).
 *
 * Usage:
 *  node scripts/generate-single.js <input> <output> [prefix] [width] [height]
 */

const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

let faceapi = null;
let canvas = null;
let coco = null;
let cocoModel = null;
let faceModelsAvailable = false;
let cocoAvailable = false;

try {
  faceapi = require('@vladmandic/face-api');
  canvas = require('canvas');
  const { Canvas, Image, ImageData } = canvas;
  faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
  console.log('INFO: face-api detected (module loaded).');
} catch (e) {
  faceapi = null;
  console.log('INFO: face-api not available.');
}

try {
  coco = require('@tensorflow-models/coco-ssd');
  console.log('INFO: coco-ssd module available.');
} catch (e) {
  coco = null;
  console.log('INFO: coco-ssd not available.');
}

const MODELS_PATH = path.resolve(__dirname, '..', 'models');
const DEFAULT_WIDTH = 1120;
const DEFAULT_HEIGHT = 640;
const JPG_QUALITY = 85;
const PADDING = 1.6;          // general padding for face detections
const ANIMAL_PADDING = 2.0;   // bigger padding when cropping animals
const ANIMAL_FULL_THRESHOLD = 0.80; // if animal bbox covers >80% width or height -> use 'contain'

async function modelsExist() {
  try {
    const stat = await fs.stat(MODELS_PATH);
    if (!stat.isDirectory()) return false;
    const manifest = path.join(MODELS_PATH, 'ssd_mobilenetv1_model-weights_manifest.json');
    return (await fs.stat(manifest).then(()=>true).catch(()=>false));
  } catch {
    return false;
  }
}

async function loadModelsIfPossible() {
  if (faceapi) {
    const ok = await modelsExist();
    if (ok) {
      console.log('INFO: loading face-api models from', MODELS_PATH);
      await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODELS_PATH);
      await faceapi.nets.faceLandmark68Net.loadFromDisk(MODELS_PATH);
      faceModelsAvailable = true;
    } else {
      console.log('INFO: face-api module present but models not found in', MODELS_PATH);
      faceModelsAvailable = false;
    }
  }
  if (coco) {
    try {
      cocoModel = await coco.load();
      cocoAvailable = true;
      console.log('INFO: coco-ssd model loaded');
    } catch (e) {
      cocoAvailable = false;
      console.log('INFO: coco-ssd failed to load:', e.message || e);
    }
  }
}

async function detectFacesRect(imgBuffer) {
  if (!faceapi || !faceModelsAvailable) return null;
  try {
    const img = await canvas.loadImage(imgBuffer);
    const c = canvas.createCanvas(img.width, img.height);
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);
    const detections = await faceapi.detectAllFaces(c).withFaceLandmarks();
    if (!detections || detections.length === 0) return null;
    let minX = Number.POSITIVE_INFINITY, minY = Number.POSITIVE_INFINITY, maxX = 0, maxY = 0;
    detections.forEach(d => {
      const box = d.detection.box;
      minX = Math.min(minX, box.x);
      minY = Math.min(minY, box.y);
      maxX = Math.max(maxX, box.x + box.width);
      maxY = Math.max(maxY, box.y + box.height);
    });
    return {
      x: Math.max(0, Math.floor(minX)),
      y: Math.max(0, Math.floor(minY)),
      width: Math.floor(maxX - minX),
      height: Math.floor(maxY - minY)
    };
  } catch (e) {
    console.warn('WARN: detectFacesRect failed:', e && e.message ? e.message : e);
    return null;
  }
}

async function detectAnimalsRect(imgBuffer) {
  if (!cocoAvailable || !cocoModel || !canvas) return null;
  try {
    const img = await canvas.loadImage(imgBuffer);
    const c = canvas.createCanvas(img.width, img.height);
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);
    const predictions = await cocoModel.detect(c);
    if (!predictions || predictions.length === 0) return null;
    const pets = predictions.filter(p => p.class === 'dog' || p.class === 'cat').sort((a,b)=>b.score-a.score);
    if (pets.length === 0) return null;
    const best = pets[0];
    const [x,y,w,h] = best.bbox;
    return {
      x: Math.max(0, Math.floor(x)),
      y: Math.max(0, Math.floor(y)),
      width: Math.floor(w),
      height: Math.floor(h)
    };
  } catch (e) {
    console.warn('WARN: detectAnimalsRect failed:', e && e.message ? e.message : e);
    return null;
  }
}

function adjustBoxToAspectAndPad(box, origW, origH, targetW, targetH, paddingFactor = 1.0) {
  const centerX = box.x + box.width / 2;
  const centerY = box.y + box.height / 2;
  let w = box.width * paddingFactor;
  let h = box.height * paddingFactor;
  const targetRatio = targetW / targetH;
  const boxRatio = w / h;
  if (boxRatio > targetRatio) {
    h = w / targetRatio;
  } else {
    w = h * targetRatio;
  }
  let x = Math.round(centerX - w / 2);
  let y = Math.round(centerY - h / 2);
  if (x < 0) x = 0;
  if (y < 0) y = 0;
  if (x + Math.round(w) > origW) x = Math.max(0, origW - Math.round(w));
  if (y + Math.round(h) > origH) y = Math.max(0, origH - Math.round(h));
  return {
    x: Math.floor(x),
    y: Math.floor(y),
    width: Math.min(Math.floor(w), origW),
    height: Math.min(Math.floor(h), origH)
  };
}

async function processImageFile(inputPath, outDir, base, targetW, targetH) {
  console.log(`INFO: processing ${inputPath} -> ${base}-${targetW}x${targetH}.jpg`);
  const inputBuffer = await fs.readFile(inputPath);
  const meta = await sharp(inputBuffer).metadata();
  const origW = meta.width;
  const origH = meta.height;

  let faceBox = null;
  if (faceapi && faceModelsAvailable) {
    faceBox = await detectFacesRect(inputBuffer);
    if (faceBox) console.log(`INFO: human face bbox: x=${faceBox.x},y=${faceBox.y},w=${faceBox.width},h=${faceBox.height}`);
  }

  let animalBox = null;
  if (!faceBox && cocoAvailable) {
    animalBox = await detectAnimalsRect(inputBuffer);
    if (animalBox) console.log(`INFO: animal bbox: x=${animalBox.x},y=${animalBox.y},w=${animalBox.width},h=${animalBox.height}`);
  }

  const filename = `${base}-${targetW}x${targetH}.jpg`;
  const outPath = path.join(outDir, filename);
  await fs.mkdir(outDir, { recursive: true });

  try {
    if (faceBox) {
      // Human face: use normal padding
      const crop = adjustBoxToAspectAndPad(faceBox, origW, origH, targetW, targetH, PADDING);
      console.log(`INFO: extracting crop left=${crop.x} top=${crop.y} width=${crop.width} height=${crop.height}`);
      await sharp(inputBuffer)
        .extract({ left: crop.x, top: crop.y, width: crop.width, height: crop.height })
        .resize(targetW, targetH)
        .jpeg({ quality: JPG_QUALITY })
        .toFile(outPath);
      console.log(`OK: generated (face crop) ${outPath}`);
      return;
    }

    if (animalBox) {
      // If the animal bbox covers almost the whole image, don't crop: use contain to preserve the whole pet.
      const widthRatio = animalBox.width / origW;
      const heightRatio = animalBox.height / origH;
      if (widthRatio >= ANIMAL_FULL_THRESHOLD || heightRatio >= ANIMAL_FULL_THRESHOLD) {
        console.log('INFO: animal bbox covers most of image -> using contain (no crop)');
        await sharp(inputBuffer)
          .resize({ width: targetW, height: targetH, fit: 'contain', background: { r: 255, g: 255, b: 255 } })
          .jpeg({ quality: JPG_QUALITY })
          .toFile(outPath);
        console.log(`OK: generated (animal contain) ${outPath}`);
        return;
      }
      // otherwise crop with larger animal padding
      const crop = adjustBoxToAspectAndPad(animalBox, origW, origH, targetW, targetH, ANIMAL_PADDING);
      console.log(`INFO: extracting animal crop left=${crop.x} top=${crop.y} width=${crop.width} height=${crop.height}`);
      await sharp(inputBuffer)
        .extract({ left: crop.x, top: crop.y, width: crop.width, height: crop.height })
        .resize(targetW, targetH)
        .jpeg({ quality: JPG_QUALITY })
        .toFile(outPath);
      console.log(`OK: generated (animal crop) ${outPath}`);
      return;
    }

    // fallback: attention
    await sharp(inputBuffer)
      .resize(targetW, targetH, { fit: 'cover', position: 'attention' })
      .jpeg({ quality: JPG_QUALITY })
      .toFile(outPath);
    console.log(`OK: generated (attention fallback) ${outPath}`);

  } catch (err) {
    console.error(`ERR: failed generating ${outPath}:`, err && err.message ? err.message : err);
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: node generate-single.js <input> <output> [prefix] [width] [height]');
    process.exit(1);
  }
  const [input, outDir, prefixArg, widthArg, heightArg] = args;
  const targetW = parseInt(widthArg) || DEFAULT_WIDTH;
  const targetH = parseInt(heightArg) || DEFAULT_HEIGHT;

  await loadModelsIfPossible();

  try {
    const stat = await fs.stat(input);
    if (stat.isDirectory()) {
      const files = await fs.readdir(input);
      const images = files.filter(f => /\.(jpe?g|png)$/i.test(f));
      console.log('INFO: images to process:', images.join(', '));
      for (const img of images) {
        const inputPath = path.join(input, img);
        const nameNoExt = path.basename(img, path.extname(img));
        const base = prefixArg ? `${prefixArg}-${nameNoExt}` : nameNoExt;
        await processImageFile(inputPath, outDir, base, targetW, targetH);
      }
    } else if (stat.isFile()) {
      const base = prefixArg || path.basename(input, path.extname(input));
      await processImageFile(input, outDir, base, targetW, targetH);
    } else {
      throw new Error('Input is not a file or directory.');
    }
    console.log('DONE: all images processed.');
  } catch (err) {
    console.error('ERR: main failed:', err && err.message ? err.message : err);
    process.exit(1);
  }
}

main();
