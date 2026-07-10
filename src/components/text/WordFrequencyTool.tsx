import { useMemo, useState } from 'preact/hooks';

const ta = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const STOP = new Set('the a an and or but of to in on at for with is are was were be been being it its this that these those as by from i you he she we they his her their our your my me him them us do does did have has had will would can could should not no so if then than'.split(' '));

export default function WordFrequencyTool() {
  const [text, setText] = useState('The quick brown fox jumps over the lazy dog. The dog barks. The fox runs. A quick fox is a clever fox.');
  const [ci, setCi] = useState(true);
  const [minLen, setMinLen] = useState('1');
  const [noStop, setNoStop] = useState(false);
  const [copied, setCopied] = useState(false);

  const { rows, total } = useMemo(() => {
    let words = text.match(/[\p{L}\p{N}']+/gu) || [];
    if (ci) words = words.map((w) => w.toLowerCase());
    const min = Math.max(1, parseInt(minLen) || 1);
    const counts: Record<string, number> = {};
    let total = 0;
    for (const w of words) {
      if (w.length < min) continue;
      if (noStop && STOP.has(w.toLowerCase())) continue;
      counts[w] = (counts[w] || 0) + 1; total++;
    }
    const rows = Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    return { rows, total };
  }, [text, ci, minLen, noStop]);

  function copyCsv() {
    const csv = 'word,count,percent\n' + rows.map(([w, c]) => `${w},${c},${((c / total) * 100).toFixed(2)}`).join('\n');
    navigator.clipboard.writeText(csv).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1400); });
  }

  const max = rows[0]?.[1] || 1;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Paste your text</span>
        <textarea class={ta} rows={5} value={text} onInput={(e) => setText((e.target as HTMLTextAreaElement).value)} />
      </label>
      <div class="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-600">
        <label class="flex items-center gap-1.5"><input type="checkbox" checked={ci} onChange={(e) => setCi((e.target as HTMLInputElement).checked)} class="accent-brand-600" /> Case-insensitive</label>
        <label class="flex items-center gap-1.5"><input type="checkbox" checked={noStop} onChange={(e) => setNoStop((e.target as HTMLInputElement).checked)} class="accent-brand-600" /> Ignore common words</label>
        <label class="flex items-center gap-1.5">Min length <input type="number" min="1" value={minLen} onInput={(e) => setMinLen((e.target as HTMLInputElement).value)} class="w-14 rounded border border-slate-300 px-2 py-0.5" /></label>
        <button type="button" onClick={copyCsv} class="ml-auto rounded-lg bg-brand-700 px-3 py-1 text-xs font-medium text-white hover:bg-brand-800">{copied ? '✓ Copied' : 'Copy CSV'}</button>
      </div>

      <div class="mt-3 max-h-96 overflow-auto rounded-xl border border-slate-200 bg-white">
        <table class="w-full text-left text-sm">
          <thead class="sticky top-0 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500"><tr><th class="px-3 py-2">#</th><th class="px-3 py-2">Word</th><th class="px-3 py-2 text-right">Count</th><th class="px-3 py-2 text-right">%</th><th class="px-3 py-2 w-1/3">Frequency</th></tr></thead>
          <tbody class="divide-y divide-slate-100">
            {rows.slice(0, 300).map(([w, c], i) => (
              <tr class="hover:bg-slate-50">
                <td class="px-3 py-1.5 text-slate-400">{i + 1}</td>
                <td class="px-3 py-1.5 font-mono font-medium text-slate-800">{w}</td>
                <td class="px-3 py-1.5 text-right font-semibold">{c}</td>
                <td class="px-3 py-1.5 text-right text-slate-500">{((c / total) * 100).toFixed(1)}%</td>
                <td class="px-3 py-1.5"><div class="h-2 rounded-full bg-brand-500" style={`width:${(c / max) * 100}%`} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p class="mt-2 font-mono text-xs text-slate-400">{rows.length} unique words · {total} counted</p>
      <p class="mt-2 text-xs text-slate-500">Word frequency &amp; keyword density, exact and sortable — useful for SEO, writing analysis and NLP. 🔒 Your text never leaves the browser.</p>
    </div>
  );
}
