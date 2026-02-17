# 이메일 발송 Edge Function 배포 방법

"이메일 발송 서버에 연결할 수 없습니다" 메시지가 나오면, 아래 순서대로 한 번만 설정하면 됩니다.

---

## 1. Supabase CLI 설치

- **Windows**: https://github.com/supabase/cli/releases 에서 최신 `supabase_windows_amd64.exe` 다운로드 후, 실행 파일 이름을 `supabase.exe`로 바꾸고 PATH에 넣기  
  또는 Chocolatey: `choco install supabase`
- **Mac**: `brew install supabase/tap/supabase`

설치 확인:
```bash
supabase --version
```

---

## 2. 로그인 및 프로젝트 연결

프로젝트 폴더에서 실행:

```bash
cd d:\AI\borahae1\borahae-fan
supabase login
```

브라우저가 열리면 로그인한 뒤, 터미널로 돌아옵니다.

이어서 **사용 중인 Supabase 프로젝트**와 연결합니다. (config.js의 URL 기준: `ydzqwveyovdfqgehkpui`)

```bash
supabase link --project-ref ydzqwveyovdfqgehkpui
```

비밀번호 입력이 나오면 Supabase 대시보드 → Project Settings → Database → Database password 값을 입력합니다.

---

## 3. Edge Function 배포

```bash
supabase functions deploy send-result-email
```

성공하면 `Deployed Function send-result-email` 같은 메시지가 나옵니다.

---

## 4. Resend API 키 설정

1. https://resend.com 회원가입 후 **API Keys**에서 키 생성 (무료 할당량 있음)
2. Supabase 대시보드: https://supabase.com/dashboard/project/ydzqwveyovdfqgehkpui/functions  
3. **Edge Functions** → **send-result-email** 선택 → **Secrets** (또는 Settings)
4. **RESEND_API_KEY** 추가, 값에 Resend에서 복사한 키 붙여넣기 (예: `re_xxxx...`)

(선택) **RESEND_FROM_EMAIL**  
- 도메인 인증 전: 비워두면 기본값 `onboarding@resend.dev` 사용  
- 도메인 인증 후: `보라해 <noreply@yourdomain.com>` 형태로 설정

---

## 5. 동작 확인

웹에서 로그인한 뒤 **결과를 이메일로 받기** 버튼을 다시 눌러 보세요.  
등록된 이메일 주소로 메일이 도착하면 설정이 완료된 것입니다.

---

## 요약 명령어 (이미 로그인·링크 완료한 경우)

```bash
cd d:\AI\borahae1\borahae-fan
supabase functions deploy send-result-email
```

이후 Supabase 대시보드에서 **RESEND_API_KEY**만 설정하면 됩니다.
