"use client";

import { AnimatePresence, motion } from "framer-motion";

interface CountdownDisplayProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** גודל מוקטן לתצוגה מקדימה */
  compact?: boolean;
}

function Unit({
  value,
  label,
  pad,
  compact,
}: {
  value: number;
  label: string;
  pad: boolean;
  compact?: boolean;
}) {
  const text = pad ? String(value).padStart(2, "0") : String(value);
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`countdown-unit flex items-center justify-center ${
          compact ? "h-14 w-14 sm:h-16 sm:w-16" : "h-20 w-20 sm:h-28 sm:w-28"
        }`}
      >
        <div
          className={`relative overflow-hidden ${
            compact ? "h-9" : "h-12 sm:h-16"
          }`}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={text}
              initial={{ y: "-100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={`accent-gradient-text font-display block text-center font-extrabold tabular-nums ${
                compact ? "text-3xl" : "text-5xl sm:text-7xl"
              }`}
            >
              {text}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
      <span
        className={`text-[var(--muted)] ${compact ? "text-xs" : "text-sm sm:text-base"}`}
      >
        {label}
      </span>
    </div>
  );
}

export function CountdownDisplay({
  days,
  hours,
  minutes,
  seconds,
  compact,
}: CountdownDisplayProps) {
  return (
    <div
      className={`flex items-start justify-center ${compact ? "gap-2" : "gap-3 sm:gap-5"}`}
    >
      <Unit value={days} label="ימים" pad={false} compact={compact} />
      <Unit value={hours} label="שעות" pad compact={compact} />
      <Unit value={minutes} label="דקות" pad compact={compact} />
      <Unit value={seconds} label="שניות" pad compact={compact} />
    </div>
  );
}
