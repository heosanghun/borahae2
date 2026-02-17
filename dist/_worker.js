export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/chat' && request.method === 'POST') {
      return handleChat(request, env);
    }

    if (url.pathname === '/api/tts' && request.method === 'POST') {
      return handleTTS(request, env);
    }

    if (url.pathname === '/api/image' && request.method === 'POST') {
      return handleImage(request, env);
    }

    if (url.pathname === '/api/image-proxy' && request.method === 'GET') {
      return handleImageProxy(url);
    }

    if (url.pathname === '/api/music/generate' && request.method === 'POST') {
      return handleMusicGenerate(request, env);
    }

    if (url.pathname.startsWith('/api/music/query/') && request.method === 'GET') {
      var taskId = url.pathname.replace(/^\/api\/music\/query\//, '').split('/')[0];
      return handleMusicQuery(taskId, env);
    }

    if (url.pathname === '/api/suno/generate' && request.method === 'POST') {
      return handleSunoGenerate(request, env);
    }

    if (url.pathname.startsWith('/api/suno/query/') && request.method === 'GET') {
      var taskId = url.pathname.replace(/^\/api\/suno\/query\//, '').split('/')[0];
      return handleSunoQuery(taskId, env);
    }

    if (url.pathname === '/api/suno-callback' && request.method === 'POST') {
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    return env.ASSETS.fetch(request);
  }
};

async function handleTTS(request, env) {
  const apiKey = env.OPENAI_API_KEY || env['OpenAI API KEY'] || env['OPENAI_API_KEY'] || '';

  if (!apiKey) {
    return new Response(JSON.stringify({ error: { message: 'OPENAI_API_KEY not configured' } }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  var body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: { message: 'Invalid JSON body' } }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!body.input || typeof body.input !== 'string') {
    return new Response(JSON.stringify({ error: { message: 'Missing "input" text' } }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  var payload = {
    model: body.model || 'tts-1',
    input: body.input.slice(0, 4096),
    voice: body.voice || 'nova',
    response_format: 'mp3'
  };

  try {
    var res = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      var errData = await res.text();
      return new Response(errData, {
        status: res.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(res.body, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: { message: err.message || 'TTS proxy failed' } }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleImage(request, env) {
  const apiKey = env.OPENAI_API_KEY || env['OpenAI API KEY'] || env['OPENAI_API_KEY'] || '';
  if (!apiKey) {
    return new Response(JSON.stringify({ error: { message: 'OPENAI_API_KEY not configured' } }), {
      status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
  var body;
  try { body = await request.json(); } catch (e) {
    return new Response(JSON.stringify({ error: { message: 'Invalid JSON body' } }), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    });
  }
  if (!body.prompt || typeof body.prompt !== 'string') {
    return new Response(JSON.stringify({ error: { message: 'Missing "prompt" text' } }), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    });
  }
  var payload = {
    model: body.model || 'dall-e-3',
    prompt: body.prompt.slice(0, 4000),
    n: 1,
    size: body.size || '1024x1024',
    quality: body.quality || 'standard'
  };
  try {
    var res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
      body: JSON.stringify(payload)
    });
    var data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: { message: err.message || 'Image proxy failed' } }), {
      status: 502, headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleChat(request, env) {
  const apiKey = env.OPENAI_API_KEY || env['OpenAI API KEY'] || env['OPENAI_API_KEY'] || '';

  if (!apiKey) {
    return new Response(JSON.stringify({ error: { message: 'OPENAI_API_KEY not configured' } }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  var body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: { message: 'Invalid JSON body' } }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  var payload = {
    model: body.model || 'gpt-4o-mini',
    messages: body.messages,
    max_tokens: Math.min(body.max_tokens || 500, 1000),
    temperature: typeof body.temperature === 'number' ? body.temperature : 0.8
  };

  try {
    var res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify(payload)
    });

    var data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: { message: err.message || 'Proxy fetch failed' } }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleImageProxy(url) {
  var imgUrl = url.searchParams.get('url');
  if (!imgUrl) {
    return new Response(JSON.stringify({ error: 'Missing url parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  try {
    var imgRes = await fetch(imgUrl);
    if (!imgRes.ok) {
      return new Response('Image fetch failed', { status: imgRes.status });
    }
    var blob = await imgRes.blob();
    return new Response(blob, {
      headers: {
        'Content-Type': imgRes.headers.get('content-type') || 'image/png',
        'Content-Disposition': 'attachment; filename="borahae-fashion-' + Date.now() + '.png"',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleMusicGenerate(request, env) {
  var apiKey = env.Mureka_API_KEY || env['Mureka_API_KEY'] || env.MUREKA_API_KEY || env['MUREKA_API_KEY'] || '';
  if (!apiKey) {
    return new Response(JSON.stringify({ error: { message: 'MUREKA_API_KEY not configured' } }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
  var body;
  try { body = await request.json(); } catch (e) {
    return new Response(JSON.stringify({ error: { message: 'Invalid JSON body' } }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  var payload = {
    prompt: body.prompt || 'ambient, peaceful, purple vibe',
    lyrics: body.lyrics || '',
    model: body.model || 'auto'
  };
  try {
    var res = await fetch('https://api.mureka.ai/v1/song/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
      body: JSON.stringify(payload)
    });
    var data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: { message: err.message || 'Music generate failed' } }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleMusicQuery(taskId, env) {
  if (!taskId) {
    return new Response(JSON.stringify({ error: 'Missing task_id' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  var apiKey = env.Mureka_API_KEY || env['Mureka_API_KEY'] || env.MUREKA_API_KEY || env['MUREKA_API_KEY'] || '';
  if (!apiKey) {
    return new Response(JSON.stringify({ error: { message: 'MUREKA_API_KEY not configured' } }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
  try {
    var res = await fetch('https://api.mureka.ai/v1/song/query/' + encodeURIComponent(taskId), {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + apiKey }
    });
    var data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: { message: err.message || 'Music query failed' } }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Suno API (sunoapi.org) – 가사 → 음악 생성
var SUNO_API_BASE = 'https://api.sunoapi.org';

async function handleSunoGenerate(request, env) {
  var apiKey = (env.SUNO_API_KEY || env['SUNO_API_KEY'] || '').toString().trim();
  if (!apiKey) {
    return new Response(JSON.stringify({ error: { message: 'SUNO_API_KEY (또는 suno_api) not configured. Add it in Cloudflare Pages env or .env for local.' } }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
  var body;
  try { body = await request.json(); } catch (e) {
    return new Response(JSON.stringify({ error: { message: 'Invalid JSON body' } }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
  var lyrics = (body.lyrics || body.prompt || '').trim().slice(0, 5000);
  var title = (body.title || '내 탄생뮤직').slice(0, 80);
  var style = (body.style || 'K-pop, Ballad, Korean, emotional').slice(0, 200);
  if (!lyrics) {
    return new Response(JSON.stringify({ error: { message: 'Missing "lyrics" or "prompt"' } }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
  var origin = request.headers.get('Origin') || request.headers.get('Referer') || 'https://example.com';
  var baseUrl = origin.replace(/\/$/, '');
  var callBackUrl = baseUrl + '/api/suno-callback';
  var payload = {
    customMode: true,
    instrumental: false,
    prompt: lyrics,
    title: title,
    style: style,
    model: body.model || 'V4_5ALL',
    callBackUrl: callBackUrl
  };
  try {
    var res = await fetch(SUNO_API_BASE + '/api/v1/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
      body: JSON.stringify(payload)
    });
    var text = await res.text();
    var data;
    try { data = text ? JSON.parse(text) : {}; } catch (e) {
      var msg = (res.status === 404)
        ? '음악 서버를 찾을 수 없습니다 (404). API 키와 Suno(sunoapi.org) 계정·엔드포인트를 확인해 주세요.'
        : 'Suno API가 JSON이 아닌 응답을 반환했습니다. (상태: ' + res.status + ')';
      return new Response(JSON.stringify({ error: { message: msg, status: res.status, bodyPreview: text.slice(0, 200) } }), {
        status: res.ok ? 502 : res.status,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
    if (!res.ok) {
      return new Response(JSON.stringify(data), {
        status: res.status,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
    var taskId = (data && data.data && data.data.taskId) ? data.data.taskId : null;
    if (!taskId) {
      return new Response(JSON.stringify({ error: { message: 'Suno did not return taskId', raw: data } }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
    return new Response(JSON.stringify({ taskId: taskId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: { message: err.message || 'Suno generate failed' } }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

async function handleSunoQuery(taskId, env) {
  if (!taskId) {
    return new Response(JSON.stringify({ error: 'Missing taskId' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
  var apiKey = (env.SUNO_API_KEY || env['SUNO_API_KEY'] || '').toString().trim();
  if (!apiKey) {
    return new Response(JSON.stringify({ error: { message: 'SUNO_API_KEY (또는 suno_api) not configured' } }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
  try {
    var res = await fetch(SUNO_API_BASE + '/api/v1/generate/record-info?taskId=' + encodeURIComponent(taskId), {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + apiKey }
    });
    var text = await res.text();
    var data;
    try { data = text ? JSON.parse(text) : {}; } catch (e) {
      return new Response(JSON.stringify({ error: { message: 'Suno API 응답 오류 (비-JSON). 상태: ' + res.status, status: res.status, bodyPreview: text.slice(0, 200) } }), {
        status: res.ok ? 502 : res.status,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: { message: err.message || 'Suno query failed' } }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}
