import { useMemo, useState } from 'preact/hooks';
import { arrayWiring } from '../../lib/solar';

const int = (s: string) => { const n = parseInt(s, 10); return Number.isFinite(n) && n >= 1 ? n : null; };
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toString();

export default function ArrayWiringTool() {
  const [series, setSeries] = useState('3');
  const [parallel, setParallel] = useState('2');
  const [voc, setVoc] = useState('40');
  const [isc, setIsc] = useState('9');
  const [pmax, setPmax] = useState('300');

  const r = useMemo(() => {
    const s = int(series), p = int(parallel), v = num(voc), i = num(isc), pw = num(pmax);
    if (s == null || p == null || v == null || i == null || pw == null) return null;
    return arrayWiring(s, p, v, i, pw);
  }, [series, parallel, voc, isc, pmax]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const field = (label: string, val: string, set: (s: string) => void) => (
    <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <input type="number" step="any" value={val} onInput={(e) => set((e.target as HTMLInputElement).value)} class={inp} /></label>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <p class="mb-3 text-sm text-slate-600">Per-panel specs (from its datasheet), plus how many in series and parallel.</p>
      <div class="grid gap-3 sm:grid-cols-3">
        {field('Panels in series', series, setSeries)}
        {field('Parallel strings', parallel, setParallel)}
        {field('Panel Pmax (W)', pmax, setPmax)}
        {field('Panel Voc (V)', voc, setVoc)}
        {field('Panel Isc (A)', isc, setIsc)}
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-4">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Array power</p><p class="mt-1 text-2xl font-extrabold text-brand-800">{fmt(r.power, 0)} W</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Array Voc</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.voc)} V</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Array Isc</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.isc)} A</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Total panels</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.panels}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the panel specs and wiring counts.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Wiring panels in series adds their voltages (Voc × number in series) while the current stays the same; wiring strings in parallel adds their currents (Isc × strings) at the same voltage. Total power is the sum of all panels. Check the array Voc against the maximum input voltage of your charge controller or inverter — cold weather pushes Voc higher, so leave margin. 🔒 In your browser.</p>
    </div>
  );
}
