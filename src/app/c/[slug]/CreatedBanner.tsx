"use client";

import { useEffect, useState } from "react";

interface CreatedBannerProps {
  slug: string;
  editToken: string;
}

// בנר ההצלחה שמוצג מיד אחרי יצירת הספירה. מציג שני קישורים נפרדים וברורים:
// קישור שיתוף (לכולם) וקישור עריכה (סודי, ליוצר). מדגיש לשמור על קישור העריכה.
export function CreatedBanner({ slug, editToken }: CreatedBannerProps) {
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
    // מנקים את הטוקן משורת הכתובת כדי שהעתקה מקרית של ה-URL לא תחשוף את מפתח
    // העריכה. הקישורים בבנר עצמם נשארים מלאים.
    window.history.replaceState(null, "", `/c/${slug}`);
  }, [slug]);

  const shareUrl = origin ? `${origin}/c/${slug}` : "";
  const editUrl = origin ? `${origin}/c/${slug}/edit?token=${editToken}` : "";

  return (
    <div className="surface-card reveal mb-8 rounded-2xl p-5">
      <p className="text-center font-semibold">הספירה נוצרה! 🎉</p>

      <div className="mt-4 space-y-4">
        <LinkRow
          label="קישור לשיתוף"
          hint="זה הקישור לשלוח לכל המוזמנים."
          url={shareUrl}
        />

        <LinkRow
          label="🔑 קישור עריכה אישי"
          hint="שמרו אותו! רק דרכו תוכלו לעדכן פרטים או להוסיף את ההזמנה בהמשך. אל תשתפו אותו."
          url={editUrl}
          highlight
          whatsappText={`קישור העריכה לספירת החתונה שלי (לשמירה אישית): ${editUrl}`}
        />
      </div>
    </div>
  );
}

function LinkRow({
  label,
  hint,
  url,
  highlight,
  whatsappText,
}: {
  label: string;
  hint: string;
  url: string;
  highlight?: boolean;
  whatsappText?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* דפדפן ללא הרשאת clipboard — המשתמש יכול להעתיק ידנית מהשדה */
    }
  }

  return (
    <div
      className={`rounded-xl p-3 ${
        highlight
          ? "border border-[var(--accent)]/40 bg-[var(--accent)]/5"
          : "bg-[var(--surface)]/50"
      }`}
    >
      <p className="text-sm font-medium">{label}</p>
      <p className="mt-0.5 text-xs text-[var(--muted)]">{hint}</p>

      <div className="mt-2 flex gap-2">
        <input
          type="text"
          readOnly
          value={url}
          onFocus={(e) => e.currentTarget.select()}
          className="min-w-0 flex-1 rounded-lg border border-black/10 bg-[var(--surface)] px-3 py-2 text-xs text-[var(--text)] ltr:text-left"
          dir="ltr"
        />
        <button
          type="button"
          onClick={copy}
          className="shrink-0 rounded-lg bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-[var(--on-accent)] transition hover:opacity-90"
        >
          {copied ? "הועתק ✓" : "העתקה"}
        </button>
      </div>

      {whatsappText && url && (
        <a
          href={`https://wa.me/?text=${encodeURIComponent(whatsappText)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-xs text-[var(--accent)] underline"
        >
          שליחת הקישור לעצמי בוואטסאפ →
        </a>
      )}
    </div>
  );
}
