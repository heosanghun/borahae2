# 배포 방법 (music 포함 BGM 배포)

## 방법 1: GitHub 푸시 → Cloudflare 자동 배포 (권장)

이미 **music 폴더를 푸시**했다면, Cloudflare Pages가 GitHub와 연결되어 있을 때 **푸시만으로 자동 배포**됩니다.

1. **자동 배포 확인**  
   - [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **borahae-fan** (또는 해당 프로젝트)  
   - **Deployments** 탭에서 최근 푸시 후 새 배포가 시작됐는지 확인

2. **수동으로 한 번 더 배포하고 싶을 때**  
   - **Deployments** 탭 → 최신 배포 오른쪽 **⋮** → **Retry deployment**  
   - 또는 **Create deployment** → **Deploy**  
   - 그러면 최신 `main` 기준으로 `npm run build`가 실행되고, **dist**(music 포함)가 배포됩니다.

3. **빌드 설정 확인**  
   - **Settings** → **Builds & deployments**  
   - **Build command**: `npm run build`  
   - **Build output directory**: `dist`  
   - 이렇게 되어 있으면 빌드 시 `music/`이 dist에 복사되어 배포됩니다.

---

## 방법 2: Wrangler로 직접 배포

로컬에서 `dist`를 바로 Cloudflare Pages에 올리고 싶을 때:

1. **API 토큰 발급**  
   - https://developers.cloudflare.com/fundamentals/api/get-started/create-token/  
   - **Edit Cloudflare Workers** 템플릿으로 토큰 생성 후 복사

2. **토큰 설정 후 배포** (PowerShell)
   ```powershell
   cd d:\AI\borahae1\borahae-fan
   $env:CLOUDFLARE_API_TOKEN = "여기에_토큰_붙여넣기"
   npm run deploy
   ```
   또는 한 줄로:
   ```powershell
   $env:CLOUDFLARE_API_TOKEN = "토큰"; npm run deploy
   ```

3. **프로젝트 이름**  
   - `package.json`의 `deploy` 스크립트는 `--project-name=borahae-fan` 사용  
   - Cloudflare Pages 프로젝트 이름이 다르면 해당 이름으로 수정

---

배포가 끝나면 사이트에서 **BGM 듣기**로 music이 재생되는지 확인하면 됩니다.
