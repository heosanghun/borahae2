/**
 * .env 파일을 읽어 config.js 를 생성합니다.
 * API 키가 브라우저 소스에 하드코딩되지 않고, .env → config.js 로만 주입됩니다.
 * 실행: node scripts/build-config.js
 * (프로젝트 루트에서 실행)
 */

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const outDir = process.argv[2] || ''; // e.g. 'dist' → config.js를 dist/config.js에 생성
const outPath = outDir
  ? path.join(root, outDir, 'config.js')
  : path.join(root, 'config.js');
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

let env = {};
if (fs.existsSync(envPath)) {
  env = parseEnv(fs.readFileSync(envPath, 'utf8'));
} else {
  console.warn('.env 파일이 없습니다. .env.example 을 복사하여 .env 를 만들고 API 키를 입력하세요.');
}

// 배포(Cloudflare Pages 등)에서는 process.env 로 키 주입. 로컬은 .env 우선.
const openaiKey = process.env.OPENAI_API_KEY || env.OPENAI_API_KEY || '';
const geminiKey = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY || '';
// Supabase URL & anon key는 공개 키 (클라이언트용, RLS로 보안 처리)
// 환경변수가 없을 때를 위한 폴백 기본값 포함
const SUPABASE_URL_DEFAULT = 'https://ydzqwveyovdfqgehkpui.supabase.co';
const SUPABASE_ANON_KEY_DEFAULT = 'sb_publishable_xQm-sn6cc_UT7r9Y-Q3qgA_y-1_tPPl';
const supabaseUrl = process.env.SUPABASE_URL || env.SUPABASE_URL || SUPABASE_URL_DEFAULT;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || SUPABASE_ANON_KEY_DEFAULT;

const configContent = `// SIMS Fashion AI - API 설정 (자동 생성, Git 제외)
// scripts/build-config.js 로 .env 에서 생성됩니다.
(function() {
  window.__SIMS_OPENAI_KEY__ = ${JSON.stringify(openaiKey)};
  window.__SIMS_GEMINI_KEY__ = ${JSON.stringify(geminiKey)};
  window.__SIMS_SUPABASE_URL__ = ${JSON.stringify(supabaseUrl)};
  window.__SIMS_SUPABASE_ANON_KEY__ = ${JSON.stringify(supabaseAnonKey)};
})();
`;

if (outDir) {
  const outDirPath = path.join(root, outDir);
  if (!fs.existsSync(outDirPath)) fs.mkdirSync(outDirPath, { recursive: true });
}
fs.writeFileSync(outPath, configContent, 'utf8');
console.log('config.js 생성 완료:', outPath);
