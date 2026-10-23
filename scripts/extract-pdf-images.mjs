/**
 * One-shot extractor for the screenshots embedded in the itch.io page PDFs
 * under for_claude/. Those pages were saved as PDFs, so the game captures are
 * in there as raw RGB (FlateDecode) or JPEG (DCTDecode) image XObjects.
 *
 * Usage: node scripts/extract-pdf-images.mjs
 * Output: src/assets/extracted/<name>.png|.jpg
 *
 * Not part of the build. Run it once, pick the good captures, delete the rest.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { inflateSync, deflateSync } from 'node:zlib';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC_DIR = join(ROOT, 'for_claude');
const OUT_DIR = join(ROOT, 'src/assets/extracted');

/** Smallest edge we care about - filters out icons, logos and SMask thumbnails. */
const MIN_WIDTH = 640;

// ---------- PNG encoding ----------
const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'latin1'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

/** @param {Buffer} raw interleaved samples @param {number} channels 1=gray 3=rgb */
function encodePNG(raw, width, height, channels) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;                             // bit depth
  ihdr[9] = channels === 1 ? 0 : 2;        // colour type: grayscale | truecolour
  // 10..12 = compression, filter, interlace = 0

  const stride = width * channels;
  // Prepend the per-scanline filter byte (0 = None). Cheap, and these are
  // one-off assets - not worth implementing adaptive filtering.
  const rows = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    rows[y * (stride + 1)] = 0;
    raw.copy(rows, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(rows, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ---------- PDF image XObject scanning ----------
function num(dict, key) {
  const m = dict.match(new RegExp(`/${key}\\s+(\\d+)`));
  return m ? Number(m[1]) : undefined;
}

function extract(file) {
  const buf = readFileSync(join(SRC_DIR, file));
  const text = buf.toString('latin1');
  const found = [];

  // /Subtype /Image ... stream\n  - the dict fields we need all sit close by.
  const re = /\/Subtype\s*\/Image([\s\S]{0,500}?)stream\r?\n/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const dict = m[1];
    const width = num(dict, 'Width');
    const height = num(dict, 'Height');
    const length = num(dict, 'Length');
    const filter = (dict.match(/\/Filter\s*\/?\[?\s*\/(\w+)/) || [])[1];
    if (!width || !height || width < MIN_WIDTH) continue;

    const start = m.index + m[0].length;
    const slice = buf.subarray(start, start + (length || 4_000_000));

    if (filter === 'DCTDecode') {
      // Already a JPEG - the stream bytes are the file.
      found.push({ width, height, ext: 'jpg', data: slice });
      continue;
    }
    if (filter !== 'FlateDecode') continue;

    let raw;
    try {
      raw = inflateSync(slice);
    } catch {
      continue; // truncated or not actually flate - skip rather than guess
    }

    // ColorSpace is often an indirect reference, so infer channels from the
    // byte count instead. Only accept an exact match; a mismatch means the
    // stream isn't plain interleaved samples and we'd emit garbage.
    const px = width * height;
    const channels = raw.length === px * 3 ? 3 : raw.length === px ? 1 : 0;
    if (!channels) continue;

    found.push({ width, height, ext: 'png', data: encodePNG(raw, width, height, channels) });
  }
  return found;
}

// ---------- main ----------
mkdirSync(OUT_DIR, { recursive: true });
const pdfs = readdirSync(SRC_DIR).filter((f) => f.toLowerCase().endsWith('.pdf'));
let total = 0;

for (const pdf of pdfs) {
  const slug = pdf
    .replace(/\.pdf$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const images = extract(pdf);
  if (!images.length) continue;

  console.log(`\n${pdf}`);
  images.forEach((img, i) => {
    const name = `${slug}-${String(i + 1).padStart(2, '0')}-${img.width}x${img.height}.${img.ext}`;
    writeFileSync(join(OUT_DIR, name), img.data);
    console.log(`  ${name}  (${(img.data.length / 1024).toFixed(0)} KB)`);
    total++;
  });
}

console.log(`\n${total} image(s) -> src/assets/extracted/`);
