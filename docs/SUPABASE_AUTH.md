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

## 4. 동작 요약

- **네비게이션**: 비로그인 시 **로그인** 버튼, 로그인 시 **이메일** + **로그아웃** 버튼 표시.
- **모달**: 로그인 버튼 클릭 시 로그인/회원가입 탭이 있는 모달이 열림.
- **회원가입**: Supabase 기본 설정이면 이메일 확인 링크 발송 후, 링크 클릭 시 로그인 가능.
- Supabase URL/키가 없으면 로그인/회원가입 시 "Supabase가 설정되지 않았습니다" 메시지가 표시됩니다.

## 5. Supabase CLI (선택)

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
