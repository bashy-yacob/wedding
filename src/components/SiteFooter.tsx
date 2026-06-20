// קרדיט עדין בתחתית כל הדפים.
// הכתובת מקושרת ל-mailto ליצירת קשר.

export function SiteFooter() {
  return (
    <footer className="px-6 py-8 text-center text-sm text-[var(--muted)]">
      <p>
        נבנה באהבה על ידי{" "}
        <a
          href="mailto:bashy3309@gmail.com"
          className="accent-text font-medium underline-offset-4 hover:underline"
        >
          בשי
        </a>{" "}
        🤍
      </p>
    </footer>
  );
}
