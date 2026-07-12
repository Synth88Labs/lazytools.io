import { useMemo, useState } from 'preact/hooks';
import { NOTE_NAMES, nameToMidi, midiToFreq, midiToName, semitones, cents, intervalName } from '../../lib/music';

const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toString();

function gcd(a: number, b: number): number { return b ? gcd(b, a % b) : a; }

export default function IntervalTool() {
  const [n1, setN1] = useState(0); const [o1, setO1] = useState(4); // C4
  const [n2, setN2] = useState(7); const [o2, setO2] = useState(4); // G4

  const r = useMemo(() => {
    const m1 = nameToMidi(n1, o1), m2 = nameToMidi(n2, o2);
    const f1 = midiToFreq(m1), f2 = midiToFreq(m2);
    const semis = semitones(f1, f2);
    // just-intonation-ish ratio for the interval within an octave (small-integer)
    const withinSemis = ((Math.round(semis) % 12) + 12) % 12;
    return {
      m1, m2, f1, f2,
      name1: midiToName(m1).full, name2: midiToName(m2).full,
      semis, cents: cents(f1, f2), interval: intervalName(semis),
      ratio: Math.pow(2, semis / 12),
    };
  }, [n1, o1, n2, o2]);

  const sel = 'rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const NoteSel = ({ n, o, setN, setO }: any) => (
    <div class="flex gap-2">
      <select value={n} onChange={(e) => setN(+(e.target as HTMLSelectElement).value)} class={sel}>{NOTE_NAMES.map((nm, i) => <option value={i}>{nm}</option>)}</select>
      <select value={o} onChange={(e) => setO(+(e.target as HTMLSelectElement).value)} class={sel}>{[1, 2, 3, 4, 5, 6, 7].map((x) => <option value={x}>{x}</option>)}</select>
    </div>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">First note</span><NoteSel n={n1} o={o1} setN={setN1} setO={setO1} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Second note</span><NoteSel n={n2} o={o2} setN={setN2} setO={setO2} /></label>
      </div>

      <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{r.name1} → {r.name2}</p>
        <p class="mt-1 text-3xl font-extrabold text-brand-800">{r.interval}</p>
      </div>
      <div class="mt-3 grid gap-3 sm:grid-cols-3">
        <div class="rounded-xl bg-white p-3 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Semitones</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.semis, 0)}</p></div>
        <div class="rounded-xl bg-white p-3 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Cents</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.cents, 0)}</p></div>
        <div class="rounded-xl bg-white p-3 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Frequency ratio</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.ratio, 3)}</p></div>
      </div>
      <p class="mt-3 text-center text-sm text-slate-500">{fmt(r.f1)} Hz → {fmt(r.f2)} Hz</p>

      <p class="mt-4 text-xs text-slate-500">Semitones = 12 × log₂(f₂/f₁); cents = 1200 × log₂(f₂/f₁) (100 cents per semitone). The frequency ratio is the equal-temperament ratio 2^(semitones⁄12) — a perfect fifth is 1.498, close to the pure 3:2 = 1.5. 🔒 In your browser.</p>
    </div>
  );
}
