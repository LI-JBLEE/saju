import { localizeOhaengLabel, uiCopy, type AppLocale } from "@/lib/i18n";
import type { SajuData } from "@/lib/saju/types";

interface SajuChartProps {
  locale: AppLocale;
  sajuData: SajuData;
}

export function SajuChart({ locale, sajuData }: SajuChartProps) {
  const copy = uiCopy[locale];
  const labels = [
    { key: "year", label: copy.chart.year },
    { key: "month", label: copy.chart.month },
    { key: "day", label: copy.chart.day },
    { key: "hour", label: copy.chart.hour },
  ] as const;

  return (
    <div className="space-y-4 rounded-[28px] border border-gold/15 bg-midnight/80 p-6 gold-outline sm:p-8">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-silverSand">{copy.chart.eyebrow}</p>
        <h2 className="mt-2 font-display text-2xl text-parchment">{copy.chart.title}</h2>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {labels.map(({ key, label }) => {
          const pillar = sajuData.pillars[key];

          return (
            <article
              className="rounded-[20px] border border-gold/20 bg-deepNight/70 p-4 text-center"
              key={key}
            >
              <p className="text-xs tracking-[0.25em] text-silverSand">{label}</p>
              {pillar ? (
                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl border border-gold/20 bg-gold/5 py-3">
                    <div className="font-display text-3xl font-semibold text-gold">
                      {pillar.cheongan}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-gold/15 bg-parchment/5 py-3">
                    <div className="font-display text-3xl font-semibold text-parchment">
                      {pillar.jiji}
                    </div>
                  </div>
                  <p className="text-sm text-silverSand">
                    {localizeOhaengLabel(pillar.ohaeng, locale)}
                  </p>
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-dashed border-gold/15 py-10 text-sm text-silverSand">
                  {copy.chart.unknown}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
