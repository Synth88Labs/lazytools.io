import { useMemo, useState } from 'preact/hooks';
import { analyzeEmail, formatDelay, type EmailAnalysis } from '../../lib/email-headers';

const authColor = (r?: string) =>
  r === 'pass' ? 'bg-emerald-100 text-emerald-700'
    : r === 'fail' || r === 'softfail' ? 'bg-rose-100 text-rose-700'
      : r ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500';

export default function EmailHeaderTool() {
  const [text, setText] = useState('');

  const result = useMemo(() => {
    if (!text.trim()) return null;
    try { return { a: analyzeEmail(text), error: null as string | null }; }
    catch (e) { return { a: null, error: e instanceof Error ? e.message : 'Could not parse' }; }
  }, [text]);

  const a: EmailAnalysis | null = result?.a ?? null;
  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-xs text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const onFile = async (f: File | null) => { if (f) setText(await f.text()); };
  const idRow = (label: string, v?: string) => v ? (
    <div class="grid grid-cols-[6rem_1fr] gap-2 border-b border-slate-100 py-1.5 text-sm sm:grid-cols-[8rem_1fr]">
      <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <span class="break-all text-slate-800">{v}</span>
    </div>
  ) : null;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-2 flex items-center justify-between">
        <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Paste full email headers (or a .eml)</span>
        <label class="cursor-pointer rounded-lg bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-300">📂 .eml
          <input type="file" accept=".eml,.txt,message/rfc822,text/plain" class="hidden" onChange={(e) => onFile((e.target as HTMLInputElement).files?.[0] ?? null)} />
        </label>
      </div>
      <textarea rows={6} class={inp} aria-label="Email headers" value={text} onInput={(e) => setText((e.target as HTMLTextAreaElement).value)} placeholder={'Received: from …\nAuthentication-Results: …\nFrom: …\nSubject: …'} />

      {result?.error && <p class="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">⚠️ {result.error}</p>}

      {a && (
        <div class="mt-4 space-y-4">
          {(a.auth.spf || a.auth.dkim || a.auth.dmarc) && (
            <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Authentication (as recorded by the receiver)</p>
              <div class="flex flex-wrap gap-2">
                {(['spf', 'dkim', 'dmarc'] as const).map((k) => (
                  <span class={`rounded-lg px-2.5 py-1 text-sm font-semibold ${authColor(a.auth[k])}`}>{k.toUpperCase()}: {a.auth[k] ?? 'n/a'}</span>
                ))}
              </div>
            </div>
          )}

          {a.hops.length > 0 && (
            <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <div class="mb-2 flex items-center justify-between">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Delivery path ({a.hops.length} hop{a.hops.length === 1 ? '' : 's'})</p>
                {a.totalTransitSec !== null && <span class="text-xs text-slate-500">total {formatDelay(a.totalTransitSec)}</span>}
              </div>
              <ol class="space-y-2">
                {a.hops.map((h) => (
                  <li class="border-l-2 border-brand-200 pl-3">
                    <div class="flex flex-wrap items-baseline gap-x-2 text-sm">
                      <span class="font-mono text-xs font-bold text-brand-800">{h.index}</span>
                      <span class="text-slate-800">{h.from ?? '?'} → {h.by ?? '?'}</span>
                      {h.delaySec !== null && <span class={`rounded px-1.5 text-xs font-semibold ${h.delaySec > 60 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>+{formatDelay(h.delaySec)}</span>}
                    </div>
                    <p class="text-xs text-slate-400">{[h.with && `with ${h.with}`, h.dateText].filter(Boolean).join(' · ')}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
            {idRow('From', a.from)}{idRow('To', a.to)}{idRow('Subject', a.subject)}{idRow('Date', a.date)}
            {idRow('Return-Path', a.returnPath)}{idRow('Message-ID', a.messageId)}{idRow('Mailer', a.mailer)}
            {a.dkimSignatures.length > 0 && idRow('DKIM d=', a.dkimSignatures.map((d) => `${d.domain}${d.selector ? ` (s=${d.selector})` : ''}`).join(', '))}
          </div>
        </div>
      )}

      <p class="mt-4 text-xs text-slate-500">Paste an email&#39;s full headers (in most clients: "Show original" / "View source") to see the delivery path hop by hop with the delay at each server, and the SPF/DKIM/DMARC results the receiving server recorded. It parses the headers in your browser, nothing is uploaded. Note it reads the authentication results already written in the headers; it does not perform live DNS lookups, so it can&#39;t re-verify SPF/DKIM/DMARC itself. 🔒 100% client-side.</p>
    </div>
  );
}
