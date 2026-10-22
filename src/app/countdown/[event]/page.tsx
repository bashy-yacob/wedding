import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBaseUrl } from "@/lib/url";
import { LANDINGS, getLanding } from "@/lib/landings";
import { HeroDemo } from "@/components/HeroDemo";
import { WallpaperChip } from "@/components/WallpaperChip";
import {
  BoutiqueNav,
  BoutiqueSteps,
  BoutiqueFeatures,
  BoutiqueOccasions,
  BoutiqueFinalCta,
} from "@/components/Boutique";
import {
  EventOrnament,
  Send,
  Calendar,
  Chat,
  Sparkles,
  Palette,
  Gift,
  ArrowLeft,
} from "@/components/Ornaments";
import "../../home.css";

// יוצר עמוד סטטי לכל סוג אירוע מתוך רשימת הנחיתות.
export function generateStaticParams() {
  return LANDINGS.map((l) => ({ event: l.slug }));
}

export const dynamicParams = false;

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

  // שאר הנחיתות לקישור פנימי (כל אירוע מלבד הנוכחי), ובסוף — חתונה (דף הבית).
  const others = [
    ...LANDINGS.filter((l) => l.slug !== landing.slug).map((l) => ({
      href: `/countdown/${l.slug}`,
      eventType: l.eventType,
      color: l.palette?.accent,
    })),
    { href: "/", eventType: "חתונה" },
  ];

  // צבעי הדגש של האירוע מעל שפת ה"בוטיק" (ברירת מחדל — הזהב של דף הבית).
  const paletteStyle = landing.palette
    ? ({
        "--accent": landing.palette.accent,
        "--accent-ink": landing.palette.ink,
        "--accent-display": landing.palette.display,
      } as React.CSSProperties)
    : undefined;

  return (
    <main data-theme="classic" className="boutique" style={paletteStyle}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WallpaperChip />

      {/* ------------------------------- Hero ------------------------------- */}
      <header className="b-hero" id="top">
        <BoutiqueNav
          createHref={createHref}
          links={[
            { href: "#example", label: "הספירה לדוגמה" },
            { href: "#how", label: "איך זה עובד" },
            { href: "#events", label: "ספירות נוספות" },
          ]}
        />

        <div className="b-hero-content b-container">
          <EventOrnament
            eventType={landing.eventType}
            className="reveal b-hero-ornament mx-auto mb-1.5 h-[52px] w-auto"
          />
          <div className="reveal b-eyebrow" style={{ animationDelay: "0.05s" }}>
            {landing.tagline}
          </div>
          <h1 className="reveal b-h1-long" style={{ animationDelay: "0.1s" }}>
            {landing.heading}
          </h1>
          <p className="reveal b-intro" style={{ animationDelay: "0.15s" }}>
            {landing.intro}
          </p>
          <div className="reveal" style={{ animationDelay: "0.2s" }}>
            <Link href={createHref} className="b-btn">
              גם אני רוצה ספירה משלי
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </div>
          <div className="b-micro">בחינם · בלי הרשמה · מוכן תוך דקה</div>

          <div className="reveal" style={{ animationDelay: "0.3s" }}>
            <p className="b-sample-label" id="example">
              כך תיראה הספירה שלכם
            </p>
            <HeroDemo
              eventType={landing.eventType}
              names={landing.exampleNames}
              daysAhead={120}
            />
          </div>
        </div>
      </header>

      <BoutiqueSteps firstStepBody="שם, תאריך (עברי או לועזי), ובוחרים ערכת עיצוב." />
      <BoutiqueFeatures features={FEATURES} />
      <BoutiqueOccasions occasions={others} />
      <BoutiqueFinalCta
        createHref={createHref}
        buttonLabel={`צרו ספירה ל${landing.eventType}`}
      />
    </main>
  );
}
