import { useState } from 'preact/hooks';
import { Range, ColorField, Output, Shell } from './shared';

function rgba(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

export default function TextShadowTool() {
  const [x, setX] = useState(2);
  const [y, setY] = useState(2);
  const [blur, setBlur] = useState(4);
  const [color, setColor] = useState('#1e293b');
  const [opacity, setOpacity] = useState(0.5);

  const value = `${x}px ${y}px ${blur}px ${rgba(color, opacity)}`;
  const css = `text-shadow: ${value};`;

  return (
    <>
      <Shell
        controls={
          <>
            <Range label="Offset X" value={x} min={-30} max={30} unit="px" onInput={setX} />
            <Range label="Offset Y" value={y} min={-30} max={30} unit="px" onInput={setY} />
            <Range label="Blur" value={blur} min={0} max={50} unit="px" onInput={setBlur} />
            <Range label="Opacity" value={opacity} min={0} max={1} step={0.01} onInput={setOpacity} />
            <ColorField label="Shadow colour" value={color} onInput={setColor} />
          </>
        }
        preview={<span class="text-4xl font-extrabold text-slate-900 sm:text-5xl" style={`text-shadow:${value}`}>LazyTools</span>}
      />
      <Output css={css} />
    </>
  );
}
