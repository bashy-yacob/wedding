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
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "נתונים לא תקינים" };
  }

  const data = parsed.data;
  const supabase = createServerClient();

  const row = {
    display_names: data.display_names,
    wedding_date: data.wedding_date,
    wedding_time: data.wedding_time ? data.wedding_time : null,
    show_gregorian: data.show_gregorian,
    blessing: data.blessing ? data.blessing : null,
    theme: data.theme,
    allow_blessings: data.allow_blessings,
  };

  let slug = "";
  for (let attempt = 0; attempt < MAX_SLUG_ATTEMPTS; attempt++) {
    slug = generateSlug();
    const { error } = await supabase
      .from("countdowns")
      .insert({ ...row, slug });

    if (!error) break;

    // 23505 = unique_violation → התנגשות slug, ננסה שוב
    if (error.code === "23505" && attempt < MAX_SLUG_ATTEMPTS - 1) continue;

    return { error: "אירעה שגיאה ביצירת הספירה. נסו שוב." };
  }

  redirect(`/c/${slug}?created=1`);
}
