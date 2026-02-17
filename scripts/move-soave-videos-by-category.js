/**
 * soave-video-categories.json 기준으로 영상을 카테고리별 폴더로 복사합니다.
 * 분류(Classifier)로 JSON을 채운 뒤 실행하세요.
 * 실행: node scripts/move-soave-videos-by-category.js
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const jsonPath = path.join(root, 'image/soave/ani/soave-video-categories.json');
const aniRoot = path.join(root, 'image/soave/ani');

if (!fs.existsSync(jsonPath)) {
  console.log('soave-video-categories.json 이 없습니다. 분류 도구로 먼저 JSON을 채우세요.');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
if (!data.videos || !data.videos.length) {
  console.log('videos 배열이 비어 있습니다.');
  process.exit(1);
}

const byCategory = {};
data.videos.forEach(function (v) {
  const cat = v.category || 'general';
  if (!byCategory[cat]) byCategory[cat] = [];
  byCategory[cat].push(v);
});

Object.keys(byCategory).forEach(function (cat) {
  const dir = path.join(aniRoot, cat);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log('폴더 생성:', path.relative(root, dir));
  }
  byCategory[cat].forEach(function (v, i) {
    const src = path.join(root, v.path);
    const base = path.basename(v.path);
    const dest = path.join(dir, base);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log('복사:', path.relative(root, src), '->', path.relative(root, dest));
    } else {
      console.warn('파일 없음:', src);
    }
  });
});

console.log('완료. 카테고리별 폴더:', Object.keys(byCategory).join(', '));
