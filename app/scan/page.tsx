"use client";

import { useRef, useState } from "react";
import { useScans } from "@/components/ScanStore";
import ScanResultView from "@/components/ScanResultView";
import type { ScanApiResponse, ScanResult } from "@/lib/types";
import { CameraIcon, ScanIcon, AlertTriangleIcon } from "@/components/Icons";

type Phase = "idle" | "preview" | "scanning" | "done" | "error";

const SCAN_STEPS = [
  "Uploading photo…",
  "Detecting roof material…",
  "Inspecting shingles & flashing…",
  "Checking for leaks & wear…",
  "Estimating repair costs…",
  "Writing your report…",
];

export default function ScanPage() {
  const { addScan } = useScans();
  const fileRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string>("");
  const [step, setStep] = useState(0);

  async function handleFile(file: File) {
    const dataUrl = await downscaleImage(file, 1280, 0.82);
    setImage(dataUrl);
    setResult(null);
    setError("");
    setPhase("preview");
  }

  async function runScan() {
    if (!image) return;
    setPhase("scanning");
    setStep(0);

    // Animate the step labels while we wait on the API.
    const stepTimer = setInterval(() => {
      setStep((s) => Math.min(s + 1, SCAN_STEPS.length - 1));
    }, 1400);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });
      const data: ScanApiResponse = await res.json();

      if (!data.ok || !data.result) {
        throw new Error(data.error || "Something went wrong.");
      }

      const scan: ScanResult = {
        ...data.result,
        id:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : String(Date.now()),
        createdAt: Date.now(),
        imageUrl: image,
      };

      setResult(scan);
      addScan(scan);
      setPhase("done");
    } catch (e: any) {
      setError(e?.message || "Scan failed. Please try again.");
      setPhase("error");
    } finally {
      clearInterval(stepTimer);
    }
  }

  function reset() {
    setImage(null);
    setResult(null);
    setError("");
    setPhase("idle");
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div>
      <header className="mb-6">
        <p className="label-eyebrow">AI Roof Scanner</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-gradient">
          Scan your roof
        </h1>
        <p className="mt-1 text-sm text-white/45">
          Take or upload a clear photo of the roof. Our AI spots problems, costs, and fixes.
        </p>
      </header>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />

      {phase === "idle" && (
        <button
          onClick={() => fileRef.current?.click()}
          className="group flex w-full flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-white/[0.14] bg-white/[0.02] px-6 py-16 transition-all hover:border-brand-400/50 hover:bg-brand-500/[0.04]"
        >
          <div className="icon-tile relative h-20 w-20 rounded-3xl transition-transform group-hover:scale-105">
            <span className="absolute inset-0 animate-pulse-glow rounded-3xl" />
            <CameraIcon className="relative h-9 w-9" strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <p className="font-semibold text-white">Take or upload a photo</p>
            <p className="mt-1 text-sm text-white/45">Tap to open camera or gallery</p>
          </div>
        </button>
      )}

      {(phase === "preview" || phase === "scanning") && image && (
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.08]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="Roof to scan" className="h-64 w-full object-cover" />
            {phase === "scanning" && <ScanOverlay />}
          </div>

          {phase === "preview" && (
            <div className="flex gap-3">
              <button onClick={reset} className="btn-ghost flex-1">
                Retake
              </button>
              <button onClick={runScan} className="btn-primary flex-1">
                <ScanIcon className="h-5 w-5" strokeWidth={2} />
                Analyze roof
              </button>
            </div>
          )}

          {phase === "scanning" && (
            <div className="glass flex items-center gap-3 p-4">
              <Spinner />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{SCAN_STEPS[step]}</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-700"
                    style={{ width: `${((step + 1) / SCAN_STEPS.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {phase === "error" && (
        <div className="space-y-4">
          <div className="glass flex flex-col items-center border-red-400/15 px-6 py-8 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-red-500/15 text-red-300 ring-1 ring-inset ring-red-400/25">
              <AlertTriangleIcon className="h-7 w-7" />
            </div>
            <p className="mt-3 font-semibold text-white">Scan failed</p>
            <p className="mt-1 text-sm text-white/55">{error}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={reset} className="btn-ghost flex-1">
              Start over
            </button>
            <button onClick={runScan} className="btn-primary flex-1">
              Try again
            </button>
          </div>
        </div>
      )}

      {phase === "done" && result && (
        <div className="space-y-5">
          <ScanResultView result={result} />
          <button onClick={reset} className="btn-primary w-full">
            Scan another roof
          </button>
        </div>
      )}
    </div>
  );
}

function ScanOverlay() {
  return (
    <div className="absolute inset-0 bg-ink-950/30">
      {/* moving scan line */}
      <div
        className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-brand-400/30 to-transparent"
        style={{
          animation: "scanline 1.8s ease-in-out infinite",
        }}
      />
      <div className="absolute inset-3 rounded-2xl border border-brand-400/40" />
      <style>{`
        @keyframes scanline {
          0% { top: 0%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="h-6 w-6 animate-spin text-brand-300" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-90" d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** Resize + compress an image file into a JPEG data URL to keep uploads small. */
async function downscaleImage(file: File, maxDim: number, quality: number): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close?.();
    return await fileToDataUrl(file);
  }
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();
  return canvas.toDataURL("image/jpeg", quality);
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
