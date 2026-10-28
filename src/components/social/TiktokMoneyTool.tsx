import { useState } from 'preact/hooks';
import { Num, Result, CalcShell, n, money } from './shared';

// TikTok's Creativity Program pays roughly $0.40–$1.00 per 1,000 qualified views
// (videos over 1 minute, meeting eligibility). A rough, widely-cited estimate.
export default function TiktokMoneyTool() {
  const [views, setViews] = useState('500000');
  const [rateLow, setRateLow] = useState('0.4');
  const [rateHigh, setRateHigh] = useState('1');
  const v = n(views) / 1000;
  const low = v * n(rateLow);
  const high = v * n(rateHigh);
  return (
    <CalcShell
      inputs={
        <>
          <Num label="Qualified views" value={views} onInput={setViews} />
          <Num label="Low rate (per 1,000 views)" value={rateLow} onInput={setRateLow} suffix="$" />
          <Num label="High rate (per 1,000 views)" value={rateHigh} onInput={setRateHigh} suffix="$" />
        </>
      }
      output={<Result label="Estimated creator earnings" value={`${money(low)} – ${money(high)}`} hint="views ÷ 1,000 × rate · rough estimate" />}
    />
  );
}
