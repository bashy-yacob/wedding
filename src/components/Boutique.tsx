import Link from "next/link";
import type { ComponentType } from "react";
import { THEMES, THEME_KEYS } from "@/lib/themes";
import { DonationCTA } from "@/components/DonationCTA";
import {
  Rings,
  Pencil,
  LinkIcon,
  Send,
  Monitor,
  ArrowLeft,
  EventOrnament,
  Plus,
} from "@/components/Ornaments";

// קטעים משותפים בשפת ה"בוטיק" (src/app/home.css) — דף הבית ודפי הנחיתה
// לאירועים בונים מהם את העמוד. מאפייני data-reveal / data-stagger מסמנים
// אנימציות כניסה בגלילה; הן פועלות רק בעמוד שמרכיב את BoutiqueMotion.
// צבעי הדגש מגיעים מהמשתנים של .boutique, כך שכל דף נחיתה יכול לצבוע
// אותם מחדש בלי לגעת במבנה.

type Icon = ComponentType<{ className?: string }>;

export function BoutiqueNav({
  links,
  createHref,
}: {
  links: { href: string; label: string }[];
  createHref: string;
}) {
  return (
    <nav className="b-nav b-container">
      <Link href="/" className="b-brand">
        <Rings className="h-[25px] w-10" />
        עד החתונה
      </Link>
      <div className="b-navlinks">
        {links.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
      </div>
      <Link href={createHref} className="b-navcta">
        צרו ספירה
        <ArrowLeft className="h-4 w-4" />
      </Link>
    </nav>
  );
}

export function BoutiqueSteps({ firstStepBody }: { firstStepBody: string }) {
  const steps = [
    { n: "01", Icon: Pencil, title: "ממלאים פרטים", body: firstStepBody },
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

  return (
    <section className="b-section b-steps" id="how">
      <div className="b-container">
        <div className="b-section-heading" data-stagger="0.12">
          <div className="b-eyebrow" data-reveal="blur">פשוט, אישי, שלכם</div>
          <h2 data-reveal="mask">איך זה עובד</h2>
          <p data-reveal="up">שלושה צעדים קטנים — ויש לכם ספירה אישית שכל המשפחה יכולה לפתוח.</p>
        </div>
        <div className="b-step-list" data-stagger="0.18">
          {steps.map((s) => (
            <article key={s.n} className="b-step" data-reveal="up">
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
  );
}

export function BoutiqueFeatures({
  features,
}: {
  features: { label: string; Icon: Icon }[];
}) {
  return (
    <section className="b-section b-features">
      <div className="b-container">
        <div className="b-feature-layout">
          <div className="b-feature-copy" data-stagger="0.1">
            <div className="b-eyebrow" data-reveal="blur">כל הפרטים הקטנים</div>
            <h2 data-reveal="mask">
              הרבה יותר
              <br />
              מספירה לאחור.
            </h2>
            <p data-reveal="up">
              ספירה שכיף לפתוח שוב ושוב — עם קיר ברכות מהמשפחה והחברים, ומצב
              מזל טוב חגיגי כשהרגע מגיע.
            </p>
            <ul className="b-feature-points" data-stagger="0.07">
              {features.map((f) => (
                <li key={f.label} data-reveal="right">
                  <f.Icon className="h-[19px] w-[19px] shrink-0" />
                  {f.label}
                </li>
              ))}
            </ul>
          </div>

          {/* שש ערכות העיצוב — הצבעים נלקחים מ-themes.ts */}
          <div className="b-theme-board" aria-label="שש ערכות העיצוב" data-reveal="tilt">
            <div className="b-theme-grid" data-stagger="0.1">
              {THEME_KEYS.map((k) => {
                const t = THEMES[k];
                return (
                  <div
                    key={k}
                    className="b-theme-chip"
                    data-reveal="flip"
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

        <div className="b-wallpaper-band" data-reveal="wipe">
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
  );
}

export interface OccasionLink {
  href: string;
  eventType: string;
  /** צבע האייקון; ברירת מחדל — הזהב של דף הבית */
  color?: string;
}

export function BoutiqueOccasions({ occasions }: { occasions: OccasionLink[] }) {
  return (
    <section className="b-section b-occasions" id="events">
      <div className="b-container">
        <div className="b-section-heading" data-stagger="0.12">
          <div className="b-eyebrow" data-reveal="blur">לא רק לחתונה</div>
          <h2 data-reveal="mask">סופרים למשהו אחר?</h2>
          <p data-reveal="up">אותה ספירה, אותה התרגשות — לכל רגע ששווה לחכות לו.</p>
        </div>
        <div className="b-occasion-grid" data-stagger="0.09">
          {occasions.map((o) => (
            <Link
              key={o.href}
              href={o.href}
              className="b-occasion"
              data-reveal="zoom"
              style={o.color ? ({ "--oc": o.color } as React.CSSProperties) : undefined}
            >
              <EventOrnament eventType={o.eventType} className="b-occasion-icon h-8 w-8" />
              <strong>{o.eventType}</strong>
              <span className="b-textlink">
                ספירה ל{o.eventType}
                <ArrowLeft className="h-[18px] w-[18px]" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BoutiqueFinalCta({
  createHref,
  buttonLabel,
}: {
  createHref: string;
  buttonLabel: string;
}) {
  return (
    <section className="b-finalcta">
      <div className="b-container" data-stagger="0.12">
        <div className="b-eyebrow" data-reveal="blur">הגיע הזמן להתחיל לספור</div>
        <h2 data-reveal="zoom">הספירה שלכם מתחילה כאן.</h2>
        <p data-reveal="up">בוחרים תאריך, מוסיפים שמות — ויש לכם ספירה אישית.</p>
        <Link href={createHref} className="b-btn b-btn-shine" data-reveal="pop">
          {buttonLabel}
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <DonationCTA />
      </div>
    </section>
  );
}

export interface FaqItem {
  q: string;
  a: string;
}

/** בונה נתונים מובנים מסוג FAQPage מאותן שאלות שמוצגות בעמוד. */
export function faqJsonLd(items: FaqItem[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function BoutiqueFaq({ items }: { items: FaqItem[] }) {
  return (
    <section className="b-section b-faq" id="faq">
      <div className="b-container">
        <div className="b-section-heading" data-stagger="0.12">
          <div className="b-eyebrow" data-reveal="blur">שאלות ותשובות</div>
          <h2 data-reveal="mask">שאלות נפוצות</h2>
        </div>
        {/* אקורדיון — רואים רק את השאלות, ולחיצה פותחת את התשובה. התשובות
            נשארות ב-HTML (בתוך details), כך שגוגל קורא אותן. */}
        <div className="b-faq-list" data-stagger="0.08">
          {items.map((item) => (
            <details key={item.q} className="b-faq-item" data-reveal="up">
              <summary>
                <h3>{item.q}</h3>
                <span className="b-faq-toggle" aria-hidden>
                  <Plus className="h-5 w-5" />
                </span>
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
