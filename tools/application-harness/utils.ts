import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import type { BirthInputFixture, PackageJsonShape } from "./types.js";

export function toAbsolute(rootDir: string, relativePath: string): string {
  return path.join(rootDir, relativePath);
}

export function pathExists(rootDir: string, relativePath: string): boolean {
  return existsSync(toAbsolute(rootDir, relativePath));
}

export function readUtf8(rootDir: string, relativePath: string): string {
  return readFileSync(toAbsolute(rootDir, relativePath), "utf8");
}

export function readPackageJson(rootDir: string): PackageJsonShape | null {
  if (!pathExists(rootDir, "package.json")) {
    return null;
  }

  const raw = readUtf8(rootDir, "package.json");
  return JSON.parse(raw) as PackageJsonShape;
}

export function validateBirthInput(
  input: BirthInputFixture,
  currentYear: number,
): boolean {
  const isIntegerFields =
    Number.isInteger(input.birthYear) &&
    Number.isInteger(input.birthMonth) &&
    Number.isInteger(input.birthDay) &&
    (input.birthHour === null || Number.isInteger(input.birthHour));

  if (!isIntegerFields) {
    return false;
  }

  if (input.birthYear < 1900 || input.birthYear > currentYear) {
    return false;
  }

  if (input.birthMonth < 1 || input.birthMonth > 12) {
    return false;
  }

  if (input.birthHour !== null && (input.birthHour < 0 || input.birthHour > 23)) {
    return false;
  }

  if (input.gender !== "male" && input.gender !== "female") {
    return false;
  }

  const date = new Date(Date.UTC(input.birthYear, input.birthMonth - 1, input.birthDay));

  return (
    date.getUTCFullYear() === input.birthYear &&
    date.getUTCMonth() === input.birthMonth - 1 &&
    date.getUTCDate() === input.birthDay
  );
}

export function collectWorkspaceFiles(
  rootDir: string,
  startDir = rootDir,
): string[] {
  const entries = readdirSync(startDir, { withFileTypes: true });
  const results: string[] = [];

  for (const entry of entries) {
    if (entry.name === ".git" || entry.name === "node_modules") {
      continue;
    }

    const fullPath = path.join(startDir, entry.name);

    if (entry.isDirectory()) {
      results.push(...collectWorkspaceFiles(rootDir, fullPath));
      continue;
    }

    results.push(path.relative(rootDir, fullPath));
  }

  return results;
}
