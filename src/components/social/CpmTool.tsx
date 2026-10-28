import { useState } from 'preact/hooks';
import { Num, Result, CalcShell, n, money } from './shared';

export default function CpmTool() {
  const [cost, setCost] = useState('500');
  const [impressions, setImpressions] = useState('120000');
  const imp = n(impressions);
  const cpm = imp > 0 ? (n(cost) / imp) * 1000 : 0;
  return (
    <CalcShell
      inputs={
        <>
          <Num label="Total ad spend" value={cost} onInput={setCost} suffix="$" />
          <Num label="Impressions" value={impressions} onInput={setImpressions} />
        </>
      }
      output={<Result label="CPM (cost per 1,000)" value={money(cpm)} hint="spend ÷ impressions × 1,000" />}
    />
  );
}
