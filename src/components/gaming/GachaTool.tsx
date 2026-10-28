import { useState } from 'preact/hooks';
import { Num, Result, CalcShell, n, fmt } from '../social/shared';

export default function GachaTool() {
  const [rate, setRate] = useState('0.6');
  const [pulls, setPulls] = useState('90');
  const p = n(rate) / 100;
  const atLeastOne = p > 0 && p <= 1 ? (1 - Math.pow(1 - p, Math.max(0, Math.round(n(pulls))))) * 100 : 0;
  const pullsFor = (conf: number) => (p > 0 && p < 1 ? Math.ceil(Math.log(1 - conf) / Math.log(1 - p)) : Infinity);
  return (
    <CalcShell
      inputs={
        <>
          <Num label="Drop rate per pull" value={rate} onInput={setRate} suffix="%" />
          <Num label="Number of pulls" value={pulls} onInput={setPulls} />
        </>
      }
      output={
        <div class="w-full space-y-3">
          <Result label="Chance of at least one" value={`${fmt(atLeastOne)}%`} hint="1 − (1 − rate)^pulls" />
          <div class="rounded-lg bg-slate-50 p-3 text-center text-sm text-slate-600 ring-1 ring-slate-200">
            Pulls for 50%: <strong class="text-slate-900">{Number.isFinite(pullsFor(0.5)) ? pullsFor(0.5) : '—'}</strong> · 90%: <strong class="text-slate-900">{Number.isFinite(pullsFor(0.9)) ? pullsFor(0.9) : '—'}</strong> · 99%: <strong class="text-slate-900">{Number.isFinite(pullsFor(0.99)) ? pullsFor(0.99) : '—'}</strong>
          </div>
        </div>
      }
    />
  );
}
