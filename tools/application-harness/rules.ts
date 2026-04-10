import {
  APP_DOC_PATHS,
  disallowedPredictionPhrases,
  failureScenarioContracts,
  privateEnvKeys,
  publicEnvAllowList,
  reportSectionTitles,
  requiredAppFiles,
  requiredFrameworkPackages,
} from "./contracts.js";
import {
  createReportFixture,
  invalidBirthInputs,
  invalidSharePaths,
  sajuDataWithHour,
  sajuDataWithoutHour,
  validBirthInputs,
  validSharePaths,
} from "./fixtures.js";
import type {
  CheckResult,
  ReportFixture,
  Rule,
  SajuDataFixture,
} from "./types.js";
import {
  collectWorkspaceFiles,
  pathExists,
  readPackageJson,
  readUtf8,
  validateBirthInput,
} from "./utils.js";

function buildResult(result: CheckResult): CheckResult {
  return result;
}

function validateSajuDataShape(
  sajuData: SajuDataFixture,
  expectsHour: boolean,
): string[] {
  const issues: string[] = [];
  const pillarKeys = Object.keys(sajuData.pillars);
  const requiredPillars = ["year", "month", "day"];
  const requiredOhaengKeys = ["목", "화", "토", "금", "수"];

  for (const pillar of requiredPillars) {
    if (!(pillar in sajuData.pillars)) {
      issues.push(`missing pillar: ${pillar}`);
    }
  }

  if (expectsHour && !("hour" in sajuData.pillars)) {
    issues.push("hour pillar should exist when birthHour is present");
  }

  if (!expectsHour && "hour" in sajuData.pillars) {
    issues.push("hour pillar must be omitted when birthHour is null");
  }

  for (const key of requiredOhaengKeys) {
    if (!(key in sajuData.ohaengRatio)) {
      issues.push(`missing ohaeng key: ${key}`);
      continue;
    }

    if (typeof sajuData.ohaengRatio[key] !== "number") {
      issues.push(`ohaeng ratio is not numeric: ${key}`);
    }
  }

  if (!sajuData.ilgan || !sajuData.yongsin || !sajuData.gisin) {
    issues.push("ilgan/yongsin/gisin must all be present");
  }

  if (expectsHour && pillarKeys.length !== 4) {
    issues.push(`expected 4 pillars, found ${pillarKeys.length}`);
  }

  if (!expectsHour && pillarKeys.length !== 3) {
    issues.push(`expected 3 pillars, found ${pillarKeys.length}`);
  }

  return issues;
}

function validateReportFixture(
  report: ReportFixture,
  currentYear: number,
): string[] {
  const issues: string[] = [];

  if (report.sections.length !== reportSectionTitles.length) {
    issues.push(
      `expected ${reportSectionTitles.length} sections, found ${report.sections.length}`,
    );
  }

  reportSectionTitles.forEach((title, index) => {
    const section = report.sections[index];

    if (!section) {
      issues.push(`missing section at index ${index}: ${title}`);
      return;
    }

    if (section.title !== title) {
      issues.push(`section title mismatch at ${index}: ${section.title}`);
    }

    if (section.body.trim().length < 200) {
      issues.push(`section body too short: ${title}`);
    }
  });

  const yearlySection = report.sections.find(
    (section) => section.title === "올해 운세",
  );

  if (!yearlySection?.body.includes(String(currentYear))) {
    issues.push(`yearly report must mention ${currentYear}`);
  }

  if (!report.disclaimer.includes("AI가 생성한 참고용 콘텐츠")) {
    issues.push("missing disclaimer");
  }

  for (const phrase of disallowedPredictionPhrases) {
    if (report.sections.some((section) => section.body.includes(phrase))) {
      issues.push(`disallowed deterministic phrase found: ${phrase}`);
    }
  }

  return issues;
}

function validateFriendlyMessage(message: string): string[] {
  const issues: string[] = [];
  const technicalLeakPatterns = [
    /error/i,
    /exception/i,
    /stack/i,
    /sql/i,
    /anthropic/i,
    /supabase/i,
    /trace/i,
  ];

  if (!/[가-힣]/.test(message)) {
    issues.push("message must be localized in Korean");
  }

  for (const pattern of technicalLeakPatterns) {
    if (pattern.test(message)) {
      issues.push(`message leaks technical wording: ${pattern}`);
    }
  }

  return issues;
}

export const inputValidationRule: Rule = ({ currentYear, docs }) => {
  const security = docs["SECURITY.md"];
  const productSpec = docs["docs/product-specs/index.md"];
  const issues: string[] = [];

  if (!security.includes("birth_year")) {
    issues.push("SECURITY.md is missing birth_year validation guidance");
  }
  if (!security.includes("birth_hour")) {
    issues.push("SECURITY.md is missing birth_hour validation guidance");
  }
  if (
    !productSpec.includes("모름 선택 가능") &&
    !productSpec.includes("시간 모름")
  ) {
    issues.push("product spec is missing the unknown-hour option");
  }

  const validResults = validBirthInputs.map((input) =>
    validateBirthInput(input, currentYear),
  );
  const invalidResults = invalidBirthInputs.map(({ input }) =>
    validateBirthInput(input, currentYear),
  );

  if (validResults.some((result) => !result)) {
    issues.push("one or more valid birth input fixtures were rejected");
  }
  if (invalidResults.some((result) => result)) {
    issues.push("one or more invalid birth input fixtures were accepted");
  }

  return buildResult({
    id: "input-validation",
    title: "Input Validation Contract",
    status: issues.length === 0 ? "pass" : "fail",
    summary:
      issues.length === 0
        ? "입력 검증 규칙과 샘플 픽스처가 제품/보안 문서와 일치합니다."
        : "입력 검증 계약이 문서 또는 픽스처와 어긋납니다.",
    details:
      issues.length === 0
        ? [
            `accepted valid fixtures: ${validBirthInputs.length}`,
            `rejected invalid fixtures: ${invalidBirthInputs.length}`,
          ]
        : issues,
    fixHint:
      issues.length === 0
        ? undefined
        : "생년월일시 검증 규칙을 SECURITY.md 와 product spec 기준으로 다시 맞추세요.",
  });
};

export const sajuDataRule: Rule = ({ docs }) => {
  const dbSchema = docs["docs/generated/db-schema.md"];
  const issues: string[] = [];

  if (!/hour.+birth_hour.+null.+생략/u.test(dbSchema)) {
    issues.push("db schema is missing the nullable hour omission contract");
  }

  issues.push(...validateSajuDataShape(sajuDataWithHour, true));
  issues.push(...validateSajuDataShape(sajuDataWithoutHour, false));

  return buildResult({
    id: "saju-data-shape",
    title: "Saju Data Contract",
    status: issues.length === 0 ? "pass" : "fail",
    summary:
      issues.length === 0
        ? "사주 데이터 구조 픽스처가 DB 스키마 계약을 만족합니다."
        : "사주 데이터 구조가 DB 스키마 계약과 맞지 않습니다.",
    details:
      issues.length === 0
        ? [
            "fixture with hour pillar validated",
            "fixture without hour pillar validated",
          ]
        : issues,
    fixHint:
      issues.length === 0
        ? undefined
        : "saju_data JSON 구조와 null hour 처리 규칙을 docs/generated/db-schema.md 와 맞추세요.",
  });
};

export const reportQualityRule: Rule = ({ currentYear, docs }) => {
  const productSpec = docs["docs/product-specs/index.md"];
  const quality = docs["QUALITY_SCORE.md"];
  const productSense = docs["PRODUCT_SENSE.md"];
  const maleReport = createReportFixture(currentYear, "male");
  const femaleReport = createReportFixture(currentYear, "female");
  const issues: string[] = [];

  if (!quality.includes("각 섹션이 최소 200자 이상")) {
    issues.push("quality score is missing the 200-character minimum");
  }
  if (!quality.includes("현재 연도가 정확히 반영")) {
    issues.push("quality score is missing the current-year requirement");
  }
  if (!productSense.includes("본 리포트는 AI가 생성한 참고용 콘텐츠입니다")) {
    issues.push("product sense is missing the disclaimer contract");
  }
  if (!productSpec.includes("섹션 7")) {
    issues.push("product spec no longer defines all seven report sections");
  }

  issues.push(...validateReportFixture(maleReport, currentYear));
  issues.push(...validateReportFixture(femaleReport, currentYear));

  const maleRomance = maleReport.sections[3]?.body ?? "";
  const femaleRomance = femaleReport.sections[3]?.body ?? "";

  if (maleRomance === femaleRomance) {
    issues.push("male and female romance sections must differ");
  }

  return buildResult({
    id: "report-quality",
    title: "Report Quality Contract",
    status: issues.length === 0 ? "pass" : "fail",
    summary:
      issues.length === 0
        ? "리포트 섹션 구조, 길이, 연도, 면책 문구 계약이 실행 가능한 픽스처로 고정되었습니다."
        : "리포트 품질 계약이 문서 또는 픽스처와 어긋납니다.",
    details:
      issues.length === 0
        ? [
            `validated report fixtures for year ${currentYear}`,
            "gender-specific romance section divergence confirmed",
          ]
        : issues,
    fixHint:
      issues.length === 0
        ? undefined
        : "리포트 섹션 구성, 길이, 올해 운세, 면책 문구 요구사항을 다시 정렬하세요.",
  });
};

export const failureHandlingRule: Rule = ({ docs }) => {
  const reliability = docs["RELIABILITY.md"];
  const productSense = docs["PRODUCT_SENSE.md"];
  const issues: string[] = [];
  const documentedScenarioCount = [...reliability.matchAll(/^### \[[A-Z]+\]/gm)].length;

  if (documentedScenarioCount !== failureScenarioContracts.length) {
    issues.push(
      `expected ${failureScenarioContracts.length} documented failure scenarios, found ${documentedScenarioCount}`,
    );
  }

  if (!productSense.includes("기술적 에러 메시지를 절대 그대로 노출하지 않는다")) {
    issues.push("product sense is missing the friendly error message rule");
  }

  const anthropicScenario = failureScenarioContracts.find(
    (scenario) => scenario.id === "anthropic-timeout",
  );

  if (!anthropicScenario || anthropicScenario.retryCount !== 2) {
    issues.push("anthropic timeout scenario must retry exactly 2 times");
  }

  for (const scenario of failureScenarioContracts) {
    issues.push(
      ...validateFriendlyMessage(scenario.userMessage).map(
        (issue) => `${scenario.id}: ${issue}`,
      ),
    );
  }

  return buildResult({
    id: "failure-handling",
    title: "Failure Handling Contract",
    status: issues.length === 0 ? "pass" : "fail",
    summary:
      issues.length === 0
        ? "장애 시나리오와 사용자 메시지 계약이 안정성 문서와 일치합니다."
        : "장애 시나리오 계약이 안정성 문서 또는 메시지 원칙과 어긋납니다.",
    details:
      issues.length === 0
        ? [
            `documented scenarios: ${failureScenarioContracts.length}`,
            "friendly user messaging validated",
          ]
        : issues,
    fixHint:
      issues.length === 0
        ? undefined
        : "RELIABILITY.md 와 PRODUCT_SENSE.md 기준으로 재시도/메시지/부분 저장 정책을 다시 맞추세요.",
  });
};

export const sharingPersistenceRule: Rule = ({ docs }) => {
  const architecture = docs["ARCHITECTURE.md"];
  const beliefs = docs["docs/design-docs/core-beliefs.md"];
  const productSpec = docs["docs/product-specs/index.md"];
  const issues: string[] = [];
  const sharePathPattern =
    /^\/report\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!architecture.includes("리포트는 고유 URL로 공유 가능")) {
    issues.push("architecture is missing the permanent share URL contract");
  }
  if (!beliefs.includes("리포트는 영구 보존된다")) {
    issues.push("core beliefs is missing the permanent report retention rule");
  }
  if (!productSpec.includes("/report/[uuid]")) {
    issues.push("product spec is missing the UUID sharing path");
  }

  if (validSharePaths.some((path) => !sharePathPattern.test(path))) {
    issues.push("one or more valid share paths failed UUID validation");
  }
  if (invalidSharePaths.some((path) => sharePathPattern.test(path))) {
    issues.push("one or more invalid share paths passed UUID validation");
  }

  return buildResult({
    id: "sharing-persistence",
    title: "Sharing And Persistence Contract",
    status: issues.length === 0 ? "pass" : "fail",
    summary:
      issues.length === 0
        ? "공유 URL, 영구 보존, 신규 리포트 생성 정책이 애플리케이션 계약으로 고정되었습니다."
        : "공유/보존 계약이 문서 또는 픽스처와 어긋납니다.",
    details:
      issues.length === 0
        ? [
            `validated share paths: ${validSharePaths.length}`,
            "invalid share path rejection confirmed",
          ]
        : issues,
    fixHint:
      issues.length === 0
        ? undefined
        : "공유 URL 형식, 영구 보존, 재생성 금지 계약을 다시 정렬하세요.",
  });
};

export const securityBoundaryRule: Rule = ({ rootDir, docs }) => {
  const architecture = docs["ARCHITECTURE.md"];
  const security = docs["SECURITY.md"];
  const files = collectWorkspaceFiles(rootDir);
  const issues: string[] = [];
  const secretPatterns = [/sk-ant-[A-Za-z0-9_-]+/g, /\beyJ[A-Za-z0-9._-]{20,}\b/g];
  const disallowedPublicEnvKeys = privateEnvKeys.map(
    (key) => `NEXT_PUBLIC_${key}`,
  );

  for (const key of publicEnvAllowList) {
    if (!architecture.includes(key)) {
      issues.push(`architecture is missing allowed public env key: ${key}`);
    }
  }

  for (const key of privateEnvKeys) {
    if (!security.includes(key)) {
      issues.push(`security doc is missing private env key guidance: ${key}`);
    }
  }

  for (const relativePath of files) {
    const content = readUtf8(rootDir, relativePath);

    for (const pattern of secretPatterns) {
      if (pattern.test(content)) {
        issues.push(`possible secret material found in ${relativePath}`);
        pattern.lastIndex = 0;
      }
    }

    for (const envKey of disallowedPublicEnvKeys) {
      if (content.includes(envKey)) {
        issues.push(`disallowed public secret env key found in ${relativePath}: ${envKey}`);
      }
    }
  }

  return buildResult({
    id: "security-boundary",
    title: "Security Boundary Contract",
    status: issues.length === 0 ? "pass" : "fail",
    summary:
      issues.length === 0
        ? "시크릿 노출 금지와 공개 환경 변수 경계가 현재 저장소에서 지켜지고 있습니다."
        : "시크릿 경계 위반 가능성이 감지되었습니다.",
    details:
      issues.length === 0
        ? [
            `allowed public env keys: ${publicEnvAllowList.join(", ")}`,
            "no hardcoded secret patterns found",
          ]
        : issues,
    fixHint:
      issues.length === 0
        ? undefined
        : "NEXT_PUBLIC_ 경계와 하드코딩 시크릿 여부를 즉시 정리하세요.",
  });
};

export const implementationReadinessRule: Rule = ({ rootDir, packageJson }) => {
  const missingFiles = requiredAppFiles.filter((file) => !pathExists(rootDir, file));
  const dependencies = {
    ...packageJson?.dependencies,
    ...packageJson?.devDependencies,
  };
  const missingPackages = requiredFrameworkPackages.filter(
    (pkg) => !(pkg in (dependencies ?? {})),
  );
  const issues: string[] = [];

  if (missingFiles.length > 0) {
    issues.push(`missing implementation files: ${missingFiles.length}`);
  }
  if (missingPackages.length > 0) {
    issues.push(`missing framework packages: ${missingPackages.join(", ")}`);
  }

  return buildResult({
    id: "implementation-readiness",
    title: "Implementation Readiness",
    status: issues.length === 0 ? "pass" : "warn",
    summary:
      issues.length === 0
        ? "현재 애플리케이션 구현이 harness가 기대하는 기본 골격을 갖추고 있습니다."
        : "애플리케이션 구현은 아직 시작 전 단계이며, harness가 추적할 최소 골격이 비어 있습니다.",
    details:
      issues.length === 0
        ? [
            `required files present: ${requiredAppFiles.length}`,
            `required packages present: ${requiredFrameworkPackages.length}`,
          ]
        : issues,
    fixHint:
      issues.length === 0
        ? undefined
        : "다음 단계에서 Next.js 앱 스캐폴드와 핵심 컴포넌트/라우트를 추가하면 이 경고가 줄어듭니다.",
  });
};

export const rules: Rule[] = [
  inputValidationRule,
  sajuDataRule,
  reportQualityRule,
  failureHandlingRule,
  sharingPersistenceRule,
  securityBoundaryRule,
  implementationReadinessRule,
];

export function loadDocs(rootDir: string): Record<string, string> {
  const docs: Record<string, string> = {};

  for (const docPath of APP_DOC_PATHS) {
    if (pathExists(rootDir, docPath)) {
      docs[docPath] = readUtf8(rootDir, docPath);
    }
  }

  return docs;
}

export function loadPackageJson(rootDir: string) {
  return readPackageJson(rootDir);
}
