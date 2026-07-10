import { useMemo, useState } from 'preact/hooks';
import { hardyWeinberg } from '../../lib/biology';
import { chiSqCdf } from '../../lib/stats';

const inputCls = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-lg font-semibold text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 font-mono';
const fmt = (x: number, d = 3) => (Number.isFinite(x) ? x.toLocaleString('en-US', { maximumFractionDigits: d }) : '—');

export default function HardyWeinbergTool() {
  const [c, setC] = useState({ aa: '298', ab: '489', bb: '213' });
  const r = useMemo(() => {
    const n = (k: 'aa' | 'ab' | 'bb') => Math.max(0, parseFloat(c[k]) || 0);
    return hardyWeinberg(n('aa'), n('ab'), n('bb'), chiSqCdf);
  }, [c]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <p class="text-sm text-slate-500">Enter the observed number of individuals of each genotype.</p>
      <div class="mt-2 grid gap-4 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Homozygous dominant (AA)</span><input class={inputCls} type="number" value={c.aa} onInput={(e) => setC({ ...c, aa: (e.target as HTMLInputElement).value })} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Heterozygous (Aa)</span><input class={inputCls} type="number" value={c.ab} onInput={(e) => setC({ ...c, ab: (e.target as HTMLInputElement).value })} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Homozygous recessive (aa)</span><input class={inputCls} type="number" value={c.bb} onInput={(e) => setC({ ...c, bb: (e.target as HTMLInputElement).value })} /></label>
      </div>

      {!r ? <p class="mt-4 text-sm text-amber-700">Enter at least one non-zero genotype count.</p> : (
        <>
          <div class="mt-5 grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl bg-white p-4 ring-2 ring-brand-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Allele frequencies</p>
              <p class="mt-1 font-mono text-lg"><span class="font-bold text-brand-800">p = {fmt(r.p)}</span> &nbsp; <span class="font-bold text-brand-800">q = {fmt(r.q)}</span></p>
              <p class="mt-1 font-mono text-xs text-slate-400">p = (2·AA + Aa) / (2·N) · q = 1 − p · N = {r.total}</p>
            </div>
            <div class={`rounded-xl p-4 ring-2 ${r.inEquilibrium ? 'bg-emerald-50 ring-emerald-200' : 'bg-red-50 ring-red-200'}`}>
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">χ² goodness-of-fit</p>
              <p class="mt-1 font-mono text-lg font-bold text-slate-800">χ² = {fmt(r.chi)} · df {r.df} · p = {fmt(r.pValue)}</p>
              <p class={`mt-1 text-sm font-semibold ${r.inEquilibrium ? 'text-emerald-800' : 'text-red-800'}`}>{r.inEquilibrium ? '✓ Consistent with Hardy–Weinberg equilibrium (p > 0.05)' : '✗ Significant departure from equilibrium (p ≤ 0.05)'}</p>
            </div>
          </div>

          <div class="mt-3 overflow-auto rounded-xl border border-slate-200 bg-white">
            <table class="w-full text-right text-sm">
              <thead class="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500"><tr><th class="px-3 py-2 text-left">Genotype</th><th class="px-3 py-2">Observed</th><th class="px-3 py-2">Expected (HWE)</th></tr></thead>
              <tbody class="divide-y divide-slate-100 font-mono">
                <tr><td class="px-3 py-1.5 text-left text-slate-600">AA (p²)</td><td class="px-3 py-1.5 font-semibold">{c.aa}</td><td class="px-3 py-1.5 text-slate-600">{fmt(r.expected.aa, 1)}</td></tr>
                <tr><td class="px-3 py-1.5 text-left text-slate-600">Aa (2pq)</td><td class="px-3 py-1.5 font-semibold">{c.ab}</td><td class="px-3 py-1.5 text-slate-600">{fmt(r.expected.ab, 1)}</td></tr>
                <tr><td class="px-3 py-1.5 text-left text-slate-600">aa (q²)</td><td class="px-3 py-1.5 font-semibold">{c.bb}</td><td class="px-3 py-1.5 text-slate-600">{fmt(r.expected.bb, 1)}</td></tr>
              </tbody>
            </table>
          </div>
          <p class="mt-2 text-xs text-slate-500">Expected counts from p² + 2pq + q² = 1. A p-value above 0.05 means the observed counts are consistent with equilibrium; below 0.05 indicates a significant departure.</p>
        </>
      )}
    </div>
  );
}
