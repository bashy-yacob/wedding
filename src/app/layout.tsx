import type { Metadata } from "next";
import { Heebo, Frank_Ruhl_Libre } from "next/font/google";
import { getBaseUrl } from "@/lib/url";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  display: "swap",
});

const frankRuhl = Frank_Ruhl_Libre({
  subsets: ["hebrew", "latin"],
  variable: "--font-frank",
  weight: ["500", "700", "900"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = await getBaseUrl();
  return {
    metadataBase: new URL(baseUrl),
    title: "עד החתונה — ספירה לאחור לחתונה",
    description:
      "צרו ספירה לאחור אישית לחתונה, עם תאריך עברי וקישור ייחודי לשיתוף בוואטסאפ.",
    openGraph: {
      title: "עד החתונה — ספירה לאחור לחתונה",
      description: "ספירה אישית לחתונה עם תאריך עברי וקישור לשיתוף.",
      type: "website",
      locale: "he_IL",
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} ${frankRuhl.variable}`}>
      <body>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
