import { useMemo, useState } from 'preact/hooks';
import { decodeSnowflake, SNOWFLAKE_PRESETS } from '../../lib/snowflake';

export default function SnowflakeDecoderTool() {
  const [idStr, setIdStr] = useState('175928847299117063');
  const [presetId, setPresetId] = useState('discord');
  const [customEpoch, setCustomEpoch] = useState('0');

  const preset = SNOWFLAKE_PRESETS.find((p) => p.id === presetId)!;
  const epoch = presetId === 'custom' ? (parseInt(customEpoch, 10) || 0) : preset.epoch;

  const r = useMemo(() => decodeSnowflake(idStr, epoch), [idStr, epoch]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-mono text-base text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const cell = (label: string, value: string) => (
    <div class="rounded-lg bg-slate-50 p-3"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p><p class="mt-0.5 break-all font-mono text-sm font-semibold text-slate-800">{value}</p></div>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Snowflake ID</span>
        <input class={inp} value={idStr} onInput={(e) => setIdStr((e.target as HTMLInputElement).value)} placeholder="175928847299117063" />
      </label>
      <div class="mt-3 flex flex-wrap items-center gap-3">
        <label class="text-sm text-slate-600">Service <select class={sel} value={presetId} onChange={(e) => setPresetId((e.target as HTMLSelectElement).value)}>
          {SNOWFLAKE_PRESETS.map((p) => <option value={p.id}>{p.name}</option>)}
          <option value="custom">Custom epoch…</option>
        </select></label>
        {presetId === 'custom' && <label class="text-sm text-slate-600">Epoch (ms) <input type="number" class={`${inp} inline-block w-44`} value={customEpoch} onInput={(e) => setCustomEpoch((e.target as HTMLInputElement).value)} /></label>}
      </div>

      {r ? (
        <div class="mt-4 space-y-3">
          <div class="rounded-xl bg-white p-4 ring-2 ring-brand-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Created at (UTC)</p>
            <p class="mt-1 text-2xl font-extrabold text-brand-800">{r.isoDate}</p>
            <p class="mt-0.5 text-xs text-slate-400">Unix ms: {r.timestampMs.toLocaleString()}</p>
          </div>
          <div class="grid gap-2 sm:grid-cols-4">
            {cell('Timestamp', String(r.timestampMs))}
            {cell('Worker ID', String(r.worker))}
            {cell('Process ID', String(r.process))}
            {cell('Increment', String(r.increment))}
          </div>
          <div class="rounded-xl bg-white p-3 ring-1 ring-slate-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">64-bit binary (timestamp · machine · sequence)</p>
            <p class="mt-1 break-all font-mono text-xs text-slate-700">{r.binary.slice(0, 42)} {r.binary.slice(42, 52)} {r.binary.slice(52)}</p>
          </div>
        </div>
      ) : idStr.trim() && <p class="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">Enter a numeric Snowflake ID (a 64-bit integer).</p>}

      <p class="mt-4 text-xs text-slate-500">A Snowflake ID packs a creation time and machine/sequence info into one 64-bit number. The high 41 bits are a millisecond timestamp measured from the service's own epoch (Discord: 2015-01-01, Twitter/X: 2010-11-04), then 10 bits identify the generating machine (Discord splits this into a 5-bit worker and 5-bit process), and the low 12 bits are a per-millisecond counter. Pick the right service so the timestamp decodes correctly. 🔒 Decoded in your browser.</p>
    </div>
  );
}
