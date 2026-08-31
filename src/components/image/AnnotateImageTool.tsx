import { useRef, useState, useEffect } from 'preact/hooks';

type Tool = 'pen' | 'arrow' | 'rect' | 'text';
interface Shape { tool: Tool; color: string; width: number; x1: number; y1: number; x2: number; y2: number; text?: string; pts?: [number, number][]; }

const COLORS = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#0f172a', '#ffffff'];

export default function AnnotateImageTool() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [tool, setTool] = useState<Tool>('arrow');
  const [color, setColor] = useState('#ef4444');
  const [width, setWidth] = useState(4);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const draft = useRef<Shape | null>(null);
  const drawing = useRef(false);

  function redraw() {
    const c = canvasRef.current; if (!c || !img) return;
    const ctx = c.getContext('2d')!;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.drawImage(img, 0, 0);
    for (const s of [...shapes, draft.current].filter(Boolean) as Shape[]) drawShape(ctx, s);
  }
  useEffect(redraw, [img, shapes]);

  function drawShape(ctx: CanvasRenderingContext2D, s: Shape) {
    ctx.strokeStyle = s.color; ctx.fillStyle = s.color; ctx.lineWidth = s.width; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (s.tool === 'rect') { ctx.strokeRect(s.x1, s.y1, s.x2 - s.x1, s.y2 - s.y1); return; }
    if (s.tool === 'text') { ctx.font = `bold ${s.width * 6 + 10}px system-ui, sans-serif`; ctx.fillText(s.text ?? '', s.x1, s.y1); return; }
    if (s.tool === 'pen' && s.pts) { ctx.beginPath(); s.pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); return; }
    if (s.tool === 'arrow') {
      ctx.beginPath(); ctx.moveTo(s.x1, s.y1); ctx.lineTo(s.x2, s.y2); ctx.stroke();
      const a = Math.atan2(s.y2 - s.y1, s.x2 - s.x1), h = s.width * 3 + 6;
      ctx.beginPath(); ctx.moveTo(s.x2, s.y2);
      ctx.lineTo(s.x2 - h * Math.cos(a - Math.PI / 6), s.y2 - h * Math.sin(a - Math.PI / 6));
      ctx.lineTo(s.x2 - h * Math.cos(a + Math.PI / 6), s.y2 - h * Math.sin(a + Math.PI / 6));
      ctx.closePath(); ctx.fill();
    }
  }

  function onFile(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0]; if (!f) return;
    const im = new Image();
    im.onload = () => { setShapes([]); setImg(im); };
    im.src = URL.createObjectURL(f);
  }

  const pos = (e: PointerEvent) => { const c = canvasRef.current!; const r = c.getBoundingClientRect(); return { x: (e.clientX - r.left) * (c.width / r.width), y: (e.clientY - r.top) * (c.height / r.height) }; };

  function down(e: PointerEvent) {
    if (!img) return;
    const p = pos(e);
    if (tool === 'text') {
      const t = prompt('Text to add:'); if (!t) return;
      setShapes((s) => [...s, { tool, color, width, x1: p.x, y1: p.y, x2: p.x, y2: p.y, text: t }]);
      return;
    }
    drawing.current = true;
    draft.current = { tool, color, width, x1: p.x, y1: p.y, x2: p.x, y2: p.y, pts: tool === 'pen' ? [[p.x, p.y]] : undefined };
    canvasRef.current!.setPointerCapture(e.pointerId);
  }
  function move(e: PointerEvent) {
    if (!drawing.current || !draft.current) return;
    const p = pos(e);
    draft.current.x2 = p.x; draft.current.y2 = p.y;
    if (draft.current.tool === 'pen') draft.current.pts!.push([p.x, p.y]);
    redraw();
  }
  function up() {
    if (draft.current) { setShapes((s) => [...s, draft.current!]); draft.current = null; }
    drawing.current = false;
  }

  function download() {
    const c = canvasRef.current!;
    c.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'annotated.png'; a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  }

  const btn = (t: Tool, label: string) => (
    <button type="button" onClick={() => setTool(t)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${tool === t ? 'bg-brand-600 text-white' : 'bg-white text-slate-700 ring-1 ring-slate-300 hover:ring-brand-400'}`}>{label}</button>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      {!img && (
        <label class="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 text-center transition hover:border-brand-400">
          <input type="file" accept="image/*" onChange={onFile} class="sr-only" />
          <span class="text-sm font-semibold text-brand-700">Choose a screenshot or image to annotate</span>
          <span class="mt-1 block text-xs text-slate-500">Edited on your device, never uploaded</span>
        </label>
      )}

      {img && (
        <div>
          <div class="mb-3 flex flex-wrap items-center gap-2">
            {btn('arrow', '↗ Arrow')}{btn('rect', '▭ Box')}{btn('pen', '✎ Pen')}{btn('text', 'T Text')}
            <span class="mx-1 flex gap-1">{COLORS.map((c) => <button type="button" onClick={() => setColor(c)} class={`h-6 w-6 rounded-full border-2 ${color === c ? 'border-slate-800 ring-2 ring-brand-200' : 'border-slate-300'}`} style={`background:${c}`} />)}</span>
            <label class="flex items-center gap-1 text-sm text-slate-600">Size <input type="range" min={2} max={12} value={width} onInput={(e) => setWidth(Number((e.target as HTMLInputElement).value))} class="w-20 accent-brand-600" /></label>
            <button type="button" onClick={() => setShapes((s) => s.slice(0, -1))} disabled={!shapes.length} class="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-300 hover:ring-brand-400 disabled:opacity-40">↶ Undo</button>
          </div>
          <div class="overflow-auto rounded-xl border border-slate-200 bg-slate-100" tabIndex={0} aria-label="Annotation canvas">
            <canvas ref={canvasRef} width={img.naturalWidth} height={img.naturalHeight} onPointerDown={down} onPointerMove={move} onPointerUp={up} class="max-w-full touch-none" style="max-height:60vh" />
          </div>
          <div class="mt-3 flex justify-end">
            <button type="button" onClick={download} class="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">⬇ Download PNG</button>
          </div>
        </div>
      )}

      <p class="mt-4 rounded-lg bg-white px-3 py-2 text-xs text-slate-500 ring-1 ring-slate-200">
        Mark up screenshots and photos with arrows, boxes, freehand pen and text, then export a PNG, perfect for bug reports, how-to guides and feedback. Everything is drawn on a canvas in your browser, so internal screenshots never leave your device. 🔒
      </p>
    </div>
  );
}
