import path from "node:path";
import { loadDocs, rules } from "./rules.js";
import type { HarnessSummary } from "./types.js";

function buildSummary(rootDir: string): HarnessSummary {
  const docs = loadDocs(rootDir);
  const checks = rules.map((rule) => rule({ rootDir, docs }));

  return {
    checks,
    passCount: checks.filter((check) => check.status === "pass").length,
    warnCount: checks.filter((check) => check.status === "warn").length,
    failCount: checks.filter((check) => check.status === "fail").length,
  };
}

function printText(summary: HarnessSummary): void {
  console.log("Repository Harness");
  console.log("==================");

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
const summary = buildSummary(rootDir);

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(summary, null, 2));
} else {
  printText(summary);
}

process.exitCode = summary.failCount > 0 ? 1 : 0;
