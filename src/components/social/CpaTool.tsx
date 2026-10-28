import { useState } from 'preact/hooks';
import { Num, Result, CalcShell, n, money } from './shared';

export default function CpaTool() {
  const [cost, setCost] = useState('1200');
  const [conversions, setConversions] = useState('48');
  const c = n(conversions);
  const cpa = c > 0 ? n(cost) / c : 0;
  return (
    <CalcShell
      inputs={
        <>
          <Num label="Total ad spend" value={cost} onInput={setCost} suffix="$" />
          <Num label="Conversions" value={conversions} onInput={setConversions} />
        </>
      }
      output={<Result label="CPA (cost per acquisition)" value={money(cpa)} hint="spend ÷ conversions" />}
    />
  );
}
