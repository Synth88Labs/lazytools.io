import { useRef, useState, useEffect } from 'preact/hooks';

export default function MetronomeTool() {
  const [bpm, setBpm] = useState(120);
  const [beatsPerBar, setBeatsPerBar] = useState(4);
  const [playing, setPlaying] = useState(false);
  const [beat, setBeat] = useState(0);

  const ctxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const nextNoteRef = useRef(0);
  const beatRef = useRef(0);

  useEffect(() => () => stop(), []);

  const click = (time: number, accent: boolean) => {
    const ctx = ctxRef.current!;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = accent ? 1500 : 1000;
    gain.gain.setValueAtTime(accent ? 0.5 : 0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
    osc.connect(gain).connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.05);
  };

  const scheduler = () => {
    const ctx = ctxRef.current!;
    const secondsPerBeat = 60 / bpm;
    while (nextNoteRef.current < ctx.currentTime + 0.1) {
      const isAccent = beatRef.current % beatsPerBar === 0;
      click(nextNoteRef.current, isAccent);
      const thisBeat = beatRef.current % beatsPerBar;
      const drawAt = nextNoteRef.current;
      const delayMs = Math.max(0, (drawAt - ctx.currentTime) * 1000);
      setTimeout(() => setBeat(thisBeat), delayMs);
      nextNoteRef.current += secondsPerBeat;
      beatRef.current++;
    }
    timerRef.current = window.setTimeout(scheduler, 25);
  };

  const start = () => {
    const ctx = ctxRef.current ?? new (window.AudioContext || (window as any).webkitAudioContext)();
    ctxRef.current = ctx;
    if (ctx.state === 'suspended') ctx.resume();
    beatRef.current = 0;
    nextNoteRef.current = ctx.currentTime + 0.05;
    setPlaying(true);
    scheduler();
  };
  const stop = () => {
    if (timerRef.current != null) clearTimeout(timerRef.current);
    timerRef.current = null;
    setPlaying(false);
    setBeat(0);
  };
  const toggle = () => (playing ? stop() : start());

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap items-end gap-4">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Tempo: {bpm} BPM</span>
          <input type="range" min="40" max="240" value={bpm} onInput={(e) => setBpm(+(e.target as HTMLInputElement).value)} class="w-56 accent-brand-600" /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Beats/bar</span>
          <select value={beatsPerBar} onChange={(e) => setBeatsPerBar(+(e.target as HTMLSelectElement).value)} class="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm">
            {[2, 3, 4, 5, 6, 7].map((b) => <option value={b}>{b}</option>)}
          </select></label>
      </div>

      <div class="mt-5 flex justify-center gap-2">
        {Array.from({ length: beatsPerBar }, (_, i) => (
          <span class={`h-5 w-5 rounded-full transition ${playing && beat === i ? (i === 0 ? 'bg-brand-600 scale-125' : 'bg-brand-400 scale-125') : 'bg-slate-300'}`} />
        ))}
      </div>

      <button onClick={toggle} class={`mt-5 w-full rounded-2xl py-6 text-xl font-extrabold text-white shadow-sm transition ${playing ? 'bg-red-500 hover:bg-red-600' : 'bg-brand-600 hover:bg-brand-700'}`}>
        {playing ? '■ Stop' : '▶ Start'}
      </button>

      <p class="mt-4 text-xs text-slate-500">A precise Web Audio metronome — the first beat of each bar is accented. Scheduling is sample-accurate, not setTimeout-jittery. Audio starts only when you press Start. 🔒 In your browser.</p>
    </div>
  );
}
