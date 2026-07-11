import { useMemo, useState } from 'preact/hooks';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (x: number) => Number(x.toPrecision(6)).toString();

export default function PercentErrorTool() {
  const [exp, setExp] = useState('9.8');
  const [theo, setTheo] = useState('9.81');

  const r = useMemo(() => {
    const e = num(exp), t = num(theo);
    if (e == null || t == null || t === 0) return null;
    const pctErr = (Math.abs(e - t) / Math.abs(t)) * 100;
    const signed = ((e - t) / Math.abs(t)) * 100;
    return { pctErr, signed };
  }, [exp, theo]);

  const inp = (val: string, set: (v: string) => void, label: string) => (
    <label class="block">
      <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <input type="number" step="any" value={val} onInput={(e) => set((e.target as HTMLInputElement).value)}
        class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
    </label>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        {inp(exp, setExp, 'Experimental (measured) value')}
        {inp(theo, setTheo, 'Theoretical (accepted) value')}
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Percent error</p>
            <p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.pctErr)}%</p>
          </div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Signed error</p>
            <p class="mt-1 text-2xl font-extrabold text-slate-700">{r.signed >= 0 ? '+' : ''}{fmt(r.signed)}%</p>
            <p class="mt-1 text-xs text-slate-400">{r.signed >= 0 ? 'measured high' : 'measured low'}</p>
          </div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the measured and accepted values (accepted must be non-zero).</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Percent error = |experimental − theoretical| ÷ |theoretical| × 100. 🔒 Computed in your browser.</p>
    </div>
  );
}
