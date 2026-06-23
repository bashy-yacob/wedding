import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { toHebrewDateString, toGregorianString } from "@/lib/hebcal";
import { getCountdownState } from "@/lib/time";
import { getBaseUrl } from "@/lib/url";
import type { Countdown, Blessing } from "@/types/db";
import { CountdownClient } from "./CountdownClient";
import { ScrollHint } from "./ScrollHint";
import { CreatedBanner } from "./CreatedBanner";
import { BlessingsWall } from "./BlessingsWall";
import { ShareWhatsAppButton } from "@/components/ShareWhatsAppButton";
import { DonationCTA } from "@/components/DonationCTA";
import { FloatingBackground } from "@/components/FloatingBackground";
import { InvitationView } from "@/components/InvitationView";
import { invitationPublicUrl } from "@/lib/storage";
import { Divider, Rings } from "@/components/Ornaments";
import { WallpaperChip } from "@/components/WallpaperChip";
import { AddToCalendar } from "@/components/AddToCalendar";
import { customThemeVars } from "@/lib/themes";

async function getCountdown(slug: string): Promise<Countdown | null> {
  try {
    const supabase = createServerClient();
    // קריאה דרך RPC מאובטח (get_countdown) — מחזיר שורה לפי slug מדויק בלבד,
    // ללא אפשרות לשלוף את כל הטבלה (ראו migration 0003).
    const { data } = await supabase.rpc("get_countdown", { p_slug: slug });
    const row = Array.isArray(data) ? data[0] : data;
    return (row as Countdown) ?? null;
  } catch {
    // תקלת חיבור → מתייחסים כ"לא נמצא" במקום לקרוס ל-error.tsx
    return null;
  }
}

async function getBlessings(slug: string): Promise<Blessing[]> {
  try {
    const supabase = createServerClient();
    const { data } = await supabase.rpc("get_blessings", { p_slug: slug });
    return (data as Blessing[]) ?? [];
  } catch {
    // כשל בטעינת הברכות לא אמור להפיל את כל עמוד הספירה — מחזירים ריק.
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const countdown = await getCountdown(slug);
  // דפי הספירה האישיים פרטיים — חוסמים אינדוקס בגוגל בכל מקרה.
  const noindex = { robots: { index: false, follow: false } } as const;
  if (!countdown) return { title: "ספירה לא נמצאה", ...noindex };

  const hebrew = toHebrewDateString(countdown.wedding_date);
  const title = countdown.display_names;
  const description = `${hebrew} · הצטרפו לספירה לאחור`;
  const baseUrl = await getBaseUrl();

  return {
    title,
    description,
    ...noindex,
    openGraph: {
      title: `${title} — עד החתונה`,
      description,
      url: `${baseUrl}/c/${slug}`,
      type: "website",
      locale: "he_IL",
    },
    twitter: { card: "summary_large_image", title: `${title} — עד החתונה`, description },
  };
}

export default async function CountdownPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ created?: string; token?: string; updated?: string }>;
}) {
  const { slug } = await params;
  const { created, token, updated } = await searchParams;

  const countdown = await getCountdown(slug);
  if (!countdown) notFound();

  const blessings = countdown.allow_blessings
    ? await getBlessings(slug)
    : [];

  const baseUrl = await getBaseUrl();
  const hebrewDate = toHebrewDateString(countdown.wedding_date);
  const gregorianDate = toGregorianString(countdown.wedding_date);
  // סוג האירוע — נופל ל"חתונה" עבור ספירות ישנות שנוצרו לפני התוספת.
  const eventType = countdown.event_type || "חתונה";

  // למצב מזל טוב — נסתיר את הברכה הכפולה (CountdownClient כבר מציג אותה)
  const state = getCountdownState({
    weddingDate: countdown.wedding_date,
    weddingTime: countdown.wedding_time,
  });

  // דריסות התאמה אישית (צבע דגש / פונט) מעל עיצוב הבסיס
  const customStyle = customThemeVars({
    accentColor: countdown.accent_color,
    fontKey: countdown.font_key,
  }) as React.CSSProperties;

  return (
    <main
      data-theme={countdown.theme}
      style={customStyle}
      className="bg-animated relative min-h-screen"
    >
      <FloatingBackground />

      {/* כפתור צד פינתי קבוע — מדריך לרקע חי על שולחן העבודה */}
      <WallpaperChip slug={slug} />

      {/* ----- מסך ראשון: כותרת + ספירה במלוא הגובה ----- */}
      <section className="relative flex min-h-screen flex-col justify-start px-6 pt-16 pb-36 sm:justify-center sm:pb-16">
        <div className="mx-auto w-full max-w-2xl">
          {created && token && <CreatedBanner slug={slug} editToken={token} />}

          {updated && (
            <div className="surface-card reveal mb-8 rounded-2xl p-5 text-center">
              <p className="font-semibold">השינויים נשמרו ✓</p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                הספירה עודכנה. קישור השיתוף נשאר זהה.
              </p>
            </div>
          )}

          {/* כותרת + שיתוף מאופק בצד (בגובה השמות) */}
          <header className="reveal relative mb-8 text-center" style={{ animationDelay: "0.05s" }}>
            <Rings className="mx-auto mb-4 h-10 w-16" />
            <p className="text-sm text-[var(--muted)]">הספירה ל{eventType} של</p>
            <h1 className="font-display accent-gradient-text mt-1 text-4xl font-extrabold sm:text-5xl">
              {countdown.display_names}
            </h1>

            {/* הקישורים בצד, בגובה השמות; במובייל יורדים למטה וממורכזים */}
            <div className="mt-6 flex justify-center sm:absolute sm:top-1/2 sm:left-0 sm:mt-0 sm:-translate-y-1/2">
              <ShareWhatsAppButton
                compact
                slug={slug}
                displayNames={countdown.display_names}
                eventType={eventType}
                hebrewDate={hebrewDate}
              />
            </div>
          </header>

          {/* מונה / מזל טוב */}
          <div
            className="surface-card reveal rounded-3xl px-6 py-12"
            style={{ animationDelay: "0.15s" }}
          >
            <CountdownClient
              weddingDate={countdown.wedding_date}
              weddingTime={countdown.wedding_time}
              displayNames={countdown.display_names}
              eventType={eventType}
              blessing={countdown.blessing}
            />

            <Divider className="my-8" />

            {/* תאריך עברי כראשי, לועזי קטן לצדו */}
            <div className="text-center">
              <p className="wedding-date font-display text-2xl font-bold sm:text-3xl">
                {hebrewDate}
              </p>
              {countdown.show_gregorian && (
                <p className="mt-1 text-sm text-[var(--muted)]">{gregorianDate}</p>
              )}

              <div className="mt-6">
                <AddToCalendar
                  slug={slug}
                  displayNames={countdown.display_names}
                  eventType={eventType}
                  weddingDate={countdown.wedding_date}
                  weddingTime={countdown.wedding_time}
                  hebrewDate={hebrewDate}
                  url={`${baseUrl}/c/${slug}`}
                />
              </div>
            </div>
          </div>

          {/* ברכת היוצר (בזמן ספירה בלבד) */}
          {countdown.blessing && state.status === "countdown" && (
            <p
              className="creator-blessing font-display reveal mt-8 text-center text-lg"
              style={{ animationDelay: "0.25s" }}
            >
              {countdown.blessing}
            </p>
          )}
        </div>

        {/* עמעום + חיווי גלילה — נעלמים כשמתחילים לגלול */}
        <ScrollHint label={countdown.allow_blessings ? "לקיר הברכות 🤍" : "להמשך"} />
      </section>

      {/* ----- שאר התוכן: קיר ברכות, הזמנה, יצירה ----- */}
      <div id="more" className="mx-auto max-w-2xl px-6 pb-16 pt-4">
        {/* קיר ברכות — מיד מתחת לספירה */}
        {countdown.allow_blessings && (
          <BlessingsWall slug={slug} blessings={blessings} />
        )}

        {/* הזמנת החתונה */}
        {countdown.invitation_path && (
          <InvitationView
            url={invitationPublicUrl(countdown.invitation_path)}
            displayNames={countdown.display_names}
          />
        )}

        {/* צרו ספירה משלכם */}
        <div className="mt-12 text-center">
          <p className="mb-3 text-sm text-[var(--muted)]">
            רוצים ספירה כזו לחתונה שלכם?
          </p>
          <Link
            href="/create"
            className="inline-block rounded-full bg-[var(--accent)] px-8 py-3 text-sm font-semibold text-[var(--on-accent)] shadow-lg transition hover:opacity-90"
          >
            צרו ספירה משלכם
          </Link>
        </div>

        {/* תרומה */}
        <DonationCTA />
      </div>
    </main>
  );
}
