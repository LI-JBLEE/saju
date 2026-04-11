"use client";

import { localizeSectionTitle } from "@/lib/i18n";
import { buildReportSections } from "@/lib/report-builder";
import { inferReportContentLocale } from "@/lib/report-locale";
import type { StoredReport } from "@/types";
import { OhaengBar } from "./OhaengBar";
import { ReportSection } from "./ReportSection";
import { SajuChart } from "./SajuChart";
import { useLocale } from "./LocaleProvider";

interface ReportViewerProps {
  report: StoredReport;
}

export function ReportViewer({ report }: ReportViewerProps) {
  const { locale } = useLocale();
  const storedLocale = inferReportContentLocale(report.sections);
  const sections =
    report.sections.length === 0 || storedLocale !== locale
      ? buildReportSections(report.input, report.sajuData, locale)
      : report.sections;

  return (
    <div className="space-y-10">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <SajuChart locale={locale} sajuData={report.sajuData} />
        <OhaengBar locale={locale} sajuData={report.sajuData} />
      </div>
      <div className="space-y-6">
        {sections.map((section) => (
          <ReportSection
            content={section.content}
            icon={section.icon}
            key={section.title}
            title={localizeSectionTitle(section.title, locale)}
          />
        ))}
      </div>
    </div>
  );
}
