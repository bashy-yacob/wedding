-- ============================================================================
-- 0007_blessing_delete.sql — מחיקת ברכה ע"י השולח (טוקן סודי)
-- ----------------------------------------------------------------------------
-- בלי התחברות אין מושג "בעלות". לכן כל ברכה מקבלת delete_token סודי שנוצר
-- בעת השליחה ומוחזר לדפדפן השולח (נשמר ב-localStorage). רק מי שמחזיק בטוקן
-- יכול למחוק — דרך פונקציית SECURITY DEFINER. ה-RLS נשאר סגור ל-DELETE.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. עמודת הטוקן הסודי. לברכות קיימות (שנשלחו לפני התוספת) מייצרים טוקן אקראי —
-- הן פשוט לא יהיו ניתנות למחיקה ע"י השולח, כי אין לו את הטוקן.
-- ----------------------------------------------------------------------------
alter table public.blessings
  add column if not exists delete_token text;

update public.blessings
  set delete_token = encode(gen_random_bytes(24), 'hex')
  where delete_token is null;

alter table public.blessings
  alter column delete_token set not null;

create unique index if not exists blessings_delete_token_idx
  on public.blessings (delete_token);

-- ----------------------------------------------------------------------------
-- 2. שכתוב get_blessings — חובה להחריג את delete_token מהקריאה הציבורית!
-- הפונקציה מורצת ע"י anon (key חשוף בדפדפן); אם תחזיר את הטוקן, כל אחד יוכל
-- למחוק כל ברכה. לכן מחזירים רשימת עמודות מפורשת. (שינוי טיפוס מחייב DROP.)
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
-- 3. מחיקת ברכה לפי הטוקן הסודי בלבד. מחזיר true אם נמחקה שורה.
-- ----------------------------------------------------------------------------
create or replace function public.delete_blessing(p_token text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  delete from public.blessings
  where delete_token = p_token
  returning id into v_id;

  return v_id is not null;
end;
$$;

-- ----------------------------------------------------------------------------
-- 4. הרשאות הרצה ל-anon
-- ----------------------------------------------------------------------------
grant execute on function public.get_blessings(text)    to anon;
grant execute on function public.delete_blessing(text)  to anon;
