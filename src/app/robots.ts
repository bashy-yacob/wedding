import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/url";

// robots.txt — מאשר זחילה של כל האתר. דפי הספירה האישיים (/c/...) לא נחסמים
// כאן בכוונה: הם מסומנים noindex, וגוגל צריך לסרוק אותם כדי לראות את התגית.
// חסימה ב-robots הייתה מונעת את הסריקה, וקישורים משותפים עלולים היו להיכנס
// לאינדקס כ"כתובת בלבד".
export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = await getBaseUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
