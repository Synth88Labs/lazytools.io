import { useState } from 'preact/hooks';
import { Num, Result, CalcShell, n, money } from './shared';

// RPM = what the creator keeps per 1,000 views, after YouTube's ~45% ad cut.
// Typical ranges vary widely by niche; defaults are a broad middle estimate.
export default function YoutubeMoneyTool() {
  const [views, setViews] = useState('100000');
  const [rpmLow, setRpmLow] = useState('1.5');
  const [rpmHigh, setRpmHigh] = useState('5');
  const v = n(views) / 1000;
  const low = v * n(rpmLow);
  const high = v * n(rpmHigh);
  return (
    <CalcShell
      inputs={
        <>
          <Num label="Monthly views" value={views} onInput={setViews} />
          <Num label="Low RPM (per 1,000 views)" value={rpmLow} onInput={setRpmLow} suffix="$" />
          <Num label="High RPM (per 1,000 views)" value={rpmHigh} onInput={setRpmHigh} suffix="$" />
        </>
      }
      output={<Result label="Estimated ad earnings" value={`${money(low)} – ${money(high)}`} hint="views ÷ 1,000 × RPM · estimate, varies by niche" />}
    />
  );
}
