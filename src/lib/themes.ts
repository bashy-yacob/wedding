// רישום ערכות העיצוב. המפתחות חייבים להישאר מסונכרנים עם ה-whitelist
// ב-supabase/migrations/0001_init.sql (constraint theme_whitelist).
//
// כל ערכה היא קבוצת CSS variables בלבד — gradients וטיפוגרפיה, ללא תמונות (צניעות).
// הצבעים מוגדרים גם כאן (ל-OG image שרץ בצד השרת) וגם ב-globals.css (לדפדפן).

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
  classic: {
    key: "classic",
    label: "קלאסי",
    bg: "#faf8f3",
    bgGradient: "linear-gradient(160deg, #faf8f3 0%, #f1ece1 100%)",
    surface: "#ffffff",
    text: "#1e2a44",
    muted: "#6b7280",
    accent: "#b08d57",
  },
  gold: {
    key: "gold",
    label: "זהב",
    bg: "#fdfaf3",
    bgGradient: "linear-gradient(160deg, #fdfaf3 0%, #f6ebd2 100%)",
    surface: "#fffdf8",
    text: "#3b2f1a",
    muted: "#8a7a6a",
    accent: "#c9a227",
  },
  olive: {
    key: "olive",
    label: "זית",
    bg: "#f4f6f0",
    bgGradient: "linear-gradient(160deg, #f4f6f0 0%, #e3e9d8 100%)",
    surface: "#fbfcf8",
    text: "#33402a",
    muted: "#6f7a63",
    accent: "#7a8b4f",
  },
  blush: {
    key: "blush",
    label: "ורד עדין",
    bg: "#fdf5f5",
    bgGradient: "linear-gradient(160deg, #fdf5f5 0%, #f6e2e4 100%)",
    surface: "#fffafa",
    text: "#4a2c34",
    muted: "#9a7077",
    accent: "#c98a9a",
  },
  royal: {
    key: "royal",
    label: "מלכותי",
    bg: "#f9f4f4",
    bgGradient: "linear-gradient(160deg, #f9f4f4 0%, #efe0e0 100%)",
    surface: "#fffafa",
    text: "#5a1f2b",
    muted: "#8a5560",
    accent: "#8c2f39",
  },
  midnight: {
    key: "midnight",
    label: "חצות",
    bg: "#161826",
    bgGradient: "linear-gradient(160deg, #1b1e30 0%, #11131f 100%)",
    surface: "#222539",
    text: "#f1ece1",
    muted: "#9aa0bd",
    accent: "#d4b66a",
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
