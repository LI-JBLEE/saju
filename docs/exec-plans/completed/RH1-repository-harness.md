# RH1 — Repository Harness

## 목표

문서 중심 저장소에 repository-level harness 를 도입해,
제품 계약과 저장소 운영 규칙을 자동 검증 가능한 상태로 만든다.

## 구현 범위

- TypeScript 기반 harness 실행 환경 추가
- 필수 문서 및 디렉터리 구조 검사
- `.gitignore` 보안 규칙 검사
- 문서 간 핵심 계약 정합성 검사
- 비정상 디렉터리 이름 감지

## 산출물

- `package.json`
- `tsconfig.json`
- `.gitignore`
- `tools/repository-harness/*`
- `docs/repository-harness.md`

## 후속 제안

- application-level harness 를 `src/` 구현과 함께 추가
- CI 환경이 생기면 `npm run verify` 를 기본 검증 단계로 연결
