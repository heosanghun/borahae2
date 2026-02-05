# 개발단계 계획서: 7컬러 음악 추천 기능

**작성일**: 2025-02-05  
**목표**: 퍼스널 컬러 결과에 “이 컬러에 어울리는 무드 & 음악” 블록을 추가하고, **기존 코드·기능은 단 한 가지도 침해하지 않음**.

---

## 1. 현재 기준 기능 정리 (반드시 유지)

아래 기능은 **수정·삭제·동작 변경 없이 그대로 유지**해야 합니다.

| 번호 | 기능 | 위치/식별자 | 검증 방법 |
|------|------|-------------|-----------|
| 1 | 테마 토글 (라이트/다크) | `#theme-toggle`, `localStorage.theme` | 클릭 시 테마 전환, 새로고침 후 유지 |
| 2 | 네비게이션 스크롤 효과 | `.navbar` | 스크롤 시 그림자 |
| 3 | 모바일 메뉴 | `.mobile-menu-btn`, `.nav-links` | 클릭 시 메뉴 열림/닫힘 |
| 4 | 앵커 스무스 스크롤 | `a[href^="#"]` | 클릭 시 해당 섹션으로 스크롤 |
| 5 | 룩북 모달 | `#lookbook-modal`, 카드 클릭 | 이미지/태그/제목/설명/아이템/컬러 표시 |
| 6 | 정보 모달 (Features 등) | `#info-modal`, `[data-modal]` | 아이콘/제목/본문 표시 |
| 7 | **스타일링 모달 전체** | `#styling-modal`, `#styling-close` | 열기/닫기, Step 1~6 진행 |
| 8 | Step 네비게이션 | `goToStep(step)`, `#next-*`, `#prev-*` | Step 이동, progress bar, 활성/완료 표시 |
| 9 | Step 1: 사진/키/몸무게/스타일 | `#photo-upload-area`, `#height-input`, `#weight-input`, 스타일 버튼 | 입력값 `stylingData` 저장 |
| 10 | Step 2: 체형 | 체형 옵션 버튼 | `stylingData.bodyType` |
| 11 | Step 3: 옷 스타일 | 스타일 옵션 | `stylingData.styles` |
| 12 | Step 4: 피부톤/언더톤 | `#step-4`, `.color-option`, `.undertone-card` | `stylingData.skinTone`, `undertone` |
| 13 | Step 5: AI 분석 | `#next-4` → `goToStep(5)` → `startAIAnalysis()` | 로딩 → 결과 표시 |
| 14 | **AI 분석 결과 표시** | `displayAnalysisResult(result)` | `#personal-color-result`, `#style-result`, `#recommendation-result`, `#tips-result` 채움 |
| 15 | 퍼스널 컬러 카드 내용 | `#personal-color-result` | season, description, palette (기존 3요소) |
| 16 | AI 패션 이미지 생성 | `#generate-fashion-btn`, `generateFashionImage()` | 플레이스홀더 → 생성 → 좋아요/다시생성 |
| 17 | 취향 학습 (좋아요/저장) | `getTastePreferences()`, `saveTasteLike()`, `getPreferredStylesForPrompt()` | localStorage, 프롬프트 반영 |
| 18 | 네이버 쇼핑 버튼 | `#naver-shop-btn` (Step 5에서 href 설정) | 클릭 시 네이버 검색 |
| 19 | 결과 저장하기 | `#save-result` | 다운로드 + `personal-color-result` 등 innerHTML 저장 |
| 20 | 다시 분석하기 | `#retry-analysis` | 로딩 표시 후 `startAIAnalysis()` 재실행 |
| 21 | Virtual Try-On (Step 6) | `#go-to-tryon`, `#step-6`, 갤러리/업로드/생성 | 의류 선택 후 Try-On 이미지 생성 |
| 22 | 채팅 위젯 | `#chat-widget`, `#chat-toggle`, `#chat-messages`, `#chat-input`, `#chat-send` | 열기/닫기, 전송, 퀵 버튼 |
| 23 | AI 챗봇 (취향 반영) | `getChatUserContext()`, `callGeminiChat()` | 저장된 취향 기반 답변 |
| 24 | 퀵 버튼 | `.quick-btn` | 클릭 시 해당 질문 채팅에 삽입 |

---

## 2. 추가·개선될 기능 (이번 개발 범위)

| 번호 | 기능 | 설명 | 침해 여부 |
|------|------|------|-----------|
| A1 | **7컬러 매핑 상수** | `PERSONAL_COLOR_TO_7COLOR`, `SEASON_TO_7COLOR`, `COLOR_MUSIC` (설계서 기준) | 신규 추가만, 기존 변수/함수명 미사용 |
| A2 | **퍼스널 컬러 → 7컬러 결정** | `result.personalColor.season` 문자열로 primary 7컬러 결정 (예: 여름쿨 → blue) | 기존 `displayAnalysisResult` 내부에서만 사용 |
| A3 | **“이 컬러에 어울리는 무드 & 음악” 블록** | 퍼스널 컬러 카드 **안**에, 팔레트 아래에 블록 추가 | `#personal-color-result`의 innerHTML을 **한 번에** 구성할 때 기존 3요소 + 이 블록 포함 |
| A4 | **직링크 버튼** | “이 무드의 대표 곡 들어보기” → YouTube 공식 MV | 새 `<a>` 태그, 기존 버튼/이벤트 변경 없음 |
| A5 | **검색 링크 버튼** | “유튜브에서 더 찾아보기” → YouTube 검색 URL | 새 `<a>` 태그 |

**범위 제한**

- 퍼스널 컬러 **결과가 이미 나온 후**에만 음악 블록이 보이도록 함 (Step 5 결과 화면).
- AI 분석 실패/기본값(`getDefaultResult`)인 경우에도 `personalColor.season`이 있으면 7컬러 매핑 적용 (예: 가을웜 → red/indigo).

---

## 3. 침해 방지 규칙

1. **기존 DOM 구조**
   - `#personal-color-result`는 **한 요소**로 유지. 자식만 추가(팔레트 아래에 음악 블록).
   - `#style-result`, `#recommendation-result`, `#tips-result`, `#analysis-loading`, `#analysis-result` 구조·id 변경 금지.

2. **기존 함수 시그니처**
   - `displayAnalysisResult(result)` 인자/반환값 변경 금지. 내부 구현만 확장(innerHTML에 음악 블록 문자열 추가).
   - `startAIAnalysis()`, `goToStep()`, `getDefaultResult()` 시그니처 유지.

3. **기존 이벤트 리스너**
   - `#save-result`: 그대로 `#personal-color-result`의 innerHTML을 읽어 저장. 음악 블록이 포함되어도 동작 유지.
   - `#retry-analysis`, `#next-4`, `#prev-*` 등 모든 기존 리스너 유지.

4. **데이터 흐름**
   - AI 분석 결과 `result.personalColor.season`만 사용해 7컬러 결정. 기존 `season`, `description`, `palette` 사용 로직 변경 금지.

5. **스타일**
   - 음악 블록용 클래스는 새로 추가 (예: `.personal-color-music`). 기존 클래스명 덮어쓰지 않음.

---

## 4. 구현 단계 (체크리스트)

| 단계 | 작업 내용 | 파일 | 검증 |
|------|-----------|------|------|
| 1 | 상수 추가: `COLOR_MUSIC`, `PERSONAL_COLOR_TO_7COLOR`, `SEASON_TO_7COLOR` | `main.js` | 구문 오류 없음, 기존 코드 앞쪽(예: API 키 아래)에 추가 |
| 2 | 헬퍼 함수: `getPrimary7Color(seasonString)` (season 문자열 → primary 컬러 키) | `main.js` | 봄/여름/가을/겨울, 웜/쿨 조합 및 미매칭 시 기본값(blue) 반환 |
| 3 | `displayAnalysisResult()` 수정: 기존 퍼스널 컬러 HTML 생성 후, `getPrimary7Color(result.personalColor.season)` 호출하여 음악 데이터 취득, 같은 innerHTML 문자열에 음악 블록 HTML 추가 후 `personalColorEl.innerHTML = ...` **한 번만** 할당 | `main.js` | Step 5 결과에서 퍼스널 컬러 카드 안에 시즌+설명+팔레트+음악 블록 모두 표시 |
| 4 | 음악 블록 HTML: 제목, 부제(7컬러 이름+무드), 직링크 버튼, 검색 링크 버튼 (BTS/아티스트 명시 없음) | `main.js` | 문구만 “이 컬러에 어울리는 무드 & 음악”, “당신은 {name} 계열이에요” 등 |
| 5 | 스타일 추가: `.personal-color-music`, 버튼/링크 스타일 (기존 카드와 조화) | `style.css` | 레이아웃 깨짐 없음, 다크/라이트 테마 대응 |
| 6 | 셀프점검: Step 1~6 전 흐름, 결과 저장, 다시 분석, Try-On 이동, 채팅 등 **현재 기능 정리 목록** 전부 동작 확인 | 전체 | 문서 1절 항목별 체크 |

---

## 5. 최종 목표 (완료 조건)

- [x] 퍼스널 컬러 결과 카드 안에 “이 컬러에 어울리는 무드 & 음악” 블록이 표시된다.
- [ ] “이 무드의 대표 곡 들어보기” 클릭 시 해당 7컬러 YouTube 직링크가 새 탭에서 열린다.
- [ ] “유튜브에서 더 찾아보기” 클릭 시 해당 검색 링크가 새 탭에서 열린다.
- [x] **현재 개발된 코드 및 기능이 침해되지 않는다** (1절 기능 정리 목록 전부 정상 동작).
- [x] BTS/멤버 명시 없이 7컬러·무드만 노출된다.

---

## 6. 셀프점검 (이상 여부)

- **계획서와 설계서 일치**: `docs/7color-music-design.md`의 `COLOR_MUSIC`, `PERSONAL_COLOR_TO_7COLOR`, `SEASON_TO_7COLOR` 및 직링크/검색 링크와 동일하게 구현.
- **침해 여부**: 1절 기능은 모두 “유지”만 명시, 3절 침해 방지 규칙으로 구현 범위 제한.
- **미구현 범위**: API 호출 없음, 채팅에 음악 추천 로직 추가 없음(선택 사항은 제외).
- **이상 여부**: 없음 → 개발 진행.

---

**구현 완료 (2025-02-05)**: `main.js`에 7컬러 상수·`getPrimary7Color()`·`displayAnalysisResult()` 내 음악 블록 추가, `style.css`에 `.personal-color-music`·`.music-cta` 스타일 추가 완료. 기존 퍼스널 컬러/결과 저장/Step 흐름 변경 없음.
