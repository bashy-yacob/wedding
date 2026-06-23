import { describe, it, expect } from "vitest";
import { googleCalendarUrl, icsDataUrl, type CalendarEventInput } from "./calendar";

// URLSearchParams מקודד רווח כ-"+" (תקני, ו-Google מפענח אותו כרווח).
// לבדיקת הטקסט מפענחים גם את ה-"+" חזרה לרווח.
const decodeParams = (url: string) => decodeURIComponent(url.replace(/\+/g, "%20"));

const base: CalendarEventInput = {
  slug: "abc123",
  displayNames: "דנה ויוסי",
  eventType: "חתונה",
  weddingDate: "2026-08-15",
  weddingTime: "19:00:00",
  hebrewDate: "כ״ב באב התשפ״ו",
  url: "https://example.com/c/abc123",
};

describe("googleCalendarUrl", () => {
  it("אירוע עם שעה — טווח 4 שעות ואזור זמן ישראל", () => {
    const url = googleCalendarUrl(base);
    expect(url).toContain("dates=20260815T190000%2F20260815T230000");
    expect(url).toContain("ctz=Asia%2FJerusalem");
    expect(decodeParams(url)).toContain("החתונה של דנה ויוסי");
  });

  it("חוצה חצות — הסיום עובר ליום שלמחרת", () => {
    const url = googleCalendarUrl({ ...base, weddingTime: "22:00:00" });
    expect(url).toContain("dates=20260815T220000%2F20260816T020000");
  });

  it("בלי שעה — אירוע ליום שלם (סיום בלעדי למחרת, בלי ctz)", () => {
    const url = googleCalendarUrl({ ...base, weddingTime: null });
    expect(url).toContain("dates=20260815%2F20260816");
    expect(url).not.toContain("ctz=");
  });

  it("סוג אירוע שאינו חתונה מקבל ניסוח כללי", () => {
    const url = googleCalendarUrl({ ...base, eventType: "חינה" });
    expect(decodeParams(url)).toContain("החינה של דנה ויוסי");
  });
});

describe("icsDataUrl", () => {
  it("מייצר ICS תקין עם TZID ישראלי לאירוע עם שעה", () => {
    const ics = decodeURIComponent(icsDataUrl(base).split(",")[1]);
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("DTSTART;TZID=Asia/Jerusalem:20260815T190000");
    expect(ics).toContain("DTEND;TZID=Asia/Jerusalem:20260815T230000");
    expect(ics).toContain("UID:abc123@ad-hachatuna");
  });

  it("אירוע ליום שלם משתמש ב-VALUE=DATE", () => {
    const ics = decodeURIComponent(icsDataUrl({ ...base, weddingTime: null }).split(",")[1]);
    expect(ics).toContain("DTSTART;VALUE=DATE:20260815");
    expect(ics).toContain("DTEND;VALUE=DATE:20260816");
  });
});
