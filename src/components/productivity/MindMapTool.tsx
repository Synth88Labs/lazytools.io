import { useRef, useState } from 'preact/hooks';
import { usePersistentState, exportJson, pickJson, uid, downloadSvgAsPng, downloadSvgAsPdf, useFullscreen } from '../../lib/persist';

interface Node { id: string; parent: string | null; text: string; fx?: number; fy?: number }
const ROOT = 'root';
const INITIAL: Node[] = [
  { id: ROOT, parent: null, text: 'Central idea' },
  { id: uid(), parent: ROOT, text: 'Branch A' },
  { id: uid(), parent: ROOT, text: 'Branch B' },
];
const COL_W = 200, ROW_H = 46, PAD = 40, CH = 8.2;
const BRANCH = ['#1d87f1', '#059669', '#b45309', '#7c3aed', '#dc2626', '#0891b2'];
const nodeW = (t: string) => Math.max(90, Math.min(240, t.length * CH + 26));

export default function MindMapTool() {
  const [nodes, setNodes] = usePersistentState<Node[]>('lt.mindmap', INITIAL);
  const [sel, setSel] = useState<string>(ROOT);
  const svgRef = useRef<SVGSVGElement>(null);
  const fs = useFullscreen();
  const drag = useRef<{ ids: string[]; start: Record<string, { x: number; y: number }>; px: number; py: number; moved: boolean } | null>(null);

  const kids = (id: string) => nodes.filter((n) => n.parent === id);
  const selNode = nodes.find((n) => n.id === sel);

  // auto layout (grid units) → pixels
  const auto: Record<string, { x: number; y: number }> = {};
  let leaf = 0;
  const place = (id: string, depth: number): number => {
    const cs = kids(id);
    if (!cs.length) { const y = leaf++; auto[id] = { x: PAD + depth * COL_W, y: PAD + y * ROW_H + ROW_H / 2 }; return auto[id]!.y; }
    const ys = cs.map((c) => place(c.id, depth + 1));
    const y = (ys[0]! + ys[ys.length - 1]!) / 2;
    auto[id] = { x: PAD + depth * COL_W, y };
    return y;
  };
  place(ROOT, 0);
  const posOf = (n: Node) => ({ x: n.fx ?? auto[n.id]!.x, y: n.fy ?? auto[n.id]!.y });
  const all = nodes.map(posOf);
  const W = Math.max(600, Math.max(...all.map((p) => p.x)) + 260);
  const H = Math.max(300, Math.max(...all.map((p) => p.y)) + PAD);

  const descendants = (id: string): string[] => {
    const out = [id]; let i = 0;
    while (i < out.length) { const cur = out[i++]!; for (const n of nodes) if (n.parent === cur) out.push(n.id); }
    return out;
  };
  const branchColor = (id: string): string => {
    let n = nodes.find((x) => x.id === id);
    if (!n || n.parent === null) return '#153056';
    while (n && n.parent !== ROOT) n = nodes.find((x) => x.id === n!.parent);
    const top = kids(ROOT).findIndex((c) => c.id === n!.id);
    return BRANCH[Math.max(0, top) % BRANCH.length]!;
  };

  function addChild(parent: string) { const id = uid(); setNodes((ns) => [...ns, { id, parent, text: 'New idea' }]); setSel(id); }
  function addSibling(id: string) { const n = nodes.find((x) => x.id === id); if (!n || n.parent === null) return addChild(id); addChild(n.parent); }
  function del(id: string) { if (id === ROOT) return; const doomed = new Set(descendants(id)); setNodes((ns) => ns.filter((n) => !doomed.has(n.id))); setSel(ROOT); }
  const rename = (id: string, text: string) => setNodes((ns) => ns.map((n) => (n.id === id ? { ...n, text } : n)));
  const retidy = () => setNodes((ns) => ns.map((n) => ({ id: n.id, parent: n.parent, text: n.text })));

  // --- drag (moves the whole subtree) ---
  function onDown(e: PointerEvent, id: string) {
    e.stopPropagation();
    setSel(id);
    const ids = descendants(id);
    const start: Record<string, { x: number; y: number }> = {};
    ids.forEach((i) => { const n = nodes.find((x) => x.id === i)!; start[i] = posOf(n); });
    drag.current = { ids, start, px: e.clientX, py: e.clientY, moved: false };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }
  function onMove(e: PointerEvent) {
    const d = drag.current; if (!d) return;
    const dx = e.clientX - d.px, dy = e.clientY - d.py;
    if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true;
    setNodes((ns) => ns.map((n) => (d.ids.includes(n.id) ? { ...n, fx: d.start[n.id]!.x + dx, fy: d.start[n.id]!.y + dy } : n)));
  }
  function onUp() { drag.current = null; window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); }

  const btn = 'rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-brand-400 disabled:opacity-40';

  return (
    <div ref={fs.ref} class={`rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6 ${fs.isFull ? 'flex h-screen flex-col overflow-hidden' : ''}`}>
      <div class="mb-3 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => addChild(sel)} class={btn}>＋ Child</button>
        <button type="button" onClick={() => addSibling(sel)} class={btn} disabled={sel === ROOT}>＋ Sibling</button>
        <button type="button" onClick={() => del(sel)} class={`${btn} !text-red-600`} disabled={sel === ROOT}>🗑 Delete</button>
        <button type="button" onClick={retidy} class={btn} title="Reset all manual positions">↹ Re-tidy</button>
        <span class="mx-1 hidden h-5 w-px bg-slate-200 sm:block" />
        <button type="button" onClick={() => svgRef.current && downloadSvgAsPng(svgRef.current, 'mindmap.png')} class={btn}>🖼 PNG</button>
        <button type="button" onClick={() => svgRef.current && downloadSvgAsPdf(svgRef.current, 'mindmap.pdf')} class={btn}>📄 PDF</button>
        <button type="button" onClick={() => exportJson('mindmap', 'mindmap.json', nodes)} class={btn}>⬇ JSON</button>
        <button type="button" onClick={() => pickJson().then((d) => Array.isArray(d) && (setNodes(d as Node[]), setSel(ROOT))).catch(() => {})} class={btn}>⬆ Import</button>
        <button type="button" onClick={fs.toggle} class={`${btn} ml-auto`}>{fs.isFull ? '⤢ Exit full screen' : '⛶ Full screen'}</button>
      </div>

      {selNode && (
        <div class="mb-3 flex items-center gap-2">
          <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Selected:</label>
          <input value={selNode.text} onInput={(e) => rename(sel, (e.target as HTMLInputElement).value)} class="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:border-brand-500 focus:outline-none" placeholder="Node text" />
        </div>
      )}

      <div class={`overflow-auto rounded-xl border border-slate-200 bg-white ${fs.isFull ? 'flex-1' : ''}`}>
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} width={W} height={H} xmlns="http://www.w3.org/2000/svg" class="max-w-none touch-none select-none" style="font-family:'Plus Jakarta Sans','Segoe UI',Arial,sans-serif">
          <rect x="0" y="0" width={W} height={H} fill="#ffffff" />
          {nodes.filter((n) => n.parent).map((n) => {
            const parent = nodes.find((x) => x.id === n.parent)!;
            const p = posOf(parent), c = posOf(n);
            const pw = nodeW(parent.text);
            const x1 = (parent.parent === null ? p.x + pw : p.x + pw / 2), x2 = c.x - nodeW(n.text) / 2;
            const mid = (x1 + x2) / 2;
            return <path d={`M ${x1} ${p.y} C ${mid} ${p.y}, ${mid} ${c.y}, ${x2} ${c.y}`} fill="none" stroke={branchColor(n.id)} stroke-width="2.5" opacity="0.7" />;
          })}
          {nodes.map((n) => {
            const c = posOf(n), w = nodeW(n.text), isRoot = n.parent === null, color = branchColor(n.id), selected = n.id === sel;
            const bx = isRoot ? c.x : c.x - w / 2;
            return (
              <g style="cursor:grab" onPointerDown={(e) => onDown(e as unknown as PointerEvent, n.id)} onDblClick={() => addChild(n.id)}>
                <rect x={bx} y={c.y - 17} width={w} height={34} rx={17} fill={isRoot ? '#153056' : '#ffffff'} stroke={color} stroke-width={selected ? 3.5 : 2} />
                <text x={bx + w / 2} y={c.y + 5} text-anchor="middle" font-size="14" font-weight={isRoot ? 800 : 600} fill={isRoot ? '#ffffff' : '#1e293b'}>
                  {n.text.length > 26 ? n.text.slice(0, 25) + '…' : n.text}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p class="mt-3 text-xs text-slate-500">Drag any node to reposition its branch · double-click a node to add a child · "Re-tidy" restores the automatic layout. Saved locally; export PNG/PDF/JSON.</p>
    </div>
  );
}
