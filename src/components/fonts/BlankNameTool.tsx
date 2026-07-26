import { useState } from 'preact/hooks';

interface Blank {
  id: string;
  name: string;
  cp: number;
  note: string;
}

// Characters that render as nothing (or empty width) yet are "real" text.
const BLANKS: Blank[] = [
  { id: 'hangul', name: 'Hangul filler', cp: 0x3164, note: 'Best all-round "blank" — accepted by most games and chat apps.' },
  { id: 'braille', name: 'Braille blank', cp: 0x2800, note: 'Empty braille cell — visible-width but invisible mark.' },
  { id: 'zwsp', name: 'Zero-width space', cp: 0x200b, note: 'No width at all; some apps collapse or strip it.' },
  { id: 'nbsp', name: 'No-break space', cp: 0x00a0, note: 'A space that most systems keep instead of trimming.' },
  { id: 'ensp', name: 'Em / en space', cp: 0x2003, note: 'A wider blank space that survives trimming in many fields.' },
];

export default function BlankNameTool() {
  const [count, setCount] = useState(1);
  const [choice, setChoice] = useState('hangul');
  const [copied, setCopied] = useState(false);

  const blank = BLANKS.find((b) => b.id === choice)!;
  const out = String.fromCodePoint(blank.cp).repeat(count);

  async function copy() {
    try {
      await navigator.clipboard.writeText(out);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch { /* clipboard blocked */ }
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <p class="text-sm text-slate-600">
        Copy an invisible character to use as a <strong>blank username, bio or message</strong> — in Free Fire, WhatsApp, Discord and more.
      </p>

      <fieldset class="mt-4">
        <legend class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Character type</legend>
        <div class="grid gap-2 sm:grid-cols-2">
          {BLANKS.map((b) => (
            <label class={`flex cursor-pointer items-start gap-2 rounded-xl border p-3 transition ${choice === b.id ? 'border-brand-400 bg-brand-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
              <input type="radio" name="blank" checked={choice === b.id} onChange={() => setChoice(b.id)} class="mt-0.5 h-4 w-4 text-brand-600 focus:ring-brand-200" />
              <span class="min-w-0">
                <span class="block text-sm font-semibold text-slate-800">{b.name} <span class="font-normal text-slate-400">U+{b.cp.toString(16).toUpperCase().padStart(4, '0')}</span></span>
                <span class="block text-xs text-slate-500">{b.note}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <label class="mt-4 flex items-center gap-3 text-sm font-medium text-slate-700">
        <span class="whitespace-nowrap">How many</span>
        <input type="range" min={1} max={30} value={count} onInput={(e) => setCount(Number((e.target as HTMLInputElement).value))} class="min-w-[120px] flex-1 accent-brand-600" />
        <span class="w-8 text-right tabular-nums text-slate-500">{count}</span>
      </label>

      <div class="mt-4 flex items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white p-4">
        <span class="flex-1 select-all font-mono text-sm text-slate-400">
          [{out.length} invisible character{out.length === 1 ? '' : 's'} — nothing shows here]
        </span>
        <button
          type="button"
          onClick={copy}
          class={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${copied ? 'bg-mint-600' : 'bg-brand-600 hover:bg-brand-700'}`}
        >
          {copied ? '✓ Copied' : 'Copy blank'}
        </button>
      </div>

      <p class="mt-4 text-xs text-slate-500">
        Some apps trim or reject blank names, and rules change often — if one character type is rejected, try another (Hangul filler works most widely). 🔒 Runs in your browser.
      </p>
    </div>
  );
}
