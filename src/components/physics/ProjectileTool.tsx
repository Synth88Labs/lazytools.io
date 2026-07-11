import { useMemo, useState } from 'preact/hooks';
import { GRAVITY_PRESETS } from '../../lib/physics-constants';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (x: number) => Number(x.toPrecision(5)).toString();

export default function ProjectileTool() {
  const [u, setU] = useState('20');
  const [angle, setAngle] = useState('45');
  const [h0, setH0] = useState('0');
  const [g, setG] = useState(String(GRAVITY_PRESETS[0]!.value));

  const r = useMemo(() => {
    const v0 = num(u), deg = num(angle), h = num(h0) ?? 0, gg = num(g);
    if (v0 == null || deg == null || gg == null || v0 < 0 || gg <= 0) return null;
    const rad = (deg * Math.PI) / 180;
    const vx = v0 * Math.cos(rad);
    const vy = v0 * Math.sin(rad);
    // time of flight (to y=0 from h0): solve h0 + vy t − ½g t² = 0
    const disc = vy * vy + 2 * gg * h;
    if (disc < 0) return null;
    const T = (vy + Math.sqrt(disc)) / gg;
    const range = vx * T;
    const tApex = vy / gg;
    const maxH = h + (vy * vy) / (2 * gg);
    const vyLand = vy - gg * T;
    const vLand = Math.hypot(vx, vyLand);
    const landAngle = (Math.atan2(-vyLand, vx) * 180) / Math.PI; // below horizontal
    return { vx, vy, T, range, tApex, maxH, vLand, landAngle, v0, gg, h, rad };
  }, [u, angle, h0, g]);

  // trajectory SVG
  const svg = useMemo(() => {
    if (!r) return null;
    const W = 560, H = 300, padL = 40, padR = 20, padB = 30, padT = 20;
    const N = 80;
    const pts: [number, number][] = [];
    for (let i = 0; i <= N; i++) {
      const t = (i / N) * r.T;
      const x = r.vx * t;
      const y = r.h + r.vy * t - 0.5 * r.gg * t * t;
      pts.push([x, Math.max(0, y)]);
    }
    const maxX = Math.max(r.range, 1);
    const maxY = Math.max(r.maxH, 1);
    const px = (x: number) => padL + (x / maxX) * (W - padL - padR);
    const py = (y: number) => H - padB - (y / maxY) * (H - padB - padT);
    const path = pts.map((p, i) => `${i ? 'L' : 'M'}${px(p[0]).toFixed(1)},${py(p[1]).toFixed(1)}`).join(' ');
    const apexX = r.vx * r.tApex;
    return { W, H, padL, padB, path, baseY: H - padB, apex: [px(apexX), py(r.maxH)], rangePt: [px(r.range), H - padB], start: [px(0), py(r.h)] };
  }, [r]);

  const inp = (val: string, set: (v: string) => void, label: string, unit: string) => (
    <label class="block">
      <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label} <span class="text-slate-400">({unit})</span></span>
      <input type="number" step="any" value={val} onInput={(e) => set((e.target as HTMLInputElement).value)}
        class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
    </label>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {inp(u, setU, 'Launch speed u', 'm/s')}
        {inp(angle, setAngle, 'Launch angle θ', '°')}
        {inp(h0, setH0, 'Initial height h₀', 'm')}
        <label class="block">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Gravity g <span class="text-slate-400">(m/s²)</span></span>
          <select value={g} onChange={(e) => setG((e.target as HTMLSelectElement).value)}
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200">
            {GRAVITY_PRESETS.map((p) => <option value={p.value}>{p.label}</option>)}
          </select>
        </label>
      </div>

      {r && svg ? (
        <>
          <div class="mt-4 overflow-x-auto rounded-xl bg-white p-2 ring-1 ring-slate-200">
            <svg viewBox={`0 0 ${svg.W} ${svg.H}`} class="mx-auto block w-full max-w-xl" role="img" aria-label="Projectile trajectory parabola with apex and range marked">
              <line x1={svg.padL} y1={svg.baseY} x2={svg.W - 20} y2={svg.baseY} stroke="#cbd5e1" />
              <line x1={svg.padL} y1="20" x2={svg.padL} y2={svg.baseY} stroke="#cbd5e1" />
              <path d={svg.path} fill="none" stroke="#4338ca" stroke-width="2.5" />
              <circle cx={svg.start[0]} cy={svg.start[1]} r="4" fill="#0e9f6e" />
              <circle cx={svg.apex[0]} cy={svg.apex[1]} r="4" fill="#f59e0b" />
              <line x1={svg.apex[0]} y1={svg.apex[1]} x2={svg.apex[0]} y2={svg.baseY} stroke="#f59e0b" stroke-width="1" stroke-dasharray="3 3" />
              <circle cx={svg.rangePt[0]} cy={svg.rangePt[1]} r="4" fill="#f04438" />
              <text x={svg.apex[0]} y={svg.apex[1] - 8} text-anchor="middle" class="fill-amber-600" style="font-size:10px">apex</text>
              <text x={svg.rangePt[0]} y={svg.baseY + 18} text-anchor="middle" class="fill-red-500" style="font-size:10px">range</text>
            </svg>
          </div>

          <div class="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              ['Range', fmt(r.range), 'm'], ['Max height', fmt(r.maxH), 'm'], ['Time of flight', fmt(r.T), 's'],
              ['vₓ (horizontal)', fmt(r.vx), 'm/s'], ['v_y (vertical)', fmt(r.vy), 'm/s'], ['Landing speed', fmt(r.vLand), 'm/s'],
            ].map(([l, val, unit], i) => (
              <div class={`rounded-xl bg-white p-3 text-center ${i < 3 ? 'ring-2 ring-brand-200' : 'ring-1 ring-slate-200'}`}>
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{l}</p>
                <p class="mt-1 font-mono text-lg font-bold text-brand-800">{val} <span class="text-xs font-normal text-slate-400">{unit}</span></p>
              </div>
            ))}
          </div>
          <p class="mt-2 text-xs text-slate-500">Landing angle {fmt(Math.abs(r.landAngle))}° below horizontal. Time to apex {fmt(r.tApex)} s.</p>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a launch speed, angle and gravity to plot the trajectory.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">
        Ideal projectile motion (no air resistance). R = u²·sin2θ/g and H = u²·sin²θ/(2g) for level ground; height offset handled for h₀ ≠ 0. 🔒 In your browser.
      </p>
    </div>
  );
}
