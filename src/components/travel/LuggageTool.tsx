import { useMemo, useState } from 'preact/hooks';
import { luggageLitres, linearCm, BAGGAGE } from '../../lib/travel';

const IN_PER_CM = 1 / 2.54;
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { maximumFractionDigits: d });

export default function LuggageTool() {
  const [l, setL] = useState('55');
  const [w, setW] = useState('40');
  const [h, setH] = useState('23');
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');
  const [kind, setKind] = useState<'carryOn' | 'checked'>('carryOn');

  const r = useMemo(() => {
    const L = num(l), W = num(w), H = num(h);
    if (L == null || W == null || H == null) return null;
    const cm = unit === 'in' ? [L / IN_PER_CM, W / IN_PER_CM, H / IN_PER_CM] : [L, W, H];
    const litres = luggageLitres(cm[0], cm[1], cm[2])!;
    const linear = linearCm(cm[0], cm[1], cm[2]);
    const limit = kind === 'carryOn' ? BAGGAGE.carryOn.linearCm : BAGGAGE.checked.linearCm;
    return { litres, linear, linearIn: linear * IN_PER_CM, limit, limitIn: limit * IN_PER_CM, ok: linear <= limit };
  }, [l, w, h, unit, kind]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex flex-wrap items-center gap-2">
        <select class={sel} value={kind} onChange={(e) => setKind((e.target as HTMLSelectElement).value as 'carryOn' | 'checked')}>
          <option value="carryOn">Carry-on / cabin bag</option>
          <option value="checked">Checked bag</option>
        </select>
        <select class={sel} value={unit} onChange={(e) => setUnit((e.target as HTMLSelectElement).value as 'cm' | 'in')}><option value="cm">centimetres</option><option value="in">inches</option></select>
      </div>

      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Length ({unit})</span>
          <input type="number" step="any" value={l} onInput={(e) => setL((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Width ({unit})</span>
          <input type="number" step="any" value={w} onInput={(e) => setW((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Height ({unit})</span>
          <input type="number" step="any" value={h} onInput={(e) => setH((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Packing volume</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.litres, 1)} L</p><p class="mt-0.5 text-sm text-slate-500">linear total {fmt(r.linear)} cm ({fmt(r.linearIn)} in)</p></div>
          <div class={`rounded-xl p-4 text-center ring-2 ${r.ok ? 'bg-emerald-50 ring-emerald-200' : 'bg-amber-50 ring-amber-200'}`}>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">vs common {kind === 'carryOn' ? 'cabin' : 'checked'} limit</p>
            <p class={`mt-1 text-2xl font-extrabold ${r.ok ? 'text-emerald-700' : 'text-amber-700'}`}>{r.ok ? 'Within limit' : 'Over limit'}</p>
            <p class="mt-0.5 text-sm text-slate-500">common max ≈ {fmt(r.limit)} cm ({fmt(r.limitIn)} in) linear</p>
          </div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter your bag's three dimensions.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Limits vary by airline and fare — these are common industry references: cabin bags around 56 × 36 × 23 cm (US legacy) or the IATA ~55 × 40 × 20 cm guideline, and checked bags to a 158 cm (62 in) linear total. Budget carriers (Ryanair, easyJet) and weight limits (cabin ~7–10 kg, checked ~23 kg) differ — always check your airline before you pack. 🔒 In your browser.</p>
    </div>
  );
}
