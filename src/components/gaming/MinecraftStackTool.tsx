import { useState } from 'preact/hooks';
import { Num, CalcShell, n, fmt } from '../social/shared';

export default function MinecraftStackTool() {
  const [items, setItems] = useState('2048');
  const [stackSize, setStackSize] = useState('64');
  const total = Math.max(0, Math.floor(n(items)));
  const ss = Math.max(1, Math.floor(n(stackSize)));
  const stacks = Math.floor(total / ss);
  const rem = total % ss;
  const perChest = 27 * ss;
  const chests = total / perChest;
  const shulkers = total / (27 * ss);

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div class="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm ring-1 ring-slate-200">
      <span class="text-slate-600">{label}</span><span class="font-mono font-bold text-slate-900">{value}</span>
    </div>
  );

  return (
    <CalcShell
      inputs={
        <>
          <Num label="Number of items" value={items} onInput={setItems} />
          <label class="block">
            <span class="text-sm font-medium text-slate-600">Stack size</span>
            <select value={String(ss)} onChange={(e) => setStackSize((e.target as HTMLSelectElement).value)} class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900">
              <option value="64">64 (most items)</option>
              <option value="16">16 (ender pearls, snowballs, signs)</option>
              <option value="1">1 (tools, armour, potions)</option>
            </select>
          </label>
        </>
      }
      output={
        <div class="w-full space-y-2">
          <Row label="Full stacks" value={`${fmt(stacks, 0)}${rem ? ` + ${rem}` : ''}`} />
          <Row label="Single chests (27 slots)" value={fmt(chests, 2)} />
          <Row label="Double chests (54 slots)" value={fmt(total / (54 * ss), 2)} />
          <Row label="Shulker boxes" value={fmt(shulkers, 2)} />
        </div>
      }
    />
  );
}
