export type CheckStatus = "pass" | "warn" | "fail";

export interface CheckResult {
  id: string;
  title: string;
  status: CheckStatus;
  summary: string;
  details: string[];
  fixHint?: string;
}

export interface RuleContext {
  rootDir: string;
  docs: Record<string, string>;
}

export interface HarnessSummary {
  checks: CheckResult[];
  passCount: number;
  warnCount: number;
  failCount: number;
}

export type Rule = (context: RuleContext) => CheckResult;
