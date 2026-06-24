import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/url";
import { LANDINGS } from "@/lib/landings";

// מפת אתר לגוגל. כוללת אך ורק את העמודים הציבוריים והקבועים —
// דפי הספירה האישיים (/c/[slug]) הם פרטיים ולא נכנסים לאינדוקס.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = await getBaseUrl();
  const lastModified = new Date();

  // דפי הנחיתה לכל סוג אירוע — נכסי ה-SEO שמושכים תנועה ממוקדת מגוגל.
  const landings: MetadataRoute.Sitemap = LANDINGS.map((l) => ({
    url: `${baseUrl}/countdown/${l.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/create`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...landings,
    {
      url: `${baseUrl}/wallpaper`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
