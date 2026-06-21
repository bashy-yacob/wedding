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
      <path d="M20 9l4-6 4 6z" fill="currentColor" opacity="0.9" />
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
