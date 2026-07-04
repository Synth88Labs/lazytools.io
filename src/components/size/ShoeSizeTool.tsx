import { useMemo, useState } from 'preact/hooks';
import { SHOE_MEN, SHOE_WOMEN, nearestShoeByCm, type ShoeRow } from '../../data/size/shoe';

export default function ShoeSizeTool() {
  const [gender, setGender] = useState<'men' | 'women'>('men');
  const [mode, setMode] = useState<'us' | 'uk' | 'eu' | 'cm'>('us');
  const [val, setVal] = useState('9');
  const [cm, setCm] = useState('26.5');

  const rows = gender === 'men' ? SHOE_MEN : SHOE_WOMEN;

  const row: ShoeRow | null = useMemo(() => {
    if (mode === 'cm') {
      const v = parseFloat(cm);
      return Number.isFinite(v) && v > 0 ? nearestShoeByCm(rows, v) : null;
    }
    const v = parseFloat(val);
    return rows.find((r) => r[mode] === v) ?? null;
  }, [rows, mode, val, cm]);

  const inputCls =
    'w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-lg font-semibold text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-4 sm:grid-cols-3">
        <div>
          <label for="shoe-gender" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Chart</label>
          <select id="shoe-gender" value={gender} onChange={(e) => setGender((e.target as HTMLSelectElement).value as 'men' | 'women')} class={inputCls}>
            <option value="men">Men's</option>
            <option value="women">Women's</option>
          </select>
        </div>
        <div>
          <label for="shoe-mode" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">I know…</label>
          <select id="shoe-mode" value={mode} onChange={(e) => setMode((e.target as HTMLSelectElement).value as typeof mode)} class={inputCls}>
            <option value="us">US size</option>
            <option value="uk">UK size</option>
            <option value="eu">EU size</option>
            <option value="cm">Foot length (cm)</option>
          </select>
        </div>
        <div>
          <label for="shoe-value" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            {mode === 'cm' ? 'Centimeters' : 'Size'}
          </label>
          {mode === 'cm' ? (
            <input
              id="shoe-value"
              type="number"
              inputMode="decimal"
              step="0.1"
              min={0}
              value={cm}
              onInput={(e) => setCm((e.target as HTMLInputElement).value)}
              class={inputCls}
              placeholder="e.g. 26.5"
            />
          ) : (
            <select id="shoe-value" value={val} onChange={(e) => setVal((e.target as HTMLSelectElement).value)} class={inputCls}>
              {rows.map((r) => (
                <option value={String(r[mode])}>{r[mode]}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div class="mt-5 rounded-xl border border-brand-100 bg-white p-4">
        {row ? (
          <>
            {mode === 'cm' && <p class="mb-2 text-sm text-slate-500">Nearest standard size ({gender}):</p>}
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ['US', `${row.us}`],
                ['UK', `${row.uk}`],
                ['EU', `${row.eu}`],
                ['Foot / JP', `${row.cm} cm`],
              ].map(([label, value], i) => (
                <div class={`rounded-lg p-3 text-center ${i === 0 ? 'bg-brand-50 border border-brand-200' : 'bg-slate-50'}`}>
                  <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                  <p class="mt-1 text-xl font-bold text-slate-900">{value}</p>
                </div>
              ))}
            </div>
            <p class="mt-3 text-xs text-slate-500">
              Brands vary by up to half a size — when in doubt, trust the centimeter measurement. Add ~0.5 cm for running shoes.
            </p>
          </>
        ) : (
          <p class="py-2 text-sm text-slate-500">Enter a foot length to find the nearest size.</p>
        )}
      </div>
    </div>
  );
}
