import Link from "next/link";
import { HeroDemo } from "@/components/HeroDemo";
import { FloatingBackground } from "@/components/FloatingBackground";
import { DonationCTA } from "@/components/DonationCTA";
import { Divider, Rings, Heart } from "@/components/Ornaments";

const STEPS = [
  {
    n: "1",
    title: "ממלאים פרטים",
    body: "שמות, תאריך החתונה (עברי או לועזי), ובוחרים ערכת עיצוב.",
  },
  {
    n: "2",
    title: "מקבלים קישור",
    body: "נוצר קישור ייחודי וקצר לספירה שלכם — בלי הרשמה.",
  },
  {
    n: "3",
    title: "משתפים בוואטסאפ",
    body: "כל מי שנכנס רואה את הספירה ויכול לשלוח איחול.",
  },
];

const FEATURES = [
  "תאריך עברי כראשי",
  "קיר ברכות פתוח",
  "שיתוף בוואטסאפ",
  "מצב מזל טוב חגיגי",
  "6 ערכות עיצוב",
  "ללא הרשמה, בחינם",
];

export default function HomePage() {
  return (
    <main data-theme="classic" className="bg-animated relative min-h-screen overflow-hidden">
      <FloatingBackground />

      {/* ------------------------------- Hero ------------------------------- */}
      <section className="mx-auto flex max-w-5xl flex-col items-center px-6 pt-16 pb-12 text-center sm:pt-24">
        <Rings className="reveal mb-6 h-12 w-20" />

        <span
          className="reveal accent-text mb-4 text-sm font-medium tracking-wide"
          style={{ animationDelay: "0.05s" }}
        >
          ספירה אישית לכל חתונה
        </span>

        <h1
          className="font-display accent-gradient-text reveal mb-6 text-5xl font-extrabold leading-tight sm:text-7xl"
          style={{ animationDelay: "0.1s" }}
        >
          עד החתונה
        </h1>

        <p
          className="reveal mb-10 max-w-md text-lg leading-relaxed text-[var(--muted)]"
          style={{ animationDelay: "0.15s" }}
        >
          צרו ספירה לאחור חגיגית לחתונה — עם השמות, תאריך עברי כראשי, וקישור ייחודי
          לשיתוף קל בוואטסאפ. בלי הרשמה, בחינם.
        </p>

        <Link
          href="/create"
          className="reveal animate-pulse-glow rounded-full bg-[var(--accent)] px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-[var(--accent)]/30 transition hover:-translate-y-0.5 hover:shadow-xl"
          style={{ animationDelay: "0.2s" }}
        >
          צרו ספירה
        </Link>

        <div className="reveal mt-16 w-full" style={{ animationDelay: "0.3s" }}>
          <HeroDemo />
        </div>
      </section>

      <Divider className="my-4" />

      {/* ---------------------------- איך זה עובד ---------------------------- */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-display mb-10 text-center text-3xl font-bold">
          איך זה עובד
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="surface-card rounded-3xl p-7 text-center">
              <span className="accent-gradient-text font-display mb-3 block text-4xl font-extrabold">
                {s.n}
              </span>
              <h3 className="mb-2 text-lg font-bold">{s.title}</h3>
              <p className="text-sm text-[var(--muted)]">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ----------------------------- יתרונות ----------------------------- */}
      <section className="mx-auto max-w-3xl px-6 pb-20">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <li
              key={f}
              className="surface-card flex items-center gap-2 rounded-2xl px-4 py-3 text-sm"
            >
              <Heart className="h-4 w-4 shrink-0 text-[var(--accent)]" />
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-14 text-center">
          <Link
            href="/create"
            className="rounded-full bg-[var(--accent)] px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-[var(--accent)]/30 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            צרו ספירה עכשיו
          </Link>
        </div>

        <DonationCTA />
      </section>
    </main>
  );
}
