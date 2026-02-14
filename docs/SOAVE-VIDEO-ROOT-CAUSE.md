# 메인 영상이 재생되지 않는 원인 분석 (soave1.mp4)

## 현상

- **로컬**: `movie/soave1.mp4` 재생됨 (고정 이미지 아님).
- **운영(https://borahae.fan/)**: 메인 히어로에 **고정 이미지(background1.jpeg)**만 보이고, 영상은 재생되지 않음.

---

## 핵심 원인 (한 줄)

**운영 환경에서 `/movie/soave1.mp4` 요청 시 동영상이 아니라 메인 페이지 HTML(index.html)이 반환되고 있어, `<video>`가 로드에 실패하고 있습니다.**

그래서 브라우저는 비디오 대신 항상 보이는 **배경 레이어(hero-soave-bg, background1.jpeg)**만 보여주게 됩니다.

---

## 원인 세부 분석

### 1) 용량(11MB) 문제인가?

- **아님.** soave1.mp4는 약 11MB로, GitHub 100MB·Cloudflare Pages 단일 파일 25MB 한도 이내.
- 11MB는 스트리밍으로도 문제 없음.

### 2) Git 푸시/업로드 문제인가?

- **로컬 기준으로는 아님.** `git ls-files movie/` 에 `movie/soave1.mp4`가 포함되어 있고, `.gitignore`의 `!movie/soave1.mp4`로 추적됨.
- 다만 **실제로 Pages에 연결된 저장소/브랜치**에 해당 파일이 들어 있는지, 그리고 **그 커밋 기준으로 배포**가 이뤄졌는지는 Cloudflare 대시보드·빌드 로그로 확인 필요.

### 3) 실시간 영상 로직/링크 문제인가?

- **일부 맞음.**  
  - 코드 상으로는 `SOAVE_VIDEO_URL = 'movie/soave1.mp4'` → `<video src="movie/soave1.mp4">` 로 정상.
  - 문제는 **같은 URL을 운영 서버에 요청했을 때** 동영상이 아니라 **HTML이 내려온다**는 점입니다.
- 즉, **로직/경로는 맞고, 서버 응답이 잘못된 것**입니다.

### 4) 서버가 HTML을 주는 이유 (결론)

- `https://borahae.fan/movie/soave1.mp4` 를 열면 **동영상 바이트가 아니라 index.html 내용**이 반환됨(이전 fetch 검증).
- 이는 보통 다음 두 가지 조합으로 발생합니다.
  1. **배포 결과물에 `movie/soave1.mp4` 파일이 없음**  
     → 해당 경로 요청 시 404 발생.
  2. **404 시 SPA 폴백으로 index.html 제공**  
     → 브라우저는 “영상 URL”이라고 생각하고 요청했지만, 실제로는 HTML을 받음 → `<video>` 디코딩 실패 → `error` 이벤트 → 재생 불가.

따라서 **“영상이 안 나오는 이유”의 핵심**은  
**배포된 사이트에 `movie/soave1.mp4` 파일이 실제로 포함되어 있지 않다**는 것입니다.

---

## 배포에 파일이 빠질 수 있는 요인

1. **Build output directory**
   - 출력 디렉터리가 `.`가 아니라 `dist` 등으로 설정되어 있는데, `npm run build`가 `movie/`를 그 출력 폴더로 복사하지 않는 경우.
2. **Root directory**
   - Cloudflare Pages의 “Root directory”가 프로젝트 루트가 아닌 하위 폴더로 되어 있어, 그 하위 폴더에 `movie/`가 없을 수 있음.
3. **빌드 결과만 배포**
   - “빌드 결과물만” 업로드하는 설정인데, 빌드 스크립트가 `movie/soave1.mp4`를 결과물에 포함하지 않는 경우.

---

## 해결 방향 (로컬처럼 자연스럽게 재생되게)

1. **배포 결과물에 `movie/soave1.mp4` 반드시 포함**
   - 빌드 스크립트에서 `dist`(또는 사용하는 출력 디렉터리)로 `movie/soave1.mp4`를 명시적으로 복사하도록 하고,
   - Cloudflare Pages의 **Build output directory**를 그 출력 폴더(예: `dist`)로 맞춥니다.
   - 이렇게 하면 “실시간으로 불러오는 로직/링크”는 그대로 두어도, 같은 상대 경로 `movie/soave1.mp4`로 영상이 제공됩니다.
2. **Cloudflare 대시보드 확인**
   - Build output directory = 실제로 `movie/`가 들어가는 디렉터리인지,
   - Root directory = `movie/`를 포함한 프로젝트 루트(또는 해당 폴더)인지 확인.
3. **(선택) 영상을 외부 URL로 제공**
   - R2 등에 soave1.mp4를 올리고 `SOAVE_VIDEO_URL`에 그 절대 URL을 넣으면, Pages 배포 구조와 무관하게 항상 동일 URL로 영상을 불러올 수 있음.

---

## 요약

| 구분 | 내용 |
|------|------|
| **현상** | 운영에서는 고정 이미지(background1.jpeg)만 보이고, 영상은 재생되지 않음. |
| **핵심 원인** | `/movie/soave1.mp4` 요청에 서버가 **동영상이 아닌 index.html**을 돌려줌 → `<video>` 로드 실패. |
| **근본 이유** | 배포된 결과물에 `movie/soave1.mp4`가 없어 404가 나고, 404 시 index.html이 반환되는 구조로 보임. |
| **용량** | 11MB로 문제 없음. |
| **해결** | 빌드 시 `movie/soave1.mp4`를 출력 디렉터리에 포함시키고, Build output directory를 그 폴더로 설정해, 같은 경로로 영상이 제공되게 함. |

이 문서는 위 원인을 기준으로, 빌드 스크립트 수정 및 구글 드라이브 제거와 함께 적용됩니다.
