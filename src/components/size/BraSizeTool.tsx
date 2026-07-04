import { useMemo, useState } from 'preact/hooks';
import { BANDS, CUPS, sisterSizes, type BandRow } from '../../data/size/bra';

function sizeLabel(row: BandRow, cupIndex: number, system: 'us' | 'uk' | 'eu' | 'fr' | 'it' | 'au'): string {
  const cupLadder = system === 'uk' ? CUPS.uk : system === 'us' ? CUPS.us : CUPS.eu;
  const cup = cupLadder[cupIndex] ?? '?';
  switch (system) {
    case 'us':
    case 'uk':
      return `${row.us}${cup}`;
    case 'eu':
      return `${row.eu}${cup}`;
    case 'fr':
      return `${row.fr}${cup}`;
    case 'it':
      return `${row.it}${cup}`;
    case 'au':
      return `${row.au}${cup}`;
  }
}

export default function BraSizeTool() {
  const [system, setSystem] = useState<'us' | 'uk' | 'eu'>('us');
  const [bandUs, setBandUs] = useState('34');
  const [cupIndex, setCupIndex] = useState('3'); // D

  const row = useMemo(() => BANDS.find((b) => b.us === parseFloat(bandUs)) ?? null, [bandUs]);
  const ci = parseInt(cupIndex, 10);
  const sisters = useMemo(() => (row ? sisterSizes(row.us, ci) : {}), [row, ci]);

  const inputCls =
    'w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-lg font-semibold text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  const bandLabel = (b: BandRow) => (system === 'eu' ? b.eu : b.us);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-4 sm:grid-cols-3">
        <div>
          <label for="bra-system" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">My size is in</label>
          <select id="bra-system" value={system} onChange={(e) => setSystem((e.target as HTMLSelectElement).value as typeof system)} class={inputCls}>
            <option value="us">US sizing</option>
            <option value="uk">UK sizing</option>
            <option value="eu">EU sizing</option>
          </select>
        </div>
        <div>
          <label for="bra-band" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Band</label>
          <select id="bra-band" value={bandUs} onChange={(e) => setBandUs((e.target as HTMLSelectElement).value)} class={inputCls}>
            {BANDS.map((b) => (
              <option value={String(b.us)}>{bandLabel(b)}</option>
            ))}
          </select>
        </div>
        <div>
          <label for="bra-cup" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Cup</label>
          <select id="bra-cup" value={cupIndex} onChange={(e) => setCupIndex((e.target as HTMLSelectElement).value)} class={inputCls}>
            {CUPS[system].map((c, i) => (
              <option value={String(i)}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div class="mt-5 rounded-xl border border-brand-100 bg-white p-4">
        {row ? (
          <>
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {(
                [
                  ['US', sizeLabel(row, ci, 'us')],
                  ['UK', sizeLabel(row, ci, 'uk')],
                  ['EU / DE', sizeLabel(row, ci, 'eu')],
                  ['FR / ES', sizeLabel(row, ci, 'fr')],
                  ['AU (band)', sizeLabel(row, ci, 'au')],
                ] as const
              ).map(([label, value], i) => (
                <div class={`rounded-lg p-3 text-center ${i === 0 ? 'bg-brand-50 border border-brand-200' : 'bg-slate-50'}`}>
                  <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                  <p class="mt-1 text-xl font-bold text-slate-900">{value}</p>
                </div>
              ))}
            </div>

            <div class="mt-4 border-t border-slate-100 pt-3">
              <p class="text-sm font-semibold text-slate-700">Sister sizes (same cup volume):</p>
              <div class="mt-2 flex flex-wrap gap-2 text-sm">
                {sisters.down && (
                  <span class="rounded-full bg-mint-500/10 px-3 py-1.5 font-medium text-mint-700">
                    ↓ band: {sizeLabel(BANDS.find((b) => b.us === sisters.down!.band)!, sisters.down.cupIndex, system)} — if the band rides up
                  </span>
                )}
                {sisters.up && (
                  <span class="rounded-full bg-mint-500/10 px-3 py-1.5 font-medium text-mint-700">
                    ↑ band: {sizeLabel(BANDS.find((b) => b.us === sisters.up!.band)!, sisters.up.cupIndex, system)} — if the band digs in
                  </span>
                )}
              </div>
            </div>
            <p class="mt-3 text-xs text-slate-500">Your measurements never leave this page — nothing is transmitted or stored.</p>
          </>
        ) : (
          <p class="py-2 text-sm text-slate-500">Pick a band and cup to convert.</p>
        )}
      </div>
    </div>
  );
}
