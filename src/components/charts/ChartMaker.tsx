import { useMemo, useRef, useState } from 'preact/hooks';
import type { JSX } from 'preact';

type Mode = 'bar' | 'line' | 'pie';

interface Row {
  label: string;
  value: number;
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
  const [donut, setDonut] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const palette = PALETTES.find((p) => p.id === paletteId) ?? PALETTES[0];
  const rows = useMemo(() => parseData(data), [data]);

  const W = 760;
  const H = 460;
  const titleH = title.trim() ? 44 : 12;

  const chart = useMemo(() => {
    if (rows.length === 0) return null;
    if (mode === 'pie') return renderPie(rows, palette.colors, W, H, titleH, donut);
    return renderAxisChart(rows, palette.colors, W, H, titleH, mode);
  }, [rows, palette, mode, donut, titleH]);

  function download(kind: 'svg' | 'png') {
    const svg = svgRef.current;
    if (!svg) return;
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const source = new XMLSerializer().serializeToString(clone);
    const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const name = (title.trim() || `${mode}-chart`).replace(/[^a-z0-9]+/gi, '-').toLowerCase();
    if (kind === 'svg') {
      triggerDownload(URL.createObjectURL(svgBlob), `${name}.svg`);
      return;
    }
    // PNG: render the SVG onto a 2× canvas.
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const scale = 2;
      const canvas = document.createElement('canvas');
      canvas.width = W * scale;
      canvas.height = H * scale;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        if (blob) triggerDownload(URL.createObjectURL(blob), `${name}.png`);
      }, 'image/png');
    };
    img.src = url;
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-4 lg:grid-cols-[minmax(0,20rem)_1fr]">
        {/* Controls */}
        <div class="space-y-3">
          <label class="block">
            <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Chart title (optional)</span>
            <input value={title} placeholder="e.g. Weekly visits" onInput={(e) => setTitle((e.target as HTMLInputElement).value)}
              class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
          </label>
          <label class="block">
            <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Data — one “label, value” per line</span>
            <textarea value={data} rows={9} spellcheck={false} onInput={(e) => setData((e.target as HTMLTextAreaElement).value)}
              class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
          </label>
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Colors</span>
            {PALETTES.map((p) => (
              <button type="button" onClick={() => setPaletteId(p.id)} title={p.name} aria-label={p.name}
                class={`flex h-7 items-center gap-0.5 rounded-md border px-1 transition ${paletteId === p.id ? 'border-brand-500 ring-2 ring-brand-200' : 'border-slate-300 hover:border-brand-400'}`}>
                {p.colors.slice(0, 4).map((c) => <span class="h-4 w-2 rounded-sm" style={{ background: c }} />)}
              </button>
            ))}
          </div>
          {mode === 'pie' && (
            <label class="flex items-center gap-2 text-sm font-medium text-slate-600">
              <input type="checkbox" checked={donut} onChange={(e) => setDonut((e.target as HTMLInputElement).checked)} class="h-4 w-4 rounded border-slate-300" />
              Donut (ring) style
            </label>
          )}
          <div class="flex gap-2 pt-1">
            <button type="button" onClick={() => download('png')} disabled={!chart}
              class="flex-1 rounded-xl bg-brand-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-40">Download PNG</button>
            <button type="button" onClick={() => download('svg')} disabled={!chart}
              class="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-400 disabled:opacity-40">Download SVG</button>
          </div>
        </div>

        {/* Preview */}
        <div class="min-w-0 overflow-x-auto rounded-xl border border-slate-200 bg-white p-2">
          {chart ? (
            <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: '100%', height: 'auto' }} font-family="system-ui, -apple-system, sans-serif" role="img" aria-label={title || `${mode} chart`}>
              <rect x="0" y="0" width={W} height={H} fill="#ffffff" />
              {title.trim() && <text x={W / 2} y={28} text-anchor="middle" font-size="20" font-weight="700" fill="#0f172a">{title.trim()}</text>}
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
        Everything renders in your browser — the data you paste is never uploaded. Download a crisp 2× PNG or an editable, infinitely scalable SVG. 🔒
      </p>
    </div>
  );
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
function renderAxisChart(rows: Row[], colors: string[], W: number, H: number, titleH: number, mode: 'bar' | 'line') {
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

  // gridlines / y ticks (5)
  const ticks: number[] = [];
  for (let i = 0; i <= 4; i++) ticks.push(minV + (range * i) / 4);

  const nodes: JSX.Element[] = [];
  ticks.forEach((t, i) => {
    const yy = y(t);
    nodes.push(<line key={`g${i}`} x1={padL} y1={yy} x2={W - padR} y2={yy} stroke="#e2e8f0" stroke-width="1" />);
    nodes.push(<text key={`gl${i}`} x={padL - 8} y={yy + 4} text-anchor="end" font-size="11" fill="#94a3b8">{niceNum(t)}</text>);
  });
  // zero axis
  nodes.push(<line key="axis" x1={padL} y1={y(0)} x2={W - padR} y2={y(0)} stroke="#cbd5e1" stroke-width="1.5" />);

  if (mode === 'bar') {
    const bw = Math.min(step * 0.7, 64);
    rows.forEach((r, i) => {
      const cx = padL + step * i + step / 2;
      const top = y(Math.max(0, r.value));
      const bottom = y(Math.min(0, r.value));
      const color = colors[i % colors.length];
      nodes.push(<rect key={`b${i}`} x={cx - bw / 2} y={top} width={bw} height={Math.max(1, bottom - top)} rx="3" fill={color} />);
      nodes.push(<text key={`bv${i}`} x={cx} y={top - 6} text-anchor="middle" font-size="11" font-weight="600" fill="#475569">{niceNum(r.value)}</text>);
    });
  } else {
    const color = colors[0];
    const pts = rows.map((r, i) => `${padL + step * i + step / 2},${y(r.value)}`);
    // area fill
    nodes.push(<polygon key="area" points={`${padL + step / 2},${y(0)} ${pts.join(' ')} ${padL + step * (n - 1) + step / 2},${y(0)}`} fill={color} fill-opacity="0.12" />);
    nodes.push(<polyline key="line" points={pts.join(' ')} fill="none" stroke={color} stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />);
    rows.forEach((r, i) => {
      const cx = padL + step * i + step / 2;
      nodes.push(<circle key={`p${i}`} cx={cx} cy={y(r.value)} r="3.5" fill="#fff" stroke={color} stroke-width="2" />);
    });
  }

  // x labels
  rows.forEach((r, i) => {
    const cx = padL + step * i + step / 2;
    nodes.push(<text key={`x${i}`} x={cx} y={H - padB + 18} text-anchor="middle" font-size="11" fill="#475569">{r.label.length > 10 ? r.label.slice(0, 9) + '…' : r.label}</text>);
  });

  return { nodes };
}

/** Pie or donut chart with legend. */
function renderPie(rows: Row[], colors: string[], W: number, H: number, titleH: number, donut: boolean) {
  const positive = rows.filter((r) => r.value > 0);
  const total = positive.reduce((s, r) => s + r.value, 0);
  const nodes: JSX.Element[] = [];
  if (total <= 0) {
    nodes.push(<text key="err" x={W / 2} y={H / 2} text-anchor="middle" font-size="14" fill="#94a3b8">Pie charts need positive values.</text>);
    return { nodes };
  }
  const cx = 230, cy = titleH + (H - titleH) / 2;
  const r = Math.min(cx - 30, (H - titleH) / 2 - 20);
  const inner = donut ? r * 0.58 : 0;
  let angle = -Math.PI / 2;

  positive.forEach((row, i) => {
    const frac = row.value / total;
    const a2 = angle + frac * Math.PI * 2;
    const color = colors[i % colors.length];
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
    // percentage label on slice
    const mid = (angle + a2) / 2;
    const lr = donut ? (r + inner) / 2 : r * 0.62;
    if (frac > 0.05) {
      nodes.push(<text key={`pl${i}`} x={cx + lr * Math.cos(mid)} y={cy + lr * Math.sin(mid) + 4} text-anchor="middle" font-size="12" font-weight="700" fill={donut ? '#0f172a' : '#fff'}>{Math.round(frac * 100)}%</text>);
    }
    angle = a2;
  });

  // legend
  const lx = 470;
  let ly = titleH + 24;
  positive.forEach((row, i) => {
    const color = colors[i % colors.length];
    const pct = Math.round((row.value / total) * 100);
    nodes.push(<rect key={`lg${i}`} x={lx} y={ly - 10} width={13} height={13} rx="3" fill={color} />);
    nodes.push(<text key={`lt${i}`} x={lx + 20} y={ly + 1} font-size="13" fill="#334155">{`${row.label.length > 20 ? row.label.slice(0, 19) + '…' : row.label}  ·  ${niceNum(row.value)} (${pct}%)`}</text>);
    ly += 26;
  });

  return { nodes };
}
