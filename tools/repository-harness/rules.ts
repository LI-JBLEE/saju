import {
  DOC_PATHS,
  REQUIRED_DIRECTORIES,
  REQUIRED_FILES,
  REQUIRED_GITIGNORE_ENTRIES,
} from "./config.js";
import type { CheckResult, Rule } from "./types.js";
import {
  collectSuspiciousDirectories,
  countProductSections,
  extractArchitectureColumns,
  extractSchemaColumns,
  pathExists,
  readUtf8,
} from "./utils.js";

function buildResult(result: CheckResult): CheckResult {
  return result;
}

export const requiredFilesRule: Rule = ({ rootDir }) => {
  const missing = REQUIRED_FILES.filter((file) => !pathExists(rootDir, file));
  const status = missing.length === 0 ? "pass" : "fail";

  return buildResult({
    id: "required-files",
    title: "Required Files",
    status,
    summary:
      missing.length === 0
        ? "핵심 제품/설계 문서가 모두 존재합니다."
        : "필수 문서가 누락되었습니다.",
    details:
      missing.length === 0 ? [...REQUIRED_FILES] : missing.map((file) => `missing: ${file}`),
    fixHint:
      missing.length === 0
        ? undefined
        : "AGENTS.md 에서 요구한 필수 문서 집합을 먼저 복구하세요.",
  });
};

export const requiredDirectoriesRule: Rule = ({ rootDir }) => {
  const missing = REQUIRED_DIRECTORIES.filter(
    (directory) => !pathExists(rootDir, directory),
  );

  return buildResult({
    id: "required-directories",
    title: "Required Directories",
    status: missing.length === 0 ? "pass" : "fail",
    summary:
      missing.length === 0
        ? "문서 운영에 필요한 디렉터리 구조가 준비되어 있습니다."
        : "문서 운영용 디렉터리 구조가 비어 있거나 누락되었습니다.",
    details:
      missing.length === 0
        ? [...REQUIRED_DIRECTORIES]
        : missing.map((directory) => `missing: ${directory}`),
    fixHint:
      missing.length === 0
        ? undefined
        : "docs/exec-plans/active 와 completed 를 포함한 기본 구조를 생성하세요.",
  });
};

export const gitRepositoryRule: Rule = ({ rootDir }) => {
  const hasGitDirectory = pathExists(rootDir, ".git");

  return buildResult({
    id: "git-repository",
    title: "Git Repository",
    status: hasGitDirectory ? "pass" : "warn",
    summary: hasGitDirectory
      ? "Git 저장소 메타데이터가 존재합니다."
      : "이 폴더는 아직 Git 저장소로 초기화되지 않았습니다.",
    details: hasGitDirectory
      ? ["Repository metadata detected at .git/"]
      : ["missing: .git"],
    fixHint: hasGitDirectory
      ? undefined
      : "브랜치 정책, CI, PR 기반 하네스를 쓰려면 먼저 Git 저장소를 초기화하세요.",
  });
};

export const gitIgnoreRule: Rule = ({ rootDir }) => {
  if (!pathExists(rootDir, ".gitignore")) {
    return buildResult({
      id: "gitignore",
      title: "Git Ignore Hygiene",
      status: "fail",
      summary: ".gitignore 파일이 없습니다.",
      details: ["missing: .gitignore"],
      fixHint: "최소한 node_modules/ 와 .env.local 을 무시 목록에 포함하세요.",
    });
  }

  const gitignore = readUtf8(rootDir, ".gitignore");
  const missingEntries = REQUIRED_GITIGNORE_ENTRIES.filter(
    (entry) => !gitignore.includes(entry),
  );

  return buildResult({
    id: "gitignore",
    title: "Git Ignore Hygiene",
    status: missingEntries.length === 0 ? "pass" : "fail",
    summary:
      missingEntries.length === 0
        ? "비밀값과 의존성 폴더를 무시하도록 설정되어 있습니다."
        : "무시 목록에 꼭 필요한 항목이 빠져 있습니다.",
    details:
      missingEntries.length === 0
        ? [...REQUIRED_GITIGNORE_ENTRIES]
        : missingEntries.map((entry) => `missing: ${entry}`),
    fixHint:
      missingEntries.length === 0
        ? undefined
        : "SECURITY.md 의 시크릿 관리 원칙에 맞게 .gitignore 를 보완하세요.",
  });
};

export const suspiciousDirectoriesRule: Rule = ({ rootDir }) => {
  const suspicious = collectSuspiciousDirectories(rootDir);

  return buildResult({
    id: "suspicious-directories",
    title: "Suspicious Directories",
    status: suspicious.length === 0 ? "pass" : "warn",
    summary:
      suspicious.length === 0
        ? "비정상적인 디렉터리 이름이 감지되지 않았습니다."
        : "중괄호/쉼표가 포함된 비정상 디렉터리 이름이 감지되었습니다.",
    details:
      suspicious.length === 0
        ? ["No suspicious directory names found."]
        : suspicious.map((directory) => `suspicious: ${directory}`),
    fixHint:
      suspicious.length === 0
        ? undefined
        : "잘못 생성된 디렉터리인지 확인하고, 의도된 구조가 아니라면 정리하세요.",
  });
};

export const reportContractRule: Rule = ({ docs }) => {
  const productSpec = docs["docs/product-specs/index.md"];
  const architecture = docs["ARCHITECTURE.md"];
  const sectionCount = countProductSections(productSpec);
  const issues: string[] = [];

  if (sectionCount !== 7) {
    issues.push(`expected 7 report sections, found ${sectionCount}`);
  }
  if (!architecture.includes("/api/report/generate")) {
    issues.push("ARCHITECTURE.md is missing /api/report/generate request flow");
  }
  if (!architecture.includes("/report/[id]")) {
    issues.push("ARCHITECTURE.md is missing /report/[id] route definition");
  }
  if (!productSpec.includes("/report/[uuid]")) {
    issues.push("product spec is missing the shared /report/[uuid] contract");
  }

  return buildResult({
    id: "report-contract",
    title: "Report Flow Contract",
    status: issues.length === 0 ? "pass" : "fail",
    summary:
      issues.length === 0
        ? "리포트 생성/공유 흐름 계약이 문서 전반에서 일관됩니다."
        : "리포트 생성/공유 흐름 계약에 누락이 있습니다.",
    details: issues.length === 0 ? ["7 report sections confirmed."] : issues,
    fixHint:
      issues.length === 0
        ? undefined
        : "제품 스펙과 아키텍처 문서의 핵심 흐름을 동일한 계약으로 맞추세요.",
  });
};

export const databaseContractRule: Rule = ({ docs }) => {
  const architecture = docs["ARCHITECTURE.md"];
  const dbSchema = docs["docs/generated/db-schema.md"];
  const architectureColumns = extractArchitectureColumns(architecture);
  const schemaColumns = extractSchemaColumns(dbSchema);
  const missingColumns = architectureColumns.filter(
    (column) => !schemaColumns.includes(column),
  );
  const issues: string[] = [];

  if (!dbSchema.includes("TABLE: reports")) {
    issues.push("generated schema is missing TABLE: reports");
  }
  if (!dbSchema.includes("UPDATE / DELETE")) {
    issues.push("generated schema is missing UPDATE / DELETE policy guidance");
  }
  if (missingColumns.length > 0) {
    issues.push(`schema mismatch for columns: ${missingColumns.join(", ")}`);
  }

  return buildResult({
    id: "database-contract",
    title: "Database Contract",
    status: issues.length === 0 ? "pass" : "fail",
    summary:
      issues.length === 0
        ? "아키텍처 문서와 DB 스키마 문서가 같은 저장 계약을 설명합니다."
        : "DB 저장 계약이 문서 간에 어긋납니다.",
    details:
      issues.length === 0
        ? [`columns: ${schemaColumns.join(", ")}`]
        : issues,
    fixHint:
      issues.length === 0
        ? undefined
        : "ARCHITECTURE.md 와 docs/generated/db-schema.md 를 같은 컬럼/정책 계약으로 동기화하세요.",
  });
};

export const permanentDecisionsRule: Rule = ({ docs }) => {
  const beliefs = docs["docs/design-docs/core-beliefs.md"];
  const architecture = docs["ARCHITECTURE.md"];
  const security = docs["SECURITY.md"];
  const issues: string[] = [];

  if (!beliefs.includes("로그인 / 회원가입 기능")) {
    issues.push("core beliefs is missing the no-auth permanent decision");
  }
  if (!architecture.includes("로그인/회원가입 기능 없음")) {
    issues.push("architecture is missing the no-auth architecture constraint");
  }
  if (!beliefs.includes("리포트 재생성")) {
    issues.push("core beliefs is missing the no-regeneration rule");
  }
  if (!security.includes("Rate limiting")) {
    issues.push("security guide is missing rate limiting guidance");
  }

  return buildResult({
    id: "permanent-decisions",
    title: "Permanent Product Decisions",
    status: issues.length === 0 ? "pass" : "fail",
    summary:
      issues.length === 0
        ? "변하지 않는 제품 원칙이 핵심 문서들에 반복적으로 고정되어 있습니다."
        : "변하지 않아야 할 제품 원칙이 일부 문서에서 약합니다.",
    details:
      issues.length === 0
        ? [
            "No auth.",
            "No regeneration on the same URL.",
            "Rate limiting guidance present.",
          ]
        : issues,
    fixHint:
      issues.length === 0
        ? undefined
        : "core beliefs, architecture, security 문서가 같은 영구 결정사항을 공유하도록 보강하세요.",
  });
};

export const executionPlanRule: Rule = ({ docs, rootDir }) => {
  const plans = docs["PLANS.md"];
  const issues: string[] = [];

  if (!plans.includes("docs/exec-plans/active/")) {
    issues.push("PLANS.md is missing the active exec-plan path");
  }
  if (!plans.includes("docs/exec-plans/completed/")) {
    issues.push("PLANS.md is missing the completed exec-plan path");
  }
  if (!pathExists(rootDir, "docs/exec-plans/tech-debt-tracker.md")) {
    issues.push("tech debt tracker is missing");
  }

  return buildResult({
    id: "execution-plans",
    title: "Execution Plan Workflow",
    status: issues.length === 0 ? "pass" : "fail",
    summary:
      issues.length === 0
        ? "실행 계획과 기술 부채 관리 문서가 준비되어 있습니다."
        : "실행 계획 운영 규칙이 실제 구조와 맞지 않습니다.",
    details:
      issues.length === 0
        ? ["Exec-plan workflow confirmed."]
        : issues,
    fixHint:
      issues.length === 0
        ? undefined
        : "PLANS.md 에 적은 운영 규칙을 실제 디렉터리와 파일 구조에 맞게 정렬하세요.",
  });
};

export const rules: Rule[] = [
  requiredFilesRule,
  requiredDirectoriesRule,
  gitRepositoryRule,
  gitIgnoreRule,
  suspiciousDirectoriesRule,
  reportContractRule,
  databaseContractRule,
  permanentDecisionsRule,
  executionPlanRule,
];

export function loadDocs(rootDir: string): Record<string, string> {
  const docs: Record<string, string> = {};

  for (const docPath of DOC_PATHS) {
    if (pathExists(rootDir, docPath)) {
      docs[docPath] = readUtf8(rootDir, docPath);
    }
  }

  return docs;
}
