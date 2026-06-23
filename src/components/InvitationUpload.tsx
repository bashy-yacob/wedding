"use client";

import { useRef, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import {
  INVITATION_BUCKET,
  MAX_INVITATION_BYTES,
  ACCEPTED_INVITATION_TYPES,
  invitationFileName,
} from "@/lib/storage";
import { Check } from "@/components/Ornaments";

interface InvitationUploadProps {
  // מדווח על הנתיב שנשמר ב-Storage (או null) ועל כתובת תצוגה מקדימה מקומית.
  onChange: (path: string | null, previewUrl: string | null) => void;
  previewUrl: string | null;
}

export function InvitationUpload({ onChange, previewUrl }: InvitationUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setError("");

    if (!ACCEPTED_INVITATION_TYPES.includes(file.type as never)) {
      setStatus("error");
      setError("יש להעלות תמונה מסוג JPG או PNG בלבד.");
      return;
    }
    if (file.size > MAX_INVITATION_BYTES) {
      setStatus("error");
      setError("הקובץ גדול מדי — עד 5MB.");
      return;
    }

    setStatus("uploading");
    try {
      const supabase = createBrowserClient();
      const fileName = invitationFileName(file.type);
      const { error: upErr } = await supabase.storage
        .from(INVITATION_BUCKET)
        .upload(fileName, file, { contentType: file.type, upsert: false });

      if (upErr) {
        setStatus("error");
        setError("ההעלאה נכשלה. נסו שוב.");
        return;
      }

      const localPreview = URL.createObjectURL(file);
      setStatus("idle");
      onChange(fileName, localPreview);
    } catch {
      setStatus("error");
      setError("ההעלאה נכשלה. נסו שוב.");
    }
  }

  function clear() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (inputRef.current) inputRef.current.value = "";
    setStatus("idle");
    setError("");
    onChange(null, null);
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />

      {previewUrl ? (
        <div className="surface-card flex items-center gap-4 rounded-xl p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="תצוגה מקדימה של ההזמנה"
            className="h-20 w-20 rounded-lg object-cover"
          />
          <div className="flex-1 text-sm">
            <p className="flex items-center gap-1.5 font-medium">
              <Check className="h-4 w-4 text-[var(--accent)]" />
              ההזמנה הועלתה
            </p>
            <button
              type="button"
              onClick={clear}
              className="mt-1 text-[var(--muted)] underline hover:text-[var(--accent)]"
            >
              הסרה / החלפה
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={status === "uploading"}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--accent)]/40 bg-[var(--surface)]/50 px-4 py-5 text-sm text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-50"
        >
          {status === "uploading" ? "מעלה…" : "בחרו תמונה (JPG/PNG, עד 5MB)"}
        </button>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
