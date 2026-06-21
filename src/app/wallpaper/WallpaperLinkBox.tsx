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

  const url = origin ? `${origin}/c/${slug}` : "";

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
    <div className="surface-card mx-auto mb-12 max-w-xl rounded-2xl border border-[var(--accent)]/40 p-5 text-center">
      <p className="text-sm font-semibold">הקישור שלך, מוכן להדבקה 👇</p>
      <p className="mt-1 text-xs text-[var(--muted)]">
        זה הקישור שתדביקו בשלב 3. העתיקו אותו עכשיו.
      </p>
      <div className="mt-3 flex gap-2">
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
