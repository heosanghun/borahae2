# 나만의 에피소드 · 캐릭터 중심 이미지 제작 가이드

**목적**: `image/name/ja`, `image/name/mo` 폴더에 있는 **한글 에이전트 캐릭터**를 분석·정리하고, **나노 바나나(이미지 AI)** 등으로 같은 캐릭터를 중심으로 이미지를 만들 때 쓸 **프롬프트 작성 방법**을 정리한 문서입니다.

---

## 0. 맞춤 프롬프트 자동 생성 (뼈대 + 빈칸)

**사용자가 직접 전체 프롬프트를 쓰지 않아도 됩니다.**

- 서비스에는 **기본 프롬프트 뼈대**가 들어 있고, 그 안에 **빈칸** `[이름]`, `[캐릭터]`, `[장면]` 이 있습니다.
- **이름**을 입력해 에피소드를 만들면:
  - **`[이름]`** → 방금 입력한 이름으로 **자동** 채워집니다.
  - **`[캐릭터]`** → 그 이름에서 나온 에이전트 목록(고롱, 이롱, …)으로 **자동** 채워집니다.
  - **`[장면]`** → 기본 문장으로 채워지며, **원하면 사용자가 직접 글자를 바꿔 넣을 수 있는** 유일한 빈칸입니다.
- 이렇게 채워진 **완성 프롬프트**가 화면에 나오고, **복사** 버튼으로 이미지 AI(나노 바나나 등)에 붙여 넣어 맞춤 이미지를 만들 수 있습니다.
- 즉, **어떤 글자를 [장면]에 넣어도** 뼈대는 그대로 두고, 그 부분만 바뀐 맞춤식 프롬프트가 만들어져 이미지 생성에 사용할 수 있습니다.

---

## 1. 폴더 구조 및 캐릭터 목록

### 1.1 자음(ja) 폴더 — 14캐릭터

| 파일명 | 한글 자모 | 캐릭터 이름 | 역할(재능) | 성향 키워드 |
|--------|-----------|-------------|------------|-------------|
| golong.png | ㄱ | 고롱 | 발명가 | 호기심, 제작, 수리 |
| nolong.png | ㄴ | 노롱 | 가수 | 표현, 무대, 스타성 |
| dolong.png | ㄷ | 도롱 | 도우미 | 친절, 배려, 희생 |
| lolong.png | ㄹ | 로롱 | 요리사 | 케어, 위로, 맛 |
| molong.png | ㅁ | 모롱 | 뚝딱이(공예가) | 손재주, 제작, 건축 |
| bolong.png | ㅂ | 보롱 | 천문학자 | 탐구, 방향, 신비 |
| solong.png | ㅅ | 소롱 | 시인 | 감성, 사유, 언어 |
| olong.png | ㅇ | 오롱 | 웃음꽃(개그맨) | 유쾌, 분위기, 위로 |
| jolong.png | ㅈ | 조롱 | 상상가 | 꿈, 아이디어, 창의 |
| cholong.png | ㅊ | 초롱 | 댄서 | 리듬, 열정, 에너지 |
| kolong.png | ㅋ | 코롱 | 파수꾼 | 경계, 시야, 보호 |
| tolong.png | ㅌ | 토롱 | 달변가 | 지식, 설득, 해결 |
| polong.png | ㅍ | 포롱 | 탐정 | 호기심, 분석, 추리 |
| holong.png | ㅎ | 호롱 | 천하장사 | 힘, 보호, 의리 |

### 1.2 모음(mo) 폴더 — 14캐릭터

| 파일명 (한글) | 접미사 | 한글 자모 | 캐릭터 이름 | 역할(재능) |
|---------------|--------|-----------|-------------|------------|
| 아롱 | _draphed_01_944x1120.png | ㅏ | 아롱 | 화가 |
| 애롱 | _draphed_01_896x1200.png | ㅐ | 애롱 | 선생님 |
| 야롱 | _draphed_01_896x1200.png | ㅑ | 야롱 | 전령사 |
| 얍롱 | _draphed_01_896x1200.png | ㅒ | 얍롱 | 사진가 |
| 어롱 | _draphed_01_896x1200.png | ㅓ | 어롱 | 정원사 |
| 에이롱 | _draphed_01_896x1200.png | ㅔ | 에이롱 | 길잡이 |
| 여롱 | _draphed_01_896x1200.png | ㅕ | 여롱 | 치유사 |
| 예롱 | _draphed_01_896x1200.png | ㅖ | 예롱 | 연주가 |
| 오롱 | _draphed_01_896x1200.png | ㅗ | 오롱 | 웃음꽃 |
| 요롱 | _draphed_01_896x1200.png | ㅛ | 요롱 | 동물 조련사 |
| 우롱 | _draphed_01_896x1200.png | ㅜ | 우롱 | 기록가 |
| 유롱 | _draphed_01_896x1200.png | ㅠ | 유롱 | 해양 탐험가 |
| 으롱 | _draphed_01_896x1200.png | ㅡ | 으롱 | 명상가 |
| 이롱 | _draphed_01_896x1200.png | ㅣ | 이롱 | 재단사 |

---

## 2. 이미지 분석 요약 — 공통 시각 스타일

ja·mo 폴더 내 캐릭터 이미지를 분석한 **공통 특징**입니다. 프롬프트에 아래 요소를 넣으면 기존 캐릭터와 톤을 맞출 수 있습니다.

- **캐릭터 베이스**: 흰색 털/양 같은 **플러피한 양·램 형태**의 인형체. 몸은 흰색 털 텍스처, 얼굴·손은 연한 살색, 볼은 로지.
- **한글 연동**: 머리 위에 **한글 자모를 3D 형태로 한 뿔/앙트러**가 있음. (예: 고롱=분홍 곡선 뿔, 호롱=한글 "아" 형태 분홍 뿔, 소롱=한글 ㅅ 형태 보라색 앙트러, 아롱=분홍 앙트러+페인트 얼룩)
- **의상·소도구**: **역할에 맞는** 작업복·악세서리·소품. (예: 고롱=청바지 멜빵+도구 벨트+청사진+돋보기, 아롱=페인트 묻은 청바지+베레모+팔레트+붓, 소롱=보라 베레모+두루마리+깃펜+책)
- **렌더링**: **3D CGI**, 부드러운 라이팅·소프트 섀도우, 털·천·가죽 등 텍스처 디테일. 배경은 검정 또는 투명으로 단일 캐릭터 강조.
- **분위기**: 귀엽고 친근한 **다이어리/웹툰 캐릭터** 톤, 사진보다는 **3D 피규어/애니메이션에 가까운 사실감**.

---

## 3. 나노 바나나(이미지 AI)에 넣을 프롬프트 구조

캐릭터를 **중심**으로 이미지를 만들 때는 아래 **3단 구성**을 추천합니다.

### 3.1 기본 구조 (영어 프롬프트 예시)

```
[스타일] + [캐릭터 외형] + [한글 뿔/소품] + [역할·의상·소도구] + [구도·배경]
```

- **스타일**: `3D render, cute character, soft lighting, high quality, Hangul agent diary style`
- **캐릭터 외형**: `fluffy white sheep-like creature, round face, large expressive eyes, rosy cheeks, soft wool texture`
- **한글 뿔/소품**: 해당 자모 명시. 예: `pink antlers shaped like Korean letter ㅅ (siot)` 또는 `horns in the shape of Hangul character 아 (a)`
- **역할·의상·소도구**: 아래 캐릭터별 표 참고.
- **구도·배경**: `full body, centered, black background` 또는 `standing in a forest clearing, soft bokeh`

### 3.2 캐릭터별 프롬프트 요소 (영어, 복사·수정용)

| 이름 | 역할 | 의상·소도구·한글 뿔 (프롬프트용 키워드) |
|------|------|----------------------------------------|
| 고롱 | 발명가 | denim overalls, tool belt, blueprint scroll, magnifying glass, steampunk goggles, pink curved horns |
| 노롱 | 가수 | microphone, stage, pink or red accents, singer pose, small horns |
| 도롱 | 도우미 | kind expression, helping gesture, apron or soft clothes, gentle horns |
| 로롱 | 요리사 | chef hat or apron, cooking utensils, ladle or pan, warm expression |
| 모롱 | 뚝딱이 | craft tools, wooden pieces, hammer or saw, builder outfit, horns |
| 보롱 | 천문학자 | telescope, star chart, dark blue/purple cape, starry theme horns |
| 소롱 | 시인 | purple beret, scroll, quill pen, open book, antlers shaped like ㅅ (siot) |
| 오롱 | 웃음꽃 | bright smile, comedy prop or flower, yellow/cream accents, cheerful |
| 조롱 | 상상가 | sleepy cute expression, pillow or cloud, dreamy pastel colors |
| 초롱 | 댄서 | dynamic pose, dance outfit, music notes, energetic, ribbon or scarf |
| 코롱 | 파수꾼 | tall posture, binoculars or lookout pose, guard theme, horns |
| 토롱 | 달변가 | book or scroll, wise expression, scholar or speaker pose |
| 포롱 | 탐정 | magnifying glass, detective cap or coat, clue-seeking pose |
| 호롱 | 천하장사 | strong friendly pose, pink Hangul "아" shaped horns, clasped hands, sheep costume |
| 아롱 | 화가 | paint-splattered denim overalls, beret, paintbrush, palette, paint on antlers |
| 애롱 | 선생님 | book, pointer or chalk, kind teacher pose, glasses optional |
| 야롱 | 전령사 | running pose, letter or scroll, messenger bag, speedy theme |
| 어롱 | 정원사 | flowers, watering can, gardening gloves, green accents |
| 여롱 | 치유사 | herb, bandage, gentle healing pose, white/soft green |
| 예롱 | 연주가 | musical instrument (flute, small harp), music notes |
| 오롱 | 웃음꽃 | (자음 오롱과 동일 컨셉) 밝은 웃음, 꽃 또는 개그 소품 |
| 요롱 | 동물 조련사 | small animals, whistle or treat, friendly with creatures |
| 우롱 | 기록가 | big book, quill, librarian or scribe outfit |
| 유롱 | 해양 탐험가 | diving goggles, seashell, ocean blue theme |
| 으롱 | 명상가 | calm pose, lotus or cushion, serene expression |
| 이롱 | 재단사 | needle, thread, fabric, measuring tape, tailor outfit |

---

## 4. 나노 바나나에 넣어 줄 프롬프트 예시 (복사용)

### 4.1 단일 캐릭터 — 고롱(발명가) 중심

**영어 (권장)**  
```
3D render, photorealistic cute character. Fluffy white sheep-like creature with soft wool texture, round face, large brown eyes, rosy cheeks, smiling. Wearing blue denim overalls and brown tool belt with wrench and screwdriver. Holding rolled blueprint and magnifying glass. Steampunk goggles on forehead, smooth pink curved horns. Inventor theme. Full body, centered, black background. Hangul agent diary style.
```

**한국어 (서비스가 한글 지원 시)**  
```
3D 렌더, 귀여운 캐릭터. 흰색 털 양 같은 생김새, 둥근 얼굴, 큰 눈, 볼터치. 청바지 멜빵에 도구 벨트, 렌치와 드라이버. 청사진 두루마리와 돋보기 들고 있음. 이마에 스팀펑크 고글, 분홍 곡선 뿔. 발명가 테마. 전신, 검은 배경. 한글 에이전트 다이어리 스타일.
```

### 4.2 단일 캐릭터 — 아롱(화가) 중심

**영어**  
```
3D render, cute fluffy white sheep character. Paint-splattered blue denim overalls, dark beret with paint dabs. Holding paintbrush and kidney-shaped palette with many colors. Pink antlers with paint splashes, paintbrush tucked in antler. Artist, painter theme. Full body, black background. High quality 3D CGI, Hangul agent style.
```

### 4.3 여러 캐릭터 — 에피소드 한 컷

**영어**  
```
3D render, multiple cute fluffy sheep-like characters in a forest clearing. One character with inventor goggles and tool belt (Gorong), one with paint palette and beret (Arong), one with purple beret and scroll (Solong). Each has distinct role props. Soft sunlight, green grass, pastel flowers. Hangul agent diary style, photorealistic 3D, no text.
```

---

## 5. 프롬프트 작성 시 체크리스트

- [ ] **스타일**: `3D render`, `cute`, `Hangul agent diary style` (또는 `한글 에이전트 다이어리 스타일`) 포함
- [ ] **캐릭터 베이스**: `fluffy white sheep-like creature` (또는 `흰색 털 양 캐릭터`) 포함
- [ ] **한글 연동**: 해당 캐릭터의 **한글 자모 뿔/앙트러** 형태를 한 줄이라도 기술 (예: `horns like Hangul ㅅ`, `antlers shaped like 아`)
- [ ] **역할**: 표의 **역할(재능)** 에 맞는 **의상·소도구** 키워드 2~4개 포함
- [ ] **구도**: 단일 캐릭터면 `full body, centered, black background`, 장면이면 `forest clearing` 등 배경·인원 수 명시
- [ ] **금지**: 다른 IP 캐릭터명 직접 사용, 텍스트/로고 넣기 (필요 시 “no text” 추가)

---

## 6. 참고 파일

- 캐릭터 성향·역할 상세: `docs/한글_소모오_캐릭터_성향_정리.md`
- 에피소드 서비스 기획: `docs/SERVICE-DESIGN-NAME-TO-EPISODES.md`
- 코드 내 자·모음 매핑: `name-episodes.js` (JA_MAP, MO_MAP, JA_INFO, MO_INFO)

이 문서를 기준으로 **나노 바나나**에 위 프롬프트를 넣어 주면, ja·mo 폴더 캐릭터를 **중심**으로 한 이미지를 일관된 스타일로 제작할 수 있습니다.
