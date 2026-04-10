# M2 — 사주 계산 엔진 구현

## 목표

생년월일시 입력을 절기 기준 사주 데이터로 변환하는 계산 엔진을
실제 제품 요구사항에 맞게 정확도 중심으로 고도화한다.

## 구현 범위

- `lunar-javascript` 기반 년주·월주·일주·시주 계산
- 시주 미입력 시 정오 기준 중립 계산 후 시주 결과 제외
- 천간/지지 오행 집계와 용신·기신 판별
- 입춘 경계와 문서화된 고정 케이스를 포함한 골든 테스트 4종
- `npm run verify`에 사주 계산 테스트 연결

## 산출물

- `src/lib/saju/calculator.ts`
- `src/lib/saju/constants.ts`
- `src/lib/saju/calculator.test.ts`
- `package.json`
- `ARCHITECTURE.md`

## 검증 포인트

- 절기 경계에서 년주와 월주가 기대값으로 전환되는지 확인
- 일주가 경계 전후에도 안정적으로 유지되는지 확인
- 시주 미입력 시 `pillars.hour`가 응답에서 제거되는지 확인
- `npm run test:saju`, `npm run verify`, `npm run build` 통과

## 후속 제안

- 골든 테스트 케이스를 실사용 예시와 공개 검증 사례로 더 확장
- Supabase 저장 시 `saju_data` 스키마 버전 필드 도입 검토
- Claude 프롬프트에 시주 미입력 여부를 명시적으로 전달
