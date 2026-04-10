"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import type { Gender } from "@/lib/saju/types";
import { LoadingTips } from "./LoadingTips";
import type { GenerateReportResponse } from "@/types";

const genderOptions: { label: string; value: Gender }[] = [
  { label: "여", value: "female" },
  { label: "남", value: "male" },
];

interface FormState {
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  birthHour: string;
  gender: Gender | "";
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1899 }, (_, index) => String(currentYear - index));
const months = Array.from({ length: 12 }, (_, index) => String(index + 1));
const days = Array.from({ length: 31 }, (_, index) => String(index + 1));
const hours = Array.from({ length: 24 }, (_, index) => String(index));

export function BirthInputForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormState>({
    birthYear: "1990",
    birthMonth: "3",
    birthDay: "15",
    birthHour: "",
    gender: "female",
  });

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/report/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          birthYear: Number(form.birthYear),
          birthMonth: Number(form.birthMonth),
          birthDay: Number(form.birthDay),
          birthHour: form.birthHour === "" ? null : Number(form.birthHour),
          gender: form.gender,
        }),
      });

      const payload = (await response.json()) as GenerateReportResponse;

      if (!response.ok || !payload.ok || !payload.reportId) {
        setError(payload.error ?? "사주를 읽는 중 문제가 생겼습니다. 다시 시도해 주세요.");
        return;
      }

      startTransition(() => {
        router.push(`/report/${payload.reportId}`);
      });
    } catch {
      setError("사주를 읽는 중 문제가 생겼습니다. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-3">
          <SelectField
            label="태어난 연도"
            onChange={(value) => updateField("birthYear", value)}
            options={years}
            value={form.birthYear}
          />
          <SelectField
            label="월"
            onChange={(value) => updateField("birthMonth", value)}
            options={months}
            value={form.birthMonth}
          />
          <SelectField
            label="일"
            onChange={(value) => updateField("birthDay", value)}
            options={days}
            value={form.birthDay}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
          <SelectField
            label="태어난 시간"
            onChange={(value) => updateField("birthHour", value)}
            options={hours}
            placeholder="모름"
            value={form.birthHour}
          />
          <div className="space-y-2">
            <p className="text-sm text-silverSand">성별</p>
            <div className="flex min-h-11 rounded-full border border-gold/20 bg-inputBg/80 p-1">
              {genderOptions.map((option) => {
                const active = form.gender === option.value;

                return (
                  <button
                    className={`min-h-11 flex-1 rounded-full px-5 text-sm transition ${
                      active ? "bg-gold text-deepNight" : "text-silverSand hover:text-parchment"
                    }`}
                    key={option.value}
                    onClick={() => updateField("gender", option.value)}
                    type="button"
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {error ? <p className="text-sm text-[#e8b6a8]">{error}</p> : null}

        <button
          className="min-h-11 w-full rounded-full bg-gradient-to-r from-gold to-[#a0845a] px-6 py-4 font-medium text-deepNight transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting || isPending}
          type="submit"
        >
          {isSubmitting || isPending ? "사주를 읽는 중..." : "사주 보기"}
        </button>
      </form>

      {isSubmitting ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-deepNight/88 px-6 backdrop-blur-sm">
          <div className="rounded-[32px] border border-gold/20 bg-midnight/92 px-8 py-10 gold-outline">
            <LoadingTips />
          </div>
        </div>
      ) : null}
    </>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  options: string[];
  placeholder?: string;
  onChange: (value: string) => void;
}

function SelectField({ label, value, options, placeholder, onChange }: SelectFieldProps) {
  return (
    <label className="space-y-2">
      <span className="text-sm text-silverSand">{label}</span>
      <select
        className="min-h-11 w-full rounded-2xl border border-[rgba(232,224,208,0.15)] bg-inputBg px-4 py-3 text-parchment outline-none transition focus:border-gold"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
