import { useState } from 'preact/hooks';
import { Range, Output } from './shared';

const PRESETS: Record<string, [number, number, number, number]> = {
  ease: [0.25, 0.1, 0.25, 1],
  linear: [0, 0, 1, 1],
  'ease-in': [0.42, 0, 1, 1],
  'ease-out': [0, 0, 0.58, 1],
  'ease-in-out': [0.42, 0, 0.58, 1],
  bounce: [0.68, -0.55, 0.27, 1.55],
};

export default function CubicBezierTool() {
  const [p, setP] = useState<[number, number, number, number]>([0.4, 0, 0.2, 1]);
  const [x1, y1, x2, y2] = p;
  const fn = `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
  const css = `transition-timing-function: ${fn};`;

  // SVG curve (y axis inverted; map value range -0.5..1.5 to 0..1 of a 200px box).
  const W = 200, H = 200;
  const mapY = (v: number) => H - ((v + 0.5) / 2) * H;
  const path = `M0,${mapY(0)} C${x1 * W},${mapY(y1)} ${x2 * W},${mapY(y2)} ${W},${mapY(1)}`;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-6 lg:grid-cols-2">
        <div class="space-y-3">
          <div class="flex flex-wrap gap-1.5">
            {Object.keys(PRESETS).map((k) => (
              <button type="button" onClick={() => setP(PRESETS[k])} class="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 hover:border-brand-400">{k}</button>
            ))}
          </div>
          <Range label="x1" value={x1} min={0} max={1} step={0.01} onInput={(v) => setP([v, y1, x2, y2])} />
          <Range label="y1" value={y1} min={-0.5} max={1.5} step={0.01} onInput={(v) => setP([x1, v, x2, y2])} />
          <Range label="x2" value={x2} min={0} max={1} step={0.01} onInput={(v) => setP([x1, y1, v, y2])} />
          <Range label="y2" value={y2} min={-0.5} max={1.5} step={0.01} onInput={(v) => setP([x1, y1, x2, v])} />
        </div>
        <div class="flex flex-col items-center justify-center gap-4 rounded-xl border border-slate-200 bg-white p-4">
          <svg viewBox={`0 0 ${W} ${H}`} class="h-40 w-40">
            <line x1="0" y1={mapY(1)} x2={W} y2={mapY(1)} stroke="#e2e8f0" />
            <line x1="0" y1={mapY(0)} x2={W} y2={mapY(0)} stroke="#e2e8f0" />
            <path d={path} fill="none" stroke="#2563eb" stroke-width="3" />
          </svg>
          <div class="relative h-6 w-full rounded bg-slate-100">
            <div class="absolute top-0 h-6 w-6 rounded-full bg-brand-600" style={`left:0; animation: ltbez 1.6s infinite alternate; animation-timing-function:${fn}`} />
          </div>
        </div>
      </div>
      <Output css={css} />
      <style>{`@keyframes ltbez { from { left: 0; } to { left: calc(100% - 24px); } }`}</style>
    </div>
  );
}
