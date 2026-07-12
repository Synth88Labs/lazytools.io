import { useMemo, useState } from 'preact/hooks';
import { harmonics, type Medium } from '../../lib/physics-extra';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (n: number, d = 1) => n.toLocaleString('en-US', { maximumFractionDigits: d });

const MEDIA: { value: Medium; label: string; note: string }[] = [
  { value: 'string', label: 'String (fixed both ends)', note: 'guitar/violin string' },
  { value: 'openPipe', label: 'Open pipe (both ends open)', note: 'flute' },
  { value: 'closedPipe', label: 'Closed pipe (one end closed)', note: 'clarinet, closed organ pipe' },
];

export default function HarmonicsTool() {
  const [medium, setMedium] = useState<Medium>('string');
  const [speed, setSpeed] = useState('340');
  const [length, setLength] = useState('0.5');

  const rows = useMemo(() => {
    const v = num(speed), l = num(length);
    if (v == null || l == null) return null;
    return harmonics(medium, v, l, 6);
  }, [medium, speed, length]);

  const mediumInfo = MEDIA.find((m) => m.value === medium)!;
  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">System</span>
          <select class={sel} value={medium} onChange={(e) => setMedium((e.target as HTMLSelectElement).value as Medium)}>
            {MEDIA.map((m) => <option value={m.value}>{m.label}</option>)}
          </select></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Wave speed (m/s)</span>
          <input type="number" step="any" value={speed} onInput={(e) => setSpeed((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Length (m)</span>
          <input type="number" step="any" value={length} onInput={(e) => setLength((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>
      <p class="mt-1 text-xs text-slate-500">e.g. {mediumInfo.note}. Use ~340 m/s for sound in air, or the string's wave speed.</p>

      {rows ? (
        <div class="mt-4 overflow-x-auto rounded-xl bg-white ring-1 ring-slate-200">
          <table class="w-full min-w-[360px] text-sm">
            <thead><tr class="border-b border-slate-200 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500"><th class="px-4 py-2">Harmonic</th><th class="px-4 py-2 text-right">Frequency</th><th class="px-4 py-2 text-right">Wavelength</th></tr></thead>
            <tbody>
              {rows.map((h, i) => (
                <tr class={`border-b border-slate-100 ${i === 0 ? 'bg-brand-50' : ''}`}>
                  <td class="px-4 py-2 font-medium text-slate-700">n = {h.n}{i === 0 ? ' (fundamental)' : ''}</td>
                  <td class="px-4 py-2 text-right font-mono font-semibold text-slate-800">{fmt(h.frequency)} Hz</td>
                  <td class="px-4 py-2 text-right font-mono text-slate-600">{fmt(h.wavelength, 3)} m</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the wave speed and the length of the string or pipe.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">A string fixed at both ends (and an open pipe) resonates at fₙ = n·v ÷ 2L for n = 1, 2, 3…; a pipe closed at one end supports only the odd harmonics fₙ = n·v ÷ 4L (n = 1, 3, 5…), which is why a clarinet sounds an octave lower than its length suggests. The lowest frequency (n = 1) is the fundamental; the rest are overtones that give the sound its timbre. 🔒 In your browser.</p>
    </div>
  );
}
