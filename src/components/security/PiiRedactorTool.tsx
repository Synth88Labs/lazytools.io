import { useMemo, useState } from 'preact/hooks';
import { redactPii, detectPii, ALL_TYPES, PII_LABELS, defaultEnabled, type PiiType, type MaskStyle } from '../../lib/pii-redact';

const SAMPLE = `Hi, this is Jane Doe. You can reach me at jane.doe@example.com or on (555) 123-4567.
My SSN is 123-45-6789 and my card is 4111 1111 1111 1111.
The server at 192.168.1.42 keeps timing out.`;

export default function PiiRedactorTool() {
  const [text, setText] = useState(SAMPLE);
  const [enabled, setEnabled] = useState<Record<PiiType, boolean>>(defaultEnabled());
  const [style, setStyle] = useState<MaskStyle>('label');
  const [copied, setCopied] = useState(false);

  const r = useMemo(() => redactPii(text, enabled, style), [text, enabled, style]);
  const total = r.matches.length;

  // Build a highlighted preview of the ORIGINAL text with found PII wrapped.
  const highlighted = useMemo(() => {
    const matches = detectPii(text, enabled);
    const parts: { s: string; hit?: PiiType }[] = [];
    let cur = 0;
    for (const m of matches) { parts.push({ s: text.slice(cur, m.start) }); parts.push({ s: m.value, hit: m.type }); cur = m.end; }
    parts.push({ s: text.slice(cur) });
    return parts;
  }, [text, enabled]);

  const copy = () => { navigator.clipboard?.writeText(r.text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }); };

  const ta = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Paste text to scan</span>
        <textarea rows={6} value={text} onInput={(e) => setText((e.target as HTMLTextAreaElement).value)} class={ta} /></label>

      <div class="mt-3 flex flex-wrap items-center gap-2">
        {ALL_TYPES.map((t) => (
          <button onClick={() => setEnabled((s) => ({ ...s, [t]: !s[t] }))} class={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 transition ${enabled[t] ? 'bg-brand-600 text-white ring-brand-600' : 'bg-white text-slate-500 ring-slate-300'}`}>{PII_LABELS[t]}{r.counts[t] ? ` · ${r.counts[t]}` : ''}</button>
        ))}
        <span class="mx-1 h-4 w-px bg-slate-300" />
        <select value={style} onChange={(e) => setStyle((e.target as HTMLSelectElement).value as MaskStyle)} class="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700">
          <option value="label">Labels [EMAIL]</option>
          <option value="block">Blocks ████</option>
          <option value="partial">Partial ••••1234</option>
        </select>
      </div>

      <div class={`mt-3 rounded-xl p-3 text-sm ring-1 ${total ? 'bg-amber-50 ring-amber-200 text-amber-800' : 'bg-emerald-50 ring-emerald-200 text-emerald-800'}`}>
        {total ? <><strong>{total}</strong> piece{total === 1 ? '' : 's'} of personal data found and masked.</> : <>No personal data detected with the selected types.</>}
      </div>

      {total > 0 && (
        <div class="mt-3 rounded-xl bg-white p-3 ring-1 ring-slate-200">
          <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">What was found (in your original text)</p>
          <p class="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-slate-700">
            {highlighted.map((p) => p.hit ? <mark class="rounded bg-amber-200 px-0.5 text-amber-900" title={PII_LABELS[p.hit]}>{p.s}</mark> : <span>{p.s}</span>)}
          </p>
        </div>
      )}

      <div class="mt-3 rounded-xl bg-white p-3 ring-2 ring-brand-200">
        <div class="mb-1 flex items-center justify-between">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Redacted output</p>
          <button onClick={copy} class="rounded-lg bg-brand-600 px-3 py-1 text-xs font-semibold text-white hover:bg-brand-700">{copied ? 'Copied ✓' : 'Copy'}</button>
        </div>
        <p class="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-slate-800">{r.text}</p>
      </div>

      <p class="mt-4 text-xs text-slate-500">Detects and masks emails, phone numbers, US SSNs, credit-card numbers (checked with the Luhn algorithm to avoid false positives), IPv4/IPv6 addresses and IBANs — so you can strip personal data before pasting text into a chatbot, ticket or forum. Everything runs in your browser; the text is never uploaded. Detection is pattern-based and best-effort — always review the output, as it can miss names, addresses or unusual formats. 🔒 In your browser.</p>
    </div>
  );
}
