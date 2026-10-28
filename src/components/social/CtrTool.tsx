import { useState } from 'preact/hooks';
import { Num, Result, CalcShell, n, fmt } from './shared';

export default function CtrTool() {
  const [clicks, setClicks] = useState('450');
  const [impressions, setImpressions] = useState('30000');
  const imp = n(impressions);
  const ctr = imp > 0 ? (n(clicks) / imp) * 100 : 0;
  return (
    <CalcShell
      inputs={
        <>
          <Num label="Clicks" value={clicks} onInput={setClicks} />
          <Num label="Impressions" value={impressions} onInput={setImpressions} />
        </>
      }
      output={<Result label="CTR (click-through rate)" value={`${fmt(ctr)}%`} hint="clicks ÷ impressions × 100" />}
    />
  );
}
