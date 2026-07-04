import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { SearchPage, SearchQuantity, SearchUnit } from '../lib/search-data';

interface Props {
  quantities: SearchQuantity[];
  pages: SearchPage[];
}

interface Result {
  title: string;
  url: string;
  detail?: string;
  smart?: boolean;
}

function convert(value: number, from: SearchUnit, to: SearchUnit): number {
  const base = value * from.factor + (from.offset ?? 0);
  return (base - (to.offset ?? 0)) / to.factor;
}

function fmt(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (value === 0) return '0';
  const abs = Math.abs(value);
  if (abs >= 1e15 || abs < 1e-9) return value.toExponential(4);
  return String(Number(value.toPrecision(8)));
}

/** Find unit alias occurrences in the normalized query, longest aliases first to avoid partial shadowing. */
function findUnits(query: string, quantities: SearchQuantity[]): { unit: SearchUnit; q: SearchQuantity; pos: number }[] {
  const hits: { unit: SearchUnit; q: SearchQuantity; pos: number; len: number }[] = [];
  const padded = ` ${query} `;
  for (const q of quantities) {
    for (const unit of q.units) {
      for (const alias of unit.aliases) {
        if (alias.length < 1) continue;
        const idx = padded.indexOf(` ${alias} `);
        if (idx >= 0) {
          hits.push({ unit, q, pos: idx, len: alias.length });
          break; // one hit per unit is enough
        }
      }
    }
  }
  // prefer longer alias matches at overlapping positions, then order by position
  hits.sort((a, b) => a.pos - b.pos || b.len - a.len);
  const out: { unit: SearchUnit; q: SearchQuantity; pos: number }[] = [];
  let lastEnd = -1;
  for (const h of hits) {
    if (h.pos >= lastEnd) {
      out.push(h);
      lastEnd = h.pos + h.len;
    }
  }
  return out;
}

/** "70 kg to lbs" / "how many pounds in a kilo" → direct conversion result. */
function smartParse(rawQuery: string, quantities: SearchQuantity[]): Result[] {
  const query = rawQuery
    .toLowerCase()
    .replace(/[?,!]/g, ' ')
    .replace(/\b(convert|how many|how much|what is|whats|is|a|an|the|are|there)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!query) return [];

  const numMatch = query.match(/-?\d+(?:\.\d+)?/);
  const value = numMatch ? parseFloat(numMatch[0]) : undefined;

  const unitHits = findUnits(query.replace(/-?\d+(?:\.\d+)?/g, ' ').replace(/\s+/g, ' '), quantities);
  if (unitHits.length < 2) return [];

  // first two distinct units within the same quantity
  for (let i = 0; i < unitHits.length - 1; i++) {
    for (let j = i + 1; j < unitHits.length; j++) {
      const a = unitHits[i];
      const b = unitHits[j];
      if (a.q.id !== b.q.id || a.unit.id === b.unit.id) continue;

      // "X in Y" phrasing usually means: how many Y per X... but "pounds in a kilo" = kilo→pounds.
      // Query order after cleanup: [target] in [source] when "in/per" was used without a number,
      // otherwise [source] to [target]. Detect the original connector:
      const connector = rawQuery.toLowerCase().match(/\b(to|into|in|per|as|equals?)\b/)?.[1];
      let from = a.unit, to = b.unit;
      if ((connector === 'in' || connector === 'per') && value === undefined) {
        // "how many lbs in a kg" → from kg, to lbs
        from = b.unit;
        to = a.unit;
      }

      const q = a.q;
      const v = value ?? 1;
      const converted = convert(v, from, to);
      const pairSlug = q.pairs[`${from.id}>${to.id}`];
      const url = pairSlug ? `/units/${pairSlug}/?v=${encodeURIComponent(v)}` : `/units/${q.slug}/`;
      return [
        {
          title: `${fmt(v)} ${from.symbol} = ${fmt(converted)} ${to.symbol}`,
          detail: pairSlug ? `Open the ${from.symbol} → ${to.symbol} converter` : `Open the ${q.name} converter`,
          url,
          smart: true,
        },
      ];
    }
  }
  return [];
}

function scorePages(query: string, pages: SearchPage[]): Result[] {
  const tokens = query.toLowerCase().split(/\s+/).filter((t) => t.length > 1);
  if (!tokens.length) return [];
  const scored = pages
    .map((p) => {
      let score = 0;
      const title = p.title.toLowerCase();
      for (const t of tokens) {
        if (title.includes(t)) score += 3;
        for (const k of p.keywords) {
          if (k === t) score += 3;
          else if (k.startsWith(t)) score += 2;
          else if (k.includes(t)) score += 1;
        }
      }
      return { p, score };
    })
    .filter((s) => s.score > 0)
    .sort((x, y) => y.score - x.score)
    .slice(0, 6);
  return scored.map(({ p }) => ({ title: p.title, url: p.url }));
}

export default function SearchBox({ quantities, pages }: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const results = useMemo<Result[]>(() => {
    if (query.trim().length < 2) return [];
    const smart = smartParse(query, quantities);
    const pageResults = scorePages(query, pages).filter((r) => !smart.some((s) => s.url.split('?')[0] === r.url));
    return [...smart, ...pageResults].slice(0, 7);
  }, [query, quantities, pages]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  function go(r: Result | undefined) {
    if (r) window.location.href = r.url;
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      go(results[active]);
    } else if (e.key === 'Escape') {
      setOpen(false);
      (e.target as HTMLInputElement).blur();
    }
  }

  return (
    <div ref={rootRef} class="relative w-full max-w-md">
      <label class="sr-only" for="site-search">Search tools</label>
      <div class="relative">
        <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </span>
        <input
          id="site-search"
          type="search"
          autocomplete="off"
          placeholder='Try "70 kg to lbs" or "psi to bar"…'
          value={query}
          onInput={(e) => {
            setQuery((e.target as HTMLInputElement).value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded={open && results.length > 0}
          aria-controls="site-search-results"
          class="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
      </div>
      {open && results.length > 0 && (
        <ul
          id="site-search-results"
          role="listbox"
          class="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
        >
          {results.map((r, i) => (
            <li role="option" aria-selected={i === active}>
              <a
                href={r.url}
                onMouseEnter={() => setActive(i)}
                class={`block px-4 py-2.5 text-sm ${
                  i === active ? 'bg-brand-50' : ''
                } ${r.smart ? 'border-b border-slate-100' : ''}`}
              >
                {r.smart ? (
                  <>
                    <span class="font-bold text-slate-900">🟰 {r.title}</span>
                    <span class="mt-0.5 block text-xs text-brand-700">{r.detail} →</span>
                  </>
                ) : (
                  <span class="font-medium text-slate-700">{r.title}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
