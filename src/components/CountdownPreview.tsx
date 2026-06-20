"use client";

import { useEffect, useState } from "react";
import { getCountdownState, type CountdownState } from "@/lib/time";
import { toHebrewDateString, toGregorianString } from "@/lib/hebcal";
import { CountdownDisplay } from "./CountdownDisplay";
import { Divider } from "./Ornaments";
import type { ThemeKey } from "@/lib/themes";

interface CountdownPreviewProps {
  displayNames: string;
  weddingDate: string; // 'YYYY-MM-DD' | ''
  weddingTime: string; // 'HH:MM' | ''
  blessing: string;
  theme: ThemeKey;
  showGregorian: boolean;
}

function isValidDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function CountdownPreview({
  displayNames,
  weddingDate,
  weddingTime,
  blessing,
  theme,
  showGregorian,
}: CountdownPreviewProps) {
  const valid = isValidDate(weddingDate);

  const [state, setState] = useState<CountdownState | null>(null);

  useEffect(() => {
    if (!valid) {
      setState(null);
      return;
    }
    const tick = () =>
      setState(getCountdownState({ weddingDate, weddingTime: weddingTime || null }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [valid, weddingDate, weddingTime]);

  return (
    <div data-theme={theme} className="bg-animated rounded-3xl p-1">
      <div className="surface-card rounded-[1.4rem] px-5 py-8 text-center">
        <p className="text-xs text-[var(--muted)]">הספירה לחתונה של</p>
        <p className="font-display accent-gradient-text mt-1 mb-5 text-2xl font-extrabold">
          {displayNames || "השמות שלכם"}
        </p>

        {valid && state ? (
          <>
            {state.status === "countdown" ? (
              <CountdownDisplay
                days={state.remaining!.days}
                hours={state.remaining!.hours}
                minutes={state.remaining!.minutes}
                seconds={state.remaining!.seconds}
                compact
              />
            ) : (
              <p className="accent-gradient-text font-display text-3xl font-extrabold">
                מזל טוב! 🎉
              </p>
            )}

            <Divider className="my-5" />

            <p className="font-display text-lg font-bold">
              {toHebrewDateString(weddingDate)}
            </p>
            {showGregorian && (
              <p className="mt-0.5 text-xs text-[var(--muted)]">
                {toGregorianString(weddingDate)}
              </p>
            )}
          </>
        ) : (
          <p className="py-6 text-sm text-[var(--muted)]">
            בחרו תאריך כדי לראות את הספירה
          </p>
        )}

        {blessing && (
          <p className="font-display mt-5 text-sm text-[var(--text)]">
            {blessing}
          </p>
        )}
      </div>
    </div>
  );
}
