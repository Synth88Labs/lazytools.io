import { useEffect, useRef, useState } from 'preact/hooks';
import { textStats } from '../../lib/text-stats';

const KEY = 'lazytools:notepad';

export default function NotepadTool() {
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(true);
  const [big, setBig] = useState(false);
  const [ready, setReady] = useState(false);
  const saveTimer = useRef<number>(0);

  // Restore on mount.
  useEffect(() => {
    try { const v = localStorage.getItem(KEY); if (v !== null) setText(v); } catch { /* ignore */ }
    setReady(true);
  }, []);

  // Debounced autosave.
  useEffect(() => {
    if (!ready) return;
    setSaved(false);
    clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      try { localStorage.setItem(KEY, text); setSaved(true); } catch { /* quota/full */ }
    }, 400);
    return () => clearTimeout(saveTimer.current);
  }, [text, ready]);

  const s = textStats(text);

  const download = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'note.txt';
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const copyAll = () => navigator.clipboard?.writeText(text);
  const clear = () => { if (text === '' || confirm('Clear the note? This cannot be undone.')) setText(''); };

  const btn = 'rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-300';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-2 flex flex-wrap items-center gap-2">
        <span class={`rounded-lg px-2 py-1 text-xs font-semibold ${saved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
          {saved ? '✓ Saved in your browser' : 'Saving…'}
        </span>
        <span class="flex-1" />
        <button onClick={() => setBig((b) => !b)} class={btn}>{big ? 'A− Smaller' : 'A+ Larger'}</button>
        <button onClick={copyAll} class={btn}>Copy</button>
        <button onClick={download} class={btn}>⬇ Download .txt</button>
        <button onClick={clear} class="rounded-lg bg-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-200">Clear</button>
      </div>

      <textarea
        value={text}
        onInput={(e) => setText((e.target as HTMLTextAreaElement).value)}
        placeholder="Start typing… your note saves automatically in this browser, and never leaves your device."
        aria-label="Note"
        spellcheck
        class={`w-full resize-y rounded-xl border border-slate-300 bg-white p-4 text-slate-900 shadow-inner focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 ${big ? 'text-lg leading-relaxed' : 'text-sm'}`}
        style={`min-height:${big ? '60vh' : '380px'}`}
      />

      <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
        <span><b class="text-slate-700">{s.words.toLocaleString()}</b> words</span>
        <span><b class="text-slate-700">{s.chars.toLocaleString()}</b> characters</span>
        <span><b class="text-slate-700">{s.charsNoSpaces.toLocaleString()}</b> without spaces</span>
        <span><b class="text-slate-700">{s.lines.toLocaleString()}</b> lines</span>
        <span>~<b class="text-slate-700">{s.readingMinutes}</b> min read</span>
      </div>

      <p class="mt-4 text-xs text-slate-500">A distraction-free notepad that autosaves to your browser as you type — reopen this page and your note is still here. Nothing is ever uploaded, so it works offline and keeps private jottings private. Download it as a .txt or copy it out any time. Note: because it&#39;s stored only in this browser, clearing your browser data or using a different device/browser starts a fresh note. 🔒 100% on your device.</p>
    </div>
  );
}
