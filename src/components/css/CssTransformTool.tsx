import { useState } from 'preact/hooks';
import { Range, Output, Shell } from './shared';

export default function CssTransformTool() {
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [rotate, setRotate] = useState(0);
  const [scale, setScale] = useState(1);
  const [skewX, setSkewX] = useState(0);
  const [skewY, setSkewY] = useState(0);

  const parts: string[] = [];
  if (tx || ty) parts.push(`translate(${tx}px, ${ty}px)`);
  if (rotate) parts.push(`rotate(${rotate}deg)`);
  if (scale !== 1) parts.push(`scale(${scale})`);
  if (skewX || skewY) parts.push(`skew(${skewX}deg, ${skewY}deg)`);
  const value = parts.join(' ') || 'none';
  const css = `transform: ${value};`;

  return (
    <>
      <Shell
        controls={
          <>
            <Range label="translateX" value={tx} min={-80} max={80} unit="px" onInput={setTx} />
            <Range label="translateY" value={ty} min={-80} max={80} unit="px" onInput={setTy} />
            <Range label="rotate" value={rotate} min={-180} max={180} unit="deg" onInput={setRotate} />
            <Range label="scale" value={scale} min={0.2} max={2} step={0.05} onInput={setScale} />
            <Range label="skewX" value={skewX} min={-60} max={60} unit="deg" onInput={setSkewX} />
            <Range label="skewY" value={skewY} min={-60} max={60} unit="deg" onInput={setSkewY} />
          </>
        }
        preview={<div class="flex h-28 w-28 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 font-bold text-white transition-transform duration-200" style={`transform:${value}`}>box</div>}
      />
      <Output css={css} />
    </>
  );
}
