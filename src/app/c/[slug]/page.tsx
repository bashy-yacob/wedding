import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { toHebrewDateString, toGregorianString } from "@/lib/hebcal";
import { getCountdownState } from "@/lib/time";
import type { Countdown, Blessing } from "@/types/db";
import { CountdownClient } from "./CountdownClient";
import { BlessingsWall } from "./BlessingsWall";
import { ShareWhatsAppButton } from "@/components/ShareWhatsAppButton";
import { DonationCTA } from "@/components/DonationCTA";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

async function getCountdown(slug: string): Promise<Countdown | null> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("countdowns")
    .select("*")
    .eq("slug", slug)
    .single();
  return (data as Countdown) ?? null;
}

async function getBlessings(countdownId: string): Promise<Blessing[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("blessings")
    .select("*")
    .eq("countdown_id", countdownId)
    .order("created_at", { ascending: false });
  return (data as Blessing[]) ?? [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const countdown = await getCountdown(slug);
  if (!countdown) return { title: "ספירה לא נמצאה — עד החתונה" };

  const hebrew = toHebrewDateString(countdown.wedding_date);
  const title = `${countdown.display_names} — עד החתונה`;
  const description = `${hebrew} · הצטרפו לספירה לאחור`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/c/${slug}`,
      type: "website",
      locale: "he_IL",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CountdownPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const { slug } = await params;
  const { created } = await searchParams;

  const countdown = await getCountdown(slug);
  if (!countdown) notFound();

  const blessings = countdown.allow_blessings
    ? await getBlessings(countdown.id)
    : [];

  const hebrewDate = toHebrewDateString(countdown.wedding_date);
  const gregorianDate = toGregorianString(countdown.wedding_date);
  const url = `${siteUrl}/c/${slug}`;

  // למצב מזל טוב — נסתיר את הברכה הכפולה (CountdownClient כבר מציג אותה)
  const state = getCountdownState({
    weddingDate: countdown.wedding_date,
    weddingTime: countdown.wedding_time,
  });

  return (
    <main data-theme={countdown.theme} className="min-h-screen">
      <div className="mx-auto max-w-2xl px-6 py-12">
        {created && (
          <div className="surface-card mb-8 rounded-2xl p-5 text-center">
            <p className="font-semibold">הספירה נוצרה! 🎉</p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              זה הקישור הייחודי שלכם — שתפו אותו. שימו לב: לא ניתן לערוך את הספירה.
            </p>
          </div>
        )}

        {/* כותרת */}
        <header className="mb-10 text-center">
          <p className="text-sm text-[var(--muted)]">הספירה לחתונה של</p>
          <h1 className="font-display mt-1 text-4xl font-extrabold sm:text-5xl">
            {countdown.display_names}
          </h1>
        </header>

        {/* מונה / מזל טוב */}
        <div className="surface-card rounded-3xl px-6 py-12">
          <CountdownClient
            weddingDate={countdown.wedding_date}
            weddingTime={countdown.wedding_time}
            displayNames={countdown.display_names}
            blessing={countdown.blessing}
          />

          {/* תאריך עברי כראשי, לועזי קטן לצדו */}
          <div className="mt-10 text-center">
            <p className="font-display text-2xl font-bold sm:text-3xl">
              {hebrewDate}
            </p>
            {countdown.show_gregorian && (
              <p className="mt-1 text-sm text-[var(--muted)]">{gregorianDate}</p>
            )}
          </div>
        </div>

        {/* ברכת היוצר (בזמן ספירה בלבד) */}
        {countdown.blessing && state.status === "countdown" && (
          <p className="font-display mt-8 text-center text-lg">
            {countdown.blessing}
          </p>
        )}

        {/* שיתוף */}
        <div className="mt-10">
          <ShareWhatsAppButton
            url={url}
            displayNames={countdown.display_names}
            hebrewDate={hebrewDate}
          />
        </div>

        {/* קיר ברכות */}
        {countdown.allow_blessings && (
          <BlessingsWall slug={slug} blessings={blessings} />
        )}

        {/* תרומה */}
        <DonationCTA />
      </div>
    </main>
  );
}
