import type { StoredReport } from "@/types";
import { OhaengBar } from "./OhaengBar";
import { ReportSection } from "./ReportSection";
import { SajuChart } from "./SajuChart";

interface ReportViewerProps {
  report: StoredReport;
}

export function ReportViewer({ report }: ReportViewerProps) {
  return (
    <div className="space-y-10">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <SajuChart sajuData={report.sajuData} />
        <OhaengBar sajuData={report.sajuData} />
      </div>
      <div className="space-y-6">
        {report.sections.map((section) => (
          <ReportSection
            content={section.content}
            icon={section.icon}
            key={section.title}
            title={section.title}
          />
        ))}
      </div>
    </div>
  );
}
