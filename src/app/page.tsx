import Link from "next/link";
import type { Metadata } from "next";
import { getBaseUrl } from "@/lib/url";
import { HeroDemo } from "@/components/HeroDemo";
import { DonationCTA } from "@/components/DonationCTA";
import {
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
  Monitor,
  ArrowLeft,
  ArrowUp,
  Heart,
  EventOrnament,
} from "@/components/Ornaments";
import { WallpaperChip } from "@/components/WallpaperChip";
import { LANDINGS } from "@/lib/landings";
import { THEMES, THEME_KEYS } from "@/lib/themes";
import { BUILD_CONTACT_URL, CONTACT_EMAIL } from "@/lib/contact";
import "./home.css";

// דף הבית בשפת עיצוב "בוטיק" (home.css, תחום תחת .boutique).
// הפוטר והצ'יפ הגלובליים (SiteFooter / BuilderChip) מוסתרים כאן — אזור
// הסטודיו בתחתית מחליף אותם — ובשאר הדפים הם נשארים כמו שהם.

const STEPS = [
  {
    n: "01",
    Icon: Pencil,
    title: "ממלאים פרטים",
    body: "שמות, תאריך החתונה (עברי או לועזי), ובוחרים ערכת עיצוב.",
  },
  {
    n: "02",
    Icon: LinkIcon,
    title: "מקבלים קישור",
    body: "נוצר קישור ייחודי וקצר לספירה שלכם — בלי הרשמה.",
  },
  {
    n: "03",
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

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const baseUrl = await getBaseUrl();

  // נתונים מובנים (JSON-LD) — עוזרים לגוגל להבין שזה כלי/שירות חינמי.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "עד החתונה",
    url: baseUrl,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    inLanguage: "he-IL",
    description:
      "צרו ספירה לאחור אישית לחתונה, עם תאריך עברי וקישור ייחודי לשיתוף בוואטסאפ. בלי הרשמה, בחינם.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "ILS",
    },
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
        <nav className="b-nav b-container">
          <Link href="/" className="b-brand">
            <Rings className="h-[25px] w-10" />
            עד החתונה
          </Link>
          <div className="b-navlinks">
            <a href="#example">הספירה לדוגמה</a>
            <a href="#how">איך זה עובד</a>
            <a href="#events">לא רק לחתונה</a>
            <a href="#studio">מי בנתה את האתר?</a>
          </div>
          <Link href="/create" className="b-navcta">
            צרו ספירה
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </nav>

        <div className="b-hero-content b-container">
          <Rings className="reveal mx-auto mb-1.5 h-[52px] w-[84px]" />
          <div className="reveal b-eyebrow" style={{ animationDelay: "0.05s" }}>
            ספירה אישית לכל חתונה
          </div>
          <h1 className="reveal" style={{ animationDelay: "0.1s" }}>
            עד החתונה
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

      {/* ---------------------------- איך זה עובד ---------------------------- */}
      <section className="b-section b-steps" id="how">
        <div className="b-container">
          <div className="b-section-heading">
            <div className="b-eyebrow">פשוט, אישי, שלכם</div>
            <h2>איך זה עובד</h2>
            <p>שלושה צעדים קטנים — ויש לכם ספירה אישית שכל המשפחה יכולה לפתוח.</p>
          </div>
          <div className="b-step-list">
            {STEPS.map((s) => (
              <article key={s.n} className="b-step">
                <div className="b-step-head">
                  <span className="b-step-num">{s.n}</span>
                  <span className="b-step-icon">
                    <s.Icon className="h-6 w-6" />
                  </span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------- יכולות ----------------------------- */}
      <section className="b-section b-features">
        <div className="b-container">
          <div className="b-feature-layout">
            <div className="b-feature-copy">
              <div className="b-eyebrow">כל הפרטים הקטנים</div>
              <h2>
                הרבה יותר
                <br />
                מספירה לאחור.
              </h2>
              <p>
                ספירה שכיף לפתוח שוב ושוב — עם קיר ברכות מהמשפחה והחברים, ומצב
                מזל טוב חגיגי כשהרגע מגיע.
              </p>
              <ul className="b-feature-points">
                {FEATURES.map((f) => (
                  <li key={f.label}>
                    <f.Icon className="h-[19px] w-[19px] shrink-0" />
                    {f.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* שש ערכות העיצוב — הצבעים נלקחים מ-themes.ts */}
            <div className="b-theme-board" aria-label="שש ערכות העיצוב">
              <div className="b-theme-grid">
                {THEME_KEYS.map((k) => {
                  const t = THEMES[k];
                  return (
                    <div
                      key={k}
                      className="b-theme-chip"
                      style={{ background: t.bgGradient, color: t.text }}
                    >
                      <b style={{ color: t.accent }}>93</b>
                      <span>ימים</span>
                      <em>{t.label}</em>
                    </div>
                  );
                })}
              </div>
              <p className="b-theme-caption">כל ספירה בשפת עיצוב משלה</p>
            </div>
          </div>

          <div className="b-wallpaper-band">
            <div>
              <Monitor className="h-[34px] w-[34px] shrink-0" />
              <p>
                <strong>הספירה גם על שולחן העבודה</strong>
                <span>מדריך קצר להפוך את הספירה לרקע חי שמתעדכן בזמן אמת.</span>
              </p>
            </div>
            <Link href="/wallpaper" className="b-textlink">
              למדריך
              <ArrowLeft className="h-[18px] w-[18px]" />
            </Link>
          </div>
        </div>
      </section>

      {/* ------------- לא רק לחתונה — קישורים פנימיים לדפי הנחיתה ------------- */}
      <section className="b-section b-occasions" id="events">
        <div className="b-container">
          <div className="b-section-heading">
            <div className="b-eyebrow">לא רק לחתונה</div>
            <h2>סופרים למשהו אחר?</h2>
            <p>אותה ספירה, אותה התרגשות — לכל רגע ששווה לחכות לו.</p>
          </div>
          <div className="b-occasion-grid">
            {LANDINGS.map((l) => (
              <Link
                key={l.slug}
                href={`/countdown/${l.slug}`}
                className="b-occasion"
                style={l.accentColor ? ({ "--oc": l.accentColor } as React.CSSProperties) : undefined}
              >
                <EventOrnament
                  eventType={l.eventType}
                  className="b-occasion-icon h-8 w-8"
                />
                <strong>{l.eventType}</strong>
                <span className="b-textlink">
                  ספירה ל{l.eventType}
                  <ArrowLeft className="h-[18px] w-[18px]" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------- קריאה לפעולה ---------------------------- */}
      <section className="b-finalcta">
        <div className="b-container">
          <div className="b-eyebrow">הגיע הזמן להתחיל לספור</div>
          <h2>הספירה שלכם מתחילה כאן.</h2>
          <p>בוחרים תאריך, מוסיפים שמות — ויש לכם ספירה אישית.</p>
          <Link href="/create" className="b-btn">
            צרו ספירה עכשיו
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <DonationCTA />
        </div>
      </section>

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
