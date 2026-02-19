-- AI 사용량 추적 (멤버십 제한용)
-- Free: AI 스타일링 3회/월, 응원봉 1회/월
-- Purple: 스타일링 무제한, 응원봉 10회/월
-- VIP: 모두 무제한

create table if not exists ai_usage (
  user_id uuid not null,
  month text not null,
  style_count int default 0,
  lightstick_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (user_id, month)
);

-- 인덱스 (선택)
create index if not exists idx_ai_usage_user_month on ai_usage(user_id, month);

comment on table ai_usage is '멤버십별 AI 사용량 (월별 리셋)';
