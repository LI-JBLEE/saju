import { defaultLocale, type AppLocale } from "@/lib/i18n";
import { calculateSaju } from "@/lib/saju/calculator";
import { buildReportContent, buildReportSections } from "@/lib/report-builder";
import type { BirthInput, SajuData } from "@/lib/saju/types";
import type { ReportSectionData, StoredReport } from "@/types";

const reportStore = new Map<string, StoredReport>();

interface MemoryReportDraft {
  input: BirthInput;
  sajuData: SajuData;
  sections: ReportSectionData[];
  content: string;
}

export function createMemoryReportFromDraft(draft: MemoryReportDraft) {
  const id = crypto.randomUUID();

  const report: StoredReport = {
    id,
    createdAt: new Date().toISOString(),
    input: draft.input,
    sajuData: draft.sajuData,
    sections: draft.sections,
    content: draft.content,
    storage: "memory",
  };

  reportStore.set(id, report);

  return report;
}

export function createMemoryReport(input: BirthInput, locale: AppLocale = defaultLocale) {
  const sajuData = calculateSaju(input);
  const sections = buildReportSections(input, sajuData, locale);

  return createMemoryReportFromDraft({
    input,
    sajuData,
    sections,
    content: buildReportContent(sections),
  });
}

export function findMemoryReport(id: string) {
  return reportStore.get(id) ?? null;
}
