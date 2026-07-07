import { useEffect, useRef, useState } from 'preact/hooks';
import { usePersistentState } from '../../lib/persist';

interface Cfg { attendees: number; rate: number; hours: number; minutes: number; freq: 'once' | 'weekly' | 'biweekly' | 'monthly'; currency: string; }
const DEFAULTS: Cfg = { attendees: 6, rate: 60, hours: 1, minutes: 0, freq: 'weekly', currency: '$' };
const PER_YEAR: Record<Cfg['freq'], number> = { once: 1, weekly: 52, biweekly: 26, monthly: 12 };

export default function MeetingCostTool() {
  const [cfg, setCfg] = usePersistentState<Cfg>('lt.meetingcost', DEFAULTS);
  const durHours = cfg.hours + cfg.minutes / 60;
  const perMeeting = cfg.attendees * cfg.rate * durHours;
  const annual = perMeeting * PER_YEAR[cfg.freq];

  // live meter
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0); // seconds
  const tick = useRef<number | null>(null);
  useEffect(() => {
    if (!running) { if (tick.current) clearInterval(tick.current); return; }
    tick.current = window.setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => { if (tick.current) clearInterval(tick.current); };
  }, [running]);
  const liveCost = (cfg.attendees * cfg.rate / 3600) * elapsed;
  const fmt = (n: number) => `${cfg.currency}${n.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
  const mmss = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`;

  const num = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 focus:border-brand-500 focus:outline-none';
  const set = (patch: Partial<Cfg>) => setCfg((c) => ({ ...c, ...patch }));

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Attendees
          <input type="number" min={1} max={1000} value={cfg.attendees} onInput={(e) => set({ attendees: Math.max(1, parseInt((e.target as HTMLInputElement).value, 10) || 1) })} class={`${num} mt-1`} />
        </label>
        <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Avg hourly rate
          <div class="mt-1 flex gap-1">
            <select value={cfg.currency} onChange={(e) => set({ currency: (e.target as HTMLSelectElement).value })} class="rounded-xl border border-slate-300 bg-white px-2 text-sm">
              {['$', '€', '£', '₹', '¥', 'A$', 'C$'].map((c) => <option value={c}>{c}</option>)}
            </select>
            <input type="number" min={0} value={cfg.rate} onInput={(e) => set({ rate: Math.max(0, parseFloat((e.target as HTMLInputElement).value) || 0) })} class={num} />
          </div>
        </label>
        <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Duration
          <div class="mt-1 flex gap-1">
            <input type="number" min={0} max={24} value={cfg.hours} onInput={(e) => set({ hours: Math.max(0, parseInt((e.target as HTMLInputElement).value, 10) || 0) })} class={num} aria-label="hours" />
            <span class="self-center text-xs text-slate-400">h</span>
            <input type="number" min={0} max={59} step={5} value={cfg.minutes} onInput={(e) => set({ minutes: Math.max(0, Math.min(59, parseInt((e.target as HTMLInputElement).value, 10) || 0)) })} class={num} aria-label="minutes" />
            <span class="self-center text-xs text-slate-400">m</span>
          </div>
        </label>
        <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Repeats
          <select value={cfg.freq} onChange={(e) => set({ freq: (e.target as HTMLSelectElement).value as Cfg['freq'] })} class={`${num} mt-1`}>
            <option value="once">One-off</option>
            <option value="weekly">Weekly</option>
            <option value="biweekly">Every 2 weeks</option>
            <option value="monthly">Monthly</option>
          </select>
        </label>
      </div>

      <div class="mt-4 grid gap-3 sm:grid-cols-3">
        <div class="rounded-xl border border-brand-100 bg-white p-4 text-center">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Cost per meeting</p>
          <p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(perMeeting)}</p>
          <p class="text-xs text-slate-500">{cfg.attendees} people × {durHours.toFixed(2)}h × {cfg.currency}{cfg.rate}/h</p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Per person</p>
          <p class="mt-1 text-3xl font-extrabold text-slate-900">{fmt(cfg.rate * durHours)}</p>
          <p class="text-xs text-slate-500">the time each attendee spends</p>
        </div>
        <div class={`rounded-xl border p-4 text-center ${cfg.freq === 'once' ? 'border-slate-200 bg-white' : 'border-amber-200 bg-amber-50'}`}>
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Cost per year</p>
          <p class={`mt-1 text-3xl font-extrabold ${cfg.freq === 'once' ? 'text-slate-900' : 'text-amber-700'}`}>{fmt(annual)}</p>
          <p class="text-xs text-slate-500">{cfg.freq === 'once' ? 'one-off' : `× ${PER_YEAR[cfg.freq]} a year`}</p>
        </div>
      </div>

      <div class="mt-4 rounded-xl border border-slate-200 bg-white p-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">🔴 Live meeting meter</p>
            <p class="mt-1 text-2xl font-extrabold text-red-600 tabular-nums">{fmt(liveCost)} <span class="font-mono text-base font-medium text-slate-400">· {mmss}</span></p>
          </div>
          <div class="flex gap-2">
            <button type="button" onClick={() => setRunning((r) => !r)} class="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700">{running ? '⏸ Pause' : '▶ Start meter'}</button>
            <button type="button" onClick={() => { setRunning(false); setElapsed(0); }} class="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:border-brand-400">Reset</button>
          </div>
        </div>
        <p class="mt-2 text-xs text-slate-500">Start it at the top of a real meeting and watch what it's costing in real time.</p>
      </div>
      <p class="mt-3 text-xs text-slate-500">Inputs are saved in this browser only. A rough rule of thumb: fully-loaded cost is often ~1.3–1.4× salary once overheads are included.</p>
    </div>
  );
}
