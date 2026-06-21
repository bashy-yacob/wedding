import Link from "next/link";
import type { Metadata } from "next";
import { FloatingBackground } from "@/components/FloatingBackground";
import { Divider, Rings } from "@/components/Ornaments";
import { WallpaperLinkBox } from "./WallpaperLinkBox";

export const metadata: Metadata = {
  title: "הספירה על שולחן העבודה — עד החתונה",
  description:
    "מדריך פשוט להפוך את הספירה לאחור לרקע חי על שולחן העבודה של Windows — בלי דפדפן, מתעדכן בזמן אמת.",
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

const STEPS = [
  {
    n: "1",
    title: "מתקינים את Lively Wallpaper",
    body: "אפליקציה חינמית מ-Microsoft Store. פתחו את החנות, חפשו “Lively Wallpaper” ולחצו התקנה.",
  },
  {
    n: "2",
    title: "מוסיפים רקע חדש",
    body: "פתחו את Lively ולחצו על כפתור ה-➕ (Add Wallpaper). תיפתח שורת כתובת.",
  },
  {
    n: "3",
    title: "מדביקים את קישור הספירה",
    body: "הדביקו בשורה את הקישור לספירה שלכם (אותו אחד ששלחתם בוואטסאפ) ולחצו Enter.",
  },
  {
    n: "4",
    title: "זהו — הספירה על שולחן העבודה",
    body: "הספירה הופכת לרקע חי שמתעדכן בזמן אמת, מאחורי האייקונים. בלי דפדפן פתוח.",
  },
];

// צילומי המסך האמיתיים מ-Lively Wallpaper (הקבצים יושבים ב-public/wallpaper).
const SHOTS = [
  {
    src: "/wallpaper/add.png",
    title: "מדביקים את הקישור",
    caption: "בחלון “הוסף טפט” → “הזן כתובת URL”, מדביקים את קישור הספירה ולוחצים על החץ.",
  },
  {
    src: "/wallpaper/display.png",
    title: "מאשרים",
    caption: "Lively טוען את הספירה ומציג תצוגה מקדימה עם הפרטים. לוחצים “אישור”.",
  },
  {
    src: "/wallpaper/library.png",
    title: "בוחרים מסך — וזהו! 🎉",
    caption: "בוחרים על איזה מסך יופיע הרקע ומאשרים. הספירה רצה חי על שולחן העבודה.",
  },
];

// אייקון הורדה קטן לכפתורים.
function DownloadIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

// איור: מסך מחשב עם הספירה כרקע (וקטורי, בצבעי ה-theme — בלי צילום מסך).
function DesktopArt() {
  return (
    <svg
      viewBox="0 0 320 220"
      className="mx-auto h-auto w-full max-w-md"
      fill="none"
      aria-hidden
    >
      {/* מסך */}
      <rect
        x="24"
        y="16"
        width="272"
        height="168"
        rx="12"
        fill="var(--surface)"
        stroke="color-mix(in srgb, var(--accent) 45%, transparent)"
        strokeWidth="2"
      />
      {/* רקע "wallpaper" עם זוהר accent */}
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
      <rect x="30" y="22" width="260" height="156" rx="8" fill="url(#wp-bg)" />

      {/* טבעות קטנות */}
      <g
        stroke="var(--accent)"
        strokeWidth="2"
        fill="none"
        transform="translate(146 44)"
        opacity="0.9"
      >
        <circle cx="7" cy="8" r="6" />
        <circle cx="16" cy="8" r="6" opacity="0.7" />
      </g>

      {/* "ספרות" הספירה */}
      <g transform="translate(0 78)">
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
            <text
              x="0"
              y="16"
              textAnchor="middle"
              fontSize="8"
              fill="var(--muted)"
            >
              {["ימים", "שעות", "דק׳", "שנ׳"][i]}
            </text>
          </g>
        ))}
      </g>

      {/* קו תאריך */}
      <rect
        x="118"
        y="128"
        width="84"
        height="7"
        rx="3.5"
        fill="color-mix(in srgb, var(--accent) 40%, transparent)"
      />

      {/* אייקוני שולחן עבודה בפינה */}
      <g fill="color-mix(in srgb, var(--text) 22%, transparent)">
        <rect x="40" y="32" width="16" height="16" rx="3" />
        <rect x="40" y="56" width="16" height="16" rx="3" />
        <rect x="40" y="80" width="16" height="16" rx="3" />
      </g>

      {/* רגל המסך */}
      <rect x="148" y="184" width="24" height="18" fill="var(--muted)" opacity="0.5" />
      <rect x="118" y="200" width="84" height="8" rx="4" fill="var(--muted)" opacity="0.6" />
    </svg>
  );
}

export default async function WallpaperGuidePage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  const { c } = await searchParams;

  return (
    <main data-theme="classic" className="bg-animated relative min-h-screen overflow-hidden">
      <FloatingBackground />

      {/* ------------------------------- Hero ------------------------------- */}
      <section className="mx-auto flex max-w-3xl flex-col items-center px-6 pt-12 pb-6 text-center">
        <Rings className="reveal mb-4 h-12 w-20" />
        <span
          className="reveal accent-text mb-3 text-sm font-medium tracking-wide"
          style={{ animationDelay: "0.05s" }}
        >
          טיפ נחמד 🖥️
        </span>
        <h1
          className="font-display accent-gradient-text reveal mb-4 text-4xl font-extrabold leading-tight sm:text-6xl"
          style={{ animationDelay: "0.1s" }}
        >
          הספירה על שולחן העבודה
        </h1>
        <p
          className="reveal mb-8 max-w-xl text-lg leading-relaxed text-[var(--muted)]"
          style={{ animationDelay: "0.15s" }}
        >
          אפשר להפוך את הספירה לאחור ל<strong className="text-[var(--text)]">רקע חי</strong>{" "}
          על שולחן העבודה של Windows — שיתעדכן בזמן אמת, מאחורי האייקונים, בלי שום
          דפדפן פתוח. הנה איך, בכמה דקות וללא עלות.
        </p>

        <div className="reveal w-full" style={{ animationDelay: "0.2s" }}>
          <DesktopArt />
        </div>
      </section>

      <Divider className="my-4" />

      {/* תיבת הקישור האישי — רק כשמגיעים מתוך עמוד ספירה */}
      {c && (
        <section className="px-6">
          <WallpaperLinkBox slug={c} />
        </section>
      )}

      {/* ------------------------------ שלבים ------------------------------ */}
      <section className="mx-auto max-w-3xl px-6 py-10">
        <h2 className="font-display mb-10 text-center text-3xl font-bold">
          ארבעה שלבים
        </h2>
        <ol className="space-y-5">
          {STEPS.map((s) => (
            <li key={s.n} className="surface-card flex items-start gap-4 rounded-2xl p-5">
              <span className="accent-gradient-text font-display flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-lg font-extrabold">
                {s.n}
              </span>
              <div>
                <h3 className="mb-1 text-lg font-bold">{s.title}</h3>
                <p className="text-sm text-[var(--muted)]">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* כפתורי הורדה */}
        <div className="mt-10 text-center">
          <p className="mb-4 text-sm text-[var(--muted)]">להורדת Lively Wallpaper (חינם):</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-7 py-3 text-sm font-semibold text-[var(--on-accent)] shadow-lg transition hover:-translate-y-0.5 hover:opacity-95"
            >
              <DownloadIcon className="h-4 w-4" />
              Microsoft Store
            </a>
            <a
              href={SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)] px-7 py-3 text-sm font-semibold accent-text transition hover:bg-[var(--accent-soft)]"
            >
              האתר הרשמי
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)] px-7 py-3 text-sm font-semibold accent-text transition hover:bg-[var(--accent-soft)]"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>

      <Divider className="my-4" />

      {/* ---------------------------- צילומי מסך ---------------------------- */}
      <section className="mx-auto max-w-5xl px-6 py-10">
        <h2 className="font-display mb-2 text-center text-3xl font-bold">ככה זה נראה</h2>
        <p className="mb-10 text-center text-sm text-[var(--muted)]">
          שלושה מסכים, וזהו.
        </p>
        <div className="grid gap-6 sm:grid-cols-3">
          {SHOTS.map((shot, i) => (
            <figure key={shot.src} className="surface-card overflow-hidden rounded-2xl">
              <div className="relative flex items-center justify-center bg-[var(--bg-2)]">
                <span className="accent-gradient-text font-display absolute top-2 right-3 text-2xl font-extrabold opacity-80">
                  {i + 1}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={shot.src}
                  alt={shot.title}
                  loading="lazy"
                  className="h-auto w-full"
                />
              </div>
              <figcaption className="p-4">
                <h3 className="mb-1 text-sm font-bold">{shot.title}</h3>
                <p className="text-xs leading-relaxed text-[var(--muted)]">{shot.caption}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <Divider className="my-4" />

      {/* ------------------------------ שאלות ------------------------------ */}
      <section className="mx-auto max-w-3xl px-6 py-10">
        <h2 className="font-display mb-8 text-center text-3xl font-bold">שאלות נפוצות</h2>
        <div className="space-y-4">
          <Faq q="זה עולה כסף?">
            לא. Lively Wallpaper הוא כלי חינמי וקוד פתוח. גם הספירה עצמה חינמית.
          </Faq>
          <Faq q="זה יאט לי את המחשב?">
            Lively חוסך משאבים כשמשחקים או עובדים במסך מלא — הוא משהה את הרקע
            אוטומטית. למחשב רגיל ההשפעה זניחה.
          </Faq>
          <Faq q="ואפשר גם על מסך הנעילה של Windows?">
            מסך הנעילה תומך רק בתמונה קבועה, לכן אי אפשר להריץ שם ספירה חיה. הפתרון
            הזה מיועד לשולחן העבודה. לכל היותר אפשר לשים במסך הנעילה צילום מסך של
            הספירה (אבל אז המספרים לא יתקדמו).
          </Faq>
          <Faq q="ובמק (Mac)?">
            Lively הוא ל-Windows בלבד. ב-Mac יש כלים דומים (כמו Plash) שמאפשרים גם
            הם להגדיר אתר כרקע חי — אותו רעיון בדיוק.
          </Faq>
        </div>
      </section>

      {/* ------------------------------ CTA ------------------------------ */}
      <section className="mx-auto max-w-3xl px-6 pb-20 text-center">
        <p className="mb-3 text-sm text-[var(--muted)]">עדיין אין לכם ספירה?</p>
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

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div className="surface-card rounded-2xl p-5">
      <h3 className="mb-1 font-bold">{q}</h3>
      <p className="text-sm leading-relaxed text-[var(--muted)]">{children}</p>
    </div>
  );
}
