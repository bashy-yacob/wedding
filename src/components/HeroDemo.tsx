"use client";

import { useEffect, useState } from "react";
import { getCountdownState, type CountdownState } from "@/lib/time";
import { CountdownDisplay } from "./CountdownDisplay";
import { Divider } from "./Ornaments";

// מונה דמו חי לדף הבית — תאריך יעד ~93 ימים קדימה, מחושב רק אחרי mount
// כדי להימנע מאי-התאמת hydration.
export function HeroDemo() {
  const [state, setState] = useState<CountdownState | null>(null);

  useEffect(() => {
    const target = new Date();
    target.setDate(target.getDate() + 93);
    const y = target.getFullYear();
    const m = String(target.getMonth() + 1).padStart(2, "0");
    const d = String(target.getDate()).padStart(2, "0");
    const weddingDate = `${y}-${m}-${d}`;

    const tick = () =>
      setState(getCountdownState({ weddingDate, weddingTime: "19:00" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="surface-card mx-auto w-full max-w-lg rounded-3xl px-8 py-10 text-center lg:max-w-2xl lg:px-12 lg:py-14">
      <p className="text-xs text-[var(--muted)] lg:text-sm">הספירה לחתונה של</p>
      <p className="font-display accent-gradient-text mt-1 mb-6 text-2xl font-bold lg:text-4xl">
        חיים ושרה
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
      <p className="font-display text-lg font-semibold lg:text-2xl">כ״ב באדר התשפ״ו</p>
      <p className="text-sm text-[var(--muted)] lg:text-base">22 במרץ 2026</p>
    </div>
  );
}
