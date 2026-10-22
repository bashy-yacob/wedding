"use client";

// פוטר גלובלי — ממצב את האתר כתיק עבודות חי של באשי, בונת אתרים.
// שתי גרסאות באותה שפה (כחול כהה וזהב, site-footer.css):
//   מלאה     — בדפים הכלליים (יצירה, דפי האירועים, מדריך הרקע וכו').
//   מצומצמת — בדפי הספירה (/c/...), כדי לא להשתלט על הספירה של הזוג.
// הקריאה לפעולה פותחת חלון כתיבת מייל ב-Gmail (אמין יותר מ-mailto, שדורש
// אפליקציית מייל מוגדרת במכשיר).
import { usePathname } from "next/navigation";
import { ArrowLeft } from "@/components/Ornaments";
import { BUILD_CONTACT_URL, CONTACT_EMAIL } from "@/lib/contact";
import "./site-footer.css";

function ContactButton({ label }: { label: string }) {
  return (
    <a
      href={BUILD_CONTACT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="sf-contact"
    >
      <span>{label}</span>
      <span className="sf-arrow">
        <ArrowLeft className="h-4 w-4" />
      </span>
    </a>
  );
}

export function SiteFooter() {
  // מצב רקע לשולחן העבודה (/c/.../wallpaper) — בלי פוטר, כדי לא ליצור גלילה.
  // דף הבית — בלי פוטר, כי אזור הסטודיו שבתחתיתו מחליף אותו.
  const pathname = usePathname();
  if (pathname === "/") return null;
  if (pathname?.startsWith("/c/") && pathname.endsWith("/wallpaper")) {
    return null;
  }

  if (pathname?.startsWith("/c/")) {
    return (
      <footer className="sf sf-mini">
        <div className="sf-inner">
          <div>
            <span className="sf-hook">אהבתם את האתר?</span>
            <span className="sf-by">
              אני <b>באשי קליין</b>, מעצבת ובונה אתרים מהירים ויפים לעסקים
              וליחידים. בואו נדבר על שלכם.
            </span>
          </div>
          <ContactButton label="דברו איתי" />
        </div>
      </footer>
    );
  }

  return (
    <footer className="sf sf-full">
      <div className="sf-inner">
        <div className="sf-main">
          <div className="sf-copy">
            <div className="sf-eyebrow">מאחורי האתר הזה</div>
            <h2>אהבתם את מה שראיתם?</h2>
            <p>
              אני באשי קליין, מפתחת אתרים ומערכות דיגיטליות — מאתר תדמית לעסק
              ועד מערכת בהתאמה אישית. בואו נהפוך גם את הרעיון שלכם למוצר שעובד.
            </p>
          </div>
          <ContactButton label="בואו נדבר על הפרויקט שלכם" />
        </div>
        <div className="sf-bottom">
          <div className="sf-identity">
            באשי קליין <span className="sf-slash">/</span> פיתוח אתרים ומערכות
            דיגיטליות
          </div>
          <div>
            מעדיפים לכתוב ישירות?{" "}
            <a href={BUILD_CONTACT_URL} target="_blank" rel="noopener noreferrer">
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
