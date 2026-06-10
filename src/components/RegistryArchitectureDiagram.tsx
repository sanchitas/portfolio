"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Data ────────────────────────────────────────────────────────
const registries = [
  {
    label: "Public",
    sources: [
      {
        name: "Partner / Community",
        tier: "community" as const,
        artifacts: ["Module", "Provider"],
      },
      {
        name: "Official Provider",
        tier: "official" as const,
        artifacts: ["Module", "Provider"],
      },
    ],
  },
  {
    label: "Private",
    sources: [
      {
        name: "HCP Terraform",
        tier: "official" as const,
        artifacts: ["Module", "Provider"],
      },
      {
        name: "TFE",
        tier: "community" as const,
        artifacts: ["Module", "Provider"],
      },
    ],
  },
] as const;

// ─── Palette ─────────────────────────────────────────────────────
const accent = "#C85A3A";
const accentMuted = "#D4A08A";
const communityFill = accent;
const officialFill = "#f0e0d6";
const officialBorder = accentMuted;

// ─── Component ───────────────────────────────────────────────────
export default function RegistryArchitectureDiagram({
  autoPlay = true,
  stepDuration = 1200,
  compact = false,
}: {
  autoPlay?: boolean;
  stepDuration?: number;
  compact?: boolean;
}) {
  // Steps: -1=blank, 0=title, 1=Public header, 2=Public sources, 3=Public artifacts,
  //        4=Private header, 5=Private sources, 6=Private artifacts, 7=all visible
  const [step, setStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const totalSteps = 7;

  const advance = useCallback(() => {
    setStep((prev) => (prev >= totalSteps ? -1 : prev + 1));
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const delay = step === -1 ? 600 : step === 0 ? 1400 : stepDuration;
    const timer = setTimeout(advance, delay);
    return () => clearTimeout(timer);
  }, [isPlaying, step, advance, stepDuration]);

  const vis = (minStep: number) => step >= minStep;

  // ─── Compact card ──────────────────────────────────────────────
  if (compact) {
    return (
      <div
        className="relative w-full h-full select-none flex flex-col"
        style={{ fontFamily: "var(--font-dm-mono), monospace" }}
      >
        {/* Title */}
        <div
          className="mb-2 transition-all duration-500"
          style={{
            opacity: vis(0) ? 1 : 0,
            transform: vis(0) ? "translateY(0)" : "translateY(8px)",
          }}
        >
          <h2
            className="text-[11px] tracking-tight"
            style={{
              fontFamily: "var(--font-bebas), sans-serif",
              letterSpacing: "0.02em",
            }}
          >
            Registry Architecture
          </h2>
          <p className="text-[6.5px] text-black/40 leading-tight">
            Qualifying first-time publishing failures across registry types
          </p>
        </div>

        {/* Two columns: Public / Private */}
        <div className="flex-1 flex gap-2">
          {registries.map((reg, ri) => {
            const headerStep = ri === 0 ? 1 : 4;
            const sourceStep = ri === 0 ? 2 : 5;
            const artifactStep = ri === 0 ? 3 : 6;
            return (
              <div key={reg.label} className="flex-1 flex flex-col">
                {/* Registry header */}
                <div
                  className="rounded px-2 py-1 mb-1.5 text-center transition-all duration-500"
                  style={{
                    backgroundColor: vis(headerStep) ? "#444" : "#eee",
                    opacity: vis(headerStep) ? 1 : 0.3,
                  }}
                >
                  <span
                    className="text-[7px] font-bold transition-colors duration-500"
                    style={{ color: vis(headerStep) ? "#fff" : "#bbb" }}
                  >
                    {reg.label}
                  </span>
                </div>

                {/* Sources */}
                <div className="flex gap-1 flex-1">
                  {reg.sources.map((src) => {
                    const isCommunity = src.tier === "community";
                    return (
                      <div key={src.name} className="flex-1 flex flex-col gap-1">
                        {/* Source box */}
                        <div
                          className="rounded px-1 py-1.5 text-center transition-all duration-500 flex-1 flex items-center justify-center"
                          style={{
                            backgroundColor: vis(sourceStep)
                              ? isCommunity
                                ? communityFill
                                : officialFill
                              : "#f5f5f5",
                            border: `1px solid ${vis(sourceStep) ? (isCommunity ? communityFill : officialBorder) : "#e8e8e8"}`,
                            opacity: vis(sourceStep) ? 1 : 0.2,
                          }}
                        >
                          <span
                            className="text-[5.5px] font-bold leading-tight transition-colors duration-400"
                            style={{
                              color: vis(sourceStep)
                                ? isCommunity
                                  ? "#fff"
                                  : "#555"
                                : "#ccc",
                            }}
                          >
                            {src.name}
                          </span>
                        </div>

                        {/* Artifacts */}
                        <div className="flex gap-0.5">
                          {src.artifacts.map((art) => (
                            <div
                              key={art}
                              className="flex-1 rounded px-0.5 py-1 text-center transition-all duration-500"
                              style={{
                                backgroundColor: vis(artifactStep)
                                  ? isCommunity
                                    ? communityFill
                                    : officialFill
                                  : "#f8f8f8",
                                border: `1px solid ${vis(artifactStep) ? (isCommunity ? communityFill : officialBorder) : "#eee"}`,
                                opacity: vis(artifactStep) ? 1 : 0.15,
                              }}
                            >
                              <span
                                className="text-[5px] font-bold transition-colors duration-400"
                                style={{
                                  color: vis(artifactStep)
                                    ? isCommunity
                                      ? "#fff"
                                      : "#666"
                                    : "#ddd",
                                }}
                              >
                                {art}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── Full layout ───────────────────────────────────────────────
  return (
    <div
      className="relative w-full max-w-[900px] mx-auto select-none"
      style={{ fontFamily: "var(--font-dm-mono), monospace" }}
    >
      {/* Title */}
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
          Qualifying a First Time Failure
        </h2>
        <p className="text-[12px] text-black/40 mt-0.5">
          Mapping where publishing breaks across Public and Private registry
          types
        </p>
      </div>

      {/* Architecture */}
      <div
        className="border border-black/12 rounded-lg p-8 transition-all duration-700"
        style={{ opacity: vis(0) ? 1 : 0 }}
      >
        <div className="flex gap-12">
          {registries.map((reg, ri) => {
            const headerStep = ri === 0 ? 1 : 4;
            const sourceStep = ri === 0 ? 2 : 5;
            const artifactStep = ri === 0 ? 3 : 6;
            return (
              <div key={reg.label} className="flex-1">
                {/* Registry header pill */}
                <div
                  className="rounded-md px-6 py-2.5 text-center mx-auto max-w-[200px] transition-all duration-600 mb-8"
                  style={{
                    backgroundColor: vis(headerStep) ? "#444" : "#eee",
                    opacity: vis(headerStep) ? 1 : 0.25,
                    transform: vis(headerStep)
                      ? "translateY(0)"
                      : "translateY(8px)",
                  }}
                >
                  <span
                    className="text-[13px] font-bold transition-colors duration-500"
                    style={{
                      color: vis(headerStep) ? "#fff" : "#bbb",
                    }}
                  >
                    {reg.label}
                  </span>
                </div>

                {/* Source boxes */}
                <div className="flex gap-4">
                  {reg.sources.map((src) => {
                    const isCommunity = src.tier === "community";
                    return (
                      <div key={src.name} className="flex-1 flex flex-col gap-3">
                        {/* Source */}
                        <div
                          className="rounded-md px-4 py-5 text-center transition-all duration-600"
                          style={{
                            backgroundColor: vis(sourceStep)
                              ? isCommunity
                                ? communityFill
                                : officialFill
                              : "#f5f5f5",
                            border: `1.5px solid ${vis(sourceStep) ? (isCommunity ? communityFill : officialBorder) : "#e8e8e8"}`,
                            opacity: vis(sourceStep) ? 1 : 0.2,
                            transform: vis(sourceStep)
                              ? "translateY(0)"
                              : "translateY(6px)",
                          }}
                        >
                          <span
                            className="text-[12px] font-bold transition-colors duration-500"
                            style={{
                              color: vis(sourceStep)
                                ? isCommunity
                                  ? "#fff"
                                  : "#555"
                                : "#ccc",
                            }}
                          >
                            {src.name}
                          </span>
                        </div>

                        {/* Artifacts */}
                        <div className="flex gap-2">
                          {src.artifacts.map((art) => (
                            <div
                              key={art}
                              className="flex-1 rounded-md px-2 py-3 text-center transition-all duration-600"
                              style={{
                                backgroundColor: vis(artifactStep)
                                  ? isCommunity
                                    ? communityFill
                                    : officialFill
                                  : "#f8f8f8",
                                border: `1.5px solid ${vis(artifactStep) ? (isCommunity ? communityFill : officialBorder) : "#eee"}`,
                                opacity: vis(artifactStep) ? 1 : 0.15,
                                transform: vis(artifactStep)
                                  ? "translateY(0)"
                                  : "translateY(4px)",
                              }}
                            >
                              <span
                                className="text-[11px] font-bold transition-colors duration-500"
                                style={{
                                  color: vis(artifactStep)
                                    ? isCommunity
                                      ? "#fff"
                                      : "#666"
                                    : "#ddd",
                                }}
                              >
                                {art}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div
          className="mt-8 pt-4 border-t border-dashed border-black/10 flex gap-6 transition-all duration-700"
          style={{ opacity: vis(7) ? 1 : 0 }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: communityFill }}
            />
            <span className="text-[10px] text-black/50">
              Community / Self-managed
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{
                backgroundColor: officialFill,
                border: `1px solid ${officialBorder}`,
              }}
            />
            <span className="text-[10px] text-black/50">
              HashiCorp-managed
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-5 flex items-center justify-center gap-4">
        <button
          onClick={() => {
            setStep(-1);
            setIsPlaying(true);
          }}
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
      </div>
    </div>
  );
}
