import type { FailureScenarioContract } from "./types.js";

export const APP_DOC_PATHS = [
  "ARCHITECTURE.md",
  "FRONTEND.md",
  "PRODUCT_SENSE.md",
  "QUALITY_SCORE.md",
  "RELIABILITY.md",
  "SECURITY.md",
  "docs/product-specs/index.md",
  "docs/design-docs/core-beliefs.md",
  "docs/generated/db-schema.md",
] as const;

export const reportSectionTitles = [
  "사주 기본 정보",
  "타고난 성격 & 기질",
  "직업 & 재물운",
  "연애 & 결혼운",
  "건강운",
  "올해 운세",
  "종합 조언",
] as const;

export const disclaimerText = "본 리포트는 AI가 생성한 참고용 콘텐츠입니다";

export const disallowedPredictionPhrases = ["반드시", "운명"] as const;

export const requiredAppFiles = [
  "src/app/page.tsx",
  "src/app/report/[id]/page.tsx",
  "src/app/api/report/generate/route.ts",
  "src/components/BirthInputForm.tsx",
  "src/components/ReportViewer.tsx",
  "src/components/ReportSection.tsx",
  "src/components/SajuChart.tsx",
  "src/components/OhaengBar.tsx",
  "src/components/ShareButton.tsx",
  "src/components/LoadingTips.tsx",
  "src/lib/saju/calculator.ts",
  "src/lib/saju/types.ts",
  "src/lib/claude.ts",
  "src/lib/supabase.ts",
  "src/types/index.ts",
] as const;

export const requiredFrameworkPackages = [
  "next",
  "react",
  "react-dom",
  "tailwindcss",
] as const;

export const publicEnvAllowList = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

export const privateEnvKeys = [
  "ANTHROPIC_API_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
] as const;

export const failureScenarioContracts: FailureScenarioContract[] = [
  {
    id: "anthropic-timeout",
    retryCount: 2,
    userMessage: "잠시 후 다시 시도해 주세요.",
    shareEnabled: false,
    persistsPartialReport: false,
  },
  {
    id: "supabase-save-failure",
    retryCount: 0,
    userMessage: "사주를 읽는 중 문제가 생겼습니다. 다시 시도해 주세요.",
    shareEnabled: false,
    persistsPartialReport: false,
  },
  {
    id: "stream-interrupted",
    retryCount: 0,
    userMessage: "생성이 중단됐습니다. 다시 시도해 주세요.",
    shareEnabled: false,
    persistsPartialReport: false,
  },
  {
    id: "shared-report-not-found",
    retryCount: 0,
    userMessage: "리포트를 찾을 수 없습니다. 새로 조회하시겠어요?",
    shareEnabled: false,
    persistsPartialReport: false,
  },
  {
    id: "rate-limit",
    retryCount: 0,
    userMessage: "잠시 후 다시 시도해 주세요 (1분 후)",
    shareEnabled: false,
    persistsPartialReport: false,
  },
] as const;
