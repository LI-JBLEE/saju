"use client";

import { uiCopy } from "@/lib/i18n";
import { useLocale } from "./LocaleProvider";

const options = [
  { label: "EN", value: "en" },
  { label: "KR", value: "ko" },
] as const;

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-gold/18 bg-deepNight/55 px-2 py-2 backdrop-blur-sm">
      <span className="pl-2 text-[10px] uppercase tracking-[0.35em] text-silverSand">
        {uiCopy[locale].language}
      </span>
      <div className="flex rounded-full border border-gold/15 bg-midnight/85 p-1">
        {options.map((option) => {
          const active = locale === option.value;

          return (
            <button
              className={`min-h-10 rounded-full px-3 text-xs font-semibold tracking-[0.25em] transition ${
                active
                  ? "bg-gold text-deepNight shadow-[0_0_18px_rgba(201,169,110,0.22)]"
                  : "text-silverSand hover:text-parchment"
              }`}
              key={option.value}
              onClick={() => setLocale(option.value)}
              type="button"
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
