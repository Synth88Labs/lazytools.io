import { useMemo, useState } from 'preact/hooks';
import { KIDS_SHOE_ROWS, nearestKidsShoeByCm, type KidsShoeRow } from '../../data/size/kids-shoe';

export default function KidsShoeSizeTool() {
  const [mode, setMode] = useState<'us' | 'eu' | 'cm'>('us');
  const [val, setVal] = useState('10C');
  const [cm, setCm] = useState('16.5');

  const row: KidsShoeRow | null = useMemo(() => {
    if (mode === 'cm') {
      const v = parseFloat(cm);
      return Number.isFinite(v) && v > 0 ? nearestKidsShoeByCm(v) : null;
    }
    if (mode === 'us') return KIDS_SHOE_ROWS.find((r) => r.us === val) ?? null;
    return KIDS_SHOE_ROWS.find((r) => String(r.eu) === val) ?? null;
  }, [mode, val, cm]);

  const inputCls =
    'w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-lg font-semibold text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label for="kshoe-mode" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">I know…</label>
          <select
            id="kshoe-mode"
            value={mode}
            onChange={(e) => {
              const m = (e.target as HTMLSelectElement).value as typeof mode;
              setMode(m);
              if (m === 'us') setVal('10C');
              if (m === 'eu') setVal('27');
            }}
            class={inputCls}
          >
            <option value="us">US kids' size (C / Y)</option>
            <option value="eu">EU size</option>
            <option value="cm">Foot length (cm)</option>
          </select>
        </div>
        <div>
          <label for="kshoe-value" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            {mode === 'cm' ? 'Centimeters' : 'Size'}
          </label>
          {mode === 'cm' ? (
            <input
              id="kshoe-value"
              type="number"
              inputMode="decimal"
              step="0.1"
              min={0}
              value={cm}
              onInput={(e) => setCm((e.target as HTMLInputElement).value)}
              class={inputCls}
              placeholder="e.g. 16.5"
            />
          ) : (
            <select id="kshoe-value" value={val} onChange={(e) => setVal((e.target as HTMLSelectElement).value)} class={inputCls}>
              {KIDS_SHOE_ROWS.map((r) => (
                <option value={mode === 'us' ? r.us : String(r.eu)}>{mode === 'us' ? r.us : r.eu}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div class="mt-5 rounded-xl border border-brand-100 bg-white p-4">
        {row ? (
          <>
            {mode === 'cm' && <p class="mb-2 text-sm text-slate-500">Nearest standard size:</p>}
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {(
                [
                  ['US', row.us],
                  ['UK', String(row.uk)],
                  ['EU', String(row.eu)],
                  ['Foot', `${row.cm} cm`],
                  ['Typical age', row.age],
                ] as const
              ).map(([label, value], i) => (
                <div class={`rounded-lg p-3 text-center ${i === 0 ? 'border border-brand-200 bg-brand-50' : 'bg-slate-50'}`}>
                  <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                  <p class="mt-1 text-lg font-bold text-slate-900">{value}</p>
                </div>
              ))}
            </div>
            <p class="mt-3 text-xs text-slate-500">
              {row.group} range. Ages are guidance only — measure the foot and add ~0.8 cm of growing room.
            </p>
          </>
        ) : (
          <p class="py-2 text-sm text-slate-500">Enter a foot length to find the nearest size.</p>
        )}
      </div>
    </div>
  );
}
