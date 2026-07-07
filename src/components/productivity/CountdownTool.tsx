import { useEffect, useRef, useState } from 'preact/hooks';
import { usePersistentState } from '../../lib/persist';

function beep(freq = 700) {
  try {
    const ctx = new AudioContext();
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.frequency.value = freq; o.connect(g); g.connect(ctx.destination);
    const t = ctx.currentTime;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.3, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
    o.start(t); o.stop(t + 0.42); setTimeout(() => ctx.close(), 600);
  } catch { /* */ }
}

export default function CountdownTool() {
  const [mode, setMode] = useState<'countdown' | 'stopwatch' | 'interval'>('countdown');
  const tabCls = (a: boolean) => `flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${a ? 'bg-brand-700 text-white' : 'bg-white text-slate-600 hover:text-brand-700'}`;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex gap-2 rounded-xl border border-slate-200 bg-white p-1.5">
        <button type="button" class={tabCls(mode === 'countdown')} onClick={() => setMode('countdown')}>⏳ Countdown</button>
        <button type="button" class={tabCls(mode === 'stopwatch')} onClick={() => setMode('stopwatch')}>⏱ Stopwatch</button>
        <button type="button" class={tabCls(mode === 'interval')} onClick={() => setMode('interval')}>🔁 Interval</button>
      </div>
      <div class="mt-4">
        {mode === 'countdown' && <Countdown />}
        {mode === 'stopwatch' && <Stopwatch />}
        {mode === 'interval' && <Interval />}
      </div>
    </div>
  );
}

function Countdown() {
  const [target, setTarget] = usePersistentState<string>('lt.countdown.target', '');
  const [label, setLabel] = usePersistentState<string>('lt.countdown.label', 'New Year');
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const targetMs = target ? new Date(target).getTime() : NaN;
  const diff = Number.isFinite(targetMs) ? targetMs - now : NaN;
  const past = diff <= 0;
  const abs = Math.abs(diff);
  const d = Math.floor(abs / 86400000), h = Math.floor((abs % 86400000) / 3600000), m = Math.floor((abs % 3600000) / 60000), s = Math.floor((abs % 60000) / 1000);
  const cell = (v: number, unit: string) => (
    <div class="flex flex-col items-center rounded-xl bg-white px-3 py-3 sm:px-5"><span class="font-mono text-4xl font-extrabold tabular-nums text-brand-800 sm:text-5xl">{String(v).padStart(2, '0')}</span><span class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{unit}</span></div>
  );
  const inputCls = 'rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-brand-500 focus:outline-none';
  return (
    <div>
      <div class="flex flex-wrap gap-2">
        <input value={label} onInput={(e) => setLabel((e.target as HTMLInputElement).value)} placeholder="Event name" class={`${inputCls} flex-1`} />
        <input type="datetime-local" value={target} onInput={(e) => setTarget((e.target as HTMLInputElement).value)} class={inputCls} />
      </div>
      {Number.isFinite(targetMs) ? (
        <div class="mt-4 rounded-2xl border border-brand-100 bg-brand-50/40 p-5 text-center">
          <p class="text-sm font-semibold text-slate-600">{past ? `Since ${label || 'the event'}` : `Until ${label || 'the event'}`}</p>
          <div class="mt-3 flex flex-wrap justify-center gap-2">{cell(d, 'days')}{cell(h, 'hours')}{cell(m, 'min')}{cell(s, 'sec')}</div>
        </div>
      ) : (
        <p class="mt-4 rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-400">Pick a target date and time above.</p>
      )}
    </div>
  );
}

function Stopwatch() {
  const [running, setRunning] = useState(false);
  const [ms, setMs] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);
  const raf = useRef<number | null>(null);
  const start = useRef(0);
  useEffect(() => {
    if (!running) return;
    start.current = performance.now() - ms;
    const loop = () => { setMs(performance.now() - start.current); raf.current = requestAnimationFrame(loop); };
    raf.current = requestAnimationFrame(loop);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [running]);
  const fmt = (t: number) => { const cs = Math.floor((t % 1000) / 10), sec = Math.floor(t / 1000) % 60, min = Math.floor(t / 60000); return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(cs).padStart(2, '0')}`; };
  return (
    <div class="text-center">
      <p class="font-mono text-6xl font-extrabold tabular-nums text-slate-900 sm:text-7xl">{fmt(ms)}</p>
      <div class="mt-4 flex justify-center gap-2">
        <button type="button" onClick={() => setRunning((r) => !r)} class="rounded-xl bg-brand-700 px-8 py-2.5 text-base font-semibold text-white hover:bg-brand-800">{running ? '⏸ Stop' : '▶ Start'}</button>
        <button type="button" onClick={() => running ? setLaps((l) => [...l, ms]) : (setMs(0), setLaps([]))} class="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 hover:border-brand-400">{running ? 'Lap' : 'Reset'}</button>
      </div>
      {laps.length > 0 && (
        <ol class="mx-auto mt-4 max-w-xs space-y-1 text-left text-sm">
          {laps.map((l, i) => (
            <li class="flex justify-between rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-mono"><span class="text-slate-400">Lap {i + 1}</span><span class="text-slate-800">{fmt(l - (laps[i - 1] ?? 0))}</span><span class="text-slate-500">{fmt(l)}</span></li>
          ))}
        </ol>
      )}
    </div>
  );
}

function Interval() {
  const [cfg, setCfg] = usePersistentState('lt.interval', { work: 30, rest: 15, rounds: 8 });
  const [running, setRunning] = useState(false);
  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState<'work' | 'rest'>('work');
  const [left, setLeft] = useState(cfg.work);
  const tick = useRef<number | null>(null);
  useEffect(() => { if (!running) setLeft(phase === 'work' ? cfg.work : cfg.rest); }, [cfg.work, cfg.rest]);
  useEffect(() => {
    if (!running) { if (tick.current) clearInterval(tick.current); return; }
    tick.current = window.setInterval(() => setLeft((l) => l - 1), 1000);
    return () => { if (tick.current) clearInterval(tick.current); };
  }, [running]);
  useEffect(() => {
    if (left > 0) return;
    beep(phase === 'work' ? 500 : 800);
    if (phase === 'work') { setPhase('rest'); setLeft(cfg.rest); }
    else { if (round >= cfg.rounds) { setRunning(false); setRound(1); setPhase('work'); setLeft(cfg.work); } else { setRound((r) => r + 1); setPhase('work'); setLeft(cfg.work); } }
  }, [left]);
  const num = 'w-16 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm font-semibold text-slate-900 focus:border-brand-500 focus:outline-none';
  return (
    <div>
      <div class={`rounded-2xl border p-6 text-center ${phase === 'work' ? 'border-brand-200 bg-brand-50/50' : 'border-mint-200 bg-mint-50/50'}`}>
        <p class={`text-sm font-bold uppercase tracking-widest ${phase === 'work' ? 'text-brand-700' : 'text-mint-700'}`}>{phase === 'work' ? '💪 Work' : '😮‍💨 Rest'} · round {round}/{cfg.rounds}</p>
        <p class="mt-1 font-mono text-6xl font-extrabold tabular-nums text-slate-900">{String(Math.max(0, left)).padStart(2, '0')}</p>
        <div class="mt-3 flex justify-center gap-2">
          <button type="button" onClick={() => setRunning((r) => !r)} class="rounded-xl bg-brand-700 px-8 py-2.5 text-base font-semibold text-white hover:bg-brand-800">{running ? '⏸ Pause' : '▶ Start'}</button>
          <button type="button" onClick={() => { setRunning(false); setRound(1); setPhase('work'); setLeft(cfg.work); }} class="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:border-brand-400">Reset</button>
        </div>
      </div>
      <div class="mt-4 flex flex-wrap gap-4">
        {([['work', 'Work (sec)'], ['rest', 'Rest (sec)'], ['rounds', 'Rounds']] as const).map(([k, label]) => (
          <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}<input type="number" min={1} max={k === 'rounds' ? 50 : 600} value={cfg[k]} onInput={(e) => setCfg((c) => ({ ...c, [k]: Math.max(1, parseInt((e.target as HTMLInputElement).value, 10) || 1) }))} class={`${num} mt-1 block`} /></label>
        ))}
      </div>
    </div>
  );
}
