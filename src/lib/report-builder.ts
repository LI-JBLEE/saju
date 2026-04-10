import type { BirthInput, OhaengKey, SajuData } from "@/lib/saju/types";
import type { ReportSectionData } from "@/types";

export const reportSectionDefinitions = [
  { title: "사주 기본 정보", icon: "나침반" },
  { title: "타고난 성격 & 기질", icon: "사람" },
  { title: "직업 & 재물운", icon: "저울" },
  { title: "연애 & 결혼운", icon: "달" },
  { title: "건강운", icon: "잎사귀" },
  { title: "올해 운세", icon: "태양" },
  { title: "종합 조언", icon: "별" },
] as const satisfies ReadonlyArray<{
  title: string;
  icon: string;
}>;

function buildEnergySentence(ohaengRatio: Record<OhaengKey, number>) {
  const dominant = Object.entries(ohaengRatio).sort((left, right) => right[1] - left[1])[0]?.[0];
  const subtle = Object.entries(ohaengRatio).sort((left, right) => left[1] - right[1])[0]?.[0];

  return `오행의 흐름을 보면 ${dominant}의 기운이 비교적 또렷하고 ${subtle}의 기운은 의식적으로 보완할수록 균형이 살아나는 구조입니다.`;
}

function buildHourSentence(input: BirthInput) {
  if (input.birthHour === null) {
    return "태어난 시간을 모르는 기준으로 분석했기 때문에 시주에 해당하는 세부 해석은 조심스럽게 다루었습니다.";
  }

  return `태어난 시간 ${String(input.birthHour).padStart(2, "0")}시 기준의 시주 흐름까지 함께 참고해 세부 감정선과 일상의 리듬도 읽었습니다.`;
}

function currentYearText() {
  return new Date().getFullYear();
}

export function buildReportContent(sections: ReportSectionData[]) {
  return sections.map((section) => `${section.title}\n${section.content}`).join("\n\n");
}

export function parseReportContent(content: string): ReportSectionData[] {
  const normalized = content.trim();
  const sections: ReportSectionData[] = [];

  if (!normalized) {
    return sections;
  }

  for (let index = 0; index < reportSectionDefinitions.length; index += 1) {
    const section = reportSectionDefinitions[index];
    const nextSection = reportSectionDefinitions[index + 1];
    const marker = `${section.title}\n`;
    const start = normalized.indexOf(marker);

    if (start === -1) {
      continue;
    }

    const contentStart = start + marker.length;
    const end = nextSection
      ? normalized.indexOf(`\n\n${nextSection.title}\n`, contentStart)
      : normalized.length;
    const sectionContent = normalized.slice(contentStart, end === -1 ? normalized.length : end).trim();

    sections.push({
      title: section.title,
      icon: section.icon,
      content: sectionContent,
    });
  }

  return sections;
}

export function buildReportSections(input: BirthInput, sajuData: SajuData): ReportSectionData[] {
  const currentYear = currentYearText();
  const energySentence = buildEnergySentence(sajuData.ohaengRatio);
  const relationshipTone =
    input.gender === "female"
      ? "상대의 성실함과 정서적 안정감을 중요하게 보는 편이라, 말보다 행동에서 신뢰를 확인하려는 경향이 큽니다."
      : "감정이 생겨도 바로 표현하기보다 상대의 반응과 분위기를 충분히 살피며, 신뢰가 생기면 오래 책임지려는 면이 강합니다.";

  return [
    {
      title: reportSectionDefinitions[0].title,
      icon: reportSectionDefinitions[0].icon,
      content: `년주·월주·일주${input.birthHour === null ? "" : "·시주"}를 기준으로 보면 전체 흐름은 단단한 중심 위에 감수성이 얹힌 구조에 가깝습니다. 일간 ${sajuData.ilgan}의 성질이 중심을 잡고 있고, 용신은 ${sajuData.yongsin}, 기신은 ${sajuData.gisin}으로 읽힙니다. ${energySentence} ${buildHourSentence(input)}`,
    },
    {
      title: reportSectionDefinitions[1].title,
      icon: reportSectionDefinitions[1].icon,
      content: `기본적으로는 신중하고 관찰력이 좋은 편이며, 사람의 말보다 분위기와 태도를 더 빨리 읽어내는 면이 있습니다. 겉으로는 차분해 보여도 내면에서는 많은 가능성을 동시에 검토하고 있어서, 결정 전까지 시간을 두고 생각하는 습관이 강점으로 이어집니다. 마음이 흔들릴 때에도 쉽게 무너지기보다 기준을 되찾으려는 힘이 있어, 삶 전체의 안정감을 스스로 만들어가는 타입에 가깝습니다.`,
    },
    {
      title: reportSectionDefinitions[2].title,
      icon: reportSectionDefinitions[2].icon,
      content: `직업운은 단기 성과 경쟁보다 실력과 신뢰를 꾸준히 쌓아가는 환경에서 더 선명하게 살아납니다. 구조를 만들고 정리하는 일, 사람과 정보를 함께 다루는 일, 감각과 분석이 같이 필요한 일에서 적성이 드러날 가능성이 큽니다. 재물운도 한 번에 크게 벌기보다 흐름을 관리하며 안정적으로 불리는 방식이 잘 맞고, 이해가 선명하지 않은 투자에는 시간을 두고 판단할수록 손실을 줄일 수 있습니다.`,
    },
    {
      title: reportSectionDefinitions[3].title,
      icon: reportSectionDefinitions[3].icon,
      content: `${relationshipTone} 가벼운 자극보다는 대화의 리듬이 맞고 생활 감각이 비슷한 인연과의 궁합이 좋으며, 관계가 깊어질수록 책임감 있게 오래 가꾸려는 태도가 나타납니다. 결혼운은 외부 조건만 맞는다고 바로 열리기보다 마음의 확신과 생활의 안정이 함께 맞물릴 때 자연스럽게 힘을 얻는 흐름입니다. 상대를 배려하느라 자신의 필요를 늦추기보다는 바라는 점을 조금 더 또렷하게 말할수록 관계가 건강해질 수 있습니다.`,
    },
    {
      title: reportSectionDefinitions[4].title,
      icon: reportSectionDefinitions[4].icon,
      content: `건강운은 큰 기복보다 생활 리듬의 흔들림에 민감하게 반응하는 타입으로 읽힙니다. 피로가 누적될수록 소화, 수면, 순환처럼 기본 컨디션과 연결된 부분에서 먼저 신호가 올 수 있으니, 무리한 일정이 길어질 때는 회복 루틴을 먼저 세우는 편이 좋습니다. 과하게 참는 습관보다 작은 불편을 일찍 정리하는 태도가 장기적인 건강운을 지키는 데 더 도움이 됩니다.`,
    },
    {
      title: reportSectionDefinitions[5].title,
      icon: reportSectionDefinitions[5].icon,
      content: `${currentYear}년은 정비와 확장이 함께 들어오는 해에 가깝습니다. 상반기에는 이미 쌓아둔 기반을 다시 정렬하고 우선순위를 조정하는 흐름이 강하고, 하반기로 갈수록 새로운 제안과 움직임이 눈에 들어오기 쉬워집니다. 이때는 무엇이 더 화려한지보다 무엇이 오래 남는지를 기준으로 판단해야 성과가 안정적으로 이어집니다. 올해의 핵심은 속도보다 정렬, 조급함보다 루틴입니다.`,
    },
    {
      title: reportSectionDefinitions[6].title,
      icon: reportSectionDefinitions[6].icon,
      content: `지금 시점의 조언은 스스로의 속도를 남과 비교하지 않는 것입니다. 준비가 길어 보이는 시간에도 실제로는 판단의 깊이와 삶의 밀도가 함께 자라고 있을 가능성이 큽니다. 중요한 결정을 내려야 할 때는 마음이 급한 날보다 생활 리듬이 정돈된 날을 고르고, 행운의 방향과 색상, 숫자는 정답처럼 믿기보다 자신을 안정시키는 생활 신호로 활용해 보세요. 본 리포트는 AI가 생성한 참고용 콘텐츠입니다.`,
    },
  ];
}
