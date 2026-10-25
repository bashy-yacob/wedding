import Link from "next/link";
import type { Metadata } from "next";
import { getBaseUrl } from "@/lib/url";
import { HeroDemo } from "@/components/HeroDemo";
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
  Rings,
  Send,
  Calendar,
  Chat,
  Sparkles,
  Palette,
  Photo,
  Gift,
  ArrowLeft,
  ArrowUp,
  Heart,
} from "@/components/Ornaments";
import { WallpaperChip } from "@/components/WallpaperChip";
import { LANDINGS } from "@/lib/landings";
import { BUILD_CONTACT_URL, CONTACT_EMAIL } from "@/lib/contact";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";
import "./home.css";

// דף הבית בשפת עיצוב "בוטיק" (home.css, תחום תחת .boutique).
// הפוטר הגלובלי (SiteFooter) מוסתר כאן — אזור הסטודיו בתחתית מחליף אותו.

const FEATURES = [
  { label: "תאריך עברי כראשי", Icon: Calendar },
  { label: "קיר ברכות פתוח", Icon: Chat },
  { label: "שיתוף בוואטסאפ", Icon: Send },
  { label: "מצב מזל טוב חגיגי", Icon: Sparkles },
  { label: "6 ערכות עיצוב", Icon: Palette },
  { label: "העלאת הזמנה", Icon: Photo },
  { label: "ללא הרשמה, בחינם", Icon: Gift },
];

// שאלות נפוצות — מוצגות בעמוד וגם כנתונים מובנים (FAQPage), ועונות על
// הביטויים שמחפשים ("כמה ימים נשארו לחתונה", "תאריך עברי לחתונה").
const FAQ: FaqItem[] = [
  {
    q: "כמה ימים נשארו לחתונה?",
    a: "יוצרים ספירה עם תאריך החתונה, והיא מראה בכל רגע כמה ימים, שעות ודקות נשארו — ומתעדכנת לבד בזמן אמת. אפשר להוסיף גם את שעת החופה, והספירה תגיע עד לשעה המדויקת.",
  },
  {
    q: "אפשר להזין תאריך עברי לחתונה?",
    a: "כן. בוחרים תאריך עברי או לועזי, והספירה מציגה את התאריך העברי כראשי — ואם רוצים, גם את התאריך הלועזי לצידו.",
  },
  {
    q: "זה עולה כסף? צריך להירשם?",
    a: "לא. יצירת הספירה חינמית לגמרי ואין צורך בהרשמה — ממלאים שמות ותאריך, בוחרים עיצוב, ומקבלים קישור תוך דקה.",
  },
  {
    q: "איך משתפים את הספירה עם המשפחה והחברים?",
    a: "כל ספירה מקבלת קישור ייחודי וקצר שאפשר לשלוח בוואטסאפ בלחיצה אחת. מי שפותח את הקישור רואה את הספירה ויכול להשאיר ברכה בקיר הברכות.",
  },
  {
    q: "אפשר לשנות את הפרטים אחרי שהספירה נוצרה?",
    a: "כן. עם יצירת הספירה מקבלים קישור עריכה אישי, שדרכו אפשר לעדכן את הפרטים ואת העיצוב בכל זמן. כדאי לשמור אותו במקום בטוח.",
  },
  {
    q: "הספירה שלנו תופיע בגוגל?",
    a: "לא. דפי הספירה האישיים אינם מופיעים בתוצאות החיפוש — רק מי שקיבל את הקישור יכול לראות אותם.",
  },
];

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  // openGraph של העמוד מחליף את זה של ה-layout, ולכן כל השדות חוזרים כאן.
  openGraph: {
    siteName: SITE_NAME,
    title: "עד החתונה — ספירה לאחור לחתונה",
    description: "ספירה אישית לחתונה עם תאריך עברי וקישור לשיתוף.",
    url: "/",
    type: "website",
    locale: "he_IL",
  },
};

export default async function HomePage() {
  const baseUrl = await getBaseUrl();

  // נתונים מובנים (JSON-LD): האתר, הארגון שמאחוריו, הכלי עצמו והשאלות הנפוצות.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        name: SITE_NAME,
        url: baseUrl,
        inLanguage: "he-IL",
        publisher: { "@id": `${baseUrl}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: SITE_NAME,
        url: baseUrl,
        logo: `${baseUrl}/icon-512.png`,
      },
      {
        "@type": "WebApplication",
        name: SITE_NAME,
        url: baseUrl,
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Web",
        inLanguage: "he-IL",
        description: SITE_DESCRIPTION,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "ILS",
        },
      },
      faqJsonLd(FAQ),
    ],
  };

  return (
    <main data-theme="classic" className="boutique">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* כפתור צד פינתי קבוע — מדריך לרקע חי על שולחן העבודה */}
      <WallpaperChip />

      {/* ------------------------------- Hero ------------------------------- */}
      <header className="b-hero" id="top">
        <BoutiqueNav
          createHref="/create"
          links={[
            { href: "#example", label: "הספירה לדוגמה" },
            { href: "#how", label: "איך זה עובד" },
            { href: "#events", label: "לא רק לחתונה" },
            { href: "#studio", label: "מי בנתה את האתר?" },
          ]}
        />

        <div className="b-hero-content b-container">
          <Rings className="reveal mx-auto mb-1.5 h-[52px] w-[84px]" />
          <div className="reveal b-eyebrow" style={{ animationDelay: "0.05s" }}>
            ספירה אישית לכל חתונה
          </div>
          <h1 className="reveal" style={{ animationDelay: "0.1s" }}>
            עד החתונה
            <span className="sr-only"> — ספירה לאחור לחתונה</span>
          </h1>
          <p className="reveal b-intro" style={{ animationDelay: "0.15s" }}>
            צרו ספירה לאחור חגיגית לחתונה — עם השמות, תאריך עברי כראשי, וקישור
            ייחודי לשיתוף קל בוואטסאפ.
          </p>
          <div className="reveal" style={{ animationDelay: "0.2s" }}>
            <Link href="/create" className="b-btn">
              גם אני רוצה ספירה משלי
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </div>
          <div className="b-micro">בחינם · בלי הרשמה · מוכן תוך דקה</div>

          <div className="reveal" style={{ animationDelay: "0.3s" }}>
            <p className="b-sample-label" id="example">
              כך תיראה הספירה שלכם
            </p>
            <HeroDemo />
          </div>
        </div>
      </header>

      <BoutiqueSteps firstStepBody="שמות, תאריך החתונה (עברי או לועזי), ובוחרים ערכת עיצוב." />
      <BoutiqueFeatures features={FEATURES} />

      {/* לא רק לחתונה — קישורים פנימיים לדפי הנחיתה */}
      <BoutiqueOccasions
        occasions={LANDINGS.map((l) => ({
          href: `/countdown/${l.slug}`,
          eventType: l.eventType,
          color: l.palette?.accent,
        }))}
      />

      <BoutiqueFaq items={FAQ} />

      <BoutiqueFinalCta createHref="/create" buttonLabel="צרו ספירה עכשיו" />

      {/* ------------------------ סטודיו: מי בנתה את האתר ------------------------ */}
      <section className="b-studio" id="studio" aria-labelledby="studio-title">
        <div className="b-studio-grain" aria-hidden />
        <div className="b-container b-studio-inner">
          <div className="b-studio-topline">
            <span className="b-studio-signature">
              באשי קליין <span>/</span> פיתוח אתרים ומערכות דיגיטליות
            </span>
            <span className="b-studio-tagline">מרעיון למוצר שעובד.</span>
          </div>
          <div className="b-studio-main">
            <div className="b-studio-kicker">מאחורי האתר הזה</div>
            <h2 id="studio-title">
              אהבתם את
              <br />
              <em>מה שראיתם?</em>
            </h2>
            <p className="b-studio-lead">עכשיו תארו לעצמכם מה אפשר ליצור בשבילכם.</p>
            <p className="b-studio-description">
              אני באשי קליין, מפתחת אתרים ומערכות דיגיטליות. מאתר תדמית לעסק ועד
              מערכת מורכבת בהתאמה אישית — אני הופכת רעיונות למוצרים שנראים מצוין
              ועובדים באמת.
            </p>
            <p className="b-studio-proof">
              האתר הזה הוא אחד הפרויקטים שפיתחתי, וכבר השתמשו בו אלפי אנשים.
            </p>
            <a
              href={BUILD_CONTACT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="b-studio-button"
            >
              <span>בואו נדבר על הפרויקט שלכם</span>
              <ArrowLeft />
            </a>
            <div className="b-studio-contact">
              מעדיפים לכתוב ישירות?{" "}
              <a href={BUILD_CONTACT_URL} target="_blank" rel="noopener noreferrer">
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="b-footer">
        <div className="b-container b-foot-inner">
          <div>© {new Date().getFullYear()} עד החתונה</div>
          <div className="b-credit">
            עיצוב ופיתוח: באשי קליין
            <Heart className="h-3.5 w-3.5" />
          </div>
          <a href="#top" className="b-credit">
            חזרה למעלה
            <ArrowUp className="h-4 w-4" />
          </a>
        </div>
      </footer>
    </main>
  );
}
