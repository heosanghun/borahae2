export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/chat' && request.method === 'POST') {
      return handleChat(request, env);
    }

    return env.ASSETS.fetch(request);
  }
};

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
