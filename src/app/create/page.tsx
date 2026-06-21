"use client";

import { CountdownForm } from "@/components/CountdownForm";
import { createCountdown } from "./actions";

export default function CreatePage() {
  return (
    <CountdownForm
      action={createCountdown}
      heading="יצירת ספירה"
      submitLabel="צרו את הספירה"
      pendingLabel="יוצר..."
    />
  );
}
