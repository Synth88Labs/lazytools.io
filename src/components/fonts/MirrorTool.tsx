import { useState } from 'preact/hooks';

// Horizontally-flipped look-alike glyphs. Letters with no clean mirror stay as-is.
const MIRROR: Record<string, string> = {
  a: 'ɒ', b: 'd', c: 'ɔ', d: 'b', e: 'ɘ', f: 'ʇ', g: 'ϱ', h: 'ʜ', j: 'ꞁ', k: 'ʞ',
  l: 'l', m: 'm', n: 'n', p: 'q', q: 'p', r: 'ɿ', s: 'ƨ', t: 'ƚ', u: 'u', v: 'v',
  w: 'w', y: 'γ', z: 'ƹ',
  A: 'A', B: 'ᙠ', C: 'Ɔ', D: 'ᗡ', E: 'Ǝ', F: 'ꟻ', G: '⅁', H: 'H', I: 'I', J: 'Ⴑ',
  K: 'ꓘ', L: '⅃', M: 'M', N: 'И', O: 'O', P: 'ꟼ', Q: 'Ϙ', R: 'Я', S: 'Ƨ', T: 'T',
  U: 'U', V: 'V', W: 'W', X: 'X', Y: 'Y', Z: 'Ƨ',
  '1': '1', '2': 'S', '3': 'Ɛ', '4': '߈', '5': 'Ƨ', '7': '٢',
  '(': ')', ')': '(', '[': ']', ']': '[', '{': '}', '}': '{', '<': '>', '>': '<',
  '?': '⸮', '&': '⅋',
};

function backwards(text: string): string {
  return text.split('\n').map((line) => [...line].reverse().join('')).join('\n');
}
function mirror(text: string): string {
  return text
    .split('\n')
    .map((line) => [...line].reverse().map((ch) => MIRROR[ch] ?? ch).join(''))
    .join('\n');
}

export default function MirrorTool() {
  const [text, setText] = useState('Reverse me');
  const [copied, setCopied] = useState<string | null>(null);

  const rows = [
    { id: 'mirror', name: 'Mirror (flipped letters)', out: mirror(text) },
    { id: 'backwards', name: 'Backwards (reversed order)', out: backwards(text) },
  ];

  async function copy(id: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(id);
      setTimeout(() => setCopied((c) => (c === id ? null : c)), 1400);
    } catch { /* clipboard blocked */ }
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Your text</span>
        <textarea
          value={text}
          rows={2}
          onInput={(e) => setText((e.target as HTMLTextAreaElement).value)}
          class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
      </label>

      <div class="mt-4 grid gap-2">
        {rows.map((r) => (
          <div class="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
            <div class="min-w-0 flex-1">
              <p class="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{r.name}</p>
              <p class="whitespace-pre-wrap break-words text-lg leading-snug text-slate-900" dir="ltr">{r.out || ' '}</p>
            </div>
            <button
              type="button"
              onClick={() => copy(r.id, r.out)}
              class={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold text-white transition ${copied === r.id ? 'bg-mint-600' : 'bg-brand-600 hover:bg-brand-700'}`}
            >
              {copied === r.id ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        ))}
      </div>

      <p class="mt-4 text-xs text-slate-500">
        <strong>Mirror</strong> reverses the order and swaps each letter for a horizontally-flipped look-alike, so it reads like writing seen in a mirror. <strong>Backwards</strong> only reverses the order. A few letters have no mirror twin and are left unchanged. 🔒 Runs in your browser.
      </p>
    </div>
  );
}
