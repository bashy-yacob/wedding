import { CountdownForm } from "@/components/CountdownForm";
import { createCountdown } from "./actions";

// דף היצירה. קורא ?event=... כדי למלא מראש את סוג האירוע — כך דפי הנחיתה
// (/countdown/...) שולחים לכאן עם "בר מצווה", "יום הולדת" וכו' כבר מוזן.
export default async function CreatePage({
  searchParams,
}: {
  searchParams: Promise<{ event?: string }>;
}) {
  const { event } = await searchParams;

  return (
    <CountdownForm
      action={createCountdown}
      heading="יצירת ספירה"
      submitLabel="צרו את הספירה"
      pendingLabel="יוצר..."
      defaultEventType={event}
    />
  );
}
