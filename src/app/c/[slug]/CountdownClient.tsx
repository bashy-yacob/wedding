"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getCountdownState, type CountdownState } from "@/lib/time";
import { CountdownDisplay } from "@/components/CountdownDisplay";
import { useConfetti } from "@/lib/useConfetti";

interface CountdownClientProps {
  weddingDate: string;
  weddingTime: string | null;
  displayNames: string;
  eventType?: string;
  blessing: string | null;
}

export function CountdownClient({
  weddingDate,
  weddingTime,
  displayNames,
  eventType = "חתונה",
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

  const celebrating = state.status !== "countdown";
  useConfetti(celebrating);

  if (celebrating) {
    // חתונה שומרת על הניסוח האישי; אירועים אחרים מקבלים ניסוח נייטרלי וחגיגי.
    const isWedding = eventType === "חתונה";
    const subtitle =
      state.status === "mazaltov"
        ? isWedding
          ? `${displayNames} מתחתנים היום`
          : `היום ה${eventType} של ${displayNames}!`
        : isWedding
          ? `${displayNames} נישאו בשעה טובה`
          : `ה${eventType} של ${displayNames} בשעה טובה`;

    return (
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
      >
        <p className="accent-gradient-text font-display text-5xl font-extrabold sm:text-7xl">
          מזל טוב! 🎉
        </p>
        <p className="mt-4 text-xl text-[var(--muted)]">{subtitle}</p>
        {blessing && (
          <p className="creator-blessing font-display mt-6 text-lg">{blessing}</p>
        )}
      </motion.div>
    );
  }

  const r = state.remaining!;
  return (
    <CountdownDisplay
      days={r.days}
      hours={r.hours}
      minutes={r.minutes}
      seconds={r.seconds}
    />
  );
}
