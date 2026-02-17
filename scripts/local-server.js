const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const root = path.resolve(__dirname, '..');
const envPath = path.join(root, '.env');
let OPENAI_API_KEY = '';
let MUREKA_API_KEY = '';

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

if (fs.existsSync(envPath)) {
  let content = fs.readFileSync(envPath, 'utf8');
  if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);
  content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = content.split('\n');
  for (const line of lines) {
    const m = line.match(/^OPENAI_API_KEY\s*=\s*(.+)/);
    if (m) OPENAI_API_KEY = stripEnvValue(m[1]);
    const m2 = line.match(/^(?:MUREKA|Mureka)_API_KEY\s*=\s*(.+)/i);
    if (m2) MUREKA_API_KEY = stripEnvValue(m2[1]);
  }
}

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.mp3': 'audio/mpeg',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.pdf': 'application/pdf',
  '.zip': 'application/zip', '.mid': 'audio/midi', '.midi': 'audio/midi'
};

const server = http.createServer(async (req, res) => {
  const parsed = new URL(req.url, 'http://localhost');

  if (parsed.pathname === '/api/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      if (!OPENAI_API_KEY) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: { message: 'OPENAI_API_KEY not set in .env' } }));
        return;
      }
      try {
        const payload = JSON.parse(body);
        const https = require('https');
        const data = JSON.stringify({
          model: payload.model || 'gpt-4o-mini',
          messages: payload.messages,
          max_tokens: Math.min(payload.max_tokens || 500, 1000),
          temperature: typeof payload.temperature === 'number' ? payload.temperature : 0.8
        });
        const options = {
          hostname: 'api.openai.com', port: 443, path: '/v1/chat/completions',
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + OPENAI_API_KEY, 'Content-Length': Buffer.byteLength(data) }
        };
        const apiReq = https.request(options, apiRes => {
          let resBody = '';
          apiRes.on('data', c => resBody += c);
          apiRes.on('end', () => {
            if (apiRes.statusCode === 401) {
              console.warn('[api/chat] OpenAI 401: .env의 OPENAI_API_KEY가 잘못되었거나 만료되었습니다. https://platform.openai.com/account/api-keys 에서 새 키를 발급해 .env를 수정한 뒤 서버를 재시작하세요.');
            }
            res.writeHead(apiRes.statusCode, { 'Content-Type': 'application/json' });
            res.end(resBody);
          });
        });
        apiReq.on('error', e => {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: { message: e.message } }));
        });
        apiReq.write(data);
        apiReq.end();
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: { message: e.message } }));
      }
    });
    return;
  }

  if (parsed.pathname === '/api/tts' && req.method === 'POST') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      if (!OPENAI_API_KEY) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: { message: 'OPENAI_API_KEY not set in .env' } }));
        return;
      }
      try {
        const payload = JSON.parse(body);
        if (!payload.input) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: { message: 'Missing "input" text' } }));
          return;
        }
        const https = require('https');
        const data = JSON.stringify({
          model: payload.model || 'tts-1',
          input: payload.input.slice(0, 4096),
          voice: payload.voice || 'nova',
          response_format: 'mp3'
        });
        const options = {
          hostname: 'api.openai.com', port: 443, path: '/v1/audio/speech',
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + OPENAI_API_KEY, 'Content-Length': Buffer.byteLength(data) }
        };
        const apiReq = https.request(options, apiRes => {
          if (apiRes.statusCode !== 200) {
            let errBody = '';
            apiRes.on('data', c => errBody += c);
            apiRes.on('end', () => {
              res.writeHead(apiRes.statusCode, { 'Content-Type': 'application/json' });
              res.end(errBody);
            });
            return;
          }
          res.writeHead(200, { 'Content-Type': 'audio/mpeg' });
          apiRes.pipe(res);
        });
        apiReq.on('error', e => {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: { message: e.message } }));
        });
        apiReq.write(data);
        apiReq.end();
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: { message: e.message } }));
      }
    });
    return;
  }

  if (parsed.pathname === '/api/image' && req.method === 'POST') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      if (!OPENAI_API_KEY) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: { message: 'OPENAI_API_KEY not set in .env' } }));
        return;
      }
      try {
        const payload = JSON.parse(body);
        if (!payload.prompt) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: { message: 'Missing "prompt" text' } }));
          return;
        }
        const https = require('https');
        const data = JSON.stringify({
          model: payload.model || 'dall-e-3',
          prompt: payload.prompt.slice(0, 4000),
          n: 1,
          size: payload.size || '1024x1024',
          quality: payload.quality || 'standard'
        });
        const options = {
          hostname: 'api.openai.com', port: 443, path: '/v1/images/generations',
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + OPENAI_API_KEY, 'Content-Length': Buffer.byteLength(data) }
        };
        const apiReq = https.request(options, apiRes => {
          let resBody = '';
          apiRes.on('data', c => resBody += c);
          apiRes.on('end', () => {
            res.writeHead(apiRes.statusCode, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            res.end(resBody);
          });
        });
        apiReq.on('error', e => {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: { message: e.message } }));
        });
        apiReq.write(data);
        apiReq.end();
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: { message: e.message } }));
      }
    });
    return;
  }

  if (parsed.pathname === '/api/music/generate' && req.method === 'POST') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      if (!MUREKA_API_KEY) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: { message: 'MUREKA_API_KEY not set in .env' } }));
        return;
      }
      try {
        const payload = JSON.parse(body || '{}');
        const https = require('https');
        const data = JSON.stringify({
          prompt: payload.prompt || 'ambient, peaceful, purple vibe',
          lyrics: payload.lyrics || '',
          model: payload.model || 'auto'
        });
        const options = {
          hostname: 'api.mureka.ai', port: 443, path: '/v1/song/generate',
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + MUREKA_API_KEY, 'Content-Length': Buffer.byteLength(data) }
        };
        const apiReq = https.request(options, apiRes => {
          let resBody = '';
          apiRes.on('data', c => resBody += c);
          apiRes.on('end', () => {
            res.writeHead(apiRes.statusCode, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            res.end(resBody);
          });
        });
        apiReq.on('error', e => {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: { message: e.message } }));
        });
        apiReq.write(data);
        apiReq.end();
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: { message: e.message } }));
      }
    });
    return;
  }

  if (parsed.pathname.startsWith('/api/music/query/') && req.method === 'GET') {
    const taskId = parsed.pathname.replace(/^\/api\/music\/query\//, '').split('/')[0];
    if (!taskId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing task_id' }));
      return;
    }
    if (!MUREKA_API_KEY) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: { message: 'MUREKA_API_KEY not set in .env' } }));
      return;
    }
    try {
      const https = require('https');
      const options = {
        hostname: 'api.mureka.ai', port: 443, path: '/v1/song/query/' + encodeURIComponent(taskId),
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + MUREKA_API_KEY }
      };
      const apiReq = https.request(options, apiRes => {
        let resBody = '';
        apiRes.on('data', c => resBody += c);
        apiRes.on('end', () => {
          res.writeHead(apiRes.statusCode, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
          res.end(resBody);
        });
      });
      apiReq.on('error', e => {
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: { message: e.message } }));
      });
      apiReq.end();
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: { message: e.message } }));
    }
    return;
  }

  if (parsed.pathname === '/api/image-proxy' && req.method === 'GET') {
    var imgUrl = parsed.searchParams.get('url');
    if (!imgUrl) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing url parameter' }));
      return;
    }
    try {
      var u = new URL(imgUrl);
      var https = require('https');
      var proxyReq = https.get(imgUrl, function(proxyRes) {
        res.writeHead(200, {
          'Content-Type': proxyRes.headers['content-type'] || 'image/png',
          'Content-Disposition': 'attachment; filename="borahae-fashion-' + Date.now() + '.png"',
          'Access-Control-Allow-Origin': '*'
        });
        proxyRes.pipe(res);
      });
      proxyReq.on('error', function(e) {
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      });
    } catch(e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  let filePath = path.join(root, decodeURIComponent(parsed.pathname));
  if (filePath.endsWith(path.sep) || fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }
  if (!fs.existsSync(filePath)) {
    res.writeHead(404); res.end('Not found'); return;
  }
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(8000, () => {
  console.log('Local server with OpenAI proxy: http://localhost:8000');
  const keyLen = OPENAI_API_KEY ? OPENAI_API_KEY.length : 0;
  console.log('OPENAI_API_KEY:', OPENAI_API_KEY ? 'loaded (' + OPENAI_API_KEY.slice(0, 10) + '..., length=' + keyLen + ')' : 'NOT SET');
  if (OPENAI_API_KEY && (keyLen < 40 || keyLen > 300)) {
    console.warn('[경고] OPENAI_API_KEY 길이가 비정상적입니다. .env에서 따옴표·주석(#)·줄바꿈 없이 한 줄만 넣었는지 확인하세요.');
  }
  console.log('MUREKA_API_KEY:', MUREKA_API_KEY ? 'loaded (' + MUREKA_API_KEY.slice(0, 8) + '...)' : 'NOT SET');
});
