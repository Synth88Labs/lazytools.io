import { useRef, useState } from 'preact/hooks';
import { usePersistentState, exportJson, pickJson, uid, downloadSvgAsPng, downloadSvgAsPdf, useFullscreen } from '../../lib/persist';

interface Lane { id: string; title: string }
interface Step { id: string; lane: number; col: number; text: string }
interface Edge { id: string; from: string; to: string }
interface State { lanes: Lane[]; steps: Step[]; edges: Edge[] }

const LABEL_W = 132;
const COL_W = 176;
const LANE_H = 120;
const STEP_W = 140;
const STEP_H = 56;
const TOP = 8;
const LANE_FILLS = ['#ffffff', '#f8fafc'];

const INITIAL: State = {
  lanes: [
    { id: 'l1', title: 'Customer' },
    { id: 'l2', title: 'Sales' },
    { id: 'l3', title: 'Warehouse' },
  ],
  steps: [
    { id: 's1', lane: 0, col: 0, text: 'Place order' },
    { id: 's2', lane: 1, col: 1, text: 'Confirm order' },
    { id: 's3', lane: 2, col: 2, text: 'Pick & pack' },
    { id: 's4', lane: 2, col: 3, text: 'Ship' },
    { id: 's5', lane: 0, col: 4, text: 'Receive goods' },
  ],
  edges: [
    { id: 'e1', from: 's1', to: 's2' },
    { id: 'e2', from: 's2', to: 's3' },
    { id: 'e3', from: 's3', to: 's4' },
    { id: 'e4', from: 's4', to: 's5' },
  ],
};

const cx = (col: number) => LABEL_W + col * COL_W + COL_W / 2;
const cyOf = (lane: number) => TOP + lane * LANE_H + LANE_H / 2;

/** Border intersection point of a box, toward (ox,oy). */
function edgePoint(px: number, py: number, ox: number, oy: number) {
  const dx = ox - px, dy = oy - py;
  if (!dx && !dy) return { x: px, y: py };
  const s = Math.min(dx ? (STEP_W / 2) / Math.abs(dx) : Infinity, dy ? (STEP_H / 2) / Math.abs(dy) : Infinity);
  return { x: px + dx * s, y: py + dy * s };
}

export default function SwimlaneTool() {
  const [st, setSt] = usePersistentState<State>('lt.swimlane', INITIAL);
  const [sel, setSel] = useState<string | null>('s2');
  const [selLane, setSelLane] = useState<number>(0);
  const [connect, setConnect] = useState(false);
  const [connFrom, setConnFrom] = useState<string | null>(null);
  const [dragging, setDragging] = useState<{ id: string; dx: number; dy: number } | null>(null);
  const drag = useRef<{ id: string; col: number; lane: number; px: number; py: number; moved: boolean } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const fs = useFullscreen();

  const stepById = (id: string) => st.steps.find((s) => s.id === id);
  const maxCol = Math.max(0, ...st.steps.map((s) => s.col));
  const W = LABEL_W + (maxCol + 1) * COL_W + 24;
  const H = TOP + st.lanes.length * LANE_H + 8;

  function addStep() {
    const lane = Math.min(selLane, st.lanes.length - 1);
    const colsInLane = st.steps.filter((s) => s.lane === lane).map((s) => s.col);
    const col = colsInLane.length ? Math.max(...colsInLane) + 1 : maxCol + (st.steps.length ? 1 : 0);
    const id = uid();
    setSt((s) => ({ ...s, steps: [...s.steps, { id, lane, col, text: 'Step' }] }));
    setSel(id);
  }
  const rename = (id: string, text: string) => setSt((s) => ({ ...s, steps: s.steps.map((x) => (x.id === id ? { ...x, text } : x)) }));
  function delStep(id: string) { setSt((s) => ({ ...s, steps: s.steps.filter((x) => x.id !== id), edges: s.edges.filter((e) => e.from !== id && e.to !== id) })); setSel(null); }
  const delEdge = (id: string) => setSt((s) => ({ ...s, edges: s.edges.filter((e) => e.id !== id) }));

  function addLane() { setSt((s) => ({ ...s, lanes: [...s.lanes, { id: uid(), title: `Lane ${s.lanes.length + 1}` }] })); }
  const renameLane = (i: number, title: string) => setSt((s) => ({ ...s, lanes: s.lanes.map((l, idx) => (idx === i ? { ...l, title } : l)) }));
  function delLane(i: number) {
    if (st.lanes.length <= 1) return;
    const removedStepIds = new Set(st.steps.filter((s) => s.lane === i).map((s) => s.id));
    setSt((s) => ({
      lanes: s.lanes.filter((_, idx) => idx !== i),
      steps: s.steps.filter((x) => x.lane !== i).map((x) => (x.lane > i ? { ...x, lane: x.lane - 1 } : x)),
      edges: s.edges.filter((e) => !removedStepIds.has(e.from) && !removedStepIds.has(e.to)),
    }));
    setSelLane((l) => Math.max(0, Math.min(l, st.lanes.length - 2)));
  }

  function onDown(e: PointerEvent, id: string) {
    e.stopPropagation();
    const step = stepById(id)!;
    setSel(id);
    setSelLane(step.lane);
    if (connect) {
      if (!connFrom) setConnFrom(id);
      else { if (connFrom !== id && !st.edges.some((x) => x.from === connFrom && x.to === id)) setSt((s) => ({ ...s, edges: [...s.edges, { id: uid(), from: connFrom!, to: id }] })); setConnFrom(null); }
      return;
    }
    drag.current = { id, col: step.col, lane: step.lane, px: e.clientX, py: e.clientY, moved: false };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }
  function onMove(e: PointerEvent) {
    const d = drag.current; if (!d) return;
    const dx = e.clientX - d.px, dy = e.clientY - d.py;
    if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true;
    setDragging({ id: d.id, dx, dy });
  }
  function onUp() {
    const d = drag.current;
    if (d && d.moved) {
      const dr = dragging;
      const dx = dr?.dx ?? 0, dy = dr?.dy ?? 0;
      const newCol = Math.max(0, d.col + Math.round(dx / COL_W));
      const newLane = Math.max(0, Math.min(st.lanes.length - 1, d.lane + Math.round(dy / LANE_H)));
      setSt((s) => ({ ...s, steps: s.steps.map((x) => (x.id === d.id ? { ...x, col: newCol, lane: newLane } : x)) }));
    }
    drag.current = null;
    setDragging(null);
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
  }

  const selStep = sel ? stepById(sel) : null;
  const btn = 'rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-brand-400 disabled:opacity-40';

  return (
    <div ref={fs.ref} class={`rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6 ${fs.isFull ? 'fixed inset-0 z-[60] flex flex-col overflow-hidden !rounded-none' : ''}`}>
      <div class="mb-3 flex flex-wrap items-center gap-2">
        <button type="button" onClick={addStep} class={btn}>▭ Add step</button>
        <button type="button" onClick={addLane} class={btn}>＋ Add lane</button>
        <button type="button" onClick={() => { setConnect((c) => !c); setConnFrom(null); }} class={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition ${connect ? 'border-brand-500 bg-brand-50 text-brand-800' : 'border-slate-300 bg-white text-slate-600 hover:border-brand-400'}`}>🔗 Connect{connect ? ' (on)' : ''}</button>
        <button type="button" onClick={() => sel && delStep(sel)} class={`${btn} !text-red-600`} disabled={!sel}>🗑 Delete step</button>
        <span class="mx-1 hidden h-5 w-px bg-slate-200 sm:block" />
        <button type="button" onClick={() => svgRef.current && downloadSvgAsPng(svgRef.current, 'swimlane.png')} class={btn}>🖼 PNG</button>
        <button type="button" onClick={() => svgRef.current && downloadSvgAsPdf(svgRef.current, 'swimlane.pdf')} class={btn}>📄 PDF</button>
        <button type="button" onClick={() => exportJson('swimlane', 'swimlane.json', st)} class={btn}>⬇ JSON</button>
        <button type="button" onClick={() => pickJson().then((d) => d && (setSt(d as State), setSel(null))).catch(() => {})} class={btn}>⬆ Import</button>
        <button type="button" onClick={fs.toggle} class={`${btn} ml-auto`}>{fs.isFull ? '⤢ Exit full screen' : '⛶ Full screen'}</button>
      </div>

      {connect && <p class="mb-2 text-sm font-medium text-brand-700">Connect mode: click a step, then the next step it flows to. {connFrom ? 'Now click the target.' : ''}</p>}
      {selStep && !connect && (
        <div class="mb-3 flex flex-wrap items-center gap-2">
          <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Step text:</label>
          <input value={selStep.text} onInput={(e) => rename(selStep.id, (e.target as HTMLInputElement).value)} class="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:border-brand-500 focus:outline-none" />
          <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Lane:</label>
          <select value={selStep.lane} onChange={(e) => { const lane = Number((e.target as HTMLSelectElement).value); setSt((s) => ({ ...s, steps: s.steps.map((x) => (x.id === selStep.id ? { ...x, lane } : x)) })); }} class="rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none">
            {st.lanes.map((l, i) => <option value={i}>{l.title || `Lane ${i + 1}`}</option>)}
          </select>
        </div>
      )}

      <div class="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white p-2">
        <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Lanes:</span>
        {st.lanes.map((l, i) => (
          <span class={`flex items-center gap-1 rounded-md border px-1.5 py-1 ${selLane === i ? 'border-brand-400 bg-brand-50' : 'border-slate-200'}`}>
            <input value={l.title} onFocus={() => setSelLane(i)} onInput={(e) => renameLane(i, (e.target as HTMLInputElement).value)} class="w-24 bg-transparent text-sm font-medium text-slate-800 focus:outline-none" />
            <button type="button" onClick={() => delLane(i)} disabled={st.lanes.length <= 1} title="Delete lane" class="text-slate-400 hover:text-red-600 disabled:opacity-30">×</button>
          </span>
        ))}
      </div>

      <div class={`overflow-auto rounded-xl border border-slate-200 bg-white ${fs.isFull ? 'flex-1' : ''}`}>
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} width={W} height={H} xmlns="http://www.w3.org/2000/svg" class="max-w-none touch-none select-none" style="font-family:'Plus Jakarta Sans','Segoe UI',Arial,sans-serif">
          <defs><marker id="swah" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#64748b" /></marker></defs>
          <rect x="0" y="0" width={W} height={H} fill="#ffffff" />
          {/* lane bands + titles */}
          {st.lanes.map((l, i) => (
            <g>
              <rect x="0" y={TOP + i * LANE_H} width={W} height={LANE_H} fill={LANE_FILLS[i % 2]} stroke="#e2e8f0" stroke-width="1" />
              <rect x="0" y={TOP + i * LANE_H} width={LABEL_W} height={LANE_H} fill="#f1f5f9" stroke="#e2e8f0" stroke-width="1" />
              <text x={LABEL_W / 2} y={TOP + i * LANE_H + LANE_H / 2 + 4} text-anchor="middle" font-size="13" font-weight="700" fill="#334155">{(l.title || `Lane ${i + 1}`).slice(0, 16)}</text>
            </g>
          ))}
          {/* edges */}
          {st.edges.map((e) => {
            const a = stepById(e.from), b = stepById(e.to); if (!a || !b) return null;
            const ax = cx(a.col), ay = cyOf(a.lane), bx = cx(b.col), by = cyOf(b.lane);
            const p1 = edgePoint(ax, ay, bx, by);
            const p2 = edgePoint(bx, by, ax, ay);
            return <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#64748b" stroke-width="2" marker-end="url(#swah)" style="cursor:pointer" onClick={() => confirm('Delete this connector?') && delEdge(e.id)} />;
          })}
          {/* steps */}
          {st.steps.map((s) => {
            const off = dragging && dragging.id === s.id ? dragging : null;
            const x = cx(s.col) + (off?.dx ?? 0), y = cyOf(s.lane) + (off?.dy ?? 0);
            const selHere = s.id === sel || s.id === connFrom;
            const stroke = s.id === connFrom ? '#dc2626' : '#1d87f1';
            return (
              <g style={connect ? 'cursor:crosshair' : 'cursor:grab'} onPointerDown={(ev) => onDown(ev as unknown as PointerEvent, s.id)}>
                <rect x={x - STEP_W / 2} y={y - STEP_H / 2} width={STEP_W} height={STEP_H} rx="8" fill="#ffffff" stroke={stroke} stroke-width={selHere ? 3 : 2} />
                <text x={x} y={y + 5} text-anchor="middle" font-size="13" font-weight="600" fill="#1e293b">{s.text.length > 18 ? s.text.slice(0, 17) + '…' : s.text}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <p class="mt-3 text-xs text-slate-500">Each row is a lane (a person, team or system). Add steps, drag them between lanes and along the timeline (they snap to the grid), and use Connect to draw the process flow. Saved locally; export PNG/PDF/JSON. 🔒</p>
    </div>
  );
}
