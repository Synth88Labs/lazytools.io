import { useState } from 'preact/hooks';
import { adToBs, bsToAd, BS_MONTHS, BS_RANGE, AD_RANGE, type ConvResult } from '../../lib/bikram';

const todayAd = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export default function BikramTool() {
  const [dir, setDir] = useState<'ad2bs' | 'bs2ad'>('ad2bs');
  // AD side
  const [ad, setAd] = useState(todayAd);
  // BS side (defaults roughly to today's BS year)
  const [bsY, setBsY] = useState('2083');
  const [bsM, setBsM] = useState('1');
  const [bsD, setBsD] = useState('1');

  let result: ConvResult | null = null;
  let error = '';

  if (dir === 'ad2bs') {
    const [y, m, d] = ad.split('-').map(Number);
    if (y && m && d) {
      result = adToBs(y, m, d);
      if (!result) error = `That date is outside the supported range (AD ${AD_RANGE.minYear}–${AD_RANGE.maxYear}).`;
    }
  } else {
    const y = parseInt(bsY, 10), m = parseInt(bsM, 10), d = parseInt(bsD, 10);
    if (y && m && d) {
      result = bsToAd(y, m, d);
      if (!result) error = `That BS date is invalid or outside the supported range (BS ${BS_RANGE.minYear}–${BS_RANGE.maxYear}).`;
    }
  }

  const tabCls = (active: boolean) =>
    `flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition ${active ? 'bg-brand-700 text-white' : 'bg-white text-slate-600 hover:text-brand-700'}`;
  const inputCls =
    'rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex gap-2 rounded-xl border border-slate-200 bg-white p-1.5">
        <button type="button" class={tabCls(dir === 'ad2bs')} onClick={() => setDir('ad2bs')}>AD → BS (English → Nepali)</button>
        <button type="button" class={tabCls(dir === 'bs2ad')} onClick={() => setDir('bs2ad')}>BS → AD (Nepali → English)</button>
      </div>

      <div class="mt-4">
        {dir === 'ad2bs' ? (
          <div class="flex flex-wrap items-end gap-2">
            <div>
              <label for="bk-ad" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Gregorian (AD) date</label>
              <input id="bk-ad" type="date" value={ad} min={`${AD_RANGE.minYear}-01-01`} max={`${AD_RANGE.maxYear}-12-31`} onInput={(e) => setAd((e.target as HTMLInputElement).value)} class={inputCls} style="min-width:12rem" />
            </div>
            <button type="button" onClick={() => setAd(todayAd())} class="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-brand-400 hover:text-brand-700">Today</button>
          </div>
        ) : (
          <div class="flex flex-wrap items-end gap-2">
            <div>
              <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">BS year</label>
              <input type="number" min={BS_RANGE.minYear} max={BS_RANGE.maxYear} value={bsY} onInput={(e) => setBsY((e.target as HTMLInputElement).value)} class={`${inputCls} w-28`} />
            </div>
            <div>
              <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Month</label>
              <select value={bsM} onChange={(e) => setBsM((e.target as HTMLSelectElement).value)} class={inputCls}>
                {BS_MONTHS.map((name, i) => <option value={i + 1}>{i + 1} — {name}</option>)}
              </select>
            </div>
            <div>
              <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Day</label>
              <input type="number" min={1} max={32} value={bsD} onInput={(e) => setBsD((e.target as HTMLInputElement).value)} class={`${inputCls} w-20`} />
            </div>
          </div>
        )}
      </div>

      <div class="mt-4 rounded-xl border border-brand-100 bg-white p-4" aria-live="polite">
        {error ? (
          <p class="text-sm font-medium text-red-700">✗ {error}</p>
        ) : result ? (
          dir === 'ad2bs' ? (
            <>
              <p class="text-xs font-semibold uppercase tracking-wide text-brand-700">Bikram Sambat (Nepali)</p>
              <p class="mt-1 text-2xl font-extrabold text-slate-900">{result.day} {result.monthName} {result.year}</p>
              <p class="mt-0.5 text-sm text-slate-500">{result.weekday} · BS {result.year}-{String(result.month).padStart(2, '0')}-{String(result.day).padStart(2, '0')}</p>
            </>
          ) : (
            <>
              <p class="text-xs font-semibold uppercase tracking-wide text-brand-700">Gregorian (AD)</p>
              <p class="mt-1 text-2xl font-extrabold text-slate-900">{result.monthName} {result.day}, {result.year}</p>
              <p class="mt-0.5 text-sm text-slate-500">{result.weekday} · AD {result.year}-{String(result.month).padStart(2, '0')}-{String(result.day).padStart(2, '0')}</p>
            </>
          )
        ) : (
          <p class="text-sm text-slate-500">Enter a {dir === 'ad2bs' ? 'Gregorian date' : 'Bikram Sambat date'} above.</p>
        )}
      </div>
      <p class="mt-3 text-xs text-slate-500">
        Bikram Sambat is about 56 years and 8 months ahead of AD. Conversion uses validated official calendar data (BS {BS_RANGE.minYear}–{BS_RANGE.maxYear}), computed on your device.
      </p>
    </div>
  );
}
