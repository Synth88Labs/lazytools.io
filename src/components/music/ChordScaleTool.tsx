import { useMemo, useState } from 'preact/hooks';
import { CHORD_TYPES, SCALE_TYPES, NOTE_NAMES, NOTE_NAMES_FLAT, notesFromIntervals, identifyChord, pcSet } from '../../lib/music';

const WHITE = [0, 2, 4, 5, 7, 9, 11]; // C D E F G A B pitch classes
const BLACK = [{ pc: 1, after: 0 }, { pc: 3, after: 1 }, { pc: 6, after: 3 }, { pc: 8, after: 4 }, { pc: 10, after: 5 }];

/** One-octave piano with the given pitch classes highlighted. */
function Piano({ active }: { active: Set<number> }) {
  const w = 26, h = 104, bw = 16, bh = 64;
  return (
    <svg viewBox={`0 0 ${w * 7} ${h}`} class="h-24 w-full max-w-[240px]" role="img" aria-label="Piano keys highlighted">
      {WHITE.map((pc, i) => (
        <rect x={i * w} y={0} width={w - 1} height={h} rx="3" fill={active.has(pc) ? '#2563eb' : '#ffffff'} stroke="#cbd5e1" />
      ))}
      {BLACK.map((b) => (
        <rect x={(b.after + 1) * w - bw / 2} y={0} width={bw} height={bh} rx="2" fill={active.has(b.pc) ? '#1d4ed8' : '#334155'} stroke="#0f172a" />
      ))}
    </svg>
  );
}

export default function ChordScaleTool() {
  const [mode, setMode] = useState<'build' | 'identify'>('build');
  const [root, setRoot] = useState(0);
  const [kind, setKind] = useState<'chord' | 'scale'>('chord');
  const [typeId, setTypeId] = useState('maj');
  const [flat, setFlat] = useState(false);
  const [picked, setPicked] = useState<Set<number>>(new Set([0, 4, 7]));

  const names = flat ? NOTE_NAMES_FLAT : NOTE_NAMES;
  const types = kind === 'chord' ? CHORD_TYPES : SCALE_TYPES;
  const type = types.find((t) => t.id === typeId) ?? types[0];

  const built = useMemo(() => {
    const notes = notesFromIntervals(root, type.intervals, flat);
    const active = new Set(type.intervals.map((i) => (root + i) % 12));
    return { notes, active };
  }, [root, type, flat]);

  const matches = useMemo(() => identifyChord([...picked]), [picked]);
  const chip = 'rounded-lg px-2.5 py-1 text-sm font-semibold ring-1';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex gap-1 rounded-xl bg-slate-200 p-1 text-sm font-semibold">
        <button onClick={() => setMode('build')} class={`flex-1 rounded-lg px-3 py-1.5 ${mode === 'build' ? 'bg-white text-brand-800 shadow-sm' : 'text-slate-600'}`}>Build chord / scale</button>
        <button onClick={() => setMode('identify')} class={`flex-1 rounded-lg px-3 py-1.5 ${mode === 'identify' ? 'bg-white text-brand-800 shadow-sm' : 'text-slate-600'}`}>Identify from notes</button>
      </div>

      {mode === 'build' ? (
        <>
          <div class="mt-4 flex flex-wrap items-end gap-3">
            <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Root</span>
              <select value={root} onChange={(e) => setRoot(+(e.target as HTMLSelectElement).value)} class="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm">
                {names.map((n, i) => <option value={i}>{n}</option>)}
              </select></label>
            <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Type</span>
              <select value={kind} onChange={(e) => { const k = (e.target as HTMLSelectElement).value as 'chord' | 'scale'; setKind(k); setTypeId(k === 'chord' ? 'maj' : 'major'); }} class="rounded-xl border border-slate-300 bg-white px-2 py-2 text-sm">
                <option value="chord">Chord</option><option value="scale">Scale</option>
              </select></label>
            <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{kind === 'chord' ? 'Chord' : 'Scale'}</span>
              <select value={typeId} onChange={(e) => setTypeId((e.target as HTMLSelectElement).value)} class="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm">
                {types.map((t) => <option value={t.id}>{t.name}</option>)}
              </select></label>
            <label class="flex items-center gap-1.5 pb-2 text-xs text-slate-600"><input type="checkbox" checked={flat} onChange={(e) => setFlat((e.target as HTMLInputElement).checked)} /> flats</label>
          </div>

          <div class="mt-4 rounded-xl bg-white p-4 ring-2 ring-brand-200">
            <p class="text-lg font-extrabold text-brand-800">{names[root]}{kind === 'chord' ? (type as { symbol?: string }).symbol ?? '' : ` ${type.name}`}</p>
            <div class="mt-2 flex flex-wrap gap-1.5">
              {built.notes.map((n, i) => <span class={`${chip} bg-brand-50 text-brand-800 ring-brand-200`}>{i === 0 ? `${n} (root)` : n}</span>)}
            </div>
            <div class="mt-3"><Piano active={built.active} /></div>
          </div>
        </>
      ) : (
        <>
          <p class="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Tap the notes you're playing</p>
          <div class="mt-2 flex flex-wrap gap-1.5">
            {NOTE_NAMES.map((n, i) => (
              <button onClick={() => setPicked((s) => { const x = new Set(s); x.has(i) ? x.delete(i) : x.add(i); return x; })}
                class={`${chip} ${picked.has(i) ? 'bg-brand-600 text-white ring-brand-600' : 'bg-white text-slate-600 ring-slate-200 hover:ring-brand-400'}`}>{n}</button>
            ))}
          </div>
          <div class="mt-3"><Piano active={picked} /></div>
          <div class="mt-4 rounded-xl bg-white p-4 ring-2 ring-brand-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{matches.length ? `${matches.length} matching chord${matches.length === 1 ? '' : 's'}` : 'No exact chord match'}</p>
            {matches.length ? (
              <div class="mt-2 flex flex-wrap gap-1.5">{matches.map((m) => <span class={`${chip} bg-emerald-50 text-emerald-800 ring-emerald-200`} title={m.name}>{m.symbol}</span>)}</div>
            ) : (
              <p class="mt-1 text-sm text-slate-500">{pcSet([...picked]).length < 2 ? 'Pick at least two notes.' : 'That exact set isn\'t a named chord here — try adding or removing a note.'}</p>
            )}
          </div>
        </>
      )}

      <p class="mt-4 text-xs text-slate-500">Chords and scales are built from fixed semitone formulas (e.g. major = root, +4, +7). "Identify" matches your exact set of notes to a chord regardless of octave or inversion — symmetric shapes like the diminished 7th return several enharmonic names. Equal-tempered, spelled with sharps or flats. 🔒 In your browser.</p>
    </div>
  );
}
