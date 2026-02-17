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
  var apiKey = env.MUREKA_API_KEY || env.Mureka_API_KEY || env['MUREKA_API_KEY'] || '';
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
  var apiKey = env.MUREKA_API_KEY || env.Mureka_API_KEY || env['MUREKA_API_KEY'] || '';
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
