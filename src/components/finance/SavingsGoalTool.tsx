import { useMemo, useState } from 'preact/hooks';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const money = (x: number) => x.toLocaleString(undefined, { maximumFractionDigits: 2 });

export default function SavingsGoalTool() {
  const [goal, setGoal] = useState('20000');
  const [current, setCurrent] = useState('2000');
  const [rate, setRate] = useState('4');
  const [years, setYears] = useState('5');

  const r = useMemo(() => {
    const fv = num(goal), p = num(current) ?? 0, rt = num(rate), y = num(years);
    if (fv == null || rt == null || y == null || y <= 0) return null;
    const i = rt / 100 / 12;
    const N = Math.round(y * 12);
    const fvOfCurrent = p * Math.pow(1 + i, N);
    const remaining = fv - fvOfCurrent;
    const pmt = i === 0 ? remaining / N : (remaining * i) / (Math.pow(1 + i, N) - 1);
    const totalContrib = p + Math.max(0, pmt) * N;
    return { pmt, fvOfCurrent, remaining, totalContrib, interest: fv - totalContrib, N };
  }, [goal, current, rate, years]);

  const inp = (val: string, set: (v: string) => void, label: string, prefix?: string) => (
    <label class="block">
      <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <div class="flex items-center rounded-xl border border-slate-300 bg-white focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-200">
        {prefix && <span class="pl-3 text-sm text-slate-400">{prefix}</span>}
        <input type="number" step="any" value={val} onInput={(e) => set((e.target as HTMLInputElement).value)} class="w-full rounded-xl bg-transparent px-3 py-2 font-mono text-sm text-slate-900 focus:outline-none" />
      </div>
    </label>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {inp(goal, setGoal, 'Savings goal', '$')}
        {inp(current, setCurrent, 'Already saved', '$')}
        {inp(rate, setRate, 'Annual return (%)')}
        {inp(years, setYears, 'Years to reach it')}
      </div>

      {r ? (
        r.pmt <= 0 ? (
          <div class="mt-4 rounded-xl bg-emerald-50 p-4 text-center ring-2 ring-emerald-200">
            <p class="font-bold text-emerald-800">You’re already on track — your current savings alone will reach the goal.</p>
          </div>
        ) : (
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Save each month</p><p class="mt-1 text-3xl font-extrabold text-brand-800">${money(r.pmt)}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">You’ll contribute</p><p class="mt-1 text-2xl font-extrabold text-slate-700">${money(r.totalContrib)}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">From interest</p><p class="mt-1 text-2xl font-extrabold text-emerald-700">${money(Math.max(0, r.interest))}</p></div>
          </div>
        )
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter your goal, current savings, expected return and time frame.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Solves the monthly deposit so your current savings plus contributions (compounded monthly) reach the goal. Educational, not advice. 🔒 In your browser.</p>
    </div>
  );
}
