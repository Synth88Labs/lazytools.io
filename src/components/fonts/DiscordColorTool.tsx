import { useState } from 'preact/hooks';

// Discord's ANSI code block renders the Solarized-ish palette below.
const FG = [
  { code: 30, name: 'Gray', hex: '#4f545c' },
  { code: 31, name: 'Red', hex: '#dc322f' },
  { code: 32, name: 'Green', hex: '#859900' },
  { code: 33, name: 'Yellow', hex: '#b58900' },
  { code: 34, name: 'Blue', hex: '#268bd2' },
  { code: 35, name: 'Pink', hex: '#d33682' },
  { code: 36, name: 'Cyan', hex: '#2aa198' },
  { code: 37, name: 'White', hex: '#ffffff' },
];
const BG = [
  { code: 0, name: 'None', hex: 'transparent' },
  { code: 40, name: 'Dark', hex: '#002b36' },
  { code: 41, name: 'Orange', hex: '#cb4b16' },
  { code: 42, name: 'Slate', hex: '#586e75' },
  { code: 43, name: 'Gray', hex: '#657b83' },
  { code: 44, name: 'Silver', hex: '#839496' },
  { code: 45, name: 'Indigo', hex: '#6c71c4' },
  { code: 46, name: 'Steel', hex: '#93a1a1' },
  { code: 47, name: 'Cream', hex: '#fdf6e3' },
];
const ESC = '\u001b';

export default function DiscordColorTool() {
  const [text, setText] = useState('Hello Discord');
  const [fg, setFg] = useState(32);
  const [bg, setBg] = useState(0);
  const [bold, setBold] = useState(true);
  const [underline, setUnderline] = useState(false);
  const [copied, setCopied] = useState(false);

  const styleCodes = [bold ? '1' : '', underline ? '4' : '', String(fg), bg ? String(bg) : '']
    .filter(Boolean)
    .join(';');
  const output = '```ansi\n' + `${ESC}[${styleCodes}m${text || ' '}${ESC}[0m` + '\n```';

  const fgHex = FG.find((c) => c.code === fg)?.hex ?? '#fff';
  const bgHex = BG.find((c) => c.code === bg)?.hex ?? 'transparent';

  async function copy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch { /* clipboard blocked */ }
  }

  const swatch = (
    list: { code: number; name: string; hex: string }[],
    active: number,
    set: (c: number) => void,
    label: string,
  ) => (
    <div>
      <span class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <div class="flex flex-wrap gap-1.5">
        {list.map((c) => (
          <button
            type="button"
            onClick={() => set(c.code)}
            title={c.name}
            class={`h-8 w-8 rounded-md border-2 transition ${active === c.code ? 'border-brand-500 ring-2 ring-brand-200' : 'border-slate-300 hover:border-slate-400'} ${c.hex === 'transparent' ? 'bg-white' : ''}`}
            style={c.hex === 'transparent' ? 'background-image:linear-gradient(45deg,#e2e8f0 25%,transparent 25%,transparent 75%,#e2e8f0 75%);background-size:8px 8px' : `background:${c.hex}`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Your text</span>
        <input
          value={text}
          onInput={(e) => setText((e.target as HTMLInputElement).value)}
          class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
      </label>

      <div class="mt-4 grid gap-4 sm:grid-cols-2">
        {swatch(FG, fg, setFg, 'Text colour')}
        {swatch(BG, bg, setBg, 'Background')}
      </div>

      <div class="mt-4 flex gap-4">
        <label class="flex items-center gap-1.5 text-sm font-medium text-slate-700">
          <input type="checkbox" checked={bold} onChange={(e) => setBold((e.target as HTMLInputElement).checked)} class="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-200" />
          Bold
        </label>
        <label class="flex items-center gap-1.5 text-sm font-medium text-slate-700">
          <input type="checkbox" checked={underline} onChange={(e) => setUnderline((e.target as HTMLInputElement).checked)} class="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-200" />
          Underline
        </label>
      </div>

      <div class="mt-4">
        <span class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Preview (how Discord shows it)</span>
        <div class="rounded-xl bg-[#2b2d31] p-4">
          <span
            class="font-mono text-base"
            style={`color:${fgHex};${bg ? `background:${bgHex};padding:0 2px;` : ''}${bold ? 'font-weight:700;' : ''}${underline ? 'text-decoration:underline;' : ''}`}
          >
            {text || ' '}
          </span>
        </div>
      </div>

      <div class="mt-4">
        <span class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Paste this into Discord</span>
        <pre class="overflow-x-auto rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700"><code>{output.replace(/\u001b/g, '\\u001b')}</code></pre>
      </div>

      <div class="mt-3 flex justify-end">
        <button
          type="button"
          onClick={copy}
          class={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${copied ? 'bg-mint-600' : 'bg-brand-600 hover:bg-brand-700'}`}
        >
          {copied ? '✓ Copied' : 'Copy code block'}
        </button>
      </div>

      <p class="mt-4 text-xs text-slate-500">
        Discord colour needs an <strong>ANSI code block</strong>, which only renders on desktop and the web app (mobile shows plain text). The copied block already includes the escape characters — just paste and send. 🔒 Runs in your browser.
      </p>
    </div>
  );
}
