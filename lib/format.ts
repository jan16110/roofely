import type { Severity } from "./types";

export function formatCost(min: number, max: number): string {
  if (min === 0 && max === 0) return "Free";
  const fmt = (n: number) => `$${Math.round(n).toLocaleString()}`;
  if (min === max) return fmt(min);
  return `${fmt(min)}–${fmt(max)}`;
}

export function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(ts).toLocaleDateString();
}

export const severityMeta: Record<
  Severity,
  { label: string; text: string; bg: string; ring: string; dot: string }
> = {
  low: {
    label: "Low",
    text: "text-emerald-300",
    bg: "bg-emerald-500/10",
    ring: "ring-emerald-400/30",
    dot: "bg-emerald-400",
  },
  medium: {
    label: "Medium",
    text: "text-amber-300",
    bg: "bg-amber-500/10",
    ring: "ring-amber-400/30",
    dot: "bg-amber-400",
  },
  high: {
    label: "High",
    text: "text-orange-300",
    bg: "bg-orange-500/10",
    ring: "ring-orange-400/30",
    dot: "bg-orange-400",
  },
  critical: {
    label: "Critical",
    text: "text-red-300",
    bg: "bg-red-500/10",
    ring: "ring-red-400/30",
    dot: "bg-red-400",
  },
};

export function scoreColor(score: number): string {
  if (score >= 80) return "#34d399"; // emerald
  if (score >= 60) return "#fbbf24"; // amber
  if (score >= 40) return "#fb923c"; // orange
  return "#f87171"; // red
}

export function scoreLabel(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Fair";
  if (score >= 30) return "Poor";
  return "Critical";
}
