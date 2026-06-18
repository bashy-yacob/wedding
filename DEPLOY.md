# הוראות פריסה — "עד החתונה"

מדריך מקצה לקצה כדי להעלות את האתר לאוויר. שני חלקים: **Supabase** (מסד נתונים) ואז
**Vercel** (האתר). ~15 דקות.

---

## חלק א' — Supabase

1. **צרו פרויקט** ב‑[supabase.com](https://supabase.com) → **New project**. בחרו אזור קרוב
   (Europe / Frankfurt), שמרו את סיסמת המסד.
2. **הריצו את הסכמה** ב‑**SQL Editor → New query**, לפי הסדר (כל אחד בנפרד → **Run**):
   - תוכן `supabase/migrations/0001_init.sql`
   - תוכן `supabase/migrations/0002_rls.sql`
   - (אופציונלי, לדמו) `supabase/seed.sql`
3. **העתיקו מפתחות** מ‑**Project Settings → API**:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

> ⚠️ אל תשתמשו ב‑`service_role` key — הוא לא נכנס לאתר.

---

## חלק ב' — Vercel

4. **ייבוא**: [vercel.com](https://vercel.com) → התחברו עם GitHub → **Add New → Project** →
   בחרו `bashy-yacob/wedding` → **Import**.
5. **משתני סביבה** (לפני Deploy):

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | ה‑Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ה‑anon key |
   | `NEXT_PUBLIC_SITE_URL` | כתובת הפרויקט (זמני — נתקן בצעד 7) |
   | `NEXT_PUBLIC_DONATION_URL` | ריק לבינתיים |

6. **Deploy** → המתינו עד **Ready**.
7. **תקנו את כתובת האתר**: העתיקו את הכתובת האמיתית → **Settings → Environment Variables** →
   עדכנו `NEXT_PUBLIC_SITE_URL` → **Deployments → Redeploy**.

> ⚠️ ודאו ש‑**Production Branch** (Vercel → Settings → Git) = `main`, ושה‑**default branch**
> ב‑GitHub (Settings → Branches) = `main`. אחרת לא ייווצר Production Deployment.

---

## חלק ג' — בדיקה

1. דף הבית → **"צרו ספירה"** → מלאו ושמרו.
2. דף הספירה: מונה חי + תאריך עברי ראשי + כפתור וואטסאפ.
3. קיר ברכות: "שלחו איחול" → אמור להופיע מיד.
4. שתפו את הקישור בוואטסאפ → כרטיסיית תצוגה עם השמות והתאריך.
5. `/c/demotoday` (אם הרצתם seed) → מצב "מזל טוב".

### תקלות נפוצות
- **"אירעה שגיאה ביצירת הספירה"** → מפתחות שגויים, או שהמיגרציות לא רצו.
- **כרטיס וואטסאפ שבור/לא מופיע** → בדקו עם slug חדש, או דרך
  [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/); ודאו
  ש‑`NEXT_PUBLIC_SITE_URL` נכון ושעשיתם Redeploy.
