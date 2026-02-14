# Cloudflare Pages 빌드 설정 가이드

## 문제: 환경 변수를 설정했는데 사이트에서 키가 동작하지 않음

**원인**: Cloudflare Pages 환경 변수는 **빌드 타임**에만 사용됩니다. 빌드 명령어가 실행되어 `config.js`가 생성되어야 합니다.

---

## 해결 방법

### 1. Cloudflare Pages 빌드 설정 확인

Cloudflare Pages 대시보드에서:

1. **프로젝트 설정** → **Builds & deployments** (또는 **빌드 및 배포**) 탭으로 이동
2. **Build configuration** (빌드 구성) 섹션 확인:
   - **Build command** (빌드 명령어): `npm run build` (권장. `dist/`에 정적 파일+movie/soave1.mp4 포함)
   - **Build output directory** (빌드 출력 디렉토리): **`dist`** (필수. 메인 영상이 재생되려면 반드시 dist)
   - **Root directory** (루트 디렉토리): (비워두거나 프로젝트 루트)

### 2. 환경 변수 확인

**Settings** → **Variables and Secrets** (변수 및 암호)에서:

- `GEMINI_API_KEY` - **일반 텍스트** 또는 **Secret** (둘 다 가능)
- `SUPABASE_ANON_KEY` - **일반 텍스트** 또는 **Secret**
- `SUPABASE_URL` (선택, 기본값 있음)

**중요**: 환경 변수는 **Production**, **Preview**, **Branch** 환경별로 설정할 수 있습니다.  
현재 배포 환경(Production/Preview)에 맞는 환경 변수가 설정되어 있는지 확인하세요.

### 3. 빌드 실행 및 재배포

환경 변수를 설정하거나 수정한 후:

1. **수동 재배포**:
   - Cloudflare Pages 대시보드 → **Deployments** (배포) 탭
   - 최신 배포 옆 **⋮** 메뉴 → **Retry deployment** (배포 재시도)
   - 또는 **Create deployment** (배포 생성) → **Deploy** 클릭

2. **자동 재배포** (Git 연동 시):
   - Git 저장소에 새로운 커밋 푸시
   - Cloudflare Pages가 자동으로 빌드·배포

### 4. 빌드 로그 확인

배포가 시작되면:

1. **Deployments** 탭에서 진행 중인 배포 클릭
2. **Build logs** (빌드 로그) 확인:
   - `npm run build` 또는 `node scripts/build-config.js` 실행 여부
   - `config.js 생성 완료` 메시지 확인
   - 환경 변수 읽기 오류가 없는지 확인

**예상 로그**:
```
> sims-fashion-ai@ build
> node scripts/build-config.js

config.js 생성 완료: /path/to/config.js
```

### 5. 배포 후 확인

배포가 완료된 후:

1. 사이트 접속: `https://borahae.fan`
2. 브라우저 개발자 도구 (F12) → **Console** 탭
3. `window.__SIMS_GEMINI_KEY__` 입력하여 값 확인:
   - 값이 있으면: 환경 변수가 정상 주입됨
   - `undefined`이면: 빌드가 실행되지 않았거나 환경 변수가 전달되지 않음

또는:

1. 브라우저 개발자 도구 → **Network** 탭
2. 페이지 새로고침
3. `config.js` 파일 요청 확인:
   - 200 OK: 파일이 생성되어 있음
   - 404: 파일이 생성되지 않음 → 빌드 명령어 확인 필요

---

## 빌드 설정 예시

### Cloudflare Pages 빌드 설정 (대시보드)

| 항목 | 값 |
|------|-----|
| **Framework preset** | None (또는 Static) |
| **Build command** | `npm run build` (dist 생성 + config.js) |
| **Build output directory** | **`dist`** (메인 영상 movie/soave1.mp4 포함됨) |
| **Root directory** | (비워두거나 `SIMS_Fashion` - 프로젝트 구조에 따라) |

### package.json (이미 설정됨)

```json
{
  "scripts": {
    "build": "node scripts/build-config.js"
  }
}
```

### build-config.js (이미 환경 변수 읽기 구현됨)

```javascript
// 40-47줄: process.env에서 환경 변수 읽기
const geminiKey = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || SUPABASE_ANON_KEY_DEFAULT;
```

---

## 문제 해결 체크리스트

- [ ] Cloudflare Pages **빌드 명령어**가 `npm run build`로 설정되어 있음
- [ ] **환경 변수** (`GEMINI_API_KEY`, `SUPABASE_ANON_KEY`)가 **Production** 환경에 설정되어 있음
- [ ] 환경 변수 설정 후 **재배포**를 실행했음
- [ ] **빌드 로그**에서 `config.js 생성 완료` 메시지 확인
- [ ] 배포 후 브라우저에서 `window.__SIMS_GEMINI_KEY__` 값 확인 (undefined가 아님)
- [ ] `config.js` 파일이 배포된 사이트에 포함되어 있음 (Network 탭에서 확인)

---

## 추가 참고

- **환경 변수 타입**: Cloudflare Pages에서 **일반 텍스트**와 **Secret** 모두 빌드 타임에 `process.env`로 접근 가능합니다.
- **환경별 설정**: Production, Preview, Branch별로 다른 환경 변수를 설정할 수 있습니다.
- **변경 사항 적용**: 환경 변수를 추가/수정한 후에는 **반드시 재배포**해야 적용됩니다.

---

## 여전히 문제가 해결되지 않으면

1. **빌드 로그** 전체를 확인하여 오류 메시지 확인
2. Cloudflare Pages **Support** 또는 **Community**에 문의
3. 로컬에서 `npm run build` 실행 후 생성된 `config.js` 확인 (로컬에서는 `.env` 파일 사용)
