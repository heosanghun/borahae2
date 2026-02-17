# Cloudflare Pages 배포 설정

## 빌드 설정 (필수)

프로젝트 설정 → **Builds & deployments** 에서 아래와 같이 설정하세요.

| 항목 | 값 |
|------|-----|
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory** | (비워두기) |

## "사용 가능한 배포 없음" / 배포 실패 시

1. **Build output directory** 가 정확히 `dist` 인지 확인 (소문자, 앞뒤 공백 없음).
2. **배포 다시 시도** 버튼으로 재배포.
3. **로그**에서 "Cloudflare 전역 네트워크로 배포 중" 단계 오류 메시지 확인.

로컬에서 `npm run build` 실행 후 `dist` 폴더에 `index.html`, `main.js` 등이 생성되면 빌드는 정상입니다.
