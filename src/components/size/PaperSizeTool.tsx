import { useMemo, useState } from 'preact/hooks';
import { PAPER_SIZES, paperById, paperDims, type PaperSize } from '../../data/size/paper';

const GROUPS = ['ISO A', 'ISO B', 'ISO C / envelopes', 'North American', 'ANSI', 'Architectural'] as const;

export default function PaperSizeTool() {
  const [id, setId] = useState('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [dpi, setDpi] = useState('96');

  const size: PaperSize | null = useMemo(() => paperById(id), [id]);
  const d = useMemo(() => (size ? paperDims(size, orientation, parseInt(dpi, 10) || 96) : null), [size, orientation, dpi]);

  const inputCls =
    'w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-lg font-semibold text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  const rows: [string, string][] = d
    ? [
        ['Millimetres', `${d.mm[0]} × ${d.mm[1]} mm`],
        ['Centimetres', `${d.cm[0]} × ${d.cm[1]} cm`],
        ['Inches', `${d.in[0]} × ${d.in[1]} in`],
        ['Points (PostScript)', `${d.pt[0]} × ${d.pt[1]} pt`],
        [`Pixels @ ${dpi} DPI`, `${d.px[0]} × ${d.px[1]} px`],
      ]
    : [];

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-4 sm:grid-cols-3">
        <div>
          <label for="ps-size" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Paper size</label>
          <select id="ps-size" value={id} onChange={(e) => setId((e.target as HTMLSelectElement).value)} class={inputCls}>
            {GROUPS.map((g) => (
              <optgroup label={g}>
                {PAPER_SIZES.filter((p) => p.group === g).map((p) => (
                  <option value={p.id}>{p.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div>
          <label for="ps-orient" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Orientation</label>
          <select id="ps-orient" value={orientation} onChange={(e) => setOrientation((e.target as HTMLSelectElement).value as 'portrait' | 'landscape')} class={inputCls}>
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </div>
        <div>
          <label for="ps-dpi" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Pixel density (DPI)</label>
          <select id="ps-dpi" value={dpi} onChange={(e) => setDpi((e.target as HTMLSelectElement).value)} class={inputCls}>
            <option value="72">72 (screen / web)</option>
            <option value="96">96 (CSS pixel)</option>
            <option value="150">150 (draft print)</option>
            <option value="300">300 (print quality)</option>
            <option value="600">600 (fine print)</option>
          </select>
        </div>
      </div>

      {size && d && (
        <div class="mt-5 rounded-xl border border-brand-200 bg-white p-4">
          <div class="flex flex-wrap items-baseline justify-between gap-2">
            <p class="text-lg font-bold text-slate-900">{size.name} <span class="font-medium text-slate-500">· {orientation}</span></p>
            <p class="text-sm text-slate-500">{size.group}</p>
          </div>
          <dl class="mt-3 divide-y divide-slate-100">
            {rows.map(([k, v]) => (
              <div class="flex items-center justify-between py-2">
                <dt class="text-sm text-slate-600">{k}</dt>
                <dd class="font-mono text-base font-semibold text-slate-900">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <details class="mt-4 rounded-xl border border-slate-200 bg-white p-3">
        <summary class="cursor-pointer text-sm font-semibold text-slate-700">Full size chart (mm)</summary>
        <div class="mt-2 overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="text-xs uppercase tracking-wide text-slate-500">
                <th class="py-1.5 pr-3">Size</th><th class="py-1.5 pr-3">Group</th><th class="py-1.5">mm (portrait)</th>
              </tr>
            </thead>
            <tbody>
              {PAPER_SIZES.map((p) => (
                <tr class="border-t border-slate-100">
                  <td class="py-1.5 pr-3 font-semibold text-slate-800">{p.name}</td>
                  <td class="py-1.5 pr-3 text-slate-500">{p.group}</td>
                  <td class="py-1.5 font-mono text-slate-700">{p.w} × {p.h}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
