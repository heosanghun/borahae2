/**
 * Veo로 갤러리용 런웨이 샘플 영상 생성 후 video/gallery/에 저장
 * 사용: GEMINI_API_KEY=your_key node scripts/generate-veo-gallery-sample.js [id]
 * 예: GEMINI_API_KEY=xxx node scripts/generate-veo-gallery-sample.js gwanghwamun
 *
 * id 생략 시 gwanghwamun(광화문 광장) 1개만 생성.
 */

const fs = require('fs');
const path = require('path');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY 환경 변수를 설정한 뒤 실행하세요.');
  process.exit(1);
}

const GALLERY_DIR = path.join(__dirname, '..', 'video', 'gallery');
const PROMPTS = {
  gwanghwamun: 'Cinematic 8-second video. A person walking on a runway in the center of Gwanghwamun Plaza, Seoul, South Korea. Wide shot, daytime, clear sky, photorealistic. The iconic Gwanghwamun gate and modern buildings in the background. Smooth camera movement. No text, no logos.',
  gyeongbokgung: 'Cinematic 8-second video. A person walking on a runway in front of Gyeongbokgung Palace, Seoul, South Korea. Traditional Korean palace architecture, daytime, photorealistic. Smooth camera. No text.',
  namsan: 'Cinematic 8-second video. A person walking on a runway with Namsan Seoul Tower in the background at night, Seoul, South Korea. City lights, photorealistic. Smooth camera. No text.',
};

async function startVeoVideoGeneration(prompt) {
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/veo-3.1-generate-preview:predictLongRunning?key=' + encodeURIComponent(GEMINI_API_KEY);
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      instances: [{ prompt: prompt }],
      parameters: { aspectRatio: '16:9' },
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || 'Veo API error');
  if (!res.ok) throw new Error(data.message || 'Veo request failed');
  if (!data.name) throw new Error('No operation name in Veo response');
  return data.name;
}

async function pollVeoOperation(operationName) {
  const url = 'https://generativelanguage.googleapis.com/v1beta/' + operationName + '?key=' + encodeURIComponent(GEMINI_API_KEY);
  for (let i = 0; i < 90; i++) {
    const res = await fetch(url);
    const data = await res.json();
    if (data.error) throw new Error(data.error.message || 'Veo poll error');
    if (data.done) return data;
    console.log('  Veo 생성 대기 중...', i * 10 + 10, '초');
    await new Promise((r) => setTimeout(r, 10000));
  }
  throw new Error('Veo video generation timed out');
}

async function fetchVeoVideoBuffer(videoUri) {
  const url = videoUri + (videoUri.indexOf('?') >= 0 ? '&' : '?') + 'key=' + encodeURIComponent(GEMINI_API_KEY);
  const res = await fetch(url);
  if (!res.ok) throw new Error('Video download failed');
  return Buffer.from(await res.arrayBuffer());
}

async function generateAndSave(id) {
  const prompt = PROMPTS[id] || PROMPTS.gwanghwamun;
  const filename = id + '-runway.mp4';
  const outPath = path.join(GALLERY_DIR, filename);

  if (!fs.existsSync(GALLERY_DIR)) fs.mkdirSync(GALLERY_DIR, { recursive: true });

  console.log('Veo 영상 생성 시작:', id);
  const opName = await startVeoVideoGeneration(prompt);
  console.log('오퍼레이션:', opName);
  const result = await pollVeoOperation(opName);
  const videoUri = result.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri;
  if (!videoUri) throw new Error('No video URI in response');
  console.log('다운로드 중...');
  const buffer = await fetchVeoVideoBuffer(videoUri);
  fs.writeFileSync(outPath, buffer);
  console.log('저장 완료:', outPath);
  return filename;
}

async function main() {
  const id = process.argv[2] || 'gwanghwamun';
  if (!PROMPTS[id] && id !== 'gwanghwamun') {
    console.log('지원 id: gwanghwamun, gyeongbokgung, namsan');
    process.exit(1);
  }
  const promptId = PROMPTS[id] ? id : 'gwanghwamun';
  try {
    const filename = await generateAndSave(promptId);
    const manifestPath = path.join(GALLERY_DIR, 'gallery-videos.json');
    let manifest = {};
    if (fs.existsSync(manifestPath)) {
      manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    }
    manifest[promptId] = filename;
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
    console.log('갤러리 manifest 갱신:', manifestPath);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
