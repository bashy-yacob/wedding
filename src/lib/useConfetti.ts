"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

// מפעיל קונפטי חגיגי כש-active הופך ל-true: פיצוץ פתיחה + סדרה עדינה.
// מכבד prefers-reduced-motion.
export function useConfetti(active: boolean) {
  useEffect(() => {
    if (!active) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const colors = ["#c9a227", "#e7cb6b", "#ffffff", "#c98a9a"];

    // פיצוץ פתיחה משני הצדדים
    const burst = () => {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { x: 0.2, y: 0.6 },
        colors,
        scalar: 0.9,
      });
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { x: 0.8, y: 0.6 },
        colors,
        scalar: 0.9,
      });
    };

    burst();

    // סדרה עדינה כל כמה שניות
    const interval = setInterval(() => {
      confetti({
        particleCount: 30,
        spread: 100,
        startVelocity: 28,
        origin: { x: Math.random(), y: -0.1 },
        colors,
        scalar: 0.8,
        gravity: 0.8,
      });
    }, 3500);

    const stop = setTimeout(() => clearInterval(interval), 15000);

    return () => {
      clearInterval(interval);
      clearTimeout(stop);
    };
  }, [active]);
}
