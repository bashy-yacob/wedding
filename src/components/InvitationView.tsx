"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Divider } from "./Ornaments";

interface InvitationViewProps {
  url: string;
  displayNames: string;
}

// תצוגת הזמנת החתונה: תמונה ממוזערת מעוצבת, ולחיצה פותחת אותה בגדול (lightbox).
export function InvitationView({ url, displayNames }: InvitationViewProps) {
  const [open, setOpen] = useState(false);

  // נעילת גלילת הרקע כשה-lightbox פתוח + סגירה ב-Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <section className="mt-12 text-center">
      <Divider className="mb-6" />
      <h2 className="font-display mb-4 text-2xl font-bold">ההזמנה</h2>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="surface-card group mx-auto block max-w-sm overflow-hidden rounded-2xl p-2 transition hover:-translate-y-0.5"
        aria-label="הגדלת ההזמנה"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={`הזמנת החתונה של ${displayNames}`}
          loading="lazy"
          className="w-full rounded-xl object-contain transition group-hover:opacity-95"
        />
        <span className="mt-2 block text-xs text-[var(--muted)]">
          לחצו להגדלה
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
          >
            <motion.img
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              src={url}
              alt={`הזמנת החתונה של ${displayNames}`}
              className="max-h-[90vh] max-w-full rounded-xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="סגירה"
              className="absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-2xl text-white transition hover:bg-white/25"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
