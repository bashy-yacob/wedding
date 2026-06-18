import { createClient } from "@supabase/supabase-js";

// ============================================================================
// supabase/server.ts — לקוח Supabase עם anon key בלבד.
// כל הכתיבות עוברות דרך Server Actions; ה-RLS הוא השער האמיתי.
// ה-service role לעולם לא מגיע לקוד שנפרס.
// ============================================================================

export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "חסרים משתני סביבה: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
