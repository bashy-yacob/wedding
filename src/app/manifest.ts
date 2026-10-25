import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION } from "@/lib/site";

// Web App Manifest — מאפשר התקנה כאפליקציה במובייל ומשפר חיווי בגוגל.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "עד החתונה — ספירה לאחור לחתונה",
    short_name: "עד החתונה",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f3",
    theme_color: "#b08d57",
    lang: "he",
    dir: "rtl",
    // PNG בגדלים הסטנדרטיים (נוצרו מ-icon.svg) — חלק מהמכשירים לא מקבלים SVG.
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
