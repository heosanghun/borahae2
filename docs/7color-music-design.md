# 7컬러 × 퍼스널컬러 × 음악 추천 설계

BTS 멤버는 **직접 거론하지 않고**, 7가지 색과 무드만 사용합니다.

---

## 1. BTS 곡 리스트 (7컬러 연동)

| 컬러 | 무드 키워드 | 대표 곡 | YouTube 직링크 | YouTube 검색 링크 |
|------|-------------|---------|----------------|-------------------|
| **빨강** | 열정, 강렬, 에너지 | Fire (불타오르네) | `https://www.youtube.com/watch?v=4ujQOR2DMFM` | `https://www.youtube.com/results?search_query=Fire+불타오르네+official+MV` |
| **주황** | 따뜻, 유쾌, 스무스 | Butter | `https://www.youtube.com/watch?v=ZlQIw9EPui0` | `https://www.youtube.com/results?search_query=Butter+official+MV` |
| **노랑** | 밝음, 디스코, 활기 | Dynamite | `https://www.youtube.com/watch?v=gdZLi9oWNZg` | `https://www.youtube.com/results?search_query=Dynamite+official+MV` |
| **초록** | 평화, 설렘, 달달함 | Boy With Luv (작은 것들을 위한 시) | `https://www.youtube.com/watch?v=XsX3ATc3FbA` | `https://www.youtube.com/results?search_query=Boy+With+Luv+작은+것들을+위한+시+official` |
| **파랑** | 시원, 청량, 신선 | DNA | `https://www.youtube.com/watch?v=MBdVXkSdhwU` | `https://www.youtube.com/results?search_query=DNA+official+MV` |
| **남색** | 깊음, 예술적, 내면 | Black Swan | `https://www.youtube.com/watch?v=0lapF4DQPKQ` | `https://www.youtube.com/results?search_query=Black+Swan+official+MV` |
| **보라** | 감성, 드라마, 몽환 | Spring Day (봄날) | `https://www.youtube.com/watch?v=xEeFrLSkMm8` | `https://www.youtube.com/results?search_query=봄날+Spring+Day+official+MV` |

### 보조 곡 (같은 컬러 무드)

| 컬러 | 추가 곡 | 비고 |
|------|---------|------|
| 빨강 | Idol, Not Today | 강렬한 퍼포먼스 |
| 주황 | Permission to Dance | 경쾌한 팝 |
| 노랑 | Life Goes On (밝은 위로) | 밝은 감성 |
| 초록 | Euphoria, Make It Right | 달달·희망 |
| 파랑 | Blue & Grey, Save Me | 시원·청량 |
| 남색 | Blood Sweat & Tears (피 땀 눈물) | 깊은 드라마 |
| 보라 | Fake Love, The Truth Untold | 감성·몽환 |

---

## 2. 퍼스널 컬러 → 대표 7컬러 매핑표

| 퍼스널 컬러 | 대표 7컬러 | 이유 (무드/톤) |
|-------------|------------|------------------|
| **봄웜** | 노랑 · 주황 | 따뜻·밝은 톤, 생기 있는 색과 잘 맞음 |
| **여름쿨** | 파랑 · 보라 | 쿨·파스텔, 시원·청량한 무드와 일치 |
| **가을웜** | 빨강 · 남색 | 톤 다운된 웜, 깊고 무게감 있는 색 |
| **겨울쿨** | 빨강(쿨) · 남색 · 보라 | 선명·대비 강한 쿨톤 |

### 코드용 매핑 (JS 객체)

```javascript
const PERSONAL_COLOR_TO_7COLOR = {
  '봄웜':     { primary: 'yellow',  secondary: 'orange', mood: '밝고 따뜻한' },
  '봄쿨':     { primary: 'yellow',  secondary: 'green',  mood: '밝고 산뜻한' },
  '여름쿨':   { primary: 'blue',    secondary: 'violet', mood: '시원하고 청량한' },
  '여름웜':   { primary: 'green',   secondary: 'blue',   mood: '부드럽고 시원한' },
  '가을웜':   { primary: 'red',     secondary: 'indigo', mood: '따뜻하고 깊은' },
  '가을쿨':   { primary: 'indigo',  secondary: 'violet', mood: '무게감 있고 몽환적인' },
  '겨울쿨':   { primary: 'red',     secondary: 'indigo', mood: '선명하고 시원한' },
  '겨울웜':   { primary: 'violet',  secondary: 'red',   mood: '강렬하고 감성적인' }
};
```

### 계절만 있을 때 (봄/여름/가을/겨울)

```javascript
const SEASON_TO_7COLOR = {
  '봄':   { primary: 'yellow',  secondary: 'orange' },
  '여름': { primary: 'blue',    secondary: 'violet' },
  '가을': { primary: 'red',     secondary: 'indigo' },
  '겨울': { primary: 'violet',  secondary: 'indigo' }
};
```

---

## 3. 7컬러별 음악 데이터 (코드 삽입용)

```javascript
const COLOR_MUSIC = {
  red: {
    name: '빨강',
    mood: '열정적이고 강렬한',
    description: '에너지 넘치는 비트와 강렬한 무드가 잘 어울려요.',
    directLink: 'https://www.youtube.com/watch?v=4ujQOR2DMFM',
    searchLink: 'https://www.youtube.com/results?search_query=Fire+불타오르네+official+MV',
    searchQuery: 'Fire 불타오르네 official MV'
  },
  orange: {
    name: '주황',
    mood: '따뜻하고 유쾌한',
    description: '스무스하고 경쾌한 팝 무드와 잘 맞아요.',
    directLink: 'https://www.youtube.com/watch?v=ZlQIw9EPui0',
    searchLink: 'https://www.youtube.com/results?search_query=Butter+official+MV',
    searchQuery: 'Butter official MV'
  },
  yellow: {
    name: '노랑',
    mood: '밝고 활기찬',
    description: '디스코와 밝은 에너지가 잘 어울려요.',
    directLink: 'https://www.youtube.com/watch?v=gdZLi9oWNZg',
    searchLink: 'https://www.youtube.com/results?search_query=Dynamite+official+MV',
    searchQuery: 'Dynamite official MV'
  },
  green: {
    name: '초록',
    mood: '달콤하고 설레는',
    description: '달달하고 희망적인 무드와 잘 맞아요.',
    directLink: 'https://www.youtube.com/watch?v=XsX3ATc3FbA',
    searchLink: 'https://www.youtube.com/results?search_query=Boy+With+Luv+작은+것들을+위한+시+official',
    searchQuery: 'Boy With Luv 작은 것들을 위한 시 official'
  },
  blue: {
    name: '파랑',
    mood: '시원하고 청량한',
    description: '신선하고 쿨한 비트가 잘 어울려요.',
    directLink: 'https://www.youtube.com/watch?v=MBdVXkSdhwU',
    searchLink: 'https://www.youtube.com/results?search_query=DNA+official+MV',
    searchQuery: 'DNA official MV'
  },
  indigo: {
    name: '남색',
    mood: '깊고 예술적인',
    description: '내면적이고 드라마틱한 무드와 잘 맞아요.',
    directLink: 'https://www.youtube.com/watch?v=0lapF4DQPKQ',
    searchLink: 'https://www.youtube.com/results?search_query=Black+Swan+official+MV',
    searchQuery: 'Black Swan official MV'
  },
  violet: {
    name: '보라',
    mood: '감성적이고 몽환적인',
    description: '감성과 위로가 담긴 무드와 잘 맞아요.',
    directLink: 'https://www.youtube.com/watch?v=xEeFrLSkMm8',
    searchLink: 'https://www.youtube.com/results?search_query=봄날+Spring+Day+official+MV',
    searchQuery: '봄날 Spring Day official MV'
  }
};
```

---

## 4. 화면에 넣을 문구·링크 예시

### 4.1 퍼스널 컬러 결과 카드 아래 (여름쿨 예시)

**문구 (표시용)**

- 타이틀: `이 컬러에 어울리는 무드 & 음악`
- 부제: `당신은 **파랑** 계열이에요. 시원하고 청량한 무드와 잘 맞아요.`
- CTA: `이 무드의 대표 곡 들어보기` → **직링크** (DNA 공식 MV)
- 보조: `유튜브에서 더 찾아보기` → **검색 링크** (`search_query=DNA+official+MV` 또는 `청량한+팝+플레이리스트`)

### 4.2 HTML/버튼 예시 (직링크 vs 검색링크)

```html
<!-- 직링크: 한 곡 바로 재생 -->
<a href="https://www.youtube.com/watch?v=MBdVXkSdhwU" target="_blank" rel="noopener noreferrer" class="music-cta">
  이 무드의 대표 곡 들어보기
</a>

<!-- 검색 링크: 유튜브에서 더 찾기 -->
<a href="https://www.youtube.com/results?search_query=DNA+official+MV" target="_blank" rel="noopener noreferrer" class="music-cta secondary">
  유튜브에서 더 찾아보기
</a>
```

### 4.3 카드 전체 문구 템플릿

```
[퍼스널 컬러 카드 아래 섹션]

이 컬러에 어울리는 무드 & 음악
당신은 {7컬러 이름} 계열이에요. {무드 설명}이(가) 잘 어울려요.

[색상 견본 1개 또는 무드 아이콘]

[버튼] 이 무드의 대표 곡 들어보기   → 직링크
[버튼] 유튜브에서 더 찾아보기        → 검색 링크
```

### 4.4 여름쿨 → 파랑 적용 예

- **7컬러 이름**: 파랑  
- **무드 설명**: 시원하고 청량한  
- **직링크**: DNA 공식 MV  
- **검색 링크**: `https://www.youtube.com/results?search_query=DNA+official+MV` 또는 `청량한+팝+플레이리스트`

---

## 5. 구현 순서 제안

| 순서 | 작업 | 파일 |
|------|------|------|
| 1 | `COLOR_MUSIC`, `PERSONAL_COLOR_TO_7COLOR` 상수 추가 | `main.js` |
| 2 | 퍼스널 컬러 결과 렌더 시 `primary` 7컬러 결정 | `main.js` |
| 3 | 퍼스널 컬러 카드 아래 "이 컬러에 어울리는 음악" 블록 HTML 추가 | `index.html` 또는 `main.js` 동적 생성 |
| 4 | "대표 곡 들어보기" → 직링크, "유튜브에서 더 찾기" → 검색 링크 연결 | `main.js` |
| 5 | (선택) 7컬러별 색상 견본 또는 아이콘 표시 | `style.css` / `main.js` |

---

## 6. 저작권·링크 정리

- **직링크**: 공식 채널(BIGHIT MUSIC / HYBE LABELS) 업로드 영상으로 연결 → 저작권 위반 아님.
- **검색 링크**: 유튜브 검색 결과로 이동 → 저작권 위반 아님.
- **표기**: 서비스 내에서 아티스트·멤버 이름 직접 사용하지 않고, "7가지 컬러", "이 무드의 대표 곡" 등만 사용.

이 문서는 `docs/7color-music-design.md` 로 참고하고, 위 JS 객체는 `main.js` 에 붙여 넣어 사용하면 됩니다.
