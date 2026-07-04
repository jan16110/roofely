"use client";

import type { ScanResult } from "@/lib/types";
import { formatCost } from "@/lib/format";
import HealthRing from "./HealthRing";
import ProblemCard from "./ProblemCard";
import { InfoIcon, ShieldCheckIcon } from "./Icons";

export default function ScanResultView({ result }: { result: ScanResult }) {
  const totalMin = result.problems.reduce((s, p) => s + p.estimatedCost.min, 0);
  const totalMax = result.problems.reduce((s, p) => s + p.estimatedCost.max, 0);
  const diyCount = result.problems.filter((p) => p.diyPossible).length;
  const proCount = result.problems.length - diyCount;

  return (
    <div className="space-y-5">
      {result.demo && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-amber-300/15 bg-amber-400/[0.06] px-4 py-3">
          <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-200/80" />
          <p className="text-xs leading-relaxed text-amber-100/80">
            {result.note ?? (
              <>
                Demo result — add your OpenAI API key in{" "}
                <code className="font-mono">.env</code> for real AI analysis.
              </>
            )}
          </p>
        </div>
      )}

      {/* Summary hero */}
      <div className="glass-strong animate-fade-up p-5">
        <div className="flex items-center gap-5">
          <HealthRing score={result.healthScore} />
          <div className="flex-1">
            <p className="label-eyebrow">Roof health</p>
            <p className="mt-1 text-sm leading-relaxed text-white/75">{result.summary}</p>
            {result.roofType && <span className="chip mt-3">{result.roofType}</span>}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 divide-x divide-white/[0.07] border-t border-white/[0.07] pt-4">
          <Stat label="Issues" value={String(result.problems.length)} />
          <Stat label="DIY / Pro" value={`${diyCount} / ${proCount}`} />
          <Stat label="Est. cost" value={formatCost(totalMin, totalMax)} />
        </div>
      </div>

      {/* Problems */}
      <div>
        <div className="mb-3 flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold text-white/80">Detected problems</h2>
          <span className="text-xs text-white/40">{result.problems.length} found</span>
        </div>

        {result.problems.length === 0 ? (
          <div className="glass flex flex-col items-center px-6 py-10 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-400/25">
              <ShieldCheckIcon className="h-7 w-7" />
            </div>
            <p className="mt-3 font-semibold text-white">No problems detected</p>
            <p className="mt-1 text-sm text-white/50">
              Your roof looks to be in great shape.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {result.problems.map((p, i) => (
              <ProblemCard key={i} problem={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-1 text-center">
      <p className="whitespace-nowrap text-[15px] font-bold tabular-nums text-white">
        {value}
      </p>
      <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-white/40">
        {label}
      </p>
    </div>
  );
}
