"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Dict } from "@/lib/i18n";

/*
 * Ported verbatim from webTemplates/mondragon2 (recreation of the Mondra
 * Framer template hero): iridescent "liquid silk" WebGL shader — flowing
 * domain-warped satin bands. The hero zone keeps the template aesthetic.
 */
const VERT = `
attribute vec2 aPos;
void main(){ gl_Position = vec4(aPos,0.,1.); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uSeed;
uniform int uMode;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453123); }
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p);
  vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),
             mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);
}
float fbm(vec2 p){
  float v=0., a=.5;
  mat2 r=mat2(.8,.6,-.6,.8);
  for(int i=0;i<5;i++){ v+=a*noise(p); p=r*p*2.0; a*=.55; }
  return v;
}
vec3 pal(float t){
  vec3 c1=vec3(.78,.04,.10);
  vec3 c2=vec3(.85,.06,.62);
  vec3 c3=vec3(.98,.55,.12);
  vec3 c4=vec3(.15,.75,.55);
  vec3 c5=vec3(.05,.18,.62);
  vec3 c6=vec3(.02,.04,.16);
  vec3 col=mix(c1,c2,smoothstep(.0,.22,t));
  col=mix(col,c3,smoothstep(.2,.42,t));
  col=mix(col,c4,smoothstep(.40,.62,t));
  col=mix(col,c5,smoothstep(.60,.82,t));
  col=mix(col,c6,smoothstep(.80,1.02,t));
  return col;
}
void main(){
  vec2 p = (gl_FragCoord.xy - .5*uRes.xy)/uRes.y;
  p.x *= -1.;
  float t = uTime*.06 + uSeed;

  vec2 q = p*vec2(1.1,1.9) + vec2(t*.8,0.);
  float w1 = fbm(q*.9 + vec2(0.,t*.5));
  float w2 = fbm(q*1.6 + vec2(4.7,2.3) - t*.35);
  float band = p.y*.85 + p.x*.75 + (w1-.5)*1.5 + (w2-.5)*.55;
  band += sin(p.x*2.4 + w1*6. + t*2.)*.08;

  vec3 col;
  float n = band*.62 + .18;
  col = pal(n);
  float ridge = pow(.5+.5*sin(n*17.), 3.);
  col *= .72 + .5*ridge;
  col *= .65 + .55*smoothstep(.1,.9,fbm(q*1.1+7.3));
  col += vec3(.9,.95,1.)*pow(ridge,8.)*.22*smoothstep(.2,.7,w2);

  float vig = smoothstep(1.75,.3,length(p));
  col *= mix(.82,1.,vig);
  col += (hash(gl_FragCoord.xy)-.5)*.04;
  gl_FragColor = vec4(col,1.);
}
`;

function ShaderCanvas({
  onReady,
  reduced,
  className = "",
}: {
  onReady?: () => void;
  reduced: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) {
      onReady?.();
      return;
    }

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uSeed = gl.getUniformLocation(prog, "uSeed");
    const uMode = gl.getUniformLocation(prog, "uMode");
    gl.uniform1f(uSeed, 3.7);
    gl.uniform1i(uMode, 0);

    let raf = 0;
    let ready = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      const w = canvas.clientWidth,
        h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const t0 = performance.now();
    const frame = (now: number) => {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (now - t0) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!ready) {
        ready = true;
        onReady?.();
      }
      raf = requestAnimationFrame(frame);
    };
    if (reduced) {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, 12.0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      ready = true;
      onReady?.();
    } else {
      raf = requestAnimationFrame(frame);
    }
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [onReady, reduced]);

  return (
    <canvas
      ref={ref}
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
      aria-hidden="true"
    />
  );
}

function useClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "UTC",
      });
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export function SilkHero({ dict }: { dict: Dict["hero"] }) {
  const time = useClock();
  const [loading, setLoading] = useState(true);
  const [pct, setPct] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const onShaderReady = useCallback(() => {
    let v = 0;
    const id = setInterval(() => {
      v += Math.random() * 22 + 10;
      if (v >= 100) {
        v = 100;
        clearInterval(id);
        setTimeout(() => setLoading(false), 350);
      }
      setPct(Math.floor(v));
    }, 90);
  }, []);

  useEffect(() => {
    const fallback = setTimeout(() => setLoading(false), 4000);
    return () => clearTimeout(fallback);
  }, []);

  return (
    <section aria-labelledby="hero-h" className="silk-hero">
      <div
        className={`silk-loader ${loading ? "" : "done"}`}
        aria-hidden={!loading}
      >
        <svg className="ring" viewBox="0 0 40 40">
          <circle className="bg" cx="20" cy="20" r="14" />
          <circle
            className="fg"
            cx="20"
            cy="20"
            r="14"
            style={{ strokeDashoffset: 88 - (88 * pct) / 100 }}
          />
        </svg>
        <div className="txt">
          {dict.loader} {pct}%
        </div>
      </div>

      <div className="silk-hero-card">
        <div className="silk-shader-holder">
          <ShaderCanvas onReady={onShaderReady} reduced={reduced} />
        </div>
        <div className="silk-hero-inner">
          <div className="silk-hero-row">
            <div className="silk-hero-left">
              <div>
                <span
                  className="silk-dot"
                  style={{ marginBottom: 14, display: "block" }}
                />
                <div className="silk-hero-addr">
                  {dict.addr}
                  <span className="time">{time} UTC</span>
                </div>
              </div>
              <div className="silk-hero-manager">
                <span className="silk-nm-tile" aria-hidden="true">
                  NM.
                </span>
                <div className="col">
                  <p>
                    {dict.managerLine1}
                    <br />
                    {dict.managerLine2}
                  </p>
                  <a
                    className="silk-btn-pill light small"
                    href="https://github.com/ness-e/Vantadb"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {dict.managerCta}
                  </a>
                </div>
              </div>
            </div>
            <div className="silk-hero-right">
              <span className="silk-dot" />
              <h1 className="silk-hero-slogan" id="hero-h">
                {dict.slogan}
              </h1>
              <div className="silk-hero-metrics">
                {dict.metrics.map((m) => (
                  <div className="silk-metric" key={m.lbl}>
                    <div className="num">{m.num}</div>
                    <div className="lbl">{m.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="silk-hero-wordmark" aria-hidden="true">
          <span className="silk-wordmark-txt">NEGENT</span>
        </div>
      </div>

      <p className="silk-hero-sub font-mono">
        <span className="text-pulse">■</span> {dict.subTags} —{" "}
        <Link
          href="#engine"
          className="underline decoration-pulse underline-offset-4 transition-colors hover:text-bone"
        >
          {dict.subLink}
        </Link>
      </p>
    </section>
  );
}
