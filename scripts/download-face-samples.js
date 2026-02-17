/**
 * 원클릭 런웨이용 여자/남자 샘플 얼굴 사진을 image/human/face/ 에 저장
 * 실행: node scripts/download-face-samples.js
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const FACE_DIR = path.join(__dirname, '..', 'image', 'human', 'face');
const SAMPLES = [
  { url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&facepad=2', file: 'face1.jpg', label: '여자' },
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&facepad=2', file: 'face2.jpg', label: '남자' },
];

function download(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  if (!fs.existsSync(FACE_DIR)) fs.mkdirSync(FACE_DIR, { recursive: true });
  for (const s of SAMPLES) {
    try {
      const buf = await download(s.url);
      const out = path.join(FACE_DIR, s.file);
      fs.writeFileSync(out, buf);
      console.log('저장:', s.label, out);
    } catch (e) {
      console.error(s.label, e.message);
    }
  }
}

main();
