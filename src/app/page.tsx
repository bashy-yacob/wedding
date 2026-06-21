import Link from "next/link";
import { HeroDemo } from "@/components/HeroDemo";
import { FloatingBackground } from "@/components/FloatingBackground";
import { DonationCTA } from "@/components/DonationCTA";
import {
  Divider,
  Rings,
  Pencil,
  LinkIcon,
  Send,
  Calendar,
  Chat,
  Sparkles,
  Palette,
  Photo,
  Gift,
} from "@/components/Ornaments";

const STEPS = [
  {
    n: "1",
    Icon: Pencil,
    title: "ממלאים פרטים",
    body: "שמות, תאריך החתונה (עברי או לועזי), ובוחרים ערכת עיצוב.",
  },
  {
    n: "2",
    Icon: LinkIcon,
    title: "מקבלים קישור",
    body: "נוצר קישור ייחודי וקצר לספירה שלכם — בלי הרשמה.",
  },
  {
    n: "3",
    Icon: Send,
    title: "משתפים בוואטסאפ",
    body: "כל מי שנכנס רואה את הספירה ויכול לשלוח איחול.",
  },
];

const FEATURES = [
  { label: "תאריך עברי כראשי", Icon: Calendar },
  { label: "קיר ברכות פתוח", Icon: Chat },
  { label: "שיתוף בוואטסאפ", Icon: Send },
  { label: "מצב מזל טוב חגיגי", Icon: Sparkles },
  { label: "6 ערכות עיצוב", Icon: Palette },
  { label: "העלאת הזמנה", Icon: Photo },
  { label: "ללא הרשמה, בחינם", Icon: Gift },
];

export default function HomePage() {
  return (
    <main data-theme="classic" className="bg-animated relative min-h-screen overflow-hidden">
      <FloatingBackground />

      {/* ------------------------------- Hero ------------------------------- */}
      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 pt-10 pb-10 text-center sm:pt-14">
        <Rings className="reveal mb-4 h-12 w-20 lg:h-16 lg:w-28" />

        <span
          className="reveal accent-text mb-3 text-sm font-medium tracking-wide lg:text-base"
          style={{ animationDelay: "0.05s" }}
        >
          ספירה אישית לכל חתונה
        </span>

        <h1
          className="font-display accent-gradient-text reveal mb-4 text-5xl font-extrabold leading-tight sm:text-7xl lg:text-8xl"
          style={{ animationDelay: "0.1s" }}
        >
          עד החתונה
        </h1>

        <p
          className="reveal mb-6 max-w-md text-lg leading-relaxed text-[var(--muted)] lg:max-w-xl lg:text-xl"
          style={{ animationDelay: "0.15s" }}
        >
          צרו ספירה לאחור חגיגית לחתונה — עם השמות, תאריך עברי כראשי, וקישור ייחודי
          לשיתוף קל בוואטסאפ. בלי הרשמה, בחינם.
        </p>

        <Link
          href="/create"
          className="reveal animate-pulse-glow rounded-full bg-[var(--accent)] px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-[var(--accent)]/30 transition hover:-translate-y-0.5 hover:shadow-xl lg:px-12 lg:py-5 lg:text-xl"
          style={{ animationDelay: "0.2s" }}
        >
          צרו ספירה
        </Link>

        <div className="reveal mt-10 w-full" style={{ animationDelay: "0.3s" }}>
          <HeroDemo />
        </div>
      </section>

      <Divider className="my-4" />

      {/* ---------------------------- איך זה עובד ---------------------------- */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-display mb-10 text-center text-3xl font-bold sm:text-4xl">
          איך זה עובד
        </h2>
        <div className="grid gap-6 sm:grid-cols-3 lg:gap-8">
          {STEPS.map((s) => (
            <div key={s.n} className="surface-card rounded-3xl p-7 text-center">
              <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                <s.Icon className="h-7 w-7" />
                <span className="accent-gradient-text font-display surface-card absolute -top-1 -left-1 flex h-6 w-6 items-center justify-center rounded-full text-sm font-extrabold">
                  {s.n}
                </span>
              </div>
              <h3 className="mb-2 text-lg font-bold">{s.title}</h3>
              <p className="text-sm text-[var(--muted)]">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ----------------------------- יתרונות ----------------------------- */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4">
          {FEATURES.map((f) => (
            <li
              key={f.label}
              className="surface-card flex items-center gap-2 rounded-2xl px-4 py-3 text-sm"
            >
              <f.Icon className="h-4 w-4 shrink-0 text-[var(--accent)]" />
              {f.label}
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

          <p className="mt-5 text-sm text-[var(--muted)]">
            <Link
              href="/wallpaper"
              className="font-medium accent-text underline-offset-4 hover:underline"
            >
              🖥️ אפשר גם להפוך אותה לרקע חי על שולחן העבודה →
            </Link>
          </p>
        </div>

        <DonationCTA />
      </section>
    </main>
  );
}
