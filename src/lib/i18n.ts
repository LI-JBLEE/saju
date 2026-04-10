import type { Gender, OhaengKey } from "@/lib/saju/types";

export type AppLocale = "en" | "ko";

export const defaultLocale: AppLocale = "en";
export const localeStorageKey = "saju-ui-locale";

export function isAppLocale(value: string): value is AppLocale {
  return value === "en" || value === "ko";
}

export const uiCopy = {
  en: {
    language: "Language",
    appTag: "Saju Report",
    homeTitle: ["A calm reading", "of your inner rhythm"],
    homeDescription:
      "Enter your birth date, time, and gender to receive an AI-guided saju report. No sign-in, no waiting room, just a direct reading you can share.",
    form: {
      birthYear: "Birth year",
      birthMonth: "Month",
      birthDay: "Day",
      birthHour: "Birth hour",
      unknownHour: "Unknown",
      gender: "Gender",
      female: "Female",
      male: "Male",
      submit: "Generate report",
      loading: "Reading your saju...",
      genericError: "Something went wrong while reading your saju. Please try again.",
    },
    loadingTipsTitle: "Reading your saju...",
    loadingTips: [
      "The five elements are read as a balance between wood, fire, earth, metal, and water.",
      "Even without a birth hour, the broader rhythm can still be interpreted from the other pillars.",
      "Saju tends to be most useful when treated as a language for self-understanding, not prediction.",
      "A useful energy is often read as the direction that restores balance rather than amplifying intensity.",
    ],
    report: {
      savedLabel: "Saved Report",
      title: "Saju Report",
      timeUnknown: "unknown time",
      storageSupabase: "Stored in Supabase.",
      storageMemory: "Using temporary in-memory development storage.",
      loadErrorLabel: "Report Error",
      loadErrorTitle: "Something went wrong while loading this report",
      loadErrorDescription:
        "Please try again in a moment, or return to the home screen to generate a new report.",
      missingLabel: "Report Missing",
      missingTitle: "We couldn't find this report",
      missingDescription:
        "This may be a temporary development report that has expired, or a link that was never stored. Create a new report from the home screen.",
      backHome: "Back to home",
    },
    share: {
      idle: "Copy link",
      copied: "Copied",
    },
    chart: {
      eyebrow: "Saju Chart",
      title: "Pillar Overview",
      year: "Year",
      month: "Month",
      day: "Day",
      hour: "Hour",
      unknown: "Unknown hour",
    },
    elements: {
      eyebrow: "Five Elements",
      title: "Element Balance",
      wood: "Wood",
      fire: "Fire",
      earth: "Earth",
      metal: "Metal",
      water: "Water",
    },
    sections: {
      "사주 기본 정보": "Saju Snapshot",
      "타고난 성격 & 기질": "Natural Personality",
      "직업 & 재물운": "Career & Wealth",
      "연애 & 결혼운": "Love & Marriage",
      "건강운": "Health",
      "올해 운세": "This Year",
      "종합 조언": "Overall Guidance",
    },
  },
  ko: {
    language: "언어",
    appTag: "사주 리포트",
    homeTitle: ["당신의 흐름을", "조용히 읽어드립니다"],
    homeDescription:
      "생년월일시와 성별을 입력하면 사주를 계산하고, AI가 따뜻하고 구체적인 해석을 담은 리포트를 보여드려요. 로그인 없이 바로 확인할 수 있습니다.",
    form: {
      birthYear: "태어난 연도",
      birthMonth: "월",
      birthDay: "일",
      birthHour: "태어난 시간",
      unknownHour: "모름",
      gender: "성별",
      female: "여",
      male: "남",
      submit: "사주 보기",
      loading: "사주를 읽는 중...",
      genericError: "사주를 읽는 중 문제가 생겼습니다. 다시 시도해 주세요.",
    },
    loadingTipsTitle: "사주를 읽고 있습니다...",
    loadingTips: [
      "오행은 목·화·토·금·수 다섯 기운의 균형을 보는 관점이에요.",
      "태어난 시간을 모르면 시주를 제외한 기준으로도 흐름을 읽을 수 있어요.",
      "사주는 예언보다 자기 이해의 언어로 받아들일수록 더 유용해져요.",
      "용신은 부족한 균형을 보완해 주는 방향으로 해석할 수 있어요.",
    ],
    report: {
      savedLabel: "저장된 리포트",
      title: "사주 리포트",
      timeUnknown: "시간 모름",
      storageSupabase: "Supabase에 저장된 리포트입니다.",
      storageMemory: "현재는 메모리 기반 개발용 저장소를 사용하고 있습니다.",
      loadErrorLabel: "리포트 오류",
      loadErrorTitle: "리포트를 불러오는 중 문제가 생겼습니다",
      loadErrorDescription:
        "잠시 후 다시 접속해 보시거나, 메인 화면에서 새 리포트를 생성해 주세요.",
      missingLabel: "리포트 없음",
      missingTitle: "리포트를 찾을 수 없습니다",
      missingDescription:
        "이미 만료된 개발용 임시 리포트이거나, 아직 저장되지 않은 링크일 수 있습니다. 다시 입력해서 새로운 리포트를 만들어 보세요.",
      backHome: "메인으로 돌아가기",
    },
    share: {
      idle: "링크 복사",
      copied: "복사됨",
    },
    chart: {
      eyebrow: "Saju Chart",
      title: "사주 기본 구성",
      year: "년주",
      month: "월주",
      day: "일주",
      hour: "시주",
      unknown: "시간 모름",
    },
    elements: {
      eyebrow: "Five Elements",
      title: "오행 비율",
      wood: "목",
      fire: "화",
      earth: "토",
      metal: "금",
      water: "수",
    },
    sections: {
      "사주 기본 정보": "사주 기본 정보",
      "타고난 성격 & 기질": "타고난 성격 & 기질",
      "직업 & 재물운": "직업 & 재물운",
      "연애 & 결혼운": "연애 & 결혼운",
      "건강운": "건강운",
      "올해 운세": "올해 운세",
      "종합 조언": "종합 조언",
    },
  },
} as const;

const errorTranslations: Record<string, { en: string; ko: string }> = {
  "입력값 형식이 올바르지 않습니다.": {
    en: "The request format is invalid.",
    ko: "입력값 형식이 올바르지 않습니다.",
  },
  "태어난 연도를 다시 확인해 주세요.": {
    en: "Please check the birth year again.",
    ko: "태어난 연도를 다시 확인해 주세요.",
  },
  "태어난 월을 다시 확인해 주세요.": {
    en: "Please check the birth month again.",
    ko: "태어난 월을 다시 확인해 주세요.",
  },
  "태어난 일을 다시 확인해 주세요.": {
    en: "Please check the birth day again.",
    ko: "태어난 일을 다시 확인해 주세요.",
  },
  "생년월일을 다시 확인해 주세요.": {
    en: "Please check the birth date again.",
    ko: "생년월일을 다시 확인해 주세요.",
  },
  "태어난 시간을 다시 확인해 주세요.": {
    en: "Please check the birth hour again.",
    ko: "태어난 시간을 다시 확인해 주세요.",
  },
  "성별을 선택해 주세요.": {
    en: "Please select a gender.",
    ko: "성별을 선택해 주세요.",
  },
  "사주를 읽는 중 문제가 생겼습니다. 다시 시도해 주세요.": {
    en: "Something went wrong while reading your saju. Please try again.",
    ko: "사주를 읽는 중 문제가 생겼습니다. 다시 시도해 주세요.",
  },
};

const ohaengLabels: Record<OhaengKey, { en: string; ko: string }> = {
  목: { en: "Wood", ko: "목" },
  화: { en: "Fire", ko: "화" },
  토: { en: "Earth", ko: "토" },
  금: { en: "Metal", ko: "금" },
  수: { en: "Water", ko: "수" },
};

export function translateErrorMessage(message: string, locale: AppLocale) {
  return errorTranslations[message]?.[locale] ?? message;
}

export function localizeSectionTitle(title: string, locale: AppLocale) {
  return uiCopy[locale].sections[title as keyof typeof uiCopy.en.sections] ?? title;
}

export function localizeOhaengLabel(value: OhaengKey, locale: AppLocale) {
  return ohaengLabels[value][locale];
}

export function localizeGenderLabel(gender: Gender, locale: AppLocale) {
  const form = uiCopy[locale].form;
  return gender === "female" ? form.female : form.male;
}
