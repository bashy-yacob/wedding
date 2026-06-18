import { describe, it, expect } from "vitest";
import {
  toHebrewDateString,
  gregorianFromHebrew,
  hebrewMonthsForYear,
  parseDateOnly,
} from "./hebcal";
import { months, HDate } from "@hebcal/core";

describe("parseDateOnly", () => {
  it("מפרק מחרוזת תאריך", () => {
    expect(parseDateOnly("2026-03-22")).toEqual({ year: 2026, month: 3, day: 22 });
  });
});

describe("gregorianFromHebrew → toHebrewDateString round-trip", () => {
  it("ממיר תאריך עברי ללועזי וחזרה", () => {
    // כ"ב באדר התשפ"ו
    const greg = gregorianFromHebrew(22, months.ADAR_I, 5786);
    const back = new HDate(new Date(`${greg}T12:00:00`));
    expect(back.getDate()).toBe(22);
    expect(back.getFullYear()).toBe(5786);
    expect(toHebrewDateString(greg)).toContain("תשפ");
  });
});

describe("hebrewMonthsForYear", () => {
  it("שנה רגילה — 12 חודשים", () => {
    // 5785 אינה מעוברת
    expect(hebrewMonthsForYear(5785)).toHaveLength(12);
  });

  it("שנה מעוברת — 13 חודשים (אדר א' ואדר ב')", () => {
    // 5787 מעוברת (5787 mod 19 = 11)
    const list = hebrewMonthsForYear(5787);
    expect(list).toHaveLength(13);
    expect(list.some((m) => m.value === months.ADAR_I)).toBe(true);
    expect(list.some((m) => m.value === months.ADAR_II)).toBe(true);
  });
});
