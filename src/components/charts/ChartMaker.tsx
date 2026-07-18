import { useMemo, useRef, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import { CHART_FONTS, fontById, previewFontFaceCss, embedFontCss } from '../../lib/chart-fonts';

type Mode = 'bar' | 'line' | 'pie' | 'funnel' | 'radar' | 'waterfall';

interface Row {
  label: string;
  value: number;
}

/** Everything the render functions need to draw in the user's chosen style. */
interface Style {
  colors: string[];
  text: string;
  muted: string;
  grid: string;
  axis: string;
  showValues: boolean;
  showGrid: boolean;
  showLegend: boolean;
  fs: (n: number) => number;
}

const PALETTES: { id: string; name: string; colors: string[] }[] = [
  { id: 'vivid', name: 'Vivid', colors: ['#2563eb', '#16a34a', '#f59e0b', '#dc2626', '#7c3aed', '#0891b2', '#db2777', '#65a30d'] },
  { id: 'ocean', name: 'Ocean', colors: ['#0ea5e9', '#0d9488', '#6366f1', '#22d3ee', '#3b82f6', '#14b8a6', '#8b5cf6', '#06b6d4'] },
  { id: 'sunset', name: 'Sunset', colors: ['#f97316', '#ef4444', '#f59e0b', '#e11d48', '#d946ef', '#fb7185', '#facc15', '#c026d3'] },
  { id: 'forest', name: 'Forest', colors: ['#16a34a', '#65a30d', '#059669', '#4d7c0f', '#15803d', '#84cc16', '#047857', '#a3e635'] },
  { id: 'slate', name: 'Grayscale', colors: ['#0f172a', '#334155', '#64748b', '#94a3b8', '#1e293b', '#475569', '#cbd5e1', '#e2e8f0'] },
];

const SAMPLE: Record<Mode, string> = {
  bar: 'Mon, 12\nTue, 19\nWed, 8\nThu, 22\nFri, 17\nSat, 25\nSun, 14',
  line: 'Jan, 30\nFeb, 42\nMar, 38\nApr, 55\nMay, 61\nJun, 58\nJul, 72',
  pie: 'Direct, 45\nSocial, 25\nSearch, 18\nEmail, 12',
  funnel: 'Visitors, 12000\nSign-ups, 4200\nTrials, 1800\nPaid, 640\nRenewed, 410',
  radar: 'Speed, 8\nPower, 6\nRange, 7\nDefense, 9\nAgility, 5\nStamina, 7',
  waterfall: 'Start, 1000\nSales, 750\nRefunds, -180\nFees, -120\nBonus, 300',
};

/** Parse "label, value" (comma or tab) per line. */
function parseData(text: string): Row[] {
  const rows: Row[] = [];
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    const parts = line.split(/[,\t]/);
    if (parts.length < 2) continue;
    const value = parseFloat(parts[parts.length - 1].replace(/[^0-9.\-]/g, ''));
    const label = parts.slice(0, -1).join(',').trim();
    if (!Number.isFinite(value)) continue;
    rows.push({ label: label || '—', value });
  }
  return rows;
}

const niceNum = (x: number) => Number(x.toFixed(2)).toLocaleString('en-US');

export default function ChartMaker({ mode }: { mode: Mode }) {
  const [data, setData] = useState(SAMPLE[mode]);
  const [title, setTitle] = useState('');
  const [paletteId, setPaletteId] = useState('vivid');
  const [custom, setCustom] = useState<string[]>([...PALETTES[0].colors]);
  const [fontId, setFontId] = useState('inter');
  const [fontScale, setFontScale] = useState(1);
  const [textColor, setTextColor] = useState('#1e293b');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [transparent, setTransparent] = useState(false);
  const [showValues, setShowValues] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [donut, setDonut] = useState(false);
  const [busy, setBusy] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const font = fontById(fontId);
  const colors = paletteId === 'custom' ? custom : (PALETTES.find((p) => p.id === paletteId) ?? PALETTES[0]).colors;
  const rows = useMemo(() => parseData(data), [data]);

  const W = 760;
  const H = 460;
  const titleH = title.trim() ? 44 : 12;

  const style: Style = useMemo(
    () => ({
      colors,
      text: textColor,
      muted: mix(textColor, '#94a3b8', 0.55),
      grid: mix(textColor, '#e2e8f0', 0.8),
      axis: mix(textColor, '#cbd5e1', 0.65),
      showValues,
      showGrid,
      showLegend,
      fs: (n: number) => Math.round(n * fontScale * 10) / 10,
    }),
    [colors, textColor, showValues, showGrid, showLegend, fontScale],
  );

  const chart = useMemo(() => {
    if (rows.length === 0) return null;
    if (mode === 'pie') return renderPie(rows, W, H, titleH, style, donut);
    if (mode === 'funnel') return renderFunnel(rows, W, H, titleH, style);
    if (mode === 'radar') return renderRadar(rows, W, H, titleH, style);
    if (mode === 'waterfall') return renderWaterfall(rows, W, H, titleH, style);
    return renderAxisChart(rows, W, H, titleH, style, mode);
  }, [rows, style, mode, donut, titleH]);

  async function download(kind: 'svg' | 'png') {
    const svg = svgRef.current;
    if (!svg || busy) return;
    setBusy(true);
    try {
      const clone = svg.cloneNode(true) as SVGSVGElement;
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      // Inline the chosen font so it survives both the SVG file and canvas rasterisation.
      const css = await embedFontCss(font);
      if (css) {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const st = document.createElementNS('http://www.w3.org/2000/svg', 'style');
        st.setAttribute('type', 'text/css');
        st.textContent = css;
        defs.appendChild(st);
        clone.insertBefore(defs, clone.firstChild);
      }
      const source = new XMLSerializer().serializeToString(clone);
      const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
      const name = (title.trim() || `${mode}-chart`).replace(/[^a-z0-9]+/gi, '-').toLowerCase();
      if (kind === 'svg') {
        triggerDownload(URL.createObjectURL(svgBlob), `${name}.svg`);
        return;
      }
      const url = URL.createObjectURL(svgBlob);
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          const scale = 2;
          const canvas = document.createElement('canvas');
          canvas.width = W * scale;
          canvas.height = H * scale;
          const ctx = canvas.getContext('2d')!;
          if (!transparent) {
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          URL.revokeObjectURL(url);
          canvas.toBlob((blob) => {
            if (blob) triggerDownload(URL.createObjectURL(blob), `${name}.png`);
            resolve();
          }, 'image/png');
        };
        img.onerror = () => { URL.revokeObjectURL(url); resolve(); };
        img.src = url;
      });
    } finally {
      setBusy(false);
    }
  }

  const label = 'mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500';
  const field = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const swatch = 'h-8 w-8 cursor-pointer rounded-md border border-slate-300 bg-white p-0.5';
  const toggle = 'flex items-center gap-1.5 text-sm font-medium text-slate-600';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      {/* Preview-only @font-face rules; each face downloads lazily on first use. */}
      <style dangerouslySetInnerHTML={{ __html: previewFontFaceCss() }} />

      <div class="grid gap-4 lg:grid-cols-[minmax(0,21rem)_1fr]">
        {/* ── Controls ── */}
        <div class="space-y-3">
          <label class="block">
            <span class={label}>Chart title (optional)</span>
            <input value={title} placeholder="e.g. Weekly visits" onInput={(e) => setTitle((e.target as HTMLInputElement).value)} class={field} />
          </label>

          <label class="block">
            <span class={label}>Data — one “label, value” per line</span>
            <textarea value={data} rows={7} spellcheck={false} onInput={(e) => setData((e.target as HTMLTextAreaElement).value)} class={`${field} font-mono`} />
          </label>

          {/* Typography */}
          <div class="rounded-xl border border-slate-200 bg-white p-3">
            <p class="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Typography</p>
            <label class="block">
              <span class={label}>Font</span>
              <select value={fontId} onChange={(e) => setFontId((e.target as HTMLSelectElement).value)} class={field} style={{ fontFamily: font.stack }}>
                {CHART_FONTS.map((f) => <option value={f.id} style={{ fontFamily: f.stack }}>{f.name} · {f.kind}</option>)}
              </select>
            </label>
            <label class="mt-2 block">
              <span class={label}>Text size — {Math.round(fontScale * 100)}%</span>
              <input type="range" min="0.75" max="1.5" step="0.05" value={fontScale} onInput={(e) => setFontScale(parseFloat((e.target as HTMLInputElement).value))} class="w-full accent-brand-600" />
            </label>
            <div class="mt-2 flex items-center gap-2">
              <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Text color</span>
              <input type="color" value={textColor} onInput={(e) => setTextColor((e.target as HTMLInputElement).value)} class={swatch} aria-label="Text color" />
              <button type="button" onClick={() => setTextColor('#1e293b')} class="text-xs text-slate-400 underline hover:text-brand-700">reset</button>
            </div>
          </div>

          {/* Colors */}
          <div class="rounded-xl border border-slate-200 bg-white p-3">
            <p class="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Colors</p>
            <div class="flex flex-wrap items-center gap-2">
              {PALETTES.map((p) => (
                <button type="button" onClick={() => setPaletteId(p.id)} title={p.name} aria-label={p.name}
                  class={`flex h-7 items-center gap-0.5 rounded-md border px-1 transition ${paletteId === p.id ? 'border-brand-500 ring-2 ring-brand-200' : 'border-slate-300 hover:border-brand-400'}`}>
                  {p.colors.slice(0, 4).map((c) => <span class="h-4 w-2 rounded-sm" style={{ background: c }} />)}
                </button>
              ))}
              <button type="button" onClick={() => setPaletteId('custom')}
                class={`h-7 rounded-md border px-2 text-xs font-semibold transition ${paletteId === 'custom' ? 'border-brand-500 bg-brand-50 text-brand-800 ring-2 ring-brand-200' : 'border-slate-300 text-slate-600 hover:border-brand-400'}`}>Custom</button>
            </div>
            {paletteId === 'custom' && (
              <div class="mt-2 flex flex-wrap items-center gap-1.5">
                {custom.slice(0, 8).map((c, i) => (
                  <input type="color" value={c} aria-label={`Series color ${i + 1}`} class={swatch}
                    onInput={(e) => { const v = (e.target as HTMLInputElement).value; setCustom((arr) => arr.map((x, j) => (j === i ? v : x))); }} />
                ))}
                <button type="button" onClick={() => setCustom([...PALETTES[0].colors])} class="text-xs text-slate-400 underline hover:text-brand-700">reset</button>
              </div>
            )}
            <div class="mt-3 flex flex-wrap items-center gap-2">
              <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Background</span>
              <input type="color" value={bgColor} disabled={transparent} onInput={(e) => setBgColor((e.target as HTMLInputElement).value)} class={`${swatch} disabled:opacity-40`} aria-label="Background color" />
              <label class={toggle}>
                <input type="checkbox" checked={transparent} onChange={(e) => setTransparent((e.target as HTMLInputElement).checked)} class="h-4 w-4 rounded border-slate-300" />
                Transparent
              </label>
            </div>
          </div>

          {/* Display toggles */}
          <div class="flex flex-wrap gap-x-4 gap-y-2 rounded-xl border border-slate-200 bg-white p-3">
            {mode !== 'pie' && mode !== 'radar' && (
              <label class={toggle}>
                <input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid((e.target as HTMLInputElement).checked)} class="h-4 w-4 rounded border-slate-300" />
                Gridlines
              </label>
            )}
            {mode !== 'radar' && (
              <label class={toggle}>
                <input type="checkbox" checked={showValues} onChange={(e) => setShowValues((e.target as HTMLInputElement).checked)} class="h-4 w-4 rounded border-slate-300" />
                Values
              </label>
            )}
            {mode === 'pie' && (
              <>
                <label class={toggle}>
                  <input type="checkbox" checked={showLegend} onChange={(e) => setShowLegend((e.target as HTMLInputElement).checked)} class="h-4 w-4 rounded border-slate-300" />
                  Legend
                </label>
                <label class={toggle}>
                  <input type="checkbox" checked={donut} onChange={(e) => setDonut((e.target as HTMLInputElement).checked)} class="h-4 w-4 rounded border-slate-300" />
                  Donut
                </label>
              </>
            )}
          </div>

          <div class="flex gap-2">
            <button type="button" onClick={() => download('png')} disabled={!chart || busy}
              class="flex-1 rounded-xl bg-brand-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-40">{busy ? 'Preparing…' : 'Download PNG'}</button>
            <button type="button" onClick={() => download('svg')} disabled={!chart || busy}
              class="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-400 disabled:opacity-40">Download SVG</button>
          </div>
        </div>

        {/* ── Preview ── */}
        <div class="min-w-0 overflow-x-auto rounded-xl border border-slate-200 p-2"
          style={{ background: transparent ? 'repeating-conic-gradient(#f1f5f9 0% 25%, #ffffff 0% 50%) 50%/16px 16px' : bgColor }}>
          {chart ? (
            <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: '100%', height: 'auto', fontFamily: font.stack }}
              font-family={font.stack} role="img" aria-label={title || `${mode} chart`}>
              {!transparent && <rect x="0" y="0" width={W} height={H} fill={bgColor} />}
              {title.trim() && (
                <text x={W / 2} y={28} text-anchor="middle" font-size={style.fs(20)} font-weight="700" fill={style.text}>{title.trim()}</text>
              )}
              {chart.nodes}
            </svg>
          ) : (
            <div class="flex h-64 items-center justify-center px-4 text-center text-sm text-slate-400">
              Enter data as “label, value” lines to draw the chart.
            </div>
          )}
        </div>
      </div>

      <p class="mt-4 text-xs text-slate-500">
        Fonts are self-hosted and <strong>embedded into the download</strong>, so your chart looks identical everywhere. Everything renders in your browser — the data you paste is never uploaded. 🔒
      </p>
    </div>
  );
}

/** Blend two hex colors — used to derive muted/grid tones from the text color. */
function mix(a: string, b: string, t: number): string {
  const pa = hexToRgb(a), pb = hexToRgb(b);
  if (!pa || !pb) return b;
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}
function hexToRgb(h: string): number[] | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h.trim());
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : null;
}

function triggerDownload(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/** Bar or line chart with axes. */
function renderAxisChart(rows: Row[], W: number, H: number, titleH: number, s: Style, mode: 'bar' | 'line') {
  const padL = 52, padR = 20, padB = 46, padT = titleH;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const values = rows.map((r) => r.value);
  const maxV = Math.max(0, ...values);
  const minV = Math.min(0, ...values);
  const range = maxV - minV || 1;
  const y = (v: number) => padT + plotH - ((v - minV) / range) * plotH;
  const n = rows.length;
  const step = plotW / n;

  const nodes: JSX.Element[] = [];
  if (s.showGrid) {
    for (let i = 0; i <= 4; i++) {
      const t = minV + (range * i) / 4;
      const yy = y(t);
      nodes.push(<line key={`g${i}`} x1={padL} y1={yy} x2={W - padR} y2={yy} stroke={s.grid} stroke-width="1" />);
      nodes.push(<text key={`gl${i}`} x={padL - 8} y={yy + 4} text-anchor="end" font-size={s.fs(11)} fill={s.muted}>{niceNum(t)}</text>);
    }
  }
  nodes.push(<line key="axis" x1={padL} y1={y(0)} x2={W - padR} y2={y(0)} stroke={s.axis} stroke-width="1.5" />);

  if (mode === 'bar') {
    const bw = Math.min(step * 0.7, 64);
    rows.forEach((r, i) => {
      const cx = padL + step * i + step / 2;
      const top = y(Math.max(0, r.value));
      const bottom = y(Math.min(0, r.value));
      nodes.push(<rect key={`b${i}`} x={cx - bw / 2} y={top} width={bw} height={Math.max(1, bottom - top)} rx="3" fill={s.colors[i % s.colors.length]} />);
      if (s.showValues) nodes.push(<text key={`bv${i}`} x={cx} y={top - 6} text-anchor="middle" font-size={s.fs(11)} font-weight="600" fill={s.muted}>{niceNum(r.value)}</text>);
    });
  } else {
    const color = s.colors[0];
    const pts = rows.map((r, i) => `${padL + step * i + step / 2},${y(r.value)}`);
    nodes.push(<polygon key="area" points={`${padL + step / 2},${y(0)} ${pts.join(' ')} ${padL + step * (n - 1) + step / 2},${y(0)}`} fill={color} fill-opacity="0.12" />);
    nodes.push(<polyline key="line" points={pts.join(' ')} fill="none" stroke={color} stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />);
    rows.forEach((r, i) => {
      const cx = padL + step * i + step / 2;
      nodes.push(<circle key={`p${i}`} cx={cx} cy={y(r.value)} r="3.5" fill="#fff" stroke={color} stroke-width="2" />);
      if (s.showValues) nodes.push(<text key={`lv${i}`} x={cx} y={y(r.value) - 10} text-anchor="middle" font-size={s.fs(11)} font-weight="600" fill={s.muted}>{niceNum(r.value)}</text>);
    });
  }

  rows.forEach((r, i) => {
    const cx = padL + step * i + step / 2;
    nodes.push(<text key={`x${i}`} x={cx} y={H - padB + 18} text-anchor="middle" font-size={s.fs(11)} fill={s.text}>{r.label.length > 10 ? r.label.slice(0, 9) + '…' : r.label}</text>);
  });

  return { nodes };
}

/** Pie or donut chart with legend. */
function renderPie(rows: Row[], W: number, H: number, titleH: number, s: Style, donut: boolean) {
  const positive = rows.filter((r) => r.value > 0);
  const total = positive.reduce((sum, r) => sum + r.value, 0);
  const nodes: JSX.Element[] = [];
  if (total <= 0) {
    nodes.push(<text key="err" x={W / 2} y={H / 2} text-anchor="middle" font-size={s.fs(14)} fill={s.muted}>Pie charts need positive values.</text>);
    return { nodes };
  }
  const cx = s.showLegend ? 230 : W / 2, cy = titleH + (H - titleH) / 2;
  const r = Math.min(cx - 30, (H - titleH) / 2) - 20;
  const inner = donut ? r * 0.58 : 0;
  let angle = -Math.PI / 2;

  positive.forEach((row, i) => {
    const frac = row.value / total;
    const a2 = angle + frac * Math.PI * 2;
    const color = s.colors[i % s.colors.length];
    const large = frac > 0.5 ? 1 : 0;
    const x1 = cx + r * Math.cos(angle), y1 = cy + r * Math.sin(angle);
    const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
    if (donut) {
      const ix1 = cx + inner * Math.cos(angle), iy1 = cy + inner * Math.sin(angle);
      const ix2 = cx + inner * Math.cos(a2), iy2 = cy + inner * Math.sin(a2);
      nodes.push(<path key={`s${i}`} d={`M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${inner} ${inner} 0 ${large} 0 ${ix1} ${iy1} Z`} fill={color} stroke="#fff" stroke-width="2" />);
    } else {
      nodes.push(<path key={`s${i}`} d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`} fill={color} stroke="#fff" stroke-width="2" />);
    }
    const mid = (angle + a2) / 2;
    const lr = donut ? (r + inner) / 2 : r * 0.62;
    if (s.showValues && frac > 0.05) {
      nodes.push(<text key={`pl${i}`} x={cx + lr * Math.cos(mid)} y={cy + lr * Math.sin(mid) + 4} text-anchor="middle" font-size={s.fs(12)} font-weight="700" fill={donut ? s.text : '#fff'}>{Math.round(frac * 100)}%</text>);
    }
    angle = a2;
  });

  if (s.showLegend) {
    const lx = 470;
    let ly = titleH + 24;
    positive.forEach((row, i) => {
      const pct = Math.round((row.value / total) * 100);
      nodes.push(<rect key={`lg${i}`} x={lx} y={ly - 10} width={13} height={13} rx="3" fill={s.colors[i % s.colors.length]} />);
      nodes.push(<text key={`lt${i}`} x={lx + 20} y={ly + 1} font-size={s.fs(13)} fill={s.text}>{`${row.label.length > 20 ? row.label.slice(0, 19) + '…' : row.label}  ·  ${niceNum(row.value)} (${pct}%)`}</text>);
      ly += 26;
    });
  }

  return { nodes };
}

/** Funnel chart — stacked centred trapezoids, width proportional to value. */
function renderFunnel(rows: Row[], W: number, H: number, titleH: number, s: Style) {
  const nodes: JSX.Element[] = [];
  const data = rows.filter((r) => r.value >= 0);
  if (data.length === 0) { nodes.push(<text key="e" x={W / 2} y={H / 2} text-anchor="middle" font-size={s.fs(14)} fill={s.muted}>Funnel charts need non-negative values.</text>); return { nodes }; }
  const maxV = Math.max(...data.map((r) => r.value)) || 1;
  const top = data[0].value || maxV;
  const padT = titleH + 12, padB = 24, padL = 150;
  const plotW = W - padL - 150;
  const stageH = (H - padT - padB) / data.length;
  const gap = 6;
  const cxc = W / 2;
  const half = (v: number) => (Math.max(0, v) / maxV) * (plotW / 2);
  data.forEach((r, i) => {
    const y0 = padT + i * stageH;
    const y1 = y0 + stageH - gap;
    const wTop = half(r.value);
    const wBot = half(i < data.length - 1 ? data[i + 1].value : r.value);
    nodes.push(<path key={`f${i}`} d={`M ${cxc - wTop} ${y0} L ${cxc + wTop} ${y0} L ${cxc + wBot} ${y1} L ${cxc - wBot} ${y1} Z`} fill={s.colors[i % s.colors.length]} stroke="#fff" stroke-width="1.5" />);
    if (s.showValues) {
      const pct = top > 0 ? Math.round((r.value / top) * 100) : 0;
      nodes.push(<text key={`fv${i}`} x={cxc} y={y0 + stageH / 2 - 2} text-anchor="middle" font-size={s.fs(13)} font-weight="700" fill="#fff">{niceNum(r.value)}</text>);
      nodes.push(<text key={`fp${i}`} x={cxc} y={y0 + stageH / 2 + 14} text-anchor="middle" font-size={s.fs(10)} font-weight="600" fill="#f1f5f9">{pct}%</text>);
    }
    nodes.push(<text key={`fl${i}`} x={padL - 12} y={y0 + stageH / 2 + 4} text-anchor="end" font-size={s.fs(12)} fill={s.text}>{r.label.length > 18 ? r.label.slice(0, 17) + '…' : r.label}</text>);
  });
  return { nodes };
}

/** Radar (spider) chart — one axis per row, values scaled to max. */
function renderRadar(rows: Row[], W: number, H: number, titleH: number, s: Style) {
  const nodes: JSX.Element[] = [];
  const data = rows.slice(0, 12);
  if (data.length < 3) { nodes.push(<text key="e" x={W / 2} y={H / 2} text-anchor="middle" font-size={s.fs(14)} fill={s.muted}>Radar charts need at least 3 values.</text>); return { nodes }; }
  const maxV = Math.max(1, ...data.map((r) => Math.max(0, r.value)));
  const cxc = W / 2, cyc = titleH + (H - titleH) / 2;
  const R = Math.min(cxc, (H - titleH) / 2) - 64;
  const n = data.length;
  const ang = (i: number) => -Math.PI / 2 + (i / n) * Math.PI * 2;
  const color = s.colors[0];
  for (let g = 1; g <= 4; g++) {
    const rr = (R * g) / 4;
    const pts = data.map((_, i) => `${cxc + rr * Math.cos(ang(i))},${cyc + rr * Math.sin(ang(i))}`).join(' ');
    nodes.push(<polygon key={`g${g}`} points={pts} fill="none" stroke={s.grid} stroke-width="1" />);
  }
  data.forEach((r, i) => {
    const x = cxc + R * Math.cos(ang(i)), y = cyc + R * Math.sin(ang(i));
    nodes.push(<line key={`a${i}`} x1={cxc} y1={cyc} x2={x} y2={y} stroke={s.axis} stroke-width="1" />);
    const lx = cxc + (R + 22) * Math.cos(ang(i)), ly = cyc + (R + 22) * Math.sin(ang(i));
    const anchor = Math.abs(Math.cos(ang(i))) < 0.3 ? 'middle' : Math.cos(ang(i)) > 0 ? 'start' : 'end';
    nodes.push(<text key={`al${i}`} x={lx} y={ly + 4} text-anchor={anchor} font-size={s.fs(12)} font-weight="600" fill={s.text}>{r.label.length > 12 ? r.label.slice(0, 11) + '…' : r.label}</text>);
  });
  const dpts = data.map((r, i) => { const rr = (Math.max(0, r.value) / maxV) * R; return `${cxc + rr * Math.cos(ang(i))},${cyc + rr * Math.sin(ang(i))}`; });
  nodes.push(<polygon key="poly" points={dpts.join(' ')} fill={color} fill-opacity="0.22" stroke={color} stroke-width="2.5" stroke-linejoin="round" />);
  data.forEach((r, i) => { const rr = (Math.max(0, r.value) / maxV) * R; nodes.push(<circle key={`d${i}`} cx={cxc + rr * Math.cos(ang(i))} cy={cyc + rr * Math.sin(ang(i))} r="3.5" fill="#fff" stroke={color} stroke-width="2" />); });
  return { nodes };
}

/** Waterfall chart — floating bars showing a running total. */
function renderWaterfall(rows: Row[], W: number, H: number, titleH: number, s: Style) {
  const nodes: JSX.Element[] = [];
  if (rows.length === 0) return { nodes };
  const padL = 56, padR = 20, padB = 46, padT = titleH + 10;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  let cum = 0;
  const segs = rows.map((r, i) => {
    const start = i === 0 ? 0 : cum;
    const end = i === 0 ? r.value : cum + r.value;
    cum = end;
    return { label: r.label, value: r.value, start, end, isTotal: i === 0 };
  });
  const allY = [0, ...segs.map((x) => x.start), ...segs.map((x) => x.end)];
  const maxY = Math.max(...allY), minY = Math.min(...allY);
  const range = maxY - minY || 1;
  const y = (v: number) => padT + plotH - ((v - minY) / range) * plotH;
  const n = segs.length, step = plotW / n, bw = Math.min(step * 0.6, 60);
  if (s.showGrid) {
    for (let i = 0; i <= 4; i++) {
      const t = minY + (range * i) / 4; const yy = y(t);
      nodes.push(<line key={`g${i}`} x1={padL} y1={yy} x2={W - padR} y2={yy} stroke={s.grid} stroke-width="1" />);
      nodes.push(<text key={`gl${i}`} x={padL - 8} y={yy + 4} text-anchor="end" font-size={s.fs(11)} fill={s.muted}>{niceNum(t)}</text>);
    }
  }
  nodes.push(<line key="axis" x1={padL} y1={y(0)} x2={W - padR} y2={y(0)} stroke={s.axis} stroke-width="1.5" />);
  const upColor = s.colors[0], downColor = s.colors[3] ?? s.colors[1], totalColor = s.colors[4] ?? '#475569';
  segs.forEach((seg, i) => {
    const cxb = padL + step * i + step / 2;
    const yTop = y(Math.max(seg.start, seg.end)), yBot = y(Math.min(seg.start, seg.end));
    const color = seg.isTotal ? totalColor : seg.value >= 0 ? upColor : downColor;
    nodes.push(<rect key={`b${i}`} x={cxb - bw / 2} y={yTop} width={bw} height={Math.max(1, yBot - yTop)} rx="2" fill={color} />);
    if (s.showValues) nodes.push(<text key={`v${i}`} x={cxb} y={yTop - 5} text-anchor="middle" font-size={s.fs(11)} font-weight="600" fill={s.muted}>{(seg.value >= 0 && !seg.isTotal ? '+' : '') + niceNum(seg.value)}</text>);
    if (i < segs.length - 1) nodes.push(<line key={`c${i}`} x1={cxb + bw / 2} y1={y(seg.end)} x2={cxb + step - bw / 2} y2={y(seg.end)} stroke={s.axis} stroke-width="1" stroke-dasharray="3 2" />);
    nodes.push(<text key={`x${i}`} x={cxb} y={H - padB + 18} text-anchor="middle" font-size={s.fs(11)} fill={s.text}>{seg.label.length > 10 ? seg.label.slice(0, 9) + '…' : seg.label}</text>);
  });
  return { nodes };
}
