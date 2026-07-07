import { useRef } from 'preact/hooks';
import { usePersistentState, exportJson, pickJson, uid, downloadBlob, downloadSvgAsPng, downloadSvgAsPdf, todayKey, useFullscreen } from '../../lib/persist';

interface Task { id: string; name: string; start: string; end: string; pct: number; milestone: boolean; after: string; }
const DAY = 86_400_000;
const toMs = (s: string) => { const [y, m, d] = s.split('-').map(Number); return y && m && d ? Date.UTC(y, m - 1, d) : NaN; };
const addDays = (s: string, n: number) => { const t = toMs(s) + n * DAY; const d = new Date(t); const p = (x: number) => String(x).padStart(2, '0'); return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())}`; };

const INITIAL: Task[] = (() => {
  const t = todayKey();
  return [
    { id: uid(), name: 'Research & scope', start: t, end: addDays(t, 4), pct: 100, milestone: false, after: '' },
    { id: uid(), name: 'Design', start: addDays(t, 5), end: addDays(t, 11), pct: 60, milestone: false, after: '' },
    { id: uid(), name: 'Build', start: addDays(t, 12), end: addDays(t, 26), pct: 20, milestone: false, after: '' },
    { id: uid(), name: 'Launch', start: addDays(t, 27), end: addDays(t, 27), pct: 0, milestone: true, after: '' },
  ];
})();

const LABEL_W = 168, ROW_H = 40, HEAD_H = 46, DAY_W_MIN = 8, DAY_W_MAX = 26;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function GanttTool() {
  const [tasks, setTasks] = usePersistentState<Task[]>('lt.gantt', INITIAL);
  const svgRef = useRef<SVGSVGElement>(null);
  const fs = useFullscreen();

  const valid = tasks.filter((t) => Number.isFinite(toMs(t.start)) && Number.isFinite(toMs(t.end)));
  const starts = valid.map((t) => toMs(t.start));
  const ends = valid.map((t) => Math.max(toMs(t.start), toMs(t.end)));
  const min = starts.length ? Math.min(...starts) - DAY : Date.UTC(2026, 0, 1);
  const max = ends.length ? Math.max(...ends) + DAY : min + 30 * DAY;
  const days = Math.max(1, Math.round((max - min) / DAY) + 1);
  const dayW = Math.max(DAY_W_MIN, Math.min(DAY_W_MAX, Math.round(1100 / days)));
  const chartW = days * dayW;
  const W = LABEL_W + chartW + 20;
  const H = HEAD_H + tasks.length * ROW_H + 16;
  const xOf = (ms: number) => LABEL_W + ((ms - min) / DAY) * dayW;
  const todayMs = toMs(todayKey());

  // week gridlines + month labels
  const gridlines: { x: number; label?: string; month?: boolean }[] = [];
  for (let d = 0; d < days; d++) {
    const ms = min + d * DAY;
    const date = new Date(ms);
    const dom = date.getUTCDate();
    if (date.getUTCDay() === 1 || d === 0) gridlines.push({ x: xOf(ms), label: `${MONTHS[date.getUTCMonth()]} ${dom}` });
    if (dom === 1) gridlines.push({ x: xOf(ms), month: true });
  }

  const set = (id: string, patch: Partial<Task>) => setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  const add = () => { const last = tasks[tasks.length - 1]; const s = last ? addDays(last.end, 1) : todayKey(); setTasks((ts) => [...ts, { id: uid(), name: 'New task', start: s, end: addDays(s, 3), pct: 0, milestone: false, after: '' }]); };
  const del = (id: string) => setTasks((ts) => ts.filter((t) => t.id !== id));

  function exportCsv() {
    const rows = [['Task', 'Start', 'End', '% complete', 'Milestone'], ...tasks.map((t) => [t.name, t.start, t.end, String(t.pct), t.milestone ? 'yes' : 'no'])];
    downloadBlob(new Blob([rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n')], { type: 'text/csv' }), 'gantt.csv');
  }

  const inp = 'rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 focus:border-brand-500 focus:outline-none';
  const btn = 'rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-brand-400';

  return (
    <div ref={fs.ref} class={`rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6 ${fs.isFull ? 'fixed inset-0 z-[60] overflow-auto !rounded-none' : ''}`}>
      <div class="mb-3 flex flex-wrap gap-2">
        <button type="button" onClick={add} class="rounded-lg bg-brand-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-800">＋ Task</button>
        <button type="button" onClick={() => svgRef.current && downloadSvgAsPng(svgRef.current, 'gantt.png')} class={btn}>🖼 PNG</button>
        <button type="button" onClick={() => svgRef.current && downloadSvgAsPdf(svgRef.current, 'gantt.pdf')} class={btn}>📄 PDF</button>
        <button type="button" onClick={exportCsv} class={btn}>📊 CSV</button>
        <button type="button" onClick={() => exportJson('gantt', 'gantt.json', tasks)} class={btn}>⬇ JSON</button>
        <button type="button" onClick={() => pickJson().then((d) => Array.isArray(d) && setTasks(d as Task[])).catch(() => {})} class={btn}>⬆ Import</button>
        <button type="button" onClick={fs.toggle} class={`${btn} ml-auto`}>{fs.isFull ? '⤢ Exit full screen' : '⛶ Full screen'}</button>
      </div>

      <div class="overflow-auto rounded-xl border border-slate-200 bg-white">
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} width={W} height={H} xmlns="http://www.w3.org/2000/svg" class="max-w-none" style="font-family:'Plus Jakarta Sans','Segoe UI',Arial,sans-serif">
          <rect x="0" y="0" width={W} height={H} fill="#ffffff" />
          {gridlines.map((g) => <line x1={g.x} y1={g.month ? 0 : HEAD_H - 6} x2={g.x} y2={H} stroke={g.month ? '#cbd5e1' : '#eef2f7'} stroke-width={g.month ? 1.5 : 1} />)}
          {gridlines.filter((g) => g.label).map((g) => <text x={g.x + 3} y={20} font-size="11" fill="#64748b">{g.label}</text>)}
          {Number.isFinite(todayMs) && todayMs >= min && todayMs <= max && (
            <><line x1={xOf(todayMs)} y1={HEAD_H - 10} x2={xOf(todayMs)} y2={H} stroke="#dc2626" stroke-width="1.5" stroke-dasharray="3 3" /><text x={xOf(todayMs) + 3} y={HEAD_H - 12} font-size="10" font-weight="700" fill="#dc2626">today</text></>
          )}
          <line x1={LABEL_W} y1={0} x2={LABEL_W} y2={H} stroke="#cbd5e1" stroke-width="1.5" />

          {tasks.map((t, i) => {
            const y = HEAD_H + i * ROW_H;
            const cy = y + ROW_H / 2;
            const s = toMs(t.start), e = Math.max(s, toMs(t.end));
            const ok = Number.isFinite(s) && Number.isFinite(e);
            const x1 = ok ? xOf(s) : LABEL_W;
            const w = ok ? Math.max(dayW, ((e - s) / DAY + 1) * dayW) : dayW;
            const pred = t.after ? tasks.find((p) => p.id === t.after) : undefined;
            return (
              <g>
                {i % 2 === 1 && <rect x="0" y={y} width={W} height={ROW_H} fill="#f8fafc" />}
                <text x="10" y={cy + 4} font-size="12.5" font-weight="600" fill="#334155">{t.name.length > 22 ? t.name.slice(0, 21) + '…' : t.name}</text>
                {pred && Number.isFinite(toMs(pred.end)) && ok && (
                  <path d={`M ${xOf(Math.max(toMs(pred.start), toMs(pred.end))) + dayW} ${HEAD_H + tasks.indexOf(pred) * ROW_H + ROW_H / 2} L ${x1 - 4} ${x1 < xOf(toMs(pred.end)) ? cy : cy}`} fill="none" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#gah)" opacity="0.8" />
                )}
                {ok && (t.milestone ? (
                  <path d={`M ${x1} ${cy - 9} L ${x1 + 9} ${cy} L ${x1} ${cy + 9} L ${x1 - 9} ${cy} Z`} fill="#7c3aed" stroke="#5b21b6" stroke-width="1.5" />
                ) : (
                  <>
                    <rect x={x1} y={cy - 10} width={w} height={20} rx={5} fill="#dbeafe" stroke="#1d87f1" stroke-width="1.5" />
                    <rect x={x1} y={cy - 10} width={(w * Math.max(0, Math.min(100, t.pct))) / 100} height={20} rx={5} fill="#1d87f1" />
                    {t.pct > 0 && <text x={x1 + w + 6} y={cy + 4} font-size="10.5" fill="#64748b">{t.pct}%</text>}
                  </>
                ))}
              </g>
            );
          })}
          <defs><marker id="gah" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8" /></marker></defs>
        </svg>
      </div>

      <div class="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table class="w-full text-sm">
          <thead><tr class="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <th class="px-3 py-2">Task</th><th class="px-3 py-2">Start</th><th class="px-3 py-2">End</th><th class="px-3 py-2">%</th><th class="px-2 py-2">◆</th><th class="px-3 py-2">After</th><th class="px-2 py-2"></th>
          </tr></thead>
          <tbody>
            {tasks.map((t) => (
              <tr class="border-b border-slate-100 last:border-0">
                <td class="px-3 py-1.5"><input value={t.name} onInput={(e) => set(t.id, { name: (e.target as HTMLInputElement).value })} class={`${inp} w-full min-w-32`} /></td>
                <td class="px-3 py-1.5"><input type="date" value={t.start} onInput={(e) => set(t.id, { start: (e.target as HTMLInputElement).value })} class={inp} /></td>
                <td class="px-3 py-1.5"><input type="date" value={t.end} onInput={(e) => set(t.id, { end: (e.target as HTMLInputElement).value })} class={inp} /></td>
                <td class="px-3 py-1.5"><input type="number" min={0} max={100} value={t.pct} onInput={(e) => set(t.id, { pct: Math.max(0, Math.min(100, parseInt((e.target as HTMLInputElement).value, 10) || 0)) })} class={`${inp} w-16`} /></td>
                <td class="px-2 py-1.5 text-center"><input type="checkbox" checked={t.milestone} onChange={(e) => set(t.id, { milestone: (e.target as HTMLInputElement).checked })} class="h-4 w-4 rounded border-slate-300 text-brand-600" /></td>
                <td class="px-3 py-1.5">
                  <select value={t.after} onChange={(e) => set(t.id, { after: (e.target as HTMLSelectElement).value })} class={inp}>
                    <option value="">—</option>
                    {tasks.filter((o) => o.id !== t.id).map((o) => <option value={o.id}>{o.name.slice(0, 18)}</option>)}
                  </select>
                </td>
                <td class="px-2 py-1.5"><button type="button" onClick={() => del(t.id)} class="text-slate-300 hover:text-red-600" aria-label="Delete">✕</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p class="mt-3 text-xs text-slate-500">Bars are drawn from each task's dates; the filled part shows % complete, ◆ marks milestones, and the red line is today. Saved locally; export PNG, PDF, CSV or JSON.</p>
    </div>
  );
}
