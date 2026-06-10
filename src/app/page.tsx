"use client";

import { useState, useEffect } from "react";
import { links, projects, about } from "@/content";
import FastlyConversionDiagram from "@/components/FastlyConversionDiagram";

function BeforeAfterCard({ video, beforeImage, afterImage }: { video?: string; beforeImage: string; afterImage?: string }) {
  const [showAfter, setShowAfter] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowAfter((prev) => !prev);
    }, showAfter ? 6000 : 3000);
    return () => clearInterval(interval);
  }, [showAfter]);

  return (
    <div className="relative w-full h-full">
      {/* Before/After label */}
      <div
        className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase"
        style={{
          backgroundColor: "rgba(0,0,0,0.55)",
          color: "white",
        }}
      >
        {showAfter ? "After" : "Before"}
      </div>

      {/* Before image */}
      <img
        src={`/${beforeImage}`}
        alt="Before"
        className="absolute inset-0 w-full h-full object-cover rounded-md transition-opacity duration-1000"
        style={{ opacity: showAfter ? 0 : 1 }}
      />

      {/* After: image or video */}
      {afterImage ? (
        <img
          src={`/${afterImage}`}
          alt="After"
          className="absolute inset-0 w-full h-full object-cover rounded-md transition-opacity duration-1000"
          style={{ opacity: showAfter ? 1 : 0 }}
        />
      ) : video ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover rounded-md transition-opacity duration-1000"
          style={{ opacity: showAfter ? 1 : 0 }}
        >
          <source src={`/${video}`} type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}

type SlideStyle = {
  objectFit: "cover" | "contain";
  objectPosition?: string;
  transform?: string;
  padding?: number;
};

const slideStyles: Record<string, SlideStyle> = {
  "merch-bpopen-poster.png": { objectFit: "cover", objectPosition: "top", transform: "scale(1.3)" },
  "merch-harding.png": { objectFit: "cover", objectPosition: "50% 30%", transform: "scale(0.7)" },
  "merch-bropen-logo.png": { objectFit: "cover", objectPosition: "center", transform: "scale(1.2)" },
  "merch-cubes.png": { objectFit: "cover", objectPosition: "center", transform: "scale(1.2)" },
  "Creeper_Minecraft.png": { objectFit: "cover", objectPosition: "50% 55%", transform: "scale(0.8)" },
};

function SlideshowCard({ images }: { images: string[] }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative w-full h-full" style={{ overflow: "hidden", borderRadius: 6, border: "1px solid #e5e5e5" }}>
      {images.map((src, i) => {
        const s = slideStyles[src] || { objectFit: "cover" as const, transform: "scale(1.2)" };
        return (
          <img
            key={src}
            src={`/${src}`}
            alt=""
            className="absolute inset-0 w-full h-full transition-opacity duration-700"
            style={{
              opacity: i === idx ? 1 : 0,
              objectFit: s.objectFit,
              objectPosition: s.objectPosition || "center",
              transform: s.transform || "none",
            }}
          />
        );
      })}
    </div>
  );
}

export default function Home() {
  return (
    <main className="animate-gutter flex flex-col items-center px-8 pt-16 pb-12 md:px-32 md:pt-24 lg:px-48">
      {/* ─── NAME ─── */}
      <h1 className="font-display" style={{ fontSize: "clamp(36px,8vw,80px)", lineHeight: 0.95, letterSpacing: "-0.02em", textAlign: "center" }}>
        <span className="block">Sanchita</span>
      </h1>

      {/* ─── BIO ─── */}
      <p className="font-serif" style={{ marginTop: 48, maxWidth: 480, textAlign: "center", fontSize: "clamp(14px,1.8vw,18px)", lineHeight: 1.7, color: "rgba(0,0,0,0.8)" }}>
        {about.statement}
      </p>

      {/* ─── LINKS ─── */}
      <div style={{ marginTop: 32, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px 40px" }}>
        <a
          href={`mailto:${links.email}`}
          className="font-mono text-[13px] text-black/50 hover:text-black transition-colors underline underline-offset-4 decoration-black/20 hover:decoration-black/50"
        >
          Email ↗
        </a>
        <a
          href={links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[13px] text-black/50 hover:text-black transition-colors underline underline-offset-4 decoration-black/20 hover:decoration-black/50"
        >
          LinkedIn ↗
        </a>
        <a
          href="/resume"
          className="font-mono text-[13px] text-black/50 hover:text-black transition-colors underline underline-offset-4 decoration-black/20 hover:decoration-black/50"
        >
          Resume →
        </a>
      </div>

      {/* ─── WORK ─── */}
      <section className="mt-16 md:mt-24 w-full" style={{ maxWidth: 896 }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <div key={i} className={`aspect-[4/3] bg-white rounded-md flex items-center justify-center overflow-hidden ${p.slideshow ? '' : 'border border-neutral-200'}`}>
              {p.diagram === "fastly-conversion" ? (
                <FastlyConversionDiagram compact />
              ) : p.slideshow ? (
                <SlideshowCard images={p.slideshow} />
              ) : p.image ? (
                <div className="relative w-full h-full">
                  <img
                    src={`/${p.image}`}
                    alt={p.title}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <span
                    className="absolute top-3 left-0 right-0 text-center text-white font-bold text-[18px] drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]"
                    style={{ fontFamily: "var(--font-bebas), sans-serif", letterSpacing: "0.04em" }}
                  >
                    {p.title}
                  </span>
                  <span
                    className="absolute top-9 left-0 right-0 text-center text-white/80 font-mono text-[9px] drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
                  >
                    Summer intern career path workshop
                  </span>
                </div>
              ) : p.beforeImage && (p.video || p.afterImage) ? (
                <BeforeAfterCard video={p.video} beforeImage={p.beforeImage} afterImage={p.afterImage} />
              ) : p.video ? (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover rounded-md"
                >
                  <source src={`/${p.video}`} type="video/mp4" />
                </video>
              ) : (
                <span className="font-mono text-[9px] text-black/30 tracking-wide leading-snug px-4">
                  {p.placeholder || 'Image'}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="w-full" style={{ marginTop: 64, paddingTop: 32, paddingBottom: 48, borderTop: "1px solid rgba(0,0,0,0.1)", maxWidth: 896, textAlign: "center" }}>
        <p className="font-mono text-[11px] text-black/30">
          Sanchita Chamberlain · {new Date().getFullYear()}
        </p>
      </footer>
    </main>
  );
}
