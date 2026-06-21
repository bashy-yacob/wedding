-- ============================================================================
-- 0005_edit_token.sql — עריכה מאובטחת אחרי יצירה (קישור עריכה אישי)
-- ----------------------------------------------------------------------------
-- עד כה הנתונים היו immutable (אין UPDATE policy). כעת מוסיפים לכל ספירה
-- "מפתח עריכה" סודי (edit_token). היוצר מקבל ביצירה שני קישורים:
--   1. קישור שיתוף  — /c/<slug>            (לכל המוזמנים)
--   2. קישור עריכה  — /c/<slug>/edit?token=<edit_token>  (סודי, ליוצר בלבד)
--
-- ה-RLS נשאר סגור לחלוטין ל-UPDATE. העריכה עוברת אך ורק דרך פונקציית
-- SECURITY DEFINER שמאמתת את הטוקן — הטוקן הוא הסוד שמחליף התחברות.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. תיקון constraint תנודתי: date_sane המקורי השתמש ב-current_date, ופוסטגרס
-- בודק מחדש את כל ה-CHECK constraints על *כל* UPDATE לשורה. לכן ה-backfill כאן —
-- וגם כל עריכה עתידית — נכשל ברגע שתאריך החתונה חלף ("violates date_sane").
-- מחליפים בבדיקת שפיות סטטית; אכיפת "תאריך עתידי" נשארת ב-zod (יצירה/עריכה).
-- ----------------------------------------------------------------------------
alter table public.countdowns drop constraint if exists date_sane;
alter table public.countdowns
  add constraint date_sane check (
    wedding_date between date '2000-01-01' and date '2100-01-01'
  );

-- ----------------------------------------------------------------------------
-- 2. עמודת הטוקן הסודי. לשורות קיימות מייצרים טוקן אקראי חד-פעמי (hex).
-- ----------------------------------------------------------------------------
alter table public.countdowns
  add column if not exists edit_token text;

update public.countdowns
  set edit_token = encode(gen_random_bytes(24), 'hex')
  where edit_token is null;

alter table public.countdowns
  alter column edit_token set not null;

create unique index if not exists countdowns_edit_token_idx
  on public.countdowns (edit_token);

-- ----------------------------------------------------------------------------
-- 3. שכתוב get_countdown — חובה להחריג את edit_token מהקריאה הציבורית!
-- הפונקציה מורצת ע"י anon (שה-key שלו חשוף בדפדפן); אם תחזיר את הטוקן,
-- כל מי שיודע slug יוכל לשלוף את מפתח העריכה. לכן מחזירים רשימת עמודות מפורשת.
-- (שינוי טיפוס ההחזרה מחייב DROP לפני CREATE.)
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
         show_gregorian, blessing, theme, allow_blessings, invitation_path,
         created_at
  from public.countdowns
  where slug = p_slug
  limit 1;
$$;

-- ----------------------------------------------------------------------------
-- 4. שליפת הספירה לעריכה לפי הטוקן הסודי בלבד (לא לפי slug).
-- מחזירה את כל העמודות (כולל הטוקן) — אך זמין רק למי שכבר מחזיק בטוקן.
-- ----------------------------------------------------------------------------
create or replace function public.get_countdown_for_edit(p_token text)
returns setof public.countdowns
language sql
stable
security definer
set search_path = public
as $$
  select * from public.countdowns where edit_token = p_token limit 1;
$$;

-- ----------------------------------------------------------------------------
-- 5. עדכון ספירה לפי הטוקן. מחזיר את ה-slug בהצלחה, או NULL אם הטוקן שגוי.
-- ה-constraints על הטבלה (אורכים, whitelist של theme, date_sane) נאכפים גם
-- בעדכון — הגנה לעומק זהה ליצירה. ה-slug עצמו אינו ניתן לשינוי.
-- ----------------------------------------------------------------------------
create or replace function public.update_countdown(
  p_token           text,
  p_event_type      text,
  p_display_names   text,
  p_wedding_date    date,
  p_wedding_time    time,
  p_show_gregorian  boolean,
  p_blessing        text,
  p_theme           text,
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
    allow_blessings = p_allow_blessings,
    invitation_path = p_invitation_path
  where edit_token = p_token
  returning slug into v_slug;

  return v_slug; -- NULL → טוקן לא נמצא
end;
$$;

-- ----------------------------------------------------------------------------
-- 6. הרשאות הרצה ל-anon
-- ----------------------------------------------------------------------------
grant execute on function public.get_countdown(text)               to anon;
grant execute on function public.get_countdown_for_edit(text)      to anon;
grant execute on function public.update_countdown(
  text, text, text, date, time, boolean, text, text, boolean, text
)                                                                  to anon;
