import { useState } from 'preact/hooks';

const WHO = ['Owner', 'Group', 'Others'] as const;
const PERM = [
  { label: 'Read', letter: 'r', value: 4 },
  { label: 'Write', letter: 'w', value: 2 },
  { label: 'Execute', letter: 'x', value: 1 },
] as const;

function symbolic(digits: number[], special: number): string {
  let out = '';
  for (let i = 0; i < 3; i++) {
    const d = digits[i]!;
    const specialBit = special & (4 >> i); // setuid for owner, setgid for group, sticky for others
    for (const p of PERM) {
      const has = (d & p.value) !== 0;
      if (p.letter === 'x' && specialBit) {
        // s/S for setuid+setgid, t/T for sticky
        const ch = i === 2 ? (has ? 't' : 'T') : has ? 's' : 'S';
        out += ch;
      } else out += has ? p.letter : '-';
    }
  }
  return out;
}

export default function ChmodCalculatorTool() {
  const [digits, setDigits] = useState<number[]>([7, 5, 5]);
  const [special, setSpecial] = useState(0);

  function toggle(who: number, value: number) {
    setDigits((d) => d.map((x, i) => (i === who ? x ^ value : x)));
  }
  function onOctalInput(v: string) {
    const m = v.trim().match(/^([0-7])?([0-7])([0-7])([0-7])$/);
    if (!m) return;
    setSpecial(m[1] ? parseInt(m[1], 10) : 0);
    setDigits([parseInt(m[2]!, 10), parseInt(m[3]!, 10), parseInt(m[4]!, 10)]);
  }

  const octal = digits.join('');
  const full = (special ? String(special) : '') + octal;
  const sym = symbolic(digits, special);

  const presets: [string, string][] = [
    ['644', 'regular file'],
    ['755', 'directory / executable'],
    ['600', 'private file (ssh keys)'],
    ['700', 'private directory'],
    ['664', 'group-writable file'],
    ['775', 'group-writable directory'],
  ];

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-4 sm:grid-cols-3">
        {WHO.map((who, wi) => (
          <fieldset class="rounded-xl border border-slate-200 bg-white p-4">
            <legend class="px-1 text-sm font-bold text-slate-900">{who} <span class="ml-1 font-mono text-lg text-brand-700">{digits[wi]}</span></legend>
            {PERM.map((p) => (
              <label class="mt-1 flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" class="h-4 w-4 accent-brand-600" checked={(digits[wi]! & p.value) !== 0} onChange={() => toggle(wi, p.value)} />
                {p.label} <span class="font-mono text-slate-400">({p.letter} = {p.value})</span>
              </label>
            ))}
          </fieldset>
        ))}
      </div>

      <fieldset class="mt-4 rounded-xl border border-slate-200 bg-white p-4">
        <legend class="px-1 text-sm font-bold text-slate-900">Special bits <span class="ml-1 font-mono text-lg text-brand-700">{special || 0}</span></legend>
        <div class="flex flex-wrap gap-x-6 gap-y-1">
          <label class="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" class="h-4 w-4 accent-brand-600" checked={(special & 4) !== 0} onChange={() => setSpecial((s) => s ^ 4)} />
            Setuid <span class="font-mono text-slate-400">(4)</span>
          </label>
          <label class="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" class="h-4 w-4 accent-brand-600" checked={(special & 2) !== 0} onChange={() => setSpecial((s) => s ^ 2)} />
            Setgid <span class="font-mono text-slate-400">(2)</span>
          </label>
          <label class="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" class="h-4 w-4 accent-brand-600" checked={(special & 1) !== 0} onChange={() => setSpecial((s) => s ^ 1)} />
            Sticky bit <span class="font-mono text-slate-400">(1)</span>
          </label>
        </div>
      </fieldset>

      <div class="mt-5 grid gap-3 sm:grid-cols-3">
        <label class="block">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Octal (editable)</span>
          <input
            class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-lg font-bold text-slate-900 focus:border-brand-500 focus:outline-none"
            value={full}
            onInput={(e) => onOctalInput((e.target as HTMLInputElement).value)}
          />
        </label>
        <div>
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Symbolic (ls -l)</span>
          <p class="rounded-lg bg-slate-900 px-3 py-2 font-mono text-lg text-emerald-300">-{sym}</p>
        </div>
        <div>
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Command</span>
          <p class="flex items-center justify-between gap-2 rounded-lg bg-slate-900 px-3 py-2 font-mono text-sm text-slate-100">
            chmod {full} file
            <button type="button" class="text-slate-400 hover:text-white" title="Copy" onClick={() => navigator.clipboard.writeText(`chmod ${full} file`)}>📋</button>
          </p>
        </div>
      </div>

      <div class="mt-4">
        <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Common presets</span>
        <div class="mt-1.5 flex flex-wrap gap-2">
          {presets.map(([oct, label]) => (
            <button
              type="button"
              class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-600 transition hover:border-brand-400 hover:text-brand-700"
              onClick={() => { setSpecial(0); setDigits(oct.split('').map(Number)); }}
            >
              <span class="font-mono font-bold">{oct}</span> {label}
            </button>
          ))}
        </div>
      </div>

      <p class="mt-4 text-xs text-slate-500">Read = 4, write = 2, execute = 1 — each digit is the sum for owner, group, then others.</p>
    </div>
  );
}
