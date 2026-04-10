import type { OhaengKey } from "./types";

export const ohaengOrder: OhaengKey[] = ["목", "화", "토", "금", "수"];

export const cheonganOhaeng: Record<string, OhaengKey> = {
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

export const jijiOhaeng: Record<string, OhaengKey> = {
  子: "수",
  丑: "토",
  寅: "목",
  卯: "목",
  辰: "토",
  巳: "화",
  午: "화",
  未: "토",
  申: "금",
  酉: "금",
  戌: "토",
  亥: "수",
};
