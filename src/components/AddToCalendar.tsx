import { Calendar, Google, Apple } from "@/components/Ornaments";
import {
  googleCalendarUrl,
  icsDataUrl,
  type CalendarEventInput,
} from "@/lib/calendar";

// כפתור "הוספה ליומן" — נפתח (disclosure נטיב, ללא JS) לשתי אפשרויות:
// Google Calendar (קישור) ו-Apple/Outlook (קובץ ICS להורדה). הזמן בשעון ישראל.
export function AddToCalendar(props: CalendarEventInput) {
  const googleUrl = googleCalendarUrl(props);
  const ics = icsDataUrl(props);

  return (
    <details className="group relative mx-auto w-fit">
      <summary className="surface-card accent-text flex cursor-pointer list-none items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold shadow-md transition hover:-translate-y-0.5">
        <Calendar className="h-4 w-4 text-[var(--accent)]" />
        הוספה ליומן
      </summary>

      <div className="surface-card absolute left-1/2 z-20 mt-2 flex w-56 -translate-x-1/2 flex-col gap-1 rounded-2xl p-2 shadow-xl">
        <a
          href={googleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition hover:bg-[var(--accent-soft)]"
        >
          <Google className="h-4 w-4 text-[var(--accent)]" />
          Google Calendar
        </a>
        <a
          href={ics}
          download="event.ics"
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition hover:bg-[var(--accent-soft)]"
        >
          <Apple className="h-4 w-4 text-[var(--accent)]" />
          Apple / Outlook
        </a>
      </div>
    </details>
  );
}
