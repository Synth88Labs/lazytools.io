import { useState } from 'preact/hooks';
import { Range, Segmented, Output, Shell } from './shared';

const UNITS = ['px', '%'] as const;

export default function BorderRadiusTool() {
  const [unit, setUnit] = useState<(typeof UNITS)[number]>('px');
  const [tl, setTl] = useState(24);
  const [tr, setTr] = useState(24);
  const [br, setBr] = useState(24);
  const [bl, setBl] = useState(24);
  const max = unit === '%' ? 50 : 150;

  const value = `${tl}${unit} ${tr}${unit} ${br}${unit} ${bl}${unit}`;
  const css = `border-radius: ${value};`;

  return (
    <>
      <Shell
        controls={
          <>
            <Segmented label="Unit" value={unit} options={UNITS} onSelect={(u) => setUnit(u)} />
            <Range label="Top left" value={tl} min={0} max={max} unit={unit} onInput={setTl} />
            <Range label="Top right" value={tr} min={0} max={max} unit={unit} onInput={setTr} />
            <Range label="Bottom right" value={br} min={0} max={max} unit={unit} onInput={setBr} />
            <Range label="Bottom left" value={bl} min={0} max={max} unit={unit} onInput={setBl} />
            <button type="button" onClick={() => { setTl(50); setTr(50); setBr(50); setBl(50); setUnit('%'); }} class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-brand-400">Make a circle</button>
          </>
        }
        preview={<div class="h-40 w-40 bg-gradient-to-br from-brand-500 to-brand-700" style={`border-radius:${value}`} />}
      />
      <Output css={css} />
    </>
  );
}
