/**
 * .env의 OPENAI_API_KEY가 실제로 OpenAI에서 동작하는지 검사합니다.
 * 로컬 서버와 동일한 방식으로 .env를 읽습니다.
 * 실행: node scripts/check-openai-key.js
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const root = path.resolve(__dirname, '..');
const envPath = path.join(root, '.env');

function stripEnvValue(val) {
  if (typeof val !== 'string') return val;
  val = val.replace(/\r/g, '').trim();
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
    val = val.slice(1, -1).replace(/\r/g, '').trim();
  val = val.replace(/#.*$/, '').trim();
  val = val.split(/[\r\n]/)[0].replace(/\r/g, '').trim();
  val = val.replace(/[\uFEFF]/g, '');
  return val;
}

let OPENAI_API_KEY = '';
if (fs.existsSync(envPath)) {
  let content = fs.readFileSync(envPath, 'utf8');
  if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);
  content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  for (const line of content.split('\n')) {
    const m = line.match(/^OPENAI_API_KEY\s*=\s*(.+)/);
    if (m) {
      OPENAI_API_KEY = stripEnvValue(m[1]);
      break;
    }
  }
}

if (!OPENAI_API_KEY) {
  console.log('FAIL: .env에 OPENAI_API_KEY가 없습니다. borahae-fan/.env 파일을 확인하세요.');
  process.exit(1);
}

console.log('OPENAI_API_KEY: 로드됨 (길이 ' + OPENAI_API_KEY.length + ')');
console.log('OpenAI API 호출 중...');

const body = JSON.stringify({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: 'Say hi' }],
  max_tokens: 10
});

const req = https.request({
  hostname: 'api.openai.com',
  port: 443,
  path: '/v1/chat/completions',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + OPENAI_API_KEY,
    'Content-Length': Buffer.byteLength(body)
  }
}, (res) => {
  let data = '';
  res.on('data', (c) => data += c);
  res.on('end', () => {
    if (res.statusCode === 200) {
      const json = JSON.parse(data);
      const text = json.choices?.[0]?.message?.content;
      console.log('OK: OpenAI API 정상 동작. 응답:', (text || '').trim());
      process.exit(0);
    }
    const err = (() => { try { return JSON.parse(data); } catch (e) { return { error: { message: data } }; } })();
    const msg = err.error?.message || err.message || String(err);
    if (res.statusCode === 401 || /invalid.*api.*key|incorrect.*api.*key/i.test(msg)) {
      console.log('FAIL: API 키가 올바르지 않거나 만료되었습니다.');
      console.log('  → https://platform.openai.com/account/api-keys 에서 새 키를 발급하세요.');
      console.log('  → .env에 OPENAI_API_KEY=sk-proj-... 형태로 한 줄만 넣고, 따옴표·공백·주석 없이 저장하세요.');
    } else {
      console.log('FAIL: HTTP', res.statusCode, msg);
    }
    process.exit(1);
  });
});

req.on('error', (e) => {
  console.log('FAIL: 네트워크 오류', e.message);
  process.exit(1);
});
req.write(body);
req.end();
