import { useMemo, useState } from 'preact/hooks';
import { NOTE_NAMES, midiToFreq, freqToMidi, midiToName, nameToMidi } from '../../lib/music';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 2) => Number(x.toFixed(d)).toString();

type Mode = 'note' | 'freq';

export default function NoteFrequencyTool() {
  const [mode, setMode] = useState<Mode>('note');
  const [noteIdx, setNoteIdx] = useState(9); // A
  const [octave, setOctave] = useState(4);
  const [freq, setFreq] = useState('440');
  const [aRef, setARef] = useState('440');

  const ref = num(aRef) ?? 440;

  const r = useMemo(() => {
    if (mode === 'note') {
      const midi = nameToMidi(noteIdx, octave);
      return { kind: 'note' as const, midi, freq: midiToFreq(midi, ref), name: midiToName(midi).full };
    } else {
      const f = num(freq);
      if (f == null) return null;
      const midiExact = freqToMidi(f, ref);
      const midiNear = Math.round(midiExact);
      const nearName = midiToName(midiNear);
      const centsOff = (midiExact - midiNear) * 100;
      return { kind: 'freq' as const, midiExact, nearName: nearName.full, centsOff, nearFreq: midiToFreq(midiNear, ref) };
    }
  }, [mode, noteIdx, octave, freq, ref]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex flex-wrap items-end gap-2">
        <div class="flex gap-2">
          {([['note', 'Note → frequency'], ['freq', 'Frequency → note']] as const).map(([m, lbl]) => (
            <button onClick={() => setMode(m)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${mode === m ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{lbl}</button>
          ))}
        </div>
        <label class="ml-auto block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Reference A4 (Hz)</span>
          <input type="number" step="any" value={aRef} onInput={(e) => setARef((e.target as HTMLInputElement).value)} class={`${inp} w-28`} /></label>
      </div>

      {mode === 'note' ? (
        <div class="grid gap-3 sm:grid-cols-2">
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Note</span>
            <select value={noteIdx} onChange={(e) => setNoteIdx(+(e.target as HTMLSelectElement).value)} class={sel}>
              {NOTE_NAMES.map((n, i) => <option value={i}>{n}</option>)}
            </select></label>
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Octave</span>
            <select value={octave} onChange={(e) => setOctave(+(e.target as HTMLSelectElement).value)} class={sel}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((o) => <option value={o}>{o}</option>)}
            </select></label>
        </div>
      ) : (
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Frequency (Hz)</span>
          <input type="number" step="any" value={freq} onInput={(e) => setFreq((e.target as HTMLInputElement).value)} class={`${inp} sm:w-48`} /></label>
      )}

      {r ? (
        r.kind === 'note' ? (
          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Frequency</p><p class="mt-1 text-4xl font-extrabold text-brand-800">{fmt(r.freq)} <span class="text-lg text-slate-500">Hz</span></p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">MIDI note</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{r.midi}</p><p class="mt-1 text-xs text-slate-400">{r.name}</p></div>
          </div>
        ) : (
          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Nearest note</p><p class="mt-1 text-4xl font-extrabold text-brand-800">{r.nearName}</p><p class="mt-1 text-xs text-slate-400">exact {fmt(r.nearFreq)} Hz</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Tuning offset</p><p class={`mt-1 text-3xl font-extrabold ${Math.abs(r.centsOff) < 5 ? 'text-emerald-600' : 'text-amber-600'}`}>{r.centsOff >= 0 ? '+' : ''}{fmt(r.centsOff, 1)} <span class="text-lg text-slate-500">cents</span></p></div>
          </div>
        )
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a frequency.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Equal temperament: f = A4 × 2^((n − 69)⁄12), with A4 = 440 Hz (ISO 16) and middle C = C4 = MIDI 60. Change the reference for A=432 or historical tunings. 100 cents = one semitone. 🔒 In your browser.</p>
    </div>
  );
}
