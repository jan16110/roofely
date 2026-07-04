"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScanIcon, ClockIcon, WrenchIcon } from "./Icons";

const tabs = [
  { href: "/scan", label: "Scan", Icon: ScanIcon },
  { href: "/", label: "History", Icon: ClockIcon },
  { href: "/services", label: "Services", Icon: WrenchIcon },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-5 pb-[max(1.1rem,env(safe-area-inset-bottom))]">
      <div className="glass-strong pointer-events-auto mx-auto flex items-center justify-between gap-1 rounded-[26px] px-2.5 py-2">
        {tabs.map(({ href, label, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`group relative flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 transition-all duration-200 ${
                active ? "text-white" : "text-white/40 hover:text-white/75"
              }`}
            >
              {active && (
                <span className="absolute inset-0 rounded-2xl bg-gradient-to-b from-brand-500/25 to-brand-600/[0.08] ring-1 ring-inset ring-brand-400/30" />
              )}
              <Icon
                className={`relative h-[21px] w-[21px] ${active ? "text-brand-200" : ""}`}
              />
              <span className="relative text-[11px] font-semibold tracking-wide">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
