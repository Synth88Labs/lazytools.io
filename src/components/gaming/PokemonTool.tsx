import { useState } from 'preact/hooks';
import { POKE_TYPES, defenseMultiplier, type PokeType } from '../../lib/gaming-data';

const TYPE_COLORS: Record<string, string> = {
  Normal: '#9fa19f', Fire: '#e62829', Water: '#2980ef', Electric: '#fac000', Grass: '#3fa129',
  Ice: '#3dcef3', Fighting: '#ff8000', Poison: '#9141cb', Ground: '#915121', Flying: '#81b9ef',
  Psychic: '#ef4179', Bug: '#91a119', Rock: '#afa981', Ghost: '#704170', Dragon: '#5060e1',
  Dark: '#50413f', Steel: '#60a1b8', Fairy: '#ef70ef',
};

const BUCKETS: { m: number; label: string; cls: string }[] = [
  { m: 4, label: 'Weak ×4', cls: 'bg-red-200 text-red-900' },
  { m: 2, label: 'Weak ×2', cls: 'bg-red-100 text-red-800' },
  { m: 0.5, label: 'Resists ×½', cls: 'bg-emerald-100 text-emerald-800' },
  { m: 0.25, label: 'Resists ×¼', cls: 'bg-emerald-200 text-emerald-900' },
  { m: 0, label: 'Immune ×0', cls: 'bg-slate-200 text-slate-700' },
];

export default function PokemonTool() {
  const [sel, setSel] = useState<PokeType[]>(['Grass', 'Poison']);

  const toggle = (t: PokeType) => {
    setSel((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : cur.length < 2 ? [...cur, t] : [cur[1], t]));
  };

  const groups = BUCKETS.map((b) => ({
    ...b,
    types: sel.length ? POKE_TYPES.filter((atk) => defenseMultiplier(atk, sel) === b.m) : [],
  })).filter((g) => g.types.length);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <p class="text-sm font-medium text-slate-600">Pick a Pokémon's type (up to 2)</p>
      <div class="mt-2 flex flex-wrap gap-1.5">
        {POKE_TYPES.map((t) => (
          <button
            type="button"
            onClick={() => toggle(t)}
            class={`rounded-md px-2.5 py-1 text-xs font-bold text-white transition ${sel.includes(t) ? 'ring-2 ring-slate-900 ring-offset-1' : 'opacity-70 hover:opacity-100'}`}
            style={`background:${TYPE_COLORS[t]}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div class="mt-5 space-y-3">
        {sel.length === 0 && <p class="text-sm text-slate-500">Select one or two types to see its weaknesses and resistances.</p>}
        {groups.map((g) => (
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{g.label}</p>
            <div class="mt-1 flex flex-wrap gap-1.5">
              {g.types.map((t) => (
                <span class={`rounded px-2 py-0.5 text-xs font-semibold ${g.cls}`}>{t}</span>
              ))}
            </div>
          </div>
        ))}
        {sel.length > 0 && groups.length === 0 && <p class="text-sm text-slate-500">This typing takes neutral damage from every type.</p>}
      </div>
    </div>
  );
}
