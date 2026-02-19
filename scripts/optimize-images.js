/**
 * 이미지 압축·최적화 (원본 덮어쓰기, 백업 없음)
 * 근거: docs/압축_최적화_근거.md
 * 사용: node scripts/optimize-images.js
 */
const path = require('path');
const fs = require('fs');
const root = path.resolve(__dirname, '..');

let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('sharp 미설치. 실행: npm install sharp --save-dev');
  process.exit(1);
}

const IMAGE_DIRS = [
  path.join(root, 'image'),
  path.join(root, 'book'),
];
const EXT = ['.jpg', '.jpeg', '.jfif', '.png'];
const JPEG_QUALITY = 85;
const PNG_EFFORT = 6;

function walk(dir, out) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (EXT.includes(path.extname(e.name).toLowerCase())) out.push(full);
  }
}

const files = [];
IMAGE_DIRS.forEach(d => walk(d, files));
console.log('최적화 대상 이미지:', files.length, '개');

async function run() {
  let done = 0, saved = 0;
  for (const file of files) {
    try {
      const buf = fs.readFileSync(file);
      const before = buf.length;
      const ext = path.extname(file).toLowerCase();
      let pipeline = sharp(buf);
      if (ext === '.png') {
        pipeline = pipeline.png({ compressionLevel: PNG_EFFORT });
      } else {
        pipeline = pipeline.jpeg({ quality: JPEG_QUALITY });
      }
      const out = await pipeline.toBuffer();
      const after = out.length;
      if (after < before) {
        fs.writeFileSync(file, out);
        saved += before - after;
      }
      done++;
      if (done % 50 === 0) console.log(done + '/' + files.length);
    } catch (err) {
      console.warn('건너뜀:', file, err.message);
    }
  }
  console.log('완료:', done, '개. 절약:', (saved / 1024 / 1024).toFixed(2), 'MB');
}
run().catch(e => { console.error(e); process.exit(1); });
