import { useState } from 'preact/hooks';

const DIALECTS = [
  { id: 'sql', label: 'Standard SQL' },
  { id: 'mysql', label: 'MySQL' },
  { id: 'postgresql', label: 'PostgreSQL' },
  { id: 'sqlite', label: 'SQLite' },
  { id: 'mariadb', label: 'MariaDB' },
  { id: 'tsql', label: 'SQL Server (T-SQL)' },
  { id: 'bigquery', label: 'BigQuery' },
  { id: 'snowflake', label: 'Snowflake' },
  { id: 'spark', label: 'Spark SQL' },
];

const SAMPLE = "select u.id, u.name, count(o.id) as orders from users u left join orders o on o.user_id=u.id where u.active=1 and u.created_at > '2024-01-01' group by u.id, u.name having count(o.id) > 3 order by orders desc limit 10;";

export default function SqlFormatterTool() {
  const [input, setInput] = useState(SAMPLE);
  const [dialect, setDialect] = useState('sql');
  const [kwCase, setKwCase] = useState<'upper' | 'lower' | 'preserve'>('upper');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  async function run() {
    setError('');
    try {
      const { format } = await import('sql-formatter');
      setOutput(format(input, { language: dialect as any, keywordCase: kwCase, tabWidth: 2 }));
    } catch (e) {
      setError(`Could not format: ${(e as Error).message}`);
      setOutput('');
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch { /* clipboard blocked */ }
  }

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex flex-wrap items-end gap-3">
        <label class="text-sm font-medium text-slate-700"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Dialect</span>
          <select value={dialect} onChange={(e) => setDialect((e.target as HTMLSelectElement).value)} class="rounded-xl border border-slate-300 bg-white px-2 py-2 text-sm">{DIALECTS.map((d) => <option value={d.id}>{d.label}</option>)}</select></label>
        <label class="text-sm font-medium text-slate-700"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Keywords</span>
          <select value={kwCase} onChange={(e) => setKwCase((e.target as HTMLSelectElement).value as any)} class="rounded-xl border border-slate-300 bg-white px-2 py-2 text-sm"><option value="upper">UPPERCASE</option><option value="lower">lowercase</option><option value="preserve">Preserve</option></select></label>
        <button type="button" onClick={run} class="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">Format SQL</button>
      </div>

      <div class="grid gap-3 lg:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Your SQL</span>
          <textarea value={input} rows={12} spellcheck={false} onInput={(e) => setInput((e.target as HTMLTextAreaElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Formatted</span>
          <textarea readonly value={output} rows={12} placeholder="Click Format SQL →" class={`${inp} bg-slate-50`} /></label>
      </div>

      {error && <p class="mt-3 text-sm font-medium text-red-700">✗ {error}</p>}

      <div class="mt-3 flex justify-end">
        <button type="button" onClick={copy} disabled={!output} class={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${!output ? 'bg-slate-400' : copied ? 'bg-mint-600' : 'bg-brand-600 hover:bg-brand-700'}`}>{copied ? '✓ Copied' : 'Copy formatted'}</button>
      </div>

      <p class="mt-4 text-xs text-slate-500">
        Beautifies (pretty-prints) SQL with consistent indentation, line breaks and keyword casing, for the dialect you choose. Great for cleaning up generated or minified queries and making them readable in code review. Your SQL — which can reveal schema and data — is formatted entirely in your browser and never uploaded. 🔒
      </p>
    </div>
  );
}
