"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  uniform float uTime;

  varying vec2 vUv;
  varying float vDisp;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Slow, gentle rolling waves — premium ambient motion, no interaction.
    float wave =
        sin(pos.x * 1.8 + uTime * 0.32) * 0.030 +
        cos(pos.y * 1.5 - uTime * 0.24) * 0.024 +
        sin((pos.x + pos.y) * 1.1 + uTime * 0.18) * 0.016;

    pos.z += wave;
    vDisp = wave;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec3 uColorDeep;
  uniform vec3 uColorBase;
  uniform vec3 uColorGlow;

  varying vec2 vUv;
  varying float vDisp;

  void main() {
    // Depth gradient — far edge (top) sinks into darkness.
    vec3 base = mix(uColorBase, uColorDeep, smoothstep(0.1, 1.0, vUv.y));

    // Offset-row shingle / tile layout.
    float rows = 24.0;
    float cols = 16.0;
    float row = floor(vUv.y * rows);
    float off = mod(row, 2.0) * 0.5;
    vec2 cell = vec2(fract(vUv.x * cols + off), fract(vUv.y * rows));

    // Distance to nearest seam → glowing grid lines.
    float lineX = min(cell.x, 1.0 - cell.x);
    float lineY = min(cell.y, 1.0 - cell.y);
    float seam = min(lineX, lineY);
    float grid = smoothstep(0.05, 0.0, seam);
    float face = smoothstep(0.0, 0.22, seam);

    vec3 col = base * mix(0.82, 1.12, face);

    // Gentle pulsing glow on the seams — the only "animation".
    float pulse = 0.10 + 0.05 * sin(uTime * 0.5 + vUv.y * 5.0);
    col += uColorGlow * grid * pulse;

    // Soft light sweep drifting slowly up the roof for a premium sheen.
    float sweepPos = fract(uTime * 0.04);
    float sweep = exp(-pow((vUv.y - sweepPos) * 6.0, 2.0));
    col += uColorGlow * sweep * 0.12;

    // Faint shading from the rolling waves.
    col += uColorGlow * clamp(vDisp * 2.0, 0.0, 0.3) * 0.4;

    // Horizon fog into the distance.
    float fog = smoothstep(1.0, 0.32, vUv.y);
    col = mix(uColorDeep * 0.5, col, fog);

    // Gentle side vignette.
    float vig = smoothstep(0.0, 0.2, vUv.x) * smoothstep(1.0, 0.8, vUv.x);
    col *= mix(0.8, 1.0, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function Roof() {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorDeep: { value: new THREE.Color("#04060c") },
      uColorBase: { value: new THREE.Color("#0e1b33") },
      uColorGlow: { value: new THREE.Color("#2f78ff") },
    }),
    []
  );

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh rotation={[-1.12, 0, 0]} position={[0, -0.35, 0]} scale={[1.6, 1.6, 1.6]}>
      <planeGeometry args={[8, 8, 160, 160]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function RoofScene() {
  return (
    <Canvas
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
      camera={{ position: [0, 0.85, 3.0], fov: 62 }}
      style={{ width: "100%", height: "100%" }}
    >
      <color attach="background" args={["#04060c"]} />
      <Roof />
    </Canvas>
  );
}
