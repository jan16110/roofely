"use client";

import { useState } from "react";
import type { RoofProblem } from "@/lib/types";
import { formatCost, severityMeta } from "@/lib/format";
import { proLinksFor } from "@/lib/pros";
import {
  CashIcon,
  WrenchIcon,
  HardHatIcon,
  ExternalIcon,
  ChevronDownIcon,
} from "./Icons";

export default function ProblemCard({ problem }: { problem: RoofProblem }) {
  const [open, setOpen] = useState(false);
  const sev = severityMeta[problem.severity];
  const pros = problem.diyPossible ? [] : proLinksFor(problem.title);

  return (
    <div className="glass overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start gap-3 p-4 text-left"
      >
        <span className={`mt-[7px] h-2 w-2 shrink-0 rounded-full ${sev.dot}`} />
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold leading-tight text-white">{problem.title}</h3>
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${sev.text} ${sev.bg} ${sev.ring}`}
            >
              {sev.label}
            </span>
          </div>
          {problem.location && (
            <p className="mt-0.5 text-xs text-white/40">{problem.location}</p>
          )}
          <p className="mt-1.5 text-sm leading-relaxed text-white/60 line-clamp-2">
            {problem.description}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="chip whitespace-nowrap">
              <CashIcon className="h-3.5 w-3.5" />
              {formatCost(problem.estimatedCost.min, problem.estimatedCost.max)}
            </span>
            {problem.diyPossible ? (
              <span className="chip text-emerald-300 ring-emerald-400/20">
                <WrenchIcon className="h-3.5 w-3.5" /> DIY-friendly
              </span>
            ) : (
              <span className="chip text-brand-200">
                <HardHatIcon className="h-3.5 w-3.5" /> Pro recommended
              </span>
            )}
            <span className="ml-auto text-white/40">
              <ChevronDownIcon
                className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              />
            </span>
          </div>
        </div>
      </button>

      {open && (
        <div className="animate-fade-up border-t border-white/[0.07] px-4 pb-4 pt-3">
          <p className="text-sm leading-relaxed text-white/70">{problem.description}</p>

          {problem.diyPossible && problem.howToFix.length > 0 && (
            <div className="mt-4">
              <h4 className="label-eyebrow mb-2">How to fix it yourself</h4>
              <ol className="space-y-2">
                {problem.howToFix.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm text-white/75">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-500/20 text-[11px] font-bold text-brand-200 ring-1 ring-inset ring-brand-400/30">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {problem.diyPossible && problem.toolsNeeded.length > 0 && (
            <div className="mt-4">
              <h4 className="label-eyebrow mb-2">You'll need</h4>
              <div className="flex flex-wrap gap-2">
                {problem.toolsNeeded.map((tool, i) => (
                  <span key={i} className="chip">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {!problem.diyPossible && (
            <div className="mt-4">
              {problem.whenToCallPro && (
                <div className="mb-3 rounded-2xl border border-brand-400/20 bg-brand-500/[0.07] p-3">
                  <p className="text-sm leading-relaxed text-brand-100/90">
                    <span className="font-semibold">Why a pro: </span>
                    {problem.whenToCallPro}
                  </p>
                </div>
              )}
              <h4 className="label-eyebrow mb-2">Find a pro near you</h4>
              <div className="grid grid-cols-2 gap-2">
                {pros.map((p) => (
                  <a
                    key={p.name}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3 transition-colors hover:border-brand-400/40 hover:bg-brand-500/[0.06]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{p.name}</span>
                      <ExternalIcon className="h-3.5 w-3.5 text-white/40 transition-colors group-hover:text-brand-300" />
                    </div>
                    <p className="mt-1 text-[11px] leading-snug text-white/45">{p.blurb}</p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
