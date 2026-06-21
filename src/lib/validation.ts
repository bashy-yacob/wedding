import { z } from "zod";
import { THEME_KEYS, FONT_KEYS, HEX_COLOR_RE } from "./themes";
import { INVITATION_PATH_RE } from "./storage";

// ============================================================================
// validation.ts — סכמות Zod משותפות (client + server).
// משמשות גם ל-UX וגם כהגנה לעומק לפני הכתיבה ל-DB.
// ============================================================================

const today = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

const maxWeddingDate = () => {
  const d = today();
  return new Date(d.getFullYear() + 5, d.getMonth(), d.getDate());
};

const dateOnly = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "תאריך לא תקין")
  .refine((value) => {
    const [y, m, d] = value.split("-").map((n) => parseInt(n, 10));
    const date = new Date(y, m - 1, d);
    return (
      date.getFullYear() === y &&
      date.getMonth() === m - 1 &&
      date.getDate() === d
    );
  }, "תאריך לא קיים")
  .refine((value) => {
    const [y, m, d] = value.split("-").map((n) => parseInt(n, 10));
    const date = new Date(y, m - 1, d);
    const min = today();
    min.setDate(min.getDate() - 1);
    return date >= min && date <= maxWeddingDate();
  }, "התאריך חייב להיות עתידי (עד 5 שנים מהיום)");

export const createCountdownSchema = z.object({
  display_names: z
    .string()
    .trim()
    .min(1, "יש להזין שמות או כיתוב")
    .max(80, "עד 80 תווים"),
  // סוג האירוע (חתונה / בר מצווה / ברית ...). ריק → ברירת מחדל "חתונה".
  event_type: z
    .string()
    .trim()
    .max(30, "עד 30 תווים")
    .optional()
    .or(z.literal("")),
  wedding_date: dateOnly,
  wedding_time: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "שעה לא תקינה")
    .optional()
    .or(z.literal("")),
  show_gregorian: z.boolean().default(true),
  blessing: z.string().trim().max(280, "עד 280 תווים").optional().or(z.literal("")),
  theme: z.enum(THEME_KEYS as [string, ...string[]]),
  // התאמה אישית (אופציונלי) מעל עיצוב הבסיס — צבע דגש ופונט בלבד.
  // ריק = להישאר עם צבע/פונט ברירת המחדל של העיצוב הנבחר.
  accent_color: z
    .string()
    .regex(HEX_COLOR_RE, "צבע לא תקין")
    .optional()
    .or(z.literal("")),
  font_key: z
    .enum(FONT_KEYS as [string, ...string[]])
    .optional()
    .or(z.literal("")),
  allow_blessings: z.boolean().default(true),
  // נתיב תמונת ההזמנה ב-Storage. מאומת לדפוס שם-קובץ אקראי בלבד כדי למנוע
  // הזרקת נתיב/כתובת זדוניים. ריק = אין הזמנה.
  invitation_path: z
    .string()
    .regex(INVITATION_PATH_RE, "קובץ הזמנה לא תקין")
    .optional()
    .or(z.literal("")),
});

export type CreateCountdownInput = z.infer<typeof createCountdownSchema>;

// עריכה = אותם שדות כמו ביצירה + מפתח העריכה הסודי שמאמת את הבעלות.
export const editCountdownSchema = createCountdownSchema.extend({
  edit_token: z.string().trim().min(1, "חסר מפתח עריכה"),
});

export type EditCountdownInput = z.infer<typeof editCountdownSchema>;

export const blessingSchema = z.object({
  author_name: z
    .string()
    .trim()
    .min(1, "יש להזין שם")
    .max(40, "עד 40 תווים"),
  message: z
    .string()
    .trim()
    .min(1, "יש להזין איחול")
    .max(280, "עד 280 תווים"),
});

export type BlessingInput = z.infer<typeof blessingSchema>;
