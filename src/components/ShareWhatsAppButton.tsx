"use client";

import { useEffect, useState } from "react";

interface ShareWhatsAppButtonProps {
  slug: string;
  displayNames: string;
  hebrewDate: string;
  /** סוג האירוע לשורת ההזמנה (חתונה כברירת מחדל) */
  eventType?: string;
  /** גרסה קטנה ומאופקת לפינה/צד, במקום כפתורים גדולים במרכז */
  compact?: boolean;
}

export function ShareWhatsAppButton({
  slug,
  displayNames,
  hebrewDate,
  eventType = "חתונה",
  compact = false,
}: ShareWhatsAppButtonProps) {
  const [copied, setCopied] = useState(false);
  // נבנה את הכתובת מה-origin האמיתי של הדפדפן — לעולם לא localhost
  const [url, setUrl] = useState(`/c/${slug}`);

  useEffect(() => {
    setUrl(`${window.location.origin}/c/${slug}`);
  }, [slug]);

  const text = `הצטרפו לספירה לאחור ל${eventType} של ${displayNames} 🤍\n${hebrewDate}\n${url}`;
  const waHref = `https://wa.me/?text=${encodeURIComponent(text)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* התעלם */
    }
  };

  const waSvg = (
    <svg viewBox="0 0 24 24" className={compact ? "h-4 w-4" : "h-5 w-5"} fill="currentColor" aria-hidden>
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.523 5.273l-.999 3.648 3.743-.948z" />
    </svg>
  );

  if (compact) {
    return (
      <div className="flex flex-col gap-2">
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--on-accent)] shadow-md shadow-[var(--accent)]/20 transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          {waSvg}
          שיתוף
        </a>

        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--surface)]/60 px-4 py-2 text-sm font-medium text-[var(--text)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-[var(--accent)]"
        >
          {copied ? "הועתק ✓" : "העתקת קישור"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-7 py-3.5 font-semibold text-[var(--on-accent)] shadow-lg shadow-[var(--accent)]/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[var(--accent)]/40 sm:w-auto"
      >
        {waSvg}
        שיתוף בוואטסאפ
      </a>

      <button
        type="button"
        onClick={copy}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--surface)]/60 px-7 py-3.5 font-medium text-[var(--text)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-[var(--accent)] sm:w-auto"
      >
        {copied ? "הקישור הועתק ✓" : "העתקת קישור"}
      </button>
    </div>
  );
}
