/**
 * Gemini 이미지 생성 API 셀프점검
 * 실행: node scripts/test-image-api.js
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const root = path.resolve(__dirname, '..');
const envPath = path.join(root, '.env');

function parseEnv(content) {
  const env = {};
  content.split('\n').forEach((line) => {
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
const GEMINI_API_KEY = env.GEMINI_API_KEY || '';

function fetchJson(url, options) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.request({
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    }, (res) => {
      let body = '';
      res.on('data', (ch) => body += ch);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function testImageGeneration(model, label, prompt, outputName) {
  prompt = prompt || 'Draw a simple red apple on white background. One image only.';
  outputName = outputName || 'test-generated-image.png';
  console.log('\n=== ' + label + ' (' + model + ') ===');
  if (!GEMINI_API_KEY) {
    console.log('GEMINI_API_KEY 없음.');
    return false;
  }
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + encodeURIComponent(GEMINI_API_KEY);
  const body = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: model.indexOf('flash-image') !== -1
      ? {}
      : { responseModalities: ['TEXT', 'IMAGE'], responseMimeType: 'text/plain' }
  });
  const res = await fetchJson(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body
  });
  console.log('Status:', res.status);
  if (res.status !== 200) {
    console.log('Error:', res.data.error ? res.data.error.message : JSON.stringify(res.data).slice(0, 300));
    return false;
  }
  let hasImage = false;
  if (res.data.candidates && res.data.candidates[0] && res.data.candidates[0].content && res.data.candidates[0].content.parts) {
    for (const part of res.data.candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.mimeType && part.inlineData.mimeType.startsWith('image/')) {
        hasImage = true;
        const outPath = path.join(root, outputName);
        fs.writeFileSync(outPath, Buffer.from(part.inlineData.data, 'base64'));
        console.log('이미지 생성 성공 -> 저장:', outPath);
        break;
      }
    }
  }
  if (!hasImage) console.log('응답에 이미지 없음.');
  return hasImage;
}

async function testFullBodyWithFace(model, faceImagePath, outputName) {
  const label = '얼굴+키/몸무게 기반 전신 코디 (나노 바나나)';
  console.log('\n=== ' + label + ' (' + model + ') ===');
  if (!GEMINI_API_KEY) {
    console.log('GEMINI_API_KEY 없음.');
    return false;
  }
  const imagePath = path.isAbsolute(faceImagePath) ? faceImagePath : path.join(root, faceImagePath);
  if (!fs.existsSync(imagePath)) {
    console.log('테스트용 얼굴 이미지 없음:', imagePath);
    return false;
  }
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64');
  const ext = path.extname(imagePath).toLowerCase();
  const mimeType = ext === '.png' ? 'image/png' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';

  const prompt = `The attached image is this person's face. Draw ONE full-body fashion illustration (head to toe) that:
1. Keeps this person's face exactly as shown in the photo.
2. Shows body proportions appropriate for height 170 cm and weight 65 kg (BMI about 22.5).
3. Dresses them in a recommended outfit: 캐주얼, 미니멀 style, 여성, 보통 build.
4. Full-body standing pose, stylish and modern, fashion lookbook quality. One image only.`;

  const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + encodeURIComponent(GEMINI_API_KEY);
  const body = JSON.stringify({
    contents: [{
      parts: [
        { inlineData: { mimeType, data: base64Image } },
        { text: prompt }
      ]
    }],
    generationConfig: { responseModalities: ['image', 'text'], responseMimeType: 'text/plain' }
  });

  const res = await fetchJson(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body
  });
  console.log('Status:', res.status);
  if (res.status !== 200) {
    console.log('Error:', res.data.error ? res.data.error.message : JSON.stringify(res.data).slice(0, 400));
    return false;
  }
  let hasImage = false;
  if (res.data.candidates && res.data.candidates[0] && res.data.candidates[0].content && res.data.candidates[0].content.parts) {
    for (const part of res.data.candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.mimeType && part.inlineData.mimeType.startsWith('image/')) {
        hasImage = true;
        const outPath = path.join(root, outputName || 'fullbody-fashion-test.png');
        fs.writeFileSync(outPath, Buffer.from(part.inlineData.data, 'base64'));
        console.log('전신 코디 이미지 생성 성공 -> 저장:', outPath);
        break;
      }
    }
  }
  if (!hasImage) console.log('응답에 이미지 없음.');
  return hasImage;
}

(async () => {
  console.log('Gemini 이미지 생성 API 셀프점검');
  const nanoBananaPrompt = process.argv[2] ? process.argv.slice(2).join(' ') : null;
  if (nanoBananaPrompt) {
    const ok = await testImageGeneration(
      'gemini-2.5-flash-image',
      '나노 바나나 이미지 생성',
      nanoBananaPrompt,
      'nano-banana-generated.png'
    );
    process.exit(ok ? 0 : 1);
  }

  const runFullBody = process.argv.includes('--fullbody');
  if (runFullBody) {
    const facePath = process.argv[process.argv.indexOf('--fullbody') + 1] || 'logo.png';
    const ok = await testFullBodyWithFace('gemini-2.5-flash-image', facePath, 'fullbody-fashion-test.png');
    process.exit(ok ? 0 : 1);
  }

  const ok = await testImageGeneration('gemini-2.5-flash-image', '이미지 전용 모델');
  if (!ok) {
    await testImageGeneration('gemini-2.0-flash-exp', '기존 코드 모델 (실험)');
  }

  const fullBodyOk = await testFullBodyWithFace('gemini-2.5-flash-image', 'logo.png', 'fullbody-fashion-test.png');
  if (!fullBodyOk) {
    console.log('\n전신 코디(얼굴+키/몸무게) 생성 실패. 앱에서는 Step 2에서 얼굴 업로드 후 시도해보세요.');
  }
})();
