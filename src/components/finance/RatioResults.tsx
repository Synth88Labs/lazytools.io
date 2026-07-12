import type { RatioResult } from '../../lib/finance-ratios';

const STYLE: Record<string, { ring: string; badge: string; label: string; dot: string }> = {
  good: { ring: 'ring-emerald-200', badge: 'bg-emerald-100 text-emerald-800', label: 'Healthy', dot: 'bg-emerald-500' },
  ok: { ring: 'ring-amber-200', badge: 'bg-amber-100 text-amber-800', label: 'Caution', dot: 'bg-amber-500' },
  poor: { ring: 'ring-rose-200', badge: 'bg-rose-100 text-rose-800', label: 'Concern', dot: 'bg-rose-500' },
  context: { ring: 'ring-slate-200', badge: 'bg-slate-100 text-slate-700', label: 'Compare to peers', dot: 'bg-slate-400' },
};

export default function RatioResults({ results }: { results: RatioResult[] }) {
  const shown = results.filter((r) => r.value != null);
  if (!shown.length) {
    return <p class="mt-4 text-sm text-slate-500">Enter the figures above to calculate and interpret the ratios.</p>;
  }
  return (
    <div class="mt-4 space-y-3">
      {shown.map((r) => {
        const s = STYLE[r.verdict];
        return (
          <div key={r.key} class={`rounded-xl bg-white p-4 ring-1 ${s.ring}`}>
            <div class="flex flex-wrap items-baseline justify-between gap-2">
              <div class="flex items-baseline gap-2">
                <span class={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ${s.dot}`} aria-hidden="true" />
                <span class="font-semibold text-slate-900">{r.name}</span>
                <span class="font-mono text-lg font-extrabold text-brand-800">{r.display}</span>
              </div>
              <span class={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.badge}`}>{s.label}</span>
            </div>
            <p class="mt-1.5 text-sm leading-relaxed text-slate-600">{r.meaning}</p>
          </div>
        );
      })}
    </div>
  );
}
