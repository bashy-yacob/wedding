-- ============================================================================
-- 0002_rls.sql — מדיניות הרשאות (RLS) + הגנה מספאם
-- עמוד השדרה של האבטחה: קריאה ציבורית, יצירה אנונימית, נתונים immutable.
-- ============================================================================

alter table public.countdowns enable row level security;
alter table public.blessings  enable row level security;

-- ----------------------------------------------------------------------------
-- COUNTDOWNS
-- ----------------------------------------------------------------------------

-- קריאה ציבורית. האפליקציה שואלת תמיד לפי slug ולעולם לא חושפת רשימה,
-- וה-slugs אקראיים ובלתי-נחושים — לכן אין ספרייה ציבורית בפועל.
drop policy if exists countdowns_public_read on public.countdowns;
create policy countdowns_public_read
  on public.countdowns for select
  to anon
  using (true);

-- יצירה אנונימית. ה-constraints על העמודות (0001) אוכפים אורכים ו-whitelist.
drop policy if exists countdowns_anon_insert on public.countdowns;
create policy countdowns_anon_insert
  on public.countdowns for insert
  to anon
  with check (true);

-- שים לב: אין policy ל-UPDATE / DELETE → הם נדחים. הנתונים קבועים (immutable).

-- ----------------------------------------------------------------------------
-- BLESSINGS
-- ----------------------------------------------------------------------------

drop policy if exists blessings_public_read on public.blessings;
create policy blessings_public_read
  on public.blessings for select
  to anon
  using (true);

-- כל מי שיש לו את הקישור יכול לשלוח איחול, אך ורק לספירה קיימת
-- שבה קיר הברכות פעיל. האורכים נאכפים ב-constraints (0001).
drop policy if exists blessings_anon_insert on public.blessings;
create policy blessings_anon_insert
  on public.blessings for insert
  to anon
  with check (
    exists (
      select 1 from public.countdowns c
      where c.id = countdown_id
        and c.allow_blessings = true
    )
  );

-- אין policy ל-UPDATE / DELETE → אין מחיקה/עריכה ל-anon.

-- ----------------------------------------------------------------------------
-- הגנה מספאם — מקסימום 5 ברכות לאותה ספירה בדקה
-- backstop ברמת ה-DB, בנוסף ל-honeypot ול-time-trap בצד השרת.
-- ----------------------------------------------------------------------------
create or replace function public.blessings_rate_limit()
returns trigger
language plpgsql
as $$
begin
  if (
    select count(*) from public.blessings
    where countdown_id = new.countdown_id
      and created_at > now() - interval '1 minute'
  ) >= 5 then
    raise exception 'rate_limited' using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

drop trigger if exists blessings_rate_limit_trg on public.blessings;
create trigger blessings_rate_limit_trg
  before insert on public.blessings
  for each row execute function public.blessings_rate_limit();
