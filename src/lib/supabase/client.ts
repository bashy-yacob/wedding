import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ============================================================================
// supabase/client.ts — לקוח Supabase לדפדפן (anon key), ל-singleton.
// משמש להעלאת קבצים ישירות ל-Storage, כדי לעקוף את מגבלת הגוף של Server Actions.
// ============================================================================

let browserClient: SupabaseClient | null = null;

export function createBrowserClient(): SupabaseClient {
  if (browserClient) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "חסרים משתני סביבה: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  browserClient = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return browserClient;
}
