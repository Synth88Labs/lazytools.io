import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';

// 120 of the most common English words — a passage built from these measures
// general typing fluency rather than one memorised sentence.
const WORDS =
  'the of to and a in is it you that he was for on are with as I his they be at one have this from or had by hot word but what some we can out other were all there when up use your how said an each she which do their time if will way about many then them write would like so these her long make thing see him two has look more day could go come did number sound no most people my over know water than call first who may down side been now find any new work part take get place made live where after back little only round man year came show every good me give our under name very through just form sentence great think say help low line differ turn cause much mean before move right boy old too same tell does set three want air well also play small end put home read hand port large spell add even land here must big high such follow act why ask men change went light kind off need house picture try us again animal point mother world near build self earth father'.split(
    ' ',
  );

function makePassage(n = 60): string {
  const out: string[] = [];
  for (let i = 0; i < n; i++) out.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
  return out.join(' ');
}

const DURATIONS = [15, 30, 60];

export default function TypingTest() {
  const [duration, setDuration] = useState(30);
  const [passage, setPassage] = useState(() => makePassage());
  const [typed, setTyped] = useState('');
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [left, setLeft] = useState(30);
  const startRef = useRef(0);
  const boxRef = useRef<HTMLDivElement>(null);

  const reset = useCallback(
    (d = duration) => {
      setPassage(makePassage());
      setTyped('');
      setStarted(false);
      setFinished(false);
      setLeft(d);
      startRef.current = 0;
      queueMicrotask(() => boxRef.current?.focus());
    },
    [duration],
  );

  // Countdown once started.
  useEffect(() => {
    if (!started || finished) return;
    const id = setInterval(() => {
      const elapsed = (performance.now() - startRef.current) / 1000;
      const rem = Math.max(0, duration - elapsed);
      setLeft(rem);
      if (rem <= 0) {
        setFinished(true);
        clearInterval(id);
      }
    }, 100);
    return () => clearInterval(id);
  }, [started, finished, duration]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (finished) return;
    if (e.key === 'Backspace') {
      e.preventDefault();
      setTyped((t) => t.slice(0, -1));
      return;
    }
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      if (!started) {
        startRef.current = performance.now();
        setStarted(true);
      }
      setTyped((t) => (t.length < passage.length ? t + e.key : t));
    }
  };

  const stats = useMemo(() => {
    let correct = 0;
    for (let i = 0; i < typed.length; i++) if (typed[i] === passage[i]) correct++;
    const mins = started ? Math.max((duration - left) / 60, 1 / 600) : 1;
    const net = Math.round(correct / 5 / mins);
    const raw = Math.round(typed.length / 5 / mins);
    const acc = typed.length ? Math.round((correct / typed.length) * 100) : 100;
    return { correct, net: Math.max(0, net), raw: Math.max(0, raw), acc };
  }, [typed, passage, started, duration, left]);

  useEffect(() => {
    boxRef.current?.focus();
  }, []);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex gap-1.5">
          {DURATIONS.map((d) => (
            <button
              type="button"
              onClick={() => {
                setDuration(d);
                reset(d);
              }}
              class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${d === duration ? 'bg-brand-700 text-white' : 'border border-slate-300 bg-white text-slate-600 hover:border-brand-400'}`}
            >
              {d}s
            </button>
          ))}
        </div>
        <div class="flex items-center gap-4 font-mono text-sm">
          <span class="rounded-md bg-white px-2.5 py-1 font-bold text-brand-700 ring-1 ring-slate-200">⏱ {Math.ceil(left)}s</span>
          <span class="text-slate-600">{stats.net} WPM</span>
          <span class="text-slate-500">{stats.acc}%</span>
        </div>
      </div>

      {!finished ? (
        <div
          ref={boxRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          class="mt-4 cursor-text select-none rounded-xl bg-white p-4 text-lg leading-relaxed tracking-wide ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-brand-400 sm:text-xl"
          style="font-family: ui-monospace, SFMono-Regular, Menlo, monospace"
          aria-label="Typing area, click and type the passage"
        >
          {passage.split('').map((ch, i) => {
            let cls = 'text-slate-400';
            if (i < typed.length) cls = typed[i] === ch ? 'text-emerald-600' : 'rounded bg-red-100 text-red-600';
            const caret = i === typed.length ? 'border-l-2 border-brand-600' : '';
            return <span class={`${cls} ${caret}`}>{ch}</span>;
          })}
          {typed.length >= passage.length && <span class="border-l-2 border-brand-600"> </span>}
        </div>
      ) : (
        <div class="mt-4 rounded-xl bg-white p-6 text-center ring-1 ring-slate-200">
          <p class="text-sm font-semibold uppercase tracking-wide text-slate-400">Result</p>
          <p class="mt-1 text-5xl font-extrabold text-brand-700">{stats.net} <span class="text-2xl font-bold text-slate-500">WPM</span></p>
          <div class="mt-4 grid grid-cols-3 gap-3 text-sm">
            <div class="rounded-lg bg-slate-50 p-3"><p class="font-bold text-slate-900">{stats.acc}%</p><p class="text-slate-500">accuracy</p></div>
            <div class="rounded-lg bg-slate-50 p-3"><p class="font-bold text-slate-900">{stats.raw}</p><p class="text-slate-500">raw WPM</p></div>
            <div class="rounded-lg bg-slate-50 p-3"><p class="font-bold text-slate-900">{stats.correct}</p><p class="text-slate-500">correct chars</p></div>
          </div>
        </div>
      )}

      <div class="mt-4 flex items-center justify-between">
        <p class="text-xs text-slate-500">{finished ? 'Press restart to try again.' : started ? 'Keep going…' : 'Click the box and start typing — the timer starts on your first keystroke.'}</p>
        <button type="button" onClick={() => reset()} class="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-800">↻ Restart</button>
      </div>
    </div>
  );
}
