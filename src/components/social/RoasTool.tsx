import { useState } from 'preact/hooks';
import { Num, Result, CalcShell, n, fmt } from './shared';

export default function RoasTool() {
  const [revenue, setRevenue] = useState('8000');
  const [spend, setSpend] = useState('2000');
  const s = n(spend);
  const roas = s > 0 ? n(revenue) / s : 0;
  return (
    <CalcShell
      inputs={
        <>
          <Num label="Revenue from ads" value={revenue} onInput={setRevenue} suffix="$" />
          <Num label="Ad spend" value={spend} onInput={setSpend} suffix="$" />
        </>
      }
      output={<Result label="ROAS" value={`${fmt(roas)}×`} hint={`revenue ÷ spend · ${fmt(roas * 100, 0)}% return`} />}
    />
  );
}
