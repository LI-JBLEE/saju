import { NextResponse } from "next/server";
import { defaultLocale, isAppLocale, type AppLocale } from "@/lib/i18n";
import { createReport } from "@/lib/report-store";
import type { BirthInput } from "@/lib/saju/types";
import { validateBirthInput } from "@/lib/validation";
import type { GenerateReportResponse } from "@/types";

function resolveLocale(value: unknown): AppLocale {
  return isAppLocale(String(value ?? "")) ? (String(value) as AppLocale) : defaultLocale;
}

export async function POST(request: Request) {
  let inputSummary: Pick<
    BirthInput,
    "birthYear" | "birthMonth" | "birthDay" | "birthHour" | "gender"
  > | null = null;
  let locale: AppLocale = defaultLocale;

  try {
    const body = await request.json();
    const validation = validateBirthInput(body);
    locale = resolveLocale((body as { locale?: unknown })?.locale);

    if (!validation.ok) {
      return NextResponse.json<GenerateReportResponse>(
        {
          ok: false,
          error: validation.error,
        },
        { status: 400 },
      );
    }

    inputSummary = validation.data;
    const report = await createReport(validation.data, locale);

    return NextResponse.json<GenerateReportResponse>({
      ok: true,
      reportId: report.id,
    });
  } catch (error) {
    console.error(
      `[ERROR] ${new Date().toISOString()} | route: /api/report/generate | input:`,
      inputSummary,
      "| locale:",
      locale,
      "| error:",
      error,
    );

    return NextResponse.json<GenerateReportResponse>(
      {
        ok: false,
        error: "사주를 읽는 중 문제가 생겼습니다. 다시 시도해 주세요.",
      },
      { status: 500 },
    );
  }
}
