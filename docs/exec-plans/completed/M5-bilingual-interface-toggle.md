# M5 — Bilingual Interface Toggle

## 목표

영어를 기본 인터페이스로 두고, 사용자가 한국어/영어 UI를 직접 전환할 수 있게 만든다.

## 구현 범위

- 전역 locale provider 및 localStorage 기반 언어 유지
- 홈/리포트 페이지에 언어 토글 버튼 추가
- 입력 폼, 로딩 상태, 공유 버튼, 리포트 페이지 메시지 로컬라이즈
- 사주 차트와 오행 카드의 라벨 로컬라이즈
- 제품 문서에 영어 기본 인터페이스 정책 반영

## 산출물

- `src/lib/i18n.ts`
- `src/components/LocaleProvider.tsx`
- `src/components/LanguageToggle.tsx`
- `src/components/HomePageContent.tsx`
- `src/components/ReportPageContent.tsx`
- 기존 UI 컴포넌트들의 locale 연동

## 주의 사항

- 인터페이스 기본값은 영어지만, 기존 생성 리포트의 본문 언어는 생성 시점 로직을 따른다.
- 사용자 locale 선택은 브라우저 localStorage에 저장된다.
- 서버 검증 메시지는 클라이언트에서 locale에 맞게 매핑해 표시한다.

## 검증 포인트

- 첫 진입 시 영어 UI가 보이는지 확인
- 토글 후 홈/리포트 페이지의 UI 텍스트가 즉시 바뀌는지 확인
- `npm run verify`, `npm run build` 통과
