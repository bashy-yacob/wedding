"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  postBlessing,
  deleteBlessing,
  type BlessingState,
} from "./actions";
import { Divider } from "@/components/Ornaments";
import type { Blessing } from "@/types/db";

interface BlessingsWallProps {
  slug: string;
  blessings: Blessing[];
}

const fieldClass =
  "w-full rounded-xl border border-[var(--accent)]/25 bg-[var(--surface)]/70 px-4 py-3 text-[var(--text)] outline-none backdrop-blur-sm transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20";

// מפתח ה-localStorage שבו נשמרים טוקני המחיקה של הברכות ששלח הדפדפן הזה.
const STORE_KEY = "adhachatuna:my-blessings";

function initials(name: string): string {
  return name.trim().slice(0, 2);
}

// קריאה/כתיבה בטוחות ל-localStorage (מפה של id → token).
function readOwned(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function writeOwned(map: Record<string, string>) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(map));
  } catch {
    /* מצב פרטי / חסום — מתעלמים */
  }
}

function TrashIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export function BlessingsWall({ slug, blessings }: BlessingsWallProps) {
  const [state, formAction, pending] = useActionState<BlessingState, FormData>(
    postBlessing,
    {},
  );
  const [open, setOpen] = useState(false);
  // מפת הברכות שהדפדפן הזה שלח (id → token) — מי שמופיע כאן יקבל כפתור מחיקה.
  const [owned, setOwned] = useState<Record<string, string>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const renderedAt = useRef(Date.now());
  const formRef = useRef<HTMLFormElement>(null);

  // טעינת הטוקנים השמורים בעלייה.
  useEffect(() => {
    setOwned(readOwned());
  }, []);

  // לאחר שליחה מוצלחת: איפוס הטופס + שמירת טוקן המחיקה של הברכה החדשה.
  useEffect(() => {
    if (!state.ok) return;
    formRef.current?.reset();
    renderedAt.current = Date.now();
    setOpen(false);
    if (state.id && state.token) {
      const next = { ...readOwned(), [state.id]: state.token };
      writeOwned(next);
      setOwned(next);
    }
  }, [state]);

  async function handleDelete(id: string) {
    const token = owned[id];
    if (!token) return;
    if (!window.confirm("למחוק את האיחול הזה? לא ניתן לשחזר.")) return;

    setDeleteError(null);
    setDeletingId(id);
    const res = await deleteBlessing(slug, id, token);
    setDeletingId(null);

    if (res.ok) {
      const next = { ...readOwned() };
      delete next[id];
      writeOwned(next);
      setOwned(next);
    } else {
      setDeleteError(res.error ?? "מחיקה נכשלה.");
    }
  }

  return (
    <section className="mt-16">
      <Divider className="mb-8" />

      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">קיר ברכות</h2>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-[var(--on-accent)] shadow-md shadow-[var(--accent)]/30 transition hover:-translate-y-0.5"
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
                className="w-full rounded-full bg-[var(--accent)] px-6 py-3 font-semibold text-[var(--on-accent)] transition hover:-translate-y-0.5 disabled:opacity-50"
              >
                {pending ? "שולח…" : "שליחת איחול"}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {deleteError && (
        <p className="mb-4 text-center text-sm text-red-600">{deleteError}</p>
      )}

      {blessings.length === 0 ? (
        <p className="text-center text-[var(--muted)]">
          עדיין אין ברכות — היו הראשונים לאחל! 🤍
        </p>
      ) : (
        <ul className="space-y-3">
          {blessings.map((b, i) => {
            const mine = Boolean(owned[b.id]);
            return (
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
                <div className="min-w-0 flex-1">
                  <p className="mb-1 whitespace-pre-wrap">{b.message}</p>
                  <p className="accent-text text-sm font-medium">
                    — {b.author_name}
                  </p>
                </div>
                {mine && (
                  <button
                    type="button"
                    onClick={() => handleDelete(b.id)}
                    disabled={deletingId === b.id}
                    aria-label="מחיקת האיחול"
                    title="מחיקת האיחול"
                    className="shrink-0 self-start rounded-full p-2 text-[var(--muted)] transition hover:bg-red-500/10 hover:text-red-600 disabled:opacity-50"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                )}
              </motion.li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
