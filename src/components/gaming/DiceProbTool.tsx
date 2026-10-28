import { useMemo, useState } from 'preact/hooks';
import { Num, n, fmt } from '../social/shared';

export default function DiceProbTool() {
  const [num, setNum] = useState('2');
  const [sides, setSides] = useState('6');
  const [target, setTarget] = useState('7');

  const N = Math.max(1, Math.min(12, Math.round(n(num))));
  const S = Math.max(2, Math.min(100, Math.round(n(sides))));
  const T = Math.round(n(target));

  const { dist, exact, atLeast, atMost, min, max } = useMemo(() => {
    let ways: number[] = [1]; // ways[sum]
    for (let i = 0; i < N; i++) {
      const next = new Array(ways.length + S).fill(0);
      for (let s = 0; s < ways.length; s++) {
        if (!ways[s]) continue;
        for (let f = 1; f <= S; f++) next[s + f] += ways[s];
      }
      ways = next;
    }
    const totalComb = Math.pow(S, N);
    const d: { sum: number; p: number }[] = [];
    let geq = 0, leq = 0, ex = 0;
    for (let s = N; s <= N * S; s++) {
      const p = (ways[s] || 0) / totalComb;
      d.push({ sum: s, p });
      if (s >= T) geq += p;
      if (s <= T) leq += p;
      if (s === T) ex = p;
    }
    return { dist: d, exact: ex, atLeast: geq, atMost: leq, min: N, max: N * S };
  }, [N, S, T]);

  const peak = Math.max(...dist.map((x) => x.p), 0.0001);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-4 sm:grid-cols-3">
        <Num label="Number of dice" value={num} onInput={setNum} />
        <Num label="Sides per die" value={sides} onInput={setSides} />
        <Num label="Target sum" value={target} onInput={setTarget} />
      </div>
      <div class="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
        <div class="rounded-lg bg-brand-50 p-3 ring-1 ring-brand-100"><p class="text-xs text-brand-700">Exactly {T}</p><p class="text-xl font-extrabold text-brand-800">{fmt(exact * 100)}%</p></div>
        <div class="rounded-lg bg-brand-50 p-3 ring-1 ring-brand-100"><p class="text-xs text-brand-700">{T} or more</p><p class="text-xl font-extrabold text-brand-800">{fmt(atLeast * 100)}%</p></div>
        <div class="rounded-lg bg-brand-50 p-3 ring-1 ring-brand-100"><p class="text-xs text-brand-700">{T} or less</p><p class="text-xl font-extrabold text-brand-800">{fmt(atMost * 100)}%</p></div>
      </div>
      <p class="mt-3 text-xs text-slate-500">Possible sums: {min} to {max}. Each bar is a sum's probability; the target is highlighted.</p>
      <div class="mt-2 flex h-32 items-end gap-px overflow-x-auto rounded-lg bg-white p-2 ring-1 ring-slate-200">
        {dist.map((x) => (
          <div title={`${x.sum}: ${fmt(x.p * 100)}%`} class="flex-1" style={`min-width:4px;height:${(x.p / peak) * 100}%;background:${x.sum === T ? '#1d4ed8' : '#93c5fd'}`} />
        ))}
      </div>
    </div>
  );
}
