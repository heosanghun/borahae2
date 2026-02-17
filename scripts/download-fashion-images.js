/**
 * Pexels API로 무료 라이선스 패션/의류 이미지를 image/fashion 에 다운로드합니다.
 * 라이선스: https://www.pexels.com/license/ (상업적 사용·수정·출처 불필요)
 *
 * 사용법:
 *   1. https://www.pexels.com/api/new/ 에서 무료 API 키 발급
 *   2. 프로젝트 루트 .env 에 PEXELS_API_KEY=발급받은키 입력
 *   3. node scripts/download-fashion-images.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'image', 'fashion');
const envPath = path.join(root, '.env');

function loadEnv() {
  let key = process.env.PEXELS_API_KEY || '';
  if (key) return key;
  if (!fs.existsSync(envPath)) return '';
  const content = fs.readFileSync(envPath, 'utf8').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  for (const line of content.split('\n')) {
    const m = line.match(/^PEXELS_API_KEY\s*=\s*(.+)/);
    if (m) {
      key = m[1].trim().replace(/^["']|["']$/g, '').replace(/#.*$/, '').trim();
      return key;
    }
  }
  return '';
}

function get(url, key) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    lib.get(url, { headers: { Authorization: key } }, (res) => {
      if (res.statusCode === 401) {
        reject(new Error('PEXELS_API_KEY가 올바르지 않습니다. .env를 확인하세요.'));
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      let data = '';
      res.on('data', (ch) => { data += ch; });
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

function download(url, followRedirect = true) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    lib.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        if (followRedirect && res.headers.location) {
          download(res.headers.location, false).then(resolve).catch(reject);
          return;
        }
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Download HTTP ${res.statusCode}`));
        return;
      }
      const chunks = [];
      res.on('data', (ch) => chunks.push(ch));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

const apiKey = loadEnv();

/** API 키 없을 때 Picsum(무료)으로 샘플 이미지 다운로드 */
async function fallbackPicsum() {
  const seeds = ['fashion', 'clothing', 'style', 'outfit', 'wardrobe', 'apparel', 'model', 'streetwear', 'casual', 'minimal'];
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  let n = 0;
  for (let i = 0; i < seeds.length; i++) {
    const url = `https://picsum.photos/seed/${seeds[i]}/800/600`;
    const filename = `picsum_${seeds[i]}.jpg`;
    try {
      const buf = await download(url);
      fs.writeFileSync(path.join(outDir, filename), buf);
      n++;
      console.log(`  [${n}] ${filename}`);
    } catch (e) {
      console.warn(`  skip ${filename}: ${e.message}`);
    }
  }
  console.log('');
  console.log(`완료: ${n}개 이미지 저장 (Picsum) → ${outDir}`);
  console.log('더 많은 패션 전용 이미지는 Pexels API 키 설정 후 다시 실행하세요.');
}

async function main() {
  if (!apiKey) {
    console.log('Pexels API 키가 없어 Picsum(무료) 샘플 이미지로 다운로드합니다.\n');
    await fallbackPicsum();
    return;
  }

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const queries = ['fashion', 'clothing', 'outfit', 'street style', 'wardrobe'];
  const perQuery = 10;
  const seen = new Set();
  let saved = 0;

  for (const query of queries) {
    try {
      const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perQuery}`;
      const data = await get(url, apiKey);
      const photos = data.photos || [];
      for (let i = 0; i < photos.length; i++) {
        const p = photos[i];
        const imgUrl = p.src?.large || p.src?.medium || p.src?.original;
        if (!imgUrl || seen.has(imgUrl)) continue;
        seen.add(imgUrl);
        const ext = imgUrl.includes('.jpg') || imgUrl.includes('jpeg') ? '.jpg' : '.jpg';
        const filename = `pexels_${p.id}${ext}`;
        const filepath = path.join(outDir, filename);
        try {
          const buf = await download(imgUrl);
          fs.writeFileSync(filepath, buf);
          saved++;
          console.log(`  [${saved}] ${filename}`);
        } catch (e) {
          console.warn(`  skip ${p.id}: ${e.message}`);
        }
      }
    } catch (e) {
      console.warn(`  query "${query}": ${e.message}`);
    }
  }

  console.log('');
  console.log(`완료: ${saved}개 이미지 저장 → ${outDir}`);
  console.log('라이선스: Pexels License (무료, 상업적 사용·수정 가능, 출처 불필요)');
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
