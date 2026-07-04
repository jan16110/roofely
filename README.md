# 🏠 Roofely

**AI-powered roof scanner** with a living, morphing 3D roof background. Snap a photo of any roof and Roofely tells you what's wrong, whether you can fix it yourself, what it'll cost, how to do it — and if you can't, who to call.

Dark premium UI · blue accents · interactive WebGL roof that ripples wherever you tap.

---

## Features

- **📷 AI Roof Scan** — upload or snap a roof photo; GPT‑4o vision returns a structured inspection report.
- **🩺 Health score** — every roof gets a 0–100 condition score with an animated ring.
- **🔧 Fix it yourself** — DIY problems come with step‑by‑step instructions, tools, and a materials cost.
- **👷 Find a pro** — problems that need an expert get curated links to Angi, Thumbtack, HomeAdvisor & local search.
- **🕘 History** — every scan is saved locally so you can revisit problems and costs.
- **🌊 Morphing 3D roof** — a custom GLSL shader roof reacts to *every* tap with an expanding ripple.
- **🧪 Demo mode** — runs without an API key and returns realistic sample reports.

## Three tabs

| Tab | Route | What it does |
|-----|-------|--------------|
| **Scan** (bottom‑left) | `/scan` | Capture/upload a roof photo and run the AI analysis |
| **History** (center, home) | `/` | Your past scans, scores, and detected problems |
| **Services** (right) | `/services` | Find roofers, browse by service, emergency help |

---

## Getting started

### 1. Add your OpenAI key

Open the **`.env`** file in the project root and paste your key:

```env
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4o
```

Get a key at <https://platform.openai.com/api-keys>.
> No key? The app still runs in **demo mode** with realistic sample results.

### 2. Install & run

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. For the best experience, use your browser's mobile/device view (the app is phone‑sized).

### 3. Build for production

```bash
npm run build
npm start
```

---

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** — dark premium theme
- **Three.js** + **@react-three/fiber** — custom shader roof background
- **OpenAI** (`gpt-4o` vision) — roof analysis, called server‑side so your key never reaches the browser

## How it works

1. The Scan page downsizes your photo in‑browser and POSTs it to `/api/scan`.
2. The API route sends the image to GPT‑4o with a strict inspector prompt and gets back JSON.
3. The result is validated, scored, rendered as cards, and saved to your local history.

## Project structure

```
app/
  layout.tsx          # shell: 3D background + nav + scan store
  page.tsx            # History (home)
  scan/page.tsx       # Scan flow
  services/page.tsx   # Find a pro
  api/scan/route.ts   # OpenAI vision endpoint (+ demo fallback)
components/
  RoofBackground.tsx  # client wrapper (no SSR)
  RoofScene.tsx       # the morphing GLSL roof
  BottomNav.tsx       # three-tab nav
  ScanStore.tsx       # localStorage history context
  ScanResultView.tsx  # report layout
  ProblemCard.tsx     # expandable problem + DIY/pro details
  HealthRing.tsx      # animated score ring
lib/
  types.ts  format.ts  pros.ts  demo.ts
```

> ⚠️ Roofely gives AI guidance for convenience. Always confirm estimates and safety with a licensed professional before major roof work.
