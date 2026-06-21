import type { ThemeKey } from "@/lib/themes";

export interface Countdown {
  id: string;
  slug: string;
  display_names: string;
  event_type: string; // סוג האירוע — "חתונה" כברירת מחדל
  wedding_date: string; // 'YYYY-MM-DD'
  wedding_time: string | null; // 'HH:MM:SS'
  show_gregorian: boolean;
  blessing: string | null;
  theme: ThemeKey;
  allow_blessings: boolean;
  invitation_path: string | null;
  created_at: string;
}

export interface Blessing {
  id: string;
  countdown_id: string;
  author_name: string;
  message: string;
  created_at: string;
}
