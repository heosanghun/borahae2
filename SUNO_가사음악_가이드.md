# 가사 → 음악 생성 (Suno API) 설정 및 대안

## 1. Suno API로 서비스 구축하기 (현재 반영됨)

### 흐름

1. 사용자가 **내 탄생뮤직 만들기** 클릭 → OpenAI로 가사 생성
2. 가사가 모달에 표시되면 **즉시** Suno API로 음악 생성 요청
3. 30초~2분 후 생성 완료 → 모달 안에 재생기 표시 (스트리밍/다운로드 URL)

### API 키 발급

- **Suno API (서드파티)**: [sunoapi.org](https://sunoapi.org) → [API 키 관리](https://sunoapi.org/api-key)
- 발급한 키를 **절대** 프론트엔드에 넣지 말고, 서버/워커 환경 변수로만 사용하세요.

### 설정 방법

#### 로컬 개발

1. 프로젝트 루트 `.env`에 추가:
   ```env
   SUNO_API_KEY=여기에_발급한_키_입력
   ```
2. `node scripts/local-server.js` 실행 후 `http://localhost:8000`에서 테스트

#### Cloudflare Pages 배포

1. Cloudflare 대시보드 → Pages → 해당 프로젝트 → **Settings** → **Environment variables**
2. **SUNO_API_KEY** 추가 (값: sunoapi.org에서 발급한 키)
3. 재배포 후 동작 확인

### 사용 API (sunoapi.org)

| 항목 | 내용 |
|------|------|
| **생성** | `POST https://api.sunoapi.org/api/v1/generate` |
| **상태 조회** | `GET https://api.sunoapi.org/api/v1/generate/record-info?taskId=xxx` |
| **인증** | `Authorization: Bearer YOUR_API_KEY` |
| **가사 모드** | `customMode: true`, `instrumental: false`, `prompt`: 가사 전문 (최대 5000자, V4_5ALL 기준) |
| **소요 시간** | 스트리밍 URL 약 30~40초, 다운로드 URL 약 2~3분 |
| **제한** | 10초당 20회 동시 요청 등 (문서 참고) |

이 프로젝트에서는 **워커/로컬 서버**가 위 API를 대신 호출하고, 프론트는 `/api/suno/generate`, `/api/suno/query/:taskId`만 사용합니다.

---

## 2. Suno 말고 쓸 수 있는 대안

가사 → 음악 생성이 가능한 다른 서비스 예시입니다. (가격·정책은 각 사이트 기준으로 확인하세요.)

| 서비스 | 특징 | API·비고 |
|--------|------|----------|
| **Udio** | 보컬/악기, 설명 기반 생성, 커버, 스템 분리 등 | [MusicAPI.ai Udio API](https://musicapi.ai/udio-api) 등 서드파티 API 존재 |
| **Mubert** | 텍스트→음악, 150+ 장르/무드, 로열티 프리, 실시간 적응형 BGM에 강함 | [Mubert API 2.0](https://landing.mubert.com/api-2.0) |
| **Soundverse** | 가사→곡, 설명→곡, 보컬 생성, 스템 분리, 저작권 리스크 완화 강조 | [Soundverse AI API](https://www.soundverse.ai/api) |
| **Mureka (Mureka.ai)** | 이 프로젝트에 이미 `/api/music/generate`, `/api/music/query` 연동됨 | `.env`에 `MUREKA_API_KEY` 설정 시 기존 음악 생성 경로 사용 가능 |

원하시면 위 중 하나를 골라서 **가사 나온 직후**에 호출하는 플로우도 같은 방식(백엔드 프록시 + 폴링)으로 붙일 수 있습니다.

---

## 3. 참고

- **문서**: [Suno API 문서](https://docs.sunoapi.org/) (generate, record-info, 콜백 등)
- **키 관리**: [sunoapi.org/api-key](https://sunoapi.org/api-key)
- 이 프로젝트의 실제 호출 코드: `_worker.js` (Suno), `scripts/local-server.js` (로컬 Suno 프록시), `main.js` (가사 모달 → 자동 생성 → 폴링 → 재생기)
