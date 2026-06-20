import { Heart } from "./Ornaments";

// אלמנטים מרחפים ברקע — לבבות ונצנוצים עולים לאט. מיקומים קבועים (דטרמיניסטיים)
// כדי למנוע אי-התאמת hydration. opacity נמוך, מאחורי התוכן, לא לוכד קליקים.

const ITEMS = [
  { left: "8%", size: 16, delay: 0, duration: 17, kind: "heart" },
  { left: "20%", size: 10, delay: 6, duration: 21, kind: "spark" },
  { left: "33%", size: 22, delay: 3, duration: 19, kind: "heart" },
  { left: "46%", size: 9, delay: 9, duration: 23, kind: "spark" },
  { left: "58%", size: 14, delay: 1.5, duration: 18, kind: "heart" },
  { left: "70%", size: 12, delay: 7, duration: 22, kind: "spark" },
  { left: "82%", size: 20, delay: 4.5, duration: 20, kind: "heart" },
  { left: "92%", size: 10, delay: 11, duration: 24, kind: "spark" },
] as const;

export function FloatingBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      {ITEMS.map((it, i) => (
        <span
          key={i}
          className="absolute bottom-0 text-[var(--accent)]"
          style={{
            left: it.left,
            opacity: 0.18,
            animation: `float-up ${it.duration}s linear ${it.delay}s infinite`,
          }}
        >
          {it.kind === "heart" ? (
            <Heart
              style={{ width: it.size, height: it.size }}
              className="block"
            />
          ) : (
            <svg
              width={it.size}
              height={it.size}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2l1.6 7.4L21 11l-7.4 1.6L12 20l-1.6-7.4L3 11l7.4-1.6L12 2z" />
            </svg>
          )}
        </span>
      ))}
    </div>
  );
}
