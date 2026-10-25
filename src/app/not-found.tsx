import Link from "next/link";

// עמוד 404 כללי לכל כתובת שאינה קיימת. לספירה שלא נמצאה יש הודעה ייעודית
// ב-c/[slug]/not-found.tsx.
export default function NotFound() {
  return (
    <main data-theme="classic" className="bg-animated flex min-h-screen items-center justify-center px-6">
      <div className="text-center">
        <h1 className="font-display mb-4 text-3xl font-bold">העמוד לא נמצא</h1>
        <p className="mb-8 text-[var(--muted)]">
          ייתכן שהקישור שגוי או שהעמוד הוסר.
        </p>
        <Link
          href="/"
          className="rounded-full bg-[var(--accent)] px-8 py-3 font-semibold text-[var(--on-accent)]"
        >
          לדף הבית
        </Link>
      </div>
    </main>
  );
}
