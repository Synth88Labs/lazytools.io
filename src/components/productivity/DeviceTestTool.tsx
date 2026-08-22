import { useEffect, useRef, useState } from 'preact/hooks';
import { resolutionLabel } from '../../lib/resolution';

export default function DeviceTestTool() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const camStream = useRef<MediaStream | null>(null);
  const micStream = useRef<MediaStream | null>(null);
  const audioCtx = useRef<AudioContext | null>(null);
  const raf = useRef<number>(0);

  const [camOn, setCamOn] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [camError, setCamError] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const [resolution, setResolution] = useState<string | null>(null);
  const [level, setLevel] = useState(0); // 0..1 mic level

  const stopCam = () => {
    camStream.current?.getTracks().forEach((t) => t.stop());
    camStream.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCamOn(false); setResolution(null);
  };
  const stopMic = () => {
    cancelAnimationFrame(raf.current);
    micStream.current?.getTracks().forEach((t) => t.stop());
    micStream.current = null;
    audioCtx.current?.close().catch(() => {});
    audioCtx.current = null;
    setMicOn(false); setLevel(0);
  };
  useEffect(() => () => { stopCam(); stopMic(); }, []);

  async function startCam() {
    setCamError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      camStream.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play().catch(() => {}); }
      const track = stream.getVideoTracks()[0];
      const st = track?.getSettings?.() || {};
      setResolution(resolutionLabel(st.width || 0, st.height || 0));
      setCamOn(true);
    } catch (e) {
      setCamError(errMsg(e));
    }
  }

  async function startMic() {
    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      micStream.current = stream;
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtx.current = ctx;
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      src.connect(analyser);
      const buf = new Uint8Array(analyser.fftSize);
      const tick = () => {
        analyser.getByteTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) { const v = (buf[i]! - 128) / 128; sum += v * v; }
        setLevel(Math.min(1, Math.sqrt(sum / buf.length) * 2.2));
        raf.current = requestAnimationFrame(tick);
      };
      tick();
      setMicOn(true);
    } catch (e) {
      setMicError(errMsg(e));
    }
  }

  const errMsg = (e: unknown) => {
    const name = (e as DOMException)?.name;
    if (name === 'NotAllowedError' || name === 'SecurityError') return 'Permission denied. Allow camera/microphone access in your browser and try again.';
    if (name === 'NotFoundError' || name === 'OverconstrainedError') return 'No device found. Check that a camera/microphone is connected.';
    if (name === 'NotReadableError') return 'The device is in use by another app. Close it and retry.';
    return e instanceof Error ? e.message : 'Could not access the device.';
  };

  const btn = (active: boolean) => `rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition ${active ? 'bg-rose-600 hover:bg-rose-700' : 'bg-brand-600 hover:bg-brand-700'}`;
  const bars = Math.round(level * 20);

  return (
    <div class="grid gap-4 md:grid-cols-2">
      {/* Camera */}
      <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
        <div class="mb-3 flex items-center justify-between">
          <h3 class="text-sm font-bold text-slate-800">📷 Webcam test</h3>
          <button onClick={camOn ? stopCam : startCam} class={btn(camOn)}>{camOn ? 'Stop' : 'Start camera'}</button>
        </div>
        <div class="aspect-video w-full overflow-hidden rounded-xl bg-slate-900 ring-1 ring-slate-300">
          <video ref={videoRef} playsinline muted class="h-full w-full object-contain" />
        </div>
        {camError && <p class="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">⚠️ {camError}</p>}
        {resolution && <p class="mt-3 text-sm text-slate-600">Resolution: <span class="font-mono font-semibold text-slate-800">{resolution}</span></p>}
        {!camOn && !camError && <p class="mt-3 text-sm text-slate-500">Click Start camera to preview your webcam. The video is shown only here and is never recorded or uploaded.</p>}
      </div>

      {/* Microphone */}
      <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
        <div class="mb-3 flex items-center justify-between">
          <h3 class="text-sm font-bold text-slate-800">🎤 Microphone test</h3>
          <button onClick={micOn ? stopMic : startMic} class={btn(micOn)}>{micOn ? 'Stop' : 'Start mic'}</button>
        </div>
        <div class="flex h-[calc(100%-8rem)] min-h-[8rem] items-center justify-center rounded-xl bg-white ring-1 ring-slate-200">
          <div class="flex items-end gap-1" style="height:96px">
            {Array.from({ length: 20 }).map((_, i) => (
              <span class={`w-2.5 rounded-sm transition-[height] ${i < bars ? (i > 15 ? 'bg-rose-500' : i > 11 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-slate-200'}`}
                style={`height:${8 + i * 4}px`} />
            ))}
          </div>
        </div>
        {micError && <p class="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">⚠️ {micError}</p>}
        {micOn && <p class="mt-3 text-sm text-slate-600">Speak — the bars should react. Level: <span class="font-mono font-semibold text-slate-800">{Math.round(level * 100)}%</span></p>}
        {!micOn && !micError && <p class="mt-3 text-sm text-slate-500">Click Start mic and speak; the meter shows your input level. Audio is analysed live in your browser and never recorded or uploaded.</p>}
      </div>

      <p class="text-xs text-slate-500 md:col-span-2">Test that your camera and microphone work before a call or recording — see a live preview, your camera&#39;s resolution, and a real-time mic level meter. Everything runs in your browser using your device directly; nothing is ever recorded, saved, or uploaded, and access stops the moment you click Stop or leave the page. 🔒 100% on your device.</p>
    </div>
  );
}
