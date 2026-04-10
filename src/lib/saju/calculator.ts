import type { BirthInput, OhaengKey, SajuData, SajuPillar } from "./types";

const cheongan = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"] as const;
const jiji = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] as const;

const cheonganOhaeng: Record<(typeof cheongan)[number], OhaengKey> = {
  甲: "목",
  乙: "목",
  丙: "화",
  丁: "화",
  戊: "토",
  己: "토",
  庚: "금",
  辛: "금",
  壬: "수",
  癸: "수",
};

function normalizeMod(value: number, mod: number) {
  return ((value % mod) + mod) % mod;
}

function createPillar(stemIndex: number, branchIndex: number): SajuPillar {
  const stem = cheongan[normalizeMod(stemIndex, cheongan.length)];
  const branch = jiji[normalizeMod(branchIndex, jiji.length)];

  return {
    cheongan: stem,
    jiji: branch,
    ohaeng: cheonganOhaeng[stem],
  };
}

function getDaySerial(input: BirthInput) {
  return Math.floor(
    Date.UTC(input.birthYear, input.birthMonth - 1, input.birthDay) / 86_400_000,
  );
}

export function calculateSaju(input: BirthInput): SajuData {
  const yearStemIndex = input.birthYear - 4;
  const yearBranchIndex = input.birthYear - 4;
  const daySerial = getDaySerial(input);
  const monthStemIndex = yearStemIndex * 2 + input.birthMonth;
  const monthBranchIndex = input.birthMonth + 1;
  const dayStemIndex = daySerial + 6;
  const dayBranchIndex = daySerial + 8;

  const pillars: SajuData["pillars"] = {
    year: createPillar(yearStemIndex, yearBranchIndex),
    month: createPillar(monthStemIndex, monthBranchIndex),
    day: createPillar(dayStemIndex, dayBranchIndex),
  };

  if (input.birthHour !== null) {
    const hourBranchIndex = Math.floor(((input.birthHour + 1) % 24) / 2);
    const hourStemIndex = dayStemIndex * 2 + hourBranchIndex;
    pillars.hour = createPillar(hourStemIndex, hourBranchIndex);
  }

  const counts: Record<OhaengKey, number> = {
    목: 0,
    화: 0,
    토: 0,
    금: 0,
    수: 0,
  };

  Object.values(pillars).forEach((pillar) => {
    counts[pillar.ohaeng] += 1;
  });

  const sorted = Object.entries(counts).sort((left, right) => left[1] - right[1]);
  const yongsin = sorted[0]?.[0] as OhaengKey;
  const gisin = sorted[sorted.length - 1]?.[0] as OhaengKey;

  return {
    pillars,
    ohaengRatio: counts,
    ilgan: pillars.day.cheongan,
    yongsin,
    gisin,
  };
}
