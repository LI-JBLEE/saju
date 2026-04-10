import type { BirthInput, SajuData } from "@/lib/saju/types";

export interface ReportSectionData {
  title: string;
  icon: string;
  content: string;
}

export interface StoredReport {
  id: string;
  createdAt: string;
  input: BirthInput;
  sajuData: SajuData;
  sections: ReportSectionData[];
  content: string;
  storage: "memory";
}

export interface GenerateReportRequest extends BirthInput {}

export interface GenerateReportResponse {
  ok: boolean;
  reportId?: string;
  error?: string;
}
