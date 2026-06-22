// באנר קרדיט בתחתית כל הדפים — ממצב את האתר כתיק עבודות חי של בשי,
// בונת אתרים. הקריאה לפעולה פותחת חלון כתיבת מייל ב-Gmail (אמין יותר
// מ-mailto, שדורש אפליקציית מייל מוגדרת במכשיר).
import { BUILD_CONTACT_URL, CONTACT_EMAIL } from "@/lib/contact";

export function SiteFooter() {
  return (
    <footer className="px-6 py-8 text-center text-xs text-[var(--muted)]">
      <p className="mb-1 text-sm font-semibold text-[var(--text)]">
        אהבתם את האתר?
      </p>
      <p className="mx-auto mb-4 max-w-md">
        אני מעצבת ובונה אתרים מהירים ויפים לעסקים וליחידים. בואו נדבר על שלכם.
      </p>
      <a
        href={BUILD_CONTACT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-4 inline-block rounded-full bg-[var(--accent)] px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-[var(--accent)]/30 transition hover:-translate-y-0.5 hover:shadow-xl"
      >
        דברו איתי
      </a>
      <p>
        נבנה באהבה על ידי בשי 🤍 · ליצירת קשר:{" "}
        <a
          href={BUILD_CONTACT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="accent-text font-medium underline-offset-4 hover:underline"
        >
          {CONTACT_EMAIL}
        </a>
      </p>
    </footer>
  );
}
