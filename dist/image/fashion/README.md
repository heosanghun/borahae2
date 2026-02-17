# 패션 이미지 (Fashion Images)

이 폴더에는 **무료 라이선스**로 사용 가능한 패션/의류 이미지가 저장됩니다.

**보라해 스타일링** 옷 선택 화면에서 사용됩니다.  
- **패션** 카테고리: **1.jpg ~ 12.jpg** → 「패션 1」~「패션 12」  
- **아우터** 카테고리: **jumper.jpg** → 「점퍼」

## 다운로드 방법 (Pexels)

1. **Pexels API 키 발급** (무료)  
   https://www.pexels.com/api/new/

2. **프로젝트 루트 `.env`** 에 추가:
   ```
   PEXELS_API_KEY=발급받은키
   ```

3. **스크립트 실행** (프로젝트 루트에서):
   ```bash
   node scripts/download-fashion-images.js
   ```

## 라이선스

- **Pexels License**: https://www.pexels.com/license/
  - 상업적 사용 가능
  - 수정·편집 가능
  - 출처 표기 불필요 (권장됨)
  - 포스터 등 무수정 재판매만 금지
