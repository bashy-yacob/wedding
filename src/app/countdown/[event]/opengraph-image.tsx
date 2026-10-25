import { ImageResponse } from "next/og";
import { getTheme } from "@/lib/themes";
import { getLanding } from "@/lib/landings";
import { loadHebrewFont } from "@/lib/og";

// תמונת שיתוף לכל דף נחיתה — עם עיטור, צבע וכותרת של האירוע עצמו, כך ששיתוף
// דף בר המצווה בוואטסאפ לא מציג טבעות ו"עד החתונה".
export const runtime = "edge";
export const alt = "ספירה לאחור לאירוע — עד החתונה";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// עיטורי האירועים מ-Ornaments.tsx (אותם קווים על רשת 24), כי ImageResponse
// אינו מריץ את רכיבי האתר.
const ORNAMENT_PATHS: Record<string, string[]> = {
  star: ["M12 3 20 17 4 17 Z", "M12 21 4 7 20 7 Z"],
  balloon: [
    "M12 3c2.8 0 5 2.3 5 5.2 0 3.4-2.8 6.1-5 6.8-2.2-.7-5-3.4-5-6.8C7 5.3 9.2 3 12 3z",
    "M12 15v1.5",
    "M12 16.5c0 1.4 1.4 1.4 1.4 2.8",
  ],
  bottle: [
    "M8 9h8v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V9z",
    "M8 12.5h8",
    "M9.5 9V6.5h5V9",
    "M11 6.5V4.5h2v2",
  ],
  sparkles: [
    "M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z",
    "M19 14l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7L19 14z",
  ],
};

// אותה התאמה לפי מילות מפתח כמו EventOrnament.
function ornamentFor(eventType: string): string[] {
  if (/מצווה|מצוה/.test(eventType)) return ORNAMENT_PATHS.star;
  if (/הולדת|יומולדת/.test(eventType)) return ORNAMENT_PATHS.balloon;
  if (/לידה|נולד|תינוק|ברית/.test(eventType)) return ORNAMENT_PATHS.bottle;
  return ORNAMENT_PATHS.sparkles;
}

export default async function LandingOgImage({
  params,
}: {
  params: Promise<{ event: string }>;
}) {
  const { event } = await params;
  const landing = getLanding(event);
  const theme = getTheme("classic");
  const accent = landing?.palette?.display ?? theme.accent;

  const title = landing?.heading ?? "ספירה לאחור";
  const tagline = "תאריך עברי · קישור לשיתוף · קיר ברכות";
  const brand = "עד החתונה";
  const font = await loadHebrewFont(`${title}${tagline}${brand}`);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          direction: "rtl",
          background: theme.bgGradient,
          color: theme.text,
          fontFamily: font ? "Frank" : "sans-serif",
          padding: 80,
        }}
      >
        <svg
          width={120}
          height={120}
          viewBox="0 0 24 24"
          fill="none"
          stroke={accent}
          strokeWidth={1.7}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ marginBottom: 32 }}
        >
          {ornamentFor(landing?.eventType ?? "").map((d) => (
            <path key={d} d={d} />
          ))}
        </svg>

        <div style={{ fontSize: 92, fontWeight: 700, marginBottom: 24 }}>
          {title}
        </div>
        <div style={{ fontSize: 40, color: accent, marginBottom: 40 }}>
          {tagline}
        </div>
        <div style={{ fontSize: 30, color: theme.muted }}>{brand}</div>
      </div>
    ),
    {
      ...size,
      fonts: font
        ? [{ name: "Frank", data: font, style: "normal", weight: 700 }]
        : [],
    },
  );
}
