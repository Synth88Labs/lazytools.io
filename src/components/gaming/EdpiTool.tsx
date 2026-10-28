import { useState } from 'preact/hooks';
import { Num, Result, CalcShell, n, fmt } from '../social/shared';

export default function EdpiTool() {
  const [dpi, setDpi] = useState('800');
  const [sens, setSens] = useState('1.6');
  const edpi = n(dpi) * n(sens);
  return (
    <CalcShell
      inputs={
        <>
          <Num label="Mouse DPI" value={dpi} onInput={setDpi} />
          <Num label="In-game sensitivity" value={sens} onInput={setSens} />
        </>
      }
      output={<Result label="eDPI (effective DPI)" value={fmt(edpi, 0)} hint="DPI × in-game sens · compare any two players fairly" />}
    />
  );
}
