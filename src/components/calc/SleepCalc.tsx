import { useState } from 'preact/hooks';

const CYCLE = 90; // minutes per sleep cycle (average)

/** "HH:MM" (24h) → minutes since midnight, or null. */
function parseTime(s: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(s.trim());
  if (!m) return null;
  const h = +m[1], min = +m[2];
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

/** minutes since midnight → "7:30 AM" */
function fmt12(mins: number): string {
  const m = ((mins % 1440) + 1440) % 1440;
  let h = Math.floor(m / 60);
  const mm = m % 60;
  const ap = h < 12 ? 'AM' : 'PM';
  h = h % 12 || 12;
  return `${h}:${String(mm).padStart(2, '0')} ${ap}`;
}

const hoursLabel = (cycles: number) => {
  const h = (cycles * CYCLE) / 60;
  return Number.isInteger(h) ? `${h} hr` : `${h} hr`;
};

interface Row { cycles: number; time: number; ideal: boolean }

export default function SleepCalc() {
  const [mode, setMode] = useState<'wake' | 'bed'>('wake');
  const [time, setTime] = useState('07:00');
  const [latency, setLatency] = useState(15);

  const base = parseTime(time);
  const cyclesList = [6, 5, 4, 3]; // 9h, 7.5h, 6h, 4.5h

  let rows: Row[] = [];
  if (base !== null) {
    rows = cyclesList.map((c) => {
      const total = c * CYCLE + latency;
      const t = mode === 'wake' ? base - total : base + total;
      return { cycles: c, time: t, ideal: c === 5 || c === 6 };
    });
  }

  function setNow() {
    const d = new Date();
    setTime(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
  }

  const seg = 'flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition';
  const field = 'rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      {/* Mode toggle */}
      <div class="mb-4 flex gap-2 rounded-xl bg-white p-1 ring-1 ring-slate-200">
        <button type="button" onClick={() => setMode('wake')} class={`${seg} ${mode === 'wake' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>
          ⏰ I want to wake up at…
        </button>
        <button type="button" onClick={() => setMode('bed')} class={`${seg} ${mode === 'bed' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>
          🛏️ I'm going to bed at…
        </button>
      </div>

      <div class="flex flex-wrap items-end gap-4">
        <label class="block">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{mode === 'wake' ? 'Wake-up time' : 'Bedtime'}</span>
          <div class="flex items-center gap-2">
            <input type="time" value={time} onInput={(e) => setTime((e.target as HTMLInputElement).value)} class={field} />
            {mode === 'bed' && (
              <button type="button" onClick={setNow} class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-brand-400">Now</button>
            )}
          </div>
        </label>
        <label class="block">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Time to fall asleep</span>
          <div class="flex items-center gap-2">
            <input type="number" min={0} max={60} value={latency} onInput={(e) => setLatency(Math.max(0, Math.min(60, parseInt((e.target as HTMLInputElement).value, 10) || 0)))} class={`${field} w-20`} />
            <span class="text-sm text-slate-500">min</span>
          </div>
        </label>
      </div>

      {/* Results */}
      {base !== null ? (
        <div class="mt-5">
          <p class="mb-2 text-sm font-medium text-slate-600">
            {mode === 'wake'
              ? <>To wake at <strong>{fmt12(base)}</strong>, head to bed at one of these times:</>
              : <>Falling asleep around <strong>{fmt12(base + latency)}</strong>, wake up at one of these times:</>}
          </p>
          <div class="grid gap-3 sm:grid-cols-2">
            {rows.map((r) => (
              <div class={`rounded-xl p-4 ${r.ideal ? 'bg-white ring-2 ring-brand-300' : 'bg-white ring-1 ring-slate-200'}`}>
                <div class="flex items-baseline justify-between">
                  <p class={`text-3xl font-extrabold ${r.ideal ? 'text-brand-800' : 'text-slate-700'}`}>{fmt12(r.time)}</p>
                  {r.ideal && <span class="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-bold text-brand-800">Recommended</span>}
                </div>
                <p class="mt-1 text-sm text-slate-500">{r.cycles} cycles · {hoursLabel(r.cycles)} of sleep</p>
              </div>
            ))}
          </div>
          <p class="mt-4 text-xs text-slate-500">
            Based on 90-minute sleep cycles plus {latency} min to fall asleep. Waking at the <strong>end</strong> of a cycle
            leaves you less groggy — so 5 or 6 complete cycles (7.5–9 hours) suits most adults. 🔒 Runs in your browser.
          </p>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a valid time to see your recommended {mode === 'wake' ? 'bedtimes' : 'wake-up times'}.</p>
      )}
    </div>
  );
}
