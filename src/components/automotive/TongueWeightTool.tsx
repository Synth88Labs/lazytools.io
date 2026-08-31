import { useMemo, useState } from 'preact/hooks';
import { tongueWeight } from '../../lib/automotive';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const sel = 'rounded-xl border border-slate-300 bg-white px-2 text-sm';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (x: number, d = 0) => Number(x.toFixed(d)).toLocaleString('en-US');

export default function TongueWeightTool() {
  const [trailer, setTrailer] = useState('3000');
  const [tongue, setTongue] = useState('360');
  const [unit, setUnit] = useState<'lb' | 'kg'>('lb');

  const res = useMemo(() => {
    const t = num(trailer), g = num(tongue);
    if (t == null || t === 0 || g == null) return null;
    return tongueWeight(t, g);
  }, [trailer, tongue]);

  const badge = res?.verdict === 'ok' ? 'text-emerald-700 bg-emerald-50 ring-emerald-200'
    : 'text-amber-800 bg-amber-50 ring-amber-200';
  const verdictText = res?.verdict === 'low' ? 'Too light, risk of trailer sway'
    : res?.verdict === 'high' ? 'Too heavy, overloads the hitch & lightens steering'
    : 'In the safe 10-15% range';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex justify-end"><select value={unit} aria-label="Weight unit" onChange={(e) => setUnit((e.target as HTMLSelectElement).value as 'lb' | 'kg')} class={sel}><option value="lb">lb</option><option value="kg">kg</option></select></div>
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Loaded trailer weight ({unit})</span>
          <input type="number" step="any" value={trailer} onInput={(e) => setTrailer((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Measured tongue weight ({unit})</span>
          <input type="number" step="any" value={tongue} onInput={(e) => setTongue((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {res ? (
        <div class="mt-4 space-y-3">
          <div class="grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="font-mono text-3xl font-extrabold text-brand-800">{fmt(res.pct, 1)}%</p><p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Tongue weight percentage</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="font-mono text-2xl font-extrabold text-slate-800">{fmt(res.lo)}–{fmt(res.hi)} {unit}</p><p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Recommended range (10-15%)</p></div>
          </div>
          <div class={`rounded-xl px-4 py-3 text-center text-sm font-bold ring-1 ${badge}`}>{verdictText}</div>
        </div>
      ) : <p class="mt-4 text-sm text-slate-500">Enter the loaded trailer weight and the measured tongue weight.</p>}

      <p class="mt-4 text-xs text-slate-500">
        Tongue weight is the downward force the trailer coupler puts on the hitch ball. For a conventional trailer it should be <strong>10-15%</strong> of the loaded trailer weight: too little invites dangerous sway, too much overloads the hitch and lightens the tow vehicle's steering. Adjust by moving cargo forward (more tongue weight) or back (less). Always stay within your hitch and vehicle ratings. 🔒 In your browser.
      </p>
    </div>
  );
}
