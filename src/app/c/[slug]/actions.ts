"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";
import { blessingSchema } from "@/lib/validation";

export interface BlessingState {
  error?: string;
  ok?: boolean;
}

// סף time-trap: דחיית טפסים שנשלחו מהר מדי (בוטים)
const MIN_FILL_MS = 2000;

export async function postBlessing(
  _prev: BlessingState,
  formData: FormData,
): Promise<BlessingState> {
  const slug = String(formData.get("slug") ?? "");

  // honeypot — אם השדה הנסתר מולא, זה בוט. מחזירים "הצלחה" בלי לשמור.
  if (String(formData.get("website") ?? "").trim() !== "") {
    return { ok: true };
  }

  // time-trap
  const renderedAt = parseInt(String(formData.get("rendered_at") ?? "0"), 10);
  if (!renderedAt || Date.now() - renderedAt < MIN_FILL_MS) {
    return { error: "רגע אחד… נסו שוב." };
  }

  const parsed = blessingSchema.safeParse({
    author_name: formData.get("author_name"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "נתונים לא תקינים" };
  }

  try {
    const supabase = createServerClient();

    // מאתרים את הספירה לפי slug כדי לקבל את ה-id (וגם לוודא שהיא קיימת)
    const { data: countdown } = await supabase
      .from("countdowns")
      .select("id, allow_blessings")
      .eq("slug", slug)
      .single();

    if (!countdown || !countdown.allow_blessings) {
      return { error: "קיר הברכות אינו פעיל עבור ספירה זו." };
    }

    const { error } = await supabase.from("blessings").insert({
      countdown_id: countdown.id,
      author_name: parsed.data.author_name,
      message: parsed.data.message,
    });

    if (error) {
      // הודעת ה-trigger כשחורגים מקצב המותר
      if (error.message?.includes("rate_limited")) {
        return { error: "נשלחו יותר מדי ברכות כעת. נסו שוב בעוד רגע." };
      }
      return { error: `אירעה שגיאה בשליחת האיחול: ${error.message}` };
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { error: `תקלת חיבור למסד הנתונים: ${message}` };
  }

  revalidatePath(`/c/${slug}`);
  return { ok: true };
}
