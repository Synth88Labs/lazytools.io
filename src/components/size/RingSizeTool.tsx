import { useMemo, useState } from 'preact/hooks';
import { RING_ROWS, nearestRingByCircumference, nearestRingByDiameter, type RingRow } from '../../data/size/ring';

export default function RingSizeTool() {
  const [mode, setMode] = useState<'us' | 'uk' | 'measure-circ' | 'measure-dia'>('us');
  const [usVal, setUsVal] = useState('7');
  const [ukVal, setUkVal] = useState('N');
  const [mm, setMm] = useState('54');

  const row: RingRow | null = useMemo(() => {
    if (mode === 'us') return RING_ROWS.find((r) => r.us === parseFloat(usVal)) ?? null;
    if (mode === 'uk') return RING_ROWS.find((r) => r.uk === ukVal) ?? null;
    const v = parseFloat(mm);
    if (!Number.isFinite(v) || v <= 0) return null;
    return mode === 'measure-circ' ? nearestRingByCircumference(v) : nearestRingByDiameter(v);
  }, [mode, usVal, ukVal, mm]);

  const isMeasure = mode === 'measure-circ' || mode === 'measure-dia';
  const inputCls =
    'w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-lg font-semibold text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label for="ring-mode" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            I know…
          </label>
          <select id="ring-mode" value={mode} onChange={(e) => setMode((e.target as HTMLSelectElement).value as typeof mode)} class={inputCls}>
            <option value="us">My US / Canada size</option>
            <option value="uk">My UK / AU letter size</option>
            <option value="measure-circ">Finger circumference (mm)</option>
            <option value="measure-dia">Ring inner diameter (mm)</option>
          </select>
        </div>
        <div>
          <label for="ring-value" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            {isMeasure ? 'Measurement in mm' : 'Size'}
          </label>
          {mode === 'us' && (
            <select id="ring-value" value={usVal} onChange={(e) => setUsVal((e.target as HTMLSelectElement).value)} class={inputCls}>
              {RING_ROWS.map((r) => (
                <option value={String(r.us)}>US {r.us}</option>
              ))}
            </select>
          )}
          {mode === 'uk' && (
            <select id="ring-value" value={ukVal} onChange={(e) => setUkVal((e.target as HTMLSelectElement).value)} class={inputCls}>
              {RING_ROWS.map((r) => (
                <option value={r.uk}>UK {r.uk}</option>
              ))}
            </select>
          )}
          {isMeasure && (
            <input
              id="ring-value"
              type="number"
              inputMode="decimal"
              step="0.1"
              min={0}
              value={mm}
              onInput={(e) => setMm((e.target as HTMLInputElement).value)}
              class={inputCls}
              placeholder={mode === 'measure-circ' ? 'e.g. 54' : 'e.g. 17.3'}
            />
          )}
        </div>
      </div>

      <div class="mt-5 rounded-xl border border-brand-100 bg-white p-4">
        {row ? (
          <>
            {isMeasure && <p class="mb-2 text-sm text-slate-500">Nearest standard size:</p>}
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {[
                ['US / CA', `${row.us}`],
                ['UK / AU', row.uk],
                ['EU / ISO', `${row.circumference}`],
                ['Diameter', `${row.diameter} mm`],
                ['Circumference', `${row.circumference} mm`],
              ].map(([label, value], i) => (
                <div class={`rounded-lg p-3 text-center ${i === 0 ? 'bg-brand-50 border border-brand-200' : 'bg-slate-50'}`}>
                  <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                  <p class="mt-1 text-xl font-bold text-slate-900">{value}</p>
                </div>
              ))}
            </div>
            <p class="mt-3 text-xs text-slate-500">Between sizes or a wide band (&gt;6 mm)? Choose the larger size.</p>
          </>
        ) : (
          <p class="py-2 text-sm text-slate-500">Enter a measurement to see your size in every system.</p>
        )}
      </div>
    </div>
  );
}
