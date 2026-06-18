// קטע תרומה עדין בתחתית דף הספירה.
// היעד נקבע ע"י NEXT_PUBLIC_DONATION_URL — אם ריק, הקטע לא מוצג.

export function DonationCTA() {
  const url = process.env.NEXT_PUBLIC_DONATION_URL;
  if (!url) return null;

  return (
    <div className="mt-12 text-center">
      <p className="mb-3 text-sm text-[var(--muted)]">
        נהניתם? המוצר חינמי — אפשר לתמוך בנו 🤍
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block rounded-full border border-[var(--accent)] px-6 py-2 text-sm font-medium accent-text transition hover:bg-[var(--accent-soft)]"
      >
        לתמיכה
      </a>
    </div>
  );
}
