import { Sparkles } from "@/components/Ornaments";

// צ'יפ פינתי קבוע (פינה ימנית-תחתונה) שממצב את האתר כתיק עבודות חי:
// "נבנה ע״י בשי · רוצים אתר כזה?" — מוביל למייל ליצירת קשר על בניית אתר.
// פינה ימנית כדי לא להתנגש ב-WallpaperChip שיושב בפינה השמאלית.
const BUILD_MAILTO =
  "mailto:bashy3309@gmail.com" +
  "?subject=" +
  encodeURIComponent("מעוניין/ת באתר") +
  "&body=" +
  encodeURIComponent(
    "הי בשי,\nראיתי את האתר ואשמח לדבר על בניית אתר עבורי.\n\nקצת על מה שאני מחפש/ת:\n",
  );

export function BuilderChip() {
  return (
    <a
      href={BUILD_MAILTO}
      aria-label="נבנה על ידי בשי — לפנייה על בניית אתר"
      title="אהבתם את האתר? אני בונה אתרים — דברו איתי"
      className="surface-card fixed bottom-4 right-4 z-30 flex items-center gap-2 rounded-full p-3 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl sm:px-4 sm:py-2.5 sm:text-xs sm:font-medium"
    >
      <Sparkles className="h-5 w-5 shrink-0 text-[var(--accent)] sm:h-4 sm:w-4" />
      <span className="hidden sm:inline">נבנה ע״י בשי · רוצים אתר כזה?</span>
    </a>
  );
}
