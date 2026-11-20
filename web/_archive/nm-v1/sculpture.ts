// Halftone dot-sculpture engine — parametric 3D point clouds projected on 2D canvas.
// Shapes: torusKnot | sphere | lattice | twistTorus | rings | chip | shell | geodesic

export type ShapeName = 'torusKnot' | 'sphere' | 'lattice' | 'twistTorus' | 'rings'

type V3 = [number, number, number]

function fibSphere(n: number, r = 1): V3[] {
  const pts: V3[] = []
  const ga = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / Math.max(1, n - 1)) * 2
    const rad = Math.sqrt(Math.max(0, 1 - y * y))
    const th = ga * i
    pts.push([Math.cos(th) * rad * r, y * r, Math.sin(th) * rad * r])
  }
  return pts
}

function torusKnot(n: number, p = 2, q = 3, r = 0.62): V3[] {
  const pts: V3[] = []
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2 * 2
    const wobble = 1 + 0.22 * Math.cos(q * t * 0.5)
    const x = r * wobble * Math.cos(p * t)
    const y = r * wobble * Math.sin(p * t)
    const z = r * 0.9 * Math.sin(q * t)
    // small tube thickness
    const j = ((i * 7919) % 97) / 97 - 0.5
    pts.push([x + j * 0.05, y + j * 0.05, z + j * 0.05])
  }
  return pts
}

function lattice(n: number, r = 0.78): V3[] {
  const pts: V3[] = []
  const k = Math.ceil(Math.cbrt(n))
  for (let i = 0; i < n; i++) {
    const x = (i % k) / (k - 1) * 2 - 1
    const y = (Math.floor(i / k) % k) / (k - 1) * 2 - 1
    const z = Math.floor(i / (k * k)) / (k - 1) * 2 - 1
    pts.push([x * r, y * r, z * r])
  }
  return pts
}

function twistTorus(n: number, r = 0.7): V3[] {
  const pts: V3[] = []
  const R = r, t2 = r * 0.34
  for (let i = 0; i < n; i++) {
    const u = (i / n) * Math.PI * 2
    const v = (((i * 31) % n) / n) * Math.PI * 2
    const tw = v + u * 2
    const x = (R + t2 * Math.cos(tw)) * Math.cos(u)
    const y = (R + t2 * Math.cos(tw)) * Math.sin(u)
    const z = t2 * Math.sin(tw)
    pts.push([x, y, z])
  }
  return pts
}

function rings(n: number, r = 0.8): V3[] {
  const pts: V3[] = []
  const ringCount = 5
  for (let i = 0; i < n; i++) {
    const ring = i % ringCount
    const rr = r * (0.3 + 0.7 * (ring / (ringCount - 1)))
    const a = (i / n) * Math.PI * 2 * ringCount * 3
    const tilt = ring * 0.35
    const x = Math.cos(a) * rr
    const y = Math.sin(a) * rr * Math.cos(tilt)
    const z = Math.sin(a) * rr * Math.sin(tilt)
    pts.push([x, y, z])
  }
  return pts
}

export function makeShape(name: ShapeName | string, n: number): V3[] {
  switch (name) {
    case 'sphere': return fibSphere(n)
    case 'lattice': return lattice(n)
    case 'twistTorus': return twistTorus(n)
    case 'rings': return rings(n)
    case 'torusKnot':
    default: return torusKnot(n)
  }
}

export interface SculptureOptions {
  shapes: ShapeName[]
  points?: number
  ink?: string
  paper?: string
  dotSize?: number
  rotationSpeed?: number
  interactive?: boolean
  onShapeChange?: (i: number) => void
  externalProgress?: () => number | null // if set, drives morph+scale from 0..1
}

export class Sculpture {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private opts: Required<Omit<SculptureOptions, 'onShapeChange' | 'externalProgress'>> & Pick<SculptureOptions, 'onShapeChange' | 'externalProgress'>
  private clouds: V3[][] = []
  private shapeIdx = 0
  private mix = 1 // 1 = fully on current shape
  private from: V3[] = []
  private to: V3[] = []
  private rx = -0.4
  private ry = 0
  private tRx = -0.4
  private tRy = 0
  private raf = 0
  private dragging = false
  private lx = 0
  private ly = 0
  private displace = 0 // pointer displacement energy
  private px = 0
  private py = 0
  private running = true
  private vis = true

  constructor(canvas: HTMLCanvasElement, opts: SculptureOptions) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
    const n = opts.points ?? 24000
    this.opts = {
      shapes: opts.shapes,
      points: n,
      ink: opts.ink ?? '#ffffff',
      paper: opts.paper ?? 'transparent',
      dotSize: opts.dotSize ?? 1.4,
      rotationSpeed: opts.rotationSpeed ?? 0.16,
      interactive: opts.interactive ?? true,
      onShapeChange: opts.onShapeChange,
      externalProgress: opts.externalProgress,
    }
    this.clouds = this.opts.shapes.map((s) => makeShape(s, n))
    this.to = this.clouds[0]
    this.from = this.clouds[0]
    this.bind()
    this.loop()
  }

  private bind() {
    const c = this.canvas
    c.addEventListener('pointerdown', (e) => {
      if (!this.opts.interactive) return
      this.dragging = true
      this.lx = e.clientX; this.ly = e.clientY
      c.setPointerCapture(e.pointerId)
    })
    c.addEventListener('pointermove', (e) => {
      if (!this.opts.interactive) return
      const rect = c.getBoundingClientRect()
      this.px = (e.clientX - rect.left) / rect.width - 0.5
      this.py = (e.clientY - rect.top) / rect.height - 0.5
      if (this.dragging) {
        this.tRy += (e.clientX - this.lx) * 0.006
        this.tRx += (e.clientY - this.ly) * 0.006
        this.displace = Math.min(1, this.displace + 0.12)
        this.lx = e.clientX; this.ly = e.clientY
      }
    })
    const up = () => { this.dragging = false }
    c.addEventListener('pointerup', up)
    c.addEventListener('pointercancel', up)
    c.addEventListener('click', () => {
      if (!this.opts.interactive || this.opts.externalProgress) return
      this.next()
    })
    new ResizeObserver(() => this.fit()).observe(c)
    this.fit()
    new IntersectionObserver((es) => {
      this.vis = es[0]?.isIntersecting ?? true
    }, { rootMargin: '80px' }).observe(c)
  }

  private fit() {
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const r = this.canvas.getBoundingClientRect()
    if (r.width === 0) return
    this.canvas.width = r.width * dpr
    this.canvas.height = r.height * dpr
  }

  next() {
    this.from = this.current()
    this.shapeIdx = (this.shapeIdx + 1) % this.opts.shapes.length
    this.to = this.clouds[this.shapeIdx]
    this.mix = 0
    this.opts.onShapeChange?.(this.shapeIdx)
  }

  setShape(i: number) {
    if (i === this.shapeIdx && this.mix >= 1) return
    this.from = this.current()
    this.shapeIdx = i
    this.to = this.clouds[i]
    this.mix = 0
    this.opts.onShapeChange?.(i)
  }

  private current(): V3[] {
    if (this.mix >= 1) return this.to
    const out: V3[] = new Array(this.opts.points)
    const e = easeInOut(this.mix)
    for (let i = 0; i < this.opts.points; i++) {
      const a = this.from[i] ?? this.to[i]
      const b = this.to[i]
      out[i] = [a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * e, a[2] + (b[2] - a[2]) * e]
    }
    return out
  }

  private loop = () => {
    this.raf = requestAnimationFrame(this.loop)
    if (!this.vis || !this.running) return
    const { ctx, canvas } = this
    const w = canvas.width, h = canvas.height
    if (w === 0) return
    ctx.clearRect(0, 0, w, h)
    if (this.opts.paper !== 'transparent') {
      ctx.fillStyle = this.opts.paper
      ctx.fillRect(0, 0, w, h)
    }

    const ext = this.opts.externalProgress?.()
    let scale = 1
    if (ext != null) {
      // scroll-driven: phase through all shapes
      const seg = this.opts.shapes.length - 1
      const f = Math.min(0.9999, Math.max(0, ext)) * seg
      const i0 = Math.floor(f)
      const e = easeInOut(f - i0)
      this.shapeIdx = Math.min(i0, seg)
      scale = 0.72 + 0.5 * Math.sin(Math.min(1, ext) * Math.PI)
      const A = this.clouds[i0], B = this.clouds[Math.min(i0 + 1, seg)]
      this.draw(A, B, e, scale)
    } else {
      if (this.mix < 1) this.mix = Math.min(1, this.mix + 0.016)
      const e = easeInOut(this.mix)
      this.draw(this.from, this.to, e, scale)
    }

    this.rx += (this.tRx - this.rx) * 0.08
    this.ry += (this.tRy - this.ry) * 0.08
    if (!this.dragging) this.tRy += this.opts.rotationSpeed * 0.016
    this.displace *= 0.96
  }

  private draw(A: V3[], B: V3[], e: number, scale: number) {
    const { ctx, canvas } = this
    const w = canvas.width, h = canvas.height
    const cx = w / 2 + this.px * this.displace * 60
    const cy = h / 2 + this.py * this.displace * 60
    const R = Math.min(w, h) * 0.36 * scale
    const n = this.opts.points
    const sinX = Math.sin(this.rx), cosX = Math.cos(this.rx)
    const sinY = Math.sin(this.ry), cosY = Math.cos(this.ry)
    const dis = this.displace * 0.35
    ctx.fillStyle = this.opts.ink
    const ds = this.opts.dotSize * (w / 900 + 0.55)
    const pxo = this.px * dis, pyo = this.py * dis
    for (let i = 0; i < n; i++) {
      const a = A[i], b = B[i]
      let x = a[0] + (b[0] - a[0]) * e
      let y = a[1] + (b[1] - a[1]) * e
      let z = a[2] + (b[2] - a[2]) * e
      // pointer displacement ripple
      if (dis > 0.001) {
        const d = Math.sin(x * 9 + z * 7 + this.ry * 3)
        x += pxo * d * dis * 2
        y += pyo * d * dis * 2
      }
      // rotate Y then X
      const x1 = x * cosY - z * sinY
      const z1 = x * sinY + z * cosY
      const y1 = y * cosX - z1 * sinX
      const z2 = y * sinX + z1 * cosX
      const persp = 1 / (1.9 - z2)
      const sx = cx + x1 * R * persp
      const sy = cy + y1 * R * persp
      const s = Math.max(0.4, ds * persp * 1.6)
      ctx.globalAlpha = Math.min(1, 0.28 + persp * 0.6)
      ctx.fillRect(sx, sy, s, s)
    }
    ctx.globalAlpha = 1
  }

  dispose() {
    cancelAnimationFrame(this.raf)
    this.running = false
  }
}

export function easeInOut(t: number) {
  return t * t * (3 - 2 * t)
}
