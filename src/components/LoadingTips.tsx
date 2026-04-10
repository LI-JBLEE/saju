"use client";

import { useEffect, useState } from "react";

const tips = [
  "오행은 목·화·토·금·수 다섯 기운의 균형을 보는 관점이에요.",
  "태어난 시간을 모르면 시주를 제외한 기준으로도 흐름을 읽을 수 있어요.",
  "사주는 예언보다 자기 이해의 언어로 받아들일수록 더 유용해져요.",
  "용신은 부족한 균형을 보완해 주는 방향으로 해석할 수 있어요.",
];

export function LoadingTips() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % tips.length);
    }, 3000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="h-10 w-10 rounded-full border border-gold/40 border-t-gold animate-spin" />
      <div className="space-y-2">
        <p className="font-display text-xl text-parchment">사주를 읽고 있습니다...</p>
        <p className="max-w-sm text-sm leading-7 text-silverSand">{tips[index]}</p>
      </div>
    </div>
  );
}
