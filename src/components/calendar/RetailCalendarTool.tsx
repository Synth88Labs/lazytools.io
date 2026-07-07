import { useState } from 'preact/hooks';
import {
  toRetailPosition,
  retailMonths,
  retailYearStart,
  retailYearEnd,
  weeksInRetailYear,
  is53WeekYear,
  fmtUTCDate,
  fmtUTCShort,
  RETAIL_PATTERNS,
  type RetailPattern,
} from '../../lib/retail454';

const todayParts = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export default function RetailCalendarTool() {
  const [mode, setMode] = useState<'date' | 'year'>('date');
  const [pattern, setPattern] = useState<RetailPattern>('4-5-4');
  const [dateStr, setDateStr] = useState(todayParts);
  const [fy, setFy] = useState(() => {
    // default the year view to the current retail year
    const d = new Date();
    return toRetailPosition(d.getFullYear(), d.getMonth(), d.getDate()).fy;
  });

  const parts = dateStr.split('-').map(Number);
  const validDate = parts.length === 3 && parts.every((n) => Number.isFinite(n));
  const pos = validDate ? toRetailPosition(parts[0]!, parts[1]! - 1, parts[2]!, pattern) : null;

  const months = retailMonths(fy, pattern);
  const yStart = new Date(retailYearStart(fy));
  const yEnd = new Date(retailYearEnd(fy));
  const wks = weeksInRetailYear(fy);

  const tabCls = (active: boolean) =>
    `flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition ${active ? 'bg-brand-700 text-white' : 'bg-white text-slate-600 hover:text-brand-700'}`;
  const inputCls =
    'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const cell = (k: string, v: string) => (
    <div class="rounded-lg bg-slate-50 px-3 py-2">
      <span class="block text-xs font-semibold uppercase tracking-wide text-slate-500">{k}</span>
      <span class="font-mono font-bold text-slate-900">{v}</span>
    </div>
  );
  const qColors = ['bg-brand-50 text-brand-800', 'bg-mint-50 text-mint-800', 'bg-amber-50 text-amber-800', 'bg-violet-50 text-violet-800'];

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex gap-2 rounded-xl border border-slate-200 bg-white p-1.5">
        <button type="button" class={tabCls(mode === 'date')} onClick={() => setMode('date')}>📅 Date → retail period</button>
        <button type="button" class={tabCls(mode === 'year')} onClick={() => setMode('year')}>🗓️ Full year calendar</button>
      </div>

      <div class="mt-3 flex flex-wrap items-center gap-2">
        <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Pattern:</span>
        {RETAIL_PATTERNS.map((p) => (
          <button
            type="button"
            onClick={() => setPattern(p.id)}
            title={p.note}
            class={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition ${pattern === p.id ? 'border-brand-500 bg-brand-50 text-brand-800' : 'border-slate-300 bg-white text-slate-600 hover:border-brand-400'}`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <p class="mt-1.5 text-xs text-slate-500">{RETAIL_PATTERNS.find((p) => p.id === pattern)!.note}. All three give 13-week quarters; they differ only in where each quarter's 5-week month sits.</p>

      {mode === 'date' && (
        <div class="mt-4">
          <label for="rc-date" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Calendar date</label>
          <div class="flex flex-wrap gap-2">
            <input id="rc-date" type="date" value={dateStr} onInput={(e) => setDateStr((e.target as HTMLInputElement).value)} class="max-w-xs flex-1" style="min-width:12rem" />
            <button type="button" onClick={() => setDateStr(todayParts())} class="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-brand-400 hover:text-brand-700">Today</button>
          </div>

          {pos && (
            <div class="mt-4 rounded-xl border border-brand-100 bg-white p-4" aria-live="polite">
              <p class="text-2xl font-extrabold text-slate-900">
                FY{pos.fy} · Q{pos.quarter} · {pos.monthName}
              </p>
              <p class="mt-0.5 text-sm text-slate-600">Retail week {pos.weekOfYear} of {pos.weeksInYear} · {pos.dayOfWeek}</p>
              <div class="mt-3 grid gap-2 text-sm sm:grid-cols-3">
                {cell('Retail week of year', `${pos.weekOfYear} / ${pos.weeksInYear}`)}
                {cell('Week of month', `${pos.weekOfMonth}`)}
                {cell('Week of quarter', `${pos.weekOfQuarter} / 13`)}
                {cell('Retail month', `${pos.monthName} (M${pos.monthIndex})`)}
                {cell('Quarter', `Q${pos.quarter}`)}
                {cell('Fiscal year', `FY${pos.fy}`)}
              </div>
              <p class="mt-3 text-xs text-slate-500">
                FY{pos.fy} runs {fmtUTCDate(pos.yearStart)} → {fmtUTCDate(pos.yearEnd)} ({pos.weeksInYear} weeks{pos.weeksInYear === 53 ? ' — a 53-week year' : ''}).
              </p>
            </div>
          )}
        </div>
      )}

      {mode === 'year' && (
        <div class="mt-4">
          <div class="flex flex-wrap items-end gap-3">
            <div>
              <label for="rc-fy" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Retail fiscal year</label>
              <input id="rc-fy" type="number" min={1990} max={2100} value={fy} onInput={(e) => setFy(parseInt((e.target as HTMLInputElement).value, 10) || fy)} class={`${inputCls} w-32`} />
            </div>
            <p class="pb-2.5 text-sm text-slate-600">
              {fmtUTCDate(yStart)} → {fmtUTCDate(yEnd)} · <strong class={is53WeekYear(fy) ? 'text-amber-700' : 'text-slate-800'}>{wks} weeks{is53WeekYear(fy) ? ' (53-week year)' : ''}</strong>
            </p>
          </div>

          <div class="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th class="px-4 py-2">Qtr</th>
                  <th class="px-4 py-2">Retail month</th>
                  <th class="px-4 py-2 text-center">Weeks</th>
                  <th class="px-4 py-2">Starts</th>
                  <th class="px-4 py-2">Ends</th>
                  <th class="px-4 py-2 text-center">Wk #</th>
                </tr>
              </thead>
              <tbody>
                {months.map((m, i) => {
                  const firstInQ = i === 0 || months[i - 1]!.quarter !== m.quarter;
                  return (
                    <tr class={`border-b border-slate-100 last:border-0 ${firstInQ ? 'border-t-2 border-t-slate-200' : ''}`}>
                      <td class="px-4 py-2">{firstInQ ? <span class={`rounded px-2 py-0.5 text-xs font-bold ${qColors[m.quarter - 1]}`}>Q{m.quarter}</span> : ''}</td>
                      <td class="px-4 py-2 font-semibold text-slate-900">{m.name}</td>
                      <td class={`px-4 py-2 text-center font-mono font-bold ${m.weeks === 5 ? 'text-brand-700' : 'text-slate-700'}`}>{m.weeks}</td>
                      <td class="px-4 py-2 text-slate-700">{fmtUTCShort(m.start)}</td>
                      <td class="px-4 py-2 text-slate-700">{fmtUTCShort(m.end)}</td>
                      <td class="px-4 py-2 text-center font-mono text-slate-500">{m.startWeek}–{m.startWeek + m.weeks - 1}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p class="mt-2 text-xs text-slate-500">
            Pattern per quarter: {pattern} weeks{is53WeekYear(fy) ? ' — this 53-week year adds the extra week to January' : ''}. The 5-week months are highlighted.
          </p>
        </div>
      )}
      <p class="mt-3 text-xs text-slate-500">Computed on your device from the NRF 4-5-4 rules (year ends the Saturday nearest Jan 31). No lookup tables, no server.</p>
    </div>
  );
}
