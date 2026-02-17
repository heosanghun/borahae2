# Supabase 회원가입/로그인 설정

SIMS Fashion AI에서 이메일·비밀번호 로그인/회원가입은 [Supabase Auth](https://supabase.com/docs/guides/auth)를 사용합니다.

## 1. Supabase 프로젝트 만들기

1. [supabase.com](https://supabase.com)에 로그인 후 **New project** 생성.
2. **Project Settings** → **API**에서 다음 값을 확인:
   - **Project URL** → `.env`의 `SUPABASE_URL`
   - **anon public** 키 → `.env`의 `SUPABASE_ANON_KEY`
3. **Authentication** → **Providers**에서 **Email**이 활성화되어 있는지 확인 (기본값 사용 가능).

## 2. 로컬 환경 변수

프로젝트 루트에 `.env` 파일을 만들고 (`.env.example` 복사 후 값 채우기):

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

설정 후 `npm run build`로 `config.js`를 다시 생성합니다. (`scripts/build-config.js`가 이 값을 읽어 `config.js`에 넣습니다.)

## 3. 배포(Cloudflare Pages) 환경 변수

Cloudflare Pages 대시보드에서 프로젝트 선택 → **Settings** → **Environment variables**에 다음을 추가:

- `SUPABASE_URL` (Production / Preview)
- `SUPABASE_ANON_KEY` (Production / Preview)

배포 시 빌드 단계에서 `config.js`에 주입됩니다.

## 4. Google 로그인 (OAuth)

로그인 모달에 **Google로 로그인** 버튼이 있습니다. 사용하려면 아래 설정이 필요합니다.

### 4.1 Google Cloud 설정

1. [Google Cloud Console](https://console.cloud.google.com)에서 프로젝트 생성 또는 선택.
2. **API 및 서비스** → **사용자 인증 정보** → **사용자 인증 정보 만들기** → **OAuth 클라이언트 ID**.
3. 애플리케이션 유형: **웹 애플리케이션**.
4. **승인된 JavaScript 원본**:  
   - 로컬: `http://localhost:포트`, `http://127.0.0.1:포트`  
   - 배포: `https://your-domain.com`
5. **승인된 리디렉션 URI**: Supabase 대시보드에서 확인  
   - **Authentication** → **Providers** → **Google** → **Callback URL** 복사 후 여기에 추가.  
   - 로컬 개발: `http://127.0.0.1:54321/auth/v1/callback` (Supabase 로컬 사용 시)
6. **클라이언트 ID**와 **클라이언트 보안 비밀**을 복사.

### 4.2 Supabase 대시보드

1. **Authentication** → **Providers** → **Google** 활성화.
2. Google에서 복사한 **Client ID**, **Client Secret** 입력 후 저장.
3. **Authentication** → **URL Configuration** → **Redirect URLs**에 다음 추가:
   - `https://your-domain.com` (실서비스)
   - `http://localhost:포트` 또는 `http://127.0.0.1:포트` (로컬)

자세한 절차는 [Supabase 문서 - Login with Google](https://supabase.com/docs/guides/auth/social-login/auth-google)을 참고하세요.

## 5. 동작 요약

- **네비게이션**: 비로그인 시 **로그인** 버튼, 로그인 시 **이메일** + **로그아웃** 버튼 표시.
- **모달**: 로그인 버튼 클릭 시 로그인/회원가입 탭이 있는 모달이 열림. 이메일·비밀번호 로그인과 **Google로 로그인** 지원.
- **회원가입**: Supabase 기본 설정이면 이메일 확인 링크 발송 후, 링크 클릭 시 로그인 가능.
- Supabase URL/키가 없으면 로그인/회원가입 시 "Supabase가 설정되지 않았습니다" 메시지가 표시됩니다.

## 6. Supabase CLI (선택)

로컬에서 Supabase를 쓰거나 마이그레이션을 관리하려면 [Supabase CLI](https://supabase.com/docs/reference/cli/introduction)를 사용할 수 있습니다.

```bash
# CLI 설치 후
supabase login
supabase init          # supabase/config.toml 생성
supabase start         # 로컬 Postgres 등 실행 (Docker 필요)
supabase link          # 원격 프로젝트 연결
supabase db push       # 마이그레이션 푸시
```

현재 사이트는 **Supabase Cloud**의 Auth만 사용하므로, CLI 없이 대시보드 + `.env`만으로도 동작합니다.
