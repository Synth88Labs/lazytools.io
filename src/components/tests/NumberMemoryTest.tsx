import { useEffect, useRef, useState } from 'preact/hooks';

type Phase = 'idle' | 'show' | 'input' | 'done';
const START = 3;

function makeNumber(digits: number): string {
  let s = '';
  for (let i = 0; i < digits; i++) s += Math.floor(Math.random() * 10);
  return s;
}

export default function NumberMemoryTest() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [digits, setDigits] = useState(START);
  const [target, setTarget] = useState('');
  const [answer, setAnswer] = useState('');
  const [best, setBest] = useState(0);
  const [lastTarget, setLastTarget] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<number | null>(null);

  const newRound = (d: number) => {
    const t = makeNumber(d);
    setTarget(t);
    setAnswer('');
    setDigits(d);
    setPhase('show');
    const showMs = 1500 + d * 250;
    if (timer.current != null) clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setPhase('input');
      queueMicrotask(() => inputRef.current?.focus());
    }, showMs);
  };

  const start = () => {
    setBest(0);
    newRound(START);
  };

  const submit = () => {
    if (phase !== 'input') return;
    if (answer === target) {
      setBest(digits);
      newRound(digits + 1);
    } else {
      setLastTarget(target);
      setPhase('done');
    }
  };

  useEffect(() => () => { if (timer.current != null) clearTimeout(timer.current); }, []);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex min-h-[240px] flex-col items-center justify-center rounded-xl bg-white p-6 text-center ring-1 ring-slate-200">
        {phase === 'idle' && (
          <>
            <p class="text-2xl font-extrabold text-slate-900">🧠 Number Memory</p>
            <p class="mt-2 max-w-sm text-slate-600">A number will flash on screen. Memorise it, then type it back. Each round adds one more digit.</p>
            <button type="button" onClick={start} class="mt-5 rounded-lg bg-brand-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800">Start</button>
          </>
        )}

        {phase === 'show' && (
          <>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Memorise · {digits} digits</p>
            <p class="mt-2 font-mono text-5xl font-extrabold tracking-widest text-slate-900 sm:text-6xl">{target}</p>
            <div class="mt-5 h-1.5 w-48 overflow-hidden rounded-full bg-slate-100">
              <div class="h-full bg-brand-500" style={`animation: shrink ${1500 + digits * 250}ms linear forwards`} />
            </div>
          </>
        )}

        {phase === 'input' && (
          <>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Type what you saw · {digits} digits</p>
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              value={answer}
              autocomplete="off"
              onInput={(e) => setAnswer((e.target as HTMLInputElement).value.replace(/\D/g, ''))}
              onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
              class="mt-3 w-56 rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-center font-mono text-3xl tracking-widest text-slate-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
            />
            <button type="button" onClick={submit} class="mt-4 rounded-lg bg-brand-700 px-6 py-2 text-sm font-semibold text-white transition hover:bg-brand-800">Submit</button>
          </>
        )}

        {phase === 'done' && (
          <>
            <p class="text-sm font-semibold uppercase tracking-wide text-slate-400">You remembered</p>
            <p class="mt-1 text-6xl font-extrabold text-brand-700">{best} <span class="text-2xl font-bold text-slate-500">digits</span></p>
            <p class="mt-3 text-sm text-slate-600">The number was <span class="font-mono font-bold text-slate-900">{lastTarget}</span><br />you typed <span class="font-mono font-bold text-red-600">{answer || '—'}</span></p>
            <button type="button" onClick={start} class="mt-5 rounded-lg bg-brand-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800">↻ Try again</button>
          </>
        )}
      </div>
      <style>{`@keyframes shrink { from { width: 100%; } to { width: 0%; } }`}</style>
    </div>
  );
}
