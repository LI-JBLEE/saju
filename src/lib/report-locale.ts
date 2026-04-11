import { defaultLocale, type AppLocale } from "@/lib/i18n";
import type { ReportSectionData } from "@/types";

const hangulPattern = /[가-힣]/;

export function inferReportContentLocale(
  sections: Pick<ReportSectionData, "content">[],
): AppLocale {
  const content = sections.map((section) => section.content).join(" ");

  if (!content.trim()) {
    return defaultLocale;
  }

  return hangulPattern.test(content) ? "ko" : "en";
}
