export type Severity = "low" | "medium" | "high" | "critical";

export interface RoofProblem {
  /** Short problem name, e.g. "Cracked shingles". */
  title: string;
  severity: Severity;
  /** Plain-language description of what's wrong and why it matters. */
  description: string;
  /** Where on the roof it appears. */
  location?: string;
  /** Can a reasonably handy homeowner fix this safely themselves? */
  diyPossible: boolean;
  /** Estimated repair cost range in USD. */
  estimatedCost: { min: number; max: number };
  /** Ordered DIY steps (empty if not DIY-able). */
  howToFix: string[];
  /** Tools / materials needed for the DIY fix. */
  toolsNeeded: string[];
  /** Why a pro is recommended, if applicable. */
  whenToCallPro?: string;
}

export interface ScanResult {
  id: string;
  createdAt: number;
  /** Data URL of the scanned photo (kept locally for the history view). */
  imageUrl?: string;
  /** One-line overall summary. */
  summary: string;
  /** 0–100 health score (100 = pristine). */
  healthScore: number;
  /** Detected roof material, if identifiable. */
  roofType?: string;
  problems: RoofProblem[];
  /** True when produced without a real API key (or as a fallback). */
  demo?: boolean;
  /** Optional reason shown in the demo banner (e.g. quota/billing issue). */
  note?: string;
}

export interface ScanApiResponse {
  ok: boolean;
  result?: Omit<ScanResult, "id" | "createdAt" | "imageUrl">;
  error?: string;
}
