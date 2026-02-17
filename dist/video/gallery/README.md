# 갤러리 샘플 영상 (Veo 런웨이)

이 폴더에는 원클릭 런웨이 갤러리에 표시할 **Veo 생성 샘플 영상**을 저장합니다.

## 광화문 광장 샘플 생성

1. [Google AI Studio](https://aistudio.google.com/)에서 API 키 발급 후 Veo 사용 가능 여부 확인
2. 터미널에서:

```bash
cd borahae-fan
set GEMINI_API_KEY=your_api_key_here
node scripts/generate-veo-gallery-sample.js gwanghwamun
```

3. 생성이 완료되면 `video/gallery/gwanghwamun-runway.mp4`가 저장되고, `gallery-videos.json`에 자동 반영됩니다.
4. 웹에서 원클릭 코너의 **갤러리**에서 해당 카드를 클릭하면 샘플 영상을 재생할 수 있습니다.

## 추가 배경 샘플

스크립트에 프롬프트가 정의된 id: `gwanghwamun`, `gyeongbokgung`, `namsan`

```bash
node scripts/generate-veo-gallery-sample.js gyeongbokgung
node scripts/generate-veo-gallery-sample.js namsan
```

영상 생성에는 수 분이 걸릴 수 있습니다.
