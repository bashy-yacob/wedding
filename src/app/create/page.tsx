"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { createCountdown, type CreateState } from "./actions";
import { ThemePicker } from "@/components/ThemePicker";
import { HebrewDateInput, type HebrewDateValue } from "@/components/HebrewDateInput";
import { DEFAULT_THEME, type ThemeKey } from "@/lib/themes";
import { gregorianFromHebrew, currentHebrewYear } from "@/lib/hebcal";
import { months } from "@hebcal/core";

const fieldClass =
  "w-full rounded-xl border border-black/10 bg-[var(--surface)] px-4 py-3 text-[var(--text)] outline-none focus:border-[var(--accent)]";
const labelClass = "mb-2 block text-sm font-medium";

export default function CreatePage() {
  const [state, formAction, pending] = useActionState<CreateState, FormData>(
    createCountdown,
    {},
  );

  const [theme, setTheme] = useState<ThemeKey>(DEFAULT_THEME);
  const [dateMode, setDateMode] = useState<"greg" | "hebrew">("greg");
  const [gregDate, setGregDate] = useState("");
  const [hebDate, setHebDate] = useState<HebrewDateValue>({
    day: 1,
    month: months.TISHREI,
    year: currentHebrewYear(),
  });

  // הערך הלועזי שיישמר ב-DB (גם כשמזינים בלוח עברי)
  const weddingDate =
    dateMode === "greg"
      ? gregDate
      : gregorianFromHebrew(hebDate.day, hebDate.month, hebDate.year);

  return (
    <main data-theme={theme} className="min-h-screen">
      <div className="mx-auto max-w-xl px-6 py-12">
        <Link href="/" className="text-sm text-[var(--muted)]">
          → חזרה
        </Link>

        <h1 className="font-display mt-4 mb-8 text-3xl font-bold">
          יצירת ספירה
        </h1>

        <form action={formAction} className="space-y-6">
          {/* שמות / כיתוב */}
          <div>
            <label htmlFor="display_names" className={labelClass}>
              שמות או כיתוב
            </label>
            <input
              id="display_names"
              name="display_names"
              required
              maxLength={80}
              placeholder="לדוגמה: חיים ושרה"
              className={fieldClass}
            />
          </div>

          {/* בורר לוח תאריך */}
          <div>
            <label className={labelClass}>תאריך החתונה</label>
            <div className="mb-3 inline-flex rounded-xl border border-black/10 p-1 text-sm">
              <button
                type="button"
                onClick={() => setDateMode("greg")}
                className={`rounded-lg px-4 py-1.5 ${
                  dateMode === "greg"
                    ? "bg-[var(--accent)] text-white"
                    : "text-[var(--muted)]"
                }`}
              >
                לועזי
              </button>
              <button
                type="button"
                onClick={() => setDateMode("hebrew")}
                className={`rounded-lg px-4 py-1.5 ${
                  dateMode === "hebrew"
                    ? "bg-[var(--accent)] text-white"
                    : "text-[var(--muted)]"
                }`}
              >
                עברי
              </button>
            </div>

            {dateMode === "greg" ? (
              <input
                type="date"
                value={gregDate}
                onChange={(e) => setGregDate(e.target.value)}
                required
                className={fieldClass}
              />
            ) : (
              <HebrewDateInput value={hebDate} onChange={setHebDate} />
            )}

            {/* הערך הלועזי שנשלח בפועל */}
            <input type="hidden" name="wedding_date" value={weddingDate} />
          </div>

          {/* שעה */}
          <div>
            <label htmlFor="wedding_time" className={labelClass}>
              שעה (אופציונלי)
            </label>
            <input
              id="wedding_time"
              name="wedding_time"
              type="time"
              className={fieldClass}
            />
          </div>

          {/* ברכה */}
          <div>
            <label htmlFor="blessing" className={labelClass}>
              הודעת ברכה (אופציונלי)
            </label>
            <textarea
              id="blessing"
              name="blessing"
              maxLength={280}
              rows={3}
              placeholder="בשעה טובה ומוצלחת!"
              className={fieldClass}
            />
          </div>

          {/* עיצוב */}
          <div>
            <label className={labelClass}>ערכת עיצוב</label>
            <ThemePicker value={theme} onChange={setTheme} />
            <input type="hidden" name="theme" value={theme} />
          </div>

          {/* אפשרויות */}
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="show_gregorian"
                defaultChecked
                className="h-5 w-5 accent-[var(--accent)]"
              />
              <span className="text-sm">הצגת תאריך לועזי קטן לצד העברי</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="allow_blessings"
                defaultChecked
                className="h-5 w-5 accent-[var(--accent)]"
              />
              <span className="text-sm">לאפשר קיר ברכות</span>
            </label>
          </div>

          {state.error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {state.error}
            </p>
          )}

          <p className="text-xs text-[var(--muted)]">
            שימו לב: לאחר היצירה לא ניתן לערוך. מי שרוצה שינוי פשוט יוצר ספירה חדשה.
          </p>

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-[var(--accent)] px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:opacity-90 disabled:opacity-50"
          >
            {pending ? "יוצר..." : "צרו את הספירה"}
          </button>
        </form>
      </div>
    </main>
  );
}
