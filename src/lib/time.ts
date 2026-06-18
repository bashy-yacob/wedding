// ============================================================================
// time.ts — חישוב הספירה והמעבר ל"מזל טוב", מעוגן לזמן ישראל.
// אזור הזמן Asia/Jerusalem מטופל אוטומטית (כולל מעבר שעון קיץ/חורף),
// כך שכל הצופים — בכל מקום בעולם — רואים את אותו זמן שנותר.
// ============================================================================

const IL_TZ = "Asia/Jerusalem";

/** ההיסט (במילישניות) של אזור הזמן ביחס ל-UTC ברגע נתון. */
function tzOffsetMs(instant: number, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = dtf.formatToParts(new Date(instant));
  const get = (type: string) =>
    parseInt(parts.find((p) => p.type === type)!.value, 10);
  let hour = get("hour");
  if (hour === 24) hour = 0; // חלק מהמנועים מחזירים 24 בחצות
  const asUTC = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    hour,
    get("minute"),
    get("second"),
  );
  return asUTC - instant;
}

/** ממיר שעון-קיר ישראלי (שנה/חודש/יום/שעה/דקה) ל-UTC epoch ms. */
export function israelWallTimeToEpoch(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
): number {
  // ניחוש ראשוני כאילו הזמן ב-UTC, ואז תיקון לפי ההיסט בפועל.
  const guess = Date.UTC(year, month - 1, day, hour, minute);
  const offset = tzOffsetMs(guess, IL_TZ);
  // איטרציה שנייה לדיוק על גבול מעבר שעון.
  const refined = guess - offset;
  const offset2 = tzOffsetMs(refined, IL_TZ);
  return guess - offset2;
}

export type CountdownStatus = "countdown" | "mazaltov" | "after";

export interface CountdownState {
  status: CountdownStatus;
  /** קיים רק במצב "countdown" */
  remaining?: {
    total: number; // מילישניות
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}

function splitRemaining(totalMs: number) {
  const total = Math.max(0, totalMs);
  const days = Math.floor(total / 86_400_000);
  const hours = Math.floor((total % 86_400_000) / 3_600_000);
  const minutes = Math.floor((total % 3_600_000) / 60_000);
  const seconds = Math.floor((total % 60_000) / 1000);
  return { total, days, hours, minutes, seconds };
}

interface CountdownInput {
  weddingDate: string; // 'YYYY-MM-DD'
  weddingTime?: string | null; // 'HH:MM' | 'HH:MM:SS' | null
  now?: number; // epoch ms — ניתן להזרקה לבדיקות
}

/**
 * מצב הספירה ברגע נתון:
 * - לפני יום החתונה → "countdown" עם הזמן שנותר עד מועד החתונה.
 * - במהלך יום החתונה כולו (לפי ישראל) → "mazaltov".
 * - אחרי יום החתונה → "after" (נשאר חגיגי).
 */
export function getCountdownState(input: CountdownInput): CountdownState {
  const now = input.now ?? Date.now();
  const [y, mo, d] = input.weddingDate.split("-").map((n) => parseInt(n, 10));

  let hour = 0;
  let minute = 0;
  if (input.weddingTime) {
    const [h, m] = input.weddingTime.split(":").map((n) => parseInt(n, 10));
    hour = h;
    minute = m;
  }

  const dayStart = israelWallTimeToEpoch(y, mo, d, 0, 0);
  const nextDayStart = israelWallTimeToEpoch(y, mo, d + 1, 0, 0);
  const target = israelWallTimeToEpoch(y, mo, d, hour, minute);

  if (now >= nextDayStart) {
    return { status: "after" };
  }
  if (now >= dayStart) {
    return { status: "mazaltov" };
  }
  return { status: "countdown", remaining: splitRemaining(target - now) };
}
