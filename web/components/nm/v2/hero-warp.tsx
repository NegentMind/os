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
import { HERO_ART } from "@/components/nm/v2/hero-preset";

export function HeroWarp({
  animate = false,
  capture = false,
}: {
  animate?: boolean;
  capture?: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const mount = useRef<ShaderMount | null>(null);
  const latestAnimate = useRef(animate);
  const failed = useRef(false);
  const [status, setStatus] = useState<"pending" | "ready" | "failed">("pending");

  useEffect(() => {
    latestAnimate.current = animate;
    mount.current?.setSpeed(animate && !capture ? HERO_ART.params.speed : 0);
  }, [animate, capture]);

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
        const p = { ...defaultPatternSizing, ...HERO_ART.params };
        const noise = getShaderNoiseTexture();
        if (!noise) throw new Error("Paper noise texture is unavailable.");
        await noise.decode();
        if (disposed) return;
        const uniforms = {
          u_colors: p.colors.map(getShaderColorFromString),
          u_colorsCount: p.colors.length,
          u_proportion: p.proportion,
          u_softness: p.softness,
          u_distortion: p.distortion,
          u_swirl: p.swirl,
          u_swirlIterations: p.swirlIterations,
          u_shapeScale: p.shapeScale,
          u_shape: WarpPatterns[p.shape],
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
  }, [capture]);

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
