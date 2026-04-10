import { disclaimerText, reportSectionTitles } from "./contracts.js";
import type {
  BirthInputFixture,
  ReportFixture,
  SajuDataFixture,
} from "./types.js";

const paragraph = (...sentences: string[]): string => sentences.join(" ");

export const validBirthInputs: BirthInputFixture[] = [
  {
    birthYear: 1990,
    birthMonth: 3,
    birthDay: 15,
    birthHour: 6,
    gender: "female",
  },
  {
    birthYear: 1988,
    birthMonth: 11,
    birthDay: 9,
    birthHour: null,
    gender: "male",
  },
] as const;

export const invalidBirthInputs = [
  {
    input: {
      birthYear: 1899,
      birthMonth: 3,
      birthDay: 15,
      birthHour: 10,
      gender: "female",
    },
    reason: "year below lower bound",
  },
  {
    input: {
      birthYear: 1990,
      birthMonth: 13,
      birthDay: 15,
      birthHour: 10,
      gender: "female",
    },
    reason: "month above upper bound",
  },
  {
    input: {
      birthYear: 1990,
      birthMonth: 2,
      birthDay: 30,
      birthHour: 10,
      gender: "female",
    },
    reason: "invalid calendar day",
  },
  {
    input: {
      birthYear: 1990,
      birthMonth: 3,
      birthDay: 15,
      birthHour: 24,
      gender: "female",
    },
    reason: "hour above upper bound",
  },
  {
    input: {
      birthYear: 1990,
      birthMonth: 3,
      birthDay: 15,
      birthHour: 10,
      gender: "other",
    },
    reason: "unsupported gender enum",
  },
] as const;

export const sajuDataWithHour: SajuDataFixture = {
  pillars: {
    year: { cheongan: "甲", jiji: "子", ohaeng: "목" },
    month: { cheongan: "丙", jiji: "午", ohaeng: "화" },
    day: { cheongan: "戊", jiji: "申", ohaeng: "토" },
    hour: { cheongan: "庚", jiji: "戌", ohaeng: "금" },
  },
  ohaengRatio: { 목: 1, 화: 2, 토: 2, 금: 2, 수: 1 },
  ilgan: "戊",
  yongsin: "목",
  gisin: "금",
};

export const sajuDataWithoutHour: SajuDataFixture = {
  pillars: {
    year: { cheongan: "辛", jiji: "酉", ohaeng: "금" },
    month: { cheongan: "癸", jiji: "亥", ohaeng: "수" },
    day: { cheongan: "乙", jiji: "巳", ohaeng: "목" },
  },
  ohaengRatio: { 목: 2, 화: 1, 토: 1, 금: 2, 수: 2 },
  ilgan: "乙",
  yongsin: "화",
  gisin: "수",
};

function createSectionBodies(currentYear: number) {
  const common = {
    basic: paragraph(
      "당신의 사주는 빠르게 치고 나가기보다 흐름을 읽고 적절한 타이밍을 잡을 때 강점이 살아나는 구조입니다.",
      "년주와 월주에서는 사회적 역할을 책임감 있게 감당하려는 기운이 보이고, 일주에서는 자기 기준을 쉽게 놓지 않는 단단함이 드러납니다.",
      "오행의 균형이 한쪽으로 심하게 무너지지 않아 기본 체력은 안정적인 편이지만, 특정 시기에는 감정과 판단이 따로 움직일 수 있어 마음의 속도를 조절하는 습관이 중요합니다.",
      "용신과 기신을 함께 보았을 때는 새로운 자극을 받아들이되 과한 경쟁으로 번지지 않게 호흡을 조절할수록 사주 전체의 장점이 선명해집니다.",
    ),
    personality: paragraph(
      "일간의 기운을 기준으로 보면 스스로 기준을 세우고 그 기준을 지키려는 힘이 강한 편입니다.",
      "그래서 겉으로는 차분해 보여도 속으로는 상황을 아주 세밀하게 살피며 사람의 말투와 분위기 변화를 빠르게 읽어내는 면이 있습니다.",
      "강점은 책임감과 꾸준함, 그리고 상대를 함부로 대하지 않는 태도에 있고, 약점은 한 번 마음이 상하면 오래 생각하거나 모든 걸 혼자 감당하려는 경향에 있습니다.",
      "대인관계에서는 얕게 넓히기보다 믿을 수 있는 사람과 깊게 연결될 때 에너지가 살아나므로, 관계의 숫자보다 결의 밀도를 더 중요하게 보는 편이 잘 맞습니다.",
    ),
    career: paragraph(
      "직업운은 즉흥적인 승부보다 축적형 역량을 키울수록 커집니다.",
      "사람과 정보를 동시에 다루는 일, 구조를 만들고 정리하는 일, 혹은 감각과 분석이 함께 필요한 일에서 강점을 발휘할 가능성이 큽니다.",
      "재물운 역시 한 번에 크게 벌기보다 흐름을 관리하면서 안정적으로 불리는 방식이 잘 맞고, 특히 자신이 이해하지 못하는 투자나 과도한 경쟁 환경에는 신중할수록 좋습니다.",
      "돈은 실력과 신뢰가 쌓일 때 따라오는 구조에 가깝기 때문에, 당장의 속도보다 반복 가능한 수입 구조를 만드는 전략이 장기적으로 훨씬 유리합니다.",
    ),
    health: paragraph(
      "건강운은 전체적으로 큰 기복보다 생활 리듬이 흐트러질 때 약점이 드러나는 타입으로 보입니다.",
      "오행 불균형이 심하지는 않더라도 피로가 쌓이면 소화기, 수면, 순환 계통처럼 기본 리듬과 연결된 부분에서 먼저 신호가 올 수 있습니다.",
      "몸이 보내는 작은 신호를 무시하지 말고 식사 시간과 수면 시간을 일정하게 맞추는 것이 가장 좋은 관리법입니다.",
      "운이 떨어져서 아픈 구조라기보다 생활 리듬이 흔들릴 때 균형이 무너지는 쪽에 가까우므로, 무리한 일정만 줄여도 컨디션 회복 속도가 확실히 빨라질 수 있습니다.",
    ),
    yearly: paragraph(
      `${currentYear}년의 흐름은 크게 보면 정비와 확장의 두 가지 흐름이 함께 들어오는 해입니다.`,
      "상반기에는 이미 쌓아둔 기반을 다시 다듬고, 사람 관계나 일의 우선순위를 정리하는 움직임이 중요하게 작동합니다.",
      "하반기로 갈수록 새로운 기회가 눈에 띄기 쉬운데, 이때는 무엇이 좋아 보이는지보다 무엇이 오래 남는지를 기준으로 판단해야 성과가 안정적으로 쌓입니다.",
      "올해의 핵심 키워드는 속도보다 정렬, 불안보다 루틴, 확신보다 검토이며, 이 세 가지를 지키면 흐름을 훨씬 편안하게 탈 수 있습니다.",
    ),
    advice: paragraph(
      "지금 당신에게 가장 필요한 조언은 자기 속도를 남과 비교하지 않는 것입니다.",
      "사주는 타이밍을 읽는 언어이기 때문에, 남보다 늦어 보이는 시기에도 실제로는 준비가 깊어지는 시간일 수 있습니다.",
      "중요한 결정은 마음이 급할 때보다 생활 리듬이 안정된 날에 내리고, 행운의 방향은 새로운 사람을 무작정 늘리는 것보다 이미 있는 관계를 정성껏 다듬는 쪽에 있습니다.",
      "행운의 색상과 숫자를 하나의 정답처럼 받아들이기보다, 자신이 편안함과 집중력을 느끼는 환경을 의도적으로 만드는 신호로 활용하면 훨씬 현실적인 도움이 됩니다.",
    ),
  };

  const romance = {
    male: paragraph(
      "연애에서는 마음이 생겨도 바로 표현하기보다 상대의 반응과 분위기를 충분히 살피는 편입니다.",
      "그래서 처음에는 신중하고 조용해 보일 수 있지만, 일단 신뢰가 생기면 오래 책임지려는 태도가 강하게 드러납니다.",
      "배우자 운을 볼 때는 화려한 자극보다 대화의 리듬이 맞고 생활 감각이 안정적인 인연과 궁합이 좋으며, 결혼 시기는 외부 성취가 어느 정도 정리된 뒤에 마음이 더 분명해질 가능성이 큽니다.",
      "연애에서 중요한 과제는 혼자 확신을 만들기 전에도 감정을 조금 더 언어로 나누는 것이고, 그 습관이 관계의 깊이를 훨씬 부드럽게 키워줍니다.",
    ),
    female: paragraph(
      "연애에서는 상대의 성실함과 정서적 안정감을 중요하게 보는 편이며, 말보다 행동에서 신뢰를 확인하려는 경향이 있습니다.",
      "겉으로는 차분하고 이성적으로 보여도 마음이 열리면 관계를 오래 가꾸고 책임지려는 힘이 커서, 가벼운 만남보다 진지한 연결에 더 잘 맞습니다.",
      "배우자 운을 보면 과장된 표현보다 생활 감각이 맞고 약속을 지키는 사람이 좋은 짝이 될 가능성이 크며, 결혼 시기는 마음의 확신과 생활 기반이 함께 맞물릴 때 자연스럽게 열립니다.",
      "연애에서의 숙제는 상대를 배려하느라 자신의 필요를 뒤로 미루지 않는 것이고, 바라는 점을 또렷하게 말할수록 관계가 더 건강하게 깊어질 수 있습니다.",
    ),
  };

  return { common, romance };
}

export function createReportFixture(
  currentYear: number,
  gender: "male" | "female",
): ReportFixture {
  const bodies = createSectionBodies(currentYear);

  return {
    gender,
    disclaimer: `${disclaimerText}입니다.`,
    sections: [
      { title: reportSectionTitles[0], body: bodies.common.basic },
      { title: reportSectionTitles[1], body: bodies.common.personality },
      { title: reportSectionTitles[2], body: bodies.common.career },
      { title: reportSectionTitles[3], body: bodies.romance[gender] },
      { title: reportSectionTitles[4], body: bodies.common.health },
      { title: reportSectionTitles[5], body: bodies.common.yearly },
      { title: reportSectionTitles[6], body: bodies.common.advice },
    ],
  };
}

export const validSharePaths = [
  "/report/123e4567-e89b-42d3-a456-426614174000",
  "/report/f47ac10b-58cc-4372-a567-0e02b2c3d479",
] as const;

export const invalidSharePaths = [
  "/reports/123e4567-e89b-42d3-a456-426614174000",
  "/report/not-a-uuid",
  "/report/123",
] as const;
