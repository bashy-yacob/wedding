import Link from "next/link";
import type { Metadata } from "next";
import { FloatingBackground } from "@/components/FloatingBackground";
import {
  Divider,
  Rings,
  Monitor,
  Download,
  LinkIcon,
  Check,
} from "@/components/Ornaments";
import { WallpaperLinkBox } from "./WallpaperLinkBox";

export const metadata: Metadata = {
  title: "הספירה על שולחן העבודה",
  description:
    "מדריך פשוט להפוך את הספירה לאחור לרקע חי על שולחן העבודה של Windows — בלי דפדפן, מתעדכן בזמן אמת.",
  alternates: { canonical: "/wallpaper" },
  openGraph: {
    title: "הספירה על שולחן העבודה של Windows",
    description:
      "הופכים את הספירה לאחור לרקע חי שמתעדכן בזמן אמת — בעזרת Lively Wallpaper, חינמי.",
    type: "article",
    locale: "he_IL",
  },
};

// קישורים רשמיים ל-Lively Wallpaper (כלי קוד פתוח חינמי).
const STORE_URL = "https://apps.microsoft.com/detail/9NTM2QC6QWS7";
const SITE_URL = "https://www.rocksdanister.com/lively/";
const GITHUB_URL = "https://github.com/rocksdanister/lively";

// כל שלב עם צילום המסך שלו (אם יש) — כך קל לעקוב: קוראים, ומיד רואים איך זה נראה.
const STEPS = [
  {
    Icon: Download,
    title: "מתקינים את Lively (חינם)",
    body: "פותחים את Microsoft Store, מחפשים “Lively Wallpaper”, ומתקינים.",
    img: null,
  },
  {
    Icon: LinkIcon,
    title: "מדביקים את הקישור שלכם",
    body: "ב-Lively לוחצים על ＋, בוחרים “הזן כתובת URL”, מדביקים את הקישור (מהתיבה למעלה) ולוחצים על החץ.",
    img: "/wallpaper/add.png",
  },
  {
    Icon: Check,
    title: "לוחצים אישור",
    body: "Lively מציג תצוגה מקדימה של הספירה. לוחצים “אישור”.",
    img: "/wallpaper/display.png",
  },
  {
    Icon: Monitor,
    title: "בוחרים מסך ומאשרים — וזהו!",
    body: "מתוך כל המסכים שמוצגים, לוחצים על המסך שעליו רוצים את הרקע. עכשיו פותחים בעצמכם את חלונית האישור — לוחצים על הסימן המודגש בצהוב — ומאשרים שם. הספירה תופיע חיה על שולחן העבודה.",
    img: "/wallpaper/library.png",
  },
];

const FAQ = [
  {
    q: "הרקע יוצא שחור / לבן או שהספירה לא מופיעה. מה עושים?",
    a: "1) ודאו שהדבקתם את קישור מצב-הרקע (זה שמסתיים ב-/wallpaper) ולא את הקישור הרגיל. 2) ודאו שהקישור מתחיל ב-https. 3) Lively מציג אתרים דרך רכיב של Windows בשם WebView2 — אם הרקע שחור, התקינו אותו בחינם מ-Microsoft (חפשו “WebView2 Runtime”) והפעילו מחדש את Lively. 4) בדקו שיש חיבור לאינטרנט — הספירה נטענת מהרשת.",
  },
  {
    q: "זה עולה כסף?",
    a: "לא. Lively Wallpaper הוא כלי חינמי וקוד פתוח. גם הספירה עצמה חינמית.",
  },
  {
    q: "זה יאט לי את המחשב?",
    a: "Lively חוסך משאבים כשמשחקים או עובדים במסך מלא — הוא משהה את הרקע אוטומטית. למחשב רגיל ההשפעה זניחה.",
  },
  {
    q: "אפשר גם על מסך הנעילה של Windows?",
    a: "מסך הנעילה תומך רק בתמונה קבועה, לכן אי אפשר להריץ שם ספירה חיה. הפתרון מיועד לשולחן העבודה. לכל היותר אפשר לשים במסך הנעילה צילום מסך של הספירה (אבל אז המספרים לא יתקדמו).",
  },
  {
    q: "ובמק (Mac)?",
    a: "Lively הוא ל-Windows בלבד. ב-Mac יש כלים דומים (כמו Plash) שמאפשרים גם הם להגדיר אתר כרקע חי — אותו רעיון בדיוק.",
  },
];

// איור: מסך מחשב עם הספירה כרקע (וקטורי, בצבעי ה-theme — בלי צילום מסך).
function DesktopArt() {
  return (
    <svg
      viewBox="0 0 320 230"
      className="mx-auto h-auto w-full max-w-md"
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="wp-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--bg-3)" />
          <stop offset="100%" stopColor="var(--bg-2)" />
        </linearGradient>
        <linearGradient id="wp-accent" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--accent-2)" />
        </linearGradient>
      </defs>

      {/* הילה רכה */}
      <ellipse cx="160" cy="100" rx="150" ry="92" fill="var(--accent-soft)" opacity="0.5" />

      {/* מסך */}
      <rect
        x="24"
        y="16"
        width="272"
        height="168"
        rx="14"
        fill="var(--surface)"
        stroke="color-mix(in srgb, var(--accent) 50%, transparent)"
        strokeWidth="2"
      />
      <rect x="30" y="22" width="260" height="156" rx="9" fill="url(#wp-bg)" />

      {/* טבעות קטנות */}
      <g
        stroke="var(--accent)"
        strokeWidth="2"
        fill="none"
        transform="translate(146 42)"
        opacity="0.9"
      >
        <circle cx="7" cy="8" r="6" />
        <circle cx="16" cy="8" r="6" opacity="0.7" />
      </g>

      {/* "ספרות" הספירה */}
      <g transform="translate(0 80)">
        {[60, 122, 184, 246].map((x, i) => (
          <g key={x} transform={`translate(${x} 0)`}>
            <text
              x="0"
              y="0"
              textAnchor="middle"
              fontSize="30"
              fontWeight="800"
              fill="url(#wp-accent)"
            >
              {["128", "06", "14", "30"][i]}
            </text>
            <text x="0" y="16" textAnchor="middle" fontSize="8" fill="var(--muted)">
              {["ימים", "שעות", "דק׳", "שנ׳"][i]}
            </text>
          </g>
        ))}
      </g>

      {/* קו תאריך */}
      <rect
        x="118"
        y="130"
        width="84"
        height="7"
        rx="3.5"
        fill="color-mix(in srgb, var(--accent) 40%, transparent)"
      />

      {/* אייקוני שולחן עבודה בפינה */}
      <g fill="color-mix(in srgb, var(--text) 20%, transparent)">
        <rect x="40" y="32" width="16" height="16" rx="3" />
        <rect x="40" y="56" width="16" height="16" rx="3" />
        <rect x="40" y="80" width="16" height="16" rx="3" />
      </g>

      {/* רגל המסך */}
      <rect x="148" y="184" width="24" height="18" fill="var(--muted)" opacity="0.45" />
      <rect x="116" y="200" width="88" height="9" rx="4.5" fill="var(--muted)" opacity="0.55" />
    </svg>
  );
}

export default async function WallpaperGuidePage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  const { c } = await searchParams;

  // נתונים מובנים (JSON-LD) מסוג FAQPage — עוזרים לגוגל להבין שהעמוד עונה
  // על שאלות נפוצות סביב הפיכת הספירה לרקע חי.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <main data-theme="classic" className="bg-animated relative min-h-screen overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FloatingBackground />

      {/* ------------------------------- Hero ------------------------------- */}
      <section className="mx-auto flex max-w-3xl flex-col items-center px-6 pt-14 pb-6 text-center">
        <Rings className="reveal mb-5 h-12 w-20" />

        <span
          className="reveal accent-text mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-4 py-1.5 text-sm font-medium"
          style={{ animationDelay: "0.05s" }}
        >
          <Monitor className="h-4 w-4" />
          רקע חי לשולחן העבודה
        </span>

        <h1
          className="font-display accent-gradient-text reveal mb-5 text-4xl font-extrabold leading-tight sm:text-6xl"
          style={{ animationDelay: "0.1s" }}
        >
          הספירה על שולחן העבודה
        </h1>

        <p
          className="reveal mb-10 max-w-xl text-lg leading-relaxed text-[var(--muted)]"
          style={{ animationDelay: "0.15s" }}
        >
          אפשר להפוך את הספירה לאחור ל
          <strong className="text-[var(--text)]">רקע חי</strong> על שולחן העבודה של
          Windows — שיתעדכן בזמן אמת, מאחורי האייקונים, בלי שום דפדפן פתוח. הנה איך,
          בכמה דקות וללא עלות.
        </p>

        <div className="reveal w-full" style={{ animationDelay: "0.2s" }}>
          <DesktopArt />
        </div>
      </section>

      <Divider className="my-6" />

      {/* תיבת הקישור האישי — רק כשמגיעים מתוך עמוד ספירה */}
      {c && (
        <section className="px-6">
          <WallpaperLinkBox slug={c} />
        </section>
      )}

      {/* --------------------- שלבים (כל שלב עם התמונה שלו) --------------------- */}
      <section className="mx-auto max-w-2xl px-6 py-10">
        <h2 className="font-display mb-12 text-center text-3xl font-bold sm:text-4xl">
          4 שלבים פשוטים
        </h2>

        <ol className="space-y-8">
          {STEPS.map((s, i) => (
            <li
              key={s.title}
              className="surface-card overflow-hidden rounded-3xl"
            >
              <div className="flex items-start gap-4 p-5">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                  <s.Icon className="h-6 w-6" />
                  <span className="accent-gradient-text font-display surface-card absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-extrabold">
                    {i + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 text-lg font-bold">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-[var(--muted)]">
                    {s.body}
                  </p>

                  {/* שלב ההתקנה — כפתור הורדה ישיר בתוך השלב */}
                  {i === 0 && (
                    <a
                      href={STORE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--on-accent)] shadow transition hover:-translate-y-0.5 hover:opacity-95"
                    >
                      <Download className="h-4 w-4" />
                      התקנה מ-Microsoft Store
                    </a>
                  )}
                </div>
              </div>

              {/* צילום המסך של השלב — מודבק ישר מתחת לטקסט */}
              {s.img && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.img}
                    alt={`${s.title} — צילום מסך מתוך Lively Wallpaper`}
                    loading="lazy"
                    className="w-full border-t border-black/5 bg-[var(--bg-2)]"
                  />
                </>
              )}
            </li>
          ))}
        </ol>

        {/* קישורי הורדה משניים */}
        <p className="mt-8 text-center text-xs text-[var(--muted)]">
          אפשר גם דרך{" "}
          <a
            href={SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="accent-text font-medium underline-offset-4 hover:underline"
          >
            האתר הרשמי
          </a>{" "}
          או{" "}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="accent-text font-medium underline-offset-4 hover:underline"
          >
            GitHub
          </a>
          .
        </p>
      </section>

      <Divider className="my-6" />

      {/* ------------------------------ שאלות ------------------------------ */}
      <section className="mx-auto max-w-3xl px-6 py-10">
        <h2 className="font-display mb-10 text-center text-3xl font-bold sm:text-4xl">
          שאלות נפוצות
        </h2>
        <div className="space-y-4">
          {FAQ.map((item) => (
            <div key={item.q} className="surface-card rounded-2xl p-5">
              <h3 className="mb-1 font-bold">{item.q}</h3>
              <p className="text-sm leading-relaxed text-[var(--muted)]">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------ CTA ------------------------------ */}
      <section className="mx-auto max-w-3xl px-6 pb-24 text-center">
        <p className="mb-4 text-sm text-[var(--muted)]">עדיין אין לכם ספירה?</p>
        <Link
          href="/create"
          className="inline-block rounded-full bg-[var(--accent)] px-10 py-4 text-lg font-semibold text-[var(--on-accent)] shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          צרו ספירה
        </Link>
      </section>
    </main>
  );
}
