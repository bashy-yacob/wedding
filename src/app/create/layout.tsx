import type { Metadata } from "next";

// דף היצירה הוא Client Component, ולכן ה-metadata מוגדר ב-layout של הראוט.
export const metadata: Metadata = {
  title: "יצירת ספירה לחתונה",
  description:
    "ממלאים שמות ותאריך (עברי או לועזי), בוחרים עיצוב, ומקבלים קישור ייחודי לספירה לאחור לחתונה — בלי הרשמה, בחינם.",
  alternates: { canonical: "/create" },
  openGraph: {
    title: "יצירת ספירה לחתונה — עד החתונה",
    description:
      "ממלאים פרטים, בוחרים עיצוב, ומקבלים קישור ייחודי לספירה לאחור — בחינם.",
    type: "website",
    locale: "he_IL",
  },
};

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
