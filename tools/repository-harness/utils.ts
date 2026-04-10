import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

export function toAbsolute(rootDir: string, relativePath: string): string {
  return path.join(rootDir, relativePath);
}

export function pathExists(rootDir: string, relativePath: string): boolean {
  return existsSync(toAbsolute(rootDir, relativePath));
}

export function readUtf8(rootDir: string, relativePath: string): string {
  return readFileSync(toAbsolute(rootDir, relativePath), "utf8");
}

export function extractArchitectureColumns(content: string): string[] {
  const schemaBlockMatch = content.match(
    /## DATABASE SCHEMA[\s\S]*?```([\s\S]*?)```/m,
  );
  const schemaBlock = schemaBlockMatch?.[1] ?? content;

  return [...schemaBlock.matchAll(/^[ \t]*[├└]──[ \t]+([a-z_]+)/gm)].map(
    (match) => match[1],
  );
}

export function extractSchemaColumns(content: string): string[] {
  const tableSectionMatch = content.match(
    /## TABLE: reports[\s\S]*?((?:\|.*\n)+)(?:\n## |\n---|$)/m,
  );
  const tableSection = tableSectionMatch?.[1] ?? content;

  return [...tableSection.matchAll(/^\|\s*`([a-z_]+)`\s*\|/gm)].map(
    (match) => match[1],
  );
}

export function countProductSections(content: string): number {
  return [...content.matchAll(/^###\s+섹션\s+\d+/gm)].length;
}

export function collectSuspiciousDirectories(
  rootDir: string,
  startDir = rootDir,
): string[] {
  const results: string[] = [];
  const entries = readdirSync(startDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    if (entry.name === "node_modules" || entry.name === ".git") {
      continue;
    }

    const fullPath = path.join(startDir, entry.name);
    const relativePath = path.relative(rootDir, fullPath) || ".";

    if (/[{},]/.test(entry.name)) {
      results.push(relativePath);
    }

    results.push(...collectSuspiciousDirectories(rootDir, fullPath));
  }

  return results;
}
