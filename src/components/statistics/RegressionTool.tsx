import { useMemo, useState } from 'preact/hooks';
import { linearRegression } from '../../lib/stats';

const fmt = (x: number, p = 6) => (isFinite(x) ? Number(x.toPrecision(p)).toString() : '—');

/** Parse pasted paired data: one "x y" / "x,y" / "x\ty" per line. */
function parsePairs(raw: string): { xs: number[]; ys: number[] } {
  const xs: number[] = [], ys: number[] = [];
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t) continue;
    const parts = t.split(/[\s,;\t]+/).map(Number);
    if (parts.length >= 2 && isFinite(parts[0]) && isFinite(parts[1])) {
      xs.push(parts[0]); ys.push(parts[1]);
    }
  }
  return { xs, ys };
}

const SAMPLE = `1 2.1\n2 3.9\n3 6.2\n4 7.8\n5 10.1\n6 11.8\n7 14.2\n8 15.9`;

export default function RegressionTool() {
  const [raw, setRaw] = useState(SAMPLE);
  const { xs, ys } = useMemo(() => parsePairs(raw), [raw]);
  const reg = useMemo(() => (xs.length >= 2 ? linearRegression(xs, ys) : null), [xs, ys]);

  const svg = useMemo(() => {
    if (!reg || xs.length < 2) return null;
    const W = 560, H = 300, pad = 40;
    const xmin = Math.min(...xs), xmax = Math.max(...xs);
    const ymin = Math.min(...ys), ymax = Math.max(...ys);
    const xr = xmax - xmin || 1, yr = ymax - ymin || 1;
    const px = (x: number) => pad + ((x - xmin) / xr) * (W - 2 * pad);
    const py = (y: number) => H - pad - ((y - ymin) / yr) * (H - 2 * pad);
    const pts = xs.map((x, i) => ({ cx: px(x), cy: py(ys[i]) }));
    const lineX1 = xmin, lineX2 = xmax;
    const lineY1 = reg.slope * lineX1 + reg.intercept;
    const lineY2 = reg.slope * lineX2 + reg.intercept;
    return { W, H, pad, pts, x1: px(lineX1), y1: py(lineY1), x2: px(lineX2), y2: py(lineY2) };
  }, [reg, xs, ys]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Paired data — one “x y” (or x,y) per line</span>
        <textarea
          class="h-40 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          value={raw} spellcheck={false}
          onInput={(e) => setRaw((e.target as HTMLTextAreaElement).value)}
        />
      </label>
      <p class="mt-1 text-xs text-slate-500">{xs.length} valid point{xs.length === 1 ? '' : 's'} parsed.</p>

      {reg ? (
        <>
          <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Regression equation</p>
            <p class="mt-1 text-2xl font-extrabold text-brand-800">
              y = {fmt(reg.slope)}x {reg.intercept >= 0 ? '+' : '−'} {fmt(Math.abs(reg.intercept))}
            </p>
          </div>

          {svg && (
            <div class="mt-3 overflow-x-auto rounded-xl bg-white p-2 ring-1 ring-slate-200">
              <svg viewBox={`0 0 ${svg.W} ${svg.H}`} class="mx-auto block w-full max-w-xl" role="img" aria-label="Scatter plot of the data with the fitted least-squares regression line">
                <line x1={svg.pad} y1={svg.H - svg.pad} x2={svg.W - svg.pad} y2={svg.H - svg.pad} stroke="#cbd5e1" />
                <line x1={svg.pad} y1={svg.pad} x2={svg.pad} y2={svg.H - svg.pad} stroke="#cbd5e1" />
                <line x1={svg.x1} y1={svg.y1} x2={svg.x2} y2={svg.y2} stroke="#4338ca" stroke-width="2" />
                {svg.pts.map((p) => (
                  <circle cx={p.cx} cy={p.cy} r="4" fill="#6366f1" fill-opacity="0.75" />
                ))}
              </svg>
            </div>
          )}

          <div class="mt-3 grid gap-3 sm:grid-cols-4 text-center">
            <div class="rounded-lg bg-white p-3 ring-1 ring-slate-200"><p class="font-mono text-lg font-bold text-slate-800">{fmt(reg.slope)}</p><p class="text-xs text-slate-500">Slope (b)</p></div>
            <div class="rounded-lg bg-white p-3 ring-1 ring-slate-200"><p class="font-mono text-lg font-bold text-slate-800">{fmt(reg.intercept)}</p><p class="text-xs text-slate-500">Intercept (a)</p></div>
            <div class="rounded-lg bg-white p-3 ring-1 ring-slate-200"><p class="font-mono text-lg font-bold text-slate-800">{fmt(reg.r, 5)}</p><p class="text-xs text-slate-500">Correlation r</p></div>
            <div class="rounded-lg bg-white p-3 ring-1 ring-slate-200"><p class="font-mono text-lg font-bold text-slate-800">{fmt(reg.r2, 5)}</p><p class="text-xs text-slate-500">r² (fit)</p></div>
          </div>
          <p class="mt-2 text-xs text-slate-500">r² means about {(reg.r2 * 100).toFixed(1)}% of the variation in y is explained by x.</p>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter at least two valid (x, y) pairs to fit a line.</p>
      )}

      <p class="mt-3 text-xs text-slate-500">
        Least-squares fit with Pearson’s r and r². Correlation is not causation. 🔒 Computed entirely in your browser.
      </p>
    </div>
  );
}
