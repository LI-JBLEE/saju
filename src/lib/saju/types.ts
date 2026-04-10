export type Gender = "male" | "female";
export type OhaengKey = "목" | "화" | "토" | "금" | "수";

export interface BirthInput {
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number | null;
  gender: Gender;
}

export interface SajuPillar {
  cheongan: string;
  jiji: string;
  ohaeng: OhaengKey;
}

export interface SajuData {
  pillars: {
    year: SajuPillar;
    month: SajuPillar;
    day: SajuPillar;
    hour?: SajuPillar;
  };
  ohaengRatio: Record<OhaengKey, number>;
  ilgan: string;
  yongsin: OhaengKey;
  gisin: OhaengKey;
}
