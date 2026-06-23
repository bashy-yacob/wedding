"use client";

import { useEffect, useState } from "react";
import { getCountdownState, type CountdownState } from "@/lib/time";
import { toHebrewDateString, toGregorianString } from "@/lib/hebcal";
import { CountdownDisplay } from "./CountdownDisplay";
import { Divider, Sparkles } from "./Ornaments";
import { customThemeVars, type ThemeKey, type FontKey } from "@/lib/themes";

interface CountdownPreviewProps {
  eventType: string;
  displayNames: string;
  weddingDate: string; // 'YYYY-MM-DD' | ''
  weddingTime: string; // 'HH:MM' | ''
  blessing: string;
  theme: ThemeKey;
  accentColor?: string | null;
  fontKey?: FontKey | null;
  showGregorian: boolean;
  invitationPreview?: string | null;
}

function isValidDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function CountdownPreview({
  eventType,
  displayNames,
  weddingDate,
  weddingTime,
  blessing,
  theme,
  accentColor,
  fontKey,
  showGregorian,
  invitationPreview,
}: CountdownPreviewProps) {
  const valid = isValidDate(weddingDate);
  const customStyle = customThemeVars({ accentColor, fontKey }) as React.CSSProperties;

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
    <div data-theme={theme} style={customStyle} className="bg-animated rounded-3xl p-1">
      <div className="surface-card rounded-[1.4rem] px-5 py-8 text-center">
        <p className="text-xs text-[var(--muted)]">הספירה ל{eventType || "חתונה"} של</p>
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
              <p className="accent-gradient-text font-display flex items-center justify-center gap-2 text-3xl font-extrabold">
                מזל טוב!
                <Sparkles className="h-6 w-6" />
              </p>
            )}

            <Divider className="my-5" />

            <p className="wedding-date font-display text-lg font-bold">
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

        {invitationPreview && (
          <>
            <Divider className="my-5" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={invitationPreview}
              alt="תצוגה מקדימה של ההזמנה"
              className="mx-auto max-h-48 w-auto rounded-lg object-contain"
            />
          </>
        )}
      </div>
    </div>
  );
}
