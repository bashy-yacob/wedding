import type { Metadata } from "next";
import {
  Heebo,
  Frank_Ruhl_Libre,
  Suez_One,
  Rubik,
  Amatic_SC,
  Secular_One,
  Bellefair,
} from "next/font/google";
import { getBaseUrl } from "@/lib/url";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";

// פונט הממשק (טקסט גוף, תוויות) — אחיד בכל הערכות לשם קריאוּת.
const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  display: "swap",
});

// פונט תצוגה לכל שפת עיצוב — כותרות, שמות, ספרות ותאריך מקבלים אופי שונה.
// classic — סריף מעודן
const frankRuhl = Frank_Ruhl_Libre({
  subsets: ["hebrew", "latin"],
  variable: "--font-frank",
  weight: ["500", "700", "900"],
  display: "swap",
});

// gold — סריף כבד וגאומטרי בסגנון ארט דקו
const suezOne = Suez_One({
  subsets: ["hebrew", "latin"],
  variable: "--font-suez",
  weight: "400",
  display: "swap",
});

// olive — סאנס מעוגל והומניסטי, אווירת גן
const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  variable: "--font-rubik",
  weight: ["400", "500", "700"],
  display: "swap",
});

// blush — אותיות בכתב-יד רומנטי
const amaticSC = Amatic_SC({
  subsets: ["hebrew", "latin"],
  variable: "--font-amatic",
  weight: ["400", "700"],
  display: "swap",
});

// royal — סאנס נועז וכבד
const secularOne = Secular_One({
  subsets: ["hebrew", "latin"],
  variable: "--font-secular",
  weight: "400",
  display: "swap",
});

// midnight — סריף אוורירי ומעודן, אווירה שמימית
const bellefair = Bellefair({
  subsets: ["hebrew", "latin"],
  variable: "--font-bellefair",
  weight: "400",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = await getBaseUrl();
  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: "עד החתונה — ספירה לאחור לחתונה",
      template: "%s — עד החתונה",
    },
    description:
      "צרו ספירה לאחור אישית לחתונה, עם תאריך עברי וקישור ייחודי לשיתוף בוואטסאפ. בלי הרשמה, בחינם.",
    applicationName: "עד החתונה",
    keywords: [
      "ספירה לאחור לחתונה",
      "טיימר לחתונה",
      "ספירה לחתונה",
      "תאריך עברי לחתונה",
      "כמה ימים נשארו לחתונה",
      "ספירה לאחור בעברית",
      "הזמנה לחתונה",
      "ספירה לאירוע",
    ],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      siteName: "עד החתונה",
      title: "עד החתונה — ספירה לאחור לחתונה",
      description: "ספירה אישית לחתונה עם תאריך עברי וקישור לשיתוף.",
      type: "website",
      locale: "he_IL",
    },
    twitter: {
      card: "summary_large_image",
      title: "עד החתונה — ספירה לאחור לחתונה",
      description: "ספירה אישית לחתונה עם תאריך עברי וקישור לשיתוף.",
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${heebo.variable} ${frankRuhl.variable} ${suezOne.variable} ${rubik.variable} ${amaticSC.variable} ${secularOne.variable} ${bellefair.variable}`}
    >
      <body>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
