import { useEffect, useRef, useState } from 'preact/hooks';

const DURATIONS = [5, 10];

export default function CpsTest() {
  const [duration, setDuration] = useState(5);
  const [clicks, setClicks] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [left, setLeft] = useState(5);
  const startRef = useRef(0);

  const reset = (d = duration) => {
    setClicks(0);
    setRunning(false);
    setDone(false);
    setLeft(d);
  };

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const elapsed = (performance.now() - startRef.current) / 1000;
      const rem = Math.max(0, duration - elapsed);
      setLeft(rem);
      if (rem <= 0) {
        setRunning(false);
        setDone(true);
        clearInterval(id);
      }
    }, 50);
    return () => clearInterval(id);
  }, [running, duration]);

  const onClick = () => {
    if (done) return;
    if (!running) {
      startRef.current = performance.now();
      setRunning(true);
      setClicks(1);
      setLeft(duration);
      return;
    }
    setClicks((c) => c + 1);
  };

  const cps = done ? (clicks / duration).toFixed(1) : running ? (clicks / Math.max(duration - left, 0.1)).toFixed(1) : '0.0';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex gap-1.5">
          {DURATIONS.map((d) => (
            <button
              type="button"
              disabled={running}
              onClick={() => {
                setDuration(d);
                reset(d);
              }}
              class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition disabled:opacity-40 ${d === duration ? 'bg-brand-700 text-white' : 'border border-slate-300 bg-white text-slate-600 hover:border-brand-400'}`}
            >
              {d} seconds
            </button>
          ))}
        </div>
        <span class="rounded-md bg-white px-2.5 py-1 font-mono text-sm font-bold text-brand-700 ring-1 ring-slate-200">⏱ {left.toFixed(1)}s</span>
      </div>

      <button
        type="button"
        onClick={onClick}
        disabled={done}
        class={`mt-4 flex min-h-[240px] w-full flex-col items-center justify-center rounded-xl px-6 text-center transition ${done ? 'cursor-default bg-brand-700 text-white' : running ? 'cursor-pointer bg-emerald-500 text-white active:bg-emerald-600' : 'cursor-pointer bg-slate-800 text-white hover:bg-slate-900'}`}
      >
        {done ? (
          <>
            <p class="text-sm font-semibold uppercase tracking-wide opacity-80">Your speed</p>
            <p class="text-6xl font-extrabold">{cps} <span class="text-2xl font-bold opacity-80">CPS</span></p>
            <p class="mt-1 opacity-90">{clicks} clicks in {duration} seconds</p>
          </>
        ) : running ? (
          <>
            <p class="text-6xl font-extrabold">{clicks}</p>
            <p class="mt-1 opacity-90">clicks · keep going!</p>
          </>
        ) : (
          <>
            <p class="text-2xl font-extrabold">Click here as fast as you can</p>
            <p class="mt-2 opacity-90">The timer starts on your first click.</p>
          </>
        )}
      </button>

      <div class="mt-4 flex items-center justify-between">
        <p class="text-xs text-slate-500">{done ? 'Press restart to go again.' : 'Steady, jitter or butterfly clicking — your choice.'}</p>
        <button type="button" onClick={() => reset()} class="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-800">↻ Restart</button>
      </div>
    </div>
  );
}
