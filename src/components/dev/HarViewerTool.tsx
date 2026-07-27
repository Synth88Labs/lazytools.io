import { useMemo, useState } from 'preact/hooks';

interface Entry {
  method: string;
  url: string;
  status: number;
  size: number;
  time: number;
  secrets: string[];
}

const SECRET_HEADERS = ['authorization', 'cookie', 'set-cookie', 'x-api-key', 'x-auth-token', 'proxy-authorization'];

function parseHar(text: string): { entries: Entry[]; totalSize: number; totalTime: number } {
  const har = JSON.parse(text);
  const raw = har?.log?.entries;
  if (!Array.isArray(raw)) throw new Error('This does not look like a HAR file (no log.entries array).');
  let totalSize = 0, totalTime = 0;
  const entries: Entry[] = raw.map((e: any) => {
    const size = Math.max(0, e.response?.bodySize ?? 0) + Math.max(0, e.response?.headersSize ?? 0);
    const time = e.time ?? 0;
    totalSize += size;
    totalTime += time;
    const secrets: string[] = [];
    const reqHeaders = (e.request?.headers ?? []) as { name: string; value: string }[];
    const resHeaders = (e.response?.headers ?? []) as { name: string; value: string }[];
    for (const h of [...reqHeaders, ...resHeaders]) {
      if (SECRET_HEADERS.includes((h.name ?? '').toLowerCase())) secrets.push(h.name);
    }
    const qs = (e.request?.queryString ?? []) as { name: string }[];
    for (const q of qs) if (/token|secret|key|password|auth|session/i.test(q.name)) secrets.push(`?${q.name}`);
    return {
      method: e.request?.method ?? '?',
      url: e.request?.url ?? '',
      status: e.response?.status ?? 0,
      size,
      time,
      secrets: [...new Set(secrets)],
    };
  });
  return { entries, totalSize, totalTime };
}

const fmtSize = (b: number) => b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(2)} MB`;

export default function HarViewerTool() {
  const [data, setData] = useState<{ entries: Entry[]; totalSize: number; totalTime: number } | null>(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  async function onFile(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    setFileName(f.name);
    setError('');
    setData(null);
    try {
      setData(parseHar(await f.text()));
    } catch (err) {
      setError(`Could not read this HAR file: ${(err as Error).message}`);
    }
  }

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    return q ? data.entries.filter((e) => e.url.toLowerCase().includes(q)) : data.entries;
  }, [data, query]);

  const secretCount = data?.entries.filter((e) => e.secrets.length).length ?? 0;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 text-center transition hover:border-brand-400">
        <input type="file" accept=".har,application/json" onChange={onFile} class="sr-only" />
        <span class="text-sm font-semibold text-brand-700">{fileName || 'Choose a .har file to inspect'}</span>
        <span class="mt-1 block text-xs text-slate-500">Parsed on your device — HAR files often contain cookies and tokens, so they\'re never uploaded</span>
      </label>

      {error && <p class="mt-3 text-sm font-medium text-red-700">✗ {error}</p>}

      {data && (
        <div class="mt-4">
          <div class="mb-3 flex flex-wrap items-center gap-3">
            <span class="rounded-lg bg-white px-3 py-1.5 text-sm ring-1 ring-slate-200"><strong>{data.entries.length}</strong> requests</span>
            <span class="rounded-lg bg-white px-3 py-1.5 text-sm ring-1 ring-slate-200"><strong>{fmtSize(data.totalSize)}</strong> transferred</span>
            <span class="rounded-lg bg-white px-3 py-1.5 text-sm ring-1 ring-slate-200"><strong>{(data.totalTime / 1000).toFixed(2)} s</strong> total time</span>
            {secretCount > 0 && <span class="rounded-lg bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-800 ring-1 ring-amber-200">⚠ {secretCount} request{secretCount === 1 ? '' : 's'} carry credentials</span>}
          </div>
          <input type="search" value={query} placeholder="Filter by URL…" onInput={(e) => setQuery((e.target as HTMLInputElement).value)} class="mb-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none" />
          <div class="max-h-96 overflow-auto rounded-xl ring-1 ring-slate-200">
            <table class="w-full border-collapse text-left text-xs">
              <thead class="sticky top-0 bg-slate-100 text-slate-600"><tr><th class="px-2 py-1.5">Method</th><th class="px-2 py-1.5">Status</th><th class="px-2 py-1.5">URL</th><th class="px-2 py-1.5 text-right">Size</th><th class="px-2 py-1.5 text-right">Time</th></tr></thead>
              <tbody>
                {filtered.slice(0, 500).map((e) => (
                  <tr class="border-t border-slate-100 bg-white align-top">
                    <td class="px-2 py-1.5 font-mono font-semibold">{e.method}</td>
                    <td class={`px-2 py-1.5 font-mono ${e.status >= 400 ? 'text-red-600' : e.status >= 300 ? 'text-amber-600' : 'text-emerald-600'}`}>{e.status || '—'}</td>
                    <td class="max-w-md break-all px-2 py-1.5 text-slate-700">{e.url}{e.secrets.length > 0 && <span class="ml-1 rounded bg-amber-100 px-1 text-[10px] font-bold text-amber-800" title={e.secrets.join(', ')}>🔑 {e.secrets.join(', ')}</span>}</td>
                    <td class="px-2 py-1.5 text-right font-mono text-slate-600">{fmtSize(e.size)}</td>
                    <td class="px-2 py-1.5 text-right font-mono text-slate-600">{Math.round(e.time)} ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p class="mt-4 rounded-lg bg-white px-3 py-2 text-xs text-slate-500 ring-1 ring-slate-200">
        Inspect a browser network capture (.har) — request waterfall, sizes and timings — with a scan that flags requests carrying cookies, auth headers or token-like query parameters. HAR files routinely contain session cookies and API keys, so this parses everything locally and never uploads your file. 🔒
      </p>
    </div>
  );
}
