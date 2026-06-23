// עיטורים וקטוריים עדינים — ללא תמונות, צבע לפי --accent של ה-theme.

/** מפריד מעוטר עם מוטיב מרכזי (יהלום/לב קטן). */
export function Divider({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center gap-3 text-[var(--accent)] ${className}`}
      aria-hidden
    >
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--accent)] opacity-60" />
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3l2.2 5.6L20 11l-5.8 2.4L12 19l-2.2-5.6L4 11l5.8-2.4L12 3z"
          fill="currentColor"
          opacity="0.85"
        />
      </svg>
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--accent)] opacity-60" />
    </div>
  );
}

/** זוג טבעות שלובות — מוטיב חתונה צנוע. */
export function Rings({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 40"
      className={`text-[var(--accent)] ${className}`}
      fill="none"
      aria-hidden
    >
      <circle cx="24" cy="22" r="13" stroke="currentColor" strokeWidth="2" opacity="0.9" />
      <circle cx="40" cy="22" r="13" stroke="currentColor" strokeWidth="2" opacity="0.7" />
      <path d="M20 3h8l-4 6z" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

/** לב וקטורי. */
export function Heart({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      style={style}
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 21s-7.5-4.9-10-9.2C.3 8.6 1.7 5 5 5c2 0 3.3 1.2 4 2.3C9.7 6.2 11 5 13 5c3.3 0 4.7 3.6 3 6.8C19.5 16.1 12 21 12 21z" />
    </svg>
  );
}

/** אייקוני-קו עדינים לשלבים — currentColor. */
function LineIcon({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

/** עיפרון — "ממלאים פרטים". */
export function Pencil({ className = "" }: { className?: string }) {
  return (
    <LineIcon className={className}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </LineIcon>
  );
}

/** קישור — "מקבלים קישור". */
export function LinkIcon({ className = "" }: { className?: string }) {
  return (
    <LineIcon className={className}>
      <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5" />
      <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5" />
    </LineIcon>
  );
}

/** מטוס נייר — "משתפים". */
export function Send({ className = "" }: { className?: string }) {
  return (
    <LineIcon className={className}>
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4 20-7z" />
    </LineIcon>
  );
}

/** לוח שנה — "תאריך עברי". */
export function Calendar({ className = "" }: { className?: string }) {
  return (
    <LineIcon className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </LineIcon>
  );
}

/** בועת ברכה — "קיר ברכות". */
export function Chat({ className = "" }: { className?: string }) {
  return (
    <LineIcon className={className}>
      <path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.4 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z" />
    </LineIcon>
  );
}

/** ניצוצות — "מצב מזל טוב". */
export function Sparkles({ className = "" }: { className?: string }) {
  return (
    <LineIcon className={className}>
      <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" />
      <path d="M19 14l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7L19 14z" />
    </LineIcon>
  );
}

/** פלטת צבעים — "ערכות עיצוב". */
export function Palette({ className = "" }: { className?: string }) {
  return (
    <LineIcon className={className}>
      <path d="M12 3a9 9 0 1 0 0 18c1.7 0 2-1.3 1.2-2.2-.7-.9-.4-2.3 1-2.3H17a4 4 0 0 0 4-4c0-5-4-7.5-9-7.5z" />
      <circle cx="7.5" cy="11" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="7.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="16" cy="9.5" r="1" fill="currentColor" stroke="none" />
    </LineIcon>
  );
}

/** תמונה — "העלאת הזמנה". */
export function Photo({ className = "" }: { className?: string }) {
  return (
    <LineIcon className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </LineIcon>
  );
}

/** מתנה — "ללא הרשמה, בחינם". */
export function Gift({ className = "" }: { className?: string }) {
  return (
    <LineIcon className={className}>
      <path d="M20 12v9H4v-9" />
      <path d="M2 7h20v5H2z" />
      <path d="M12 22V7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </LineIcon>
  );
}

/** מסך מחשב — מוטיב הרקע החי לשולחן העבודה. */
export function Monitor({ className = "" }: { className?: string }) {
  return (
    <LineIcon className={className}>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M9 21h6M12 17v4" />
    </LineIcon>
  );
}

/** הורדה — לכפתורי ההתקנה. */
export function Download({ className = "" }: { className?: string }) {
  return (
    <LineIcon className={className}>
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </LineIcon>
  );
}

/** פלוס — "הוספת רקע". */
export function Plus({ className = "" }: { className?: string }) {
  return (
    <LineIcon className={className}>
      <path d="M12 5v14M5 12h14" />
    </LineIcon>
  );
}

/** וי — "מוכן / הצלחה". */
export function Check({ className = "" }: { className?: string }) {
  return (
    <LineIcon className={className}>
      <path d="M20 6 9 17l-5-5" />
    </LineIcon>
  );
}

/** חץ עדין לסוף קישור (פונה שמאלה — מתאים ל-RTL). */
export function ArrowLeft({ className = "" }: { className?: string }) {
  return (
    <LineIcon className={className}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </LineIcon>
  );
}

/** מפתח — "קישור עריכה אישי / סודי". */
export function Key({ className = "" }: { className?: string }) {
  return (
    <LineIcon className={className}>
      <circle cx="8" cy="16" r="4" />
      <path d="M10.8 13.2 21 3" />
      <path d="M17 7l3 3" />
    </LineIcon>
  );
}

/** פח אשפה — "מחיקה". */
export function Trash({ className = "" }: { className?: string }) {
  return (
    <LineIcon className={className}>
      <path d="M3 6h18" />
      <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
    </LineIcon>
  );
}

/** לוח העתקה — "להעתקה / התחילו מכאן". */
export function Clipboard({ className = "" }: { className?: string }) {
  return (
    <LineIcon className={className}>
      <rect x="8" y="3" width="8" height="4" rx="1" />
      <path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
    </LineIcon>
  );
}

/** לוגו Apple — לפריט "Apple / Outlook" בהוספה ליומן. */
export function Apple({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
    </svg>
  );
}

/** לוגו Google (חד-צבעי) — לפריט "Google Calendar" בהוספה ליומן. */
export function Google({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 11v2.8h4.6c-.2 1.2-1.4 3.6-4.6 3.6-2.8 0-5-2.3-5-5.1S9.2 7.1 12 7.1c1.6 0 2.6.7 3.2 1.2l2.2-2.1C16 4.9 14.2 4.1 12 4.1c-4.4 0-8 3.6-8 8s3.6 8 8 8c4.6 0 7.7-3.2 7.7-7.8 0-.5 0-.9-.1-1.3H12z" />
    </svg>
  );
}
