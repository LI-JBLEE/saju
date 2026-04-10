import { NextResponse } from "next/server";
import { createReport } from "@/lib/report-store";
import { validateBirthInput } from "@/lib/validation";
import type { GenerateReportResponse } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateBirthInput(body);

    if (!validation.ok) {
      return NextResponse.json<GenerateReportResponse>(
        {
          ok: false,
          error: validation.error,
        },
        { status: 400 },
      );
    }

    const report = await createReport(validation.data);

    return NextResponse.json<GenerateReportResponse>({
      ok: true,
      reportId: report.id,
    });
  } catch (error) {
    console.error(
      `[ERROR] ${new Date().toISOString()} | route: /api/report/generate | error:`,
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
