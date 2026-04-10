import assert from "node:assert/strict";
import test from "node:test";
import { calculateSaju } from "./calculator";

test("calculates the documented 1986-05-29 00:00 fixture", () => {
  const saju = calculateSaju({
    birthYear: 1986,
    birthMonth: 5,
    birthDay: 29,
    birthHour: 0,
    gender: "female",
  });

  assert.deepEqual(saju.pillars, {
    year: { cheongan: "丙", jiji: "寅", ohaeng: "화" },
    month: { cheongan: "癸", jiji: "巳", ohaeng: "수" },
    day: { cheongan: "癸", jiji: "酉", ohaeng: "수" },
    hour: { cheongan: "壬", jiji: "子", ohaeng: "수" },
  });
  assert.deepEqual(saju.ohaengRatio, { 목: 1, 화: 2, 토: 0, 금: 1, 수: 4 });
  assert.equal(saju.ilgan, "癸");
});

test("changes year and month pillars across the 2024-02-04 입춘 boundary", () => {
  const beforeIpchun = calculateSaju({
    birthYear: 2024,
    birthMonth: 2,
    birthDay: 4,
    birthHour: 16,
    gender: "male",
  });
  const afterIpchun = calculateSaju({
    birthYear: 2024,
    birthMonth: 2,
    birthDay: 4,
    birthHour: 17,
    gender: "male",
  });

  assert.equal(beforeIpchun.pillars.year.cheongan + beforeIpchun.pillars.year.jiji, "癸卯");
  assert.equal(beforeIpchun.pillars.month.cheongan + beforeIpchun.pillars.month.jiji, "乙丑");
  assert.equal(afterIpchun.pillars.year.cheongan + afterIpchun.pillars.year.jiji, "甲辰");
  assert.equal(afterIpchun.pillars.month.cheongan + afterIpchun.pillars.month.jiji, "丙寅");
  assert.equal(afterIpchun.pillars.day.cheongan + afterIpchun.pillars.day.jiji, "戊戌");
});

test("switches to the new year and month pillars after the 1997-02-04 입춘 boundary", () => {
  const beforeIpchun = calculateSaju({
    birthYear: 1997,
    birthMonth: 2,
    birthDay: 4,
    birthHour: 0,
    gender: "female",
  });
  const afterIpchun = calculateSaju({
    birthYear: 1997,
    birthMonth: 2,
    birthDay: 4,
    birthHour: 6,
    gender: "female",
  });

  assert.equal(beforeIpchun.pillars.year.cheongan + beforeIpchun.pillars.year.jiji, "丙子");
  assert.equal(beforeIpchun.pillars.month.cheongan + beforeIpchun.pillars.month.jiji, "辛丑");
  assert.equal(afterIpchun.pillars.year.cheongan + afterIpchun.pillars.year.jiji, "丁丑");
  assert.equal(afterIpchun.pillars.month.cheongan + afterIpchun.pillars.month.jiji, "壬寅");
});

test("omits the hour pillar when birth hour is unknown", () => {
  const saju = calculateSaju({
    birthYear: 1988,
    birthMonth: 11,
    birthDay: 9,
    birthHour: null,
    gender: "male",
  });

  assert.deepEqual(saju.pillars, {
    year: { cheongan: "戊", jiji: "辰", ohaeng: "토" },
    month: { cheongan: "癸", jiji: "亥", ohaeng: "수" },
    day: { cheongan: "戊", jiji: "辰", ohaeng: "토" },
  });
  assert.equal("hour" in saju.pillars, false);
  assert.deepEqual(saju.ohaengRatio, { 목: 0, 화: 0, 토: 4, 금: 0, 수: 2 });
});
