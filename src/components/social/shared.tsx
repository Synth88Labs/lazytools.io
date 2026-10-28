import type { ComponentChildren } from 'preact';

export function Num({ label, value, onInput, suffix, step = 'any', min = 0 }: { label: string; value: string; onInput: (v: string) => void; suffix?: string; step?: string; min?: number }) {
  return (
    <label class="block">
      <span class="text-sm font-medium text-slate-600">{label}</span>
      <div class="mt-1 flex items-center gap-2">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          min={min}
          step={step}
          onInput={(e) => onInput((e.target as HTMLInputElement).value)}
          class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
        />
        {suffix && <span class="shrink-0 text-sm text-slate-500">{suffix}</span>}
      </div>
    </label>
  );
}

export function Result({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div class="rounded-xl bg-brand-50 p-5 text-center ring-1 ring-brand-100">
      <p class="text-xs font-semibold uppercase tracking-wide text-brand-700">{label}</p>
      <p class="mt-1 text-4xl font-extrabold text-brand-800">{value}</p>
      {hint && <p class="mt-1 text-sm text-slate-600">{hint}</p>}
    </div>
  );
}

export function CalcShell({ inputs, output }: { inputs: ComponentChildren; output: ComponentChildren }) {
  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-5 sm:grid-cols-2">
        <div class="space-y-3">{inputs}</div>
        <div class="flex items-center justify-center">{output}</div>
      </div>
    </div>
  );
}

export const n = (s: string) => {
  const v = parseFloat(s);
  return Number.isFinite(v) ? v : 0;
};

export const fmt = (v: number, d = 2) =>
  Number.isFinite(v) ? v.toLocaleString(undefined, { maximumFractionDigits: d }) : '—';

export const money = (v: number) =>
  Number.isFinite(v) ? '$' + v.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '—';
