"use client";

import { useEffect, useRef, useState } from "react";
import {
  ShaderMount,
  defaultPatternSizing,
  ShaderFitOptions,
  getShaderColorFromString,
  getShaderNoiseTexture,
  warpFragmentShader,
  WarpPatterns,
  type WarpUniforms,
} from "@paper-design/shaders";
import { HERO_ART, type HeroArtPreset } from "@/components/nm/v2/hero-preset";

export function HeroWarp({
  animate = false,
  capture = false,
  preset = HERO_ART,
}: {
  animate?: boolean;
  capture?: boolean;
  /** Art preset; remount (key) to change — uniforms freeze at construction. */
  preset?: HeroArtPreset;
}) {
  const host = useRef<HTMLDivElement>(null);
  const mount = useRef<ShaderMount | null>(null);
  const pointerPoint = useRef({
    x: preset.params.offsetX ?? 0,
    y: preset.params.offsetY ?? 0,
  });
  const latestAnimate = useRef(animate);
  const failed = useRef(false);
  const [status, setStatus] = useState<"pending" | "ready" | "failed">("pending");

  useEffect(() => {
    latestAnimate.current = animate;
    mount.current?.setSpeed(animate && !capture ? preset.params.speed : 0);
  }, [animate, capture, preset]);

  useEffect(() => {
    const currentHost = host.current;
    if (!currentHost || failed.current) return;
    const element = currentHost;
    setStatus("pending");
    let disposed = false;
    let instance: ShaderMount | undefined;
    const existingCanvases = new Set(element.querySelectorAll(":scope > canvas"));

    function cleanup() {
      disposed = true;
      element.removeEventListener("webglcontextlost", lost, true);
      element.removeEventListener("webglcontextcreationerror", lost, true);
      if (mount.current === instance) mount.current = null;
      instance?.dispose();
      instance = undefined;
      // A throwing constructor can prepend a canvas without returning a mount.
      // Never clear the host or touch another component's DOM.
      for (const canvas of element.querySelectorAll(":scope > canvas")) {
        if (!existingCanvases.has(canvas)) canvas.remove();
      }
    }

    function fail(error: unknown) {
      if (disposed || failed.current) return;
      failed.current = true;
      setStatus("failed");
      console.warn(
        "Orbital WebGL art unavailable; using the local poster. Check WebGL2/GPU support and the Paper shader error before retrying on reload.",
        error,
      );
      cleanup();
    }

    function lost(event: Event) {
      fail(new Error(`Orbital canvas reported ${event.type}.`));
    }

    // Capture phase handles the non-bubbling canvas context events locally.
    // Register before the constructor requests the REAL canvas context.
    element.addEventListener("webglcontextlost", lost, true);
    element.addEventListener("webglcontextcreationerror", lost, true);

    async function initialize() {
      try {
        const p = { ...defaultPatternSizing, ...preset.params };
        const noise = getShaderNoiseTexture();
        if (!noise) throw new Error("Paper noise texture is unavailable.");
        await noise.decode();
        if (disposed) return;
        const colors = p.colors ?? HERO_ART.params.colors;
        const uniforms = {
          u_colors: colors.map(getShaderColorFromString),
          u_colorsCount: colors.length,
          u_proportion: p.proportion ?? 0.5,
          u_softness: p.softness ?? 0,
          u_distortion: p.distortion ?? 0,
          u_swirl: p.swirl ?? 0,
          u_swirlIterations: p.swirlIterations ?? 1,
          u_shapeScale: p.shapeScale ?? 1,
          u_shape: WarpPatterns[p.shape ?? "stripes"],
          u_noiseTexture: noise,
          u_scale: p.scale,
          u_rotation: p.rotation,
          u_fit: ShaderFitOptions[p.fit],
          u_offsetX: p.offsetX,
          u_offsetY: p.offsetY,
          u_originX: p.originX,
          u_originY: p.originY,
          u_worldWidth: p.worldWidth,
          u_worldHeight: p.worldHeight,
        } satisfies WarpUniforms;
        pointerPoint.current.x = p.offsetX ?? 0;
        pointerPoint.current.y = p.offsetY ?? 0;
        const created = new ShaderMount(
          element,
          warpFragmentShader,
          uniforms,
          capture ? { preserveDrawingBuffer: true } : undefined,
          0,
          p.frame,
          p.minPixelRatio,
          p.maxPixelCount,
        );
        // A context event may have synchronously failed during construction.
        if (disposed) {
          created.dispose();
          return;
        }
        instance = created;
        mount.current = created;
        created.setSpeed(latestAnimate.current && !capture ? p.speed : 0);
        setStatus("ready");
      } catch (error) {
        fail(error);
      }
    }

    void initialize();
    return cleanup;
  }, [capture, preset]);

  // Pointer steering: one reusable tween eases the shader offset by at most
  // ±0.03 around the frozen canonical values. Attached to .nm2-hero so no
  // overlay ever intercepts the real hit targets.
  useEffect(() => {
    if (status !== "ready" || !animate || capture) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const hero = host.current?.closest<HTMLElement>(".nm2-hero");
    if (!hero || !fine.matches) return;

    let disposed = false;
    let context: { kill: () => void } | undefined;
    let detach: (() => void) | undefined;
    const stop = () => {
      detach?.();
      context?.kill();
    };

    void import("gsap")
      .then(({ gsap }) => {
        if (disposed) return;
        const scoped = gsap.context(() => {}, hero);
        context = scoped;
        scoped.add(() => {
          const base = {
            x: preset.params.offsetX ?? 0,
            y: preset.params.offsetY ?? 0,
          };
          const point = pointerPoint.current;
          const apply = () => {
            if (!document.hidden) {
              mount.current?.setUniforms({
                u_offsetX: point.x,
                u_offsetY: point.y,
              });
            }
          };
          const tween = gsap.to(point, {
            x: point.x,
            y: point.y,
            duration: 0.9,
            ease: "power2.out",
            paused: true,
            onUpdate: apply,
          });
          const steer = (x: number, y: number) => {
            if (disposed) return;
            tween.vars.x = x;
            tween.vars.y = y;
            tween.invalidate().restart();
          };
          const move = (event: PointerEvent) => {
            if (
              disposed ||
              !fine.matches ||
              event.pointerType === "touch" ||
              document.hidden
            )
              return;
            const rect = hero.getBoundingClientRect();
            if (rect.width <= 0 || rect.height <= 0) return;
            const nx = Math.max(
              -1,
              Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1),
            );
            const ny = Math.max(
              -1,
              Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1),
            );
            steer(base.x + nx * 0.03, base.y + ny * 0.03);
          };
          const reset = () => {
            if (!disposed && fine.matches && !document.hidden)
              steer(base.x, base.y);
          };
          detach = () => {
            hero.removeEventListener("pointermove", move);
            hero.removeEventListener("pointerleave", reset);
            hero.removeEventListener("pointercancel", reset);
            tween.kill();
          };
          hero.addEventListener("pointermove", move, { passive: true });
          hero.addEventListener("pointerleave", reset, { passive: true });
          hero.addEventListener("pointercancel", reset, { passive: true });
        });
      })
      .catch((error: unknown) => {
        stop();
        if (disposed) return;
        console.warn(
          "Orbital pointer steering unavailable; check the GSAP chunk before reloading. Ambient shader animation remains available.",
          error,
        );
      });

    return () => {
      disposed = true;
      stop();
    };
  }, [status, animate, capture, preset]);

  if (status === "failed") return null;

  return (
    <div
      ref={host}
      className="nm2-hero-art__warp"
      data-art-ready={status === "ready" ? "true" : undefined}
    />
  );
}

/** Development-only art plate: the same preset, without text or reading scrim. */
export function HeroArtPlate() {
  return (
    <div className="nm2-hero-art-plate" data-art-preset={HERO_ART.id}>
      <HeroWarp capture />
      <div className="nm2-hero-art__grain" />
    </div>
  );
}
