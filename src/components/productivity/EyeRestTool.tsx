import { useEffect, useRef, useState } from 'preact/hooks';
import { usePersistentState } from '../../lib/persist';

function chime(freq = 620) {
  try {
    const ctx = new AudioContext(); const o = ctx.createOscillator(); const g = ctx.createGain();
    o.frequency.value = freq; o.connect(g); g.connect(ctx.destination); const t = ctx.currentTime;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.25, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
    o.start(t); o.stop(t + 0.72); setTimeout(() => ctx.close(), 900);
  } catch { /* */ }
}

export default function EyeRestTool() {
  const [cfg, setCfg] = usePersistentState('lt.eyerest', { work: 20, rest: 20, sound: true });
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<'work' | 'rest'>('work');
  const [left, setLeft] = useState(cfg.work * 60);
  const tick = useRef<number | null>(null);

  useEffect(() => { if (!running) setLeft(phase === 'work' ? cfg.work * 60 : cfg.rest); }, [cfg.work, cfg.rest, phase]);
  useEffect(() => {
    if (!running) { if (tick.current) clearInterval(tick.current); return; }
    tick.current = window.setInterval(() => setLeft((l) => l - 1), 1000);
    return () => { if (tick.current) clearInterval(tick.current); };
  }, [running]);
  useEffect(() => {
    if (left > 0) return;
    if (cfg.sound) chime(phase === 'work' ? 620 : 480);
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') new Notification(phase === 'work' ? '👀 Look 20 feet away for 20 seconds' : 'Break over — back to it');
    if (phase === 'work') { setPhase('rest'); setLeft(cfg.rest); } else { setPhase('work'); setLeft(cfg.work * 60); }
  }, [left]);

  const mm = String(Math.floor(Math.max(0, left) / 60)).padStart(2, '0');
  const ss = String(Math.max(0, left) % 60).padStart(2, '0');
  const num = 'w-16 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm font-semibold text-slate-900 focus:border-brand-500 focus:outline-none';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class={`rounded-2xl border p-6 text-center ${phase === 'rest' ? 'border-mint-300 bg-mint-50' : 'border-slate-200 bg-white'}`}>
        <p class={`text-sm font-bold uppercase tracking-widest ${phase === 'rest' ? 'text-mint-700' : 'text-slate-500'}`}>
          {phase === 'rest' ? '👀 Rest your eyes — look ~20 ft (6 m) away' : '💻 Focus time'}
        </p>
        <p class="mt-2 font-mono text-6xl font-extrabold tabular-nums text-slate-900">{mm}:{ss}</p>
        <p class="mt-1 text-sm text-slate-500">{phase === 'work' ? `next eye break in ${mm}:${ss}` : `look away for ${left}s`}</p>
        <div class="mt-4 flex justify-center gap-2">
          <button type="button" onClick={() => { if (!running && typeof Notification !== 'undefined' && Notification.permission === 'default') Notification.requestPermission(); setRunning((r) => !r); }} class="rounded-xl bg-brand-700 px-8 py-2.5 text-base font-semibold text-white hover:bg-brand-800">{running ? '⏸ Pause' : '▶ Start'}</button>
          <button type="button" onClick={() => { setRunning(false); setPhase('work'); setLeft(cfg.work * 60); }} class="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:border-brand-400">Reset</button>
        </div>
      </div>
      <div class="mt-4 flex flex-wrap items-end gap-4">
        <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Work (min)<input type="number" min={1} max={120} value={cfg.work} onInput={(e) => setCfg((c) => ({ ...c, work: Math.max(1, parseInt((e.target as HTMLInputElement).value, 10) || 20) }))} class={`${num} mt-1 block`} /></label>
        <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Rest (sec)<input type="number" min={5} max={120} value={cfg.rest} onInput={(e) => setCfg((c) => ({ ...c, rest: Math.max(5, parseInt((e.target as HTMLInputElement).value, 10) || 20) }))} class={`${num} mt-1 block`} /></label>
        <label class="flex items-center gap-2 pb-2 text-sm font-medium text-slate-700"><input type="checkbox" checked={cfg.sound} onChange={(e) => setCfg((c) => ({ ...c, sound: (e.target as HTMLInputElement).checked }))} class="h-4 w-4 rounded border-slate-300 text-brand-600" />Chime</label>
      </div>
      <p class="mt-3 text-xs text-slate-500">The 20-20-20 rule: every 20 minutes, look at something ~20 feet away for 20 seconds to ease digital eye strain. Runs locally; keep the tab open for the reminder.</p>
    </div>
  );
}
