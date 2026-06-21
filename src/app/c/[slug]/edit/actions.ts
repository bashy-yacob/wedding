"use server";

import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { editCountdownSchema } from "@/lib/validation";
import type { CountdownFormState } from "@/components/CountdownForm";

export async function updateCountdown(
  _prev: CountdownFormState,
  formData: FormData,
): Promise<CountdownFormState> {
  const parsed = editCountdownSchema.safeParse({
    edit_token: formData.get("edit_token"),
    display_names: formData.get("display_names"),
    event_type: formData.get("event_type") ?? "",
    wedding_date: formData.get("wedding_date"),
    wedding_time: formData.get("wedding_time") ?? "",
    show_gregorian: formData.get("show_gregorian") === "on",
    blessing: formData.get("blessing") ?? "",
    theme: formData.get("theme"),
    allow_blessings: formData.get("allow_blessings") === "on",
    invitation_path: formData.get("invitation_path") ?? "",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "נתונים לא תקינים" };
  }

  const data = parsed.data;

  // העדכון עובר דרך RPC מאובטח (update_countdown) שמאמת את הטוקן ב-DB.
  // ה-redirect חייב להישאר מחוץ ל-try (Next זורק אותו כ-exception).
  let slug = "";
  try {
    const supabase = createServerClient();
    const { data: returnedSlug, error } = await supabase.rpc("update_countdown", {
      p_token: data.edit_token,
      p_event_type: data.event_type ? data.event_type : "חתונה",
      p_display_names: data.display_names,
      p_wedding_date: data.wedding_date,
      p_wedding_time: data.wedding_time ? data.wedding_time : null,
      p_show_gregorian: data.show_gregorian,
      p_blessing: data.blessing ? data.blessing : null,
      p_theme: data.theme,
      p_allow_blessings: data.allow_blessings,
      p_invitation_path: data.invitation_path ? data.invitation_path : null,
    });

    if (error) {
      return { error: `שגיאה בעדכון: ${error.message}` };
    }

    // הפונקציה מחזירה NULL כשהטוקן לא נמצא → אין הרשאת עריכה.
    slug = typeof returnedSlug === "string" ? returnedSlug : "";
    if (!slug) {
      return { error: "מפתח העריכה אינו תקף. ודאו שהשתמשתם בקישור העריכה המלא." };
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { error: `תקלת חיבור למסד הנתונים: ${message}` };
  }

  redirect(`/c/${slug}?updated=1`);
}
