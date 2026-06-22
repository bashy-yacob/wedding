-- ============================================================================
-- 0008_blessing_delete.sql — מחיקת ברכה ע"י מי ששלח אותה (self-service)
-- ----------------------------------------------------------------------------
-- עד כה ברכות היו immutable (אין DELETE policy), וכל מחיקה דרשה התערבות ידנית
-- של בעל האתר במסד הנתונים. כאן מוסיפים לכל ברכה "טוקן מחיקה" סודי:
--   • הטוקן נוצר בשרת ומוחזר אך ורק לשולח (נשמר אצלו ב-localStorage בדפדפן).
--   • המחיקה עוברת דרך פונקציית SECURITY DEFINER שמאמתת את הטוקן.
--   • get_blessings *לא* מחזירה את הטוקן — אחרת כל קורא היה יכול למחוק הכול.
-- כך רק הדפדפן ששלח את הברכה יכול למחוק אותה, בלי התחברות ובלי מעורבות הבעלים.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. עמודת טוקן המחיקה. לשורות קיימות מייצרים טוקן אקראי (לא יהיה שמור אצל
--    אף אחד, כך שברכות ישנות ניתנות למחיקה רק דרך מסד הנתונים — וזה בסדר).
-- ----------------------------------------------------------------------------
alter table public.blessings
  add column if not exists delete_token uuid not null default gen_random_uuid();

-- ----------------------------------------------------------------------------
-- 2. שכתוב get_blessings — חובה להחריג את delete_token מהקריאה הציבורית!
--    (שינוי טיפוס ההחזרה מ-setof blessings לרשימת עמודות מפורשת מחייב DROP.)
-- ----------------------------------------------------------------------------
drop function if exists public.get_blessings(text);

create function public.get_blessings(p_slug text)
returns table (
  id           uuid,
  countdown_id uuid,
  author_name  text,
  message      text,
  created_at   timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select b.id, b.countdown_id, b.author_name, b.message, b.created_at
  from public.blessings b
  join public.countdowns c on c.id = b.countdown_id
  where c.slug = p_slug
  order by b.created_at desc;
$$;

-- ----------------------------------------------------------------------------
-- 3. הוספת ברכה דרך RPC — מחזירה את ה-id ואת delete_token לשולח.
--    מבצעת גם את בדיקת "קיר הברכות פעיל" (במקום בדיקה ידנית בצד השרת),
--    ו-trigger ה-rate-limit ממשיך לחול על ה-INSERT הפנימי.
-- ----------------------------------------------------------------------------
create or replace function public.add_blessing(
  p_slug    text,
  p_author  text,
  p_message text
)
returns table (id uuid, delete_token uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_countdown_id uuid;
begin
  select c.id into v_countdown_id
  from public.countdowns c
  where c.slug = p_slug and c.allow_blessings = true;

  if v_countdown_id is null then
    raise exception 'blessings_disabled';
  end if;

  return query
  insert into public.blessings (countdown_id, author_name, message)
  values (v_countdown_id, p_author, p_message)
  returning blessings.id, blessings.delete_token;
end;
$$;

-- ----------------------------------------------------------------------------
-- 4. מחיקת ברכה לפי id + טוקן. מחזירה true אם נמחקה (טוקן תאם), אחרת false.
-- ----------------------------------------------------------------------------
create or replace function public.delete_blessing(p_id uuid, p_token uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_deleted int;
begin
  delete from public.blessings
  where id = p_id and delete_token = p_token;

  get diagnostics v_deleted = row_count;
  return v_deleted > 0;
end;
$$;

-- ----------------------------------------------------------------------------
-- 5. הרשאות הרצה ל-anon
-- ----------------------------------------------------------------------------
grant execute on function public.get_blessings(text)               to anon;
grant execute on function public.add_blessing(text, text, text)    to anon;
grant execute on function public.delete_blessing(uuid, uuid)       to anon;
