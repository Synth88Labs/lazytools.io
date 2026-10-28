import { useMemo, useState } from 'preact/hooks';

export default function MinecraftCircleTool() {
  const [d, setD] = useState(13);
  const [fill, setFill] = useState(false);

  const { grid, blocks } = useMemo(() => {
    const c = (d - 1) / 2;
    const r = d / 2;
    const inside = (x: number, y: number, R: number) => {
      const dx = x - c, dy = y - c;
      return dx * dx + dy * dy <= R * R;
    };
    const g: boolean[][] = [];
    let count = 0;
    for (let y = 0; y < d; y++) {
      const row: boolean[] = [];
      for (let x = 0; x < d; x++) {
        const on = fill ? inside(x, y, r) : inside(x, y, r) && !inside(x, y, r - 1);
        row.push(on);
        if (on) count++;
      }
      g.push(row);
    }
    return { grid: g, blocks: count };
  }, [d, fill]);

  const cell = Math.max(6, Math.min(20, Math.floor(360 / d)));

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <label class="flex items-center gap-3 text-sm font-medium text-slate-600">
          Diameter
          <input type="range" min="3" max="40" value={d} class="w-40 accent-brand-600" onInput={(e) => setD(parseInt((e.target as HTMLInputElement).value))} />
          <span class="font-mono text-slate-900">{d}</span>
        </label>
        <label class="flex items-center gap-2 text-sm font-medium text-slate-600">
          <input type="checkbox" checked={fill} class="accent-brand-600" onChange={(e) => setFill((e.target as HTMLInputElement).checked)} /> Filled
        </label>
        <span class="rounded-md bg-white px-2.5 py-1 text-sm font-semibold text-brand-700 ring-1 ring-slate-200">{blocks} blocks</span>
      </div>
      <div class="mt-4 flex justify-center overflow-auto rounded-xl bg-white p-3 ring-1 ring-slate-200">
        <div style={`display:grid;grid-template-columns:repeat(${d}, ${cell}px);gap:1px`}>
          {grid.flat().map((on) => (
            <div style={`width:${cell}px;height:${cell}px;background:${on ? '#5b8a3a' : '#f1f5f9'};border:1px solid ${on ? '#3f6329' : '#e2e8f0'}`} />
          ))}
        </div>
      </div>
      <p class="mt-3 text-center text-xs text-slate-500">Each square is one block. Build the green outline for a hollow circle, or toggle Filled for a disc.</p>
    </div>
  );
}
