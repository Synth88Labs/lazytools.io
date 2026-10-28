import { useState } from 'preact/hooks';
import { Num, Result, CalcShell, n, money } from './shared';

export default function CpcTool() {
  const [cost, setCost] = useState('500');
  const [clicks, setClicks] = useState('1400');
  const c = n(clicks);
  const cpc = c > 0 ? n(cost) / c : 0;
  return (
    <CalcShell
      inputs={
        <>
          <Num label="Total ad spend" value={cost} onInput={setCost} suffix="$" />
          <Num label="Clicks" value={clicks} onInput={setClicks} />
        </>
      }
      output={<Result label="CPC (cost per click)" value={money(cpc)} hint="spend ÷ clicks" />}
    />
  );
}
