import { useState } from 'preact/hooks';
import { Range, Output } from './shared';

export default function GlassmorphismTool() {
  const [blur, setBlur] = useState(10);
  const [alpha, setAlpha] = useState(0.15);
  const [radius, setRadius] = useState(16);
  const [border, setBorder] = useState(0.25);

  const css = `background: rgba(255, 255, 255, ${alpha});\nbackdrop-filter: blur(${blur}px);\n-webkit-backdrop-filter: blur(${blur}px);\nborder: 1px solid rgba(255, 255, 255, ${border});\nborder-radius: ${radius}px;\nbox-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);`;
  const style = `background:rgba(255,255,255,${alpha});backdrop-filter:blur(${blur}px);-webkit-backdrop-filter:blur(${blur}px);border:1px solid rgba(255,255,255,${border});border-radius:${radius}px;box-shadow:0 8px 32px rgba(0,0,0,0.2)`;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div class="space-y-4">
          <Range label="Blur" value={blur} min={0} max={30} unit="px" onInput={setBlur} />
          <Range label="Background opacity" value={alpha} min={0} max={1} step={0.01} onInput={setAlpha} />
          <Range label="Border opacity" value={border} min={0} max={1} step={0.01} onInput={setBorder} />
          <Range label="Radius" value={radius} min={0} max={40} unit="px" onInput={setRadius} />
        </div>
        <div class="flex min-h-[260px] items-center justify-center rounded-xl p-6" style="background:linear-gradient(135deg,#f97316,#db2777,#7c3aed)">
          <div class="flex h-36 w-52 items-center justify-center text-sm font-semibold text-white" style={style}>Frosted glass</div>
        </div>
      </div>
      <Output css={css} />
    </div>
  );
}
