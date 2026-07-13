import { useMemo, useState } from 'preact/hooks';
import { upsideDown } from '../../lib/text-compute';

export default function UpsideDownTool() {
  const [text, setText] = useState('Hello world');
  const [copied, setCopied] = useState(false);
  const out = useMemo(() => upsideDown(text), [text]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Your text</span>
        <textarea class="h-24 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" value={text} onInput={(e) => setText((e.target as HTMLTextAreaElement).value)} /></label>

      <div class="mt-4 rounded-xl bg-white p-4 ring-2 ring-brand-200">
        <div class="flex items-center justify-between"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Upside-down</p>
          <button onClick={() => { navigator.clipboard?.writeText(out); setCopied(true); setTimeout(() => setCopied(false), 1200); }} class="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-600 hover:border-brand-400">{copied ? 'Copied' : 'Copy'}</button></div>
        <p class="mt-2 break-words text-2xl text-slate-900" dir="ltr">{out || '…'}</p>
      </div>

      <p class="mt-4 text-xs text-slate-500">Flips your text upside down by swapping each letter for a Unicode character that looks like its 180°-rotated form and reversing the order, so it reads bottom-to-top. It\'s real Unicode text you can paste into social media bios, usernames and messages. A few characters have no good flipped equivalent and are left as-is. 🔒 In your browser.</p>
    </div>
  );
}
