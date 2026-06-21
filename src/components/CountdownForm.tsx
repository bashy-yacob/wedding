"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ThemePicker } from "@/components/ThemePicker";
import { HebrewDateInput, type HebrewDateValue } from "@/components/HebrewDateInput";
import { CountdownPreview } from "@/components/CountdownPreview";
import { InvitationUpload } from "@/components/InvitationUpload";
import { DEFAULT_THEME, type ThemeKey } from "@/lib/themes";
import { gregorianFromHebrew, currentHebrewYear } from "@/lib/hebcal";
import { months } from "@hebcal/core";

// מצב הטופס משותף ליצירה ולעריכה — שתי ה-Server Actions מחזירות אותו מבנה.
export interface CountdownFormState {
  error?: string;
}

type FormAction = (
  prev: CountdownFormState,
  formData: FormData,
) => Promise<CountdownFormState>;

export interface CountdownFormInitial {
  eventType: string;
  displayNames: string;
  weddingDate: string; // לועזי 'YYYY-MM-DD' (מקור האמת ב-DB)
  weddingTime: string; // 'HH:MM'
  blessing: string;
  theme: ThemeKey;
  showGregorian: boolean;
  allowBlessings: boolean;
  invitationPath: string | null;
  invitationPreview: string | null;
}

interface CountdownFormProps {
  action: FormAction;
  heading: string;
  submitLabel: string;
  pendingLabel: string;
  /** ערכים התחלתיים — לעריכה בלבד. בהיעדרם הטופס ריק (יצירה). */
  initial?: CountdownFormInitial;
  /** מפתח העריכה — נשלח כשדה נסתר במצב עריכה בלבד. */
  editToken?: string;
}

const fieldClass =
  "w-full rounded-xl border border-[var(--accent)]/25 bg-[var(--surface)]/70 px-4 py-3 text-[var(--text)] outline-none backdrop-blur-sm transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20";
const labelClass = "mb-2 block text-sm font-medium";

export function CountdownForm({
  action,
  heading,
  submitLabel,
  pendingLabel,
  initial,
  editToken,
}: CountdownFormProps) {
  const isEdit = Boolean(editToken);

  const [state, formAction, pending] = useActionState<CountdownFormState, FormData>(
    action,
    {},
  );

  const [theme, setTheme] = useState<ThemeKey>(initial?.theme ?? DEFAULT_THEME);
  // בעריכה מציגים את התאריך הלועזי השמור (מקור האמת); אפשר לעבור ללוח עברי בכל עת.
  const [dateMode, setDateMode] = useState<"greg" | "hebrew">(
    initial ? "greg" : "hebrew",
  );
  const [gregDate, setGregDate] = useState(initial?.weddingDate ?? "");
  const [hebDate, setHebDate] = useState<HebrewDateValue>({
    day: 1,
    month: months.TISHREI,
    year: currentHebrewYear(),
  });

  // שדות נשלטים שמזינים את התצוגה המקדימה החיה
  const [eventType, setEventType] = useState(initial?.eventType ?? "חתונה");
  const [displayNames, setDisplayNames] = useState(initial?.displayNames ?? "");
  const [weddingTime, setWeddingTime] = useState(initial?.weddingTime ?? "");
  const [blessing, setBlessing] = useState(initial?.blessing ?? "");
  const [showGregorian, setShowGregorian] = useState(initial?.showGregorian ?? true);
  const [allowBlessings, setAllowBlessings] = useState(
    initial?.allowBlessings ?? true,
  );
  const [invitationPath, setInvitationPath] = useState<string | null>(
    initial?.invitationPath ?? null,
  );
  const [invitationPreview, setInvitationPreview] = useState<string | null>(
    initial?.invitationPreview ?? null,
  );

  // הערך הלועזי שיישמר ב-DB (גם כשמזינים בלוח עברי)
  const weddingDate =
    dateMode === "greg"
      ? gregDate
      : gregorianFromHebrew(hebDate.day, hebDate.month, hebDate.year);

  return (
    <main data-theme={theme} className="bg-animated min-h-screen">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <Link href="/" className="text-sm text-[var(--muted)] hover:text-[var(--accent)]">
          → חזרה
        </Link>

        <h1 className="font-display accent-gradient-text mt-4 mb-8 text-3xl font-extrabold sm:text-4xl">
          {heading}
        </h1>

        <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
          {/* ----------------------------- הטופס ----------------------------- */}
          <form action={formAction} className="space-y-6">
            {editToken && (
              <input type="hidden" name="edit_token" value={editToken} />
            )}

            <div>
              <label htmlFor="event_type" className={labelClass}>
                סוג האירוע
              </label>
              <input
                id="event_type"
                name="event_type"
                maxLength={30}
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                placeholder="חתונה"
                className={fieldClass}
              />
              <p className="mt-2 text-xs text-[var(--muted)]">
                קובע את השורה הראשונה: &quot;הספירה ל{eventType || "חתונה"} של…&quot;.
                למשל: בר מצווה, ברית, יום הולדת.
              </p>
            </div>

            <div>
              <label htmlFor="display_names" className={labelClass}>
                שמות או כיתוב
              </label>
              <input
                id="display_names"
                name="display_names"
                required
                maxLength={80}
                value={displayNames}
                onChange={(e) => setDisplayNames(e.target.value)}
                placeholder="לדוגמה: חיים ושרה"
                className={fieldClass}
              />
            </div>

            <div>
              <label className={labelClass}>תאריך החתונה</label>
              <div className="mb-3 inline-flex rounded-xl border border-[var(--accent)]/25 p-1 text-sm">
                <button
                  type="button"
                  onClick={() => setDateMode("greg")}
                  className={`rounded-lg px-4 py-1.5 transition ${
                    dateMode === "greg"
                      ? "bg-[var(--accent)] text-[var(--on-accent)]"
                      : "text-[var(--muted)]"
                  }`}
                >
                  לועזי
                </button>
                <button
                  type="button"
                  onClick={() => setDateMode("hebrew")}
                  className={`rounded-lg px-4 py-1.5 transition ${
                    dateMode === "hebrew"
                      ? "bg-[var(--accent)] text-[var(--on-accent)]"
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

              <input type="hidden" name="wedding_date" value={weddingDate} />
            </div>

            <div>
              <label htmlFor="wedding_time" className={labelClass}>
                שעה (אופציונלי)
              </label>
              <input
                id="wedding_time"
                name="wedding_time"
                type="time"
                value={weddingTime}
                onChange={(e) => setWeddingTime(e.target.value)}
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor="blessing" className={labelClass}>
                הודעת ברכה (אופציונלי)
              </label>
              <textarea
                id="blessing"
                name="blessing"
                maxLength={280}
                rows={3}
                value={blessing}
                onChange={(e) => setBlessing(e.target.value)}
                placeholder="בשעה טובה ומוצלחת!"
                className={fieldClass}
              />
            </div>

            <div>
              <label className={labelClass}>הזמנת החתונה (אופציונלי)</label>
              <InvitationUpload
                previewUrl={invitationPreview}
                onChange={(path, preview) => {
                  setInvitationPath(path);
                  setInvitationPreview(preview);
                }}
              />
              <input
                type="hidden"
                name="invitation_path"
                value={invitationPath ?? ""}
              />
            </div>

            <div>
              <label className={labelClass}>ערכת עיצוב</label>
              <ThemePicker value={theme} onChange={setTheme} />
              <input type="hidden" name="theme" value={theme} />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="show_gregorian"
                  checked={showGregorian}
                  onChange={(e) => setShowGregorian(e.target.checked)}
                  className="h-5 w-5 accent-[var(--accent)]"
                />
                <span className="text-sm">הצגת תאריך לועזי קטן לצד העברי</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="allow_blessings"
                  checked={allowBlessings}
                  onChange={(e) => setAllowBlessings(e.target.checked)}
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

            {!isEdit && (
              <p className="text-xs text-[var(--muted)]">
                לאחר היצירה תקבלו קישור עריכה אישי — כך תוכלו לעדכן פרטים או להוסיף
                את ההזמנה גם מאוחר יותר. שמרו אותו!
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-full bg-[var(--accent)] px-8 py-4 text-lg font-semibold text-[var(--on-accent)] shadow-lg shadow-[var(--accent)]/30 transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50"
            >
              {pending ? pendingLabel : submitLabel}
            </button>
          </form>

          {/* ------------------------ תצוגה מקדימה חיה ------------------------ */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <p className="mb-3 text-center text-sm text-[var(--muted)]">
              תצוגה מקדימה
            </p>
            <CountdownPreview
              eventType={eventType}
              displayNames={displayNames}
              weddingDate={weddingDate}
              weddingTime={weddingTime}
              blessing={blessing}
              theme={theme}
              showGregorian={showGregorian}
              invitationPreview={invitationPreview}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
