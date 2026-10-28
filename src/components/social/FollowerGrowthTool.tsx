import { useState } from 'preact/hooks';
import { Num, Result, CalcShell, n, fmt } from './shared';

export default function FollowerGrowthTool() {
  const [current, setCurrent] = useState('10000');
  const [rate, setRate] = useState('8');
  const [months, setMonths] = useState('12');
  const m = Math.max(0, Math.round(n(months)));
  const projected = n(current) * Math.pow(1 + n(rate) / 100, m);
  const gained = projected - n(current);
  return (
    <CalcShell
      inputs={
        <>
          <Num label="Current followers" value={current} onInput={setCurrent} />
          <Num label="Monthly growth rate" value={rate} onInput={setRate} suffix="%" />
          <Num label="Months from now" value={months} onInput={setMonths} />
        </>
      }
      output={<Result label={`Projected in ${m} months`} value={fmt(projected, 0)} hint={`+${fmt(gained, 0)} followers · compounded monthly`} />}
    />
  );
}
