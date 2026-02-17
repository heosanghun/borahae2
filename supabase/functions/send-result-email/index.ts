// Supabase Edge Function: 로그인한 회원의 이메일로 서비스 결과 발송
// Resend API 사용. Supabase 대시보드에서 RESEND_API_KEY 시크릿 설정 필요.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API = 'https://api.resend.com/emails';

interface SendResultBody {
  serviceId?: string;
  serviceName?: string;
  subject?: string;
  htmlBody?: string;
  textBody?: string;
}

function getJwt(req: Request): string | null {
  const auth = req.headers.get('Authorization');
  if (!auth || !auth.startsWith('Bearer ')) return null;
  return auth.slice(7).trim() || null;
}

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const jwt = getJwt(req);
  if (!jwt) {
    return new Response(
      JSON.stringify({ error: 'login_required', message: '로그인이 필요합니다.' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${jwt}` } },
  });

  const { data: { user }, error: userError } = await supabase.auth.getUser(jwt);
  if (userError || !user?.email) {
    return new Response(
      JSON.stringify({ error: 'invalid_token', message: '유효한 로그인 정보가 없습니다.' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  let body: SendResultBody = {};
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'invalid_body', message: '요청 본문이 올바르지 않습니다.' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const subject = body.subject || '보라해 결과';
  const htmlBody = body.htmlBody || '';
  const textBody = body.textBody || (htmlBody ? htmlBody.replace(/<[^>]+>/g, '').trim() : '');
  const serviceName = body.serviceName || '보라해 서비스';

  const resendKey = Deno.env.get('RESEND_API_KEY');
  if (!resendKey) {
    console.error('RESEND_API_KEY is not set');
    return new Response(
      JSON.stringify({ error: 'server_config', message: '이메일 발송이 설정되지 않았습니다.' }),
      { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Resend: from은 도메인 인증 후 교체 가능. 테스트 시 onboarding@resend.dev 사용 가능
  const fromEmail = Deno.env.get('RESEND_FROM_EMAIL') || '보라해 <onboarding@resend.dev>';
  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [user.email],
      subject: subject,
      html: htmlBody || undefined,
      text: textBody || undefined,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('Resend error:', res.status, errText);
    return new Response(
      JSON.stringify({ error: 'send_failed', message: '이메일 발송에 실패했습니다.' }),
      { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ ok: true, to: user.email }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
});
