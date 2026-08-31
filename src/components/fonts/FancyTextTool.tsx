import { useState } from 'preact/hooks';
import { FONT_STYLES, styleText } from '../../lib/unicode-fonts';

interface Props {
  /** Restrict to these style ids (single-style pages). Omit to show all. */
  styles?: string[];
  placeholder?: string;
}

export default function FancyTextTool({ styles, placeholder }: Props) {
  const [text, setText] = useState('Type something ✨');
  const [copied, setCopied] = useState<string | null>(null);

  const list = styles && styles.length
    ? styles.map((id) => FONT_STYLES.find((s) => s.id === id)).filter((s): s is NonNullable<typeof s> => Boolean(s))
    : FONT_STYLES;

  async function copy(id: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(id);
      setTimeout(() => setCopied((c) => (c === id ? null : c)), 1400);
    } catch { /* clipboard blocked */ }
  }

  const single = list.length === 1;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Your text</span>
        <textarea
          value={text}
          rows={2}
          placeholder={placeholder ?? 'Type something…'}
          onInput={(e) => setText((e.target as HTMLTextAreaElement).value)}
          class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
      </label>

      <div class={`mt-4 grid gap-2 ${single ? '' : 'sm:grid-cols-2'}`}>
        {list.map((s) => {
          const out = styleText(text, s.id);
          return (
            <div class={`flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 ${single ? 'flex-col items-stretch sm:flex-row sm:items-center' : ''}`}>
              <div class="min-w-0 flex-1">
                {!single && <p class="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{s.name}</p>}
                <p class={`break-words leading-snug text-slate-900 ${single ? 'text-2xl' : 'text-lg'}`} dir="auto">{out || ' '}</p>
              </div>
              <button
                type="button"
                onClick={() => copy(s.id, out)}
                class={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold transition ${copied === s.id ? 'bg-mint-600 text-white' : 'bg-brand-600 text-white hover:bg-brand-700'}`}
              >
                {copied === s.id ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          );
        })}
      </div>

      <p class="mt-4 text-xs text-slate-500">
        These are <strong>Unicode characters</strong>, not a real font, so they paste into bios, usernames and messages that don't allow formatting.
        Heads-up: screen readers can't read them properly, so don't use them for anything that must stay accessible. 🔒 Runs in your browser.
      </p>
    </div>
  );
}
