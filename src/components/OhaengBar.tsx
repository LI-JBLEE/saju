import { localizeOhaengLabel, uiCopy, type AppLocale } from "@/lib/i18n";
import type { OhaengKey, SajuData } from "@/lib/saju/types";

interface OhaengBarProps {
  locale: AppLocale;
  sajuData: SajuData;
}

const colors: Record<OhaengKey, string> = {
  목: "from-[#2d5a2d] to-[#7ec87e]",
  화: "from-[#5a2d2d] to-[#c87e7e]",
  토: "from-[#5a4a2d] to-[#c8a87e]",
  금: "from-[#3d3d4a] to-[#a0a0c8]",
  수: "from-[#2d3d4a] to-[#7ea8c8]",
};

const order: OhaengKey[] = ["목", "화", "토", "금", "수"];

export function OhaengBar({ locale, sajuData }: OhaengBarProps) {
  const copy = uiCopy[locale];
  const max = Math.max(...order.map((key) => sajuData.ohaengRatio[key]), 1);

  return (
    <div className="space-y-4 rounded-[28px] border border-gold/15 bg-midnight/80 p-6 gold-outline sm:p-8">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-silverSand">{copy.elements.eyebrow}</p>
        <h2 className="mt-2 font-display text-2xl text-parchment">{copy.elements.title}</h2>
      </div>
      <div className="space-y-4">
        {order.map((key) => {
          const value = sajuData.ohaengRatio[key];
          const width = `${Math.max((value / max) * 100, 8)}%`;

          return (
            <div className="grid grid-cols-[72px_1fr_36px] items-center gap-3" key={key}>
              <span className="text-sm text-silverSand">{localizeOhaengLabel(key, locale)}</span>
              <div className="h-3 overflow-hidden rounded-full bg-deepNight/80">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${colors[key]}`}
                  style={{ width }}
                />
              </div>
              <span className="text-right text-sm text-parchment">{value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
