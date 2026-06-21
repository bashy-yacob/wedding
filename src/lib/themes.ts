// רישום ערכות העיצוב. המפתחות חייבים להישאר מסונכרנים עם ה-whitelist
// ב-supabase/migrations/0001_init.sql (constraint theme_whitelist).
//
// כל מפתח הוא *שפת עיצוב* שלמה ונפרדת — לא רק החלפת צבעים. הפריסה, הטיפוגרפיה,
// הרקע, צורת הספרות והעיטורים שונים לחלוטין בין הערכות, וכולם מוגדרים ב-globals.css
// תחת [data-theme="..."]. כאן נשמרים הצבעים העיקריים בלבד, לשימוש ה-OG image
// (רץ בצד השרת) ובורר העיצוב. ללא תמונות (צניעות) — gradients, צורות וטיפוגרפיה.
//
// שש השפות:
//   classic   — הזמנה ערוכה: נייר קרם, ספרות סריף עם קו זהב דק, ללא קופסאות.
//   gold      — ארט דקו: רקע כהה, מסגרות זהב גאומטריות, ספרות מוזהבות.
//   olive     — בוטני: ירוקי מרווה רכים, דיסקיות אורגניות, אווירת גן.
//   blush     — רומנטי: ענני ורוד, קפסולות מעוגלות, לבבות.
//   royal     — נועז/מודרני: ניגודיות גבוהה, ספרות סאנס ענקיות, בלוק צבע.
//   midnight  — שמי לילה: שמי כוכבים, ספרות זוהרות, אווירה שמימית.

export type ThemeKey =
  | "classic"
  | "gold"
  | "olive"
  | "blush"
  | "royal"
  | "midnight";

export interface Theme {
  key: ThemeKey;
  label: string; // שם לתצוגה בבורר העיצוב
  // הצבעים העיקריים — משמשים את ה-OG image ואת התצוגה המקדימה בבורר
  bg: string;
  bgGradient: string;
  surface: string;
  text: string;
  muted: string;
  accent: string;
}

export const THEMES: Record<ThemeKey, Theme> = {
  // הזמנה ערוכה — נייר קרם, דיו כהה, קו זהב דק.
  classic: {
    key: "classic",
    label: "קלאסי",
    bg: "#faf8f3",
    bgGradient: "linear-gradient(160deg, #fdfcf8 0%, #f0ebe0 100%)",
    surface: "#ffffff",
    text: "#26303f",
    muted: "#8c8576",
    accent: "#b08d57",
  },
  // ארט דקו — רקע אספרסו כהה עם זוהר זהב גאומטרי.
  gold: {
    key: "gold",
    label: "ארט דקו",
    bg: "#14110b",
    bgGradient:
      "radial-gradient(circle at 50% 30%, #2a2114 0%, #14110b 70%)",
    surface: "#1d1810",
    text: "#f3e7c6",
    muted: "#b7a079",
    accent: "#d4af37",
  },
  // בוטני — ירוקי מרווה רכים ואורגניים, אווירת גן.
  olive: {
    key: "olive",
    label: "בוטני",
    bg: "#eef2e6",
    bgGradient: "linear-gradient(160deg, #f3f6ec 0%, #dde7cc 100%)",
    surface: "#fbfdf6",
    text: "#2f3d27",
    muted: "#6f7d5e",
    accent: "#6b8e4e",
  },
  // רומנטי — ענני ורוד חולמניים, קפסולות רכות.
  blush: {
    key: "blush",
    label: "רומנטי",
    bg: "#fdf3f4",
    bgGradient: "linear-gradient(160deg, #fff7f8 0%, #fbdfe6 100%)",
    surface: "#fffafb",
    text: "#5b3a44",
    muted: "#b08a92",
    accent: "#d98ba0",
  },
  // נועז — קרם בניגוד לבורדו עז, ספרות סאנס ענקיות.
  royal: {
    key: "royal",
    label: "נועז",
    bg: "#f4ede4",
    bgGradient: "linear-gradient(160deg, #f4ede4 0%, #f4ede4 58%, #c8475a 100%)",
    surface: "#fffaf5",
    text: "#3a0d16",
    muted: "#9a6b72",
    accent: "#9b1b30",
  },
  // שמי לילה — שמי כוכבים כהים, ספרות זוהרות.
  midnight: {
    key: "midnight",
    label: "שמי לילה",
    bg: "#0d1024",
    bgGradient: "radial-gradient(circle at 50% 0%, #1a1f44 0%, #0a0c1d 75%)",
    surface: "rgba(26, 31, 64, 0.72)",
    text: "#f4f1e8",
    muted: "#9aa3c8",
    accent: "#e8c878",
  },
};

export const THEME_KEYS = Object.keys(THEMES) as ThemeKey[];

export const DEFAULT_THEME: ThemeKey = "classic";

export function getTheme(key: string | null | undefined): Theme {
  if (key && key in THEMES) return THEMES[key as ThemeKey];
  return THEMES[DEFAULT_THEME];
}

export function isThemeKey(value: unknown): value is ThemeKey {
  return typeof value === "string" && value in THEMES;
}
