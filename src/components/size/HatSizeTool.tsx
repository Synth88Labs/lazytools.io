import { useMemo, useState } from 'preact/hooks';
import { HAT_ROWS, nearestHatByCm, type HatRow } from '../../data/size/hat';

export default function HatSizeTool() {
  const [mode, setMode] = useState<'cm' | 'in' | 'us'>('cm');
  const [cm, setCm] = useState('57');
  const [inches, setInches] = useState('22.4');
  const [us, setUs] = useState('7⅛');

  const row: HatRow | null = useMemo(() => {
    if (mode === 'us') return HAT_ROWS.find((r) => r.us === us) ?? null;
    const v = parseFloat(mode === 'cm' ? cm : inches);
    if (!Number.isFinite(v) || v <= 0) return null;
    return nearestHatByCm(mode === 'cm' ? v : v * 2.54);
  }, [mode, cm, inches, us]);

  const inputCls =
    'w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-lg font-semibold text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label for="hat-mode" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">I know…</label>
          <select id="hat-mode" value={mode} onChange={(e) => setMode((e.target as HTMLSelectElement).value as typeof mode)} class={inputCls}>
            <option value="cm">Head circumference (cm)</option>
            <option value="in">Head circumference (inches)</option>
            <option value="us">US fitted size</option>
          </select>
        </div>
        <div>
          <label for="hat-value" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            {mode === 'us' ? 'Size' : mode === 'cm' ? 'Centimeters' : 'Inches'}
          </label>
          {mode === 'us' ? (
            <select id="hat-value" value={us} onChange={(e) => setUs((e.target as HTMLSelectElement).value)} class={inputCls}>
              {HAT_ROWS.map((r) => (
                <option value={r.us}>{r.us}</option>
              ))}
            </select>
          ) : (
            <input
              id="hat-value"
              type="number"
              inputMode="decimal"
              step="0.1"
              min={0}
              value={mode === 'cm' ? cm : inches}
              onInput={(e) => (mode === 'cm' ? setCm : setInches)((e.target as HTMLInputElement).value)}
              class={inputCls}
              placeholder={mode === 'cm' ? 'e.g. 57' : 'e.g. 22.4'}
            />
          )}
        </div>
      </div>

      <div class="mt-5 rounded-xl border border-brand-100 bg-white p-4">
        {row ? (
          <>
            {mode !== 'us' && <p class="mb-2 text-sm text-slate-500">Nearest standard size:</p>}
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {(
                [
                  ['US fitted', row.us],
                  ['UK fitted', row.uk],
                  ['Letter', row.letter],
                  ['Head', `${row.cm} cm`],
                  ['Head', `${row.inches}"`],
                ] as const
              ).map(([label, value], i) => (
                <div class={`rounded-lg p-3 text-center ${i === 0 ? 'border border-brand-200 bg-brand-50' : 'bg-slate-50'}`}>
                  <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                  <p class="mt-1 text-xl font-bold text-slate-900">{value}</p>
                </div>
              ))}
            </div>
            <p class="mt-3 text-xs text-slate-500">Between sizes? Choose the larger — hats shrink slightly and heads don't.</p>
          </>
        ) : (
          <p class="py-2 text-sm text-slate-500">Enter your head circumference to find your size.</p>
        )}
      </div>
    </div>
  );
}
