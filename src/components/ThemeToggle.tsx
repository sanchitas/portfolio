"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    setDark(stored === "dark");
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    const t = next ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("theme", t);
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="font-mono"
      style={{
        fontSize: 30,
        color: "var(--fg)",
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        lineHeight: 1,
        flexShrink: 0,
      }}
    >
      {dark ? "☀" : "☾"}
    </button>
  );
}
