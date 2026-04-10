"use client";

import { useEffect, useState } from "react";
import { uiCopy } from "@/lib/i18n";
import { useLocale } from "./LocaleProvider";

export function LoadingTips() {
  const { locale } = useLocale();
  const copy = uiCopy[locale];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % copy.loadingTips.length);
    }, 3000);

    return () => window.clearInterval(timer);
  }, [copy.loadingTips.length]);

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="h-10 w-10 rounded-full border border-gold/40 border-t-gold animate-spin" />
      <div className="space-y-2">
        <p className="font-display text-xl text-parchment">{copy.loadingTipsTitle}</p>
        <p className="max-w-sm text-sm leading-7 text-silverSand">{copy.loadingTips[index]}</p>
      </div>
    </div>
  );
}
