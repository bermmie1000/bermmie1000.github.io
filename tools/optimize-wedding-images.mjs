#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const INPUT_DIR = 'public/images/wedding';
const OUTPUT_BASE = 'public/images/wedding/optimized';
const FULL_DIR = path.join(OUTPUT_BASE, 'full');
const THUMB_DIR = path.join(OUTPUT_BASE, 'thumb');

const FULL_MAX_WIDTH = 1600;
const THUMB_MAX_WIDTH = 480;

const WEBP_QUALITY_FULL = 78;
const WEBP_QUALITY_THUMB = 72;

const exts = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff', '.avif', '.heic']);

function toWebpName(fileName) {
  const base = fileName.replace(/\.[^.]+$/, '');
  return `${base}.webp`;
}

function bytes(n) {
  const mb = n / 1024 / 1024;
  return `${mb.toFixed(2)} MB`;
}

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function main() {
  const inputAbs = path.resolve(INPUT_DIR);
  const outFullAbs = path.resolve(FULL_DIR);
  const outThumbAbs = path.resolve(THUMB_DIR);

  await ensureDir(outFullAbs);
  await ensureDir(outThumbAbs);

  const entries = await fs.readdir(inputAbs, { withFileTypes: true });
  const files = entries
    .filter((e) => e.isFile())
    .map((e) => e.name)
    .filter((name) => exts.has(path.extname(name).toLowerCase()))
    // exclude already-optimized content if user accidentally put it here
    .filter((name) => !name.toLowerCase().endsWith('.ds_store'))
    .sort((a, b) => a.localeCompare(b, 'en'));

  if (files.length === 0) {
    console.error(`No images found in ${INPUT_DIR}`);
    process.exit(1);
  }

  let totalIn = 0;
  let totalOut = 0;

  /** @type {Array<{full:string, thumb:string, width:number, height:number, bytesIn:number, bytesFull:number, bytesThumb:number}>} */
  const manifest = [];

  for (const file of files) {
    const inPath = path.join(inputAbs, file);
    const stat = await fs.stat(inPath);
    totalIn += stat.size;

    const fullName = toWebpName(file);
    const fullOut = path.join(outFullAbs, fullName);
    const thumbOut = path.join(outThumbAbs, fullName);

    const image = sharp(inPath, { failOn: 'none' }).rotate();
    const meta = await image.metadata();

    const fullPipeline = sharp(inPath, { failOn: 'none' })
      .rotate()
      .resize({ width: FULL_MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY_FULL, effort: 6 });

    const thumbPipeline = sharp(inPath, { failOn: 'none' })
      .rotate()
      .resize({ width: THUMB_MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY_THUMB, effort: 6 });

    await fullPipeline.toFile(fullOut);
    await thumbPipeline.toFile(thumbOut);

    const stFull = await fs.stat(fullOut);
    const stThumb = await fs.stat(thumbOut);
    totalOut += stFull.size + stThumb.size;

    // public/ is the web root in Vite. Strip it from URLs.
    const fullUrl = `/${FULL_DIR}/${fullName}`.replace(/\\/g, '/').replace(/^\/public\//, '/');
    const thumbUrl = `/${THUMB_DIR}/${fullName}`.replace(/\\/g, '/').replace(/^\/public\//, '/');

    manifest.push({
      full: fullUrl,
      thumb: thumbUrl,
      width: meta.width ?? 0,
      height: meta.height ?? 0,
      bytesIn: stat.size,
      bytesFull: stFull.size,
      bytesThumb: stThumb.size,
    });

    process.stdout.write(`✓ ${file} → full:${bytes(stFull.size)} thumb:${bytes(stThumb.size)}\n`);
  }

  const manifestPath = path.resolve(OUTPUT_BASE, 'manifest.json');
  await fs.writeFile(manifestPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    inputDir: `/${INPUT_DIR}`,
    outputBase: `/${OUTPUT_BASE}`,
    fullMaxWidth: FULL_MAX_WIDTH,
    thumbMaxWidth: THUMB_MAX_WIDTH,
    webpQuality: { full: WEBP_QUALITY_FULL, thumb: WEBP_QUALITY_THUMB },
    items: manifest,
  }, null, 2));

  console.log('\n---');
  console.log(`Images: ${files.length}`);
  console.log(`Input total:  ${bytes(totalIn)}`);
  console.log(`Output total: ${bytes(totalOut)} (full+thumb)`);
  console.log(`Manifest: ${manifestPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
