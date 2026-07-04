"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ScanResult } from "@/lib/types";

const STORAGE_KEY = "roofely.scans.v1";

interface ScanStore {
  scans: ScanResult[];
  addScan: (scan: ScanResult) => void;
  removeScan: (id: string) => void;
  clearScans: () => void;
  getScan: (id: string) => ScanResult | undefined;
  ready: boolean;
}

const Ctx = createContext<ScanStore | null>(null);

export function ScanProvider({ children }: { children: React.ReactNode }) {
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setScans(JSON.parse(raw));
    } catch {
      /* ignore corrupt storage */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scans));
    } catch {
      /* storage full / unavailable — keep going in-memory */
    }
  }, [scans, ready]);

  const value: ScanStore = {
    scans,
    ready,
    addScan: (scan) => setScans((prev) => [scan, ...prev]),
    removeScan: (id) => setScans((prev) => prev.filter((s) => s.id !== id)),
    clearScans: () => setScans([]),
    getScan: (id) => scans.find((s) => s.id === id),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useScans() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useScans must be used within ScanProvider");
  return ctx;
}
