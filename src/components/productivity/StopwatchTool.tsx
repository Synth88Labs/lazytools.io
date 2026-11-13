import { useEffect, useRef, useState } from 'preact/hooks';

function fmt(ms: number): string {
  const cs = Math.floor(ms / 10) % 100;
  const s = Math.floor(ms / 1000) % 60;
  const m = Math.floor(ms / 60000) % 60;
  const h = Math.floor(ms / 3600000);
  const p = (n: number, w = 2) => String(n).padStart(w, '0');
  return (h > 0 ? `${p(h)}:` : '') + `${p(m)}:${p(s)}.${p(cs)}`;
}

export default function StopwatchTool() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0); // accumulated ms
  const [, force] = useState(0);
  const startRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [laps, setLaps] = useState<number[]>([]);

  const total = () => elapsed + (running ? performance.now() - startRef.current : 0);

  useEffect(() => {
    if (!running) return;
    const tick = () => { force((n) => n + 1); rafRef.current = requestAnimationFrame(tick); };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current != null) cancelAnimationFrame(rafRef.current); };
  }, [running]);

  const startStop = () => {
    if (running) {
      setElapsed((e) => e + (performance.now() - startRef.current));
      setRunning(false);
    } else {
      startRef.current = performance.now();
      setRunning(true);
    }
  };
  const reset = () => { setRunning(false); setElapsed(0); setLaps([]); };
  const lap = () => { if (running || elapsed) setLaps((l) => [...l, total()]); };

  const t = total();

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
      <p class="text-center font-mono text-6xl font-extrabold tabular-nums text-slate-900 sm:text-7xl">{fmt(t)}</p>

      <div class="mt-6 flex items-center justify-center gap-3">
        <button type="button" onClick={startStop} class={`rounded-xl px-8 py-3 text-base font-semibold text-white transition ${running ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'}`}>{running ? '⏸ Stop' : '▶ Start'}</button>
        <button type="button" onClick={lap} disabled={!running && !elapsed} class="rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition hover:border-brand-400 disabled:opacity-40">⚑ Lap</button>
        <button type="button" onClick={reset} class="rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition hover:border-red-400 hover:text-red-600">↺ Reset</button>
      </div>

      {laps.length > 0 && (
        <div class="mx-auto mt-6 max-w-sm">
          <table class="w-full text-sm">
            <thead><tr class="text-slate-400"><th class="py-1 text-left font-medium">Lap</th><th class="py-1 text-right font-medium">Split</th><th class="py-1 text-right font-medium">Total</th></tr></thead>
            <tbody>
              {laps.map((lapTotal, i) => {
                const split = lapTotal - (i > 0 ? laps[i - 1] : 0);
                return (
                  <tr class="border-t border-slate-100">
                    <td class="py-1.5 font-semibold text-slate-700">#{i + 1}</td>
                    <td class="py-1.5 text-right font-mono text-slate-600">{fmt(split)}</td>
                    <td class="py-1.5 text-right font-mono text-slate-900">{fmt(lapTotal)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
