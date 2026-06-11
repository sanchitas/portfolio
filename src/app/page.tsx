"use client";

import { useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { projects, siteConfig, hero, links } from "@/content";

const CausticCanvas = dynamic(
  () => import("@/components/CausticCanvas"),
  { ssr: false }
);

// Horizontal offsets (vw) — meandering path down the pool
const OFFSETS = [10, 48, 20, 56, 6, 42, 16, 52, 30, 38];

export default function Home() {
  const blocksRef = useRef<(HTMLDivElement | null)[]>([]);
  const videosRef = useRef<(HTMLVideoElement | null)[]>([]);
  const videoWrapsRef = useRef<(HTMLDivElement | null)[]>([]);
  const shimmersRef = useRef<(HTMLDivElement | null)[]>([]);
  const activeRef = useRef(-1);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  /* grass-green overscroll — only on this page */
  useEffect(() => {
    const prev = document.documentElement.style.background;
    document.documentElement.style.background = "#1e3a14";
    return () => { document.documentElement.style.background = prev; };
  }, []);

  /* scroll-driven depth animation + video management */
  useEffect(() => {
    let ticking = false;

    const update = () => {
      const vh = window.innerHeight;
      const center = vh * 0.45;
      let newActive = -1;
      let minDist = Infinity;

      blocksRef.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const mid = rect.top + rect.height / 2;
        const rawDepth = (mid - center) / (vh * 0.6);
        const depth = Math.max(0, Math.min(1, rawDepth));

        // visual transforms
        const scale = 0.45 + 0.55 * (1 - depth);
        const blur = depth * 4;
        el.style.transform = `scale(${scale})`;
        el.style.filter = `blur(${blur}px)`;
        el.style.opacity = String(0.3 + 0.7 * (1 - depth));

        // caustic shimmer fades as block surfaces
        const shimmer = shimmersRef.current[i];
        if (shimmer) shimmer.style.opacity = String(depth * 0.5);

        // closest surfaced block with video
        const dist = Math.abs(mid - center);
        if (depth < 0.2 && dist < minDist && projects[i].video) {
          newActive = i;
          minDist = dist;
        }
      });

      // video management — one at a time
      if (newActive !== activeRef.current) {
        const old = activeRef.current;
        if (old >= 0) {
          const ow = videoWrapsRef.current[old];
          if (ow) ow.style.opacity = "0";
          videosRef.current[old]?.pause();
        }
        if (timerRef.current) clearTimeout(timerRef.current);

        activeRef.current = newActive;

        if (newActive >= 0) {
          timerRef.current = setTimeout(() => {
            const v = videosRef.current[newActive];
            const w = videoWrapsRef.current[newActive];
            if (v) { v.currentTime = 0; v.play().catch(() => {}); }
            if (w) w.style.opacity = "1";
          }, 2000);
        }
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    requestAnimationFrame(update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <>
      <CausticCanvas />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* ─── HEADER ─── */}
        <header style={{
          textAlign: "center",
          paddingTop: "clamp(64px, 14vh, 160px)",
          paddingBottom: "clamp(32px, 6vh, 80px)",
          color: "#fff",
        }}>
          <h1 className="font-display" style={{
            fontSize: "clamp(36px, 7vw, 80px)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            lineHeight: 1,
            fontWeight: 400,
          }}>
            {siteConfig.name}
          </h1>
          <p className="font-mono" style={{
            marginTop: 20,
            fontSize: "clamp(12px, 1.4vw, 16px)",
            opacity: 0.6,
            lineHeight: 1.7,
            whiteSpace: "pre-line",
          }}>
            {hero.tagline}
          </p>
        </header>

        {/* clear water before first block */}
        <div style={{ height: "15vh" }} />

        {/* ─── POOL BLOCKS ─── */}
        {projects.map((p, i) => (
          <section
            key={i}
            className="pool-block-section"
            style={{
              "--block-offset": `${OFFSETS[i % OFFSETS.length]}vw`,
              minHeight: "60vh",
              display: "flex",
              alignItems: "center",
            } as React.CSSProperties}
          >
            <div
              ref={(el) => { blocksRef.current[i] = el; }}
              style={{
                width: "clamp(280px, 50vw, 420px)",
                aspectRatio: "3 / 2",
                backgroundColor: "#c8c0b4",
                borderRadius: 3,
                boxShadow: "0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
                position: "relative",
                overflow: "hidden",
                transformOrigin: "center center",
                willChange: "transform, filter, opacity",
              }}
            >
              {/* title face */}
              <div style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
                zIndex: 2,
              }}>
                <span className="font-mono" style={{
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "rgba(0,0,0,0.35)",
                  marginBottom: 8,
                }}>
                  {p.company} &middot; {p.year}
                </span>
                <span className="font-display" style={{
                  fontSize: "clamp(16px, 2.2vw, 26px)",
                  color: "rgba(0,0,0,0.7)",
                  textAlign: "center",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  lineHeight: 1.2,
                }}>
                  {p.title}
                </span>
              </div>

              {/* video layer — fades in when block surfaces */}
              {p.video && (
                <div
                  ref={(el) => { videoWrapsRef.current[i] = el; }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 3,
                    opacity: 0,
                    transition: "opacity 1.5s ease",
                  }}
                >
                  <video
                    ref={(el) => { videosRef.current[i] = el; }}
                    muted
                    loop
                    playsInline
                    preload="none"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  >
                    <source src={`/${p.video}`} type="video/mp4" />
                  </video>
                </div>
              )}

              {/* caustic shimmer overlay */}
              <div
                ref={(el) => { shimmersRef.current[i] = el; }}
                className="caustic-shimmer"
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 4,
                  pointerEvents: "none",
                  opacity: 0.4,
                }}
              />
            </div>
          </section>
        ))}

        {/* ─── FOOTER ─── */}
        <footer style={{
          textAlign: "center",
          padding: "64px 24px 80px",
          color: "rgba(255,255,255,0.35)",
        }}>
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: 32,
            marginBottom: 24,
          }}>
            <a
              href={`mailto:${links.email}`}
              className="font-mono hover:opacity-80 transition-opacity"
              style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textDecoration: "none" }}
            >
              Email
            </a>
            <a
              href={links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono hover:opacity-80 transition-opacity"
              style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textDecoration: "none" }}
            >
              LinkedIn
            </a>
            <a
              href="/resume"
              className="font-mono hover:opacity-80 transition-opacity"
              style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textDecoration: "none" }}
            >
              Resume
            </a>
          </div>
          <p className="font-mono" style={{ fontSize: 11 }}>
            Sanchita Chamberlain &middot; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </>
  );
}
