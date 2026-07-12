import { useState } from 'preact/hooks';

interface Props {
  /** allowlisted slug, e.g. "units/kg-to-lbs" or "calc/emi-calculator" */
  toolSlug: string;
  /** build-time aggregate (only present once a tool crosses the display threshold) */
  avg?: number;
  count?: number;
}

export default function RatingWidget({ toolSlug, avg, count }: Props) {
  const storageKey = `lt-rated:${toolSlug}`;
  const [rated, setRated] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem(storageKey) ?? '0', 10) || 0;
    } catch {
      return 0;
    }
  });
  const [hover, setHover] = useState(0);
  const [state, setState] = useState<'idle' | 'saving' | 'done' | 'error'>(rated ? 'done' : 'idle');

  async function rate(stars: number) {
    if (state === 'saving' || state === 'done') return;
    setState('saving');
    try {
      const res = await fetch('/api/rate.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: toolSlug, stars }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setRated(stars);
      setState('done');
      try {
        localStorage.setItem(storageKey, String(stars));
      } catch {
        /* private mode */
      }
    } catch {
      setState('error');
      setTimeout(() => setState('idle'), 2500);
    }
  }

  const active = hover || rated;

  return (
    <div class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
      <div class="flex items-center gap-3">
        <span class="text-sm font-medium text-slate-600">
          {state === 'done' ? 'Thanks for rating!' : state === 'error' ? "Couldn't save — try again later" : 'Rate this tool:'}
        </span>
        <div class="flex" role="radiogroup" aria-label="Rate this tool from 1 to 5 stars" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              type="button"
              role="radio"
              aria-checked={rated === s}
              aria-label={`${s} star${s > 1 ? 's' : ''}`}
              disabled={state === 'done' || state === 'saving'}
              onMouseEnter={() => state === 'idle' && setHover(s)}
              onFocus={() => state === 'idle' && setHover(s)}
              onClick={() => rate(s)}
              class={`px-0.5 text-2xl leading-none transition ${
                s <= active ? 'text-amber-400' : 'text-slate-300'
              } ${state === 'done' ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <span class="text-xs text-slate-400">
        {avg && count ? `${avg.toFixed(1)} ★ · ${count.toLocaleString()} ratings · ` : ''}Anonymous — no account, no identifier
      </span>
    </div>
  );
}
