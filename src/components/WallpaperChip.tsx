import Link from "next/link";
import { Monitor } from "@/components/Ornaments";

// כפתור צד פינתי קבוע — מוביל למדריך "רקע חי לשולחן העבודה".
// בעמוד ספירה מעבירים slug כדי שהמדריך יציג את הקישור האישי המוכן להעתקה.
export function WallpaperChip({ slug }: { slug?: string }) {
  const href = slug ? `/wallpaper?c=${slug}` : "/wallpaper";
  return (
    <Link
      href={href}
      aria-label="מדריך לרקע לשולחן עבודה"
      className="surface-card fixed bottom-4 left-4 z-30 flex items-center gap-2 rounded-full p-3 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl sm:px-4 sm:py-2.5 sm:text-xs sm:font-medium"
      title="מדריך: הפכו את הספירה לרקע חי על שולחן העבודה"
    >
      <Monitor className="h-5 w-5 shrink-0 text-[var(--accent)] sm:h-4 sm:w-4" />
      <span className="hidden sm:inline">מדריך לרקע לשולחן עבודה</span>
    </Link>
  );
}
