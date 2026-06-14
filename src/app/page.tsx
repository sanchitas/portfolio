"use client";

import { useRef, useEffect, useState } from "react";
import { links, projects, about, type Project } from "@/content";
import FastlyConversionDiagram from "@/components/FastlyConversionDiagram";

// ── Before/After card ──
function BeforeAfterCard({ video, beforeImage, afterImage }: { video?: string; beforeImage: string; afterImage?: string }) {
  return (
    <div className="relative w-full h-full">
      <div
        className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded font-mono font-bold tracking-wider uppercase"
        style={{ fontSize: 9, backgroundColor: "rgba(0,0,0,0.55)", color: "white" }}
      >
        Before
      </div>
      <img
        src={`/${beforeImage}`}
        alt="Before"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {afterImage ? (
        <img src={`/${afterImage}`} alt="After" className="hidden" />
      ) : video ? (
        <video autoPlay muted loop playsInline className="hidden">
          <source src={`/${video}`} type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}

// ── Media surface ──
function ProjectMedia({ p }: { p: Project }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isBrand = p.tags.includes("Brand");

  return (
    <div
      className="w-full rounded-md overflow-hidden"
      style={{
        aspectRatio: "16 / 9",
        backgroundColor: isBrand ? "var(--surface-brand)" : "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      {p.diagram === "fastly-conversion" ? (
        <FastlyConversionDiagram compact />
      ) : p.beforeImage && (p.video || p.afterImage) ? (
        <BeforeAfterCard video={p.video} beforeImage={p.beforeImage} afterImage={p.afterImage} />
      ) : p.video ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={`/${p.video}`} type="video/mp4" />
        </video>
      ) : p.image ? (
        <img
          src={`/${p.image}`}
          alt={p.title}
          className="w-full h-full"
          style={{ objectFit: isBrand ? "contain" : "cover" }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="font-mono" style={{ fontSize: 9, color: "var(--fg-faint)", letterSpacing: "0.08em" }}>
            {p.placeholder}
          </span>
        </div>
      )}
    </div>
  );
}

// ── Single project row ──
function ProjectRow({ p }: { p: Project }) {
  return (
    <div style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>
      <div style={{ flex: "0 0 56%", minWidth: 0 }}>
        <ProjectMedia p={p} />
      </div>
      <div style={{ flex: 1, minWidth: 0, paddingTop: 4 }}>
        <span
          className="font-mono block"
          style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--fg-faint)", marginBottom: 8 }}
        >
          {p.company}
        </span>
        <h3
          className="font-display"
          style={{ fontSize: "clamp(18px, 2vw, 24px)", letterSpacing: "0.03em", lineHeight: 1.05, textTransform: "uppercase", color: "var(--fg)", marginBottom: 12 }}
        >
          {p.title}
        </h3>
        <p
          className="font-mono"
          style={{ fontSize: 12, lineHeight: 1.75, color: "var(--fg-muted)" }}
        >
          {p.description}
        </p>
        {p.link && (
          <a
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono"
            style={{ display: "inline-block", marginTop: 10, fontSize: 10, color: "var(--fg-faint)", textDecoration: "underline" }}
          >
            Docs ↗
          </a>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const isDark = stored === "dark";
    setDark(isDark);
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    const t = next ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("theme", t);
  }

  return (
    <main
      className="animate-gutter flex flex-col items-center pb-16 px-8 md:px-24 lg:px-40"
      style={{ paddingTop: "clamp(64px, 10vh, 112px)" }}
    >
      {/* ─── BIO + LINKS ─── */}
      <div style={{ width: "100%", maxWidth: 860 }}>
        {/* Theme toggle */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
          <button
            onClick={toggleTheme}
            className="font-mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--fg-faint)",
              background: "none",
              border: "1px solid var(--border-mid)",
              borderRadius: 2,
              padding: "4px 12px",
              cursor: "pointer",
            }}
          >
            {dark ? "Light" : "Dark"}
          </button>
        </div>

        <p
          className="font-serif"
          style={{ fontSize: "clamp(14px, 1.6vw, 17px)", lineHeight: 1.75, color: "var(--fg-muted)" }}
        >
          {about.statement}
        </p>

        <div style={{ marginTop: 28, display: "flex", flexWrap: "wrap", gap: "6px 36px" }}>
          <a
            href={`mailto:${links.email}`}
            className="font-mono"
            style={{ fontSize: 12, color: "var(--fg-faint)", textDecoration: "underline" }}
          >
            Email ↗
          </a>
          <a
            href={links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono"
            style={{ fontSize: 12, color: "var(--fg-faint)", textDecoration: "underline" }}
          >
            LinkedIn ↗
          </a>
          <a
            href="/resume"
            className="font-mono"
            style={{ fontSize: 12, color: "var(--fg-faint)", textDecoration: "underline" }}
          >
            Resume →
          </a>
        </div>
      </div>

      {/* ─── WORK ─── */}
      <section
        className="w-full"
        style={{ marginTop: "clamp(56px, 8vh, 96px)", maxWidth: 860 }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 64 }}>
          {projects.map((p, i) => (
            <ProjectRow key={i} p={p} />
          ))}
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer
        className="w-full"
        style={{
          marginTop: 64,
          paddingTop: 28,
          paddingBottom: 48,
          borderTop: "1px solid var(--border-mid)",
          maxWidth: 860,
        }}
      >
        <p className="font-mono" style={{ fontSize: 11, color: "var(--fg-faint)" }}>
          Sanchita Chamberlain · {new Date().getFullYear()}
        </p>
      </footer>
    </main>
  );
}
