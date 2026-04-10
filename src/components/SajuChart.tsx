import type { SajuData } from "@/lib/saju/types";

interface SajuChartProps {
  sajuData: SajuData;
}

const labels = [
  { key: "year", label: "년주" },
  { key: "month", label: "월주" },
  { key: "day", label: "일주" },
  { key: "hour", label: "시주" },
] as const;

export function SajuChart({ sajuData }: SajuChartProps) {
  return (
    <div className="space-y-4 rounded-[28px] border border-gold/15 bg-midnight/80 p-6 gold-outline sm:p-8">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-silverSand">Saju Chart</p>
        <h2 className="mt-2 font-display text-2xl text-parchment">사주 기본 구성</h2>
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
                  <p className="text-sm text-silverSand">{pillar.ohaeng}</p>
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-dashed border-gold/15 py-10 text-sm text-silverSand">
                  시간 모름
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
