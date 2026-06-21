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

// ============================================================================
// התאמה אישית — שכבה דקה מעל ה-6 עיצובים. המשתמש בוחר עיצוב בסיס (פריסה,
// צורת ספרות, רקע, עיטורים) ויכול לדרוס שני מאפיינים בלבד: צבע הדגש והפונט.
// אין כאן עיצוב חדש — רק שימוש חוזר בפונטים הטעונים ובמשתני ה-CSS הקיימים.
// ============================================================================

// מפתחות הפונטים = הפונטים שכבר נטענים ב-layout.tsx (אחד לכל עיצוב).
export type FontKey =
  | "frank"
  | "suez"
  | "rubik"
  | "amatic"
  | "secular"
  | "bellefair";

export interface FontDef {
  key: FontKey;
  label: string; // שם לתצוגה בבורר
  // משתנה ה-CSS המוגדר ב-layout.tsx + fallback כללי
  var: string;
  fallback: string;
}

export const FONTS: Record<FontKey, FontDef> = {
  frank: { key: "frank", label: "סריף קלאסי", var: "--font-frank", fallback: "serif" },
  suez: { key: "suez", label: "ארט דקו", var: "--font-suez", fallback: "serif" },
  rubik: { key: "rubik", label: "מעוגל", var: "--font-rubik", fallback: "sans-serif" },
  amatic: { key: "amatic", label: "כתב יד", var: "--font-amatic", fallback: "cursive" },
  secular: { key: "secular", label: "נועז", var: "--font-secular", fallback: "sans-serif" },
  bellefair: { key: "bellefair", label: "מעודן", var: "--font-bellefair", fallback: "serif" },
};

export const FONT_KEYS = Object.keys(FONTS) as FontKey[];

export function isFontKey(value: unknown): value is FontKey {
  return typeof value === "string" && value in FONTS;
}

// צבעי דגש מוצעים — נגזרים מ-accent של ששת העיצובים, לשימוש חוזר ב"חלקים הקיימים".
export const ACCENT_PRESETS: string[] = THEME_KEYS.map((k) => THEMES[k].accent);

// קוד צבע hex תקין בן 6 ספרות (#rrggbb).
export const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;

// צבע טקסט קריא מעל רקע ה-accent הנבחר (לבן על כהה, כהה על בהיר).
function readableOn(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62 ? "#2a2114" : "#ffffff";
}

export interface CustomDesign {
  accentColor?: string | null;
  fontKey?: string | null;
}

// בונה אובייקט סגנון עם דריסות משתני CSS בלבד. ריק = להישאר עם ערכי הבסיס.
// משמש גם בלקוח (טופס/תצוגה) וגם בשרת (עמוד הספירה).
export function customThemeVars({
  accentColor,
  fontKey,
}: CustomDesign): Record<string, string> {
  const style: Record<string, string> = {};
  if (accentColor && HEX_COLOR_RE.test(accentColor)) {
    style["--accent"] = accentColor;
    // גרסה בהירה יותר לגרדיאנט (accent-2); accent-soft נגזר אוטומטית מ--accent.
    style["--accent-2"] = `color-mix(in srgb, ${accentColor} 62%, white)`;
    style["--on-accent"] = readableOn(accentColor);
  }
  if (fontKey && isFontKey(fontKey)) {
    const f = FONTS[fontKey];
    style["--font-display"] = `var(${f.var}), ${f.fallback}`;
  }
  return style;
}
