import { useState } from 'preact/hooks';
import { isGregorianLeapYear, isJulianLeapYear, gregorianLeapReason } from '../../lib/calendars';

export default function LeapYearTool() {
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const y = parseInt(year, 10);
  const valid = Number.isFinite(y);
  const greg = valid && isGregorianLeapYear(y);

  // next & previous leap years
  const next = valid ? (() => { let n = y + 1; while (!isGregorianLeapYear(n)) n++; return n; })() : null;
  const prev = valid ? (() => { let p = y - 1; while (!isGregorianLeapYear(p)) p--; return p; })() : null;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label for="ly-year" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Year</label>
      <div class="flex flex-wrap gap-2">
        <input id="ly-year" type="number" value={year} onInput={(e) => setYear((e.target as HTMLInputElement).value)} class="w-40 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-lg font-semibold text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
        <button type="button" onClick={() => setYear(String(new Date().getFullYear()))} class="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-brand-400 hover:text-brand-700">This year</button>
      </div>

      {valid && (
        <div class="mt-4 rounded-xl border border-brand-100 bg-white p-4" aria-live="polite">
          <p class={`text-2xl font-extrabold ${greg ? 'text-mint-700' : 'text-slate-900'}`}>
            {greg ? `✓ ${y} is a leap year` : `✗ ${y} is not a leap year`}
          </p>
          <p class="mt-1 text-sm text-slate-600">{greg ? '366 days — February has 29.' : '365 days — February has 28.'}</p>
          <p class="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">{gregorianLeapReason(y)}</p>
          <div class="mt-3 grid gap-2 text-sm sm:grid-cols-3">
            <div class="rounded-lg bg-slate-50 px-3 py-2"><span class="block text-xs font-semibold uppercase text-slate-500">Previous leap year</span><span class="font-mono font-bold text-slate-900">{prev}</span></div>
            <div class="rounded-lg bg-slate-50 px-3 py-2"><span class="block text-xs font-semibold uppercase text-slate-500">Next leap year</span><span class="font-mono font-bold text-slate-900">{next}</span></div>
            <div class="rounded-lg bg-slate-50 px-3 py-2"><span class="block text-xs font-semibold uppercase text-slate-500">Julian calendar</span><span class="font-bold text-slate-900">{isJulianLeapYear(y) ? 'Leap' : 'Common'}</span></div>
          </div>
          {y % 100 === 0 && (
            <p class="mt-3 text-xs text-slate-500">
              Century year: under the Gregorian rule it's a leap year only if divisible by 400 — the correction the old Julian calendar lacked, which is why the two disagree on years like 1700, 1800 and 1900.
            </p>
          )}
        </div>
      )}
      <p class="mt-3 text-xs text-slate-500">Gregorian rule: divisible by 4, except centuries not divisible by 400. Computed locally.</p>
    </div>
  );
}
