# soave 배경 영상 — Cloudflare R2로 빠르게 서빙하기

고해상도 영상(`soave_flower.mp4`)을 **Cloudflare R2**에 올리면 CDN으로 전 세계에서 빠르게 재생됩니다.  
(구글 드라이브 iframe보다 로딩·재생이 안정적입니다.)

---

## 1. Cloudflare R2에 영상 올리기

1. **Cloudflare 대시보드** → [R2 Object Storage](https://dash.cloudflare.com/?to=/:account/r2) 이동
2. **Create bucket** → 이름 예: `borahae-fan-assets` → 생성
3. 버킷 안에서 **Upload** → `soave_flower.mp4` 업로드
4. 업로드된 파일 클릭 → **Public access** 사용 설정  
   - "Allow Access" 또는 "R2.dev subdomain" 활성화 후 **Public URL** 복사  
   - 예: `https://pub-xxxxx.r2.dev/soave_flower.mp4`

---

## 2. 사이트에 URL 연결하기

### 방법 A: index.html에서 직접 설정 (간단)

`index.html` 상단(바로 `<body>` 다음)에 있는 스크립트에서 `SOAVE_VIDEO_URL`에 R2 공개 URL을 넣습니다.

```html
<script>
window.SOAVE_VIDEO_URL = 'https://pub-xxxxx.r2.dev/soave_flower.mp4';
```

이렇게 하면 **구글 드라이브 iframe 대신** `<video>` 태그로 R2 URL을 재생합니다. (더 빠름)

### 방법 B: Cloudflare Pages 환경 변수로 설정 (배포 시 자동 반영)

1. [Cloudflare Pages - borahae-fan 프로젝트](https://dash.cloudflare.com/f983b19b170b39f4aa6803b5b18dc26b/pages/view/borahae-fan/settings/production) → **Settings** → **Environment variables**
2. **Add variable**  
   - Name: `SOAVE_VIDEO_URL`  
   - Value: `https://pub-xxxxx.r2.dev/soave_flower.mp4`  
   - Environment: Production (필요 시 Preview도 동일하게)
3. 빌드 시 이 값을 주입하려면 **빌드 스크립트**에서 `index.html`에 치환하는 단계가 필요합니다.  
   (현재 저장소는 정적 HTML이라, **방법 A**로 `index.html`에 직접 넣는 방식이 가장 간단합니다.)

---

## 3. 동작 방식

- `SOAVE_VIDEO_URL`이 **비어 있으면**  
  → 기존처럼 **구글 드라이브 iframe**으로 재생
- `SOAVE_VIDEO_URL`에 **R2(또는 다른 직접 영상) URL**을 넣으면  
  → **`<video>` 태그**로 해당 URL 재생 (CDN으로 더 빠르고 끊김 감소)

R2 공개 URL만 넣어 주시면, 별도 설정 없이 바로 적용됩니다.
