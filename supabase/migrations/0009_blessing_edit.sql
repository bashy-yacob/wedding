-- ============================================================================
-- 0009_blessing_edit.sql — עריכת ברכה ע"י השולח (אותו טוקן סודי כמו במחיקה)
-- ----------------------------------------------------------------------------
-- מי שמחזיק ב-delete_token של הברכה (נשמר ב-localStorage בעת השליחה) יכול לא
-- רק למחוק אלא גם לעדכן את נוסח הברכה — דרך פונקציית SECURITY DEFINER, בלי
-- לפתוח את ה-RLS ל-UPDATE. הטקסט נבדק (לא ריק, עד 280 תווים) גם כאן כהגנה לעומק.
-- ============================================================================

create or replace function public.update_blessing(p_token text, p_message text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id  uuid;
  v_msg text;
begin
  v_msg := btrim(p_message);
  if v_msg is null or length(v_msg) = 0 or length(v_msg) > 280 then
    return false;
  end if;

  update public.blessings
  set message = v_msg
  where delete_token = p_token
  returning id into v_id;

  return v_id is not null;
end;
$$;

grant execute on function public.update_blessing(text, text) to anon;
