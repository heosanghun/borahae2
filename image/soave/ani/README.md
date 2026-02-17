# 소아베 애니메이션 영상 (69개)

## 폴더 구조

- **ani_soave/** — 소아베 캐릭터 영상 65개: ` (1).mp4` ~ ` (65).mp4`
- **ani_han/** — 한(韓) 테마 영상 4개: `2 (1).mp4` ~ `2 (4).mp4`
- **soave-video-categories.json** — 영상별 카테고리 매핑 (채팅 연동용)

## 카테고리 (soave-video-categories.json)

| 키 | 한글 | 용도 예시 |
|----|------|-----------|
| dance | 춤 | "소아베 춤 추는 포즈 해봐" |
| walk | 걷기 | "걷는 모습 해줘" |
| run | 뛰기 | "뛰는 모습 해줘" |
| jump | 점프 | "점프 해줘" |
| greeting | 인사 | "인사해줘" |
| wave | 웨이브 | "손 흔들어줘" |
| heart | 하트 | "하트 보내줘" |
| surprise | 놀람 | "놀란 표정 해줘" |
| annoyed | 짜증 | "짜증 표정 해줘" |
| disappointed | 실망 | "실망한 표정 해줘" |
| pitiful | 한심 | "한심한 표정 해줘" |
| gloomy | 우울 | "우울한 표정 해줘" |
| happy | 행복 | "행복한 표정 해줘" |
| laugh | 웃음 | "웃어줘", "웃는 표정 해줘" |
| cry | 우는 표정 | "우는 표정 해줘", "울어줘" |
| cheer | 응원 화이팅 | "화이팅 해줘", "응원해줘" |
| careful | 조심 | "조심해줘" |
| care | 배려 | "배려해줘" |
| hangeul | 한글 캐릭터 | 한글 페르소나 관련 |
| horong | 호롱 | "호롱 보여줘" |
| horong_strong | 호롱 천하장사 | "호롱 천하장사" |
| horong_flower | 호롱 꽃 | "호롱 꽃" |
| gorong | 고롱 | "고롱 보여줘" |
| gorong_inventor | 고롱 발명가 | "고롱 발명가" |
| neutral | 기본/휴식 | 대기·일반 포즈 |
| general | 미분류 | 아직 분류 전 |

## 분류 방법

1. 로컬 서버 실행: `npm run dev`
2. 브라우저에서 **http://localhost:8000/tools/soave-video-classifier.html** 열기
3. 영상을 보면서 카테고리 버튼(춤, 인사, 웨이브 등)으로 지정
4. 「JSON 내보내기」 클릭 후, `image/soave/ani/soave-video-categories.json` 내용을 내보낸 JSON으로 **전체 교체** 저장

분류가 끝나면 채팅에서 `[ACTION:play-soave-video:카테고리]` 로 특정 카테고리 영상만 재생하도록 연동할 수 있습니다.
