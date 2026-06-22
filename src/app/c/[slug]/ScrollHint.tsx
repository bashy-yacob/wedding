"use client";

import { useEffect, useState } from "react";

// חיווי גלילה + עמעום בתחתית המסך הראשון. נעלם בעדינות ברגע שמתחילים
// לגלול, כדי שלא יפריע בהמשך הדף.
export function ScrollHint({ label }: { label: string }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`transition-opacity duration-500 ${
        hidden ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* עמעום עדין — רומז שיש תוכן "מתחת לקיפול" */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[var(--bg)] to-transparent"
        aria-hidden
      />

      {/* חיווי בולט עם תווית וחץ מונפש */}
      <a
        href="#more"
        aria-label={label}
        className="group absolute bottom-6 left-1/2 flex -translate-x-1/2 animate-bounce flex-col items-center gap-2 text-[var(--accent)]"
      >
        <span className="surface-card rounded-full px-4 py-1.5 text-sm font-semibold shadow-md">
          {label}
        </span>
        <svg
          viewBox="0 0 24 24"
          className="h-8 w-8 drop-shadow-sm"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </a>
    </div>
  );
}
