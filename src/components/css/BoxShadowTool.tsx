import { useState } from 'preact/hooks';
import { Range, ColorField, Output, Shell } from './shared';

function rgba(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

export default function BoxShadowTool() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(10);
  const [blur, setBlur] = useState(25);
  const [spread, setSpread] = useState(-5);
  const [color, setColor] = useState('#1e293b');
  const [opacity, setOpacity] = useState(0.25);
  const [inset, setInset] = useState(false);

  const value = `${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px ${rgba(color, opacity)}`;
  const css = `box-shadow: ${value};`;

  return (
    <>
      <Shell
        controls={
          <>
            <Range label="Offset X" value={x} min={-50} max={50} unit="px" onInput={setX} />
            <Range label="Offset Y" value={y} min={-50} max={50} unit="px" onInput={setY} />
            <Range label="Blur" value={blur} min={0} max={100} unit="px" onInput={setBlur} />
            <Range label="Spread" value={spread} min={-50} max={50} unit="px" onInput={setSpread} />
            <Range label="Opacity" value={opacity} min={0} max={1} step={0.01} onInput={setOpacity} />
            <ColorField label="Shadow colour" value={color} onInput={setColor} />
            <label class="flex items-center gap-2 text-sm font-medium text-slate-600">
              <input type="checkbox" checked={inset} class="accent-brand-600" onChange={(e) => setInset((e.target as HTMLInputElement).checked)} /> Inset
            </label>
          </>
        }
        preview={<div class="h-32 w-44 rounded-xl bg-white" style={`box-shadow:${value}`} />}
      />
      <Output css={css} />
    </>
  );
}
