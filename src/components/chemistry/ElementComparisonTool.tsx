import { useMemo, useState } from 'preact/hooks';
import { ELEMENT_DATA, CATEGORY_COLORS, type Element } from '../../data/chemistry/elements';

const kToC = (k: number | null) => (k == null ? '—' : `${k} K (${Math.round((k - 273.15) * 10) / 10} °C)`);
const or = (v: number | string | null, unit = '') => (v == null ? '—' : `${v}${unit}`);

const ROWS: { label: string; get: (e: Element) => string }[] = [
  { label: 'Atomic number', get: (e) => String(e.z) },
  { label: 'Atomic mass (u)', get: (e) => String(e.mass) },
  { label: 'Category', get: (e) => CATEGORY_COLORS[e.category].label },
  { label: 'Group · Period', get: (e) => `${e.group ?? '—'} · ${e.period}` },
  { label: 'Block', get: (e) => `${e.block}-block` },
  { label: 'Electron config.', get: (e) => e.config },
  { label: 'Phase (25 °C)', get: (e) => e.phase },
  { label: 'Melting point', get: (e) => kToC(e.melt) },
  { label: 'Boiling point', get: (e) => kToC(e.boil) },
  { label: 'Density (g/cm³)', get: (e) => or(e.density) },
  { label: 'Electronegativity', get: (e) => or(e.en) },
  { label: 'Atomic radius (pm)', get: (e) => or(e.radius) },
  { label: 'Discovered', get: (e) => (e.year == null ? 'Ancient' : String(e.year)) },
];

export default function ElementComparisonTool() {
  const [picked, setPicked] = useState<number[]>([1, 26, 79]); // H, Fe, Au
  const [query, setQuery] = useState('');

  const els = picked.map((z) => ELEMENT_DATA.find((e) => e.z === z)!).filter(Boolean);
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return ELEMENT_DATA.filter((e) => !picked.includes(e.z) && (e.name.toLowerCase().includes(q) || e.symbol.toLowerCase() === q || String(e.z) === q)).slice(0, 6);
  }, [query, picked]);

  const add = (z: number) => { if (picked.length < 5 && !picked.includes(z)) setPicked([...picked, z]); setQuery(''); };
  const remove = (z: number) => setPicked(picked.filter((x) => x !== z));

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap items-center gap-2">
        {els.map((e) => (
          <span class="flex items-center gap-1 rounded-lg px-2.5 py-1 text-sm font-semibold ring-1 ring-black/5" style={`background:${CATEGORY_COLORS[e.category].bg};color:${CATEGORY_COLORS[e.category].text}`}>
            {e.symbol} {e.name}
            <button onClick={() => remove(e.z)} class="ml-1 opacity-60 hover:opacity-100" aria-label="Remove">✕</button>
          </span>
        ))}
        {picked.length < 5 && (
          <div class="relative">
            <input value={query} onInput={(e) => setQuery((e.target as HTMLInputElement).value)} placeholder="+ add element…"
              class="w-40 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
            {suggestions.length > 0 && (
              <div class="absolute z-10 mt-1 w-48 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-slate-200">
                {suggestions.map((e) => (
                  <button onClick={() => add(e.z)} class="block w-full px-3 py-1.5 text-left text-sm text-slate-700 hover:bg-brand-50">{e.symbol} — {e.name}</button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {els.length >= 2 ? (
        <div class="mt-4 overflow-x-auto rounded-xl bg-white ring-1 ring-slate-200">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-slate-200 bg-slate-50">
                <th class="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Property</th>
                {els.map((e) => <th class="px-3 py-2 text-center font-bold text-slate-800">{e.symbol}</th>)}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr class="border-b border-slate-100 last:border-0">
                  <td class="px-3 py-2 text-slate-500">{r.label}</td>
                  {els.map((e) => <td class="px-3 py-2 text-center font-medium text-slate-800">{r.get(e)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Add at least two elements to compare their properties side by side.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Compare up to five elements. Data: IUPAC atomic weights + standard physical properties. 🔒 In your browser.</p>
    </div>
  );
}
