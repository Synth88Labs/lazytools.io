import { useMemo, useState } from 'preact/hooks';
import { DRESS_ROWS, type DressRow } from '../../data/size/dress';

type System = 'us' | 'uk' | 'eu' | 'fr' | 'it' | 'jp';

const SYSTEMS: { id: System; label: string }[] = [
  { id: 'us', label: 'US' },
  { id: 'uk', label: 'UK / AU' },
  { id: 'eu', label: 'EU / DE' },
  { id: 'fr', label: 'FR / ES' },
  { id: 'it', label: 'IT' },
  { id: 'jp', label: 'JP' },
];

export default function DressSizeTool() {
  const [system, setSystem] = useState<System>('us');
  const [val, setVal] = useState('8');

  const row: DressRow | null = useMemo(
    () => DRESS_ROWS.find((r) => r[system] === parseFloat(val)) ?? null,
    [system, val]
  );

  const inputCls =
    'w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-lg font-semibold text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label for="dress-system" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">My size is in</label>
          <select id="dress-system" value={system} onChange={(e) => setSystem((e.target as HTMLSelectElement).value as System)} class={inputCls}>
            {SYSTEMS.map((s) => (
              <option value={s.id}>{s.label} sizing</option>
            ))}
          </select>
        </div>
        <div>
          <label for="dress-value" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Size</label>
          <select id="dress-value" value={val} onChange={(e) => setVal((e.target as HTMLSelectElement).value)} class={inputCls}>
            {DRESS_ROWS.map((r) => (
              <option value={String(r[system])}>{r[system]}</option>
            ))}
          </select>
        </div>
      </div>

      <div class="mt-5 rounded-xl border border-brand-100 bg-white p-4">
        {row ? (
          <>
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {(
                [
                  ['US', row.us],
                  ['UK / AU', row.uk],
                  ['EU / DE', row.eu],
                  ['FR / ES', row.fr],
                  ['IT', row.it],
                  ['JP', row.jp],
                  ['Letter', row.letter],
                ] as const
              ).map(([label, value], i) => (
                <div class={`rounded-lg p-3 text-center ${i === 0 ? 'border border-brand-200 bg-brand-50' : 'bg-slate-50'}`}>
                  <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                  <p class="mt-1 text-xl font-bold text-slate-900">{value}</p>
                </div>
              ))}
            </div>
            <p class="mt-3 text-xs text-slate-500">
              Standard chart — vanity sizing means brands drift by a full size either way; check garment measurements for anything fitted.
            </p>
          </>
        ) : (
          <p class="py-2 text-sm text-slate-500">Pick a size to convert.</p>
        )}
      </div>
    </div>
  );
}
