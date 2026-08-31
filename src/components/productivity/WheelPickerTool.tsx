import { useEffect, useRef, useState } from 'preact/hooks';
import { rotationToLandOn, winnerIndexAt } from '../../lib/wheel';

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];
const norm = (d: number) => ((d % 360) + 360) % 360;

export default function WheelPickerTool() {
  const [text, setText] = useState('Alice\nBob\nCharlie\nDana\nElliot\nFatima\nGrace\nHiro');
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [removeAfter, setRemoveAfter] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raf = useRef<number>(0);

  const entries = text.split('\n').map((s) => s.trim()).filter(Boolean);

  function draw(rot: number) {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d')!;
    const size = c.width;
    const cx = size / 2, cy = size / 2, r = size / 2 - 4;
    ctx.clearRect(0, 0, size, size);
    const n = entries.length;
    if (n === 0) {
      ctx.fillStyle = '#e2e8f0'; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#64748b'; ctx.font = '15px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('Add entries →', cx, cy);
      return;
    }
    const seg = (Math.PI * 2) / n;
    // Segment i is drawn clockwise from the top; the whole wheel is rotated by `rot`.
    // Canvas 0rad is at 3 o'clock, so offset by -90° to start segment 0 at the top.
    const base = (norm(rot) * Math.PI) / 180 - Math.PI / 2;
    for (let i = 0; i < n; i++) {
      const a0 = base + i * seg, a1 = a0 + seg;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, a0, a1); ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length]!; ctx.fill();
      // label
      ctx.save();
      ctx.translate(cx, cy); ctx.rotate(a0 + seg / 2); ctx.textAlign = 'right'; ctx.fillStyle = '#fff';
      ctx.font = `${Math.max(11, Math.min(16, 220 / n))}px sans-serif`;
      const label = entries[i]!.length > 16 ? entries[i]!.slice(0, 15) + '…' : entries[i]!;
      ctx.fillText(label, r - 10, 5);
      ctx.restore();
    }
    // hub
    ctx.beginPath(); ctx.arc(cx, cy, 18, 0, Math.PI * 2); ctx.fillStyle = '#0f172a'; ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('SPIN', cx, cy + 4);
  }

  useEffect(() => { draw(rotation); }, [text, rotation]);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  function spin() {
    const n = entries.length;
    if (spinning || n < 2) return;
    setWinner(null); setSpinning(true);
    const target = Math.floor(Math.random() * n);
    const land = norm(rotationToLandOn(target, n, 0));            // 0..360 angle for the target
    const final = rotation - norm(rotation) + land + 6 * 360;     // >= ~6 turns forward, lands on target
    const start = rotation, dur = 4200, t0 = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    let done = false;
    const finalize = () => {
      if (done) return; done = true;
      cancelAnimationFrame(raf.current); clearTimeout(safety);
      setRotation(final);
      setWinner(entries[winnerIndexAt(final, n)] ?? entries[target]!);
      setSpinning(false);
    };
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      setRotation(start + (final - start) * ease(p));
      if (p < 1) raf.current = requestAnimationFrame(step);
      else finalize();
    };
    // Safety net: guarantee the spin resolves even if rAF is throttled (e.g. a
    // background tab), so a winner is always shown.
    const safety = setTimeout(finalize, dur + 400);
    raf.current = requestAnimationFrame(step);
  }

  function removeWinner() {
    if (!winner) return;
    const idx = entries.indexOf(winner);
    if (idx >= 0) { const next = [...entries]; next.splice(idx, 1); setText(next.join('\n')); }
    setWinner(null);
  }

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-6 md:grid-cols-[1fr_auto]">
        <div>
          <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Entries (one per line), {entries.length}</label>
          <textarea rows={10} class={inp} value={text} onInput={(e) => setText((e.target as HTMLTextAreaElement).value)} placeholder={'Alice\nBob\nCharlie'} aria-label="Entries (one per line)" />
          <label class="mt-2 flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={removeAfter} onChange={(e) => setRemoveAfter((e.target as HTMLInputElement).checked)} />
            Remove the winner after each spin (draw without replacement)
          </label>
        </div>

        <div class="flex flex-col items-center">
          <div class="relative">
            {/* fixed pointer at the top */}
            <div class="absolute left-1/2 top-[-6px] z-10 -translate-x-1/2" style="width:0;height:0;border-left:12px solid transparent;border-right:12px solid transparent;border-top:20px solid #0f172a" />
            <canvas ref={canvasRef} width={320} height={320} onClick={spin} class={`rounded-full ring-1 ring-slate-300 ${spinning || entries.length < 2 ? '' : 'cursor-pointer'}`} />
          </div>
          <button onClick={spin} disabled={spinning || entries.length < 2}
            class="mt-4 rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50">
            {spinning ? 'Spinning…' : entries.length < 2 ? 'Add 2+ entries' : '🎯 Spin the wheel'}
          </button>

          {winner && (
            <div class="mt-4 w-full rounded-xl bg-emerald-50 p-4 text-center ring-2 ring-emerald-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-emerald-700">Winner</p>
              <p class="mt-0.5 break-all text-2xl font-extrabold text-emerald-800">{winner}</p>
              {removeAfter && <button onClick={removeWinner} class="mt-2 rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700">Remove & continue</button>}
            </div>
          )}
        </div>
      </div>

      <p class="mt-4 text-xs text-slate-500">Paste any list, names, options, prizes, and spin for a fair random pick. The winner shown is exactly the segment under the pointer (the wheel targets a uniformly random entry, then spins to it). Turn on “remove the winner” for raffles and draws without repeats. Everything runs in your browser; your list is never uploaded. 🔒</p>
    </div>
  );
}
