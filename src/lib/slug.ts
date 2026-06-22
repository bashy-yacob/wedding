import { customAlphabet } from "nanoid";

// אלפבית URL-safe ללא תווים מבלבלים (הוסרו 0, o, 1, l, i).
const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";
const SLUG_LENGTH = 8;

const generate = customAlphabet(ALPHABET, SLUG_LENGTH);

// מפתח העריכה הוא סוד (לא מזהה ציבורי), לכן ארוך בהרבה מ-slug: 24 תווים
// מאלפבית בן 30 ≈ 118 ביט אנטרופיה — בלתי-ניתן לניחוש/brute-force מעשי.
const EDIT_TOKEN_LENGTH = 24;
const generateToken = customAlphabet(ALPHABET, EDIT_TOKEN_LENGTH);

/** מייצר slug אקראי קצר וייחודי (38^8 אפשרויות — בטוח מהתנגשות בקנה המידה הזה). */
export function generateSlug(): string {
  return generate();
}

/** מייצר מפתח עריכה סודי וארוך, המשמש כ"סיסמה" לעריכת ספירה קיימת. */
export function generateEditToken(): string {
  return generateToken();
}

/** מייצר טוקן-מחיקה סודי לברכה, המאפשר לשולח בלבד למחוק את הברכה שלו. */
export function generateDeleteToken(): string {
  return generateToken();
}

/** בודק אם מחרוזת היא slug תקין שנוצר על ידינו. */
export function isValidSlug(value: string): boolean {
  if (value.length !== SLUG_LENGTH) return false;
  for (const ch of value) {
    if (!ALPHABET.includes(ch)) return false;
  }
  return true;
}
