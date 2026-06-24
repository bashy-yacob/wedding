import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBaseUrl } from "@/lib/url";
import { LANDINGS, getLanding } from "@/lib/landings";
import { LandingDemo } from "@/components/LandingDemo";
import { FloatingBackground } from "@/components/FloatingBackground";
import { DonationCTA } from "@/components/DonationCTA";
import { WallpaperChip } from "@/components/WallpaperChip";
import {
  Divider,
  EventOrnament,
  Pencil,
  LinkIcon,
  Send,
  Calendar,
  Chat,
  Sparkles,
  Palette,
  Gift,
  ArrowLeft,
} from "@/components/Ornaments";

// יוצר עמוד סטטי לכל סוג אירוע מתוך רשימת הנחיתות.
export function generateStaticParams() {
  return LANDINGS.map((l) => ({ event: l.slug }));
}

export const dynamicParams = false;

const STEPS = [
  {
    Icon: Pencil,
    title: "ממלאים פרטים",
    body: "שם, תאריך (עברי או לועזי), ובוחרים ערכת עיצוב.",
  },
  {
    Icon: LinkIcon,
    title: "מקבלים קישור",
    body: "נוצר קישור ייחודי וקצר לספירה שלכם — בלי הרשמה.",
  },
  {
    Icon: Send,
    title: "משתפים בוואטסאפ",
    body: "כל מי שנכנס רואה את הספירה ויכול לשלוח איחול.",
  },
];

const FEATURES = [
  { label: "תאריך עברי כראשי", Icon: Calendar },
  { label: "קיר ברכות פתוח", Icon: Chat },
  { label: "שיתוף בוואטסאפ", Icon: Send },
  { label: "מצב חגיגי ביום עצמו", Icon: Sparkles },
  { label: "6 ערכות עיצוב", Icon: Palette },
  { label: "ללא הרשמה, בחינם", Icon: Gift },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ event: string }>;
}): Promise<Metadata> {
  const { event } = await params;
  const landing = getLanding(event);
  if (!landing) return {};

  const baseUrl = await getBaseUrl();
  const url = `${baseUrl}/countdown/${landing.slug}`;

  return {
    title: landing.title,
    description: landing.description,
    keywords: landing.keywords,
    alternates: { canonical: `/countdown/${landing.slug}` },
    openGraph: {
      title: `${landing.heading} — עד החתונה`,
      description: landing.description,
      url,
      type: "website",
      locale: "he_IL",
    },
    twitter: {
      card: "summary_large_image",
      title: `${landing.heading} — עד החתונה`,
      description: landing.description,
    },
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ event: string }>;
}) {
  const { event } = await params;
  const landing = getLanding(event);
  if (!landing) notFound();

  const baseUrl = await getBaseUrl();
  const createHref = `/create?event=${encodeURIComponent(landing.eventType)}`;

  // נתונים מובנים (JSON-LD) — מסבירים לגוגל שזה כלי חינמי ייעודי לאירוע.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${landing.heading} — עד החתונה`,
    url: `${baseUrl}/countdown/${landing.slug}`,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    inLanguage: "he-IL",
    description: landing.description,
    offers: { "@type": "Offer", price: "0", priceCurrency: "ILS" },
  };

  // שאר הנחיתות לקישור פנימי (כל אירוע מלבד הנוכחי).
  const others = LANDINGS.filter((l) => l.slug !== landing.slug);

  return (
    <main
      data-theme={landing.theme}
      className="bg-animated relative min-h-screen overflow-hidden"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FloatingBackground />
      <WallpaperChip />

      {/* ------------------------------- Hero ------------------------------- */}
      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 pt-10 pb-10 text-center sm:pt-14">
        <EventOrnament
          eventType={landing.eventType}
          className="reveal mb-4 h-12 w-auto lg:h-16"
        />

        <span
          className="reveal accent-text mb-3 text-sm font-medium tracking-wide lg:text-base"
          style={{ animationDelay: "0.05s" }}
        >
          {landing.tagline}
        </span>

        <h1
          className="font-display accent-gradient-text reveal mb-4 text-4xl font-extrabold leading-tight sm:text-6xl lg:text-7xl"
          style={{ animationDelay: "0.1s" }}
        >
          {landing.heading}
        </h1>

        <p
          className="reveal mb-6 max-w-md text-lg leading-relaxed text-[var(--muted)] lg:max-w-xl lg:text-xl"
          style={{ animationDelay: "0.15s" }}
        >
          {landing.intro}
        </p>

        <Link
          href={createHref}
          className="reveal animate-pulse-glow rounded-full bg-[var(--accent)] px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-[var(--accent)]/30 transition hover:-translate-y-0.5 hover:shadow-xl lg:px-12 lg:py-5 lg:text-xl"
          style={{ animationDelay: "0.2s" }}
        >
          צרו ספירה
        </Link>

        <div className="reveal mt-10 w-full" style={{ animationDelay: "0.3s" }}>
          <LandingDemo eventType={landing.eventType} names={landing.exampleNames} />
        </div>
      </section>

      <Divider className="my-4" />

      {/* ---------------------------- איך זה עובד ---------------------------- */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-display mb-10 text-center text-3xl font-bold sm:text-4xl">
          איך זה עובד
        </h2>
        <div className="grid gap-6 sm:grid-cols-3 lg:gap-8">
          {STEPS.map((s, i) => (
            <div key={i} className="surface-card rounded-3xl p-7 text-center">
              <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                <s.Icon className="h-7 w-7" />
                <span className="accent-gradient-text font-display surface-card absolute -top-1 -left-1 flex h-6 w-6 items-center justify-center rounded-full text-sm font-extrabold">
                  {i + 1}
                </span>
              </div>
              <h3 className="mb-2 text-lg font-bold">{s.title}</h3>
              <p className="text-sm text-[var(--muted)]">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ----------------------------- יתרונות ----------------------------- */}
      <section className="mx-auto max-w-5xl px-6 pb-8">
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
            href={createHref}
            className="rounded-full bg-[var(--accent)] px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-[var(--accent)]/30 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            צרו ספירה ל{landing.eventType}
          </Link>
        </div>
      </section>

      {/* ----------------------- קישורים פנימיים ----------------------- */}
      <section className="mx-auto max-w-3xl px-6 pb-16">
        <p className="mb-4 text-center text-sm text-[var(--muted)]">
          ספירה לאחור גם ל…
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {others.map((l) => (
            <Link
              key={l.slug}
              href={`/countdown/${l.slug}`}
              className="surface-card rounded-full px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5 hover:text-[var(--accent)]"
            >
              {l.eventType}
            </Link>
          ))}
          <Link
            href="/"
            className="surface-card inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5 hover:text-[var(--accent)]"
          >
            חתונה
            <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
        </div>

        <DonationCTA />
      </section>
    </main>
  );
}
