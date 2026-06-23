import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { toHebrewDateString, toGregorianString } from "@/lib/hebcal";
import { getCountdownState } from "@/lib/time";
import type { Countdown } from "@/types/db";
import { CountdownClient } from "../CountdownClient";
import { FloatingBackground } from "@/components/FloatingBackground";
import { Rings } from "@/components/Ornaments";
import { customThemeVars } from "@/lib/themes";

async function getCountdown(slug: string): Promise<Countdown | null> {
  try {
    const supabase = createServerClient();
    const { data } = await supabase.rpc("get_countdown", { p_slug: slug });
    const row = Array.isArray(data) ? data[0] : data;
    return (row as Countdown) ?? null;
  } catch {
    return null;
  }
}

// עמוד פרטי — לא נכנס לאינדוקס בגוגל.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// ============================================================================
// מצב רקע (Wallpaper) — גרסה נקייה של הספירה, מסך מלא וממורכז, בלי כפתורים,
// גלילה, שיתוף או קיר ברכות. מיועד להדבקה ב-Lively Wallpaper / Plash ככתובת URL,
// כך שהרקע על שולחן העבודה מציג אך ורק את הספירה, יפה ומתעדכן בזמן אמת.
// ============================================================================
export default async function WallpaperCountdownPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const countdown = await getCountdown(slug);
  if (!countdown) notFound();

  const hebrewDate = toHebrewDateString(countdown.wedding_date);
  const gregorianDate = toGregorianString(countdown.wedding_date);
  const eventType = countdown.event_type || "חתונה";

  const state = getCountdownState({
    weddingDate: countdown.wedding_date,
    weddingTime: countdown.wedding_time,
  });

  const customStyle = customThemeVars({
    accentColor: countdown.accent_color,
    fontKey: countdown.font_key,
  }) as React.CSSProperties;

  return (
    <main
      data-theme={countdown.theme}
      style={customStyle}
      className="bg-animated relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden px-8 text-center"
    >
      <FloatingBackground />

      <Rings className="mb-6 h-12 w-20 sm:h-14 sm:w-24" />

      <p className="text-base text-[var(--muted)] sm:text-lg">
        הספירה ל{eventType} של
      </p>
      <h1 className="font-display accent-gradient-text mt-1 mb-10 text-5xl font-extrabold sm:text-6xl lg:text-7xl">
        {countdown.display_names}
      </h1>

      <CountdownClient
        weddingDate={countdown.wedding_date}
        weddingTime={countdown.wedding_time}
        displayNames={countdown.display_names}
        eventType={eventType}
        blessing={countdown.blessing}
      />

      <div className="mt-10 text-center">
        <p className="wedding-date font-display text-2xl font-bold sm:text-3xl lg:text-4xl">
          {hebrewDate}
        </p>
        {countdown.show_gregorian && (
          <p className="mt-1 text-sm text-[var(--muted)] sm:text-base">
            {gregorianDate}
          </p>
        )}
      </div>

      {/* ברכת היוצר — בזמן ספירה בלבד, כדי לא לשכפל את ברכת ה"מזל טוב" */}
      {countdown.blessing && state.status === "countdown" && (
        <p className="font-display mt-8 max-w-xl text-center text-lg sm:text-xl">
          {countdown.blessing}
        </p>
      )}
    </main>
  );
}
