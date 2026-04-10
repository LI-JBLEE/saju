import { calculateSaju } from "@/lib/saju/calculator";
import { buildReportContent, buildReportSections } from "@/lib/report-builder";
import type { BirthInput } from "@/lib/saju/types";
import type { StoredReport } from "@/types";

const reportStore = new Map<string, StoredReport>();

export function createMemoryReport(input: BirthInput) {
  const sajuData = calculateSaju(input);
  const sections = buildReportSections(input, sajuData);
  const id = crypto.randomUUID();
  const content = buildReportContent(sections);

  const report: StoredReport = {
    id,
    createdAt: new Date().toISOString(),
    input,
    sajuData,
    sections,
    content,
    storage: "memory",
  };

  reportStore.set(id, report);

  return report;
}

export function findMemoryReport(id: string) {
  return reportStore.get(id) ?? null;
}
