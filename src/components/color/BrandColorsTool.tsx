import { useMemo, useState } from 'preact/hooks';
import { BRANDS } from '../../data/color/brands';

const PAGE = 120;

/** Perceived brightness → readable label color on a swatch. */
function textOn(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? '#1e293b' : '#ffffff';
}

export default function BrandColorsTool() {
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(PAGE);
  const [copied, setCopied] = useState('');

  const sorted = useMemo(() => [...BRANDS].sort((a, b) => a.n.localeCompare(b.n)), []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    const hexQ = q.replace(/^#/, '');
    const isHex = /^[0-9a-f]{2,6}$/.test(hexQ);
    return sorted.filter((b) => b.n.toLowerCase().includes(q) || (isHex && b.c.some((c) => c.slice(1).startsWith(hexQ))));
  }, [query, sorted]);

  const shown = results.slice(0, limit);

  function copy(hex: string, brand: string) {
    navigator.clipboard.writeText(hex);
    setCopied(`${brand}:${hex}`);
    setTimeout(() => setCopied(''), 1200);
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap items-end gap-3">
        <label class="block max-w-md flex-1">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Search {BRANDS.length.toLocaleString('en-US')} brands — by name or hex</span>
          <input
            class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-brand-500 focus:outline-none"
            value={query}
            onInput={(e) => { setQuery((e.target as HTMLInputElement).value); setLimit(PAGE); }}
            placeholder="e.g. spotify · airline · #ff0000 · 1db9"
          />
        </label>
        <p class="pb-2 text-sm text-slate-500">{results.length.toLocaleString('en-US')} match{results.length === 1 ? '' : 'es'}</p>
      </div>

      <ul class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((b) => (
          <li class="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <p class="truncate px-3 pt-2.5 text-sm font-bold text-slate-900" title={b.n}>{b.n}</p>
            <div class="mt-2 flex h-14">
              {b.c.map((hex) => (
                <button
                  type="button"
                  class="group relative flex-1 transition hover:flex-[1.6]"
                  style={`background:${hex}`}
                  onClick={() => copy(hex, b.n)}
                  title={`Copy ${hex}`}
                  aria-label={`${b.n} ${hex} — copy`}
                >
                  <span
                    class="absolute inset-0 flex items-center justify-center font-mono text-[10px] font-bold opacity-0 transition group-hover:opacity-100"
                    style={`color:${textOn(hex)}`}
                  >
                    {copied === `${b.n}:${hex}` ? '✓ copied' : hex}
                  </span>
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>

      {results.length > limit && (
        <button
          type="button"
          class="mt-4 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-brand-400 hover:text-brand-700"
          onClick={() => setLimit((l) => l + PAGE * 3)}
        >
          Show more ({(results.length - limit).toLocaleString('en-US')} remaining)
        </button>
      )}

      {results.length === 0 && (
        <p class="mt-4 rounded-lg bg-white px-3 py-2 text-sm text-slate-600 ring-1 ring-slate-200">
          No brand matches "{query}". Try a shorter fragment, or a hex like <span class="font-mono">#e50914</span>. Missing a brand? <a href="/contact/" class="font-semibold text-brand-700 underline decoration-slate-300 underline-offset-2">Suggest it</a>.
        </p>
      )}

      <p class="mt-4 rounded-lg bg-white px-3 py-2 text-xs text-slate-500 ring-1 ring-slate-200">
        Click any swatch to copy its hex. Colors are compiled from publicly documented brand guidelines and long-standing community references; brands evolve their palettes, so treat these as excellent starting points rather than official assets — and <a href="/contact/" class="font-semibold text-brand-700 underline decoration-slate-300 underline-offset-2">report corrections</a>. All trademarks and brand names belong to their respective owners and are used only to identify whose colors are shown. Search runs locally.
      </p>
    </div>
  );
}
