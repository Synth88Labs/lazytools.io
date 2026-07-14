import { useMemo, useState } from 'preact/hooks';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (x: number, d = 2) => Number(x.toFixed(d)).toString();

export default function RoofPitchCalculator() {
  const [rise, setRise] = useState('4');
  const [run, setRun] = useState('12');
  const [span, setSpan] = useState(''); // optional total horizontal span for rafter length

  const r = useMemo(() => {
    const ri = num(rise), rn = num(run);
    if (ri == null || rn == null || rn <= 0) return null;
    const ratio12 = (ri / rn) * 12; // rise per 12 of run
    const angle = Math.atan(ri / rn) * (180 / Math.PI);
    const slopePct = (ri / rn) * 100;
    const rafterMult = Math.sqrt(ri * ri + rn * rn) / rn; // rafter length per unit run
    const sp = num(span);
    // Rafter for half the span (ridge sits at centre): horizontal run = span/2.
    const rafter = sp != null && sp > 0 ? (sp / 2) * rafterMult : null;
    return { ratio12, angle, slopePct, rafterMult, rafter };
  }, [rise, run, span]);

  const inp = (val: string, set: (v: string) => void, label: string, ph = '') => (
    <label class="block">
      <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <input type="number" step="any" min="0" value={val} placeholder={ph} onInput={(e) => set((e.target as HTMLInputElement).value)}
        class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
    </label>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        {inp(rise, setRise, 'Rise (vertical)')}
        {inp(run, setRun, 'Run (horizontal)')}
        {inp(span, setSpan, 'Total span (optional)', 'e.g. 24')}
      </div>

      {r ? (
        <>
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Pitch (rise-in-12)</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.ratio12, 1)}<span class="text-lg text-slate-500">:12</span></p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Angle</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.angle, 1)}<span class="text-lg text-slate-500">°</span></p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Slope</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.slopePct, 1)}<span class="text-lg text-slate-500">%</span></p></div>
          </div>
          <div class="mt-3 grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Rafter length multiplier</p><p class="mt-1 text-2xl font-extrabold text-slate-700">×{fmt(r.rafterMult, 4)}</p><p class="mt-1 text-xs text-slate-400">per unit of horizontal run</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Rafter length (½ span)</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.rafter != null ? fmt(r.rafter, 2) : '—'}</p><p class="mt-1 text-xs text-slate-400">{r.rafter != null ? 'ridge-to-eave, one side' : 'enter a span'}</p></div>
          </div>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the roof’s rise and run (in the same unit).</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Pitch = rise ÷ run × 12; angle = arctan(rise ÷ run); rafter = √(rise² + run²) per unit run. Add a span for the actual rafter length. 🔒 In your browser.</p>
    </div>
  );
}
