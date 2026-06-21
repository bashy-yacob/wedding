"use server";

import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { createCountdownSchema } from "@/lib/validation";
import { generateSlug } from "@/lib/slug";

export interface CreateState {
  error?: string;
}

const MAX_SLUG_ATTEMPTS = 3;

export async function createCountdown(
  _prev: CreateState,
  formData: FormData,
): Promise<CreateState> {
  const parsed = createCountdownSchema.safeParse({
    display_names: formData.get("display_names"),
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

  const row = {
    display_names: data.display_names,
    wedding_date: data.wedding_date,
    wedding_time: data.wedding_time ? data.wedding_time : null,
    show_gregorian: data.show_gregorian,
    blessing: data.blessing ? data.blessing : null,
    theme: data.theme,
    allow_blessings: data.allow_blessings,
    invitation_path: data.invitation_path ? data.invitation_path : null,
  };

  // החיבור והכתיבה עטופים ב-try/catch כדי שכל כשל יחזור כהודעה גלויה
  // בטופס, ולא יקרוס לעמוד "משהו השתבש". ה-redirect חייב להישאר מחוץ ל-try.
  let slug = "";
  try {
    const supabase = createServerClient();

    let inserted = false;
    for (let attempt = 0; attempt < MAX_SLUG_ATTEMPTS; attempt++) {
      slug = generateSlug();
      const { error } = await supabase
        .from("countdowns")
        .insert({ ...row, slug });

      if (!error) {
        inserted = true;
        break;
      }

      // 23505 = unique_violation → התנגשות slug, ננסה שוב
      if (error.code === "23505" && attempt < MAX_SLUG_ATTEMPTS - 1) continue;

      return { error: `שגיאה ביצירה: ${error.message}` };
    }

    if (!inserted) {
      return { error: "לא ניתן היה ליצור קישור ייחודי. נסו שוב." };
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { error: `תקלת חיבור למסד הנתונים: ${message}` };
  }

  redirect(`/c/${slug}?created=1`);
}
