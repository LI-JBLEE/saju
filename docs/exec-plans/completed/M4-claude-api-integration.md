# M4 — Claude API Integration

## 목표

사주 계산 결과를 실제 Claude API 호출 경로에 연결하되,
`ANTHROPIC_API_KEY`가 없는 로컬 개발 환경에서는 기존 로컬 생성기로 안전하게 폴백한다.

## 구현 범위

- Anthropic 공식 TypeScript SDK 추가
- 사주 입력값과 계산 결과를 바탕으로 한 한국어 리포트 프롬프트 구성
- 7개 섹션 JSON 응답 강제 및 응답 파싱/검증
- Claude 호출 최대 2회 재시도 로직 추가
- `report-store`에서 Claude 생성 결과를 Supabase 저장 또는 메모리 저장으로 연결
- API 에러 로그에 입력 요약 포함

## 산출물

- `src/lib/claude.ts`
- `src/lib/report-store.ts`
- `src/lib/mock-report-store.ts`
- `src/app/api/report/generate/route.ts`
- `package.json`

## 주의 사항

- `ANTHROPIC_API_KEY`가 없으면 실제 API 호출은 수행하지 않고 기존 로컬 생성기로 폴백한다.
- 따라서 현재 단계에서는 코드 경로와 타입/빌드는 검증 가능하지만, 실제 Claude 응답 품질 검증은 키가 준비된 뒤에만 가능하다.
- 스트리밍 응답 UX는 아직 연결되지 않았고, 현재는 생성 완료 후 저장/이동 흐름을 유지한다.

## 검증 포인트

- 키가 없는 환경에서도 `typecheck`, `verify`, `build`가 모두 통과하는지 확인
- 키가 있는 환경에서는 Claude 응답이 7개 섹션 JSON 형식으로 파싱되는지 확인
- 실패 시 최대 2회 재시도 후 친화적 오류 메시지로 복귀하는지 확인
