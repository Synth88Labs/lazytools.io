import { useMemo, useRef, useState } from 'preact/hooks';

const ta = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

/** Number of leading letters to bold, by word length. */
function boldLen(len: number): number {
  if (len <= 1) return 1;
  if (len <= 3) return 1;
  if (len <= 6) return 2;
  if (len <= 9) return 3;
  return Math.ceil(len * 0.4);
}

export default function BionicReadingTool() {
  const [text, setText] = useState('Fast-reading bold formatting adds emphasis to the first part of each word, giving your eyes a fixation point so you can read more quickly. Many people with ADHD or dyslexia find it helpful.');
  const [copied, setCopied] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const html = useMemo(() => {
    return text.split(/(\s+)/).map((tok) => {
      if (/^\s+$/.test(tok) || !tok) return tok.replace(/\n/g, '<br>');
      const m = tok.match(/^([^\p{L}\p{N}]*)([\p{L}\p{N}]+)(.*)$/u);
      if (!m) return tok;
      const [, pre, core, post] = m;
      const n = boldLen(core.length);
      return `${pre}<strong>${core.slice(0, n)}</strong>${core.slice(n)}${post}`;
    }).join('');
  }, [text]);

  function copyHtml() {
    const el = previewRef.current;
    if (!el) return;
    const type = 'text/html';
    const blob = new Blob([el.innerHTML], { type });
    const plain = new Blob([text], { type: 'text/plain' });
    if (navigator.clipboard && (window as any).ClipboardItem) {
      navigator.clipboard.write([new (window as any).ClipboardItem({ [type]: blob, 'text/plain': plain })])
        .then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); })
        .catch(() => {});
    } else {
      const range = document.createRange(); range.selectNodeContents(el);
      const sel = window.getSelection(); sel?.removeAllRanges(); sel?.addRange(range);
      document.execCommand('copy'); sel?.removeAllRanges();
      setCopied(true); setTimeout(() => setCopied(false), 1500);
    }
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Your text</span>
        <textarea class={ta} rows={5} value={text} onInput={(e) => setText((e.target as HTMLTextAreaElement).value)} />
      </label>

      <div class="mt-4">
        <div class="mb-1 flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Fast-reading preview</span>
          <button type="button" onClick={copyHtml} class="rounded-lg bg-brand-700 px-3 py-1 text-xs font-medium text-white hover:bg-brand-800">{copied ? '✓ Copied (rich text)' : 'Copy formatted'}</button>
        </div>
        <div ref={previewRef} class="rounded-xl border border-brand-200 bg-white px-4 py-3 text-lg leading-relaxed text-slate-800" style="font-weight:400" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
      <p class="mt-3 text-xs text-slate-500">Bolds the first part of each word to give your eyes a fixation point — a fast-reading aid many readers with ADHD or dyslexia find helpful. “Copy formatted” pastes the bold styling into rich-text editors. 🔒 Processed entirely in your browser. <span class="text-slate-400">(A generic implementation of the fixation-bolding idea; “Bionic Reading” is a trademark of its owner and is not affiliated.)</span></p>
    </div>
  );
}
