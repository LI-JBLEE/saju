"use client";

import { useState } from "react";
import { uiCopy } from "@/lib/i18n";
import { useLocale } from "./LocaleProvider";

export function ShareButton() {
  const { locale } = useLocale();
  const copy = uiCopy[locale];
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      className="inline-flex min-h-11 items-center justify-center rounded-full border border-gold/35 bg-gold/10 px-4 py-2 text-sm font-medium text-parchment transition hover:border-gold/60 hover:bg-gold/20"
      onClick={handleCopy}
      type="button"
    >
      {copied ? copy.share.copied : copy.share.idle}
    </button>
  );
}
