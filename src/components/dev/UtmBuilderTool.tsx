import { useMemo, useState } from 'preact/hooks';

interface Param { id: string; label: string; hint: string; placeholder: string; required?: boolean }

const PARAMS: Param[] = [
  { id: 'utm_source', label: 'Campaign Source', hint: 'utm_source, where the traffic comes from', placeholder: 'newsletter', required: true },
  { id: 'utm_medium', label: 'Campaign Medium', hint: 'utm_medium, the marketing channel', placeholder: 'email', required: true },
  { id: 'utm_campaign', label: 'Campaign Name', hint: 'utm_campaign, the specific campaign', placeholder: 'summer_sale', required: true },
  { id: 'utm_term', label: 'Campaign Term', hint: 'utm_term, paid-search keyword (optional)', placeholder: 'running+shoes' },
  { id: 'utm_content', label: 'Campaign Content', hint: 'utm_content, differentiate ads/links (optional)', placeholder: 'logolink' },
];

export default function UtmBuilderTool() {
  const [base, setBase] = useState('https://example.com/landing');
  const [vals, setVals] = useState<Record<string, string>>({
    utm_source: 'newsletter', utm_medium: 'email', utm_campaign: 'summer_sale', utm_term: '', utm_content: '',
  });
  const [lower, setLower] = useState(true);
  const [copied, setCopied] = useState(false);

  const set = (id: string, v: string) => setVals((p) => ({ ...p, [id]: v }));

  const { url, error, missing } = useMemo(() => {
    const raw = base.trim();
    if (!raw) return { url: '', error: '', missing: [] as string[] };
    let u: URL;
    try {
      u = new URL(raw);
    } catch {
      return { url: '', error: 'Enter a valid URL including http:// or https://', missing: [] as string[] };
    }
    const miss = PARAMS.filter((p) => p.required && !vals[p.id].trim()).map((p) => p.id);
    for (const p of PARAMS) {
      let v = vals[p.id].trim();
      if (!v) { u.searchParams.delete(p.id); continue; }
      if (lower) v = v.toLowerCase();
      u.searchParams.set(p.id, v);
    }
    return { url: u.toString(), error: '', missing: miss };
  }, [base, vals, lower]);

  const copy = () => {
    if (!url) return;
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Website URL</span>
        <input class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" value={base} onInput={(e) => setBase((e.target as HTMLInputElement).value)} placeholder="https://example.com/page" />
      </label>

      <div class="mt-4 grid gap-3 sm:grid-cols-2">
        {PARAMS.map((p) => (
          <label class="block">
            <span class="mb-1 block text-xs font-semibold text-slate-600">
              {p.label}{p.required && <span class="ml-1 text-rose-500">*</span>}
            </span>
            <input class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" value={vals[p.id]} onInput={(e) => set(p.id, (e.target as HTMLInputElement).value)} placeholder={p.placeholder} />
            <span class="mt-0.5 block text-[11px] text-slate-400">{p.hint}</span>
          </label>
        ))}
      </div>

      <label class="mt-3 flex items-center gap-1.5 text-sm text-slate-600">
        <input type="checkbox" checked={lower} onChange={(e) => setLower((e.target as HTMLInputElement).checked)} /> Force lowercase (recommended, UTM values are case-sensitive in analytics)
      </label>

      {error && <p class="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">{error}</p>}

      {url && !error && (
        <div class="mt-4 rounded-xl bg-white p-4 ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Your campaign URL</p>
          <p class="mt-1 break-all font-mono text-sm text-brand-800">{url}</p>
          <div class="mt-3 flex items-center gap-3">
            <button onClick={copy} class="rounded-xl bg-brand-700 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-800">{copied ? '✓ Copied' : 'Copy URL'}</button>
            {missing.length > 0 && (
              <span class="text-xs text-amber-600">Tip: {missing.join(', ')} {missing.length === 1 ? 'is' : 'are'} usually required for good reporting.</span>
            )}
          </div>
        </div>
      )}

      <p class="mt-4 text-xs text-slate-500">
        UTM parameters are tags added to a link’s query string so analytics tools (GA4 and others) can attribute a visit to a specific source, channel and campaign. Values are automatically URL-encoded so spaces and symbols are safe. 🔒 Nothing is uploaded, the URL is assembled entirely in your browser.
      </p>
    </div>
  );
}
