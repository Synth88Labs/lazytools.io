import { useEffect, useRef, useState } from 'preact/hooks';
import { MODEL_PRICES, PRICES_VERIFIED, PRICE_SOURCES, estimateTokens, type TokenizerKind } from '../../data/dev/llm-pricing';

const SAMPLE = 'Paste or type your prompt here. Token counts update live — OpenAI counts are exact (the real o200k tokenizer runs in your browser); Claude and Gemini counts are clearly-labelled estimates, because those tokenizers are not public.';

const CONTEXT_SIZES = [
  { label: '128k tokens', value: 128000 },
  { label: '200k tokens', value: 200000 },
  { label: '400k tokens', value: 400000 },
  { label: '1M tokens', value: 1000000 },
];

const KIND_LABEL: Record<TokenizerKind, { badge: string; cls: string; desc: string }> = {
  o200k: { badge: 'EXACT', cls: 'bg-emerald-100 text-emerald-800', desc: 'real o200k_base tokenizer, in-browser' },
  'claude-new': { badge: 'ESTIMATE', cls: 'bg-amber-100 text-amber-800', desc: '≈ chars ÷ 4 × 1.3 (Anthropic: newer tokenizer ≈30% more tokens)' },
  claude: { badge: 'ESTIMATE', cls: 'bg-amber-100 text-amber-800', desc: '≈ chars ÷ 4 (Anthropic heuristic)' },
  'gemini-est': { badge: 'ESTIMATE', cls: 'bg-amber-100 text-amber-800', desc: '≈ chars ÷ 4 heuristic' },
};

export default function LlmTokenCounterTool() {
  const [text, setText] = useState(SAMPLE);
  const [o200k, setO200k] = useState<number | null>(null);
  const [outTokens, setOutTokens] = useState(500);
  const [perDay, setPerDay] = useState(100);
  const [context, setContext] = useState(200000);
  const encoderRef = useRef<((t: string) => number[]) | null>(null);

  // lazy-load the tokenizer once, then count on every change
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!encoderRef.current) {
        const m = await import('gpt-tokenizer/encoding/o200k_base');
        if (!alive) return;
        encoderRef.current = m.encode;
      }
      setO200k(encoderRef.current!(text).length);
    })();
    return () => { alive = false; };
  }, [text]);

  const chars = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const exact = o200k ?? 0;

  const counts = MODEL_PRICES.map((m) => ({ ...m, tokens: estimateTokens(chars, m.tokenizer, exact) }));
  const fitPct = Math.min(100, (exact / context) * 100);

  const money = (v: number) => (v < 0.01 ? `$${v.toFixed(5)}` : v < 1 ? `$${v.toFixed(4)}` : `$${v.toFixed(2)}`);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Your text / prompt — never uploaded</span>
        <textarea
          class="mt-1 h-40 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-brand-500 focus:outline-none"
          value={text}
          onInput={(e) => setText((e.target as HTMLTextAreaElement).value)}
          placeholder="Paste your prompt, document or transcript…"
        />
      </label>

      <div class="mt-3 flex flex-wrap gap-3">
        <div class="rounded-lg bg-white px-4 py-2 text-center ring-1 ring-slate-200">
          <p class="text-2xl font-extrabold text-brand-700">{o200k === null ? '…' : exact.toLocaleString('en-US')}</p>
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">tokens (o200k, exact)</p>
        </div>
        <div class="rounded-lg bg-white px-4 py-2 text-center ring-1 ring-slate-200">
          <p class="text-2xl font-extrabold text-slate-800">{words.toLocaleString('en-US')}</p>
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">words</p>
        </div>
        <div class="rounded-lg bg-white px-4 py-2 text-center ring-1 ring-slate-200">
          <p class="text-2xl font-extrabold text-slate-800">{chars.toLocaleString('en-US')}</p>
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">characters</p>
        </div>
        <div class="rounded-lg bg-white px-4 py-2 text-center ring-1 ring-slate-200">
          <p class="text-2xl font-extrabold text-slate-800">{exact ? (chars / exact).toFixed(2) : '—'}</p>
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">chars / token</p>
        </div>
      </div>

      {/* context fit */}
      <div class="mt-5 rounded-xl border border-slate-200 bg-white p-4">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <p class="text-sm font-bold text-slate-900">Context-window fit</p>
          <select class="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm" value={context} onChange={(e) => setContext(parseInt((e.target as HTMLSelectElement).value, 10))}>
            {CONTEXT_SIZES.map((c) => (
              <option value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div class="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
          <div class={`h-full rounded-full ${fitPct > 90 ? 'bg-red-500' : fitPct > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={`width:${Math.max(fitPct, exact > 0 ? 1 : 0)}%`} />
        </div>
        <p class="mt-1.5 text-xs text-slate-500">
          {exact.toLocaleString('en-US')} of {context.toLocaleString('en-US')} tokens ({fitPct < 0.1 && exact > 0 ? '<0.1' : fitPct.toFixed(1)}%) — using the exact o200k count; leave headroom for the system prompt and the reply.
        </p>
      </div>

      {/* per-model counts + cost */}
      <div class="mt-5 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th class="px-4 py-2">Model</th>
              <th class="px-4 py-2">Input tokens</th>
              <th class="px-4 py-2 text-right">$ / MTok in · out</th>
              <th class="px-4 py-2 text-right">Cost / request</th>
              <th class="px-4 py-2 text-right">Cost / month</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            {counts.map((m) => {
              const perReq = (m.tokens / 1e6) * m.input + (outTokens / 1e6) * m.output;
              const kind = KIND_LABEL[m.tokenizer];
              return (
                <tr>
                  <td class="px-4 py-2">
                    <span class="font-semibold text-slate-900">{m.name}</span>
                    {m.note && <span class="ml-1 text-xs text-slate-400" title={m.note}>†</span>}
                  </td>
                  <td class="px-4 py-2">
                    <span class="font-mono text-slate-800">{m.tokens.toLocaleString('en-US')}</span>
                    <span class={`ml-2 rounded px-1.5 py-0.5 text-[10px] font-bold ${kind.cls}`} title={kind.desc}>{kind.badge}</span>
                  </td>
                  <td class="px-4 py-2 text-right font-mono text-slate-600">${m.input} · ${m.output}</td>
                  <td class="px-4 py-2 text-right font-mono font-semibold text-slate-900">{money(perReq)}</td>
                  <td class="px-4 py-2 text-right font-mono text-slate-700">{money(perReq * perDay * 30)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div class="mt-3 flex flex-wrap items-end gap-4">
        <label class="block">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Expected output tokens / request</span>
          <input type="number" min={0} class="mt-1 w-40 rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-mono text-sm" value={outTokens} onInput={(e) => setOutTokens(Math.max(0, parseInt((e.target as HTMLInputElement).value, 10) || 0))} />
        </label>
        <label class="block">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Requests / day (for monthly)</span>
          <input type="number" min={0} class="mt-1 w-40 rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-mono text-sm" value={perDay} onInput={(e) => setPerDay(Math.max(0, parseInt((e.target as HTMLInputElement).value, 10) || 0))} />
        </label>
      </div>

      <div class="mt-4 rounded-lg bg-white px-3 py-2 text-xs text-slate-500 ring-1 ring-slate-200">
        <p>
          <strong class="text-slate-700">Prices last verified: {PRICES_VERIFIED}</strong> against{' '}
          {PRICE_SOURCES.map((s, i) => (
            <>
              <a href={s.url} rel="noopener" target="_blank" class="text-brand-700 underline decoration-slate-300 underline-offset-2">{s.name}</a>
              {i < PRICE_SOURCES.length - 1 ? ' · ' : ''}
            </>
          ))}
          . † Claude Sonnet 5 is introductory pricing — $3/$15 per MTok from 1 September 2026. Standard API rates; caching/batch discounts not included.
        </p>
        <p class="mt-1">
          <strong class="text-emerald-700">EXACT</strong> = the real OpenAI o200k_base tokenizer running in your browser.{' '}
          <strong class="text-amber-700">ESTIMATE</strong> = Anthropic and Google don't publish browser-runnable tokenizers; counts use the ~4-chars-per-token heuristic (×1.3 for Anthropic's newer-tokenizer models, per their docs). Your text never leaves this page.
        </p>
      </div>
    </div>
  );
}
