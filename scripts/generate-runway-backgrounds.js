/**
 * image/runway 폴더의 이미지에서 인물을 제거하고 배경만 추출해
 * image/runway/backgrounds/ 에 저장합니다.
 * (상표·초상권 이슈 방지: 인물/텍스트 제거, 배경만 사용)
 *
 * 사용: GEMINI_API_KEY=your_key node scripts/generate-runway-backgrounds.js
 * 필요: image/runway/*.jpg 또는 image/runway/*.png 존재
 */

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const envPath = path.join(root, '.env');
function parseEnv(content) {
  const env = {};
  (content || '').split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eq = trimmed.indexOf('=');
    if (eq === -1) return;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  });
  return env;
}
const env = fs.existsSync(envPath) ? parseEnv(fs.readFileSync(envPath, 'utf8')) : {};
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY || '';

const RUNWAY_DIR = path.join(root, 'image', 'runway');
const BACKGROUNDS_DIR = path.join(root, 'image', 'runway', 'backgrounds');
const ALLOWED_EXT = ['.jpg', '.jpeg', '.png'];

const REMOVE_PEOPLE_PROMPT =
  'CRITICAL: Photorealistic output only. No cartoon, no illustration.\n' +
  'This image may contain people or figures in the center or elsewhere. ' +
  'REMOVE all people, figures, and performers from the entire image. ' +
  'Keep ONLY the location background: stage, lights, architecture, street, sky, atmosphere. ' +
  'Do not add any text, logos, or watermarks. ' +
  'Output a single photorealistic image showing only the empty background. One image only.';

async function generateContentWithImage(imagePath) {
  const buffer = fs.readFileSync(imagePath);
  const base64Image = buffer.toString('base64');
  const ext = path.extname(imagePath).toLowerCase();
  const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';

  const url =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=' +
    encodeURIComponent(GEMINI_API_KEY);
  const body = JSON.stringify({
    contents: [
      {
        parts: [
          { inlineData: { mimeType, data: base64Image } },
          { text: REMOVE_PEOPLE_PROMPT },
        ],
      },
    ],
    generationConfig: { responseModalities: ['image', 'text'], responseMimeType: 'text/plain' },
  });

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || 'Gemini API error');
  if (!res.ok) throw new Error(data.message || 'API request failed');

  if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
    for (const part of data.candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.mimeType && part.inlineData.mimeType.indexOf('image/') === 0) {
        return Buffer.from(part.inlineData.data, 'base64');
      }
    }
  }
  throw new Error('No image in Gemini response');
}

function listRunwayImages() {
  if (!fs.existsSync(RUNWAY_DIR)) return [];
  const files = fs.readdirSync(RUNWAY_DIR);
  return files.filter((f) => {
    const ext = path.extname(f).toLowerCase();
    return ALLOWED_EXT.includes(ext) && path.basename(f) !== 'README.md';
  });
}

async function main() {
  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY 환경 변수 또는 .env를 설정한 뒤 실행하세요.');
    process.exit(1);
  }
  if (!fs.existsSync(RUNWAY_DIR)) {
    fs.mkdirSync(RUNWAY_DIR, { recursive: true });
    console.log('image/runway 폴더를 만들었습니다. 배경을 만들 원본 이미지(.jpg/.png)를 넣은 뒤 다시 실행하세요.');
    process.exit(0);
  }

  const images = listRunwayImages();
  if (images.length === 0) {
    console.log('image/runway 안에 .jpg 또는 .png 이미지가 없습니다. 원본 이미지를 넣은 뒤 다시 실행하세요.');
    process.exit(1);
  }

  if (!fs.existsSync(BACKGROUNDS_DIR)) fs.mkdirSync(BACKGROUNDS_DIR, { recursive: true });

  const generated = [];
  for (const file of images) {
    const base = path.basename(file, path.extname(file));
    const outName = base + '.png';
    const outPath = path.join(BACKGROUNDS_DIR, outName);
    const inputPath = path.join(RUNWAY_DIR, file);
    console.log('처리 중:', file, '->', outName);
    try {
      const outBuffer = await generateContentWithImage(inputPath);
      fs.writeFileSync(outPath, outBuffer);
      generated.push({ id: base, image: outName });
      console.log('  저장:', outPath);
    } catch (err) {
      console.error('  실패:', err.message);
    }
  }

  const listPath = path.join(BACKGROUNDS_DIR, 'list.json');
  const nameMap = {
    runway: { name: '광화문 공연 장소', desc: '뮤직비디오 스타일 공연 장소' },
    gwanghwamun: { name: '광화문광장', desc: '뮤직비디오 스타일 공연 장소' },
    gyeongbokgung: { name: '경복궁', desc: '뮤직비디오 스타일 궁궐 배경' },
    namsan: { name: '남산서울타워', desc: '뮤직비디오 스타일 야경' },
    hanriver: { name: '한강', desc: '뮤직비디오 스타일 강변' },
    bukchon: { name: '북촌한옥마을', desc: '뮤직비디오 스타일 전통 거리' },
    dongdaemun: { name: '동대문디자인플라자', desc: '뮤직비디오 스타일 도시 배경' },
    insadong: { name: '인사동', desc: '뮤직비디오 스타일 골목 거리' },
    cheongwadae: { name: '청와대', desc: '뮤직비디오 스타일 관저 배경' },
    namiseom: { name: '남이섬', desc: '뮤직비디오 스타일 자연' },
    gamcheon: { name: '감천문화마을', desc: '뮤직비디오 스타일 마을' },
    haeundae: { name: '해운대', desc: '뮤직비디오 스타일 해수욕장' },
    gyeongju: { name: '경주', desc: '뮤직비디오 스타일 고도' },
    jeonju: { name: '전주 한옥마을', desc: '뮤직비디오 스타일 한옥' },
    jeju: { name: '제주도', desc: '뮤직비디오 스타일 섬' },
    suwonhwaseong: { name: '수원 화성', desc: '뮤직비디오 스타일 성곽' },
    sejongro: { name: '세종대로', desc: '뮤직비디오 스타일 거리' },
  };
  const list = generated.map(({ id, image }) => ({
    id,
    image,
    name: (nameMap[id] && nameMap[id].name) || id,
    desc: (nameMap[id] && nameMap[id].desc) || '뮤직비디오 스타일 배경',
  }));
  fs.writeFileSync(listPath, JSON.stringify(list, null, 2), 'utf8');
  console.log('list.json 저장:', listPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
