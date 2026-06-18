import { customAlphabet } from "nanoid";

// אלפבית URL-safe ללא תווים מבלבלים (הוסרו 0, o, 1, l, i).
const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";
const SLUG_LENGTH = 8;

const generate = customAlphabet(ALPHABET, SLUG_LENGTH);

/** מייצר slug אקראי קצר וייחודי (38^8 אפשרויות — בטוח מהתנגשות בקנה המידה הזה). */
export function generateSlug(): string {
  return generate();
}

/** בודק אם מחרוזת היא slug תקין שנוצר על ידינו. */
export function isValidSlug(value: string): boolean {
  if (value.length !== SLUG_LENGTH) return false;
  for (const ch of value) {
    if (!ALPHABET.includes(ch)) return false;
  }
  return true;
}
