import { useMemo, useState } from 'preact/hooks';
import { molarSolubility, kspFromSolubility, molarSolubilityCommonIon } from '../../lib/equilibrium';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const intv = (s: string) => { const n = parseInt(s, 10); return isFinite(n) && n >= 1 ? n : null; };
const nonneg = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };

const SALT_PRESETS = [
  { name: 'AgCl', a: 1, b: 1, ksp: '1.8e-10' },
  { name: 'BaSO₄', a: 1, b: 1, ksp: '1.1e-10' },
  { name: 'CaF₂', a: 1, b: 2, ksp: '3.9e-11' },
  { name: 'Ag₂CrO₄', a: 2, b: 1, ksp: '1.1e-12' },
  { name: 'PbI₂', a: 1, b: 2, ksp: '7.1e-9' },
  { name: 'Ca(OH)₂', a: 1, b: 2, ksp: '5.0e-6' },
];

export default function KspTool() {
  const [mode, setMode] = useState<'toS' | 'toKsp'>('toS');
  const [ksp, setKsp] = useState('1.8e-10');
  const [s, setS] = useState('1.34e-5');
  const [a, setA] = useState('1');
  const [b, setB] = useState('1');
  const [common, setCommon] = useState('0');

  const r = useMemo(() => {
    const av = intv(a), bv = intv(b);
    if (av == null || bv == null) return null;
    if (mode === 'toS') {
      const kv = num(ksp), c = nonneg(common);
      if (kv == null || c == null) return null;
      const pure = molarSolubility(kv, av, bv);
      const withCommon = c > 0 ? molarSolubilityCommonIon(kv, av, bv, c) : null;
      return pure != null ? { kind: 'toS' as const, pure, withCommon, a: av, b: bv } : null;
    }
    const sv = num(s);
    if (sv == null) return null;
    const k = kspFromSolubility(sv, av, bv);
    return k != null ? { kind: 'toKsp' as const, ksp: k } : null;
  }, [mode, ksp, s, a, b, common]);

  const applyPreset = (p: typeof SALT_PRESETS[number]) => { setA(String(p.a)); setB(String(p.b)); setKsp(p.ksp); setMode('toS'); };

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 inline-flex rounded-xl bg-slate-200 p-1 text-sm font-semibold">
        <button onClick={() => setMode('toS')} class={`rounded-lg px-3 py-1 ${mode === 'toS' ? 'bg-white text-brand-800 shadow' : 'text-slate-600'}`}>Ksp → solubility</button>
        <button onClick={() => setMode('toKsp')} class={`rounded-lg px-3 py-1 ${mode === 'toKsp' ? 'bg-white text-brand-800 shadow' : 'text-slate-600'}`}>Solubility → Ksp</button>
      </div>

      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Cation subscript (a)</span>
          <input type="number" step="1" min="1" value={a} onInput={(e) => setA((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Anion subscript (b)</span>
          <input type="number" step="1" min="1" value={b} onInput={(e) => setB((e.target as HTMLInputElement).value)} class={inp} /></label>
        {mode === 'toS' ? (
          <>
            <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Ksp</span>
              <input type="text" value={ksp} onInput={(e) => setKsp((e.target as HTMLInputElement).value)} class={inp} /></label>
            <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Common-ion conc. (M)</span>
              <input type="number" step="any" value={common} onInput={(e) => setCommon((e.target as HTMLInputElement).value)} class={inp} /></label>
          </>
        ) : (
          <label class="block sm:col-span-2"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Molar solubility s (mol/L)</span>
            <input type="text" value={s} onInput={(e) => setS((e.target as HTMLInputElement).value)} class={inp} /></label>
        )}
      </div>
      <div class="mt-2 flex flex-wrap gap-1.5">
        {SALT_PRESETS.map((p) => <button onClick={() => applyPreset(p)} class="rounded-full border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-600 hover:border-brand-400 hover:text-brand-700">{p.name}</button>)}
      </div>

      {r ? (
        r.kind === 'toS' ? (
          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Molar solubility (pure water)</p><p class="mt-1 text-2xl font-extrabold text-brand-800">{r.pure.toExponential(3)} M</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">With common ion</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.withCommon != null ? `${r.withCommon.toExponential(3)} M` : '—'}</p></div>
          </div>
        ) : (
          <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Ksp</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{r.ksp.toExponential(3)}</p></div>
        )
      ) : (
        <p class="mt-4 text-sm text-slate-500">Set the salt's ion subscripts and enter Ksp (or a measured solubility).</p>
      )}

      <p class="mt-4 text-xs text-slate-500">For a salt AₐBᵦ ⇌ a·Aⁿ⁺ + b·Bᵐ⁻, Ksp = (a·s)ᵃ·(b·s)ᵇ = aᵃ·bᵇ·s^(a+b), so s = (Ksp ÷ (aᵃ·bᵇ))^(1/(a+b)). A common ion (already in solution) shifts the equilibrium left and suppresses solubility — the tool solves that case numerically. Ksp values vary with temperature and source; enter the one from your data. 🔒 In your browser.</p>
    </div>
  );
}
