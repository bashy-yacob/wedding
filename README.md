# עד החתונה — ספירה לאחור לחתונה

אתר ליצירת ספירה‑לאחור אישית לחתונה, עם תאריך עברי כראשי, קישור ייחודי לשיתוף
בוואטסאפ, קיר ברכות, ומצב "מזל טוב" ביום החתונה. עברית מלאה ו‑RTL, ללא תמונות, ללא הרשמה.

## תשתית

- **Next.js 15** (App Router) על **Vercel** — Serverless, ללא Cold Start.
- **Supabase** (PostgreSQL + RLS) — מסד נתונים מנוהל, תמיד זמין.
- **@hebcal/core** — המרת ותצוגת תאריכים עבריים.
- **Tailwind CSS v4** — עיצוב ו‑RTL.

## התקנה מקומית

```bash
npm install
cp .env.example .env.local   # מלאו את הערכים (ראו למטה)
npm run dev                  # http://localhost:3000
```

### משתני סביבה (`.env.local`)

| משתנה | תיאור |
|-------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | כתובת פרויקט ה‑Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | מפתח ה‑anon (ציבורי) |
| `NEXT_PUBLIC_SITE_URL` | כתובת האתר (לקישורי שיתוף ו‑OG) |
| `NEXT_PUBLIC_DONATION_URL` | קישור לתרומה (Bit/PayBox). ריק = הקטע מוסתר. |

> ⚠️ משתמשים אך ורק ב‑**anon key**. ה‑service role לעולם לא נכנס לקוד שנפרס —
> הוא משמש רק להרצת מיגרציות מהמכונה דרך לוח Supabase.

## הקמת מסד הנתונים (Supabase)

1. צרו פרויקט חדש ב‑[supabase.com](https://supabase.com).
2. ב‑**SQL Editor** הריצו לפי הסדר:
   - `supabase/migrations/0001_init.sql` — הטבלאות.
   - `supabase/migrations/0002_rls.sql` — מדיניות ההרשאות (RLS) + הגנת ספאם.
   - `supabase/migrations/0003_secure_reads.sql` — קריאה מאובטחת לפי slug
     בלבד (סוגר את אפשרות שליפת כל הטבלה דרך ה‑anon key).
3. (אופציונלי, לפיתוח) הריצו `supabase/seed.sql` לנתוני דמו.
4. העתיקו את ה‑URL וה‑anon key מ‑**Project Settings → API** אל `.env.local`.

### בדיקת RLS (חשוב)

ב‑SQL Editor, ודאו שהמדיניות נכונה:

```sql
set role anon;
select * from countdowns;                                            -- ❌ ריק (אין SELECT policy)
select * from get_countdown('demogold');                             -- ✅ שורה אחת לפי slug
insert into countdowns (slug, display_names, wedding_date, theme)
  values ('test1234', 'בדיקה', current_date + 10, 'gold');           -- ✅ עובד
update countdowns set blessing = 'x' where slug = 'demogold';        -- ❌ נכשל (אין policy)
delete from countdowns where slug = 'demogold';                      -- ❌ נכשל
insert into blessings (countdown_id, author_name, message)
  select id, 'a', 'b' from get_countdown('demoquiet');              -- ❌ נכשל (allow_blessings=false)
reset role;
```

> הקריאה מהאפליקציה עוברת אך ורק דרך פונקציות ה‑RPC `get_countdown` /
> `get_blessings` (SECURITY DEFINER), כך ש‑slug אקראי הוא תנאי לכל קריאה ואין
> אפשרות לשלוף את כל הספירות.

## פריסה ל‑Vercel

1. חברו את ה‑repo ל‑[Vercel](https://vercel.com).
2. הגדירו את אותם משתני הסביבה בלוח Vercel (Production).
3. עדכנו `NEXT_PUBLIC_SITE_URL` לכתובת הסופית.
4. Deploy.

## בדיקות

```bash
npm test          # vitest — hebcal / slug / time
npm run build     # ודאו שהבנייה עוברת
```

## מבנה

```
src/
├── app/
│   ├── page.tsx              # דף הבית
│   ├── create/               # טופס יצירה + Server Action
│   └── c/[slug]/             # דף הספירה, OG image, קיר ברכות
├── components/               # ThemePicker, HebrewDateInput, Share, Donation
└── lib/                      # hebcal, time, slug, themes, validation, supabase
supabase/
├── migrations/               # 0001 טבלאות, 0002 RLS
└── seed.sql                  # נתוני דמו
```

## הערות

- **תאריך עברי הוא הראשי**; הלועזי קטן לצדו (לפי בחירת היוצר).
- **מצב מזל טוב** מתחלף אוטומטית ביום החתונה לפי **זמן ישראל** (כולל שעון קיץ/חורף).
- **קיר ברכות** פתוח לכל מי שיש לו את הקישור, ללא סינון; מוגן מספאם (honeypot,
  time‑trap, והגבלת קצב ברמת ה‑DB).
- **ללא עריכה** לאחר יצירה — מי שרוצה שינוי יוצר ספירה חדשה.
- OG image לוואטסאפ נוצר דינמית עם פונט עברי (Frank Ruhl Libre).
