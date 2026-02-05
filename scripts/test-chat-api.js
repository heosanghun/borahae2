/**
 * 채팅 API 직접 호출 테스트 (원인 파악용)
 * 실행: node scripts/test-chat-api.js
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

async function testGemini() {
  console.log('=== Gemini API 테스트 ===');
  if (!GEMINI_API_KEY) {
    console.log('GEMINI_API_KEY 없음. .env 확인.');
    return;
  }
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + encodeURIComponent(GEMINI_API_KEY);
  const body = JSON.stringify({
    contents: [{ role: 'user', parts: [{ text: '한 줄로 안녕이라고만 답해줘.' }] }],
    generationConfig: { maxOutputTokens: 50, temperature: 0.2 }
  });
  const res = await fetchJson(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body
  });
  console.log('Status:', res.status);
  if (res.status !== 200) {
    console.log('Error:', JSON.stringify(res.data, null, 2));
    return;
  }
  const text = res.data.candidates?.[0]?.content?.parts?.[0]?.text;
  console.log('응답:', text ? text.trim() : '(없음)');
  if (text) console.log('-> Gemini 정상 동작');
}

async function testOpenAI() {
  console.log('\n=== OpenAI API 테스트 ===');
  const key = env.OPENAI_API_KEY || '';
  if (!key) {
    console.log('OPENAI_API_KEY 없음.');
    return;
  }
  const url = 'https://api.openai.com/v1/chat/completions';
  const body = JSON.stringify({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: 'Say hello in one word.' }],
    max_tokens: 20
  });
  const res = await fetchJson(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + key
    },
    body: body
  });
  console.log('Status:', res.status);
  if (res.status !== 200) {
    console.log('Error:', JSON.stringify(res.data, null, 2));
    return;
  }
  const text = res.data.choices?.[0]?.message?.content;
  console.log('응답:', text ? text.trim() : '(없음)');
  if (text) console.log('-> OpenAI 정상 동작');
}

(async () => {
  await testGemini();
  await testOpenAI();
})();
