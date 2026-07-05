import { useMemo, useState } from 'preact/hooks';
import { textStats } from '../../lib/text-compute';

/** Word/character counter with live stats and platform-limit checks. */
export default function CounterTool({ focus }: { focus: 'words' | 'chars' }) {
  const [text, setText] = useState('');
  const s = useMemo(() => textStats(text), [text]);

  const fmtTime = (min: number) => {
    if (min <= 0) return '0 sec';
    if (min < 1) return `${Math.max(1, Math.round(min * 60))} sec`;
    return `${Math.floor(min)} min ${Math.round((min % 1) * 60)} sec`;
  };

  const LIMITS: { label: string; limit: number }[] = [
    { label: 'X / Twitter post', limit: 280 },
    { label: 'SMS (single, GSM)', limit: 160 },
    { label: 'Google title (approx.)', limit: 60 },
    { label: 'Meta description (approx.)', limit: 158 },
    { label: 'Instagram caption', limit: 2200 },
    { label: 'YouTube title', limit: 100 },
  ];

  const primary =
    focus === 'words'
      ? [
          ['Words', s.words],
          ['Characters', s.chars],
          ['Sentences', s.sentences],
          ['Paragraphs', s.paragraphs],
        ]
      : [
          ['Characters', s.chars],
          ['Without spaces', s.charsNoSpaces],
          ['Words', s.words],
          ['Lines', s.lines],
        ];

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label for="ct-input" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        Your text
      </label>
      <textarea
        id="ct-input"
        rows={8}
        value={text}
        onInput={(e) => setText((e.target as HTMLTextAreaElement).value)}
        placeholder="Type or paste here — everything updates live and nothing leaves your browser…"
        class="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-base text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
      />

      <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {primary.map(([label, value], i) => (
          <div class={`rounded-lg p-3 text-center ${i === 0 ? 'border border-brand-200 bg-brand-50' : 'bg-white border border-slate-200'}`}>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
            <p class="mt-1 text-2xl font-bold text-slate-900">{value as number}</p>
          </div>
        ))}
      </div>

      <div class="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-600">
        <span>📖 Reading time: <strong class="text-slate-900">{fmtTime(s.readingMin)}</strong></span>
        <span>🗣️ Speaking time: <strong class="text-slate-900">{fmtTime(s.speakingMin)}</strong></span>
      </div>

      {focus === 'chars' && (
        <div class="mt-4 rounded-xl border border-slate-200 bg-white p-4">
          <p class="text-sm font-semibold text-slate-700">Platform limits</p>
          <ul class="mt-2 space-y-1.5">
            {LIMITS.map((l) => {
              const over = s.chars > l.limit;
              const pct = Math.min(100, (s.chars / l.limit) * 100);
              return (
                <li class="flex items-center gap-3 text-sm">
                  <span class="w-44 shrink-0 text-slate-600">{l.label}</span>
                  <span class="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <span class={`block h-full rounded-full ${over ? 'bg-red-500' : 'bg-mint-500'}`} style={`width:${pct}%`} />
                  </span>
                  <span class={`w-24 shrink-0 text-right font-medium ${over ? 'text-red-600' : 'text-slate-700'}`}>
                    {over ? `+${s.chars - l.limit} over` : `${l.limit - s.chars} left`}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
