"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Data ────────────────────────────────────────────────────────
const stages = [
  "Pre-sales / Renewal",
  "Proof of Concept",
  "Point of Sale",
  "Post-sales",
] as const;

type StageKey = (typeof stages)[number];

const rows = [
  "SMEs",
  "WWFO Team",
  "Customer Actions",
  "Customer Insights",
  "Touchpoints",
  "Design / Research Method",
] as const;

const data: Record<StageKey, Record<(typeof rows)[number], string[]>> = {
  "Pre-sales / Renewal": {
    SMEs: ["Solution Engineer", "Developer Advocate"],
    "WWFO Team": ["Sales", "Solutions Engineers", "Developer Advocate"],
    "Customer Actions": ["Demos", "Understand product value"],
    "Customer Insights": ["Non-starters, priorities and value", "Competitive"],
    Touchpoints: ["Intro calls: Qualify prospective customers (Gong)"],
    "Design / Research Method": [
      "Competitive",
      "User survey",
      "User interviews…",
    ],
  },
  "Proof of Concept": {
    SMEs: ["Solutions Architect"],
    "WWFO Team": ["Sales", "Solutions Architect"],
    "Customer Actions": ["Read documentation", "Test features"],
    "Customer Insights": ["Product feedback and wishlist"],
    Touchpoints: [
      "SME calls: Qualify customer use cases (Gong or IRL)",
      "Customer interviews",
    ],
    "Design / Research Method": [
      "Beta feedback synthesis",
      "User survey",
      "Customer interviews",
    ],
  },
  "Point of Sale": {
    SMEs: ["Account Manager"],
    "WWFO Team": ["Sales / Account Manager / DealDesk"],
    "Customer Actions": ["Negotiate and sign contract (multi-year)"],
    "Customer Insights": ["Pricing and Packaging feedback"],
    Touchpoints: ["SFDC: Contracts"],
    "Design / Research Method": [],
  },
  "Post-sales": {
    SMEs: ["Customer Success Engineer", "RSA / RSE"],
    "WWFO Team": [
      "RSA, RSE",
      "Customer Success Engineer",
      "Account Manager",
    ],
    "Customer Actions": [
      "Onboarding (or Migrating from Enterprise to Cloud)",
      "Support tickets",
    ],
    "Customer Insights": ["Onboarding feedback", "Usage metrics"],
    Touchpoints: [
      "Zendesk: Support Cases",
      "SME calls: Customer Requirements (Gong or IRL)…",
    ],
    "Design / Research Method": [
      "Design Concepts (Lo-fi)",
      "User survey",
      "Customer interviews",
      "Concept validation…",
    ],
  },
};

// ─── Minimal palette ────────────────────────────────────────────
const accentDot = "#3B6EC2";
const accentDotMuted = "#8AAED6";

// ─── Compact inner (full grid, no controls) ─────────────────────
function CompactInner({
  activeStage,
  isStageVisible,
  accentDot: dot,
  accentDotMuted: dotMuted,
}: {
  activeStage: number;
  isStageVisible: (i: number) => boolean;
  accentDot: string;
  accentDotMuted: string;
}) {
  return (
    <div
      className="w-full select-none"
      style={{ fontFamily: "var(--font-dm-mono), monospace" }}
    >
      <div
        className="mb-6 transition-all duration-700"
        style={{
          opacity: activeStage >= -1 ? 1 : 0,
          transform: activeStage >= -1 ? "translateY(0)" : "translateY(16px)",
        }}
      >
        <h2
          className="text-[36px] tracking-tight"
          style={{ fontFamily: "var(--font-bebas), sans-serif", letterSpacing: "0.02em" }}
        >
          Map of Customers and SME Roles
        </h2>
        <p className="text-[12px] text-black/40 mt-0.5">
          Research enablement — mapping the sales cycle to design research methods
        </p>
      </div>

      <div
        className="border border-black/12 rounded-lg p-5 transition-all duration-700"
        style={{ opacity: activeStage >= -1 ? 1 : 0 }}
      >
        <div className="grid grid-cols-[140px_1fr_1fr_1fr_1fr] gap-2 mb-4">
          <div className="flex items-center">
            <span className="text-[10px] font-bold tracking-wider uppercase text-black/40">
              Sales Cycle
            </span>
          </div>
          {stages.map((stage, i) => (
            <div
              key={stage}
              className="text-center transition-all duration-500"
              style={{ opacity: isStageVisible(i) ? 1 : 0.2 }}
            >
              <div className="flex items-center justify-center mb-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full transition-all duration-500"
                  style={{ backgroundColor: isStageVisible(i) ? dot : "#ddd" }}
                />
                {i < stages.length - 1 && (
                  <div
                    className="h-[1px] flex-1 mx-1 transition-all duration-700"
                    style={{ backgroundColor: isStageVisible(i + 1) ? dotMuted : "#e5e5e5" }}
                  />
                )}
              </div>
              <span
                className="text-[11px] font-bold transition-colors duration-500"
                style={{ color: isStageVisible(i) ? "#111" : "#ccc" }}
              >
                {stage}
              </span>
            </div>
          ))}
        </div>

        {rows.map((row, rowIdx) => (
          <div
            key={row}
            className={`grid grid-cols-[140px_1fr_1fr_1fr_1fr] gap-2 mb-4 ${
              rowIdx === 4 ? "mt-5 pt-4 border-t border-dashed border-black/12" : ""
            }`}
          >
            <div className="flex items-start justify-end pt-1.5 pr-2">
              <span
                className="text-[10px] font-bold leading-tight transition-all duration-500 text-right"
                style={{ color: activeStage >= 0 ? "#555" : "#ccc" }}
              >
                {row}
              </span>
            </div>
            {stages.map((stage, stageIdx) => {
              const cellData = data[stage][row];
              const visible = isStageVisible(stageIdx);
              const isActive = activeStage === stageIdx;
              return (
                <div
                  key={`${row}-${stage}`}
                  className="rounded px-2.5 py-2 transition-all duration-500 min-h-[44px]"
                  style={{
                    backgroundColor: visible ? (isActive ? "#eef3fa" : "#fafafa") : "#fafafa",
                    border: `1px solid ${visible ? (isActive ? dotMuted : "#e8e8e8") : "#f0f0f0"}`,
                    opacity: visible ? 1 : 0.25,
                  }}
                >
                  {cellData.length > 0 ? (
                    <ul className="space-y-0.5">
                      {cellData.map((item, itemIdx) => (
                        <li
                          key={itemIdx}
                          className="text-[10px] leading-snug transition-all duration-500"
                          style={{
                            color: visible ? "#333" : "#ccc",
                            transitionDelay: visible ? `${itemIdx * 80}ms` : "0ms",
                            opacity: visible ? 1 : 0,
                            transform: visible ? "translateX(0)" : "translateX(-4px)",
                          }}
                        >
                          {cellData.length > 1 ? "· " : ""}{item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-[10px] text-black/15">—</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────
export default function ResearchEnablementDiagram({
  autoPlay = true,
  stepDuration = 2400,
  compact = false,
}: {
  autoPlay?: boolean;
  stepDuration?: number;
  compact?: boolean;
}) {
  const [activeStage, setActiveStage] = useState(-2);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  const advance = useCallback(() => {
    setActiveStage((prev) => {
      if (prev >= stages.length) return -2;
      return prev + 1;
    });
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const delay =
      activeStage === -2 ? 800 : activeStage === -1 ? 1800 : stepDuration;
    const timer = setTimeout(advance, delay);
    return () => clearTimeout(timer);
  }, [isPlaying, activeStage, advance, stepDuration]);

  const isStageVisible = (idx: number) => activeStage >= idx;
  const isAnnotationVisible = activeStage >= stages.length;

  const currentStage = activeStage >= 0 && activeStage < stages.length ? stages[activeStage] : null;

  // ─── Compact card layout — zoom-out from pre-sales ────────────
  if (compact) {
    const zoomProgress = Math.min(1, Math.max(0, (activeStage + 1) / 3));
    const scale = 0.7 - zoomProgress * 0.39; // 0.7 → 0.31
    const translateX = (1 - zoomProgress) * -15;
    const translateY = (1 - zoomProgress) * -8;

    return (
      <div className="relative w-full h-full overflow-hidden">
        <div
          className="absolute top-0 left-0 origin-top-left transition-transform duration-[2000ms] ease-in-out"
          style={{
            width: "1100px",
            transform: `scale(${scale}) translate(${translateX}%, ${translateY}%)`,
          }}
        >
          <CompactInner
            activeStage={activeStage}
            isStageVisible={isStageVisible}
            accentDot={accentDot}
            accentDotMuted={accentDotMuted}
          />
        </div>
      </div>
    );
  }

  // ─── Full layout ─────────────────────────────────────────────
  return (
    <div
      className="relative w-full max-w-[1100px] mx-auto select-none"
      style={{ fontFamily: "var(--font-dm-mono), monospace" }}
    >
      {/* ─── Title ─── */}
      <div
        className="mb-6 transition-all duration-700"
        style={{
          opacity: activeStage >= -1 ? 1 : 0,
          transform: activeStage >= -1 ? "translateY(0)" : "translateY(16px)",
        }}
      >
        <h2
          className="text-[clamp(24px,4vw,36px)] tracking-tight"
          style={{
            fontFamily: "var(--font-bebas), sans-serif",
            letterSpacing: "0.02em",
          }}
        >
          Map of Customers and SME Roles
        </h2>
        <p className="text-[12px] text-black/40 mt-0.5">
          Research enablement — mapping the sales cycle to design research methods
        </p>
      </div>

      {/* ─── Main container ─── */}
      <div
        className="border border-black/12 rounded-lg p-5 transition-all duration-700"
        style={{ opacity: activeStage >= -1 ? 1 : 0 }}
      >
        {/* ─── Sales Cycle Header ─── */}
        <div className="grid grid-cols-[140px_1fr_1fr_1fr_1fr] gap-2 mb-4">
          <div className="flex items-center">
            <span className="text-[10px] font-bold tracking-wider uppercase text-black/40">
              Sales Cycle
            </span>
          </div>
          {stages.map((stage, i) => (
            <div
              key={stage}
              className="text-center transition-all duration-500"
              style={{ opacity: isStageVisible(i) ? 1 : 0.2 }}
            >
              <div className="flex items-center justify-center mb-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full transition-all duration-500"
                  style={{
                    backgroundColor: isStageVisible(i) ? accentDot : "#ddd",
                  }}
                />
                {i < stages.length - 1 && (
                  <div
                    className="h-[1px] flex-1 mx-1 transition-all duration-700"
                    style={{
                      backgroundColor: isStageVisible(i + 1)
                        ? accentDotMuted
                        : "#e5e5e5",
                    }}
                  />
                )}
              </div>
              <span
                className="text-[11px] font-bold transition-colors duration-500"
                style={{ color: isStageVisible(i) ? "#111" : "#ccc" }}
              >
                {stage}
              </span>
            </div>
          ))}
        </div>

        {/* ─── Data Rows ─── */}
        {rows.map((row, rowIdx) => (
          <div
            key={row}
            className={`grid grid-cols-[140px_1fr_1fr_1fr_1fr] gap-2 mb-4 ${
              rowIdx === 4
                ? "mt-5 pt-4 border-t border-dashed border-black/12"
                : ""
            }`}
          >
            {/* Row label */}
            <div className="flex items-start justify-end pt-1.5 pr-2">
              <span
                className="text-[10px] font-bold leading-tight transition-all duration-500 text-right"
                style={{ color: activeStage >= 0 ? "#555" : "#ccc" }}
              >
                {row}
              </span>
            </div>

            {/* Stage cells */}
            {stages.map((stage, stageIdx) => {
              const cellData = data[stage][row];
              const visible = isStageVisible(stageIdx);
              const isActive = activeStage === stageIdx;

              return (
                <div
                  key={`${row}-${stage}`}
                  className="rounded px-2.5 py-2 transition-all duration-500 min-h-[44px]"
                  style={{
                    backgroundColor: visible
                      ? isActive
                        ? "#eef3fa"
                        : "#fafafa"
                      : "#fafafa",
                    border: `1px solid ${
                      visible
                        ? isActive
                          ? accentDotMuted
                          : "#e8e8e8"
                        : "#f0f0f0"
                    }`,
                    opacity: visible ? 1 : 0.25,
                  }}
                >
                  {cellData.length > 0 ? (
                    <ul className="space-y-0.5">
                      {cellData.map((item, itemIdx) => (
                        <li
                          key={itemIdx}
                          className="text-[10px] leading-snug transition-all duration-500"
                          style={{
                            color: visible ? "#333" : "#ccc",
                            transitionDelay: visible
                              ? `${itemIdx * 80}ms`
                              : "0ms",
                            opacity: visible ? 1 : 0,
                            transform: visible
                              ? "translateX(0)"
                              : "translateX(-4px)",
                          }}
                        >
                          {cellData.length > 1 ? "· " : ""}
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-[10px] text-black/15">—</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}


      </div>

      {/* ─── Controls ─── */}
      {!compact && (
      <div className="mt-5 flex items-center justify-center gap-4">
        <button
          onClick={() => {
            setActiveStage(-2);
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
        <div className="flex gap-1.5">
          {stages.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveStage(i);
                setIsPlaying(false);
              }}
              className="w-1.5 h-1.5 rounded-full transition-all duration-300"
              style={{
                backgroundColor: activeStage >= i ? accentDot : "#ddd",
                transform: activeStage === i ? "scale(1.5)" : "scale(1)",
              }}
            />
          ))}
        </div>
      </div>
      )}
    </div>
  );
}
