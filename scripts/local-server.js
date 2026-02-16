const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const root = path.resolve(__dirname, '..');
const envPath = path.join(root, '.env');
let OPENAI_API_KEY = '';
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const m = line.match(/^OPENAI_API_KEY\s*=\s*(.+)/);
    if (m) OPENAI_API_KEY = m[1].trim();
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
  console.log('OPENAI_API_KEY:', OPENAI_API_KEY ? 'loaded (' + OPENAI_API_KEY.slice(0, 10) + '...)' : 'NOT SET');
});
