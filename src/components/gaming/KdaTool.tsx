import { useState } from 'preact/hooks';
import { Num, Result, CalcShell, n, fmt } from '../social/shared';

export default function KdaTool() {
  const [k, setK] = useState('12');
  const [a, setA] = useState('8');
  const [d, setD] = useState('5');
  const deaths = Math.max(n(d), 0);
  const kda = (n(k) + n(a)) / (deaths || 1);
  const kd = n(k) / (deaths || 1);
  return (
    <CalcShell
      inputs={
        <>
          <Num label="Kills" value={k} onInput={setK} />
          <Num label="Assists" value={a} onInput={setA} />
          <Num label="Deaths" value={d} onInput={setD} />
        </>
      }
      output={<Result label="KDA ratio" value={fmt(kda)} hint={`(kills + assists) ÷ deaths · K/D ${fmt(kd)}${deaths === 0 ? ' · no deaths counted as 1' : ''}`} />}
    />
  );
}
