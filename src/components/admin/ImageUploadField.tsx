"use client";

import { useRef, useState } from "react";

export function ImageUploadField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/media", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-brand-ink/50">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-sm border border-brand-line bg-brand-paper">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-contain" />
          ) : (
            <span className="text-[10px] text-brand-ink/30">None</span>
          )}
        </div>
        <div className="flex-1">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="https://… or upload a file"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full rounded-sm border border-brand-line bg-brand-surface px-3 py-2 text-sm outline-none focus:border-brand-primary"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="whitespace-nowrap rounded-sm border border-brand-line px-3 py-2 text-sm hover:border-brand-primary disabled:opacity-50"
            >
              {uploading ? "Uploading…" : "Upload"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="whitespace-nowrap rounded-sm border border-brand-line px-2 py-2 text-sm text-brand-ink/50 hover:border-brand-danger hover:text-brand-danger"
                aria-label={`Remove ${label}`}
              >
                ×
              </button>
            )}
          </div>
          {hint && <p className="mt-1 text-xs text-brand-ink/50">{hint}</p>}
          {error && <p className="mt-1 text-xs text-brand-danger">{error}</p>}
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />
        </div>
      </div>
    </div>
  );
}
