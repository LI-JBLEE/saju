# AH1 — Application Harness

## 목표

사주 앱의 핵심 동작 계약을 실행 가능한 픽스처와 검증 규칙으로 정의한다.

## 구현 범위

- 입력 검증 픽스처와 판별기
- `saju_data` 구조 검증
- 리포트 섹션/연도/면책 문구 계약 검증
- 장애 시나리오와 사용자 메시지 계약 검증
- 공유 URL 및 영구 보존 정책 검증
- 시크릿 경계 검사
- 구현 준비도 경고 체계

## 산출물

- `tools/application-harness/*`
- `docs/application-harness.md`
- `package.json` 스크립트 확장

## 후속 제안

- 구현이 시작되면 이 harness 를 실제 Next.js 코드와 테스트 러너에 연결
- `Implementation Readiness` 경고 항목을 단계적으로 실제 통과 항목으로 전환
