import { BirthInputForm } from "@/components/BirthInputForm";

export default function HomePage() {
  return (
    <main className="relative overflow-hidden px-4 py-12 sm:px-6 sm:py-20">
      <div className="paper-grain relative mx-auto max-w-5xl">
        <div className="absolute inset-x-0 top-0 h-64 rounded-full bg-gold/8 blur-3xl" />
        <section className="relative mx-auto max-w-[560px] rounded-[36px] border border-gold/20 bg-midnight/88 p-6 gold-outline sm:p-10">
          <p className="text-xs uppercase tracking-[0.45em] text-silverSand">Saju Report</p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-gold sm:text-5xl">
            당신의 흐름을
            <br />
            조용히 읽어드립니다
          </h1>
          <p className="mt-5 text-[15px] leading-8 text-parchment/85 sm:text-base">
            생년월일시와 성별을 입력하면 사주를 계산하고, AI가 따뜻하고 구체적인 해석을 담은
            리포트를 보여드려요. 로그인 없이 바로 확인할 수 있습니다.
          </p>

          <div className="mt-8 rounded-[28px] border border-gold/15 bg-deepNight/60 p-5 sm:p-6">
            <BirthInputForm />
          </div>
        </section>
      </div>
    </main>
  );
}
