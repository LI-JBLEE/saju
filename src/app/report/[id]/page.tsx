import Link from "next/link";
import { ReportViewer } from "@/components/ReportViewer";
import { ShareButton } from "@/components/ShareButton";
import { findMemoryReport } from "@/lib/mock-report-store";

interface ReportPageProps {
  params: {
    id: string;
  };
}

export default function ReportPage({ params }: ReportPageProps) {
  const report = findMemoryReport(params.id);

  if (!report) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-16 sm:px-6">
        <section className="w-full rounded-[32px] border border-gold/18 bg-midnight/88 p-8 gold-outline sm:p-10">
          <p className="text-xs uppercase tracking-[0.4em] text-silverSand">Report Missing</p>
          <h1 className="mt-4 font-display text-3xl text-parchment sm:text-4xl">
            리포트를 찾을 수 없습니다
          </h1>
          <p className="mt-4 text-[15px] leading-8 text-parchment/80">
            새로고침이나 서버 재시작 이후에는 개발용 임시 리포트가 사라질 수 있습니다. 다시
            입력해서 새로운 리포트를 만들어 보세요.
          </p>
          <Link
            className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-gradient-to-r from-gold to-[#a0845a] px-5 py-3 text-sm font-medium text-deepNight transition hover:brightness-110"
            href="/"
          >
            메인으로 돌아가기
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8 flex flex-col gap-4 rounded-[30px] border border-gold/16 bg-midnight/82 p-6 gold-outline sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-silverSand">Saved Report</p>
          <h1 className="mt-3 font-display text-3xl text-parchment sm:text-4xl">사주 리포트</h1>
          <p className="mt-3 text-sm leading-7 text-silverSand">
            {report.input.birthYear}년 {report.input.birthMonth}월 {report.input.birthDay}일
            {report.input.birthHour === null ? " · 시간 모름" : ` · ${report.input.birthHour}시`} ·{" "}
            {report.input.gender === "female" ? "여" : "남"}
          </p>
          <p className="mt-1 text-xs leading-6 text-silverSand">
            현재는 메모리 기반 개발용 저장소를 사용하고 있습니다.
          </p>
        </div>
        <ShareButton />
      </header>

      <ReportViewer report={report} />
    </main>
  );
}
