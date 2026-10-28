import { useState } from 'preact/hooks';
import { Num, Result, CalcShell, n, fmt } from '../social/shared';
import { GAME_YAW } from '../../lib/gaming-data';

const GAMES = Object.keys(GAME_YAW);

export default function SensitivityTool() {
  const [from, setFrom] = useState('Valorant');
  const [to, setTo] = useState('CS2 / CS:GO');
  const [sens, setSens] = useState('0.4');
  // Constant DPI: match cm/360 → newSens = oldSens × fromYaw / toYaw.
  const newSens = (n(sens) * GAME_YAW[from]) / GAME_YAW[to];

  const Select = ({ value, onSelect }: { value: string; onSelect: (v: string) => void }) => (
    <select value={value} onChange={(e) => onSelect((e.target as HTMLSelectElement).value)} class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900">
      {GAMES.map((g) => <option value={g}>{g}</option>)}
    </select>
  );

  return (
    <CalcShell
      inputs={
        <>
          <label class="block"><span class="text-sm font-medium text-slate-600">From game</span><Select value={from} onSelect={setFrom} /></label>
          <Num label="Current sensitivity" value={sens} onInput={setSens} />
          <label class="block"><span class="text-sm font-medium text-slate-600">To game</span><Select value={to} onSelect={setTo} /></label>
        </>
      }
      output={<Result label={`Sensitivity in ${to}`} value={fmt(newSens, 4)} hint="same cm/360 at the same DPI" />}
    />
  );
}
