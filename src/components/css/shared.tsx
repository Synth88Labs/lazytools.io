import { useState } from 'preact/hooks';
import type { ComponentChildren } from 'preact';

export function Range({ label, value, min, max, step = 1, unit = '', onInput }: { label: string; value: number; min: number; max: number; step?: number; unit?: string; onInput: (v: number) => void }) {
  return (
    <label class="block">
      <span class="flex items-center justify-between text-sm font-medium text-slate-600">
        <span>{label}</span>
        <span class="font-mono text-slate-900">{value}{unit}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} class="mt-1 w-full accent-brand-600" onInput={(e) => onInput(parseFloat((e.target as HTMLInputElement).value))} />
    </label>
  );
}

export function ColorField({ label, value, onInput }: { label: string; value: string; onInput: (v: string) => void }) {
  return (
    <label class="flex items-center justify-between gap-3 text-sm font-medium text-slate-600">
      <span>{label}</span>
      <input type="color" value={value} class="h-8 w-14 cursor-pointer rounded border border-slate-300 bg-white" onInput={(e) => onInput((e.target as HTMLInputElement).value)} />
    </label>
  );
}

export function Segmented<T extends string>({ label, value, options, onSelect }: { label: string; value: T; options: readonly T[]; onSelect: (v: T) => void }) {
  return (
    <div>
      <span class="text-sm font-medium text-slate-600">{label}</span>
      <div class="mt-1 flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button type="button" onClick={() => onSelect(o)} class={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${o === value ? 'bg-brand-700 text-white' : 'border border-slate-300 bg-white text-slate-600 hover:border-brand-400'}`}>{o}</button>
        ))}
      </div>
    </div>
  );
}

export function Output({ css }: { css: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  };
  return (
    <div class="mt-4">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold uppercase tracking-wide text-slate-400">CSS</span>
        <button type="button" onClick={copy} class="rounded-lg bg-brand-700 px-3 py-1 text-xs font-semibold text-white transition hover:bg-brand-800">{copied ? '✓ Copied!' : 'Copy'}</button>
      </div>
      <pre class="mt-1 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs leading-relaxed text-slate-100"><code>{css}</code></pre>
    </div>
  );
}

export function Shell({ controls, preview }: { controls: ComponentChildren; preview: ComponentChildren }) {
  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div class="space-y-4">{controls}</div>
        <div class="flex min-h-[260px] items-center justify-center rounded-xl border border-slate-200 bg-[linear-gradient(45deg,#f1f5f9_25%,transparent_25%,transparent_75%,#f1f5f9_75%),linear-gradient(45deg,#f1f5f9_25%,#fff_25%,#fff_75%,#f1f5f9_75%)] bg-[length:20px_20px] bg-[position:0_0,10px_10px] p-6">
          {preview}
        </div>
      </div>
    </div>
  );
}
