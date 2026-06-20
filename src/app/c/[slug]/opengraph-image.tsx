import { ImageResponse } from "next/og";
import { createServerClient } from "@/lib/supabase/server";
import { toHebrewDateString, toGregorianString } from "@/lib/hebcal";
import { getCountdownState } from "@/lib/time";
import { getTheme } from "@/lib/themes";
import type { Countdown } from "@/types/db";

export const runtime = "edge";
export const alt = "ספירה לאחור לחתונה";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// טוען פונט עברי מ-Google Fonts לפי הטקסט בפועל (ImageResponse לא תומך ב-next/font).
async function loadHebrewFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const family = "Frank+Ruhl+Libre:wght@700";
    const url = `https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(
      text,
    )}`;
    const css = await (
      await fetch(url, {
        headers: {
          // נדרש כדי לקבל קישור ל-TTF (ולא woff2) שתואם ל-ImageResponse
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/537.36",
        },
      })
    ).text();
    const match = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/);
    if (!match) return null;
    return await (await fetch(match[1])).arrayBuffer();
  } catch {
    return null;
  }
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createServerClient();
  const { data } = await supabase
    .from("countdowns")
    .select("*")
    .eq("slug", slug)
    .single();
  const countdown = data as Countdown | null;

  const names = countdown?.display_names ?? "עד החתונה";
  const hebrewDate = countdown ? toHebrewDateString(countdown.wedding_date) : "";
  const gregDate = countdown ? toGregorianString(countdown.wedding_date) : "";
  const theme = getTheme(countdown?.theme);

  let headline = "עד החתונה";
  if (countdown) {
    const state = getCountdownState({
      weddingDate: countdown.wedding_date,
      weddingTime: countdown.wedding_time,
    });
    headline =
      state.status === "countdown"
        ? `נשארו ${state.remaining!.days} ימים`
        : "מזל טוב! 🎉";
  }

  const allText = `${names}${hebrewDate}${gregDate}${headline}עדהחתונה0123456789`;
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
          הספירה לחתונה של
        </div>
        <div style={{ fontSize: 88, fontWeight: 700, marginBottom: 28 }}>
          {names}
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: theme.accent,
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
