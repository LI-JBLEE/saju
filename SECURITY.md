# SECURITY.md
사주 리포트 웹앱 — 보안 가이드라인

---

## SECRETS MANAGEMENT ⚠️ 최우선

### API 키는 반드시 서버 사이드에서만 사용
`ANTHROPIC_API_KEY`와 `SUPABASE_SERVICE_ROLE_KEY`는 절대 클라이언트(브라우저)에 노출되어선 안 된다.
Next.js의 `NEXT_PUBLIC_` 접두사를 붙이지 말 것.

### .env.local 은 절대 커밋하지 않는다
`.gitignore`에 `.env.local`이 포함되어 있는지 반드시 확인한다.
Vercel 환경 변수 설정을 통해 프로덕션 키를 주입한다.

### 코드에 키 하드코딩 절대 금지
리뷰 중 `sk-ant-`, `eyJ` 등 키 패턴이 발견되면 즉시 작업을 중단하고 알린다.

---

## INPUT VALIDATION

API 라우트에서 입력값 검증 필수. 클라이언트 검증만으로는 부족하다.
`/api/report/generate` 에서 반드시 서버 사이드 검증을 수행한다.

```
검증 항목:
  birth_year   → 정수, 1900 이상 현재 연도 이하
  birth_month  → 정수, 1~12
  birth_day    → 정수, 1~31 (월별 유효 일수 체크)
  birth_hour   → 정수 또는 null, 0~23
  gender       → "male" 또는 "female" 만 허용
```

---

## RATE LIMITING

Claude API는 호출당 비용이 발생한다.
동일 IP에서 단시간 대량 요청을 방지하기 위해 rate limiter 미들웨어를 적용한다.

```
제한 기준 (초기값):
  동일 IP 기준 분당 최대 5회 요청
  초과 시 429 Too Many Requests 반환
  Vercel Edge Config 또는 Upstash Redis로 구현
```

---

## SUPABASE RLS

Row Level Security 반드시 활성화.
INSERT / SELECT 정책만 허용, UPDATE / DELETE 정책은 절대 추가하지 않는다.
자세한 내용은 `docs/generated/db-schema.md` 참조.

---

## PROMPT INJECTION 방지

사용자 입력을 프롬프트에 직접 삽입 금지.
생년월일시·성별은 숫자/열거형 값만 허용되므로 현재는 위험도가 낮다.
추후 텍스트 입력 필드가 추가될 경우 반드시 이스케이프 처리 후 프롬프트에 포함해야 한다.

---

## SECURITY CHECKLIST (배포 전)

- [ ] `.env.local` 이 `.gitignore` 에 포함되어 있는가
- [ ] Vercel 환경 변수에 모든 키가 설정되어 있는가
- [ ] 클라이언트 번들에 `ANTHROPIC_API_KEY` 가 노출되지 않는가
- [ ] API 라우트에 입력값 검증 로직이 있는가
- [ ] Rate limiting 미들웨어가 적용되어 있는가
- [ ] Supabase RLS 가 활성화되어 있는가
