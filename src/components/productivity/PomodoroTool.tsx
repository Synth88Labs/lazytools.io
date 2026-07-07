import { useEffect, useRef, useState } from 'preact/hooks';
import { usePersistentState, todayKey, useFullscreen } from '../../lib/persist';

type Phase = 'work' | 'short' | 'long';
interface Settings { work: number; short: number; long: number; cycles: number; autostart: boolean; sound: boolean; }
const DEFAULTS: Settings = { work: 25, short: 5, long: 15, cycles: 4, autostart: true, sound: true };

function beep() {
  try {
    const ctx = new AudioContext();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.value = 660; o.type = 'sine';
    o.connect(g); g.connect(ctx.destination);
    const t = ctx.currentTime;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.3, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
    o.start(t); o.stop(t + 0.62);
    setTimeout(() => ctx.close(), 800);
  } catch { /* no audio */ }
}

export default function PomodoroTool() {
  const [settings, setSettings] = usePersistentState<Settings>('lt.pomodoro.settings', DEFAULTS);
  const [stats, setStats] = usePersistentState<{ date: string; done: number }>('lt.pomodoro.today', { date: todayKey(), done: 0 });
  const [phase, setPhase] = useState<Phase>('work');
  const [cycle, setCycle] = useState(1);
  const [remaining, setRemaining] = useState(settings.work * 60);
  const [running, setRunning] = useState(false);
  const [task, setTask] = useState('');
  const fs = useFullscreen();
  const tick = useRef<number | null>(null);

  const phaseLen = (p: Phase) => (p === 'work' ? settings.work : p === 'short' ? settings.short : settings.long) * 60;
  const doneToday = stats.date === todayKey() ? stats.done : 0;

  // reset remaining when not running and settings/phase change
  useEffect(() => { if (!running) setRemaining(phaseLen(phase)); }, [settings.work, settings.short, settings.long, phase]);

  useEffect(() => {
    if (!running) { if (tick.current) clearInterval(tick.current); return; }
    tick.current = window.setInterval(() => setRemaining((r) => r - 1), 1000);
    return () => { if (tick.current) clearInterval(tick.current); };
  }, [running]);

  useEffect(() => {
    if (remaining > 0) return;
    // phase complete
    if (settings.sound) beep();
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification(phase === 'work' ? 'Focus session done — take a break' : 'Break over — back to work');
    }
    if (phase === 'work') {
      setStats((s) => ({ date: todayKey(), done: (s.date === todayKey() ? s.done : 0) + 1 }));
      const next: Phase = cycle % settings.cycles === 0 ? 'long' : 'short';
      setPhase(next); setRemaining(phaseLen(next));
    } else {
      if (phase === 'long') setCycle(1); else setCycle((c) => c + 1);
      setPhase('work'); setRemaining(phaseLen('work'));
    }
    setRunning(settings.autostart);
  }, [remaining]);

  const mmss = `${String(Math.floor(Math.max(0, remaining) / 60)).padStart(2, '0')}:${String(Math.max(0, remaining) % 60).padStart(2, '0')}`;
  useEffect(() => {
    document.title = running ? `${mmss} · ${phase === 'work' ? 'Focus' : 'Break'} — LazyTools` : 'Pomodoro Timer — Free & Private | LazyTools';
    return () => { document.title = 'Pomodoro Timer — Free & Private | LazyTools'; };
  }, [mmss, running, phase]);

  function start() {
    if (!running && typeof Notification !== 'undefined' && Notification.permission === 'default') Notification.requestPermission();
    setRunning((r) => !r);
  }
  function reset() { setRunning(false); setRemaining(phaseLen(phase)); }
  function skip() { setRunning(false); setRemaining(0); }

  const phaseColor = phase === 'work' ? 'text-brand-700' : 'text-mint-700';
  const ring = phase === 'work' ? 'ring-brand-200' : 'ring-mint-200';
  const num = 'w-16 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm font-semibold text-slate-900 focus:border-brand-500 focus:outline-none';
  const pct = Math.max(0, Math.min(1, remaining / phaseLen(phase)));

  return (
    <div ref={fs.ref} class={`rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6 ${fs.isFull ? 'fixed inset-0 z-[60] flex flex-col justify-center overflow-auto !rounded-none' : ''}`}>
      <div class="mb-2 flex justify-end">
        <button type="button" onClick={fs.toggle} class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-brand-400">{fs.isFull ? '⤢ Exit full screen' : '⛶ Full screen'}</button>
      </div>
      <div class={`flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 ring-4 ${ring}`}>
        <p class={`text-sm font-bold uppercase tracking-widest ${phaseColor}`}>
          {phase === 'work' ? '🍅 Focus' : phase === 'short' ? '☕ Short break' : '🛋️ Long break'} · cycle {cycle}/{settings.cycles}
        </p>
        <p class="mt-2 font-mono text-6xl font-extrabold tabular-nums text-slate-900 sm:text-7xl" aria-live="off">{mmss}</p>
        <span class="mt-3 h-2 w-full max-w-xs overflow-hidden rounded-full bg-slate-100">
          <span class={`block h-full rounded-full ${phase === 'work' ? 'bg-brand-500' : 'bg-mint-500'}`} style={`width:${pct * 100}%`} />
        </span>
        <input
          value={task}
          onInput={(e) => setTask((e.target as HTMLInputElement).value)}
          placeholder="What are you working on?"
          class="mt-4 w-full max-w-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-center text-sm text-slate-800 focus:border-brand-500 focus:outline-none"
        />
        <div class="mt-4 flex gap-2">
          <button type="button" onClick={start} class="rounded-xl bg-brand-700 px-8 py-2.5 text-base font-semibold text-white transition hover:bg-brand-800">
            {running ? '⏸ Pause' : '▶ Start'}
          </button>
          <button type="button" onClick={reset} class="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-brand-400">↺ Reset</button>
          <button type="button" onClick={skip} class="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-brand-400">⏭ Skip</button>
        </div>
        <p class="mt-4 text-sm font-medium text-slate-500">✓ {doneToday} focus session{doneToday === 1 ? '' : 's'} completed today</p>
      </div>

      <div class="mt-4 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
        {([['work', 'Focus (min)'], ['short', 'Short break'], ['long', 'Long break'], ['cycles', 'Cycles → long']] as const).map(([k, label]) => (
          <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {label}
            <input type="number" min={1} max={k === 'cycles' ? 12 : 180} value={settings[k]} onInput={(e) => setSettings((s) => ({ ...s, [k]: Math.max(1, parseInt((e.target as HTMLInputElement).value, 10) || 1) }))} class={`${num} mt-1 block`} />
          </label>
        ))}
      </div>
      <div class="mt-3 flex flex-wrap gap-4">
        <label class="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input type="checkbox" checked={settings.autostart} onChange={(e) => setSettings((s) => ({ ...s, autostart: (e.target as HTMLInputElement).checked }))} class="h-4 w-4 rounded border-slate-300 text-brand-600" />
          Auto-start next phase
        </label>
        <label class="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input type="checkbox" checked={settings.sound} onChange={(e) => setSettings((s) => ({ ...s, sound: (e.target as HTMLInputElement).checked }))} class="h-4 w-4 rounded border-slate-300 text-brand-600" />
          Sound when a phase ends
        </label>
      </div>
      <p class="mt-3 text-xs text-slate-500">Your settings and today's count are saved in this browser only — nothing is uploaded.</p>
    </div>
  );
}
