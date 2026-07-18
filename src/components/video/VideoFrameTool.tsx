import { useRef, useState } from 'preact/hooks';
import { fmtSize } from '../../lib/audio-compute';

/**
 * Grabs a still frame from a local video using a <video> element and a canvas.
 *
 * Deliberately avoids ffmpeg.wasm: that needs SharedArrayBuffer, which needs
 * COOP/COEP headers, which would block third-party scripts on these routes —
 * and costs a ~25 MB core download. Decoding is already in the browser, so for
 * a still frame none of that is necessary.
 */
const pad = (n: number, w = 2) => String(Math.floor(n)).padStart(w, '0');
const timecode = (t: number) => `${pad(t / 60)}:${pad(t % 60)}.${pad((t % 1) * 1000, 3)}`;

export default function VideoFrameTool() {
  const [file, setFile] = useState<File | null>(null);
  const [src, setSrc] = useState('');
  const [meta, setMeta] = useState<{ dur: number; w: number; h: number } | null>(null);
  const [time, setTime] = useState(0);
  const [format, setFormat] = useState<'image/png' | 'image/jpeg'>('image/png');
  const [quality, setQuality] = useState(92);
  const [error, setError] = useState('');
  const [done, setDone] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  function onFile(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    setError(''); setDone(''); setMeta(null); setTime(0);
    if (src) URL.revokeObjectURL(src);
    setFile(f);
    setSrc(URL.createObjectURL(f));
  }

  function onLoaded() {
    const v = videoRef.current;
    if (!v) return;
    if (!v.videoWidth) {
      setError('This file has no video track your browser can decode. Try MP4 (H.264), WebM or MOV.');
      return;
    }
    setMeta({ dur: v.duration, w: v.videoWidth, h: v.videoHeight });
  }

  function seek(t: number) {
    const v = videoRef.current;
    if (!v || !meta) return;
    const clamped = Math.min(Math.max(0, t), meta.dur);
    v.currentTime = clamped;
    setTime(clamped);
  }

  function step(delta: number) {
    seek(time + delta);
  }

  async function capture() {
    const v = videoRef.current;
    if (!v || !meta) return;
    setError(''); setDone('');
    // A seek started by the slider may still be in flight; drawing now would
    // grab the previous frame. Wait for it to land (with a timeout so a stalled
    // seek can't hang the button).
    if (v.seeking) {
      await new Promise<void>((resolve) => {
        const onSeeked = () => { v.removeEventListener('seeked', onSeeked); resolve(); };
        v.addEventListener('seeked', onSeeked);
        setTimeout(() => { v.removeEventListener('seeked', onSeeked); resolve(); }, 3000);
      });
    }
    try {
      const canvas = document.createElement('canvas');
      canvas.width = meta.w;
      canvas.height = meta.h;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(v, 0, 0, meta.w, meta.h);
      canvas.toBlob(
        (blob) => {
          if (!blob) return setError('Could not encode the frame — try PNG, or a different browser.');
          const ext = format === 'image/png' ? 'png' : 'jpg';
          const stamp = timecode(v.currentTime).replace(/[:.]/g, '-');
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${(file?.name ?? 'frame').replace(/\.[^.]+$/, '')}-${stamp}.${ext}`;
          a.click();
          URL.revokeObjectURL(url);
          setDone(`✓ Frame at ${timecode(v.currentTime)} — ${meta.w}×${meta.h}px, ${fmtSize(blob.size)}`);
        },
        format,
        format === 'image/png' ? undefined : quality / 100
      );
    } catch {
      setError('Frame capture failed. If the video came from another site, the browser blocks reading its pixels.');
    }
  }

  const inputCls = 'rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:border-brand-500 focus:outline-none';
  const btn = 'rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:border-brand-400';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 text-center transition hover:border-brand-400">
        <input type="file" accept="video/*" onChange={onFile} class="sr-only" />
        <span class="text-sm font-semibold text-brand-700">{file ? file.name : 'Choose a video'}</span>
        <span class="mt-1 block text-xs text-slate-500">
          {file ? `${fmtSize(file.size)}${meta ? ` · ${meta.w}×${meta.h} · ${timecode(meta.dur)}` : ''}` : 'MP4, WebM, MOV — decoded on your device, never uploaded'}
        </span>
      </label>

      {error && <p class="mt-3 text-sm font-medium text-red-700" aria-live="polite">✗ {error}</p>}

      {src && (
        <div class="mt-4">
          <video
            ref={videoRef}
            src={src}
            onLoadedMetadata={onLoaded}
            onSeeked={() => setTime(videoRef.current?.currentTime ?? 0)}
            controls
            preload="metadata"
            playsInline
            class="max-h-80 w-full rounded-xl border border-slate-200 bg-black"
          />

          {meta && (
            <>
              <div class="mt-3">
                <label for="vf-seek" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Position — {timecode(time)} of {timecode(meta.dur)}
                </label>
                <input
                  id="vf-seek" type="range" min={0} max={meta.dur} step={0.01} value={time}
                  onInput={(e) => seek(parseFloat((e.target as HTMLInputElement).value))}
                  class="w-full accent-brand-600"
                />
              </div>

              <div class="mt-3 flex flex-wrap items-end gap-2">
                <button type="button" onClick={() => step(-1)} class={btn}>−1s</button>
                <button type="button" onClick={() => step(-1 / 30)} class={btn}>−1 frame*</button>
                <button type="button" onClick={() => step(1 / 30)} class={btn}>+1 frame*</button>
                <button type="button" onClick={() => step(1)} class={btn}>+1s</button>

                <div class="ml-auto flex items-end gap-2">
                  <div>
                    <label for="vf-fmt" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Format</label>
                    <select id="vf-fmt" value={format} onChange={(e) => setFormat((e.target as HTMLSelectElement).value as typeof format)} class={inputCls}>
                      <option value="image/png">PNG — lossless</option>
                      <option value="image/jpeg">JPEG — smaller</option>
                    </select>
                  </div>
                  {format === 'image/jpeg' && (
                    <div>
                      <label for="vf-q" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Quality {quality}</label>
                      <input id="vf-q" type="range" min={50} max={100} value={quality} onInput={(e) => setQuality(parseInt((e.target as HTMLInputElement).value, 10))} class="w-32 accent-brand-600" />
                    </div>
                  )}
                </div>
              </div>

              <button type="button" onClick={capture} class="mt-4 rounded-xl bg-brand-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800">
                📸 Capture frame at {timecode(time)}
              </button>
              {done && <p class="mt-2 text-sm font-medium text-mint-700" aria-live="polite">{done}</p>}
              <p class="mt-2 text-xs text-slate-500">
                *Frame steps assume ~30 fps — browsers don't expose exact frame boundaries, so use the slider to fine-tune. The capture is taken at the video's full {meta.w}×{meta.h} resolution, not the preview size.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
