"use client";

import Link from "next/link";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main data-theme="classic" className="bg-animated flex min-h-screen items-center justify-center px-6">
      <div className="text-center">
        <h1 className="font-display mb-4 text-3xl font-bold">משהו השתבש</h1>
        <p className="mb-8 text-[var(--muted)]">אירעה שגיאה. נסו שוב.</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-full bg-[var(--accent)] px-6 py-3 font-semibold text-white"
          >
            ניסיון נוסף
          </button>
          <Link
            href="/"
            className="rounded-full border border-black/15 px-6 py-3 font-medium"
          >
            לדף הבית
          </Link>
        </div>
      </div>
    </main>
  );
}
