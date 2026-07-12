import { useRef, useState } from 'preact/hooks';

export default function TapTempoTool() {
  const taps = useRef<number[]>([]);
  const [bpm, setBpm] = useState<number | null>(null);
  const [count, setCount] = useState(0);

  const tap = () => {
    const now = performance.now();
    const t = taps.current;
    // reset if the last tap was over 2 seconds ago
    if (t.length && now - t[t.length - 1] > 2000) t.length = 0;
    t.push(now);
    if (t.length > 8) t.shift(); // rolling window of last 8 taps
    setCount(t.length);
    if (t.length >= 2) {
      const intervals = [];
      for (let i = 1; i < t.length; i++) intervals.push(t[i] - t[i - 1]);
      const avg = intervals.reduce((s, x) => s + x, 0) / intervals.length;
      setBpm(60000 / avg);
    }
  };

  const reset = () => { taps.current = []; setBpm(null); setCount(0); };

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="text-center">
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Tempo</p>
        <p class="mt-1 text-6xl font-extrabold text-brand-800">{bpm != null ? Math.round(bpm) : '—'}</p>
        <p class="text-sm text-slate-500">BPM {count > 0 && count < 2 ? '· keep tapping…' : count >= 2 ? `· ${count} taps` : ''}</p>
      </div>

      <button
        onClick={tap}
        onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); tap(); } }}
        class="mt-5 w-full rounded-2xl bg-brand-600 py-10 text-2xl font-extrabold text-white shadow-sm transition active:scale-[0.98] active:bg-brand-700 hover:bg-brand-700"
      >
        TAP
      </button>
      <div class="mt-3 flex justify-center gap-3">
        <button onClick={reset} class="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300">Reset</button>
        {bpm != null && (
          <span class="self-center text-sm text-slate-500">≈ {(60000 / bpm).toFixed(0)} ms per beat</span>
        )}
      </div>

      <p class="mt-4 text-xs text-slate-500">Tap the button (or press Space) in time with the music — the BPM is the average of your last few taps. Pause over 2 seconds and it resets. The more evenly you tap, the more stable the reading. 🔒 In your browser.</p>
    </div>
  );
}
