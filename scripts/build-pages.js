/**
 * Cloudflare Pages 배포용 빌드: 정적 파일을 dist/로 복사하고 config.js 생성.
 * movie/soave1.mp4 가 반드시 포함되어 배포에서 영상이 재생되도록 합니다.
 * 실행: node scripts/build-pages.js
 * Cloudflare Pages 설정: Build output directory = dist
 */

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

function mkdirp(dir) {
  if (fs.existsSync(dir)) return;
  mkdirp(path.dirname(dir));
  fs.mkdirSync(dir);
}

function copyFile(src, dest) {
  mkdirp(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function copyDir(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  mkdirp(destDir);
  for (const name of fs.readdirSync(srcDir)) {
    const s = path.join(srcDir, name);
    const d = path.join(destDir, name);
    if (fs.statSync(s).isDirectory()) copyDir(s, d);
    else copyFile(s, d);
  }
}

// dist 비우기
if (fs.existsSync(dist)) {
  fs.rmSync(dist, { recursive: true });
}
mkdirp(dist);

// 루트 정적 파일
const rootFiles = ['index.html', 'style.css', 'main.js', 'name-episodes.js', 'i18n.js', 'hangeul-architecture.js'];
for (const f of rootFiles) {
  const src = path.join(root, f);
  if (fs.existsSync(src)) copyFile(src, path.join(dist, f));
}

// image/ 전체
copyDir(path.join(root, 'image'), path.join(dist, 'image'));

// movie/soave1.mp4 (및 README) — 배포에 영상 포함 보장
mkdirp(path.join(dist, 'movie'));
const soaveMp4 = path.join(root, 'movie', 'soave1.mp4');
if (fs.existsSync(soaveMp4)) {
  copyFile(soaveMp4, path.join(dist, 'movie', 'soave1.mp4'));
  console.log('movie/soave1.mp4 복사됨');
} else {
  console.warn('경고: movie/soave1.mp4 없음. 배포 시 메인 영상이 재생되지 않을 수 있습니다.');
}
const movieReadme = path.join(root, 'movie', 'README.md');
if (fs.existsSync(movieReadme)) copyFile(movieReadme, path.join(dist, 'movie', 'README.md'));

// config.js 생성 (dist에 쓰려면 build-config.js에 인자 'dist' 전달)
const { execSync } = require('child_process');
execSync(`node "${path.join(__dirname, 'build-config.js')}" dist`, { cwd: root, stdio: 'inherit' });

console.log('빌드 완료:', dist);
console.log('Cloudflare Pages에서 Build output directory를 "dist"로 설정하세요.');
