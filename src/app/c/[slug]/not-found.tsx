import Link from "next/link";

// ספירה שלא קיימת (או קישור עריכה שגוי) — הודעה ייעודית לדפי הספירה.
export default function CountdownNotFound() {
  return (
    <main data-theme="classic" className="bg-animated flex min-h-screen items-center justify-center px-6">
      <div className="text-center">
        <h1 className="font-display mb-4 text-3xl font-bold">הספירה לא נמצאה</h1>
        <p className="mb-8 text-[var(--muted)]">
          ייתכן שהקישור שגוי או שהספירה אינה קיימת.
        </p>
        <Link
          href="/create"
          className="rounded-full bg-[var(--accent)] px-8 py-3 font-semibold text-[var(--on-accent)]"
        >
          ליצירת ספירה חדשה
        </Link>
      </div>
    </main>
  );
}
