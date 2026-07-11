import { useMemo, useState } from 'preact/hooks';
import { normalCdf, normalInv, normalPdf } from '../../lib/stats';

type Mode = 'lt' | 'gt' | 'between' | 'inverse';

const fmtP = (p: number) => {
  if (!isFinite(p)) return '—';
  if (p === 0) return '0';
  if (p < 1e-4) return p.toExponential(4);
  return p.toFixed(6).replace(/0+$/, '').replace(/\.$/, '');
};
const fmt = (x: number) => (isFinite(x) ? Number(x.toPrecision(8)).toString() : '—');

export default function NormalDistTool() {
  const [mode, setMode] = useState<Mode>('lt');
  const [mu, setMu] = useState('0');
  const [sigma, setSigma] = useState('1');
  const [x1, setX1] = useState('1.96');
  const [x2, setX2] = useState('2');
  const [prob, setProb] = useState('0.975');

  const m = parseFloat(mu);
  const s = parseFloat(sigma);
  const a = parseFloat(x1);
  const b = parseFloat(x2);
  const p = parseFloat(prob);
  const valid = isFinite(m) && isFinite(s) && s > 0;

  const result = useMemo(() => {
    if (!valid) return null;
    if (mode === 'lt' && isFinite(a)) {
      return { label: `P(X < ${fmt(a)})`, value: normalCdf(a, m, s), z: (a - m) / s, lo: -Infinity, hi: a };
    }
    if (mode === 'gt' && isFinite(a)) {
      return { label: `P(X > ${fmt(a)})`, value: 1 - normalCdf(a, m, s), z: (a - m) / s, lo: a, hi: Infinity };
    }
    if (mode === 'between' && isFinite(a) && isFinite(b)) {
      const lo = Math.min(a, b), hi = Math.max(a, b);
      return { label: `P(${fmt(lo)} < X < ${fmt(hi)})`, value: normalCdf(hi, m, s) - normalCdf(lo, m, s), z: NaN, lo, hi };
    }
    if (mode === 'inverse' && isFinite(p) && p > 0 && p < 1) {
      const x = normalInv(p, m, s);
      return { label: `x where P(X < x) = ${fmt(p)}`, value: x, z: (x - m) / s, lo: -Infinity, hi: x, isX: true };
    }
    return null;
  }, [mode, m, s, a, b, p, valid]);

  // SVG bell curve, shaded region
  const svg = useMemo(() => {
    if (!valid) return null;
    const W = 560, H = 220, padX = 24, padB = 28, padT = 12;
    const lo = m - 4 * s, hi = m + 4 * s;
    const xToPx = (x: number) => padX + ((x - lo) / (hi - lo)) * (W - 2 * padX);
    const peak = normalPdf(m, m, s);
    const yToPx = (y: number) => H - padB - (y / peak) * (H - padB - padT);
    const N = 160;
    const pts: [number, number][] = [];
    for (let i = 0; i <= N; i++) {
      const x = lo + (i / N) * (hi - lo);
      pts.push([xToPx(x), yToPx(normalPdf(x, m, s))]);
    }
    const curve = pts.map((pt, i) => `${i ? 'L' : 'M'}${pt[0].toFixed(1)},${pt[1].toFixed(1)}`).join(' ');
    let shaded = '';
    if (result) {
      const rlo = Math.max(lo, result.lo);
      const rhi = Math.min(hi, result.hi);
      if (rhi > rlo) {
        const seg: [number, number][] = [];
        for (let i = 0; i <= N; i++) {
          const x = rlo + (i / N) * (rhi - rlo);
          seg.push([xToPx(x), yToPx(normalPdf(x, m, s))]);
        }
        const baseY = H - padB;
        shaded = `M${xToPx(rlo).toFixed(1)},${baseY} ` +
          seg.map((pt) => `L${pt[0].toFixed(1)},${pt[1].toFixed(1)}`).join(' ') +
          ` L${xToPx(rhi).toFixed(1)},${baseY} Z`;
      }
    }
    // mean tick
    const meanX = xToPx(m);
    const ticks = [-3, -2, -1, 0, 1, 2, 3].map((k) => ({ x: xToPx(m + k * s), label: k === 0 ? 'μ' : `${k > 0 ? '+' : ''}${k}σ` }));
    return { W, H, curve, shaded, meanX, baseY: H - padB, ticks };
  }, [valid, m, s, result]);

  const tab = (id: Mode, label: string) => (
    <button
      onClick={() => setMode(id)}
      class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${mode === id ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}
    >{label}</button>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap gap-2">
        {tab('lt', 'P(X < x)')}
        {tab('gt', 'P(X > x)')}
        {tab('between', 'P(a < X < b)')}
        {tab('inverse', 'Inverse (x from p)')}
      </div>

      <div class="mt-4 grid gap-3 sm:grid-cols-2">
        <label class="block">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Mean (μ)</span>
          <input type="number" value={mu} onInput={(e) => setMu((e.target as HTMLInputElement).value)}
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
        </label>
        <label class="block">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Standard deviation (σ)</span>
          <input type="number" value={sigma} onInput={(e) => setSigma((e.target as HTMLInputElement).value)}
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
        </label>
        {mode === 'inverse' ? (
          <label class="block sm:col-span-2">
            <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Probability p (0–1)</span>
            <input type="number" step="0.01" value={prob} onInput={(e) => setProb((e.target as HTMLInputElement).value)}
              class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
          </label>
        ) : (
          <>
            <label class="block">
              <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{mode === 'between' ? 'Lower value (a)' : 'Value (x)'}</span>
              <input type="number" value={x1} onInput={(e) => setX1((e.target as HTMLInputElement).value)}
                class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
            </label>
            {mode === 'between' && (
              <label class="block">
                <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Upper value (b)</span>
                <input type="number" value={x2} onInput={(e) => setX2((e.target as HTMLInputElement).value)}
                  class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
              </label>
            )}
          </>
        )}
      </div>

      {svg && (
        <div class="mt-4 overflow-x-auto rounded-xl bg-white p-2 ring-1 ring-slate-200">
          <svg viewBox={`0 0 ${svg.W} ${svg.H}`} class="mx-auto block w-full max-w-xl" role="img" aria-label="Normal distribution bell curve with shaded probability region">
            <line x1="24" y1={svg.baseY} x2={svg.W - 24} y2={svg.baseY} stroke="#cbd5e1" stroke-width="1" />
            {svg.shaded && <path d={svg.shaded} fill="#6366f1" fill-opacity="0.28" />}
            <path d={svg.curve} fill="none" stroke="#4338ca" stroke-width="2" />
            <line x1={svg.meanX} y1={svg.baseY} x2={svg.meanX} y2="14" stroke="#94a3b8" stroke-width="1" stroke-dasharray="3 3" />
            {svg.ticks.map((t) => (
              <text x={t.x} y={svg.H - 8} text-anchor="middle" class="fill-slate-400" style="font-size:10px">{t.label}</text>
            ))}
          </svg>
        </div>
      )}

      {result ? (
        <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{result.label}</p>
          <p class="mt-1 text-3xl font-extrabold text-brand-800">{(result as any).isX ? fmt(result.value) : fmtP(result.value)}</p>
          {!(result as any).isX && result.value >= 0 && result.value <= 1 && (
            <p class="mt-1 text-sm text-slate-500">= {(result.value * 100).toFixed(4).replace(/0+$/, '').replace(/\.$/, '')}%</p>
          )}
          {isFinite(result.z) && <p class="mt-1 font-mono text-xs text-slate-400">z-score = {fmt(result.z)}</p>}
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a valid mean, a positive standard deviation and {mode === 'inverse' ? 'a probability between 0 and 1' : 'value(s)'}.</p>
      )}

      <p class="mt-3 text-xs text-slate-500">
        Uses the exact normal CDF via a high-accuracy error function (erf). 🔒 Computed entirely in your browser.
      </p>
    </div>
  );
}
