import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { invitationPublicUrl } from "@/lib/storage";
import { CountdownForm } from "@/components/CountdownForm";
import type { Countdown } from "@/types/db";
import type { ThemeKey } from "@/lib/themes";
import { updateCountdown } from "./actions";

export const metadata: Metadata = {
  title: "עריכת הספירה",
  robots: { index: false, follow: false },
};

// שולפים את הספירה לפי מפתח העריכה הסודי בלבד (לא לפי slug).
async function getForEdit(token: string): Promise<Countdown | null> {
  try {
    const supabase = createServerClient();
    const { data } = await supabase.rpc("get_countdown_for_edit", {
      p_token: token,
    });
    const row = Array.isArray(data) ? data[0] : data;
    return (row as Countdown) ?? null;
  } catch {
    return null;
  }
}

export default async function EditPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { slug } = await params;
  const { token } = await searchParams;

  if (!token) notFound();

  const countdown = await getForEdit(token);
  // הטוקן חייב להתאים, וה-slug שבכתובת חייב להיות של אותה ספירה.
  if (!countdown || countdown.slug !== slug) notFound();

  return (
    <CountdownForm
      action={updateCountdown}
      editToken={token}
      heading="עריכת הספירה"
      submitLabel="שמרו שינויים"
      pendingLabel="שומר..."
      initial={{
        eventType: countdown.event_type || "חתונה",
        displayNames: countdown.display_names,
        weddingDate: countdown.wedding_date,
        // ה-DB שומר 'HH:MM:SS' — לטופס נדרש 'HH:MM'.
        weddingTime: countdown.wedding_time
          ? countdown.wedding_time.slice(0, 5)
          : "",
        blessing: countdown.blessing ?? "",
        theme: countdown.theme as ThemeKey,
        showGregorian: countdown.show_gregorian,
        allowBlessings: countdown.allow_blessings,
        invitationPath: countdown.invitation_path,
        invitationPreview: countdown.invitation_path
          ? invitationPublicUrl(countdown.invitation_path)
          : null,
      }}
    />
  );
}
