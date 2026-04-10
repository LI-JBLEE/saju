# PLANS.md
사주 리포트 웹앱 — 개발 마일스톤 & 작업 계획

---

## GUIDING PRINCIPLE

에이전트는 마일스톤 순서를 반드시 지켜야 한다.
이전 마일스톤이 완료되기 전까지 다음 단계로 넘어가지 않는다.
각 마일스톤 완료 후 동작 확인을 먼저 하고 다음 단계를 시작한다.

---

## MILESTONES

### M1 — 프로젝트 초기 세팅

- [ ] Next.js 14 프로젝트 생성 (App Router, TypeScript)
- [ ] Tailwind CSS 설정, Noto Serif KR / Noto Sans KR 폰트 적용
- [ ] Supabase 프로젝트 생성 및 `reports` 테이블 마이그레이션
- [ ] 환경 변수 `.env.local` 구성
- [ ] Vercel 연결 및 첫 배포 확인

**완료 기준**: `npm run dev` 정상 실행, Vercel 배포 URL 접속 가능

---

### M2 — 사주 계산 엔진 구현

- [ ] `src/lib/saju/calculator.ts` — 생년월일시 → 천간·지지 변환 로직
- [ ] 년주·월주·일주·시주 계산
- [ ] 오행 비율 계산 (목·화·토·금·수)
- [ ] 용신·기신 판별 로직
- [ ] 단위 테스트 작성 (유명인 사주 3개 이상으로 검증)

**완료 기준**: 테스트 케이스 통과, 계산 결과가 알려진 사주와 일치

---

### M3 — 입력 폼 UI 구현

- [ ] 메인 페이지 레이아웃 (Deep Night 배경, 중앙 카드)
- [ ] `BirthInputForm` 컴포넌트 — 연/월/일/시간/성별 입력
- [ ] 유효성 검사 (미래 날짜 방지, 필수값 체크)
- [ ] "시간 모름" 옵션 처리
- [ ] 모바일 반응형 확인

**완료 기준**: 모바일/데스크탑에서 입력 폼 정상 동작, 제출 시 콘솔에 값 출력

---

### M4 — Claude API 연동 & 리포트 생성

- [ ] `src/app/api/report/generate/route.ts` API 라우트 구현
- [ ] 사주 데이터 → Claude 프롬프트 변환 로직
- [ ] 7개 섹션 구조화 프롬프트 작성
- [ ] 스트리밍 응답 처리
- [ ] 생성 결과 Supabase `reports` 테이블에 저장
- [ ] 로딩 페이지 + `LoadingTips` 컴포넌트

**완료 기준**: 입력 → API 호출 → 리포트 텍스트 스트리밍 출력 → DB 저장 완료

---

### M5 — 리포트 페이지 & 공유 기능

- [ ] `/report/[id]` 페이지 구현
- [ ] `SajuChart` — 년·월·일·시주 시각화
- [ ] `OhaengBar` — 오행 비율 바 차트
- [ ] `ReportSection` — 섹션별 렌더링
- [ ] `ShareButton` — URL 클립보드 복사
- [ ] 공유 URL 접속 시 저장된 리포트 조회 확인
- [ ] 최종 모바일/데스크탑 전체 플로우 테스트

**완료 기준**: 전체 플로우 (입력 → 생성 → 공유 → 공유 URL 접속) 정상 동작

---

## EXEC PLAN FILES

각 마일스톤 실행 시 `docs/exec-plans/active/` 에 상세 실행 계획 파일을 생성하고,
완료 후 `docs/exec-plans/completed/` 로 이동한다.

> ※ 아래는 형식 예시임. 프로젝트 시작 시 active/ 와 completed/ 폴더는 모두 비어 있음.

```
docs/exec-plans/
├── active/
│   └── (예시) M4-claude-api-integration.md   ← 진행 중인 작업
└── completed/
    └── (예시) M1-project-setup.md             ← 완료된 작업
```
