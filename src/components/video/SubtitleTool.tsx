import { useState } from 'preact/hooks';
import { srtToVtt, vttToSrt, shiftSubtitles, isVtt } from '../../lib/subtitles';

interface Props {
  mode: 'srt-vtt' | 'vtt-srt' | 'shift';
}

const CONFIG = {
  'srt-vtt': {
    inputLabel: 'SRT subtitles',
    outExt: 'vtt',
  },
  'vtt-srt': {
    inputLabel: 'WebVTT subtitles',
    outExt: 'srt',
  },
  shift: {
    inputLabel: 'SRT or WebVTT subtitles',
    outExt: 'srt',
  },
} as const;

/** True when the text has at least one cue timing line. */
function hasCues(text: string): boolean {
  return text.includes('-->');
}

export default function SubtitleTool({ mode }: Props) {
  const [input, setInput] = useState('');
  const [base, setBase] = useState('');
  const [shiftSeconds, setShiftSeconds] = useState('0');
  const [copied, setCopied] = useState(false);

  const trimmed = input.trim();

  let output = '';
  if (trimmed) {
    if (mode === 'srt-vtt') {
      output = srtToVtt(input);
    } else if (mode === 'vtt-srt') {
      output = vttToSrt(input);
    } else {
      const deltaMs = Math.round((parseFloat(shiftSeconds) || 0) * 1000);
      output = shiftSubtitles(input, deltaMs);
    }
  }

  const outExt = mode === 'shift' ? (isVtt(input) ? 'vtt' : 'srt') : CONFIG[mode].outExt;
  const filename = `${base || 'subtitles'}.${outExt}`;

  // "No cues" state: there is input text, but no timing line survived parsing.
  const noCues = trimmed !== '' && !hasCues(output);

  async function handleFile(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const text = await file.text();
    setInput(text);
    const name = file.name.replace(/\.(srt|vtt|txt)$/i, '');
    if (name) setBase(name);
  }

  async function handleCopy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function handleDownload() {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="space-y-4">
        <div>
          <label class="mb-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-600 transition hover:border-brand-500 hover:bg-slate-50">
            <span class="font-medium text-slate-700">Choose a subtitle file</span>
            <span class="mt-1 text-xs text-slate-500">.srt or .vtt, or paste below</span>
            <input
              type="file"
              accept=".srt,.vtt,text/plain"
              class="hidden"
              onChange={handleFile}
            />
          </label>
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">
            {CONFIG[mode].inputLabel}
          </label>
          <textarea
            rows={10}
            value={input}
            aria-label="Subtitle input"
            onInput={(e) => setInput((e.target as HTMLTextAreaElement).value)}
            placeholder="Paste your subtitles here…"
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-xs"
          />
        </div>

        {mode === 'shift' && (
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">
              Shift by (seconds)
            </label>
            <input
              type="number"
              step={0.1}
              value={shiftSeconds}
              aria-label="Shift by seconds"
              onInput={(e) => setShiftSeconds((e.target as HTMLInputElement).value)}
              class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-xs sm:w-48"
            />
            <p class="mt-1 text-xs text-slate-500">
              Positive delays the subtitles, negative moves them earlier.
            </p>
          </div>
        )}

        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">Output</label>
          {noCues ? (
            <p class="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
              No subtitle cues found, check the format.
            </p>
          ) : (
            <textarea
              rows={10}
              readOnly
              value={output}
              aria-label="Converted subtitles output"
              placeholder="Converted subtitles will appear here…"
              class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-xs"
            />
          )}
        </div>

        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!output}
            class="rounded-xl bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={!output}
            class="rounded-xl bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Download {outExt.toUpperCase()}
          </button>
        </div>

        <p class="text-xs text-slate-500">
          Everything runs locally in your browser, your subtitles are never uploaded.
        </p>
      </div>
    </div>
  );
}
