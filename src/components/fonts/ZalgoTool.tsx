import { useState } from 'preact/hooks';

// Combining diacritical marks, grouped by where they sit relative to the letter.
const UP = [
  0x0300, 0x0301, 0x0302, 0x0303, 0x0304, 0x0305, 0x0306, 0x0307, 0x0308, 0x0309,
  0x030a, 0x030b, 0x030c, 0x030d, 0x030e, 0x030f, 0x0310, 0x0311, 0x0312, 0x0313,
  0x0314, 0x033d, 0x0342, 0x0344, 0x0346, 0x034a, 0x034b, 0x034c, 0x0350, 0x0351,
  0x0352, 0x0357, 0x035b, 0x0363, 0x0364, 0x0365, 0x0366, 0x0367, 0x0368, 0x0369,
];
const MID = [
  0x0315, 0x031b, 0x0340, 0x0341, 0x0358, 0x0321, 0x0322, 0x0327, 0x0328, 0x0334,
  0x0335, 0x0336, 0x034f, 0x035c, 0x035d, 0x035e, 0x035f, 0x0360, 0x0362, 0x0338,
];
const DOWN = [
  0x0316, 0x0317, 0x0318, 0x0319, 0x031c, 0x031d, 0x031e, 0x031f, 0x0320, 0x0324,
  0x0325, 0x0326, 0x0329, 0x032a, 0x032b, 0x032c, 0x032d, 0x032e, 0x032f, 0x0330,
  0x0331, 0x0332, 0x0333, 0x0339, 0x033a, 0x033b, 0x033c, 0x0345, 0x0347, 0x0349,
];

function pick(arr: number[]): string {
  return String.fromCodePoint(arr[Math.floor(Math.random() * arr.length)]);
}

function zalgo(text: string, intensity: number, up: boolean, mid: boolean, down: boolean): string {
  let out = '';
  for (const ch of text) {
    if (ch === '\n' || ch === ' ') { out += ch; continue; }
    out += ch;
    if (up) for (let i = 0; i < Math.round(Math.random() * intensity); i++) out += pick(UP);
    if (mid) for (let i = 0; i < Math.round((Math.random() * intensity) / 3); i++) out += pick(MID);
    if (down) for (let i = 0; i < Math.round(Math.random() * intensity); i++) out += pick(DOWN);
  }
  return out;
}

export default function ZalgoTool() {
  const [text, setText] = useState('cursed text');
  const [intensity, setIntensity] = useState(6);
  const [up, setUp] = useState(true);
  const [mid, setMid] = useState(true);
  const [down, setDown] = useState(true);
  const [, setNonce] = useState(0);
  const [copied, setCopied] = useState(false);

  // Recomputed on every render; the Re-roll button bumps state to re-randomise.
  const out = zalgo(text, intensity, up, mid, down);

  async function copy() {
    try {
      await navigator.clipboard.writeText(out);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch { /* clipboard blocked */ }
  }

  const toggle = (label: string, on: boolean, set: (v: boolean) => void) => (
    <label class="flex items-center gap-1.5 text-sm font-medium text-slate-700">
      <input type="checkbox" checked={on} onChange={(e) => set((e.target as HTMLInputElement).checked)} class="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-200" />
      {label}
    </label>
  );

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

      <div class="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
        <label class="flex flex-1 items-center gap-3 text-sm font-medium text-slate-700">
          <span class="whitespace-nowrap">Madness</span>
          <input type="range" min={1} max={20} value={intensity} onInput={(e) => setIntensity(Number((e.target as HTMLInputElement).value))} class="min-w-[120px] flex-1 accent-brand-600" />
          <span class="w-6 text-right tabular-nums text-slate-500">{intensity}</span>
        </label>
        <div class="flex gap-4">
          {toggle('Up', up, setUp)}
          {toggle('Mid', mid, setMid)}
          {toggle('Down', down, setDown)}
        </div>
        <button type="button" onClick={() => setNonce((n) => n + 1)} class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-brand-400 hover:text-brand-700">
          ↻ Re-roll
        </button>
      </div>

      <div class="mt-4 rounded-xl border border-slate-200 bg-white p-4">
        <p class="min-h-[3rem] break-words text-2xl leading-loose text-slate-900" dir="auto">{out || ' '}</p>
      </div>

      <div class="mt-3 flex justify-end">
        <button
          type="button"
          onClick={copy}
          class={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${copied ? 'bg-mint-600' : 'bg-brand-600 hover:bg-brand-700'}`}
        >
          {copied ? '✓ Copied' : 'Copy glitched text'}
        </button>
      </div>

      <p class="mt-4 text-xs text-slate-500">
        Zalgo stacks Unicode <strong>combining marks</strong> on each letter. Some apps limit how many marks they render, so extreme settings may look tamer once pasted, and a few platforms strip the marks entirely. 🔒 Runs in your browser.
      </p>
    </div>
  );
}
