import { Solar } from "lunar-javascript";
import { cheonganOhaeng, jijiOhaeng, ohaengOrder } from "./constants";
import type { BirthInput, OhaengKey, SajuData, SajuPillar } from "./types";

function getCalculationHour(input: BirthInput) {
  // Use noon as a neutral fallback so unknown hours do not accidentally cross a day boundary.
  return input.birthHour ?? 12;
}

function splitGanZhi(value: string) {
  const [cheongan, jiji] = Array.from(value);

  if (!cheongan || !jiji) {
    throw new Error(`Invalid ganzhi value: ${value}`);
  }

  return { cheongan, jiji };
}

function createPillar(value: string): SajuPillar {
  const { cheongan, jiji } = splitGanZhi(value);

  return {
    cheongan,
    jiji,
    ohaeng: cheonganOhaeng[cheongan],
  };
}

function calculateOhaengRatio(pillars: SajuData["pillars"]) {
  const counts: Record<OhaengKey, number> = {
    목: 0,
    화: 0,
    토: 0,
    금: 0,
    수: 0,
  };

  const existingPillars = [pillars.year, pillars.month, pillars.day, pillars.hour].filter(
    (pillar): pillar is SajuPillar => Boolean(pillar),
  );

  for (const pillar of existingPillars) {
    counts[cheonganOhaeng[pillar.cheongan]] += 1;
    counts[jijiOhaeng[pillar.jiji]] += 1;
  }

  return counts;
}

function pickExtremes(ohaengRatio: Record<OhaengKey, number>) {
  const ordered = [...ohaengOrder].sort((left, right) => {
    const diff = ohaengRatio[left] - ohaengRatio[right];

    if (diff !== 0) {
      return diff;
    }

    return ohaengOrder.indexOf(left) - ohaengOrder.indexOf(right);
  });

  return {
    yongsin: ordered[0],
    gisin: ordered[ordered.length - 1],
  };
}

export function calculateSaju(input: BirthInput): SajuData {
  const solar = Solar.fromYmdHms(
    input.birthYear,
    input.birthMonth,
    input.birthDay,
    getCalculationHour(input),
    0,
    0,
  );
  const eightChar = solar.getLunar().getEightChar();
  const pillars: SajuData["pillars"] = {
    year: createPillar(eightChar.getYear()),
    month: createPillar(eightChar.getMonth()),
    day: createPillar(eightChar.getDay()),
  };

  if (input.birthHour !== null) {
    pillars.hour = createPillar(eightChar.getTime());
  }

  const ohaengRatio = calculateOhaengRatio(pillars);
  const { yongsin, gisin } = pickExtremes(ohaengRatio);

  return {
    pillars,
    ohaengRatio,
    ilgan: pillars.day.cheongan,
    yongsin,
    gisin,
  };
}
