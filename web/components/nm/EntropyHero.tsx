"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const COUNT = 3600;
const CHAOS_HEX = ["#FF0055", "#00F0FF", "#CCFF00", "#FF6600"];
const BONE = new THREE.Color("#EDEAE3");

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Field() {
  const ref = useRef<THREE.Points>(null);
  const pointer = useRef(new THREE.Vector2(10, 10));
  const { size } = useThree();

  const { grid, noise, chaosColors } = useMemo(() => {
    const rand = mulberry32(20261112);
    const grid = new Float32Array(COUNT * 3);
    const noise = new Float32Array(COUNT * 3);
    const chaosColors: THREE.Color[] = [];
    const cols = 72;
    const spacing = 0.32;
    for (let i = 0; i < COUNT; i++) {
      const cx = (i % cols) - cols / 2;
      const cy = Math.floor(i / cols) - COUNT / cols / 2;
      grid[i * 3] = cx * spacing;
      grid[i * 3 + 1] = cy * spacing;
      grid[i * 3 + 2] = 0;
      const r = 7 + rand() * 5;
      const th = rand() * Math.PI * 2;
      const ph = rand() * Math.PI;
      noise[i * 3] = r * Math.sin(ph) * Math.cos(th);
      noise[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.55;
      noise[i * 3 + 2] = r * Math.cos(ph) * 0.5 - 2;
      chaosColors.push(new THREE.Color(CHAOS_HEX[i % CHAOS_HEX.length]));
    }
    return { grid, noise, chaosColors };
  }, []);

  const positions = useMemo(() => new Float32Array(grid), [grid]);
  // Estado convergido por defecto: con reduced-motion se renderiza un
  // fotograma estático ordenado (frameloop="demand", sin useFrame).
  const colors = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3] = BONE.r;
      arr[i * 3 + 1] = BONE.g;
      arr[i * 3 + 2] = BONE.b;
    }
    return arr;
  }, []);
  const tmp = useMemo(() => new THREE.Color(), []);

  useFrame(({ clock, pointer: p }) => {
    const pts = ref.current;
    if (!pts) return;
    pointer.current.set(p.x * (size.width / size.height), p.y);
    const t = clock.getElapsedTime();
    const idle = 0.32 + 0.18 * Math.sin(t * 0.24);
    const pos = pts.geometry.getAttribute("position") as THREE.BufferAttribute;
    const col = pts.geometry.getAttribute("color") as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    const carr = col.array as Float32Array;

    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3;
      const dx = grid[ix] - pointer.current.x * 8;
      const dy = grid[ix + 1] - pointer.current.y * 8;
      const near = Math.max(0, 1 - Math.hypot(dx, dy) / 4.5);
      const order = Math.min(1, idle + near * 0.9);
      const wob =
        Math.sin(t * 0.9 + grid[ix] * 0.6) *
        Math.cos(t * 0.7 + grid[ix + 1] * 0.6) *
        (1 - order) *
        0.35;
      arr[ix] = grid[ix] + (noise[ix] - grid[ix]) * (1 - order) + wob;
      arr[ix + 1] = grid[ix + 1] + (noise[ix + 1] - grid[ix + 1]) * (1 - order);
      arr[ix + 2] =
        grid[ix + 2] + (noise[ix + 2] - grid[ix + 2]) * (1 - order);
      tmp.copy(chaosColors[i]).lerp(BONE, order);
      carr[ix] = tmp.r;
      carr[ix + 1] = tmp.g;
      carr[ix + 2] = tmp.b;
    }
    pos.needsUpdate = true;
    col.needsUpdate = true;
    pts.rotation.z = t * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.055} vertexColors sizeAttenuation transparent opacity={0.92} depthWrite={false} />
    </points>
  );
}

/**
 * Hero 3D: un campo de puntos que resuelve ruido en retícula.
 * El puntero ordena lo que toca; quieto, el campo respira en caos parcial.
 */
export function EntropyHero({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion();
  return (
    <div className={className} aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 14], fov: 55 }}
        frameloop={reduced ? "demand" : "always"}
        gl={{ antialias: true, alpha: true }}
      >
        <Field />
      </Canvas>
    </div>
  );
}
