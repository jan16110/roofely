"use client";

import { scoreColor, scoreLabel } from "@/lib/format";

export default function HealthRing({
  score,
  size = 132,
  stroke = 11,
}: {
  score: number;
  size?: number;
  stroke?: number;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score));
  const dash = (pct / 100) * c;
  const color = scoreColor(pct);

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          style={{
            transition: "stroke-dasharray 1s cubic-bezier(0.22,1,0.36,1)",
            filter: `drop-shadow(0 0 8px ${color}66)`,
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold tabular-nums" style={{ color }}>
          {Math.round(pct)}
        </span>
        <span className="text-[11px] font-medium uppercase tracking-wider text-white/50">
          {scoreLabel(pct)}
        </span>
      </div>
    </div>
  );
}
