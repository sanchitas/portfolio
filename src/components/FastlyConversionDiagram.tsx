"use client";

import { useState, useEffect } from "react";

export default function FastlyConversionDiagram({
  compact = false,
}: {
  compact?: boolean;
}) {
  // 0=before form, 1=dramatic 2× on black, 2=after screenshot
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const delays = [3500, 2500, 3500];
    const timer = setTimeout(() => {
      setSlide((prev) => (prev >= 2 ? 0 : prev + 1));
    }, delays[slide]);
    return () => clearTimeout(timer);
  }, [slide]);

  const slides = (
    <div
      className="relative w-full h-full select-none overflow-hidden"
      style={{ fontFamily: "var(--font-dm-mono), monospace" }}
    >
      {/* ── Slide 0: Old signup form (real screenshot) ── */}
      <div
        className="absolute inset-0 flex flex-col transition-opacity duration-700"
        style={{
          opacity: slide === 0 ? 1 : 0,
          pointerEvents: slide === 0 ? "auto" : "none",
        }}
      >
        <img
          src="/fastly-signup-before.png"
          alt="Old signup form"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 flex justify-center pb-3 pointer-events-none">
          <span className="before-after-label before-after-label--bottom-center">
            Before
          </span>
        </div>
      </div>

      {/* ── Slide 1: Dramatic 2× on black ── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-700"
        style={{
          opacity: slide === 1 ? 1 : 0,
          pointerEvents: slide === 1 ? "auto" : "none",
          backgroundColor: "#0a0a0a",
        }}
      >
        <span
          className="text-[80px] font-bold leading-none tracking-tight"
          style={{
            fontFamily: "var(--font-bebas), sans-serif",
            color: "#22c55e",
          }}
        >
          2×
        </span>
        <span
          className="text-[18px] font-bold tracking-[0.25em] mt-2 uppercase"
          style={{
            fontFamily: "var(--font-bebas), sans-serif",
            color: "white",
          }}
        >
          Sign-up Conversion
        </span>
        <span className="text-[10px] text-white/30 mt-3 tracking-wider">
          13.6% → 26.5% YoY
        </span>
      </div>

      {/* ── Slide 2: Real after screenshot ── */}
      <div
        className="absolute inset-0 flex flex-col transition-opacity duration-700"
        style={{
          opacity: slide === 2 ? 1 : 0,
          pointerEvents: slide === 2 ? "auto" : "none",
        }}
      >
        <img
          src="/fastly-signup-after.png"
          alt="Redesigned signup form"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 flex justify-center pb-3 pointer-events-none">
          <span className="before-after-label before-after-label--bottom-center">
            After
          </span>
        </div>
      </div>
    </div>
  );

  if (compact) {
    return (
      <div className="relative w-full h-full overflow-hidden rounded-md">
        {slides}
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[560px] mx-auto select-none">
      <h2
        className="text-[clamp(24px,4vw,36px)] tracking-tight mb-4"
        style={{
          fontFamily: "var(--font-bebas), sans-serif",
          letterSpacing: "0.02em",
        }}
      >
        Conversion Optimization
      </h2>
      <p className="text-[12px] text-black/40 mb-6">
        Sign-up funnel redesign — 13.6% → 26.5% conversion, 2× YoY
      </p>
      <div className="aspect-[4/3]">{slides}</div>
    </div>
  );
}
