"use client";

import { useMemo } from "react";
import { useScans } from "@/components/ScanStore";
import { proLinksFor } from "@/lib/pros";
import { severityMeta, formatCost } from "@/lib/format";
import {
  SearchIcon,
  DropletIcon,
  LayersIcon,
  CloudRainIcon,
  ZapIcon,
  HomeIcon,
  AlertTriangleIcon,
  ExternalIcon,
  ChevronRightIcon,
} from "@/components/Icons";

const DIRECTORIES = [
  {
    name: "Angi",
    blurb: "Vetted local roofers, reviews and instant quotes",
    url: "https://www.angi.com/companylist/roofing.htm",
  },
  {
    name: "Thumbtack",
    blurb: "Compare pros and request fast estimates",
    url: "https://www.thumbtack.com/k/roof-repair/near-me/",
  },
  {
    name: "HomeAdvisor",
    blurb: "Pre-screened roofing professionals",
    url: "https://www.homeadvisor.com/c.Roofing.html",
  },
  {
    name: "Networx",
    blurb: "Get matched with up to 4 local roofers",
    url: "https://www.networx.com/roofing",
  },
];

const CATEGORIES = [
  { label: "Roof inspection", q: "roof inspection", Icon: SearchIcon },
  { label: "Leak repair", q: "roof leak repair", Icon: DropletIcon },
  { label: "Shingle replacement", q: "shingle replacement", Icon: LayersIcon },
  { label: "Gutter service", q: "gutter cleaning repair", Icon: CloudRainIcon },
  { label: "Flashing repair", q: "roof flashing repair", Icon: ZapIcon },
  { label: "Full replacement", q: "roof replacement", Icon: HomeIcon },
];

export default function ServicesPage() {
  const { scans } = useScans();

  // Pull the pro-recommended problems from the latest scan, if any.
  const proIssues = useMemo(() => {
    const latest = scans[0];
    if (!latest) return [];
    return latest.problems.filter((p) => !p.diyPossible);
  }, [scans]);

  return (
    <div>
      <header className="mb-6">
        <p className="label-eyebrow">Get it fixed</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-gradient">Services</h1>
        <p className="mt-1 text-sm text-white/45">
          Connect with trusted roofing professionals near you.
        </p>
      </header>

      {/* Emergency banner */}
      <a
        href="https://www.google.com/search?q=emergency+roof+repair+24+hour+near+me"
        target="_blank"
        rel="noopener noreferrer"
        className="group mb-6 flex items-center gap-4 rounded-3xl border border-red-400/20 bg-gradient-to-br from-red-500/[0.12] to-transparent p-4 transition-colors hover:border-red-400/40"
      >
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-red-500/20 text-red-200 ring-1 ring-inset ring-red-400/30">
          <AlertTriangleIcon className="h-[22px] w-[22px]" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-white">Active leak or storm damage?</p>
          <p className="text-sm text-white/50">Find 24/7 emergency roofers now</p>
        </div>
        <ChevronRightIcon className="h-5 w-5 shrink-0 text-white/35 transition-transform group-hover:translate-x-0.5" />
      </a>

      {/* Tailored to your scan */}
      {proIssues.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 px-1 text-sm font-semibold text-white/80">
            For your latest scan
          </h2>
          <div className="space-y-3">
            {proIssues.map((p, i) => {
              const sev = severityMeta[p.severity];
              const pros = proLinksFor(p.title);
              return (
                <div key={i} className="glass p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${sev.dot}`} />
                      <h3 className="font-semibold text-white">{p.title}</h3>
                    </div>
                    <span className="chip whitespace-nowrap">
                      {formatCost(p.estimatedCost.min, p.estimatedCost.max)}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {pros.slice(0, 3).map((pl) => (
                      <a
                        key={pl.name}
                        href={pl.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/80 transition-colors hover:border-brand-400/40 hover:text-white"
                      >
                        {pl.name}
                        <ExternalIcon className="h-3 w-3 text-white/40" />
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Browse by service */}
      <section className="mb-6">
        <h2 className="mb-3 px-1 text-sm font-semibold text-white/80">Browse by service</h2>
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map(({ label, q, Icon }) => (
            <a
              key={label}
              href={`https://www.google.com/search?q=${encodeURIComponent(q + " near me")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="glass flex items-center gap-3 p-4 transition-all hover:border-brand-400/30 active:scale-[0.98]"
            >
              <span className="icon-tile h-9 w-9 rounded-xl">
                <Icon className="h-[17px] w-[17px]" />
              </span>
              <span className="text-[13px] font-medium leading-snug text-white/85">
                {label}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Directories */}
      <section>
        <h2 className="mb-3 px-1 text-sm font-semibold text-white/80">Trusted directories</h2>
        <div className="space-y-3">
          {DIRECTORIES.map((d) => (
            <a
              key={d.name}
              href={d.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass group flex items-center gap-4 p-4 transition-all hover:border-brand-400/30"
            >
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/[0.05] text-base font-semibold text-white ring-1 ring-inset ring-white/10">
                {d.name[0]}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white">{d.name}</p>
                <p className="text-sm text-white/50">{d.blurb}</p>
              </div>
              <ExternalIcon className="h-4 w-4 shrink-0 text-white/35 transition-colors group-hover:text-brand-300" />
            </a>
          ))}
        </div>
      </section>

      <p className="mt-6 px-2 text-center text-[11px] leading-relaxed text-white/30">
        Roofely is an AI assistant for guidance only. Always confirm estimates and
        safety with a licensed professional before major work.
      </p>
    </div>
  );
}
