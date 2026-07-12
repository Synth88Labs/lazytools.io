import { useMemo, useState } from 'preact/hooks';
import { timelapse } from '../../lib/photography';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
function clock(sec: number): string {
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = Math.round(sec % 60);
  return h > 0 ? `${h}h ${m}m ${s}s` : m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export default function TimeLapseTool() {
  const [shootMin, setShootMin] = useState('60'); // shooting duration in minutes
  const [interval, setInterval] = useState('5'); // seconds between shots
  const [fps, setFps] = useState('30');
  const [fileMB, setFileMB] = useState('25'); // per-photo size

  const r = useMemo(() => {
    const sh = num(shootMin), iv = num(interval), f = num(fps), fm = num(fileMB);
    if (sh == null || iv == null || f == null) return null;
    const t = timelapse(sh * 60, iv, f);
    return { ...t, storageMB: fm != null ? t.shots * fm : null };
  }, [shootMin, interval, fps, fileMB]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-4">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Shooting time (min)</span>
          <input type="number" step="any" value={shootMin} onInput={(e) => setShootMin((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Interval (sec/shot)</span>
          <input type="number" step="any" value={interval} onInput={(e) => setInterval((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Playback fps</span>
          <input type="number" step="any" value={fps} onInput={(e) => setFps((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Photo size (MB)</span>
          <input type="number" step="any" value={fileMB} onInput={(e) => setFileMB((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Final clip length</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{clock(r.clipSec)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Photos needed</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{r.shots.toLocaleString()}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Card space</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.storageMB != null ? (r.storageMB >= 1024 ? `${(r.storageMB / 1024).toFixed(1)} GB` : `${Math.round(r.storageMB)} MB`) : '—'}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the shooting time, interval and playback frame rate.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Photos = shooting time ÷ interval; clip length = photos ÷ playback fps. A shorter interval gives smoother, longer footage but needs more shots and card space. For a 24–30 fps clip you need a lot of frames — an hour at 5-second intervals makes only about 24 seconds of video. 🔒 In your browser.</p>
    </div>
  );
}
