import { headers } from "next/headers";

// ============================================================================
// url.ts — קביעת כתובת הבסיס של האתר בצורה אמינה, בלי תלות בהגדרה ידנית.
// סדר עדיפויות: NEXT_PUBLIC_SITE_URL (דומיין מותאם) → דומיין הפרודקשן של Vercel
// → ה-host מה-request → localhost.
// ============================================================================

function normalize(url: string): string {
  const withProto = url.startsWith("http") ? url : `https://${url}`;
  return withProto.replace(/\/$/, "");
}

/** כתובת הבסיס בצד השרת (ל-metadata / OG). */
export async function getBaseUrl(): Promise<string> {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return normalize(process.env.NEXT_PUBLIC_SITE_URL);
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return normalize(process.env.VERCEL_PROJECT_PRODUCTION_URL);
  }
  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host");
    const proto = h.get("x-forwarded-proto") ?? "https";
    if (host) return `${proto}://${host}`;
  } catch {
    /* אין request context — נופלים ל-localhost */
  }
  return "http://localhost:3000";
}
