"use client";

export default function ResumePDFActions() {
  return (
    <button
      onClick={() => window.print()}
      className="font-mono"
      style={{ fontSize: 12, color: "var(--fg-faint)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
    >
      Save as PDF ↓
    </button>
  );
}
