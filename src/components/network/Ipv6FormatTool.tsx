import { useState } from 'preact/hooks';
import { parseIpv6, ipv6Expand, ipv6Compress } from '../../lib/net';

const tabCls = (active: boolean) =>
  `rounded-lg px-4 py-2 text-sm font-semibold transition ${active ? 'bg-brand-700 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:text-brand-700'}`;

export default function Ipv6FormatTool() {
  const [mode, setMode] = useState<'expand' | 'compress'>('compress');
  const [input, setInput] = useState('2001:0db8:0000:0000:0000:ff00:0042:8329\nfe80:0:0:0:0:0:0:1');

  const lines = input.split('\n').map((l) => l.trim()).filter(Boolean);
  const results = lines.map((line) => {
    const n = parseIpv6(line);
    if (n === null) return { line, out: null };
    return { line, out: mode === 'expand' ? ipv6Expand(n) : ipv6Compress(n) };
  });
  const valid = results.filter((r) => r.out !== null);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex gap-2">
        <button type="button" class={tabCls(mode === 'compress')} onClick={() => setMode('compress')}>Compress (RFC 5952)</button>
        <button type="button" class={tabCls(mode === 'expand')} onClick={() => setMode('expand')}>Expand (full form)</button>
      </div>

      <label class="mt-4 block">
        <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">IPv6 addresses — one per line</span>
        <textarea
          class="mt-1 h-32 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-800 focus:border-brand-500 focus:outline-none"
          value={input}
          onInput={(e) => setInput((e.target as HTMLTextAreaElement).value)}
          placeholder="2001:db8::1"
        />
      </label>

      {results.length > 0 && (
        <div class="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 text-slate-600">
              <tr>
                <th class="px-4 py-2 font-semibold">Input</th>
                <th class="px-4 py-2 font-semibold">{mode === 'expand' ? 'Expanded' : 'Canonical'}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-mono">
              {results.map((r) => (
                <tr>
                  <td class="break-all px-4 py-1.5 text-slate-500">{r.line}</td>
                  <td class={`break-all px-4 py-1.5 ${r.out ? 'text-slate-800' : 'text-red-600'}`}>{r.out ?? '✗ not a valid IPv6 address'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {valid.length > 0 && (
        <button
          type="button"
          class="mt-3 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-brand-400"
          onClick={() => navigator.clipboard.writeText(valid.map((r) => r.out).join('\n'))}
        >
          📋 Copy {valid.length > 1 ? `all ${valid.length} results` : 'result'}
        </button>
      )}

      <p class="mt-4 text-xs text-slate-500">Parsing and normalization run locally — paste internal addresses without worry.</p>
    </div>
  );
}
