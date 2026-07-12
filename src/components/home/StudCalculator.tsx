import { useMemo, useState } from 'preact/hooks';
import { studCount } from '../../lib/home';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const sel = 'rounded-xl border border-slate-300 bg-white px-2 text-sm';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };

export default function StudCalculator() {
  const [length, setLength] = useState('20');
  const [unit, setUnit] = useState<'ft' | 'm'>('ft');
  const [spacing, setSpacing] = useState('16');
  const [openings, setOpenings] = useState('0');

  const res = useMemo(() => {
    const l = num(length), o = num(openings);
    if (l == null || o == null) return null;
    const lengthIn = unit === 'm' ? l * 39.3701 : l * 12;
    const sp = parseFloat(spacing);
    // 2 extra studs per opening (king + jack, simplified)
    return studCount(lengthIn, sp, o * 2);
  }, [length, unit, spacing, openings]);

  const plateLen = num(length);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Wall length</span>
          <div class="flex gap-1"><input type="number" step="any" value={length} onInput={(e) => setLength((e.target as HTMLInputElement).value)} class={inp} />
            <select value={unit} onChange={(e) => setUnit((e.target as HTMLSelectElement).value as 'ft' | 'm')} class={sel}><option value="ft">ft</option><option value="m">m</option></select></div></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Stud spacing (on-center)</span>
          <select value={spacing} onChange={(e) => setSpacing((e.target as HTMLSelectElement).value)} class={`${inp} font-sans`}><option value="16">16″ OC</option><option value="24">24″ OC</option><option value="12">12″ OC</option></select></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Doors/windows</span><input type="number" step="1" value={openings} onInput={(e) => setOpenings((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {res ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="font-mono text-3xl font-extrabold text-brand-800">{res.studs}</p><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">studs (incl. openings)</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="font-mono text-3xl font-extrabold text-slate-800">{plateLen != null ? `${Math.ceil(plateLen * 2 * 10) / 10}` : '—'} {unit}</p><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">plate material (top + bottom)</p></div>
        </div>
      ) : <p class="mt-4 text-sm text-slate-500">Enter the wall length and stud spacing.</p>}

      <p class="mt-4 text-xs text-slate-500">Studs = ⌈wall length ÷ spacing⌉ + 1 (the +1 is the end stud), plus roughly two extra studs per door or window opening (king and jack). Plate material is the wall length doubled for the top and bottom plates. Standard spacing is 16″ on-center (24″ for some non-load-bearing walls). Add studs for corners and partition intersections. 🔒 In your browser.</p>
    </div>
  );
}
