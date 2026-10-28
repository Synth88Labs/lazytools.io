import { useState } from 'preact/hooks';

export default function TeamsTool() {
  const [names, setNames] = useState('Alex\nJordan\nSam\nTaylor\nMorgan\nCasey\nRiley\nJamie');
  const [teamCount, setTeamCount] = useState(2);
  const [teams, setTeams] = useState<string[][]>([]);

  const shuffle = () => {
    const list = names.split('\n').map((s) => s.trim()).filter(Boolean);
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    const t: string[][] = Array.from({ length: teamCount }, () => []);
    list.forEach((name, i) => t[i % teamCount].push(name));
    setTeams(t);
  };

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-4 sm:grid-cols-[1fr_auto]">
        <label class="block">
          <span class="text-sm font-medium text-slate-600">Names (one per line)</span>
          <textarea value={names} onInput={(e) => setNames((e.target as HTMLTextAreaElement).value)} rows={7} class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200" />
        </label>
        <div class="flex flex-col gap-3">
          <label class="text-sm font-medium text-slate-600">
            Teams
            <input type="number" min="2" max="12" value={teamCount} onInput={(e) => setTeamCount(Math.max(2, Math.min(12, parseInt((e.target as HTMLInputElement).value) || 2)))} class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900" />
          </label>
          <button type="button" onClick={shuffle} class="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-800">🎲 Shuffle into teams</button>
        </div>
      </div>
      {teams.length > 0 && (
        <div class="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team, i) => (
            <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <p class="font-bold text-brand-700">Team {i + 1} <span class="text-xs font-normal text-slate-400">({team.length})</span></p>
              <ul class="mt-2 space-y-1 text-sm text-slate-700">
                {team.map((nm) => <li>{nm}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
