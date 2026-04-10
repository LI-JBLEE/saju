import type { BirthInput, SajuData } from "@/lib/saju/types";

export interface ReportSectionData {
  title: string;
  icon: string;
  content: string;
}

export type ReportStorage = "memory" | "supabase";

export interface StoredReport {
  id: string;
  createdAt: string;
  input: BirthInput;
  sajuData: SajuData;
  sections: ReportSectionData[];
  content: string;
  storage: ReportStorage;
}

export interface GenerateReportRequest extends BirthInput {}

export interface GenerateReportResponse {
  ok: boolean;
  reportId?: string;
  error?: string;
}

export interface ReportRow {
  id: string;
  birth_year: number;
  birth_month: number;
  birth_day: number;
  birth_hour: number | null;
  gender: BirthInput["gender"];
  saju_data: SajuData;
  content: string;
  created_at: string;
}

export interface ReportInsert {
  birth_year: number;
  birth_month: number;
  birth_day: number;
  birth_hour: number | null;
  gender: BirthInput["gender"];
  saju_data: SajuData;
  content: string;
}

export interface Database {
  public: {
    Tables: {
      reports: {
        Row: ReportRow;
        Insert: ReportInsert;
        Update: Partial<ReportInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
