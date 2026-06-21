import { ImageResponse } from "next/og";
import { getTheme } from "@/lib/themes";
import { loadHebrewFont } from "@/lib/og";

// תמונת שיתוף לדף הבית — מה שמופיע כשמשתפים את הלינק הראשי בוואטסאפ.
export const runtime = "edge";
export const alt = "עד החתונה — ספירה לאחור לחתונה";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function HomeOgImage() {
  const theme = getTheme("classic");

  const title = "עד החתונה";
  const tagline = "ספירה לאחור אישית לחתונה";
  const sub = "תאריך עברי · קישור לשיתוף · קיר ברכות";
  const font = await loadHebrewFont(`${title}${tagline}${sub}`);

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
        {/* טבעות נישואין — אותו מוטיב כמו האתר */}
        <svg width={132} height={84} viewBox="0 0 66 42" style={{ marginBottom: 28 }}>
          <circle cx={24} cy={24} r={14} fill="none" stroke={theme.accent} strokeWidth={3} />
          <circle cx={42} cy={24} r={14} fill="none" stroke={theme.accent} strokeWidth={3} />
          <path d="M33 4 l4 7 h-8 z" fill={theme.accent} />
        </svg>

        <div style={{ fontSize: 104, fontWeight: 700, marginBottom: 24 }}>
          {title}
        </div>
        <div style={{ fontSize: 46, color: theme.accent, marginBottom: 18 }}>
          {tagline}
        </div>
        <div style={{ fontSize: 32, color: theme.muted }}>{sub}</div>
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
