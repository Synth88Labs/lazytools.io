import { useMemo, useState } from 'preact/hooks';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };

export default function FenceCalculator() {
  const [unit, setUnit] = useState<'m' | 'ft'>('m');
  const [length, setLength] = useState('30');
  const [spacing, setSpacing] = useState('');
  const [height, setHeight] = useState('1.8');

  const D = unit === 'm' ? { len: 'm', spaceDef: 2.4, tallThresh: 1.2 } : { len: 'ft', spaceDef: 8, tallThresh: 4 };

  const r = useMemo(() => {
    const l = num(length), h = num(height) ?? 0;
    const sp = num(spacing) ?? D.spaceDef;
    if (l == null || sp <= 0) return null;
    const sections = Math.ceil(l / sp);
    const posts = sections + 1;
    const railsPer = h > D.tallThresh ? 3 : 2;
    const rails = sections * railsPer;
    return { sections, posts, rails, railsPer };
  }, [length, spacing, height, unit]);

  const inp = (val: string, set: (v: string) => void, label: string) => (
    <label class="block">
      <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <input type="number" step="any" min="0" value={val} onInput={(e) => set((e.target as HTMLInputElement).value)}
        class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
    </label>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex gap-2">
        {(['m', 'ft'] as const).map((u) => (
          <button onClick={() => setUnit(u)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${unit === u ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{u === 'm' ? 'Metric' : 'Imperial'}</button>
        ))}
      </div>
      <div class="grid gap-3 sm:grid-cols-3">
        {inp(length, setLength, `Fence length (${D.len})`)}
        {inp(spacing, setSpacing, `Post spacing (${D.len}, blank = ${D.spaceDef})`)}
        {inp(height, setHeight, `Fence height (${D.len})`)}
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Posts</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{r.posts}</p><p class="mt-1 text-xs text-slate-400">sections + 1 end</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Panels / sections</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{r.sections}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Rails</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{r.rails}</p><p class="mt-1 text-xs text-slate-400">{r.railsPer} per section</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the total fence length.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Sections = length ÷ spacing (rounded up); posts = sections + 1. Add extra posts for corners and gates. 🔒 In your browser.</p>
    </div>
  );
}
