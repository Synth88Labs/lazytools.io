import { useMemo, useState } from 'preact/hooks';
import { VOLUME_ML } from '../../lib/cooking';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (x: number) => Number(x.toFixed(4)).toString();

const UNITS: { id: keyof typeof VOLUME_ML; label: string }[] = [
  { id: 'us_tsp', label: 'US teaspoon' },
  { id: 'us_tbsp', label: 'US tablespoon' },
  { id: 'us_floz', label: 'US fluid ounce' },
  { id: 'us_cup', label: 'US cup' },
  { id: 'us_pint', label: 'US pint' },
  { id: 'us_quart', label: 'US quart' },
  { id: 'us_gallon', label: 'US gallon' },
  { id: 'metric_tsp', label: 'Metric teaspoon (5 mL)' },
  { id: 'metric_tbsp', label: 'Metric tablespoon (15 mL)' },
  { id: 'au_tbsp', label: 'Australian tablespoon (20 mL)' },
  { id: 'metric_cup', label: 'Metric cup (250 mL)' },
  { id: 'imp_tsp', label: 'Imperial teaspoon' },
  { id: 'imp_tbsp', label: 'Imperial tablespoon' },
  { id: 'imp_floz', label: 'Imperial fluid ounce' },
  { id: 'imp_cup', label: 'Imperial cup (284 mL)' },
  { id: 'imp_pint', label: 'Imperial pint' },
  { id: 'imp_gallon', label: 'Imperial gallon' },
  { id: 'ml', label: 'Millilitre' },
  { id: 'litre', label: 'Litre' },
];

export default function MeasurementConverterTool() {
  const [amt, setAmt] = useState('1');
  const [from, setFrom] = useState<keyof typeof VOLUME_ML>('us_cup');

  const rows = useMemo(() => {
    const a = num(amt);
    if (a == null) return null;
    const ml = a * VOLUME_ML[from];
    return UNITS.filter((u) => u.id !== from).map((u) => ({ label: u.label, value: ml / VOLUME_ML[u.id] }));
  }, [amt, from]);

  const sel = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Amount</span>
          <input type="number" step="any" value={amt} onInput={(e) => setAmt((e.target as HTMLInputElement).value)}
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
        </label>
        <label class="block">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">From</span>
          <select value={from} onChange={(e) => setFrom((e.target as HTMLSelectElement).value as any)} class={sel}>
            {UNITS.map((u) => <option value={u.id}>{u.label}</option>)}
          </select>
        </label>
      </div>

      {rows ? (
        <div class="mt-4 overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
          <table class="w-full text-sm">
            <tbody>
              {rows.map((row, i) => (
                <tr class={i % 2 ? 'bg-slate-50' : ''}>
                  <td class="px-4 py-2 text-slate-600">{row.label}</td>
                  <td class="px-4 py-2 text-right font-mono font-semibold text-slate-900">{fmt(row.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter an amount.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Exact NIST/BIPM volume factors. Watch the US cup (236.6 mL) vs metric cup (250 mL) vs imperial cup (284 mL), and the Australian 20 mL tablespoon. 🔒 In your browser.</p>
    </div>
  );
}
