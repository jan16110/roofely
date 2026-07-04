"use client";

import { useState } from "react";
import Link from "next/link";
import { useScans } from "@/components/ScanStore";
import { timeAgo, scoreColor, scoreLabel } from "@/lib/format";
import ScanResultView from "@/components/ScanResultView";
import type { ScanResult } from "@/lib/types";
import {
  ScanIcon,
  HomeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
} from "@/components/Icons";

export default function HistoryPage() {
  const { scans, ready, removeScan, clearScans } = useScans();
  const [selected, setSelected] = useState<ScanResult | null>(null);

  if (selected) {
    return (
      <div>
        <button
          onClick={() => setSelected(null)}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-white/60 transition-colors hover:text-white"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Back to history
        </button>

        {selected.imageUrl && (
          <div className="mb-5 overflow-hidden rounded-3xl border border-white/[0.08]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selected.imageUrl} alt="Scanned roof" className="h-44 w-full object-cover" />
          </div>
        )}

        <ScanResultView result={selected} />

        <button
          onClick={() => {
            removeScan(selected.id);
            setSelected(null);
          }}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-red-400/15 bg-red-500/[0.05] py-3 text-sm font-medium text-red-300/90 transition-colors hover:bg-red-500/[0.1]"
        >
          <TrashIcon className="h-4 w-4" />
          Delete this scan
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <header className="mb-6 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-glow-sm">
              <HomeIcon className="h-[18px] w-[18px] text-white" strokeWidth={2} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gradient">Roofely</h1>
          </div>
          <p className="mt-1 text-sm text-white/45">Your roof scan history</p>
        </div>
        {scans.length > 0 && (
          <button
            onClick={clearScans}
            className="text-xs font-medium text-white/40 transition-colors hover:text-red-300"
          >
            Clear all
          </button>
        )}
      </header>

      {/* New scan CTA */}
      <Link
        href="/scan"
        className="group mb-6 flex items-center gap-4 rounded-3xl border border-brand-400/25 bg-gradient-to-br from-brand-500/[0.16] via-brand-600/[0.07] to-transparent p-5 transition-all hover:border-brand-400/45"
      >
        <div className="icon-tile h-12 w-12">
          <ScanIcon className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-white">Scan a new roof</p>
          <p className="text-sm text-white/50">AI inspection in seconds</p>
        </div>
        <ChevronRightIcon className="h-5 w-5 text-brand-200 transition-transform group-hover:translate-x-1" />
      </Link>

      {/* History list */}
      {!ready ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-3xl bg-white/[0.04]" />
          ))}
        </div>
      ) : scans.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {scans.map((scan) => (
            <button
              key={scan.id}
              onClick={() => setSelected(scan)}
              className="glass flex w-full items-center gap-4 p-4 text-left transition-transform active:scale-[0.99]"
            >
              {scan.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={scan.imageUrl}
                  alt=""
                  className="h-14 w-14 shrink-0 rounded-2xl object-cover ring-1 ring-white/10"
                />
              ) : (
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/[0.04] text-white/40 ring-1 ring-inset ring-white/[0.08]">
                  <HomeIcon className="h-6 w-6" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className="text-sm font-bold tabular-nums"
                    style={{ color: scoreColor(scan.healthScore) }}
                  >
                    {scan.healthScore}
                  </span>
                  <span className="text-xs text-white/40">{scoreLabel(scan.healthScore)}</span>
                  <span className="text-xs text-white/25">·</span>
                  <span className="text-xs text-white/40">{timeAgo(scan.createdAt)}</span>
                </div>
                <p className="mt-0.5 truncate text-sm text-white/70">{scan.summary}</p>
                <p className="mt-1 text-xs text-white/40">
                  {scan.problems.length} {scan.problems.length === 1 ? "issue" : "issues"} detected
                </p>
              </div>
              <ChevronRightIcon className="h-4 w-4 shrink-0 text-white/30" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="glass mt-2 flex flex-col items-center px-6 py-12 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-3xl bg-white/[0.04] text-white/40 ring-1 ring-inset ring-white/[0.08]">
        <HomeIcon className="h-7 w-7" />
      </div>
      <p className="mt-4 font-semibold text-white">No scans yet</p>
      <p className="mt-1 max-w-[220px] text-sm text-white/50">
        Scan your first roof to see problems, costs, and fixes show up here.
      </p>
      <Link href="/scan" className="btn-primary mt-5">
        Start scanning
      </Link>
    </div>
  );
}
