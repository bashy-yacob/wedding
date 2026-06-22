"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";
import { blessingSchema } from "@/lib/validation";

export interface BlessingState {
  error?: string;
  ok?: boolean;
  // מוחזרים לשולח בלבד כדי שהדפדפן ישמור אותם ב-localStorage ויוכל למחוק בעתיד.
  id?: string;
  token?: string;
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

    // הוספה דרך RPC מאובטח: מאמת קיום ספירה + קיר ברכות פעיל, ומחזיר id וטוקן
    // מחיקה. ה-trigger לקצב עדיין חל על ה-INSERT הפנימי (ראו migration 0008).
    const { data, error } = await supabase.rpc("add_blessing", {
      p_slug: slug,
      p_author: parsed.data.author_name,
      p_message: parsed.data.message,
    });

    if (error) {
      // הודעת ה-trigger כשחורגים מקצב המותר
      if (error.message?.includes("rate_limited")) {
        return { error: "נשלחו יותר מדי ברכות כעת. נסו שוב בעוד רגע." };
      }
      if (error.message?.includes("blessings_disabled")) {
        return { error: "קיר הברכות אינו פעיל עבור ספירה זו." };
      }
      return { error: `אירעה שגיאה בשליחת האיחול: ${error.message}` };
    }

    const row = (Array.isArray(data) ? data[0] : data) as
      | { id: string; delete_token: string }
      | undefined;

    revalidatePath(`/c/${slug}`);
    return { ok: true, id: row?.id, token: row?.delete_token };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { error: `תקלת חיבור למסד הנתונים: ${message}` };
  }
}

export interface DeleteBlessingResult {
  ok?: boolean;
  error?: string;
}

// מחיקת ברכה — מותרת רק למי שמחזיק בטוקן המחיקה (נשמר ב-localStorage בעת השליחה).
export async function deleteBlessing(
  slug: string,
  id: string,
  token: string,
): Promise<DeleteBlessingResult> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase.rpc("delete_blessing", {
      p_id: id,
      p_token: token,
    });
    if (error) return { error: "מחיקת האיחול נכשלה. נסו שוב." };
    if (data !== true) return { error: "לא ניתן למחוק את האיחול הזה." };
  } catch {
    return { error: "תקלת חיבור. נסו שוב." };
  }
  revalidatePath(`/c/${slug}`);
  return { ok: true };
}
