// ============================================================================
// calendar.ts — בניית קישור "הוספה ליומן" לאירוע.
// שני יעדים: Google Calendar (קישור TEMPLATE) ו-קובץ ICS (Apple / Outlook),
// שניהם נבנים בצד השרת כך שאין צורך ב-JS בלקוח (קישור רגיל + data-URL).
// הזמן הוא שעון-קיר ישראלי (Asia/Jerusalem) — אותו זמן שהיוצר/ת הזינו.
// ============================================================================

const IL_TZ = "Asia/Jerusalem";
// משך ברירת מחדל לאירוע עם שעה (שעות) — כדי שביומן יופיע בלוק הגיוני.
const DEFAULT_DURATION_HOURS = 4;

export interface CalendarEventInput {
  slug: string;
  displayNames: string;
  eventType: string; // "חתונה" / "חינה" / ...
  weddingDate: string; // 'YYYY-MM-DD'
  weddingTime: string | null; // 'HH:MM' | 'HH:MM:SS' | null
  hebrewDate: string; // לתיאור האירוע
  url: string; // קישור לעמוד הספירה
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function eventTitle(displayNames: string, eventType: string): string {
  return eventType === "חתונה"
    ? `החתונה של ${displayNames}`
    : `ה${eventType} של ${displayNames}`;
}

// פירוק wall-time ל-epoch לצורך *חשבון רכיבים* בלבד (לא המרת אזור זמן):
// משתמשים ב-UTC כמחסן ניטרלי, ואז קוראים את הרכיבים בחזרה כשעון-קיר.
function wallParts(weddingDate: string, weddingTime: string | null) {
  const [y, mo, d] = weddingDate.split("-").map(Number);
  const [hh = 0, mm = 0] = (weddingTime ?? "").split(":").map(Number);
  return { y, mo, d, hh, mm };
}

function stampDateTime(ms: number): string {
  const dt = new Date(ms);
  return (
    `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}` +
    `T${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}00`
  );
}

function stampDate(ms: number): string {
  const dt = new Date(ms);
  return `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}`;
}

// בריחה לטקסט בתוך ICS (פסיק/נקודה-פסיק/קו-נטוי/שורה חדשה).
function escapeICS(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

interface BuiltTimes {
  allDay: boolean;
  start: string; // YYYYMMDD או YYYYMMDDTHHMMSS
  end: string;
}

function buildTimes(input: CalendarEventInput): BuiltTimes {
  const { y, mo, d, hh, mm } = wallParts(input.weddingDate, input.weddingTime);

  if (input.weddingTime) {
    const startMs = Date.UTC(y, mo - 1, d, hh, mm);
    const endMs = startMs + DEFAULT_DURATION_HOURS * 3_600_000;
    return { allDay: false, start: stampDateTime(startMs), end: stampDateTime(endMs) };
  }

  // אירוע ליום שלם — סיום (בלעדי) הוא היום שלמחרת.
  const startMs = Date.UTC(y, mo - 1, d);
  const endMs = startMs + 86_400_000;
  return { allDay: true, start: stampDate(startMs), end: stampDate(endMs) };
}

function description(input: CalendarEventInput): string {
  return `${input.hebrewDate}\nלצפייה בספירה לאחור: ${input.url}`;
}

/** קישור Google Calendar שפותח טופס אירוע מוכן. */
export function googleCalendarUrl(input: CalendarEventInput): string {
  const t = buildTimes(input);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: eventTitle(input.displayNames, input.eventType),
    dates: `${t.start}/${t.end}`,
    details: description(input),
  });
  // לאירוע עם שעה — מציינים את אזור הזמן הישראלי כדי שיוצג נכון לכולם.
  if (!t.allDay) params.set("ctz", IL_TZ);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** תוכן קובץ ICS (Apple Calendar / Outlook) כ-data-URL להורדה ישירה. */
export function icsDataUrl(input: CalendarEventInput): string {
  const t = buildTimes(input);
  const title = eventTitle(input.displayNames, input.eventType);
  const now = stampDateTime(Date.now()) + "Z";

  const dtStart = t.allDay
    ? `DTSTART;VALUE=DATE:${t.start}`
    : `DTSTART;TZID=${IL_TZ}:${t.start}`;
  const dtEnd = t.allDay
    ? `DTEND;VALUE=DATE:${t.end}`
    : `DTEND;TZID=${IL_TZ}:${t.end}`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//עד החתונה//countdown//HE",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${input.slug}@ad-hachatuna`,
    `DTSTAMP:${now}`,
    dtStart,
    dtEnd,
    `SUMMARY:${escapeICS(title)}`,
    `DESCRIPTION:${escapeICS(description(input))}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  const ics = lines.join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}
