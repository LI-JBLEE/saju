export type CheckStatus = "pass" | "warn" | "fail";

export interface CheckResult {
  id: string;
  title: string;
  status: CheckStatus;
  summary: string;
  details: string[];
  fixHint?: string;
}

export interface HarnessSummary {
  checks: CheckResult[];
  passCount: number;
  warnCount: number;
  failCount: number;
}

export interface RuleContext {
  rootDir: string;
  currentYear: number;
  docs: Record<string, string>;
  packageJson: PackageJsonShape | null;
}

export interface PackageJsonShape {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export type Rule = (context: RuleContext) => CheckResult;

export interface BirthInputFixture {
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number | null;
  gender: "male" | "female" | string;
}

export interface ReportSectionFixture {
  title: string;
  body: string;
}

export interface ReportFixture {
  gender: "male" | "female";
  disclaimer: string;
  sections: ReportSectionFixture[];
}

export interface SajuPillarFixture {
  cheongan: string;
  jiji: string;
  ohaeng: string;
}

export interface SajuDataFixture {
  pillars: {
    year: SajuPillarFixture;
    month: SajuPillarFixture;
    day: SajuPillarFixture;
    hour?: SajuPillarFixture;
  };
  ohaengRatio: Record<string, number>;
  ilgan: string;
  yongsin: string;
  gisin: string;
}

export interface FailureScenarioContract {
  id: string;
  retryCount: number;
  userMessage: string;
  shareEnabled: boolean;
  persistsPartialReport: boolean;
}
