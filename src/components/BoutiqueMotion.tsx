"use client";

import { useEffect } from "react";

// מנוע התנועה של עמודי ה"בוטיק" (הסגנונות ב-home.css, תחת [data-motion="on"]).
//   - כניסה בגלילה: כל [data-reveal] מקבל is-in כשהוא נכנס למסך;
//     [data-stagger] מדרג את הילדים שלו בהשהיה עולה.
//   - פרלקסה וסרגל התקדמות: משתני --hero-sy, --progress, --studio-p.
//   - הטיית כרטיס הדוגמה אחרי העכבר (רק במכשירים עם עכבר).
// התנועה מופעלת רק אחרי שהסקריפט רץ — בלי JS או עם "הפחתת תנועה" הכול
// פשוט מוצג כרגיל.
export function BoutiqueMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".boutique");
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    // דירוג: כל ילד מסומן בקבוצה מקבל השהיה לפי מקומו.
    root.querySelectorAll<HTMLElement>("[data-stagger]").forEach((group) => {
      const step = Number(group.dataset.stagger) || 0.08;
      const items = Array.from(
        group.querySelectorAll<HTMLElement>("[data-reveal]"),
      ).filter((el) => el.parentElement?.closest("[data-stagger]") === group);
      items.forEach((el, i) => {
        if (!el.style.getPropertyValue("--d")) {
          el.style.setProperty("--d", `${(i * step).toFixed(2)}s`);
        }
      });
    });

    // אלמנט שמוסתר ב-clip-path (mask / wipe) נחשב "לא נראה" ל-IntersectionObserver,
    // ולכן עוקבים אחרי ההורה שלו ומפעילים אותו כשההורה נכנס.
    const watched = new Map<Element, HTMLElement[]>();
    root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      const clipped = el.dataset.reveal === "mask" || el.dataset.reveal === "wipe";
      const target = clipped && el.parentElement ? el.parentElement : el;
      watched.set(target, [...(watched.get(target) ?? []), el]);
    });

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          io.unobserve(entry.target);
          for (const el of watched.get(entry.target) ?? []) {
            el.classList.add("is-in");
            // אחרי הכניסה מאפסים את ההשהיה, כדי שריחוף לא יחכה לה.
            el.addEventListener(
              "transitionend",
              () => el.style.setProperty("--d", "0s"),
              { once: true },
            );
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    watched.forEach((_, target) => io.observe(target));
    root.dataset.motion = "on";

    // גלילה: סרגל התקדמות, פרלקסה ב-Hero וזוהר נע בסטודיו.
    const hero = root.querySelector<HTMLElement>(".b-hero");
    const studio = root.querySelector<HTMLElement>("#studio");
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      root.style.setProperty("--progress", max > 0 ? (y / max).toFixed(4) : "0");
      if (hero) {
        root.style.setProperty("--hero-sy", String(Math.min(y, hero.offsetHeight)));
      }
      if (studio) {
        const r = studio.getBoundingClientRect();
        const p = 1 - (r.top + r.height) / (window.innerHeight + r.height);
        root.style.setProperty("--studio-p", Math.min(1, Math.max(0, p)).toFixed(3));
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // הטיית כרטיס הדוגמה בתלת-ממד אחרי העכבר.
    const card = root.querySelector<HTMLElement>(".b-count-card");
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const onMove = (e: PointerEvent) => {
      if (!card) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty("--ry", `${(x * 12).toFixed(2)}deg`);
      card.style.setProperty("--rx", `${(-y * 12).toFixed(2)}deg`);
    };
    const onLeave = () => {
      card?.style.setProperty("--rx", "0deg");
      card?.style.setProperty("--ry", "0deg");
    };
    if (card && finePointer) {
      card.addEventListener("pointermove", onMove);
      card.addEventListener("pointerleave", onLeave);
    }

    return () => {
      io.disconnect();
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      card?.removeEventListener("pointermove", onMove);
      card?.removeEventListener("pointerleave", onLeave);
      delete root.dataset.motion;
    };
  }, []);

  return null;
}
