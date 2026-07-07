import { useState } from 'preact/hooks';
import { parseKsef, checkKsef, type KsefCheck } from '../../lib/ksef';

const ICON = { pass: '✅', warn: '⚠️', fail: '❌' } as const;
const CLS = {
  pass: 'border-emerald-200 bg-emerald-50',
  warn: 'border-amber-200 bg-amber-50',
  fail: 'border-red-200 bg-red-50',
} as const;

export default function KsefValidatorTool() {
  const [fileName, setFileName] = useState('');
  const [checks, setChecks] = useState<KsefCheck[] | null>(null);
  const [error, setError] = useState('');

  async function onFile(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    setFileName(f.name);
    setError('');
    setChecks(null);
    try {
      const dom = new DOMParser().parseFromString(await f.text(), 'application/xml');
      if (dom.querySelector('parsererror')) {
        setChecks([{ level: 'fail', name: 'Well-formed XML', detail: 'the file is not valid XML — it will be rejected before any content check' }]);
        return;
      }
      const root = dom.documentElement;
      setChecks([{ level: 'pass', name: 'Well-formed XML', detail: 'parses cleanly' }, ...checkKsef(root, parseKsef(root))]);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  const fails = checks?.filter((c) => c.level === 'fail').length ?? 0;
  const warns = checks?.filter((c) => c.level === 'warn').length ?? 0;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 text-center transition hover:border-brand-400">
        <input type="file" accept=".xml,application/xml,text/xml" onChange={onFile} class="sr-only" />
        <span class="text-sm font-semibold text-brand-700">{fileName || 'Choose a KSeF invoice (.xml) to pre-check'}</span>
        <span class="mt-1 block text-xs text-slate-500">Structure, required fields and NIP checksums — checked on your device</span>
      </label>

      {error && <p class="mt-3 text-sm font-medium text-red-700">✗ {error}</p>}

      {checks && (
        <div class="mt-4" aria-live="polite">
          <p class={`rounded-xl border px-4 py-3 text-sm font-semibold ${fails ? 'border-red-200 bg-red-50 text-red-900' : warns ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-emerald-200 bg-emerald-50 text-emerald-900'}`}>
            {fails ? `${fails} problem${fails > 1 ? 's' : ''} found` : warns ? 'No hard failures — with notes worth reviewing' : 'All pre-checks passed'}
            {' · '}{checks.length} checks run
          </p>
          <ul class="mt-3 space-y-2">
            {checks.map((c) => (
              <li class={`rounded-lg border px-3 py-2 text-sm ${CLS[c.level]}`}>
                <span class="mr-1.5">{ICON[c.level]}</span>
                <strong class="text-slate-900">{c.name}:</strong> <span class="text-slate-700">{c.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p class="mt-4 rounded-lg bg-white px-3 py-2 text-xs text-slate-500 ring-1 ring-slate-200">
        <strong class="text-slate-700">This is an unofficial pre-check</strong> — it verifies structure, required fields and NIP check digits, not full XSD-schema or business-rule conformance. Legal validation happens only when KSeF itself accepts the invoice and assigns its KSeF number. Nothing you load here is uploaded anywhere.
      </p>
    </div>
  );
}
