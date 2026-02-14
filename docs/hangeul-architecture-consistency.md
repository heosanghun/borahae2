# 한글 건축 이미지 일치성 (컨셉 ↔ 최종 ↔ 영상)

## 문제

- **3단계 컨셉 디자인** 조감도와 **5단계 최종 건축물** 이미지가 서로 다른 건축물로 생성되면, 스토리와 영상의 일치성이 깨짐.
- 영상은 최종 건축물 이미지를 기준으로 생성되므로, 컨셉 보드만 다른 건축물이면 사용자 경험상 혼란.

## 해결: 최종 건축물 우선 생성 + 컨셉은 참조 생성

1. **최종 건축물(5단계)을 먼저 생성**
   - 악보·그리드 이후, API 호출 순서상 **최종 건축물 이미지를 제일 먼저** 생성.
   - 이 이미지를 **단일 기준(Source of Truth)**으로 사용.

2. **컨셉 디자인(3단계)은 최종 이미지를 참조**
   - `callGeminiImageGeneration(conceptPrompt, finalBuildingDataUrl)` 로 **최종 건축물 이미지를 첨부**.
   - 프롬프트에 “The ATTACHED image is the key building. You MUST depict THIS EXACT SAME BUILDING in the board (aerial view, perspectives).” 명시.
   - 따라서 컨셉 보드의 조감도·퍼스펙티브는 **최종 건축물과 동일한 건축물**을 그리도록 유도.

3. **영상**
   - `__lastArchBuildingImageBase64` = 최종 건축물 이미지.
   - 영상은 이 이미지를 기준으로 생성되므로, **컨셉(같은 건축물) ↔ 최종 ↔ 영상**이 하나의 건축물로 맞춰짐.

## 생성 순서 (내부)

1. 악보 → 2. 그리드 (클라이언트)
2. **5. 최종 건축물** 생성 (API)
3. **3. 컨셉 디자인** 생성 (API, 입력: 최종 건축물 이미지)
4. **4. 한글 건축 이미지** 생성 (API)
5. 화면 표시 순서: 2 → 3 → 4 → 5, 영상은 5 기준

## 샘플 스타일 (image/hangeul)

- `image/hangeul/sample/` 에 샘플 10개를 두면, 프롬프트가 이 스타일에 맞춰짐.
- 스타일 정의: `image/hangeul/README.md` 참고.
