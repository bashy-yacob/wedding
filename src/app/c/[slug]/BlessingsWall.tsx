"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { postBlessing, type BlessingState } from "./actions";
import { Divider } from "@/components/Ornaments";
import type { Blessing } from "@/types/db";

interface BlessingsWallProps {
  slug: string;
  blessings: Blessing[];
}

const fieldClass =
  "w-full rounded-xl border border-[var(--accent)]/25 bg-[var(--surface)]/70 px-4 py-3 text-[var(--text)] outline-none backdrop-blur-sm transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20";

function initials(name: string): string {
  return name.trim().slice(0, 2);
}

export function BlessingsWall({ slug, blessings }: BlessingsWallProps) {
  const [state, formAction, pending] = useActionState<BlessingState, FormData>(
    postBlessing,
    {},
  );
  const [open, setOpen] = useState(false);
  const renderedAt = useRef(Date.now());
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      renderedAt.current = Date.now();
      setOpen(false);
    }
  }, [state.ok]);

  return (
    <section className="mt-16">
      <Divider className="mb-8" />

      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">קיר ברכות</h2>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white shadow-md shadow-[var(--accent)]/30 transition hover:-translate-y-0.5"
        >
          {open ? "סגירה" : "שלחו איחול"}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.form
            ref={formRef}
            action={formAction}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="surface-card mb-8 space-y-3 rounded-2xl p-5">
              <input type="hidden" name="slug" value={slug} />
              <input type="hidden" name="rendered_at" value={renderedAt.current} />
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
                className="w-full rounded-full bg-[var(--accent)] px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 disabled:opacity-50"
              >
                {pending ? "שולח…" : "שליחת איחול"}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {blessings.length === 0 ? (
        <p className="text-center text-[var(--muted)]">
          עדיין אין ברכות — היו הראשונים לאחל! 🤍
        </p>
      ) : (
        <ul className="space-y-3">
          {blessings.map((b, i) => (
            <motion.li
              key={b.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4) }}
              className="surface-card flex gap-3 rounded-2xl p-4"
            >
              <span className="accent-gradient-text font-display flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--accent)]/30 text-sm font-bold">
                {initials(b.author_name)}
              </span>
              <div>
                <p className="mb-1 whitespace-pre-wrap">{b.message}</p>
                <p className="accent-text text-sm font-medium">
                  — {b.author_name}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </section>
  );
}
