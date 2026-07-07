import { useState } from 'preact/hooks';
import {
  CALENDAR_SYSTEMS,
  toCalendar,
  fromCalendar,
  toDateInput,
  fromDateInput,
  weekdayUTC,
  type CalendarSystem,
} from '../../lib/calendars';

interface Props {
  /** 'multi' = Gregorian → every system + a reverse picker; 'single' = one pinned system, both ways. */
  mode: 'multi' | 'single';
  system?: string;
}

const todayInput = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export default function CalendarConverterTool({ mode, system }: Props) {
  const pinned: CalendarSystem | undefined = system ? CALENDAR_SYSTEMS.find((s) => s.id === system) : undefined;
  const reversible = CALENDAR_SYSTEMS.filter((s) => s.reversible && s.id !== 'gregory');

  const [greg, setGreg] = useState(todayInput);
  const [revSys, setRevSys] = useState(pinned?.reversible ? pinned.id : reversible[0]!.id);
  const [ry, setRy] = useState('1447');
  const [rm, setRm] = useState('1');
  const [rd, setRd] = useState('1');

  const gregMs = fromDateInput(greg);

  const inputCls =
    'rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  // ---- reverse result ----
  const curSys = CALENDAR_SYSTEMS.find((s) => s.id === revSys)!;
  const isJdn = revSys === 'jdn';
  const revMs = (() => {
    const y = parseInt(ry, 10);
    if (!Number.isFinite(y)) return null;
    if (isJdn) return fromCalendar('jdn', y, 0, 0);
    const m = parseInt(rm, 10), d = parseInt(rd, 10);
    if (!Number.isFinite(m) || !Number.isFinite(d)) return null;
    return fromCalendar(revSys, y, m, d);
  })();
  const revEcho = revMs !== null ? toCalendar(revMs, revSys) : null; // confirm what we resolved

  const forwardRows = gregMs !== null ? CALENDAR_SYSTEMS.map((s) => ({ s, v: toCalendar(gregMs, s.id) })) : [];

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      {/* ---- Gregorian -> calendar(s) ---- */}
      <div>
        <label for="cc-greg" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Gregorian date</label>
        <div class="flex flex-wrap gap-2">
          <input id="cc-greg" type="date" value={greg} onInput={(e) => setGreg((e.target as HTMLInputElement).value)} class={inputCls} style="min-width:12rem" />
          <button type="button" onClick={() => setGreg(todayInput())} class="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-brand-400 hover:text-brand-700">Today</button>
        </div>
      </div>

      {gregMs !== null && (
        <div class="mt-4" aria-live="polite">
          {mode === 'single' && pinned ? (
            <div class="rounded-xl border border-brand-100 bg-white p-4">
              <p class="text-xs font-semibold uppercase tracking-wide text-brand-700">{pinned.name}</p>
              <p class="mt-1 text-2xl font-extrabold text-slate-900">{toCalendar(gregMs, pinned.id).long}</p>
              <p class="mt-1 text-sm text-slate-500">{weekdayUTC(gregMs)} · {pinned.note}</p>
            </div>
          ) : (
            <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th class="px-4 py-2">Calendar</th>
                    <th class="px-4 py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {forwardRows.map(({ s, v }) => (
                    <tr class={`border-b border-slate-100 last:border-0 ${s.id === 'gregory' ? 'bg-brand-50/40' : ''}`}>
                      <td class="px-4 py-2 font-semibold text-slate-900">{s.name}{s.id !== 'gregory' && !s.reversible ? <span class="ml-1 text-xs font-normal text-slate-400">(display only)</span> : ''}</td>
                      <td class="px-4 py-2 font-medium text-slate-700">{v.long}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ---- reverse: calendar -> Gregorian ---- */}
      {(mode === 'multi' || (pinned && pinned.reversible)) && (
        <div class="mt-6 border-t border-slate-200 pt-5">
          <p class="mb-2 text-sm font-semibold text-slate-900">
            {pinned ? `${pinned.name} → Gregorian` : 'Convert back to Gregorian'}
          </p>
          <div class="flex flex-wrap items-end gap-2">
            {mode === 'multi' && (
              <div>
                <label for="cc-sys" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">From calendar</label>
                <select id="cc-sys" value={revSys} onChange={(e) => setRevSys((e.target as HTMLSelectElement).value)} class={inputCls}>
                  {reversible.map((s) => <option value={s.id}>{s.name}</option>)}
                </select>
              </div>
            )}
            <div>
              <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{isJdn ? 'Julian Day Number' : 'Year'}</label>
              <input type="number" value={ry} onInput={(e) => setRy((e.target as HTMLInputElement).value)} class={`${inputCls} w-28`} />
            </div>
            {!isJdn && (
              <>
                <div>
                  <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Month #</label>
                  <input type="number" min={1} max={13} value={rm} onInput={(e) => setRm((e.target as HTMLInputElement).value)} class={`${inputCls} w-20`} />
                </div>
                <div>
                  <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Day</label>
                  <input type="number" min={1} max={31} value={rd} onInput={(e) => setRd((e.target as HTMLInputElement).value)} class={`${inputCls} w-20`} />
                </div>
              </>
            )}
          </div>

          <div class="mt-3 rounded-xl border border-brand-100 bg-white p-4" aria-live="polite">
            {revMs !== null && revEcho ? (
              <>
                <p class="text-2xl font-extrabold text-slate-900">{new Date(revMs).toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p class="mt-1 text-sm text-slate-500">
                  Gregorian · {toDateInput(revMs)}{!isJdn ? ` · resolves ${curSys.name}: ${revEcho.long}` : ''}
                </p>
              </>
            ) : (
              <p class="text-sm text-slate-500">Enter a valid {isJdn ? 'Julian Day Number' : `${curSys.name} year, month number and day`}.</p>
            )}
          </div>
          {!isJdn && curSys.months === undefined && (
            <p class="mt-2 text-xs text-slate-500">This calendar's month count varies by year — the resolved date above confirms which month your number maps to.</p>
          )}
        </div>
      )}
      <p class="mt-3 text-xs text-slate-500">Forward conversion uses your browser's built-in ICU calendar data; reverse inverts it exactly. All computed on your device.</p>
    </div>
  );
}
