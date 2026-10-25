import { useRef, useState } from 'preact/hooks';

type Phase = 'idle' | 'waiting' | 'go' | 'result' | 'early' | 'done';
const TRIALS = 5;

export default function ReactionTest() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [last, setLast] = useState(0);
  const [results, setResults] = useState<number[]>([]);
  const goAt = useRef(0);
  const timer = useRef<number | null>(null);

  const clearTimer = () => {
    if (timer.current != null) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const startTrial = () => {
    setPhase('waiting');
    clearTimer();
    const delay = 1000 + Math.random() * 3500;
    timer.current = window.setTimeout(() => {
      goAt.current = performance.now();
      setPhase('go');
    }, delay);
  };

  const restart = () => {
    clearTimer();
    setResults([]);
    setLast(0);
    setPhase('idle');
  };

  const onClick = () => {
    if (phase === 'idle' || phase === 'early') {
      startTrial();
    } else if (phase === 'waiting') {
      clearTimer();
      setPhase('early');
    } else if (phase === 'go') {
      const ms = Math.round(performance.now() - goAt.current);
      const next = [...results, ms];
      setResults(next);
      setLast(ms);
      setPhase(next.length >= TRIALS ? 'done' : 'result');
    } else if (phase === 'result') {
      startTrial();
    }
  };

  const avg = results.length ? Math.round(results.reduce((a, b) => a + b, 0) / results.length) : 0;
  const best = results.length ? Math.min(...results) : 0;

  const bg =
    phase === 'go'
      ? 'bg-emerald-500 text-white'
      : phase === 'waiting'
        ? 'bg-red-500 text-white'
        : phase === 'early'
          ? 'bg-amber-500 text-white'
          : 'bg-brand-700 text-white';

  const body = () => {
    switch (phase) {
      case 'idle':
        return (<><p class="text-2xl font-extrabold">Reaction Time Test</p><p class="mt-2 opacity-90">Click anywhere to start. Wait for green, then click as fast as you can.</p></>);
      case 'waiting':
        return (<><p class="text-3xl font-extrabold">Wait for green…</p><p class="mt-2 opacity-90">Trial {results.length + 1} of {TRIALS}</p></>);
      case 'go':
        return <p class="text-5xl font-extrabold">Click!</p>;
      case 'early':
        return (<><p class="text-2xl font-extrabold">Too soon!</p><p class="mt-2 opacity-90">You clicked before green. Click to try this trial again.</p></>);
      case 'result':
        return (<><p class="text-5xl font-extrabold">{last} ms</p><p class="mt-2 opacity-90">Click to continue — trial {results.length + 1} of {TRIALS}</p></>);
      case 'done':
        return (<><p class="text-sm font-semibold uppercase tracking-wide opacity-80">Average</p><p class="text-5xl font-extrabold">{avg} ms</p><p class="mt-1 opacity-90">Best {best} ms · {results.length} trials</p></>);
    }
  };

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <button
        type="button"
        onClick={onClick}
        disabled={phase === 'done'}
        class={`flex min-h-[260px] w-full flex-col items-center justify-center rounded-xl px-6 text-center transition ${bg} ${phase === 'done' ? 'cursor-default' : 'cursor-pointer'}`}
      >
        {body()}
      </button>

      {results.length > 0 && (
        <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div class="flex flex-wrap gap-1.5">
            {results.map((r, i) => (
              <span class="rounded-md bg-white px-2.5 py-1 font-mono text-sm text-slate-700 ring-1 ring-slate-200">{r} ms</span>
            ))}
          </div>
          <button type="button" onClick={restart} class="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-800">↻ Restart</button>
        </div>
      )}
    </div>
  );
}
