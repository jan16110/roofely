"use client";

import dynamic from "next/dynamic";

// The WebGL scene must never render on the server.
const RoofScene = dynamic(() => import("./RoofScene"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 -z-10 bg-gradient-to-b from-ink-950 via-ink-900 to-black" />
  ),
});

export default function RoofBackground() {
  return (
    <div
      className="fixed inset-0 -z-10"
      // Let every tap fall through to the UI; we capture clicks globally.
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      <RoofScene />
    </div>
  );
}
