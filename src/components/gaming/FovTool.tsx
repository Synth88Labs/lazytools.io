import { useState } from 'preact/hooks';
import { Num, Result, CalcShell, n, fmt } from '../social/shared';

const ASPECTS: Record<string, number> = { '16:9': 16 / 9, '16:10': 16 / 10, '21:9': 21 / 9, '4:3': 4 / 3, '32:9': 32 / 9 };
const KEYS = Object.keys(ASPECTS);
const toRad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;

export default function FovTool() {
  const [fov, setFov] = useState('90');
  const [from, setFrom] = useState('4:3');
  const [to, setTo] = useState('16:9');
  // Hor+ scaling: keep vertical FOV constant, recompute horizontal for the new aspect.
  const vFov = 2 * Math.atan(Math.tan(toRad(n(fov)) / 2) / ASPECTS[from]);
  const newH = toDeg(2 * Math.atan(Math.tan(vFov / 2) * ASPECTS[to]));
  const Select = ({ value, onSelect }: { value: string; onSelect: (v: string) => void }) => (
    <select value={value} onChange={(e) => onSelect((e.target as HTMLSelectElement).value)} class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900">
      {KEYS.map((k) => <option value={k}>{k}</option>)}
    </select>
  );
  return (
    <CalcShell
      inputs={
        <>
          <Num label="Horizontal FOV" value={fov} onInput={setFov} suffix="°" />
          <label class="block"><span class="text-sm font-medium text-slate-600">From aspect ratio</span><div class="mt-1"><Select value={from} onSelect={setFrom} /></div></label>
          <label class="block"><span class="text-sm font-medium text-slate-600">To aspect ratio</span><div class="mt-1"><Select value={to} onSelect={setTo} /></div></label>
        </>
      }
      output={<Result label={`Equivalent FOV at ${to}`} value={`${fmt(newH, 1)}°`} hint="Hor+ · same vertical FOV, matched feel" />}
    />
  );
}
