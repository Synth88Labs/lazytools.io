import { useMemo, useState } from 'preact/hooks';
import { parseColor, rgbToHex, contrastRatio, type RGB } from '../../lib/color-compute';

const SAMPLE = `#1d2433 Ink\n#5b6b7f Slate\n#1d87f1 Primary\n#12b76a Success\n#f79009 Warning\n#f04438 Danger\n#ffffff Surface`;

interface Entry { rgb: RGB; label: string; hex: string }

function parseList(raw: string): Entry[] {
  const out: Entry[] = [];
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t) continue;
    const m = t.match(/^(\S+)\s*(.*)$/);
    if (!m) continue;
    const rgb = parseColor(m[1]!);
    if (rgb) out.push({ rgb, label: m[2]?.trim() || m[1]!, hex: rgbToHex(rgb) });
  }
  return out;
}

function badge(ratio: number): { text: string; cls: string } {
  if (ratio >= 7) return { text: 'AAA', cls: 'bg-emerald-600' };
  if (ratio >= 4.5) return { text: 'AA', cls: 'bg-emerald-500' };
  if (ratio >= 3) return { text: 'AA18', cls: 'bg-amber-500' };
  return { text: '✗', cls: 'bg-slate-400' };
}

export default function ContrastGridTool() {
  const [raw, setRaw] = useState(SAMPLE);
  const items = useMemo(() => parseList(raw), [raw]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Palette — one color per line, optional label (e.g. “#1d87f1 Primary”)</span>
        <textarea
          class="h-40 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          value={raw} spellcheck={false}
          onInput={(e) => setRaw((e.target as HTMLTextAreaElement).value)}
        />
      </label>
      <p class="mt-1 text-xs text-slate-500">{items.length} color{items.length === 1 ? '' : 's'} · rows = text, columns = background · AA 4.5:1 · AA18 (large) 3:1 · AAA 7:1</p>

      {items.length >= 2 ? (
        <div class="mt-4 overflow-x-auto rounded-xl bg-white p-2 ring-1 ring-slate-200">
          <table class="border-separate" style="border-spacing:3px">
            <thead>
              <tr>
                <th class="p-1"></th>
                {items.map((bg) => (
                  <th class="p-1">
                    <div class="mx-auto h-6 w-14 rounded ring-1 ring-slate-300" style={`background:${bg.hex}`} title={`${bg.label} ${bg.hex}`} />
                    <span class="mt-0.5 block text-[10px] font-semibold text-slate-500">{bg.label}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((fg) => (
                <tr>
                  <th class="p-1 text-right">
                    <span class="text-[10px] font-semibold text-slate-500">{fg.label}</span>
                  </th>
                  {items.map((bg) => {
                    const ratio = contrastRatio(fg.rgb, bg.rgb);
                    const b = badge(ratio);
                    return (
                      <td class="p-0">
                        <div class="flex h-14 w-16 flex-col items-center justify-center rounded ring-1 ring-slate-200" style={`background:${bg.hex};color:${fg.hex}`}>
                          <span class="text-sm font-bold leading-none">Aa</span>
                          <span class="mt-1 font-mono text-[10px] leading-none">{ratio.toFixed(1)}</span>
                          <span class={`mt-0.5 rounded px-1 text-[9px] font-bold leading-tight text-white ${b.cls}`}>{b.text}</span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter at least two valid colors to build the grid.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">
        Exact WCAG 2 contrast ratios (sRGB relative luminance) for every text/background pair. 🔒 Computed in your browser.
      </p>
    </div>
  );
}
