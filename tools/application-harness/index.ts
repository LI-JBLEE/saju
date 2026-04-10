import path from "node:path";
import { loadDocs, loadPackageJson, rules } from "./rules.js";
import type { HarnessSummary } from "./types.js";

function buildSummary(rootDir: string, currentYear: number): HarnessSummary {
  const docs = loadDocs(rootDir);
  const packageJson = loadPackageJson(rootDir);
  const checks = rules.map((rule) =>
    rule({
      rootDir,
      currentYear,
      docs,
      packageJson,
    }),
  );

  return {
    checks,
    passCount: checks.filter((check) => check.status === "pass").length,
    warnCount: checks.filter((check) => check.status === "warn").length,
    failCount: checks.filter((check) => check.status === "fail").length,
  };
}

function printText(summary: HarnessSummary, currentYear: number): void {
  console.log("Application Harness");
  console.log("===================");
  console.log(`Reference year: ${currentYear}`);

  for (const check of summary.checks) {
    console.log(`${check.status.toUpperCase()} ${check.title}`);
    console.log(`  ${check.summary}`);

    for (const detail of check.details) {
      console.log(`  - ${detail}`);
    }

    if (check.fixHint) {
      console.log(`  fix: ${check.fixHint}`);
    }
  }

  console.log("");
  console.log(
    `Summary: ${summary.passCount} passed, ${summary.warnCount} warnings, ${summary.failCount} failed`,
  );
}

const rootDir = path.resolve(process.cwd());
const currentYear = new Date().getFullYear();
const summary = buildSummary(rootDir, currentYear);

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(summary, null, 2));
} else {
  printText(summary, currentYear);
}

process.exitCode = summary.failCount > 0 ? 1 : 0;
