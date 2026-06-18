-- ============================================================================
-- seed.sql — נתוני דמו לפיתוח מקומי
-- ============================================================================

-- ספירה רגילה (חתונה בעוד מספר חודשים)
insert into public.countdowns (slug, display_names, wedding_date, wedding_time, blessing, theme)
values ('demogold', 'חיים ושרה', current_date + 95, '19:00', 'בשעה טובה ומוצלחת!', 'gold')
on conflict (slug) do nothing;

-- ספירה שמתחלפת ל"מזל טוב" היום (לבדיקת מעבר יום-החתונה)
insert into public.countdowns (slug, display_names, wedding_date, wedding_time, blessing, theme)
values ('demotoday', 'יוסף ורבקה', current_date, '20:00', 'מזל טוב!', 'royal')
on conflict (slug) do nothing;

-- ספירה ללא קיר ברכות (לבדיקת allow_blessings = false)
insert into public.countdowns (slug, display_names, wedding_date, theme, allow_blessings)
values ('demoquiet', 'דוד ולאה', current_date + 30, 'olive', false)
on conflict (slug) do nothing;

-- כמה ברכות לדוגמה לספירה הראשונה
insert into public.blessings (countdown_id, author_name, message)
select id, 'משפחת כהן', 'מזל טוב! שתזכו לבנות בית נאמן בישראל.'
from public.countdowns where slug = 'demogold'
on conflict do nothing;

insert into public.blessings (countdown_id, author_name, message)
select id, 'הדודה מרים', 'בשעה טובה ומוצלחת, באהבה רבה!'
from public.countdowns where slug = 'demogold'
on conflict do nothing;
