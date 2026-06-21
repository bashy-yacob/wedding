-- ============================================================================
-- 0007_custom_design.sql — התאמה אישית מעל ששת העיצובים
-- ----------------------------------------------------------------------------
-- ה-theme נשאר עיצוב הבסיס (פריסה, צורת ספרות, רקע, עיטורים). מוסיפים שתי
-- דריסות אופציונליות בלבד — אין כאן עיצוב חדש, רק שימוש חוזר בחלקים הקיימים:
--   accent_color — צבע דגש משלכם (#rrggbb). null = הצבע של עיצוב הבסיס.
--   font_key     — פונט משלכם (מתוך הפונטים הטעונים). null = הפונט של הבסיס.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. עמודות הדריסה + constraints (הגנה לעומק, מסונכרן עם zod ו-themes.ts).
-- ----------------------------------------------------------------------------
alter table public.countdowns
  add column if not exists accent_color text,
  add column if not exists font_key text;

alter table public.countdowns
  drop constraint if exists accent_color_hex;
alter table public.countdowns
  add constraint accent_color_hex
  check (accent_color is null or accent_color ~ '^#[0-9a-fA-F]{6}$');

alter table public.countdowns
  drop constraint if exists font_key_whitelist;
alter table public.countdowns
  add constraint font_key_whitelist
  check (font_key is null or font_key in
    ('frank', 'suez', 'rubik', 'amatic', 'secular', 'bellefair'));

-- ----------------------------------------------------------------------------
-- 2. שכתוב get_countdown — חובה להוסיף את העמודות החדשות לרשימה המפורשת
-- (אחרת הקריאה הציבורית לא תחזיר אותן). edit_token עדיין מוחרג.
-- שינוי טיפוס ההחזרה מחייב DROP לפני CREATE.
-- ----------------------------------------------------------------------------
drop function if exists public.get_countdown(text);

create function public.get_countdown(p_slug text)
returns table (
  id              uuid,
  slug            text,
  display_names   text,
  event_type      text,
  wedding_date    date,
  wedding_time    time,
  show_gregorian  boolean,
  blessing        text,
  theme           text,
  accent_color    text,
  font_key        text,
  allow_blessings boolean,
  invitation_path text,
  created_at      timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select id, slug, display_names, event_type, wedding_date, wedding_time,
         show_gregorian, blessing, theme, accent_color, font_key,
         allow_blessings, invitation_path, created_at
  from public.countdowns
  where slug = p_slug
  limit 1;
$$;

grant execute on function public.get_countdown(text) to anon;

-- ----------------------------------------------------------------------------
-- 3. שכתוב update_countdown — תוספת שני פרמטרים (accent_color, font_key).
-- שינוי החתימה מחייב DROP של החתימה הישנה לפני CREATE של החדשה.
-- ----------------------------------------------------------------------------
drop function if exists public.update_countdown(
  text, text, text, date, time, boolean, text, text, boolean, text
);

create function public.update_countdown(
  p_token           text,
  p_event_type      text,
  p_display_names   text,
  p_wedding_date    date,
  p_wedding_time    time,
  p_show_gregorian  boolean,
  p_blessing        text,
  p_theme           text,
  p_accent_color    text,
  p_font_key        text,
  p_allow_blessings boolean,
  p_invitation_path text
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_slug text;
begin
  update public.countdowns set
    event_type      = p_event_type,
    display_names   = p_display_names,
    wedding_date    = p_wedding_date,
    wedding_time    = p_wedding_time,
    show_gregorian  = p_show_gregorian,
    blessing        = p_blessing,
    theme           = p_theme,
    accent_color    = p_accent_color,
    font_key        = p_font_key,
    allow_blessings = p_allow_blessings,
    invitation_path = p_invitation_path
  where edit_token = p_token
  returning slug into v_slug;

  return v_slug; -- NULL → טוקן לא נמצא
end;
$$;

grant execute on function public.update_countdown(
  text, text, text, date, time, boolean, text, text, text, text, boolean, text
) to anon;
