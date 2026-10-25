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
  BoutiqueFaq,
  faqJsonLd,
  type FaqItem,
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

// שאלות נפוצות לכל דף נחיתה — לפי סוג האירוע (מוצגות וגם כנתונים מובנים).
function landingFaq(eventType: string): FaqItem[] {
  return [
    {
      q: `כמה ימים נשארו ל${eventType}?`,
      a: `יוצרים ספירה עם התאריך, והיא מראה בכל רגע כמה ימים, שעות ודקות נשארו ל${eventType} — ומתעדכנת לבד בזמן אמת. אפשר להוסיף גם שעה מדויקת.`,
    },
    {
      q: "אפשר להזין תאריך עברי?",
      a: "כן. בוחרים תאריך עברי או לועזי, והספירה מציגה את התאריך העברי כראשי — ואם רוצים, גם את התאריך הלועזי לצידו.",
    },
    {
      q: "זה עולה כסף? צריך להירשם?",
      a: "לא. יצירת הספירה חינמית לגמרי ואין צורך בהרשמה — ממלאים שם ותאריך, בוחרים עיצוב, ומקבלים קישור תוך דקה.",
    },
    {
      q: "איך משתפים את הספירה?",
      a: "כל ספירה מקבלת קישור ייחודי וקצר שאפשר לשלוח בוואטסאפ בלחיצה אחת. מי שפותח את הקישור רואה את הספירה ויכול להשאיר ברכה בקיר הברכות.",
    },
  ];
}

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
      siteName: "עד החתונה",
      title: landing.title,
      description: landing.description,
      url,
      type: "website",
      locale: "he_IL",
    },
    twitter: {
      card: "summary_large_image",
      title: landing.title,
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

  const faq = landingFaq(landing.eventType);

  // נתונים מובנים (JSON-LD) — מסבירים לגוגל שזה כלי חינמי ייעודי לאירוע,
  // ומצרפים את השאלות הנפוצות שבעמוד.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: `${landing.heading} — עד החתונה`,
        url: `${baseUrl}/countdown/${landing.slug}`,
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Web",
        inLanguage: "he-IL",
        description: landing.description,
        offers: { "@type": "Offer", price: "0", priceCurrency: "ILS" },
      },
      faqJsonLd(faq),
    ],
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
      <BoutiqueFaq items={faq} />
      <BoutiqueFinalCta
        createHref={createHref}
        buttonLabel={`צרו ספירה ל${landing.eventType}`}
      />
    </main>
  );
}
