import { cache } from "react";
import { generateClaudeReport } from "@/lib/claude";
import { createMemoryReportFromDraft, findMemoryReport } from "@/lib/mock-report-store";
import {
  buildReportContent,
  buildReportSections,
  parseReportContent,
} from "@/lib/report-builder";
import { calculateSaju } from "@/lib/saju/calculator";
import type { BirthInput } from "@/lib/saju/types";
import { createSupabaseAdminClient, isSupabaseConfigured } from "@/lib/supabase";
import type { ReportInsert, ReportRow, StoredReport } from "@/types";

async function createReportDraft(input: BirthInput) {
  const sajuData = calculateSaju(input);
  let claudeSections = null;

  try {
    claudeSections = await generateClaudeReport(input, sajuData);
  } catch (error) {
    console.error(
      `[WARN] ${new Date().toISOString()} | report-store:createReportDraft | Claude generation failed, falling back to local report builder.`,
      error,
    );
  }

  const sections = claudeSections ?? buildReportSections(input, sajuData);

  return {
    input,
    sajuData,
    sections,
    content: buildReportContent(sections),
  };
}

function createReportInsert(draft: Awaited<ReturnType<typeof createReportDraft>>): ReportInsert {

  return {
    birth_year: draft.input.birthYear,
    birth_month: draft.input.birthMonth,
    birth_day: draft.input.birthDay,
    birth_hour: draft.input.birthHour,
    gender: draft.input.gender,
    saju_data: draft.sajuData,
    content: draft.content,
  };
}

function mapReportRow(row: ReportRow): StoredReport {
  return {
    id: row.id,
    createdAt: row.created_at,
    input: {
      birthYear: row.birth_year,
      birthMonth: row.birth_month,
      birthDay: row.birth_day,
      birthHour: row.birth_hour,
      gender: row.gender,
    },
    sajuData: row.saju_data,
    sections: parseReportContent(row.content),
    content: row.content,
    storage: "supabase",
  };
}

export async function createReport(input: BirthInput) {
  const draft = await createReportDraft(input);

  if (!isSupabaseConfigured()) {
    return createMemoryReportFromDraft(draft);
  }

  const client = createSupabaseAdminClient();
  const { data, error } = await client
    .from("reports")
    .insert(createReportInsert(draft))
    .select(
      "id, birth_year, birth_month, birth_day, birth_hour, gender, saju_data, content, created_at",
    )
    .single();

  if (error) {
    throw new Error(`Failed to save report: ${error.message}`);
  }

  return mapReportRow(data);
}

async function findSupabaseReport(id: string) {
  const client = createSupabaseAdminClient();
  const { data, error } = await client
    .from("reports")
    .select(
      "id, birth_year, birth_month, birth_day, birth_hour, gender, saju_data, content, created_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load report: ${error.message}`);
  }

  return data ? mapReportRow(data) : null;
}

export const findReport = cache(async (id: string) => {
  if (isSupabaseConfigured()) {
    const storedReport = await findSupabaseReport(id);

    if (storedReport) {
      return storedReport;
    }
  }

  return findMemoryReport(id);
});
