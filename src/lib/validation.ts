import type { BirthInput, Gender } from "@/lib/saju/types";

export function isGender(value: string): value is Gender {
  return value === "male" || value === "female";
}

export function validateBirthInput(value: unknown): {
  ok: true;
  data: BirthInput;
} | {
  ok: false;
  error: string;
} {
  if (typeof value !== "object" || value === null) {
    return { ok: false, error: "입력값 형식이 올바르지 않습니다." };
  }

  const candidate = value as Partial<Record<keyof BirthInput, unknown>>;
  const birthYear = Number(candidate.birthYear);
  const birthMonth = Number(candidate.birthMonth);
  const birthDay = Number(candidate.birthDay);
  const birthHour =
    candidate.birthHour === null || candidate.birthHour === undefined || candidate.birthHour === ""
      ? null
      : Number(candidate.birthHour);
  const gender = String(candidate.gender ?? "");
  const now = new Date();
  const currentYear = now.getFullYear();

  if (!Number.isInteger(birthYear) || birthYear < 1900 || birthYear > currentYear) {
    return { ok: false, error: "태어난 연도를 다시 확인해 주세요." };
  }

  if (!Number.isInteger(birthMonth) || birthMonth < 1 || birthMonth > 12) {
    return { ok: false, error: "태어난 월을 다시 확인해 주세요." };
  }

  if (!Number.isInteger(birthDay) || birthDay < 1 || birthDay > 31) {
    return { ok: false, error: "태어난 일을 다시 확인해 주세요." };
  }

  const date = new Date(birthYear, birthMonth - 1, birthDay);
  const isRealDate =
    date.getFullYear() === birthYear &&
    date.getMonth() === birthMonth - 1 &&
    date.getDate() === birthDay;

  if (!isRealDate || date.getTime() > now.getTime()) {
    return { ok: false, error: "생년월일을 다시 확인해 주세요." };
  }

  if (birthHour !== null && (!Number.isInteger(birthHour) || birthHour < 0 || birthHour > 23)) {
    return { ok: false, error: "태어난 시간을 다시 확인해 주세요." };
  }

  if (!isGender(gender)) {
    return { ok: false, error: "성별을 선택해 주세요." };
  }

  return {
    ok: true,
    data: {
      birthYear,
      birthMonth,
      birthDay,
      birthHour,
      gender,
    },
  };
}
