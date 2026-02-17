# send-result-email

로그인한 회원의 이메일로 서비스 결과를 발송하는 Supabase Edge Function입니다.

## 동작

- 클라이언트에서 `supabase.functions.invoke('send-result-email', { body: { serviceId, serviceName, subject, htmlBody, textBody } })` 호출
- 요청 시 `Authorization: Bearer <JWT>` 필요 (Supabase 세션). 수신자 이메일은 JWT의 사용자 이메일로 고정됩니다.
- [Resend](https://resend.com) API로 메일 발송

## 배포 및 시크릿

1. [Resend](https://resend.com)에서 API 키 발급
2. Supabase CLI로 배포:
   ```bash
   supabase functions deploy send-result-email
   ```
3. Supabase 대시보드 → Edge Functions → send-result-email → Secrets 에서 설정:
   - `RESEND_API_KEY`: Resend API 키 (필수)
   - `RESEND_FROM_EMAIL`: (선택) 발신 주소. 예: `보라해 <noreply@yourdomain.com>`. 미설정 시 `onboarding@resend.dev` 사용

## 로컬 테스트

```bash
supabase functions serve send-result-email --env-file .env.local
```

`.env.local` 예시:

```
RESEND_API_KEY=re_xxxx
RESEND_FROM_EMAIL=보라해 <onboarding@resend.dev>
```
