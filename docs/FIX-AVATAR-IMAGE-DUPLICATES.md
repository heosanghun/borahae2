# 아바타 이미지 중복 파일 정리

## 문제 원인

`image/soave/` 폴더에 여러 개의 유사한 이름의 이미지 파일이 있어 혼동이 발생:

1. `chat-soave-avatar.png` (390557 bytes) - 전체 몸 이미지
2. `chat-soave-face.png` (333412 bytes) - **얼굴만 크롭된 이미지 (현재 사용 중)**
3. `soave-avatar.png` (390557 bytes) - 전체 몸 이미지 (중복)
4. `soave-face.png` (390557 bytes) - 전체 몸 이미지 (중복)
5. `soave-face-small.png` (36199 bytes) - 작은 크기
6. `soave.jpeg` - JPEG 버전

**현재 코드에서 사용하는 파일**: `chat-soave-face.png` (얼굴만 크롭된 이미지)

## 해결 방법

1. **불필요한 중복 파일 제거** (Git에서 삭제)
2. **하나의 명확한 파일명으로 통일**: `soave-avatar-face.png`
3. **모든 참조 경로 업데이트**

## 실행 계획

1. `chat-soave-face.png`를 `soave-avatar-face.png`로 이름 변경
2. 중복 파일들(`chat-soave-avatar.png`, `soave-avatar.png`, `soave-face.png`) Git에서 삭제
3. HTML, JS의 모든 경로를 `soave-avatar-face.png`로 업데이트
