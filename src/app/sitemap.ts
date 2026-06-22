import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/url";

// מפת אתר לגוגל. כוללת אך ורק את העמודים הציבוריים והקבועים —
// דפי הספירה האישיים (/c/[slug]) הם פרטיים ולא נכנסים לאינדוקס.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = await getBaseUrl();
  const lastModified = new Date();

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
    {
      url: `${baseUrl}/wallpaper`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
