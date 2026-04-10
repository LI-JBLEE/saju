# Repository Harness

이 문서는 사주 저장소의 repository-level harness 범위를 정의합니다.

## 목적

- 문서 기반 저장소를 실행 가능한 계약으로 바꾼다.
- 앱 코드가 아직 없더라도 구조/정책/문서 정합성을 자동 검증한다.
- 이후 application-level harness 로 확장할 수 있는 기반을 만든다.

## 현재 검증 범위

- AGENTS.md 가 요구하는 필수 문서 존재 여부
- `docs/exec-plans/active`, `docs/exec-plans/completed` 구조
- Git 저장소 초기화 여부
- `.gitignore` 의 `node_modules/`, `.env.local` 보호 설정
- 중괄호/쉼표가 섞인 비정상 디렉터리 이름 탐지
- 리포트 생성/공유 흐름 계약 정합성
- 아키텍처 문서와 DB 스키마 문서 간 저장 계약 정합성
- 영구 제품 결정사항과 보안 가이드의 반복 고정 여부

## 실행 방법

```bash
npm install
npm run repo:harness
```

JSON 출력이 필요하면 아래 스크립트를 사용합니다.

```bash
npm run repo:harness:json
```

## 다음 단계

- application-level harness 추가
- 사주 계산 골든 테스트
- 프롬프트/리포트 7섹션 계약 테스트
- API 스트리밍/저장 통합 테스트
- 공유 URL 조회 E2E 테스트
