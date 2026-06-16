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
function ProjectMedia({ p, index }: { p: Project; index: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const animRef = useRef<number>(0);
  const [inView, setInView] = useState(false);
  const isBrand = p.tags.includes("Brand");
  const filterId = `water-${index}`;

  function runReveal() {
    const dispEl = dispRef.current;
    if (!dispEl) return;
    cancelAnimationFrame(animRef.current);
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / 1600, 1);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      dispEl.setAttribute("scale", (32 * (1 - eased)).toFixed(2));
      if (t < 1) animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
  }

  function resetDistortion() {
    cancelAnimationFrame(animRef.current);
    const dispEl = dispRef.current;
    if (dispEl) dispEl.setAttribute("scale", "32");
  }

  useEffect(() => {
    const el = containerRef.current;
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
      { threshold: 0.45 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    runReveal();
  }, [inView]); // eslint-disable-line

  return (
    <div
      ref={containerRef}
      className="w-full rounded-md overflow-hidden"
      style={{
        aspectRatio: "16 / 9",
        backgroundColor: isBrand ? "#fff" : "var(--surface)",
        border: "1px solid var(--border)",
        position: "relative",
      }}
      onMouseEnter={() => { if (inView) runReveal(); }}
      onMouseLeave={() => { if (inView) resetDistortion(); }}
    >
      <svg style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency="0.018 0.012" numOctaves="3" seed={index + 3} result="noise" />
            <feDisplacementMap ref={dispRef} in="SourceGraphic" in2="noise" scale="32" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      <div
        style={{
          width: "100%",
          height: "100%",
          filter: `url(#${filterId})`,
          willChange: "filter",
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
            style={{ objectFit: isBrand ? "contain" : "cover" }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "#39FF14" }}>
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
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rowRef} className="project-row">
      <div className="project-row__media">
        <ProjectMedia p={p} index={index} />
      </div>
      <div
        className="project-row__content"
        style={{
          transform: inView ? "translateY(0)" : "translateY(20px)",
          opacity: inView ? 1 : 0,
          transition: "transform 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.1s, opacity 0.7s ease 0.1s",
          willChange: "transform, opacity",
        }}
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

function HeroRippleCanvas({
  containerRef,
  h1Ref,
}: {
  containerRef: React.RefObject<HTMLDivElement>;
  h1Ref: React.RefObject<HTMLHeadingElement>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const h1 = h1Ref.current;
    if (!canvas || !container || !h1) return;

    const ctx = canvas.getContext("2d", { alpha: false, willReadFrequently: true });
    if (!ctx) return;

    const cvs: HTMLCanvasElement = canvas;
    const cnt: HTMLDivElement = container;
    const cx2d: CanvasRenderingContext2D = ctx;
    const h1el: HTMLHeadingElement = h1;

    // DPR-aware resolution: full res on 2x screens, half on 1x — crisp on Retina
    const rect = cnt.getBoundingClientRect();
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const S = DPR * 0.5; // 0.5 on 1x, 1.0 on 2x
    const W = Math.max(4, Math.ceil(rect.width * S));
    const H = Math.max(4, Math.ceil(rect.height * S));
    cvs.width = W;
    cvs.height = H;
    cvs.style.width = rect.width + "px";
    cvs.style.height = rect.height + "px";

    // Offscreen canvas — render text with precise metrics to match h1 CSS
    const off = document.createElement("canvas");
    off.width = W;
    off.height = H;
    const offCtx = off.getContext("2d", { willReadFrequently: true });
    if (!offCtx) return;

    const computed = window.getComputedStyle(h1el);
    const fs = parseFloat(computed.fontSize) * S;

    // Match h1 styles exactly
    offCtx.textBaseline = "alphabetic";
    (offCtx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${-0.01 * fs}px`;
    offCtx.font = `400 ${fs}px ${computed.fontFamily}`;
    offCtx.fillStyle = computed.color;

    // Compute baseline Y to match CSS line-height:0.88 rendering.
    // CSS formula: baseline from line-box top = (ascent + lineBox - descent) / 2
    // This is derived from: baseline = ascent + halfLeading where halfLeading = (L-fontH)/2
    // = ascent + (L - (A+D))/2 = (2A + L - A - D)/2 = (A + L - D)/2
    const m = offCtx.measureText("SANCHITA");
    const A = m.fontBoundingBoxAscent ?? m.actualBoundingBoxAscent;
    const D = m.fontBoundingBoxDescent ?? m.actualBoundingBoxDescent;
    const L = fs * 0.88; // line box height
    const baseline0 = (A + L - D) / 2; // baseline Y of first line (always positive, inside canvas)

    offCtx.fillText("SANCHITA", 0, baseline0);
    offCtx.fillText("CHAMBERLAIN", 0, baseline0 + L);
    const srcData = offCtx.getImageData(0, 0, W, H);

    // Wave simulation grid — 60% of canvas for finer ripples
    const GS = 0.6;
    const GW = Math.max(4, Math.floor(W * GS));
    const GH = Math.max(4, Math.floor(H * GS));
    let cur = new Float32Array(GW * GH);
    let prv = new Float32Array(GW * GH);
    const DAMP = 0.985; // slow decay = long-lasting fluid ripples
    const DISP = 7;
    let raf = 0;

    function loop() {
      for (let y = 1; y < GH - 1; y++) {
        for (let x = 1; x < GW - 1; x++) {
          const i = y * GW + x;
          prv[i] = ((cur[i - 1] + cur[i + 1] + cur[i - GW] + cur[i + GW]) * 0.5 - prv[i]) * DAMP;
        }
      }
      const tmp = cur; cur = prv; prv = tmp;

      // Bilinear pixel displacement — smooth, no jagged edges
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      const bgR = isDark ? 17 : 255, bgG = isDark ? 17 : 255, bgB = isDark ? 17 : 255;
      const dst = cx2d.createImageData(W, H);
      const sd = srcData.data;
      const dd = dst.data;
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const gx = Math.min(GW - 2, Math.max(1, (x * GS) | 0));
          const gy = Math.min(GH - 2, Math.max(1, (y * GS) | 0));
          const gi = gy * GW + gx;
          const wdx = cur[gi + 1] - cur[gi - 1];
          const wdy = cur[gi + GW] - cur[gi - GW];
          // Bilinear sample position
          const sxf = x + wdx * DISP;
          const syf = y + wdy * DISP;
          const sx0 = Math.max(0, Math.min(W - 2, sxf | 0));
          const sy0 = Math.max(0, Math.min(H - 2, syf | 0));
          const fx = sxf - (sxf | 0), fy = syf - (syf | 0);
          const w00 = (1 - fx) * (1 - fy), w10 = fx * (1 - fy);
          const w01 = (1 - fx) * fy,       w11 = fx * fy;
          const i00 = (sy0 * W + sx0) << 2;
          const i10 = (sy0 * W + sx0 + 1) << 2;
          const i01 = ((sy0 + 1) * W + sx0) << 2;
          const i11 = ((sy0 + 1) * W + sx0 + 1) << 2;
          const di = (y * W + x) << 2;
          // Blend alpha channels from source (text is anti-aliased)
          const a = sd[i00+3]*w00 + sd[i10+3]*w10 + sd[i01+3]*w01 + sd[i11+3]*w11;
          const af = a / 255;
          const r = sd[i00]*w00 + sd[i10]*w10 + sd[i01]*w01 + sd[i11]*w11;
          const g = sd[i00+1]*w00 + sd[i10+1]*w10 + sd[i01+1]*w01 + sd[i11+1]*w11;
          const b = sd[i00+2]*w00 + sd[i10+2]*w10 + sd[i01+2]*w01 + sd[i11+2]*w11;
          // Composite text over background (handles AA edges smoothly)
          dd[di]   = (r * af + bgR * (1 - af)) | 0;
          dd[di+1] = (g * af + bgG * (1 - af)) | 0;
          dd[di+2] = (b * af + bgB * (1 - af)) | 0;
          dd[di+3] = 255;
        }
      }
      cx2d.putImageData(dst, 0, 0);
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    function splash(e: MouseEvent) {
      const r2 = cnt.getBoundingClientRect();
      const cx = Math.round(((e.clientX - r2.left) / r2.width) * GW);
      const cy = Math.round(((e.clientY - r2.top) / r2.height) * GH);
      const amt = e.type === "mousedown" ? 2.2 : 1.1;
      const r = 7;
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          const d2 = dx * dx + dy * dy;
          if (d2 <= r * r) {
            const ix = cx + dx, iy = cy + dy;
            if (ix > 0 && ix < GW - 1 && iy > 0 && iy < GH - 1) {
              cur[iy * GW + ix] += amt * (1 - Math.sqrt(d2) / r);
            }
          }
        }
      }
    }

    let tLast = 0;
    function onMove(e: MouseEvent) {
      const now = performance.now();
      if (now - tLast < 16) return;
      tLast = now;
      splash(e);
    }
    cnt.addEventListener("mousemove", onMove);
    cnt.addEventListener("mousedown", splash);

    return () => {
      cancelAnimationFrame(raf);
      cnt.removeEventListener("mousemove", onMove);
      cnt.removeEventListener("mousedown", splash);
    };
  }, [containerRef, h1Ref]); // eslint-disable-line

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", zIndex: 2 }}
      aria-hidden="true"
    />
  );
}

function HeroName() {
  const containerRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const fit = () => {
      const container = containerRef.current;
      const h1 = h1Ref.current;
      if (!container || !h1) return;
      const available = container.getBoundingClientRect().width;
      // "CHAMBERLAIN" is the longer line — binary-search font size to fill container
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

    // Wait for font to load before measuring
    document.fonts.ready.then(fit);
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        maxWidth: "min(900px, 100%)",
        marginBottom: "clamp(16px, 2.5vh, 28px)",
        position: "relative",
        cursor: "default",
      }}
    >
      <h1
        ref={h1Ref}
        style={{
          fontFamily: "'Enquix', var(--font-bebas), sans-serif",
          fontSize: "10px",
          letterSpacing: "-0.01em",
          lineHeight: 0.88,
          color: "var(--fg)",
          margin: 0,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          position: "relative",
          zIndex: 1,
        }}
      >
        Sanchita
        <br />
        Chamberlain
      </h1>
      {hovered && (
        <HeroRippleCanvas
          containerRef={containerRef as React.RefObject<HTMLDivElement>}
          h1Ref={h1Ref as React.RefObject<HTMLHeadingElement>}
        />
      )}
    </div>
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
        const parts = [data.city, data.region_code, data.country_code].filter(Boolean);
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
      className="flex flex-col items-center pb-16 px-8 md:px-24 lg:px-40 font-mono"
      style={{ paddingTop: "clamp(32px, 5vh, 56px)" }}
    >
      {/* ── Nav row: last visitor left, theme toggle right ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "min(900px, 100%)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "clamp(28px, 5vh, 48px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              flexShrink: 0,
              width: 6,
              height: 6,
              borderRadius: 999,
              backgroundColor: "#39FF14",
              animation: "visitor-blink 1.2s infinite ease-in-out",
            }}
          />
          <p
            className="font-mono"
            style={{ fontSize: 10, color: "var(--fg-muted)", margin: 0, lineHeight: 1.5 }}
          >
            {lastVisitor}
            {visitorLocation ? ` · ${visitorLocation}` : ""}
          </p>
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

      {/* ── Links ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "min(900px, 100%)",
          display: "flex",
          gap: 36,
          marginBottom: "clamp(48px, 8vh, 88px)",
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
