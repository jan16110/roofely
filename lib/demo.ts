import type { RoofProblem } from "./types";

const POOL: RoofProblem[] = [
  {
    title: "Cracked & curling shingles",
    severity: "medium",
    description:
      "Several shingles on the south-facing slope are curling at the edges and show surface cracks. This lets water creep underneath and accelerates granule loss, shortening the roof's life.",
    location: "South-facing slope, mid-section",
    diyPossible: true,
    estimatedCost: { min: 40, max: 180 },
    howToFix: [
      "Wait for a dry, mild day and set up a stable ladder with a spotter.",
      "Gently lift the curled shingle and apply a quarter-sized dab of roofing sealant underneath.",
      "Press it flat and weigh it down briefly until it sets.",
      "For cracked shingles, slide roofing cement into the crack and smooth it over, then sprinkle matching granules on top.",
    ],
    toolsNeeded: ["Roofing sealant/cement", "Caulk gun", "Putty knife", "Ladder", "Work gloves"],
  },
  {
    title: "Damaged flashing around chimney",
    severity: "high",
    description:
      "The metal flashing where the chimney meets the roof is lifting and the sealant has degraded. This is one of the most common sources of interior leaks.",
    location: "Chimney base",
    diyPossible: false,
    estimatedCost: { min: 300, max: 900 },
    howToFix: [],
    toolsNeeded: [],
    whenToCallPro:
      "Re-flashing requires removing shingles, bending custom step flashing, and watertight masonry sealing. Done wrong it causes hidden leaks and rot, so a roofer should handle it.",
  },
  {
    title: "Clogged gutters",
    severity: "low",
    description:
      "Debris and granule buildup are visible in the gutters. Clogged gutters cause water to back up under the roof edge and can damage fascia boards.",
    location: "Front eaves",
    diyPossible: true,
    estimatedCost: { min: 0, max: 30 },
    howToFix: [
      "Set up a stable ladder and scoop out leaves and debris by hand (wear gloves).",
      "Flush the gutters with a garden hose and check that water drains freely.",
      "Confirm downspouts aren't blocked.",
      "Consider adding gutter guards to reduce future buildup.",
    ],
    toolsNeeded: ["Ladder", "Gloves", "Garden hose", "Gutter scoop or trowel"],
  },
  {
    title: "Moss & algae growth",
    severity: "low",
    description:
      "Dark streaks and green moss patches are growing on the shaded north slope. Moss retains moisture against the shingles and can lift them over time.",
    location: "North-facing slope",
    diyPossible: true,
    estimatedCost: { min: 15, max: 60 },
    howToFix: [
      "Mix a 50/50 solution of water and household white vinegar (avoid pressure washing — it strips granules).",
      "Spray the affected areas and let it sit 20–30 minutes.",
      "Rinse gently with low-pressure water from the top down.",
      "Install zinc or copper strips near the ridge to prevent regrowth.",
    ],
    toolsNeeded: ["Garden sprayer", "White vinegar", "Soft brush", "Zinc strips (optional)"],
  },
  {
    title: "Exposed / popped nails",
    severity: "medium",
    description:
      "A few roofing nails have backed out and are exposed. Exposed nail holes are small but direct entry points for water.",
    location: "Ridge line",
    diyPossible: true,
    estimatedCost: { min: 10, max: 40 },
    howToFix: [
      "Locate each raised or backed-out nail.",
      "Either hammer it back flush or remove and replace with a slightly larger roofing nail.",
      "Cover every nail head with a dab of roofing sealant.",
    ],
    toolsNeeded: ["Hammer", "Roofing nails", "Roofing sealant", "Ladder"],
  },
  {
    title: "Sagging roof deck section",
    severity: "critical",
    description:
      "A noticeable dip in the roofline suggests possible decking or structural deterioration underneath, often from long-term water damage. This needs prompt attention.",
    location: "Rear slope, near valley",
    diyPossible: false,
    estimatedCost: { min: 1200, max: 4500 },
    howToFix: [],
    toolsNeeded: [],
    whenToCallPro:
      "Sagging points to compromised decking or rafters and is a structural/safety issue. A licensed roofer or structural contractor must inspect and rebuild the affected area.",
  },
];

export function demoResult() {
  // Pick a varied but realistic subset each time.
  const shuffled = [...POOL].sort(() => Math.random() - 0.5);
  const count = 2 + Math.floor(Math.random() * 3); // 2–4 problems
  const problems = shuffled.slice(0, count);

  // Health score loosely reflects severity of chosen problems.
  const penalty = problems.reduce((s, p) => {
    const w = { low: 6, medium: 12, high: 20, critical: 32 }[p.severity];
    return s + w;
  }, 0);
  const healthScore = Math.max(28, Math.min(96, 100 - penalty));

  return {
    summary:
      problems.some((p) => p.severity === "critical")
        ? "Your roof has a serious issue that needs prompt professional attention, along with a few smaller fixes."
        : "Your roof is in fair shape overall with a handful of maintenance items worth addressing soon.",
    healthScore,
    roofType: "Asphalt shingle",
    problems,
    demo: true,
  };
}
