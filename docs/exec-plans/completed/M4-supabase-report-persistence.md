# M4 — Supabase Report Persistence

## 목표

개발용 메모리 저장소를 유지한 채, 환경 변수가 준비된 환경에서는
리포트를 Supabase `reports` 테이블에 영구 저장하고 `/report/[id]`에서 다시 조회할 수 있게 만든다.

## 구현 범위

- Supabase 서버 전용 클라이언트 추가
- `report-store` 추상화로 저장/조회 경로 일원화
- 리포트 섹션 직렬화 및 DB 조회 후 복원 로직 추가
- `/api/report/generate`를 비동기 저장 경로로 전환
- `/report/[id]`를 서버 사이드 비동기 조회로 전환
- 저장소 유형에 따라 리포트 헤더 상태 문구 분기

## 산출물

- `src/lib/supabase.ts`
- `src/lib/report-store.ts`
- `src/lib/report-builder.ts`
- `src/app/api/report/generate/route.ts`
- `src/app/report/[id]/page.tsx`
- `src/types/index.ts`
- `docs/generated/db-schema.md`

## 주의 사항

- `.env.local`이 비어 있으면 개발 편의를 위해 메모리 저장소로 자동 폴백한다.
- 실제 영속 저장은 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY`가 모두 설정된 환경에서만 동작한다.
- 현재 단계에서는 Claude 스트리밍 저장이 아니라 동기 생성 결과 저장만 연결되어 있다.

## 검증 포인트

- 타입 체크, harness, 프로덕션 빌드가 모두 통과하는지 확인
- 환경 변수가 없는 로컬 환경에서도 기존 개발 흐름이 깨지지 않는지 확인
- Supabase 환경에서 저장 후 `/report/[uuid]` 조회 경로가 유지되는지 확인
