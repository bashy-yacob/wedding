"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { postBlessing, type BlessingState } from "./actions";
import type { Blessing } from "@/types/db";

interface BlessingsWallProps {
  slug: string;
  blessings: Blessing[];
}

const fieldClass =
  "w-full rounded-xl border border-black/10 bg-[var(--surface)] px-4 py-3 text-[var(--text)] outline-none focus:border-[var(--accent)]";

export function BlessingsWall({ slug, blessings }: BlessingsWallProps) {
  const [state, formAction, pending] = useActionState<BlessingState, FormData>(
    postBlessing,
    {},
  );
  const [open, setOpen] = useState(false);
  const renderedAt = useRef(Date.now());
  const formRef = useRef<HTMLFormElement>(null);

  // איפוס הטופס וסגירתו לאחר שליחה מוצלחת (הברכה תופיע אחרי revalidate)
  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      renderedAt.current = Date.now();
      setOpen(false);
    }
  }, [state.ok]);

  return (
    <section className="mt-14">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">קיר ברכות</h2>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          {open ? "סגירה" : "שלחו איחול"}
        </button>
      </div>

      {open && (
        <form
          ref={formRef}
          action={formAction}
          className="surface-card mb-8 space-y-3 rounded-2xl p-5"
        >
          <input type="hidden" name="slug" value={slug} />
          <input type="hidden" name="rendered_at" value={renderedAt.current} />
          {/* honeypot — מוסתר מבני אדם */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="hidden"
          />

          <input
            name="author_name"
            required
            maxLength={40}
            placeholder="השם שלכם"
            className={fieldClass}
          />
          <textarea
            name="message"
            required
            maxLength={280}
            rows={3}
            placeholder="כתבו איחול חם…"
            className={fieldClass}
          />

          {state.error && (
            <p className="text-sm text-red-600">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-[var(--accent)] px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {pending ? "שולח…" : "שליחת איחול"}
          </button>
        </form>
      )}

      {blessings.length === 0 ? (
        <p className="text-center text-[var(--muted)]">
          עדיין אין ברכות — היו הראשונים לאחל!
        </p>
      ) : (
        <ul className="space-y-3">
          {blessings.map((b) => (
            <li key={b.id} className="surface-card rounded-2xl p-4">
              <p className="mb-1 whitespace-pre-wrap">{b.message}</p>
              <p className="accent-text text-sm font-medium">— {b.author_name}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
