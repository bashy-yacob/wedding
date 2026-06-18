"use client";

import { useEffect, useState } from "react";
import { getCountdownState, type CountdownState } from "@/lib/time";

interface CountdownClientProps {
  weddingDate: string;
  weddingTime: string | null;
  displayNames: string;
  blessing: string | null;
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-display accent-text text-5xl font-extrabold tabular-nums sm:text-7xl">
        {value}
      </span>
      <span className="mt-1 text-sm text-[var(--muted)] sm:text-base">
        {label}
      </span>
    </div>
  );
}

export function CountdownClient({
  weddingDate,
  weddingTime,
  displayNames,
  blessing,
}: CountdownClientProps) {
  // חישוב ראשוני זהה לשרת כדי למנוע הבהוב hydration
  const [state, setState] = useState<CountdownState>(() =>
    getCountdownState({ weddingDate, weddingTime }),
  );

  useEffect(() => {
    const tick = () =>
      setState(getCountdownState({ weddingDate, weddingTime }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [weddingDate, weddingTime]);

  if (state.status !== "countdown") {
    return (
      <div className="animate-gentle-pop text-center">
        <p className="font-display accent-text text-5xl font-extrabold sm:text-7xl">
          מזל טוב! 🎉
        </p>
        <p className="mt-4 text-xl text-[var(--muted)]">
          {state.status === "mazaltov"
            ? `${displayNames} מתחתנים היום`
            : `${displayNames} נישאו בשעה טובה`}
        </p>
        {blessing && (
          <p className="font-display mt-6 text-lg">{blessing}</p>
        )}
      </div>
    );
  }

  const r = state.remaining!;
  return (
    <div className="flex items-start justify-center gap-5 sm:gap-10">
      <Unit value={r.days} label="ימים" />
      <Unit value={r.hours} label="שעות" />
      <Unit value={r.minutes} label="דקות" />
      <Unit value={r.seconds} label="שניות" />
    </div>
  );
}
