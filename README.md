# 보라해 BORAHAE

**I Purple You · 끝까지 함께**

K-pop을 사랑하는 팬들의 라이프스타일 플랫폼. AI 스타일링, 팬 굿즈, 커뮤니티, 이벤트까지 보라빛으로 물든 특별한 팬 경험을 제공합니다.

---

## 주요 기능

### 서비스 (올인원 플랫폼)
- **AI K-pop 스타일링** — 콘서트, 팬미팅, 일상까지 퍼스널 컬러·체형 분석 기반 K-pop 감성 코디 추천
- **보라해 굿즈샵** — 보라빛 감성 팬메이드 굿즈 마켓플레이스 (의류, 에코백, 폰케이스, 키링·액세서리, 문구·다이어리, 스티커·데코, 시계·보라타임)
- **팬 커뮤니티** — 같은 마음의 팬들과 소통하고 덕질 일상을 공유하는 공간
- **이벤트 기획** — 생일 카페, 스트리밍 파티, 팬 프로젝트 기획·참여
- **팬 콘텐츠** — 팬아트, 팬픽션, 에디트 영상 감상·공유
- **프리미엄 멤버십** — 독점 콘텐츠, 굿즈 할인, 이벤트 우선 참여 등 VIP 혜택

### 기타
- **보라빛 응원봉** — 이름·문구 입력 후 AI가 생성한 응원봉 이미지 다운로드
- **BORATIME** — 시계도 패션이다. 앱에서 보라빛 시계 페이스 유료 다운로드
- **다국어** — 한국어(KO) / English(EN) 전환
- **다크모드** — 라이트·다크 테마 지원
- **회원** — Supabase Auth 기반 로그인·회원가입 (선택)

---

## 시작하기

### 로컬에서 실행

1. **저장소 클론**
   ```bash
   git clone https://github.com/heosanghun/borahae-fan.git
   cd borahae-fan
   ```

2. **웹 서버 실행**
   - Python: `python -m http.server 8000`
   - Node: `npx serve .`
   - 또는 Live Server 등 사용

3. **브라우저에서 열기**
   - `http://localhost:8000` (또는 사용한 포트)

### API 키 설정 (AI 채팅·스타일링)

API 키는 **.env**에만 두고 Git에는 올리지 않습니다.

1. **`.env` 파일 생성** (`.env.example` 복사 후 키 입력)
   ```powershell
   # Windows (PowerShell)
   Copy-Item .env.example .env
   ```
2. **`.env` 예시**
   ```
   GEMINI_API_KEY=AIza...
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```
3. **config.js 생성** (브라우저용 설정 파일, Git 제외)
   ```bash
   node scripts/build-config.js
   ```
4. 웹 서버 실행 후 사이트 접속

- 채팅·스타일링 이미지 생성에는 **Gemini API**가 사용됩니다.
- `config.js`는 `.gitignore`에 포함되어 저장소에 올라가지 않습니다.

---

## 프로젝트 구조

```
borahae-fan/
├── index.html          # 메인 HTML (보라해 랜딩·서비스·굿즈·멤버십 등)
├── main.js             # 로직 (채팅, 스타일링, 응원봉, Auth, i18n 등)
├── style.css           # 스타일시트
├── i18n.js             # 다국어 (KO/EN) 번역 데이터
├── package.json        # npm 스크립트 (build 등)
├── config.js           # API 키 주입 (빌드 시 생성, Git 제외)
├── .env.example        # .env 예시
├── .env                # API 키 (직접 생성, Git 제외)
├── image/              # 로고, 파비콘, BORATIME 등
│   ├── logo.png, logo_dark.png
│   ├── BORATIME.jpeg, BORATIME-DESIGN.jpeg
│   └── favicon/        # 파비콘 전 세트
├── scripts/
│   ├── build-config.js # .env → config.js 생성
│   └── test-*.js       # API 테스트 스크립트
├── docs/               # 배포·Supabase 등 문서
└── supabase/           # Supabase 설정 (config.toml 등)
```

---

## 기술 스택

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **AI**: Google Gemini (채팅, 이미지 생성·스타일링)
- **Auth**: Supabase Auth (로그인·회원가입)
- **다국어**: i18n (KO/EN)
- **폰트**: Noto Sans KR, Playfair Display

---

## 배포 (Cloudflare Pages)

저장소가 **Cloudflare Pages**에 연결되어 있으면 push 시 자동 배포됩니다.

- **Build command**: `npm run build`
- **Build output directory**: `.` (루트)
- **환경 변수** (Cloudflare 대시보드에서 설정):
  - `GEMINI_API_KEY`
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`

빌드 시 `node scripts/build-config.js`가 실행되어 `config.js`가 생성되며, 배포된 사이트에서 챗봇·스타일링·로그인이 동작합니다.

---

## GitHub 푸시

```bash
git add .
git commit -m "커밋 메시지"
git push origin main
```

인증이 필요하면 Personal Access Token 사용. 자세한 내용은 `GITHUB_SETUP.md` 참조.

---

## 보안

- API 키는 **.env**에만 저장하고, `node scripts/build-config.js`로 **config.js**를 생성해 사용합니다.
- **config.js**와 **.env**는 `.gitignore`에 포함되어 저장소에 올라가지 않습니다.
- 배포 시에는 배포 서버의 환경 변수로 키를 주입하고 빌드에서 config.js를 생성하는 방식을 사용합니다.

---

## 라이선스

이 프로젝트는 개인/팬 프로젝트입니다.

## 작성자

**heosanghun**  
- GitHub: [@heosanghun](https://github.com/heosanghun)

## 감사의 말

- Google Gemini API  
- Supabase  
- Google Fonts, Noto Sans KR  
