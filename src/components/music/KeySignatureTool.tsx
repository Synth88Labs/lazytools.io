import { useMemo, useState } from 'preact/hooks';
import { keySignature, MAJOR_KEYS, MINOR_KEYS } from '../../lib/music';

export default function KeySignatureTool() {
  const [mode, setMode] = useState<'major' | 'minor'>('major');
  const [tonic, setTonic] = useState('G');

  const tonics = mode === 'major' ? Object.keys(MAJOR_KEYS) : Object.keys(MINOR_KEYS);
  const r = useMemo(() => keySignature(tonic, mode), [tonic, mode]);

  const tog = (on: boolean) => `rounded-lg px-3 py-1.5 text-sm font-semibold transition ${on ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`;

  const pick = (t: string) => setTonic(t);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex gap-2">
        {(['major', 'minor'] as const).map((m) => (
          <button onClick={() => { setMode(m); if (!(m === 'major' ? MAJOR_KEYS : MINOR_KEYS)[tonic]) setTonic(m === 'major' ? 'C' : 'A'); }} class={tog(mode === m)}>{m[0].toUpperCase() + m.slice(1)}</button>
        ))}
      </div>

      <div class="flex flex-wrap gap-1.5">
        {tonics.map((t) => (
          <button onClick={() => pick(t)} class={`rounded-lg px-2.5 py-1.5 font-mono text-sm font-semibold transition ${tonic === t ? 'bg-brand-700 text-white' : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{t}</button>
        ))}
      </div>

      {r ? (
        <div class="mt-4 rounded-xl bg-white p-5 ring-2 ring-brand-200">
          <p class="text-2xl font-extrabold text-brand-800">{tonic} {mode}</p>
          <div class="mt-3 grid gap-3 sm:grid-cols-3">
            <div><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Signature</p><p class="mt-1 text-lg font-bold text-slate-800">{r.count === 0 ? 'No sharps or flats' : `${r.count} ${r.type}${r.count > 1 ? 's' : ''}`}</p></div>
            <div><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Accidentals</p><p class="mt-1 font-mono text-lg font-bold text-slate-800">{r.accidentals.length ? r.accidentals.join(' ') : '—'}</p></div>
            <div><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Relative {mode === 'major' ? 'minor' : 'major'}</p><p class="mt-1 text-lg font-bold text-slate-800">{r.relative}</p></div>
          </div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Pick a key.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Key signatures follow the circle of fifths: each step clockwise adds a sharp (in the order F♯ C♯ G♯ D♯ A♯ E♯ B♯), each step anticlockwise adds a flat (B♭ E♭ A♭ D♭ G♭ C♭ F♭). Every major key shares its signature with a relative minor a minor third below. 🔒 In your browser.</p>
    </div>
  );
}
