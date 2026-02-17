# 테스트 안내

## 전문 메이크업 포인트 텍스트

- **실행**: `node scripts/test-makeup-tips.js`
- **내용**: 퍼스널 컬러 시즌(봄웜/여름쿨/가을웜/겨울쿨)별·기본 문구가 올바르게 반환되는지 검증합니다.
- **연결**: `displayAnalysisResult()`에서 `updateMakeupTips(result.personalColor.season)` 호출 → `#k-beauty-makeup-tips-desc`에 표시됩니다.

## 화장 전/후 사진 생성

- **동작**: Step 5 분석 완료 후 메이크업 섹션의 "메이크업 적용해 보기" 클릭 시 `runKBeautyMakeupGenerate()` → `callGeminiMakeup()` 호출.
- **필수 조건**:
  - 얼굴 사진 업로드
  - K-뷰티 동의 완료
  - `GEMINI_API_KEY` 설정 (이미지 생성 API)
- **동작 확인**: 로컬 서버 실행 후 스타일링 모달에서 Step 1~5 진행 → Step 5 결과에서 메이크업 섹션 노출 → "메이크업 적용해 보기" 클릭으로 생성·저장·아래 텍스트까지 확인 가능합니다.
