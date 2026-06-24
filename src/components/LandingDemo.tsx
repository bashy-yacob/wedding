"use client";

import { useEffect, useState } from "react";
import { getCountdownState, type CountdownState } from "@/lib/time";
import { toHebrewDateString, toGregorianString } from "@/lib/hebcal";
import { CountdownDisplay } from "./CountdownDisplay";
import { Divider } from "./Ornaments";

// מונה דמו חי לדפי הנחיתה — יעד ~120 ימים קדימה, מחושב רק אחרי mount כדי
// להימנע מאי-התאמת hydration. התאריך מחושב אמיתי (לא קשיח) ומתורגם לעברי.
export function LandingDemo({
  eventType,
  names,
}: {
  eventType: string;
  names: string;
}) {
  const [state, setState] = useState<CountdownState | null>(null);
  const [dates, setDates] = useState<{ heb: string; greg: string } | null>(null);

  useEffect(() => {
    const target = new Date();
    target.setDate(target.getDate() + 120);
    const y = target.getFullYear();
    const m = String(target.getMonth() + 1).padStart(2, "0");
    const d = String(target.getDate()).padStart(2, "0");
    const weddingDate = `${y}-${m}-${d}`;

    setDates({
      heb: toHebrewDateString(weddingDate),
      greg: toGregorianString(weddingDate),
    });

    const tick = () =>
      setState(getCountdownState({ weddingDate, weddingTime: "19:00" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="surface-card mx-auto w-full max-w-lg rounded-3xl px-8 py-10 text-center lg:max-w-2xl lg:px-12 lg:py-14">
      <p className="text-xs text-[var(--muted)] lg:text-sm">הספירה ל{eventType} של</p>
      <p className="font-display accent-gradient-text mt-1 mb-6 text-2xl font-bold lg:text-4xl">
        {names}
      </p>

      {state && state.status === "countdown" ? (
        <CountdownDisplay
          days={state.remaining!.days}
          hours={state.remaining!.hours}
          minutes={state.remaining!.minutes}
          seconds={state.remaining!.seconds}
          compact
        />
      ) : (
        <div className="h-14 sm:h-16" />
      )}

      <Divider className="my-6" />
      {dates ? (
        <>
          <p className="font-display text-lg font-semibold lg:text-2xl">{dates.heb}</p>
          <p className="text-sm text-[var(--muted)] lg:text-base">{dates.greg}</p>
        </>
      ) : (
        <div className="h-12" />
      )}
    </div>
  );
}
