"use client";

import { useRef, useEffect, useState } from "react";
import { links, projects, about, type Project } from "@/content";
import FastlyConversionDiagram from "@/components/FastlyConversionDiagram";

// ── Before/After card ──
function BeforeAfterCard({ video, beforeImage, afterImage }: { video?: string; beforeImage: string; afterImage?: string }) {
  const [showAfter, setShowAfter] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowAfter(true), 1400);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-full before-after-card">
      <div className={`before-after-layer before-after-layer--before ${showAfter ? "" : "before-after-layer--visible"}`}>
        <img src={`/${beforeImage}`} alt="Before" className="before-after-media" />
      </div>

      <div className={`before-after-layer before-after-layer--after ${showAfter ? "before-after-layer--visible" : ""}`}>
        {afterImage ? (
          <img src={`/${afterImage}`} alt="After" className="before-after-media" />
        ) : video ? (
          <video autoPlay muted loop playsInline className="before-after-media">
            <source src={`/${video}`} type="video/mp4" />
          </video>
        ) : null}
      </div>

      <div className="before-after-label before-after-label--top-left">
        {showAfter ? "After" : "Before"}
      </div>
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
    <div className="project-row">
      <div className="project-row__media">
        <ProjectMedia p={p} />
      </div>
      <div className="project-row__content">
        <span
          className="font-mono block"
          style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--fg-faint)", marginBottom: 8, fontWeight: 700 }}
        >
          {p.company}
        </span>
        <h3
          className="font-mono"
          style={{ fontSize: "clamp(18px, 2vw, 24px)", letterSpacing: "0.03em", lineHeight: 1.05, textTransform: "uppercase", color: "var(--fg)", marginBottom: 12, fontWeight: 700 }}
        >
          {p.title}
        </h3>
        <p
          className="font-mono"
          style={{ fontSize: 12, lineHeight: 1.75, color: "var(--fg-muted)" }}
        >
          {renderDescription(p.description)}
        </p>
        {p.link && (
          <a
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono"
            style={{ display: "inline-block", marginTop: 10, fontSize: 10, color: "var(--fg-faint)", textDecoration: "underline" }}
          >
            Live ↗
          </a>
        )}
      </div>
    </div>
  );
}

function renderDescription(text: string) {
  return text.split(/(HDS)/g).map((part, index) =>
    part === "HDS" ? (
      <a
        key={index}
        href="https://helios.hashicorp.design"
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono"
        style={{ color: "var(--fg)", textDecoration: "underline" }}
      >
        HDS
      </a>
    ) : (
      part
    )
  );
}

function renderIntro(text: string) {
  const highlights = [
    "IBM",
    "HashiCorp",
    "Fastly",
    "Zurich Insurance",
    "TSYS",
    "Johnson & Johnson",
  ];

  const regex = new RegExp(`(${highlights.join("|")})`, "g");

  return text.split(regex).map((part, index) =>
    highlights.includes(part) ? (
      <strong key={index} style={{ fontWeight: 700, color: "var(--fg)" }}>
        {part}
      </strong>
    ) : (
      part
    )
  );
}

export default function Home() {
  const [dark, setDark] = useState(false);
  const [lastVisitor, setLastVisitor] = useState("No previous visitor data");
  const [visitorLocation, setVisitorLocation] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const isDark = stored === "dark";
    setDark(isDark);
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch("https://ipapi.co/json/", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Location fetch failed");
        return res.json();
      })
      .then((data) => {
        const parts = [data.city, data.region, data.country_name].filter(Boolean);
        if (parts.length) {
          setVisitorLocation(parts.join(", "));
        }
      })
      .catch(() => {
        setVisitorLocation("Unknown location");
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const previous = localStorage.getItem("lastVisitor");
    if (previous) {
      setLastVisitor(previous);
    }

    const now = new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
    localStorage.setItem("lastVisitor", now);
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
      className="animate-gutter flex flex-col items-center pb-16 px-8 md:px-24 lg:px-40 font-mono"
      style={{ paddingTop: "clamp(64px, 10vh, 112px)" }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "min(900px, 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          paddingBottom: 18,
          borderBottom: "1px solid var(--border-mid)",
          marginBottom: 24,
        }}
      >
        <div style={{ flex: 1, textAlign: "left" }}>
          <p
            className="font-mono"
            style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--fg)", margin: 0, fontWeight: 700 }}
          >
            Sanchita Chamberlain
          </p>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <a
            href={`mailto:${links.email}`}
            className="font-mono"
            style={{ fontSize: 10, color: "var(--fg-faint)", textDecoration: "underline" }}
          >
            Email ↗
          </a>
          <a
            href={links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono"
            style={{ fontSize: 10, color: "var(--fg-faint)", textDecoration: "underline" }}
          >
            LinkedIn ↗
          </a>
          <a
            href="/resume"
            className="font-mono"
            style={{ fontSize: 10, color: "var(--fg-faint)", textDecoration: "underline" }}
          >
            Resume →
          </a>
        </div>

        <div style={{ flex: 1, textAlign: "right" }}>
          <button
            onClick={toggleTheme}
            className="font-mono"
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            style={{
              fontSize: 18,
              letterSpacing: "0.05em",
              color: "var(--fg-faint)",
              background: "none",
              border: "1px solid var(--border-mid)",
              borderRadius: 4,
              padding: "8px 14px",
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            {dark ? "☀" : "☾"}
          </button>
        </div>
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: "min(900px, 100%)",
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: 999,
            backgroundColor: dark ? "#fff" : "#000",
            display: "inline-block",
            animation: "visitor-blink 1.2s infinite ease-in-out",
          }}
        />
        <p
          className="font-mono"
          style={{ fontSize: 11, color: "var(--fg-muted)", margin: 0, lineHeight: 1.5 }}
        >
          Last visitor: {lastVisitor}
          {visitorLocation ? ` · ${visitorLocation}` : ""}
        </p>
      </div>

      <div style={{ width: "100%", maxWidth: "min(900px, 100%)" }}>
        <p
          className="font-mono"
          style={{ fontSize: "clamp(14px, 1.6vw, 17px)", lineHeight: 1.75, color: "var(--fg-muted)" }}
        >
          {renderIntro(about.statement)}
        </p>
      </div>

      {/* ─── WORK ─── */}
      <section
        className="w-full"
        style={{ marginTop: "clamp(56px, 8vh, 96px)", maxWidth: "min(900px, 100%)" }}
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
          maxWidth: "min(900px, 100%)",
        }}
      >
        <p className="font-mono" style={{ fontSize: 11, color: "var(--fg-faint)" }}>
          Sanchita Chamberlain · {new Date().getFullYear()}
        </p>
      </footer>
    </main>
  );
}
