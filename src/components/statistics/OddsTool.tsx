import { useMemo, useState } from 'preact/hooks';
import { oddsToProbability, probabilityToOdds } from '../../lib/stats-descriptive';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (x: number, d = 2) => Number(x.toFixed(d)).toString();

type Dir = 'oddsToProb' | 'probToOdds';

export default function OddsTool() {
  const [dir, setDir] = useState<Dir>('oddsToProb');
  const [forVal, setForVal] = useState('3');
  const [againstVal, setAgainstVal] = useState('1');
  const [percent, setPercent] = useState('75');

  const r = useMemo(() => {
    if (dir === 'oddsToProb') {
      const f = num(forVal), a = num(againstVal);
      if (f == null || a == null) return null;
      return oddsToProbability(f, a);
    }
    const p = num(percent);
    return p == null ? null : probabilityToOdds(p);
  }, [dir, forVal, againstVal, percent]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const tog = (on: boolean) => `rounded-lg px-3 py-1.5 text-sm font-semibold transition ${on ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`;
  const cell = (label: string, val: string, hi = false) => (
    <div class={`rounded-xl bg-white p-4 text-center ${hi ? 'ring-2 ring-brand-200' : 'ring-1 ring-slate-200'}`}><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p><p class={`mt-1 text-2xl font-extrabold ${hi ? 'text-brand-800' : 'text-slate-700'}`}>{val}</p></div>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex gap-2">
        <button onClick={() => setDir('oddsToProb')} class={tog(dir === 'oddsToProb')}>Odds → probability</button>
        <button onClick={() => setDir('probToOdds')} class={tog(dir === 'probToOdds')}>Probability → odds</button>
      </div>

      {dir === 'oddsToProb' ? (
        <div class="flex items-end gap-2">
          <label class="block flex-1"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Odds for (chances to win)</span>
            <input type="number" step="any" value={forVal} onInput={(e) => setForVal((e.target as HTMLInputElement).value)} class={inp} /></label>
          <span class="pb-2 text-lg font-bold text-slate-400">:</span>
          <label class="block flex-1"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Odds against (chances to lose)</span>
            <input type="number" step="any" value={againstVal} onInput={(e) => setAgainstVal((e.target as HTMLInputElement).value)} class={inp} /></label>
        </div>
      ) : (
        <label class="block sm:w-56"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Probability (%)</span>
          <input type="number" step="any" min="0" max="100" value={percent} onInput={(e) => setPercent((e.target as HTMLInputElement).value)} class={inp} /></label>
      )}

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          {cell('Probability', `${fmt(r.percent)}%`, true)}
          {cell('Odds (for : against)', `${fmt(r.forA, 2)} : ${fmt(r.forB, 2)}`)}
          {cell('Decimal odds', fmt(r.decimalOdds, 3))}
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">{dir === 'oddsToProb' ? 'Enter the for and against values.' : 'Enter a probability between 0 and 100%.'}</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Odds of A:B "in favour" mean A chances to win for every B to lose, so the probability is A ÷ (A + B). A 3:1 favourite therefore has a 75% chance. Decimal (European) odds are 1 ÷ probability — the total payout per unit staked. Fractional and American odds are just other ways of writing the same ratio. 🔒 In your browser.</p>
    </div>
  );
}
