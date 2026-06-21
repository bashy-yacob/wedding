"use client";

import { useMemo } from "react";
import {
  currentHebrewYear,
  hebrewDaysInMonth,
  hebrewDayLabel,
  hebrewMonthsForYear,
} from "@/lib/hebcal";
import { HDate } from "@hebcal/core";

export interface HebrewDateValue {
  day: number;
  month: number;
  year: number;
}

interface HebrewDateInputProps {
  value: HebrewDateValue;
  onChange: (value: HebrewDateValue) => void;
}

const selectClass =
  "rounded-xl border border-black/10 bg-[var(--surface)] px-3 py-2 text-[var(--text)]";

export function HebrewDateInput({ value, onChange }: HebrewDateInputProps) {
  const baseYear = currentHebrewYear();
  const years = useMemo(
    () => Array.from({ length: 6 }, (_, i) => baseYear + i),
    [baseYear],
  );
  const months = useMemo(
    () => hebrewMonthsForYear(value.year),
    [value.year],
  );
  const daysInMonth = hebrewDaysInMonth(value.month, value.year);
  const days = useMemo(
    () => Array.from({ length: daysInMonth }, (_, i) => i + 1),
    [daysInMonth],
  );

  // תווית שנה בעברית (לדוגמה: התשפ״ו)
  const yearLabel = (y: number) =>
    new HDate(1, value.month, y).renderGematriya().split(" ").pop() ?? String(y);

  return (
    <div className="grid grid-cols-3 gap-2">
      <select
        aria-label="יום עברי"
        className={selectClass}
        value={value.day}
        onChange={(e) =>
          onChange({ ...value, day: parseInt(e.target.value, 10) })
        }
      >
        {days.map((d) => (
          <option key={d} value={d}>
            {hebrewDayLabel(d)}
          </option>
        ))}
      </select>

      <select
        aria-label="חודש עברי"
        className={selectClass}
        value={value.month}
        onChange={(e) => {
          const month = parseInt(e.target.value, 10);
          const max = hebrewDaysInMonth(month, value.year);
          onChange({ ...value, month, day: Math.min(value.day, max) });
        }}
      >
        {months.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>

      <select
        aria-label="שנה עברית"
        className={selectClass}
        value={value.year}
        onChange={(e) =>
          onChange({ ...value, year: parseInt(e.target.value, 10) })
        }
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {yearLabel(y)}
          </option>
        ))}
      </select>
    </div>
  );
}
