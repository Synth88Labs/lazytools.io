import { useMemo, useState } from 'preact/hooks';
import { DEV } from '../../lib/dev-compute';
import type { DevToolOption } from '../../data/dev/index';

interface Props {
  computeId: string;
  options?: DevToolOption[];
  sample?: string;
}

/** Input→output transform widget for developer tools (mirrors TextTransformTool, dev compute map). */
export default function DevTransformTool({ computeId, options = [], sample = '' }: Props) {
  const [input, setInput] = useState(sample);
  const [opts, setOpts] = useState<Record<string, string | boolean>>(() =>
    Object.fromEntries(options.map((o) => [o.id, o.type === 'checkbox' ? o.defaultValue === 'true' : o.defaultValue ?? '']))
  );
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!input.trim()) return { output: '', info: '' };
    try {
      const fn = DEV[computeId];
      return fn ? fn(input, opts) : { output: input };
    } catch (e) {
      return { output: '', info: '', error: (e as Error).message };
    }
  }, [computeId, input, opts]) as { output: string; info?: string; error?: string };

  const set = (id: string, v: string | boolean) => setOpts((p) => ({ ...p, [id]: v }));

  async function copy() {
    try {
      await navigator.clipboard.writeText(result.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* unavailable */ }
  }

  const inputCls =
    'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      {options.length > 0 && (
        <div class="mb-4 grid gap-3 sm:grid-cols-2">
          {options.map((o) =>
            o.type === 'checkbox' ? (
              <label class="flex items-center gap-2 self-end pb-2 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={Boolean(opts[o.id])}
                  onChange={(e) => set(o.id, (e.target as HTMLInputElement).checked)}
                  class="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                {o.label}
              </label>
            ) : o.type === 'select' ? (
              <div>
                <label for={`dv-${o.id}`} class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{o.label}</label>
                <select id={`dv-${o.id}`} value={String(opts[o.id])} onChange={(e) => set(o.id, (e.target as HTMLSelectElement).value)} class={inputCls}>
                  {o.options?.map((x) => (
                    <option value={x.value}>{x.label}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label for={`dv-${o.id}`} class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{o.label}</label>
                <input
                  id={`dv-${o.id}`}
                  type="text"
                  value={String(opts[o.id])}
                  placeholder={o.placeholder}
                  onInput={(e) => set(o.id, (e.target as HTMLInputElement).value)}
                  class={`${inputCls} font-mono`}
                  spellcheck={false}
                />
              </div>
            )
          )}
        </div>
      )}

      <div class="grid gap-4 lg:grid-cols-2">
        <div>
          <label for="dv-input" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Input</label>
          <textarea
            id="dv-input"
            rows={8}
            value={input}
            onInput={(e) => setInput((e.target as HTMLTextAreaElement).value)}
            placeholder="Type or paste here — nothing is uploaded…"
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            spellcheck={false}
          />
        </div>
        <div>
          <div class="mb-1 flex items-center justify-between">
            <label for="dv-output" class="block text-xs font-semibold uppercase tracking-wide text-slate-500">Output</label>
            <button
              type="button"
              onClick={copy}
              disabled={!result.output}
              class="rounded-lg bg-brand-700 px-3 py-1 text-xs font-medium text-white transition hover:bg-brand-800 disabled:opacity-40"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            id="dv-output"
            rows={8}
            readOnly
            value={result.output}
            class="w-full rounded-xl border border-brand-200 bg-white px-3 py-3 font-mono text-sm text-slate-900"
            spellcheck={false}
          />
        </div>
      </div>

      {result.error ? (
        <p class="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">✗ {result.error}</p>
      ) : result.info ? (
        <p class="mt-2 text-sm font-medium text-mint-700">{result.info}</p>
      ) : null}
    </div>
  );
}
