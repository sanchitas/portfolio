"use client";

import { useState, useEffect } from "react";
import { links, projects } from "@/content";
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

function SlideshowCard({ images }: { images: string[] }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative w-full h-full bg-white">
      {images.map((src, i) => (
        <img
          key={src}
          src={`/${src}`}
          alt=""
          className="absolute inset-0 w-full h-full object-cover rounded-md transition-opacity duration-700"
          style={{ opacity: i === idx ? 1 : 0 }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-24 md:py-32">
      {/* ─── NAME ─── */}
      <h1 className="font-display text-[clamp(48px,10vw,80px)] leading-[0.95] tracking-tight text-center">
        <span className="block">Sanchita</span>
        <span className="block">Chamberlain</span>
      </h1>

      {/* ─── BIO ─── */}
      <p className="mt-10 max-w-[520px] text-center font-serif text-[clamp(16px,2vw,20px)] leading-relaxed text-black/80">
        I&apos;m a product designer (& sometimes engineer) based in the Bay Area.
        Currently, I&apos;m leading design on the Terraform Registry at{" "}
        <span className="tracking-[0.12em] font-mono text-[0.85em]">IBM (HashiCorp)</span>.
        Before that, I was a product designer at{" "}
        <span className="tracking-[0.12em] font-mono text-[0.85em]">Fastly</span>,
        where I doubled sign-up conversion and redesigned RBAC from the ground up.
        I studied Industrial &amp; Systems Engineering at Rutgers.
      </p>

      {/* ─── LINKS ─── */}
      <div className="mt-14 flex flex-wrap justify-center gap-x-8 gap-y-2">
        <a
          href={`mailto:${links.email}`}
          className="font-mono text-[13px] text-black/50 hover:text-black transition-colors underline underline-offset-4 decoration-black/20 hover:decoration-black/50"
        >
          Email
        </a>
        <a
          href={links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[13px] text-black/50 hover:text-black transition-colors underline underline-offset-4 decoration-black/20 hover:decoration-black/50"
        >
          LinkedIn
        </a>
        <a
          href={links.resume}
          className="font-mono text-[13px] text-black/50 hover:text-black transition-colors underline underline-offset-4 decoration-black/20 hover:decoration-black/50"
        >
          Resume
        </a>
      </div>

      {/* ─── WORK ─── */}
      <section className="mt-32 w-full max-w-[720px]">
        <div className="grid grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <div key={i} className="aspect-[4/3] bg-white border border-neutral-200 rounded-md flex items-center justify-center overflow-hidden">
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
      <footer className="mt-28 pt-8 border-t border-black/10 w-full max-w-[720px] text-center">
        <p className="font-mono text-[11px] text-black/30">
          Sanchita Chamberlain · {new Date().getFullYear()}
        </p>
      </footer>
    </main>
  );
}
