import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/url";

// robots.txt — מאשר זחילה של העמודים הציבוריים, וחוסם את דפי הספירה
// האישיים (/c/...) שהם פרטיים מטבעם ולא נועדו להופיע בחיפוש.
export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = await getBaseUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/c/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
