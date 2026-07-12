import { useMemo, useState } from 'preact/hooks';
import { NOTE_NAMES, NOTE_NAMES_FLAT } from '../../lib/music';

// Transpose a comma/space-separated list of note names by N semitones.
function transposeToken(tok: string, semis: number, flat: boolean): string {
  const m = tok.trim().match(/^([A-Ga-g])([#♯b♭]?)(.*)$/);
  if (!m) return tok;
  const letter = m[1].toUpperCase();
  const acc = m[2].replace('#', '♯').replace('b', '♭');
  const rest = m[3]; // chord quality like m, 7, maj7
  const base = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
  let idx = base.indexOf(letter + (acc === '♯' ? '♯' : ''));
  if (idx === -1) {
    // try flat spelling
    const flatBase = NOTE_NAMES_FLAT;
    idx = flatBase.indexOf(letter + (acc === '♭' ? '♭' : ''));
  }
  if (idx === -1) idx = base.indexOf(letter);
  if (idx === -1) return tok;
  const newIdx = (((idx + semis) % 12) + 12) % 12;
  return (flat ? NOTE_NAMES_FLAT : NOTE_NAMES)[newIdx] + rest;
}

export default function TransposeTool() {
  const [input, setInput] = useState('C G Am F');
  const [semis, setSemis] = useState(2);
  const [flat, setFlat] = useState(false);

  const out = useMemo(() => {
    return input.split(/(\s+|,)/).map((t) => (/^\s+$|^,$/.test(t) ? t : transposeToken(t, semis, flat))).join('');
  }, [input, semis, flat]);

  const capoNote = useMemo(() => {
    // If you capo N frets, play shapes N semitones LOWER to sound the same.
    return semis;
  }, [semis]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Notes or chords (space or comma separated)</span>
        <input value={input} onInput={(e) => setInput((e.target as HTMLInputElement).value)} class={inp} placeholder="C G Am F" /></label>

      <div class="mt-3 flex flex-wrap items-end gap-4">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Transpose: {semis > 0 ? '+' : ''}{semis} semitones</span>
          <input type="range" min="-12" max="12" value={semis} onInput={(e) => setSemis(+(e.target as HTMLInputElement).value)} class="w-64 accent-brand-600" /></label>
        <label class="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={flat} onChange={(e) => setFlat((e.target as HTMLInputElement).checked)} class="h-4 w-4 rounded border-slate-300 text-brand-600" />
          Use flats (♭)
        </label>
      </div>

      <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Transposed</p>
        <p class="mt-1 text-3xl font-extrabold text-brand-800 break-words">{out || '—'}</p>
      </div>

      <p class="mt-3 text-center text-sm text-slate-500">Guitar: to sound {semis > 0 ? `${semis} semitone(s) higher` : `${-semis} semitone(s) lower`}, {semis >= 0 ? `use a capo on fret ${semis} and play the original shapes` : `tune down or play shapes ${-semis} fret(s) higher`}.</p>

      <p class="mt-4 text-xs text-slate-500">Shifts every note or chord root by the same number of semitones (12 = one octave). Chord qualities (m, 7, maj7, sus4) are preserved. A capo on fret N raises pitch N semitones, so the same shapes sound N semitones higher. 🔒 In your browser.</p>
    </div>
  );
}
