import { HDate, months } from "@hebcal/core";

// ============================================================================
// hebcal.ts — המרה ותצוגה של תאריכים עבריים/לועזיים.
// isomorphic: אותו קוד רץ בדף, בטופס וב-OG image.
// כלל-על: ב-DB נשמר תמיד התאריך הלועזי (wedding_date). העברי נגזר בתצוגה.
// ============================================================================

/** מפרק מחרוזת 'YYYY-MM-DD' (מה-DB) לחלקים, ללא תלות באזור-זמן. */
export function parseDateOnly(value: string): {
  year: number;
  month: number;
  day: number;
} {
  const [year, month, day] = value.split("-").map((n) => parseInt(n, 10));
  return { year, month, day };
}

/** בונה HDate מתאריך לועזי (חלקים), בצהריים מקומי כדי להימנע מקצוות DST. */
function hdateFromGregorianParts(year: number, month: number, day: number): HDate {
  return new HDate(new Date(year, month - 1, day, 12, 0, 0));
}

/** התאריך העברי כראשי — לדוגמה: "כ״ב בְּאֲדָר תשפ״ו" */
export function toHebrewDateString(value: string): string {
  const { year, month, day } = parseDateOnly(value);
  return hdateFromGregorianParts(year, month, day).renderGematriya();
}

/** התאריך הלועזי בעברית — לדוגמה: "22 במרץ 2026" */
export function toGregorianString(value: string): string {
  const { year, month, day } = parseDateOnly(value);
  return new Intl.DateTimeFormat("he-IL", { dateStyle: "long" }).format(
    new Date(year, month - 1, day),
  );
}

/** ממיר תאריך עברי (יום/חודש/שנה) לתאריך לועזי בפורמט 'YYYY-MM-DD'. */
export function gregorianFromHebrew(
  day: number,
  month: number,
  year: number,
): string {
  const greg = new HDate(day, month, year).greg();
  const y = greg.getFullYear();
  const m = String(greg.getMonth() + 1).padStart(2, "0");
  const d = String(greg.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** השנה העברית הנוכחית (לברירת-מחדל בטופס). */
export function currentHebrewYear(): number {
  return new HDate().getFullYear();
}

export interface HebrewMonthOption {
  value: number; // מספר החודש לפי hebcal
  label: string; // שם החודש בעברית
}

/**
 * רשימת חודשים עבריים לשנה נתונה, בסדר התצוגה (תשרי → אלול).
 * מטפל באדר א'/ב' בשנה מעוברת אוטומטית לפי מספר החודשים בשנה.
 */
export function hebrewMonthsForYear(year: number): HebrewMonthOption[] {
  const isLeap = new HDate(1, months.TISHREI, year).isLeapYear();
  // סדר תצוגה טבעי המתחיל בתשרי
  const order = isLeap
    ? [
        months.TISHREI,
        months.CHESHVAN,
        months.KISLEV,
        months.TEVET,
        months.SHVAT,
        months.ADAR_I,
        months.ADAR_II,
        months.NISAN,
        months.IYYAR,
        months.SIVAN,
        months.TAMUZ,
        months.AV,
        months.ELUL,
      ]
    : [
        months.TISHREI,
        months.CHESHVAN,
        months.KISLEV,
        months.TEVET,
        months.SHVAT,
        months.ADAR_I, // בשנה רגילה זהו "אדר"
        months.NISAN,
        months.IYYAR,
        months.SIVAN,
        months.TAMUZ,
        months.AV,
        months.ELUL,
      ];

  return order.map((m) => ({
    value: m,
    label: HDate.getMonthName(m, year),
  }));
}

/** מספר הימים בחודש עברי נתון (29 או 30). */
export function hebrewDaysInMonth(month: number, year: number): number {
  return HDate.daysInMonth(month, year);
}
