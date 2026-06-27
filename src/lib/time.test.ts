import { describe, it, expect } from "vitest";
import { getCountdownState, israelWallTimeToEpoch } from "./time";

describe("israelWallTimeToEpoch", () => {
  it("מטפל בשעון חורף (IST, +2) בינואר", () => {
    // 15 בינואר 2026, 12:00 בישראל = 10:00 UTC
    const epoch = israelWallTimeToEpoch(2026, 1, 15, 12, 0);
    expect(new Date(epoch).toISOString()).toBe("2026-01-15T10:00:00.000Z");
  });

  it("מטפל בשעון קיץ (IDT, +3) ביולי", () => {
    // 15 ביולי 2026, 12:00 בישראל = 09:00 UTC
    const epoch = israelWallTimeToEpoch(2026, 7, 15, 12, 0);
    expect(new Date(epoch).toISOString()).toBe("2026-07-15T09:00:00.000Z");
  });
});

describe("getCountdownState", () => {
  const weddingDate = "2026-07-15";

  it("לפני יום החתונה → ספירה", () => {
    const now = israelWallTimeToEpoch(2026, 7, 10, 12, 0);
    const state = getCountdownState({ weddingDate, weddingTime: "19:00", now });
    expect(state.status).toBe("countdown");
    expect(state.remaining!.days).toBeGreaterThanOrEqual(4);
  });

  it("ביום החתונה אך לפני השעה → עדיין ספירה (פחות מיממה)", () => {
    const now = israelWallTimeToEpoch(2026, 7, 15, 9, 0);
    const state = getCountdownState({ weddingDate, weddingTime: "19:00", now });
    expect(state.status).toBe("countdown");
    expect(state.remaining!.days).toBe(0);
    expect(state.remaining!.hours).toBe(10);
  });

  it("ביום החתונה אחרי השעה → מזל טוב", () => {
    const now = israelWallTimeToEpoch(2026, 7, 15, 20, 0);
    const state = getCountdownState({ weddingDate, weddingTime: "19:00", now });
    expect(state.status).toBe("mazaltov");
  });

  it("ללא שעה — היום כולו מזל טוב (התנהגות שמורה)", () => {
    const now = israelWallTimeToEpoch(2026, 7, 15, 9, 0);
    const state = getCountdownState({ weddingDate, weddingTime: null, now });
    expect(state.status).toBe("mazaltov");
  });

  it("ספירה של פחות מיממה עד הבוקר פועלת", () => {
    // האירוע מחר ב-08:00, ועכשיו אתמול בערב — כ-13 שעות לפני.
    const now = israelWallTimeToEpoch(2026, 7, 14, 19, 0);
    const state = getCountdownState({
      weddingDate: "2026-07-15",
      weddingTime: "08:00",
      now,
    });
    expect(state.status).toBe("countdown");
    expect(state.remaining!.days).toBe(0);
    expect(state.remaining!.hours).toBe(13);
  });

  it("אחרי יום החתונה → after", () => {
    const now = israelWallTimeToEpoch(2026, 7, 16, 1, 0);
    const state = getCountdownState({ weddingDate, weddingTime: "19:00", now });
    expect(state.status).toBe("after");
  });

  it("רגע לפני חצות יום החתונה עדיין ספירה", () => {
    const now = israelWallTimeToEpoch(2026, 7, 14, 23, 59);
    const state = getCountdownState({ weddingDate, weddingTime: "19:00", now });
    expect(state.status).toBe("countdown");
    expect(state.remaining!.total).toBeGreaterThan(0);
  });
});
