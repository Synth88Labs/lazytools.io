import { useState } from 'preact/hooks';
import { Num, Result, CalcShell, n, money } from './shared';

// Rough industry rule of thumb: roughly $10 per 1,000 followers for a sponsored
// post, scaled up or down by engagement rate. This is a ballpark, not a quote.
export default function InfluencerRateTool() {
  const [followers, setFollowers] = useState('25000');
  const [engagement, setEngagement] = useState('3.5');
  const base = (n(followers) / 1000) * 10; // $10 per 1k baseline
  const erFactor = Math.max(0.5, Math.min(2.5, n(engagement) / 3)); // ~3% ER = neutral
  const mid = base * erFactor;
  const low = mid * 0.7;
  const high = mid * 1.4;
  return (
    <CalcShell
      inputs={
        <>
          <Num label="Followers" value={followers} onInput={setFollowers} />
          <Num label="Engagement rate" value={engagement} onInput={setEngagement} suffix="%" />
        </>
      }
      output={<Result label="Suggested post rate" value={`${money(low)} – ${money(high)}`} hint="ballpark from followers × engagement · negotiate from here" />}
    />
  );
}
