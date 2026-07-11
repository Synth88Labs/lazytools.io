import { useMemo, useState } from 'preact/hooks';
import { parseFormula } from '../../lib/chemistry';

// Fixed oxidation states by standard rules (common cases)
const FIXED: Record<string, number> = {
  Li: 1, Na: 1, K: 1, Rb: 1, Cs: 1, Fr: 1,
  Be: 2, Mg: 2, Ca: 2, Sr: 2, Ba: 2, Ra: 2,
  Al: 3, Zn: 2, Ag: 1,
  F: -1, H: 1, O: -2, Cl: -1, Br: -1, I: -1,
};
const fmtOx = (n: number) => (n > 0 ? `+${n}` : n === 0 ? '0' : String(n));

const EXAMPLES = ['KMnO4', 'H2SO4', 'K2Cr2O7', 'HNO3', 'NaClO', 'Fe2O3'];

export default function OxidationNumberTool() {
  const [raw, setRaw] = useState('KMnO4');
  const [charge, setCharge] = useState('0');

  const result = useMemo(() => {
    const f = raw.trim();
    if (!f) return { ok: false as const, error: '' };
    let counts: Record<string, number>;
    try { counts = parseFormula(f); } catch (e) { return { ok: false as const, error: (e as Error).message }; }
    const q = parseFloat(charge);
    const overall = isFinite(q) ? q : 0;
    const elements = Object.keys(counts);
    const known: Record<string, number> = {};
    const unknown: string[] = [];
    for (const el of elements) {
      if (el in FIXED) known[el] = FIXED[el]!;
      else unknown.push(el);
    }
    if (unknown.length === 0) {
      // all fixed — just report
      return { ok: true as const, counts, ox: known, solvedFor: null as string | null };
    }
    if (unknown.length > 1) {
      return { ok: false as const, error: `Two or more elements have no standard rule (${unknown.join(', ')}) — the oxidation states can’t be assigned uniquely from rules alone.` };
    }
    // solve the single unknown: Σ(ox·count) = overall
    const u = unknown[0]!;
    const knownSum = Object.entries(known).reduce((s, [el, ox]) => s + ox * counts[el]!, 0);
    const uOx = (overall - knownSum) / counts[u]!;
    return { ok: true as const, counts, ox: { ...known, [u]: uOx }, solvedFor: u };
  }, [raw, charge]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-[1fr_auto]">
        <label class="block">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Chemical formula</span>
          <input value={raw} spellcheck={false} onInput={(e) => setRaw((e.target as HTMLInputElement).value)}
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
        </label>
        <label class="block">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Overall charge</span>
          <input type="number" value={charge} onInput={(e) => setCharge((e.target as HTMLInputElement).value)}
            class="w-24 rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
        </label>
      </div>
      <div class="mt-2 flex flex-wrap gap-1.5">
        {EXAMPLES.map((ex) => <button onClick={() => { setRaw(ex); setCharge('0'); }} class="rounded-md bg-white px-2 py-1 font-mono text-xs text-slate-600 ring-1 ring-slate-200 transition hover:ring-brand-300">{ex}</button>)}
      </div>

      {result.ok ? (
        <>
          <div class="mt-4 grid gap-2 sm:grid-cols-3">
            {Object.entries(result.ox).map(([el, ox]) => (
              <div class={`rounded-xl bg-white p-3 text-center ${el === result.solvedFor ? 'ring-2 ring-brand-200' : 'ring-1 ring-slate-200'}`}>
                <p class="text-xs text-slate-500">{el} × {result.counts[el]}</p>
                <p class={`mt-0.5 text-2xl font-extrabold ${el === result.solvedFor ? 'text-brand-800' : 'text-slate-700'}`}>{fmtOx(ox)}</p>
                {el === result.solvedFor && <p class="text-[10px] font-semibold uppercase text-brand-600">solved</p>}
              </div>
            ))}
          </div>
          <p class="mt-2 text-xs text-slate-500">Oxidation numbers sum to the overall charge ({charge || '0'}). {result.solvedFor && `Standard rules fixed the others; ${result.solvedFor} was solved by balance.`}</p>
        </>
      ) : result.error ? (
        <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800 ring-1 ring-amber-200">⚠ {result.error}</p>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a formula (e.g. KMnO4) to assign oxidation numbers.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">
        Uses standard rules (group 1 = +1, group 2 = +2, F = −1, O = −2, H = +1, …) and solves the remaining element by charge balance. Peroxides, metal hydrides and O–F compounds are exceptions. 🔒 In your browser.
      </p>
    </div>
  );
}
