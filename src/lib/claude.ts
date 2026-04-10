import Anthropic from "@anthropic-ai/sdk";
import type { Message } from "@anthropic-ai/sdk/resources/messages/messages";
import { reportSectionDefinitions } from "@/lib/report-builder";
import type { BirthInput, SajuData } from "@/lib/saju/types";
import type { ReportSectionData } from "@/types";

const anthropicModel = "claude-sonnet-4-6";
const anthropicTimeoutMs = 60_000;
const anthropicRetryCount = 2;
const anthropicRetryDelayMs = 1_000;

let anthropicClient: Anthropic | null = null;

function getCurrentYear() {
  return new Date().getFullYear();
}

function formatBirthInput(input: BirthInput) {
  return [
    `- 태어난 연도: ${input.birthYear}`,
    `- 태어난 월: ${input.birthMonth}`,
    `- 태어난 일: ${input.birthDay}`,
    `- 태어난 시간: ${input.birthHour === null ? "모름" : `${input.birthHour}시`}`,
    `- 성별: ${input.gender === "female" ? "여성" : "남성"}`,
  ].join("\n");
}

function formatPillar(name: string, pillar: SajuData["pillars"]["year"]) {
  return `- ${name}: ${pillar.cheongan}${pillar.jiji} (${pillar.ohaeng})`;
}

function formatSajuData(sajuData: SajuData) {
  const lines = [
    formatPillar("년주", sajuData.pillars.year),
    formatPillar("월주", sajuData.pillars.month),
    formatPillar("일주", sajuData.pillars.day),
  ];

  if (sajuData.pillars.hour) {
    lines.push(formatPillar("시주", sajuData.pillars.hour));
  } else {
    lines.push("- 시주: 없음 (태어난 시간을 모름)");
  }

  lines.push(
    `- 오행 비율: 목 ${sajuData.ohaengRatio.목}, 화 ${sajuData.ohaengRatio.화}, 토 ${sajuData.ohaengRatio.토}, 금 ${sajuData.ohaengRatio.금}, 수 ${sajuData.ohaengRatio.수}`,
  );
  lines.push(`- 일간: ${sajuData.ilgan}`);
  lines.push(`- 용신: ${sajuData.yongsin}`);
  lines.push(`- 기신: ${sajuData.gisin}`);

  return lines.join("\n");
}

function buildSystemPrompt() {
  const sectionSchema = reportSectionDefinitions
    .map(
      (section, index) =>
        `${index + 1}. "${section.title}" 섹션을 반드시 포함하고, 각 content는 220자 이상 한국어 문단으로 작성`,
    )
    .join("\n");

  return [
    "너는 한국어 사주 리포트를 작성하는 전문 에디터다.",
    "출력은 반드시 JSON 하나만 반환한다. 마크다운 코드펜스는 금지한다.",
    '반환 형식은 {"sections":[{"title":"...", "content":"..."}]} 이다.',
    "sections 배열 길이는 정확히 7이어야 하며, title은 아래 순서와 완전히 일치해야 한다.",
    sectionSchema,
    "6번째 '올해 운세' 섹션에는 반드시 현재 연도를 숫자로 포함한다.",
    "태어난 시간이 없으면 시주 단정 표현을 쓰지 말고 조심스럽게 설명한다.",
    "7번째 '종합 조언' 섹션 마지막 문장은 정확히 '본 리포트는 AI가 생성한 참고용 콘텐츠입니다.' 로 끝낸다.",
    "운명을 단정하는 표현, 의료/법률 확정 표현, 과도한 공포 조장은 금지한다.",
    "문체는 따뜻하고 구체적이며 과장되지 않게 유지한다.",
  ].join("\n");
}

function buildUserPrompt(input: BirthInput, sajuData: SajuData) {
  const currentYear = getCurrentYear();

  return [
    `현재 연도: ${currentYear}`,
    "",
    "[사용자 입력]",
    formatBirthInput(input),
    "",
    "[사주 계산 결과]",
    formatSajuData(sajuData),
    "",
    "[추가 작성 지침]",
    "- 섹션 4 '연애 & 결혼운'은 성별에 맞는 관계 묘사를 포함한다.",
    "- 섹션 5 '건강운'은 의료 진단처럼 단정하지 말고 생활 관리 조언 중심으로 작성한다.",
    "- 섹션 6 '올해 운세'는 상반기/하반기 흐름과 핵심 키워드를 포함한다.",
    "- 섹션 7 '종합 조언'은 현재 시점 기준 조언, 주의사항, 행운의 방향/색상/숫자를 포함한다.",
  ].join("\n");
}

function getAnthropicApiKey() {
  return process.env.ANTHROPIC_API_KEY ?? "";
}

function getAnthropicClient() {
  if (anthropicClient) {
    return anthropicClient;
  }

  anthropicClient = new Anthropic({
    apiKey: getAnthropicApiKey(),
    maxRetries: 0,
    timeout: anthropicTimeoutMs,
  });

  return anthropicClient;
}

function extractResponseText(message: Message) {
  const parts: string[] = [];

  for (const block of message.content) {
    if (block.type === "text") {
      parts.push(block.text);
    }
  }

  return parts.join("\n").trim();
}

function extractJsonText(value: string) {
  const fencedMatch = value.match(/```(?:json)?\s*([\s\S]*?)```/i);

  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  const firstBrace = value.indexOf("{");
  const lastBrace = value.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("Claude response did not contain a JSON object.");
  }

  return value.slice(firstBrace, lastBrace + 1);
}

function parseClaudeSections(rawText: string) {
  const parsed = JSON.parse(extractJsonText(rawText)) as {
    sections?: Array<{
      title?: unknown;
      content?: unknown;
    }>;
  };

  if (!Array.isArray(parsed.sections)) {
    throw new Error("Claude response is missing sections.");
  }

  const sections: ReportSectionData[] = parsed.sections.map((section, index) => {
    const definition = reportSectionDefinitions[index];

    if (!definition) {
      throw new Error("Claude response returned too many sections.");
    }

    if (section.title !== definition.title) {
      throw new Error(`Claude response title mismatch at index ${index}.`);
    }

    if (typeof section.content !== "string" || section.content.trim().length < 80) {
      throw new Error(`Claude response content is too short for ${definition.title}.`);
    }

    return {
      title: definition.title,
      icon: definition.icon,
      content: section.content.trim(),
    };
  });

  if (sections.length !== reportSectionDefinitions.length) {
    throw new Error("Claude response returned the wrong number of sections.");
  }

  const yearlySection = sections[5];
  const finalSection = sections[6];
  const currentYear = getCurrentYear();

  if (!yearlySection?.content.includes(String(currentYear))) {
    throw new Error("Claude yearly section is missing the current year.");
  }

  if (!finalSection?.content.includes("본 리포트는 AI가 생성한 참고용 콘텐츠입니다.")) {
    throw new Error("Claude report is missing the required disclaimer.");
  }

  return sections;
}

async function delay(milliseconds: number) {
  await new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

export function isClaudeConfigured() {
  return Boolean(getAnthropicApiKey());
}

export async function generateClaudeReport(
  input: BirthInput,
  sajuData: SajuData,
): Promise<ReportSectionData[] | null> {
  if (!isClaudeConfigured()) {
    return null;
  }

  const client = getAnthropicClient();
  const system = buildSystemPrompt();
  const userPrompt = buildUserPrompt(input, sajuData);

  for (let retry = 0; retry <= anthropicRetryCount; retry += 1) {
    try {
      const message = await client.messages.create({
        model: anthropicModel,
        max_tokens: 2_600,
        stream: false,
        system,
        messages: [
          {
            role: "user",
            content: userPrompt,
          },
        ],
      });

      return parseClaudeSections(extractResponseText(message));
    } catch (error) {
      if (retry === anthropicRetryCount) {
        throw error;
      }

      await delay(anthropicRetryDelayMs);
    }
  }

  return null;
}
