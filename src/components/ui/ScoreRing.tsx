"use client";

import type { PassportScore } from "@/lib/types";

interface ScoreRingProps {
  score: PassportScore;
  size?: number;
}

const SCORE_COLORS = {
  low: { stroke: "#ef4444", text: "#ef4444", label: "Low Trust" },
  medium: { stroke: "#f59e0b", text: "#f59e0b", label: "Medium Trust" },
  high: { stroke: "#10b981", text: "#10b981", label: "High Trust" },
  verified: { stroke: "#8b5cf6", text: "#8b5cf6", label: "Verified Human" },
};

export function ScoreRing({ score, size = 160 }: ScoreRingProps) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (score.percentage / 100) * circumference;
  const colors = SCORE_COLORS[score.humanityScore];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
        >
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="10"
          />
          {/* Progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-3xl font-bold"
            style={{ color: colors.text }}
          >
            {score.total}
          </span>
          <span className="text-xs text-white/50">/ {score.max}</span>
        </div>
      </div>
      <div className="text-center">
        <span
          className="text-sm font-semibold px-3 py-1 rounded-full"
          style={{
            color: colors.text,
            backgroundColor: `${colors.stroke}20`,
            border: `1px solid ${colors.stroke}40`,
          }}
        >
          {colors.label}
        </span>
      </div>
    </div>
  );
}
