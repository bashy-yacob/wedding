import type { MetadataRoute } from "next";

// Web App Manifest — מאפשר התקנה כאפליקציה במובייל ומשפר חיווי בגוגל.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "עד החתונה — ספירה לאחור לחתונה",
    short_name: "עד החתונה",
    description:
      "צרו ספירה לאחור אישית לחתונה, עם תאריך עברי וקישור ייחודי לשיתוף בוואטסאפ. בלי הרשמה, בחינם.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f3",
    theme_color: "#b08d57",
    lang: "he",
    dir: "rtl",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
