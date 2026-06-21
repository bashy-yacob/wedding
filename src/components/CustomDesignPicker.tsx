"use client";

import {
  ACCENT_PRESETS,
  FONTS,
  FONT_KEYS,
  type FontKey,
} from "@/lib/themes";

interface CustomDesignPickerProps {
  /** צבע דגש מותאם (#rrggbb) או null = ברירת המחדל של העיצוב */
  accentColor: string | null;
  onAccentChange: (value: string | null) => void;
  /** פונט מותאם או null = הפונט של העיצוב */
  fontKey: FontKey | null;
  onFontChange: (value: FontKey | null) => void;
}

// בורר ההתאמה האישית — שכבה דקה מעל עיצוב הבסיס: צבע דגש ופונט בלבד.
// אין כאן עיצוב חדש; הצבעים נגזרים מ-accent של ששת העיצובים והפונטים כבר טעונים.
export function CustomDesignPicker({
  accentColor,
  onAccentChange,
  fontKey,
  onFontChange,
}: CustomDesignPickerProps) {
  return (
    <div className="space-y-5">
      {/* ----------------------------- צבע דגש ----------------------------- */}
      <div>
        <p className="mb-2 text-sm font-medium">צבע דגש</p>
        <div className="flex flex-wrap items-center gap-2">
          {/* "ברירת מחדל" = ללא דריסה (משתמשים בצבע של העיצוב) */}
          <button
            type="button"
            onClick={() => onAccentChange(null)}
            aria-pressed={accentColor === null}
            className={`rounded-full border px-3 py-1.5 text-xs transition ${
              accentColor === null
                ? "border-[var(--accent)] bg-[var(--accent-soft)] font-semibold"
                : "border-black/10 text-[var(--muted)] hover:border-black/20"
            }`}
          >
            ברירת מחדל
          </button>

          {ACCENT_PRESETS.map((color) => {
            const selected =
              accentColor?.toLowerCase() === color.toLowerCase();
            return (
              <button
                key={color}
                type="button"
                onClick={() => onAccentChange(color)}
                aria-pressed={selected}
                aria-label={`צבע ${color}`}
                className={`h-8 w-8 rounded-full border-2 transition ${
                  selected
                    ? "border-[var(--text)] ring-2 ring-[var(--accent)]/40"
                    : "border-black/10 hover:scale-110"
                }`}
                style={{ background: color }}
              />
            );
          })}

          {/* בחירת צבע חופשי */}
          <label
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-black/20 text-[var(--muted)] hover:border-[var(--accent)]"
            title="צבע משלכם"
          >
            <span aria-hidden className="text-base leading-none">
              +
            </span>
            <input
              type="color"
              value={accentColor ?? "#b08d57"}
              onChange={(e) => onAccentChange(e.target.value)}
              className="sr-only"
            />
          </label>
        </div>
      </div>

      {/* ------------------------------- פונט ------------------------------ */}
      <div>
        <p className="mb-2 text-sm font-medium">פונט</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onFontChange(null)}
            aria-pressed={fontKey === null}
            className={`rounded-full border px-3 py-1.5 text-xs transition ${
              fontKey === null
                ? "border-[var(--accent)] bg-[var(--accent-soft)] font-semibold"
                : "border-black/10 text-[var(--muted)] hover:border-black/20"
            }`}
          >
            ברירת מחדל
          </button>

          {FONT_KEYS.map((key) => {
            const font = FONTS[key];
            const selected = fontKey === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onFontChange(key)}
                aria-pressed={selected}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${
                  selected
                    ? "border-[var(--accent)] bg-[var(--accent-soft)] font-semibold"
                    : "border-black/10 hover:border-black/20"
                }`}
                style={{ fontFamily: `var(${font.var}), ${font.fallback}` }}
              >
                {font.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
