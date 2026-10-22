"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Monitor } from "@/components/Ornaments";

// כפתור צד פינתי קבוע — מוביל למדריך "רקע חי לשולחן העבודה".
// בעמוד ספירה מעבירים slug כדי שהמדריך יציג את הקישור האישי המוכן להעתקה.
// כשהפוטר (או אזור הסטודיו בדף הבית) נכנס למסך — הכפתור נעלם, כדי שלא
// יישב מעל כפתור יצירת הקשר.
export function WallpaperChip({ slug }: { slug?: string }) {
  const href = slug ? `/wallpaper?c=${slug}` : "/wallpaper";
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const targets = document.querySelectorAll("body > footer, #studio");
    if (targets.length === 0 || !("IntersectionObserver" in window)) return;

    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
      }
      setHidden(visible.size > 0);
    });
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  return (
    <Link
      href={href}
      aria-label="מדריך לרקע לשולחן עבודה"
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      className={`surface-card fixed bottom-4 left-4 z-30 flex items-center gap-2 rounded-full p-3 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl sm:px-4 sm:py-2.5 sm:text-xs sm:font-medium ${
        hidden ? "pointer-events-none translate-y-3 opacity-0" : ""
      }`}
      title="מדריך: הפכו את הספירה לרקע חי על שולחן העבודה"
    >
      <Monitor className="h-5 w-5 shrink-0 text-[var(--accent)] sm:h-4 sm:w-4" />
      <span className="accent-text hidden sm:inline">מדריך לרקע לשולחן עבודה</span>
    </Link>
  );
}
