import { useRef, useState } from 'preact/hooks';
import { usePersistentState, exportJson, pickJson, uid, downloadSvgAsPng, downloadSvgAsPdf, useFullscreen } from '../../lib/persist';

type Shape = 'process' | 'decision' | 'terminator' | 'io';
interface Node { id: string; type: Shape; text: string; x: number; y: number }
interface Edge { id: string; from: string; to: string }
interface State { nodes: Node[]; edges: Edge[] }
const DIMS: Record<Shape, { w: number; h: number }> = { process: { w: 130, h: 56 }, decision: { w: 130, h: 80 }, terminator: { w: 120, h: 48 }, io: { w: 130, h: 56 } };
const INITIAL: State = {
  nodes: [
    { id: 'a', type: 'terminator', text: 'Start', x: 320, y: 40 },
    { id: 'b', type: 'process', text: 'Do the thing', x: 320, y: 150 },
    { id: 'c', type: 'decision', text: 'OK?', x: 320, y: 270 },
    { id: 'd', type: 'terminator', text: 'End', x: 320, y: 410 },
  ],
  edges: [{ id: uid(), from: 'a', to: 'b' }, { id: uid(), from: 'b', to: 'c' }, { id: uid(), from: 'c', to: 'd' }],
};

function edgePoint(cx: number, cy: number, hw: number, hh: number, ox: number, oy: number) {
  const dx = ox - cx, dy = oy - cy;
  if (!dx && !dy) return { x: cx, y: cy };
  const s = Math.min(dx ? hw / Math.abs(dx) : Infinity, dy ? hh / Math.abs(dy) : Infinity);
  return { x: cx + dx * s, y: cy + dy * s };
}

export default function FlowchartTool() {
  const [st, setSt] = usePersistentState<State>('lt.flowchart', INITIAL);
  const [sel, setSel] = useState<string | null>('b');
  const [connect, setConnect] = useState(false);
  const [connFrom, setConnFrom] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const fs = useFullscreen();
  const drag = useRef<{ id: string; ox: number; oy: number; px: number; py: number; moved: boolean } | null>(null);

  const nodeById = (id: string) => st.nodes.find((n) => n.id === id);
  const W = Math.max(760, Math.max(...st.nodes.map((n) => n.x + DIMS[n.type].w / 2)) + 60);
  const H = Math.max(460, Math.max(...st.nodes.map((n) => n.y + DIMS[n.type].h / 2)) + 60);

  function addNode(type: Shape) { const id = uid(); setSt((s) => ({ ...s, nodes: [...s.nodes, { id, type, text: type === 'decision' ? 'Yes / No?' : 'Step', x: 120, y: 120 }] })); setSel(id); }
  const rename = (id: string, text: string) => setSt((s) => ({ ...s, nodes: s.nodes.map((n) => (n.id === id ? { ...n, text } : n)) }));
  function del(id: string) { setSt((s) => ({ nodes: s.nodes.filter((n) => n.id !== id), edges: s.edges.filter((e) => e.from !== id && e.to !== id) })); setSel(null); }
  const delEdge = (id: string) => setSt((s) => ({ ...s, edges: s.edges.filter((e) => e.id !== id) }));

  function onDown(e: PointerEvent, id: string) {
    e.stopPropagation();
    if (connect) {
      if (!connFrom) setConnFrom(id);
      else { if (connFrom !== id && !st.edges.some((x) => x.from === connFrom && x.to === id)) setSt((s) => ({ ...s, edges: [...s.edges, { id: uid(), from: connFrom!, to: id }] })); setConnFrom(null); }
      return;
    }
    setSel(id);
    const n = nodeById(id)!;
    drag.current = { id, ox: n.x, oy: n.y, px: e.clientX, py: e.clientY, moved: false };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }
  function onMove(e: PointerEvent) { const d = drag.current; if (!d) return; const dx = e.clientX - d.px, dy = e.clientY - d.py; if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true; setSt((s) => ({ ...s, nodes: s.nodes.map((n) => (n.id === d.id ? { ...n, x: Math.max(60, d.ox + dx), y: Math.max(30, d.oy + dy) } : n)) })); }
  function onUp() { drag.current = null; window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); }

  const selNode = sel ? nodeById(sel) : null;
  const btn = 'rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-brand-400 disabled:opacity-40';

  return (
    <div ref={fs.ref} class={`rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6 ${fs.isFull ? 'fixed inset-0 z-[60] flex flex-col overflow-hidden !rounded-none' : ''}`}>
      <div class="mb-3 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => addNode('process')} class={btn}>▭ Process</button>
        <button type="button" onClick={() => addNode('decision')} class={btn}>◇ Decision</button>
        <button type="button" onClick={() => addNode('terminator')} class={btn}>⬭ Start/End</button>
        <button type="button" onClick={() => addNode('io')} class={btn}>▱ In/Out</button>
        <button type="button" onClick={() => { setConnect((c) => !c); setConnFrom(null); }} class={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition ${connect ? 'border-brand-500 bg-brand-50 text-brand-800' : 'border-slate-300 bg-white text-slate-600 hover:border-brand-400'}`}>🔗 Connect{connect ? ' (on)' : ''}</button>
        <button type="button" onClick={() => sel && del(sel)} class={`${btn} !text-red-600`} disabled={!sel}>🗑 Delete</button>
        <span class="mx-1 hidden h-5 w-px bg-slate-200 sm:block" />
        <button type="button" onClick={() => svgRef.current && downloadSvgAsPng(svgRef.current, 'flowchart.png')} class={btn}>🖼 PNG</button>
        <button type="button" onClick={() => svgRef.current && downloadSvgAsPdf(svgRef.current, 'flowchart.pdf')} class={btn}>📄 PDF</button>
        <button type="button" onClick={() => exportJson('flowchart', 'flowchart.json', st)} class={btn}>⬇ JSON</button>
        <button type="button" onClick={() => pickJson().then((d) => d && (setSt(d as State), setSel(null))).catch(() => {})} class={btn}>⬆ Import</button>
        <button type="button" onClick={fs.toggle} class={`${btn} ml-auto`}>{fs.isFull ? '⤢ Exit full screen' : '⛶ Full screen'}</button>
      </div>

      {connect && <p class="mb-2 text-sm font-medium text-brand-700">Connect mode: click a shape, then the shape to point to. {connFrom ? 'Now click the target.' : ''}</p>}
      {selNode && !connect && (
        <div class="mb-3 flex items-center gap-2">
          <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Text:</label>
          <input value={selNode.text} onInput={(e) => rename(selNode.id, (e.target as HTMLInputElement).value)} class="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:border-brand-500 focus:outline-none" />
        </div>
      )}

      <div class={`overflow-auto rounded-xl border border-slate-200 bg-white ${fs.isFull ? 'flex-1' : ''}`}>
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} width={W} height={H} xmlns="http://www.w3.org/2000/svg" class="max-w-none touch-none select-none" style="font-family:'Plus Jakarta Sans','Segoe UI',Arial,sans-serif">
          <defs><marker id="fah" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#64748b" /></marker></defs>
          <rect x="0" y="0" width={W} height={H} fill="#ffffff" />
          {st.edges.map((e) => {
            const a = nodeById(e.from), b = nodeById(e.to); if (!a || !b) return null;
            const da = DIMS[a.type], db = DIMS[b.type];
            const p1 = edgePoint(a.x, a.y, da.w / 2, da.h / 2, b.x, b.y);
            const p2 = edgePoint(b.x, b.y, db.w / 2, db.h / 2, a.x, a.y);
            return <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#64748b" stroke-width="2" marker-end="url(#fah)" style="cursor:pointer" onClick={() => confirm('Delete this connector?') && delEdge(e.id)} />;
          })}
          {st.nodes.map((n) => {
            const { w, h } = DIMS[n.type]; const selHere = n.id === sel || n.id === connFrom;
            const stroke = n.id === connFrom ? '#dc2626' : '#1d87f1'; const sw = selHere ? 3 : 2;
            const fill = n.type === 'terminator' ? '#eef9ff' : '#ffffff';
            let shape;
            if (n.type === 'decision') shape = <polygon points={`${n.x},${n.y - h / 2} ${n.x + w / 2},${n.y} ${n.x},${n.y + h / 2} ${n.x - w / 2},${n.y}`} fill={fill} stroke={stroke} stroke-width={sw} />;
            else if (n.type === 'io') shape = <polygon points={`${n.x - w / 2 + 16},${n.y - h / 2} ${n.x + w / 2},${n.y - h / 2} ${n.x + w / 2 - 16},${n.y + h / 2} ${n.x - w / 2},${n.y + h / 2}`} fill={fill} stroke={stroke} stroke-width={sw} />;
            else shape = <rect x={n.x - w / 2} y={n.y - h / 2} width={w} height={h} rx={n.type === 'terminator' ? h / 2 : 8} fill={fill} stroke={stroke} stroke-width={sw} />;
            return (
              <g style={connect ? 'cursor:crosshair' : 'cursor:grab'} onPointerDown={(ev) => onDown(ev as unknown as PointerEvent, n.id)}>
                {shape}
                <text x={n.x} y={n.y + 5} text-anchor="middle" font-size="13" font-weight="600" fill="#1e293b">{n.text.length > 18 ? n.text.slice(0, 17) + '…' : n.text}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <p class="mt-3 text-xs text-slate-500">Add shapes, drag to arrange, and use Connect to draw arrows between them (click a connector to delete it). Saved locally; export PNG/PDF/JSON.</p>
    </div>
  );
}
