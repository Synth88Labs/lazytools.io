import { usePersistentState, exportJson, pickJson, uid } from '../../lib/persist';

interface KR { id: string; name: string; start: number; current: number; target: number; unit: string }
interface Objective { id: string; name: string; krs: KR[] }
const INITIAL: Objective[] = [
  { id: uid(), name: 'Grow the newsletter', krs: [
    { id: uid(), name: 'Subscribers', start: 1200, current: 1650, target: 3000, unit: '' },
    { id: uid(), name: 'Open rate', start: 30, current: 38, target: 45, unit: '%' },
  ] },
];

const krPct = (k: KR) => { const span = k.target - k.start; if (span === 0) return k.current >= k.target ? 100 : 0; return Math.max(0, Math.min(100, Math.round(((k.current - k.start) / span) * 100))); };
const objPct = (o: Objective) => (o.krs.length ? Math.round(o.krs.reduce((s, k) => s + krPct(k), 0) / o.krs.length) : 0);

export default function OkrTool() {
  const [objs, setObjs] = usePersistentState<Objective[]>('lt.okr', INITIAL);
  const setObj = (id: string, patch: Partial<Objective>) => setObjs((os) => os.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  const setKr = (oid: string, kid: string, patch: Partial<KR>) => setObjs((os) => os.map((o) => o.id === oid ? { ...o, krs: o.krs.map((k) => (k.id === kid ? { ...k, ...patch } : k)) } : o));
  const addObj = () => setObjs((os) => [...os, { id: uid(), name: 'New objective', krs: [{ id: uid(), name: 'Key result', start: 0, current: 0, target: 100, unit: '' }] }]);
  const addKr = (oid: string) => setObjs((os) => os.map((o) => o.id === oid ? { ...o, krs: [...o.krs, { id: uid(), name: 'Key result', start: 0, current: 0, target: 100, unit: '' }] } : o));
  const delObj = (id: string) => setObjs((os) => os.filter((o) => o.id !== id));
  const delKr = (oid: string, kid: string) => setObjs((os) => os.map((o) => o.id === oid ? { ...o, krs: o.krs.filter((k) => k.id !== kid) } : o));

  const inp = 'rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 focus:border-brand-500 focus:outline-none';
  const btn = 'rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-brand-400';
  const barColor = (p: number) => (p >= 70 ? 'bg-mint-500' : p >= 30 ? 'bg-amber-400' : 'bg-red-400');

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex flex-wrap gap-2">
        <button type="button" onClick={addObj} class="rounded-lg bg-brand-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-800">＋ Objective</button>
        <button type="button" onClick={() => exportJson('okr', 'okrs.json', objs)} class={btn}>⬇ JSON</button>
        <button type="button" onClick={() => pickJson().then((d) => Array.isArray(d) && setObjs(d as Objective[])).catch(() => {})} class={btn}>⬆ Import</button>
      </div>

      <div class="space-y-4">
        {objs.map((o) => {
          const p = objPct(o);
          return (
            <div class="rounded-xl border border-slate-200 bg-white p-4">
              <div class="flex items-center gap-2">
                <span class="text-lg">🎯</span>
                <input value={o.name} onInput={(e) => setObj(o.id, { name: (e.target as HTMLInputElement).value })} class={`${inp} min-w-0 flex-1 text-base font-bold`} />
                <span class="text-sm font-bold text-slate-700">{p}%</span>
                <button type="button" onClick={() => delObj(o.id)} class="text-slate-300 hover:text-red-600" aria-label="Delete objective">✕</button>
              </div>
              <span class="mt-2 block h-2 overflow-hidden rounded-full bg-slate-100"><span class={`block h-full rounded-full ${barColor(p)}`} style={`width:${p}%`} /></span>

              <ul class="mt-3 space-y-2">
                {o.krs.map((k) => {
                  const kp = krPct(k);
                  return (
                    <li class="rounded-lg border border-slate-100 bg-slate-50 p-2.5">
                      <div class="flex flex-wrap items-center gap-2 text-sm">
                        <input value={k.name} onInput={(e) => setKr(o.id, k.id, { name: (e.target as HTMLInputElement).value })} class={`${inp} min-w-0 flex-1 font-medium`} />
                        <span class="flex items-center gap-1 text-xs text-slate-500">
                          <input type="number" value={k.current} onInput={(e) => setKr(o.id, k.id, { current: parseFloat((e.target as HTMLInputElement).value) || 0 })} class={`${inp} w-20`} title="current" />
                          /
                          <input type="number" value={k.target} onInput={(e) => setKr(o.id, k.id, { target: parseFloat((e.target as HTMLInputElement).value) || 0 })} class={`${inp} w-20`} title="target" />
                          <input value={k.unit} onInput={(e) => setKr(o.id, k.id, { unit: (e.target as HTMLInputElement).value })} class={`${inp} w-12`} placeholder="unit" title="unit" />
                        </span>
                        <span class="w-10 text-right text-xs font-bold text-slate-600">{kp}%</span>
                        <button type="button" onClick={() => delKr(o.id, k.id)} class="text-slate-300 hover:text-red-600" aria-label="Delete key result">✕</button>
                      </div>
                      <span class="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-slate-200"><span class={`block h-full rounded-full ${barColor(kp)}`} style={`width:${kp}%`} /></span>
                    </li>
                  );
                })}
              </ul>
              <button type="button" onClick={() => addKr(o.id)} class="mt-2 text-sm font-medium text-brand-700 hover:text-brand-800">＋ Add key result</button>
            </div>
          );
        })}
      </div>
      <p class="mt-3 text-xs text-slate-500">An Objective is a qualitative goal; its Key Results are measurable outcomes. Progress is how far each metric has moved from its start toward its target. Saved locally.</p>
    </div>
  );
}
