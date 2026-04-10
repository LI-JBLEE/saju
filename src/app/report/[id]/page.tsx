import { ReportPageContent } from "@/components/ReportPageContent";
import { findReport } from "@/lib/report-store";

interface ReportPageProps {
  params: {
    id: string;
  };
}

export default async function ReportPage({ params }: ReportPageProps) {
  let report = null;
  let hasLoadError = false;

  try {
    report = await findReport(params.id);
  } catch (error) {
    hasLoadError = true;
    console.error(
      `[ERROR] ${new Date().toISOString()} | route: /report/${params.id} | error:`,
      error,
    );
  }

  return <ReportPageContent hasLoadError={hasLoadError} report={report} />;
}
