"use client";

import { useEffect, useState } from "react";

// תיבת "הקישור שלך להדבקה" — מוצגת בראש המדריך כשמגיעים מתוך עמוד ספירה
// (‎/wallpaper?c=slug). מרכיבה את הכתובת המלאה בצד הלקוח (origin + slug) ומאפשרת
// העתקה בלחיצה, כך שאפשר להדביק אותה ישר ב-Lively Wallpaper.
export function WallpaperLinkBox({ slug }: { slug: string }) {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  // קישור מצב-הרקע הייעודי: גרסה נקייה ומסך-מלא של הספירה, בלי כפתורים/גלילה,
  // מותאמת במיוחד להדבקה ב-Lively Wallpaper.
  const url = origin ? `${origin}/c/${slug}/wallpaper` : "";

  async function copy() {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* דפדפן ללא הרשאת clipboard — אפשר להעתיק ידנית מהשדה */
    }
  }

  return (
    <div className="surface-card mx-auto mb-12 max-w-xl rounded-3xl border-2 border-[var(--accent)] bg-[var(--accent-soft)] p-6 text-center shadow-lg">
      <span className="accent-text inline-flex items-center gap-1.5 rounded-full bg-[var(--surface)] px-3 py-1 text-xs font-bold">
        📋 התחילו מכאן
      </span>
      <p className="mt-3 text-lg font-bold">הקישור שלך, מוכן להעתקה</p>
      <p className="mt-1 text-sm text-[var(--muted)]">
        זה הקישור שתדביקו בשלב 2. (גרסת רקע נקייה, מסך-מלא.)
      </p>
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          readOnly
          value={url}
          onFocus={(e) => e.currentTarget.select()}
          className="min-w-0 flex-1 rounded-lg border border-black/10 bg-[var(--surface)] px-3 py-2 text-xs text-[var(--text)]"
          dir="ltr"
        />
        <button
          type="button"
          onClick={copy}
          className="shrink-0 rounded-lg bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-[var(--on-accent)] transition hover:opacity-90"
        >
          {copied ? "הועתק ✓" : "העתקה"}
        </button>
      </div>
    </div>
  );
}
