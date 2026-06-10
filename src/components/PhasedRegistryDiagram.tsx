"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Palette ─────────────────────────────────────────────────────
const blue = "#3B6EC2";
const blueMuted = "#8AAED6";
const blueLight = "#EDF2FA";
const blueGhost = "#C7D8EF";

const phases = [
  { num: "01", label: "Usage", short: "Who can use what" },
  { num: "02", label: "Visibility", short: "What you can see" },
  { num: "03", label: "Ownership", short: "Who maintains it" },
] as const;

// ─── Component ───────────────────────────────────────────────────
export default function PhasedRegistryDiagram({
  autoPlay = true,
  stepDuration = 2400,
  compact = false,
}: {
  autoPlay?: boolean;
  stepDuration?: number;
  compact?: boolean;
}) {
  // Steps: -1=blank, 0=show monolith, 1=crack/split, 2=show phases+arrows, 3=all lit
  const [step, setStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const totalSteps = 3;

  const advance = useCallback(() => {
    setStep((prev) => (prev >= totalSteps ? -1 : prev + 1));
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const delay =
      step === -1 ? 500 : step === 0 ? 2200 : step === 1 ? 1800 : stepDuration + 1200;
    const timer = setTimeout(advance, delay);
    return () => clearTimeout(timer);
  }, [isPlaying, step, advance, stepDuration]);

  const vis = (minStep: number) => step >= minStep;

  if (compact) {
    return (
      <div className="relative w-full h-full overflow-hidden">
        <div
          className="absolute top-0 left-0 origin-top-left"
          style={{ width: "960px", transform: "scale(0.355)" }}
        >
          <DiagramInner step={step} vis={vis} />
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full max-w-[960px] mx-auto select-none"
      style={{ fontFamily: "var(--font-dm-mono), monospace" }}
    >
      <DiagramInner step={step} vis={vis} />

      {/* Controls */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          onClick={() => { setStep(-1); setIsPlaying(true); }}
          className="text-[10px] font-mono text-black/35 hover:text-black/60 border border-black/10 hover:border-black/25 rounded-full px-3 py-1 transition-colors"
        >
          Replay
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="text-[10px] font-mono text-black/35 hover:text-black/60 border border-black/10 hover:border-black/25 rounded-full px-3 py-1 transition-colors"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <button
              key={i}
              onClick={() => { setStep(i); setIsPlaying(false); }}
              className="w-1.5 h-1.5 rounded-full transition-all duration-300"
              style={{
                backgroundColor: step >= i ? blue : "#ddd",
                transform: step === i ? "scale(1.5)" : "scale(1)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SVG Arrow ───────────────────────────────────────────────────
function Arrow({ visible, delay = 0 }: { visible: boolean; delay?: number }) {
  return (
    <svg
      width="40"
      height="24"
      viewBox="0 0 40 24"
      className="transition-all duration-700 shrink-0"
      style={{
        opacity: visible ? 0.5 : 0,
        transform: visible ? "translateX(0)" : "translateX(-6px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <path
        d="M4 12 L30 12 M24 6 L30 12 L24 18"
        fill="none"
        stroke={blueMuted}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Inner layout ────────────────────────────────────────────────
function DiagramInner({
  step,
  vis,
}: {
  step: number;
  vis: (n: number) => boolean;
}) {
  const cracked = vis(1);
  const phasesVisible = vis(2);

  return (
    <div
      className="w-full select-none"
      style={{ fontFamily: "var(--font-dm-mono), monospace" }}
    >
      {/* Title row */}
      <div
        className="mb-8 transition-all duration-700"
        style={{
          opacity: vis(0) ? 1 : 0,
          transform: vis(0) ? "translateY(0)" : "translateY(16px)",
        }}
      >
        <h2
          className="text-[clamp(24px,4vw,36px)] tracking-tight"
          style={{
            fontFamily: "var(--font-bebas), sans-serif",
            letterSpacing: "0.02em",
          }}
        >
          Reframing Registry Artifact Control
        </h2>
        <p className="text-[12px] text-black/40 mt-0.5">
          Breaking one monolithic proposal into three phased deliverables
        </p>
      </div>

      {/* ─── Vertical flow: Collections → arrow → 3 phases ─── */}
      <div
        className="flex flex-col items-center transition-all duration-700"
        style={{ opacity: vis(0) ? 1 : 0 }}
      >
        {/* Collections — big block on top */}
        <div
          className="w-full rounded-xl border-2 relative transition-all duration-1000 ease-in-out overflow-hidden"
          style={{
            minHeight: cracked ? "56px" : "180px",
            borderColor: cracked ? "#ddd" : blueMuted,
            backgroundColor: cracked ? "#fafafa" : blueLight,
            opacity: cracked ? 0.35 : 1,
          }}
        >
          <div className="flex flex-col items-center justify-center h-full p-5">
            <span
              className="leading-none transition-all duration-700 mb-3"
              style={{
                fontFamily: "var(--font-bebas), sans-serif",
                color: cracked ? "#bbb" : blue,
                fontSize: cracked ? "15px" : "28px",
              }}
            >
              Registry Collections
            </span>
            {!cracked && (
              <div className="flex flex-wrap justify-center gap-2 mt-1">
                {[
                  "Block unapproved runs",
                  "Split publish & delete permissions",
                  "Delegate module ownership",
                  "Limit what users can discover",
                  "Scope artifacts to projects",
                  "Stop public provider forking",
                ].map((concern, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2.5 py-1 rounded-full border transition-all duration-500"
                    style={{
                      borderColor: blueGhost,
                      color: blue,
                      backgroundColor: "white",
                      opacity: vis(0) ? 1 : 0,
                      transitionDelay: `${i * 80 + 300}ms`,
                    }}
                  >
                    {concern}
                  </span>
                ))}
              </div>
            )}
          </div>
          {/* Strikethrough when cracked */}
          {cracked && (
            <div
              className="absolute top-1/2 left-0 w-full h-[1px] transition-opacity duration-500"
              style={{ backgroundColor: "#ccc" }}
            />
          )}
        </div>

        {/* Down arrow */}
        <div
          className="my-3 flex flex-col items-center transition-all duration-700"
          style={{
            opacity: cracked ? 1 : 0,
            transform: cracked ? "translateY(0)" : "translateY(-8px)",
          }}
        >
          <svg width="24" height="48" viewBox="0 0 24 48">
            <path
              d="M12 4 L12 38 M6 32 L12 38 L18 32"
              fill="none"
              stroke={blueMuted}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[8px] text-black/25 mt-0.5">reframed</span>
        </div>

        {/* Three phase blocks in a row */}
        <div className="w-full flex items-stretch gap-3">
          {phases.map((phase, i) => (
            <div key={phase.num} className="flex items-center gap-3 flex-1">
              <div
                className="flex-1 rounded-xl border-2 p-5 flex flex-col items-center justify-center text-center transition-all duration-700"
                style={{
                  borderColor: phasesVisible
                    ? step === 3
                      ? blue
                      : blueMuted
                    : "#eee",
                  backgroundColor: phasesVisible
                    ? step === 3
                      ? blueLight
                      : "#fdfdfd"
                    : "#fafafa",
                  opacity: phasesVisible ? 1 : 0.15,
                  transform: phasesVisible
                    ? "translateY(0) scale(1)"
                    : "translateY(12px) scale(0.95)",
                  transitionDelay: phasesVisible ? `${i * 150}ms` : "0ms",
                  minHeight: "120px",
                }}
              >
                <span
                  className="text-[32px] leading-none mb-1 transition-colors duration-500"
                  style={{
                    fontFamily: "var(--font-bebas), sans-serif",
                    color: phasesVisible ? blue : "#ddd",
                  }}
                >
                  {phase.num}
                </span>
                <span
                  className="text-[14px] font-bold leading-tight mb-1 transition-colors duration-500"
                  style={{ color: phasesVisible ? "#333" : "#ccc" }}
                >
                  {phase.label}
                </span>
                <span
                  className="text-[10px] leading-tight transition-colors duration-500"
                  style={{ color: phasesVisible ? "#888" : "#ddd" }}
                >
                  {phase.short}
                </span>
              </div>
              {/* Connecting arrows between phases */}
              {i < 2 && (
                <Arrow visible={phasesVisible} delay={i * 150 + 300} />
              )}
            </div>
          ))}
        </div>

        {/* Bottom line */}
        <div
          className="w-full flex items-center justify-center mt-6 transition-all duration-700"
          style={{
            opacity: vis(3) ? 1 : 0,
            transform: vis(3) ? "translateY(0)" : "translateY(4px)",
          }}
        >
          <div className="flex-1 h-[1px]" style={{ backgroundColor: blueGhost }} />
          <span
            className="mx-4 text-[10px] whitespace-nowrap"
            style={{ color: blueMuted }}
          >
            Each phase scoped independently — dedicated research, scope & validation
          </span>
          <div className="flex-1 h-[1px]" style={{ backgroundColor: blueGhost }} />
        </div>
      </div>
    </div>
  );
}
