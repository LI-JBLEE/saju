# ARCHITECTURE.md
사주 리포트 웹앱 — 시스템 아키텍처 문서

---

## SYSTEM OVERVIEW

사용자가 생년월일시를 입력하면 사주를 계산하고, Claude API를 통해 AI 분석 리포트를 생성하여 화면에 표시하는 웹앱.

- 단일 Next.js 프로젝트 안에 프론트엔드와 백엔드 통합
- Supabase를 통해 리포트 저장 (인증 없음)
- Vercel에 배포, 환경 변수로 시크릿 관리

---

## REQUEST FLOW

```
[사용자]
  │  생년월일시 입력
  ▼
[Next.js Frontend]  ← React 컴포넌트 (src/app/)
  │  POST /api/report/generate
  ▼
[API Route]         ← src/app/api/report/generate/route.ts
  │  1) 사주 계산 (천간·지지·오행)
  │  2) 프롬프트 구성
  ▼
[Claude API]        ← Anthropic SDK
  │  스트리밍 응답 시작
  ▼
[API Route]
  │  3) 스트리밍 청크를 프론트로 실시간 전달 (동시에 전체 텍스트 누적)
  ▼
[Next.js Frontend]
  │  리포트 실시간 스트리밍 표시 (사용자가 즉시 읽기 시작)
  ▼
[API Route]
  │  4) 스트리밍 완료 후 누적된 전체 텍스트를 Supabase에 저장
  │  5) 저장 완료 시 공유 URL 활성화 신호 전달
  ▼
[Next.js Frontend]
  │  공유 버튼 활성화
  ▼
[사용자]
```

---

## DIRECTORY STRUCTURE

```
src/
├── app/
│   ├── page.tsx              ← 메인 입력 페이지
│   ├── report/[id]/
│   │   └── page.tsx          ← 리포트 결과 페이지
│   └── api/
│       └── report/
│           └── generate/
│               └── route.ts  ← 핵심 API
├── components/
│   ├── BirthInputForm.tsx    ← 생년월일시 입력 폼
│   ├── ReportViewer.tsx      ← 리포트 전체 컨테이너 (ReportSection들을 감싸는 래퍼)
│   ├── ReportSection.tsx     ← 개별 섹션 카드 (제목 + 아이콘 + 본문)
│   ├── SajuChart.tsx         ← 사주 시각화
│   ├── OhaengBar.tsx         ← 오행 비율 차트
│   ├── ShareButton.tsx       ← 공유 버튼
│   ├── LoadingTips.tsx       ← 로딩 팁
│   └── ui/                   ← 공통 UI 컴포넌트
├── lib/
│   ├── saju/
│   │   ├── calculator.ts     ← 사주 계산 로직
│   │   └── types.ts          ← 사주 관련 타입 정의
│   ├── claude.ts             ← Claude API 클라이언트
│   └── supabase.ts           ← Supabase 클라이언트
└── types/
    └── index.ts              ← 전역 타입 정의
```

---

## DATABASE SCHEMA (Supabase / PostgreSQL)

```
reports
  ├── id          UUID PK     (gen_random_uuid())
  ├── birth_year  INTEGER     NOT NULL
  ├── birth_month INTEGER     NOT NULL
  ├── birth_day   INTEGER     NOT NULL
  ├── birth_hour  INTEGER     NULLABLE (null = 시주 제외 분석)
  ├── gender      TEXT        NOT NULL ('male' | 'female')
  ├── saju_data   JSONB       NOT NULL (천간·지지·오행 계산 결과)
  ├── content     TEXT        NOT NULL (AI 생성 리포트 전문)
  └── created_at  TIMESTAMPTZ DEFAULT now()
```

자세한 스키마는 `docs/generated/db-schema.md` 참조.

---

## KEY ENVIRONMENT VARIABLES

```
ANTHROPIC_API_KEY=             ← Claude API 키 (서버 사이드 전용)
NEXT_PUBLIC_SUPABASE_URL=      ← Supabase 프로젝트 URL
NEXT_PUBLIC_SUPABASE_ANON_KEY= ← Supabase anon 키
SUPABASE_SERVICE_ROLE_KEY=     ← 서버 사이드 전용, 절대 클라이언트 노출 금지
```

---

## CONSTRAINTS & DECISIONS

- 로그인/회원가입 기능 없음 — 영구 미도입 결정 (`docs/design-docs/core-beliefs.md` 참조)
- 사주 계산 로직은 TypeScript를 중심으로 유지하되, 절기/간지 정확도 확보를 위해 검증된 천문·역법 라이브러리를 제한적으로 사용할 수 있음
- Claude API 응답은 스트리밍으로 처리하여 UX 개선
- 리포트는 고유 URL로 공유 가능 (`/report/[id]`)
- 한 번 생성된 리포트는 삭제되지 않음 (RLS DELETE 정책 비활성화)
- 사주 계산 결과(saju_data)는 JSONB로 저장하여 추후 재활용 가능
