import Link from "next/link";
import { DonationCTA } from "@/components/DonationCTA";

export default function HomePage() {
  return (
    <main data-theme="classic" className="min-h-screen">
      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-16 text-center sm:py-24">
        <span className="accent-text mb-4 text-sm font-medium tracking-wide">
          ספירה אישית לכל חתונה
        </span>

        <h1 className="font-display mb-6 text-4xl font-extrabold leading-tight sm:text-6xl">
          עד החתונה
        </h1>

        <p className="mb-10 max-w-md text-lg leading-relaxed text-[var(--muted)]">
          צרו ספירה לאחור חגיגית לחתונה — עם השמות, תאריך עברי כראשי, וקישור
          ייחודי לשיתוף קל בוואטסאפ. בלי הרשמה, בחינם.
        </p>

        <Link
          href="/create"
          className="rounded-full bg-[var(--accent)] px-10 py-4 text-lg font-semibold text-white shadow-lg transition hover:opacity-90"
        >
          צרו ספירה
        </Link>

        <div className="surface-card mt-16 w-full rounded-3xl p-8">
          <p className="mb-2 text-sm text-[var(--muted)]">דוגמה</p>
          <p className="font-display mb-1 text-2xl font-bold">חיים ושרה</p>
          <div className="my-6 flex items-center justify-center gap-4 sm:gap-8">
            {[
              { n: "93", l: "ימים" },
              { n: "11", l: "שעות" },
              { n: "42", l: "דקות" },
            ].map((b) => (
              <div key={b.l} className="flex flex-col items-center">
                <span className="font-display accent-text text-4xl font-extrabold sm:text-5xl">
                  {b.n}
                </span>
                <span className="text-sm text-[var(--muted)]">{b.l}</span>
              </div>
            ))}
          </div>
          <p className="font-display text-lg font-semibold">כ״ב באדר התשפ״ו</p>
          <p className="text-sm text-[var(--muted)]">22 במרץ 2026</p>
        </div>

        {/* איך זה עובד */}
        <section className="mt-16 w-full">
          <h2 className="font-display mb-6 text-2xl font-bold">איך זה עובד?</h2>
          <ol className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {[
              {
                n: "1",
                t: "ממלאים פרטים",
                d: "שמות בני הזוג ותאריך החתונה — בתאריך עברי או לועזי.",
              },
              {
                n: "2",
                t: "מקבלים קישור",
                d: "נוצר קישור ייחודי לספירה — בלי הרשמה, בחינם.",
              },
              {
                n: "3",
                t: "משתפים וסופרים",
                d: "שולחים בוואטסאפ, והאורחים סופרים יחד אתכם.",
              },
            ].map((s) => (
              <li key={s.n} className="surface-card rounded-2xl p-5 text-center">
                <span className="font-display accent-text inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-soft)] text-xl font-extrabold">
                  {s.n}
                </span>
                <p className="font-display mt-3 text-lg font-semibold">{s.t}</p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
                  {s.d}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <ul className="mt-12 grid grid-cols-1 gap-3 text-sm text-[var(--muted)] sm:grid-cols-3">
          <li>תאריך עברי כראשי</li>
          <li>קיר ברכות פתוח</li>
          <li>שיתוף בוואטסאפ</li>
        </ul>

        <DonationCTA />
      </div>
    </main>
  );
}
