import { ImageResponse } from "next/og";
import { createServerClient } from "@/lib/supabase/server";
import { toHebrewDateString, toGregorianString } from "@/lib/hebcal";
import { getCountdownState } from "@/lib/time";
import { getTheme, HEX_COLOR_RE } from "@/lib/themes";
import { loadHebrewFont } from "@/lib/og";
import type { Countdown } from "@/types/db";

export const runtime = "edge";
export const alt = "ספירה לאחור לחתונה";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createServerClient();
  const { data } = await supabase.rpc("get_countdown", { p_slug: slug });
  const countdown = (Array.isArray(data) ? data[0] : data) as Countdown | null;

  const names = countdown?.display_names ?? "עד החתונה";
  const eventType = countdown?.event_type || "חתונה";
  const hebrewDate = countdown ? toHebrewDateString(countdown.wedding_date) : "";
  const gregDate = countdown ? toGregorianString(countdown.wedding_date) : "";
  const theme = getTheme(countdown?.theme);
  // צבע דגש מותאם אישית גובר על צבע העיצוב (אם נבחר). הפונט ב-OG נשאר Frank.
  const accent =
    countdown?.accent_color && HEX_COLOR_RE.test(countdown.accent_color)
      ? countdown.accent_color
      : theme.accent;

  let headline = "עד החתונה";
  if (countdown) {
    const state = getCountdownState({
      weddingDate: countdown.wedding_date,
      weddingTime: countdown.wedding_time,
    });
    headline =
      state.status === "countdown"
        ? `נשארו ${state.remaining!.days} ימים`
        : "מזל טוב!";
  }

  const allText = `${names}${hebrewDate}${gregDate}${headline}${eventType}עדהחתונה0123456789`;
  const font = await loadHebrewFont(allText);

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
        <div style={{ fontSize: 34, color: theme.muted, marginBottom: 12 }}>
          הספירה ל{eventType} של
        </div>
        <div style={{ fontSize: 88, fontWeight: 700, marginBottom: 28 }}>
          {names}
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: accent,
            marginBottom: 28,
          }}
        >
          {headline}
        </div>
        <div style={{ fontSize: 46, fontWeight: 700 }}>{hebrewDate}</div>
        {countdown?.show_gregorian && (
          <div style={{ fontSize: 30, color: theme.muted, marginTop: 8 }}>
            {gregDate}
          </div>
        )}
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
