# 멤버십 구독 서비스 설정 (Purple/VIP)

구독 여부 확인 및 AI 사용량 제한을 위한 설정입니다.

## 1. Supabase 테이블 생성

Supabase 대시보드 → **SQL Editor**에서 아래 SQL 실행:

```sql
create table if not exists ai_usage (
  user_id uuid not null,
  month text not null,
  style_count int default 0,
  lightstick_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (user_id, month)
);

create index if not exists idx_ai_usage_user_month on ai_usage(user_id, month);
```

## 2. 환경 변수

### Cloudflare Workers/Pages

| 변수 | 설명 |
|------|------|
| `POLAR_ACCESS_TOKEN` | Polar OAT (이미 설정됨) |
| `SUPABASE_URL` | Supabase 프로젝트 URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key (서버 전용, RLS 우회) |

**SUPABASE_SERVICE_ROLE_KEY** 발급:
1. Supabase 대시보드 → **Project Settings** → **API**
2. **Project API keys**에서 `service_role` (secret) 복사
3. ⚠️ 이 키는 절대 클라이언트에 노출하지 마세요.

### 로컬 (.env)

```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 3. 제한 정책

| 플랜 | AI 스타일링 | 응원봉 |
|------|-------------|--------|
| Free | 월 3회 | 월 1회 |
| Purple | 무제한 | 월 10회 |
| VIP | 무제한 | 무제한 |

- **비로그인**: Free 제한 적용 (사용량 추적 불가 → 제한 완화 또는 로그인 유도)
- **로그인 + 미구독**: Free
- **로그인 + Polar 구독**: Purple (또는 VIP, 상품별 구분)

## 4. API

- `GET /api/membership-status?userId=xxx` — 멤버십 상태 및 잔여 횟수
- `POST /api/usage-increment` — 사용 후 증가 (body: `{ userId, type: 'style'|'lightstick' }`)
