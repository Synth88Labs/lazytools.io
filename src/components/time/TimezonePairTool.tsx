import { useEffect, useState } from 'preact/hooks';
import {
  ZONES,
  offsetMinutes,
  hourDifference,
  fmtOffset,
  fmtDiff,
  type Zone,
} from '../../data/time/zones';

interface Props {
  aAbbr: string;
  bAbbr: string;
}

const BIZ_START = 9;
const BIZ_END = 17; // 9:00–17:00 local business window

function nowInZone(iana: string, date: Date) {
  const p = new Intl.DateTimeFormat('en-US', {
    timeZone: iana,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date);
  return p;
}

/** Hour-of-day (0–23) in a zone for an instant. */
function zoneHour(iana: string, date: Date): number {
  return Number(
    new Intl.DateTimeFormat('en-US', { timeZone: iana, hour: '2-digit', hour12: false }).format(date).replace(/\D/g, '')
  ) % 24;
}

function label12(h: number): string {
  const ampm = h < 12 ? 'am' : 'pm';
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}${ampm}`;
}

export default function TimezonePairTool({ aAbbr, bAbbr }: Props) {
  const a: Zone = ZONES[aAbbr]!;
  const b: Zone = ZONES[bAbbr]!;
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const offA = offsetMinutes(a.iana, now);
  const offB = offsetMinutes(b.iana, now);
  const diff = hourDifference(a.iana, b.iana, now);

  // current hour in A; build the 24-row map A-hour → B-hour
  const aHourNow = zoneHour(a.iana, now);
  const bHourNow = zoneHour(b.iana, now);
  const shift = Math.round((offB - offA) / 60); // whole-hour shift for the grid (half-hour zones handled in text)

  const rows = Array.from({ length: 24 }, (_, ah) => {
    const bh = ((ah + shift) % 24 + 24) % 24;
    const aBiz = ah >= BIZ_START && ah < BIZ_END;
    const bBiz = bh >= BIZ_START && bh < BIZ_END;
    return { ah, bh, both: aBiz && bBiz };
  });
  const overlap = rows.filter((r) => r.both);

  const zoneCard = (z: Zone, timeStr: string, off: number, accent: boolean) => (
    <div class={`rounded-xl border p-4 ${accent ? 'border-brand-200 bg-brand-50' : 'border-slate-200 bg-white'}`}>
      <p class={`text-xs font-semibold uppercase tracking-wide ${accent ? 'text-brand-700' : 'text-slate-500'}`}>{z.label}</p>
      <p class={`mt-1 font-mono text-2xl font-bold ${accent ? 'text-brand-900' : 'text-slate-900'}`}>{timeStr}</p>
      <p class="mt-0.5 text-xs text-slate-500">{fmtOffset(off)} · {z.cities}</p>
    </div>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2" aria-live="polite">
        {zoneCard(a, nowInZone(a.iana, now), offA, false)}
        {zoneCard(b, nowInZone(b.iana, now), offB, true)}
      </div>

      <p class="mt-3 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-slate-700">
        Right now, <strong class="text-slate-900">{b.label}</strong> is{' '}
        <strong class="text-brand-800">{fmtDiff(diff)}</strong> <strong class="text-slate-900">{a.label}</strong>.
      </p>

      <div class="mt-5">
        <p class="mb-2 text-sm font-semibold text-slate-900">Meeting-hours overlap (9am–5pm in both)</p>
        {overlap.length > 0 ? (
          <p class="rounded-lg border border-mint-500 bg-mint-50 px-4 py-2.5 text-sm font-medium text-mint-800">
            ✓ Best window: <strong>{label12(overlap[0]!.ah)}–{label12((overlap[overlap.length - 1]!.ah + 1) % 24)}</strong> {a.label} ={' '}
            <strong>{label12(overlap[0]!.bh)}–{label12((overlap[overlap.length - 1]!.bh + 1) % 24)}</strong> {b.label} · {overlap.length} shared working hour{overlap.length !== 1 ? 's' : ''}
          </p>
        ) : (
          <p class="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-800">
            ⚠ No 9–5 overlap — one side is always outside business hours. Try early morning or late evening for one party.
          </p>
        )}

        <div class="mt-3 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white">
          <table class="w-full text-sm">
            <thead class="sticky top-0 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th class="px-4 py-2">{a.label}</th>
                <th class="px-4 py-2">{b.label}</th>
                <th class="px-4 py-2">Good to meet?</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const isNow = r.ah === aHourNow;
                return (
                  <tr class={`border-b border-slate-100 last:border-0 ${r.both ? 'bg-mint-50' : ''} ${isNow ? 'ring-2 ring-inset ring-brand-300' : ''}`}>
                    <td class="px-4 py-1.5 font-mono text-slate-800">{label12(r.ah)}{isNow ? ' · now' : ''}</td>
                    <td class="px-4 py-1.5 font-mono text-slate-800">{label12(r.bh)}</td>
                    <td class="px-4 py-1.5">{r.both ? <span class="font-semibold text-mint-700">✓ both working</span> : <span class="text-slate-400">—</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {Math.abs(diff % 1) > 0.01 && (
          <p class="mt-2 text-xs text-slate-500">
            Note: the offset includes a half-hour, so the table rounds to the nearest hour — read the live clocks above for the exact minute.
          </p>
        )}
      </div>
      <p class="mt-3 text-xs text-slate-500">
        Live from your device's clock via the browser's IANA timezone data — DST for both zones is applied automatically, and it works offline.
      </p>
    </div>
  );
}
