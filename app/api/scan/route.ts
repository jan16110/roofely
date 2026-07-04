import { NextResponse } from "next/server";
import OpenAI from "openai";
import type { ScanApiResponse, RoofProblem } from "@/lib/types";
import { demoResult } from "@/lib/demo";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM_PROMPT = `You are Roofely, an expert residential roof inspector with 25 years of field experience across asphalt shingle, metal, tile, slate, wood shake, and flat/membrane roofs.

You are shown a single photo of a roof. Analyze it carefully and identify real, visible problems. Be specific and practical. For each problem, decide honestly whether a reasonably handy homeowner can fix it safely from a ladder/roof, or whether it truly needs a licensed professional (steep pitch, structural issues, electrical near the roof, large areas, height/safety risk, specialized materials).

Cost estimates should be realistic US dollar ranges for that single repair (materials + typical labor if a pro is needed; materials only if DIY).

Respond with ONLY a valid JSON object (no markdown, no prose) of exactly this shape:
{
  "summary": "one or two sentence plain-language overview of the roof's condition",
  "healthScore": <integer 0-100, 100 = pristine>,
  "roofType": "<detected roof material, e.g. 'Asphalt shingle'>",
  "problems": [
    {
      "title": "short problem name",
      "severity": "low" | "medium" | "high" | "critical",
      "description": "what is wrong, why it matters, and what happens if ignored",
      "location": "where on the roof",
      "diyPossible": true | false,
      "estimatedCost": { "min": <number>, "max": <number> },
      "howToFix": ["step 1", "step 2", ...],
      "toolsNeeded": ["tool/material 1", ...],
      "whenToCallPro": "if not DIY, why a professional is needed (omit or empty if DIY)"
    }
  ]
}

Rules:
- If the roof looks healthy, return an empty "problems" array and a high healthScore.
- If diyPossible is false, leave "howToFix" and "toolsNeeded" as empty arrays and fill "whenToCallPro".
- If diyPossible is true, provide clear, safe, ordered steps and required tools, and omit "whenToCallPro".
- Never invent problems that aren't visible. Aim for 0-6 problems.
- Output JSON only.`;

function coerceProblem(p: any): RoofProblem {
  const sev = ["low", "medium", "high", "critical"].includes(p?.severity)
    ? p.severity
    : "medium";
  return {
    title: String(p?.title ?? "Unidentified issue"),
    severity: sev,
    description: String(p?.description ?? ""),
    location: p?.location ? String(p.location) : undefined,
    diyPossible: Boolean(p?.diyPossible),
    estimatedCost: {
      min: Number(p?.estimatedCost?.min) || 0,
      max: Number(p?.estimatedCost?.max) || 0,
    },
    howToFix: Array.isArray(p?.howToFix) ? p.howToFix.map(String) : [],
    toolsNeeded: Array.isArray(p?.toolsNeeded) ? p.toolsNeeded.map(String) : [],
    whenToCallPro: p?.whenToCallPro ? String(p.whenToCallPro) : undefined,
  };
}

export async function POST(req: Request) {
  let image: string | undefined;
  try {
    const body = await req.json();
    image = body?.image;
  } catch {
    return NextResponse.json<ScanApiResponse>(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  if (!image || typeof image !== "string") {
    return NextResponse.json<ScanApiResponse>(
      { ok: false, error: "No image provided." },
      { status: 400 }
    );
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();

  // No key → demo mode so the app is fully explorable.
  if (!apiKey) {
    return NextResponse.json<ScanApiResponse>({ ok: true, result: demoResult() });
  }

  try {
    const openai = new OpenAI({ apiKey });
    const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o";

    const completion = await openai.chat.completions.create({
      model,
      temperature: 0.3,
      max_tokens: 1800,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this roof photo and return the JSON report.",
            },
            { type: "image_url", image_url: { url: image, detail: "high" } },
          ],
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw);

    const result = {
      summary: String(parsed?.summary ?? "Roof analysis complete."),
      healthScore: Math.max(
        0,
        Math.min(100, Math.round(Number(parsed?.healthScore) || 70))
      ),
      roofType: parsed?.roofType ? String(parsed.roofType) : undefined,
      problems: Array.isArray(parsed?.problems)
        ? parsed.problems.map(coerceProblem)
        : [],
    };

    return NextResponse.json<ScanApiResponse>({ ok: true, result });
  } catch (err: any) {
    const status = err?.status;
    const code = err?.code || err?.error?.code;

    // Account-level issues (bad key / no quota / billing): fall back to a
    // clearly-labeled sample so the app stays usable, with an honest note.
    if (status === 401 || status === 429 || code === "insufficient_quota") {
      const note =
        status === 401
          ? "Your OpenAI API key looks invalid — showing a sample result."
          : "Your OpenAI account is out of quota/credits — showing a sample result. Add billing at platform.openai.com to enable real scans.";
      return NextResponse.json<ScanApiResponse>({
        ok: true,
        result: { ...demoResult(), note },
      });
    }

    const msg = err?.message || "Analysis failed.";
    return NextResponse.json<ScanApiResponse>(
      { ok: false, error: `Could not analyze the photo: ${msg}` },
      { status: 500 }
    );
  }
}
