import { useState } from 'preact/hooks';

const GRADES: [string, number][] = [
  ['A', 4.0], ['A−', 3.7], ['B+', 3.3], ['B', 3.0], ['B−', 2.7],
  ['C+', 2.3], ['C', 2.0], ['C−', 1.7], ['D+', 1.3], ['D', 1.0], ['F', 0.0],
];
const tabCls = (a: boolean) => `rounded-lg px-4 py-2 text-sm font-semibold transition ${a ? 'bg-brand-700 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:text-brand-700'}`;
const inputCls = 'rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-brand-500 focus:outline-none';

interface Course { grade: string; credits: string; }

export default function GpaCalc() {
  const [mode, setMode] = useState<'gpa' | 'final'>('gpa');
  const [courses, setCourses] = useState<Course[]>([
    { grade: '4.0', credits: '3' },
    { grade: '3.0', credits: '4' },
    { grade: '3.7', credits: '3' },
  ]);
  // final-grade-needed
  const [current, setCurrent] = useState('82');
  const [target, setTarget] = useState('90');
  const [weight, setWeight] = useState('30');

  const set = (i: number, k: keyof Course, v: string) => setCourses(courses.map((c, j) => (j === i ? { ...c, [k]: v } : c)));

  const totalCredits = courses.reduce((a, c) => a + (parseFloat(c.credits) || 0), 0);
  const totalPoints = courses.reduce((a, c) => a + (parseFloat(c.grade) || 0) * (parseFloat(c.credits) || 0), 0);
  const gpa = totalCredits > 0 ? totalPoints / totalCredits : null;

  const cur = parseFloat(current), tgt = parseFloat(target), w = parseFloat(weight) / 100;
  const needed = Number.isFinite(cur) && Number.isFinite(tgt) && Number.isFinite(w) && w > 0 ? (tgt - cur * (1 - w)) / w : null;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex gap-2">
        <button type="button" class={tabCls(mode === 'gpa')} onClick={() => setMode('gpa')}>GPA from courses</button>
        <button type="button" class={tabCls(mode === 'final')} onClick={() => setMode('final')}>Grade needed on final</button>
      </div>

      {mode === 'gpa' ? (
        <>
          <div class="mt-4 space-y-2">
            <div class="grid grid-cols-[1fr_1fr_auto] gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <span>Grade</span><span>Credit hours</span><span></span>
            </div>
            {courses.map((c, i) => (
              <div class="grid grid-cols-[1fr_1fr_auto] gap-2">
                <select class={inputCls} value={c.grade} onChange={(e) => set(i, 'grade', (e.target as HTMLSelectElement).value)} aria-label={`Grade ${i + 1}`}>
                  {GRADES.map(([label, gp]) => <option value={String(gp)}>{label} ({gp.toFixed(1)})</option>)}
                </select>
                <input class={`${inputCls} font-mono`} type="number" value={c.credits} onInput={(e) => set(i, 'credits', (e.target as HTMLInputElement).value)} aria-label={`Credits ${i + 1}`} />
                <button type="button" class="px-2 text-red-500 hover:text-red-700 disabled:opacity-30" onClick={() => setCourses(courses.filter((_, j) => j !== i))} disabled={courses.length <= 1} aria-label={`Remove course ${i + 1}`}>✕</button>
              </div>
            ))}
          </div>
          <button type="button" class="mt-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-brand-400" onClick={() => setCourses([...courses, { grade: '4.0', credits: '3' }])}>+ Add course</button>

          <div class="mt-5 rounded-xl bg-white p-4 ring-2 ring-brand-200">
            <div class="flex items-baseline justify-between">
              <span class="text-sm font-medium text-slate-600">Cumulative GPA</span>
              <span class="text-3xl font-extrabold text-brand-800">{gpa !== null ? gpa.toFixed(3) : '—'}</span>
            </div>
            <p class="mt-1 font-mono text-xs text-slate-400">{totalPoints.toFixed(1)} grade points ÷ {totalCredits} credit hours</p>
          </div>
        </>
      ) : (
        <>
          <div class="mt-4 grid gap-4 sm:grid-cols-3">
            <label class="block">
              <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Current grade (%)</span>
              <input class={`${inputCls} w-full font-mono`} type="number" value={current} onInput={(e) => setCurrent((e.target as HTMLInputElement).value)} />
            </label>
            <label class="block">
              <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Target grade (%)</span>
              <input class={`${inputCls} w-full font-mono`} type="number" value={target} onInput={(e) => setTarget((e.target as HTMLInputElement).value)} />
            </label>
            <label class="block">
              <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Final worth (%)</span>
              <input class={`${inputCls} w-full font-mono`} type="number" value={weight} onInput={(e) => setWeight((e.target as HTMLInputElement).value)} />
            </label>
          </div>
          <div class="mt-5 rounded-xl bg-white p-4 ring-2 ring-brand-200">
            <div class="flex items-baseline justify-between">
              <span class="text-sm font-medium text-slate-600">Score needed on the final</span>
              <span class={`text-3xl font-extrabold ${needed !== null && needed > 100 ? 'text-red-600' : 'text-brand-800'}`}>{needed !== null ? `${needed.toFixed(1)}%` : '—'}</span>
            </div>
            <p class="mt-1 font-mono text-xs text-slate-400">(target − current × (1 − weight)) ÷ weight</p>
            {needed !== null && needed > 100 && <p class="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">That would need over 100% — the target isn't reachable from this final alone.</p>}
            {needed !== null && needed <= 0 && <p class="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">You've already secured the target — even a 0 on the final keeps you at or above it.</p>}
          </div>
        </>
      )}
      <p class="mt-4 text-xs text-slate-500">Standard 4.0 scale (A = 4.0). GPA is credit-weighted, so credits matter as much as grades. Scales vary by institution. Computed locally.</p>
    </div>
  );
}
