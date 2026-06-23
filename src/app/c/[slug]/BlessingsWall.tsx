"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  postBlessing,
  deleteBlessing,
  editBlessing,
  type BlessingState,
} from "./actions";
import { Divider, Heart, Trash, Pencil, Check } from "@/components/Ornaments";
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

// מפתח localStorage לטוקני-המחיקה של ברכות שנשלחו מהדפדפן הזה (לפי ספירה).
const tokensKey = (slug: string) => `blessing-tokens:${slug}`;

type TokenMap = Record<string, string>; // blessingId → deleteToken

function loadTokens(slug: string): TokenMap {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(tokensKey(slug)) ?? "{}") as TokenMap;
  } catch {
    return {};
  }
}

export function BlessingsWall({ slug, blessings }: BlessingsWallProps) {
  const [state, formAction, pending] = useActionState<BlessingState, FormData>(
    postBlessing,
    {},
  );
  const [open, setOpen] = useState(false);
  const renderedAt = useRef(Date.now());
  const formRef = useRef<HTMLFormElement>(null);

  // הטוקנים של הברכות "שלי" (אלו שנשלחו מהדפדפן הזה).
  const [tokens, setTokens] = useState<TokenMap>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // עריכת ברכה קיימת ("שלי") — נוסח חדש נשמר דרך editBlessing.
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    setTokens(loadTokens(slug));
  }, [slug]);

  function persistTokens(next: TokenMap) {
    setTokens(next);
    try {
      localStorage.setItem(tokensKey(slug), JSON.stringify(next));
    } catch {
      /* localStorage לא זמין (מצב פרטי) — המחיקה פשוט לא תהיה זמינה */
    }
  }

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      renderedAt.current = Date.now();
      setOpen(false);
      // שומרים את טוקן-המחיקה של הברכה החדשה כדי שכפתור המחיקה יופיע עבורה.
      if (state.created) {
        persistTokens({
          ...loadTokens(slug),
          [state.created.id]: state.created.deleteToken,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  function handleDelete(id: string) {
    const token = tokens[id];
    if (!token) return;
    if (!window.confirm("למחוק את הברכה שלך?")) return;

    setDeletingId(id);
    startTransition(async () => {
      const res = await deleteBlessing(slug, token);
      if (res.ok || res.error === "הברכה כבר אינה קיימת.") {
        const next = { ...tokens };
        delete next[id];
        persistTokens(next);
      }
      setDeletingId(null);
    });
  }

  function startEdit(id: string, message: string) {
    setEditingId(id);
    setEditText(message);
    setEditError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditText("");
    setEditError(null);
  }

  function saveEdit(id: string) {
    const token = tokens[id];
    if (!token) return;
    const msg = editText.trim();
    if (!msg) {
      setEditError("יש להזין איחול");
      return;
    }

    setSavingId(id);
    startTransition(async () => {
      const res = await editBlessing(slug, token, msg);
      if (res.ok) {
        setEditingId(null);
        setEditText("");
        setEditError(null);
      } else {
        setEditError(res.error ?? "העריכה נכשלה");
      }
      setSavingId(null);
    });
  }

  return (
    <section className="mt-16">
      <Divider className="mb-8" />

      <div className="mb-6 flex items-center justify-between">
        <h2 className="accent-text font-display text-2xl font-bold">קיר ברכות</h2>
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

      {blessings.length === 0 ? (
        <p className="flex items-center justify-center gap-1.5 text-center text-[var(--muted)]">
          עדיין אין ברכות — היו הראשונים לאחל!
          <Heart className="h-4 w-4 text-[var(--accent)]" />
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
              <span className="font-display flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-bold text-[var(--on-accent)]">
                {initials(b.author_name)}
              </span>
              <div className="min-w-0 flex-1">
                {editingId === b.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      maxLength={280}
                      rows={3}
                      className={fieldClass}
                      aria-label="עריכת הברכה שלי"
                    />
                    {editError && (
                      <p className="text-sm text-red-600">{editError}</p>
                    )}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => saveEdit(b.id)}
                        disabled={savingId === b.id}
                        className="inline-flex items-center gap-1 rounded-lg bg-[var(--accent)] px-3 py-1.5 text-sm font-semibold text-[var(--on-accent)] transition hover:opacity-90 disabled:opacity-50"
                      >
                        {savingId === b.id ? (
                          "שומר…"
                        ) : (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            שמירה
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="rounded-lg px-3 py-1.5 text-sm text-[var(--muted)] transition hover:text-[var(--text)]"
                      >
                        ביטול
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="mb-1 whitespace-pre-wrap text-[var(--text)]">
                      {b.message}
                    </p>
                    <p className="text-sm font-semibold text-[var(--text)]">
                      — {b.author_name}
                    </p>
                  </>
                )}
              </div>
              {tokens[b.id] && editingId !== b.id && (
                <div className="flex shrink-0 flex-col gap-1 self-start">
                  <button
                    type="button"
                    onClick={() => startEdit(b.id, b.message)}
                    aria-label="עריכת הברכה שלי"
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-[var(--muted)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    עריכה
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(b.id)}
                    disabled={isPending && deletingId === b.id}
                    aria-label="מחיקת הברכה שלי"
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-[var(--muted)] transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  >
                    {isPending && deletingId === b.id ? (
                      "מוחק…"
                    ) : (
                      <>
                        <Trash className="h-3.5 w-3.5" />
                        מחיקה
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.li>
          ))}
        </ul>
      )}
    </section>
  );
}
