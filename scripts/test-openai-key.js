/**
 * OpenAI API 키 검증 스크립트
 * 실행: node scripts/test-openai-key.js
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const root = path.resolve(__dirname, '..');
const envPath = fs.existsSync(path.join(root, '.env'))
  ? path.join(root, '.env')
  : path.join(root, 'image', '.env');

let OPENAI_API_KEY = '';
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8').replace(/\r/g, '');
  const m = content.match(/OPENAI_API_KEY\s*=\s*(.+)/);
  if (m) OPENAI_API_KEY = m[1].trim().replace(/^["']|["']$/g, '').split(/[\r\n#]/)[0].trim();
}

if (!OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY를 .env에서 찾을 수 없습니다.');
  process.exit(1);
}

const data = JSON.stringify({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: 'hi' }],
  max_tokens: 5
});

const req = https.request({
  hostname: 'api.openai.com',
  port: 443,
  path: '/v1/chat/completions',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + OPENAI_API_KEY,
    'Content-Length': Buffer.byteLength(data)
  }
}, (res) => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('OK: API 키가 정상입니다.');
    } else {
      console.error('오류:', res.statusCode);
      try {
        const err = JSON.parse(body);
        console.error('메시지:', err.error?.message || body);
      } catch (e) {
        console.error(body);
      }
      process.exit(1);
    }
  });
});

req.on('error', (e) => {
  console.error('연결 오류:', e.message);
  process.exit(1);
});
req.write(data);
req.end();
