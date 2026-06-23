"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";
import { blessingSchema } from "@/lib/validation";
import { generateDeleteToken } from "@/lib/slug";

export interface BlessingState {
  error?: string;
  ok?: boolean;
  // הברכה שנוצרה זה עתה — מוחזרת כדי שהדפדפן ישמור את טוקן-המחיקה (localStorage).
  created?: { id: string; deleteToken: string };
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

    // מאתרים את הספירה לפי slug כדי לקבל את ה-id (וגם לוודא שהיא קיימת).
    // דרך RPC מאובטח — אין קריאה ישירה לטבלה (ראו migration 0003).
    const { data } = await supabase.rpc("get_countdown", { p_slug: slug });
    const countdown = (Array.isArray(data) ? data[0] : data) as
      | { id: string; allow_blessings: boolean }
      | undefined;

    if (!countdown || !countdown.allow_blessings) {
      return { error: "קיר הברכות אינו פעיל עבור ספירה זו." };
    }

    // מייצרים את ה-id ואת טוקן-המחיקה בצד השרת כדי שנוכל להחזיר אותם לדפדפן
    // (אין SELECT policy על blessings, ולכן לא ניתן לקרוא את השורה אחרי insert).
    const id = crypto.randomUUID();
    const deleteToken = generateDeleteToken();

    const { error } = await supabase.from("blessings").insert({
      id,
      countdown_id: countdown.id,
      author_name: parsed.data.author_name,
      message: parsed.data.message,
      delete_token: deleteToken,
    });

    if (error) {
      // הודעת ה-trigger כשחורגים מקצב המותר
      if (error.message?.includes("rate_limited")) {
        return { error: "נשלחו יותר מדי ברכות כעת. נסו שוב בעוד רגע." };
      }
      return { error: `אירעה שגיאה בשליחת האיחול: ${error.message}` };
    }

    revalidatePath(`/c/${slug}`);
    return { ok: true, created: { id, deleteToken } };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { error: `תקלת חיבור למסד הנתונים: ${message}` };
  }
}

export interface DeleteBlessingResult {
  ok?: boolean;
  error?: string;
}

/** מחיקת ברכה ע"י השולח — מאומתת מול טוקן-המחיקה הסודי שנשמר בדפדפנו. */
export async function deleteBlessing(
  slug: string,
  deleteToken: string,
): Promise<DeleteBlessingResult> {
  if (!deleteToken) return { error: "אין הרשאת מחיקה." };

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase.rpc("delete_blessing", {
      p_token: deleteToken,
    });

    if (error) {
      return { error: `מחיקה נכשלה: ${error.message}` };
    }
    if (data !== true) {
      return { error: "הברכה כבר אינה קיימת." };
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { error: `תקלת חיבור למסד הנתונים: ${message}` };
  }

  revalidatePath(`/c/${slug}`);
  return { ok: true };
}

export interface EditBlessingResult {
  ok?: boolean;
  error?: string;
}

/** עריכת נוסח הברכה ע"י השולח — מאומתת מול אותו טוקן סודי כמו במחיקה. */
export async function editBlessing(
  slug: string,
  deleteToken: string,
  message: string,
): Promise<EditBlessingResult> {
  if (!deleteToken) return { error: "אין הרשאת עריכה." };

  const parsed = blessingSchema.shape.message.safeParse(message);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "איחול לא תקין" };
  }

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase.rpc("update_blessing", {
      p_token: deleteToken,
      p_message: parsed.data,
    });

    if (error) {
      return { error: `עריכה נכשלה: ${error.message}` };
    }
    if (data !== true) {
      return { error: "לא ניתן לעדכן את הברכה." };
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { error: `תקלת חיבור למסד הנתונים: ${message}` };
  }

  revalidatePath(`/c/${slug}`);
  return { ok: true };
}
