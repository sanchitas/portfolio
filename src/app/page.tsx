"use client";

import { useRef, useEffect, useLayoutEffect, useState } from "react";
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
        <img src={`/${beforeImage}`} alt="Before" className="before-after-media" loading="lazy" />
      </div>

      <div className={`before-after-layer before-after-layer--after ${showAfter ? "before-after-layer--visible" : ""}`}>
        {afterImage ? (
          <img src={`/${afterImage}`} alt="After" className="before-after-media" loading="lazy" />
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
  const containerRef = useRef<HTMLDivElement>(null);
  const isBrand = p.tags.includes("Brand");

  // Play when visible, pause when out of frame — no looping off-screen
  useEffect(() => {
    const vid = videoRef.current;
    const el = containerRef.current;
    if (!vid || !el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) vid.play().catch(() => {});
        else vid.pause();
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full rounded-md overflow-hidden"
      style={{
        aspectRatio: "4 / 3",
        backgroundColor: isBrand ? "#fff" : "var(--surface)",
        border: "1px solid var(--border)",
        position: "relative",
      }}
    >
      <div style={{ width: "100%", height: "100%" }}>
        {p.diagram === "fastly-conversion" ? (
          <FastlyConversionDiagram compact />
        ) : p.beforeImage && (p.video || p.afterImage) ? (
          <BeforeAfterCard video={p.video} beforeImage={p.beforeImage} afterImage={p.afterImage} />
        ) : p.video ? (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            className="h-full object-cover"
            style={{ width: "100%" }}
          >
            <source src={`/${p.video}`} type="video/mp4" />
          </video>
        ) : p.image ? (
          <img
            src={`/${p.image}`}
            alt={p.title}
            className="w-full h-full"
            loading="lazy"
            style={{ objectFit: isBrand ? "contain" : "cover" }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "#CCFF00" }}>
            <span className="font-mono" style={{ fontSize: 9, color: "#000", letterSpacing: "0.08em" }}>
              {p.placeholder}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Single project row ──
function ProjectRow({ p, index }: { p: Project; index: number }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const appear = {
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(20px)",
    willChange: "transform, opacity" as const,
  };

  return (
    <div ref={rowRef} className="project-row">
      <div
        className="project-row__media"
        style={{ ...appear, transition: "opacity 0.7s ease, transform 0.85s cubic-bezier(0.22, 1, 0.36, 1)" }}
      >
        <ProjectMedia p={p} />
      </div>
      <div
        className="project-row__content"
        style={{ ...appear, transition: "transform 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.1s, opacity 0.7s ease 0.1s" }}
      >
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
            {p.linkLabel ?? "Live"} ↗
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

function HeroName() {
  const containerRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const fit = () => {
      const container = containerRef.current;
      const h1 = h1Ref.current;
      if (!container || !h1) return;
      const available = container.getBoundingClientRect().width;
      let lo = 10, hi = 130;
      h1.style.fontSize = `${hi}px`;
      while (hi - lo > 0.5) {
        const mid = (lo + hi) / 2;
        h1.style.fontSize = `${mid}px`;
        const w = h1.scrollWidth;
        if (w > available) hi = mid; else lo = mid;
      }
      h1.style.fontSize = `${lo}px`;
    };

    fit();
    document.fonts.ready.then(fit);
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: "min(900px, 100%)",
      }}
    >
      <h1
        ref={h1Ref}
        style={{
          fontFamily: "'Enquix', var(--font-bebas), sans-serif",
          fontSize: "clamp(32px, 11vw, 130px)",
          letterSpacing: "-0.01em",
          lineHeight: 0.88,
          color: "var(--fg)",
          margin: 0,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        Sanchita
        <br />
        Chamberlain
      </h1>
    </div>
  );
}

export default function Home() {
  const [dark, setDark] = useState(false);
  const [lastVisitorLabel, setLastVisitorLabel] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const isDark = stored === "dark";
    setDark(isDark);
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    fetch("/api/visitor", { method: "POST" })
      .then((res) => res.json())
      .then(({ previous }) => {
        if (!previous) return;
        const parts = [previous.city, previous.region, previous.country].filter(Boolean);
        setLastVisitorLabel(`Last visitor: ${parts.join(", ")} · ${previous.timestamp}`);
      })
      .catch(() => {});
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
      className="flex-1 flex flex-col items-center pb-16 px-8 md:px-24 lg:px-40 font-mono"
      style={{ paddingTop: "clamp(32px, 5vh, 56px)", backgroundColor: "var(--bg)" }}
    >
      {/* ── Nav row: last visitor left, theme toggle right ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "min(900px, 100%)",
          display: "flex",
          alignItems: "center",
          marginBottom: "clamp(20px, 3vh, 32px)",
        }}
      >
        {/* Always occupies left space so toggle stays pinned right */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            opacity: lastVisitorLabel ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                flexShrink: 0,
                width: 6,
                height: 6,
                borderRadius: 999,
                backgroundColor: "#CCFF00",
                animation: "visitor-blink 1.2s infinite ease-in-out",
              }}
            />
            <p
              className="font-mono"
              style={{ fontSize: 10, color: "var(--fg-muted)", margin: 0, lineHeight: 1.5 }}
            >
              {lastVisitorLabel ?? ""}
            </p>
          </div>
        </div>
        <button
          onClick={toggleTheme}
          className="font-mono"
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
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
      </div>

      {/* ── Hero name ── */}
      <HeroName />

      {/* ── Intro ── */}
      <div style={{ width: "100%", maxWidth: "min(900px, 100%)", marginTop: "clamp(20px, 3vh, 32px)" }}>
        <p
          className="font-mono"
          style={{ fontSize: "clamp(14px, 1.6vw, 17px)", lineHeight: 1.75, color: "var(--fg-muted)" }}
        >
          {renderIntro(about.statement)}
        </p>
      </div>

      {/* ── Links ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "min(900px, 100%)",
          display: "flex",
          gap: 36,
          marginTop: "clamp(20px, 3vh, 28px)",
          marginBottom: "clamp(24px, 3vh, 32px)",
        }}
      >
        <a
          href={`mailto:${links.email}`}
          className="font-mono"
          style={{ fontSize: 14, fontWeight: 700, color: "var(--fg-muted)", textDecoration: "underline" }}
        >
          Email ↗
        </a>
        <a
          href={links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono"
          style={{ fontSize: 14, fontWeight: 700, color: "var(--fg-muted)", textDecoration: "underline" }}
        >
          LinkedIn ↗
        </a>
        <a
          href="/resume"
          className="font-mono"
          style={{ fontSize: 14, fontWeight: 700, color: "var(--fg-muted)", textDecoration: "underline" }}
        >
          Resume →
        </a>
      </div>

      {/* ─── WORK ─── */}
      <section
        className="w-full"
        style={{ marginTop: "clamp(16px, 2vh, 24px)", maxWidth: "min(900px, 100%)" }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 64 }}>
          {projects.map((p, i) => (
            <ProjectRow key={i} p={p} index={i} />
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
