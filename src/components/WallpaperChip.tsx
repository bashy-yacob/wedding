import Link from "next/link";
import { Monitor } from "@/components/Ornaments";

// כפתור צד פינתי קבוע — מוביל למדריך "רקע חי לשולחן העבודה".
// בעמוד ספירה מעבירים slug כדי שהמדריך יציג את הקישור האישי המוכן להעתקה.
export function WallpaperChip({ slug }: { slug?: string }) {
  const href = slug ? `/wallpaper?c=${slug}` : "/wallpaper";
  return (
    <Link
      href={href}
      className="surface-card fixed bottom-4 left-4 z-30 flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
      title="מדריך: הפכו את הספירה לרקע חי על שולחן העבודה"
    >
      <Monitor className="h-4 w-4 shrink-0 text-[var(--accent)]" />
      <span className="hidden sm:inline">מדריך לרקע לשולחן עבודה</span>
      <span className="sm:hidden">מדריך לרקע</span>
    </Link>
  );
}
