"use client";

import Link from "next/link";
import { uiCopy, localizeGenderLabel } from "@/lib/i18n";
import type { StoredReport } from "@/types";
import { LanguageToggle } from "./LanguageToggle";
import { ReportViewer } from "./ReportViewer";
import { ShareButton } from "./ShareButton";
import { useLocale } from "./LocaleProvider";

interface ReportPageContentProps {
  report: StoredReport | null;
  hasLoadError: boolean;
}

export function ReportPageContent({ report, hasLoadError }: ReportPageContentProps) {
  const { locale } = useLocale();
  const copy = uiCopy[locale];

  if (hasLoadError) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-16 sm:px-6">
        <section className="w-full rounded-[32px] border border-gold/18 bg-midnight/88 p-8 gold-outline sm:p-10">
          <p className="text-xs uppercase tracking-[0.4em] text-silverSand">
            {copy.report.loadErrorLabel}
          </p>
          <h1 className="mt-4 font-display text-3xl text-parchment sm:text-4xl">
            {copy.report.loadErrorTitle}
          </h1>
          <p className="mt-4 text-[15px] leading-8 text-parchment/80">
            {copy.report.loadErrorDescription}
          </p>
          <Link
            className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-gradient-to-r from-gold to-[#a0845a] px-5 py-3 text-sm font-medium text-deepNight transition hover:brightness-110"
            href="/"
          >
            {copy.report.backHome}
          </Link>
        </section>
      </main>
    );
  }

  if (!report) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-16 sm:px-6">
        <section className="w-full rounded-[32px] border border-gold/18 bg-midnight/88 p-8 gold-outline sm:p-10">
          <p className="text-xs uppercase tracking-[0.4em] text-silverSand">
            {copy.report.missingLabel}
          </p>
          <h1 className="mt-4 font-display text-3xl text-parchment sm:text-4xl">
            {copy.report.missingTitle}
          </h1>
          <p className="mt-4 text-[15px] leading-8 text-parchment/80">
            {copy.report.missingDescription}
          </p>
          <Link
            className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-gradient-to-r from-gold to-[#a0845a] px-5 py-3 text-sm font-medium text-deepNight transition hover:brightness-110"
            href="/"
          >
            {copy.report.backHome}
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8 flex flex-col gap-4 rounded-[30px] border border-gold/16 bg-midnight/82 p-6 gold-outline">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-silverSand">
              {copy.report.savedLabel}
            </p>
            <h1 className="mt-3 font-display text-3xl text-parchment sm:text-4xl">
              {copy.report.title}
            </h1>
            <p className="mt-3 text-sm leading-7 text-silverSand">
              {report.input.birthYear}.{String(report.input.birthMonth).padStart(2, "0")}.
              {String(report.input.birthDay).padStart(2, "0")}
              {report.input.birthHour === null
                ? ` · ${copy.report.timeUnknown}`
                : ` · ${String(report.input.birthHour).padStart(2, "0")}:00`}{" "}
              · {localizeGenderLabel(report.input.gender, locale)}
            </p>
            <p className="mt-1 text-xs leading-6 text-silverSand">
              {report.storage === "supabase"
                ? copy.report.storageSupabase
                : copy.report.storageMemory}
            </p>
          </div>
          <LanguageToggle />
        </div>
        <div className="flex justify-end">
          <ShareButton />
        </div>
      </header>

      <ReportViewer report={report} />
    </main>
  );
}
