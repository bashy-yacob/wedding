-- ============================================================================
-- 0004_invitations.sql — העלאת הזמנת החתונה (תמונה)
-- ----------------------------------------------------------------------------
-- מוסיף עמודה לשמירת נתיב התמונה ב-Storage, יוצר bucket ציבורי עם הגבלות
-- (סוג קובץ + גודל), ומאפשר העלאה אנונימית אך ורק ל-bucket הזה.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. עמודת הנתיב בטבלת הספירות. הנתיב הוא שם קובץ אקראי בלבד (למשל abcd1234 efgh5678.jpg)
-- ----------------------------------------------------------------------------
alter table public.countdowns
  add column if not exists invitation_path text;

alter table public.countdowns
  drop constraint if exists invitation_path_len;
alter table public.countdowns
  add constraint invitation_path_len
  check (invitation_path is null or char_length(invitation_path) <= 256);

-- get_countdown מחזיר setof public.countdowns, כך שהעמודה החדשה נכללת אוטומטית.

-- ----------------------------------------------------------------------------
-- 2. ה-bucket: ציבורי לקריאה, מוגבל ל-5MB ולתמונות JPG/PNG בלבד.
-- ההגבלות נאכפות ע"י Storage עצמו בעת ההעלאה.
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'invitations',
  'invitations',
  true,
  5242880, -- 5MB
  array['image/jpeg', 'image/png']
)
on conflict (id) do update set
  public             = excluded.public,
  file_size_limit    = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- ----------------------------------------------------------------------------
-- 3. מדיניות Storage — קריאה ציבורית + העלאה אנונימית ל-bucket הזה בלבד.
-- (storage.objects כבר עם RLS מופעל כברירת מחדל ב-Supabase.)
-- ----------------------------------------------------------------------------
drop policy if exists invitations_public_read on storage.objects;
create policy invitations_public_read
  on storage.objects for select
  to anon
  using (bucket_id = 'invitations');

drop policy if exists invitations_anon_insert on storage.objects;
create policy invitations_anon_insert
  on storage.objects for insert
  to anon
  with check (bucket_id = 'invitations');

-- אין policy ל-UPDATE / DELETE → הקבצים immutable (תואם למדיניות "ללא עריכה").
