import { useMemo, useState } from 'preact/hooks';
import { tip, TIP_CUSTOMS } from '../../lib/travel';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function TipTool() {
  const [bill, setBill] = useState('50');
  const [pct, setPct] = useState('18');
  const [split, setSplit] = useState('1');
  const [country, setCountry] = useState('');

  const r = useMemo(() => {
    const b = num(bill), p = num(pct), s = parseInt(split, 10);
    if (b == null || p == null || !isFinite(s) || s < 1) return null;
    return tip(b, p, s);
  }, [bill, pct, split]);

  const custom = TIP_CUSTOMS.find((c) => c.country === country);

  const applyCustom = (name: string) => {
    setCountry(name);
    const c = TIP_CUSTOMS.find((x) => x.country === name);
    if (c) setPct(String(Math.round((c.low + c.high) / 2)));
  };

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Country (sets a customary tip)</span>
        <select class={sel} value={country} onChange={(e) => applyCustom((e.target as HTMLSelectElement).value)}>
          <option value="">Custom — set your own %</option>
          {TIP_CUSTOMS.map((c) => <option value={c.country}>{c.country}</option>)}
        </select></label>

      {custom && (
        <div class="mt-2 rounded-xl bg-brand-50 p-3 text-sm text-brand-900 ring-1 ring-brand-200">
          <strong>{custom.country}:</strong> {custom.low === 0 && custom.high === 0 ? 'tipping not expected. ' : `customary ${custom.low}–${custom.high}%. `}{custom.note}
        </div>
      )}

      <div class="mt-3 grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Bill amount</span>
          <input type="number" step="any" value={bill} onInput={(e) => setBill((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Tip %</span>
          <input type="number" step="any" value={pct} onInput={(e) => { setPct((e.target as HTMLInputElement).value); setCountry(''); }} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Split between</span>
          <input type="number" step="1" min="1" value={split} onInput={(e) => setSplit((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Tip</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.tip)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Total</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.total)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Per person</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.perPerson)}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the bill, tip percent and how many people are splitting.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Amounts are in whatever currency you enter — no conversion. Tipping is cultural and varies by setting and service; where a service charge is already on the bill (common in France, Brazil, the UAE and parts of the UK), an extra tip is optional. Customary figures are guidance from travel-etiquette references, not fixed rules. 🔒 In your browser.</p>
    </div>
  );
}
