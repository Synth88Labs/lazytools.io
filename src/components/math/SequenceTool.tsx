import { useMemo, useState } from 'preact/hooks';
import { arithmeticSequence, geometricSequence } from '../../lib/math-extra';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const int = (s: string) => { const n = parseInt(s, 10); return Number.isInteger(n) && n >= 1 ? n : null; };
const fmt = (x: number) => Number(x.toPrecision(8)).toLocaleString(undefined, { maximumFractionDigits: 6 });

type Kind = 'arithmetic' | 'geometric';

export default function SequenceTool() {
  const [kind, setKind] = useState<Kind>('arithmetic');
  const [a1, setA1] = useState('2');
  const [step, setStep] = useState('3');
  const [n, setN] = useState('10');

  const r = useMemo(() => {
    const a = num(a1), s = num(step), k = int(n);
    if (a == null || s == null || k == null) return null;
    return kind === 'arithmetic' ? arithmeticSequence(a, s, k) : geometricSequence(a, s, k);
  }, [kind, a1, step, n]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const tog = (on: boolean) => `rounded-lg px-3 py-1.5 text-sm font-semibold transition ${on ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`;
  const stepLabel = kind === 'arithmetic' ? 'Common difference (d)' : 'Common ratio (r)';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex gap-2">
        <button onClick={() => setKind('arithmetic')} class={tog(kind === 'arithmetic')}>Arithmetic</button>
        <button onClick={() => setKind('geometric')} class={tog(kind === 'geometric')}>Geometric</button>
      </div>
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">First term (a₁)</span>
          <input type="number" step="any" value={a1} onInput={(e) => setA1((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{stepLabel}</span>
          <input type="number" step="any" value={step} onInput={(e) => setStep((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Number of terms (n)</span>
          <input type="number" step="1" min="1" value={n} onInput={(e) => setN((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <>
          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">nth term (aₙ)</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.nth)}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Sum of first n (Sₙ)</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.sum)}</p></div>
          </div>
          <div class="mt-3 rounded-xl bg-white p-3 ring-1 ring-slate-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">First terms</p>
            <p class="mt-1 font-mono text-sm text-slate-700">{r.terms.map((t) => fmt(t)).join(', ')}{parseInt(n, 10) > r.terms.length ? ', …' : ''}</p>
          </div>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the first term, {kind === 'arithmetic' ? 'common difference' : 'common ratio'}, and a whole number of terms.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">{kind === 'arithmetic'
        ? 'An arithmetic sequence adds a fixed common difference d each step: aₙ = a₁ + (n−1)d, and the sum of the first n terms is Sₙ = n⁄2 · (2a₁ + (n−1)d).'
        : 'A geometric sequence multiplies by a fixed common ratio r each step: aₙ = a₁·r^(n−1), and Sₙ = a₁(1 − rⁿ)⁄(1 − r) (or a₁·n when r = 1). If |r| < 1 the terms shrink toward zero.'} 🔒 In your browser.</p>
    </div>
  );
}
