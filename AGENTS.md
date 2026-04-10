# AGENTS.md
사주 리포트 웹앱 — 에이전트 행동 지침서

---

## OVERVIEW

이 프로젝트는 사용자의 생년월일시를 입력받아 AI 기반 사주 분석 리포트를 생성하는 웹앱입니다.
에이전트는 코드를 작성하기 전에 반드시 이 파일을 먼저 읽고 지침을 준수해야 합니다.

---

## TECH STACK

- **Frontend / Backend**: Next.js 14 (App Router) + Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **AI**: Anthropic Claude API (claude-sonnet-4)
- **Language**: TypeScript
- **Deployment**: Vercel
- **Package manager**: npm

---

## BEFORE YOU CODE

작업 시작 전 반드시 다음 문서를 순서대로 읽을 것:

1. `ARCHITECTURE.md` — 시스템 전체 구조
2. `docs/product-specs/index.md` — 제품 요구사항
3. `docs/design-docs/core-beliefs.md` — 핵심 설계 철학
4. `docs/generated/db-schema.md` — 데이터베이스 스키마
5. `FRONTEND.md` — UI/UX 가이드라인

---

## CODING CONVENTIONS

- 모든 컴포넌트는 `src/components/` 하위에 위치
- API 라우트는 `src/app/api/` 하위에 위치
- 환경 변수는 반드시 `.env.local` 에서만 관리, 코드에 하드코딩 금지
- 함수/변수명은 camelCase, 컴포넌트명은 PascalCase
- 모든 API 응답에 에러 핸들링 포함 필수
- UI 텍스트는 한국어 기본

---

## PROHIBITED ACTIONS

- Supabase 스키마 변경 시 반드시 `docs/generated/db-schema.md` 동기화
- `node_modules`, `.env.local` 파일 절대 커밋 금지
- Claude API 키를 코드에 직접 삽입 금지
- 미완성 기능을 main 브랜치에 직접 푸시 금지
- 기존 API 인터페이스 변경 시 사전 승인 필요

---

## TASK COMPLETION CRITERIA

- 구현한 기능이 `docs/product-specs/`의 요구사항을 충족할 것
- TypeScript 컴파일 에러 없을 것
- 모바일/데스크탑 레이아웃 모두 확인할 것
- 새 DB 테이블/컬럼 추가 시 `db-schema.md` 업데이트할 것

---

## ASKING FOR CLARIFICATION

다음 상황에서는 코드 작성 전 반드시 확인을 요청할 것:

- 요구사항이 모호하거나 상충될 때
- 기존 아키텍처를 크게 변경해야 할 때
- 외부 서비스 추가 연동이 필요할 때
