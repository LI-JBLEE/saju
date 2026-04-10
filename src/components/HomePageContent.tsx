"use client";

import { uiCopy } from "@/lib/i18n";
import { BirthInputForm } from "./BirthInputForm";
import { LanguageToggle } from "./LanguageToggle";
import { useLocale } from "./LocaleProvider";

export function HomePageContent() {
  const { locale } = useLocale();
  const copy = uiCopy[locale];

  return (
    <main className="relative overflow-hidden px-4 py-12 sm:px-6 sm:py-20">
      <div className="paper-grain relative mx-auto max-w-5xl">
        <div className="absolute inset-x-0 top-0 h-64 rounded-full bg-gold/8 blur-3xl" />
        <section className="relative mx-auto max-w-[560px] rounded-[36px] border border-gold/20 bg-midnight/88 p-6 gold-outline sm:p-10">
          <div className="flex items-start justify-between gap-4">
            <p className="pt-1 text-xs uppercase tracking-[0.45em] text-silverSand">{copy.appTag}</p>
            <LanguageToggle />
          </div>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-gold sm:text-5xl">
            {copy.homeTitle[0]}
            <br />
            {copy.homeTitle[1]}
          </h1>
          <p className="mt-5 text-[15px] leading-8 text-parchment/85 sm:text-base">
            {copy.homeDescription}
          </p>

          <div className="mt-8 rounded-[28px] border border-gold/15 bg-deepNight/60 p-5 sm:p-6">
            <BirthInputForm />
          </div>
        </section>
      </div>
    </main>
  );
}
