import { useMemo, useState } from 'preact/hooks';
import { useFullscreen } from '../../lib/persist';
import { ELEMENT_DATA, CATEGORY_COLORS, gridPos, type Element, type Category } from '../../data/chemistry/elements';

type ColorBy = 'category' | 'phase' | 'block' | 'electronegativity';

const PHASE_COLORS: Record<string, string> = { solid: '#cbd5e1', liquid: '#7dd3fc', gas: '#fca5a5', unknown: '#e2e8f0' };
const BLOCK_COLORS: Record<string, string> = { s: '#fecaca', p: '#bae6fd', d: '#fde68a', f: '#f5d0fe' };

function heat(v: number | null, min: number, max: number): string {
  if (v == null) return '#e2e8f0';
  const t = Math.max(0, Math.min(1, (v - min) / (max - min)));
  // blue (low) → yellow → red (high)
  const r = Math.round(255 * Math.min(1, t * 2));
  const g = Math.round(255 * Math.min(1, 2 - t * 2));
  const b = Math.round(255 * Math.max(0, 1 - t * 2));
  return `rgb(${r},${g},${b})`;
}

function cellColor(e: Element, by: ColorBy): string {
  if (by === 'category') return CATEGORY_COLORS[e.category].bg;
  if (by === 'phase') return PHASE_COLORS[e.phase];
  if (by === 'block') return BLOCK_COLORS[e.block];
  return heat(e.en, 0.7, 4.0);
}

const fmt = (x: number | null, unit = '') => (x == null ? '—' : `${x}${unit}`);
const kToC = (k: number | null) => (k == null ? null : Math.round((k - 273.15) * 10) / 10);

function Detail({ e, onClose }: { e: Element; onClose: () => void }) {
  const c = CATEGORY_COLORS[e.category];
  const rows: [string, string][] = [
    ['Atomic number', String(e.z)],
    ['Atomic mass', `${e.mass} u`],
    ['Category', c.label],
    ['Group · Period', `${e.group ?? '—'} · ${e.period}`],
    ['Block', `${e.block}-block`],
    ['Electron configuration', e.config],
    ['Phase at STP', e.phase],
    ['Melting point', e.melt == null ? '—' : `${e.melt} K (${kToC(e.melt)} °C)`],
    ['Boiling point', e.boil == null ? '—' : `${e.boil} K (${kToC(e.boil)} °C)`],
    ['Density', fmt(e.density, ' g/cm³')],
    ['Electronegativity', fmt(e.en)],
    ['Atomic radius', fmt(e.radius, ' pm')],
    ['Discovered', e.year == null ? 'Ancient / prehistoric' : String(e.year)],
  ];
  return (
    <div class="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 p-4" onClick={onClose}>
      <div class="max-h-[85vh] w-full max-w-lg overflow-auto rounded-2xl bg-white p-5 shadow-xl" onClick={(ev) => ev.stopPropagation()}>
        <div class="flex items-start gap-4">
          <div class="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-xl" style={`background:${c.bg};color:${c.text}`}>
            <span class="text-xs font-semibold">{e.z}</span>
            <span class="text-4xl font-extrabold leading-none">{e.symbol}</span>
            <span class="text-[10px]">{e.mass}</span>
          </div>
          <div class="min-w-0 flex-1">
            <h3 class="text-2xl font-extrabold text-slate-900">{e.name}</h3>
            <p class="text-sm font-semibold" style={`color:${c.text}`}>{c.label}</p>
            <p class="mt-2 text-sm text-slate-600">{e.summary}</p>
          </div>
          <button onClick={onClose} class="shrink-0 rounded-lg px-2 py-1 text-slate-400 ring-1 ring-slate-200 hover:text-slate-700" aria-label="Close">✕</button>
        </div>
        <dl class="mt-4 grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
          {rows.map(([k, v]) => (
            <div class="flex justify-between gap-3 border-b border-slate-100 py-1 text-sm">
              <dt class="text-slate-500">{k}</dt>
              <dd class="text-right font-medium text-slate-800">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

export default function PeriodicTableTool() {
  const fs = useFullscreen();
  const [colorBy, setColorBy] = useState<ColorBy>('category');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Element | null>(null);

  const q = query.trim().toLowerCase();
  const matches = (e: Element) => !q || e.name.toLowerCase().includes(q) || e.symbol.toLowerCase() === q || String(e.z) === q || e.category.includes(q);

  const legend = useMemo(() => {
    if (colorBy === 'category') return (Object.keys(CATEGORY_COLORS) as Category[]).map((k) => ({ color: CATEGORY_COLORS[k].bg, label: CATEGORY_COLORS[k].label }));
    if (colorBy === 'phase') return ['solid', 'liquid', 'gas', 'unknown'].map((k) => ({ color: PHASE_COLORS[k], label: k[0].toUpperCase() + k.slice(1) }));
    if (colorBy === 'block') return ['s', 'p', 'd', 'f'].map((k) => ({ color: BLOCK_COLORS[k], label: `${k}-block` }));
    return [{ color: heat(1, 0.7, 4), label: 'low' }, { color: heat(2.3, 0.7, 4), label: 'mid' }, { color: heat(4, 0.7, 4), label: 'high (electronegativity)' }];
  }, [colorBy]);

  const btn = 'rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-brand-400';

  return (
    <div ref={fs.ref} class={`rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-sm sm:p-5 ${fs.isFull ? 'fixed inset-0 z-[60] overflow-auto !rounded-none' : ''}`}>
      <div class="mb-3 flex flex-wrap items-center gap-2">
        <input value={query} onInput={(e) => setQuery((e.target as HTMLInputElement).value)} placeholder="Search name, symbol or number…"
          class="w-56 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
        <label class="flex items-center gap-1.5 text-sm text-slate-600">
          <span class="font-semibold">Colour by</span>
          <select value={colorBy} onChange={(e) => setColorBy((e.target as HTMLSelectElement).value as ColorBy)}
            class="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none">
            <option value="category">Category</option>
            <option value="phase">Phase (at 25 °C)</option>
            <option value="block">Block (s/p/d/f)</option>
            <option value="electronegativity">Electronegativity</option>
          </select>
        </label>
        <button onClick={fs.toggle} class={`${btn} ml-auto`}>{fs.isFull ? '⤢ Exit full screen' : '⛶ Full screen'}</button>
      </div>

      <div class="overflow-x-auto">
        <div class="min-w-[900px]"
          style="display:grid;grid-template-columns:repeat(18,minmax(0,1fr));grid-template-rows:repeat(7,minmax(0,1fr)) 0.35fr repeat(2,minmax(0,1fr));gap:3px">
          {/* group 3 placeholders for the f-block */}
          <div style="grid-column:3;grid-row:6" class="flex items-center justify-center rounded bg-pink-100 text-[9px] font-semibold text-pink-800">57–71</div>
          <div style="grid-column:3;grid-row:7" class="flex items-center justify-center rounded bg-fuchsia-100 text-[9px] font-semibold text-fuchsia-800">89–103</div>

          {ELEMENT_DATA.map((e) => {
            const { col, row } = gridPos(e);
            const on = matches(e);
            const bg = cellColor(e, colorBy);
            return (
              <button
                onClick={() => setSelected(e)}
                title={`${e.name} — ${CATEGORY_COLORS[e.category].label}`}
                style={`grid-column:${col};grid-row:${row};background:${bg};opacity:${on ? 1 : 0.18}`}
                class="flex aspect-square flex-col items-center justify-center rounded p-0.5 text-slate-900 ring-1 ring-black/5 transition hover:z-10 hover:scale-110 hover:ring-2 hover:ring-brand-500"
              >
                <span class="text-[7px] leading-none opacity-70">{e.z}</span>
                <span class="text-[clamp(9px,1.1vw,15px)] font-extrabold leading-tight">{e.symbol}</span>
                <span class="hidden truncate text-[6px] leading-none opacity-80 sm:block" style="max-width:100%">{e.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div class="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {legend.map((l) => (
          <span class="flex items-center gap-1.5 text-xs text-slate-600">
            <span class="h-3 w-3 rounded-sm ring-1 ring-black/10" style={`background:${l.color}`} />{l.label}
          </span>
        ))}
      </div>

      <p class="mt-3 text-xs text-slate-500">
        Click any element for its full details. Data: IUPAC atomic weights + standard physical properties (CRC/PubChem). 🔒 Everything runs in your browser.
      </p>

      {selected && <Detail e={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
