"use client";

import { useEffect, useState } from "react";
import { Sparkles, Key, Check } from "@/components/Ornaments";

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
      <p className="flex items-center justify-center gap-2 text-center font-semibold">
        הספירה נוצרה!
        <Sparkles className="h-5 w-5 text-[var(--accent)]" />
      </p>

      <div className="mt-4 space-y-4">
        <LinkRow
          label="קישור לשיתוף"
          hint="זה הקישור לשלוח לכל המוזמנים."
          url={shareUrl}
        />

        <LinkRow
          icon={<Key className="h-4 w-4 text-[var(--accent)]" />}
          label="קישור עריכה אישי"
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
  icon,
}: {
  label: string;
  hint: string;
  url: string;
  highlight?: boolean;
  whatsappText?: string;
  icon?: React.ReactNode;
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
      <p className="flex items-center gap-1.5 text-sm font-medium">
        {icon}
        {label}
      </p>
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
          className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-[var(--on-accent)] transition hover:opacity-90"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              הועתק
            </>
          ) : (
            "העתקה"
          )}
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
