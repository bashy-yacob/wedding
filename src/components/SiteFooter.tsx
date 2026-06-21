// קרדיט עדין בתחתית כל הדפים.
// הכתובת מקושרת ל-mailto ליצירת קשר.

const FEEDBACK_MAILTO =
  "mailto:bashy3309@gmail.com" +
  "?subject=" +
  encodeURIComponent("הערות ושיפורים — עד החתונה") +
  "&body=" +
  encodeURIComponent("הי בשי,\nרציתי לשתף הערה / רעיון לשיפור:\n\n");

export function SiteFooter() {
  return (
    <footer className="px-6 py-8 text-center text-sm text-[var(--muted)]">
      <a
        href={FEEDBACK_MAILTO}
        className="mb-5 inline-block rounded-full border border-[var(--accent)] px-5 py-2 text-xs font-medium accent-text transition hover:bg-[var(--accent-soft)]"
      >
        נשמח לשמוע הערות ושיפורים 💬
      </a>
      <p>נבנה באהבה על ידי בשי 🤍</p>
      <p className="mt-1">
        ליצירת קשר:{" "}
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
