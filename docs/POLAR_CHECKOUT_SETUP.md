# Polar 결제 연동 설정

Product ID `ab0e92a7-a0bf-4572-9373-514707f58439` 기준으로 Polar 결제(멤버십 Purple/VIP)가 연동되어 있습니다.

## 1. Polar Organization Access Token (OAT) 발급

1. [Polar Dashboard](https://polar.sh) 로그인
2. **Settings** → **Organization** → **Access Tokens**
3. **Create token** 클릭
4. `checkouts:write` 스코프 포함하여 생성
5. 토큰 복사 (한 번만 표시됨)

## 2. 로컬 개발 (.env)

`image/.env` 또는 프로젝트 루트 `.env`에 추가:

```
POLAR_ACCESS_TOKEN=polar_oat_xxxxxxxxxxxxxxxxxxxxxxxx
```

로컬 서버 재시작 후 멤버십 버튼 클릭 시 Polar 결제 페이지로 이동합니다.

## 3. Cloudflare Pages 배포

Cloudflare Workers/Pages에 환경 변수 설정:

1. [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → 해당 프로젝트
2. **Settings** → **Environment variables**
3. **Production**에 추가:
   - `POLAR_ACCESS_TOKEN` = `polar_oat_xxxxxxxxxxxxxxxxxxxxxxxx`
4. **Save** 후 **Retry deployment** 또는 새 배포

## 4. 멤버십 제한 (선택)

구독 여부 확인 및 AI 사용량 제한을 사용하려면 [docs/MEMBERSHIP_SETUP.md](./MEMBERSHIP_SETUP.md)를 참고:

- Supabase `ai_usage` 테이블 생성
- `SUPABASE_SERVICE_ROLE_KEY` 환경 변수 설정

## 5. API 동작

- **POST** `/api/polar-checkout`
- Body: `{ "productId": "ab0e92a7-a0bf-4572-9373-514707f58439", "successUrl": "..." }` (선택)
- 기본 Product ID: `ab0e92a7-a0bf-4572-9373-514707f58439`
- 응답: `{ "url": "https://buy.polar.sh/..." }` → 결제 완료 후 `successUrl`로 리다이렉트

## 6. 다른 상품 ID 사용

Purple / VIP 각각 다른 Product ID를 쓰려면:

1. **Purple**: `index.html`의 Purple 버튼 `data-product-id` (기본: ab0e92a7-a0bf-4572-9373-514707f58439)
2. **VIP**: Polar에서 VIP 상품(₩19,900/월) 생성 후 `.env`에 `POLAR_VIP_PRODUCT_ID=생성된ID` 추가. Cloudflare 배포 시 환경 변수에도 동일 설정.
2. Polar 대시보드에서 상품별 Product ID 확인 후 적용

## 7. 결제 테스트 (Sandbox)

Polar Sandbox 환경에서 테스트 시 Stripe 테스트 카드 사용:

| 항목 | 값 |
|------|-----|
| **카드 번호** | `4242 4242 4242 4242` |
| **유효기간** | 미래 날짜 (예: 12/34) |
| **CVC** | 아무 3자리 (예: 123) |
| **우편번호** | 아무 5자리 |

Sandbox 사용 시 API URL을 `https://sandbox-api.polar.sh/v1`로 변경하고, Sandbox용 OAT를 발급해 사용하세요.

## 참고

- [Polar API - Create Checkout Session](https://polar.sh/docs/api-reference/checkouts/create-session)
- [Polar Sandbox](https://polar.sh/docs/integrate/sandbox)
- [docs/polar.txt](./polar.txt) - API 레퍼런스 요약
