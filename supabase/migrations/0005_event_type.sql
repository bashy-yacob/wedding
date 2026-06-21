-- ============================================================================
-- 0005_event_type.sql — סוג האירוע (השורה הראשונה)
-- ----------------------------------------------------------------------------
-- מאפשר להתאים את הספירה לכל אירוע (חתונה, בר מצווה, ברית, יום הולדת ...),
-- במקום "חתונה" קבוע. ברירת המחדל היא 'חתונה' (תואם ללוגו הטבעות).
-- get_countdown מחזיר setof public.countdowns, כך שהעמודה נכללת אוטומטית.
-- ============================================================================

alter table public.countdowns
  add column if not exists event_type text not null default 'חתונה';

alter table public.countdowns
  drop constraint if exists event_type_len;
alter table public.countdowns
  add constraint event_type_len
  check (char_length(event_type) between 1 and 30);
