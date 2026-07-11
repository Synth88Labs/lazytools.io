import { useMemo, useState } from 'preact/hooks';
import { CROPS, getCrop } from '../../lib/garden';

function addWeeks(iso: string, weeks: number): Date | null {
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d.getTime())) return null;
  d.setDate(d.getDate() + Math.round(weeks * 7));
  return d;
}
const fmtDate = (d: Date) => d.toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric' });

export default function PlantingDateTool() {
  const [crop, setCrop] = useState('tomato');
  const [frost, setFrost] = useState('');

  const r = useMemo(() => {
    const c = getCrop(crop);
    if (!c || !frost) return null;
    return {
      crop: c,
      startIndoors: c.startIndoors != null ? addWeeks(frost, c.startIndoors) : null,
      transplant: c.transplant != null ? addWeeks(frost, c.transplant) : null,
      directSow: c.directSow != null ? addWeeks(frost, c.directSow) : null,
    };
  }, [crop, frost]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  const Row = ({ label, date, weeks }: { label: string; date: Date | null; weeks?: number }) => date ? (
    <div class="flex items-center justify-between rounded-xl bg-white p-3 ring-1 ring-slate-200">
      <span class="text-sm font-semibold text-slate-700">{label}</span>
      <span class="text-right"><span class="font-mono font-bold text-brand-800">{fmtDate(date)}</span>{weeks != null && <span class="ml-2 text-xs text-slate-400">({weeks < 0 ? `${-weeks} wk before` : weeks > 0 ? `${weeks} wk after` : 'at'} frost)</span>}</span>
    </div>
  ) : null;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Crop</span>
          <select value={crop} onChange={(e) => setCrop((e.target as HTMLSelectElement).value)} class={inp}>
            {CROPS.map((c) => <option value={c.id}>{c.name}</option>)}
          </select></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Your average last spring frost date</span>
          <input type="date" value={frost} onInput={(e) => setFrost((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 space-y-2">
          <Row label="🌱 Start seeds indoors" date={r.startIndoors} weeks={r.crop.startIndoors} />
          <Row label="🪴 Transplant outdoors" date={r.transplant} weeks={r.crop.transplant} />
          <Row label="🌾 Direct sow outdoors" date={r.directSow} weeks={r.crop.directSow} />
          {!r.startIndoors && !r.transplant && !r.directSow && <p class="text-sm text-slate-500">No timing data for this crop.</p>}
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Pick a crop and enter your local last-frost date (from your regional extension service or a frost-date lookup).</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Dates are offsets from your average last spring frost — the single most useful date for planning. These are general guidelines that vary by region and variety; check your local extension service and the seed packet. 🔒 In your browser.</p>
    </div>
  );
}
