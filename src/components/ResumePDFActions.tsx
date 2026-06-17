"use client";

import { useRef, useState } from "react";

export default function ResumePDFActions() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setStatus(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/resume", { method: "POST", body: form });
      if (res.ok) {
        setStatus("Uploaded.");
      } else {
        const { error } = await res.json();
        setStatus(error ?? "Upload failed.");
      }
    } catch {
      setStatus("Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <a
        href="/api/resume"
        download
        className="font-mono"
        style={{ fontSize: 12, color: "#aaa" }}
      >
        Download PDF ↓
      </a>
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="font-mono"
        style={{ fontSize: 12, color: "#ccc", background: "none", border: "none", cursor: "pointer", padding: 0 }}
      >
        {uploading ? "Uploading…" : "Replace PDF ↑"}
      </button>
      {status && (
        <span className="font-mono" style={{ fontSize: 11, color: "#aaa" }}>{status}</span>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        style={{ display: "none" }}
        onChange={handleUpload}
      />
    </div>
  );
}
