import { useState } from 'preact/hooks';
import { Range, Output, Shell } from './shared';

export default function CssGridTool() {
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(2);
  const [gap, setGap] = useState(12);
  const [responsive, setResponsive] = useState(false);

  const colTemplate = responsive ? 'repeat(auto-fit, minmax(120px, 1fr))' : `repeat(${cols}, 1fr)`;
  const css = `display: grid;\ngrid-template-columns: ${colTemplate};\ngrid-template-rows: repeat(${rows}, 1fr);\ngap: ${gap}px;`;
  const cells = cols * rows;
  const style = `display:grid;grid-template-columns:${colTemplate};gap:${gap}px;width:100%`;

  return (
    <>
      <Shell
        controls={
          <>
            <label class="flex items-center gap-2 text-sm font-medium text-slate-600">
              <input type="checkbox" checked={responsive} class="accent-brand-600" onChange={(e) => setResponsive((e.target as HTMLInputElement).checked)} /> Responsive (auto-fit)
            </label>
            {!responsive && <Range label="Columns" value={cols} min={1} max={6} onInput={(v) => setCols(Math.round(v))} />}
            <Range label="Rows" value={rows} min={1} max={6} onInput={(v) => setRows(Math.round(v))} />
            <Range label="gap" value={gap} min={0} max={40} unit="px" onInput={setGap} />
          </>
        }
        preview={
          <div style={style}>
            {Array.from({ length: responsive ? 8 : cells }).map((_, i) => (
              <div class="flex h-12 items-center justify-center rounded-md bg-brand-600 font-bold text-white">{i + 1}</div>
            ))}
          </div>
        }
      />
      <Output css={css} />
    </>
  );
}
