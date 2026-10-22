"use client";

import { useEffect, useState } from "react";
import { getCountdownState, type CountdownState } from "@/lib/time";
import { toGregorianString, toHebrewDateString } from "@/lib/hebcal";
import { Diamond } from "./Ornaments";

// כרטיס דמו חי לדף הבית — תאריך יעד ~93 ימים קדימה, מחושב רק אחרי mount
// כדי להימנע מאי-התאמת hydration. התאריך העברי נגזר מהתאריך האמיתי.
// מעוצב לפי שפת ה"בוטיק" של דף הבית (home.css) ולא נוגע בעיצובי הספירה.
export function HeroDemo() {
  const [weddingDate, setWeddingDate] = useState<string | null>(null);
  const [state, setState] = useState<CountdownState | null>(null);

  useEffect(() => {
    const target = new Date();
    target.setDate(target.getDate() + 93);
    const y = target.getFullYear();
    const m = String(target.getMonth() + 1).padStart(2, "0");
    const d = String(target.getDate()).padStart(2, "0");
    const date = `${y}-${m}-${d}`;
    setWeddingDate(date);

    const tick = () =>
      setState(getCountdownState({ weddingDate: date, weddingTime: "19:00" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const r = state?.status === "countdown" ? state.remaining : null;
  const units = r
    ? [
        { label: "ימים", value: String(r.days) },
        { label: "שעות", value: String(r.hours).padStart(2, "0") },
        { label: "דקות", value: String(r.minutes).padStart(2, "0") },
        { label: "שניות", value: String(r.seconds).padStart(2, "0") },
      ]
    : null;

  return (
    <div className="b-count-card">
      <p className="b-card-kicker">הספירה לחתונה של</p>
      <p className="b-names b-display">חיים ושרה</p>

      <div className="b-clock" dir="ltr">
        {units?.map((u) => (
          <div key={u.label} className="b-clock-item">
            <div className="b-digits">{u.value}</div>
            <small>{u.label}</small>
          </div>
        ))}
      </div>

      <div className="b-divider">
        <Diamond className="h-5 w-5" />
      </div>
      <p className="b-heb-date">{weddingDate ? toHebrewDateString(weddingDate) : " "}</p>
      <p className="b-greg-date">{weddingDate ? toGregorianString(weddingDate) : " "}</p>
    </div>
  );
}
