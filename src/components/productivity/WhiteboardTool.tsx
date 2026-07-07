import { useEffect, useRef, useState } from 'preact/hooks';
import { usePersistentState, downloadBlob, useFullscreen } from '../../lib/persist';

interface Stroke { color: string; size: number; pts: [number, number][] }
const CW = 1000, CH = 620;
const COLORS = ['#0f172a', '#dc2626', '#1d87f1', '#059669', '#f59e0b', '#7c3aed', '#ffffff'];

export default function WhiteboardTool() {
  const [strokes, setStrokes] = usePersistentState<Stroke[]>('lt.whiteboard', []);
  const [color, setColor] = useState('#0f172a');
  const [size, setSize] = useState(4);
  const [eraser, setEraser] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cur = useRef<Stroke | null>(null);
  const fs = useFullscreen();

  function redraw() {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, CW, CH);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const s of strokes) drawStroke(ctx, s);
  }
  function drawStroke(ctx: CanvasRenderingContext2D, s: Stroke) {
    if (s.pts.length < 1) return;
    ctx.strokeStyle = s.color; ctx.lineWidth = s.size;
    ctx.beginPath();
    ctx.moveTo(s.pts[0]![0], s.pts[0]![1]);
    if (s.pts.length === 1) { ctx.lineTo(s.pts[0]![0] + 0.1, s.pts[0]![1]); }
    else for (let i = 1; i < s.pts.length; i++) ctx.lineTo(s.pts[i]![0], s.pts[i]![1]);
    ctx.stroke();
  }
  useEffect(() => { redraw(); }, [strokes]);

  function pos(e: PointerEvent): [number, number] {
    const r = canvasRef.current!.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * CW, ((e.clientY - r.top) / r.height) * CH];
  }
  function move(e: PointerEvent) {
    if (!cur.current) return;
    e.preventDefault();
    cur.current.pts.push(pos(e));
    const ctx = canvasRef.current!.getContext('2d')!;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    drawStroke(ctx, { ...cur.current, pts: cur.current.pts.slice(-2) });
  }
  function up() {
    const stroke = cur.current;
    cur.current = null;
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', up);
    if (stroke && stroke.pts.length) setStrokes((s) => [...s, stroke]);
  }
  function down(e: PointerEvent) {
    cur.current = { color: eraser ? '#ffffff' : color, size: eraser ? size * 4 : size, pts: [pos(e)] };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  const undo = () => setStrokes((s) => s.slice(0, -1));
  const clear = () => { if (strokes.length && !confirm('Clear the whiteboard?')) return; setStrokes([]); };
  function savePng() { canvasRef.current!.toBlob((b) => b && downloadBlob(b, 'whiteboard.png'), 'image/png'); }

  const btn = 'rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-brand-400 disabled:opacity-40';

  return (
    <div ref={fs.ref} class={`rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6 ${fs.isFull ? 'fixed inset-0 z-[60] flex flex-col overflow-hidden !rounded-none' : ''}`}>
      <div class="mb-3 flex flex-wrap items-center gap-2">
        <div class="flex gap-1">
          {COLORS.map((c) => (
            <button type="button" onClick={() => { setColor(c); setEraser(false); }} class={`h-7 w-7 rounded-full border-2 ${color === c && !eraser ? 'border-brand-500 ring-2 ring-brand-200' : 'border-slate-300'}`} style={`background:${c}`} aria-label={`Colour ${c}`} title={c} />
          ))}
          <input type="color" value={color} onInput={(e) => { setColor((e.target as HTMLInputElement).value); setEraser(false); }} class="h-7 w-7 cursor-pointer rounded-full border border-slate-300 bg-transparent" title="Custom colour" />
        </div>
        <span class="mx-1 h-5 w-px bg-slate-200" />
        <button type="button" onClick={() => setEraser((x) => !x)} class={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition ${eraser ? 'border-brand-500 bg-brand-50 text-brand-800' : 'border-slate-300 bg-white text-slate-600 hover:border-brand-400'}`}>🧽 Eraser</button>
        <label class="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Size<input type="range" min={1} max={30} value={size} onInput={(e) => setSize(parseInt((e.target as HTMLInputElement).value, 10))} class="w-24 accent-brand-600" /></label>
        <span class="mx-1 h-5 w-px bg-slate-200" />
        <button type="button" onClick={undo} class={btn} disabled={!strokes.length}>↶ Undo</button>
        <button type="button" onClick={clear} class={`${btn} !text-red-600`}>Clear</button>
        <button type="button" onClick={savePng} class={btn}>🖼 PNG</button>
        <button type="button" onClick={fs.toggle} class={`${btn} ml-auto`}>{fs.isFull ? '⤢ Exit full screen' : '⛶ Full screen'}</button>
      </div>

      <div class={`overflow-auto rounded-xl border border-slate-200 bg-white ${fs.isFull ? 'flex-1' : ''}`}>
        <canvas
          ref={canvasRef}
          width={CW}
          height={CH}
          onPointerDown={(e) => down(e as unknown as PointerEvent)}
          class="block max-w-none touch-none"
          style={`cursor:crosshair;width:${CW}px;height:${CH}px`}
        />
      </div>
      <p class="mt-3 text-xs text-slate-500">A quick sketch pad — draw with the pen, wipe with the eraser, undo strokes, export a PNG. Auto-saved in this browser only.</p>
    </div>
  );
}
