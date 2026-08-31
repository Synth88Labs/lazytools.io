import { useState } from 'preact/hooks';

const round = (x: number) => Number(x.toFixed(4)).toString();
const num = (s: string): number | null => {
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : null;
};

const COMMON_PX = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 64];

export default function PxRemCalc() {
  const [base, setBase] = useState('16');
  const [px, setPx] = useState('24');
  const [rem, setRem] = useState('1.5');

  const b = num(base) || 16;

  function onPx(v: string) {
    setPx(v);
    const p = num(v);
    if (p !== null && b) setRem(round(p / b));
  }
  function onRem(v: string) {
    setRem(v);
    const r = num(v);
    if (r !== null && b) setPx(round(r * b));
  }
  function onBase(v: string) {
    setBase(v);
    const nb = num(v);
    const p = num(px);
    if (nb && p !== null) setRem(round(p / nb)); // keep px fixed, recompute rem
  }

  const field = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const label = 'mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="mb-4 block max-w-xs">
        <span class={label}>Root font size (1rem =)</span>
        <div class="flex items-center gap-2">
          <input type="number" min="1" step="any" value={base} onInput={(e) => onBase((e.target as HTMLInputElement).value)} class={field} />
          <span class="text-sm text-slate-500">px</span>
        </div>
        <span class="mt-1 block text-xs text-slate-500">Browser default is 16px. Change it only if your CSS sets a different root size.</span>
      </label>

      <div class="grid gap-4 sm:grid-cols-2">
        <label class="rounded-xl border border-slate-200 bg-white p-3">
          <span class={label}>Pixels</span>
          <div class="flex items-center gap-2">
            <input type="number" step="any" value={px} onInput={(e) => onPx((e.target as HTMLInputElement).value)} class={field} />
            <span class="text-sm text-slate-500">px</span>
          </div>
        </label>
        <label class="rounded-xl border border-slate-200 bg-white p-3">
          <span class={label}>rem / em</span>
          <div class="flex items-center gap-2">
            <input type="number" step="any" value={rem} onInput={(e) => onRem((e.target as HTMLInputElement).value)} class={field} />
            <span class="text-sm text-slate-500">rem</span>
          </div>
        </label>
      </div>

      <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
        <p class="text-lg font-bold text-slate-800">
          <span class="text-brand-800">{px || '—'}px</span> = <span class="text-brand-800">{rem || '—'}rem</span>
          <span class="ml-2 text-sm font-normal text-slate-500">(at {b}px root)</span>
        </p>
      </div>

      {/* Reference table */}
      <div class="mt-4 overflow-x-auto" tabIndex={0} aria-label="px to rem reference table">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th class="py-1.5 pr-4">px</th>
              <th class="py-1.5">rem (at {b}px)</th>
            </tr>
          </thead>
          <tbody class="font-mono">
            {COMMON_PX.map((p) => (
              <tr class="border-b border-slate-100">
                <td class="py-1.5 pr-4 text-slate-700">{p}px</td>
                <td class="py-1.5 text-slate-700">{round(p / b)}rem</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p class="mt-4 text-xs text-slate-500">
        <strong>rem</strong> is relative to the <em>root</em> font size; <strong>em</strong> is relative to the element's own font size, the maths is identical, only the reference differs. Using rem for type keeps layouts scalable when a user changes their browser's default size. 🔒
      </p>
    </div>
  );
}
