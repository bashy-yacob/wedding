-- ============================================================================
-- 0003_secure_reads.sql — סגירת דליפת פרטיות בקריאה
-- ----------------------------------------------------------------------------
-- הבעיה: ה-anon key נחשף בדפדפן (NEXT_PUBLIC), ומדיניות ה-SELECT הקודמת היתה
-- `using (true)` — כך שכל אחד יכל להריץ `select * from countdowns` ולשלוף את
-- כל השמות, התאריכים והברכות של כל המשתמשים, בלי לדעת אף slug.
--
-- הפתרון: מסירים את מדיניות הקריאה הרחבה, וחושפים את הקריאה אך ורק דרך פונקציות
-- SECURITY DEFINER שמחזירות שורות לפי slug מדויק בלבד. אין יותר ספרייה ציבורית.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. הסרת מדיניות הקריאה הרחבה (זו שאיפשרה את ההצפה)
-- ----------------------------------------------------------------------------
drop policy if exists countdowns_public_read on public.countdowns;
drop policy if exists blessings_public_read  on public.blessings;

-- ----------------------------------------------------------------------------
-- 2. קריאת ספירה בודדת לפי slug מדויק (אין enumeration)
-- ----------------------------------------------------------------------------
create or replace function public.get_countdown(p_slug text)
returns setof public.countdowns
language sql
stable
security definer
set search_path = public
as $$
  select * from public.countdowns where slug = p_slug limit 1;
$$;

-- ----------------------------------------------------------------------------
-- 3. קריאת ברכות של ספירה לפי slug מדויק בלבד
-- ----------------------------------------------------------------------------
create or replace function public.get_blessings(p_slug text)
returns setof public.blessings
language sql
stable
security definer
set search_path = public
as $$
  select b.*
  from public.blessings b
  join public.countdowns c on c.id = b.countdown_id
  where c.slug = p_slug
  order by b.created_at desc;
$$;

-- ----------------------------------------------------------------------------
-- 4. בדיקת "קיר ברכות פעיל" עבור policy ה-INSERT.
-- חייבת להיות SECURITY DEFINER: ה-policy לא יכול עוד לקרוא את countdowns ישירות
-- (אין SELECT policy), ולכן הבדיקה עוברת דרך פונקציה שעוקפת RLS.
-- ----------------------------------------------------------------------------
create or replace function public.countdown_allows_blessings(p_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.countdowns
    where id = p_id and allow_blessings = true
  );
$$;

drop policy if exists blessings_anon_insert on public.blessings;
create policy blessings_anon_insert
  on public.blessings for insert
  to anon
  with check ( public.countdown_allows_blessings(countdown_id) );

-- ----------------------------------------------------------------------------
-- 5. הקשחת ה-rate limit: ה-trigger סופר שורות ב-blessings. בלי SELECT policy
-- הספירה תחת anon היתה מחזירה 0 ומנטרלת את ההגנה — לכן הופכים אותו ל-DEFINER.
-- ----------------------------------------------------------------------------
create or replace function public.blessings_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
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

-- ----------------------------------------------------------------------------
-- 6. הרשאות הרצה ל-anon על פונקציות הקריאה
-- ----------------------------------------------------------------------------
grant execute on function public.get_countdown(text)              to anon;
grant execute on function public.get_blessings(text)              to anon;
grant execute on function public.countdown_allows_blessings(uuid) to anon;
