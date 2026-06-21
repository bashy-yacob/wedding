import { generateSlug } from "./slug";

// ============================================================================
// storage.ts — עזרי Storage להזמנת החתונה.
// שם הקובץ הוא אקראי בלבד (אלפבית ה-slug), והנתיב נשמר ב-DB. הבדיקה ב-validation
// מוודאת שלא נשמר נתיב זדוני (path traversal / URL injection).
// ============================================================================

export const INVITATION_BUCKET = "invitations";

export const MAX_INVITATION_BYTES = 5 * 1024 * 1024; // 5MB — תואם למגבלת ה-bucket
export const ACCEPTED_INVITATION_TYPES = ["image/jpeg", "image/png"] as const;

/** דפוס שם קובץ חוקי: 16 תווים מאלפבית ה-slug + סיומת jpg/png. */
export const INVITATION_PATH_RE = /^[a-z0-9]{16}\.(jpg|png)$/;

/** מייצר שם קובץ אקראי לפי סוג ה-MIME. */
export function invitationFileName(mime: string): string {
  const ext = mime === "image/png" ? "png" : "jpg";
  return `${generateSlug()}${generateSlug()}.${ext}`;
}

/** בונה את כתובת הקריאה הציבורית לתמונת ההזמנה. */
export function invitationPublicUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return `${base}/storage/v1/object/public/${INVITATION_BUCKET}/${path}`;
}
