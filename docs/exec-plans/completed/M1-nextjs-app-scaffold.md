# M1 — Next.js App Scaffold

## 목표

문서 기반 저장소에 실제 Next.js 14 App Router 애플리케이션 골격을 추가해
application harness 의 구현 준비도 경고를 해소한다.

## 구현 범위

- Next.js 14 / React 18 / Tailwind CSS 3 의존성 추가
- `src/app`, `src/components`, `src/lib`, `src/types` 구조 생성
- 메인 입력 페이지와 리포트 페이지 기본 UI 구현
- `/api/report/generate` API 라우트 및 서버 사이드 입력 검증 추가
- 메모리 기반 임시 리포트 저장소 추가
- `npm run build`, `npm run verify` 통과

## 주의 사항

- 현재 리포트 저장은 Supabase 대신 메모리 기반 임시 저장소를 사용한다.
- Claude API 연동은 아직 미구현이며, mock 리포트 생성기로 대체되어 있다.
- Google font fetch 는 네트워크 상태에 따라 재시도 로그가 남을 수 있다.

## 다음 단계

- Supabase 저장 계층 연결
- Claude API 스트리밍 생성 연결
- 사주 계산 로직을 실제 절기 기준 계산으로 고도화
- 공유 URL 영속성과 E2E 테스트 보강
