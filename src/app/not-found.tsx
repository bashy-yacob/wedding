import Link from "next/link";

export default function NotFound() {
  return (
    <main data-theme="classic" className="flex min-h-screen items-center justify-center px-6">
      <div className="text-center">
        <h1 className="font-display mb-4 text-3xl font-bold">הספירה לא נמצאה</h1>
        <p className="mb-8 text-[var(--muted)]">
          ייתכן שהקישור שגוי או שהספירה אינה קיימת.
        </p>
        <Link
          href="/"
          className="rounded-full bg-[var(--accent)] px-8 py-3 font-semibold text-white"
        >
          ליצירת ספירה חדשה
        </Link>
      </div>
    </main>
  );
}
