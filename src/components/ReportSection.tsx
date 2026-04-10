const iconMarks: Record<string, string> = {
  나침반: "◌",
  사람: "◎",
  저울: "△",
  달: "◐",
  잎사귀: "◍",
  태양: "☼",
  별: "✦",
};

interface ReportSectionProps {
  title: string;
  icon: string;
  content: string;
}

export function ReportSection({ title, icon, content }: ReportSectionProps) {
  return (
    <section className="animate-section-fade rounded-[28px] border border-gold/15 bg-midnight/80 p-6 gold-outline sm:p-8">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
          <span aria-hidden="true" className="text-lg">
            {iconMarks[icon] ?? "•"}
          </span>
        </div>
        <h2 className="font-display text-xl font-semibold text-parchment">{title}</h2>
      </div>
      <p className="whitespace-pre-line text-[15px] leading-8 text-parchment/92 sm:text-base">
        {content}
      </p>
    </section>
  );
}
