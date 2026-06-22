// באנר קרדיט בתחתית כל הדפים — ממצב את האתר כתיק עבודות חי של בשי,
// בונת אתרים. הקריאה לפעולה מובילה ל-mailto לפנייה על בניית אתר חדש.

const BUILD_MAILTO =
  "mailto:bashy3309@gmail.com" +
  "?subject=" +
  encodeURIComponent("מעוניין/ת באתר") +
  "&body=" +
  encodeURIComponent(
    "הי בשי,\nראיתי את האתר ואשמח לדבר על בניית אתר עבורי.\n\nקצת על מה שאני מחפש/ת:\n",
  );

export function SiteFooter() {
  return (
    <footer className="px-6 py-8 text-center text-xs text-[var(--muted)]">
      <p className="mb-1 text-sm font-semibold text-[var(--text)]">
        אהבתם את האתר? אני בונה אתרים כאלה.
      </p>
      <p className="mx-auto mb-4 max-w-md">
        בשי — עיצוב ובניית אתרים מהירים ויפים לעסקים וליחידים. האתר הזה הוא דוגמה
        חיה. רוצים אחד משלכם?
      </p>
      <a
        href={BUILD_MAILTO}
        className="mb-4 inline-block rounded-full bg-[var(--accent)] px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-[var(--accent)]/30 transition hover:-translate-y-0.5 hover:shadow-xl"
      >
        דברו איתי ✨
      </a>
      <p>
        נבנה באהבה על ידי בשי 🤍 · ליצירת קשר:{" "}
        <a
          href="mailto:bashy3309@gmail.com"
          className="accent-text font-medium underline-offset-4 hover:underline"
        >
          bashy3309@gmail.com
        </a>
      </p>
    </footer>
  );
}
