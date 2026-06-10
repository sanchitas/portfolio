"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Data ────────────────────────────────────────────────────────
const categories = ["Feature Requests", "Activity Log", "Other"] as const;
type Category = (typeof categories)[number];

type CaseEntry = {
  scope: "Private" | "Public";
  modules: string[];
  providers: string[];
};

const data: Record<Category, CaseEntry[]> = {
  "Feature Requests": [
    {
      scope: "Private",
      modules: ["Cannot resync FR", "Semver tag issues"],
      providers: [],
    },
    {
      scope: "Public",
      modules: ["Repo name changes", "Don't know about resync"],
      providers: ["Repo name change", "Don't know about resync"],
    },
  ],
  "Activity Log": [
    {
      scope: "Private",
      modules: ["Webhook fail"],
      providers: [],
    },
    {
      scope: "Public",
      modules: [
        "Webhook failed",
        "Tag not semver compliant",
        "Submodules not in the right place",
      ],
      providers: [
        "Webhook failed",
        "Release not formed",
        "Release finished too slow",
        "Invalid sig / other GPG",
      ],
    },
  ],
  Other: [
    {
      scope: "Private",
      modules: [],
      providers: [
        "API calls (wrong order / not successful)",
        "No resync",
        "No VCS (can't do VCS-backed private provider)",
        "Failed to include proper files",
      ],
    },
    {
      scope: "Public",
      modules: [
        "Webhook failed",
        "Tag not semver compliant",
        "Submodules not in the right place",
      ],
      providers: [
        "Releases.hashicorp.com workflow",
        "Un-publish version",
        "Move to CRT system",
        "Registry-built GH action to assist?",
      ],
    },
  ],
};

// ─── Palette ─────────────────────────────────────────────────────
const accent = "#C85A3A";
const accentMuted = "#D4A08A";
const categoryColor = "#D4903A";

// ─── Component ───────────────────────────────────────────────────
export default function SupportCasesDiagram({
  autoPlay = true,
  stepDuration = 1400,
  compact = false,
}: {
  autoPlay?: boolean;
  stepDuration?: number;
  compact?: boolean;
}) {
  // Steps: -1=blank, 0=title+headers, 1=Feature Requests, 2=Activity Log, 3=Other, 4=done
  const [step, setStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const totalSteps = 4;

  const advance = useCallback(() => {
    setStep((prev) => (prev >= totalSteps ? -1 : prev + 1));
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const delay = step === -1 ? 600 : step === 0 ? 1200 : stepDuration;
    const timer = setTimeout(advance, delay);
    return () => clearTimeout(timer);
  }, [isPlaying, step, advance, stepDuration]);

  const vis = (minStep: number) => step >= minStep;

  // ─── Compact card ──────────────────────────────────────────────
  if (compact) {
    // Show one category at a time cycling through
    const activeCatIdx =
      step >= 1 && step <= 3 ? step - 1 : step >= 4 ? 0 : -1;
    const activeCat =
      activeCatIdx >= 0 ? categories[activeCatIdx] : null;

    return (
      <div
        className="relative w-full h-full select-none flex flex-col"
        style={{ fontFamily: "var(--font-dm-mono), monospace" }}
      >
        {/* Title */}
        <div
          className="mb-1.5 transition-all duration-500"
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
            Support Case Taxonomy
          </h2>
          <p className="text-[6.5px] text-black/40 leading-tight">
            Mapping failure modes to build self-service workflows
          </p>
        </div>

        {/* Column headers */}
        <div
          className="flex gap-1 mb-1.5 transition-all duration-500"
          style={{ opacity: vis(0) ? 1 : 0 }}
        >
          <div className="w-[28px]" />
          <div className="flex-1 text-center">
            <span className="text-[6px] font-bold" style={{ color: accent }}>
              Modules
            </span>
          </div>
          <div className="flex-1 text-center">
            <span className="text-[6px] font-bold" style={{ color: accent }}>
              Providers
            </span>
          </div>
        </div>

        {/* Category dots */}
        <div
          className="flex items-center gap-1.5 mb-2 px-1 transition-all duration-500"
          style={{ opacity: vis(0) ? 1 : 0 }}
        >
          {categories.map((cat, i) => (
            <div key={cat} className="flex items-center gap-1">
              <div
                className="w-1.5 h-1.5 rounded-full transition-all duration-400"
                style={{
                  backgroundColor:
                    activeCatIdx === i ? categoryColor : "#ddd",
                  transform:
                    activeCatIdx === i ? "scale(1.4)" : "scale(1)",
                }}
              />
              <span
                className="text-[5px] font-bold transition-colors duration-400"
                style={{
                  color: activeCatIdx === i ? "#333" : "#bbb",
                }}
              >
                {cat}
              </span>
            </div>
          ))}
        </div>

        {/* Active category rows */}
        <div className="flex-1 flex flex-col justify-between">
          {activeCat ? (
            data[activeCat].map((entry, ei) => (
              <div key={`${activeCat}-${entry.scope}`} className="mb-1">
                <span
                  className="text-[5.5px] font-bold block mb-0.5 transition-all duration-400"
                  style={{
                    color: "#666",
                    transitionDelay: `${ei * 80}ms`,
                  }}
                >
                  {entry.scope}
                </span>
                <div className="flex gap-1">
                  {/* Modules */}
                  <div
                    className="flex-1 rounded px-1 py-[2px] transition-all duration-500"
                    style={{
                      backgroundColor:
                        entry.modules.length > 0 ? "#f5f0ec" : "#fafafa",
                      border: `1px solid ${entry.modules.length > 0 ? accentMuted : "#eee"}`,
                      transitionDelay: `${ei * 100}ms`,
                    }}
                  >
                    {entry.modules.length > 0 ? (
                      entry.modules.map((m, mi) => (
                        <span
                          key={mi}
                          className="text-[5px] leading-tight text-black/65 block"
                        >
                          · {m}
                        </span>
                      ))
                    ) : (
                      <span className="text-[5px] text-black/15">—</span>
                    )}
                  </div>
                  {/* Providers */}
                  <div
                    className="flex-1 rounded px-1 py-[2px] transition-all duration-500"
                    style={{
                      backgroundColor:
                        entry.providers.length > 0 ? "#f5f0ec" : "#fafafa",
                      border: `1px solid ${entry.providers.length > 0 ? accentMuted : "#eee"}`,
                      transitionDelay: `${ei * 100 + 50}ms`,
                    }}
                  >
                    {entry.providers.length > 0 ? (
                      entry.providers.map((p, pi) => (
                        <span
                          key={pi}
                          className="text-[5px] leading-tight text-black/65 block"
                        >
                          · {p}
                        </span>
                      ))
                    ) : (
                      <span className="text-[5px] text-black/15">—</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex-1" />
          )}
        </div>
      </div>
    );
  }

  // ─── Full layout ───────────────────────────────────────────────
  return (
    <div
      className="relative w-full max-w-[800px] mx-auto select-none"
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
          Registry Support Case Taxonomy
        </h2>
        <p className="text-[12px] text-black/40 mt-0.5">
          Categorizing failure modes across Modules and Providers to identify
          self-service opportunities
        </p>
      </div>

      {/* Matrix */}
      <div
        className="border border-black/12 rounded-lg p-6 transition-all duration-700"
        style={{ opacity: vis(0) ? 1 : 0 }}
      >
        {/* Column headers */}
        <div className="grid grid-cols-[100px_1fr_1fr] gap-3 mb-4">
          <div />
          <div className="text-center">
            <span
              className="text-[14px] font-bold"
              style={{ color: accent }}
            >
              Modules
            </span>
          </div>
          <div
            className="text-center"
            style={{
              borderLeft: `2px dashed ${accentMuted}`,
            }}
          >
            <span
              className="text-[14px] font-bold"
              style={{ color: accent }}
            >
              Providers
            </span>
          </div>
        </div>

        {/* Categories */}
        {categories.map((cat, ci) => {
          const catStep = ci + 1;
          const entries = data[cat];
          return (
            <div key={cat} className="mb-4">
              {/* Category header */}
              <div
                className="rounded px-3 py-1.5 mb-2 transition-all duration-600"
                style={{
                  backgroundColor: vis(catStep) ? categoryColor : "#eee",
                  opacity: vis(catStep) ? 1 : 0.2,
                  transform: vis(catStep)
                    ? "translateY(0)"
                    : "translateY(4px)",
                }}
              >
                <span
                  className="text-[11px] font-bold transition-colors duration-500"
                  style={{
                    color: vis(catStep) ? "#fff" : "#ccc",
                  }}
                >
                  {cat}
                </span>
              </div>

              {/* Entries */}
              {entries.map((entry, ei) => (
                <div
                  key={`${cat}-${entry.scope}`}
                  className="grid grid-cols-[100px_1fr_1fr] gap-3 mb-2"
                >
                  {/* Scope label */}
                  <div className="flex items-start pt-1.5">
                    <span
                      className="text-[10px] font-bold transition-all duration-500"
                      style={{
                        color: vis(catStep) ? "#555" : "#ccc",
                      }}
                    >
                      {entry.scope}
                    </span>
                  </div>

                  {/* Modules cell */}
                  <div
                    className="rounded px-3 py-2 min-h-[40px] transition-all duration-600"
                    style={{
                      backgroundColor: vis(catStep)
                        ? entry.modules.length > 0
                          ? "#f5f0ec"
                          : "#fafafa"
                        : "#fafafa",
                      border: `1px solid ${vis(catStep) ? (entry.modules.length > 0 ? accentMuted : "#e8e8e8") : "#f0f0f0"}`,
                      opacity: vis(catStep) ? 1 : 0.2,
                      transitionDelay: `${ei * 100}ms`,
                    }}
                  >
                    {entry.modules.length > 0 ? (
                      <ul className="space-y-0.5">
                        {entry.modules.map((m, mi) => (
                          <li
                            key={mi}
                            className="text-[10px] leading-snug transition-all duration-500"
                            style={{
                              color: vis(catStep) ? "#333" : "#ccc",
                              opacity: vis(catStep) ? 1 : 0,
                              transform: vis(catStep)
                                ? "translateX(0)"
                                : "translateX(-4px)",
                              transitionDelay: vis(catStep)
                                ? `${mi * 60 + ei * 100}ms`
                                : "0ms",
                            }}
                          >
                            · {m}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-[10px] text-black/15">—</span>
                    )}
                  </div>

                  {/* Providers cell */}
                  <div
                    className="rounded px-3 py-2 min-h-[40px] transition-all duration-600"
                    style={{
                      backgroundColor: vis(catStep)
                        ? entry.providers.length > 0
                          ? "#f5f0ec"
                          : "#fafafa"
                        : "#fafafa",
                      border: `1px solid ${vis(catStep) ? (entry.providers.length > 0 ? accentMuted : "#e8e8e8") : "#f0f0f0"}`,
                      borderLeft: `2px dashed ${vis(catStep) ? accentMuted : "#eee"}`,
                      opacity: vis(catStep) ? 1 : 0.2,
                      transitionDelay: `${ei * 100 + 50}ms`,
                    }}
                  >
                    {entry.providers.length > 0 ? (
                      <ul className="space-y-0.5">
                        {entry.providers.map((p, pi) => (
                          <li
                            key={pi}
                            className="text-[10px] leading-snug transition-all duration-500"
                            style={{
                              color: vis(catStep) ? "#333" : "#ccc",
                              opacity: vis(catStep) ? 1 : 0,
                              transform: vis(catStep)
                                ? "translateX(0)"
                                : "translateX(-4px)",
                              transitionDelay: vis(catStep)
                                ? `${pi * 60 + ei * 100 + 50}ms`
                                : "0ms",
                            }}
                          >
                            · {p}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-[10px] text-black/15">—</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
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
