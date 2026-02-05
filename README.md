# SIMS Fashion AI

AI 기반 초개인화 패션 스타일링 플랫폼

## 🎨 주요 기능

- **AI 스타일링 분석**: 체형, 피부톤, 라이프스타일을 분석하여 맞춤형 스타일 추천
- **퍼스널 컬러 진단**: 4계절 퍼스널 컬러 분석 및 추천
- **실시간 AI 채팅**: 패션 관련 질문에 대한 즉각적인 답변
- **룩북 갤러리**: 다양한 스타일 제안 및 코디 아이템 추천
- **다크모드**: 라이트/다크 테마 지원

## 🚀 시작하기

### 로컬에서 실행

1. 저장소 클론
```bash
git clone https://github.com/heosanghun/SIMS_Fashion.git
cd SIMS_Fashion
```

2. 웹 서버 실행
- Python: `python -m http.server 8000`
- Node.js: `npx serve .`
- 또는 Live Server 확장 프로그램 사용

3. 브라우저에서 열기
- `http://localhost:8000`

### API 키 설정 (AI 채팅·스타일링)

API 키는 **.env**에만 두고, Git에는 올라가지 않습니다.

1. 프로젝트 루트에 `.env` 파일 생성 (`.env.example` 복사 후 키 입력)
   ```bash
   # Windows (PowerShell)
   Copy-Item .env.example .env
   # .env 파일을 열어 아래 변수에 본인 키 입력
   ```
2. `.env` 예시:
   ```
   OPENAI_API_KEY=sk-proj-...
   GEMINI_API_KEY=AIza...
   ```
3. `config.js` 생성 (브라우저에서 사용할 설정 파일, Git 제외)
   ```bash
   node scripts/build-config.js
   ```
4. 웹 서버 실행 후 사이트 접속

- **채팅**: OpenAI 실패 시 자동으로 Gemini로 재시도합니다. 둘 중 하나만 설정해도 동작합니다.
- `config.js`는 `.gitignore`에 포함되어 있어 저장소에 올라가지 않습니다.

## 📁 프로젝트 구조

```
SIMS_Fashion/
├── index.html         # 메인 HTML
├── main.js            # JavaScript 로직 (API 키는 사용하지 않음, config.js 참조)
├── config.js          # API 키 주입 (자동 생성, Git 제외)
├── style.css          # 스타일시트
├── .env               # API 키 (직접 생성, Git 제외)
├── .env.example       # .env 예시
├── scripts/
│   └── build-config.js  # .env → config.js 생성
└── README.md
```

## 🔧 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **AI**: OpenAI GPT-4o-mini
- **스타일링**: CSS Variables, Flexbox, Grid
- **폰트**: Noto Sans KR, Playfair Display

## 📝 GitHub 푸시

### 자동 푸시 스크립트 사용

PowerShell에서 실행:
```powershell
.\push.ps1
```

### 수동 푸시

```bash
git add .
git commit -m "커밋 메시지"
git push origin main
```

**인증 필요**: Personal Access Token 사용 (자세한 내용은 `GITHUB_SETUP.md` 참조)

## ⚠️ 중요 사항

### API 키 보안

- API 키는 **.env**에만 저장하고, `node scripts/build-config.js`로 **config.js**를 생성해 사용합니다.
- **config.js**와 **.env**는 `.gitignore`에 포함되어 저장소에 올라가지 않습니다.
- 프로덕션/배포 시: 배포 서버에서만 .env를 두고 build-config를 실행하거나, 백엔드 API로 키를 관리하는 방식을 권장합니다.

## 📄 라이선스

이 프로젝트는 개인 프로젝트입니다.

## 👤 작성자

**heosanghun**
- GitHub: [@heosanghun](https://github.com/heosanghun)

## 🙏 감사의 말

- OpenAI API
- Unsplash 이미지
- Google Fonts
