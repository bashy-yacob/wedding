"use client";

import { THEMES, THEME_KEYS, type ThemeKey } from "@/lib/themes";

interface ThemePickerProps {
  value: ThemeKey;
  onChange: (theme: ThemeKey) => void;
}

export function ThemePicker({ value, onChange }: ThemePickerProps) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
      {THEME_KEYS.map((key) => {
        const theme = THEMES[key];
        const selected = key === value;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            aria-pressed={selected}
            className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-2 transition ${
              selected
                ? "border-[var(--accent)]"
                : "border-transparent hover:border-black/10"
            }`}
          >
            <span
              className="h-12 w-full rounded-xl border border-black/5"
              style={{ background: theme.bgGradient }}
            >
              <span
                className="mt-7 mr-2 block h-3 w-3 rounded-full"
                style={{ background: theme.accent }}
              />
            </span>
            <span className="text-xs text-[var(--muted)]">{theme.label}</span>
          </button>
        );
      })}
    </div>
  );
}
